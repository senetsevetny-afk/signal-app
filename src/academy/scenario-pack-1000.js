/* MARKET AI Academy — 1050 deterministic training scenarios.
   Generated locally in-browser; never live market data. */
(function(){
 'use strict';
 if(typeof SCENARIOS==='undefined'||typeof makeScenario!=='function')return;
 const regimes=['trend','range','breakout','retest','reversal','chaos','compression'];
 const types=['ideal','weak','false','ambiguous','no_trade'];
 const existing=new Set(SCENARIOS.map(s=>s.id));
 for(let i=1;i<=1050;i++){
   const id=`mega_${String(i).padStart(4,'0')}`; if(existing.has(id))continue;
   const regime=regimes[(i-1)%regimes.length], type=types[(i-1)%types.length];
   const noTrade=type==='ambiguous'||type==='no_trade'||regime==='chaos';
   const drift=regime==='trend'?((i%2)?0.16:-0.16):regime==='breakout'?((i%2)?0.11:-0.11):0;
   const correct=noTrade?'skip':drift>0?'up':drift<0?'down':((i%3===0)?'skip':i%2?'up':'down');
   SCENARIOS.push(makeScenario({
     id,marketType:'training',timeframe:['1m','5m','15m','1h'][i%4],regime,seed:900000+i,n:72+(i%24),type,difficulty:1+(i%5),correct,
     acceptable:noTrade?['skip']:[correct],
     conflicts:noTrade?['сигналы конфликтуют','структура недостаточно ясна']:[],
     riskFactors:type==='weak'?['слабый импульс','неполное подтверждение']:type==='false'?['риск ложного движения']:[],
     gen:{drift,vol:regime==='chaos'?1.25:regime==='range'?0.32:0.58+(i%4)*0.08}
   }));
 }
 console.log('[MARKET AI] Training scenario library:',SCENARIOS.length,'scenarios');
})();
