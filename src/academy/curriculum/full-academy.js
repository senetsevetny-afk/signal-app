/* MARKET AI Academy — сборка основной учебной программы (304 урока).

   Что изменилось: раньше этот файл сам генерировал текст уроков по одному
   шаблону, где менялось только название темы. Теперь он только собирает
   уроки из авторского содержания (content-*.js) и ничего не пишет сам.
   Тема без авторского текста в программу не попадает — вместо заглушки
   в лог уходит ошибка.

   Список тем, их порядок, slug-функция и правило выбора модуля оставлены
   без изменений: от них зависят идентификаторы уроков вида
   full_binary_01_binary_contract_recap, а на идентификаторах держится
   сохранённый прогресс. Менять их нельзя.

   Только обучение. Никаких обещаний прибыли и win-rate. */
(function(){
  'use strict';
  const C=window.MarketAIAcademy?.Curriculum;if(!C)return;
  const Content=window.MarketAIAcademy?.Content;
  if(!Content){(window.logErr||console.error)('FullAcademy','реестр содержания не загружен — программа не собрана');return}

  const worlds={
    w_basics:{module:['m_market','m_chart'],icon:'📘',topics:['Что такое рынок','Цена и котировка','Bid и Ask','Spread','Ликвидность','Волатильность','Участники рынка','Спрос и предложение','Рыночный контекст','График цены','Шкала времени','Шкала цены','Типы графиков','Свечи как язык цены','OHLC обзор','Импульс и коррекция','Диапазон','Тренд','Шум рынка','Сессии рынка','Новости и волатильность','Гэпы и резкие движения','Объём: базовая идея','Почему цена движется','Наблюдение без прогноза','Контекст перед решением','Подтверждение идеи','Противоречащие признаки','Неопределённость','SKIP как решение','План анализа','Чек-лист перед практикой','Типичные ошибки новичка','Как читать слева направо','История против будущего','Вероятность и неопределённость','Тренировочные данные','Мини-практика основ']},
    w_candles:{module:['m_anatomy','m_patterns'],icon:'🕯',topics:['Open High Low Close','Тело свечи','Верхняя тень','Нижняя тень','Бычья свеча','Медвежья свеча','Размер тела','Длина теней','Диапазон свечи','Сильный импульс','Слабый импульс','Rejection','Indecision','Doji','Pin-style форма','Engulfing: идея','Inside candle: идея','Outside candle: идея','Последовательность свечей','Две свечи в контексте','Три свечи в контексте','Свеча у уровня','Свеча в тренде','Свеча в диапазоне','Ложная уверенность','Большая свеча после импульса','Малые свечи и сжатие','Расширение диапазона','Тени и борьба сторон','Закрытие свечи','Незакрытая свеча','Контекст важнее формы','Паттерн без контекста','Сравнение тел','Сравнение теней','Поиск свечи на графике','Candle replay','Итоговая практика свечей']},
    w_trend:{module:['m_phases','m_structure'],icon:'📈',topics:['Что такое тренд','Восходящий тренд','Нисходящий тренд','Боковой рынок','Сила тренда','Ослабление тренда','Импульс','Коррекция','Swing High','Swing Low','Higher High','Higher Low','Lower High','Lower Low','Последовательность HH-HL','Последовательность LH-LL','Структура роста','Структура падения','Структура диапазона','Смена поведения','Break of Structure: идея','Не каждый пробой — смена','Continuation','Reversal','Глубина коррекции','Скорость импульса','Сжатие перед движением','Расширение','Структура на шумном рынке','Выбор swing-точек','Ошибочный swing','Контекст структуры','Структура и уровни','Структура и свечи','Multi-step marking','Trend replay','Неясная структура и SKIP','Итоговая практика структуры']},
    w_levels:{module:['m_zones','m_breakouts'],icon:'📐',topics:['Что такое уровень','Support','Resistance','Зона вместо линии','Реакция цены','Повторный тест','Сила зоны','Свежая зона','Старая зона','Касания уровня','Прокол уровня','Закрытие за уровнем','Breakout','False breakout','Retest','Role reversal','Support становится resistance','Resistance становится support','Импульс к уровню','Слабый подход к уровню','Сжатие у уровня','Волатильность у уровня','Уровень внутри диапазона','Граница диапазона','Уровень в тренде','Контекст пробоя','Подтверждение пробоя','Ложное подтверждение','Drag level практика','Tap zone практика','Несколько близких уровней','Приоритет зоны','Уровень и свечная реакция','Уровень и структура','Не торговать середину шума','Breakout replay','False breakout replay','Итоговая практика уровней']},
    w_indi:{module:['m_osc','m_trendind'],icon:'📉',topics:['Что такое индикатор','Цена первична','Lagging nature','Moving Average','SMA','EMA','Наклон средней','Цена относительно MA','Пересечение средних','RSI: основа','RSI зоны','RSI не равен BUY/SELL','RSI в тренде','RSI в диапазоне','MACD: основа','MACD momentum','Bollinger Bands','Ширина Bollinger','ATR','ATR и волатильность','Дивергенция: идея','Ложная дивергенция','Confluence','Конфликт индикаторов','Индикатор и структура','Индикатор и уровень','Индикатор и свечи','Параметры индикатора','Overfitting','Слишком много индикаторов','Confirmation bias','Трендовый индикатор в range','Осциллятор в тренде','Volatility filter','Сравнение сигналов','Когда индикатор не помогает','SKIP при конфликте','Итоговая практика индикаторов']},
    w_mtf:{module:['m_timeframes'],icon:'🔭',topics:['Что такое timeframe','1m и шум','5m контекст','15m контекст','1h контекст','Higher timeframe','Lower timeframe','Top-down анализ','Контекст старшего TF','Точка входа младшего TF','Конфликт таймфреймов','Тренд на разных TF','Range на разных TF','Уровни старшего TF','Свечи младшего TF','Структура старшего TF','Структура младшего TF','Синхронизация контекста','Не смешивать масштабы','Шум и детализация','Слишком короткий TF','Слишком длинный TF','Выбор TF под задачу','Время до экспирации','TF и volatility','TF и market session','TF и новости','Multi-timeframe checklist','Два TF достаточно','Три TF: когда нужно','Ложный конфликт','Настоящий конфликт','Приоритет контекста','Подтверждение младшим TF','SKIP при конфликте TF','Replay нескольких TF','Практика top-down','Итоговая MTF практика']},
    w_risk:{module:['m_money','m_psy'],icon:'🛡',topics:['Что такое риск','Вероятность','Expected value','Payout','Break-even','Размер риска','Серия убытков','Drawdown','Capital preservation','Лимит на решение','Лимит на сессию','Overexposure','Корреляция рисков','Не увеличивать риск из эмоций','Martingale: математика риска','Recovery fallacy','FOMO','Revenge trading','Overtrading','Tilt','Confirmation bias','Loss chasing','Страх пропустить','Страх после убытка','Дисциплина','Ожидание','SKIP','Журнал решений','Process over outcome','Decision Quality','Outcome variance','Хорошее решение — плохой исход','Плохое решение — хороший исход','Пауза после серии','Чек-лист риска','Психология и размер позиции','План сессии','Итоговая практика риска']},
    w_binary:{module:['m_contract','m_timing'],icon:'🎯',topics:['Binary contract recap','CALL / UP практика','PUT / DOWN практика','Strike recap','Expiration recap','Payout recap','Break-even практика','Контракт и правила платформы','Direction против timing','Timing против outcome','Короткая экспирация','Длиннее не значит лучше','Контекст перед CALL','Контекст перед PUT','Range и binary','Trend и binary','Уровень и expiration','Volatility и expiration','Bad timing','Good analysis bad expiration','OTC: правила среды','OTC: ограничения','OTC и неопределённость','No Trade в binary','Конфликт сигналов','Payout и решение','Martingale risk demo','Серия убытков','Decision Quality','Lucky win','Unlucky loss','Hidden future candles','CALL/PUT/SKIP scenario','Контекст → timing → решение','Binary replay','Binary risk checklist','Binary practice lab','Binary mastery check']}
  };

  /* Ниже — прежняя логика идентификаторов. Не трогать. */
  const slug=s=>s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi,'_').replace(/^_|_$/g,'').slice(0,34);
  const lessons=[]; const missing=[];

  Object.entries(worlds).forEach(([worldId,cfg])=>{
    let prev=null;
    cfg.topics.forEach((topic,i)=>{
      const moduleId=cfg.module[Math.min(cfg.module.length-1,Math.floor(i/(cfg.topics.length/cfg.module.length)))];
      const id=`full_${worldId.slice(2)}_${String(i+1).padStart(2,'0')}_${slug(topic)}`;
      const scenarioId=`mega_${String((Object.keys(worlds).indexOf(worldId)*cfg.topics.length+i)%1050+1).padStart(4,'0')}`;
      const body=Content.get(worldId,topic);
      if(!body){ missing.push(`${worldId} · ${topic}`); return }
      lessons.push({
        id,worldId,moduleId,order:200+i*10,icon:cfg.icon,title:topic,
        subtitle:body.subtitle||body.explain.slice(0,90).replace(/\s+\S*$/,'')+'…',
        difficulty:i<12?'beginner':i<28?'intermediate':'advanced',
        estimatedTime:6+(i%4),xp:20+(i%3)*5,
        prerequisites:prev?[prev]:[],characterState:'welcome',source:'curriculum',
        steps:Content.buildSteps(topic,body,scenarioId),
        quiz:[],practice:[{scenarioId,type:'decision'}]
      });
      prev=id;
    });
  });

  if(missing.length){
    (window.logErr||console.error)('FullAcademy','нет авторского содержания для '+missing.length+' тем: '+missing.slice(0,6).join(' | ')+(missing.length>6?' …':''));
  }
  C.registerSafe('curriculum_full_academy_v1',{id:'curriculum_full_academy_v1',version:'2.0.0',title:'MARKET AI Full Academy',lessons});
  console.log('[MARKET AI] Full curriculum registered:',lessons.length,'lessons ·',missing.length,'без содержания');
})();
