// Only approved navigation prompts belong here. Religious recordings require
// a human recitation review and permission for redistribution before inclusion.
export const approvedReligiousTracks = Object.freeze({});
const tracks = Object.freeze({
  ...approvedReligiousTracks,
  'navigation-en': './audio/navigation-en.mp3',
  'navigation-ar': './audio/navigation-ar.mp3',
});

export const audioAssets = Object.freeze(Object.values(tracks));
export function createPlayer(makeAudio = () => new Audio(), availableTracks = tracks) {
  let media = null;
  let attempt = 0;
  let state = { id: null, status: 'idle' };
  const listeners = new Set();

  function emit(status, id = state.id) {
    if (status === state.status && id === state.id) return;
    state = { id, status };
    for (const listener of listeners) listener({ ...state });
  }

  function stop() {
    attempt++;
    const old = media;
    media = null;
    if (old) {
      old.pause();
      old.removeAttribute('src');
      old.load();
    }
    emit('idle', null);
  }

  function prepare(id) {
    const node = makeAudio();
    media = node;
    const sync = (event, status, check = () => true) => {
      node.addEventListener(event, () => {
        if (media === node && check()) emit(status, id);
      });
    };
    sync('waiting', 'loading', () => !node.paused);
    sync('playing', 'playing', () => !node.paused);
    sync('pause', 'paused', () => node.paused && !node.ended && !node.error);
    sync('ended', 'ended', () => node.ended);
    sync('error', 'error');
    node.preload = 'auto';
    node.src = new URL(availableTracks[id], import.meta.url).href;
    return node;
  }

  async function play(id = state.id, fromStart = false) {
    if (!Object.hasOwn(availableTracks, id)) return false;
    if (id !== state.id || state.status === 'error') stop();
    const request = ++attempt;
    let node;
    try {
      node = media || prepare(id);
      if (fromStart || node.ended) node.currentTime = 0;
      emit('loading', id);
      await node.play();
      if (request !== attempt || media !== node) return false;
      if (!node.paused && !node.ended) emit('playing', id);
      return true;
    } catch (error) {
      if (request === attempt) {
        emit(error.name === 'NotAllowedError' ? 'blocked' : 'error', id);
      }
      return false;
    }
  }

  function pause() {
    if (!media || !['loading', 'playing'].includes(state.status)) return;
    attempt++;
    media.pause();
    emit('paused');
  }

  return {
    play, pause, stop,
    replay: (id = state.id) => play(id, true),
    get state() { return { ...state }; },
    subscribe(listener) {
      listeners.add(listener);
      listener({ ...state });
      return () => listeners.delete(listener);
    },
  };
}
export const audio = createPlayer();
