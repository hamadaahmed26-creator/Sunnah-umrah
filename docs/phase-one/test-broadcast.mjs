import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mediaPanel, wireMedia} from '../../frontend/public/companion/live-media.js';

class Element extends EventTarget {
  textContent = '';
  firstElementChild = null;
  append(child) { this.firstElementChild = child; }
  replaceChildren() { this.firstElementChild = null; }
  style = {};
  click() { this.dispatchEvent(new Event('click')); }
}

test('broadcast controls wait for consent, release inactive streams, and recover after interruption', async t => {
  const elements = Object.fromEntries(['#screen','#watch','#radio','#radio-status','#stream-status','link'].map(id => [id, new Element()]));
  const root = {querySelector: id => elements[id], querySelectorAll: () => [elements.link]};
  const win = new EventTarget(), audios = [], players = [];
  class Radio extends EventTarget {
    constructor() { super(); audios.push(this); }
    play() { return Promise.resolve(); }
    pause() { this.dispatchEvent(new Event('pause')); }
    removeAttribute() { this.src = ''; }
    load() { this.released = true; }
  }
  win.YT = {PlayerState:{PLAYING:1, ENDED:0}, Player:class {
    constructor(frame, options) { this.frame = frame; this.events = options.events; players.push(this); }
    destroy() { this.destroyed = true; }
  }};
  let cleanup;
  t.after(() => cleanup?.());
  for (const [key,value] of Object.entries({window:win, document:{createElement:() => new Element()}, location:{origin:'https://unit.invalid'}, Audio:Radio,navigator:{onLine:true}})) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, {configurable:true, value});
    t.after(() => { if (descriptor) Object.defineProperty(globalThis,key,descriptor); else delete globalThis[key]; });
  }
  const tr = en => en;
  let worshipStops = 0;
  cleanup = wireMedia(root, tr, () => worshipStops++);
  assert.doesNotMatch(mediaPanel(tr), /<(iframe|audio|script)\b/i);
  assert.equal(audios.length + players.length, 0);
  elements['#radio'].click();
  const first = audios[0];
  assert.match(first.src, /https:\/\/backup\.qurango\.net\/radio\/abdulbasit_abdulsamad$/);
  assert.match(elements['#radio-status'].textContent, /Connecting/);
  first.dispatchEvent(new Event('playing'));
  assert.match(elements['#radio-status'].textContent, /Playing/);

  elements['#watch'].click();
  await Promise.resolve();
  assert.equal(first.released, true);
  const firstVideo = players[0];
  assert.equal(firstVideo.frame.allowFullscreen, true);
  assert.match(firstVideo.frame.src, /youtube-nocookie\.com/);
  firstVideo.events.onReady();
  assert.match(elements['#stream-status'].textContent, /Press Play/);
  firstVideo.events.onStateChange({data:1});
  assert.equal(elements['#stream-status'].textContent, '');
  firstVideo.events.onError({data:101});
  assert.match(elements['#stream-status'].textContent, /official channel/);
  assert.equal(firstVideo.destroyed, true);
  first.dispatchEvent(new Event('error'));
  assert.equal(elements['#radio-status'].textContent, '');

  elements['#radio'].click();
  audios[1].dispatchEvent(new Event('error'));
  assert.match(elements['#radio-status'].textContent, /Retry/);
  elements['#radio'].click();
  navigator.onLine = false;
  win.dispatchEvent(new Event('offline'));
  assert.equal(audios[2].released, true);
  assert.match(elements['#radio-status'].textContent, /Connection lost/);
  elements['#radio'].click();
  assert.equal(audios.length, 3);
  assert.match(elements['#radio-status'].textContent, /Connect/);
  navigator.onLine = true;
  elements['#radio'].click();
  assert.equal(audios.length, 4);
  elements['#radio'].click();
  assert.equal(audios[3].released, true);
  assert.equal(elements['#radio'].textContent, 'Play Qur’an radio');
  elements['#radio'].click();
  elements.link.click();
  assert.equal(audios[4].released, true);
  assert.ok(worshipStops >= 5);
});
