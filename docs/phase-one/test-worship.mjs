import assert from 'node:assert/strict';
import {test} from 'node:test';
import {worshipGuide} from '../../frontend/public/companion/worship.js';
for(const lang of ['en','ar']){
  test(lang+' · both corners and source audio during Tawaf, prayer at seven',()=>{
    for(let n=0;n<7;n++){
      const html=worshipGuide('tawaf',n,lang);
      assert.match(html,/1285\//);assert.match(html,/1287\//);assert.match(html,/رَبَّنَا/);
    }
    assert.match(worshipGuide('talbiyah',0,lang),/1284\//);
    assert.match(worshipGuide('tawaf',7,lang),/Maqam Ibrahim|مقام إبراهيم/);
  });
  test(lang+' · first approach only, alternating destinations, final Marwah',()=>{
    for(let n=0;n<=7;n++){
      const html=worshipGuide('sai',n,lang);
      assert.equal(html.includes('أَبْدَأُ'),n===0);
      if(n<7)assert.ok(html.includes(n%2?(lang==='en'?'At Marwah':'عند المروة'):(lang==='en'?'At Safa':'عند الصفا')));
      else assert.match(html,/last time|نهاية السعي/);
      assert.match(html,/وَهَزَمَ الْأَحْزَابَ وَحْدَهُ/);
      assert.match(html,/1289\//);
    }
  });
}
