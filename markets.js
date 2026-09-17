/* ═══════════ PHASE 5 — РЫНКИ И КАРТОЧКА ИНСТРУМЕНТА ═══════════
   Список строится из уже загруженного реестра REG.
   Цена и суточное изменение — только для крипты (их даёт биржа).
   Для валют и OTC этих полей нет, и вместо них честный прочерк. */

let mktSort='vol', mktQuery='';

function marketRows(){
  const list=(REG[S.cat]||[]).slice();
  const q=mktQuery.trim().toUpperCase();
  let rows=q?list.filter(a=>a.id.includes(q)||a.label.toUpperCase().includes(q)):list;
  if(S.cat==='crypto'){
    if(mktSort==='vol')rows.sort((a,b)=>(b.vol||0)-(a.vol||0));
    if(mktSort==='chg')rows.sort((a,b)=>Math.abs(b.chg||0)-Math.abs(a.chg||0));
  }
  if(mktSort==='name')rows.sort((a,b)=>a.label.localeCompare(b.label));
  return rows.slice(0,40);
}

function renderMarkets(){
  const el=document.getElementById('mktList'); if(!el)return;
  const rows=marketRows();
  const head=document.getElementById('mktHead');
  if(head)head.textContent=`${rows.length} инструментов · ${
    S.cat==='crypto'?'биржа':S.cat==='otc'?'OTC по базовой паре':'валютный рынок'}`;

  if(!rows.length){
    el.innerHTML=`<div class="empty"><span>◎</span>${
      mktQuery?'Ничего не найдено':'Список пуст'}</div>`;
    return;
  }
  el.innerHTML=rows.map((a,i)=>{
    const px=a.px>0?fmtP(a.px):null;
    const chg=isFinite(a.chg)?a.chg:null;
    const sig=history.find(h=>h.sym===a.id);
    return `<div class="mktRow" style="animation-delay:${Math.min(i,12)*.03}s"
        onclick="openMarket('${a.id}')">
      ${assetIcon(a)}
      <div class="mktMid">
        <b>${a.label}</b>
        <s>${a.group==='synth'?'индекс · круглосуточно'
            :a.market==='crypto'?(a.vol?`оборот ${(a.vol/1e6).toFixed(1)} млн $`:'криптовалюта')
            :a.market==='otc'?'расчёт по базовой паре':'валютная пара'}</s>
      </div>
      <div class="mktRight">
        ${px?`<b class="mono">${px}</b>`:'<b class="mono na">—</b>'}
        ${chg!=null?`<s style="color:${chg>=0?'var(--up)':'var(--down)'}">${
          chg>=0?'+':''}${chg.toFixed(2)}%</s>`:'<s class="na">нет котировки</s>'}
      </div>
      ${sig?`<span class="mktTag ${sig.a.dir==='CALL'?'up':sig.a.dir==='PUT'?'down':'n'}">${sig.a.dir}</span>`:''}
      <span class="chev">›</span>
    </div>`;
  }).join('');
}

/* ── карточка инструмента ── */
async function openMarket(id){
  const a=(REG[S.cat]||[]).find(x=>x.id===id)||{id,label:label(id),market:marketOf(id)};
  const w=document.getElementById('mktWrap');
  w.innerHTML=`<div class="sheet">
    <div class="shHead">
      ${assetIcon(a)}
      <div style="flex:1"><b>${a.label}</b>
        <div class="sub2">${a.market==='crypto'?'криптовалюта'
          :a.market==='otc'?'OTC · расчёт по базовой паре':'валютная пара'}</div></div>
      <button class="shX" onclick="closeOv('mktWrap')">✕</button></div>
    <div class="shBody">
      <div class="mktLoad"><span class="spin"></span> загружаю свечи…</div>
    </div></div>`;
  openOv('mktWrap');

  let k=null,err='';
  try{ k=await getCandles(id,S.tf,200) }catch(e){ err=e.message; logErr('openMarket',e) }
  const body=w.querySelector('.shBody'); if(!body)return;

  if(!k||!k.length){
    body.innerHTML=`<div style="text-align:center;padding:24px 12px">
      ${mascot('error',64)}
      <div class="h3" style="margin:10px 0 6px">Данные недоступны</div>
      <div class="sub2" style="margin-bottom:14px">${err||'источник не ответил'}</div>
      <button class="btn qt2" style="margin:0" onclick="openMarket('${id}')">Повторить</button></div>`;
    return;
  }

  const last=k[k.length-1], first=k[0];
  const chg=(last.c-first.c)/first.c*100;
  const at=ATR(k), atrPct=at[at.length-1]/last.c*100;
  const w20=k.slice(-20);
  const rng=(Math.max(...w20.map(c=>c.h))-Math.min(...w20.map(c=>c.l)))/last.c*100;
  const mine=history.filter(h=>h.sym===id);
  const done=mine.filter(h=>h.result==='win'||h.result==='loss');
  const wins=done.filter(h=>h.result==='win').length;

  body.innerHTML=`
    <div class="grid2" style="gap:8px;margin-bottom:12px">
      <div class="card tight" style="margin:0"><div class="lbl2">ЦЕНА</div>
        <b class="mono" style="font-size:22px">${fmtP(last.c)}</b>
        <div class="sub2" style="color:${chg>=0?'var(--up)':'var(--down)'}">
          ${chg>=0?'+':''}${chg.toFixed(2)}% за период графика</div></div>
      <div class="card tight" style="margin:0"><div class="lbl2">РАЗМАХ</div>
        <b class="mono" style="font-size:22px">${atrPct.toFixed(2)}%</b>
        <div class="sub2">за 20 свечей ${rng.toFixed(2)}%</div></div>
    </div>

    <div class="chartHead"><b>График ${S.tf}</b>${hlp('chart')}</div>
    <div class="sigChartBox"><canvas id="mktChart"></canvas></div>

    <div class="card" style="margin-top:12px">
      <div class="listHead"><span>📁</span><b>Ваши сигналы по инструменту</b></div>
      ${mine.length?`
        <div class="kv"><span>Всего записей</span><b>${mine.length}</b></div>
        <div class="kv"><span>Закрыто</span><b>${done.length}</b></div>
        ${done.length?`<div class="kv"><span>Сбылось</span>
          <b style="color:var(--up)">${wins} из ${done.length} · ${(wins/done.length*100).toFixed(0)}%</b></div>`:''}
        ${done.length&&done.length<10?`<div class="hint" style="margin-top:8px">
          Сделок мало — по такой выборке судить рано.</div>`:''}
        <button class="btn qt2" onclick="closeOv('mktWrap');go('history')">Открыть журнал</button>`
      :`<div class="hint">По этому инструменту записей ещё нет.</div>`}
    </div>

    <button class="btn" style="margin-top:12px"
      onclick="closeOv('mktWrap');setAsset('${id}');go('home');setTimeout(getSignal,300)">
      Получить сигнал по ${a.label}</button>
    <div class="disc">Показатели посчитаны по загруженным свечам этого инструмента.
      Прогнозом они не являются.</div>`;

  requestAnimationFrame(()=>{
    const cv=document.getElementById('mktChart');
    if(cv){ let lv=null,fg=null;
      try{ lv=levels(k,at[at.length-1]); fg=figure(k) }catch(e){ logErr('openMarket.marks',e) }
      drawChart(cv,k,{lv,fig:fg});
    }
  });
}
