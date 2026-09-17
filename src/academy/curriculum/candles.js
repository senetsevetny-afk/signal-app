/* =========================================================
   MARKET AI ACADEMY — CANDLES CURRICULUM
   Interactive candlestick learning pack
   ========================================================= */

(function () {
  'use strict';

  const Academy = window.MarketAIAcademy;

  if (!Academy || !Academy.Curriculum) {
    console.error('[MARKET AI] Curriculum Loader not found');
    return;
  }

  const LESSONS = [

    /* =====================================================
       LESSON 1 — WHAT IS A CANDLE?
       ===================================================== */

    {
      id: 'candles_01_anatomy',
      worldId: 'w_candles',
      moduleId: 'm_anatomy',
      order: 10,

      title: 'Анатомия свечи',
      subtitle: 'Open • High • Low • Close',

      difficulty: 'beginner',
      estimatedTime: 6,
      xp: 20,

      characterState: 'welcome',

      steps: [
        {
          id: 'c01_intro',
          type: 'character_message',
          characterState: 'welcome',

          title: 'Знакомство со свечой',

          text:
            'Каждая свеча показывает движение цены за определённый промежуток времени. Сейчас разберём её по частям.',

          scene: {
            type: 'candle_scene',
            animation: 'candle_appear',
            candle: 'bullish'
          }
        },

        {
          id: 'c01_body',
          type: 'animation',
          characterState: 'pointing',

          title: 'Тело свечи',

          text:
            'MARKET AI выделяет тело свечи. Оно показывает расстояние между ценой открытия и ценой закрытия.',

          scene: {
            type: 'candle_scene',
            animation: 'highlight_body',
            labels: ['OPEN', 'CLOSE']
          }
        },

        {
          id: 'c01_wicks',
          type: 'animation',
          characterState: 'explaining',

          title: 'Тени свечи',

          text:
            'Тонкие линии сверху и снизу называются тенями. Они показывают максимальную и минимальную цену.',

          scene: {
            type: 'candle_scene',
            animation: 'highlight_wicks',
            labels: ['HIGH', 'LOW']
          }
        },

        {
          id: 'c01_ohlc',
          type: 'character_demo',
          characterState: 'pointing',

          title: 'OHLC',

          text:
            'Запомни четыре значения: Open — открытие, High — максимум, Low — минимум, Close — закрытие.',

          scene: {
            type: 'candle_scene',
            animation: 'show_ohlc',
            labels: ['OPEN', 'HIGH', 'LOW', 'CLOSE']
          }
        },

        {
          id: 'c01_quiz',
          type: 'multiple_choice',
          characterState: 'question',

          title: 'Проверим',

          question:
            'Что показывает верхняя точка тени свечи?',

          options: [
            {
              id: 'open',
              text: 'Цену открытия'
            },
            {
              id: 'high',
              text: 'Максимальную цену'
            },
            {
              id: 'close',
              text: 'Цену закрытия'
            }
          ],

          correctAnswer: 'high',

          explanation:
            'Верно. Верхняя точка свечи показывает HIGH — максимальную цену за этот период.',

          scene: {
            type: 'quiz_scene',
            animation: 'select_high'
          }
        },

        {
          id: 'c01_practice',
          type: 'practice_scene',
          characterState: 'thinking',

          title: 'Покажи HIGH',

          instruction:
            'Нажми на верхнюю точку свечи.',

          interaction: {
            type: 'tap_candle_part',
            target: 'high'
          },

          scene: {
            type: 'candle_scene',
            animation: 'interactive_anatomy'
          }
        },

        {
          id: 'c01_summary',
          type: 'summary',
          characterState: 'celebrate',

          title: 'Свеча прочитана',

          text:
            'Теперь ты знаешь четыре главные точки свечи: Open, High, Low и Close.'
        }
      ]
    },


    /* =====================================================
       LESSON 2 — BULLISH VS BEARISH
       ===================================================== */

    {
      id: 'candles_02_direction',
      worldId: 'w_candles',
      moduleId: 'm_anatomy',
      order: 20,

      title: 'Бычья и медвежья свеча',
      subtitle: 'Кто контролировал движение?',

      difficulty: 'beginner',
      estimatedTime: 7,
      xp: 20,

      prerequisites: ['candles_01_anatomy'],

      characterState: 'welcome',

      steps: [
        {
          id: 'c02_intro',
          type: 'character_message',
          characterState: 'welcome',

          title: 'Две разные свечи',

          text:
            'Посмотри на две свечи. Одна закрылась выше открытия, другая — ниже.',

          scene: {
            type: 'candle_scene',
            animation: 'bull_bear_enter',
            candles: ['bullish', 'bearish']
          }
        },

        {
          id: 'c02_bull',
          type: 'animation',
          characterState: 'pointing',

          title: 'Бычья свеча',

          text:
            'Если Close находится выше Open, свеча бычья. За этот период цена закончила выше точки открытия.',

          scene: {
            type: 'candle_scene',
            animation: 'bullish_build'
          }
        },

        {
          id: 'c02_bear',
          type: 'animation',
          characterState: 'pointing',

          title: 'Медвежья свеча',

          text:
            'Если Close находится ниже Open, свеча медвежья. Цена закончила период ниже точки открытия.',

          scene: {
            type: 'candle_scene',
            animation: 'bearish_build'
          }
        },

        {
          id: 'c02_question',
          type: 'multiple_choice',
          characterState: 'question',

          title: 'Какая это свеча?',

          question:
            'Цена открылась на 100, а закрылась на 106. Какой была свеча?',

          options: [
            {
              id: 'bullish',
              text: 'Бычья'
            },
            {
              id: 'bearish',
              text: 'Медвежья'
            }
          ],

          correctAnswer: 'bullish',

          explanation:
            'Close выше Open, поэтому свеча бычья.',

          scene: {
            type: 'quiz_scene',
            animation: 'price_move_up'
          }
        },

        {
          id: 'c02_practice',
          type: 'practice_scene',
          characterState: 'thinking',

          title: 'Найди бычью свечу',

          instruction:
            'Перед тобой несколько свечей. Нажми на бычью.',

          interaction: {
            type: 'tap_candle',
            target: 'bullish'
          },

          scene: {
            type: 'chart_animation',
            animation: 'candle_selection',
            candles: 5
          }
        },

        {
          id: 'c02_summary',
          type: 'summary',
          characterState: 'celebrate',

          title: 'Отлично',

          text:
            'Цвет помогает читать график быстрее, но главное — положение Open и Close.'
        }
      ]
    },


    /* =====================================================
       LESSON 3 — BODY AND WICKS
       ===================================================== */

    {
      id: 'candles_03_body_wicks',
      worldId: 'w_candles',
      moduleId: 'm_anatomy',
      order: 30,

      title: 'Тело и тени',
      subtitle: 'Что происходило внутри свечи',

      difficulty: 'beginner',
      estimatedTime: 8,
      xp: 25,

      prerequisites: ['candles_02_direction'],

      characterState: 'thinking',

      steps: [
        {
          id: 'c03_compare',
          type: 'animation',
          characterState: 'pointing',

          title: 'Сравни свечи',

          text:
            'Одинаковый цвет ещё не означает одинаковое поведение цены.',

          scene: {
            type: 'candle_scene',
            animation: 'compare_bodies_and_wicks'
          }
        },

        {
          id: 'c03_large_body',
          type: 'character_demo',
          characterState: 'explaining',

          title: 'Большое тело',

          text:
            'Большое тело показывает значительное расстояние между Open и Close. Но одной свечи недостаточно, чтобы автоматически прогнозировать следующую.',

          scene: {
            type: 'candle_scene',
            animation: 'expand_body'
          }
        },

        {
          id: 'c03_long_wick',
          type: 'animation',
          characterState: 'pointing',

          title: 'Длинная тень',

          text:
            'Длинная тень показывает, что цена посещала этот уровень, но затем ушла от него до закрытия свечи.',

          scene: {
            type: 'candle_scene',
            animation: 'extend_wick'
          }
        },

        {
          id: 'c03_question',
          type: 'multiple_choice',
          characterState: 'question',

          title: 'Что можно утверждать?',

          question:
            'У свечи очень длинная верхняя тень. Что мы точно знаем?',

          options: [
            {
              id: 'guaranteed_down',
              text: 'Следующая свеча обязательно пойдёт вниз'
            },
            {
              id: 'visited_high',
              text: 'Цена была значительно выше Close/Open внутри периода'
            },
            {
              id: 'guaranteed_up',
              text: 'Следующая свеча обязательно пойдёт вверх'
            }
          ],

          correctAnswer: 'visited_high',

          explanation:
            'Тень показывает уже произошедшее движение цены. Она не гарантирует направление следующей свечи.',

          scene: {
            type: 'quiz_scene',
            animation: 'highlight_upper_wick'
          }
        },

        {
          id: 'c03_practice',
          type: 'practice_scene',
          characterState: 'thinking',

          title: 'Найди длинную верхнюю тень',

          instruction:
            'Выбери свечу с наиболее заметной верхней тенью.',

          interaction: {
            type: 'tap_candle',
            target: 'largest_upper_wick'
          },

          scene: {
            type: 'chart_animation',
            animation: 'wick_practice',
            candles: 6
          }
        },

        {
          id: 'c03_summary',
          type: 'summary',
          characterState: 'celebrate',

          title: 'Читай историю свечи',

          text:
            'Тело показывает Open → Close, а тени — экстремумы движения внутри периода.'
        }
      ]
    },


    /* =====================================================
       LESSON 4 — CONTEXT
       ===================================================== */

    {
      id: 'candles_04_context',
      worldId: 'w_candles',
      moduleId: 'm_patterns',
      order: 40,

      title: 'Свеча без контекста',
      subtitle: 'Почему одной формы недостаточно',

      difficulty: 'beginner',
      estimatedTime: 8,
      xp: 30,

      prerequisites: ['candles_03_body_wicks'],

      characterState: 'warning',

      steps: [
        {
          id: 'c04_intro',
          type: 'character_message',
          characterState: 'warning',

          title: 'Главная ошибка новичка',

          text:
            'Нельзя принимать решение только потому, что одна свеча выглядит сильной.',

          scene: {
            type: 'character_demo',
            animation: 'market_ai_warning'
          }
        },

        {
          id: 'c04_chart',
          type: 'chart_animation',
          characterState: 'pointing',

          title: 'Добавляем контекст',

          text:
            'Теперь уменьшаем масштаб. Та же свеча становится частью структуры рынка.',

          scene: {
            type: 'chart_animation',
            animation: 'zoom_out_context',
            hideFutureCandles: true
          }
        },

        {
          id: 'c04_decision',
          type: 'multiple_choice',
          characterState: 'question',

          title: 'Что делать?',

          question:
            'Ты видишь одну большую бычью свечу, но не знаешь контекст. Какое решение лучше для учебного сценария?',

          options: [
            {
              id: 'enter',
              text: 'Сразу войти'
            },
            {
              id: 'wait',
              text: 'Подождать и изучить контекст'
            },
            {
              id: 'guarantee',
              text: 'Считать рост гарантированным'
            }
          ],

          correctAnswer: 'wait',

          explanation:
            'Размер одной свечи сам по себе не подтверждает продолжение движения. Сначала нужен контекст.',

          scene: {
            type: 'quiz_scene',
            animation: 'freeze_market'
          }
        },

        {
          id: 'c04_reveal',
          type: 'market_replay',
          characterState: 'thinking',

          title: 'Посмотрим продолжение',

          text:
            'Только после твоего решения MARKET AI открывает следующие свечи.',

          scene: {
            type: 'market_replay',
            animation: 'reveal_future_after_decision',
            hideFutureCandles: true
          }
        },

        {
          id: 'c04_summary',
          type: 'summary',
          characterState: 'shield',

          title: 'Правило MARKET AI',

          text:
            'Сначала читаем контекст, затем принимаем решение. Форма отдельной свечи — только часть информации.'
        }
      ]
    }

  ];


  const PACK = {
    id: 'curriculum_candles_v1',
    version: '1.0.0',

    worldId: 'w_candles',

    title: 'Candlesticks',

    lessons: LESSONS
  };


  const registered =
    Academy.Curriculum.registerSafe(
      PACK.id,
      PACK
    );


  if (registered) {
    window.dispatchEvent(
      new CustomEvent(
        'market-ai:curriculum-pack-loaded',
        {
          detail: {
            packId: PACK.id,
            worldId: PACK.worldId,
            lessons: PACK.lessons.length
          }
        }
      )
    );

    console.log(
      '[MARKET AI] Candles curriculum ready:',
      PACK.lessons.length,
      'lessons'
    );
  }

})();
