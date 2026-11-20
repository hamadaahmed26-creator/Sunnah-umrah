import test from 'node:test';
import assert from 'node:assert/strict';
import {familyAPI,fixLifetime} from '../../preview/family/api.mjs';
import {localDB} from '../../preview/family/local-db.mjs';
import {newKey,seal,open} from '../../frontend/public/companion/family-crypto.js';
test('two independent family sessions, single-use invitation, encryption, reconnect, stale expiry and revocation',async()=>{
 const db=localDB(),base='https://preview.example/api/family/';let clock=Date.now();
 async function call(action,body,secret){
  const resp=await familyAPI(new Request(base+action,{method:body?'POST':'GET',body:body&&JSON.stringify(body),headers:{'content-type':'application/json',...(secret?{authorization:'Bearer '+secret}:{})}}),db,clock);
  return {status:resp.status,...await resp.json()};
 }
 const a=await call('create',{name:'A'}), b=await call('join',{name:'B',invite:a.invite});
 assert.equal(b.status,201);assert.equal((await call('join',{name:'C',invite:a.invite})).status,403);
 assert.equal((await call('members')).status,401);
 const outsider=await call('create',{name:'Other'});assert.equal((await call('members',null,outsider.secret)).members.length,1);
 const key=newKey(), lease=await call('start',{epoch:0},a.secret);
 const fix={lat:21.42,lng:39.82,accuracy:20,captured:clock};
 const packet=await seal(key,a.id,fix);
 const update={packet,epoch:lease.epoch,captured:clock};
 assert.equal((await call('fix',update,a.secret)).status,200);
 const last=(await call('members',null,b.secret)).members.find(r=>r.id===a.id);
 assert.deepEqual(await open(key,last),fix);await assert.rejects(open(newKey(),last));await assert.rejects(open(key,{...last,id:b.id}));
 clock+=70000;assert.ok(clock-last.captured>60000);
 const next={...fix,captured:clock,lng:39.821};
 assert.equal((await call('fix',{packet:await seal(key,a.id,next),captured:clock,epoch:lease.epoch},a.secret)).status,200);
 assert.deepEqual(await open(key,(await call('members',null,b.secret)).members.find(r=>r.id===a.id)),next);
 await call('stop',{epoch:lease.epoch},a.secret);
 assert.equal((await call('members',null,b.secret)).members.find(r=>r.id===a.id).packet,null);
 assert.equal((await call('start',{epoch:0},a.secret)).status,409);
 assert.equal((await call('fix',{...update,captured:clock},a.secret)).status,409);
 const epoch=(await call('members',null,a.secret)).epoch;
 const restart=await call('start',{epoch},a.secret);
 await call('fix',{...update,epoch:restart.epoch,captured:clock},a.secret);
 clock+=fixLifetime+1;assert.equal((await call('members',null,b.secret)).members.find(r=>r.id===a.id).packet,null);
 await call('leave',{},a.secret);
 assert.equal((await call('members',null,a.secret)).status,401);assert.equal((await call('members',null,b.secret)).members.length,1);
});
