/* CP30 — curriculum catalog: scalable target map without fake completed lessons. */
(function(){
 const target=[['w_basics','Основы'],['w_candles','Свечи'],['w_trend','Trend'],['w_structure','Structure'],['w_levels','Levels'],['w_indicators','Indicators'],['w_otc','OTC'],['w_timing','Timing'],['w_expiration','Expiration'],['w_risk','Risk'],['w_psychology','Psychology'],['w_binary','Binary Options'],['w_crypto','Crypto'],['w_forex','Forex'],['w_stocks','Stocks'],['w_simulator','Simulator']];
 function snapshot(){const ids=new Set(WORLDS.map(w=>w.id));return target.map(([id,name])=>({id,name,status:ids.has(id)?'active':'planned',lessons:LESSONS.filter(l=>l.worldId===id).length}))}
 window.MarketAICurriculumCatalog={snapshot,targetLessonScale:300,targetScenarioScale:1000};
})();
