/* ============================================================
   MARKET AI ACADEMY — CORE
   Clean curriculum-first architecture
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   1. CONSTANTS
   ------------------------------------------------------------ */

const STEP_TYPES = [
  'intro',
  'character_message',
  'explanation',
  'chart',
  'highlight_candle',
  'highlight_zone',
  'draw_line',
  'show_indicator',
  'show_pattern',
  'animation',
  'character_demo',
  'question',
  'tap_candle',
  'tap_zone',
  'select_direction',
  'multiple_choice',
  'true_false',
  'market_tip',
  'warning',
  'example',
  'counter_example',
  'summary',
  'explain_to_market_ai',
  'market_replay',
  'scenario_tree',
  'comparison',
  'drag_level',
  'mark_structure',
  'mark_structure_sequence',
  'practice_scene'
];

const CHAR_STATES = [
  'idle',
  'loading',
  'CALL',
  'PUT',
  'wait',
  'analytics',
  'history',
  'think',
  'shield',
  'globe',
  'bell',
  'listen',
  'hero',
  'wave',
  'error',
  'welcome',
  'explain',
  'explaining',
  'point',
  'pointing',
  'thinking',
  'question',
  'warning',
  'correct',
  'incorrect',
  'celebrate'
];

const MASTERY = [
  'none',
  'learned',
  'practiced',
  'tested',
  'mastered'
];


/* ------------------------------------------------------------
   2. WORLDS
   Stable IDs — other Academy components may depend on them.
   ------------------------------------------------------------ */

const WORLDS = [
  {
    id: 'w_basics',
    ic: '📘',
    order: 10,
    title: 'Основы рынка',
    titleKey: 'w.basics',
    modules: ['m_market', 'm_chart']
  },
  {
    id: 'w_candles',
    ic: '🕯',
    order: 20,
    title: 'Свечи',
    titleKey: 'w.candles',
    modules: ['m_anatomy', 'm_patterns']
  },
  {
    id: 'w_trend',
    ic: '📈',
    order: 30,
    title: 'Тренд и структура',
    titleKey: 'w.trend',
    modules: ['m_phases', 'm_structure']
  },
  {
    id: 'w_levels',
    ic: '📐',
    order: 40,
    title: 'Уровни',
    titleKey: 'w.levels',
    modules: ['m_zones', 'm_breakouts']
  },
  {
    id: 'w_indi',
    ic: '📉',
    order: 50,
    title: 'Индикаторы',
    titleKey: 'w.indi',
    modules: ['m_osc', 'm_trendind']
  },
  {
    id: 'w_mtf',
    ic: '🔭',
    order: 60,
    title: 'Таймфреймы',
    titleKey: 'w.mtf',
    modules: ['m_timeframes']
  },
  {
    id: 'w_risk',
    ic: '🛡',
    order: 70,
    title: 'Риск и психология',
    titleKey: 'w.risk',
    modules: ['m_money', 'm_psy']
  },
  {
    id: 'w_binary',
    ic: '🎯',
    order: 80,
    title: 'Binary Options',
    titleKey: 'w.binary',
    modules: ['m_contract', 'm_timing']
  }
];


/* ------------------------------------------------------------
   3. MODULES
   ------------------------------------------------------------ */

const MODULES = [
  {
    id: 'm_market',
    worldId: 'w_basics',
    order: 10,
    title: 'Рынок',
    titleKey: 'm.market'
  },
  {
    id: 'm_chart',
    worldId: 'w_basics',
    order: 20,
    title: 'График',
    titleKey: 'm.chart'
  },

  {
    id: 'm_anatomy',
    worldId: 'w_candles',
    order: 10,
    title: 'Анатомия свечи',
    titleKey: 'm.anatomy'
  },
  {
    id: 'm_patterns',
    worldId: 'w_candles',
    order: 20,
    title: 'Свечные модели',
    titleKey: 'm.patterns'
  },

  {
    id: 'm_phases',
    worldId: 'w_trend',
    order: 10,
    title: 'Фазы рынка',
    titleKey: 'm.phases'
  },
  {
    id: 'm_structure',
    worldId: 'w_trend',
    order: 20,
    title: 'Структура',
    titleKey: 'm.structure'
  },

  {
    id: 'm_zones',
    worldId: 'w_levels',
    order: 10,
    title: 'Зоны',
    titleKey: 'm.zones'
  },
  {
    id: 'm_breakouts',
    worldId: 'w_levels',
    order: 20,
    title: 'Пробои',
    titleKey: 'm.breakouts'
  },

  {
    id: 'm_osc',
    worldId: 'w_indi',
    order: 10,
    title: 'Осцилляторы',
    titleKey: 'm.osc'
  },
  {
    id: 'm_trendind',
    worldId: 'w_indi',
    order: 20,
    title: 'Трендовые индикаторы',
    titleKey: 'm.trendind'
  },

  {
    id: 'm_timeframes',
    worldId: 'w_mtf',
    order: 10,
    title: 'Таймфреймы',
    titleKey: 'm.timeframes'
  },

  {
    id: 'm_money',
    worldId: 'w_risk',
    order: 10,
    title: 'Риск-менеджмент',
    titleKey: 'm.money'
  },
  {
    id: 'm_psy',
    worldId: 'w_risk',
    order: 20,
    title: 'Психология',
    titleKey: 'm.psy'
  },

  {
    id: 'm_contract',
    worldId: 'w_binary',
    order: 10,
    title: 'Контракт',
    titleKey: 'm.contract'
  },
  {
    id: 'm_timing',
    worldId: 'w_binary',
    order: 20,
    title: 'Timing & Expiration',
    titleKey: 'm.timing'
  }
];


/* ------------------------------------------------------------
   4. LESSON REGISTRY

   IMPORTANT:
   EDU is no longer the source of truth.

   Curriculum packs are the source of lessons.
   ------------------------------------------------------------ */

let LESSONS = [];

function normalizeLesson(raw) {
  if (!raw || !raw.id) return null;

  const module = MODULES.find(m => m.id === raw.moduleId);

  return {
    id: raw.id,

    worldId:
      raw.worldId ||
      (module ? module.worldId : null),

    moduleId:
      raw.moduleId || null,

    order:
      Number.isFinite(raw.order)
        ? raw.order
        : 999,

    icon:
      raw.icon || '🎓',

    title:
      raw.title ||
      raw.name ||
      raw.titleKey ||
      raw.id,

    subtitle:
      raw.subtitle ||
      raw.description ||
      '',

    titleKey:
      raw.titleKey || null,

    subtitleKey:
      raw.subtitleKey || null,

    descriptionKey:
      raw.descriptionKey || null,

    difficulty:
      raw.difficulty ?? 'beginner',

    estimatedTime:
      raw.estimatedTime || 5,

    xp:
      raw.xp || 20,

    prerequisites:
      Array.isArray(raw.prerequisites)
        ? raw.prerequisites
        : [],

    characterState:
      raw.characterState || 'idle',

    marketScene:
      raw.marketScene || null,

    steps:
      Array.isArray(raw.steps)
        ? raw.steps
        : [],

    examples:
      Array.isArray(raw.examples)
        ? raw.examples
        : [],

    counterExamples:
      Array.isArray(raw.counterExamples)
        ? raw.counterExamples
        : [],

    quiz:
      Array.isArray(raw.quiz)
        ? raw.quiz
        : [],

    practice:
      Array.isArray(raw.practice)
        ? raw.practice
        : [],

    source:
      raw.source || 'curriculum'
  };
}


function getCurriculumLessons() {
  const curriculum =
    window.MarketAIAcademy &&
    window.MarketAIAcademy.Curriculum;

  if (
    !curriculum ||
    typeof curriculum.getLessons !== 'function'
  ) {
    return [];
  }

  const source = curriculum.getLessons();

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map(normalizeLesson)
    .filter(Boolean);
}


function rebuildLessonRegistry() {
  const incoming = getCurriculumLessons();

  const unique = new Map();

  incoming.forEach(lesson => {
    unique.set(lesson.id, lesson);
  });

  LESSONS = Array
    .from(unique.values())
    .sort((a, b) => {

      const worldA =
        WORLDS.find(w => w.id === a.worldId)?.order || 999;

      const worldB =
        WORLDS.find(w => w.id === b.worldId)?.order || 999;

      if (worldA !== worldB) {
        return worldA - worldB;
      }

      const moduleA =
        MODULES.find(m => m.id === a.moduleId)?.order || 999;

      const moduleB =
        MODULES.find(m => m.id === b.moduleId)?.order || 999;

      if (moduleA !== moduleB) {
        return moduleA - moduleB;
      }

      return a.order - b.order;
    });

  return LESSONS;
}


/* ------------------------------------------------------------
   5. PROGRESS
   ------------------------------------------------------------ */

const EDU_KEY = 'acs_edu_v2';

let EDUP = LS.get(EDU_KEY, {
  version: 2,
  xp: 0,
  lessons: {},
  mistakes: {},
  achievements: [],
  tourDone: false,
  experienceLevel: null,
  lastLesson: null
});

function eduSave() {
  LS.set(EDU_KEY, EDUP);
}


function lessonState(id) {
  return EDUP.lessons[id] || {
    mastery: 'none',
    attempts: 0,
    correct: 0,
    ts: 0
  };
}


function lessonAvailable(lesson) {
  if (!lesson) return false;

  const prerequisites =
    Array.isArray(lesson.prerequisites)
      ? lesson.prerequisites
      : [];

  return prerequisites.every(id => {
    const state = lessonState(id);

    return (
      state.mastery === 'learned' ||
      state.mastery === 'practiced' ||
      state.mastery === 'tested' ||
      state.mastery === 'mastered'
    );
  });
}


function setMastery(id, level) {
  if (!MASTERY.includes(level)) {
    console.error(
      '[MARKET AI] Unknown mastery level:',
      level
    );
    return false;
  }

  const current = lessonState(id);

  if (
    MASTERY.indexOf(level) <=
    MASTERY.indexOf(current.mastery)
  ) {
    return false;
  }

  EDUP.lessons[id] = {
    ...current,
    mastery: level,
    ts: Date.now()
  };

  eduSave();

  return true;
}


function addXP(amount) {
  const value = Number(amount) || 0;

  EDUP.xp =
    Math.max(0, Number(EDUP.xp) || 0) +
    value;

  eduSave();

  return EDUP.xp;
}


function recordMistake(kind) {
  const key = kind || 'unknown';

  EDUP.mistakes[key] =
    (EDUP.mistakes[key] || 0) + 1;

  eduSave();
}


/* ------------------------------------------------------------
   6. TRAINING MARKET DATA
   Never represents live market data.
   ------------------------------------------------------------ */

const SCENARIO_TYPES = [
  'ideal',
  'weak',
  'false',
  'ambiguous',
  'no_trade'
];


function seededOHLC(seed, count, options) {
  const opts = options || {};

  let state = seed >>> 0;
  let price = opts.start || 100;

  const random = () => {
    state =
      (state * 1664525 + 1013904223) >>> 0;

    return state / 4294967296;
  };

  const drift = opts.drift || 0;
  const volatility = opts.vol || 0.6;

  const candles = [];

  for (let i = 0; i < count; i++) {
    const open = price;

    price = Math.max(
      0.01,
      price +
      (random() - 0.5) * volatility +
      drift
    );

    const close = price;

    const high =
      Math.max(open, close) +
      random() * volatility * 0.4;

    const low =
      Math.min(open, close) -
      random() * volatility * 0.4;

    candles.push({
      t: i * 60000,
      o: open,
      h: high,
      l: low,
      c: close,
      v: 1000 + random() * 500,
      ct: (i + 1) * 60000
    });
  }

  return candles;
}


function makeScenario(config) {
  const cfg = config || {};

  return {
    id: cfg.id,

    marketType:
      cfg.marketType || 'training',

    timeframe:
      cfg.timeframe || '5m',

    regime:
      cfg.regime || 'trend',

    seed:
      cfg.seed || 1,

    candles:
      cfg.n || 80,

    type:
      cfg.type || 'ambiguous',

    difficulty:
      cfg.difficulty || 1,

    correctAnswer:
      cfg.correct ?? null,

    acceptableAnswers:
      cfg.acceptable ||
      (
        cfg.correct == null
          ? []
          : [cfg.correct]
      ),

    conflicts:
      cfg.conflicts || [],

    riskFactors:
      cfg.riskFactors || [],

    dataLabel:
      'TRAINING SCENARIO',

    simulated:
      true,

    ohlc() {
      return seededOHLC(
        this.seed,
        this.candles,
        cfg.gen || {}
      );
    }
  };
}


const SCENARIOS = [
  makeScenario({
    id: 'sc_trend_up_1',
    type: 'ideal',
    regime: 'trend',
    seed: 1001,
    n: 80,
    gen: {
      drift: 0.22,
      vol: 0.5
    },
    correct: 'up'
  }),

  makeScenario({
    id: 'sc_trend_dn_1',
    type: 'ideal',
    regime: 'trend',
    seed: 1002,
    n: 80,
    gen: {
      drift: -0.22,
      vol: 0.5
    },
    correct: 'down'
  }),

  makeScenario({
    id: 'sc_range_1',
    type: 'no_trade',
    regime: 'range',
    seed: 1003,
    n: 80,
    gen: {
      drift: 0,
      vol: 0.35
    },
    correct: 'skip',
    riskFactors: [
      'нет устойчивого направления',
      'цена находится внутри диапазона'
    ]
  }),

  makeScenario({
    id: 'sc_chaos_1',
    type: 'ambiguous',
    regime: 'chaos',
    seed: 1004,
    n: 80,
    gen: {
      drift: 0,
      vol: 1.4
    },
    correct: 'skip',
    conflicts: [
      'высокая волатильность',
      'структура не читается'
    ]
  }),

  makeScenario({
    id: 'sc_weak_up_1',
    type: 'weak',
    regime: 'trend',
    seed: 1005,
    n: 80,
    gen: {
      drift: 0.08,
      vol: 0.9
    },
    correct: 'skip',
    acceptable: [
      'skip',
      'up'
    ],
    conflicts: [
      'слабый импульс',
      'широкие тени'
    ]
  })
];


/* ------------------------------------------------------------
   7. LOOKUPS
   ------------------------------------------------------------ */

function getAcademyWorld(id) {
  return WORLDS.find(world => world.id === id) || null;
}


function getAcademyModule(id) {
  return MODULES.find(module => module.id === id) || null;
}


function getAcademyLesson(id) {
  return LESSONS.find(lesson => lesson.id === id) || null;
}


function getAcademyScenario(id) {
  return SCENARIOS.find(
    scenario => scenario.id === id
  ) || null;
}


function getWorldLessons(worldId) {
  return LESSONS
    .filter(lesson => lesson.worldId === worldId)
    .sort((a, b) => a.order - b.order);
}


function getModuleLessons(moduleId) {
  return LESSONS
    .filter(lesson => lesson.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}


/* ------------------------------------------------------------
   8. VALIDATION
   ------------------------------------------------------------ */

function validateAcademy() {
  const errors = [];
  const warns = [];

  const worldIds =
    new Set(WORLDS.map(world => world.id));

  const moduleIds =
    new Set(MODULES.map(module => module.id));

  const lessonIds =
    new Set();


  MODULES.forEach(module => {
    if (!worldIds.has(module.worldId)) {
      errors.push(
        `Модуль ${module.id}: мир ${module.worldId} не существует`
      );
    }
  });


  LESSONS.forEach(lesson => {

    if (lessonIds.has(lesson.id)) {
      errors.push(
        `Дублирующийся lesson id: ${lesson.id}`
      );
    }

    lessonIds.add(lesson.id);


    if (!worldIds.has(lesson.worldId)) {
      errors.push(
        `Урок ${lesson.id}: неизвестный мир ${lesson.worldId}`
      );
    }


    if (!moduleIds.has(lesson.moduleId)) {
      errors.push(
        `Урок ${lesson.id}: неизвестный модуль ${lesson.moduleId}`
      );
    }


    if (
      !Array.isArray(lesson.steps) ||
      !lesson.steps.length
    ) {
      errors.push(
        `Урок ${lesson.id}: отсутствуют steps`
      );
    }


    (lesson.steps || []).forEach(
      (step, index) => {

        if (!STEP_TYPES.includes(step.type)) {
          warns.push(
            `Урок ${lesson.id}, шаг ${index}: renderer для ${step.type} ещё не зарегистрирован`
          );
        }

        if (
          step.characterState &&
          !CHAR_STATES.includes(step.characterState)
        ) {
          warns.push(
            `Урок ${lesson.id}, шаг ${index}: неизвестное состояние персонажа ${step.characterState}`
          );
        }
      }
    );
  });


  LESSONS.forEach(lesson => {
    (lesson.prerequisites || []).forEach(id => {

      if (!lessonIds.has(id)) {
        warns.push(
          `Урок ${lesson.id}: prerequisite ${id} пока не загружен`
        );
      }

    });
  });


  return {
    ok: errors.length === 0,
    errors,
    warns,

    counts: {
      worlds: WORLDS.length,
      modules: MODULES.length,
      lessons: LESSONS.length,
      scenarios: SCENARIOS.length
    }
  };
}


/* ------------------------------------------------------------
   9. INITIALIZATION
   ------------------------------------------------------------ */

function initAcademy() {

  rebuildLessonRegistry();

  const validation =
    validateAcademy();

  if (!validation.ok) {
    validation.errors.forEach(error => {
      console.error(
        '[MARKET AI][Academy]',
        error
      );
    });
  }

  validation.warns.forEach(warning => {
    console.warn(
      '[MARKET AI][Academy]',
      warning
    );
  });

  console.log(
    '[MARKET AI] Academy Core ready:',
    validation.counts
  );

  return validation;
}


/* Curriculum files can arrive after Core.
   When a pack loads, rebuild the registry automatically. */

window.addEventListener(
  'market-ai:curriculum-pack-loaded',
  function () {
    initAcademy();
  }
);


/* ------------------------------------------------------------
   10. PUBLIC API
   ------------------------------------------------------------ */

window.MarketAIAcademy =
  window.MarketAIAcademy || {};

window.MarketAIAcademy.Core = {

  version: '3.0.0',

  get worlds() {
    return WORLDS;
  },

  get modules() {
    return MODULES;
  },

  get lessons() {
    return LESSONS;
  },

  get scenarios() {
    return SCENARIOS;
  },

  init:
    initAcademy,

  rebuild:
    rebuildLessonRegistry,

  validate:
    validateAcademy,

  getWorld:
    getAcademyWorld,

  getModule:
    getAcademyModule,

  getLesson:
    getAcademyLesson,

  getScenario:
    getAcademyScenario,

  getWorldLessons:
    getWorldLessons,

  getModuleLessons:
    getModuleLessons,

  lessonState:
    lessonState,

  lessonAvailable:
    lessonAvailable,

  setMastery:
    setMastery,

  addXP:
    addXP,

  recordMistake:
    recordMistake
};


console.log(
  '[MARKET AI] Academy Core 3.0 loaded'
);
