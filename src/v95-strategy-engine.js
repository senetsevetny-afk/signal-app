/* MARKET AI V95 — real strategy execution layer */
(()=>{'use strict';
const W=window, $=s=>document.querySelector(s);
const META={
 multi:{name:'Multi-Timeframe',about:'Сводит структуру, тренд, уровни, импульс и старший ТФ.',use:'Когда нужен общий технический контекст.',skip:'При конфликте ТФ или слабом перевесе факторов.',checks:['структура','EMA','уровни','импульс','старший ТФ']},
 trend:{name:'Trend Following',about:'Ищет продолжение сформированного тренда.',use:'При последовательной структуре и направленных EMA.',skip:'Во флэте, у сильного встречного уровня и при конфликте HTF.',checks:['EMA 9/21/50','ADX','Supertrend','HTF']},
 price:{name:'Price Action',about:'Решение строится вокруг свечей, структуры и реакции на уровни.',use:'При читаемой структуре и подтверждённой реакции цены.',skip:'При хаотичных свечах и без уровня/формации.',checks:['свечи','фигуры','уровни','структура']},
 levels:{name:'Support / Resistance',about:'Ищет реакцию у подтверждённой поддержки или сопротивления.',use:'Когда цена близко к зоне с несколькими касаниями.',skip:'В середине диапазона или при импульсном пробое зоны.',checks:['уровень','касания','rejection','HTF']},
 breakout:{name:'Breakout + Retest',about:'Не входит в первый пробой: ждёт закрепление и возврат к зоне.',use:'После пробоя диапазона с подтверждением импульса.',skip:'Если нет ретеста или пробой сразу вернулся в диапазон.',checks:['уровень','пробой','retest','объём','структура']},
 pullback:{name:'Pullback with Trend',about:'Ищет контролируемый откат и продолжение основного тренда.',use:'В тренде после возврата к EMA/зоне.',skip:'Если откат ломает структуру или HTF против.',checks:['тренд','откат','EMA','уровень','HTF']},
 ema:{name:'EMA Trend',about:'EMA 9/21/50 задают направление; импульс подтверждает вход.',use:'Когда EMA выстроены и имеют направленный контекст.',skip:'При переплетённых EMA или встречном HTF.',checks:['EMA 9','EMA 21','EMA 50','ADX','HTF']},
 rsi:{name:'RSI + Trend Filter',about:'RSI используется только как подтверждение внутри тренда.',use:'При согласии RSI с трендом/структурой.',skip:'Не торгует один лишь overbought/oversold против тренда.',checks:['RSI','EMA','структура','HTF']},
 stochastic:{name:'Stochastic Context',about:'Стохастик выбирает момент, но направление задают тренд и уровни.',use:'На откате к зоне внутри понятного контекста.',skip:'В сильном импульсе против тренда.',checks:['Stochastic','уровень','EMA','HTF']},
 macd:{name:'MACD Momentum',about:'Ищет смену/продолжение импульса MACD с трендовым фильтром.',use:'При расширяющемся импульсе и согласии HTF.',skip:'При затухающей гистограмме и конфликте структуры.',checks:['MACD','ADX','EMA','HTF']},
 scalping:{name:'Scalping 1–5 min',about:'Короткий сетап с жёстким фильтром шума и волатильности.',use:'Только на 1–5m при достаточном импульсе и ликвидности.',skip:'При слабом движении, конфликте факторов или слишком высокой волатильности.',checks:['1–5m','ATR','VWAP','объём','уровень']},
 news:{name:'Fundamental / News',about:'Фундаментальный режим требует подтверждённого news/calendar feed.',use:'Только после подключения источника событий.',skip:'Без news feed технические свечи не выдаются за фундаментальный анализ.',checks:['news feed','время события','волатильность','ликвидность']}
};
W.MARKET_AI_V95={version:'95',strategies:META};

function f(a,n){return a?.factors?.find(x=>x.name===n)}
function side(x){return x?.dir==='up'?1:x?.dir==='down'?-1:0}
function agree(a,n,d){return side(f(a,n))===d}
function factorText(a,n){return f(a,n)?.text||''}
function decision(a,k,tf){
 const d=a.dir==='CALL'?1:a.dir==='PUT'?-1:0, h=side(f(a,'Старший таймфрейм')), trend=side(f(a,'Тренд EMA'));
 const out={decision:a.dir,state:a.dir==='WAIT'?'WAIT':'READY',reasons:[],missing:[],window:null};
 const veto=(why,state='NO_TRADE')=>{out.decision=state==='WAIT'?'WAIT':'NO_TRADE';out.state=state;out.reasons.push(why)};
 if(k==='news'){veto('News / economic-calendar feed не подключён. MARKET AI не имитирует фундаментальный сигнал.');return out}
 if(!d){out.reasons.push('Недостаточный технический перевес.');return out}
 if(h && h!==d && ['multi','trend','pullback','ema','rsi','macd','scalping'].includes(k)) veto('Старший таймфрейм направлен против сетапа.');
 if(out.state==='NO_TRADE')return out;
 switch(k){
  case 'trend': if(trend!==d||!agree(a,'Сила тренда',d)) veto('Нет одновременно направленных EMA и подтверждённой силы тренда.','WAIT'); break;
  case 'price': if(!agree(a,'Свечная формация',d)&&!agree(a,'Фигура графика',d)&&!agree(a,'Уровень рядом',d)) veto('Price Action не получил подтверждения свечой, фигурой или уровнем.','WAIT'); break;
  case 'levels': if(!agree(a,'Уровень рядом',d)) veto('Цена не дала подтверждённую реакцию у нужного уровня.','WAIT'); break;
  case 'breakout': {
    const lv=factorText(a,'Уровень рядом'); const vol=agree(a,'Объём',d), force=agree(a,'Сила тренда',d);
    if(!vol||!force||/середине диапазона|далеко/.test(lv)) veto('Пробой ещё не подтверждён объёмом/импульсом и ретестом зоны.','WAIT');
    break; }
  case 'pullback': if(trend!==d||(!agree(a,'Уровень рядом',d)&&!agree(a,'RSI',d))) veto('Откат пока не подтвердил продолжение основного тренда.','WAIT'); break;
  case 'ema': if(trend!==d||!agree(a,'Сила тренда',d)) veto('EMA и сила тренда не дают совместного подтверждения.','WAIT'); break;
  case 'rsi': if(trend!==d||!agree(a,'RSI',d)) veto('RSI не подтверждает направление тренда.','WAIT'); break;
  case 'stochastic': if(!agree(a,'Стохастик',d)||(trend&&trend!==d)) veto('Стохастик не подтверждён трендовым контекстом.','WAIT'); break;
  case 'macd': if(!agree(a,'MACD',d)||(h&&h!==d)) veto('MACD не подтверждён импульсом старшего ТФ.','WAIT'); break;
  case 'scalping': if(!['1m','3m','5m'].includes(tf)) veto('Scalping работает только на 1–5 минут.'); else if(a.atrPct>1.4||!agree(a,'VWAP',d)) veto('Шум/волатильность или VWAP не подтверждают короткий вход.','WAIT'); break;
  case 'multi': if(h&&h!==d) veto('Рабочий и старший таймфреймы конфликтуют.'); break;
 }
 if(out.state==='READY'){
   const now=Date.now(), tfms=(W.MS?.[tf]||300000), delay=Math.min(60000,Math.max(15000,Math.round(tfms*.08)));
   out.window={from:now,to:now+delay}; out.reasons.push('Условия выбранной стратегии подтверждены текущими факторами.');
 }
 return out;
}

// Extend the actual strategy registry used by analyze(), not only the UI.
try{Object.entries(META).forEach(([k,m])=>{if(!W.STRATS[k]) W.STRATS[k]={name:m.name,tag:m.checks.slice(0,2).join(' + '),desc:m.about,mult:{}}});}catch(e){}
const weights={trend:{'Тренд EMA':2.2,'Сила тренда':2,'Supertrend':1.6,'Старший таймфрейм':1.8},levels:{'Уровень рядом':2.6,'Свечная формация':1.7,'Старший таймфрейм':1.4},breakout:{'Уровень рядом':2.2,'Объём':2,'Сила тренда':1.8,'Фигура графика':1.6},pullback:{'Тренд EMA':2,'Уровень рядом':1.8,'RSI':1.3,'Старший таймфрейм':1.7},ema:{'Тренд EMA':2.5,'Пересечение EMA':2,'Сила тренда':1.8,'Старший таймфрейм':1.6},rsi:{'RSI':2.2,'Тренд EMA':1.7,'Старший таймфрейм':1.5},stochastic:{'Стохастик':2.2,'Тренд EMA':1.5,'Уровень рядом':1.5},macd:{'MACD':2.4,'Сила тренда':1.7,'Старший таймфрейм':1.6},scalping:{'VWAP':1.9,'Объём':1.8,'Свечная формация':1.6,'Уровень рядом':1.5,'Сила тренда':1.5},news:{}};
try{Object.entries(weights).forEach(([k,m])=>W.STRATS[k].mult=m)}catch(e){}

const baseAnalyze=W.analyze;
if(typeof baseAnalyze==='function') W.analyze=function(k,htf){
 const a=baseAnalyze(k,htf), key=W.STRAT||'multi', gate=decision(a,key,W.S?.tf||'5m');
 a.rawDir=a.dir; a.dir=gate.decision; a.strategyKey=key; a.strategyName=META[key]?.name||W.STRATS?.[key]?.name||key; a.strategyState=gate.state; a.strategyReasons=gate.reasons; a.entryWindow=gate.window;
 return a;
};

function tm(t){return new Date(t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
const baseDetail=W.renderDetail;
if(typeof baseDetail==='function') W.renderDetail=function(sig,to){
 const r=baseDetail.apply(this,arguments); setTimeout(()=>{
   const host=document.getElementById(to); if(!host||host.querySelector('.v95Decision'))return;
   const a=sig.a||{}, key=a.strategyKey||W.STRAT||'multi', m=META[key]||META.multi;
   const state=a.dir==='NO_TRADE'?'⛔ НЕ ВХОДИТЬ':a.dir==='WAIT'?'🟡 ЖДАТЬ':a.dir==='CALL'?'🟢 ВВЕРХ':'🔴 ВНИЗ';
   const win=a.entryWindow?`${tm(a.entryWindow.from)}–${tm(a.entryWindow.to)}`:'Не сформировано';
   host.insertAdjacentHTML('afterbegin',`<section class="v95Decision"><small>STRATEGY ENGINE · V95</small><h2>${state}</h2><div class="v95Grid"><div><span>Стратегия</span><b>${m.name}</b></div><div><span>Оптимальное окно</span><b>${win}</b></div></div><p>${(a.strategyReasons||[]).join(' ')}</p><button onclick="window.V95OpenStrategy('${key}')">Почему эта стратегия?</button></section>`);
 },0); return r;
};

W.V95OpenStrategy=function(k){const m=META[k]||META.multi;let d=$('#v95StrategyModal');if(!d){d=document.createElement('div');d.id='v95StrategyModal';d.className='v95Modal';document.body.append(d)}d.innerHTML=`<div class="v95Sheet"><button class="x" onclick="this.closest('.v95Modal').classList.remove('on')">×</button><small>MARKET AI · STRATEGY</small><h2>${m.name}</h2><p>${m.about}</p><div><b>Когда использовать</b><p>${m.use}</p></div><div><b>Когда пропустить</b><p>${m.skip}</p></div><div><b>Что проверяет движок</b><p>${m.checks.join(' · ')}</p></div><div class="risk"><b>Риск</b><p>Ни одна стратегия не гарантирует результат. При конфликте условий MARKET AI возвращает ЖДАТЬ или НЕ ВХОДИТЬ.</p></div></div>`;d.classList.add('on')};

function strategyUI(){
 const box=$('#stratBox'); if(box){box.innerHTML=Object.entries(META).map(([k,m])=>`<div class="stRow ${k===W.STRAT?'on':''}" onclick="setStrat('${k}');setTimeout(strategyUI,0)"><div class="stIco">${k==='news'?'◉':'⌁'}</div><div style="flex:1"><b>${m.name} <s>${m.checks[0]}</s></b><p>${m.about}</p><button class="v95Learn" onclick="event.stopPropagation();V95OpenStrategy('${k}')">Подробнее · когда использовать</button></div><span class="stDot"></span></div>`).join('')}
 document.querySelectorAll('.nb').forEach(b=>{const t=b.dataset.t;if(t==='history')b.lastChild.nodeValue=' Журнал'; if(t==='home')b.lastChild.nodeValue=' Главная';});
}

// Settled trade scene: calm premium success/loss state and trade-analysis action.
let shown=new Set(); function resultScene(){try{W.history?.forEach(s=>{if(!['win','loss'].includes(s.result)||shown.has(s.id))return;shown.add(s.id);if(Date.now()-(s.expiry||s.ts)>20*60*1000)return;const host=$('#homeResult');if(!host)return;const win=s.result==='win';host.insertAdjacentHTML('afterbegin',`<section class="v95Outcome ${win?'plus':'minus'}"><div class="v95Character">${win?'<div class="trophy">★<i>$</i></div>':'<div class="face">AI<span>−</span></div>'}</div><small>RESULT</small><h2>${win?'+ СДЕЛКА ЗАВЕРШЕНА':'− СДЕЛКА ЗАВЕРШЕНА'}</h2><p>${s.sym||''} · ${s.a?.strategyName||''}</p><button onclick="go('history')">Разобрать сделку →</button></section>`)});}catch(e){}}
function init(){document.documentElement.dataset.marketAi='v95';strategyUI();setInterval(resultScene,2500);const mo=new MutationObserver(()=>{clearTimeout(W.__v95m);W.__v95m=setTimeout(strategyUI,120)});mo.observe(document.body,{childList:true,subtree:true});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
