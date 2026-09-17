/* CP26 — Universe progression locks + current path focus. */
(function(){
 function lessons(w){return LESSONS.filter(l=>l.worldId===w.id).sort((a,b)=>a.order-b.order)}
 function unlocked(w){const ls=lessons(w);return !ls.length||ls.some(lessonAvailable)||ls.some(l=>lessonState(l.id).mastery!=='none')}
 function currentWorld(){return WORLDS.slice().sort((a,b)=>a.order-b.order).find(w=>unlocked(w)&&lessons(w).some(l=>lessonState(l.id).mastery==='none'&&lessonAvailable(l)))?.id||WORLDS[0]?.id}
 function decorate(root){root=root||document.getElementById('acUniverse');if(!root)return;const cur=currentWorld();root.querySelectorAll('.acUPlanet').forEach(b=>{const id=b.dataset.world,isOn=unlocked(WORLDS.find(w=>w.id===id));b.classList.toggle('acULocked',!isOn);b.classList.toggle('acUCurrent',id===cur);b.disabled=!isOn;b.setAttribute('aria-label',`${b.querySelector('b')?.textContent||id}${isOn?'':' — заблокировано'}`);if(id===cur&&!b.querySelector('.acUPath'))b.insertAdjacentHTML('beforeend','<em class="acUPath">CURRENT PATH</em>')})}
 window.MarketAIUniverseProgression={decorate,currentWorld,unlocked};
})();
