/* ═══════════════════════════════════════════════════════════
   MARKET AI ACADEMY — PHASE 2
   Модели данных, реестры, прогресс, валидация.
   Только данные и чистые функции: UI здесь нет.
   Блок переносится в отдельный модуль без правок при переходе на сборку.
   ═══════════════════════════════════════════════════════════ */

/* ── Типы шагов урока (спецификация V2, раздел 55) ── */
const STEP_TYPES=['intro','character_message','explanation','chart','highlight_candle',
  'highlight_zone','draw_line','show_indicator','show_pattern','animation','question',
  'tap_candle','tap_zone','select_direction','multiple_choice','true_false','market_tip',
  'warning','example','counter_example','summary','explain_to_market_ai','market_replay',
  'scenario_tree','comparison','drag_level','mark_structure','mark_structure_sequence'];

/* ── Состояния персонажа, допустимые в уроках ── */
const CHAR_STATES=['idle','loading','CALL','PUT','wait','analytics','history','think',
  'shield','globe','bell','listen','hero','wave','error'];

/* ── Жизненный цикл освоения (раздел 120) ── */
const MASTERY=['none','learned','practiced','tested','mastered'];

/* ── Миры академии. Стабильные идентификаторы, не менять. ── */
const WORLDS=[
  {id:'w_basics',   ic:'📘', order:10, titleKey:'w.basics',   modules:['m_market','m_chart']},
  {id:'w_candles',  ic:'🕯', order:20, titleKey:'w.candles',  modules:['m_anatomy','m_patterns']},
  {id:'w_trend',    ic:'📈', order:30, titleKey:'w.trend',    modules:['m_phases','m_structure']},
  {id:'w_levels',   ic:'📐', order:40, titleKey:'w.levels',   modules:['m_zones','m_breakouts']},
  {id:'w_indi',     ic:'📉', order:50, titleKey:'w.indi',     modules:['m_osc','m_trendind']},
  {id:'w_mtf',      ic:'🔭', order:60, titleKey:'w.mtf',      modules:['m_timeframes']},
  {id:'w_risk',     ic:'🛡', order:70, titleKey:'w.risk',     modules:['m_money','m_psy']},
  {id:'w_binary',   ic:'🎯', order:80, titleKey:'w.binary',   modules:['m_contract','m_timing']}
];

const MODULES=[
  {id:'m_market',    worldId:'w_basics',  order:10, titleKey:'m.market'},
  {id:'m_chart',     worldId:'w_basics',  order:20, titleKey:'m.chart'},
  {id:'m_anatomy',   worldId:'w_candles', order:10, titleKey:'m.anatomy'},
  {id:'m_patterns',  worldId:'w_candles', order:20, titleKey:'m.patterns'},
  {id:'m_phases',    worldId:'w_trend',   order:10, titleKey:'m.phases'},
  {id:'m_structure', worldId:'w_trend',   order:20, titleKey:'m.structure'},
  {id:'m_zones',     worldId:'w_levels',  order:10, titleKey:'m.zones'},
  {id:'m_breakouts', worldId:'w_levels',  order:20, titleKey:'m.breakouts'},
  {id:'m_osc',       worldId:'w_indi',    order:10, titleKey:'m.osc'},
  {id:'m_trendind',  worldId:'w_indi',    order:20, titleKey:'m.trendind'},
  {id:'m_timeframes',worldId:'w_mtf',     order:10, titleKey:'m.timeframes'},
  {id:'m_money',     worldId:'w_risk',    order:10, titleKey:'m.money'},
  {id:'m_psy',       worldId:'w_risk',    order:20, titleKey:'m.psy'},
  {id:'m_contract',  worldId:'w_binary',  order:10, titleKey:'m.contract'},
  {id:'m_timing',    worldId:'w_binary',  order:20, titleKey:'m.timing'}
];

/* ── Реестр уроков. Единственный источник правды (раздел 136). ──
   На этой фазе заполнен каркас из существующих 11 статей обучения:
   каждая статья становится уроком с шагами explanation.
   Интерактивные шаги добавляются в Phase 5, пока их нет честно. */
function lessonFromArticle(art,moduleId,order,prereq){
  const mod=MODULES.find(m=>m.id===moduleId);
  return {
    id:'l_'+art.id,
    worldId:mod?mod.worldId:null,
    moduleId,
    order,
    icon:art.ic,
    titleKey:'l.'+art.id+'.title',
    subtitleKey:'l.'+art.id+'.short',
    difficulty:1,
    estimatedTime:4,
    xp:20,
    prerequisites:prereq||[],
    characterState:'think',
    steps:[
      {type:'intro',characterState:'hero',textKey:'l.'+art.id+'.title'},
      ...art.blocks.map((b,i)=>({
        type:'explanation',
        characterState:'think',
        titleKey:'l.'+art.id+'.b'+i+'.title',
        bodyKeys:b.slice(1).map((_,j)=>'l.'+art.id+'.b'+i+'.p'+j)
      })),
      {type:'summary',characterState:'idle',textKey:'l.'+art.id+'.summary'}
    ],
    quiz:[],        // [PLANNED] Phase 5
    practice:[],    // [PLANNED] Phase 14
    source:'edu'    // помечаем происхождение: перенесено из статей
  };
}

const LESSON_MAP={
  basics:['m_market',10,[]],       trend:['m_phases',10,['l_basics']],
  levels:['m_zones',10,['l_trend']], patterns:['m_patterns',10,['l_candles']],
  candles:['m_anatomy',10,['l_basics']], indi:['m_osc',10,['l_trend']],
  mtf:['m_timeframes',10,['l_trend']], risk:['m_money',10,[]],
  math:['m_money',20,['l_risk']],   mistakes:['m_psy',10,['l_risk']],
  glossary:['m_chart',10,[]]
};

function buildLessonRegistry(){
  const out=[];
  (typeof EDU!=='undefined'?EDU:[]).forEach(a=>{
    const m=LESSON_MAP[a.id];
    if(!m){ logErr('LessonRegistry','нет привязки модуля для '+a.id); return }
    out.push(lessonFromArticle(a,m[0],m[1],m[2]));
  });
  return out;
}
let LESSONS=[];

/* First deterministic interactive checkpoint. Content stays in the lesson data,
   while Lesson Engine only knows how to render/score the generic step shape. */
function addPhase5InteractiveSteps(){
  const risk=LESSONS.find(l=>l.id==='l_risk');
  if(!risk||risk.steps.some(s=>s.id==='q_risk_limits_1'))return;
  const summaryIndex=risk.steps.findIndex(s=>s.type==='summary');
  const question={
    id:'q_risk_limits_1',
    type:'true_false',
    characterState:'shield',
    prompt:'После серии убытков безопаснее соблюдать заранее заданные лимиты, чем увеличивать ставку ради быстрого отыгрыша.',
    options:[
      {id:'true',label:'Верно'},
      {id:'false',label:'Неверно'}
    ],
    correctAnswer:'true',
    feedback:{
      correct:'Верно. Размер ставки не делает прогноз точнее. Заранее заданные лимиты помогают не превращать серию убытков в погоню за потерями.',
      incorrect:'Не совсем. Увеличение ставки после убытка повышает риск, но не повышает точность следующего прогноза. Лимиты задают до сессии.'
    }
  };
  risk.steps.splice(summaryIndex<0?risk.steps.length:summaryIndex,0,question);
}

/* Checkpoint 09 — first direct chart interaction.
   The learner must identify a candle on deterministic training data. */
function addPhase9TapCandleStep(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='tc_strong_bull_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const step={
    id:'tc_strong_bull_1', type:'tap_candle', characterState:'point',
    scenarioId:'sc_trend_up_1', title:'Найди свечу на графике',
    prompt:'Нажми на самую сильную бычью свечу среди показанных. Сравни размер тела свечей.',
    targetRule:'largest_bullish_body',
    feedback:{
      correct:'Верно. У выбранной бычьей свечи самое крупное тело среди показанных: закрытие заметно выше открытия.',
      incorrect:'Посмотри именно на тело свечи — расстояние между открытием и закрытием. Найди зелёную свечу с самым большим телом.'
    }
  };
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,step);
}


/* Checkpoint 10 — first semantic support/resistance zone task. */
function addPhase10TapZoneStep(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='tz_support_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const step={
    id:'tz_support_1', type:'tap_zone', characterState:'point', scenarioId:'sc_range_1',
    title:'Отметь зону поддержки', targetRule:'support_zone',
    prompt:'Проведи пальцем по вертикали графика и выдели область, где цена несколько раз удерживалась снизу. Ищи зону, а не одну идеальную линию.',
    feedback:{
      correct:'Хорошо. Выбранная область совпадает с нижней зоной, где цена неоднократно встречала спрос. Поддержка — это область, а не точная цена.',
      incorrect:'Сравни несколько минимумов. Поддержка обычно выглядит как область повторных реакций цены, а не как случайная точка в середине диапазона.'
    }
  };
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,step);
}


/* Checkpoint 11 — resistance, precise level placement and first structure marks. */
function addPhase11MarketReadingSteps(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='tz_resistance_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const steps=[
    {id:'tz_resistance_1',type:'tap_zone',characterState:'point',scenarioId:'sc_range_1',title:'Отметь зону сопротивления',targetRule:'resistance_zone',prompt:'Выдели верхнюю область, где рост цены несколько раз останавливался. Ищи повторные реакции, а не одну случайную вершину.',feedback:{correct:'Да. Это верхняя область повторных реакций — сопротивление читается как зона.',incorrect:'Смотри на несколько верхних реакций. Одна отдельная высокая тень ещё не делает область качественным сопротивлением.'}},
    {id:'dl_resistance_1',type:'drag_level',characterState:'point',scenarioId:'sc_range_1',title:'Поставь рабочий уровень',targetRule:'resistance_zone',prompt:'Теперь нажми внутри найденной зоны сопротивления и поставь рабочий горизонтальный уровень.',feedback:{correct:'Хорошо. Линия находится внутри рабочей зоны. Линия помогает ориентироваться, но сама зона важнее точной цены.',incorrect:'Линия ушла слишком далеко от области повторных верхних реакций. Вернись к зоне и выбери уровень внутри неё.'}},
    {id:'ms_hh_1',type:'mark_structure',characterState:'point',scenarioId:'sc_trend_up_1',title:'Найди Higher High',targetRule:'latest_hh',prompt:'На восходящем учебном графике нажми на самый высокий swing — текущий Higher High (HH).',feedback:{correct:'Верно. Новый максимум выше предыдущих — это HH и часть бычьей структуры.',incorrect:'Ищи максимум, который расположен выше предыдущих swing-high. MARKET AI отметил эталон после твоего выбора.'}},
    {id:'ms_ll_1',type:'mark_structure',characterState:'point',scenarioId:'sc_trend_dn_1',title:'Найди Lower Low',targetRule:'latest_ll',prompt:'На нисходящем учебном графике нажми на самый низкий swing — текущий Lower Low (LL).',feedback:{correct:'Верно. Новый минимум ниже предыдущих — это LL и часть медвежьей структуры.',incorrect:'Ищи минимум ниже предыдущих swing-low. После ответа сравни свою точку с отметкой LL.'}}
  ];
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,...steps);
}


/* Checkpoint 12 — ordered multi-swing market-structure reading. */
function addPhase12StructureSequenceSteps(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='mss_up_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const steps=[
    {id:'mss_up_1',type:'mark_structure_sequence',characterState:'point',scenarioId:'sc_structure_up_1',title:'Собери бычью структуру',targetRule:'up_hh_hl_hh',labels:['HH','HL','HH'],prompt:'Отметь три swing-точки по порядку: первый Higher High → Higher Low → новый Higher High.',feedback:{correct:'Верно. Ты прочитал последовательность HH → HL → HH: новый максимум, удержанный более высокий минимум и продолжение структуры.',incorrect:'Смотри на порядок swing-точек. После твоей попытки MARKET AI соединит эталон: HH → HL → HH.'}},
    {id:'mss_down_1',type:'mark_structure_sequence',characterState:'point',scenarioId:'sc_structure_dn_1',title:'Собери медвежью структуру',targetRule:'down_lh_ll',labels:['LH','LL'],prompt:'Теперь отметь две swing-точки по порядку: Lower High → новый Lower Low.',feedback:{correct:'Верно. LH → LL показывает более низкий максимум и продолжение вниз к новому минимуму.',incorrect:'Сначала найди более низкий swing-high (LH), затем следующий более низкий swing-low (LL). Эталон появится только после попытки.'}}
  ];
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,...steps);
}



/* Checkpoint 13 — role reversal, breakout/retest and false-breakout decisions. */
function addPhase13BreakoutRetestSteps(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='br_role_reversal_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const opts=[{id:'enter',label:'▶ ENTER'},{id:'wait',label:'◷ WAIT'},{id:'skip',label:'⊘ SKIP'}];
  const steps=[
    {id:'br_role_reversal_1',type:'select_direction',decisionMode:'entry_timing',characterState:'point',scenarioId:'sc_role_reversal_1',title:'Смена роли уровня',prompt:'Цена пробила сопротивление и впервые возвращается к нему сверху. Что лучше сделать прямо в момент касания, пока реакции ещё нет?',options:opts,correctAnswer:'wait',feedback:{correct:'Верно. Старое сопротивление может стать поддержкой, но сама смена роли ещё требует реакции/подтверждения. На первом касании WAIT дисциплинированнее автоматического входа.',incorrect:'Пробитый уровень может сменить роль, но это не делает каждое касание готовым входом. Сначала дождись реакции цены; если контекст испортится, SKIP остаётся допустимым решением.'}},
    {id:'br_breakout_only_1',type:'select_direction',decisionMode:'entry_timing',characterState:'warning',scenarioId:'sc_breakout_only_1',title:'Пробой без ретеста',prompt:'Сильная свеча только что пробила уровень вверх и уже ушла от него. Какое решение лучше сейчас?',options:opts,correctAnswer:'wait',feedback:{correct:'Да. Сам пробой ещё не равен качественному входу. WAIT позволяет не гнаться за уже ушедшей свечой и посмотреть, удержится ли цена над уровнем.',incorrect:'Вход сразу после растянутой пробойной свечи легко превращается в chasing. Лучше не считать один пробой достаточным подтверждением.'}},
    {id:'br_retest_confirmed_1',type:'select_direction',decisionMode:'entry_timing',characterState:'point',scenarioId:'sc_retest_confirmed_1',title:'Пробой → ретест → реакция',prompt:'После пробоя цена вернулась к уровню сверху, удержала его и сформировала реакцию вверх. Как оценить ситуацию?',options:opts,correctAnswer:'enter',feedback:{correct:'Верно как учебный разбор: здесь есть последовательность пробой → возврат → удержание → реакция. Это потенциальный setup, а не гарантия результата; риск и внешний контекст всё равно проверяются отдельно.',incorrect:'Здесь уже есть больше контекста, чем при голом пробое: уровень удержан после ретеста и появилась реакция. В учебном сценарии это потенциальная точка входа, но не обещание результата.'}},
    {id:'br_false_breakout_1',type:'select_direction',decisionMode:'entry_timing',characterState:'warning',scenarioId:'sc_false_breakout_1',title:'Ложный пробой',prompt:'Цена вышла выше сопротивления, но быстро вернулась под уровень и закрепиться сверху не смогла. Что делать?',options:opts,correctAnswer:'skip',feedback:{correct:'Верно. Возврат под уровень ломает идею подтверждённого пробоя. SKIP защищает от попытки заставить рынок подтвердить первоначальную гипотезу.',incorrect:'После быстрого возврата под уровень пробой не подтверждён. Не нужно входить только потому, что цена на мгновение была выше сопротивления.'}}
  ];
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,...steps);
}

/* Checkpoint 14 — staged Market Replay with hidden future candles. */
function addPhase14MarketReplayStep(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='mr_breakout_retest_1'))return;
  const before=basics.steps.findIndex(s=>s.id==='sd_range_skip_1');
  const opts=[{id:'enter',label:'▶ ENTER'},{id:'wait',label:'◷ WAIT'},{id:'skip',label:'⊘ SKIP'}];
  const step={id:'mr_breakout_retest_1',type:'market_replay',characterState:'thinking',scenarioId:'sc_retest_confirmed_1',title:'Market Replay: пробой и ретест',prompt:'Открывай рынок по этапам. На остановках принимай решение, не видя будущих свечей.',stops:[28,37,42],gates:[
    {prompt:'Цена подошла к ключевому сопротивлению, но подтверждённого пробоя ещё нет. Что делать?',options:opts,correctAnswer:'wait',feedback:{correct:'Верно. До подтверждения пробоя нет причины торопиться.',incorrect:'Будущего движения ещё не видно. Сам подход к уровню не делает ENTER обязательным.'}},
    {prompt:'Пробой уже произошёл, цена возвращается к уровню сверху, но реакция ещё формируется. Что делать?',options:opts,correctAnswer:'wait',feedback:{correct:'Верно. Ретест без реакции — ещё не завершённое подтверждение.',incorrect:'Не подменяй ожидание подтверждения догадкой. На этом этапе WAIT сохраняет процесс.'}},
    {prompt:'Уровень удержан после ретеста и появилась реакция вверх. Как оценить учебную ситуацию?',options:opts,correctAnswer:'enter',feedback:{correct:'В учебном сценарии последовательность пробой → ретест → удержание → реакция сформирована. Это потенциальный setup, не гарантия результата.',incorrect:'Теперь контекст изменился: после ретеста появилась реакция. Это уже не тот же этап, что голый пробой.'}}
  ]};
  basics.steps.splice(before<0?Math.max(0,basics.steps.length-1):before,0,step);
}

/* First chart-backed decision step. It intentionally uses a NO TRADE scenario:
   SKIP is a first-class decision, not a fallback action. */
function addPhase6ScenarioStep(){
  const basics=LESSONS.find(l=>l.id==='l_basics');
  if(!basics||basics.steps.some(s=>s.id==='sd_range_skip_1'))return;
  const summaryIndex=basics.steps.findIndex(s=>s.type==='summary');
  const step={
    id:'sd_range_skip_1', type:'select_direction', characterState:'wait',
    scenarioId:'sc_range_1', title:'Решение по графику',
    prompt:'Цена находится в неясной зоне без устойчивого направления. Что лучше сделать?',
    options:[
      {id:'up',label:'↑ UP'}, {id:'down',label:'↓ DOWN'}, {id:'skip',label:'⊘ SKIP'}
    ],
    correctAnswer:'skip',
    feedback:{
      correct:'Верно: здесь нет качественного направления. SKIP сохраняет дисциплину и является полноценным решением.',
      incorrect:'На этом графике нет достаточно ясного преимущества для UP или DOWN. Когда контекст слабый, решение SKIP лучше принудительного входа.'
    }
  };
  basics.steps.splice(summaryIndex<0?basics.steps.length:summaryIndex,0,step);
}

/* ── Реестр сценариев (раздел 69). Детерминированные фикстуры. ── */
const SCENARIO_TYPES=['ideal','weak','false','ambiguous','no_trade'];

/* Генератор OHLC по зерну: одинаковое зерно даёт одинаковый ряд. */
function seededOHLC(seed,n,opts){
  const o=opts||{};
  let s=seed>>>0, p=o.start||100;
  const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296 };
  const drift=o.drift||0, vol=o.vol||0.6, out=[];
  for(let i=0;i<n;i++){
    const op=p;
    p=Math.max(0.01,p+(rnd()-0.5)*vol+drift);
    const hi=Math.max(op,p)+rnd()*vol*0.4;
    const lo=Math.min(op,p)-rnd()*vol*0.4;
    out.push({t:i*60000,o:op,h:hi,l:lo,c:p,v:1000+rnd()*500,ct:(i+1)*60000});
  }
  return out;
}

function makeScenario(cfg){
  return {
    id:cfg.id,
    marketType:cfg.marketType||'crypto',
    timeframe:cfg.timeframe||'5m',
    regime:cfg.regime||'trend',
    seed:cfg.seed,
    candles:cfg.n||80,
    type:cfg.type,
    difficulty:cfg.difficulty||1,
    correctAnswer:cfg.correct,                 // 'up' | 'down' | 'skip'
    acceptableAnswers:cfg.acceptable||[cfg.correct],
    conflicts:cfg.conflicts||[],
    riskFactors:cfg.riskFactors||[],
    explainKey:'s.'+cfg.id+'.explain',
    dataLabel:'TRAINING SCENARIO',             // раздел 67: никогда не LIVE
    ohlc(){ return seededOHLC(cfg.seed,cfg.n||80,cfg.gen||{}) }
  };
}


function structuredOHLC(direction){
  const anchors=direction==='up'?
    [[0,100],[10,106],[22,103.4],[36,110],[41,108.8]]:
    [[0,110],[10,104],[22,107.0],[36,100],[41,101.2]];
  const out=[];
  for(let i=0;i<42;i++){
    let a=anchors[0],b=anchors[1];
    for(let j=0;j<anchors.length-1;j++)if(i>=anchors[j][0]&&i<=anchors[j+1][0]){a=anchors[j];b=anchors[j+1];break}
    const t=(i-a[0])/Math.max(1,b[0]-a[0]);
    const base=a[1]+(b[1]-a[1])*t;
    const wobble=Math.sin(i*1.7)*.12;
    const close=base+wobble,open=i?out[i-1].c:close-.08;
    out.push({t:i*60000,o:open,h:Math.max(open,close)+.16,l:Math.min(open,close)-.16,c:close,v:1100+(i%7)*35,ct:(i+1)*60000});
  }
  return out;
}
function makeStructureScenario(id,direction){return {id,marketType:'training',timeframe:'5m',regime:'trend',type:'ideal',difficulty:2,correctAnswer:null,acceptableAnswers:[],conflicts:[],riskFactors:[],dataLabel:'TRAINING SCENARIO',ohlc(){return structuredOHLC(direction)}}}


function eventOHLC(kind){
  const level=105, out=[];
  const anchors={
    role:[[0,101.8],[10,104.6],[17,105.8],[27,107.0],[36,105.15],[41,105.25]],
    breakout:[[0,101.8],[14,104.4],[28,104.8],[35,105.2],[39,107.0],[41,107.35]],
    retest:[[0,101.8],[12,104.5],[20,106.4],[30,107.0],[36,105.15],[39,105.35],[41,106.15]],
    falsebreak:[[0,102.0],[15,104.5],[28,104.8],[34,105.9],[37,106.2],[39,104.75],[41,104.45]]
  }[kind];
  for(let i=0;i<42;i++){
    let a=anchors[0],b=anchors[1];
    for(let j=0;j<anchors.length-1;j++)if(i>=anchors[j][0]&&i<=anchors[j+1][0]){a=anchors[j];b=anchors[j+1];break}
    const t=(i-a[0])/Math.max(1,b[0]-a[0]), base=a[1]+(b[1]-a[1])*t;
    const close=base+Math.sin(i*1.31)*.055, open=i?out[i-1].c:close-.06;
    out.push({t:i*60000,o:open,h:Math.max(open,close)+.12,l:Math.min(open,close)-.12,c:close,v:1000+(i%5)*45,ct:(i+1)*60000});
  }
  return {level,out};
}
function makeEventScenario(id,kind,correct){
  return {id,marketType:'training',timeframe:'5m',regime:'level_event',type:kind==='falsebreak'?'false':'ideal',difficulty:3,correctAnswer:correct,acceptableAnswers:[correct],conflicts:[],riskFactors:[],dataLabel:'TRAINING SCENARIO',trainingMeta:{kind,level:105},ohlc(){return eventOHLC(kind).out}};
}

const SCENARIOS=[
  makeEventScenario('sc_role_reversal_1','role','wait'),
  makeEventScenario('sc_breakout_only_1','breakout','wait'),
  makeEventScenario('sc_retest_confirmed_1','retest','enter'),
  makeEventScenario('sc_false_breakout_1','falsebreak','skip'),
  makeStructureScenario('sc_structure_up_1','up'),
  makeStructureScenario('sc_structure_dn_1','down'),
  makeScenario({id:'sc_trend_up_1',type:'ideal',regime:'trend',seed:1001,n:80,
    gen:{drift:0.22,vol:0.5},correct:'up',difficulty:1}),
  makeScenario({id:'sc_trend_dn_1',type:'ideal',regime:'trend',seed:1002,n:80,
    gen:{drift:-0.22,vol:0.5},correct:'down',difficulty:1}),
  makeScenario({id:'sc_range_1',type:'no_trade',regime:'range',seed:1003,n:80,
    gen:{drift:0,vol:0.35},correct:'skip',difficulty:2,
    riskFactors:['нет направления','цена в середине диапазона']}),
  makeScenario({id:'sc_chaos_1',type:'ambiguous',regime:'chaos',seed:1004,n:80,
    gen:{drift:0,vol:1.4},correct:'skip',difficulty:3,
    conflicts:['высокая волатильность','структура не читается']}),
  makeScenario({id:'sc_weak_up_1',type:'weak',regime:'trend',seed:1005,n:80,
    gen:{drift:0.08,vol:0.9},correct:'skip',acceptable:['skip','up'],difficulty:4,
    conflicts:['слабый импульс','широкие тени']})
];

/* ── Прогресс. Новый ключ, старые не трогаем (раздел 131). ── */
const EDU_KEY='acs_edu_v2';
let EDUP=LS.get(EDU_KEY,{
  version:2, xp:0, lessons:{}, mistakes:{}, achievements:[],
  tourDone:false, experienceLevel:null, lastLesson:null
});
const eduSave=()=>LS.set(EDU_KEY,EDUP);

function lessonState(id){ return EDUP.lessons[id]||{mastery:'none',attempts:0,correct:0,ts:0} }
function lessonAvailable(l){
  return (l.prerequisites||[]).every(p=>{
    const st=lessonState(p).mastery;
    return st==='learned'||st==='practiced'||st==='tested'||st==='mastered';
  });
}
function setMastery(id,level){
  if(!MASTERY.includes(level))return logErr('setMastery','неизвестный уровень: '+level);
  const st=lessonState(id);
  if(MASTERY.indexOf(level)<=MASTERY.indexOf(st.mastery))return;   // не понижаем
  EDUP.lessons[id]={...st,mastery:level,ts:Date.now()};
  eduSave();
}
function addXP(n){ EDUP.xp=(EDUP.xp||0)+n; eduSave() }
function recordMistake(kind){
  EDUP.mistakes[kind]=(EDUP.mistakes[kind]||0)+1; eduSave();
}

/* ── Валидация контента (раздел 132). Ошибки не прячем. ── */
function validateAcademy(){
  const errors=[], warns=[];
  const ids=new Set(), wIds=new Set(WORLDS.map(w=>w.id)), mIds=new Set(MODULES.map(m=>m.id));

  MODULES.forEach(m=>{ if(!wIds.has(m.worldId))errors.push(`модуль ${m.id}: мира ${m.worldId} нет`) });
  WORLDS.forEach(w=>(w.modules||[]).forEach(m=>{
    if(!mIds.has(m))errors.push(`мир ${w.id}: модуля ${m} нет`) }));

  LESSONS.forEach(l=>{
    if(ids.has(l.id))errors.push(`дубль идентификатора урока: ${l.id}`);
    ids.add(l.id);
    if(!mIds.has(l.moduleId))errors.push(`урок ${l.id}: модуля ${l.moduleId} нет`);
    if(!l.steps||!l.steps.length)errors.push(`урок ${l.id}: нет шагов`);
    (l.steps||[]).forEach((s,i)=>{
      if(!STEP_TYPES.includes(s.type))errors.push(`урок ${l.id} шаг ${i}: тип ${s.type} неизвестен`);
      if(s.characterState&&!CHAR_STATES.includes(s.characterState))
        errors.push(`урок ${l.id} шаг ${i}: состояние ${s.characterState} неизвестно`);
    });
    if(!l.quiz.length)warns.push(`урок ${l.id}: нет проверки знаний [PLANNED]`);
  });
  LESSONS.forEach(l=>(l.prerequisites||[]).forEach(p=>{
    if(!ids.has(p))errors.push(`урок ${l.id}: требование ${p} не существует`) }));

  const sIds=new Set();
  SCENARIOS.forEach(s=>{
    if(sIds.has(s.id))errors.push(`дубль идентификатора сценария: ${s.id}`);
    sIds.add(s.id);
    if(!SCENARIO_TYPES.includes(s.type))errors.push(`сценарий ${s.id}: тип ${s.type} неизвестен`);
    if(!['up','down','skip'].includes(s.correctAnswer))
      errors.push(`сценарий ${s.id}: недопустимый ответ ${s.correctAnswer}`);
    const a=s.ohlc();
    if(a.length!==s.candles)errors.push(`сценарий ${s.id}: свечей ${a.length}, ожидалось ${s.candles}`);
    const b=s.ohlc();
    if(a[10].c!==b[10].c)errors.push(`сценарий ${s.id}: генератор недетерминирован`);
  });

  return {ok:!errors.length,errors,warns,
    counts:{worlds:WORLDS.length,modules:MODULES.length,
            lessons:LESSONS.length,scenarios:SCENARIOS.length}};
}

/* Инициализация реестра после загрузки статей */
function initAcademy(){
  LESSONS=buildLessonRegistry();
  addPhase5InteractiveSteps();
  addPhase6ScenarioStep();
addPhase9TapCandleStep();
  addPhase10TapZoneStep();
  addPhase11MarketReadingSteps()
addPhase12StructureSequenceSteps();
  addPhase13BreakoutRetestSteps();
  addPhase14MarketReplayStep();
  const v=validateAcademy();
  if(!v.ok)v.errors.forEach(e=>logErr('validateAcademy',e));
  return v;
}
