/* Checkpoint 24 — derived progress + achievements. No duplicate progress database. */
(function(){
 const defs=[['first_step','FIRST STEP','Завершён первый урок',()=>done()>=1],['five_lessons','MOMENTUM','Завершено 5 уроков',()=>done()>=5],['disciplined','DISCIPLINE','Есть опыт WAIT / SKIP',()=>Object.keys(EDUP?.mistakes||{}).length>=0 && (EDUP?.xp||0)>=20],['explorer','EXPLORER','Открыты навыки в 3 мирах',()=>worlds()>=3]];
 const done=()=>LESSONS.filter(l=>lessonState(l.id).mastery!=='none').length;
 const worlds=()=>WORLDS.filter(w=>LESSONS.some(l=>l.worldId===w.id&&lessonState(l.id).mastery!=='none')).length;
 function snapshot(){return {xp:EDUP?.xp||0,done:done(),total:LESSONS.length,worlds:worlds(),achievements:defs.map(([id,title,desc,test])=>({id,title,desc,unlocked:!!test()}))}}
 function render(){const s=snapshot();return `<section class="acProgressPanel"><div class="acSection"><b>Прогресс</b><i></i></div><div class="acProgressGrid"><div><b>${s.xp}</b><span>XP</span></div><div><b>${s.done}/${s.total}</b><span>Уроки</span></div><div><b>${s.worlds}/${WORLDS.length}</b><span>Миры</span></div></div><div class="acBadges">${s.achievements.map(a=>`<div class="${a.unlocked?'on':''}"><b>${a.unlocked?'◆':'◇'} ${a.title}</b><span>${a.desc}</span></div>`).join('')}</div></section>`}
 window.MarketAIAcademyProgress={snapshot,render};
})();
