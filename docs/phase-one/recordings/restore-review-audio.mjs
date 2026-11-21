// Run after cloning the development branch to restore original reviewer-only audio.
import {createHash} from 'node:crypto';
import {readFile,rename,writeFile,rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const dir=new URL('./review/opendua/',import.meta.url);
const {recordings}=JSON.parse(await readFile(new URL('candidates.json',dir),'utf8'));
function matches(data,entry){
  return data.length===entry.bytes && createHash('sha256').update(data).digest('hex')===entry.sha256;
}
for(const entry of recordings){
  const name=entry.file;
  if(!/^OD-[0-9]+(?:-[0-9]+)?\.mp3$/.test(name) ||
     entry.source_url!=='https://audio.opendua.org/hisn/v0.0.2/'+name) throw Error('Invalid source for '+name);
  const target=new URL(name,dir);
  try{
    const existing=await readFile(target);
    if(!matches(existing,entry))throw Error('Existing file differs from the register: '+name);
    console.log('Verified '+name);
    continue;
  }catch(e){if(e.code!=='ENOENT')throw e}
  const response=await fetch(entry.source_url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(name+' publisher HTTP '+response.status);
  const media=Buffer.from(await response.arrayBuffer());
  if(!matches(media,entry))throw Error('Publisher file differs from registered bytes: '+name);
  const temporary=new URL(name+'.'+randomUUID()+'.tmp',dir);
  try{
    await writeFile(temporary,media,{flag:'wx'});
    await rename(temporary,target);
  }finally{await rm(temporary,{force:true})}
  console.log('Restored '+name);
}
