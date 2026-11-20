// Run against the dedicated private Sites checkout only.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const site=path.resolve(process.argv[2]);
const config=JSON.parse(await fs.readFile(path.join(site,'.openai/hosting.json')));
if(config.project_id!=='appgprj_6affb34feee481918953703bf39b25e7')throw Error('Incorrect preview project');
const root=path.resolve(here,'../../frontend/public/companion');
const files={};
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css',jpg:'image/jpeg',json:'application/json',mp3:'audio/mpeg',txt:'text/plain'};
for(const file of await fs.readdir(root,{recursive:true})){
 if(!(await fs.stat(path.join(root,file))).isFile())continue;
 files['/'+file]=[types[file.split('.').pop()]||'text/plain',(await fs.readFile(path.join(root,file))).toString('base64')];
}
const api=await fs.readFile(path.join(here,'api.mjs'),'utf8');
const entry=path.join(site,'dist/server');
await fs.mkdir(entry,{recursive:true});
await fs.writeFile(path.join(entry,'index.js'),api+'\nconst files='+JSON.stringify(files)+`;
export default {async fetch(request,env){
 const pathname=new URL(request.url).pathname;
 if(pathname.startsWith('/api/family/')){
   try{return await familyAPI(request,env.DB)}catch{return Response.json({error:'Family service temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}
 }
 const item=files[pathname==='/'?'/index.html':pathname];
 if(!Array.isArray(item))return new Response(null,{status:404});
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});
 return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(item[1]),v=>v.charCodeAt(0)),{headers:{'Content-Type':item[0],'Cache-Control':'no-cache','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
}};
`);
await fs.cp(path.join(here,'drizzle'),path.join(site,'drizzle'),{recursive:true});
delete config.static;config.d1='DB';
await fs.writeFile(path.join(site,'.openai/hosting.json'),JSON.stringify(config,null,2)+'\n');
