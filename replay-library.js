/* CP29 — Replay library over market_replay lesson steps. */
(function(){
 function items(){return LESSONS.flatMap(l=>(l.steps||[]).map((s,i)=>({l,s,i})).filter(x=>x.s.type==='market_replay').map(x=>({id:`${x.l.id}:${x.i}`,lessonId:x.l.id,scenarioId:x.s.scenarioId,title:x.s.title||'Market Replay'})))}
 function open(){const xs=items();academyShellRender(`<button class="acBack" onclick="openAcademyScenarioHub()">‹ Practice Lab</button><div class="acHero"><div class="acEyebrow">REPLAY LIBRARY · SIMULATED DATA</div><h2>Market Replay</h2><p>Свечи раскрываются только по ходу сценария. Будущие данные скрыты до решения.</p></div><div class="acList">${xs.map(x=>`<button class="acLesson" onclick="openAcademyLesson('${x.lessonId}')"><span class="acLessonIc">▶</span><span class="acLessonM"><b>${x.title}</b><span>${x.scenarioId||'training fixture'}</span></span><span class="acState">REPLAY</span></button>`).join('')||'<div class="empty">Replay-сценарии ещё не добавлены.</div>'}</div>`,'MARKET REPLAY','TRAINING SCENARIOS')}
 window.MarketAIReplayLibrary={items,open};window.openAcademyReplayLibrary=open;
})();
