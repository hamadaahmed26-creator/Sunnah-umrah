// Produce the exact offline script for commissioned recordings and the reviewer.
import {readFile,writeFile} from 'node:fs/promises';
import {recitations} from '../../../frontend/public/companion/recitations.js';
const register=JSON.parse(await readFile(new URL('../religious-content-register.json',import.meta.url)));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const cards=register.recitations.map(row=>{
 const displayed=recitations[row.id];if(displayed.arabic!==row.arabic)throw Error('Displayed Arabic differs from register: '+row.id);
 return `<section><h2>${esc(row.location)}</h2><p lang="ar" dir="rtl">${esc(displayed.arabic)}</p>
 <p>${esc(displayed.meaning)}</p><small>${esc(row.id)} · ${row.sources.map(x=>esc(x.reference)).join(' · ')}</small>
 <label>Candidate human recording <input type="file" accept="audio/*"></label><audio controls preload="none"></audio><output></output></section>`;
}).join('');
await writeFile(new URL('review/reciter-sheet.html',import.meta.url),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Umrah recording review</title><style>body{max-width:45rem;margin:2rem auto;padding:1rem;font:1.1rem/1.5 system-ui}section{border-top:1px solid #bbb;padding-block:1rem}[lang=ar]{font-size:2rem}label,audio,output{display:block;margin:.7rem 0}output{overflow-wrap:anywhere}</style><h1>Umrah recording review</h1>
 <p>For the reciter, the Arabic reviewer and the rights holder. Only select files you have permission to review. The file stays on this device. Compare every word and vowel against the approved script, including the stopping point. Record corrections before recording approval.</p>
 <p>For each take, retain its ID, fingerprint, named reader, reviewer, date, pronunciation decision and written rights to embed and distribute online and offline. This sheet plays candidate files locally. Approval is recorded separately.</p>${cards}
 <script>
 const sections=document.querySelectorAll('section');
 for(const section of sections){
 const input=section.querySelector('input'),player=section.querySelector('audio'),out=section.querySelector('output');let url,version=0;
 input.onchange=async()=>{const selected=++version;player.pause();if(url)URL.revokeObjectURL(url);player.removeAttribute('src');player.load();out.textContent='';
 const file=input.files[0];if(!file)return;url=URL.createObjectURL(file);player.src=url;
 try{const digest=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());if(selected===version)out.textContent='SHA-256 '+Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('')}catch{out.textContent='Fingerprint unavailable on this browser.'}};
 player.addEventListener('play',()=>{for(const other of document.querySelectorAll('audio'))if(other!==player)other.pause()});
 player.onerror=()=>{if(input.files.length)out.textContent='This file could not be played. Check its format.'};
 }
 </script></html>`);
