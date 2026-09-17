/* MARKET AI Academy — Character Scene Timeline v1.
   Orchestrates renderer-neutral mentor beats around lesson decisions.
   Timeline emits semantic director events; it never reveals chart answers. */
(function(){
  let runId=0, timers=[];
  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const clear=()=>{runId++;timers.forEach(clearTimeout);timers=[]};
  function patch(scene){
    const host=document.getElementById('lessonEngineHost'), old=host?.querySelector('.maiScene');
    if(!old||!window.MarketAICharacter)return;
    const box=document.createElement('div');box.innerHTML=MarketAICharacter.render(scene);const next=box.firstElementChild;
    if(next)old.replaceWith(next);
    if(host){host.querySelector('.leStage')?.setAttribute('data-scene-phase',scene.phase||'');const chart=host.querySelector('.leScenario');if(chart&&scene.target==='scenario_chart'){chart.classList.add('leChartTarget');if(scene.chartCue)chart.dataset.chartCue=scene.chartCue;}}
  }
  function beat(event,payload,delay,id){
    const fire=()=>{if(id!==runId||!window.MarketAICharacterDirector)return;MarketAICharacterDirector.emit(event,{...payload,timelineInternal:true})};
    if(delay<=0)fire();else timers.push(setTimeout(fire,delay));
  }
  function sequence(kind,payload={}){
    clear();const id=runId, fast=reduced(), unit=fast?35:260;
    if(kind==='prompt'){
      beat('timeline:approach',payload,0,id);beat('timeline:orient',payload,unit,id);beat('timeline:present',payload,unit*2,id);beat('timeline:step_away',payload,unit*3,id);
    }else if(kind==='review'){
      beat('timeline:return',payload,0,id);beat('timeline:inspect',payload,unit,id);beat('timeline:explain',payload,unit*2,id);
    }else if(kind==='complete'){
      beat('timeline:return',payload,0,id);beat('timeline:celebrate',payload,unit,id);
    }
  }
  function onDirector(scene,event,payload={}){
    patch(scene);
    if(payload.timelineInternal)return;
    if(event==='lesson:step'){
      const t=payload.step?.type;
      if(['tap_candle','tap_zone','drag_level','mark_structure','mark_structure_sequence','select_direction'].includes(t))sequence('prompt',payload);
    }else if(['candle:submitted','zone:submitted','level:submitted','structure:submitted','structure_sequence:submitted','decision:submitted','replay:decision'].includes(event)) sequence('review',payload);
    else if(event==='lesson:complete'||event==='replay:complete') sequence('complete',payload);
  }
  if(window.MarketAICharacterDirector)MarketAICharacterDirector.subscribe(onDirector);
  window.MarketAICharacterTimeline={sequence,cancel:clear,patch};
})();
