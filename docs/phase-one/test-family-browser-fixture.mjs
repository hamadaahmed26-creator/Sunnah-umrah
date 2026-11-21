// Run: node docs/phase-one/test-family-browser-fixture.mjs /absolute/path/to/family-device-qa
// This creates an isolated disposable local test server for sites-preview.
// Start sites-preview with the generated directory; open /qa-family.html on its origin in two separate tabs.
// 1. Create a group in A, join from B using the invitation, then explicitly enable sharing in both.
// 2. Advance B once; select each other. Both should show 111 m, opposite bearings and the other fix's accuracy.
// 3. Disconnect A with the test switch, advance A twice and B once. A marks B stale, both devices retain the
//    last received peer destination, and A's own accuracy advances to ±13 m despite the connection failure.
// 4. Reconnect A. Without restarting sharing, both pages should receive the new points and show 0 m.
// 5. Disconnect A, stop sharing, then reconnect. B loses A's target and walking link on its next poll.
// 6. Disconnect A and leave. Its family destination and invitation disappear immediately; once reconnected
//    the create-group control returns on A and B reports 'Waiting for another member'.
// Observed all six on 20 November 2026 in desktop Chrome. The Worker, UI, crypto and SQLite transport are
// real. This fixture supplies GPS input and rejects application fetches on disconnect. It cannot exercise a
// phone's permission prompt, physical GPS, radio loss, background suspension, or Safari's storage policy.
// Only /qa-family.html receives simulated sensors. This file is outside the website build.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';

function simulatedDevice(){
  let online=true;
  let step=0;
  let watcher;
  let watchId=0;
  const actualFetch=window.fetch.bind(window);
  Object.defineProperty(navigator,'onLine',{get:()=>online});
  window.fetch=(...args)=>online?actualFetch(...args):Promise.reject(new TypeError('Test connection interrupted'));
  function deliver(){
    watcher?.({timestamp:Date.now(),coords:{latitude:21.422+step*0.001,longitude:39.826,accuracy:11+step}});
  }
  Object.defineProperty(navigator,'geolocation',{value:{
    watchPosition(success){watcher=success;setTimeout(deliver,0);return ++watchId},
    clearWatch(id){if(id===watchId)watcher=null}
  }});
  window.addEventListener('DOMContentLoaded',()=>{
    const panel=document.createElement('fieldset');
    panel.innerHTML='<legend>Test device · simulated GPS and data connection</legend><button id="qa-move">Advance test GPS fix</button> <button id="qa-network">Disconnect test data</button>';
    document.body.prepend(panel);
    panel.querySelector('#qa-move').onclick=()=>{step++;deliver()};
    const toggle=panel.querySelector('#qa-network');
    toggle.onclick=()=>{
      online=!online;
      toggle.textContent=online?'Disconnect test data':'Reconnect test data';
      window.dispatchEvent(new Event(online?'online':'offline'));
    };
  });
}

async function build(destination){
  const target=path.resolve(destination);
  if(path.basename(target)!=='family-device-qa')throw Error('Use a disposable directory named family-device-qa');
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  await fs.mkdir(target,{recursive:false});
  await fs.mkdir(path.join(target,'.openai'));
  await fs.writeFile(path.join(target,'.openai/hosting.json'),JSON.stringify({project_id:'appgprj_6affb34feee481918953703bf39b25e7',d1:'DB'}));
  execFileSync(process.execPath,[path.join(root,'preview/family/build-preview.mjs'),target]);
  await fs.copyFile(path.join(root,'preview/family/local-db.mjs'),path.join(target,'local-db.mjs'));
  await fs.copyFile(path.join(root,'preview/family/local-server.mjs'),path.join(target,'local-server.mjs'));
  const fixture='('+simulatedDevice.toString()+')();';
  // Ordinary app routes and /api/family requests go to the unmodified preview Worker.
  const wrapper=`import app from './dist/server/index.js';
export default { async fetch(req,env){
  const url=new URL(req.url);
  if(url.pathname==='/qa-sensors.js')return new Response(${JSON.stringify(fixture)},{headers:{'Content-Type':'text/javascript'}});
  if(url.pathname==='/qa-family-module.js'){url.pathname='/family.js';return app.fetch(new Request(url,req),env)}
  if(url.pathname!=='/qa-family.html')return app.fetch(req,env);
  url.pathname='/family.html';
  const page=await app.fetch(new Request(url,req),env);
  const text=(await page.text()).replace('./family.js','./qa-family-module.js').replace('</head>','<script src="/qa-sensors.js"></script></head>');
  return new Response(text,{headers:{'Content-Type':'text/html;charset=utf-8'}});
}};`;
  await fs.writeFile(path.join(target,'qa-worker.mjs'),wrapper);
  const serverPath=path.join(target,'local-server.mjs');
  const server=(await fs.readFile(serverPath,'utf8')).replace("'./dist/server/index.js'","'./qa-worker.mjs'");
  await fs.writeFile(serverPath,server);
  await fs.writeFile(path.join(target,'package.json'),JSON.stringify({type:'module',scripts:{dev:'node local-server.mjs'}}));
}
if(process.argv[2]){
 await build(process.argv[2]);
}else if(process.env.NODE_TEST_CONTEXT){
 const {test}=await import('node:test');
 const assert=(await import('node:assert/strict')).default;
 test('synthetic sensors exist only on the disposable QA route',async t=>{
  const temp=await fs.mkdtemp(path.join(tmpdir(),'sunnah-family-test-'));
  t.after(()=>fs.rm(temp,{recursive:true,force:true}));
  const target=path.join(temp,'family-device-qa');
  await build(target);
  const worker=(await import(pathToFileURL(path.join(target,'qa-worker.mjs')))).default;
  const production=(await import(pathToFileURL(path.join(target,'dist/server/index.js')))).default;
  const request=route=>new Request('https://preview.example/'+route);
  assert.doesNotMatch(await (await worker.fetch(request('family.html'),{})).text(),/qa-sensors/);
  assert.match(await (await worker.fetch(request('qa-family.html'),{})).text(),/qa-sensors/);
  // Verify recording routes from the deployable Worker, including Safari-style ranges.
  const inventory=JSON.parse(await fs.readFile(new URL('./recordings/review/opendua/candidates.json',import.meta.url)));
  const {createHash}=await import('node:crypto');
  for(const row of inventory.recordings){
    const url=request('recording-review/'+row.file);
    const complete=await production.fetch(url,{});
    assert.equal(complete.status,200);
    assert.equal(createHash('sha256').update(Buffer.from(await complete.arrayBuffer())).digest('hex'),row.sha256);
    const start=await production.fetch(new Request(url,{headers:{Range:'bytes=0-1'}}),{});
    assert.equal(start.status,206);
    assert.equal(start.headers.get('content-range'),'bytes 0-1/'+row.bytes);
    assert.equal((await start.arrayBuffer()).byteLength,2);
  }
  const ordinary=await production.fetch(request('locales/review-packs.js'),{});
  assert.match(await ordinary.text(),/Object.freeze\(\{\}\)/);
  const review=await production.fetch(request('language-review/locales/review-packs.js'),{});
  const module=await import('data:text/javascript;base64,'+Buffer.from(await review.text()).toString('base64'));
  assert.equal(Object.keys(module.reviewPacks).length,8);
  assert.equal((await production.fetch(request('qa-family.html'),{})).status,404);
  assert.equal((await production.fetch(request('qa-sensors.js'),{})).status,404);
 });
}
