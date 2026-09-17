/* CP34–36 — deterministic final assessment shell. No P&L scoring. */
(function(){
 const KEY='market_ai_academy_exam_v1';
 function pool(){return (window.MarketAIScenarioEngine?.all?.()||[]).filter(x=>x.type!=='market_replay')}
 function snapshot(){const p=pool(),done=LESSONS.filter(l=>lessonState(l.id).mastery!=='none').length;return {eligible:done>=Math.min(5,LESSONS.length),pool:p.length,completed:JSON.parse(localStorage.getItem(KEY)||'null')}}
 function open(){const s=snapshot();academyShellRender(`<button class="acBack" onclick="openAcademy()">‹ Академия</button><div class="acHero"><div class="acEyebrow">FINAL ASSESSMENT</div><h2>Экзамен MARKET AI</h2><p>Экзамен проверяет чтение контекста, дисциплину WAIT/SKIP и качество решений. Он не измеряет доходность.</p></div><div class="acExamCard"><b>${s.eligible?'ГОТОВ К ТРЕНИРОВОЧНОМУ ЭКЗАМЕНУ':'СНАЧАЛА ЗАВЕРШИ БАЗОВЫЕ УРОКИ'}</b><span>Доступно интерактивных заданий: ${s.pool}</span><button class="btn" ${s.eligible&&s.pool?'':'disabled'} onclick="MarketAIExam.start()">Начать</button></div>`,'MARKET AI EXAM','PROCESS QUALITY · NOT P&L')}
 function start(){const p=pool();if(!p.length)return;localStorage.setItem(KEY,JSON.stringify({startedAt:Date.now(),items:p.slice(0,Math.min(7,p.length)).map(x=>x.id)}));window.MarketAIScenarioEngine.launch(p[0])}
 window.MarketAIExam={snapshot,open,start};window.openAcademyExam=open;
})();
