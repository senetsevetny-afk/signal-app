/* Checkpoint 21 — Zero Knowledge Journey: a tiny orientation path, not a trading signal. */
(function(){
 const KEY='mai_zero_journey_v1'; let step=0;
 const cards=[
  ['Что такое свеча?','Свеча показывает открытие, максимум, минимум и закрытие цены за выбранный период.'],
  ['Что такое контекст?','Одна свеча не даёт полной картины. Смотри на соседние свечи, структуру и уровни.'],
  ['Нужно ли всегда входить?','Нет. WAIT и SKIP — полноценные решения, когда подтверждения недостаточно.']
 ];
 function close(mark=true){if(mark)localStorage.setItem(KEY,'1');document.querySelector('.acZero')?.remove();}
 function draw(){document.querySelector('.acZero')?.remove();const [t,p]=cards[step],el=document.createElement('div');el.className='acZero';el.innerHTML=`<div class="acZeroCard"><div class="acEyebrow">ZERO KNOWLEDGE · ${step+1}/${cards.length}</div><h3>${t}</h3><p>${p}</p><div class="acZeroVisual"><span>${step===0?'OHLC':step===1?'CONTEXT':'WAIT / SKIP'}</span></div><button class="acPrimary">${step===cards.length-1?'Открыть Академию':'Понятно'}</button><button class="acTextBtn">Закрыть</button></div>`;document.body.appendChild(el);el.querySelector('.acPrimary').onclick=()=>{if(++step>=cards.length){close();window.openAcademy?.()}else draw()};el.querySelector('.acTextBtn').onclick=()=>close(false);}
 window.openZeroKnowledgeJourney=function(force=false){if(!force&&localStorage.getItem(KEY)==='1')return false;step=0;draw();return true};
})();
