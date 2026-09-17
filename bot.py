"""
AI Comfort Signal — бот-сервер.

Отправляет утреннюю сводку в чат и даёт кнопку открытия мини-приложения.
Всё, что пишет бот, посчитано по реальным данным: волатильность, тренды,
открытые сессии, настроение рынка. Ничего не выдумывается.

Установка:
    pip install python-telegram-bot==21.6 aiohttp

Переменные окружения:
    TG_TOKEN   — токен от @BotFather
    APP_URL    — ссылка на мини-приложение (https://...)
    TD_KEY     — ключ twelvedata.com (нужен для валютных пар, необязательно)
    BRIEF_HOUR — час утренней сводки по Киеву, по умолчанию 8

Запуск:
    python bot.py
"""

import os
import logging
from datetime import time, timezone, timedelta

import json
from pathlib import Path

import aiohttp
from telegram import (Update, InlineKeyboardButton, InlineKeyboardMarkup,
                      WebAppInfo, InputMediaPhoto)
from telegram.constants import ParseMode
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(format="%(asctime)s %(levelname)s %(message)s", level=logging.INFO)
log = logging.getLogger("acs-bot")

TOKEN = os.environ.get("TG_TOKEN", "")
APP_URL = os.environ.get("APP_URL", "")
TD_KEY = os.environ.get("TD_KEY", "")
BRIEF_HOUR = int(os.environ.get("BRIEF_HOUR", "8"))
KYIV = timezone(timedelta(hours=3))
CARD_FILE = Path(os.environ.get("CARD_FILE", "cards/about.png"))
STATE = Path(os.environ.get("STATE_FILE", "subs.json"))

CAPTION = (
    "<b>AI Comfort Signal</b>\n"
    "Терминал технического анализа на данных биржи.\n\n"
    "Приложение считает одиннадцать индикаторов по реальным свечам, "
    "показывает вес каждого фактора и проверяет результат сигнала "
    "после экспирации по фактической цене.\n\n"
    f"Бот пишет один раз в день: утренняя сводка по рынку в {BRIEF_HOUR}:00, "
    "только по будням.\n\n"
    "/brief — сводка сейчас   /app — терминал   /stop — отписаться"
)

BINANCE = "https://api.binance.com/api/v3"
MAJORS = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "USDCAD", "NZDUSD"]
CRYPTO = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"]


# ─────────────────────────── данные ───────────────────────────

async def get_json(session, url):
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=20)) as r:
        return await r.json()


async def crypto_snapshot(session):
    """24-часовая картина по крипте: изменение и размах."""
    import json as _json
    url = f"{BINANCE}/ticker/24hr?symbols={_json.dumps(CRYPTO, separators=(',', ':'))}"
    data = await get_json(session, url)
    out = []
    for t in data:
        last, high, low = float(t["lastPrice"]), float(t["highPrice"]), float(t["lowPrice"])
        out.append({
            "sym": t["symbol"].replace("USDT", ""),
            "chg": float(t["priceChangePercent"]),
            "range": (high - low) / last * 100 if last else 0,
            "price": last,
        })
    return out


async def fx_snapshot(session):
    """Волатильность валютных пар за сутки. Без ключа возвращает пусто."""
    if not TD_KEY:
        return []
    out = []
    for p in MAJORS[:5]:
        sym = f"{p[:3]}/{p[3:]}"
        url = (f"https://api.twelvedata.com/time_series?symbol={sym}"
               f"&interval=1h&outputsize=24&apikey={TD_KEY}")
        try:
            j = await get_json(session, url)
            vals = j.get("values") or []
            if len(vals) < 10:
                continue
            closes = [float(v["close"]) for v in vals][::-1]
            highs = [float(v["high"]) for v in vals]
            lows = [float(v["low"]) for v in vals]
            chg = (closes[-1] - closes[0]) / closes[0] * 100
            rng = (max(highs) - min(lows)) / closes[-1] * 100
            out.append({"sym": sym, "chg": chg, "range": rng, "price": closes[-1]})
        except Exception as e:
            log.warning("fx %s: %s", sym, e)
    return out


async def fear_greed(session):
    try:
        j = await get_json(session, "https://api.alternative.me/fng/?limit=1")
        d = j["data"][0]
        names = {"Extreme Fear": "крайний страх", "Fear": "страх", "Neutral": "нейтрально",
                 "Greed": "жадность", "Extreme Greed": "крайняя жадность"}
        return int(d["value"]), names.get(d["value_classification"], d["value_classification"])
    except Exception:
        return None, None


def sessions_now(hour_utc):
    s = []
    if 0 <= hour_utc < 9:
        s.append("азиатская")
    if 7 <= hour_utc < 16:
        s.append("европейская")
    if 12 <= hour_utc < 21:
        s.append("американская")
    return s


# ─────────────────────────── сводка ───────────────────────────

async def build_brief():
    from datetime import datetime
    now = datetime.now(KYIV)
    async with aiohttp.ClientSession() as session:
        crypto = await crypto_snapshot(session)
        fx = await fx_snapshot(session)
        fng, fng_name = await fear_greed(session)

    lines = [f"<b>Утренняя сводка · {now.strftime('%d.%m.%Y')}</b>", ""]

    open_s = sessions_now(now.astimezone(timezone.utc).hour)
    lines.append(f"<b>Сессии сейчас:</b> {', '.join(open_s) if open_s else 'все закрыты'}")
    if not open_s:
        lines.append("<i>Ликвидность низкая — движения рваные, вход рискованнее обычного.</i>")
    lines.append("")

    if fng is not None:
        lines.append(f"<b>Настроение рынка:</b> {fng}/100 — {fng_name}")
        lines.append("")

    if crypto:
        crypto.sort(key=lambda x: abs(x["chg"]), reverse=True)
        up = sum(1 for c in crypto if c["chg"] > 0)
        lines.append(f"<b>Крипта за сутки</b> — растут {up} из {len(crypto)}:")
        for c in crypto[:5]:
            sign = "+" if c["chg"] >= 0 else ""
            lines.append(f"· {c['sym']}: {sign}{c['chg']:.2f}%, размах {c['range']:.2f}%")
        lines.append("")

    if fx:
        fx.sort(key=lambda x: x["range"], reverse=True)
        lines.append("<b>Валютные пары за сутки:</b>")
        for f in fx:
            sign = "+" if f["chg"] >= 0 else ""
            lines.append(f"· {f['sym']}: {sign}{f['chg']:.2f}%, размах {f['range']:.2f}%")
        lines.append("")
        quiet = [f["sym"] for f in fx if f["range"] < 0.25]
        if quiet:
            lines.append(f"<i>Тихо: {', '.join(quiet)}. Малый размах — индикаторы дают "
                         f"больше ложных сигналов.</i>")
            lines.append("")
    elif not TD_KEY:
        lines.append("<i>Валютные пары не показаны: не задан ключ TD_KEY.</i>")
        lines.append("")

    lines.append("<b>Что это значит</b>")
    lines.append("Сводка описывает фон, а не предсказывает направление. "
                 "Точки входа считает мини-приложение по индикаторам, "
                 "и каждый сигнал там проверяется по факту после экспирации.")
    return "\n".join(lines)


def load_subs():
    try:
        return set(json.loads(STATE.read_text()))
    except Exception:
        return set()


def save_subs(chats):
    try:
        STATE.write_text(json.dumps(sorted(chats)))
    except Exception as e:
        log.warning("не сохранить подписки: %s", e)


async def send_about(bot, chat_id, kb):
    """Одно сообщение: изображение с описанием и кнопка терминала."""
    if CARD_FILE.exists():
        with CARD_FILE.open("rb") as fh:
            await bot.send_photo(chat_id, fh, caption=CAPTION,
                                 parse_mode=ParseMode.HTML, reply_markup=kb)
    else:
        log.warning("не найдено изображение %s", CARD_FILE)
        await bot.send_message(chat_id, CAPTION, parse_mode=ParseMode.HTML,
                               reply_markup=kb)


def app_kb():
    if APP_URL:
        return InlineKeyboardMarkup([[InlineKeyboardButton(
            "Открыть терминал", web_app=WebAppInfo(url=APP_URL))]])
    return None


# ─────────────────────────── команды ───────────────────────────

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    cid = update.effective_chat.id
    chats = ctx.bot_data.setdefault("chats", load_subs())
    chats.add(cid)
    save_subs(chats)
    await send_about(ctx.bot, cid, app_kb())


async def cmd_ref(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Личная ссылка-приглашение. Награду начисляет сервер после того,
    как приглашённый действительно поработает в приложении."""
    me = await ctx.bot.get_me()
    uid = update.effective_user.id
    link = f"https://t.me/{me.username}?start=ref{uid}"
    await update.message.reply_text(
        "<b>Ваша ссылка-приглашение</b>\n\n"
        f"<code>{link}</code>\n\n"
        "Когда приглашённый начнёт пользоваться приложением, вам начислится "
        "PRO-доступ. Проверку выполняет сервер, поэтому накрутить её нельзя.",
        parse_mode=ParseMode.HTML)


async def cmd_app(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Терминал:", reply_markup=app_kb())


async def cmd_brief(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    m = await update.message.reply_text("Считаю…")
    try:
        await m.edit_text(await build_brief(), parse_mode=ParseMode.HTML,
                          reply_markup=app_kb())
    except Exception as e:
        log.exception("brief")
        await m.edit_text(f"Не удалось собрать сводку: {e}")


async def cmd_stop(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chats = ctx.bot_data.setdefault("chats", load_subs())
    chats.discard(update.effective_chat.id)
    save_subs(chats)
    await update.message.reply_text("Утренние сводки отключены. Включить снова: /start")


async def morning_job(ctx: ContextTypes.DEFAULT_TYPE):
    """Одна сводка в сутки, по будням. В выходные валютный рынок закрыт."""
    from datetime import datetime
    now = datetime.now(KYIV)
    if now.weekday() >= 5:
        log.info("выходной — сводка пропущена")
        return
    last = ctx.bot_data.get("last_brief")
    if last == now.date():
        log.info("сводка сегодня уже уходила")
        return
    ctx.bot_data["last_brief"] = now.date()

    chats = ctx.bot_data.get("chats") or load_subs()
    if not chats:
        return
    try:
        text = await build_brief()
    except Exception as e:
        log.exception("morning")
        return
    for cid in list(chats):
        try:
            await ctx.bot.send_message(cid, text, parse_mode=ParseMode.HTML,
                                       reply_markup=app_kb())
        except Exception as e:
            msg = str(e).lower()
            if "blocked" in msg or "chat not found" in msg:
                chats.discard(cid)
                save_subs(chats)
            log.warning("send %s: %s", cid, e)


async def _on_startup(app):
    """Поднимаем сервер доступа в том же процессе, что и бот."""
    try:
        from server.access import start_server
        app.bot_data["access_runner"] = await start_server()
        log.info("сервер доступа запущен")
    except Exception as e:
        log.warning("сервер доступа не запущен: %s", e)


def main():
    if not TOKEN:
        raise SystemExit("Задайте TG_TOKEN")
    if not APP_URL:
        log.warning("APP_URL не задан — кнопка мини-приложения не появится")
    app = Application.builder().token(TOKEN).post_init(_on_startup).build()
    app.bot_data["chats"] = load_subs()
    log.info("подписчиков: %d", len(app.bot_data["chats"]))
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("app", cmd_app))
    app.add_handler(CommandHandler("ref", cmd_ref))
    app.add_handler(CommandHandler("brief", cmd_brief))
    app.add_handler(CommandHandler("stop", cmd_stop))
    app.job_queue.run_daily(morning_job, time(hour=BRIEF_HOUR, tzinfo=KYIV))
    log.info("бот запущен, сводка в %02d:00 по Киеву", BRIEF_HOUR)
    app.run_polling()


if __name__ == "__main__":
    main()
