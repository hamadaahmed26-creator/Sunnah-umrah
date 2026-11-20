import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPlayer } from '../../frontend/public/companion/audio.js';
class Media extends EventTarget {
  paused = true;
  currentTime = 0;
  ended = false;
  async play() { this.paused = false; }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
  removeAttribute() { delete this.src; }
  load() {}
}
test('controls select, pause, resume, replay, switch, end and stop exactly one active audio source', async () => {
  const nodes = [];
  const player = createPlayer(() => { const n = new Media(); nodes.push(n); return n; });
  const statuses = [];
  const unsubscribe = player.subscribe(({status}) => statuses.push(status));
  assert.equal(await player.play('navigation-en'), true);
  nodes[0].currentTime = 4;
  player.pause();
  assert.equal(player.state.status, 'paused');
  await player.play('navigation-en');
  assert.equal(nodes[0].currentTime, 4);
  await player.replay();
  assert.equal(nodes[0].currentTime, 0);
  await player.play('navigation-ar');
  assert.equal(nodes[0].paused, true);
  assert.equal(nodes[0].src, undefined);
  nodes[0].dispatchEvent(new Event('error'));
  assert.equal(player.state.status, 'playing');
  nodes[1].ended = true;
  nodes[1].dispatchEvent(new Event('ended'));
  assert.equal(player.state.status, 'ended');
  assert.equal(await player.play('talbiyah_full'), false);
  player.stop();
  assert.equal(player.state.id, null);
  assert.ok(statuses.includes('loading'));
  unsubscribe();
});
test('permission denied and decode errors surface and can be retried', async () => {
  const n = new Media();
  const player = createPlayer(() => n);
  n.play = async () => {throw new DOMException('Requires gesture', 'NotAllowedError');};
  assert.equal(await player.play('navigation-en'), false);
  assert.equal(player.state.status, 'blocked');
  delete n.play;
  await player.play('navigation-en');
  n.dispatchEvent(new Event('error'));
  assert.equal(player.state.status, 'error');
  assert.equal(await player.play('navigation-en'), true);
});
test('late play settlement cannot overwrite paused or replaced audio', async () => {
  let finish;
  const player = createPlayer(() => {
    const n = new Media();
    n.play = () => new Promise(resolve => {finish=resolve;});
    return n;
  });
  const pending = player.play('navigation-en');
  player.pause();
  finish();
  assert.equal(await pending, false);
  assert.equal(player.state.status, 'paused');
});
