# MARKET AI ACADEMY — DECISIONS

1. Preserve the existing Mini App and migrate incrementally.
2. One canonical MARKET AI character across all worlds and lessons.
3. Lesson content is data-driven and separate from rendering.
4. Universe/List/Search/Continue must ultimately use one canonical lesson registry.
5. `SKIP` / `NO TRADE` is a valid first-class training decision.
6. Decision quality is evaluated separately from simulated financial outcome.
7. Deterministic training data is labeled TRAINING SCENARIO / SIMULATED MARKET DATA, never LIVE.
8. Existing `acs_edu_v2` progress must not be reset during refactor.
9. Existing live chart remains until a MarketChartAdapter migration preserves behavior.
10. Production AI provider secrets must live server-side; browser localStorage API keys are not an acceptable production architecture.
11. Difficult visual requirements may use placeholders temporarily, but placeholders are never marked DONE.

## Checkpoint 06 decisions
- `SKIP` is a first-class selectable decision and may be the correct answer.
- Educational scenario charts use deterministic local OHLC fixtures only.
- Decision quality and financial outcome must remain separate concepts.
- Future candles stay hidden at decision time to avoid look-ahead.

## Checkpoint 17 decisions
- Chart event overlays are semantic (`candle`, `level`) and live outside Lesson Engine drawing rules.
- MARKET AI may focus a chart target only when that target is educationally allowed to be revealed.
- Replay `play`, `tick`, and `gate` never reveal breakout/retest/reaction answer markers before the learner decision.
- Final Rive/3D character work should consume the same semantic focus contract rather than hard-coded canvas coordinates.


## Checkpoint 18 decisions
- Character target coordinates are normalized renderer-neutral values, never hardcoded Lesson Engine DOM coordinates.
- Precise target pointing must not reveal a correct candle/level before the learner commits a decision.
- CSS robot remains a placeholder renderer; choreography contracts are the durable API.


## Checkpoint 19
- Character animation sequences are semantic timelines, not lesson-specific DOM animation scripts.
- Pre-decision choreography may focus the chart generally but must never expose the correct target.
- Review choreography may use precise chart targets only after the decision is submitted.

## Checkpoints 20–25 decisions
- Intro Tour is skippable and first-run persisted in localStorage.
- Zero Knowledge Journey teaches vocabulary/process only; it does not teach a guaranteed entry rule.
- Universe v1 is intentionally DOM/CSS, not WebGL. This preserves Telegram/mobile performance until profiling justifies a heavier renderer.
- Universe planets are generated from WORLDS; no parallel world registry.
- Progress/achievements are derived from EDUP + lessonState; no duplicate persistence model.
- Practice Lab discovers existing interactive lessons instead of cloning scenarios/content.

## Checkpoint 45 decisions
- “Roadmap complete” means the planned Academy architecture and representative vertical slices exist; it does not mean 300+ lessons/1000+ scenarios or final art have been authored.
- Heavy 3D/WebGL Universe remains deferred until Telegram mobile performance is measured.
- Adaptive recommendations use local educational attempts only and never infer profitability.
- Exam measures process quality and disciplined decisions, not simulated profit.
- Production release is blocked on real-device QA and removal of client-side AI-provider secrets.
