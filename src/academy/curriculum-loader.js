/* MARKET AI Academy — curriculum registry */
(function(){
 'use strict';
 const ROOT=window.MarketAIAcademy=window.MarketAIAcademy||{};
 const C=ROOT.Curriculum=ROOT.Curriculum||{};
 C.packs=C.packs||{};
 C.register=function(id,pack){if(!id||!pack||!Array.isArray(pack.lessons))throw new Error('Invalid curriculum pack');C.packs[id]=pack;window.dispatchEvent(new CustomEvent('market-ai:curriculum-pack-loaded',{detail:{id}}));return pack};
 C.registerSafe=function(id,pack){try{return C.register(id,pack)}catch(e){console.error('[MARKET AI] curriculum pack rejected',id,e);return null}};
 C.getLessons=function(){return Object.values(C.packs).flatMap(p=>p.lessons||[])};
 C.getLesson=function(id){return C.getLessons().find(l=>l.id===id)||null};
 C.getWorldLessons=function(id){return C.getLessons().filter(l=>l.worldId===id)};
})();
