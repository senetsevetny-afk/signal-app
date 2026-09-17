/* MARKET AI Academy — Telegram-friendly Universe navigation. */
(function(){
 'use strict';
 const names={w_basics:'Основы',w_candles:'Свечи',w_trend:'Структура',w_levels:'Уровни',w_indi:'Индикаторы',w_mtf:'Таймфреймы',w_risk:'Риск',w_binary:'Binary'};
 let cam={x:0,y:0,scale:1}, animating=false, raf=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function progress(id){const ls=LESSONS.filter(l=>l.worldId===id);return ls.length?Math.round(ls.filter(l=>lessonState(l.id).mastery!=='none').length/ls.length*100):0}
 function render(){
   const host=document.getElementById('acUniverse');if(!host)return;
   const planets=WORLDS.slice().sort((a,b)=>a.order-b.order).map((w,n)=>{const a=n/WORLDS.length*Math.PI*2,r=112+(n%2)*48,x=Math.cos(a)*r,y=Math.sin(a)*r,p=progress(w.id);return `<button class="acUPlanet" data-world="${w.id}" data-x="${x}" data-y="${y}" style="--x:${x}px;--y:${y}px"><span>${w.ic}</span><b>${names[w.id]||w.id}</b><small>${p}%</small><i style="--p:${p}%"></i></button>`}).join('');
   host.innerHTML=`<div class="acUViewport"><div class="acUCamera"><div class="acUCore"><b>MARKET</b><span>AI</span></div>${planets}</div></div><div class="acUHint">Нажми на планету · карта не перехватывает прокрутку Telegram</div>`;
   apply(false);bind(host);
 }
 function apply(smooth=true){const c=document.querySelector('#acUniverse .acUCamera');if(!c)return;c.classList.toggle('acUSmooth',smooth);c.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.scale})`}
 function focusPlanet(btn){
   if(animating)return;animating=true;
   const x=Number(btn.dataset.x)||0,y=Number(btn.dataset.y)||0;
   document.querySelectorAll('#acUniverse .acUPlanet').forEach(p=>p.classList.toggle('acUSelected',p===btn));
   cam={x:-x*1.32,y:-y*1.32,scale:1.32};apply(true);
   if(navigator.vibrate)navigator.vibrate(10);
   setTimeout(()=>{animating=false;openAcademyWorld(btn.dataset.world)},430);
 }
 function bind(host){
   const vp=host.querySelector('.acUViewport');
   /* Important for Telegram Mini App: vertical finger movement belongs to page/Telegram.
      Universe uses tap-to-focus instead of drag/pan. */
   vp.style.touchAction='pan-y';
   let down=null;
   vp.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,id:e.pointerId,t:performance.now()}},{passive:true});
   vp.addEventListener('pointerup',e=>{if(!down||down.id!==e.pointerId)return;const dx=e.clientX-down.x,dy=e.clientY-down.y,d=Math.hypot(dx,dy),dt=performance.now()-down.t;down=null;if(d>10||dt>650)return;const btn=e.target.closest('.acUPlanet');if(btn)focusPlanet(btn)},{passive:true});
   vp.addEventListener('pointercancel',()=>down=null,{passive:true});
 }
 window.MarketAIUniverse={mount(){cancelAnimationFrame(raf);cam={x:0,y:0,scale:1};animating=false;render();setTimeout(()=>window.MarketAIUniverseProgression?.decorate?.(),0)},reset(){cam={x:0,y:0,scale:1};apply(true)}};
})();
