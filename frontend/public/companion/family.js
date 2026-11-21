import {gates} from './maps/gates.js';
import {newKey,seal,open} from './family-crypto.js';
let pref={};
try{pref=JSON.parse(localStorage.getItem('sunnah-umrah.companion.v1'))||{}}catch{}
const ar=pref.lang==='ar',t=(en,arabic)=>ar?arabic:en;
document.documentElement.lang=ar?'ar':'en';document.documentElement.dir=ar?'rtl':'ltr';
document.body.classList.toggle('easy',!!pref.easy);
const gateMode=location.hash==='#gates';
const title=gateMode?t('Find my gate','ابحث عن باب'):t('Find my family','اعثر على عائلتي');
document.title=title+' · Sunnah Umrah';
const $=id=>document.getElementById(id);
$('family-page').innerHTML=`<a href="./index.html">${t('Home','الرئيسية')}</a><h1>${title}</h1>
<p>${t('Your phone estimates your position. Indoors, check the gate number and floor with mosque staff.','يقدّر هاتفك موقعك. داخل المسجد تأكّد من رقم الباب والطابق مع الموظفين.')}</p>
<section id="setup"><label>${t('Your first name or nickname','اسمك الأول أو اسم مستعار')}<input id="name" maxlength="40" autocomplete="off"></label>
<button id="create">${t('Create private group','إنشاء مجموعة خاصة')}</button><details><summary>${t('Join with an invitation','الانضمام بدعوة')}</summary><label>${t('Private invitation','الدعوة الخاصة')}<input id="invite-code" autocomplete="off" spellcheck="false"></label><button id="join">${t('Join group','انضم إلى المجموعة')}</button></details></section>
<section id="joined" hidden><button id="invite">${t('Invite one relative','ادعُ أحد أفراد العائلة')}</button><output id="invitation"></output><button id="send" hidden>${t('Share invitation','مشاركة الدعوة')}</button>
<p>${t('Sharing sends your location to group members while this page is open. Links for walking directions open Apple Maps.','تتيح المشاركة لأعضاء المجموعة رؤية موقعك أثناء فتح الصفحة. تفتح روابط اتجاهات المشي خرائط Apple.')}</p>
<button id="start" class="primary">${t('Start sharing my location','بدء مشاركة موقعي')}</button><button id="stop" class="critical" hidden>${t('Stop sharing','إيقاف مشاركة الموقع')}</button><button id="leave">${t('Leave group and delete my entry','مغادرة المجموعة وحذف بياناتي')}</button></section>
<p id="connection" role="status"></p><p id="notice" role="status"></p><p id="offline-copy" role="status"></p>
<button id="locate">${t('Find my position on this device','اعرض موقعي على هذا الجهاز')}</button><button id="local-stop" hidden>${t('Stop using my position','إيقاف استخدام موقعي')}</button><p id="gps-status" role="status"></p><p id="own" role="status"></p>
<div id="family-map" aria-label="${title}"></div><p id="map-info">${t('Offline map around the Haram. Gate pins are approximate.','خريطة محيط الحرم دون اتصال. مواقع الأبواب تقريبية.')}</p>
<label>${gateMode?t('Choose a mapped gate','اختر بابًا على الخريطة'):t('Choose a family member','اختر أحد أفراد العائلة')}<select id="target"></select></label>
<p id="detail" role="status"></p><a id="walk" hidden rel="noopener noreferrer" target="_blank">${t('Walking directions in Apple Maps · internet may be required','اتجاهات المشي في خرائط Apple · قد يلزم الإنترنت')}</a>`;
const map=L.map('family-map').setView([21.4225,39.8262],17);
map.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>');
const streets=L.layerGroup().addTo(map), marks=L.layerGroup().addTo(map);
fetch('./maps/haram.json').then(r=>r.json()).then(features=>{
 for(const [kind,line] of features){
  const building=kind==='building';(building?L.polygon:L.polyline)(line,{interactive:false,renderer,stroke:true,color:building?'#b8bdb0':kind==='road'?'#abb9ae':'#fff',weight:building?1:3,fillOpacity:.45}).addTo(streets);
 }
}).catch(()=>{$('map-info').textContent=t('Street layer unavailable. Gate markers remain approximate.','طبقة الطرق غير متاحة. علامات الأبواب تقريبية.')});
const renderer=L.canvas({padding:.2});
for(const g of gates){L.circleMarker([g.lat,g.lng],{radius:4,color:'#765325'}).addTo(map).bindTooltip(ar?g.name_ar:g.name_en);}
let session,local=null,peers=[],connected=false,watch=null,sharing=false,generation=0,pollBusy=false,publishing=false,lastSent=0;
const key='umrah-family-session-v1';
try{session=JSON.parse(sessionStorage.getItem(key))}catch{}
function save(){
 try{
  if(session)sessionStorage.setItem(key,JSON.stringify(session));
  else sessionStorage.removeItem(key);
  return true;
 }catch{return false}
}
function clearInvitation(){
 $('invitation').textContent='';$('send').hidden=true;
}
function clearSession(){
 cancelWatch();session=null;peers=[];local=null;connected=false;
 clearInvitation();save();
}
const notice=text=>{$('notice').textContent=text};
const fresh=fix=>fix && Date.now()-fix.captured<60000;
const when=ms=>new Date(ms).toLocaleTimeString(ar?'ar':'en');
const stats=p=>when(p.captured)+' · ±'+Math.round(p.accuracy)+' m';
function render(){
 const leaving=session?.pending==='leave';
 if(leaving)peers=[];
 // Discard cached fixes as they expire, including while the service is unreachable.
 for(const row of peers)if(row.fix && Date.now()-row.fix.captured>=300000)row.fix=null;
 const online=connected && navigator.onLine;
 $('invite').disabled=leaving;
 $('setup').hidden=gateMode||!!session;$('joined').hidden=gateMode||!session;
 $('start').hidden=sharing;$('start').disabled=!!session?.pending;$('stop').hidden=leaving||(!sharing&&!session?.pending);
 $('locate').disabled=watch!==null;$('local-stop').hidden=watch===null||sharing;
 $('connection').textContent=gateMode?'':!navigator.onLine?t('Offline · family positions are last received.','دون اتصال · تظهر آخر مواقع وصلتنا.'):session&&!connected?t('Waiting for group connection · last received positions only.','بانتظار الاتصال بالمجموعة · آخر مواقع مستلمة فقط.'):sharing?t('Location sharing is on','مشاركة الموقع مفعّلة'):'';
 $('own').textContent=local?t('My estimated position','موقعي التقديري')+' · '+stats(local)+(fresh(local)?'':' · '+t('Old fix','موقع سابق')):'';
 marks.clearLayers();
 const marker=(p,name,color)=>{const label=document.createElement('span');label.textContent=name;L.circle([p.lat,p.lng],{radius:Math.min(p.accuracy,10000),color,weight:1}).addTo(marks);L.circleMarker([p.lat,p.lng],{color,radius:7,fillOpacity:.9}).addTo(marks).bindTooltip(label)};
 if(local)marker(local,t('Me','أنا'),'#215db2');
 const members=peers.filter(row=>row.id!==session?.id && row.fix);
 for(const row of members)marker(row.fix,row.name,online&&fresh(row.fix)?'#14604c':'#815528');
 const targets=gateMode?gates.map(g=>({id:String(g.id),name:ar?g.name_ar:g.name_en,fix:g})):members;
 const select=$('target'),id=select.value;
 select.replaceChildren(new Option(t('Select…','اختر…'),''));
 for(const row of targets)select.add(new Option(row.name,row.id));
 select.value=id;
 const row=targets.find(r=>r.id===select.value);
 $('walk').hidden=!row;$('walk').removeAttribute('href');
 let detail='';
 if(row){
   const f=row.fix;
   if(!gateMode)detail=(online&&fresh(f)?t('Last received','آخر تحديث'):t('STALE · last received','موقع قديم · آخر تحديث'))+' '+stats(f);
   if(local){
    const distance=map.distance([local.lat,local.lng],[f.lat,f.lng]);
    detail+=' · '+Math.round(distance)+' m '+t('straight-line estimate','تقدير بخط مستقيم');
    if(fresh(local)&&distance>2*(local.accuracy+(f.accuracy||0))){
      const rad=Math.PI/180,delta=(f.lng-local.lng)*rad;
      const bearing=(Math.atan2(Math.sin(delta)*Math.cos(f.lat*rad),Math.cos(local.lat*rad)*Math.sin(f.lat*rad)-Math.sin(local.lat*rad)*Math.cos(f.lat*rad)*Math.cos(delta))/rad+360)%360;
      detail+=' · '+Math.round(bearing)+'° '+t('from true north','من الشمال الحقيقي');
    }
   }
   $('walk').href='https://maps.apple.com/?dirflg=w&daddr='+f.lat+','+f.lng;
 }else if(leaving){
   detail=t('You have left this group on this device. Reconnect to finish deleting your entry.','غادرت المجموعة على هذا الجهاز. أعد الاتصال لإتمام حذف بياناتك.');
 }else if(!gateMode&&session){detail=peers.filter(r=>r.id!==session.id).map(r=>r.name).join(', ')||t('Waiting for another member','بانتظار عضو آخر');}
 $('detail').textContent=detail;
}
$('target').onchange=()=>{const id=$('target').value;const f=gateMode?gates.find(g=>String(g.id)===id):peers.find(p=>p.id===id)?.fix;if(f)map.setView([f.lat,f.lng],17);render()};
async function api(action,body,auth=session?.secret){
 const response=await fetch('/api/family/'+action,{method:body?'POST':'GET',cache:'no-store',signal:AbortSignal.timeout(12000),headers:{...(auth?{Authorization:'Bearer '+auth}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 if(!response.ok)throw Object.assign(Error('Family request failed'),{status:response.status});
 return response.json();
}
function cancelWatch(){if(watch!==null)navigator.geolocation?.clearWatch(watch);watch=null;sharing=false;generation++;}
function showInvite(invite){const value=invite+'.'+session.key;$('invitation').textContent=value;$('send').hidden=false;}
async function setup(join){
 const name=$('name').value.trim(),parts=$('invite-code').value.trim().split('.');
 if(!name||join&&(!/^[a-f0-9]{64}$/.test(parts[0])||!/^[\w-]{43}$/.test(parts[1]||''))){notice(t('Enter your name and a valid invitation if joining.','أدخل اسمك ودعوة صالحة عند الانضمام.'));return;}
 const groupKey=join?parts[1]:newKey();
 const info=await api(join?'join':'create',join?{name,invite:parts[0]}:{name},null);
 session={id:info.id,secret:info.secret,key:groupKey,epoch:0};save();$('invite-code').value='';if(info.invite)showInvite(info.invite);
 notice(t('Group ready. Each invitation works once for ten minutes.','المجموعة جاهزة. تصلح كل دعوة مرة واحدة لمدة عشر دقائق.'));await poll();
}
function locate(){
 if(watch!==null)return;
 if(!navigator.geolocation){
  $('gps-status').textContent=t('This browser cannot access your location. Check location permissions or use a supported browser.','لا يستطيع هذا المتصفح الوصول إلى موقعك. تحقّق من أذونات الموقع أو استخدم متصفحًا مدعومًا.');
  if(sharing)void stop();
  return;
 }
 $('gps-status').textContent='';
 const first=!local;
 let activeWatch;
 activeWatch=navigator.geolocation.watchPosition(pos=>{
  if(watch!==activeWatch)return;
  const center=!local&&first;
  local={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy,captured:Math.floor(pos.timestamp)};
  $('gps-status').textContent='';
  if(center)map.setView([local.lat,local.lng],17);
  render();void publish();
 },err=>{if(watch!==activeWatch)return;$('gps-status').textContent=err.code===1?t('Location permission denied. Check Safari location settings.','رُفض إذن الموقع. راجع إعدادات الموقع في سفاري.'):t('Could not get a fresh position. Check signs or ask staff.','تعذّر تحديد موقع حديث. راجع اللوحات أو اسأل الموظفين.');if(err.code===1){if(sharing)void stop();else cancelWatch();render()}},{enableHighAccuracy:true,maximumAge:0,timeout:15000});
 watch=activeWatch;
 render();
}
async function publish(){
 if(!sharing||!session||publishing||!navigator.onLine||!fresh(local)||local.captured<=lastSent)return;
 const gen=generation,fix=local,epoch=session.epoch;publishing=true;
 try{
  const packet=await seal(session.key,session.id,fix);
  if(gen!==generation)return;
  await api('fix',{epoch,captured:fix.captured,packet});
  if(gen===generation)lastSent=fix.captured;
 }catch{if(gen===generation)connected=false}finally{publishing=false;render()}
}
async function poll(){
 if(!session||gateMode||pollBusy)return;pollBusy=true;const current=session;
 try {
  if(!navigator.onLine){connected=false;return;}
  if(current.pending&&!sharing&&!starting){await flushPending();if(!session||current.pending)return;}
  const data=await api('members');
  const next=await Promise.all(data.members.map(async row=>{
    let fix=null;
    if(row.packet && row.id!==current.id){try{fix=await open(current.key,row)}catch{}}
    return {id:row.id,name:row.name,fix};
  }));
  if(session!==current || current.pending==='leave')return;
  peers=next;connected=navigator.onLine;if(!sharing)current.epoch=data.epoch;
 }catch(e){connected=false;if(e.status===401 && session===current){clearSession();notice(t('Session expired. Create or join another group.','انتهت الجلسة. أنشئ مجموعة أو انضم إلى أخرى.'));}}
 finally{pollBusy=false;render()}
 await publish();
}
async function start(){
 if(!session||session.pending||sharing)return;
 // Record revocation duty before the request: a dropped response or reload must reset the remote lease.
 session.pending='stop';
 if(!save()){
  delete session.pending;
  notice(t('Allow session storage in your browser to start sharing.','اسمح بتخزين الجلسة في المتصفح لبدء مشاركة الموقع.'));
  return;
 }
 const gen=++generation;
 const data=await api('start',{epoch:session.epoch});
 if(generation!==gen)return;
 session.epoch=data.epoch;sharing=true;lastSent=0;save();locate();notice('');render();
}
let revoking=false,starting=false;
async function flushPending(){
 if(!session?.pending||sharing||revoking)return;
 revoking=true;
 try{const action=session.pending;const answer=await api(action,{epoch:session.epoch});
 if(session?.pending!==action)return;
 if(action==='leave')clearSession();
 else{session.epoch=answer.epoch;delete session.pending;}
 save();notice(t('Group update confirmed.','تم تحديث المجموعة.'));}
 finally{revoking=false}
}
async function stop(leave=false){
 cancelWatch();lastSent=0;local=null;if(!session)return;
 session.pending=leave||session.pending==='leave'?'leave':'stop';
 if(session.pending==='leave'){peers=[];clearInvitation();}
 save();render();
 notice(t('Stopped on this phone. Waiting for server deletion.','توقّفت المشاركة على هذا الهاتف. بانتظار تأكيد الحذف.'));
 try{await flushPending()}catch{connected=false}render();
}
const action=(id,fn)=>{$(id).onclick=async()=>{const b=$(id);b.disabled=true;try{await fn()}catch{notice(t('Could not complete this action. Check the connection, permissions or invitation and retry.','تعذّر إتمام العملية. تحقق من الاتصال أو الإذن أو الدعوة وأعد المحاولة.'))}finally{b.disabled=false;render()}}};
action('create',()=>setup(false));action('join',()=>setup(true));action('invite',async()=>{
 const current=session;
 if(!current || current.pending==='leave')return;
 const response=await api('invite',{});
 if(session===current && current.pending!=='leave')showInvite(response.invite);
});action('send',async()=>{const text=$('invitation').textContent;if(navigator.share)await navigator.share({text});else await navigator.clipboard.writeText(text)});
action('local-stop',()=>{cancelWatch();local=null;render()});action('locate',locate);action('start',async()=>{starting=true;try{await start()}finally{starting=false}});action('stop',()=>stop());action('leave',()=>stop(true));
window.addEventListener('online',poll);window.addEventListener('offline',()=>{connected=false;render()});
window.addEventListener('pagehide',()=>{cancelWatch();if(session?.pending){fetch('/api/family/'+session.pending,{method:'POST',keepalive:true,headers:{Authorization:'Bearer '+session.secret,'Content-Type':'application/json'},body:JSON.stringify({epoch:session.epoch})}).catch(()=>{});}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();void poll()}});
setInterval(()=>{if(session&&!gateMode)void poll();else render()},5000);
function offlineCopyUnavailable(){
 $('offline-copy').textContent=t('The offline map could not be prepared on this device. Reopen this page with a connection to retry.','تعذّر تجهيز الخريطة دون اتصال على هذا الجهاز. افتح الصفحة مجددًا أثناء الاتصال للمحاولة.');
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./offline.js',{type:'module'}).then(registration=>{
  function checkInstall(){
   const worker=registration.installing;
   if(!worker)return;
   const status=()=>{if(worker.state==='redundant'&&!registration.active)offlineCopyUnavailable()};
   worker.addEventListener('statechange',status);status();
  }
  registration.addEventListener('updatefound',checkInstall);checkInstall();
 }).catch(offlineCopyUnavailable);
}else offlineCopyUnavailable();
render();void poll();
