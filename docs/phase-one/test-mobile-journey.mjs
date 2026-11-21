import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const path=new URL('../../frontend/public/companion/',import.meta.url);
const source=await readFile(new URL('guide.js',path),'utf8');
const style=await readFile(new URL('style.css',path),'utf8');
const start=source.indexOf('function journey(m){'),end=source.indexOf('function help(){');
assert.ok(start>=0 && end>start,'journey source must be inspectable');
const factory=new Function('ctx',
  'const {state,stages,localized,modeName,t,btn,link,back,saiProgressHtml,worshipGuide,localReviewContent,refs,answered,feedback,archiveCompleted}=ctx;\n'
  +source.slice(start,end)+';return journey;'
);
const ids=['ihram','miqat','talbiyah','haram','tawaf','sai','complete'];
function render(mode,step,count) {
  const state={
    lang:'en',
    live:{step,done:false,paused:false,tawaf:count,sai:count},
    practice:{step,done:false,paused:false,tawaf:count,sai:count}
  };
  const stages=ids.map(id=>({id,sources:[],en:{
    title:'Stage '+id,body:'Guidance',question:'Question?',answers:['Yes','No']
  }}));
  const btn=(a,l,cl='',disabled=false)=>
    '<button data-act="'+a+'"'+(disabled?' disabled':'')+'>'+l+'</button>';
  const ctx={
    state,stages,localized:s=>s.en,modeName:x=>x,t:(en,ar)=>en,btn,
    link:()=>'<a href="#help">Help</a>',back:()=>'<button>Back</button>',
    saiProgressHtml:()=>'<div>Sa’i route</div>',
    worshipGuide:()=>'<div>Arabic Pronunciation Meaning Listen Source</div>',
    localReviewContent:()=>undefined,refs:()=>'',answered:true,feedback:'',
    archiveCompleted:()=>{}
  };
  return factory(ctx)(mode);
}
const count=(text,needle)=>(text.match(new RegExp(needle,'g'))||[]).length;
test('Every seven-stage journey has exactly one visible Back/Next pair',()=>{
  for(const mode of ['live','practice'])for(let step=0;step<7;step++)for(const completed of [0,7]){
    const html=render(mode,step,completed);
    assert.equal(count(html,'class="journey-navigation"'),1,mode+': '+step);
    assert.equal(count(html,'data-act="next"'),1,mode+': '+step);
    assert.equal(count(html,'data-act="jump-to-controls"'),1,mode+': '+step);
    assert.equal(count(html,'data-act="pause"'),1,mode+': '+step);
    assert.match(html,/Arabic Pronunciation Meaning Listen Source/);
  }
});
test('Next stays disabled until all seven Tawaf or Sa’i trips recorded',()=>{
  for(const step of [4,5]){
    assert.match(render('live',step,0),/data-act="next" disabled/);
    assert.doesNotMatch(render('live',step,7),/data-act="next" disabled/);
  }
});
test('Large counter is never sticky over worship text on iPhone',()=>{
  assert.match(style,/\.live-counter\{position:relative;/);
  assert.doesNotMatch(style,/\.live-counter\{position:sticky;/);
  assert.doesNotMatch(style,/\.live-counter\{top:0/);
});
test('Help does not repeat Find My Family and Find My Gate tiles',()=>{
  const start=source.indexOf('function help(){'),end=source.indexOf('function results(q){');
  assert.ok(start>=0&&end>start);
  assert.doesNotMatch(source.slice(start,end),/help-gps-shortcuts|mapTiles\(\)/);
});
