/* CP28 — reusable Scenario Engine facade. Keeps deterministic fixtures canonical. */
(function(){
 const interactive=new Set(['select_direction','tap_candle','tap_zone','drag_level','mark_structure','mark_structure_sequence','market_replay']);
 function lessonScenarios(lesson){return (lesson?.steps||[]).filter(s=>interactive.has(s.type)).map((s,i)=>({id:`${lesson.id}:${i}`,lessonId:lesson.id,stepIndex:i,type:s.type,scenarioId:s.scenarioId||null,title:s.title||s.prompt||'Практика'}))}
 function all(){return LESSONS.flatMap(lessonScenarios)}
 function byId(id){return all().find(x=>x.id===id)||null}
 function launch(item){const x=typeof item==='string'?byId(item):item;if(!x)return false;openAcademyLesson(x.lessonId);return true}
 window.MarketAIScenarioEngine={all,lessonScenarios,byId,launch,interactiveTypes:[...interactive]};
})();
