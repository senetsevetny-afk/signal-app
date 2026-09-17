/* ═══════════ PHASE 11 — УРОВНИ, ЗВАНИЯ, ДОСТИЖЕНИЯ ═══════════
   Надстройка над существующим прогрессом (academy-progress.js).
   Второй базы не заводим: XP и освоение читаются из EDUP, статистика — из history.
   Уровень отражает объём обучения, а не доход. Это написано в интерфейсе. */
(function(){

  /* Пороги опыта. Кривая пологая: уровень не должен выглядеть как достижение в торговле. */
  const LEVELS=[
    {n:1,  need:0,    title:'Новичок',      note:'только начали'},
    {n:2,  need:60,   title:'Ученик',       note:'первые уроки пройдены'},
    {n:3,  need:160,  title:'Наблюдатель',  note:'читает график осознанно'},
    {n:4,  need:320,  title:'Аналитик',     note:'разбирает структуру'},
    {n:5,  need:560,  title:'Практик',      note:'проверяет решения на журнале'},
    {n:6,  need:880,  title:'Методичный',   note:'работает по системе'},
    {n:7,  need:1300, title:'Исследователь',note:'сравнивает подходы'},
    {n:8,  need:1800, title:'Наставник',    note:'объясняет своими словами'}
  ];

  function levelOf(xp){
    let cur=LEVELS[0];
    for(const l of LEVELS) if(xp>=l.need) cur=l;
    const next=LEVELS.find(l=>l.need>xp)||null;
    const base=cur.need, span=next?next.need-base:1;
    return {
      ...cur,
      next,
      progress: next?Math.min(1,(xp-base)/span):1,
      toNext: next?next.need-xp:0
    };
  }

  /* Достижения. Каждое проверяется по фактическим данным пользователя.
     Ни одно не выдаётся за прибыльность — только за поведение и обучение. */
  const BADGES=[
    {id:'first_lesson', ic:'◆', t:'Первый шаг',
     d:'Завершён первый урок',
     test:s=>s.lessonsDone>=1},
    {id:'five_lessons', ic:'◆', t:'Разгон',
     d:'Завершено пять уроков',
     test:s=>s.lessonsDone>=5},
    {id:'three_worlds', ic:'◈', t:'Исследователь',
     d:'Начаты уроки в трёх мирах',
     test:s=>s.worlds>=3},
    {id:'first_signal', ic:'▲', t:'Первый расчёт',
     d:'Получен первый сигнал',
     test:s=>s.signals>=1},
    {id:'journal_10', ic:'▤', t:'Журнал ведётся',
     d:'Десять закрытых сделок в журнале',
     test:s=>s.closed>=10},
    {id:'journal_50', ic:'▥', t:'Есть выборка',
     d:'Пятьдесят закрытых сделок',
     test:s=>s.closed>=50},
    {id:'patience', ic:'◷', t:'Терпение',
     d:'Двадцать раз пропущен сигнал WAIT',
     test:s=>s.waits>=20},
    {id:'discipline', ic:'⬡', t:'Дисциплина',
     d:'Сессия с лимитами доведена до конца',
     test:s=>s.sessionsDone>=1},
    {id:'honest_review', ic:'◎', t:'Честный разбор',
     d:'Отмечено десять собственных решений: вошёл или пропустил',
     test:s=>s.marked>=10},
    {id:'exam_passed', ic:'★', t:'Экзамен сдан',
     d:'Пройден итоговый экзамен академии',
     test:s=>s.examPassed}
  ];

  function stats(){
    const h=(typeof history!=='undefined'&&history)||[];
    const closed=h.filter(x=>x.result==='win'||x.result==='loss').length;
    const L=(typeof LESSONS!=='undefined'&&LESSONS)||[];
    const W=(typeof WORLDS!=='undefined'&&WORLDS)||[];
    const st=id=>(typeof lessonState==='function'?lessonState(id).mastery:'none');
    return {
      xp:(typeof EDUP!=='undefined'?EDUP.xp:0)||0,
      lessonsDone:L.filter(l=>st(l.id)!=='none').length,
      lessonsTotal:L.length,
      worlds:W.filter(w=>L.some(l=>l.worldId===w.id&&st(l.id)!=='none')).length,
      worldsTotal:W.length,
      signals:h.length,
      closed,
      waits:h.filter(x=>x.a&&x.a.dir==='WAIT').length,
      marked:h.filter(x=>typeof x.taken==='boolean').length,
      sessionsDone:(typeof EDUP!=='undefined'&&EDUP.sessionsDone)||0,
      examPassed:!!(typeof EDUP!=='undefined'&&EDUP.examPassed)
    };
  }

  function snapshot(){
    const s=stats(), lv=levelOf(s.xp);
    return {...s, level:lv, badges:BADGES.map(b=>({...b,unlocked:!!b.test(s)}))};
  }

  function render(){
    const s=snapshot(), lv=s.level;
    const got=s.badges.filter(b=>b.unlocked).length;
    return `<section class="lvPanel">
      <div class="lvTop">
        <div class="lvRing" style="--p:${Math.round(lv.progress*100)}">
          <b>${lv.n}</b><s>уровень</s>
        </div>
        <div style="flex:1">
          <b class="lvTitle">${lv.title}</b>
          <div class="lvNote">${lv.note}</div>
          <div class="lvBar"><i style="width:${Math.round(lv.progress*100)}%"></i></div>
          <div class="lvXp">${s.xp} XP${lv.next?` · до уровня ${lv.next.n} осталось ${lv.toNext}`:' · максимальный уровень'}</div>
        </div>
      </div>

      <div class="lvGrid">
        <div><b>${s.lessonsDone}/${s.lessonsTotal}</b><s>уроки</s></div>
        <div><b>${s.worlds}/${s.worldsTotal}</b><s>миры</s></div>
        <div><b>${s.closed}</b><s>закрыто сделок</s></div>
        <div><b>${got}/${s.badges.length}</b><s>награды</s></div>
      </div>

      <div class="lvBadges">
        ${s.badges.map(b=>`<div class="lvBadge ${b.unlocked?'on':''}">
          <span>${b.unlocked?b.ic:'○'}</span>
          <div><b>${b.t}</b><s>${b.d}</s></div>
        </div>`).join('')}
      </div>

      <div class="lvDisc">Уровень отражает объём пройденного обучения и ведения журнала.
        Он не означает прибыльность и ничего не обещает о будущих сделках.</div>
    </section>`;
  }

  /* Начисление опыта за учебные события. Торговые результаты опыта не дают. */
  function award(kind){
    const map={lesson_done:20, quiz_correct:5, scenario_done:10, exam_passed:60,
               journal_marked:2, session_finished:15};
    const n=map[kind]; if(!n)return;
    if(typeof addXP==='function')addXP(n);
    if(kind==='exam_passed'&&typeof EDUP!=='undefined'){EDUP.examPassed=true;eduSave?.()}
    if(kind==='session_finished'&&typeof EDUP!=='undefined'){
      EDUP.sessionsDone=(EDUP.sessionsDone||0)+1; eduSave?.();
    }
    window.MarketAIProgressEvents?.toast?.(window.MarketAIProgressEvents.diff());
  }

  window.MarketAILevels={levelOf,snapshot,render,award,LEVELS,BADGES};
})();
