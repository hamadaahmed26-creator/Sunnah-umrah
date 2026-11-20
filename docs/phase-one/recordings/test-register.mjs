import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const here=dirname(fileURLToPath(import.meta.url));
const repo=resolve(process.argv[2] || '.');
const all=JSON.parse(readFileSync(resolve(here,'audio-register.json'))).assets;
const ids = new Set(all.map(x=>x.id));
assert.equal(ids.size,all.length,'duplicate recording IDs');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
 const p=resolve(dir,entry.name);return entry.isDirectory()?walk(p):[p];
});}
const exts=/\.(aac|flac|m4a|mp3|oga|ogg|opus|wav)$/i;
const local=all.filter(x=>x.path);
const paths=walk(resolve(repo,'frontend/public')).filter(p=>exts.test(p)).map(p=>relative(repo,p)).sort();
assert.deepEqual(local.map(a=>a.path).sort(),paths,'file inventory must cover every public audio asset');
for(const a of all){
 if(a.path||a.fixture){
   const data=readFileSync(a.path?resolve(repo,a.path):resolve(here,a.fixture));
   assert.equal(data.length,a.bytes,a.id);
   assert.equal(createHash('sha256').update(data).digest('hex'),a.sha256,a.id);
 }
 if(a.origin==='publisher-listening-page') {
   assert.ok(a.reader&&a.audio_source_url&&a.page&&a.sha256);
   assert.equal(a.offline_redistribution_confirmed,false);
 }
 if(a.religious && a.release_approved) {
   assert.ok(a.exact_audio_match_verified && a.offline_redistribution_confirmed && a.rights_evidence && a.reviewer && a.review_evidence && a.review_date && a.sha256,'incomplete approval evidence');
 }
}
const playerSource=readFileSync(process.argv[3] || resolve(here,'audio.js'),'utf8');
const {audio,approvedReligiousTracks}=await import('data:text/javascript;base64,'+Buffer.from(playerSource).toString('base64'));
assert.deepEqual(Object.keys(approvedReligiousTracks).sort(),all.filter(a=>a.religious && a.release_approved).map(a=>a.id).sort());
assert.equal(await audio.play('review-takbir'),false);
const fixture=all.find(a=>a.origin==='review-fixture');
assert.equal(fixture.offline_redistribution_confirmed,true);
assert.equal(fixture.exact_audio_match_verified,false);
const review=readFileSync(resolve(here,'review','listen.html'),'utf8');
assert.ok(review.includes(playerSource),'review harness is stale; regenerate using current player');
assert.ok(review.includes('data:audio/ogg;base64,'+readFileSync(resolve(here,fixture.fixture)).toString('base64')));
console.log(all.length+' records, '+paths.length+' repository audio assets; hashes, rights flags, review isolation and shared-player harness passed.');
const controls=new Map(['#play','#pause','#replay','#status'].map(id=>[id,{}]));
let activeNode;
class TestMedia extends EventTarget {
  currentTime=0;
  ended=false;
  paused=true;
  constructor(){super();activeNode=this;}
  async play(){this.paused=false;}
  pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
}
globalThis.document={querySelector:id=>controls.get(id)};
globalThis.Audio=TestMedia;
const script=review.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
await import('data:text/javascript;base64,'+Buffer.from(script).toString('base64'));
assert.equal(await controls.get('#play').onclick(),true);
assert.equal(controls.get('#status').textContent,'playing');
const played=Buffer.from(activeNode.src.split(',')[1],'base64');
assert.equal(createHash('sha256').update(played).digest('hex'),fixture.sha256);
controls.get('#pause').onclick();
assert.equal(controls.get('#status').textContent,'paused');
activeNode.currentTime=1;
assert.equal(await controls.get('#replay').onclick(),true);
assert.equal(activeNode.currentTime,0);
console.log('Offline harness controls exercised with simulated media; playback source matches the registered Ogg.');
