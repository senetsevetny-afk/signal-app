/* MARKET AI Academy Shell — minimal UI over the existing Phase 2 registries. */
(function(){
  const T=s=>window.MarketAII18n?.t?.(s)||s;
  const WORLD_NAMES={w_basics:'Основы рынка',w_candles:'Свечи',w_trend:'Тренд и структура',w_levels:'Уровни',w_indi:'Индикаторы',w_mtf:'Таймфреймы',w_risk:'Риск и психология',w_binary:'Binary Options'};
  const MASTERY_LABEL={none:'НОВОЕ',learned:'ИЗУЧЕНО',practiced:'ПРАКТИКА',tested:'ПРОВЕРЕНО',mastered:'MASTERED'};
  let legacyOpen=null;

  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function articleForLesson(l){return typeof EDU!=='undefined'?EDU.find(e=>'l_'+e.id===l.id):null}
  function worldLessons(id){return LESSONS.filter(l=>l.worldId===id).sort((a,b)=>a.order-b.order)}
  function worldProgress(id){
    const ls=worldLessons(id); if(!ls.length)return 0;
    const done=ls.filter(l=>lessonState(l.id).mastery!=='none').length;
    return Math.round(done/ls.length*100);
  }
  function totalDone(){return LESSONS.filter(l=>lessonState(l.id).mastery!=='none').length}
  function availableCount(){return LESSONS.filter(lessonAvailable).length}
  function shell(body,title,sub){
    const w=document.getElementById('eduWrap'); if(!w)return;
    w.innerHTML=`<div class="sheet"><div class="shHead"><div style="flex:1"><b>${esc(title||'MARKET AI ACADEMY')}</b><div class="sub2">${esc(sub||'интерактивная карта обучения')}</div></div><button class="shX" onclick="closeOv('eduWrap')">✕</button></div><div class="shBody"><div class="acShell">${body}</div></div></div>`;
    openOv('eduWrap');
  }
  window.academyShellRender=shell;

  window.openAcademy=function(){
    if(typeof setMascotState==='function')setMascotState('think');
    const cards=WORLDS.slice().sort((a,b)=>a.order-b.order).map(w=>{
      const p=worldProgress(w.id), n=worldLessons(w.id).length;
      return `<button class="acWorld" onclick="openAcademyWorld('${w.id}')"><span class="acPlanet">${w.ic}</span><b>${esc(T(WORLD_NAMES[w.id]||w.id))}</b><small>${n} ${esc(T('Уроки')).toLowerCase()} · ${p}%</small><span class="acProg"><i style="width:${p}%"></i></span></button>`;
    }).join('');
    shell(`<div class="acHero"><div class="acEyebrow">MARKET AI · LEARNING SYSTEM</div><h2>От свечей до самостоятельного анализа</h2><p>Изучай рынок по шагам. Здесь прогресс оценивает обучение, а не обещает финансовый результат.</p><div class="acStats"><div class="acStat"><b>${EDUP.xp||0}</b><s>XP</s></div><div class="acStat"><b>${totalDone()}/${LESSONS.length}</b><s>${T('Уроки')}</s></div><div class="acStat"><b>${availableCount()}</b><s>${T('Доступно')}</s></div></div></div><div class="acSection"><b>${T('Вселенная Академии')}</b><i></i></div><div id="acUniverse"></div>${window.MarketAILevels?MarketAILevels.render():''}${window.MarketAIAcademyProgress?MarketAIAcademyProgress.render():''}${window.MarketAIAdaptiveCoach?MarketAIAdaptiveCoach.render():''}<div class="acSection"><b>${T('Миры списком')}</b><i></i></div><div class="acWorlds">${cards}</div><div class="acActions"><button class="acGhost" onclick="openAcademyContinue()">▶ ${T('Продолжить')}</button><button class="acGhost" onclick="openAcademyScenarioHub()">◈ Practice Lab</button><button class="acGhost" onclick="openAcademyReplayLibrary()">▶ Replay</button><button class="acGhost" onclick="openAcademyExam()">◆ ${T('Экзамен')}</button><button class="acGhost" onclick="openAcademySettings()">⚙ Настройки</button><button class="acGhost" onclick="openAcademyTour(true)">✦ ${T('Тур')}</button><button class="acGhost" onclick="openLegacyEducation()">📚 ${T('Старая теория')}</button></div>`,'MARKET AI ACADEMY',T('твоя карта обучения'));
    setTimeout(()=>{window.MarketAIUniverse?.mount();setTimeout(()=>window.MarketAIUniverseProgression?.decorate(),0)},0);
    setTimeout(()=>window.openAcademyTour?.(),30);
  };

  window.openAcademyWorld=function(id){
    const w=WORLDS.find(x=>x.id===id); if(!w)return openAcademy();
    const lessons=worldLessons(id);
    const rows=lessons.map(l=>{
      const st=lessonState(l.id), av=lessonAvailable(l), art=articleForLesson(l);
      const title=l.title||art?.t||l.titleKey||l.id;
      const sub=l.subtitle||art?.short||T('Интерактивный урок MARKET AI');
      return `<button class="acLesson" ${av?'':'disabled'} onclick="openAcademyLesson('${l.id}')"><span class="acLessonIc">${esc(l.icon||'🎓')}</span><span class="acLessonM"><b>${esc(title)}</b><span>${esc(sub)} · ${l.estimatedTime||4} мин · +${l.xp||0} XP</span></span><span class="acState">${av?MASTERY_LABEL[st.mastery]:'🔒'}</span></button>`;
    }).join('')||`<div class="empty">${T('Уроки этого мира ещё готовятся.')}</div>`;
    shell(`<button class="acBack" onclick="openAcademy()">‹ ${T('Вселенная обучения')}</button><div class="acHero"><div class="acEyebrow">WORLD</div><h2>${w.ic} ${esc(WORLD_NAMES[w.id]||w.id)}</h2><p>${worldProgress(id)}% ${T('текущего учебного пути завершено.')}</p></div><div class="acSection"><b>${T('Уроки')}</b><i></i></div><div class="acList">${rows}</div>`,'MARKET AI ACADEMY',WORLD_NAMES[w.id]||w.id);
  };

  window.openAcademyLesson=function(id){
    if(typeof openLessonEngine==='function')return openLessonEngine(id);
    const l=LESSONS.find(x=>x.id===id); if(!l||!lessonAvailable(l))return;
  };

  window.completeAcademyLesson=function(id){
    const l=LESSONS.find(x=>x.id===id); if(!l)return;
    const before=lessonState(id).mastery;
    setMastery(id,'learned');
    if(before==='none')addXP(l.xp||0);
    if(typeof haptic==='function')haptic('medium');
    openAcademyWorld(l.worldId);
  };

  window.openAcademyContinue=function(){
    const last=EDUP.lastLesson&&LESSONS.find(l=>l.id===EDUP.lastLesson&&lessonAvailable(l));
    if(last)return openAcademyLesson(last.id);
    const next=LESSONS.find(l=>lessonAvailable(l)&&lessonState(l.id).mastery==='none')||LESSONS.find(lessonAvailable);
    if(next)return openAcademyLesson(next.id);
    openAcademy();
  };

  window.openLegacyEducation=function(){ if(legacyOpen)legacyOpen(); };
  window.initAcademyShell=function(){
    if(typeof openEdu==='function'&&!legacyOpen){legacyOpen=openEdu; openEdu=window.openAcademy;}
    return {ok:true,worlds:WORLDS.length,lessons:LESSONS.length};
  };
})();
