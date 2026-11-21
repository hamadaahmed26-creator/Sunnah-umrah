import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const audioPath=process.argv[2] || resolve(here,'../../../frontend/public/companion/audio.js');
const manifest=readFileSync(resolve(dirname(audioPath),'approved-tracks.js'),'utf8');
const player=readFileSync(audioPath,'utf8').replace("import {approvedRecordings} from './approved-tracks.js';",manifest);
const register=JSON.parse(readFileSync(resolve(here,'audio-register.json')));
const track=register.assets.find(asset=>asset.id==='takbir-asem-khidhr');
const media=readFileSync(resolve(here,track.fixture));
if (createHash('sha256').update(media).digest('hex')!==track.sha256) throw new Error('Review fixture differs from its registered hash');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Takbir recording review</title>
<style>body{font:1.2rem/1.55 system-ui;max-width:42rem;margin:2rem auto;padding:1rem}button{padding:.8rem;margin:.25rem}strong{overflow-wrap:anywhere} [lang="ar"]{font-size:2rem}</style>
<main><h1>Takbir recording review</h1><p>For reviewer listening only. This recording awaits qualified pronunciation review.</p><p lang="ar" dir="rtl">اللَّهُ أَكْبَرُ</p>
<button id="play">Play</button><button id="pause">Pause</button><button id="replay">Replay</button><p id="status" role="status">Ready</p>
<p>Compare the complete sound to the displayed words. Check articulation, vowel sounds, added or missing words, and suitability for teaching. Record your name, qualifications, date, decision and the SHA-256 below in the review register.</p>
<p>SHA-256 <strong>${track.sha256}</strong></p>
<p>Ar-eg-الله أكبر.oga by Assem Khidhr. Original audio, unmodified. <a href="${track.rights_evidence}">Source</a>. <a href="${track.license_url}">CC BY-SA 4.0</a>.</p></main>
<script type="module">
${player}
const playerForReview=createPlayer(() => new Audio(),Object.freeze({'review-takbir':new URL('./takbir.oga',document.baseURI).href}));
playerForReview.subscribe(state => document.querySelector('#status').textContent=state.status);
document.querySelector('#play').onclick=()=>playerForReview.play('review-takbir');
document.querySelector('#pause').onclick=()=>playerForReview.pause();
document.querySelector('#replay').onclick=()=>playerForReview.replay('review-takbir');
</script></html>`;
writeFileSync(resolve(here,'review','listen.html'),html);
