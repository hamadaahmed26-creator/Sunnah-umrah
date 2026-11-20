import React from "react";

export default function HaramLive({ isAr }) {
  return (
    <section>
      <h2>{isAr ? "مكة مباشر" : "Makkah Live"}</h2>
      <a href="/companion/index.html#makkah">
        {isAr ? "شاهد الحرم أو استمع إلى إذاعة القرآن الكريم السعودية" : "Watch the Haram or listen to Saudi Quran Radio"}
      </a>
    </section>
  );
}
