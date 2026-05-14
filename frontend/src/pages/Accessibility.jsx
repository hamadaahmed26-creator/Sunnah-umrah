import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Accessibility, Heart, MapPin, Phone, BookOpen } from "lucide-react";
import { LangContext } from "../components/Layout";

// Wheelchair & accessibility guidance — Salafi-grounded fiqh + practical tips
// for pilgrims with mobility needs or those helping elderly parents.
//
// Sources cited:
//  • Ibn Bāz (raḥimahullāh) — Fatwās on wheelchair Tawaf permissibility
//  • Ibn ʿUthaymīn (raḥimahullāh) — Sharḥ al-Mumtiʿ on representation in worship
//  • Saudi Permanent Committee for Iftāʾ (al-Lajnah ad-Dāʾimah)

export default function AccessibilityPage() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  return (
    <div className="max-w-2xl mx-auto pb-16" data-testid="accessibility-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {isAr ? "الرّجوع" : "Back"}
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
        {isAr ? "العمرة بسهولة" : "Accessible Umrah"}
      </p>
      <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? "بكرسيّ متحرّك أو بمساعدة" : "Wheelchair & assisted Umrah"}
      </h1>
      <p className={`mt-3 text-[13px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "العمرة عبادة لكلّ من شاءها، شابًّا أو شيخًا، صحيحًا أو ذا حاجة. لا تحرم نفسك أو والديك من هذا الفضل بسبب صعوبة المشي — كل خطوة تذلّل لله محتسبة عنده."
          : "ʿUmrah is for every Muslim who wishes to perform it — young, elderly, fully able, or in need of help. Do not deny yourself or your parents this blessing because of mobility — every step taken in humility before Allah is counted."}
      </p>

      {/* Section 1 — Fiqh */}
      <section className="mt-8 rounded-2xl bg-white border border-[#E8E5DD] p-5" data-testid="acc-fiqh">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <BookOpen className="w-3.5 h-3.5" />
          {isAr ? "الفقه" : "What the Sunnah says"}
        </div>
        <h2 className={`mt-2 text-[18px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "الطّواف والسّعي بالكرسيّ المتحرّك" : "Tawaf & Saʿi by wheelchair"}
        </h2>
        <p className={`mt-3 text-[13px] text-[#3F3722] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "أفتى الشّيخ عبد العزيز بن باز رحمه الله بجواز الطّواف والسّعي بالكرسيّ المتحرّك لمن لا يستطيع المشي. ويستدلّ بأنّ النبيّ ﷺ طاف على بعيره في حجّة الوداع. والكرسيّ المتحرّك بمنزلة الرّاحلة."
            : "Shaykh Ibn Bāz (raḥimahullāh) ruled that performing Tawaf and Saʿi by wheelchair is permitted for anyone unable to walk. The evidence is that the Prophet ﷺ himself performed Tawaf on his camel during the Farewell Pilgrimage. A wheelchair is treated the same way."}
        </p>
        <ul className={`mt-4 space-y-2.5 text-[13px] text-[#3F3722] leading-[1.7] list-disc pl-5 ${isAr ? "font-arabic text-right pr-5 pl-0" : ""}`}>
          <li>
            {isAr
              ? "يجب على راكب الكرسيّ أن يكون على وضوء — ولا يصحّ الطّواف بلا طهارة."
              : "The wheelchair user must be in a state of wuḍūʾ — Tawaf is not valid without it."}
          </li>
          <li>
            {isAr
              ? "إن كان الدّافع ينوي طوافه هو أيضًا، فعليه الإحرام والوضوء، ويبدأ وينتهي عند الحجر الأسود."
              : "If the person pushing also intends Tawaf for themselves, they must be in iḥrām, in wuḍūʾ, and start/end at the Black Stone."}
          </li>
          <li>
            {isAr
              ? "إن كان الدّافع مساعدًا فقط (بلا نيّة طواف)، فلا يلزمه إحرام، وله الأجر العظيم لخدمة أخيه."
              : "If the helper is only assisting (not making their own Tawaf), they do not need iḥrām — and they earn enormous reward for serving their brother or sister."}
          </li>
          <li>
            {isAr
              ? "في السّعي: نفس الحكم — يجوز بالكرسيّ، ولا تشترط الطّهارة (السّعي لا يشترط له الوضوء، وإن استحبّ)."
              : "For Saʿi: same ruling — wheelchair is permitted. Wuḍūʾ is recommended but not required for Saʿi."}
          </li>
        </ul>
        <p className={`mt-4 text-[12px] text-[#8E8F8A] italic ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "المصادر: فتاوى ابن باز · الشّرح الممتع لابن عثيمين · اللّجنة الدّائمة للإفتاء."
            : "Sources: Fatāwā Ibn Bāz · Sharḥ al-Mumtiʿ by Ibn ʿUthaymīn · Saudi Permanent Committee."}
        </p>
      </section>

      {/* Section 2 — Where to get a wheelchair */}
      <section className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="acc-rental">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#2A5A4A]">
          <MapPin className="w-3.5 h-3.5" />
          {isAr ? "أين تجد الكرسيّ" : "Where to get a wheelchair"}
        </div>
        <h2 className={`mt-2 text-[18px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "في المسجد الحرام والمسجد النّبوي" : "In Masjid al-Ḥaram & Masjid an-Nabawī"}
        </h2>
        <ul className={`mt-3 space-y-3 text-[13px] text-[#3F3722] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
          <li>
            <strong>{isAr ? "كراسي الإيجار:" : "Rental wheelchairs:"}</strong>{" "}
            {isAr
              ? "متوفّرة قرب أبواب الحرم الرّئيسيّة (مثل باب الملك فهد وباب العمرة). الإيجار المعتاد ٥٠–١٠٠ ريال يوميًّا، مع تأمين ٢٠٠ ريال يُستردّ."
              : "Available at the major gates of the Ḥaram (King Fahd Gate, ʿUmrah Gate, etc.). Typical rental is 50–100 SAR per day, with a refundable 200 SAR deposit."}
          </li>
          <li>
            <strong>{isAr ? "الطّابق العلوي للطّواف:" : "Upper-level Mataf:"}</strong>{" "}
            {isAr
              ? "الدّور الثّاني والسّطح مخصّصان لذوي الحاجة — أهدأ بكثير من الصّحن السّفلي. مصاعد متوفّرة عند كلّ بوّابة."
              : "The 2nd floor and rooftop are dedicated wheelchair Tawaf areas — far less crowded than the ground level. Lifts available at every gate."}
          </li>
          <li>
            <strong>{isAr ? "ممرّ السّعي الأوسط:" : "Saʿi middle lane:"}</strong>{" "}
            {isAr
              ? "في صحن الصّفا والمروة، الممرّ الأوسط مخصّص للكراسي والعربات الكهربائيّة — أسرع وأكثر انسيابيّة."
              : "Between Ṣafā and Marwah, the middle lane is reserved for wheelchairs and electric scooters — faster and smoother."}
          </li>
          <li>
            <strong>{isAr ? "خدمة الدّفع المأجور:" : "Paid pushers:"}</strong>{" "}
            {isAr
              ? "يمكن استئجار رجل أو امرأة (للنّساء) لدفع الكرسيّ خلال الطّواف والسّعي. الأجرة المعتادة ٢٠٠–٤٠٠ ريال للعمرة كاملة."
              : "Hired pushers — men or women, depending on the pilgrim — are available for the full ʿUmrah. Typical fee 200–400 SAR for the complete journey."}
          </li>
          <li>
            <strong>{isAr ? "العربة الكهربائيّة:" : "Electric scooters:"}</strong>{" "}
            {isAr
              ? "متوفّرة في الطّابق العلوي مقابل ١٥٠–٢٥٠ ريال للعمرة الكاملة. مريحة جدًّا لكبار السّنّ."
              : "Available on the upper levels for 150–250 SAR per complete ʿUmrah. Very comfortable for elderly pilgrims."}
          </li>
        </ul>
      </section>

      {/* Section 3 — Practical tips */}
      <section className="mt-4 rounded-2xl bg-white border border-[#E8E5DD] p-5" data-testid="acc-tips">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <Heart className="w-3.5 h-3.5" />
          {isAr ? "نصائح عمليّة" : "Practical tips"}
        </div>
        <h2 className={`mt-2 text-[18px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "تجربة أفضل وأهدأ" : "Make it smoother"}
        </h2>
        <ul className={`mt-3 space-y-2.5 text-[13px] text-[#3F3722] leading-[1.7] list-disc pl-5 ${isAr ? "font-arabic text-right pr-5 pl-0" : ""}`}>
          <li>
            {isAr
              ? "احجز فندقًا قريبًا من الحرم بالحدّ الأقصى ٣٠٠ متر — كلّ متر يفرق."
              : "Book a hotel within 300m of the Ḥaram — every metre matters when pushing a wheelchair."}
          </li>
          <li>
            {isAr
              ? "استخدم الطّابق العلوي للطّواف، خاصّةً في الذّروة (الجمعة، رمضان)."
              : "Use the upper-level Mataf especially at peak times (Fridays, Ramadan)."}
          </li>
          <li>
            {isAr
              ? "احمل ماءً وغطاء رأس خفيفًا — درجات الحرارة تختلف بين الطّوابق."
              : "Carry water and a light head-covering — temperatures vary between levels."}
          </li>
          <li>
            {isAr
              ? "إذا كنت تدفع والدًا أو والدةً: نِيّتك خدمتهما لأجل الله، والأجر عظيم."
              : "If you're pushing a parent: make your intention pure service for Allah. The reward is immense."}
          </li>
          <li>
            {isAr
              ? "اطلب من فندقك ترتيب كرسيّ مسبقًا — كثير من الفنادق تقدّم هذه الخدمة مجّانًا أو بسعر رمزيّ."
              : "Ask your hotel to arrange a wheelchair in advance — many provide it free or at a small charge."}
          </li>
        </ul>
      </section>

      {/* Section 4 — Help & contact */}
      <section className="mt-4 rounded-2xl bg-[#FFF8EE] border border-[#EBD9B0] p-5" data-testid="acc-contact">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8B6A1F]">
          <Phone className="w-3.5 h-3.5" />
          {isAr ? "تواصل معنا" : "Need more help?"}
        </div>
        <h2 className={`mt-2 text-[18px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "نحن نطوّر هذه التّجربة" : "We're improving this section"}
        </h2>
        <p className={`mt-3 text-[13px] text-[#3F3722] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "إذا كانت لديك حاجة خاصّة (طبّيّة، ضعف بصر، صعوبة سمع، كبير سنّ)، راسلنا وسنُجيب شخصيًّا — هذه أولويّتنا."
            : "If you have a specific need (medical, visual, hearing, elderly), email us and we'll reply personally — this is a priority for us."}
        </p>
        <a
          href="mailto:Hamada.ahmed26@hotmail.com?subject=Accessibility%20support"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1C1D1B] hover:bg-black text-white px-4 py-2 text-[12px] font-medium tap-pulse"
          data-testid="acc-email"
        >
          {isAr ? "راسلنا" : "Email us"}
          <ArrowLeft className={`w-3 h-3 ${isAr ? "rotate-180" : "rotate-180"}`} />
        </a>
      </section>

      <p className={`mt-8 text-center text-[12px] text-[#8E8F8A] italic ${isAr ? "font-arabic" : ""}`}>
        {isAr
          ? "تقبّل الله منكم ومن كلّ مَن خدم والديه."
          : "May Allah accept your ʿUmrah and reward every pilgrim who serves a parent or loved one."}
      </p>
    </div>
  );
}
