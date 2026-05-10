import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Compass, Users, MapPin, Sparkles,
  Briefcase, MessageSquare, Moon, Footprints, Trophy, ShoppingBag,
  Sunrise, Sunset, Sun, Loader2, Plane, BookOpen, Quote, Share2, Check,
  Settings as SettingsIcon, Calendar, Accessibility, CalendarDays, UserCog, Pencil,
  Navigation as NavigationIcon, ClipboardList,
} from "lucide-react";
import { LangContext } from "../components/Layout";
import { ramadanStatus } from "../lib/ramadan";
import { todaysReminder } from "../lib/dailyReminders";
import { loadProfile, daysUntilTrip, tripPrompt, saveProfile } from "../lib/userProfile";
import OnboardingSheet from "../components/OnboardingSheet";
import HaramLive from "../components/HaramLive";

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
  const tourStep = parseInt(localStorage.getItem("umrah_tour_step") || "0", 10);
  const inProgress = tawafCount > 0 || saiCount > 0 || tourStep > 0;

  const ramadan = React.useMemo(() => ramadanStatus(), []);
  const reminder = React.useMemo(() => todaysReminder(), []);

  // User profile (from onboarding)
  const [profile, setProfile] = React.useState(() => loadProfile());
  const [onboardOpen, setOnboardOpen] = React.useState(false);
  // editMode is controlled via URL param (?edit=1) so the Settings page can
  // route here and reopen onboarding pre-filled. Keeps Home itself clutter-free.
  const [editMode, setEditMode] = React.useState(false);

  // The EDIT button on the countdown card opens a small action sheet with
  // TWO sections: change travel date OR change my onboarding answers.
  // Avoids cluttering the home page while exposing both edits in one place.
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);

  const promptForDate = () => {
    setEditSheetOpen(false);
    const next = window.prompt(
      isAr
        ? "أدخل تاريخ السّفر (YYYY-MM-DD) — أو اتركه فارغًا للحذف"
        : "Enter trip date (YYYY-MM-DD) — or leave empty to clear",
      profile.tripDate || ""
    );
    if (next === null) return;
    const trimmed = next.trim();
    if (trimmed === "") {
      const updated = { ...profile, tripDate: null };
      setProfile(updated);
      saveProfile(updated);
      return;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed) && !isNaN(Date.parse(trimmed))) {
      const updated = { ...profile, tripDate: trimmed };
      setProfile(updated);
      saveProfile(updated);
    }
  };

  const openEditAnswers = () => {
    setEditSheetOpen(false);
    // Tiny delay so the action sheet animates out before the bigger sheet animates in.
    setTimeout(() => {
      setEditMode(true);
      setOnboardOpen(true);
    }, 120);
  };

  // Human-readable summary of who the user is, shown in the action sheet
  const experienceLabel = profile.experience === "first"
    ? (isAr ? "أوّل مرّة" : "First time")
    : profile.experience === "returning"
      ? (isAr ? "عدت من قبل" : "Returning")
      : profile.experience === "helping"
        ? (isAr ? "أعتمر لأحد" : "Helping someone else")
        : (isAr ? "غير محدّد" : "Not set");
  const travelersLabel = profile.travelers === "solo"
    ? (isAr ? "بمفرده" : "Solo")
    : profile.travelers === "spouse"
      ? (isAr ? "مع الزّوج/ة" : "With spouse")
      : profile.travelers === "family"
        ? (isAr ? "مع العائلة" : "With family")
        : profile.travelers === "wheelchair"
          ? (isAr ? "بحاجة إلى كرسيّ متحرّك" : "Wheelchair help")
          : null;
  const answersSummary = travelersLabel
    ? `${experienceLabel} · ${travelersLabel}`
    : experienceLabel;

  // Re-open onboarding ONLY when arriving with ?edit=1 from Settings.
  // First-launch auto-popup was REMOVED Feb 2026 — pilgrims now land
  // straight on the home dashboard and see the Kaaba within 2 seconds.
  // The persona quiz is still available via Settings → "About me".
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "1") {
      setEditMode(true);
      setOnboardOpen(true);
      // Clean the URL so a refresh doesn't re-trigger
      const url = window.location.pathname;
      window.history.replaceState({}, "", url);
    }
  }, []);

  const handleOnboardComplete = (answers) => {
    setProfile({ ...profile, ...answers, done: true });
    setOnboardOpen(false);
    setEditMode(false);
  };

  // Trip countdown
  const daysToTrip = daysUntilTrip(profile.tripDate);
  const promptText = tripPrompt(daysToTrip, isAr, profile.experience === "helping");

  // ─── Persona flags ──────────────────────────────────────────────────
  // Drive the home layout. Default to "going" when nothing is set so the
  // first paint is sensible (matches what existing users had pre-Feb-2026).
  const purpose = profile.purpose || "going";
  const isPlanning = purpose === "going" || purpose === "helping";
  const isInMakkah = purpose === "in-makkah";
  const isLearning = purpose === "learning";
  const isCompleted = purpose === "completed";

  // Personalized hero copy per persona. Booking / countdown / shop are only
  // shown to planners. In-Makkah users get straight to the steps. Learners
  // and "completed" users see knowledge-first content.
  const heroLabel = isInMakkah
    ? (isAr ? "في الحرم" : "In the Ḥaram")
    : isLearning
      ? (isAr ? "النّور والمعرفة" : "Knowledge & light")
      : isCompleted
        ? (isAr ? "تقبّل الله منك" : "Taqabbal Allāhu minka")
        : profile.experience === "first"
          ? (isAr ? "أوّل عمرة لك" : "Your first ʿUmrah")
          : profile.experience === "returning"
            ? (isAr ? "أهلًا بعودتك" : "Welcome back")
            : profile.experience === "helping"
              ? (isAr ? "خدمة محتسبة" : "May Allah accept your service")
              : (isAr ? "السلام عليكم" : "Salām ʿalaykum");
  const greeting = heroLabel;

  const heroTitle = isInMakkah
    ? (isAr ? "أنت هناك — لنبدأ" : "You're there — let's begin")
    : isLearning
      ? (isAr ? "تعلّم العمرة" : "Learn the way of ʿUmrah")
      : isCompleted
        ? (isAr ? "ابقَ على الذّكر" : "Stay close to the dhikr")
        : profile.experience === "helping"
          ? (isAr ? "تخدم رحلتهم" : "Helping their journey")
          : (isAr ? "مرحبًا بك في رحلتك" : "Welcome to your journey");

  const heroSub = isInMakkah
    ? (isAr ? "خطوة بخطوة، مع كلّ دعاء وكلّ شعيرة." : "Step-by-step, with every dua and every rite.")
    : isLearning
      ? (isAr ? "أدعية، خطوات، أحاديث صحيحة — مجّانًا، لك وحدك." : "Du'ās, steps, ṣaḥīḥ ḥadīth — free, on your time.")
      : isCompleted
        ? (isAr ? "تذكيرات يوميّة وأدعية لتحفظ الأثر." : "Daily reminders and du'ās to keep the light.")
        : profile.experience === "helping"
          ? (isAr
              ? "كلّ ما يحتاجونه لأداء العمرة على السنّة، في مكان واحد."
              : "Everything they'll need to perform Umrah according to the Sunnah, in one place.")
        : (isAr
              ? "كلّ ما تحتاجه لأداء العمرة على السنّة، في مكان واحد."
              : "Everything you need to perform Umrah according to the Sunnah, in one place.");

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="home-page">
      {/* Personalize chip — opens the persona quiz overlay. Replaces the
          old auto-popup-on-first-launch behaviour: visible but unobtrusive.
          Anyone can tap it any time to tailor the home page (first-timer,
          returning, in-Makkah, helping a parent, wheelchair, family, etc.). */}
      <div className="flex justify-end mt-1 mb-2">
        <button
          type="button"
          onClick={() => { setEditMode(true); setOnboardOpen(true); }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E8E5DD] px-3 py-1.5 text-[12px] font-medium text-[#5C5D58] hover:text-[#1C1D1B] hover:border-[#B3884D] active:scale-95 transition tap-pulse shadow-sm"
          data-testid="home-personalize-chip"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span className={isAr ? "font-arabic" : ""}>
            {isAr
              ? (profile.done ? "تخصيص" : "خصّص هذا التّطبيق")
              : (profile.done ? "Personalize" : "Personalize this app")}
          </span>
        </button>
      </div>

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
            {heroTitle}
          </h1>
          <p className="mt-2 text-[14px] text-[#3F3722] max-w-[36ch]">
            {heroSub}
          </p>
        </div>
      </motion.div>

      {/* PRIMARY ACTION — Step-by-step CTA. Subtle Kaaba photo backdrop gives
          it emotional weight without disrupting the calm aesthetic. Status
          updates per user state. */}
      <Link
        to="/tour"
        className="mt-3 block tap-pulse relative overflow-hidden rounded-3xl bg-[#1C1D1B] text-white p-5 active:scale-[0.99] transition shadow-[0_12px_30px_-12px_rgba(28,29,27,0.45)]"
        data-testid="home-tour"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/kaaba/02-walking.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.28,
            filter: "saturate(0.6) contrast(1.05)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(110deg, rgba(28,29,27,0.92) 0%, rgba(28,29,27,0.78) 45%, rgba(28,29,27,0.50) 100%)",
          }}
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
              {inProgress ? (isAr ? "تابع" : "Continue") : (isAr ? "ابدأ" : "Start")}
            </div>
            <div className="mt-1.5 text-[22px] font-medium leading-tight">
              {isAr ? "خطوة بخطوة" : "Step-by-step Umrah"}
            </div>
            <div className="mt-1 text-[12px] text-white/65 tabular-nums">
              {inProgress
                ? (isAr
                    ? `الخطوة ${Math.max(tourStep + 1, 1)} من ١٥ · الطّواف ${tawafCount}/٧ · السّعي ${saiCount}/٧`
                    : `Step ${Math.max(tourStep + 1, 1)} of 15 · Tawaf ${tawafCount}/7 · Saʿi ${saiCount}/7`)
                : (isAr ? "من النيّة إلى التحلّل" : "From niyyah to taḥallul")}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#B3884D] grid place-items-center flex-shrink-0 shadow-[0_4px_12px_-2px_rgba(179,136,77,0.6)]">
            <Footprints className="w-5 h-5 text-white" />
          </div>
        </div>
      </Link>

      {/* Live banner — only shown when Ramadan is within 30 days OR active.
          Below 30 days the user genuinely cares; above that it's just noise. */}
      {(ramadan.state === "during" ||
        (ramadan.state === "upcoming" && ramadan.daysUntil <= 30)) && (
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

      {/* TRIP STATUS — countdown OR plan-your-trip CTA (mutually exclusive).
          Only shown to planners (going / helping). In-Makkah / Learning /
          Completed personas skip this entirely. */}
      {isPlanning && daysToTrip !== null && daysToTrip >= 0 ? (
        <div
          className="mt-3 rounded-2xl bg-gradient-to-br from-[#FFF7E6] to-[#F4DCA1] border border-[#EBD9B0] p-4"
          data-testid="home-trip-countdown"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#EBD9B0]">
              <CalendarDays className="w-5 h-5 text-[#7B5C24]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#8B6A1F]">
                  {isAr ? "العدّ التّنازلي" : "Countdown"}
                </div>
                <button
                  onClick={() => setEditSheetOpen(true)}
                  className="text-[10px] uppercase tracking-[0.14em] text-[#8B6A1F] hover:text-[#5C4218] underline-offset-2 hover:underline"
                  data-testid="home-trip-edit"
                >
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>
              <div className="text-[18px] font-medium leading-tight tabular-nums text-[#1C1D1B]">
                {daysToTrip === 0
                  ? (isAr ? "اليوم!" : "Today!")
                  : (isAr
                      ? `بقي ${daysToTrip} ${daysToTrip === 1 ? "يوم" : "يومًا"}`
                      : `${daysToTrip} ${daysToTrip === 1 ? "day" : "days"} to go`)}
              </div>
              {promptText && (
                <div className="mt-1 text-[11px] text-[#6E5424] leading-snug">
                  {promptText}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isPlanning && profile.done && !profile.tripDate ? (
        <div
          className="mt-3 rounded-2xl bg-white border border-dashed border-[#E8E5DD] p-3.5"
          data-testid="home-trip-empty"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <Calendar className="w-4 h-4 text-[#B3884D]" />
            <div className="flex-1">
              <div className={`text-[13px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {profile.experience === "helping"
                  ? (isAr ? "متى يعتمرون؟" : "When will they go?")
                  : (isAr ? "متى ستعتمر؟" : "When will you go?")}
              </div>
              <div className={`text-[10.5px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "اختر طريقة الحجز" : "Choose how to book"}
              </div>
            </div>
            <button
              onClick={() => setEditSheetOpen(true)}
              className="text-[10px] uppercase tracking-[0.14em] text-[#8B6A1F] hover:text-[#5C4218] underline-offset-2 hover:underline flex-shrink-0"
              data-testid="home-trip-empty-edit"
            >
              {isAr ? "تعديل" : "Edit"}
            </button>
          </div>
          {/* Two direct booking CTAs — Packages (all-inclusive) + Hotels/Flights (DIY) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/packages"
              className="rounded-xl bg-gradient-to-br from-[#FFF7E6] to-[#F4DCA1] border border-[#EBD9B0] hover:border-[#B3884D] p-2.5 tap-pulse transition active:scale-[0.98]"
              data-testid="home-trip-packages"
            >
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#7B5C24]" />
                <div className={`text-[11px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "باقات شاملة" : "Packages"}
                </div>
              </div>
              <div className={`mt-0.5 text-[9.5px] text-[#8B6A1F] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "رحلة + فندق + توجيه" : "All-in-one"}
              </div>
            </Link>
            <Link
              to="/hotels"
              className="rounded-xl bg-gradient-to-br from-white to-[#F1F4F1] border border-[#DDE4DC] hover:border-[#2A5A4A] p-2.5 tap-pulse transition active:scale-[0.98]"
              data-testid="home-trip-diy"
            >
              <div className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#2A5A4A]" />
                <div className={`text-[11px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "حجز بنفسي" : "Hotels & flights"}
                </div>
              </div>
              <div className={`mt-0.5 text-[9.5px] text-[#3F584F] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "اختر بنفسك" : "Book each piece"}
              </div>
            </Link>
          </div>
          {/* Already booked? Add date manually */}
          <button
            onClick={() => {
              const next = window.prompt(
                isAr
                  ? "أدخل تاريخ السّفر (YYYY-MM-DD)"
                  : "Enter trip date (YYYY-MM-DD)",
                ""
              );
              if (next === null) return;
              const trimmed = next.trim();
              if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed) && !isNaN(Date.parse(trimmed))) {
                const updated = { ...profile, tripDate: trimmed };
                setProfile(updated);
                saveProfile(updated);
              }
            }}
            className={`mt-2 w-full text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] tap-pulse inline-flex items-center justify-center gap-1.5 py-1.5 ${isAr ? "font-arabic" : ""}`}
            data-testid="home-trip-add-date"
          >
            <CalendarDays className="w-3 h-3 text-[#B3884D]" />
            {profile.experience === "helping"
              ? (isAr ? "حجزوا بالفعل — أضف التّاريخ" : "Already booked — add their date")
              : (isAr ? "حجزتُ بالفعل — أضف التّاريخ" : "Already booked — add my date")}
          </button>
        </div>
      ) : null}

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

      {/* PRIMARY ACTION CARD — surfaced ABOVE the tools grid.
          Updated Feb 2026: tester feedback said "homepage feels busy" when
          we had BOTH Get Ready + Walk to Haram as big cards. The
          Get-Ready Checklist is the conversion-critical path (affiliate
          flights/hotel/eSIM/shop) AND the path nearly every user benefits
          from before their trip — so it stays as the single hero card.
          Walk to Haram moves back into the tools grid below — it's only
          useful for the small slice of users physically in Makkah today. */}
      <div className="mt-7 space-y-2" data-testid="home-primary-cta">
        <Link
          to="/checklist"
          className="block tap-pulse rounded-2xl border border-[#C5DBC9] p-4 hover:border-[#2A5A4A] hover:shadow-[0_10px_22px_-12px_rgba(42,90,74,0.45)] transition active:scale-[0.99] bg-gradient-to-br from-[#F4F9F4] to-[#DCEBDC]"
          data-testid="home-checklist"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#C5DBC9]">
              <ClipboardList className="w-5 h-5 text-[#2A5A4A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[15px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "قائمة الاستعداد للعمرة" : "Get ready for ʿUmrah"}
              </div>
              <div className={`mt-0.5 text-[12px] text-[#3E5E4B] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "جواز، تأشيرة، إحرام، فندق وأكثر" : "Passport, visa, iḥrām, hotel and more"}
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-[#2A5A4A] flex-shrink-0 ${isAr ? "rotate-180" : ""}`} />
          </div>
        </Link>
      </div>

      {/* QUICK ACCESS — 2×3 grid of the 6 most-used utility tools. */}
      <div className="mt-7" data-testid="home-quickaccess">
        <h2 className={`text-[18px] font-medium tracking-tight text-[#1C1D1B] mb-2.5 ${isAr ? "font-arabic" : ""}`}>
          {isAr ? "أدواتك" : "Your tools"}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <QuickTile to="/walk-haram" icon={Footprints}  accent="#7B5C24" en="Walk to Ḥaram" ar="إلى الحرم"     sub_en="Step-by-step directions"     sub_ar="توجيه سيرًا، خطوة بخطوة"     isAr={isAr} testid="home-walk-haram" />
          <QuickTile to="/group"  icon={Users}         accent="#B3884D" en="Stay together" ar="ابقَ معًا"      sub_en="Don't lose anyone"          sub_ar="لا تَضِع عن عائلتك"        isAr={isAr} testid="home-group" />
          <QuickTile to="/chat"   icon={MessageSquare} accent="#8B4540" en="Ask"           ar="اسأل"           sub_en="Fiqh and Umrah questions"    sub_ar="أسئلة الفقه والعمرة"      isAr={isAr} testid="home-chat" />
          <QuickTile to="/qibla"  icon={Compass}       accent="#7B5C24" en="Qibla"         ar="القبلة"         sub_en="Direction to the Ka'bah"     sub_ar="اتّجاه الكعبة"             isAr={isAr} testid="home-qibla" />
          <QuickTile to="/lost"   icon={MapPin}        accent="#8B4540" en="I'm lost"      ar="أنا تائه"       sub_en="Find the nearest gate"        sub_ar="أقرب باب"                  isAr={isAr} testid="home-lost" />
          <QuickTile to="/places" icon={Sparkles}      accent="#2A5A4A" en="Ziyārah (visits)" ar="الزّيارة"   sub_en="26 sacred places to visit"   sub_ar="٢٦ مكانًا للزّيارة"          isAr={isAr} testid="home-places" />
          <QuickTile to="/quiz"   icon={Trophy}        accent="#B3884D" en="Quiz"          ar="الاختبار"        sub_en="Test what you know"           sub_ar="اختبر معرفتك"                isAr={isAr} testid="home-quiz" />
        </div>
      </div>

      {/* DAILY ANCHORS — reminder + prayer times. Both are habit drivers. */}
      <DailyReminderCard reminder={reminder} isAr={isAr} />
      <div className="mt-4">
        <HaramLive isAr={isAr} />
      </div>
      <PrayerTimesCard isAr={isAr} />

      {/* TRAVEL & MORE — packages / DIY hotels-flights / best-months / pre-trip
          shop. Visible to EVERY persona (not just planners): even pilgrims
          who've "already been" may want to book their next trip, gift an
          Umrah package, or shop eSIM / Zamzam carriers. */}
      <div className="mt-7">
        <h2 className={`text-[18px] font-medium tracking-tight text-[#1C1D1B] mb-2.5 ${isAr ? "font-arabic" : ""}`}>
          {isAr ? "السّفر والمزيد" : "Travel & more"}
        </h2>
        <div className="grid grid-cols-2 gap-2" data-testid="home-travel">
          {/* Packages */}
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
            to="/hotels"
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
        {/* Secondary inline links — small, calm */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link
            to="/best-months"
            className="rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3 hover:border-[#B3884D] transition tap-pulse flex items-center gap-2.5"
            data-testid="home-best-months"
          >
            <CalendarDays className="w-4 h-4 text-[#7B5C24] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "متى تذهب" : "When to go"}
              </div>
              <div className={`text-[10px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "أفضل شهور العمرة" : "Best months"}
              </div>
            </div>
          </Link>
          <Link
            to="/shop"
            className="rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3 hover:border-[#B3884D] transition tap-pulse flex items-center gap-2.5"
            data-testid="home-shop"
          >
            <ShoppingBag className="w-4 h-4 text-[#7B5C24] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "متجر السّفر" : "Pre-trip shop"}
              </div>
              <div className={`text-[10px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "إحرام، كتب، شريحة" : "Iḥrām, books, eSIM"}
              </div>
            </div>
          </Link>
        </div>
      </div>

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
          setEditMode(false);
        }}
        isAr={isAr}
        editMode={editMode}
        initialAnswers={editMode ? profile : null}
      />

      {/* Edit action sheet — opens from the EDIT link on the trip card.
          Two clean sections so user can choose what to change. Mobile-native
          bottom sheet pattern; tap outside or Cancel to dismiss. */}
      {editSheetOpen && (
        <div className="fixed inset-0 z-[70]" data-testid="home-edit-sheet">
          <button
            type="button"
            aria-label={isAr ? "إغلاق" : "Close"}
            onClick={() => setEditSheetOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="absolute left-0 right-0 bottom-0 bg-[#F8F6F0] rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] max-w-md mx-auto"
          >
            <div className="w-12 h-1 rounded-full bg-[#E8E5DD] mx-auto mt-2.5" />
            <div className="px-5 pt-4 pb-3 border-b border-[#E8E5DD]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                {isAr ? "تعديل" : "Edit"}
              </p>
              <h3 className={`mt-1 text-[18px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                {isAr ? "ما الذي تريد تعديله؟" : "What would you like to change?"}
              </h3>
            </div>
            <div className="p-3 space-y-2">
              <button
                onClick={promptForDate}
                className="w-full text-left rounded-2xl bg-white border border-[#E8E5DD] hover:border-[#B3884D] p-3.5 tap-pulse transition active:scale-[0.99]"
                data-testid="home-edit-date"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FBF1DD] grid place-items-center flex-shrink-0">
                    <CalendarDays className="w-4 h-4 text-[#7B5C24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? "تاريخ السّفر" : "Travel date"}
                    </div>
                    <div className={`text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
                      {profile.tripDate
                        ? (isAr ? `الحالي: ${profile.tripDate}` : `Currently: ${profile.tripDate}`)
                        : (isAr ? "لم يُحدَّد بعد" : "Not set yet")}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
                </div>
              </button>
              <button
                onClick={openEditAnswers}
                className="w-full text-left rounded-2xl bg-white border border-[#E8E5DD] hover:border-[#B3884D] p-3.5 tap-pulse transition active:scale-[0.99]"
                data-testid="home-edit-answers"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FBF1DD] grid place-items-center flex-shrink-0">
                    <UserCog className="w-4 h-4 text-[#7B5C24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? "إجاباتي" : "My answers"}
                    </div>
                    <div className={`text-[11px] text-[#8E8F8A] truncate ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? `الحالي: ${answersSummary}` : `Currently: ${answersSummary}`}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
                </div>
              </button>
            </div>
            <div className="p-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              <button
                onClick={() => setEditSheetOpen(false)}
                className={`w-full rounded-full bg-[#1C1D1B] text-white py-3 text-[14px] font-medium tap-pulse ${isAr ? "font-arabic" : ""}`}
                data-testid="home-edit-cancel"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
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
          <div className="flex items-start justify-between gap-2">
            <div className={`text-[10px] uppercase tracking-[0.22em] text-[#B3884D] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "تذكير اليوم" : "Today's reminder"}
            </div>
            <button
              onClick={handleShare}
              className="w-7 h-7 rounded-full grid place-items-center text-[#8E8F8A] hover:text-[#1C1D1B] hover:bg-[#FBF1DD] transition active:scale-90"
              aria-label={isAr ? "مشاركة التّذكير" : "Share reminder"}
              data-testid="home-reminder-share"
            >
              {shared ? (
                <Check className="w-3.5 h-3.5 text-[#2A5A4A]" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
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

// ─── Quick Access tile — used in the 2×3 grid that replaced both the
// horizontal Discover scroll and the priority-card row.
function QuickTile({ to, icon: Icon, accent, en, ar, sub_en, sub_ar, isAr, testid }) {
  return (
    <Link
      to={to}
      className="block tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] hover:shadow-[0_8px_18px_-12px_rgba(179,136,77,0.4)] transition active:scale-[0.98]"
      data-testid={testid}
    >
      <div
        className="w-9 h-9 rounded-full grid place-items-center mb-2"
        style={{ background: `${accent}18`, boxShadow: `inset 0 0 0 1px ${accent}33` }}
      >
        <Icon className="w-[16px] h-[16px]" style={{ color: accent }} />
      </div>
      <div className={`text-[13px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? ar : en}
      </div>
      <div className={`mt-0.5 text-[10px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? sub_ar : sub_en}
      </div>
    </Link>
  );
}

// ─── Prayer times card ─ auto-uses the user's location (or falls back to
//     Makkah). Honours the "always show Makkah" preference from Settings.
function PrayerTimesCard({ isAr }) {
  const [data, setData] = React.useState(null);
  const [city, setCity] = React.useState(null);
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    let cancelled = false;
    const mode = (() => {
      try { return localStorage.getItem("umrah_prayer_mode") || "auto"; } catch { return "auto"; }
    })();
    const profile = (() => {
      try { return JSON.parse(localStorage.getItem("umrah_user_profile") || "{}"); } catch { return {}; }
    })();
    // In-Makkah persona always wants Makkah times.
    const forceMakkah = profile.purpose === "in-makkah" || mode === "makkah";

    const fetchTimingsByCoord = (lat, lng, label) => {
      axios
        .get("https://api.aladhan.com/v1/timings", {
          params: { latitude: lat, longitude: lng, method: 4 },
        })
        .then((r) => {
          if (cancelled) return;
          setData(r.data?.data?.timings);
          setCity(label);
        })
        .catch(() => {});
    };

    if (forceMakkah) {
      fetchTimingsByCoord(21.4225, 39.8262, isAr ? "مكّة" : "Makkah");
      return () => { cancelled = true; };
    }

    // Try cached last-known location first for instant render
    const cached = (() => {
      try {
        const raw = localStorage.getItem("umrah_last_known_geo");
        if (!raw) return null;
        const v = JSON.parse(raw);
        if (!v.lat || !v.lng) return null;
        if (Date.now() - (v.ts || 0) > 24 * 60 * 60 * 1000) return null;
        return v;
      } catch { return null; }
    })();
    if (cached) {
      fetchTimingsByCoord(cached.lat, cached.lng, cached.city || (isAr ? "موقعك" : "Your location"));
    }

    // Then ask the browser for fresh coords (silent, non-blocking)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          const { latitude: lat, longitude: lng } = pos.coords;
          // Reverse-geocode (free, no key — using a public Nominatim proxy
          // via Aladhan's calendarByCity endpoint isn't ideal for city names,
          // so we use OpenStreetMap Nominatim with a polite UA header).
          let label = isAr ? "موقعك" : "Your location";
          try {
            const rev = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
              { headers: { "Accept-Language": isAr ? "ar" : "en" } }
            );
            const j = await rev.json();
            const cityName = j.address?.city || j.address?.town || j.address?.village || j.address?.state;
            if (cityName) label = cityName;
          } catch { /* ignore — we keep the fallback label */ }
          fetchTimingsByCoord(lat, lng, label);
          try {
            localStorage.setItem("umrah_last_known_geo", JSON.stringify({ lat, lng, city: label, ts: Date.now() }));
          } catch {}
        },
        () => {
          // Geolocation denied → fallback to Makkah so the widget still works
          if (cancelled) return;
          if (!data) fetchTimingsByCoord(21.4225, 39.8262, isAr ? "مكّة" : "Makkah");
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60 * 60 * 1000 }
      );
    } else if (!data) {
      fetchTimingsByCoord(21.4225, 39.8262, isAr ? "مكّة" : "Makkah");
    }
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAr]);

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <div className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] p-4 flex items-center gap-2 text-[12px] text-[#8E8F8A]" data-testid="home-prayer-loading">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {isAr ? "تحميل أوقات الصّلاة..." : "Loading prayer times…"}
      </div>
    );
  }

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
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] inline-flex items-center gap-1" data-testid="prayer-city">
          <MapPin className="w-2.5 h-2.5" />
          {city || (isAr ? "أوقات الصّلاة" : "Prayer times")}
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

