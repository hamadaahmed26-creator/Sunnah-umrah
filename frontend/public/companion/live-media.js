// The official broadcaster can rotate the video ID or restrict a region.
const channel = 'https://www.youtube.com/@SaudiQuranTv/live';
const videoId = 'IsJTAdC3-Jw';
const radioDirectory = 'https://radioplus.sba.sa/ar/live/4';
const reciterStation = 'https://backup.qurango.net/radio/abdulbasit_abdulsamad';
let apiRequest;

function youtubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiRequest) return apiRequest;
  apiRequest = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const previous = window.onYouTubeIframeAPIReady;
    function finish() {
      clearTimeout(timeout);
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
      script.onerror = null;
      if (window.YT?.Player) resolve(window.YT);
      else {
        script.remove();
        apiRequest = null;
        reject(new Error('YouTube player API unavailable'));
      }
    }
    function ready() {
      finish();
      previous?.();
    }
    const timeout = setTimeout(finish, 12000);
    window.onYouTubeIframeAPIReady = ready;
    script.onerror = finish;
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.append(script);
  });
  return apiRequest;
}

export function mediaPanel(t) {
  return `<article class="panel"><a href="#home">${t('Home','الرئيسية')}</a>
  <h1>${t('Makkah Live','مكة مباشر')}</h1>
  <p>${t('Watch Masjid al-Haram on Saudi Quran TV. Video uses mobile data.','شاهد المسجد الحرام على قناة القرآن الكريم السعودية. يستهلك الفيديو بيانات الإنترنت.')}</p>
  <button class="primary" id="watch">${t('Load video player','تحميل مشغّل الفيديو')}</button>
  <div id="screen"></div><p id="stream-status" role="status"></p>
  <a href="${channel}" target="_blank" rel="noopener" data-leave-media>${t('Watch on the official channel','شاهد على القناة الرسمية')}</a>
  <h2>${t('Listen to live Qur’an radio','استمع إلى إذاعة القرآن الكريم')}</h2>
  <p>${t('Continuous recitations by Sheikh Abdul Basit Abdus Samad on MP3Quran. Listening uses internet data.','تلاوات متواصلة للشيخ عبد الباسط عبد الصمد من المكتبة الصوتية للقرآن الكريم. يتطلّب الاستماع اتصالاً بالإنترنت.')}</p>
  <button class="primary" id="radio">${t('Play Qur’an radio','تشغيل إذاعة التلاوات')}</button>
  <p id="radio-status" role="status"></p>
  <a href="${radioDirectory}" target="_blank" rel="noopener" data-leave-media>${t('Open Saudi Quran Radio from Riyadh','افتح إذاعة القرآن الكريم من الرياض')}</a></article>`;
}

export function wireMedia(root, t, stopAudio) {
  const screen = root.querySelector('#screen'), watch = root.querySelector('#watch');
  const status = root.querySelector('#stream-status'), radioStatus = root.querySelector('#radio-status');
  const radio = root.querySelector('#radio'), external = root.querySelectorAll('[data-leave-media]');
  let timer, radioTimer, audio, player, videoRequest = 0;

  function closeVideo() {
    videoRequest++;
    clearTimeout(timer);
    player?.destroy();
    player = null;
    screen.replaceChildren();
    status.textContent = '';
  }
  function closeRadio() {
    clearTimeout(radioTimer);
    const old = audio;
    audio = null;
    if (old) {
      old.pause();
      old.removeAttribute('src');
      old.load();
    }
    radio.textContent = t('Play Qur’an radio','تشغيل إذاعة التلاوات');
    radioStatus.textContent = '';
  }
  function stop() { closeVideo(); closeRadio(); stopAudio(); }
  function offline() {
    const activeStatus = audio ? radioStatus : screen.firstElementChild ? status : null;
    stop();
    if (activeStatus) activeStatus.textContent = t('Connection lost. Reconnect and press Play.','انقطع الاتصال. اتصل بالإنترنت ثم اضغط تشغيل.');
  }
  async function startVideo() {
    stop();
    if (!navigator.onLine) { status.textContent=t('Connect to the internet to watch.','اتصل بالإنترنت للمشاهدة.'); return; }
    const request = videoRequest;
    const current = () => request === videoRequest;
    function unavailable() {
      if (!current()) return;
      closeVideo();
      status.textContent = t('Player unavailable. Retry or open the official channel.','تعذّر تشغيل البث. أعد المحاولة أو افتح القناة الرسمية.');
    }
    status.textContent = t('Loading player…','جارٍ تحميل المشغّل…');
    const frame = document.createElement('iframe');
    frame.id = 'makkah-player';
    frame.title = t('Saudi Quran TV live from Makkah','قناة القرآن الكريم مباشرة من مكة');
    frame.allowFullscreen = true;
    frame.allow = 'encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.cssText = 'width:100%;min-height:200px;aspect-ratio:16/9;border:0';
    frame.src = 'https://www.youtube-nocookie.com/embed/'+videoId+'?playsinline=1&enablejsapi=1&origin='+encodeURIComponent(location.origin);
    frame.addEventListener('error', unavailable);
    screen.append(frame);
    function offerFallback() {
      if (current()) status.textContent = t('If playback has not started, tap Play or open the official channel.','إن لم يبدأ البث فاضغط تشغيل أو افتح القناة الرسمية.');
    }
    timer = setTimeout(offerFallback, 10000);
    try {
      const YT = await youtubeApi();
      if (!current()) return;
      player = new YT.Player(frame, {events:{
        onReady() {
          if (!current()) return;
          clearTimeout(timer);
          status.textContent = t('Press Play in the video player.','اضغط تشغيل في مشغّل الفيديو.');
        },
        onStateChange(event) {
          if (!current()) return;
          if (event.data === YT.PlayerState.PLAYING) status.textContent = '';
          if (event.data === YT.PlayerState.ENDED) unavailable();
        },
        onError: unavailable
      }});
    } catch { offerFallback(); } // The iframe has independent native controls.
  }

  function startRadio() {
    if (audio) { closeRadio(); return; }
    stop();
    if (!navigator.onLine) { radioStatus.textContent=t('Connect to the internet to listen.','اتصل بالإنترنت للاستماع.'); return; }
    const node = new Audio();
    audio = node;
    radio.textContent = t('Stop radio','إيقاف الإذاعة');
    function failed() {
      if (audio !== node) return;
      closeRadio();
      radioStatus.textContent = t('Radio unavailable. Retry or open Saudi Quran Radio below.','تعذّر تشغيل الإذاعة. أعد المحاولة أو افتح إذاعة القرآن الكريم أدناه.');
    }
    function buffering() {
      if (audio !== node) return;
      radioStatus.textContent = t('Connecting to the radio…','جارٍ الاتصال بالإذاعة…');
      clearTimeout(radioTimer);
      radioTimer = setTimeout(failed, 18000);
    }
    node.addEventListener('playing', () => {
      if (audio !== node) return;
      clearTimeout(radioTimer);
      radioStatus.textContent = t('Playing · Abdul Basit Abdus Samad','قيد التشغيل · عبد الباسط عبد الصمد');
    });
    node.addEventListener('waiting', buffering);
    node.addEventListener('pause', () => { if (audio === node) closeRadio(); });
    node.addEventListener('ended', failed);
    node.addEventListener('error', failed);
    node.src = reciterStation;
    buffering();
    node.play().catch(failed);
  }
  watch.addEventListener('click', startVideo);
  radio.addEventListener('click', startRadio);
  window.addEventListener('offline', offline);
  for (const link of external) link.addEventListener('click', stop);
  return () => {
    closeVideo();
    closeRadio();
    watch.removeEventListener('click', startVideo);
    radio.removeEventListener('click', startRadio);
    window.removeEventListener('offline', offline);
    for (const link of external) link.removeEventListener('click', stop);
  };
}
