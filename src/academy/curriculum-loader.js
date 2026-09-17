/* =========================================================
   MARKET AI ACADEMY — CURRICULUM LOADER
   Safe bridge for modular curriculum packs
   ========================================================= */

(function () {
  'use strict';

  const ROOT = window.MarketAIAcademy =
    window.MarketAIAcademy || {};

  const Curriculum = ROOT.Curriculum =
    ROOT.Curriculum || {};

  /* Хранилище подключённых пакетов */
  Curriculum.packs = Curriculum.packs || {};

  /* Регистрация нового учебного пакета */
  Curriculum.register = function (packId, pack) {
    if (!packId || !pack) {
      console.warn('[MARKET AI] Invalid curriculum pack');
      return false;
    }

    Curriculum.packs[packId] = pack;

    console.log(
      '[MARKET AI] Curriculum loaded:',
      packId,
      pack.lessons?.length || 0,
      'lessons'
    );

    return true;
  };

  /* Получить конкретный пакет */
  Curriculum.getPack = function (packId) {
    return Curriculum.packs[packId] || null;
  };

  /* Получить все уроки из всех пакетов */
  Curriculum.getLessons = function () {
    const lessons = [];

    Object.values(Curriculum.packs).forEach(pack => {
      if (Array.isArray(pack.lessons)) {
        lessons.push(...pack.lessons);
      }
    });

    return lessons;
  };

  /* Получить урок по ID */
  Curriculum.getLesson = function (lessonId) {
    return Curriculum
      .getLessons()
      .find(lesson => lesson.id === lessonId) || null;
  };

  /* Получить уроки конкретного мира */
  Curriculum.getWorldLessons = function (worldId) {
    return Curriculum
      .getLessons()
      .filter(lesson => lesson.worldId === worldId);
  };

  /* Получить уроки конкретного модуля */
  Curriculum.getModuleLessons = function (moduleId) {
    return Curriculum
      .getLessons()
      .filter(lesson => lesson.moduleId === moduleId);
  };

  /* =====================================================
     ВИЗУАЛЬНЫЕ СЦЕНЫ

     Эти типы позже будет обрабатывать Lesson Engine:
     candle_scene
     chart_animation
     character_demo
     practice_scene
     quiz_scene
     market_replay
     ===================================================== */

  Curriculum.SCENE_TYPES = Object.freeze([
    'candle_scene',
    'chart_animation',
    'character_demo',
    'practice_scene',
    'quiz_scene',
    'market_replay'
  ]);

  /* =====================================================
     MARKET AI STATES

     Персонаж может менять поведение в зависимости
     от того, что происходит в уроке.
     ===================================================== */

  Curriculum.CHARACTER_STATES = Object.freeze([
    'idle',
    'welcome',
    'thinking',
    'pointing',
    'explaining',
    'warning',
    'question',
    'wait',
    'correct',
    'incorrect',
    'celebrate',
    'shield'
  ]);

  /* Проверка пакета перед подключением */
  Curriculum.validatePack = function (pack) {
    const errors = [];

    if (!pack) {
      errors.push('Pack is empty');
      return {
        ok: false,
        errors
      };
    }

    if (!Array.isArray(pack.lessons)) {
      errors.push('lessons must be an array');
    }

    if (Array.isArray(pack.lessons)) {
      const ids = new Set();

      pack.lessons.forEach((lesson, index) => {
        if (!lesson.id) {
          errors.push(`Lesson ${index} has no id`);
        }

        if (lesson.id && ids.has(lesson.id)) {
          errors.push(`Duplicate lesson id: ${lesson.id}`);
        }

        if (lesson.id) {
          ids.add(lesson.id);
        }

        if (!lesson.worldId) {
          errors.push(
            `Lesson ${lesson.id || index} has no worldId`
          );
        }

        if (!Array.isArray(lesson.steps)) {
          errors.push(
            `Lesson ${lesson.id || index} has no steps`
          );
        }
      });
    }

    return {
      ok: errors.length === 0,
      errors
    };
  };

  /* Безопасная регистрация */
  Curriculum.registerSafe = function (packId, pack) {
    const validation = Curriculum.validatePack(pack);

    if (!validation.ok) {
      console.error(
        '[MARKET AI] Curriculum validation failed:',
        packId,
        validation.errors
      );

      return false;
    }

    return Curriculum.register(packId, pack);
  };

  /* =====================================================
     EVENT

     Другие части Academy смогут узнать,
     что Curriculum Loader уже готов.
     ===================================================== */

  window.dispatchEvent(
    new CustomEvent('market-ai:curriculum-ready', {
      detail: {
        version: '1.0.0'
      }
    })
  );

  console.log(
    '[MARKET AI] Curriculum Loader ready'
  );
})();
