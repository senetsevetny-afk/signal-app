"""
MARKET AI — сервер доступа.

Закрывает то, что нельзя делать на клиенте: срок пробного доступа,
выдачу PRO за приглашения и защиту от накрутки.

Почему сервер обязателен: любое клиентское состояние стирается очисткой
хранилища браузера за пару секунд, а «приглашённый друг» без проверки —
это просто запись в памяти приглашающего.

Проверка подлинности: каждый запрос несёт initData из Telegram WebApp.
Подпись проверяется по HMAC с токеном бота. Подделать её, не зная токена,
нельзя — поэтому идентификатор пользователя здесь можно считать настоящим.

Запуск: тот же процесс, что и бот.
    pip install "python-telegram-bot[job-queue]==21.6" aiohttp
    python bot.py

Переменные окружения:
    TG_TOKEN     токен бота (обязательно)
    APP_URL      ссылка на мини-приложение
    PORT         порт HTTP-сервера, по умолчанию 8080
    DB_PATH      файл базы, по умолчанию market_ai.db
    TRIAL_HOURS  длительность пробного доступа, по умолчанию 32
    REF_DAYS     сколько дней PRO даёт приглашение, по умолчанию 7
    REF_NEEDED   сколько приглашённых нужно для награды, по умолчанию 1
"""

import os
import json
import time
import hmac
import hashlib
import sqlite3
import logging
from urllib.parse import parse_qsl

from aiohttp import web

log = logging.getLogger("acs-access")

TOKEN = os.environ.get("TG_TOKEN", "")
DB_PATH = os.environ.get("DB_PATH", "market_ai.db")
TRIAL_HOURS = int(os.environ.get("TRIAL_HOURS", "32"))
REF_DAYS = int(os.environ.get("REF_DAYS", "7"))
REF_NEEDED = int(os.environ.get("REF_NEEDED", "1"))
PORT = int(os.environ.get("PORT", "8080"))

# ─────────────────────────── хранилище ───────────────────────────

def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def db_init():
    with db() as con:
        con.executescript("""
        CREATE TABLE IF NOT EXISTS users(
            uid            INTEGER PRIMARY KEY,
            username       TEXT,
            first_seen     INTEGER NOT NULL,
            trial_started  INTEGER,
            trial_expires  INTEGER,
            pro_expires    INTEGER,
            invited_by     INTEGER,
            ref_credited   INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS referrals(
            inviter   INTEGER NOT NULL,
            invitee   INTEGER NOT NULL,
            ts        INTEGER NOT NULL,
            qualified  INTEGER DEFAULT 0,
            PRIMARY KEY (inviter, invitee)
        );
        CREATE TABLE IF NOT EXISTS progress(
            uid   INTEGER PRIMARY KEY,
            data  TEXT NOT NULL,
            ts    INTEGER NOT NULL
        );
        """)


# ─────────────────────── проверка подписи Telegram ───────────────────────

def check_init_data(init_data: str):
    """Возвращает данные пользователя, если подпись верна, иначе None.

    Алгоритм описан в документации Telegram: секрет — HMAC от строки
    'WebAppData' с ключом-токеном бота; им подписывается отсортированный
    список полей. Сравнение — постоянного времени.
    """
    if not init_data or not TOKEN:
        return None
    try:
        pairs = dict(parse_qsl(init_data, keep_blank_values=True))
        their_hash = pairs.pop("hash", "")
        if not their_hash:
            return None
        check = "\n".join(f"{k}={pairs[k]}" for k in sorted(pairs))
        secret = hmac.new(b"WebAppData", TOKEN.encode(), hashlib.sha256).digest()
        ours = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(ours, their_hash):
            return None
        # окно свежести: сутки, чтобы старый перехваченный initData не жил вечно
        auth_date = int(pairs.get("auth_date", "0"))
        if auth_date and time.time() - auth_date > 86400:
            return None
        return json.loads(pairs.get("user", "{}")) or None
    except Exception as e:
        log.warning("initData: %s", e)
        return None


# ─────────────────────────── логика доступа ───────────────────────────

def now() -> int:
    return int(time.time())


def ensure_user(uid: int, username: str, start_param: str = ""):
    """Создаёт пользователя при первом заходе и запускает пробный доступ."""
    with db() as con:
        row = con.execute("SELECT * FROM users WHERE uid=?", (uid,)).fetchone()
        if row:
            if username and row["username"] != username:
                con.execute("UPDATE users SET username=? WHERE uid=?", (username, uid))
            return

        inviter = None
        if start_param.startswith("ref"):
            try:
                cand = int(start_param[3:])
                # на себя приглашение не засчитывается
                if cand != uid and con.execute(
                        "SELECT 1 FROM users WHERE uid=?", (cand,)).fetchone():
                    inviter = cand
            except ValueError:
                inviter = None

        t0 = now()
        con.execute(
            "INSERT INTO users(uid,username,first_seen,trial_started,trial_expires,invited_by)"
            " VALUES(?,?,?,?,?,?)",
            (uid, username, t0, t0, t0 + TRIAL_HOURS * 3600, inviter))
        if inviter:
            con.execute(
                "INSERT OR IGNORE INTO referrals(inviter,invitee,ts) VALUES(?,?,?)",
                (inviter, uid, t0))


def qualify_referrals(uid: int):
    """Приглашение засчитывается, только когда приглашённый реально
    поработал: прожил в приложении хотя бы час с момента первого входа.
    Это отсекает создание пустых аккаунтов ради награды."""
    with db() as con:
        rows = con.execute(
            "SELECT r.invitee, u.first_seen FROM referrals r"
            " JOIN users u ON u.uid=r.invitee"
            " WHERE r.inviter=? AND r.qualified=0", (uid,)).fetchall()
        changed = 0
        for r in rows:
            if now() - r["first_seen"] >= 3600:
                con.execute("UPDATE referrals SET qualified=1"
                            " WHERE inviter=? AND invitee=?", (uid, r["invitee"]))
                changed += 1
        if not changed:
            return

        done = con.execute(
            "SELECT COUNT(*) c FROM referrals WHERE inviter=? AND qualified=1",
            (uid,)).fetchone()["c"]
        credited = con.execute(
            "SELECT ref_credited FROM users WHERE uid=?", (uid,)).fetchone()["ref_credited"]
        # награда за каждые REF_NEEDED приглашённых, но не дважды за одних и тех же
        deserved = done // REF_NEEDED
        if deserved > credited:
            add = (deserved - credited) * REF_DAYS * 86400
            row = con.execute("SELECT pro_expires FROM users WHERE uid=?", (uid,)).fetchone()
            base = max(row["pro_expires"] or 0, now())
            con.execute("UPDATE users SET pro_expires=?, ref_credited=? WHERE uid=?",
                        (base + add, deserved, uid))


def access_state(uid: int) -> dict:
    qualify_referrals(uid)
    with db() as con:
        u = con.execute("SELECT * FROM users WHERE uid=?", (uid,)).fetchone()
        if not u:
            return {"tier": "unknown"}
        invited = con.execute(
            "SELECT COUNT(*) c FROM referrals WHERE inviter=?", (uid,)).fetchone()["c"]
        ok = con.execute(
            "SELECT COUNT(*) c FROM referrals WHERE inviter=? AND qualified=1",
            (uid,)).fetchone()["c"]

    t = now()
    pro_left = max(0, (u["pro_expires"] or 0) - t)
    trial_left = max(0, (u["trial_expires"] or 0) - t)
    tier = "pro" if pro_left else ("trial" if trial_left else "free")
    return {
        "tier": tier,
        "trial_left": trial_left,
        "pro_left": pro_left,
        "trial_hours": TRIAL_HOURS,
        "invited": invited,
        "invited_qualified": ok,
        "ref_days": REF_DAYS,
        "ref_needed": REF_NEEDED,
        "server_time": t,
    }


# ─────────────────────────── HTTP ───────────────────────────

def cors(resp: web.Response) -> web.Response:
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return resp


async def auth(request):
    """Достаёт пользователя из подписанного initData. Без подписи — отказ."""
    data = await request.json() if request.can_read_body else {}
    init = data.get("initData") or request.query.get("initData", "")
    user = check_init_data(init)
    if not user or not user.get("id"):
        return None, data
    return user, data


async def h_state(request):
    user, data = await auth(request)
    if not user:
        return cors(web.json_response(
            {"error": "подпись Telegram не подтверждена"}, status=401))
    ensure_user(user["id"], user.get("username", ""), data.get("startParam", ""))
    st = access_state(user["id"])
    st["user"] = {"id": user["id"], "username": user.get("username", "")}
    return cors(web.json_response(st))


async def h_progress_get(request):
    user, _ = await auth(request)
    if not user:
        return cors(web.json_response({"error": "нет подписи"}, status=401))
    with db() as con:
        row = con.execute("SELECT data,ts FROM progress WHERE uid=?",
                          (user["id"],)).fetchone()
    return cors(web.json_response(
        {"data": json.loads(row["data"]) if row else None,
         "ts": row["ts"] if row else 0}))


async def h_progress_put(request):
    user, data = await auth(request)
    if not user:
        return cors(web.json_response({"error": "нет подписи"}, status=401))
    payload = data.get("progress")
    if not isinstance(payload, dict):
        return cors(web.json_response({"error": "ожидался объект"}, status=400))
    blob = json.dumps(payload, ensure_ascii=False)
    if len(blob) > 200_000:
        return cors(web.json_response({"error": "слишком большой объём"}, status=413))
    with db() as con:
        con.execute("INSERT INTO progress(uid,data,ts) VALUES(?,?,?)"
                    " ON CONFLICT(uid) DO UPDATE SET data=excluded.data, ts=excluded.ts",
                    (user["id"], blob, now()))
    return cors(web.json_response({"ok": True, "ts": now()}))


async def h_health(request):
    return cors(web.json_response({"ok": True, "time": now()}))


async def h_options(request):
    return cors(web.Response(text=""))


def make_app() -> web.Application:
    db_init()
    app = web.Application()
    app.router.add_post("/api/state", h_state)
    app.router.add_get("/api/state", h_state)
    app.router.add_get("/api/progress", h_progress_get)
    app.router.add_post("/api/progress", h_progress_put)
    app.router.add_get("/api/health", h_health)
    app.router.add_route("OPTIONS", "/api/{tail:.*}", h_options)
    return app


async def start_server():
    runner = web.AppRunner(make_app())
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    log.info("сервер доступа слушает порт %s", PORT)
    return runner
