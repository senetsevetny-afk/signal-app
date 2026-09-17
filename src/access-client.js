/* ═══════════ ДОСТУП: КЛИЕНТ ═══════════
   Состояние доступа приходит с сервера и проверяется там же по подписи Telegram.
   Клиент ничего не решает: он только показывает то, что ответил сервер.

   Если сервер не настроен, приложение честно говорит об этом и работает
   как раньше — без ограничений и без выдуманного «пробного периода».
   Рисовать таймер, который живёт в браузере, нельзя: он стирается за секунду
   и вводил бы в заблуждение. */
(function(){

  const KEY='acs_api';
  let API=(()=>{ try{ return localStorage.getItem(KEY)||'' }catch{ return '' } })();
  let STATE={tier:'unconfigured'}, lastFetch=0, timer=null;

  const tg=()=>window.Telegram?.WebApp;
  const initData=()=>tg()?.initData||'';
  const startParam=()=>tg()?.initDataUnsafe?.start_param||'';

  function setApi(url){
    API=(url||'').trim().replace(/\/+$/,'');
    try{ API?localStorage.setItem(KEY,API):localStorage.removeItem(KEY) }catch(e){ window.logErr?.('access.setApi',e) }
    return refresh(true);
  }

  async function call(path,body){
    if(!API)throw new Error('адрес сервера не задан');
    const r=await fetch(API+path,{
      method:body?'POST':'GET',
      headers:{'Content-Type':'application/json'},
      body:body?JSON.stringify({initData:initData(),startParam:startParam(),...body})
        :undefined
    });
    if(!r.ok){
      const t=await r.text().catch(()=> '');
      throw new Error(r.status===401?'сервер не подтвердил подпись Telegram'
        :`сервер ответил ${r.status}${t?': '+t.slice(0,120):''}`);
    }
    return r.json();
  }

  async function refresh(force){
    if(!API){ STATE={tier:'unconfigured'}; render(); return STATE }
    if(!force&&Date.now()-lastFetch<20000)return STATE;
    try{
      STATE=await call('/api/state',{});
      lastFetch=Date.now();
    }catch(e){
      STATE={tier:'error',error:e.message};
      window.logErr?.('access.refresh',e);
    }
    render();
    return STATE;
  }

  const fmtLeft=s=>{
    if(s<=0)return 'истёк';
    const h=Math.floor(s/3600), m=Math.floor(s%3600/60);
    if(h>=48)return Math.floor(h/24)+' дн';
    return h?`${h} ч ${m} мин`:`${m} мин`;
  };

  function badge(){
    const t=STATE.tier;
    if(t==='pro')  return {cls:'pro',   text:'PRO', note:'осталось '+fmtLeft(STATE.pro_left)};
    if(t==='trial')return {cls:'trial', text:'Пробный доступ', note:'осталось '+fmtLeft(STATE.trial_left)};
    if(t==='free') return {cls:'free',  text:'Базовый доступ', note:'пробный период закончился'};
    if(t==='error')return {cls:'err',   text:'Сервер недоступен', note:STATE.error||''};
    return {cls:'none', text:'Без ограничений', note:'сервер доступа не настроен'};
  }

  function render(){
    const el=document.getElementById('accBox'); if(!el)return;
    const b=badge();
    const trials=document.querySelector('.trials');
    if(trials){
      const t=trials.querySelector('b'), s=trials.querySelector('span');
      if(t)t.textContent=b.text;
      if(s)s.textContent=b.note;
    }
    el.innerHTML=`<div class="accCard ${b.cls}">
      <div class="accTop">
        <span class="accDot"></span>
        <div style="flex:1"><b>${b.text}</b><s>${b.note}</s></div>
      </div>
      ${STATE.tier==='unconfigured'?`
        <div class="hint">Сервер доступа не подключён. Пробный период и награды
          за приглашения без него считать негде: любое состояние в браузере
          стирается очисткой хранилища. Приложение работает без ограничений.</div>
        <button class="btn qt2" onclick="AccessClient.ask()">Указать адрес сервера</button>`
      :STATE.tier==='error'?`
        <div class="hint">${STATE.error||'нет ответа'}</div>
        <button class="btn qt2" onclick="AccessClient.refresh(true)">Повторить</button>`
      :`
        <div class="accGrid">
          <div><s>Приглашено</s><b>${STATE.invited||0}</b></div>
          <div><s>Засчитано</s><b>${STATE.invited_qualified||0}</b></div>
          <div><s>За приглашение</s><b>${STATE.ref_days} дн</b></div>
        </div>
        <div class="hint">Приглашение засчитывается, когда приглашённый
          действительно пользуется приложением. Проверяет это сервер.</div>
        <button class="btn qt2" onclick="AccessClient.invite()">Пригласить друга</button>`}
    </div>`;
  }

  function ask(){
    const url=prompt('Адрес сервера доступа, например https://ваш-бот.up.railway.app',API||'');
    if(url!==null)setApi(url);
  }

  function invite(){
    const id=tg()?.initDataUnsafe?.user?.id;
    const bot=(window.BOT_USERNAME||'').replace('@','');
    if(!id||!bot)return toast?.('Нужен Telegram','Ссылка формируется внутри мини-приложения.');
    const link=`https://t.me/${bot}?start=ref${id}`;
    const share=`https://t.me/share/url?url=${encodeURIComponent(link)}`;
    tg()?.openTelegramLink?tg().openTelegramLink(share):window.open(share,'_blank');
  }

  /* синхронизация прогресса обучения: сервер хранит, клиент присылает */
  async function pushProgress(){
    if(!API||typeof EDUP==='undefined')return;
    try{ await call('/api/progress',{progress:EDUP}) }
    catch(e){ window.logErr?.('access.pushProgress',e) }
  }
  async function pullProgress(){
    if(!API)return null;
    try{
      const r=await call('/api/progress');
      return r&&r.data?r.data:null;
    }catch(e){ window.logErr?.('access.pullProgress',e); return null }
  }

  function start(){
    render(); refresh();
    clearInterval(timer);
    timer=setInterval(()=>{ if(!document.hidden)refresh() },60000);
  }

  window.AccessClient={start,refresh,setApi,ask,invite,render,
    pushProgress,pullProgress,state:()=>STATE,api:()=>API};
})();
