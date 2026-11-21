import {test} from 'node:test';
import assert from 'node:assert/strict';
import {worshipGuide} from '../../frontend/public/companion/worship.js';

const origin='https://sunnah-umrah-pilgrim-preview.tastygrebe11.chatgpt.site';
test('unapproved human samples remain inaccessible in a normal public app',()=>{
 const previous=globalThis.location;
 try{
  globalThis.location={origin:'https://sunnahumrah.app'};
  for(const stage of ['talbiyah','tawaf','sai','miqat']){
   const html=worshipGuide(stage,0,'en');
   assert.doesNotMatch(html,/data-review-audio/);
   assert.doesNotMatch(html,/\/recording-review\/OD-/);
  }
 }finally{if(previous===undefined)delete globalThis.location;else globalThis.location=previous}
});
test('only exact full-text candidate recordings are offered for private review',()=>{
 const previous=globalThis.location;
 try{
  globalThis.location={origin};
  assert.match(worshipGuide('talbiyah',0,'en'),/OD-233\.mp3/);
  assert.match(worshipGuide('tawaf',0,'en'),/OD-235\.mp3/);
  assert.match(worshipGuide('sai',0,'en'),/OD-236-3\.mp3/);
  assert.doesNotMatch(worshipGuide('miqat',0,'en'),/data-review-audio/);
  const html=worshipGuide('sai',0,'en');
  assert.match(html,/NOT approved for worship playback/);
  assert.match(html,/Muhammad Jumah/);
  assert.match(html,/creativecommons\.org/);
 }finally{if(previous===undefined)delete globalThis.location;else globalThis.location=previous}
});
