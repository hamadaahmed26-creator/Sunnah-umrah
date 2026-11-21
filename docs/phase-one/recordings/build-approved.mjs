import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {recitations} from '../../../frontend/public/companion/recitations.js';

const companion = new URL('../../../frontend/public/companion/', import.meta.url);
const output = new URL('approved-tracks.js', companion);

// A sign-off applies to one exact script and file. Replacing either requires review.
export function approvedCatalogue(assets, readMedia) {
  const catalogue = {};
  for (const asset of assets.filter(a => a.religious && a.release_approved)) {
    const topic = asset.topic;
    if (!Object.hasOwn(recitations, topic)) throw Error('Unknown recitation: '+topic);
    if (Object.hasOwn(catalogue, topic)) throw Error('Multiple active recordings for '+topic);
    const fields = ['reader','reviewer','review_date','review_evidence','rights_evidence','attribution'];
    if (!fields.every(key => typeof asset[key] === 'string' && asset[key].trim()) ||
        asset.exact_audio_match_verified !== true || asset.offline_redistribution_confirmed !== true ||
        asset.verified_arabic !== recitations[topic].arabic) throw Error('Missing recording or text sign-off for '+topic);
    const match = /^frontend\/public\/companion\/(audio\/[A-Za-z0-9_-]+\.(?:mp3|m4a|oga|ogg|wav))$/.exec(asset.path);
    if (!match || !/^https:\/\//i.test(asset.rights_evidence)) throw Error('Missing local media or source URL for '+topic);
    const media = readMedia(match[1]);
    if (!media.length || media.length !== asset.bytes || createHash('sha256').update(media).digest('hex') !== asset.sha256) {
      throw Error('Approved bytes differ for '+topic);
    }
    catalogue[topic] = {src:'./'+match[1], attribution:asset.attribution, source:new URL(asset.rights_evidence).href};
  }
  return catalogue;
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const {assets} = JSON.parse(readFileSync(new URL('audio-register.json', import.meta.url)));
  const catalogue = approvedCatalogue(assets, path => readFileSync(new URL(path, companion)));
  const js = '// Generated from the reviewed recording register.\nexport const approvedRecordings = Object.freeze('+JSON.stringify(catalogue, null, 2)+');\n';
  if (process.argv.includes('--write')) writeFileSync(output, js);
  else if (readFileSync(output,'utf8') !== js) throw Error('Rebuild '+fileURLToPath(output)+' with --write');
  console.log(Object.keys(catalogue).length+' approved recordings for Practice, Live and offline playback');
}
