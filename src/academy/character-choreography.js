/* MARKET AI Academy — Character Target Choreography v1.
   Translates semantic chart targets into renderer-neutral mentor pose data.
   No lesson content depends on CSS, DOM coordinates, Rive or 3D implementation. */
(function(){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function focusFor(scenario){
    if(!scenario||!window.MarketChartEventLayer)return null;
    try{return MarketChartEventLayer.get(scenario).focus||null}catch(_){return null}
  }
  function normalizedFocus(focus,payload={}){
    if(!focus)return null;
    const scenario=payload.scenario, total=Math.max(1,Number(payload.visibleCount)||Number(payload.visibleCandles)||scenario?.ohlc?.().slice(-42).length||42);
    if(focus.type==='candle'&&Number.isInteger(focus.index))return {kind:'candle',x:clamp((focus.index+.5)/total,0,1),y:.46,label:focus.label||'CANDLE',index:focus.index};
    if(focus.type==='level')return {kind:'level',x:.86,y:.5,label:focus.label||'LEVEL',price:focus.price};
    return null;
  }
  function resolve(scene,event,payload={}){
    const precise=normalizedFocus(focusFor(payload.scenario),payload);
    const review=/submitted|decision|complete/.test(event||'')||scene.phase==='review'||scene.phase==='replay_review';
    if(precise&&review)return {...scene,targetDetail:precise,orientation:precise.x>=.5?'right':'left',gesture:'point',proximity:'near'};
    if(scene.target==='scenario_chart')return {...scene,targetDetail:{kind:'chart',x:.78,y:.5,label:'CHART'},orientation:'right',gesture:scene.noHint?'observe':'point',proximity:scene.position==='right'?'near':'far'};
    return {...scene,targetDetail:null,orientation:'front',gesture:'neutral',proximity:'home'};
  }
  window.MarketAICharacterChoreography={resolve,normalizedFocus};
})();
