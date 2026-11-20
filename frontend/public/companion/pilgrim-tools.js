import {fetchTimetable,bearingToKaaba} from './prayer-clock.js';

export function toolsPanel(t) {
 return `<article class="panel"><a href="#home">${t('Home','الرئيسية')}</a><h1>${t('Prayer times and Qibla','مواقيت الصلاة والقبلة')}</h1>
 <form id="prayer-form"><h2>${t('Prayer times','مواقيت الصلاة')}</h2><p>${t('Calculated using Umm al-Qura. Check the local mosque timetable. An internet connection is required.','الحساب وفق تقويم أم القرى. راجع جدول المسجد المحلي. يتطلّب اتصالاً بالإنترنت.')}</p>
 <label>${t('City','المدينة')}<input id="prayer-city" value="Makkah" required maxlength="80"></label>
 <label>${t('Country','الدولة')}<input id="prayer-country" value="Saudi Arabia" required maxlength="80"></label><button class="primary">${t('Show times','عرض المواقيت')}</button><div id="prayer-result" role="status"></div></form>
 <section><h2>${t('Qibla bearing','اتجاه القبلة')}</h2><p>${t('Use your location on this device to calculate the bearing clockwise from true north.','استخدم موقعك على هذا الجهاز لحساب الاتجاه بالدرجات من الشمال الحقيقي في اتجاه عقارب الساعة.')}</p>
 <button id="get-bearing">${t('Calculate direction','احسب الاتجاه')}</button><p role="status" id="bearing-result"></p></section></article>`;
}
export function wireTools(root,t) {
 const form=root.querySelector('#prayer-form');
 const controller=new AbortController();
 let request;
 form.addEventListener('submit',async event=>{
   event.preventDefault();request?.abort();request=new AbortController();const active=request;
   const output=form.querySelector('#prayer-result');
   const city=form.querySelector('#prayer-city').value.trim(), country=form.querySelector('#prayer-country').value.trim();
   output.textContent=t('Loading','جارٍ التحميل');
   try{
     const data=await fetchTimetable({city,country,zone:'Asia/Riyadh'},active.signal);
     if(active.signal.aborted)return;
     output.replaceChildren();
     const title=document.createElement('p');title.textContent=[city,country,data.timezone,data.day].join(' · ');output.append(title);
     const list=document.createElement('dl'),names={Fajr:'الفجر',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'};
     for(const [name,time] of Object.entries(data.times)){
       const label=document.createElement('dt');label.textContent=t(name,names[name]);const value=document.createElement('dd');value.textContent=time;list.append(label,value);
     }
     output.append(list);
   }catch{if(!active.signal.aborted)output.textContent=t('Could not load these times. Check the city, country and internet connection.','تعذّر تحميل المواقيت. تحقّق من المدينة والدولة والاتصال بالإنترنت.')}
 },{signal:controller.signal});
 root.querySelector('#get-bearing').addEventListener('click',()=>{
   const output=root.querySelector('#bearing-result');const fail=()=>output.textContent=t('Location unavailable. Check permission or ask mosque staff.','الموقع غير متاح. تحقّق من الإذن أو اسأل موظفي المسجد.');
   if(!navigator.geolocation){fail();return}
   output.textContent=t('Loading','جارٍ التحميل');
   navigator.geolocation.getCurrentPosition(position=>{
     if(controller.signal.aborted)return;
     const {latitude,longitude,accuracy}=position.coords;
     const distance=Math.hypot((latitude-21.4225)*111000,(longitude-39.8262)*103000);
     if(!Number.isFinite(accuracy)||distance<Math.max(accuracy*4,100)){output.textContent=t('Too close to the Ka‘bah or location too uncertain for a reliable bearing. Follow mosque guidance.','أنت قريب جدًا من الكعبة أو دقة الموقع غير كافية. اتبع إرشادات المسجد.');return}
     output.textContent=Math.round(bearingToKaaba(latitude,longitude))+'° · '+t('clockwise from true north','في اتجاه عقارب الساعة من الشمال الحقيقي')+' · GPS ±'+Math.round(accuracy)+' m';
   },fail,{enableHighAccuracy:true,maximumAge:0,timeout:12000});
 },{signal:controller.signal});
 return ()=>{controller.abort();request?.abort()};
}
