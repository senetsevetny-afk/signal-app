/* MARKET AI Academy — реестр авторского содержания уроков.

   Зачем он есть.
   Раньше 304 урока собирались одним шаблоном: менялось только название темы,
   а все восемь шагов были дословно одинаковыми. Формально «не пусто», но и
   не обучение. Теперь каждая тема пишется отдельно, а сборщик обязан найти
   авторский текст. Не нашёл — урок НЕ регистрируется и в лог уходит ошибка.
   Заглушек и текста-наполнителя здесь быть не может по устройству.

   Формат записи темы:
     ['Название темы ровно как в списке мира', {
        intro:   'реплика MARKET AI перед разбором',
        explain: 'сам разбор темы',
        visual:  'что смотреть на учебном графике',
        example: 'как тема выглядит, когда признак действительно есть',
        counter: 'когда похожий признак обманывает',
        q:       ['вопрос', [['id','вариант'],...], 'верный id', 'разбор верного', 'разбор неверного'],
        decide:  'формулировка тренировочного решения' (необязательно),
        summary: 'что забрать с собой'
     }]

   Про select_direction: правильный ответ НЕ задаётся здесь. Источник истины —
   сам учебный сценарий (acceptableAnswers). Так feedback не может разойтись
   с тем, что реально нарисовано на графике. */
(function(){
 'use strict';
 const ROOT=window.MarketAIAcademy=window.MarketAIAcademy||{};
 const C=ROOT.Content=ROOT.Content||{};
 C.worlds=C.worlds||{};

 const REQUIRED=['intro','explain','visual','example','counter','q','summary'];

 function validate(worldId,topic,c){
  const miss=REQUIRED.filter(k=>!c||!c[k]);
  if(miss.length)return `тема «${topic}» (${worldId}): нет полей ${miss.join(', ')}`;
  const q=c.q;
  if(!Array.isArray(q)||q.length<5)return `тема «${topic}» (${worldId}): вопрос задан неполно`;
  const [prompt,options,correct,good,bad]=q;
  if(!prompt||!Array.isArray(options)||options.length<2)return `тема «${topic}» (${worldId}): у вопроса меньше двух вариантов`;
  if(!options.some(o=>o[0]===correct))return `тема «${topic}» (${worldId}): верный ответ «${correct}» отсутствует среди вариантов`;
  if(!good||!bad)return `тема «${topic}» (${worldId}): не написан разбор ответа`;
  return null;
 }

 /* Регистрация содержания одного мира. Плохие записи отбрасываются
    поимённо, остальные продолжают работать. */
 C.register=function(worldId,entries){
  const map=C.worlds[worldId]=C.worlds[worldId]||{};
  let ok=0;
  (entries||[]).forEach(([topic,body])=>{
   const err=validate(worldId,topic,body);
   if(err){(window.logErr||console.error)('AcademyContent',err);return}
   map[topic]=body; ok++;
  });
  return ok;
 };

 C.get=function(worldId,topic){return C.worlds[worldId]?.[topic]||null};
 C.has=function(worldId,topic){return !!C.get(worldId,topic)};
 C.count=function(worldId){return Object.keys(C.worlds[worldId]||{}).length};

 /* Сборка шагов урока из авторского текста.
    Форма шагов не меняется — Lesson Engine уже умеет её рисовать. */
 C.buildSteps=function(topic,c,scenarioId){
  const [prompt,options,correct,good,bad]=c.q;
  const steps=[
   {type:'character_message',characterState:'welcome',title:'MARKET AI',text:c.intro},
   {type:'explanation',characterState:'pointing',title:topic,body:c.explain},
   {type:'animation',characterState:'explaining',title:'Визуальный разбор',text:c.visual},
   {type:'example',characterState:'point',title:'Когда признак работает',text:c.example},
   {type:'counter_example',characterState:'warning',title:'Когда признак обманывает',text:c.counter},
   {type:'multiple_choice',characterState:'question',title:'Проверь себя',prompt,
    options:options.map(([id,label])=>({id,label})),correctAnswer:correct,
    feedback:{correct:good,incorrect:bad}}
  ];
  if(scenarioId)steps.push({
   type:'select_direction',characterState:'thinking',title:'Тренировочное решение',
   prompt:c.decide||'Оцени учебный график. Будущие свечи скрыты. Если достаточного основания нет — SKIP.',
   scenarioId,
   options:[{id:'up',label:'CALL / UP'},{id:'down',label:'PUT / DOWN'},{id:'skip',label:'SKIP / NO TRADE'}],
   /* correctAnswer намеренно не задан: решает сценарий. */
   feedback:{correct:'Решение совпало с условиями сценария. Дальше сравни процесс с исходом — это разные вещи.',
             incorrect:'Сверься со структурой, контекстом и timing. Один исход не делает решение плохим, но повод перепроверить процесс есть.'}
  });
  steps.push({type:'summary',characterState:'celebrate',title:'Главное',text:c.summary});
  return steps;
 };
})();
