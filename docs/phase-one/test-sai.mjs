import assert from 'node:assert/strict';
import test from 'node:test';
import {SAI_TRIPS,saiProgress,saiProgressHtml} from '../../frontend/public/companion/sai-progress.js';

const say=en=>en;
test('Sa\u2019i consists of exactly seven alternating one-way trips',()=>{
 assert.equal(SAI_TRIPS.length,7);
 for(let index=0;index<7;index++){
  const trip=SAI_TRIPS[index];
  assert.equal(trip.number,index+1);
  assert.equal(trip.from,index%2===0?'safa':'marwah');
  assert.equal(trip.to,index%2===0?'marwah':'safa');
  const state=saiProgress(index);
  assert.equal(state.completed,index);
  assert.equal(state.location,trip.from);
  assert.deepEqual(state.next,trip);
  assert.equal(state.finished,false);
  const html=saiProgressHtml(index,say);
  assert.match(html,new RegExp('Trip '+(index+1)+' of 7'));
  assert.match(html,new RegExp('Walk to '+(trip.to==='safa'?'Safa':'Marwah')));
  assert.match(html,new RegExp('aria-valuenow="'+index+'"'));
 }
});
test('At seven, Sa\u2019i finishes at Marwah without another return',()=>{
 const done=saiProgress(7);
 assert.equal(done.finished,true);
 assert.equal(done.location,'marwah');
 assert.equal(done.next,null);
 assert.equal(done.last.to,'marwah');
 const html=saiProgressHtml(7,say);
 assert.match(html,/completed at Marwah/);
 assert.match(html,/no eighth trip/i);
 assert.match(html,/aria-valuenow="7"/);
 assert.doesNotMatch(html,/Trip 8/);
});
test('Count bounds and corrections are well defined',()=>{
 assert.equal(saiProgress(-1).completed,0);
 assert.equal(saiProgress(100).completed,7);
 assert.equal(saiProgress(NaN).completed,0);
 assert.equal(saiProgress(2).location,'safa');
 assert.equal(saiProgress(1).location,'marwah');
 assert.equal((saiProgressHtml(3,say).match(/class="(done|current|upcoming)"/g)||[]).length,7);
});
