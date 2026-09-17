/* MARKET AI Academy — V92 Telegram-safe Universe navigation.
   No drag/pan capture. Vertical gestures always belong to Telegram/page.
   Planet selection = tap -> cinematic focus -> open world. */
(function(){
  'use strict';
  const names={w_basics:'Основы',w_candles:'Свечи',w_trend:'Структура',w_levels:'Уровни',w_indi:'Индикаторы',w_mtf:'Таймфреймы',w_risk:'Риск',w_binary:'Binary'};
  let animating=false, openTimer=0;

  function progress(id){
    const ls=LESSONS.filter(l=>l.worldId===id);
    return ls.length?Math.round(ls.filter(l=>lessonState(l.id).mastery!=='none').length/ls.length*100):0;
  }

  function layout(){
    const host=document.getElementById('acUniverse');
    const width=Math.max(280,Math.min(host?.clientWidth||340,430));
    const rx=Math.min(132,width*.34), ry=Math.min(116,width*.30);
    return WORLDS.slice().sort((a,b)=>a.order-b.order).map((w,n)=>{
      const a=(-Math.PI/2)+(n/WORLDS.length)*Math.PI*2;
      return {w,x:Math.cos(a)*rx,y:Math.sin(a)*ry};
    });
  }

  function render(){
    const host=document.getElementById('acUniverse'); if(!host)return;
    const planets=layout().map(({w,x,y})=>{
      const p=progress(w.id);
      return `<button type="button" class="acUPlanet" data-world="${w.id}" data-x="${x.toFixed(2)}" data-y="${y.toFixed(2)}" style="--x:${x.toFixed(2)}px;--y:${y.toFixed(2)}px" aria-label="${names[w.id]||w.id}"><span>${w.ic}</span><b>${names[w.id]||w.id}</b><small>${p}%</small><i style="--p:${p}%"></i></button>`;
    }).join('');
    host.innerHTML=`<div class="acUViewport"><div class="acUCamera"><div class="acUCore"><b>MARKET</b><span>AI</span></div>${planets}</div></div><div class="acUHint">Нажми на планету, чтобы открыть мир</div>`;
    bind(host);
  }

  function focusPlanet(btn){
    if(animating || !btn || btn.disabled)return;
    animating=true;
    const host=btn.closest('#acUniverse');
    const camera=host?.querySelector('.acUCamera');
    if(!camera){animating=false;return;}
    const x=Number(btn.dataset.x)||0, y=Number(btn.dataset.y)||0;
    host.classList.add('acUChoosing');
    host.querySelectorAll('.acUPlanet').forEach(p=>{
      p.classList.toggle('acUSelected',p===btn);
      p.classList.toggle('acUDimmed',p!==btn);
    });
    camera.classList.add('acUSmooth');
    camera.style.transform=`translate(${-x*1.18}px,${-y*1.18}px) scale(1.22)`;
    if(typeof setMascotState==='function')setMascotState('point');
    try{navigator.vibrate?.(8)}catch(_){ }
    clearTimeout(openTimer);
    openTimer=setTimeout(()=>{
      const world=btn.dataset.world;
      animating=false;
      if(typeof openAcademyWorld==='function')openAcademyWorld(world);
    },360);
  }

  function bind(host){
    const vp=host.querySelector('.acUViewport');
    if(!vp)return;
    /* Do not register pointerdown/move/touchmove handlers here.
       Native pan-y stays untouched, so Telegram/page scrolling wins. */
    vp.addEventListener('click',e=>{
      const btn=e.target.closest('.acUPlanet');
      if(btn)focusPlanet(btn);
    });
  }

  window.MarketAIUniverse={
    mount(){
      clearTimeout(openTimer); animating=false; render();
      setTimeout(()=>window.MarketAIUniverseProgression?.decorate?.(),0);
    },
    reset(){
      const host=document.getElementById('acUniverse'); if(!host)return;
      host.classList.remove('acUChoosing');
      host.querySelectorAll('.acUPlanet').forEach(p=>p.classList.remove('acUSelected','acUDimmed'));
      const c=host.querySelector('.acUCamera'); if(c){c.classList.add('acUSmooth');c.style.transform='translate(0,0) scale(1)';}
      animating=false;
    }
  };
})();
