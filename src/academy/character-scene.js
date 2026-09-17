/* MARKET AI Academy — Character Scene Engine v1.
   One canonical mentor renderer. Visual assets can later be replaced by Rive/3D
   without changing Lesson Engine content or scene contracts. */
(function(){
  const STATES={
    welcome:{icon:'✦',label:'WELCOME'}, idle:{icon:'AI',label:'READY'}, explain:{icon:'AI',label:'EXPLAIN'},
    point:{icon:'↗',label:'WATCH'}, thinking:{icon:'…',label:'THINK'}, warning:{icon:'!',label:'WARNING'},
    correct:{icon:'✓',label:'CORRECT'}, incorrect:{icon:'?',label:'REVIEW'}, celebrate:{icon:'★',label:'MASTERED'},
    shield:{icon:'◆',label:'RISK'}, globe:{icon:'◎',label:'MARKET'}, wait:{icon:'◌',label:'WAIT'}
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalize(input={}){
    let state=input.state||input.characterState||'thinking';
    const alias={hero:'welcome',think:'thinking'}; state=alias[state]||state;
    if(input.answer?.submitted) state=input.answer.correct?'correct':'incorrect';
    if(!STATES[state])state='idle';
    const defaults={
      welcome:'Начнём с основы. Я проведу тебя по ситуации шаг за шагом.',
      idle:'Зафиксируй главное и переходи дальше.', explain:'Смотри на контекст — термин сам по себе ничего не решает.',
      point:'Обрати внимание на отмеченную область графика.', thinking:'Теперь твоя очередь. Сначала оцени ситуацию сам.',
      warning:'Здесь важно не торопиться с решением.', correct:'Верно. Хорошее решение начинается с процесса анализа.',
      incorrect:'Разберём, что было пропущено. Ошибка здесь — часть тренировки.', celebrate:'Урок завершён. Навык закрепляется практикой.',
      shield:'Сначала защита капитала, потом решение.', globe:'Сначала поймём, какой рынок и контекст перед нами.', wait:'Не каждая ситуация требует сделки.'
    };
    return {state,action:input.action||'observe',position:input.position||'left',speech:input.speech||defaults[state],target:input.target||null,targetDetail:input.targetDetail||null,orientation:input.orientation||'front',gesture:input.gesture||'neutral',proximity:input.proximity||'home'};
  }
  function render(input={}){
    const s=normalize(input), meta=STATES[s.state];
    const td=s.targetDetail||{}, tx=Number.isFinite(td.x)?Math.round(td.x*100):50, ty=Number.isFinite(td.y)?Math.round(td.y*100):50;
    return `<section class="maiScene mai-${esc(s.state)} mai-pos-${esc(s.position)}" data-character-state="${esc(s.state)}" data-character-action="${esc(s.action)}" data-orientation="${esc(s.orientation)}" data-gesture="${esc(s.gesture)}" data-proximity="${esc(s.proximity)}" data-target-kind="${esc(td.kind||'none')}" style="--mai-target-x:${tx}%;--mai-target-y:${ty}%">
      <div class="maiStage" aria-hidden="true"><div class="maiGlow"></div><div class="maiCharacter"><div class="maiHead"><i></i><i></i></div><div class="maiCore">${esc(meta.icon)}</div><div class="maiBody"></div><div class="maiArm"></div></div><div class="maiTarget"></div></div>
      <div class="maiSpeech"><div class="maiName"><b>MARKET AI</b><span>${esc(meta.label)}</span></div><p>${esc(s.speech)}</p></div>
    </section>`;
  }
  function fromLessonStep(step={},answer,directedScene){
    if(directedScene) return {...directedScene,answer};
    let state=step.characterState||'thinking', action='observe', position='left';
    if(['question','true_false','multiple_choice','select_direction'].includes(step.type)){state='thinking';action='ask';}
    if(step.type==='select_direction'){state='point';action='point_chart';position='right';}
    if(answer?.submitted){state=answer.correct?'correct':'incorrect';action=answer.correct?'acknowledge':'review';position='left';}
    return {state,action,position,answer};
  }
  window.MarketAICharacter={render,normalize,fromLessonStep,states:Object.freeze({...STATES})};
})();
