import {approvedRecordings} from './approved-tracks.js';
import {recitations} from './recitations.js';
// Text for the precise points described in Jabir's report (Muslim 1218a).
// The English meanings and reading aids are separate from the Arabic wording.
const cards = {
  stone: {
    title:['In line with the Black Stone','عند محاذاة الحجر الأسود'],
    source:'https://sunnah.com/bukhari:1613', reference:['Bukhari 1613','البخاري ١٦١٣']
  },
  corner: {
    title:['From the Yemeni Corner to the Black Stone','بين الركن اليماني والحجر الأسود'],
    source:'https://sunnah.com/abudawud:1892', reference:['Abu Dawud 1892 · Qur’an 2:201','أبو داود ١٨٩٢ · البقرة ٢٠١']
  },
  opening: {
    title:['As you approach Safa for the first time','عند الاقتراب من الصفا أول مرة'],
    source:'https://quran.com/2/158',reference:['Opening of Qur’an 2:158','أول الآية ١٥٨ من سورة البقرة']
  },
  begin: {
    title:['Then say','ثم قل'],
    source:'https://sunnah.com/muslim:1218a',reference:['Muslim 1218a','مسلم ١٢١٨']
  },
  hill: {
    title:['Remembrance on the hill','الذكر على الصفا والمروة'],
    source:'https://sunnah.com/muslim:1218a',reference:['Muslim 1218a · Jabir’s account','مسلم ١٢١٨ · حديث جابر']
  }
};
const escape = value => String(value).replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function recordingControls(id, record, say){
  return `<div data-recitation="${id}" class="recording-controls"><div class="actions">
  <button data-recitation-action="play">${say('Listen','استمع')}</button>
  <button data-recitation-action="pause" disabled>${say('Pause audio','إيقاف الصوت مؤقتًا')}</button>
  <button data-recitation-action="replay">${say('Replay','إعادة التشغيل')}</button></div>
  <span data-recording-status role="status"></span>
  <small><a href="${escape(record.source)}" target="_blank" rel="noopener">${escape(record.attribution)}</a></small></div>`;
}
export function worshipGuide(stage,count,lang,{compact=false,local=null,translate=null}={}){
  const i=lang==='ar'?1:0;
  const say=(en,ar)=>translate?translate(en,ar):i?ar:en;
  const recording=(lesson,en,ar)=>`<p class="recording"><a href="https://binwahaf.com/ar/audio-book-lesson/${lesson}/" target="_blank" rel="noopener" data-publisher-audio>${say(en,ar)}</a><small>${say('Hisn al-Muslim · publisher’s audio player · internet required','حصن المسلم · مشغّل الناشر · يتطلّب اتصالاً بالإنترنت')}</small></p>`;
  const lesson={
    stone:()=>recording(1285,'Listen to the Black Stone narration','استمع إلى حديث التكبير عند الحجر الأسود'),
    corner:()=>recording(1287,'Listen to the dua between the corners','استمع إلى الدعاء بين الركنين'),
    hill:()=>recording(1289,'Listen to the full Safa and Marwah narration','استمع إلى حديث الذكر على الصفا والمروة')
  };
  const card=id=>{
    const c=cards[id], text=recitations[id], variant=local?.recitations?.[id];
    const heading=c?say(...c.title):'';
    const reading=variant?.pronunciation||(i?text.arabic:text.reading);
    const meaning=variant?.meaning||(i?text.arMeaning:text.meaning);
    const reader=lesson[id]?.()||(id==='talbiyah'?recording(1284,'Listen to the Talbiyah','استمع إلى التلبية'):'');
    const detail=(title,body)=>`<details><summary>${title}</summary>${body}</details>`;
    const approved = approvedRecordings[id];
    const listen = approved ? recordingControls(id, approved, say) : detail(say('Listen','استمع'),
      `<p>${say('In-app human recording awaiting verification.','التسجيل البشري داخل التطبيق بانتظار التحقق.')}</p>${reader}`);
    return `<section class="recitation quick-dua">${heading?`<h3>${heading}</h3>`:''}<small>${say('Arabic','العربية')}</small><p class="dua" lang="ar" dir="rtl">${text.arabic}</p>
    ${approved?listen:''}
    ${detail(say('Pronunciation','النطق'),`<p class="reading" lang="${lang}" dir="auto">${reading}</p><small>${say('A reading aid. Arabic sounds may differ.','تقريب للنطق، وقد تختلف الأصوات عن العربية.')}</small>`)}
    ${detail(say('Meaning','المعنى'),`<p>${meaning}</p>`)}
    ${approved?'':listen}
    ${c?detail(say('Source','المصدر'),`<a href="${c.source}" target="_blank" rel="noopener">${say(...c.reference)}</a>`):''}</section>`;
  };
  if(['miqat','talbiyah','haram'].includes(stage))return card(stage);
  if(stage==='tawaf' && count===7)return `<section class="worship"><h2>${say('After your seventh circuit','بعد إتمام الشوط السابع')}</h2><p>${say('Pray two rakʿahs behind Maqam Ibrahim if it is easy. If it is crowded, pray elsewhere in the mosque. When ready, continue to Safa.','صلِّ ركعتين خلف مقام إبراهيم إن تيسّر، وإلا ففي أي مكان من المسجد. ثم توجّه إلى الصفا.')}</p><a href="https://sunnah.com/muslim:1218a" target="_blank" rel="noopener">${say('Muslim 1218a','مسلم ١٢١٨')}</a></section>`;
  if(stage==='tawaf')return `<section class="worship"><h2>${say('What do I say here?','ماذا أقول هنا؟')}</h2>${card('stone')}${card('corner')}<p>${say('During the rest of the circuit, remember Allah or make your own dua. You may use the same supplications on each circuit.','وفي بقية الشوط اذكر الله وادعُ بما تيسّر. ولك أن تكرّر الدعاء نفسه في الأشواط.')}</p></section>`;
  if(stage!=='sai')return '';
  if(count===7)return `<section class="worship"><h2>${say('You have reached Marwah for the last time','وصلتَ إلى المروة في نهاية السعي')}</h2><p>${say('Your seven trips are complete. Scholars differ about repeating the remembrance on this final arrival. Continue to the hair-cutting step.','تمّت الأشواط السبعة. اختلف أهل العلم في تكرار الذكر عند ختام السعي. انتقل إلى خطوة الحلق أو التقصير.')}</p><a target="_blank" rel="noopener" href="https://islamqa.info/en/answers/617842">${say('Read the scholarly discussion','اقرأ أقوال أهل العلم')}</a><details><summary>${say('View the hilltop remembrance','عرض ذكر الصفا والمروة')}</summary>${card('hill')}</details></section>`;
  const hill=count%2?say('At Marwah','عند المروة'):say('At Safa','عند الصفا');
  return `<section class="worship">${count===0?card('opening')+card('begin'):''}<h2>${hill}</h2><p>${say('Face the Qiblah and say Allāhu akbar (اللَّهُ أَكْبَرُ). Say the remembrance below three times, pausing after the first and second times to ask Allah for what you need.','استقبل القبلة وكبّر الله، وقل الذكر الآتي ثلاث مرات، وادعُ بما شئت بين المرة الأولى والثانية وبين الثانية والثالثة.')}</p>${card('hill')}<h3>${say('As you walk','أثناء المشي')}</h3><p>${say('You can make your own dua as you walk. Record this trip when you reach the opposite hill.','ادعُ بما تيسّر أثناء المشي. سجّل الشوط عند الوصول إلى الطرف الآخر.')}</p></section>`;
}
