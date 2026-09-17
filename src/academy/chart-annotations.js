/* MARKET AI Academy — Chart Annotation Adapter v1.
   Semantic overlays and scoring helpers kept separate from raw canvas rendering. */
(function(){
  function bounds(data){
    const hi=Math.max(...data.map(c=>c.h)),lo=Math.min(...data.map(c=>c.l));
    return {hi,lo,range:Math.max(.0001,hi-lo)};
  }
  function supportZone(data){
    const {hi,lo,range}=bounds(data);
    const lows=data.map(c=>c.l).sort((a,b)=>a-b);
    const anchor=lows[Math.max(0,Math.floor(lows.length*.12))];
    const half=range*.055;
    return {low:Math.max(lo,anchor-half),high:Math.min(hi,anchor+half),kind:'support'};
  }
  function resistanceZone(data){
    const {hi,lo,range}=bounds(data);
    const highs=data.map(c=>c.h).sort((a,b)=>a-b);
    const anchor=highs[Math.min(highs.length-1,Math.floor(highs.length*.88))];
    const half=range*.055;
    return {low:Math.max(lo,anchor-half),high:Math.min(hi,anchor+half),kind:'resistance'};
  }
  function target(step,data){return step.targetRule==='resistance_zone'?resistanceZone(data):supportZone(data)}
  function levelTarget(step,data){const z=target(step,data);return (z.low+z.high)/2}
  function levelScore(selected,expected,data){const {range}=bounds(data);return Math.max(0,1-Math.abs(selected-expected)/Math.max(range*.18,.0001))}
  function structureTarget(step,data){
    if(step.targetRule==='latest_ll'){let idx=0;for(let i=1;i<data.length;i++)if(data[i].l<data[idx].l)idx=i;return idx}
    let idx=0;for(let i=1;i<data.length;i++)if(data[i].h>data[idx].h)idx=i;return idx
  }
  function structureSequenceTargets(step,data){
    if(step.targetRule==='down_lh_ll')return [{index:22,kind:'high',label:'LH'},{index:36,kind:'low',label:'LL'}];
    return [{index:10,kind:'high',label:'HH'},{index:22,kind:'low',label:'HL'},{index:36,kind:'high',label:'HH'}];
  }
  function priceAtY(y,height,data,pad=12){const {hi,range}=bounds(data);const t=Math.max(0,Math.min(1,(y-pad)/Math.max(1,height-pad*2)));return hi-t*range}
  function yAtPrice(price,height,data,pad=12){const {hi,range}=bounds(data);return pad+(hi-price)/range*(height-pad*2)}
  function normalize(a,b){return {low:Math.min(a,b),high:Math.max(a,b)}}
  function score(selected,expected){
    const overlap=Math.max(0,Math.min(selected.high,expected.high)-Math.max(selected.low,expected.low));
    const union=Math.max(selected.high,expected.high)-Math.min(selected.low,expected.low);
    return union>0?overlap/union:0;
  }
  function draw(ctx,zone,opts){
    if(!zone||!opts)return; const {height,data,width,pad=12}=opts;
    const y1=yAtPrice(zone.high,height,data,pad),y2=yAtPrice(zone.low,height,data,pad);
    ctx.save();ctx.fillStyle=zone.correct?'rgba(43,217,138,.14)':'rgba(99,230,255,.12)';ctx.strokeStyle=zone.correct?'rgba(43,217,138,.75)':'rgba(99,230,255,.75)';ctx.lineWidth=1.5;ctx.fillRect(pad,y1,width-pad*2,Math.max(2,y2-y1));ctx.strokeRect(pad,y1,width-pad*2,Math.max(2,y2-y1));ctx.restore();
  }
  window.MarketChartAnnotations={target,levelTarget,levelScore,structureTarget,structureSequenceTargets,priceAtY,yAtPrice,normalize,score,draw};
})();
