import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {languages,visibleLanguages,translate,normalizeLocale,localeDirection} from '../../frontend/public/companion/locales/languages.js';
test('release registry and text direction',()=>{
  assert.equal(Object.keys(languages).length,10);
  assert.deepEqual(visibleLanguages(),['ar','en']);
  assert.equal(normalizeLocale('ur'),'en');
  assert.deepEqual(Object.keys(languages).filter(code=>localeDirection(code)==='rtl'),['ar','ur','fa']);
  assert.equal(translate('ar','Home','الرئيسية'),'الرئيسية');
});
test('draft UI catalogues cover the bilingual guide interface',async()=>{
  const get=file=>readFile(new URL(file,import.meta.url),'utf8');
  const source=await get('../../frontend/public/companion/guide.js');
  const labels=[...source.matchAll(/\bt\('([^']*)','[^']*'\)/g)].map(match=>match[1]);
  for(const code of Object.keys(languages).filter(code=>!['ar','en'].includes(code))){
    const pack=JSON.parse(await get('../../frontend/localization/review/'+code+'.ui.json'));
    assert.equal(pack.status,'unreviewed');
    assert.equal(pack.locale,code);
    for(const label of labels.filter(value=>!['العربية','ar'].includes(value))){
      assert.ok(pack.interface[label]?.trim(),code+' missing '+label);
    }
  }
});
