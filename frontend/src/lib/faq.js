// Salafi-vetted FAQ for pilgrims. Sources: Ibn Bāz, Ibn ʿUthaymīn, al-Albānī,
// al-Sharḥ al-Mumtiʿ, Manāsik al-Ḥajj, Fatāwā Nūr ʿalā al-Darb, Bukhārī, Muslim.
// Every answer has a source. If a ruling lacks scholarly backing, it's not here.

export const FAQ_CATEGORIES = [
  {
    id: "ihram",
    name_en: "In the state of Iḥrām",
    name_ar: "في حال الإحرام",
    icon: "🤍",
  },
  {
    id: "mistakes",
    name_en: "If I make a mistake",
    name_ar: "إن أخطأت",
    icon: "🙏",
  },
  {
    id: "women",
    name_en: "For women",
    name_ar: "للنّساء",
    icon: "🌸",
  },
  {
    id: "tawaf",
    name_en: "During Ṭawāf & Saʿī",
    name_ar: "في الطّواف والسّعي",
    icon: "🕋",
  },
  {
    id: "general",
    name_en: "General questions",
    name_ar: "أسئلة عامّة",
    icon: "❓",
  },
];

export const FAQ_ITEMS = [
  // ─── IHRAM STATE ───────────────────────────────────────────
  {
    category: "ihram",
    q_en: "If I break my wuḍū, am I still in Iḥrām?",
    q_ar: "إن انتقض وضوئي، هل لا زلت في الإحرام؟",
    a_en:
      "**Yes — your Iḥrām is intact.** Iḥrām is NOT the same as wuḍū. Just renew your wuḍū before Ṣalāh or before Ṭawāf, then continue as normal.",
    a_ar:
      "**نعم — إحرامك باقٍ.** الإحرام ليس هو الوضوء. فتوضّأ مرّةً أخرى قبل الصّلاة أو قبل الطّواف، ثمّ أكمِل كالمعتاد.",
    source_en: "Ibn Bāz, Fatāwā Nūr ʿalā ad-Darb.",
    source_ar: "ابن باز، فتاوى نور على الدّرب.",
  },
  {
    category: "ihram",
    q_en: "Can I shower during Iḥrām?",
    q_ar: "هل يجوز الاغتسال أثناء الإحرام؟",
    a_en:
      "**Yes — fully permitted.** You may even wash your head. Just use **unscented soap or shampoo** — scented ones count as applying perfume, which is forbidden after the Talbiyah.",
    a_ar:
      "**نعم — جائز تمامًا.** يجوز غسل الرّأس أيضًا. لكن استخدم **صابونًا وشامبو غير معطّرين** — فالمعطّر يُعدّ طيبًا، وهو محظور بعد التّلبية.",
    source_en: "Bukhārī 1840 (narration of ʿUmar); Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ.",
    source_ar: "البخاري ١٨٤٠ (حديث عمر رضي الله عنه)؛ ابن عثيمين، الشّرح الممتع.",
  },
  {
    category: "ihram",
    q_en: "Can I scratch if I itch?",
    q_ar: "هل يجوز الحكّ إذا حكّني شيء؟",
    a_en:
      "**Yes — gently.** Do not deliberately pull hairs out. If a hair comes off on its own while scratching, there is no penalty.",
    a_ar:
      "**نعم — برفق.** ولا تتعمّد نزع الشّعر. وإن سقط شعر بغير قصد فلا شيء عليك.",
    source_en: "Ibn Bāz.",
    source_ar: "ابن باز رحمه الله.",
  },
  {
    category: "ihram",
    q_en: "Can I use an umbrella, or walk in the shade of a car/tent?",
    q_ar: "هل يجوز استعمال مظلّة أو المشي في ظلّ السّيّارة أو الخيمة؟",
    a_en:
      "**Yes.** Shading yourself with an umbrella, a car roof, a tent, or any loose covering is permitted. This is NOT 'covering the head' in the prohibited sense (which means wearing a cap, turban, or ihram cloth tied directly on the head).",
    a_ar:
      "**نعم.** الاستظلال بالمظلّة أو سقف السّيّارة أو الخيمة أو أيّ غطاء غير لاصق جائز. وهذا ليس من «تغطية الرّأس» المحظورة (وإنّما المحظور لبس الطّاقيّة أو العمامة أو ربط ثوب الإحرام على الرّأس).",
    source_en: "Ibn Bāz, Fatāwā; narration of Umm al-Ḥuṣayn (Muslim 1297).",
    source_ar: "ابن باز، الفتاوى؛ حديث أمّ الحُصين (مسلم ١٢٩٧).",
  },
  {
    category: "ihram",
    q_en: "Can I wear glasses, a watch, a belt, or a backpack?",
    q_ar: "هل يجوز لبس النّظّارات أو السّاعة أو الحزام أو حمل حقيبة؟",
    a_en:
      "**Yes — all permitted.** These are not considered 'stitched clothing' in the prohibited sense. A buckled belt, money-belt, watch, glasses (including sunglasses), and a backpack are all fine. What's prohibited for men is: sewn clothing shaped to fit the body — shirts, trousers, shoes that cover the ankle bone.",
    a_ar:
      "**نعم — كلّه جائز.** هذه ليست من «المخيط» المحظور. فالحزام بمشبك، وحزام النّقود، والسّاعة، والنّظّارة (بما فيها الشّمسيّة)، وحقيبة الظّهر — كلّها جائزة. والمحظور للرّجال هو اللّباس المخيط على هيئة العضو — القميص، والسّروال، والخفّين اللّذين يستران الكعب.",
    source_en: "Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ; Bukhārī (ʿUmar narration on the belt).",
    source_ar: "ابن عثيمين، الشّرح الممتع؛ البخاري (حديث عمر في الحزام).",
  },
  {
    category: "ihram",
    q_en: "Can I brush my teeth?",
    q_ar: "هل يجوز تنظيف الأسنان؟",
    a_en:
      "**Yes.** Use a miswāk or a toothbrush with **unscented** toothpaste. Scented toothpaste (mint, bubblegum flavours with perfume oils) should be avoided.",
    a_ar:
      "**نعم.** استخدم السّواك أو فرشاة مع معجون **غير معطّر**. وتجنّب المعاجين المعطّرة (بالنّعناع أو الكراميل مع زيوت العطر).",
    source_en: "Ibn ʿUthaymīn.",
    source_ar: "ابن عثيمين رحمه الله.",
  },
  {
    category: "ihram",
    q_en: "What if my Iḥrām cloth slips or needs re-wrapping?",
    q_ar: "ماذا لو سقط إزاري أو احتجت إلى إعادة لفّه؟",
    a_en:
      "**No problem.** Adjusting, re-wrapping, tightening, or even washing your Iḥrām cloth does not break Iḥrām. If it becomes impure you can even change into a fresh one.",
    a_ar:
      "**لا بأس.** تعديل الإزار أو إعادة لفّه أو شدّه بل حتّى غسله لا يُبطل الإحرام. وإن تنجّس فيجوز استبداله بآخر طاهر.",
    source_en: "Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ.",
    source_ar: "ابن عثيمين، الشّرح الممتع.",
  },

  // ─── IF I MAKE A MISTAKE ───────────────────────────────────
  {
    category: "mistakes",
    q_en: "What if I accidentally put on perfume / cut hair / trimmed nails while in Iḥrām?",
    q_ar: "ماذا لو فعلت أحد المحظورات نسيانًا (كالتطيّب أو قصّ الشّعر أو تقليم الأظفار)؟",
    a_en:
      "**Out of forgetfulness, ignorance, or coercion — NO penalty.** The moment you remember, **stop immediately** (e.g. wash off the perfume) and continue your ʿUmrah. Allah says: *'Our Lord, do not take us to task if we forget or err.'* (Qur'ān 2:286, which Allah answered: 'I have already done it.')\n\nIf you did it **intentionally**, knowing the ruling, then a **fidyah** is due — your choice of: fast 3 days, OR feed 6 poor people (about ½ ṣāʿ = ~1.5 kg of food each), OR slaughter a sheep in Makkah.",
    a_ar:
      "**نسيانًا أو جهلًا أو إكراهًا — لا شيء عليك.** بمجرّد أن تتذكّر، **توقّف فورًا** (كغسل الطّيب مثلًا) وأكمل عمرتك. قال الله تعالى: ﴿رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا﴾ [البقرة: ٢٨٦] — وقد ردّ الله: «قد فعلت».\n\nأمّا إن فعلته **متعمّدًا** عالـمًا بالحكم، فعليك **فدية** مخيّرًا فيها: صيام ٣ أيّام، أو إطعام ٦ مساكين (نصف صاع لكلٍّ ≈ ١٫٥ كغ طعام)، أو ذبح شاة في مكّة.",
    source_en: "Qur'ān 2:286; Qur'ān 2:196 (fidyah verse); Bukhārī 1815 (Kaʿb b. ʿUjrah); Ibn ʿUthaymīn, al-Mumtiʿ.",
    source_ar: "البقرة ٢٨٦؛ البقرة ١٩٦ (آية الفدية)؛ البخاري ١٨١٥ (حديث كعب بن عُجرة)؛ ابن عثيمين، الممتع.",
  },
  {
    category: "mistakes",
    q_en: "What breaks Iḥrām? What doesn't?",
    q_ar: "ما الذي يُبطل الإحرام؟ وما الذي لا يُبطله؟",
    a_en:
      "**What does NOT break Iḥrām** (continue as normal):\n• Breaking wuḍū\n• Menstruation (women)\n• Bleeding / nosebleeds\n• Adjusting the Iḥrām cloth\n• Bathing / showering\n• Sleeping\n\n**What breaks Iḥrām** (i.e. invalidates your entire ʿUmrah and you must redo it):\n• **Sexual intercourse BEFORE completing Ṭawāf al-ʿUmrah** — this is the only thing that truly breaks it. Your ʿUmrah is invalid, you must still complete this one AND redo it later + slaughter a camel or cow as fidyah (Ibn ʿAbbās, Bukhārī).\n• **Apostasy** (abandoning Islam) — obviously.\n\nEverything else is either 'minor violation → fidyah' or 'no penalty at all'.",
    a_ar:
      "**ما لا يُبطل الإحرام** (تُكمل عادي):\n• نقض الوضوء\n• الحيض للمرأة\n• النّزيف والرّعاف\n• تعديل ثوب الإحرام\n• الاغتسال\n• النّوم\n\n**ما يُبطل الإحرام** (ويُبطل عمرتك فتجب إعادتها):\n• **الجماع قبل إتمام طواف العمرة** — وهو الوحيد الذي يبطلها حقًّا. تبطل العمرة، وتُتمّها ثمّ تعيدها لاحقًا + ذبح بدنة أو بقرة فدية (ابن عبّاس، البخاري).\n• **الرّدّة** عن الإسلام — بداهةً.\n\nوما سوى ذلك فإمّا «محظور صغير فيه فدية» أو «لا شيء فيه أصلًا».",
    source_en: "Bukhārī 1818 (Ibn ʿAbbās on intimacy); Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ.",
    source_ar: "البخاري ١٨١٨ (ابن عبّاس في الجماع)؛ ابن عثيمين، الشّرح الممتع.",
  },
  {
    category: "mistakes",
    q_en: "What if I crossed the Mīqāt without entering Iḥrām?",
    q_ar: "ماذا لو تجاوزت الميقات دون إحرام؟",
    a_en:
      "**Return to the Mīqāt and enter Iḥrām from there.** If that's impossible (flight, emergency, distance), you must **slaughter a sheep in Makkah** as fidyah and distribute the meat to the poor there.",
    a_ar:
      "**ارجع إلى الميقات وأحرم منه.** فإن تعذّر ذلك (بسبب الطّيران أو الضّرورة أو بُعد الطّريق)، فعليك **ذبح شاة في مكّة** فدية، وتوزيع لحمها على فقراء الحرم.",
    source_en: "Ibn Bāz; Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ.",
    source_ar: "ابن باز؛ ابن عثيمين، الشّرح الممتع.",
  },
  {
    category: "mistakes",
    q_en: "What if I lose count of my Ṭawāf or Saʿī laps?",
    q_ar: "ماذا لو نسيت عدد أشواط الطّواف أو السّعي؟",
    a_en:
      "**Build on the LOWER number.** If you're unsure whether you did 4 or 5 laps, count **4**. Principle: certainty over doubt. Complete the remaining laps.",
    a_ar:
      "**ابنِ على الأقل.** إن شككت أهي ٤ أم ٥، فاعتبرها **٤**. القاعدة: اليقين مقدّم على الشّكّ. ثمّ أتمّ ما بقي.",
    source_en: "Agreed-upon fiqh principle: 'al-yaqīn lā yazūlu bish-shakk'.",
    source_ar: "قاعدة فقهيّة: «اليقين لا يزول بالشّكّ».",
  },

  // ─── WOMEN ─────────────────────────────────────────────────
  {
    category: "women",
    q_en: "What if my period starts during ʿUmrah?",
    q_ar: "ماذا لو جاءني الحيض أثناء العمرة؟",
    a_en:
      "**You are still in Iḥrām — your Iḥrām is intact.** You can do everything a pilgrim does: recite the Talbiyah, make du'ā, enter the masjid area (but not stay inside), go to Saʿī between Ṣafā & Marwah.\n\n**What you CANNOT do until pure:** **Ṭawāf around the Kaʿbah.** When the period ends, perform ghusl and then do your Ṭawāf and Saʿī.",
    a_ar:
      "**أنتِ لا زلتِ في الإحرام — إحرامك باقٍ.** تفعلين كلّ ما يفعله الحاجّ: تلبّين، تدعين، تدخلين حرم المسجد (لا داخل المسجد للبثِ)، وتسعين بين الصّفا والمروة.\n\n**ما لا يجوز حتّى تطهُري:** **الطّواف بالبيت.** فإذا انقطع الدّم اغتسلي، ثمّ طوفي واسعي.",
    source_en: "Bukhārī 305, 1650 — the Prophet ﷺ to ʿĀʾishah: 'Do everything the pilgrim does, except do not perform Ṭawāf around the House until you are pure.'",
    source_ar: "البخاري ٣٠٥، ١٦٥٠ — قول النّبي ﷺ لعائشة: «افعلي ما يفعل الحاجّ، غير أن لا تطوفي بالبيت حتّى تطهري».",
  },
  {
    category: "women",
    q_en: "Do I have to do a specific style for my Iḥrām clothing?",
    q_ar: "هل هناك لباس مخصّص للمرأة في الإحرام؟",
    a_en:
      "**No specific colour or style.** You wear any modest clothing — everyday ḥijāb or abāyah is fine. The **only two restrictions** are: **no niqāb** (face-veil) and **no gloves**. If you want to cover your face because of non-maḥram men, let a cloth drape down from your head over the face — do NOT tie a shaped niqāb.",
    a_ar:
      "**لا لون ولا فصل مخصّص.** تلبسين أيّ لباس محتشم — الحجاب أو العباءة المعتادة كافية. والتّحفّظان الوحيدان: **لا نقاب** و**لا قفّازين**. وإن أردت ستر الوجه عن غير المحارم فلترخي ثوبًا على وجهها من فوق رأسها، من غير عقد النّقاب.",
    source_en: "Bukhārī 1838 (Ibn ʿUmar: the muḥrimah does not wear niqāb or gloves); Ibn ʿUthaymīn.",
    source_ar: "البخاري ١٨٣٨ (ابن عمر: لا تنتقب المحرمة ولا تلبس القفّازين)؛ ابن عثيمين.",
  },
  {
    category: "women",
    q_en: "Can I recite the Qur'ān during my period?",
    q_ar: "هل يجوز قراءة القرآن في الحيض؟",
    a_en:
      "**Majority Salafi scholars (Ibn Bāz, Ibn ʿUthaymīn):** you may **recite from memory silently** — supplications, dhikr, and Qur'ān from memory are all allowed. Avoid **touching a physical Muṣḥaf**. You can use a phone app to read (most scholars permit, since the phone is not a Muṣḥaf).",
    a_ar:
      "**أكثر علماء السّنّة (ابن باز، ابن عثيمين):** يجوز **القراءة من الحفظ خفية** — الأذكار والدّعاء والقرآن حفظًا، كلّه جائز. ولا يجوز **مسّ المصحف** مباشرةً. ويجوز القراءة من الجوّال إذ ليس له حكم المصحف عند الأكثر.",
    source_en: "Ibn Bāz, Fatāwā; Ibn ʿUthaymīn, al-Sharḥ al-Mumtiʿ.",
    source_ar: "ابن باز، الفتاوى؛ ابن عثيمين، الشّرح الممتع.",
  },

  // ─── DURING TAWAF / SAI ────────────────────────────────────
  {
    category: "tawaf",
    q_en: "What if the adhān is called during my Ṭawāf?",
    q_ar: "إذا أُقيمت الصّلاة أثناء الطّواف، ماذا أفعل؟",
    a_en:
      "**Stop** exactly where you are. Pray with the congregation. After the Ṣalāh, **continue from the same spot** — you do NOT start over or restart that lap.",
    a_ar:
      "**توقّف** في مكانك. صلِّ مع الجماعة. ثمّ **أكمل من موضعك** — ولا تُعد الشّوط من أوّله.",
    source_en: "Ibn Bāz, Ibn ʿUthaymīn.",
    source_ar: "ابن باز، ابن عثيمين.",
  },
  {
    category: "tawaf",
    q_en: "Can I do Ṭawāf in a wheelchair?",
    q_ar: "هل يجوز الطّواف بالكرسيّ المتحرّك؟",
    a_en:
      "**Yes — fully valid.** Wheelchair lanes exist on the ground floor AND the upper floors of the Mataf. Seven full laps in a wheelchair count as a complete Ṭawāf. No penalty, no downgrade.",
    a_ar:
      "**نعم — صحيح تمامًا.** توجد ممرّات للكراسي في الدّور الأرضي وفي الأدوار العلوية للمطاف. سبعة أشواط بالكرسي تعدّ طوافًا كاملًا. لا فدية ولا نقص.",
    source_en: "Ibn Bāz, Fatāwā; approved by the Permanent Committee of Saudi Scholars.",
    source_ar: "ابن باز، الفتاوى؛ أقرّتها اللّجنة الدّائمة للعلماء.",
  },
  {
    category: "tawaf",
    q_en: "Can I make du'ā loudly? Can I talk during Ṭawāf?",
    q_ar: "هل أرفع صوتي بالدّعاء؟ وهل يجوز الكلام في الطّواف؟",
    a_en:
      "Make du'ā **quietly** — raising the voice disturbs others around you. Talking is **permitted** if needed (e.g. to guide your group, help someone), but keep it minimal. No particular du'ā is fixed for each lap — say whatever you wish, in any language.",
    a_ar:
      "ادعُ **سرًّا** — فرفع الصّوت يشوّش على النّاس. والكلام **مباح** للحاجة (كتوجيه الرّفقة أو مساعدة أحد)، لكن أقلّله. ولا يوجد دعاء معيّن لكلّ شوط — فادعُ بما شئت بأيّ لغة.",
    source_en: "al-Albānī, Manāsik al-Ḥajj; Ibn ʿUthaymīn.",
    source_ar: "الألباني، مناسك الحجّ؛ ابن عثيمين.",
  },
  {
    category: "tawaf",
    q_en: "What if I am too tired to jog between the green pillars (men)?",
    q_ar: "ماذا لو تعبت ولم أستطع الهرولة بين العَلَمين؟",
    a_en:
      "The **Raml** (brisk jog between green pillars) in the first 3 laps of Ṭawāf, and the jog between the two green pillars in Saʿī, are **sunnah not obligatory**. If you can't do them — walk normally, no penalty.",
    a_ar:
      "**الرَّمَل** (الهرولة بين العَلَمين) في أشواط الطّواف الثّلاثة الأولى، والهرولة بين العَلَمين في السّعي، **سُنّة لا واجب**. فإن عجزت عنها، امشِ عاديًّا بلا فدية.",
    source_en: "Ibn ʿUthaymīn; Ibn Bāz.",
    source_ar: "ابن عثيمين؛ ابن باز.",
  },

  // ─── GENERAL ───────────────────────────────────────────────
  {
    category: "general",
    q_en: "Can I touch or kiss the Kaʿbah itself?",
    q_ar: "هل يجوز لمس الكعبة أو تقبيلها؟",
    a_en:
      "The **only two places** on the Kaʿbah that are touched in sunnah are: (1) **the Black Stone** — kiss/touch/gesture depending on crowd; and (2) **the Yemeni Corner (Rukn al-Yamānī)** — touch with right hand only, no kissing, no gesture from distance. Everywhere else — the walls, the door, the cloth (kiswah) — is **NOT sunnah to wipe, kiss, or rub**. Doing so is a well-known Salafi warning.",
    a_ar:
      "المَوضعان الوحيدان من الكعبة اللّذان يُمسحان بالسّنّة: (١) **الحجر الأسود** — يُقبّل أو يُلمس أو يُشار إليه حسب الزّحام؛ و(٢) **الرّكن اليماني** — يُلمس باليد اليمنى فقط، لا تقبيل ولا إشارة من بُعد. وما عداهما — الجدران والباب والكسوة — **ليس من السّنّة** تمسّحها أو تقبيلها. وهذا تحذير مشهور عند السّلفيّين.",
    source_en: "Bukhārī 1609, 1611; Ibn Bāz; al-Albānī.",
    source_ar: "البخاري ١٦٠٩، ١٦١١؛ ابن باز؛ الألباني.",
  },
  {
    category: "general",
    q_en: "Can I take photos or videos inside Masjid al-Ḥaram?",
    q_ar: "هل يجوز التّصوير داخل المسجد الحرام؟",
    a_en:
      "Saudi authorities now **forbid photography** inside the prayer halls and Ṭawāf area (signs everywhere). Beyond the legal rule, the Salafi view is that excessive photography during ʿibādah distracts you from khushūʿ. A quiet photo from outside is fine — but focus on worship, not content.",
    a_ar:
      "تمنع السّلطات السّعوديّة **التّصوير** داخل قاعات الصّلاة والمطاف (لافتات واضحة). وبغضّ النّظر عن الحكم النّظامي، فالتّصوير الكثير أثناء العبادة يذهب الخشوع. صورة هادئة من خارج الصّحن جائزة — لكن ركّز على العبادة لا المحتوى.",
    source_en: "Saudi Ḥaramain authority; general Salafi adab.",
    source_ar: "هيئة الحرمين السّعوديّة؛ أدب عامّ.",
  },
  {
    category: "general",
    q_en: "My child is with me — do they need Iḥrām?",
    q_ar: "طفلي معي — هل عليه إحرام؟",
    a_en:
      "**Children under puberty:** if they understand, help them enter Iḥrām with intention + Talbiyah. If too young, carry them as you perform — their ʿUmrah counts as nafl (voluntary) for them. The parent remains in Iḥrām by the normal rules. When the child reaches puberty later, they must do a separate obligatory ʿUmrah.",
    a_ar:
      "**الأطفال قبل البلوغ:** إن كان يُميّز، أعنه على الإحرام بالنيّة والتّلبية. وإن كان صغيرًا جدًّا، فاحمله وأنت تؤدّي مناسكك — عمرته نافلة له. والوالد المحرم يبقى على أحكام الإحرام. فإذا بلغ الصّبيّ لاحقًا وجبت عليه عمرة مستقلّة.",
    source_en: "Ibn ʿUthaymīn; Muslim 1336 (Prophet ﷺ accepted Ḥajj of a child).",
    source_ar: "ابن عثيمين؛ مسلم ١٣٣٦ (قبل النّبي ﷺ حجّ الصّبي).",
  },
  {
    category: "general",
    q_en: "What if I die during ʿUmrah?",
    q_ar: "ماذا لو مت أثناء العمرة؟",
    a_en:
      "The Prophet ﷺ said of a pilgrim who died in Iḥrām: *'Wash him with water and lotus-leaves, shroud him in his two Iḥrām garments… he will be raised on the Day of Resurrection reciting the Talbiyah.'* (Bukhārī 1850) — a profound honour.",
    a_ar:
      "قال النّبي ﷺ في المحرم الذي وقَصته ناقته: «اغسلوه بماء وسدر، وكفّنوه في ثوبيه... فإنّه يُبعث يوم القيامة ملبّيًا». (البخاري ١٨٥٠) — وهو شرف عظيم.",
    source_en: "Bukhārī 1850.",
    source_ar: "البخاري ١٨٥٠.",
  },
  {
    category: "general",
    q_en: "Can I smoke while in Iḥrām?",
    q_ar: "هل يجوز التّدخين في الإحرام؟",
    a_en:
      "Smoking is **ḥarām always** — Iḥrām or not — in the Salafi view (Ibn Bāz, Ibn ʿUthaymīn). Do not use Iḥrām as the trigger to finally quit: quit before, and never come back to it.",
    a_ar:
      "التّدخين **حرام مطلقًا** — محرمًا أو غير محرم — عند علماء السّنّة (ابن باز، ابن عثيمين). ولا تجعل الإحرام مناسبة للإقلاع فقط: أقلع قبله ولا تعد إليه بعدَه.",
    source_en: "Ibn Bāz, Ibn ʿUthaymīn — harm verses + preservation of wealth & health.",
    source_ar: "ابن باز، ابن عثيمين — أدلّة حرمة الإضرار بالنّفس والمال.",
  },
];
