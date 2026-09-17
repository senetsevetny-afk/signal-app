/* ============================================================
   MARKET AI ACADEMY — SHELL
   Curriculum-first UI
   ============================================================ */

(function () {
  'use strict';

  const WORLD_NAMES = {
    w_basics: 'Основы рынка',
    w_candles: 'Свечи',
    w_trend: 'Тренд и структура',
    w_levels: 'Уровни',
    w_indi: 'Индикаторы',
    w_mtf: 'Таймфреймы',
    w_risk: 'Риск и психология',
    w_binary: 'Binary Options'
  };

  const MASTERY_LABEL = {
    none: 'НОВОЕ',
    learned: 'ИЗУЧЕНО',
    practiced: 'ПРАКТИКА',
    tested: 'ПРОВЕРЕНО',
    mastered: 'MASTERED'
  };

  let legacyOpen = null;


  /* ----------------------------------------------------------
     HELPERS
     ---------------------------------------------------------- */

  function esc(value) {
    return String(value ?? '').replace(
      /[&<>"']/g,
      char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]
    );
  }


  function worldName(world) {
    if (!world) return 'Academy';

    return (
      world.title ||
      WORLD_NAMES[world.id] ||
      world.id
    );
  }


  function lessonTitle(lesson) {
    if (!lesson) return 'Урок';

    return (
      lesson.title ||
      lesson.name ||
      lesson.titleKey ||
      lesson.id
    );
  }


  function lessonSubtitle(lesson) {
    if (!lesson) return '';

    return (
      lesson.subtitle ||
      lesson.description ||
      'Интерактивный урок MARKET AI'
    );
  }


  function worldLessons(worldId) {
    return LESSONS
      .filter(lesson => lesson.worldId === worldId)
      .sort((a, b) => a.order - b.order);
  }


  function worldProgress(worldId) {
    const lessons = worldLessons(worldId);

    if (!lessons.length) {
      return 0;
    }

    const completed = lessons.filter(lesson => {
      return lessonState(lesson.id).mastery !== 'none';
    }).length;

    return Math.round(
      completed / lessons.length * 100
    );
  }


  function totalDone() {
    return LESSONS.filter(lesson => {
      return lessonState(lesson.id).mastery !== 'none';
    }).length;
  }


  function availableCount() {
    return LESSONS.filter(
      lesson => lessonAvailable(lesson)
    ).length;
  }


  function shell(body, title, subtitle) {
    const wrap =
      document.getElementById('eduWrap');

    if (!wrap) {
      console.error(
        '[MARKET AI] #eduWrap not found'
      );
      return;
    }

    wrap.innerHTML = `
      <div class="sheet">

        <div class="shHead">

          <div style="flex:1">

            <b>
              ${esc(title || 'MARKET AI ACADEMY')}
            </b>

            <div class="sub2">
              ${esc(
                subtitle ||
                'интерактивная карта обучения'
              )}
            </div>

          </div>

          <button
            class="shX"
            onclick="closeOv('eduWrap')"
          >
            ✕
          </button>

        </div>

        <div class="shBody">
          <div class="acShell">
            ${body}
          </div>
        </div>

      </div>
    `;

    if (typeof openOv === 'function') {
      openOv('eduWrap');
    }
  }


  window.academyShellRender = shell;


  /* ----------------------------------------------------------
     ACADEMY HOME
     ---------------------------------------------------------- */

  window.openAcademy = function () {

    if (typeof initAcademy === 'function') {
      initAcademy();
    }

    if (typeof setMascotState === 'function') {
      setMascotState('think');
    }


    const cards = WORLDS
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(world => {

        const progress =
          worldProgress(world.id);

        const count =
          worldLessons(world.id).length;

        return `
          <button
            class="acWorld"
            onclick="openAcademyWorld('${world.id}')"
          >

            <span class="acPlanet">
              ${world.ic || '🌐'}
            </span>

            <b>
              ${esc(worldName(world))}
            </b>

            <small>
              ${count} уроков · ${progress}%
            </small>

            <span class="acProg">
              <i style="width:${progress}%"></i>
            </span>

          </button>
        `;
      })
      .join('');


    shell(
      `

      <div class="acHero">

        <div class="acEyebrow">
          MARKET AI · LEARNING SYSTEM
        </div>

        <h2>
          От свечей до самостоятельного анализа
        </h2>

        <p>
          Интерактивная Академия MARKET AI.
          Теория, визуальные сцены, практика,
          проверка знаний и тренировочные
          рыночные сценарии.
        </p>

        <div class="acStats">

          <div class="acStat">
            <b>${EDUP.xp || 0}</b>
            <s>XP</s>
          </div>

          <div class="acStat">
            <b>
              ${totalDone()}/${LESSONS.length}
            </b>
            <s>Уроки</s>
          </div>

          <div class="acStat">
            <b>${availableCount()}</b>
            <s>Доступно</s>
          </div>

        </div>

      </div>


      <div class="acSection">
        <b>Вселенная Академии</b>
        <i></i>
      </div>


      <div id="acUniverse"></div>


      ${
        window.MarketAILevels
          ? MarketAILevels.render()
          : ''
      }


      ${
        window.MarketAIAcademyProgress
          ? MarketAIAcademyProgress.render()
          : ''
      }


      ${
        window.MarketAIAdaptiveCoach
          ? MarketAIAdaptiveCoach.render()
          : ''
      }


      <div class="acSection">
        <b>Миры обучения</b>
        <i></i>
      </div>


      <div class="acWorlds">
        ${cards}
      </div>


      <div class="acActions">

        <button
          class="acGhost"
          onclick="openAcademyContinue()"
        >
          ▶ Продолжить
        </button>

        <button
          class="acGhost"
          onclick="window.openAcademyScenarioHub?.()"
        >
          ◈ Practice Lab
        </button>

        <button
          class="acGhost"
          onclick="window.openAcademyReplayLibrary?.()"
        >
          ▶ Replay
        </button>

        <button
          class="acGhost"
          onclick="window.openAcademyExam?.()"
        >
          ◆ Экзамен
        </button>

        <button
          class="acGhost"
          onclick="window.openAcademySettings?.()"
        >
          ⚙ Настройки
        </button>

        <button
          class="acGhost"
          onclick="window.openAcademyTour?.(true)"
        >
          ✦ Тур
        </button>

      </div>
      `,

      'MARKET AI ACADEMY',
      'твоя карта обучения'
    );


    setTimeout(() => {

      if (
        window.MarketAIUniverse &&
        typeof window.MarketAIUniverse.mount === 'function'
      ) {
        window.MarketAIUniverse.mount();
      }

      setTimeout(() => {

        if (
          window.MarketAIUniverseProgression &&
          typeof window.MarketAIUniverseProgression.decorate === 'function'
        ) {
          window.MarketAIUniverseProgression.decorate();
        }

      }, 0);

    }, 0);
  };


  /* ----------------------------------------------------------
     WORLD
     ---------------------------------------------------------- */

  window.openAcademyWorld = function (worldId) {

    if (typeof initAcademy === 'function') {
      initAcademy();
    }

    const world =
      WORLDS.find(item => item.id === worldId);

    if (!world) {
      return window.openAcademy();
    }


    const lessons =
      worldLessons(worldId);


    const rows = lessons
      .map(lesson => {

        const state =
          lessonState(lesson.id);

        const available =
          lessonAvailable(lesson);

        const difficulty =
          lesson.difficulty || 'beginner';

        return `
          <button
            class="acLesson"
            ${available ? '' : 'disabled'}
            onclick="openAcademyLesson('${lesson.id}')"
          >

            <span class="acLessonIc">
              ${esc(lesson.icon || '🎓')}
            </span>


            <span class="acLessonM">

              <b>
                ${esc(lessonTitle(lesson))}
              </b>

              <span>
                ${esc(lessonSubtitle(lesson))}
                · ${lesson.estimatedTime || 5} мин
                · +${lesson.xp || 0} XP
              </span>

              <small>
                ${esc(String(difficulty))}
              </small>

            </span>


            <span class="acState">
              ${
                available
                  ? (
                    MASTERY_LABEL[
                      state.mastery
                    ] || 'НОВОЕ'
                  )
                  : '🔒'
              }
            </span>

          </button>
        `;
      })
      .join('');


    const empty = `
      <div class="empty">

        <b>Этот мир готовится</b>

        <p>
          Учебные модули будут добавлены
          в следующих пакетах curriculum.
        </p>

      </div>
    `;


    shell(
      `

      <button
        class="acBack"
        onclick="openAcademy()"
      >
        ‹ Вселенная обучения
      </button>


      <div class="acHero">

        <div class="acEyebrow">
          WORLD
        </div>

        <h2>
          ${world.ic || '🌐'}
          ${esc(worldName(world))}
        </h2>

        <p>
          ${worldProgress(worldId)}%
          текущего учебного пути завершено.
        </p>

        <div class="acStats">

          <div class="acStat">
            <b>${lessons.length}</b>
            <s>Уроки</s>
          </div>

          <div class="acStat">
            <b>
              ${
                lessons.filter(
                  lesson =>
                    lessonAvailable(lesson)
                ).length
              }
            </b>
            <s>Доступно</s>
          </div>

          <div class="acStat">
            <b>
              ${worldProgress(worldId)}%
            </b>
            <s>Прогресс</s>
          </div>

        </div>

      </div>


      <div class="acSection">
        <b>Уроки</b>
        <i></i>
      </div>


      <div class="acList">
        ${rows || empty}
      </div>
      `,

      'MARKET AI ACADEMY',
      worldName(world)
    );
  };


  /* ----------------------------------------------------------
     LESSON
     ---------------------------------------------------------- */

  window.openAcademyLesson = function (lessonId) {

    const lesson =
      LESSONS.find(
        item => item.id === lessonId
      );


    if (!lesson) {
      console.error(
        '[MARKET AI] Lesson not found:',
        lessonId
      );

      return;
    }


    if (!lessonAvailable(lesson)) {
      return;
    }


    EDUP.lastLesson =
      lesson.id;

    if (typeof eduSave === 'function') {
      eduSave();
    }


    if (
      typeof openLessonEngine === 'function'
    ) {
      return openLessonEngine(
        lesson.id
      );
    }


    /* Safe fallback.
       A lesson must never disappear just because
       a renderer is unavailable. */

    const steps =
      (lesson.steps || [])
        .map((step, index) => {

          const title =
            step.title ||
            step.titleKey ||
            `Шаг ${index + 1}`;

          const text =
            step.text ||
            step.body ||
            step.prompt ||
            step.message ||
            step.textKey ||
            '';

          return `
            <div class="acLessonFallback">

              <small>
                ${esc(step.type || 'step')}
              </small>

              <b>
                ${esc(title)}
              </b>

              ${
                text
                  ? `<p>${esc(text)}</p>`
                  : ''
              }

            </div>
          `;
        })
        .join('');


    shell(
      `

      <button
        class="acBack"
        onclick="openAcademyWorld('${lesson.worldId}')"
      >
        ‹ Назад к урокам
      </button>


      <div class="acHero">

        <div class="acEyebrow">
          LESSON
        </div>

        <h2>
          ${esc(lessonTitle(lesson))}
        </h2>

        <p>
          ${esc(lessonSubtitle(lesson))}
        </p>

      </div>


      <div class="acList">
        ${steps}
      </div>


      <div class="acActions">

        <button
          class="acGhost"
          onclick="completeAcademyLesson('${lesson.id}')"
        >
          ✓ Завершить урок
        </button>

      </div>
      `,

      'MARKET AI ACADEMY',
      lessonTitle(lesson)
    );
  };


  /* ----------------------------------------------------------
     COMPLETE LESSON
     ---------------------------------------------------------- */

  window.completeAcademyLesson = function (lessonId) {

    const lesson =
      LESSONS.find(
        item => item.id === lessonId
      );

    if (!lesson) {
      return;
    }


    const before =
      lessonState(lessonId).mastery;


    setMastery(
      lessonId,
      'learned'
    );


    if (before === 'none') {
      addXP(
        lesson.xp || 0
      );
    }


    if (typeof haptic === 'function') {
      haptic('medium');
    }


    window.openAcademyWorld(
      lesson.worldId
    );
  };


  /* ----------------------------------------------------------
     CONTINUE
     ---------------------------------------------------------- */

  window.openAcademyContinue = function () {

    const last =
      EDUP.lastLesson &&
      LESSONS.find(
        lesson =>
          lesson.id === EDUP.lastLesson &&
          lessonAvailable(lesson)
      );


    if (last) {
      return window.openAcademyLesson(
        last.id
      );
    }


    const next =
      LESSONS.find(
        lesson =>
          lessonAvailable(lesson) &&
          lessonState(lesson.id).mastery === 'none'
      ) ||
      LESSONS.find(
        lesson =>
          lessonAvailable(lesson)
      );


    if (next) {
      return window.openAcademyLesson(
        next.id
      );
    }


    window.openAcademy();
  };


  /* ----------------------------------------------------------
     INITIALIZATION
     ---------------------------------------------------------- */

  window.initAcademyShell = function () {

    if (
      typeof openEdu === 'function' &&
      !legacyOpen
    ) {
      legacyOpen = openEdu;
      openEdu = window.openAcademy;
    }


    if (typeof initAcademy === 'function') {
      initAcademy();
    }


    return {
      ok: true,
      worlds: WORLDS.length,
      lessons: LESSONS.length
    };
  };


  /* ----------------------------------------------------------
     CURRICULUM BOOTSTRAP

     Load in strict order:
     loader -> visual scene -> curriculum packs -> rebuild core.
     ---------------------------------------------------------- */

  function loadScript(src) {

    return new Promise(
      (resolve, reject) => {

        const existing =
          document.querySelector(
            `script[src="${src}"]`
          );


        if (existing) {
          resolve();
          return;
        }


        const script =
          document.createElement('script');


        script.src = src;

        script.onload =
          () => resolve();

        script.onerror =
          () => reject(
            new Error(
              `Cannot load ${src}`
            )
          );


        document.head.appendChild(
          script
        );
      }
    );
  }


  async function bootstrapAcademy() {

    try {

      await loadScript(
        'src/academy/curriculum-loader.js'
      );


      await loadScript(
        'src/academy/candle-scene.js'
      );


      await loadScript(
        'src/academy/curriculum/candles.js'
      );


      /* Other curriculum packs already present
         in the repository can load here safely. */

      try {
        await loadScript(
          'src/academy/curriculum/price-action.js'
        );
      } catch (error) {
        console.warn(
          '[MARKET AI] price-action curriculum unavailable'
        );
      }


      try {
        await loadScript(
          'src/academy/curriculum/trend.js'
        );
      } catch (error) {
        console.warn(
          '[MARKET AI] trend curriculum unavailable'
        );
      }


      if (typeof initAcademy === 'function') {
        initAcademy();
      }


      console.log(
        '[MARKET AI] Academy Shell ready:',
        LESSONS.length,
        'lessons'
      );


      window.dispatchEvent(
        new CustomEvent(
          'market-ai:academy-ready',
          {
            detail: {
              lessons: LESSONS.length,
              worlds: WORLDS.length
            }
          }
        )
      );

    } catch (error) {

      console.error(
        '[MARKET AI] Academy bootstrap failed:',
        error
      );
    }
  }


  bootstrapAcademy();

})();
