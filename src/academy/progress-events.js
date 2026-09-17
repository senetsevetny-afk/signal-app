/* CP27 — derived XP/mastery celebration events. */
(function(){
 let last=null;
 function snap(){return window.MarketAIAcademyProgress?.snapshot?.()||{xp:EDUP?.xp||0,done:0,worlds:0,achievements:[]}}
 function capture(){last=snap();return last}
 function diff(){const now=snap(),before=last||now;const badges=now.achievements.filter(a=>a.unlocked&&!before.achievements?.find(b=>b.id===a.id&&b.unlocked));const d={xp:now.xp-before.xp,lessons:now.done-before.done,worlds:now.worlds-before.worlds,badges};last=now;return d}
 function toast(d){if(!d||(!d.xp&&!d.lessons&&!d.badges?.length))return;const el=document.createElement('div');el.className='acRewardToast';el.innerHTML=`<b>PROGRESS UPDATED</b><span>${d.xp?`+${d.xp} XP · `:''}${d.lessons?'урок завершён':''}${d.badges?.length?` · ${d.badges.map(x=>x.title).join(', ')}`:''}</span>`;document.body.appendChild(el);setTimeout(()=>el.classList.add('show'),20);setTimeout(()=>el.remove(),2600)}
 window.MarketAIProgressEvents={capture,diff,toast};
})();
