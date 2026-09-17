# MARKET AI ACADEMY — ARCHITECTURE MAP

## Current real architecture
- [REAL] `index.html` is the entire supplied application (~512 KB / ~8.1k lines).
- [REAL] Telegram Mini App initialization via `window.Telegram.WebApp`.
- [REAL] DOM/tab navigation: Home, Signals, Detail, Chart, Analytics, Market, History, Profile.
- [REAL] Existing education is `EDU` + `openEdu()` + `openEduArticle()`.
- [REAL] Academy Phase 2 data block: `STEP_TYPES`, `CHAR_STATES`, `MASTERY`, `WORLDS`, `MODULES`, `LESSONS`, `SCENARIOS`, progress and validation.
- [REAL] Academy progress key: `acs_edu_v2` in localStorage.
- [REAL] Embedded live chart is stored in `<script type="text/html" id="pg-chart">` and rendered via srcdoc.
- [REAL] Browser fetch/WebSocket market data integrations.
- [REAL] Browser-side AI provider calls and localStorage API key fields.

## Planned target layers
- [PLANNED] `src/academy/data` — canonical registries/content.
- [PLANNED] `src/academy/engine` — Lesson/Scenario/Progress/Mastery logic.
- [PLANNED] `src/academy/ui` — AcademyShell and reusable visual components.
- [PLANNED] `src/academy/character` — canonical MARKET AI abstraction/director.
- [PLANNED] `src/academy/chart` — MarketChartAdapter.
- [PLANNED] `src/academy/universe` — Universe hierarchy/renderer.
- [PLANNED] `src/academy/i18n` — locale dictionaries and terminology.
- [PLANNED] secure backend/serverless API boundary for AI provider calls.

## Migration principle
Strangler migration: keep the current Mini App working and move one subsystem at a time. Do not perform a full rewrite before parity exists.

## Checkpoint 17 — Chart Event Layer
`CharacterDirector event` -> `MarketChartEventLayer.sync()` -> semantic event/focus state -> `LessonEngine canvas render` -> `MarketChartEventLayer.draw()`.
The layer owns chart-event visualization; Character Director owns teaching intent; Lesson Engine remains the host renderer. Pre-answer replay events do not create breakout/retest/reaction markers.


## Checkpoint 18 — Character Target Choreography
`ChartEventLayer semantic focus → CharacterChoreography.resolve() → CharacterDirector scene → CharacterScene renderer`.
The choreography contract uses normalized targets (`kind`, `x`, `y`, optional candle index/price), plus `orientation`, `gesture`, and `proximity`. This keeps Lesson Engine independent from DOM/CSS and allows a future Rive/2.5D/3D renderer to consume the same scene contract.


### Character Scene Timeline (Checkpoint 19)
`character-timeline.js` subscribes to Character Director events and schedules semantic scene beats. It updates only the canonical Character Scene renderer, keeping lesson data and future Rive/3D renderers decoupled.

## Checkpoints 20–25 additions
- `academy-tour.js` → first-run guided Academy entrance.
- `zero-knowledge-journey.js` → beginner orientation layer.
- `universe-engine.js` → renderer-neutral-ish DOM Universe v1; reads WORLDS/LESSONS and routes into Academy Shell.
- `academy-progress.js` → derived progress/achievement presentation over EDUP.
- `scenario-hub.js` → practice discovery over Lesson Engine interactive step types.

Flow: Academy entry → optional Intro Tour → optional Zero Knowledge Journey → Academy Home → Universe/World or Practice Lab → existing Lesson Engine → Character Director / Replay / Chart Event layers.

## Checkpoint 45 additions
UniverseEngine -> UniverseProgression (locks/current path)
LessonEngine -> ScenarioEngine facade -> Practice Hub
LessonEngine -> ReplayController -> Replay Library
LessonEngine submissions -> AdaptiveCoach local attempt journal
Academy progress -> ProgressEvents / achievements
ScenarioEngine -> ExamEngine assessment pool
AcademyShell -> Settings / Diagnostics
ProductionReadiness -> version/subsystem manifest
CurriculumCatalog -> target scale map only; canonical content remains LESSONS/WORLDS.
