// Run against the dedicated private Sites checkout only.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(process.argv[2]);
const config=JSON.parse(await fs.readFile(path.join(site,'.openai/hosting.json')));
if(config.project_id!=='appgprj_6affb34feee481918953703bf39b25e7')throw Error('Incorrect preview project');
// Verify the release manifest before creating a deployable Worker.
const {execFileSync}=await import('node:child_process');
execFileSync(process.execPath,[path.resolve(here,'../../docs/phase-one/recordings/build-approved.mjs')],{stdio:'inherit'});
const root=path.resolve(here,'../../frontend/public/companion');
const files={};
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css',jpg:'image/jpeg',json:'application/json',mp3:'audio/mpeg',oga:'audio/ogg',ogg:'audio/ogg',m4a:'audio/mp4',wav:'audio/wav',txt:'text/plain'};
for(const file of await fs.readdir(root,{recursive:true})){
 if(!(await fs.stat(path.join(root,file))).isFile())continue;
 files['/'+file]=[types[file.split('.').pop()]||'text/plain',(await fs.readFile(path.join(root,file))).toString('base64')];
}
// The owner-private review routes are bundled only in this dedicated QA Worker.
const candidates=path.resolve(here,'../../docs/phase-one/recordings/review/opendua');
for(const name of await fs.readdir(candidates)){
 if(name==='index.html'||name.endsWith('.mp3')){
   files['/recording-review/'+name]=[types[name.split('.').pop()],(await fs.readFile(path.join(candidates,name))).toString('base64')];
 }
}
const reviewDir=execFileSync(process.execPath,[path.resolve(here,'../../frontend/scripts/build-language-review.mjs')],{encoding:'utf8'}).trim();
try{
 for(const name of ['locales/review-packs.js','offline.js']){
   files['/language-review/'+name]=[types.js,(await fs.readFile(path.join(reviewDir,name))).toString('base64')];
 }
}finally{await fs.rm(reviewDir,{recursive:true,force:true})}
const staticHelper=await fs.readFile(path.join(here,'static-response.mjs'),'utf8');
const api=await fs.readFile(path.join(here,'api.mjs'),'utf8');
const entry=path.join(site,'dist/server');
await fs.mkdir(entry,{recursive:true});
await fs.writeFile(path.join(entry,'index.js'),api+'\n'+staticHelper+'\nconst files='+JSON.stringify(files)+`;
export default {async fetch(request,env){
 const pathname=new URL(request.url).pathname;
 if(pathname.startsWith('/api/family/')){
   try{return await familyAPI(request,env.DB)}catch{return Response.json({error:'Family service temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}
 }
 if(pathname==='/language-review'||pathname==='/recording-review'){
   const target=new URL(request.url);target.pathname+='/';return Response.redirect(target.href,307);
 }
 const review=pathname.startsWith('/language-review/');
 const file=pathname.endsWith('/')?pathname+'index.html':pathname;
 const item=files[file]||(review?files[file.slice('/language-review'.length)]:undefined);
 if(!Array.isArray(item))return new Response(null,{status:404});
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});
 return staticResponse(request,item[0],item[1]);
}};
`);
await fs.cp(path.join(here,'drizzle'),path.join(site,'drizzle'),{recursive:true});
delete config.static;config.d1='DB';
await fs.writeFile(path.join(site,'.openai/hosting.json'),JSON.stringify(config,null,2)+'\n');
