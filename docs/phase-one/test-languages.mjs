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

test('the local review build renders all eight readings alongside their Arabic and meaning', async t => {
  const {execFileSync} = await import('node:child_process');
  const {pathToFileURL, fileURLToPath} = await import('node:url');
  const {rm} = await import('node:fs/promises');
  const {recitations} = await import('../../frontend/public/companion/recitations.js');
  const {reviewPacks: servedPacks} = await import('../../frontend/public/companion/locales/review-packs.js');
  const build = fileURLToPath(new URL('../../frontend/scripts/build-language-review.mjs', import.meta.url));
  const output = execFileSync(process.execPath, [build], {encoding:'utf8'}).trim();
  t.after(() => rm(output, {recursive:true, force:true}));
  const review = pathToFileURL(output + '/');
  const {reviewPacks} = await import(new URL('locales/review-packs.js', review));
  const {worshipGuide} = await import(new URL('worship.js', review));
  const stageFor = {miqat:'miqat', talbiyah:'talbiyah', haram:'haram', stone:'tawaf', corner:'tawaf',
    opening:'sai', begin:'sai', hill:'sai'};

  assert.deepEqual(Object.keys(servedPacks), []);
  assert.deepEqual(Object.keys(reviewPacks).sort(), ['es','fa','fr','id','it','pt','so','ur']);
  for (const [code, pack] of Object.entries(reviewPacks)) {
    assert.deepEqual(Object.keys(pack.recitations).sort(), Object.keys(recitations).sort());
    const note = pack.interface['A reading aid. Arabic sounds may differ.'];
    assert.ok(note?.trim(), code);
    for (const [id, source] of Object.entries(recitations)) {
      const variant = pack.recitations[id];
      assert.ok(variant.meaning?.trim(), code + '/' + id);
      assert.ok(variant.pronunciation?.trim(), code + '/' + id);
      if (['ur','fa'].includes(code)) assert.match(variant.pronunciation, /\p{Script=Arabic}/u);
      for (const compact of [false, true]) {
        const html = worshipGuide(stageFor[id], 0, code, {compact, local:pack, translate:en=>pack.interface[en]??en});
        for (const expected of [source.arabic, variant.pronunciation, variant.meaning, note]) {
          assert.ok(html.includes(expected), code + '/' + id + ' failed to render ' + expected);
        }
      }
    }
  }
});
