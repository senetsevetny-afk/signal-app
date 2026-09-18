/* Каталог учебной программы.
   Раньше здесь был зашит список из 16 «целевых» миров, из которых 9 не
   существовали в WORLDS и вечно отдавали status:'planned', lessons:0 —
   отсюда и брались «0 уроков / этот мир готовится». Плюс id расходились
   с ядром (w_indicators против w_indi).
   Теперь каталог не выдумывает миры, а описывает то, что реально есть. */
(function(){
 'use strict';
 function snapshot(){
   if(typeof WORLDS==='undefined'||typeof LESSONS==='undefined')return [];
   const names=window.MarketAIAcademyWorldNames||{};
   return WORLDS.slice().sort((a,b)=>(a.order||0)-(b.order||0)).map(w=>{
     const n=LESSONS.filter(l=>l.worldId===w.id).length;
     return {id:w.id,name:names[w.id]||w.id,icon:w.ic,lessons:n,
             modules:(w.modules||[]).length,
             status:n>0?'active':'empty'};
   });
 }
 function totals(){
   const s=snapshot();
   return {worlds:s.length,
           worldsWithLessons:s.filter(w=>w.lessons>0).length,
           lessons:typeof LESSONS!=='undefined'?LESSONS.length:0,
           scenarios:typeof SCENARIOS!=='undefined'?SCENARIOS.length:0};
 }
 /* Мир без уроков — это дефект сборки, а не «скоро будет». */
 function emptyWorlds(){return snapshot().filter(w=>w.lessons===0).map(w=>w.id)}
 window.MarketAICurriculumCatalog={snapshot,totals,emptyWorlds};
})();
