import {isTranslationReview,progressStorageKey,languages,visibleLanguages,normalizeLocale,localeDirection,translate,localReviewContent} from './locales/languages.js';
import {mediaPanel,wireMedia} from './live-media.js';
import {toolsPanel,wireTools} from './pilgrim-tools.js';
import {completedRecords,archiveCompleted} from './journey-records.js';
import {worshipGuide} from './worship.js';
import {stages,helpTopics} from './content.js';
import {audio,approvedReligiousTracks} from './audio.js';
const root=document.getElementById('app');
const key=progressStorageKey();
const fresh=()=>({step:0,tawaf:0,sai:0,done:false,paused:false});
let state, storageError=false, answered=false,feedback='',offline=false;
const clamp=(v,max)=>Number.isInteger(v)?Math.max(0,Math.min(v,max)):0;
function restore(){
  let saved={};
  try{
    const stored=localStorage.getItem(key);
    if(stored) saved=JSON.parse(stored)||{};
    else if(!isTranslationReview()) {
      const oldStep=localStorage.getItem('umrah_tour_step');
      const map=[0,0,1,1,2,3,4,4,4,4,5,5,5,6,6];
      if(oldStep!==null && /^\d+$/.test(oldStep) && Number(oldStep)<map.length) {
        const count=name=>clamp(Number(localStorage.getItem(name)),7);
        saved.live={step:map[Number(oldStep)],tawaf:count('umrah_tawaf_count'),sai:count('umrah_sai_count'),done:Number(oldStep)===14};
      }
    }
  }catch{storageError=true}
  state={history:completedRecords(saved.history),lang:normalizeLocale(saved.lang),easy:saved.easy===true};
  for(const mode of ['live','practice']){
    const v=saved[mode]||{};
    state[mode]={step:clamp(v.step,6),tawaf:clamp(v.tawaf,7),sai:clamp(v.sai,7),completedAt:Number.isSafeInteger(v.completedAt)?v.completedAt:null,done:v.done===true,paused:v.paused===true};
  }
}
restore();
function save(){try{localStorage.setItem(key,JSON.stringify(state));storageError=false}catch{storageError=true}}
const t=(en,ar)=>translate(state.lang,en,ar);
const localized=(item,section)=>localReviewContent(state.lang,section,item.id)||item[state.lang]||item.en;
const stopTool=()=>{toolCleanup?.();toolCleanup=null};
let toolCleanup=null;
const route=()=>location.hash.slice(1)||'home';
const go=r=>{location.hash=r};
const link=(r,label)=>`<a href="#${r}">${label}</a>`;
const btn=(act,label,cls='',disabled=false)=>`<button data-act="${act}" class="${cls}" ${disabled?'disabled':''}>${label}</button>`;
const refs=s=>s.sources.map(r=>`<li><a href="${r.url}" target="_blank" rel="noopener">${r[state.lang]||r.en}</a></li>`).join('');
const modeName=m=>m==='practice'?t('Prepare & practise','استعدّ وتدرّب'):t('Live Umrah','أثناء العمرة');
function historyList(){
 if (!state.history.length) return '';
 return `<details class="history"><summary>${t('Completed journeys','الرحلات المكتملة')} (${state.history.length})</summary><ul>${state.history.slice().reverse().map(item=>`<li>${modeName(item.mode)} · ${new Date(item.completedAt).toLocaleDateString(state.lang)} · ${item.tawaf}/7 · ${item.sai}/7</li>`).join('')}</ul></details>`;
}
function home(){
  const current=state.live;
  return `<section class="hero"><div><span class="eyebrow">${t('Your Umrah companion','رفيقك في العمرة')}</span><h1>${t('Your Umrah, step by step.','عمرتك، خطوة بخطوة.')}</h1><p>${t('Practise before you travel. At the Haram, follow one step at a time and pick up exactly where you paused.','تدرّب قبل السفر، ثم اتبع الخطوات في الحرم وعُد حيث توقّفت.')}</p>${btn('live',current.done?t('View completed journey','عرض الرحلة المكتملة'):current.step||current.paused?t('Resume my Umrah','استئناف عمرتي'):t('Guide me through Umrah','أرشدني في عمرتي'),'primary')}</div></section>
  <section><h2>${t('Before you set out','قبل الانطلاق')}</h2><div class="tiles">${tile('practice','◉',modeName('practice'),t('Rehearse all seven stages with a short check at each stop.','تدرّب على المراحل السبع مع سؤال قصير في كل مرحلة.'))}${tile('help','☏',t('I need help','أحتاج إلى مساعدة'),t('Lost count, separated from family or looking for accessible routes?','هل شككت في العدد أو افترقت عن أهلك أو تحتاج إلى مسار ميسّر؟'))}${tile('travel','◎',t('Saudi travel eSIM','شريحة سفر إلكترونية'),t('Check your phone and choose a Saudi data plan before departure.','تحقّق من جهازك واختر باقة إنترنت سعودية قبل السفر.'))}${mapTiles()}${tile('makkah','▷',t('Makkah Live','مكة مباشر'),t('Watch the Haram or listen to Qur’an radio.','شاهد الحرم أو استمع إلى إذاعة التلاوات.'))}${tile('tools','◴',t('Prayer times and Qibla','مواقيت الصلاة والقبلة'),t('Check a city timetable or calculate your Qibla bearing.','تحقّق من مواقيت مدينتك أو احسب اتجاه القبلة.'))}</div></section>${historyList()}`;
}
function mapTiles(){
 const labels=[t('Find my family','اعثر على عائلتي'),t('Share your position with relatives you invite.','شارك موقعك مع أقاربك بإذنك.'),t('Find my gate','ابحث عن باب'),t('See your position and mapped gates around the Haram offline.','اعرض موقعك وأبواب الحرم على خريطة محفوظة.')];
 return [['family.html',labels[0],labels[1]],['family.html#gates',labels[2],labels[3]]].map(([path,title,body])=>`<a class="tile" href="./${path}"><span class="symbol" aria-hidden="true">⌖</span><h3>${title}</h3><p>${body}</p></a>`).join('');
}
function tile(r,icon,title,body){return `<a class="tile" href="#${r}"><span class="symbol" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${body}</p></a>`}
const back=()=>`<a class="back" href="#home">${t('Home','الرئيسية')}</a>`;
function journey(m){
  const p=state[m],s=stages[p.step],d=localized(s,'stages'),practice=m==='practice';
  if(p.done)return `<article class="panel">${back()}<h1>${practice?t('Practice complete','اكتمل التدريب'):t('Journey complete','اكتملت الخطوات')}</h1><p>${practice?t('When you are ready, start your live guide. Your live counters are separate.','عندما تكون جاهزًا ابدأ الدليل المباشر. عدادات التدريب مستقلة.'):t('You have marked all seven stages complete on this device.','أتممت تسجيل المراحل السبع على هذا الجهاز.')}</p>${practice?btn('live',modeName('live'),'primary'):''} ${btn('review',t('Review final stage','مراجعة المرحلة الأخيرة'))} <details><summary>${t('Start again','البدء من جديد')}</summary>${btn('reset',t('Start a new journey','بدء رحلة جديدة'))}</details></article>`;
  if(p.paused)return `<article class="panel">${back()}<h1>${t('Journey paused','توقّفت الرحلة مؤقتًا')}</h1><p>${modeName(m)} · ${d.title}</p>${btn('resume',t('Resume','استئناف'),'primary')} ${link('help',t('I need help','أحتاج إلى مساعدة'))}</article>`;
  let counted=['sai','tawaf'].includes(s.id),count=p[s.id],allowed=(!counted||count===7)&&(!practice||answered);
  const counter=counted?`<section class="counter ${practice?'':'live-counter'}"><span>${s.id==='sai'?t('Completed one-way trips','الأشواط المكتملة باتجاه واحد'):t('Completed circuits','الأشواط المكتملة')}</span><strong aria-live="polite">${count} / 7</strong><p>${s.id==='sai'?(count===7?t('Finish at Marwah','النهاية عند المروة'):count%2?t('Next · Marwah to Safa','التالي · من المروة إلى الصفا'):t('Next · Safa to Marwah','التالي · من الصفا إلى المروة')):''}</p>${btn('count',s.id==='sai'?(count===7?t('Seven trips complete','اكتملت الأشواط السبعة'):count%2?t('I’ve reached Safa','وصلت إلى الصفا'):t('I’ve reached Marwah','وصلت إلى المروة')):t('I’ve completed one circuit','أتممت شوطًا'),'primary',count===7)} ${btn('undo',t('Subtract one','إنقاص شوط'),'',count===0)}${!practice?btn('pause',t('Pause','إيقاف مؤقت')):''}${!practice&&count===7?btn('next',t('Continue','متابعة'),'primary'):''}</section>`:'';
  const answers=practice?[(p.step+1)%2,p.step%2].map(i=>btn('answer-'+i,d.answers[i])).join(' '):'';
  return `<article class="panel">${back()}<div class="progress" aria-hidden="true">${stages.map((_,i)=>`<i class="${i<=p.step?'on':''}"></i>`).join('')}</div><span class="eyebrow">${modeName(m)} · ${p.step+1} / 7</span><h1>${d.title}</h1>${!practice&&counted?counter:''}${practice?`<p class="note">${t('Practice only. This rehearsal does not perform any rite.','هذا تدريب تعليمي فقط ولا يُعدّ أداءً للنسك.')}</p>`:''}${!practice&&counted?`<details class="step-instructions"><summary>${t('Full instructions','التعليمات الكاملة')}</summary><p>${d.body}</p></details>`:`<p>${d.body}</p>`}${practice&&s.id==='sai'?`<figure class="tripchart"><figcaption>${t('Where each trip ends','نهاية كل شوط')}</figcaption><ol>${Array.from({length:7},(_,i)=>`<li><b>${i+1}</b> ${i%2?t('Safa','الصفا'):t('Marwah','المروة')}</li>`).join('')}</ol></figure>`:''}
  ${worshipGuide(s.id,count,state.lang,{compact:!practice,translate:t,local:{recitations:Object.fromEntries(['miqat','talbiyah','haram','stone','corner','opening','begin','hill'].map(id=>[id,localReviewContent(state.lang,'recitations',id)]))}})}
  ${practice&&counted?counter:''}
  ${practice?`<section><h3>${d.question}</h3><div class="actions">${answers}</div><p role="status">${feedback}</p></section>`:''}
  <div class="actions">${(!practice&&counted)?'':btn('next',p.step===6?t('Finish','إنهاء'):t('Continue','متابعة'),'primary',!allowed)} ${!practice&&counted?'':btn('pause',t('Pause','إيقاف مؤقت'))} ${p.step?btn('previous',t('Previous step','الخطوة السابقة')):''}</div>
  ${link('help',t('I need help','أحتاج إلى مساعدة'))}
  <details><summary>${t('Sources and references','المصادر والمراجع')}</summary><ul>${refs(s)}</ul></details></article>`;
}
function help(){
  return `<article class="panel">${back()}<span class="eyebrow">${t('Pilgrim support','مساعدة المعتمر')}</span><h1>${t('What do you need help with?','كيف يمكننا مساعدتك؟')}</h1><label for="query">${t('Search guidance','البحث في الدليل')}</label><input id="query" type="search" placeholder="${t('Try “perfume” or “family”','جرّب «الطيب» أو «أهلي»')}"><div id="results"></div><div class="actions">${link('live',modeName('live'))}${link('practice',modeName('practice'))}</div></article>`;
}
function results(q){
 const items=[...helpTopics,...stages].filter(s=>(localized(s,s.sources?'stages':'help').title+' '+localized(s,s.sources?'stages':'help').body).toLocaleLowerCase().includes(q.trim().toLocaleLowerCase()));
 document.getElementById('results').innerHTML=items.map(s=>`<details><summary>${localized(s,s.sources?'stages':'help').title}</summary><p>${localized(s,s.sources?'stages':'help').body}</p><ul>${s.sources?refs(s):`<li><a href="${s.source}" target="_blank" rel="noopener">${t('Open source','فتح المصدر')}</a></li>`}</ul></details>`).join('')||`<p>${t('No matching guidance. Ask mosque staff for a religious guidance desk.','لا توجد نتيجة. اطلب من العاملين إرشادك إلى موضع الإفتاء.')}</p>`;
}
function travel(){return `<article class="panel">${back()}<span class="eyebrow">${t('Before you travel','قبل السفر')}</span><h1>${t('Saudi Arabia eSIM','شريحة إلكترونية للسعودية')}</h1><p>${t('Yesim sells data-only plans. Check your exact phone model and confirm it is carrier-unlocked before paying.','تبيع Yesim باقات إنترنت فقط. تحقّق من طراز هاتفك وأنه غير مقفل على شركة اتصالات قبل الدفع.')}</p><ol><li><a href="https://help.yesim.app/which-mobile-phones-support-esim/" target="_blank" rel="noopener">${t('Check supported devices','التحقّق من الأجهزة المتوافقة')}</a></li><li>${t('Choose Saudi Arabia, data allowance and duration. Check the final price and activation instructions with Yesim.','اختر السعودية وحجم البيانات والمدة وراجع السعر وتعليمات التفعيل لدى Yesim.')}</li></ol><a class="wide" href="https://yesim.app/country/saudi-arabia/" target="_blank" rel="noopener">${t('View Saudi plans on Yesim','عرض باقات السعودية لدى Yesim')}</a><p class="note">${t('External retailer. This preview uses a direct link without an affiliate marker.','متجر خارجي. يستخدم هذا الإصدار رابطًا مباشرًا دون معرّف عمولة.')}</p><h2>${t('Flights and hotels','الطيران والفنادق')}</h2><p>${t('Choose dates and check availability with the provider. Internet required.','اختر التواريخ وتحقّق من التوفر لدى المزود. يلزم الاتصال بالإنترنت.')}</p><ul><li><a href="https://uk.trip.com/hotels/makkah-hotels-list-3744/" rel="noopener noreferrer" target="_blank">${t('Search Makkah hotels','ابحث عن فنادق مكة')}</a></li><li><a href="https://www.google.com/travel/flights/flights-from-london-to-jeddah.html" rel="noopener noreferrer" target="_blank">${t('Search London to Jeddah flights · change origin as needed','ابحث عن رحلات لندن إلى جدة · يمكنك تغيير مدينة المغادرة')}</a></li></ul></article>`}
function render(focus=false){
 stopTool();
 const r=route(),lang=state.lang;
 document.documentElement.lang=lang;document.documentElement.dir=document.body.dir=localeDirection(lang);document.body.classList.toggle('easy',state.easy);
 root.innerHTML=`<header><div><a class="brand" href="#home"><i class="mark" aria-hidden="true"></i>${t('Sunnah Umrah','عمرة السُّنّة')}</a><nav>${link('practice',modeName('practice'))}${link('live',modeName('live'))}${link('help',t('Help','المساعدة'))}</nav><div class="tools">${btn('easy',t('Easy mode','الوضع الميسّر'))}<select id="guide-language" aria-label="${t('Language','اللغة')}">${visibleLanguages().map(code=>`<option value="${code}" ${lang===code?'selected':''}>${languages[code].name}</option>`).join('')}</select></div></div></header><main class="wrap">${isTranslationReview()?`<aside class="note">${t('Translation review · Draft wording awaiting human verification.','مراجعة الترجمة · صياغة تجريبية بانتظار المراجعة البشرية.')}</aside>`:''}${r==='live'||r==='practice'?journey(r):r==='help'?help():r==='travel'?travel():r==='tools'?toolsPanel(t):r==='makkah'?mediaPanel(t):home()}<p class="status" role="alert">${storageError?t('Storage unavailable. Keep this page open.','تعذّر الحفظ. أبقِ هذه الصفحة مفتوحة.') :''}</p></main><footer>${t('Independent pilgrim companion · Preview for content and usability review','رفيق مستقل للمعتمر · نسخة تجريبية لمراجعة المحتوى وسهولة الاستخدام')}<p id="offline" role="status"></p>${state.easy&&['ar','en'].includes(lang)?`<div class="actions">${btn('listen',t('Listen to controls','استمع إلى شرح الأزرار'))} ${btn('audio-pause',t('Pause audio','إيقاف الصوت مؤقتًا'))} ${btn('replay',t('Replay','إعادة التشغيل'))}<span id="audio-status" role="status"></span></div>`:''}</footer>`;
 root.querySelector('[data-act=easy]').setAttribute('aria-pressed',String(state.easy));
 if(Object.hasOwn(approvedReligiousTracks,audio.state.id) && !root.querySelector(`[data-recitation="${audio.state.id}"]`))audio.stop();
 if(r==='makkah')toolCleanup=wireMedia(root,t,()=>audio.stop());
 if(r==='tools')toolCleanup=wireTools(root,t);
 if(r==='help')results('');offlineLabel();audioLabel(lastAudio);
 if(focus){const h=root.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});scrollTo(0,0)}
}
function offlineLabel(){document.getElementById('offline').textContent=offline?t('Guide ready offline on this device.','الدليل متاح دون اتصال على هذا الجهاز.'):t('Offline copy has not been confirmed on this device.','لم يتأكد حفظ النسخة دون اتصال على هذا الجهاز.')}
let lastAudio={status:'idle'};
function audioLabel(s){const label=({loading:t('Loading','جارٍ التحميل'),playing:t('Playing','قيد التشغيل'),paused:t('Paused','متوقف مؤقتًا'),blocked:t('Playback blocked. Tap Listen to try again.','تعذّر بدء الصوت. اضغط على الاستماع للمحاولة مجددًا.'),error:t('Audio unavailable','تعذّر تشغيل الصوت'),ended:t('Finished','اكتمل')})[s.status]||'';
 const navigation=document.getElementById('audio-status');
 if(navigation)navigation.textContent=s.id?.startsWith('navigation-')?label:'';
 for(const card of root.querySelectorAll('[data-recitation]')){
   const selected=card.dataset.recitation===s.id;
   card.querySelector('[data-recording-status]').textContent=selected?label:'';
   const active=selected&&['playing','loading'].includes(s.status);
   card.querySelector('[data-recitation-action="play"]').disabled=active;
   card.querySelector('[data-recitation-action="pause"]').disabled=!active;
 }
}
audio.subscribe(s=>{lastAudio=s;audioLabel(s)});
function clearCheck(){answered=false;feedback=''}
window.addEventListener('hashchange',()=>{audio.stop();clearCheck();render(true)});
window.addEventListener('storage',e=>{if(e.key===key){restore();clearCheck();render()}});
root.addEventListener('change',e=>{
 if(e.target.id!=='guide-language')return;
 audio.stop();state.lang=normalizeLocale(e.target.value);clearCheck();save();render();root.querySelector('#guide-language').focus();
});
root.addEventListener('input',e=>{if(e.target.id==='query')results(e.target.value)});
root.addEventListener('click',e=>{
 const control=e.target.closest('[data-recitation-action]');
 if(control){
   const id=control.closest('[data-recitation]')?.dataset.recitation;
   if(!Object.hasOwn(approvedReligiousTracks,id))return;
   const action=control.dataset.recitationAction;
   if(action==='play')audio.play(id);
   if(action==='pause'&&audio.state.id===id)audio.pause();
   if(action==='replay')audio.replay(id);
   return;
 }
 if(e.target.closest('[data-publisher-audio]'))audio.stop();
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,r=route(),p=state[r],oldFocus=a;
 if(a==='live'){go('live');return}
 if(a==='listen'){if(r==='makkah')render();audio.play('navigation-'+state.lang);return}if(a==='audio-pause'){audio.pause();return}if(a==='replay'){if(r==='makkah')render();audio.replay('navigation-'+state.lang);return}
 if(a==='easy'){audio.stop();state.easy=!state.easy}
 else if(r==='live'||r==='practice'){
   const id=stages[p.step].id;
   if(a==='pause'||a==='resume')p.paused=a==='pause';
   else if(a==='count'||a==='undo')p[id]=Math.min(7,Math.max(0,p[id]+(a==='count'?1:-1)));
   else if(a.startsWith('answer-')){answered=a==='answer-0';feedback=answered?t('Correct. You can continue once the step is complete.','إجابة صحيحة. تابع عند إتمام الخطوة.'):t('Try again. Read the guidance above.','حاول مجددًا وراجع الشرح أعلاه.')}
   else if(a==='next'){if((r==='practice'&&!answered)||(['tawaf','sai'].includes(id)&&p[id]!==7))return;if(p.step===6){p.done=true;archiveCompleted(state,r)}else p.step++;clearCheck()}
   else if(a==='previous'){p.step=Math.max(0,p.step-1);clearCheck()}
   else if(a==='review')p.done=false;
   else if(a==='reset'){archiveCompleted(state,r);state[r]=fresh();clearCheck()}
 }
 save();const transition=['next','previous','resume','pause','review','reset'].includes(a);if(transition)audio.stop();render(transition);
 if(!transition)root.querySelector(`[data-act="${oldFocus}"]:not(:disabled)`)?.focus({preventScroll:true});
});
render();
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./offline.js',{type:'module'}).then(()=>navigator.serviceWorker.ready).then(reg=>{if(reg.active?.scriptURL===new URL('./offline.js',import.meta.url).href){offline=true;offlineLabel()}}).catch(()=>{offline=false;offlineLabel()});
}
