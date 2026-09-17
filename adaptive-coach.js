/* CP31–33 — local mistake journal + adaptive practice recommendations. */
(function(){
 const KEY='market_ai_academy_attempts_v1';
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){return[]}}
 function save(x){localStorage.setItem(KEY,JSON.stringify(x.slice(-250)))}
 function record(x){const a=load();a.push({ts:Date.now(),lessonId:x.lessonId||null,stepType:x.stepType||null,choice:x.choice??null,quality:x.quality??null,correct:x.correct??null});save(a)}
 function weakTypes(){const a=load(),m={};a.forEach(x=>{if(!x.stepType)return;(m[x.stepType]??={n:0,bad:0});m[x.stepType].n++;if(x.correct===false||x.quality==='poor')m[x.stepType].bad++});return Object.entries(m).sort((a,b)=>(b[1].bad/b[1].n)-(a[1].bad/a[1].n)).map(x=>x[0])}
 function recommendations(limit=5){const weak=weakTypes();const all=window.MarketAIScenarioEngine?.all?.()||[];return all.sort((a,b)=>{const ai=weak.indexOf(a.type),bi=weak.indexOf(b.type);return (ai<0?999:ai)-(bi<0?999:bi)}).slice(0,limit)}
 function render(){const r=recommendations();return `<section class="acProgressPanel"><div class="acSection"><b>Adaptive Coach</b><i></i></div><p class="acMiniCopy">Рекомендации строятся только по локальной учебной истории, не по финансовому результату.</p><div class="acList">${r.map(x=>`<button class="acLesson" onclick="MarketAIScenarioEngine.launch('${x.id}')"><span class="acLessonIc">◎</span><span class="acLessonM"><b>${x.title}</b><span>${x.type.replaceAll('_',' ')}</span></span><span class="acState">TRAIN</span></button>`).join('')||'<div class="empty">Пройди несколько интерактивных заданий — здесь появится персональная практика.</div>'}</div></section>`}
 window.MarketAIAdaptiveCoach={record,load,weakTypes,recommendations,render};
})();
