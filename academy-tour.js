/* Checkpoint 20 — skippable Academy Intro Tour. */
(function(){
 const KEY='mai_academy_tour_v1'; let i=0;
 const steps=[
  {state:'welcome',title:'Добро пожаловать в MARKET AI Academy',text:'Здесь ты учишься читать рынок по шагам — без обещаний результата и без подсматривания будущих свечей.'},
  {state:'globe',title:'Миры обучения',text:'Каждый мир собирает один навык: свечи, структура, уровни, индикаторы, риск и другие темы.'},
  {state:'point',title:'Интерактивные уроки',text:'Ты будешь нажимать на свечи, отмечать зоны, строить структуру и принимать решения прямо на учебном графике.'},
  {state:'shield',title:'Процесс важнее исхода',text:'SKIP и WAIT — нормальные решения. Академия оценивает качество анализа отдельно от движения цены.'}
 ];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function done(){localStorage.setItem(KEY,'1');document.querySelector('.acTour')?.remove();window.openZeroKnowledgeJourney?.();}
 function render(){document.querySelector('.acTour')?.remove();const s=steps[i],el=document.createElement('div');el.className='acTour';el.innerHTML=`<div class="acTourCard"><button class="acTourSkip">Пропустить</button>${window.MarketAICharacter?MarketAICharacter.render({state:s.state,speech:s.text}):''}<div class="acTourCopy"><small>${i+1} / ${steps.length}</small><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><div class="acTourDots">${steps.map((_,n)=>`<i class="${n===i?'on':''}"></i>`).join('')}</div><button class="acPrimary acTourNext">${i===steps.length-1?'Начать':'Дальше'}</button></div></div>`;document.body.appendChild(el);el.querySelector('.acTourSkip').onclick=done;el.querySelector('.acTourNext').onclick=()=>{if(i<steps.length-1){i++;render()}else done()};}
 window.openAcademyTour=function(force=false){if(!force&&localStorage.getItem(KEY)==='1')return false;i=0;render();return true};
 window.resetAcademyTour=()=>localStorage.removeItem(KEY);
})();
