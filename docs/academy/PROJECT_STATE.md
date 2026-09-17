# MARKET AI ACADEMY — PROJECT STATE

## LAST UPDATED
2026-09-17

## CURRENT CHECKPOINT
Checkpoint 46 — ветки сведены, экран рынков перенесён, дефект тура исправлен.

Сведение веток:
- База — сборка из архива (26 модулей src/academy, index.html с подключением).
- Перенесено из параллельной ветки: экран «Рынки» (src/markets.js) —
  список инструментов и карточка инструмента с графиком и связью с журналом.
- Исправлено: вёрстка приветственного тура. Кнопка «Пропустить» стояла на
  float:right и отжимала карточку персонажа с 326 до 237 пикселей, текст
  сжимался в узкую колонку, бейдж уходил за край на 18 пикселей.
  Переведена на absolute, сцена на узких экранах ужата до 72px колонки.
  После правки сцена 324 пикселя, переполнения нет.

## COMPLETED PHASES
[x] 0–1 Audit, integration and recovery baseline
[x] 2 Core registries, deterministic scenarios and progress
[x] 3 Academy Shell / design foundation
[x] 4 Localization-compatible content boundary (legacy content preserved)
[x] 5 Lesson Engine
[x] 6–13 Interactive chart decisions, annotations, structure, breakout/retest
[x] 14–19 Market Replay + Character Director / choreography / timeline
[x] 20 Academy Intro Tour
[x] 21 Zero Knowledge Journey
[x] 22–23 Universe foundation + interaction
[x] 24 Progress / achievements
[x] 25 Practice Hub
[x] 26 Universe progression locks / current path
[x] 27 XP/mastery celebration events
[x] 28 Scenario Engine facade
[x] 29 Replay Library
[x] 30 Curriculum catalog / scale boundary
[x] 31–33 Local mistake journal + adaptive practice
[x] 34–36 Final assessment shell / process-quality framing
[x] 37–39 Accessibility / reduced motion / local preferences
[x] 40–43 Diagnostics / integrity / security-readiness checks
[x] 44–45 Release manifest / production-readiness boundary

## CURRENT PHASE
Architecture-complete vertical slice. The next work is content scale, real-device QA, backend security, final art and production deployment — not another architecture rewrite.

## COMPLETED IN CURRENT PHASE
[x] Universe planets can be locked from real lesson prerequisites and mark CURRENT PATH.
[x] Progress events can surface XP/lesson/badge changes.
[x] Scenario Engine enumerates existing interactive steps without duplicating lesson data.
[x] Replay Library enumerates existing market_replay steps.
[x] Adaptive Coach records local educational attempts and recommends weak interaction types.
[x] Exam entry uses existing scenario pool and explicitly scores learning process, not P&L.
[x] Academy accessibility settings support reduced motion and larger text.
[x] Diagnostics exposes registry/storage/Telegram-context readiness.
[x] Release manifest reports checkpoint 45 and active subsystems.

## REMAINING BEFORE PUBLIC PRODUCTION
[!] Real Telegram iOS/Android visual and interaction QA.
[!] Secure server/serverless boundary for any AI provider secret. Do not ship provider secrets in browser code/localStorage.
[ ] Replace placeholder MARKET AI character art with canonical Rive/2.5D/3D asset when available.
[ ] Expand curriculum toward the product target (300+ lessons / 1000+ training scenarios). The catalog defines the scale target; it does NOT claim that content exists today.
[ ] Add/verify all localization strings for newly expanded curriculum content.
[ ] Performance profiling on low/mid-range mobile devices before considering WebGL/3D Universe.
[ ] Production analytics/privacy/legal review appropriate to deployment jurisdiction and product claims.

## NEXT EXACT ACTION
Deploy this checkpoint to a staging Telegram Mini App and run the real-device QA matrix. Fix only observed regressions first. Then secure AI calls server-side before public production.

## FILES CREATED IN 26–45
- src/academy/universe-progression.js
- src/academy/progress-events.js
- src/academy/scenario-engine.js
- src/academy/replay-library.js
- src/academy/curriculum-catalog.js
- src/academy/adaptive-coach.js
- src/academy/exam-engine.js
- src/academy/academy-settings.js
- src/academy/academy-diagnostics.js
- src/academy/production-readiness.js

## FILES MODIFIED IN 26–45
- index.html
- src/academy/academy-shell.js
- src/academy/academy-shell.css
- src/academy/lesson-engine.js
- src/academy/universe-engine.js
- docs/academy/*

## LOCKED ARCHITECTURE DECISIONS
- One canonical MARKET AI character identity and renderer-neutral character contracts.
- Academy remains data-driven; no handcrafted page per lesson.
- Training data is deterministic/simulated and must never be presented as LIVE.
- Future candles remain hidden until the learner decision in replay/scenario flows.
- SKIP / NO TRADE / WAIT are valid first-class educational decisions.
- Decision quality is separate from simulated financial outcome.
- No guaranteed win-rate or automatic indicator buy/sell claims.
- Martingale is risk education only, never a recovery recommendation.
- Existing Mini App and legacy education must remain available during migration.

## SYSTEMS THAT MUST NOT BREAK
Telegram WebApp startup; signals/home navigation; chart UI; history/profile/settings; legacy education; localStorage progress; Lesson Engine; Replay Controller; Character Director; Universe; Practice Hub.

## DATABASE CHANGES
None. New adaptive/exam/settings state is localStorage-only. No backend/database was invented.

## CURRENT ROUTES
DOM/tab based. Academy screens render into the existing education overlay. No router framework introduced.

## TEST STATUS
JavaScript syntax: PASS for Academy modules at checkpoint packaging time.
Static script-reference check: PASS at checkpoint packaging time.
Real Telegram browser/device smoke test: PENDING.
Automated browser E2E: not available in this repository.

## KNOWN ISSUES / PLACEHOLDERS
[P] Final MARKET AI art/rig.
[P] Heavy 3D Universe renderer; intentionally deferred until performance measurement.
[P] Full 300+ lesson / 1000+ scenario content scale.
[!] Client-side AI-provider secret handling in the legacy app remains a production security concern until moved server-side.

## DO NOT REDO
Do not rebuild Lesson Engine, Replay, Character Director, progress database or Universe data model from scratch. Extend the existing registries/modules.

## NEXT 5 TASKS
1. [ ] Staging deploy + Telegram iOS/Android QA.
2. [ ] Move AI provider calls/secrets behind a server/serverless boundary.
3. [ ] Fix QA findings and profile mobile performance.
4. [ ] Integrate final canonical MARKET AI visual asset.
5. [ ] Expand curriculum/scenario content using the existing data model.

## CONTINUATION COMMAND
Start from Checkpoint 45. Treat architecture as locked unless a real QA failure requires a change. Do not claim production readiness until Telegram device QA and secret migration are complete.
