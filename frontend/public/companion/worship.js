// Text for the precise points described in Jabir's report (Muslim 1218a).
// The English meanings and reading aids are separate from the Arabic wording.
const cards = {
  stone: {
    title:['In line with the Black Stone','عند محاذاة الحجر الأسود'],
    arabic:'اللَّهُ أَكْبَرُ',
    reading:'Allāhu akbar.',
    meaning:'Allah is the Greatest.',
    source:'https://sunnah.com/bukhari:1613', reference:['Bukhari 1613','البخاري ١٦١٣']
  },
  corner: {
    title:['From the Yemeni Corner to the Black Stone','بين الركن اليماني والحجر الأسود'],
    arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    reading:'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār.',
    meaning:'Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source:'https://sunnah.com/abudawud:1892', reference:['Abu Dawud 1892 · Qur’an 2:201','أبو داود ١٨٩٢ · البقرة ٢٠١']
  },
  opening: {
    title:['As you approach Safa for the first time','عند الاقتراب من الصفا أول مرة'],
    arabic:'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
    reading:'Innaṣ-Ṣafā wal-Marwata min shaʿāʾirillāh.',
    meaning:'Indeed, Safa and Marwah are among the sacred symbols of Allah.',
    source:'https://quran.com/2/158',reference:['Opening of Qur’an 2:158','أول الآية ١٥٨ من سورة البقرة']
  },
  begin: {
    title:['Then say','ثم قل'],
    arabic:'أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
    reading:'Abdaʾu bimā badaʾa Allāhu bih.',
    meaning:'I begin with what Allah began with.',
    source:'https://sunnah.com/muslim:1218a',reference:['Muslim 1218a','مسلم ١٢١٨']
  },
  hill: {
    title:['Remembrance on the hill','الذكر على الصفا والمروة'],
    arabic:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
    reading:'Lā ilāha illallāhu waḥdahu lā sharīka lah. Lahul-mulku wa lahul-ḥamd, wa huwa ʿalā kulli shayʾin qadīr. Lā ilāha illallāhu waḥdah. Anjaza waʿdah, wa naṣara ʿabdah, wa hazamal-aḥzāba waḥdah.',
    meaning:'Allah alone deserves worship and has no partner. All dominion and praise belong to Him, and He has power over everything. Allah alone deserves worship. He fulfilled His promise, gave victory to His servant and defeated the confederates alone.',
    source:'https://sunnah.com/muslim:1218a',reference:['Muslim 1218a · Jabir’s account','مسلم ١٢١٨ · حديث جابر']
  }
};
export function worshipGuide(stage,count,lang){
  const i=lang==='ar'?1:0;
  const say=(en,ar)=>i?ar:en;
  const recording=(lesson,en,ar)=>`<p class="recording"><a href="https://binwahaf.com/ar/audio-book-lesson/${lesson}/" target="_blank" rel="noopener" data-publisher-audio>${say(en,ar)}</a><small>${say('Hisn al-Muslim · publisher’s audio player · internet required','حصن المسلم · مشغّل الناشر · يتطلّب اتصالاً بالإنترنت')}</small></p>`;
  const lesson={
    stone:()=>recording(1285,'Listen to the Black Stone narration','استمع إلى حديث التكبير عند الحجر الأسود'),
    corner:()=>recording(1287,'Listen to the dua between the corners','استمع إلى الدعاء بين الركنين'),
    hill:()=>recording(1289,'Listen to the full Safa and Marwah narration','استمع إلى حديث الذكر على الصفا والمروة')
  };
  if(stage==='talbiyah')return `<p class="reading" dir="ltr" lang="en">${i?'':'Labbayka Allāhumma labbayk. Labbayka lā sharīka laka labbayk. Innal-ḥamda wan-niʿmata laka wal-mulk. Lā sharīka lak.'}</p>${recording(1284,'Listen to the Talbiyah','استمع إلى التلبية')}`;
  if(stage==='haram' && !i)return '<p class="reading">Allāhumma iftaḥ lī abwāba raḥmatik.</p>';
  const card=id=>{
    const c=cards[id];
    return `<section class="recitation"><h3>${c.title[i]}</h3><p class="dua" lang="ar" dir="rtl">${c.arabic}</p>${i?'':`<p class="reading" dir="ltr">${c.reading}</p><p>${c.meaning}</p>`}<a target="_blank" rel="noopener" href="${c.source}">${c.reference[i]}</a>${lesson[id]?.()||''}</section>`;
  };
  if(stage==='tawaf' && count===7)return `<section class="worship"><h2>${say('After your seventh circuit','بعد إتمام الشوط السابع')}</h2><p>${say('Pray two rakʿahs behind Maqam Ibrahim if it is easy. If it is crowded, pray elsewhere in the mosque. When ready, continue to Safa.','صلِّ ركعتين خلف مقام إبراهيم إن تيسّر، وإلا ففي أي مكان من المسجد. ثم توجّه إلى الصفا.')}</p><a href="https://sunnah.com/muslim:1218a" target="_blank" rel="noopener">${say('Muslim 1218a','مسلم ١٢١٨')}</a></section>`;
  if(stage==='tawaf')return `<section class="worship"><h2>${say('What do I say here?','ماذا أقول هنا؟')}</h2>${card('stone')}${card('corner')}<p>${say('During the rest of the circuit, remember Allah or make your own dua. You may use the same supplications on each circuit.','وفي بقية الشوط اذكر الله وادعُ بما تيسّر. ولك أن تكرّر الدعاء نفسه في الأشواط.')}</p></section>`;
  if(stage!=='sai')return '';
  if(count===7)return `<section class="worship"><h2>${say('You have reached Marwah for the last time','وصلتَ إلى المروة في نهاية السعي')}</h2><p>${say('Your seven trips are complete. Scholars differ about repeating the remembrance on this final arrival. Continue to the hair-cutting step.','تمّت الأشواط السبعة. اختلف أهل العلم في تكرار الذكر عند ختام السعي. انتقل إلى خطوة الحلق أو التقصير.')}</p><a target="_blank" rel="noopener" href="https://islamqa.info/en/answers/617842">${say('Read the scholarly discussion','اقرأ أقوال أهل العلم')}</a><details><summary>${say('View the hilltop remembrance','عرض ذكر الصفا والمروة')}</summary>${card('hill')}</details></section>`;
  const hill=count%2?say('At Marwah','عند المروة'):say('At Safa','عند الصفا');
  return `<section class="worship">${count===0?card('opening')+card('begin'):''}<h2>${hill}</h2><p>${say('Face the Qiblah and say Allāhu akbar (اللَّهُ أَكْبَرُ). Say the remembrance below three times, pausing after the first and second times to ask Allah for what you need.','استقبل القبلة وكبّر الله، وقل الذكر الآتي ثلاث مرات، وادعُ بما شئت بين المرة الأولى والثانية وبين الثانية والثالثة.')}</p>${card('hill')}<h3>${say('As you walk','أثناء المشي')}</h3><p>${say('You can make your own dua as you walk. Record this trip when you reach the opposite hill.','ادعُ بما تيسّر أثناء المشي. سجّل الشوط عند الوصول إلى الطرف الآخر.')}</p></section>`;
}
