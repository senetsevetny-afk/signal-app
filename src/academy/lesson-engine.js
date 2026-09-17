/* MARKET AI Academy — universal Lesson Engine v2.
   Data-driven steps, deterministic answers and feedback. */
(function(){
  const sessions=new Map();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function article(lesson){ return typeof EDU!=='undefined'?EDU.find(e=>'l_'+e.id===lesson.id):null; }
  function sourceStep(lesson,index){
    const a=article(lesson), step=lesson.steps[index];
    if(!step)return null;
    const rawBody=step.body??step.text??step.message??step.prompt??'';
    const body=Array.isArray(rawBody)?rawBody:(rawBody?[rawBody]:[]);
    if(step.type==='intro') return {title:step.title||lesson.title||a?.t||lesson.id, body:body.length?body:[lesson.subtitle||a?.short||'Урок MARKET AI']};
    if(step.type==='summary') return {title:step.title||'Главное', body:body.length?body:['Ты прошёл материал. Теперь закрепи идею практикой.']};
    if(step.type==='explanation'){
      if(step.title||body.length)return {title:step.title||'Разбор',body};
      const expIndex=lesson.steps.slice(0,index+1).filter(s=>s.type==='explanation').length-1;
      const block=a?.blocks?.[expIndex];
      return block?{title:block[0],body:block.slice(1)}:{title:'Разбор',body:[]};
    }
    if(step.type==='character_message'||step.type==='character_demo'||step.type==='animation'||step.type==='practice_scene'||step.type==='warning'||step.type==='market_tip'||step.type==='example'||step.type==='counter_example') return {title:step.title||'MARKET AI',body};
    if(step.type==='question'||step.type==='true_false'||step.type==='multiple_choice'||step.type==='select_direction'||step.type==='tap_candle'||step.type==='tap_zone'||step.type==='drag_level'||step.type==='mark_structure'||step.type==='mark_structure_sequence'||step.type==='market_replay') return {title:step.title||'Проверь себя',body};
    return {title:step.title||'MARKET AI',body};
  }
  function mascot(step,answer,scene){
    if(window.MarketAICharacter){
      return MarketAICharacter.render(MarketAICharacter.fromLessonStep(step,answer,scene));
    }
    return `<div class="leMentor"><span class="leBot">AI</span><div><b>MARKET AI</b><small>Смотри на контекст и принимай решение сам.</small></div></div>`;
  }
  function isInteractive(step){return ['question','true_false','multiple_choice','select_direction','tap_candle','tap_zone','drag_level','mark_structure','mark_structure_sequence','market_replay'].includes(step.type)}
  function scenarioFor(step){return typeof SCENARIOS!=='undefined'?SCENARIOS.find(s=>s.id===step.scenarioId):null}
  function visibleScenarioData(scenario){return scenario?scenario.ohlc().slice(-42):[]}
  function candleTargetIndex(step,data){
    if(step.targetRule==='largest_bullish_body'){let best=-1,bestBody=-Infinity;data.forEach((c,i)=>{const b=c.c-c.o;if(b>0&&b>bestBody){bestBody=b;best=i}});return best}
    return Number.isInteger(step.targetIndex)?step.targetIndex:-1;
  }
  function renderTapCandle(step,answer){
    const scenario=scenarioFor(step); if(!scenario)return '<div class="leFeedback bad"><b>Сценарий недоступен</b></div>';
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Свеча найдена':'MARKET AI разбирает выбор'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion"><div class="leScenario leTapScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas leTapCanvas" data-scenario-id="${esc(scenario.id)}" data-tap-candle="1" height="190"></canvas><small>${answer?.submitted?'Выбранная свеча отмечена · учебные данные':'Нажми прямо на свечу · учебные данные'}</small></div><p class="lePrompt">${esc(step.prompt||'Найди свечу')}</p>${feedback}</div>`;
  }
  function renderTapZone(step,answer){
    const scenario=scenarioFor(step); if(!scenario)return '<div class="leFeedback bad"><b>Сценарий недоступен</b></div>';
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Зона найдена':'MARKET AI сравнивает зоны'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion"><div class="leScenario leZoneScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas leZoneCanvas" data-scenario-id="${esc(scenario.id)}" data-tap-zone="1" height="190"></canvas><small>${answer?.submitted?'Твоя зона и эталон показаны · учебные данные':'Проведи пальцем вверх/вниз, чтобы выделить ценовую зону'}</small></div><p class="lePrompt">${esc(step.prompt||'Отметь зону')}</p>${feedback}</div>`;
  }

  function renderDragLevel(step,answer){
    const scenario=scenarioFor(step); if(!scenario)return '<div class="leFeedback bad"><b>Сценарий недоступен</b></div>';
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Уровень отмечен':'MARKET AI сравнивает уровень'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion"><div class="leScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas leLevelCanvas" data-scenario-id="${esc(scenario.id)}" data-drag-level="1" height="190"></canvas><small>${answer?.submitted?'Твой уровень и эталон показаны · учебные данные':'Нажми на ценовой уровень прямо на графике'}</small></div><p class="lePrompt">${esc(step.prompt||'Отметь уровень')}</p>${feedback}</div>`;
  }
  function renderStructure(step,answer){
    const scenario=scenarioFor(step); if(!scenario)return '<div class="leFeedback bad"><b>Сценарий недоступен</b></div>';
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Swing найден':'MARKET AI показывает структуру'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion"><div class="leScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas leStructureCanvas" data-scenario-id="${esc(scenario.id)}" data-mark-structure="1" height="190"></canvas><small>${answer?.submitted?'Точка структуры отмечена · учебные данные':'Нажми на нужный swing прямо на графике'}</small></div><p class="lePrompt">${esc(step.prompt||'Отметь структуру')}</p>${feedback}</div>`;
  }

  function renderStructureSequence(step,answer){
    const scenario=scenarioFor(step); if(!scenario)return '<div class="leFeedback bad"><b>Сценарий недоступен</b></div>';
    const count=answer?.selectedIndices?.length||0,total=(step.labels||[]).length;
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Структура собрана':'MARKET AI сравнивает последовательность'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion"><div class="leScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas leStructureSeqCanvas" data-scenario-id="${esc(scenario.id)}" data-mark-structure-sequence="1" height="190"></canvas><small>${answer?.submitted?'Твоя последовательность и эталон показаны · учебные данные':`Отмечено ${count}/${total} · нажимай swing-точки по порядку`}</small></div><p class="lePrompt">${esc(step.prompt||'Собери структуру')}</p>${feedback}</div>`;
  }

  function renderMarketReplay(step,answer){
    if(!window.MarketReplayController)return '<div class="leFeedback bad"><b>Replay Controller недоступен</b></div>';
    return MarketReplayController.render(step,answer,{scenario:scenarioFor(step),escape:esc});
  }

  function renderQuestion(step,answer){
    const scenario=step.type==='select_direction'&&typeof SCENARIOS!=='undefined'?SCENARIOS.find(s=>s.id===step.scenarioId):null;
    const chart=scenario?`<div class="leScenario"><div class="leScenarioTop"><span>${esc(scenario.dataLabel||'TRAINING SCENARIO')}</span><b>${esc(scenario.timeframe||'')}</b></div><canvas class="leScenarioCanvas" data-scenario-id="${esc(scenario.id)}" height="190"></canvas><small>Будущие свечи скрыты · учебные данные</small></div>`:'';
    const options=Array.isArray(step.options)?step.options:[];
    const buttons=options.map(o=>{
      const selected=answer?.selected===o.id;
      const expected=scenario?.acceptableAnswers||[step.correctAnswer];
      let cls='leAnswer';
      if(selected)cls+=' selected';
      if(answer?.submitted&&expected.includes(o.id))cls+=' correct';
      if(answer?.submitted&&selected&&!expected.includes(o.id))cls+=' incorrect';
      return `<button class="${cls}" ${answer?.submitted?'disabled':''} onclick="lessonEngineChoose('${esc(o.id)}')"><span>${esc(o.label)}</span></button>`;
    }).join('');
    const feedback=answer?.submitted?`<div class="leFeedback ${answer.correct?'ok':'bad'}"><b>${answer.correct?'✓ Верно':'Разбор MARKET AI'}</b><p>${esc(answer.correct?step.feedback?.correct:step.feedback?.incorrect)}</p></div>`:'';
    return `<div class="leQuestion">${chart}<p class="lePrompt">${esc(step.prompt||'Выбери ответ')}</p><div class="leAnswers">${buttons}</div>${feedback}</div>`;
  }
  function renderStep(lesson,index,session){
    const step=lesson.steps[index], src=sourceStep(lesson,index), last=index===lesson.steps.length-1;
    if(!step||!src)return '';
    const answer=session.answers[index];
    const scene=window.MarketAICharacterDirector?MarketAICharacterDirector.get():null;
    const body=(src.body||[]).map(p=>`<p>${esc(p)}</p>`).join('');
    const interactive=isInteractive(step);
    const visual=['animation','character_demo','practice_scene'].includes(step.type)&&window.MarketAIAcademyVisuals?MarketAIAcademyVisuals.render(lesson,step):'';
    let content=visual||body;
    if(interactive)content=renderQuestion(step,answer);
    if(step.type==='mark_structure_sequence')content=renderStructureSequence(step,answer);
    if(step.type==='mark_structure')content=renderStructure(step,answer);
    if(step.type==='drag_level')content=renderDragLevel(step,answer);
    if(step.type==='tap_zone')content=renderTapZone(step,answer);
    if(step.type==='tap_candle')content=renderTapCandle(step,answer);
    if(step.type==='market_replay')content=renderMarketReplay(step,answer);
    const canAdvance=!interactive||answer?.submitted;
    return `<div class="leStage ${scene?.noHint?'leNoHint':''}" data-step="${index}" data-scene-phase="${esc(scene?.phase||'')}">${mascot(step,answer,scene)}<div class="leProgress"><i style="width:${Math.round((index+1)/lesson.steps.length*100)}%"></i></div><div class="leCounter">ШАГ ${index+1} / ${lesson.steps.length}</div><div class="leCard"><div class="leType">${esc(step.type.replaceAll('_',' '))}</div><h2>${esc(src.title)}</h2>${content}</div><div class="leNav"><button class="acGhost" ${index===0?'disabled':''} onclick="lessonEnginePrev()">← Назад</button><button class="btn" ${canAdvance?'':'disabled'} onclick="${last?`lessonEngineFinish('${lesson.id}')`:'lessonEngineNext()'}">${last?'✓ Завершить урок':interactive&&!answer?.submitted?'Сначала ответь':'Дальше →'}</button></div></div>`;
  }
  function drawScenarioCharts(root){
    root.querySelectorAll('.leScenarioCanvas').forEach(canvas=>{
      const scenario=typeof SCENARIOS!=='undefined'?SCENARIOS.find(s=>s.id===canvas.dataset.scenarioId):null;
      if(!scenario)return;
      const allData=scenario.ohlc().slice(-42), visibleN=canvas.dataset.marketReplay==='1'?Math.max(1,Math.min(allData.length,Number(canvas.dataset.visibleCandles)||allData.length)):allData.length, data=allData.slice(0,visibleN), dpr=Math.min(window.devicePixelRatio||1,2);
      const cssW=Math.max(260,canvas.clientWidth||320), cssH=190;
      canvas.width=Math.round(cssW*dpr); canvas.height=Math.round(cssH*dpr);
      const ctx=canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,cssW,cssH);
      const pad=12, hi=Math.max(...data.map(x=>x.h)), lo=Math.min(...data.map(x=>x.l)), range=Math.max(.0001,hi-lo);
      const y=v=>pad+(hi-v)/range*(cssH-pad*2), slot=(cssW-pad*2)/data.length, body=Math.max(2,slot*.55);
      ctx.strokeStyle='rgba(255,255,255,.055)'; ctx.lineWidth=1;
      for(let i=1;i<4;i++){const yy=pad+(cssH-pad*2)*i/4;ctx.beginPath();ctx.moveTo(pad,yy);ctx.lineTo(cssW-pad,yy);ctx.stroke()}
      data.forEach((c,i)=>{const x=pad+slot*i+slot/2, up=c.c>=c.o;ctx.strokeStyle=up?'#2BD98A':'#FF5C6C';ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(x,y(c.h));ctx.lineTo(x,y(c.l));ctx.stroke();const top=Math.min(y(c.o),y(c.c)), h=Math.max(1.5,Math.abs(y(c.o)-y(c.c)));ctx.fillRect(x-body/2,top,body,h)});
      if(scenario.trainingMeta?.level!=null){
        const yy=y(scenario.trainingMeta.level);ctx.save();ctx.strokeStyle='rgba(245,185,66,.72)';ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(pad,yy);ctx.lineTo(cssW-pad,yy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#F5B942';ctx.font='700 10px Manrope';ctx.fillText('KEY LEVEL',pad+4,Math.max(12,yy-5));ctx.restore();
        const {session}=current(),answer=session?.answers?.[session?.index];
        if(answer?.submitted&&canvas.dataset.marketReplay!=='1'){
          const kind=scenario.trainingMeta.kind, marks=kind==='role'?[17,36]:kind==='breakout'?[39]:kind==='retest'?[20,36,41]:kind==='falsebreak'?[34,39]:[];
          const labels=kind==='role'?['BREAK','RETEST']:kind==='breakout'?['BREAK']:kind==='retest'?['BREAK','RETEST','REACTION']:kind==='falsebreak'?['BREAK','BACK BELOW']:[];
          marks.filter(idx=>idx<data.length).forEach((idx,i)=>{const x=pad+slot*idx+slot/2,py=y(data[idx].c);ctx.fillStyle=i===marks.length-1?'#63E6FF':'#F5B942';ctx.beginPath();ctx.arc(x,py,4,0,Math.PI*2);ctx.fill();ctx.font='700 9px Manrope';ctx.fillText(labels[i],Math.min(cssW-70,x+5),Math.max(12,py-7))});
        }
      }
      if(window.MarketChartEventLayer){MarketChartEventLayer.draw(ctx,{scenario,data,width:cssW,height:cssH,pad,y,slot,visibleCount:visibleN,mentor:true})}
      if(canvas.dataset.tapZone==='1'&&window.MarketChartAnnotations){
        const {session}=current(), answer=session?.answers?.[session?.index];
        if(answer?.selectedZone)MarketChartAnnotations.draw(ctx,answer.selectedZone,{height:cssH,width:cssW,data,pad});
        if(answer?.submitted&&answer?.targetZone)MarketChartAnnotations.draw(ctx,{...answer.targetZone,correct:true},{height:cssH,width:cssW,data,pad});
        if(!answer?.submitted)bindZoneCanvas(canvas,data,cssH);
      }
      if(canvas.dataset.dragLevel==='1'&&window.MarketChartAnnotations){
        const {session,lesson}=current(),answer=session?.answers?.[session?.index],step=lesson?.steps?.[session?.index];
        const expected=step?MarketChartAnnotations.levelTarget(step,data):null;
        if(answer?.selectedLevel!=null){const yy=MarketChartAnnotations.yAtPrice(answer.selectedLevel,cssH,data,pad);ctx.strokeStyle='#63E6FF';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pad,yy);ctx.lineTo(cssW-pad,yy);ctx.stroke()}
        if(answer?.submitted&&expected!=null){const yy=MarketChartAnnotations.yAtPrice(expected,cssH,data,pad);ctx.strokeStyle='#2BD98A';ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(pad,yy);ctx.lineTo(cssW-pad,yy);ctx.stroke();ctx.setLineDash([])}
        if(!answer?.submitted){canvas.style.cursor='crosshair';canvas.onclick=e=>lessonEngineSetLevel(e,canvas)}
      }
      if(canvas.dataset.markStructure==='1'&&window.MarketChartAnnotations){
        const {session,lesson}=current(),answer=session?.answers?.[session?.index],step=lesson?.steps?.[session?.index];
        if(answer?.submitted&&Number.isInteger(answer.selectedIndex)){const mark=(idx,color,label)=>{const c=data[idx],x=pad+slot*idx+slot/2,yy=step?.targetRule==='latest_ll'?y(c.l):y(c.h);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,yy,5,0,Math.PI*2);ctx.fill();ctx.font='700 11px Manrope';ctx.fillText(label,x+7,Math.max(14,yy-7))};mark(answer.selectedIndex,answer.correct?'#2BD98A':'#FFB84D','ТВОЙ');if(answer.targetIndex!==answer.selectedIndex)mark(answer.targetIndex,'#2BD98A',step?.targetRule==='latest_ll'?'LL':'HH')}
        else {canvas.style.cursor='pointer';canvas.onclick=e=>lessonEngineMarkStructure(e,canvas)}
      }

      if(canvas.dataset.markStructureSequence==='1'&&window.MarketChartAnnotations){
        const {session,lesson}=current(),answer=session?.answers?.[session?.index],step=lesson?.steps?.[session?.index];
        const targets=step?MarketChartAnnotations.structureSequenceTargets(step,data):[];
        const point=(idx,kind,color,label)=>{const c=data[idx],x=pad+slot*idx+slot/2,yy=kind==='low'?y(c.l):y(c.h);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,yy,5,0,Math.PI*2);ctx.fill();ctx.font='700 11px Manrope';ctx.fillText(label,x+7,Math.max(14,yy-7));return {x,yy}};
        const selected=answer?.selectedIndices||[];let prev=null;
        selected.forEach((idx,i)=>{const target=targets[i]||targets[0],pt=point(idx,target?.kind||'high','#63E6FF',`${i+1}`);if(prev){ctx.strokeStyle='rgba(99,230,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(prev.x,prev.yy);ctx.lineTo(pt.x,pt.yy);ctx.stroke()}prev=pt});
        if(answer?.submitted){prev=null;targets.forEach(t=>{const pt=point(t.index,t.kind,'#2BD98A',t.label);if(prev){ctx.strokeStyle='rgba(43,217,138,.85)';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(prev.x,prev.yy);ctx.lineTo(pt.x,pt.yy);ctx.stroke();ctx.setLineDash([])}prev=pt})}
        else {canvas.style.cursor='pointer';canvas.onclick=e=>lessonEngineMarkStructureSequence(e,canvas)}
      }
      if(canvas.dataset.tapCandle==='1'){
        const {session,lesson}=current(), answer=session?.answers?.[session?.index];
        if(answer?.submitted&&Number.isInteger(answer.selectedIndex)){const x=pad+slot*answer.selectedIndex+slot/2;ctx.strokeStyle=answer.correct?'#2BD98A':'#FFB84D';ctx.lineWidth=2;ctx.strokeRect(x-slot*.45,5,slot*.9,cssH-10)}
        else {canvas.style.cursor='pointer';canvas.onclick=e=>lessonEngineTapCandle(e,canvas)}
      }
    });
  }


  function bindZoneCanvas(canvas,data,cssH){
    if(canvas.dataset.zoneBound==='1')return; canvas.dataset.zoneBound='1'; canvas.style.touchAction='none';
    let startY=null,currentY=null;
    const pointY=e=>{const r=canvas.getBoundingClientRect(),t=e.touches?.[0]||e.changedTouches?.[0]||e;return Math.max(12,Math.min(cssH-12,(t.clientY-r.top)*(cssH/r.height)))};
    const preview=()=>{if(startY===null||currentY===null)return;const {session}=current();if(!session)return;const step=current().lesson.steps[session.index];const a=MarketChartAnnotations.priceAtY(startY,cssH,data),b=MarketChartAnnotations.priceAtY(currentY,cssH,data);session.answers[session.index]={selectedZone:MarketChartAnnotations.normalize(a,b),submitted:false};hostRenderAfterDecision();};
    canvas.onpointerdown=e=>{e.preventDefault();startY=pointY(e);currentY=startY;try{canvas.setPointerCapture(e.pointerId)}catch(err){window.logErr?.('lesson.pointer',err)}};
    canvas.onpointermove=e=>{if(startY===null)return;e.preventDefault();currentY=pointY(e)};
    canvas.onpointerup=e=>{if(startY===null)return;e.preventDefault();currentY=pointY(e);const a=MarketChartAnnotations.priceAtY(startY,cssH,data),b=MarketChartAnnotations.priceAtY(currentY,cssH,data);const selected=MarketChartAnnotations.normalize(a,b);startY=currentY=null;lessonEngineSubmitZone(selected);};
  }


  function applySceneCues(root){
    if(!window.MarketAICharacterDirector)return;
    const scene=MarketAICharacterDirector.get();
    const chart=root.querySelector('.leScenario');
    if(chart&&scene.target==='scenario_chart'){
      chart.classList.add('leChartTarget');
      if(scene.chartCue)chart.dataset.chartCue=scene.chartCue;
    }
  }

  function current(){
    const host=document.getElementById('lessonEngineHost'); if(!host)return {};
    return {host,id:host.dataset.lessonId,session:sessions.get(host.dataset.lessonId),lesson:LESSONS.find(l=>l.id===host.dataset.lessonId)};
  }
  function mount(){
    const {host,session,lesson}=current(); if(!host||!session||!lesson)return;
    const step=lesson.steps[session.index];
    if(window.MarketAICharacterDirector) MarketAICharacterDirector.emit('lesson:step',{lesson,step,index:session.index,answer:session.answers[session.index]});
    host.innerHTML=renderStep(lesson,session.index,session);
    drawScenarioCharts(host);
    applySceneCues(host);
    host.scrollIntoView({block:'start'});
  }
  window.openLessonEngine=function(id){
    const lesson=LESSONS.find(l=>l.id===id); if(!lesson||!lessonAvailable(lesson))return;
    EDUP.lastLesson=id; eduSave(); sessions.set(id,{index:0,startedAt:Date.now(),answers:{}});
    const a=article(lesson), title=lesson.title||a?.t||lesson.id;
    if(typeof academyShellRender!=='function')return;
    academyShellRender(`<button class="acBack" onclick="openAcademyWorld('${lesson.worldId}')">‹ К урокам мира</button><div id="lessonEngineHost" data-lesson-id="${esc(id)}"></div>`,'MARKET AI ACADEMY',title);
    mount();
  };
  window.lessonEngineTapCandle=function(event,canvas){
    const {session,lesson}=current(); if(!session||!lesson)return;
    const step=lesson.steps[session.index]; if(step.type!=='tap_candle'||session.answers[session.index]?.submitted)return;
    const scenario=scenarioFor(step),data=visibleScenarioData(scenario); if(!data.length)return;
    const rect=canvas.getBoundingClientRect(),pad=12,usable=Math.max(1,rect.width-pad*2),slot=usable/data.length;
    const x=Math.max(0,Math.min(usable-0.001,event.clientX-rect.left-pad));
    const selectedIndex=Math.max(0,Math.min(data.length-1,Math.floor(x/slot))),targetIndex=candleTargetIndex(step,data),correct=selectedIndex===targetIndex;
    session.answers[session.index]={selectedIndex,targetIndex,submitted:true,correct,decisionQuality:correct?100:45,financialOutcome:null};
    if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit('candle:submitted',{lesson,step,selectedIndex,targetIndex,correct,scenario});
    hostRenderAfterDecision();
  };
  window.lessonEngineSubmitZone=function(selectedZone){
    const {session,lesson}=current(); if(!session||!lesson||!window.MarketChartAnnotations)return;
    const step=lesson.steps[session.index]; if(step.type!=='tap_zone'||session.answers[session.index]?.submitted)return;
    const scenario=scenarioFor(step),data=visibleScenarioData(scenario); if(!data.length)return;
    const targetZone=MarketChartAnnotations.target(step,data),overlap=MarketChartAnnotations.score(selectedZone,targetZone),correct=overlap>=.28;
    session.answers[session.index]={selectedZone,targetZone,overlap,submitted:true,correct,decisionQuality:Math.round(Math.max(35,Math.min(100,overlap*120))),financialOutcome:null};
    if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit('zone:submitted',{lesson,step,selectedZone,targetZone,correct,overlap,scenario});
    hostRenderAfterDecision();
  };
  window.lessonEngineSetLevel=function(event,canvas){
    const {session,lesson}=current(); if(!session||!lesson||!window.MarketChartAnnotations)return;
    const step=lesson.steps[session.index]; if(step.type!=='drag_level'||session.answers[session.index]?.submitted)return;
    const scenario=scenarioFor(step),data=visibleScenarioData(scenario),rect=canvas.getBoundingClientRect(); if(!data.length)return;
    const y=(event.clientY-rect.top)*(190/Math.max(1,rect.height)),selectedLevel=MarketChartAnnotations.priceAtY(y,190,data),targetLevel=MarketChartAnnotations.levelTarget(step,data),score=MarketChartAnnotations.levelScore(selectedLevel,targetLevel,data),correct=score>=.62;
    session.answers[session.index]={selectedLevel,targetLevel,score,submitted:true,correct,decisionQuality:Math.round(35+score*65),financialOutcome:null};
    if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit('level:submitted',{lesson,step,correct,score,scenario}); hostRenderAfterDecision();
  };
  window.lessonEngineMarkStructure=function(event,canvas){
    const {session,lesson}=current(); if(!session||!lesson||!window.MarketChartAnnotations)return;
    const step=lesson.steps[session.index]; if(step.type!=='mark_structure'||session.answers[session.index]?.submitted)return;
    const scenario=scenarioFor(step),data=visibleScenarioData(scenario),rect=canvas.getBoundingClientRect(),pad=12,usable=Math.max(1,rect.width-pad*2),slot=usable/data.length; if(!data.length)return;
    const x=Math.max(0,Math.min(usable-.001,event.clientX-rect.left-pad)),selectedIndex=Math.floor(x/slot),targetIndex=MarketChartAnnotations.structureTarget(step,data),correct=Math.abs(selectedIndex-targetIndex)<=1;
    session.answers[session.index]={selectedIndex,targetIndex,submitted:true,correct,decisionQuality:correct?100:45,financialOutcome:null};
    if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit('structure:submitted',{lesson,step,correct,scenario}); hostRenderAfterDecision();
  };

  window.lessonEngineMarkStructureSequence=function(event,canvas){
    const {session,lesson}=current(); if(!session||!lesson||!window.MarketChartAnnotations)return;
    const step=lesson.steps[session.index]; if(step.type!=='mark_structure_sequence'||session.answers[session.index]?.submitted)return;
    const scenario=scenarioFor(step),data=visibleScenarioData(scenario),rect=canvas.getBoundingClientRect(),pad=12,usable=Math.max(1,rect.width-pad*2),slot=usable/data.length;if(!data.length)return;
    const selectedIndex=Math.max(0,Math.min(data.length-1,Math.floor(Math.max(0,Math.min(usable-.001,event.clientX-rect.left-pad))/slot)));
    const targets=MarketChartAnnotations.structureSequenceTargets(step,data),prev=session.answers[session.index]||{selectedIndices:[]},selectedIndices=[...(prev.selectedIndices||[]),selectedIndex];
    const submitted=selectedIndices.length>=targets.length;
    const hits=selectedIndices.reduce((n,idx,i)=>n+(Math.abs(idx-targets[i].index)<=1?1:0),0),correct=submitted&&hits===targets.length;
    session.answers[session.index]={selectedIndices,targets,submitted,correct,decisionQuality:submitted?Math.round(35+65*(hits/targets.length)):null,financialOutcome:null};
    if(submitted&&window.MarketAICharacterDirector)MarketAICharacterDirector.emit('structure_sequence:submitted',{lesson,step,correct,hits,total:targets.length,scenario});
    hostRenderAfterDecision();
  };
  function replayContext(){
    const {session,lesson}=current(); if(!session||!lesson)return null;
    const step=lesson.steps[session.index]; if(step?.type!=='market_replay')return null;
    return {session,lesson,step,index:session.index,scenario:scenarioFor(step)};
  }
  if(window.MarketReplayController)MarketReplayController.connect({
    getContext:replayContext,
    commit(answer){const c=replayContext();if(!c)return;c.session.answers[c.index]=answer;},
    render:hostRenderAfterDecision,
    emit(event,payload){if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit(event,payload);}
  });
  window.lessonEngineChoose=function(optionId){
    const {session,lesson}=current(); if(!session||!lesson)return;
    const step=lesson.steps[session.index]; if(!isInteractive(step)||session.answers[session.index]?.submitted)return;
    const valid=(step.options||[]).some(o=>o.id===optionId); if(!valid)return;
    const scenario=step.type==='select_direction'&&typeof SCENARIOS!=='undefined'?SCENARIOS.find(s=>s.id===step.scenarioId):null;
    const acceptable=scenario?.acceptableAnswers||[step.correctAnswer];
    const correct=acceptable.includes(optionId);
    session.answers[session.index]={selected:optionId,submitted:true,correct,decisionQuality:correct?100:35,financialOutcome:null};
    if(window.MarketAICharacterDirector) MarketAICharacterDirector.emit('decision:submitted',{lesson,step,selected:optionId,correct,scenario});
    hostRenderAfterDecision();
  };
  function hostRenderAfterDecision(){ const {host,session,lesson}=current(); if(!host||!session||!lesson)return; const step=lesson.steps[session.index],answer=session.answers[session.index]; if(answer?.submitted&&!answer._adaptiveTracked&&window.MarketAIAdaptiveCoach){ MarketAIAdaptiveCoach.record({lessonId:lesson.id,stepType:step?.type,choice:answer.selected??answer.selectedIndex??answer.selectedLevel??null,quality:answer.decisionQuality??null,correct:answer.correct??null}); answer._adaptiveTracked=true; } host.innerHTML=renderStep(lesson,session.index,session); drawScenarioCharts(host); applySceneCues(host); if(window.MarketReplayController)MarketReplayController.schedule(); }
  window.lessonEngineNext=function(){ const {session,lesson}=current(); if(!session||!lesson)return; const step=lesson.steps[session.index]; if(isInteractive(step)&&!session.answers[session.index]?.submitted)return; if(session.index<lesson.steps.length-1){session.index++;mount();} };
  window.lessonEnginePrev=function(){ const {session}=current(); if(session&&session.index>0){session.index--;mount();} };
  window.lessonEngineFinish=function(id){ if(window.MarketReplayController)MarketReplayController.stop(id); const lesson=LESSONS.find(l=>l.id===id); window.MarketAIProgressEvents?.capture?.(); if(window.MarketAICharacterDirector)MarketAICharacterDirector.emit('lesson:complete',{lesson}); sessions.delete(id); if(typeof completeAcademyLesson==='function')completeAcademyLesson(id); setTimeout(()=>window.MarketAIProgressEvents?.toast?.(window.MarketAIProgressEvents?.diff?.()),80); };
  window.LessonEngine={open:window.openLessonEngine,getSession:id=>sessions.get(id)||null};
})();
