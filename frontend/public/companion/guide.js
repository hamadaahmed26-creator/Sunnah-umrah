import {stages,helpTopics} from './content.js';
import {audio} from './audio.js';
const root=document.getElementById('app');
const key='sunnah-umrah.companion.v1';
const fresh=()=>({step:0,tawaf:0,sai:0,done:false,paused:false});
let state, storageError=false, answered=false,feedback='',offline=false;
const clamp=(v,max)=>Number.isInteger(v)?Math.max(0,Math.min(v,max)):0;
function restore(){
  let saved={};
  try{
    const stored=localStorage.getItem(key);
    if(stored) saved=JSON.parse(stored)||{};
    else {
      const oldStep=localStorage.getItem('umrah_tour_step');
      const map=[0,0,1,1,2,3,4,4,4,4,5,5,5,6,6];
      if(oldStep!==null && /^\d+$/.test(oldStep) && Number(oldStep)<map.length) {
        const count=name=>clamp(Number(localStorage.getItem(name)),7);
        saved.live={step:map[Number(oldStep)],tawaf:count('umrah_tawaf_count'),sai:count('umrah_sai_count'),done:Number(oldStep)===14};
      }
    }
  }catch{storageError=true}
  state={lang:saved.lang==='ar'?'ar':'en',easy:saved.easy===true};
  for(const mode of ['live','practice']){
    const v=saved[mode]||{};
    state[mode]={step:clamp(v.step,6),tawaf:clamp(v.tawaf,7),sai:clamp(v.sai,7),done:v.done===true,paused:v.paused===true};
  }
}
restore();
function save(){try{localStorage.setItem(key,JSON.stringify(state));storageError=false}catch{storageError=true}}
const t=(en,ar)=>state.lang==='ar'?ar:en;
const route=()=>location.hash.slice(1)||'home';
const go=r=>{location.hash=r};
const link=(r,label)=>`<a href="#${r}">${label}</a>`;
const btn=(act,label,cls='',disabled=false)=>`<button data-act="${act}" class="${cls}" ${disabled?'disabled':''}>${label}</button>`;
const refs=s=>s.sources.map(r=>`<li><a href="${r.url}" target="_blank" rel="noopener">${r[state.lang]}</a></li>`).join('');
const modeName=m=>m==='practice'?t('Prepare & practise','استعدّ وتدرّب'):t('Live Umrah','أثناء العمرة');
function home(){
  const current=state.live;
  return `<section class="hero"><div><span class="eyebrow">${t('Your Umrah companion','رفيقك في العمرة')}</span><h1>${t('Your Umrah, step by step.','عمرتك، خطوة بخطوة.')}</h1><p>${t('Practise before you travel. At the Haram, follow one step at a time and pick up exactly where you paused.','تدرّب قبل السفر، ثم اتبع الخطوات في الحرم وعُد حيث توقّفت.')}</p>${btn('live',current.done?t('View completed journey','عرض الرحلة المكتملة'):current.step||current.paused?t('Resume my Umrah','استئناف عمرتي'):t('Guide me through Umrah','أرشدني في عمرتي'),'primary')}</div></section>
  <section><h2>${t('Before you set out','قبل الانطلاق')}</h2><div class="tiles">${tile('practice','◉',modeName('practice'),t('Rehearse all seven stages with a short check at each stop.','تدرّب على المراحل السبع مع سؤال قصير في كل مرحلة.'))}${tile('help','☏',t('I need help','أحتاج إلى مساعدة'),t('Lost count, separated from family or looking for accessible routes?','هل شككت في العدد أو افترقت عن أهلك أو تحتاج إلى مسار ميسّر؟'))}${tile('travel','◎',t('Saudi travel eSIM','شريحة سفر إلكترونية'),t('Check your phone and choose a Saudi data plan before departure.','تحقّق من جهازك واختر باقة إنترنت سعودية قبل السفر.'))}</div></section>`;
}
function tile(r,icon,title,body){return `<a class="tile" href="#${r}"><span class="symbol" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${body}</p></a>`}
const back=()=>`<a class="back" href="#home">${t('Home','الرئيسية')}</a>`;
function journey(m){
  const p=state[m],s=stages[p.step],d=s[state.lang],practice=m==='practice';
  if(p.done)return `<article class="panel">${back()}<h1>${practice?t('Practice complete','اكتمل التدريب'):t('Journey complete','اكتملت الخطوات')}</h1><p>${practice?t('When you are ready, start your live guide. Your live counters are separate.','عندما تكون جاهزًا ابدأ الدليل المباشر. عدادات التدريب مستقلة.'):t('You have marked all seven stages complete on this device.','أتممت تسجيل المراحل السبع على هذا الجهاز.')}</p>${practice?btn('live',modeName('live'),'primary'):''} ${btn('review',t('Review final stage','مراجعة المرحلة الأخيرة'))} <details><summary>${t('Start again','البدء من جديد')}</summary>${btn('reset',t('Reset this journey','تصفير هذه الرحلة'))}</details></article>`;
  if(p.paused)return `<article class="panel">${back()}<h1>${t('Journey paused','توقّفت الرحلة مؤقتًا')}</h1><p>${modeName(m)} · ${d.title}</p>${btn('resume',t('Resume','استئناف'),'primary')} ${link('help',t('I need help','أحتاج إلى مساعدة'))}</article>`;
  let counted=['sai','tawaf'].includes(s.id),count=p[s.id],allowed=(!counted||count===7)&&(!practice||answered);
  const answers=practice?[(p.step+1)%2,p.step%2].map(i=>btn('answer-'+i,d.answers[i])).join(' '):'';
  return `<article class="panel">${back()}<div class="progress" aria-hidden="true">${stages.map((_,i)=>`<i class="${i<=p.step?'on':''}"></i>`).join('')}</div><span class="eyebrow">${modeName(m)} · ${p.step+1} / 7</span><h1>${d.title}</h1>${practice?`<p class="note">${t('Practice only. This rehearsal does not perform any rite.','هذا تدريب تعليمي فقط ولا يُعدّ أداءً للنسك.')}</p>`:''}<p>${d.body}</p>${practice&&s.id==='sai'?`<figure class="tripchart"><figcaption>${t('Where each trip ends','نهاية كل شوط')}</figcaption><ol>${Array.from({length:7},(_,i)=>`<li><b>${i+1}</b> ${i%2?t('Safa','الصفا'):t('Marwah','المروة')}</li>`).join('')}</ol></figure>`:''}${s.dua?`<p class="dua" lang="ar" dir="rtl">${s.dua}</p>`:''}
  ${counted?`<section class="counter"><span>${s.id==='sai'?t('Completed one-way trips','الأشواط المكتملة باتجاه واحد'):t('Completed circuits','الأشواط المكتملة')}</span><strong aria-live="polite">${count} / 7</strong><p>${s.id==='sai'?(count===7?t('Finish at Marwah','النهاية عند المروة'):count%2?t('Next · Marwah to Safa','التالي · من المروة إلى الصفا'):t('Next · Safa to Marwah','التالي · من الصفا إلى المروة')):''}</p>${btn('count',t('Record one','تسجيل شوط'),'primary',count===7)} ${btn('undo',t('Subtract one','إنقاص شوط'),'',count===0)}</section>`:''}
  ${practice?`<section><h3>${d.question}</h3><div class="actions">${answers}</div><p role="status">${feedback}</p></section>`:''}
  <div class="actions">${btn('next',p.step===6?t('Finish','إنهاء'):t('Continue','متابعة'),'primary',!allowed)} ${btn('pause',t('Pause','إيقاف مؤقت'))} ${p.step?btn('previous',t('Previous step','الخطوة السابقة')):''}</div>
  ${link('help',t('I need help','أحتاج إلى مساعدة'))}
  <details><summary>${t('Sources and references','المصادر والمراجع')}</summary><ul>${refs(s)}</ul></details></article>`;
}
function help(){
  return `<article class="panel">${back()}<span class="eyebrow">${t('Pilgrim support','مساعدة المعتمر')}</span><h1>${t('What do you need help with?','كيف يمكننا مساعدتك؟')}</h1><label for="query">${t('Search guidance','البحث في الدليل')}</label><input id="query" type="search" placeholder="${t('Try “perfume” or “family”','جرّب «الطيب» أو «أهلي»')}"><div id="results"></div><div class="actions">${link('live',modeName('live'))}${link('practice',modeName('practice'))}</div></article>`;
}
function results(q){
 const items=[...helpTopics,...stages].filter(s=>(s[state.lang].title+' '+s[state.lang].body).toLocaleLowerCase().includes(q.trim().toLocaleLowerCase()));
 document.getElementById('results').innerHTML=items.map(s=>`<details><summary>${s[state.lang].title}</summary><p>${s[state.lang].body}</p><ul>${s.sources?refs(s):`<li><a href="${s.source}" target="_blank" rel="noopener">${t('Open source','فتح المصدر')}</a></li>`}</ul></details>`).join('')||`<p>${t('No matching guidance. Ask mosque staff for a religious guidance desk.','لا توجد نتيجة. اطلب من العاملين إرشادك إلى موضع الإفتاء.')}</p>`;
}
function travel(){return `<article class="panel">${back()}<span class="eyebrow">${t('Before you travel','قبل السفر')}</span><h1>${t('Saudi Arabia eSIM','شريحة إلكترونية للسعودية')}</h1><p>${t('Yesim sells data-only plans. Check your exact phone model and confirm it is carrier-unlocked before paying.','تبيع Yesim باقات إنترنت فقط. تحقّق من طراز هاتفك وأنه غير مقفل على شركة اتصالات قبل الدفع.')}</p><ol><li><a href="https://help.yesim.app/which-mobile-phones-support-esim/" target="_blank" rel="noopener">${t('Check supported devices','التحقّق من الأجهزة المتوافقة')}</a></li><li>${t('Choose Saudi Arabia, data allowance and duration. Check the final price and activation instructions with Yesim.','اختر السعودية وحجم البيانات والمدة وراجع السعر وتعليمات التفعيل لدى Yesim.')}</li></ol><a class="wide" href="https://yesim.app/country/saudi-arabia/" target="_blank" rel="noopener">${t('View Saudi plans on Yesim','عرض باقات السعودية لدى Yesim')}</a><p class="note">${t('External retailer. This preview uses a direct link without an affiliate marker.','متجر خارجي. يستخدم هذا الإصدار رابطًا مباشرًا دون معرّف عمولة.')}</p></article>`}
function render(focus=false){
 const r=route(),lang=state.lang;
 document.documentElement.lang=lang;document.documentElement.dir=document.body.dir=lang==='ar'?'rtl':'ltr';document.body.classList.toggle('easy',state.easy);
 root.innerHTML=`<header><div><a class="brand" href="#home"><i class="mark" aria-hidden="true"></i>${t('Sunnah Umrah','عمرة السُّنّة')}</a><nav>${link('practice',modeName('practice'))}${link('live',modeName('live'))}${link('help',t('Help','المساعدة'))}</nav><div class="tools">${btn('easy',t('Easy mode','الوضع الميسّر'))}${btn('lang',t('العربية','English'))}</div></div></header><main class="wrap">${r==='live'||r==='practice'?journey(r):r==='help'?help():r==='travel'?travel():home()}<p class="status" role="alert">${storageError?t('Storage unavailable. Keep this page open.','تعذّر الحفظ. أبقِ هذه الصفحة مفتوحة.') :''}</p></main><footer>${t('Independent pilgrim companion · Preview for content and usability review','رفيق مستقل للمعتمر · نسخة تجريبية لمراجعة المحتوى وسهولة الاستخدام')}<p id="offline" role="status"></p>${state.easy?`<div class="actions">${btn('listen',t('Listen to controls','استمع إلى شرح الأزرار'))} ${btn('audio-pause',t('Pause audio','إيقاف الصوت مؤقتًا'))} ${btn('replay',t('Replay','إعادة التشغيل'))}<span id="audio-status" role="status"></span></div>`:''}</footer>`;
 root.querySelector('[data-act=easy]').setAttribute('aria-pressed',String(state.easy));
 if(r==='help')results('');offlineLabel();audioLabel(lastAudio);
 if(focus){const h=root.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});scrollTo(0,0)}
}
function offlineLabel(){document.getElementById('offline').textContent=offline?t('Guide ready offline on this device.','الدليل متاح دون اتصال على هذا الجهاز.'):t('Offline copy has not been confirmed on this device.','لم يتأكد حفظ النسخة دون اتصال على هذا الجهاز.')}
let lastAudio={status:'idle'};
function audioLabel(s){const el=document.getElementById('audio-status');if(el)el.textContent=({loading:t('Loading','جارٍ التحميل'),playing:t('Playing','قيد التشغيل'),paused:t('Paused','متوقف مؤقتًا'),blocked:t('Playback blocked. Tap Listen to try again.','تعذّر بدء الصوت. اضغط على الاستماع للمحاولة مجددًا.'),error:t('Audio unavailable','تعذّر تشغيل الصوت'),ended:t('Finished','اكتمل')})[s.status]||''}
audio.subscribe(s=>{lastAudio=s;audioLabel(s)});
function clearCheck(){answered=false;feedback=''}
window.addEventListener('hashchange',()=>{audio.stop();clearCheck();render(true)});
window.addEventListener('storage',e=>{if(e.key===key){restore();clearCheck();render()}});
root.addEventListener('input',e=>{if(e.target.id==='query')results(e.target.value)});
root.addEventListener('click',e=>{
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,r=route(),p=state[r],oldFocus=a;
 if(a==='live'){go('live');return}
 if(a==='listen'){audio.play('navigation-'+state.lang);return}if(a==='audio-pause'){audio.pause();return}if(a==='replay'){audio.replay('navigation-'+state.lang);return}
 if(a==='lang'){audio.stop();state.lang=t('ar','en');clearCheck()}
 else if(a==='easy'){audio.stop();state.easy=!state.easy}
 else if(r==='live'||r==='practice'){
   const id=stages[p.step].id;
   if(a==='pause'||a==='resume')p.paused=a==='pause';
   else if(a==='count'||a==='undo')p[id]=Math.min(7,Math.max(0,p[id]+(a==='count'?1:-1)));
   else if(a.startsWith('answer-')){answered=a==='answer-0';feedback=answered?t('Correct. You can continue once the step is complete.','إجابة صحيحة. تابع عند إتمام الخطوة.'):t('Try again. Read the guidance above.','حاول مجددًا وراجع الشرح أعلاه.')}
   else if(a==='next'){if((r==='practice'&&!answered)||(['tawaf','sai'].includes(id)&&p[id]!==7))return;if(p.step===6)p.done=true;else p.step++;clearCheck()}
   else if(a==='previous'){p.step=Math.max(0,p.step-1);clearCheck()}
   else if(a==='review')p.done=false;
   else if(a==='reset'){state[r]=fresh();clearCheck()}
 }
 save();const transition=['next','previous','resume','pause','review','reset'].includes(a);render(transition);
 if(!transition)root.querySelector(`[data-act="${oldFocus}"]:not(:disabled)`)?.focus({preventScroll:true});
});
render();
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./offline.js').then(()=>navigator.serviceWorker.ready).then(reg=>{if(reg.active?.scriptURL===new URL('./offline.js',import.meta.url).href){offline=true;offlineLabel()}}).catch(()=>{offline=false;offlineLabel()});
}
