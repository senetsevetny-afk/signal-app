/* =========================================================
   MARKET AI ACADEMY
   Candle Scene Engine v1
   Animated educational candlestick scenes
   ========================================================= */

(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  const SCENES = {
    anatomy: {
      candles: [
        { o: 42, h: 82, l: 24, c: 68 }
      ],
      focus: 'ohlc'
    },

    bullish: {
      candles: [
        { o: 35, h: 84, l: 25, c: 72 }
      ],
      focus: 'body'
    },

    bearish: {
      candles: [
        { o: 72, h: 84, l: 26, c: 38 }
      ],
      focus: 'body'
    },

    body: {
      candles: [
        { o: 38, h: 58, l: 30, c: 48 },
        { o: 45, h: 88, l: 39, c: 80 },
        { o: 76, h: 81, l: 43, c: 50 },
        { o: 52, h: 65, l: 47, c: 59 }
      ],
      focus: 'strong-body'
    },

    wicks: {
      candles: [
        { o: 58, h: 68, l: 18, c: 62 },
        { o: 62, h: 79, l: 52, c: 69 },
        { o: 70, h: 82, l: 60, c: 65 }
      ],
      focus: 'lower-wick'
    },

    rejection: {
      candles: [
        { o: 54, h: 65, l: 45, c: 60 },
        { o: 60, h: 69, l: 51, c: 57 },
        { o: 55, h: 62, l: 17, c: 59 },
        { o: 60, h: 76, l: 55, c: 72 }
      ],
      focus: 'rejection'
    },

    doji: {
      candles: [
        { o: 48, h: 78, l: 24, c: 50 }
      ],
      focus: 'doji'
    },

    engulfing: {
      candles: [
        { o: 64, h: 70, l: 43, c: 49 },
        { o: 46, h: 82, l: 40, c: 76 }
      ],
      focus: 'engulfing'
    }
  };

  function el(tag, attrs = {}) {
    const node = document.createElementNS(NS, tag);

    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });

    return node;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  class CandleScene {
    constructor(container, options = {}) {
      this.container =
        typeof container === 'string'
          ? document.querySelector(container)
          : container;

      this.options = {
        scene: 'anatomy',
        interactive: false,
        animated: true,
        characterReact: true,
        onSelect: null,
        ...options
      };

      this.svg = null;
      this.selectedIndex = null;
      this.candleNodes = [];
      this.destroyed = false;

      if (this.container) {
        this.render();
      }
    }

    getScene() {
      return (
        SCENES[this.options.scene] ||
        SCENES.anatomy
      );
    }

    clear() {
      if (!this.container) return;

      this.container.innerHTML = '';
      this.candleNodes = [];
    }

    render() {
      if (!this.container) return;

      this.clear();

      const scene = this.getScene();

      this.container.classList.add('market-ai-candle-scene');

      const shell = document.createElement('div');
      shell.className = 'candle-scene-shell';

      const badge = document.createElement('div');
      badge.className = 'candle-scene-badge';
      badge.textContent = 'TRAINING SCENARIO';

      shell.appendChild(badge);

      const stage = document.createElement('div');
      stage.className = 'candle-scene-stage';

      this.svg = el('svg', {
        viewBox: '0 0 360 260',
        role: 'img',
        'aria-label': 'Educational candlestick chart'
      });

      this.drawGrid();

      scene.candles.forEach((candle, index) => {
        this.drawCandle(candle, index, scene.candles.length);
      });

      stage.appendChild(this.svg);
      shell.appendChild(stage);

      const caption = document.createElement('div');
      caption.className = 'candle-scene-caption';

      shell.appendChild(caption);

      this.container.appendChild(shell);

      this.caption = caption;

      this.applyFocus(scene.focus);

      if (this.options.animated) {
        requestAnimationFrame(() => {
          if (!this.destroyed) {
            shell.classList.add('is-visible');
          }
        });
      } else {
        shell.classList.add('is-visible');
      }
    }

    drawGrid() {
      const grid = el('g', {
        class: 'candle-grid'
      });

      [40, 80, 120, 160, 200, 240].forEach(y => {
        grid.appendChild(
          el('line', {
            x1: 16,
            y1: y,
            x2: 344,
            y2: y
          })
        );
      });

      this.svg.appendChild(grid);
    }

    priceToY(price) {
      const p = clamp(price, 0, 100);
      return 225 - p * 1.85;
    }

    drawCandle(candle, index, total) {
      const spacing = Math.min(72, 290 / Math.max(total, 1));
      const startX =
        180 - ((total - 1) * spacing) / 2;

      const x = startX + index * spacing;

      const highY = this.priceToY(candle.h);
      const lowY = this.priceToY(candle.l);
      const openY = this.priceToY(candle.o);
      const closeY = this.priceToY(candle.c);

      const bullish = candle.c >= candle.o;

      const bodyTop = Math.min(openY, closeY);
      const bodyBottom = Math.max(openY, closeY);
      const bodyHeight = Math.max(4, bodyBottom - bodyTop);

      const group = el('g', {
        class:
          'academy-candle ' +
          (bullish ? 'is-bullish' : 'is-bearish'),
        'data-index': index
      });

      const wick = el('line', {
        class: 'candle-wick',
        x1: x,
        x2: x,
        y1: highY,
        y2: lowY
      });

      const body = el('rect', {
        class: 'candle-body',
        x: x - 13,
        y: bodyTop,
        width: 26,
        height: bodyHeight,
        rx: 4
      });

      group.appendChild(wick);
      group.appendChild(body);

      if (this.options.interactive) {
        group.classList.add('is-interactive');

        group.addEventListener('click', () => {
          this.selectCandle(index);
        });

        group.addEventListener(
          'touchend',
          event => {
            event.preventDefault();
            this.selectCandle(index);
          },
          { passive: false }
        );
      }

      this.svg.appendChild(group);

      this.candleNodes.push({
        group,
        wick,
        body,
        candle,
        x
      });

      if (this.options.animated) {
        group.style.setProperty(
          '--candle-delay',
          `${index * 140}ms`
        );
      }
    }

    selectCandle(index) {
      if (!this.options.interactive) return;

      this.selectedIndex = index;

      this.candleNodes.forEach((node, i) => {
        node.group.classList.toggle(
          'is-selected',
          i === index
        );
      });

      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(
          index,
          this.candleNodes[index]?.candle
        );
      }

      this.characterState('thinking');
    }

    characterState(state) {
      if (!this.options.characterReact) return;

      try {
        if (
          window.MarketAICharacter &&
          typeof window.MarketAICharacter.setState === 'function'
        ) {
          window.MarketAICharacter.setState(state);
          return;
        }

        if (
          window.CharacterDirector &&
          typeof window.CharacterDirector.setState === 'function'
        ) {
          window.CharacterDirector.setState(state);
        }
      } catch (error) {
        console.warn(
          '[CandleScene] Character state error:',
          error
        );
      }
    }

    applyFocus(focus) {
      switch (focus) {
        case 'ohlc':
          this.showOHLC();
          break;

        case 'body':
          this.highlightBody();
          break;

        case 'strong-body':
          this.highlightStrongBody();
          break;

        case 'lower-wick':
          this.highlightLowerWick();
          break;

        case 'rejection':
          this.highlightRejection();
          break;

        case 'doji':
          this.highlightDoji();
          break;

        case 'engulfing':
          this.highlightEngulfing();
          break;
      }
    }

    showOHLC() {
      const node = this.candleNodes[0];
      if (!node) return;

      const c = node.candle;
      const x = node.x;

      const labels = [
        {
          name: 'HIGH',
          value: c.h,
          y: this.priceToY(c.h)
        },
        {
          name: 'OPEN',
          value: c.o,
          y: this.priceToY(c.o)
        },
        {
          name: 'CLOSE',
          value: c.c,
          y: this.priceToY(c.c)
        },
        {
          name: 'LOW',
          value: c.l,
          y: this.priceToY(c.l)
        }
      ];

      labels.forEach((item, index) => {
        const side = index % 2 === 0 ? 1 : -1;

        const line = el('line', {
          class: 'candle-guide',
          x1: x + side * 18,
          y1: item.y,
          x2: x + side * 66,
          y2: item.y
        });

        const text = el('text', {
          class: 'candle-label',
          x: x + side * 72,
          y: item.y + 4,
          'text-anchor':
            side > 0 ? 'start' : 'end'
        });

        text.textContent = item.name;

        this.svg.appendChild(line);
        this.svg.appendChild(text);
      });

      this.setCaption(
        'Свеча хранит четыре цены: Open, High, Low и Close.'
      );
    }

    highlightBody() {
      this.candleNodes.forEach(node => {
        node.body.classList.add('is-focus');
      });

      this.setCaption(
        'Тело показывает расстояние между открытием и закрытием.'
      );
    }

    highlightStrongBody() {
      if (!this.candleNodes.length) return;

      let strongest = 0;
      let size = -1;

      this.candleNodes.forEach((node, index) => {
        const current = Math.abs(
          node.candle.c - node.candle.o
        );

        if (current > size) {
          size = current;
          strongest = index;
        }
      });

      this.candleNodes[strongest].body.classList.add(
        'is-focus'
      );

      this.setCaption(
        'Сравнивай размер тела с соседними свечами.'
      );
    }

    highlightLowerWick() {
      let target = 0;
      let longest = -1;

      this.candleNodes.forEach((node, index) => {
        const lowerBody = Math.min(
          node.candle.o,
          node.candle.c
        );

        const wickLength =
          lowerBody - node.candle.l;

        if (wickLength > longest) {
          longest = wickLength;
          target = index;
        }
      });

      this.candleNodes[target]?.wick.classList.add(
        'is-focus'
      );

      this.setCaption(
        'Длинная нижняя тень показывает область, которую цена не удержала.'
      );
    }

    highlightRejection() {
      const target = this.candleNodes[2];

      if (target) {
        target.group.classList.add('is-focus');
      }

      this.setCaption(
        'Rejection имеет смысл только вместе с контекстом.'
      );
    }

    highlightDoji() {
      this.candleNodes[0]?.group.classList.add(
        'is-focus'
      );

      this.setCaption(
        'Open и Close находятся рядом — рынок показал нерешительность.'
      );
    }

    highlightEngulfing() {
      this.candleNodes.forEach(node => {
        node.group.classList.add('is-focus');
      });

      this.setCaption(
        'Engulfing читается как взаимодействие двух свечей.'
      );
    }

    setCaption(text) {
      if (this.caption) {
        this.caption.textContent = text;
      }
    }

    setScene(sceneName, options = {}) {
      this.options = {
        ...this.options,
        ...options,
        scene: sceneName
      };

      this.render();
    }

    setInteractive(enabled = true) {
      this.options.interactive = enabled;
      this.render();
    }

    revealCorrect(index) {
      const node = this.candleNodes[index];
      if (!node) return;

      node.group.classList.add('is-correct');

      this.characterState('correct');
    }

    revealIncorrect(selectedIndex, correctIndex) {
      const selected =
        this.candleNodes[selectedIndex];

      const correct =
        this.candleNodes[correctIndex];

      selected?.group.classList.add('is-incorrect');
      correct?.group.classList.add('is-correct');

      this.characterState('incorrect');
    }

    reset() {
      this.selectedIndex = null;
      this.render();
    }

    destroy() {
      this.destroyed = true;
      this.clear();

      if (this.container) {
        this.container.classList.remove(
          'market-ai-candle-scene'
        );
      }
    }
  }

  function injectStyles() {
    if (
      document.getElementById(
        'market-ai-candle-scene-styles'
      )
    ) {
      return;
    }

    const style = document.createElement('style');

    style.id = 'market-ai-candle-scene-styles';

    style.textContent = `
      .market-ai-candle-scene {
        width: 100%;
        margin: 14px 0;
      }

      .candle-scene-shell {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(99, 220, 255, .18);
        border-radius: 22px;
        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(38, 170, 210, .10),
            transparent 45%
          ),
          rgba(7, 13, 24, .92);
        opacity: 0;
        transform: translateY(8px);
        transition:
          opacity .35s ease,
          transform .35s ease;
      }

      .candle-scene-shell.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .candle-scene-badge {
        position: absolute;
        z-index: 3;
        top: 12px;
        left: 14px;
        padding: 6px 9px;
        border-radius: 999px;
        border: 1px solid rgba(105, 225, 255, .18);
        background: rgba(5, 14, 25, .82);
        color: #76ddf5;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .12em;
      }

      .candle-scene-stage {
        min-height: 250px;
        padding: 12px;
      }

      .candle-scene-stage svg {
        display: block;
        width: 100%;
        height: 250px;
        overflow: visible;
      }

      .candle-grid line {
        stroke: rgba(145, 175, 205, .08);
        stroke-width: 1;
      }

      .academy-candle {
        cursor: default;
        transform-box: fill-box;
        transform-origin: center bottom;
        animation:
          marketAICandleBuild .45s
          cubic-bezier(.2,.8,.2,1)
          both;
        animation-delay: var(--candle-delay, 0ms);
      }

      .academy-candle.is-interactive {
        cursor: pointer;
      }

      .candle-wick {
        stroke-width: 3;
        stroke-linecap: round;
      }

      .academy-candle.is-bullish .candle-wick,
      .academy-candle.is-bullish .candle-body {
        stroke: #65e6c4;
        fill: rgba(101, 230, 196, .22);
      }

      .academy-candle.is-bearish .candle-wick,
      .academy-candle.is-bearish .candle-body {
        stroke: #ff7088;
        fill: rgba(255, 112, 136, .22);
      }

      .candle-body {
        stroke-width: 2;
        transition:
          filter .25s ease,
          opacity .25s ease,
          transform .25s ease;
      }

      .academy-candle.is-interactive:active {
        transform: scale(.96);
      }

      .academy-candle.is-selected .candle-body {
        filter:
          drop-shadow(0 0 9px rgba(107, 221, 255, .8));
        stroke: #8be8ff;
      }

      .academy-candle.is-focus .candle-body,
      .academy-candle.is-focus .candle-wick,
      .candle-body.is-focus,
      .candle-wick.is-focus {
        filter:
          drop-shadow(0 0 8px rgba(105, 225, 255, .9));
      }

      .academy-candle.is-correct .candle-body,
      .academy-candle.is-correct .candle-wick {
        stroke: #7cf1bd;
        filter:
          drop-shadow(0 0 10px rgba(124, 241, 189, .8));
      }

      .academy-candle.is-incorrect .candle-body,
      .academy-candle.is-incorrect .candle-wick {
        stroke: #ff758c;
        filter:
          drop-shadow(0 0 8px rgba(255, 117, 140, .65));
      }

      .candle-guide {
        stroke: rgba(117, 221, 250, .55);
        stroke-width: 1;
        stroke-dasharray: 4 4;
        animation: marketAIGuide .5s ease both;
      }

      .candle-label {
        fill: #8de7fa;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .08em;
        animation: marketAILabel .5s ease both;
      }

      .candle-scene-caption {
        min-height: 48px;
        padding: 0 18px 16px;
        color: rgba(220, 232, 248, .76);
        font-size: 13px;
        line-height: 1.5;
        text-align: center;
      }

      @keyframes marketAICandleBuild {
        from {
          opacity: 0;
          transform: scaleY(.08);
        }

        to {
          opacity: 1;
          transform: scaleY(1);
        }
      }

      @keyframes marketAIGuide {
        from {
          opacity: 0;
          stroke-dashoffset: 18;
        }

        to {
          opacity: 1;
          stroke-dashoffset: 0;
        }
      }

      @keyframes marketAILabel {
        from {
          opacity: 0;
          transform: translateY(3px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 520px) {
        .candle-scene-stage {
          min-height: 220px;
          padding: 8px;
        }

        .candle-scene-stage svg {
          height: 220px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .candle-scene-shell,
        .academy-candle,
        .candle-guide,
        .candle-label {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  injectStyles();

  window.CandleScene = CandleScene;

  window.MarketAICandleScenes = {
    scenes: SCENES,

    create(container, options) {
      return new CandleScene(container, options);
    }
  };

  console.info(
    '[MARKET AI ACADEMY] Candle Scene Engine ready'
  );
})();
