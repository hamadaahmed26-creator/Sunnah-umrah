import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Compass, Users, MapPin, Sparkles,
  Briefcase, MessageSquare, Moon, Footprints, Trophy, ShoppingBag,
  Sunrise, Sunset, Sun, Loader2, Plane, BookOpen, Quote, Share2, Check,
  Settings as SettingsIcon, Calendar, Accessibility, CalendarDays,
} from "lucide-react";
import { LangContext } from "../components/Layout";
import { ramadanStatus } from "../lib/ramadan";
import { todaysReminder } from "../lib/dailyReminders";
import { loadProfile, daysUntilTrip, tripPrompt, saveProfile } from "../lib/userProfile";
import OnboardingSheet from "../components/OnboardingSheet";

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
  const reminder = React.useMemo(() => todaysReminder(), []);

  // User profile (from onboarding)
  const [profile, setProfile] = React.useState(() => loadProfile());
  const [onboardOpen, setOnboardOpen] = React.useState(false);

  // Auto-open onboarding on first launch
  React.useEffect(() => {
    if (!profile.done) {
      const t = setTimeout(() => setOnboardOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [profile.done]);

  const handleOnboardComplete = (answers) => {
    setProfile({ ...profile, ...answers, done: true });
    setOnboardOpen(false);
  };

  // Trip countdown
  const daysToTrip = daysUntilTrip(profile.tripDate);
  const promptText = tripPrompt(daysToTrip, isAr);

  // Personalized greeting
  const greeting = profile.experience === "first"
    ? (isAr ? "أوّل عمرة لك" : "Your first ʿUmrah")
    : profile.experience === "returning"
      ? (isAr ? "أهلًا بعودتك" : "Welcome back")
      : profile.experience === "helping"
        ? (isAr ? "خدمة محتسبة" : "May Allah accept your service")
        : (isAr ? "السلام عليكم" : "Salām ʿalaykum");

  // First-time vs returning user — controls section ordering. A user who has
  // already started their Tawaf/Saʿi sees Tools first; a fresh visitor sees
  // travel options first because they're still planning.
  const toolsFirst = inProgress;

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="home-page">
      {/* Hero — warm cream-to-gold gradient + subtle Islamic geometric pattern overlay */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-2 -mx-1 rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F8E9CE 0%, #EFD6A8 38%, #E5C58A 72%, #D4B070 100%)",
        }}
      >
        {/* Geometric pattern overlay — quiet, not noisy */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-pat" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
              <path
                d="M32 4 L60 32 L32 60 L4 32 Z M32 16 L48 32 L32 48 L16 32 Z"
                fill="none"
                stroke="#1C1D1B"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pat)" />
        </svg>
        {/* Floating Ka'bah glyph — top-right accent */}
        <div className="absolute -top-2 -right-2 w-32 h-32 rounded-full bg-[#1C1D1B]/5 blur-2xl pointer-events-none" />
        <div className="absolute top-6 right-6 w-12 h-12 rounded-md bg-[#1C1D1B] grid place-items-center shadow-[0_8px_24px_-8px_rgba(28,29,27,0.4)]">
          <div className="w-10 h-2 bg-[#B3884D] mt-1" />
        </div>

        <div className="relative px-6 pt-8 pb-7">
          <p className="text-xs uppercase tracking-[0.22em] text-[#7B5C24]">
            {greeting}
          </p>
          <h1 className="mt-2 text-[34px] font-medium leading-tight tracking-tight text-[#1C1D1B] max-w-[12ch]">
            {isAr ? "مرحبًا بك في رحلتك" : "Welcome to your journey"}
          </h1>
          <p className="mt-2 text-[14px] text-[#3F3722] max-w-[36ch]">
            {isAr
              ? "كلّ ما تحتاجه لأداء العمرة على السنّة، في مكان واحد."
              : "Everything you need to perform Umrah according to the Sunnah — in one place."}
          </p>
        </div>
      </motion.div>

      {/* Continue / Start tour — biggest CTA (charcoal anchor under warm hero) */}
      <Link
        to="/tour"
        className="mt-3 block tap-pulse rounded-3xl bg-[#1C1D1B] text-white p-5 active:scale-[0.99] transition shadow-[0_12px_30px_-12px_rgba(28,29,27,0.45)]"
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
          <div className="w-12 h-12 rounded-full bg-[#B3884D] grid place-items-center flex-shrink-0 shadow-[0_4px_12px_-2px_rgba(179,136,77,0.6)]">
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

      {/* Prayer times — Makkah, refreshes every minute */}
      <PrayerTimesCard isAr={isAr} />

      {/* 2 priority cards — Stay together + Ask. The first one is the big
          differentiator for families travelling in the Haram crowd. */}
      <div className="mt-3 grid grid-cols-2 gap-2" data-testid="home-priority">
        <PriorityCard
          to="/group"
          icon={Users}
          label={isAr ? "ابقَ معًا" : "Stay together"}
          sublabel={isAr ? "لا تَضِع في الزحام" : "Don't lose anyone in the crowd"}
          accent="#B3884D"
          testid="home-group"
        />
        <PriorityCard
          to="/chat"
          icon={MessageSquare}
          label={isAr ? "اسأل" : "Ask"}
          sublabel={isAr ? "أسئلة الفقه والعمرة" : "Fiqh & Umrah questions"}
          accent="#8B4540"
          testid="home-chat"
        />
      </div>

      {/* Trip countdown — shows only if a trip date is set and in the future */}
      {daysToTrip !== null && daysToTrip >= 0 && (
        <Link
          to="/places"
          className="mt-3 block rounded-2xl bg-gradient-to-br from-[#1F4F3A] to-[#2A5A4A] text-white p-4 active:scale-[0.99] transition shadow-[0_10px_24px_-12px_rgba(31,79,58,0.55)] tap-pulse"
          data-testid="home-trip-countdown"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/15 grid place-items-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-[#B3884D]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                {isAr ? "العدّ التّنازلي" : "Countdown"}
              </div>
              <div className="text-[18px] font-medium leading-tight tabular-nums">
                {daysToTrip === 0
                  ? (isAr ? "اليوم!" : "Today!")
                  : (isAr
                      ? `بقي ${daysToTrip} ${daysToTrip === 1 ? "يوم" : "يومًا"}`
                      : `${daysToTrip} ${daysToTrip === 1 ? "day" : "days"} to go`)}
              </div>
              {promptText && (
                <div className="mt-1 text-[11px] text-white/75 leading-snug">
                  {promptText}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* "I haven't booked yet" — only shows if onboarding done but no date set */}
      {profile.done && !profile.tripDate && (
        <button
          onClick={() => setOnboardOpen(true)}
          className="mt-3 w-full rounded-2xl bg-white border border-dashed border-[#E8E5DD] p-3 text-left hover:border-[#B3884D] transition tap-pulse"
          data-testid="home-add-trip-date"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#B3884D]" />
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-[#1C1D1B]">
                {isAr ? "أضف تاريخ سفرك" : "Add your travel date"}
              </div>
              <div className="text-[10px] text-[#8E8F8A]">
                {isAr ? "ستظهر العدّ التّنازلي والتّذكيرات الذّكيّة" : "Get a countdown and timely reminders"}
              </div>
            </div>
            <ArrowRight className={`w-3.5 h-3.5 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
          </div>
        </button>
      )}

      {/* Wheelchair / accessibility CTA — only for users who selected this */}
      {profile.travelers === "wheelchair" && (
        <Link
          to="/accessibility"
          className="mt-3 block rounded-2xl bg-[#F1F4F1] border border-[#BCD9C5] p-3.5 hover:border-[#2A5A4A] transition tap-pulse"
          data-testid="home-accessibility-cta"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#BCD9C5]">
              <Accessibility className="w-4 h-4 text-[#2A5A4A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "العمرة بكرسيّ متحرّك" : "Wheelchair guidance"}
              </div>
              <div className={`text-[11px] text-[#3F584F] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "كيفيّة الطّواف والسّعي بسهولة" : "How to perform Tawaf & Saʿi with ease"}
              </div>
            </div>
            <ArrowRight className={`w-3.5 h-3.5 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
          </div>
        </Link>
      )}

      {/* Today's Sunnah reminder — rotates daily. Designed to make this app
          a quiet daily habit, not just a one-off Umrah tool. */}
      <DailyReminderCard reminder={reminder} isAr={isAr} />

      {toolsFirst ? (
        <>
          <ToolsSection isAr={isAr} />
          <TravelSection isAr={isAr} />
        </>
      ) : (
        <>
          <TravelSection isAr={isAr} />
          <ToolsSection isAr={isAr} />
        </>
      )}

      {/* About / Sources footer — reassures the user (and Apple reviewers)
          that every ruling in the app is sourced. */}
      <div className="mt-7 grid grid-cols-2 gap-2">
        <Link
          to="/about"
          className="block rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition tap-pulse"
          data-testid="home-about"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#E8E5DD]">
              <BookOpen className="w-3.5 h-3.5 text-[#7B5C24]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "المصادر" : "Sources"}
              </div>
              <div className={`text-[10px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "البخاري، مسلم..." : "Bukhārī · al-Albānī"}
              </div>
            </div>
          </div>
        </Link>
        <Link
          to="/settings"
          className="block rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition tap-pulse"
          data-testid="home-settings"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#E8E5DD]">
              <SettingsIcon className="w-3.5 h-3.5 text-[#7B5C24]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "الإعدادات" : "Settings"}
              </div>
              <div className={`text-[10px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "تنبيهات الأذان" : "Adhan reminders"}
              </div>
            </div>
          </div>
        </Link>
      </div>
      <OnboardingSheet
        open={onboardOpen}
        onComplete={handleOnboardComplete}
        onSkip={() => {
          saveProfile({ ...profile, done: true });
          setProfile({ ...profile, done: true });
          setOnboardOpen(false);
        }}
        isAr={isAr}
      />
    </div>
  );
}

// ─── Today's reminder card with share action ─────────────────────────
function DailyReminderCard({ reminder, isAr }) {
  const [shared, setShared] = React.useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const text = isAr
      ? `«${reminder.ar}»\n\n— ${reminder.source}\n\nمن تطبيق سنّة عمرة`
      : `"${reminder.en}"\n\n— ${reminder.source}\n\nFrom the Sunnah Umrah app`;
    const url = "https://sunnahumrah.app";
    const shareData = {
      title: isAr ? "تذكير اليوم — سنّة عمرة" : "Today's reminder — Sunnah Umrah",
      text,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (_) {
      // User cancelled share — silent.
    }
  };

  return (
    <div
      className="mt-3 rounded-2xl bg-gradient-to-br from-[#FBF8F1] to-white border border-[#E8E5DD] p-4 hover:border-[#B3884D] hover:shadow-[0_8px_18px_-12px_rgba(179,136,77,0.4)] transition"
      data-testid="home-daily-reminder"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#FBF1DD] grid place-items-center flex-shrink-0">
          <Quote className="w-3.5 h-3.5 text-[#B3884D]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className={`text-[10px] uppercase tracking-[0.22em] text-[#B3884D] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "تذكير اليوم" : "Today's reminder"}
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8E5DD] hover:border-[#B3884D] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#5C5D58] hover:text-[#1C1D1B] transition tap-pulse"
              aria-label={isAr ? "مشاركة التّذكير" : "Share reminder"}
              data-testid="home-reminder-share"
            >
              {shared ? (
                <>
                  <Check className="w-2.5 h-2.5 text-[#2A5A4A]" />
                  <span className="text-[#2A5A4A]">{isAr ? "تمّ النّسخ" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-2.5 h-2.5" />
                  <span>{isAr ? "شارك" : "Share"}</span>
                </>
              )}
            </button>
          </div>
          <p
            dir={isAr ? "rtl" : "ltr"}
            className={`mt-1.5 text-[13px] text-[#1C1D1B] leading-[1.55] ${isAr ? "font-arabic" : ""}`}
          >
            {isAr ? `«${reminder.ar}»` : `"${reminder.en}"`}
          </p>
          <div className="mt-1.5 text-[10px] text-[#8E8F8A] tracking-wide">
            {reminder.source}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tools grid (Qibla / Lost / Ziyārah / Quiz / Ramadan / Shop) ────
function ToolsSection({ isAr }) {
  return (
    <>
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "الأدوات" : "Tools"}
        </h2>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Tile to="/qibla"   icon={Compass}    en="Qibla compass"  ar="بوصلة القبلة"   sub_en="Direction to Ka'bah" sub_ar="اتجاه الكعبة" testid="home-qibla" />
        <Tile to="/lost"    icon={MapPin}     en="I'm lost"        ar="أنا تائه"        sub_en="Find nearest gate"   sub_ar="أقرب باب" testid="home-lost" />
        <Tile to="/places"  icon={Sparkles}   en="Ziyārah"         ar="الزّيارة"        sub_en="26 places to visit"  sub_ar="٢٦ مكانًا" testid="home-places" />
        <Tile to="/quiz"    icon={Trophy}     en="Knowledge quiz" ar="اختبر نفسك"     sub_en="Test what you know"  sub_ar="اختبار العمرة" testid="home-quiz" />
        <Tile to="/ramadan" icon={Moon}       en="Ramadan"         ar="رمضان"           sub_en="Reminders & countdown" sub_ar="تذكيرات وعدّ تنازلي" testid="home-ramadan" />
        <Tile to="/best-months" icon={CalendarDays} en="When to go"  ar="متى تذهب"       sub_en="Best months for Umrah" sub_ar="أفضل شهور العمرة" testid="home-best-months" />
        <Tile to="/shop"    icon={ShoppingBag} en="Shop"           ar="المتجر"          sub_en="Ihram, books, eSIM"  sub_ar="إحرام، كتب، شريحة" testid="home-shop" badge={isAr ? "جديد" : "New"} />
      </div>
    </>
  );
}

// ─── Travel section (Packages vs DIY) ───────────────────────────────
function TravelSection({ isAr }) {
  return (
    <>
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "كيف ستسافر؟" : "How will you travel?"}
        </h2>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2" data-testid="home-travel">
        {/* All-inclusive package */}
        <Link
          to="/packages"
          className="block tap-pulse rounded-2xl bg-gradient-to-br from-[#FFF7E6] to-[#F4DCA1] border border-[#EBD9B0] p-4 hover:border-[#B3884D] hover:shadow-[0_10px_24px_-14px_rgba(179,136,77,0.5)] transition active:scale-[0.98]"
          data-testid="home-travel-package"
        >
          <div className="w-10 h-10 rounded-full bg-white/70 grid place-items-center mb-2 border border-[#EBD9B0]">
            <Briefcase className="w-[18px] h-[18px] text-[#7B5C24]" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8B6A1F]">
            {isAr ? "شامل" : "All-inclusive"}
          </div>
          <div className="mt-0.5 text-[14px] font-semibold text-[#1C1D1B] leading-tight">
            {isAr ? "باقات العمرة" : "Umrah packages"}
          </div>
          <div className="mt-1 text-[11px] text-[#6E5424] leading-snug">
            {isAr ? "رحلة + فندق + توجيه" : "Flight + hotel + guide"}
          </div>
        </Link>

        {/* DIY */}
        <Link
          to="/shop"
          className="block tap-pulse rounded-2xl bg-gradient-to-br from-white to-[#F1F4F1] border border-[#DDE4DC] p-4 hover:border-[#2A5A4A] hover:shadow-[0_10px_24px_-14px_rgba(42,90,74,0.4)] transition active:scale-[0.98]"
          data-testid="home-travel-diy"
        >
          <div className="w-10 h-10 rounded-full bg-white grid place-items-center mb-2 border border-[#DDE4DC]">
            <Plane className="w-[18px] h-[18px] text-[#2A5A4A]" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#2A5A4A]">
            {isAr ? "بنفسك" : "DIY"}
          </div>
          <div className="mt-0.5 text-[14px] font-semibold text-[#1C1D1B] leading-tight">
            {isAr ? "احجز بنفسك" : "Hotels & flights"}
          </div>
          <div className="mt-1 text-[11px] text-[#3F584F] leading-snug">
            {isAr ? "فنادق · رحلات · شريحة eSIM" : "Hotels · flights · eSIM"}
          </div>
        </Link>
      </div>
    </>
  );
}

function PriorityCard({ to, icon: Icon, label, sublabel, accent, testid }) {
  return (
    <Link
      to={to}
      className="block tap-pulse rounded-2xl bg-gradient-to-br from-white to-[#FBF8F1] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] hover:shadow-[0_8px_18px_-12px_rgba(179,136,77,0.45)] transition active:scale-[0.97]"
      data-testid={testid}
    >
      <div className="flex flex-col items-center text-center gap-1.5">
        <div
          className="w-11 h-11 rounded-full grid place-items-center"
          style={{ background: `${accent}1A`, boxShadow: `inset 0 0 0 1px ${accent}33` }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: accent }} />
        </div>
        <div className="text-[12px] font-semibold text-[#1C1D1B] leading-tight">{label}</div>
        {sublabel && (
          <div className="text-[10px] text-[#8E8F8A] leading-snug px-1">{sublabel}</div>
        )}
      </div>
    </Link>
  );
}

function Tile({ to, icon: Icon, en, ar, sub_en, sub_ar, testid, badge }) {
  return (
    <Link
      to={to}
      className="block relative tap-pulse rounded-2xl bg-gradient-to-br from-white to-[#FBF8F1] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] hover:shadow-[0_8px_18px_-12px_rgba(179,136,77,0.4)] transition active:scale-[0.98]"
      data-testid={testid}
    >
      {badge && (
        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider text-white bg-[#B3884D] rounded-full px-1.5 py-0.5 shadow-[0_2px_6px_-1px_rgba(179,136,77,0.6)]">
          {badge}
        </span>
      )}
      <div className="w-9 h-9 rounded-full bg-[#F8F0DD] grid place-items-center">
        <Icon className="w-[17px] h-[17px] text-[#7B5C24]" />
      </div>
      <div className="mt-2.5 text-[13px] font-semibold text-[#1C1D1B] leading-tight">
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

// ─── Prayer times card — fetches Makkah times once + highlights "next prayer" ──
function PrayerTimesCard({ isAr }) {
  const [data, setData] = React.useState(null);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Makkah", country: "SA", method: 4 },
      })
      .then((r) => setData(r.data?.data?.timings))
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <div className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] p-4 flex items-center gap-2 text-[12px] text-[#8E8F8A]" data-testid="home-prayer-loading">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {isAr ? "تحميل أوقات الصّلاة..." : "Loading Makkah prayer times…"}
      </div>
    );
  }

  // Pick the next upcoming prayer time
  const items = [
    { id: "Fajr",    icon: Sunrise, en: "Fajr",    ar: "الفجر",    t: data.Fajr },
    { id: "Dhuhr",   icon: Sun,     en: "Dhuhr",   ar: "الظّهر",    t: data.Dhuhr },
    { id: "Asr",     icon: Sun,     en: "Asr",     ar: "العصر",     t: data.Asr },
    { id: "Maghrib", icon: Sunset,  en: "Maghrib", ar: "المغرب",   t: data.Maghrib },
    { id: "Isha",    icon: Moon,    en: "Isha",    ar: "العشاء",    t: data.Isha },
  ];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const next =
    items.find((p) => {
      const [h, m] = p.t.split(":").map((n) => parseInt(n, 10));
      return h * 60 + m > nowMin;
    }) || items[0];

  return (
    <div
      className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] p-3.5"
      data-testid="home-prayer-times"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] inline-flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {isAr ? "أوقات مكّة" : "Makkah times"}
        </div>
        <div className="text-[10px] text-[#8E8F8A]">
          {isAr ? "التّالية" : "Next"}: <span className="font-semibold text-[#1C1D1B]">{isAr ? next.ar : next.en} · {next.t}</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {items.map((p) => {
          const isNext = p.id === next.id;
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`text-center rounded-xl px-1.5 py-2 transition ${
                isNext
                  ? "bg-[#1C1D1B] text-white"
                  : "bg-[#F8F6F0] text-[#1C1D1B]"
              }`}
              data-testid={`prayer-${p.id.toLowerCase()}`}
            >
              <Icon className={`w-3.5 h-3.5 mx-auto ${isNext ? "text-[#B3884D]" : "text-[#8E8F8A]"}`} />
              <div className={`mt-1 text-[10px] uppercase tracking-wider ${isNext ? "text-[#B3884D]" : "text-[#8E8F8A]"} ${isAr ? "font-arabic" : ""}`}>
                {isAr ? p.ar : p.en}
              </div>
              <div className="mt-0.5 text-[12px] font-medium tabular-nums">{p.t}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

