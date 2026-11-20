import test from 'node:test';
import assert from 'node:assert/strict';
import {zonedClock,fetchTimetable,bearingToKaaba} from '../../frontend/public/companion/prayer-clock.js';
import {completedRecords,archiveCompleted} from '../../frontend/public/companion/journey-records.js';
test('same instant in Makkah and Los Angeles belongs to different days',()=>{
  const time=new Date('2026-11-20T00:30:00Z');
  assert.deepEqual(zonedClock(time,'Asia/Riyadh'),{day:'20-11-2026',minute:'03:30'});
  assert.deepEqual(zonedClock(time,'America/Los_Angeles'),{day:'19-11-2026',minute:'16:30'});
  assert.ok(Math.abs(bearingToKaaba(51.5074,-0.1278)-119)<1);
});
test('lookup rejects a response for the wrong Gregorian date',async ctx=>{
  ctx.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({data:{meta:{timezone:'Asia/Riyadh'},date:{gregorian:{date:'01-01-2000'}}}})}));
  await assert.rejects(fetchTimetable({city:'Makkah',country:'SA',zone:'Asia/Riyadh'}),/date mismatch/);
});
test('completed journey survives a reset and is archived only once',()=>{
  const state={history:[],live:{done:true,tawaf:7,sai:7}};
  archiveCompleted(state,'live');archiveCompleted(state,'live');
  assert.equal(state.history.length,1);
  state.live={done:false,tawaf:0,sai:0};archiveCompleted(state,'live');
  assert.deepEqual(completedRecords(JSON.parse(JSON.stringify(state.history))),state.history);
});
