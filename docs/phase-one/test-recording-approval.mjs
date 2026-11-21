import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {approvedCatalogue} from './recordings/build-approved.mjs';
import {recitations} from '../../frontend/public/companion/recitations.js';
import {recordingControls,worshipGuide} from '../../frontend/public/companion/worship.js';

test('the playback catalogue accepts only the exact signed-off script and bytes',()=>{
  const media=Buffer.from('test fixture');
  const record={religious:true,release_approved:true,topic:'corner',path:'frontend/public/companion/audio/fixture.mp3',
    exact_audio_match_verified:true,offline_redistribution_confirmed:true,verified_arabic:recitations.corner.arabic,
    reader:'fixture',reviewer:'fixture',review_date:'2026-11-20',review_evidence:'test evidence',
    rights_evidence:'https://example.org/fixture',attribution:'fixture',bytes:media.length,
    sha256:createHash('sha256').update(media).digest('hex')};
  const load=([asset])=>approvedCatalogue([asset],path=>{assert.equal(path,'audio/fixture.mp3');return media});
  const ok=load([record]);
  assert.equal(ok.corner.src,'./audio/fixture.mp3');
  assert.deepEqual(load([{...record,release_approved:false}]),{});
  for(const change of [{verified_arabic:'different wording'},{sha256:'wrong'},{exact_audio_match_verified:false},
    {offline_redistribution_confirmed:false},{path:'../unreviewed.mp3'},{reviewer:''}]){
    assert.throws(()=>load([{...record,...change}]));
  }
  const ui=recordingControls('corner',ok.corner,en=>en);
  assert.match(ui,/data-recitation-action="play"/);
  assert.match(ui,/data-recitation-action="pause" disabled/);
  assert.match(ui,/data-recitation-action="replay"/);
  assert.match(ui,/role="status"/);
});
test('Arabic reading aids use the Arabic wording',()=>{
  assert.match(worshipGuide('haram',0,'ar'),new RegExp('<p class="reading" lang="ar" dir="auto">'+recitations.haram.arabic));
});
