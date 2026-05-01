import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Compass, Users, MapPin, BookOpen, Heart, Sparkles,
  Hotel, Wifi, Briefcase, MessageSquare, Moon, Footprints, Trophy, ShoppingBag,
} from "lucide-react";
import { LangContext } from "../components/Layout";
import { ramadanStatus } from "../lib/ramadan";

// Home dashboard — every feature visible at a glance.
// Hero: continue / start tour. Below: 3 priority cards (Plan / Stay together / Ask).
// Then: a 2-col tile grid of secondary tools.
// Then: monetisation strip (Sadaqah / Hotels / Packages).
//
// Designed so first-time users immediately understand the app's scope, while
// returning users tap "Continue" without thinking.
export default function Home() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  // Returning vs first-time
  const tawafCount = parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10);
  const saiCount = parseInt(localStorage.getItem("umrah_sai_count") || "0", 10);
  const inProgress = tawafCount > 0 || saiCount > 0;

  const ramadan = React.useMemo(() => ramadanStatus(), []);

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="home-page">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-[#B3884D]">
          {isAr ? "السلام عليكم" : "Salām ʿalaykum"}
        </p>
        <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-tight text-[#1C1D1B]">
          {isAr ? "مرحبًا بك في رحلتك" : "Welcome to your journey"}
        </h1>
        <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[36ch]">
          {isAr
            ? "كلّ ما تحتاجه لأداء العمرة على السنّة، في مكان واحد."
            : "Everything you need to perform Umrah on the Sunnah — in one place."}
        </p>
      </motion.div>

      {/* Continue / Start tour — biggest CTA */}
      <Link
        to="/tour"
        className="mt-6 block tap-pulse rounded-3xl bg-[#1C1D1B] text-white p-5 active:scale-[0.99] transition"
        data-testid="home-tour"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
              {inProgress ? (isAr ? "تابع" : "Continue") : (isAr ? "ابدأ" : "Start")}
            </div>
            <div className="mt-1.5 text-[22px] font-medium leading-tight">
              {isAr ? "خطوة بخطوة" : "Step-by-step Umrah"}
            </div>
            {inProgress ? (
              <div className="mt-1 text-[12px] text-white/60 tabular-nums">
                Tawaf {tawafCount}/7 · Saʿi {saiCount}/7
              </div>
            ) : (
              <div className="mt-1 text-[12px] text-white/60">
                {isAr ? "من النيّة إلى التحلّل" : "From niyyah to taḥallul"}
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-[#B3884D] grid place-items-center flex-shrink-0">
            <Footprints className="w-5 h-5 text-white" />
          </div>
        </div>
      </Link>

      {/* Live banner — Ramadan or Iftar */}
      {ramadan.state !== "unknown" && (
        <Link
          to="/ramadan"
          className="mt-2 block rounded-2xl bg-gradient-to-r from-[#1C1D1B] to-[#2A2D29] text-white p-3.5 flex items-center gap-3 hover:brightness-110 transition"
          data-testid="home-ramadan-banner"
        >
          <Moon className="w-4 h-4 text-[#B3884D] flex-shrink-0" />
          <div className="text-[12px] flex-1">
            {ramadan.state === "during"
              ? (isAr ? `يوم ${ramadan.day} من رمضان — تذكير اليوم` : `Day ${ramadan.day} of Ramadan — today's reminder`)
              : (isAr ? `يبدأ رمضان بعد ${ramadan.daysUntil} يومًا` : `Ramadan begins in ${ramadan.daysUntil} days`)}
          </div>
          <ArrowRight className={`w-3.5 h-3.5 text-white/60 ${isAr ? "rotate-180" : ""}`} />
        </Link>
      )}

      {/* 3 priority cards — Plan, Group, Ask */}
      <div className="mt-5 grid grid-cols-3 gap-2" data-testid="home-priority">
        <PriorityCard to="/plan"  icon={Briefcase}        label={isAr ? "خطّط"   : "Plan"}    accent="#2A5A4A" testid="home-plan" />
        <PriorityCard to="/group" icon={Users}            label={isAr ? "العائلة" : "Family"} accent="#B3884D" testid="home-group" />
        <PriorityCard to="/chat"  icon={MessageSquare}    label={isAr ? "اسأل"  : "Ask"}     accent="#8B4540" testid="home-chat" />
      </div>

      {/* Section header */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "الأدوات" : "Tools"}
        </h2>
      </div>

      {/* 2-column tile grid */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Tile to="/qibla"   icon={Compass}    en="Qibla compass"  ar="بوصلة القبلة"   sub_en="Direction to Ka'bah" sub_ar="اتجاه الكعبة" testid="home-qibla" />
        <Tile to="/lost"    icon={MapPin}     en="I'm lost"        ar="أنا تائه"        sub_en="Find nearest gate"   sub_ar="أقرب باب" testid="home-lost" />
        <Tile to="/places"  icon={Sparkles}   en="Ziyārah"         ar="الزّيارة"        sub_en="26 places to visit"  sub_ar="٢٦ مكانًا" testid="home-places" />
        <Tile to="/quiz"    icon={Trophy}     en="Knowledge quiz" ar="اختبر نفسك"     sub_en="Test what you know"  sub_ar="اختبار العمرة" testid="home-quiz" />
        <Tile to="/ramadan" icon={Moon}       en="Ramadan"         ar="رمضان"           sub_en="Reminders & countdown" sub_ar="تذكيرات وعدّ تنازلي" testid="home-ramadan" />
        <Tile to="/shop"    icon={ShoppingBag} en="Shop"           ar="المتجر"          sub_en="Ihram, books, eSIM"  sub_ar="إحرام، كتب، شريحة" testid="home-shop" badge={isAr ? "جديد" : "New"} />
      </div>

      {/* Section header — Plan & save */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "الحجز والتخفيض" : "Book & save"}
        </h2>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <SmallTile to="/hotels"   icon={Hotel}    en="Hotels"  ar="فنادق"  testid="home-hotels" />
        <SmallTile to="/packages" icon={Briefcase} en="Packages" ar="باقات"  testid="home-packages" />
        <SmallTile
          href={`https://www.airalo.com/saudi-arabia-esim${process.env.REACT_APP_AIRALO_REF ? `?ref=${process.env.REACT_APP_AIRALO_REF}` : ""}`}
          icon={Wifi}
          en="eSIM"
          ar="شريحة"
          testid="home-esim"
          external
        />
      </div>

      {/* Sadaqah strip — calm, intentional, never pushy */}
      <Link
        to="/sadaqah"
        className="mt-7 block tap-pulse rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4 hover:border-[#B3884D] transition"
        data-testid="home-sadaqah"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#E8E5DD]">
            <Heart className="w-4 h-4 text-[#8B4540]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr ? "تصدّق" : "Give Sadaqah"}
            </div>
            <div className={`text-[11px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr ? "في أيّام الحرم العشرة" : "On these blessed days"}
            </div>
          </div>
          <ArrowRight className={`w-4 h-4 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
        </div>
      </Link>
    </div>
  );
}

function PriorityCard({ to, icon: Icon, label, accent, testid }) {
  return (
    <Link
      to={to}
      className="block tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition active:scale-[0.97]"
      data-testid={testid}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: `${accent}1A` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div className="text-[12px] font-semibold text-[#1C1D1B]">{label}</div>
      </div>
    </Link>
  );
}

function Tile({ to, icon: Icon, en, ar, sub_en, sub_ar, testid, badge }) {
  return (
    <Link
      to={to}
      className="block relative tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition active:scale-[0.98]"
      data-testid={testid}
    >
      {badge && (
        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider text-white bg-[#B3884D] rounded-full px-1.5 py-0.5">
          {badge}
        </span>
      )}
      <Icon className="w-4 h-4 text-[#1C1D1B]" />
      <div className="mt-2 text-[13px] font-semibold text-[#1C1D1B] leading-tight">
        <span className="lang-en">{en}</span>
        <span className="lang-ar font-arabic hidden">{ar}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-[#8E8F8A]">
        <span className="lang-en">{sub_en}</span>
        <span className="lang-ar font-arabic hidden">{sub_ar}</span>
      </div>
    </Link>
  );
}

function SmallTile({ to, href, icon: Icon, en, ar, testid, external = false }) {
  const inner = (
    <>
      <Icon className="w-4 h-4 text-[#1C1D1B]" />
      <div className="mt-1.5 text-[12px] font-medium text-[#1C1D1B]">
        <span className="lang-en">{en}</span>
        <span className="lang-ar font-arabic hidden">{ar}</span>
      </div>
    </>
  );
  const cls = "block text-center rounded-2xl bg-white border border-[#E8E5DD] p-3 hover:border-[#B3884D] transition active:scale-[0.97] tap-pulse";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className={cls} data-testid={testid}>{inner}</a>
  ) : (
    <Link to={to} className={cls} data-testid={testid}>{inner}</Link>
  );
}
