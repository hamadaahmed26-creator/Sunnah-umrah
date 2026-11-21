// The review bundle writer replaces review-packs.js only in its temporary
// local output. Public previews contain just the existing source languages.
import { reviewPacks } from './review-packs.js';

export const languages = Object.freeze({
  ar:{name:'العربية',dir:'rtl'}, en:{name:'English',dir:'ltr'},
  ur:{name:'اردو',dir:'rtl'}, id:{name:'Bahasa Indonesia',dir:'ltr'},
  fa:{name:'فارسی',dir:'rtl'}, so:{name:'Soomaali',dir:'ltr'},
  fr:{name:'Français',dir:'ltr'}, es:{name:'Español',dir:'ltr'},
  it:{name:'Italiano',dir:'ltr'}, pt:{name:'Português',dir:'ltr'}
});

const sourceLanguages = new Set(['ar','en']);
const localHost = () => ['localhost','127.0.0.1','[::1]'].includes(globalThis.location?.hostname);
export const isTranslationReview=() => Object.keys(reviewPacks).length>0 &&
  (localHost() || (globalThis.location?.origin==='https://sunnah-umrah-pilgrim-preview.tastygrebe11.chatgpt.site' &&
   globalThis.location.pathname.startsWith('/language-review/')));
export function progressStorageKey(){
  return isTranslationReview()?'sunnah-umrah.translation-review.v1':'sunnah-umrah.companion.v1';
}
export function visibleLanguages(){
  return Object.keys(languages).filter(code =>
    sourceLanguages.has(code) || (isTranslationReview() && Object.hasOwn(reviewPacks,code))
  );
}
export function normalizeLocale(code){
  return visibleLanguages().includes(code) ? code : 'en';
}
export function localeDirection(code){
  return languages[code]?.dir || 'ltr';
}
export function translate(code,en,ar){
  if(code==='ar')return ar ?? en;
  if(code==='en')return en;
  return isTranslationReview() ? reviewPacks[code]?.interface[en] ?? en : en;
}
export function localReviewContent(code,section,id){
  if(!isTranslationReview())return undefined;
  return reviewPacks[code]?.[section]?.[id];
}
