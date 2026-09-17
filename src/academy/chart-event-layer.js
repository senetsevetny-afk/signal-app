/* MARKET AI Academy — Chart Event / Annotation Layer v1.
   Converts semantic lesson/replay events into chart overlays. It never reveals
   future candles and only exposes breakout/retest/reaction markers after a learner decision. */
(function(){
  const states=new Map();
  const palette={info:'#63E6FF',warn:'#F5B942',ok:'#2BD98A',bad:'#FF5C6C'};
  function key(scenario){return typeof scenario==='string'?scenario:scenario?.id}
  function get(scenario){const k=key(scenario);return k?states.get(k)||{events:[],focus:null}: {events:[],focus:null}}
  function put(scenario,next){const k=key(scenario);if(k)states.set(k,next);return next}
  function clear(scenario){const k=key(scenario);if(k)states.delete(k)}
  function setEvents(scenario,events=[],focus=null){return put(scenario,{events:[...events],focus})}
  function marker(index,label,tone='info'){return {type:'candle',index,label,tone}}
  function level(price,label='KEY LEVEL',tone='warn'){return {type:'level',price,label,tone}}
  function replayEvents(scenario,stage){
    const meta=scenario?.trainingMeta||{}, out=[];
    if(meta.level!=null)out.push(level(meta.level));
    if(meta.kind==='retest'){
      if(stage>=1){out.push(marker(20,'BREAK','warn'));out.push(marker(36,'RETEST','info'))}
      if(stage>=2)out.push(marker(41,'REACTION','ok'));
    }else if(meta.kind==='role'){
      if(stage>=0)out.push(marker(17,'BREAK','warn'));
      if(stage>=1)out.push(marker(36,'RETEST','info'));
    }else if(meta.kind==='breakout') out.push(marker(39,'BREAK','warn'));
    else if(meta.kind==='falsebreak'){
      out.push(marker(34,'BREAK','warn'));
      if(stage>=1)out.push(marker(39,'BACK BELOW','bad'));
    }
    return out;
  }
  function decisionEvents(scenario){
    const meta=scenario?.trainingMeta||{};
    if(meta.kind==='retest')return [level(meta.level),marker(20,'BREAK','warn'),marker(36,'RETEST','info'),marker(41,'REACTION','ok')];
    if(meta.kind==='role')return [level(meta.level),marker(17,'BREAK','warn'),marker(36,'RETEST','info')];
    if(meta.kind==='breakout')return [level(meta.level),marker(39,'BREAK','warn')];
    if(meta.kind==='falsebreak')return [level(meta.level),marker(34,'BREAK','warn'),marker(39,'BACK BELOW','bad')];
    return meta.level!=null?[level(meta.level)]:[];
  }
  function sync(scene,event,payload={}){
    const scenario=payload.scenario;if(!scenario)return;
    if(event==='lesson:step'){clear(scenario);return}
    if(event==='replay:decision'){
      const stage=Number(payload.stage)||0,events=replayEvents(scenario,stage);
      const candles=events.filter(x=>x.type==='candle'),focus=candles[candles.length-1]||events[0]||null;
      setEvents(scenario,events,focus);return;
    }
    if(event==='replay:complete'){const events=replayEvents(scenario,99);setEvents(scenario,events,events[events.length-1]||null);return}
    if(event==='decision:submitted'){const events=decisionEvents(scenario);setEvents(scenario,events,events[events.length-1]||null);return}
    /* Gate/tick/play intentionally add no event marker: no pre-answer hint. */
  }
  function draw(ctx,{scenario,data,width,height,pad=12,y,slot,visibleCount,mentor=true}={}){
    if(!ctx||!scenario||!data?.length)return;const s=get(scenario),visible=Math.min(data.length,Number(visibleCount)||data.length);
    ctx.save();ctx.font='700 9px Manrope, sans-serif';ctx.textBaseline='bottom';
    s.events.forEach(ev=>{
      const color=palette[ev.tone]||palette.info;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.5;
      if(ev.type==='level'&&Number.isFinite(ev.price)){
        const yy=y(ev.price);ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(pad,yy);ctx.lineTo(width-pad,yy);ctx.stroke();ctx.setLineDash([]);ctx.fillText(ev.label||'LEVEL',pad+4,Math.max(12,yy-5));
      }
      if(ev.type==='candle'&&Number.isInteger(ev.index)&&ev.index<visible){
        const x=pad+slot*ev.index+slot/2,py=y(data[ev.index].c);ctx.beginPath();ctx.arc(x,py,4,0,Math.PI*2);ctx.fill();ctx.fillText(ev.label||'EVENT',Math.min(width-78,x+6),Math.max(12,py-7));
      }
    });
    const f=s.focus;
    if(mentor&&f){let x=null,yy=null;if(f.type==='candle'&&Number.isInteger(f.index)&&f.index<visible){x=pad+slot*f.index+slot/2;yy=y(data[f.index].c)}else if(f.type==='level'&&Number.isFinite(f.price)){x=width-pad-8;yy=y(f.price)}
      if(x!=null&&yy!=null){ctx.strokeStyle='rgba(99,230,255,.8)';ctx.fillStyle='#63E6FF';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(Math.max(pad,x-42),Math.max(16,yy-28));ctx.lineTo(x,yy);ctx.stroke();ctx.setLineDash([]);ctx.fillText('MARKET AI',Math.max(pad,Math.min(width-70,x-62)),Math.max(12,yy-30));}
    }
    ctx.restore();
  }
  window.MarketChartEventLayer={get,clear,setEvents,sync,draw,replayEvents,decisionEvents};
})();
