import {approvedRecordings} from './approved-tracks.js';
const cacheName='pilgrim-companion-'+new URL(self.registration.scope).pathname+'-v1.6.4';
const licensedMedia=Object.values(approvedRecordings).map(record=>record.src.slice(2));
const assets=['approved-tracks.js',...licensedMedia,'family.html','family.js','saved-gate.js','family-crypto.js','maps/leaflet.js','maps/leaflet.css','maps/haram.json','maps/gates.js','index.html','style.css','guide.js','sai-progress.js','tawaf-practice.js','live-media.js','worship.js','locales/languages.js','locales/review-packs.js','recitations.js','journey-records.js','prayer-clock.js','pilgrim-tools.js','content.js','audio.js','hero.jpg','audio/navigation-en.mp3','audio/navigation-ar.mp3'];
const scoped=name=>new URL(name,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(cacheName);
 await cache.addAll(assets.map(name=>new Request(scoped(name),{cache:'reload'})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const prefix=cacheName.slice(0,cacheName.lastIndexOf('-v')+2);
 await Promise.all((await caches.keys()).filter(k=>k!==cacheName&&k.startsWith(prefix)).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||!request.url.startsWith(self.registration.scope))return;
 const url=new URL(request.url);
 const file=assets.find(name=>scoped(name)===url.origin+url.pathname);
 const entry=url.pathname===new URL(self.registration.scope).pathname;
 if(!entry&&!file)return;
 event.respondWith((async()=>{
   const cache=await caches.open(cacheName);
   const hit=await cache.match(scoped(file||'index.html'));
   if(!hit)return fetch(request);
   return file && /\.(mp3|ogg|oga|m4a|wav)$/.test(file)?mediaRange(hit,request.headers.get('Range')):hit;
 })());
});
// Offline single-range media responses for an already cached complete MP3.
// A malformed or multi-range request is served as a full 200 response.
async function mediaRange(response, header) {
  if (!header || response.status !== 200) return response;
  const m = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!m || (!m[1] && !m[2])) return response;
  const data = await response.arrayBuffer();
  const size = data.byteLength;
  const first = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  const last = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (first < 0 || !Number.isSafeInteger(first) || first > last) {
    return new Response(null, {status: 416, headers: {'Content-Range': 'bytes */' + size}});
  }
  return new Response(data.slice(first, last + 1), {status: 206, headers: {
    'Accept-Ranges': 'bytes',
    'Content-Range': 'bytes ' + first + '-' + last + '/' + size,
    'Content-Length': String(last - first + 1),
    'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
  }});
}
