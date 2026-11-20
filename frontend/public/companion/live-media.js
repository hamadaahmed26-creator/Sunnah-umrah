// The broadcaster controls availability and may rotate the live video ID.
const channel = 'https://www.youtube.com/@SaudiQuranTv/live';
const radio = 'https://www.aloula.sa/live/quranradio';
const origin = 'https://www.youtube-nocookie.com';

export function mediaPanel(t) {
  return `<article class="panel"><a href="#home">${t('Home','الرئيسية')}</a>
  <h1>${t('Makkah Live','مكة مباشر')}</h1>
  <p>${t('Watch Masjid al-Haram on Saudi Quran TV. Video uses mobile data.','شاهد المسجد الحرام على قناة القرآن الكريم السعودية. يستهلك الفيديو بيانات الإنترنت.')}</p>
  <button class="primary" id="watch">${t('Load video player','تحميل مشغّل الفيديو')}</button>
  <div id="screen"></div><p id="stream-status" role="status"></p>
  <a href="${channel}" target="_blank" rel="noopener">${t('Watch on the official channel','شاهد على القناة الرسمية')}</a>
  <h2>${t('Listen to live Qur’an radio','استمع إلى إذاعة القرآن الكريم')}</h2>
  <a href="${radio}" target="_blank" rel="noopener">${t('Open Saudi Quran Radio from Riyadh','افتح إذاعة القرآن الكريم من الرياض')}</a></article>`;
}

export function wireMedia(root,t,stopAudio) {
  const screen=root.querySelector('#screen'), button=root.querySelector('#watch'), status=root.querySelector('#stream-status');
  let timer;
  function clear() { clearTimeout(timer);screen.replaceChildren(); }
  function unavailable() {
    clear();
    status.textContent=t('Player unavailable. Retry or open the official channel.','تعذّر تشغيل البث. أعد المحاولة أو افتح القناة الرسمية.');
  }
  function message(event) {
    const frame=screen.firstElementChild;
    if(event.origin!==origin || !frame || event.source!==frame.contentWindow)return;
    let info;
    try {info=JSON.parse(event.data)}catch{return}
    if(info.event==='onError'){unavailable();return}
    if(info.event==='onReady'||info.event==='infoDelivery'||info.event==='initialDelivery'){
      clearTimeout(timer);status.textContent='';
    }
  }
  function start(){
    clear();stopAudio();
    if(!navigator.onLine){status.textContent=t('Connect to the internet to watch.','اتصل بالإنترنت للمشاهدة.');return}
    status.textContent=t('Loading player…','جارٍ تحميل المشغّل…');
    const frame=document.createElement('iframe');
    frame.title=t('Saudi Quran TV live from Makkah','قناة القرآن الكريم مباشرة من مكة');
    frame.allowFullscreen=true;
    frame.allow='encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.style.cssText='width:100%;aspect-ratio:16/9;border:0';
    frame.src=origin+'/embed/IsJTAdC3-Jw?playsinline=1&enablejsapi=1&origin='+encodeURIComponent(location.origin);
    frame.addEventListener('load',()=>{
      if(screen.firstElementChild!==frame)return;
      frame.contentWindow.postMessage(JSON.stringify({event:'listening',id:'stream'}),origin);
      frame.contentWindow.postMessage(JSON.stringify({event:'command',func:'addEventListener',args:['onError']}),origin);
    });
    screen.append(frame);
    timer=setTimeout(()=>{status.textContent=t('If playback has not started, tap Play or open the official channel.','إن لم يبدأ البث فاضغط تشغيل أو افتح القناة الرسمية.');},10000);
  }
  button.addEventListener('click',start);
  window.addEventListener('message',message);
  return ()=>{clear();window.removeEventListener('message',message);button.removeEventListener('click',start)};
}
