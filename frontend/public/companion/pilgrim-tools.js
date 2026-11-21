import {fetchTimetable,prayerNames,zonedClock,currentTimetable,reliableBearing,compassReading} from './prayer-clock.js';

export function toolsPanel(t) {
 return `<article class="panel"><button type="button" class="back" data-act="go-back">${t('Back','رجوع')}</button> <a href="#home">${t('Home','الرئيسية')}</a><h1>${t('Prayer times and Qibla','مواقيت الصلاة والقبلة')}</h1>
 <form id="prayer-form"><h2>${t('Prayer times','مواقيت الصلاة')}</h2><p>${t('Calculated using Umm al-Qura. Check your local mosque timetable.','الحساب وفق تقويم أم القرى. راجع جدول المسجد المحلي.')}</p>
 <label>${t('City','المدينة')}<input id="prayer-city" value="Makkah" required maxlength="80"></label>
 <label>${t('Country','الدولة')}<input id="prayer-country" value="Saudi Arabia" required maxlength="80"></label><button class="primary">${t('Show times','عرض المواقيت')}</button><div id="prayer-result" role="status"></div></form>
 <label><input type="checkbox" id="prayer-reminders"> ${t('Show prayer reminders while this screen is open','عرض التنبيه بوقت الصلاة ما دامت هذه الشاشة مفتوحة')}</label><p id="prayer-notice" role="alert"></p>
 <section><h2>${t('Qibla bearing','اتجاه القبلة')}</h2><p>${t('Use your location on this device to calculate the bearing clockwise from true north.','استخدم موقعك على هذا الجهاز لحساب الاتجاه بالدرجات من الشمال الحقيقي في اتجاه عقارب الساعة.')}</p>
 <button id="get-bearing">${t('Calculate direction','احسب الاتجاه')}</button><p role="status" id="bearing-result"></p>
 <button id="compass" aria-pressed="false">${t('Start compass','تشغيل البوصلة')}</button><p>${t('Hold the phone flat in portrait. Device heading may use magnetic north.','أمسك الهاتف أفقيًا مع إبقاء الشاشة في الوضع الرأسي. قد يستند اتجاه الجهاز إلى الشمال المغناطيسي.')}</p><p role="status" id="heading"></p></section></article>`;
}
const timetableKey='sunnah-umrah.daily-timetable.v1';
const reminderKey='sunnah-umrah.foreground-prayer-reminder.v1';
function read(key){
  try{return JSON.parse(localStorage.getItem(key))}catch{return null}
}
function write(key,value){
  try{localStorage.setItem(key,JSON.stringify(value))}catch{/* The open screen keeps its active timetable. */}
}
export function wireTools(root,t) {
  const controller=new AbortController(), options={signal:controller.signal};
  const el=id=>root.querySelector('#'+id);
  const form=el('prayer-form'), city=el('prayer-city'), country=el('prayer-country');
  const output=el('prayer-result'), reminder=el('prayer-reminders'), notice=el('prayer-notice');
  const names={Fajr:'الفجر',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'};
  let table=null, request, lastNotice='', gpsVersion=0;
  let cached=read(timetableKey);
  reminder.checked=read(reminderKey)===true;
  function tick(){
    if(!table)return;
    if(table.day!==zonedClock(new Date(),table.timezone).day){
      table=null;lastNotice='';notice.textContent='';
      output.textContent=t('Refresh today’s timetable','حدّث جدول مواقيت اليوم');
      return;
    }
    const minute=zonedClock(new Date(),table.timezone).minute;
    const due=reminder.checked&&!document.hidden?prayerNames.find(name=>table.times[name]===minute):'';
    if((due||'')===lastNotice)return;
    notice.textContent=due?t('Time for prayer','حان وقت الصلاة')+' · '+t(due,names[due]):'';
    lastNotice=due||'';
  }
  function show(data,saved){
    table=data;output.replaceChildren();
    const heading=document.createElement('p');
    heading.textContent=[data.city,data.country,data.timezone,data.day].join(' · ')+(saved?' · '+t('Saved timetable','الجدول المحفوظ'):'');
    output.append(heading);
    const list=document.createElement('dl');
    for(const name of prayerNames){
      const label=document.createElement('dt'),value=document.createElement('dd');
      label.textContent=t(name,names[name]);value.textContent=data.times[name];list.append(label,value);
    }
    output.append(list);tick();
  }
  if(typeof cached?.city==='string' && typeof cached?.country==='string'){
    city.value=cached.city;country.value=cached.country;
    if(currentTimetable(cached,city.value,country.value))show(cached,true);
  }
  function invalidate(){
    request?.abort();table=null;lastNotice='';notice.textContent='';output.replaceChildren();
  }
  city.addEventListener('input',invalidate,options);country.addEventListener('input',invalidate,options);
  reminder.addEventListener('change',()=>{write(reminderKey,reminder.checked);tick()},options);
  document.addEventListener('visibilitychange',tick,options);
  const timer=setInterval(tick,10000);
  form.addEventListener('submit',async event=>{
    event.preventDefault();invalidate();request=new AbortController();const active=request;
    const place={city:city.value.trim(),country:country.value.trim()};
    output.textContent=t('Loading','جارٍ التحميل');
    const fallback=()=> {
      if(currentTimetable(cached,place.city,place.country))show(cached,true);
      else output.textContent=t('Could not load these times. Check the city, country and internet connection.','تعذّر تحميل المواقيت. تحقّق من المدينة والدولة والاتصال بالإنترنت.');
    };
    if(navigator.onLine===false){fallback();return}
    const timeout=setTimeout(()=>active.abort('timeout'),12000);
    try{
      const zone=currentTimetable(cached,place.city,place.country)?cached.timezone:Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result=await fetchTimetable({...place,zone},active.signal);
      if(!active.signal.aborted){cached={...place,...result};write(timetableKey,cached);show(cached,false)}
    }catch{if(!active.signal.aborted || (active.signal.reason==='timeout' && request===active && !controller.signal.aborted))fallback()}
    finally{clearTimeout(timeout)}
  },options);
  el('get-bearing').addEventListener('click',()=>{
    const result=el('bearing-result'), version=++gpsVersion;
    const current=()=>!controller.signal.aborted && version===gpsVersion;
    const fail=()=>{if(current())result.textContent=t('Location unavailable. Check permission or ask mosque staff.','الموقع غير متاح. تحقّق من الإذن أو اسأل موظفي المسجد.')};
    if(!navigator.geolocation){fail();return}
    result.textContent=t('Loading','جارٍ التحميل');
    navigator.geolocation.getCurrentPosition(position=>{
      if(!current())return;
      const bearing=reliableBearing(position.coords);
      result.textContent=bearing===null?t('Too close to the Ka‘bah or location too uncertain for a reliable bearing. Follow mosque guidance.','أنت قريب جدًا من الكعبة أو دقة الموقع غير كافية. اتبع إرشادات المسجد.'):
        bearing+'° · '+t('clockwise from true north','في اتجاه عقارب الساعة من الشمال الحقيقي')+' · GPS ±'+Math.round(position.coords.accuracy)+' m';
    },fail,{enableHighAccuracy:true,maximumAge:0,timeout:12000});
  },options);
  const button=el('compass'),heading=el('heading');
  const unavailable=()=>t('Reliable compass reading unavailable.','تعذّر الحصول على قراءة موثوقة للبوصلة.');
  let compassAbort=null,expiry;
  function stopCompass(){
    compassAbort?.abort();compassAbort=null;clearTimeout(expiry);
    button.setAttribute('aria-pressed','false');button.textContent=t('Start compass','تشغيل البوصلة');
    heading.textContent='';
  }
  button.addEventListener('click',async()=>{
    if(compassAbort){stopCompass();return}
    const api=window.DeviceOrientationEvent;
    if(!api){heading.textContent=unavailable();return}
    const session=new AbortController();compassAbort=session;
    button.setAttribute('aria-pressed','true');button.textContent=t('Stop compass','إيقاف البوصلة');
    heading.textContent=t('Loading','جارٍ التحميل');
    try{
      if(typeof api.requestPermission==='function' && await api.requestPermission()!=='granted'){
        if(compassAbort===session){stopCompass();heading.textContent=t('Compass permission denied.','رُفض إذن البوصلة.')}
        return;
      }
    }catch{if(compassAbort===session){stopCompass();heading.textContent=unavailable()}return}
    if(compassAbort!==session)return;
    const stale=()=>{heading.textContent=unavailable()};
    expiry=setTimeout(stale,5000);
    window.addEventListener('deviceorientation',event=>{
      const angle=window.screen.orientation?.angle??window.orientation;
      const reading=compassReading(event,angle);
      clearTimeout(expiry);
      const label=reading?t('Device heading','اتجاه الجهاز')+' '+reading.heading+'° ±'+reading.accuracy+'°':unavailable();
      if(heading.textContent!==label)heading.textContent=label;
      expiry=setTimeout(stale,5000);
    },{signal:session.signal});
  },options);
  return ()=>{controller.abort();request?.abort();clearInterval(timer);stopCompass()};
}
