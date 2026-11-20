// Usage: node frontend/scripts/build-language-review.mjs
// The local output includes draft religious translations and must stay private.
import {mkdtemp,cp,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const frontend=fileURLToPath(new URL('../',import.meta.url));
const source=join(frontend,'public','companion');
const drafts=join(frontend,'localization','review');
const output=await mkdtemp(join(tmpdir(),'umrah-locale-review-'));
const packs={};
const locales=['ur','id','fa','so','fr','es','it','pt'];
for(const locale of locales){
  const ui=JSON.parse(await readFile(join(drafts,locale+'.ui.json'),'utf8'));
  const religious=JSON.parse(await readFile(join(drafts,locale+'.json'),'utf8'));
  if(ui.locale!==locale || religious.locale!==locale || !ui.interface || !religious.stages || !religious.help || !religious.recitations){
    throw Error('Incomplete review source: '+locale);
  }
  packs[locale]={interface:ui.interface,stages:religious.stages,help:religious.help,recitations:religious.recitations};
}
await cp(source,output,{recursive:true});
const payload=JSON.stringify(packs);
await writeFile(join(output,'locales','review-packs.js'),'export const reviewPacks='+payload+';\n');
const digest=createHash('sha256').update(payload).digest('hex').slice(0,12);
const worker=join(output,'offline.js');
const sourceWorker=await readFile(worker,'utf8');
await writeFile(worker,sourceWorker.replace('pilgrim-companion-','pilgrim-review-'+digest+'-'));
console.log(output);
