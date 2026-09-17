# MARKET AI ACADEMY — IMPLEMENTATION LOG

## 2026-09-17 — Recovery / Phase 0-1
- Inspected supplied GitHub ZIP.
- Confirmed repository contains only `index.html`.
- Confirmed Telegram Mini App integration and existing product screens.
- Confirmed Claude Phase 2 Academy data foundation already exists inside `index.html`.
- Confirmed deterministic scenarios, SKIP, mastery/progress and content validation exist at data level.
- Identified client-side AI secret handling as production security risk.
- Created Academy continuation/checkpoint documentation.
- Production source code changed: NO.

## 2026-09-17 — Checkpoint 02
- Extracted the existing Phase 2 Academy data/progress/validation block from `index.html` into `src/academy/academy-core.js` without changing its logic.
- Preserved initialization order by loading the Academy core after the legacy main script and then calling `initAcademy()`.
- Removed the old inline `initAcademy()` call to avoid calling the core before it is loaded.
- No Academy UI, Universe, CharacterDirector, or later-phase feature implementation was added.
- `node --check src/academy/academy-core.js` passes.

## 2026-09-17 — Checkpoint 03
- Added isolated `src/academy/academy-shell.css`.
- Added `src/academy/academy-shell.js` as the first real Academy UI over the existing Phase 2 registries.
- Existing Education entry is intercepted only after Academy core initialization; legacy Education remains reachable through “Старая теория”.
- Added Academy home, world cards, world lesson lists, lesson reading, completion, XP, prerequisites and Continue flow.
- No Universe/3D/CharacterDirector implementation was started.
- JavaScript syntax checks pass for Academy core and shell.

## Checkpoint 04 — 2026-09-17
- Added `src/academy/lesson-engine.js` as the first universal Lesson Engine boundary.
- Existing lesson `steps[]` are now rendered sequentially instead of dumping the whole legacy article at once.
- Added Next/Back navigation, step progress, lesson session state, final completion handoff, and a lightweight MARKET AI mentor presentation.
- Reused existing EDU/LESSONS data; no duplicate curriculum registry introduced.
- Academy Shell exposes a small renderer boundary for Lesson Engine and routes lesson opening through the engine.
- Added responsive/reduced-motion Lesson Engine CSS.
- Static JS syntax validation passes for Academy core, shell, and Lesson Engine.
- Headless browser smoke-test was attempted but the execution environment blocks local/file navigation; real Telegram/browser smoke test remains required.

## 2026-09-17 — Checkpoint 05
- Lesson Engine upgraded to v2 with generic data-driven `question` / `true_false` / `multiple_choice` rendering.
- Interactive steps require a submitted answer before navigation can continue.
- Deterministic correct/incorrect MARKET AI feedback added without coupling UI to a specific lesson.
- Added first real interactive checkpoint to `l_risk`, derived from the existing risk/loss-chasing lesson content.
- Correct answer is revealed after submission; wrong answers receive an explanatory correction rather than a bare failure state.
- Existing completion/mastery flow remains unchanged.
- JavaScript syntax checks pass for Academy core and Lesson Engine.

## Checkpoint 06 — chart decision interaction
- Added deterministic `select_direction` lesson step backed by `SCENARIOS`.
- Added responsive canvas candlestick renderer for training scenarios.
- Added UP / DOWN / SKIP decision UI; first scenario intentionally makes SKIP the correct answer.
- Scenario remains labeled TRAINING SCENARIO; future candles are not revealed.
- Stored `decisionQuality` separately from `financialOutcome` (currently null).
- No live market API and no profit/win-rate claims added.

## Checkpoint 07 — Character Scene Engine
- Added `src/academy/character-scene.js` as the single canonical MARKET AI renderer contract.
- Added semantic states: welcome, idle, explain, point, thinking, warning, correct, incorrect, celebrate, shield, globe, wait.
- Lesson Engine now asks the Character Scene Engine for mentor scenes instead of owning mascot behavior.
- Added lightweight animated placeholder body built from CSS; it is intentionally replaceable by Rive/3D without changing lesson content.
- Added responsive and reduced-motion behavior.

## 2026-09-17 — Checkpoint 08
- Added `src/academy/character-director.js` as a small event-driven scene coordinator.
- Lesson steps now emit `lesson:step`; submitted answers emit `decision:submitted`; completion emits `lesson:complete`.
- Direction scenarios enter a no-hint YOUR TURN scene before the user chooses UP/DOWN/SKIP.
- After a decision, MARKET AI moves into review state and the scenario chart receives a semantic focus/review cue.
- Added reduced-motion-safe CSS for chart focus and mentor repositioning.
- No Rive/3D assets or permanent character art were introduced.
- Static syntax validation passes for Character Director, Character Scene and Lesson Engine.

## Checkpoint 09 — Direct candle interaction
- Added `tap_candle` runtime support to Lesson Engine.
- Added deterministic target rule `largest_bullish_body` and first chart task in Basics.
- User taps the canvas directly; selected candle is highlighted after submission.
- MARKET AI Character Director now has candle-search and candle-review scenes.
- No future/live data is used; task uses deterministic `TRAINING SCENARIO` fixture.

## 2026-09-17 — Checkpoint 10
- Introduced semantic chart annotation adapter.
- Implemented deterministic support-zone drag task and overlap scoring.
- Integrated zone task with Lesson Engine and Character Director.
- Kept financial outcome independent from educational decision quality.

## Checkpoint 11 — Resistance / Levels / Market Structure
- Extended Chart Annotation Adapter with horizontal level scoring and structure targets.
- Added resistance-zone task and a horizontal level placement task.
- Added first direct market-structure tasks: identify HH on deterministic uptrend and LL on deterministic downtrend.
- Lesson Engine now supports `drag_level` and `mark_structure` as real interactive step types.
- Character Director now has no-hint and review scenes for level and structure decisions.
- Decision quality remains separate from financial outcome; all charts remain deterministic TRAINING SCENARIO data.
- `node --check` passes for academy-core, lesson-engine, chart-annotations, character-director.


## Checkpoint 12 — Ordered Market Structure
- Added `mark_structure_sequence` as a Lesson Engine step type.
- Added deterministic structure-specific training fixtures for bullish and bearish swing paths.
- Added ordered tap exercises HH → HL → HH and LH → LL.
- User path is drawn first; green reference path appears only after the attempt.
- Character Director now has structure-sequence teaching/review cues.
- Decision quality remains separate from financial outcome.
- `node --check` passes for Academy Core, Lesson Engine, Chart Annotations, and Character Director.


## 2026-09-17 — Checkpoint 13
Implemented deterministic role reversal, breakout-only, confirmed retest, and false-breakout decision training. Added post-answer semantic chart markers and entry-timing mentor copy. No live-data claims or guaranteed-entry language introduced.

## Checkpoint 14 — 2026-09-17
- Added staged `market_replay` interaction to the universal Lesson Engine.
- Replay uses deterministic `sc_retest_confirmed_1`; future candles are hidden by stage.
- Three decision gates: approach to resistance, post-breakout retest, confirmed reaction.
- ENTER / WAIT / SKIP decisions are scored per stage; `financialOutcome` remains null/separate.
- Added replay timeline, staged reveal controls, Character Director replay states/cues.
- No live-data claim and no look-ahead feedback before a decision.
- Syntax checks PASS: academy-core.js, lesson-engine.js, character-director.js.

## Checkpoint 15 — Replay Controller
Implemented timed candle-by-candle replay with play/pause/manual next, speed control, mandatory decision-gate stopping, and decision history. No future candle is revealed beyond the current gate before a decision.

## Checkpoint 16
- Extracted Market Replay transport/state/timers/decision gates from Lesson Engine into `src/academy/replay-controller.js`.
- Preserved Play/Pause/Next Candle, playback speed, no-look-ahead gates, decision history and process-quality scoring.
- Connected replay lifecycle events to Character Director: play, pause, tick, gate, decision, advance and complete.
- Added lightweight mentor motion during replay with reduced-motion fallback.
- Syntax validation passed for Replay Controller, Lesson Engine and Character Director.

## Checkpoint 17 — Chart Event / Annotation Layer
- Added `src/academy/chart-event-layer.js` as a reusable semantic overlay boundary.
- Character Director now synchronizes semantic lesson/replay events with the chart layer.
- Replay decision review can point to a specific candle or key level without drawing logic in Character Director.
- Breakout / retest / reaction / back-below markers are revealed only after the learner decision; replay gate/tick/play events intentionally reveal no answer marker.
- MARKET AI mentor pointer is rendered as a lightweight canvas cue and remains replaceable by the future character renderer.
- Removed duplicate replay-final hard-coded event markers while preserving legacy post-answer annotations for non-replay decision steps.
- Syntax validation PASS: chart-event-layer, character-director, replay-controller, lesson-engine, academy-core.


## Checkpoint 18 — Character Target Choreography
- [x] Added `src/academy/character-choreography.js`.
- [x] Converts Chart Event Layer focus into normalized renderer-neutral target data.
- [x] Added orientation / gesture / proximity contracts for MARKET AI.
- [x] Character Scene renders target-aware data attributes and placeholder pointing arm.
- [x] Precise candle/level pointing appears only during post-decision review, not before learner answers.
- [x] Added reduced-motion-safe choreography CSS.
- [x] Reordered Academy script loading so chart semantic state is available before Character Director choreography.


## Checkpoint 19 — Character Scene Timeline
- Added `src/academy/character-timeline.js`.
- Added semantic choreography beats: approach → orient → present → step away → return → inspect → explain/celebrate.
- Timeline patches only the canonical MARKET AI scene; Lesson Engine remains renderer-independent.
- Interactive prompt timeline never reveals reference candles/levels before the user's decision.
- Review timeline starts only after a submitted decision.
- Reduced-motion mode shortens choreography and CSS disables motion.

## Checkpoints 20–25 — 2026-09-17
- [x] CP20 Academy Intro Tour: skippable 4-beat MARKET AI onboarding, persisted locally, reduced-motion safe.
- [x] CP21 Zero Knowledge Journey: candle/context/WAIT-SKIP orientation before the main Academy.
- [x] CP22 Universe Foundation: lightweight central MARKET AI world map generated from the canonical WORLDS registry; no duplicated curriculum.
- [x] CP23 Universe Interaction: pointer drag + bounded wheel zoom foundation, mobile touch-safe viewport, planet → existing world navigation.
- [x] CP24 Progress & Achievements: derived XP/lesson/world progress and starter badges from existing EDUP/lessonState; no second progress database.
- [x] CP25 Scenario Practice Hub: practice entry built from lessons that already contain interactive step types; all copy labels data as simulated/training.
- Added modules: academy-tour.js, zero-knowledge-journey.js, universe-engine.js, academy-progress.js, scenario-hub.js.
- Academy home now mounts Universe, progress panel, Practice Lab and optional first-run tour.
- Syntax validation passed for all five new modules plus Academy Shell and Lesson Engine.
- Browser/Telegram visual smoke test remains pending.

## Checkpoints 26–45 — 2026-09-17
- CP26: Universe progression locks and CURRENT PATH derived from real prerequisites/mastery.
- CP27: derived progress celebration events; no second XP database.
- CP28: Scenario Engine facade over existing interactive Lesson Engine steps.
- CP29: Replay Library over existing market_replay steps.
- CP30: curriculum scale catalog documents active/planned worlds without pretending missing lessons are complete.
- CP31–33: local attempt journal and adaptive practice recommendations based on educational mistakes/process quality.
- CP34–36: final assessment entry built from deterministic scenario pool; explicitly not P&L scoring.
- CP37–39: reduced-motion and text-size preferences, local only.
- CP40–43: local diagnostics and integrity/readiness surface.
- CP44–45: release manifest and architecture-complete vertical-slice boundary.
- Lesson Engine now records submitted interactive attempts into Adaptive Coach and emits progress celebration after lesson completion.
- No backend/database or live market dependency was invented.
- Full curriculum scale, final character art, Telegram device QA and server-side AI secret migration remain production gates.

## 2026-09-17 — Сведение веток + Phase 5 (Markets)

Выполнено:
- Проверен архив: 26 модулей, синтаксис чист, приложение загружается без ошибок
- Найден дефект вёрстки тура (float:right у кнопки «Пропустить») — исправлен
- Перенесён экран «Рынки»: src/markets.js, третья панель во вкладке Пульс,
  оверлей карточки инструмента mktWrap

Проверки:
- Рынки: 5 строк, поиск работает, карточка открывается с графиком
- Тур: сцена 324px, переполнения нет
- Академия: 8 миров на месте
- Движок: buildSignal PASS
- Ошибок выполнения: 0

Заметки:
- Цена и суточное изменение показываются только там, где источник их отдаёт.
  Для валют и OTC стоит прочерк, выдуманных значений нет.

## 2026-09-17 (2) — Phase 11: уровни, звания, достижения

Реализовано:
- src/academy/levels.js: 8 уровней с порогами и званиями, 10 достижений
- Уровень считается из XP в EDUP, второй базы не заведено
- Достижения проверяются по фактическим данным: уроки, миры, журнал,
  пропуски WAIT, отмеченные решения, завершённые сессии, экзамен
- award(kind) начисляет опыт только за учебные события;
  торговый результат опыта не даёт
- Блок встроен в профиль (раздел «Обучение») и в экран академии

Проверки:
- Старт: уровень 1 «Новичок», 0 XP, 0 из 10 наград
- После 9 уроков: уровень 3 «Наблюдатель», 180 XP
- По данным журнала разблокировались: Первый расчёт, Журнал ведётся, Честный разбор
- Профиль: 10 наград отрисованы; академия: панель на месте
- XP сохраняется в acs_edu_v2
- Рынки, тур, академия, движок — регрессия чистая, ошибок 0

Заметки:
- В интерфейсе прямо написано, что уровень отражает объём обучения
  и не означает прибыльность.

## 2026-09-17 (3) — Phase 16: сквозная проверка собранной версии

Найдено и исправлено:
1. Четыре молчаливых catch в lesson-engine.js и character-director.js —
   ошибки терялись без следа. Переведены на logErr.
2. Журнал диагностики был недоступен модулям из src/ (разные области видимости).
   Экспортированы window.DIAG и window.logErr.
3. После подключения журнала всплыли 24 расхождения схем: валидатор из Phase 2
   не знал словаря, который используют модули академии.
   - Состояния персонажа: добавлены welcome, explain, point, thinking,
     warning, correct, incorrect, celebrate
   - Ответы сценариев: добавлены wait, enter, true, false и null
     (у структурных сценариев единственного верного ответа нет — оценивается
     качество рассуждения, а не угадывание стороны)
   - Число свечей: проверяется только если поле задано; добавлена проверка
     на пустой ряд
   После сведения словарей журнал диагностики пуст.

Проверки:
- 21 сквозной сценарий: PASS, ошибок 0
- Рынки, карточка инструмента, тур, академия, движок: PASS
- Уровни: профиль 10 наград, академия PASS
- Ширины 320/375/390/430: PASS
- Пустых catch в модулях: 0

## 2026-09-17 (4) — Phases 12-14: сервер доступа, триал, рефералы

Реализовано (server/access.py):
- Проверка подписи Telegram initData по HMAC с токеном бота,
  сравнение постоянного времени, окно свежести сутки
- SQLite: users, referrals, progress
- Пробный доступ 32 часа, стартует при первом входе
- Рефералы: приглашение засчитывается только если приглашённый
  пользуется приложением не меньше часа с первого входа
- Награда 7 дней PRO за каждого засчитанного, повторно не начисляется
- Отклоняются: самоприглашение, ссылки на несуществующих пользователей
- Эндпоинты: /api/state, /api/progress (GET/POST), /api/health

Реализовано (bot.py):
- Сервер поднимается в том же процессе через post_init
- Команда /ref — личная ссылка-приглашение

Реализовано (src/access-client.js):
- Состояние доступа приходит с сервера, клиент ничего не решает
- Три состояния: сервер не настроен / доступ активен / сервер недоступен
- Блок «Доступ» в профиле, синхронизация прогресса обучения

Проверки логики (с подменённым HTTP-слоем):
- верная подпись принята, подделка отклонена, пустая отклонена,
  просроченная отклонена
- триал: 32 часа, после истечения уровень free
- реферал: сразу не засчитан, через час засчитан, PRO 7 дней,
  повторно не начисляется
- самоприглашение и несуществующий пригласивший отклонены

Проверки клиента:
- без сервера: «Без ограничений · сервер доступа не настроен»
- с сервером: «Пробный доступ · осталось 31 ч 58 мин · приглашено 2, засчитано 1»
- сервер недоступен: «Сервер недоступен» с кнопкой повтора
- 21 сквозной сценарий: PASS, ошибок 0

Заметки:
- Без сервера приложение не рисует фальшивый таймер: клиентское состояние
  стирается очисткой хранилища, и показывать его было бы обманом.

## 2026-09-17 (5) — проверка пограничных случаев

Найдено и исправлено:
1. Одна повреждённая запись в журнале роняла и журнал, и аналитику
   (обращение к h.a.dir у записи без поля a). Добавлена sanitizeHistory:
   при загрузке отбраковываются записи без обязательных полей,
   число отброшенных пишется в диагностику.
2. analyze() на пустом или коротком ряде падал с невнятным сообщением
   про undefined. Теперь отклоняет явно: «мало свечей для расчёта:
   получено N, нужно от 30».

Проверено устойчивым к:
- битому JSON в хранилище (возвращается пустой массив)
- пустому журналу (деления на ноль нет, показывается прочерк)
- выплате 0 (безубыточность 100%, не бесконечность)
- двойному запуску анализа (один результат)
- двадцати быстрым переключениям вкладок
- очистке localStorage на лету

Диагностика после прогона: одна запись — недоступность биржевого потока
в тестовой среде без сети. Это ожидаемо и обработано.
