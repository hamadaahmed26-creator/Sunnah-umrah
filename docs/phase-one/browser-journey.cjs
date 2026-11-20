// Run with Playwright installed and CHROMIUM_PATH pointing to a Chromium binary.
// Exercises the preview artifact on localhost, including a real service worker.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const root=path.resolve(__dirname,'../../frontend/public/companion');
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.mp3':'audio/mpeg','.jpg':'image/jpeg'};
async function run(){
 const server=http.createServer(async(req,res)=>{
   const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   const file=path.resolve(root,name);
   if(!file.startsWith(root+path.sep)){res.writeHead(400).end();return;}
   try{const data=await fs.readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);}
   catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
   browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true});
   const context=await browser.newContext({viewport:{width:390,height:844}});
   const page=await context.newPage(), errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   const base='http://127.0.0.1:'+server.address().port;
   await page.goto(base+'/#live');
   const act=name=>page.locator('[data-act="'+name+'"]').click();
   for(let i=0;i<4;i++)await act('next');
   await act('count');await act('count');await act('undo');await act('pause');
   await page.reload();await act('resume');
   assert.match(await page.locator('.counter strong').innerText(),/1 \/ 7/);
   await page.locator('#guide-language').selectOption('ar');
   for(let i=1;i<7;i++)await act('count');
   await act('next');
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   await context.setOffline(true);
   await page.reload();await page.locator('.counter').waitFor();
   for(let i=0;i<7;i++)await act('count');
   await act('next');await act('next');
   await page.locator('details summary').click();await act('reset');
   await page.locator('a.brand').click();
   assert.match(await page.locator('.history').innerText(),/1/);
   await context.setOffline(false);
   await page.goto(base+'/#makkah');
   assert.equal(await page.locator('iframe').count(),0);
   await context.setOffline(true);
   await page.locator('#watch').click();
   assert.match(await page.locator('#stream-status').innerText(),/الإنترنت/);
   assert.equal(await page.locator('iframe').count(),0);
   assert.deepEqual(errors,[]);
   console.log('Chromium 390×844: counter correction, pause/reload, English to Arabic, offline reload, seven Sa’i trips, finish/reset/history and offline broadcast handling passed.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(err=>{console.error(err);process.exitCode=1;});
