/* MARKET AI Academy settings — accessibility + global language. */
(function(){
 const KEY='market_ai_academy_settings_v1';
 const T=s=>window.MarketAII18n?.t?.(s)||s;
 function get(){try{return {motion:'system',text:'normal',...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(_){return {motion:'system',text:'normal'}}}
 function apply(){const s=get();document.documentElement.dataset.acMotion=s.motion;document.documentElement.dataset.acText=s.text}
 function set(k,v){const s=get();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s));apply()}
 function langButtons(){
   const langs=(typeof LANGS!=='undefined'?LANGS:[['ru','Русский','🇷🇺'],['uk','Українська','🇺🇦'],['en','English','🇬🇧'],['cs','Čeština','🇨🇿']]);
   const cur=window.MarketAII18n?.lang?.()||'ru';
   return langs.map(l=>`<button class="acGhost ${l[0]===cur?'on':''}" onclick="MarketAIAcademySettings.language('${l[0]}')">${l[2]} ${l[1]}</button>`).join('');
 }
 function language(code){window.MarketAII18n?.set?.(code);setTimeout(()=>open(),40)}
 function open(){const s=get();academyShellRender(`<button class="acBack" onclick="openAcademy()">‹ ${T('Вселенная обучения')}</button><div class="acHero"><div class="acEyebrow">ACCESSIBILITY</div><h2>${T('Настройки Академии')}</h2><p>${T('Настройки хранятся локально на устройстве.')}</p></div><div class="acSettings"><b>${T('Язык обучения')}</b><div class="acLangGrid">${langButtons()}</div><small>${T('Язык Академии синхронизирован с языком всего MARKET AI.')}</small><b>${T('Анимации')}</b><div><button class="acGhost" onclick="MarketAIAcademySettings.set('motion','system')">System</button><button class="acGhost" onclick="MarketAIAcademySettings.set('motion','reduced')">Reduced</button></div><b>${T('Размер текста')}</b><div><button class="acGhost" onclick="MarketAIAcademySettings.set('text','normal')">Normal</button><button class="acGhost" onclick="MarketAIAcademySettings.set('text','large')">Large</button></div><small>${T('Сейчас')}: ${s.motion} · ${s.text}</small><button class="acGhost" onclick="openAcademyDiagnostics()">System Check</button></div>`,'ACADEMY SETTINGS','ACCESSIBILITY · LANGUAGE · MOTION')}
 window.MarketAIAcademySettings={get,set,apply,open,language};window.openAcademySettings=open;document.readyState==='loading'?document.addEventListener('DOMContentLoaded',apply):apply();
})();
