import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Plane, Hotel, Wifi, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";

// Plan your trip — single page that lets the user pick between an
// all-inclusive Umrah package OR a DIY (hotel + flight + eSIM) booking.
// Reached from the "Plan your trip" CTA on Home and from the bottom-nav.

export default function Plan() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="plan-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
        {isAr ? "خطّط لرحلتك" : "Plan your trip"}
      </p>
      <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? "كيف ستسافر؟" : "How will you travel?"}
      </h1>
      <p className={`mt-3 text-[13px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "إمّا باقة شاملة — حيث يُنظِّم لك كلّ شيء — أو احجز بنفسك واختر فندقك ورحلتك على راحتك."
          : "Either let an agency handle everything for you, or book each piece yourself and stay in full control."}
      </p>

      {/* Packages — full-width */}
      <Link
        to="/packages"
        className="mt-6 block tap-pulse rounded-2xl bg-gradient-to-br from-[#FFF7E6] to-[#F4DCA1] border border-[#EBD9B0] p-5 hover:border-[#B3884D] hover:shadow-[0_12px_28px_-14px_rgba(179,136,77,0.55)] transition active:scale-[0.99]"
        data-testid="plan-packages"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#EBD9B0]">
            <Briefcase className="w-5 h-5 text-[#7B5C24]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#8B6A1F]">
              {isAr ? "شامل" : "All-inclusive"}
            </div>
            <h2 className={`mt-1 text-[18px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "باقات العمرة" : "Umrah packages"}
            </h2>
            <p className={`mt-1.5 text-[12px] text-[#6E5424] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "رحلة، فندق، تأشيرة، نقل — كلّ شيء يُرتَّب لك من قِبل وكالة موثوقة. مثاليّ لأوّل مرّة."
                : "Flight, hotel, visa, transfers — all arranged for you by a trusted agency. Best for first-timers."}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#7B5C24]">
              {isAr ? "تصفّح الباقات" : "Browse packages"}
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </div>
          </div>
        </div>
      </Link>

      {/* DIY — full-width */}
      <Link
        to="/hotels"
        className="mt-3 block tap-pulse rounded-2xl bg-gradient-to-br from-white to-[#F1F4F1] border border-[#DDE4DC] p-5 hover:border-[#2A5A4A] hover:shadow-[0_12px_28px_-14px_rgba(42,90,74,0.4)] transition active:scale-[0.99]"
        data-testid="plan-diy"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#DDE4DC]">
            <Plane className="w-5 h-5 text-[#2A5A4A]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#2A5A4A]">
              {isAr ? "بنفسك" : "DIY"}
            </div>
            <h2 className={`mt-1 text-[18px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "احجز بنفسك" : "Hotels & flights"}
            </h2>
            <p className={`mt-1.5 text-[12px] text-[#3F584F] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "اختر فندقك ورحلتك وشريحة eSIM بنفسك — مرونة أكبر، وغالبًا أرخص للمسافرين ذوي الخبرة."
                : "Pick your own hotel, flight, and eSIM — more flexibility and often cheaper for experienced travellers."}
            </p>
            {/* Mini icon row showing what's inside */}
            <div className="mt-3 flex items-center gap-3">
              <Tag icon={Hotel}  label_en="Hotels"  label_ar="فنادق" isAr={isAr} />
              <Tag icon={Plane}  label_en="Flights" label_ar="رحلات" isAr={isAr} />
              <Tag icon={Wifi}   label_en="eSIM"    label_ar="شريحة" isAr={isAr} />
            </div>
          </div>
        </div>
      </Link>

      {/* Helper hint */}
      <div className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#B3884D] flex-shrink-0 mt-0.5" />
        <p className={`text-[12px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "لست متأكّدًا؟ معظم المعتمرين لأوّل مرّة يُفضّلون الباقات الشّاملة لتجنّب التّفاصيل، أمّا من سبق لهم العمرة فيوفّرون كثيرًا بالحجز بأنفسهم."
            : "Not sure? Most first-timers prefer all-inclusive packages to avoid the logistics. Repeat pilgrims usually save a lot by booking each piece themselves."}
        </p>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, label_en, label_ar, isAr }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#F1F4F1] border border-[#DDE4DC] px-2 py-0.5 text-[10px] text-[#3F584F]">
      <Icon className="w-3 h-3" />
      <span className={isAr ? "font-arabic" : ""}>{isAr ? label_ar : label_en}</span>
    </div>
  );
}
