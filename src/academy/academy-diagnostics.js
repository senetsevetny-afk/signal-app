/* CP40–43 — production diagnostics / integrity / security guard. */
(function(){
 function run(){const v=typeof validateAcademy==='function'?validateAcademy():{ok:false,errors:['validator unavailable'],warns:[],counts:{}};const scripts=['academy-core.js','academy-shell.js','lesson-engine.js','character-director.js','replay-controller.js'];const clientSecretRisk=[...document.scripts].some(s=>/sk-[A-Za-z0-9_-]{20,}|ANTHROPIC_API_KEY|OPENAI_API_KEY/.test(s.textContent||''));return {ok:v.ok&&!clientSecretRisk,validator:v,clientSecretRisk,scripts,telegram:!!window.Telegram?.WebApp,storage:(()=>{try{localStorage.setItem('__ac_test','1');localStorage.removeItem('__ac_test');return true}catch(_){return false}})()}}
 function open(){const d=run();academyShellRender(`<button class="acBack" onclick="openAcademy()">‹ Академия</button><div class="acHero"><div class="acEyebrow">SYSTEM CHECK</div><h2>${d.ok?'Academy core ready':'Нужна проверка'}</h2><p>Локальная диагностика структуры. Она не заменяет реальный Telegram/mobile QA.</p></div><div class="acDiag"><div><b>Registry validator</b><span>${d.validator.ok?'PASS':'FAIL'}</span></div><div><b>Client secret scan</b><span>${d.clientSecretRisk?'RISK':'PASS'}</span></div><div><b>localStorage</b><span>${d.storage?'PASS':'FAIL'}</span></div><div><b>Telegram context</b><span>${d.telegram?'DETECTED':'BROWSER MODE'}</span></div>${cat()}<small>${d.validator.warns?.length||0} content warnings · ${d.validator.errors?.length||0} errors</small></div>`,'ACADEMY DIAGNOSTICS','LOCAL READINESS CHECK')}
 function cat(){
  const C=window.MarketAICurriculumCatalog; if(!C)return '';
  const t=C.totals(), empty=C.emptyWorlds();
  return `<div><b>Миры с уроками</b><span>${t.worldsWithLessons}/${t.worlds}</span></div>`
   +`<div><b>Уроки · сценарии</b><span>${t.lessons} · ${t.scenarios}</span></div>`
   +(empty.length?`<div><b>Пустые миры</b><span>${empty.join(', ')}</span></div>`:'');
 }window.MarketAIAcademyDiagnostics={run,open};window.openAcademyDiagnostics=open;
})();
