const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dir=path.resolve(__dirname,'../../frontend/public/companion');
const scope='https://preview.example/companion/';
function setup(missing){
  const stored=new Map(),events={};
  let active=false;
  const cache={
    async addAll(requests){
      const files=requests.map(request=>{
        const name=request.url.slice(scope.length);
        if(name===missing)throw Error('missing '+name);
        return [request.url,new Response(fs.readFileSync(path.join(dir,name)))];
      });
      files.forEach(([name,value])=>stored.set(name,value));
    },
    async match(name){return stored.get(name)?.clone()}
  };
  const self={registration:{scope},addEventListener:(name,fn)=>events[name]=fn,skipWaiting:()=>{active=true},clients:{claim(){}}};
  const registry=fs.readFileSync(path.join(dir,'approved-tracks.js'),'utf8').replace('export const ','const ');
  const sw=fs.readFileSync(path.join(dir,'offline.js'),'utf8').replace("import {approvedRecordings} from './approved-tracks.js';",registry);
  vm.runInNewContext(sw,{URL,Request,Response,self,caches:{open:async()=>cache},fetch:()=>{throw Error('offline')}});
  const install=()=>new Promise((resolve,reject)=>events.install({waitUntil:promise=>promise.then(resolve,reject)}));
  const get=(name,headers)=>new Promise(resolve=>events.fetch({request:new Request(scope+name,{headers}),respondWith:resolve}));
  return {install,get,stored,isActive:()=>active};
}
test('offline cold entry, scripts, styles, image and ranged media resolve without network',async()=>{
  const worker=setup();
  await worker.install();assert.ok(worker.isActive());
  assert.match(await (await worker.get('')).text(),/guide.js/);
  for(const url of worker.stored.keys())assert.ok((await worker.get(url.slice(scope.length))).ok);
  for(const lang of ['ar','en']){
    const response=await worker.get('audio/navigation-'+lang+'.mp3',{Range:'bytes=0-1'});
    assert.equal(response.status,206);assert.equal((await response.arrayBuffer()).byteLength,2);
  }
});
test('missing required file prevents offline activation',async()=>{
  const worker=setup('content.js');await assert.rejects(worker.install());assert.equal(worker.isActive(),false);
});
