import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Sunset, BookOpen, Loader2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { LangContext } from "../components/Layout";
import { ramadanStatus, reminderForDay, RAMADAN_REMINDERS } from "../lib/ramadan";

function fmtCountdown(ms) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h, m, s };
}

export default function Ramadan() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const status = React.useMemo(() => ramadanStatus(), []);
  const [timings, setTimings] = React.useState(null);
  const [now, setNow] = React.useState(() => new Date());
  const [browseDay, setBrowseDay] = React.useState(null); // for "browse all reminders"

  // Fetch today's prayer times for Makkah (used to display Suhoor + Iftar).
  // Owner-aside: in production we could ask the user's city, but Makkah times
  // are the canonical Ramadan reference and good default.
  React.useEffect(() => {
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Makkah", country: "SA", method: 4 },
      })
      .then((r) => setTimings(r.data?.data))
      .catch(() => {});
  }, []);

  // Tick the countdown clock every second
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Pre-Ramadan countdown ────────────────────────────────────────
  if (status.state === "upcoming") {
    return (
      <div className="max-w-md mx-auto pb-12" data-testid="ramadan-page">
        <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2" data-testid="ramadan-back">
          <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
        </Link>
        <div className="mt-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "رمضان" : "Ramadan"}</p>
          <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
            {isAr ? "يقترب رمضان" : "Ramadan is coming"}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl bg-[#1C1D1B] text-white p-7 text-center"
          data-testid="ramadan-countdown"
        >
          <Moon className="w-9 h-9 mx-auto text-[#B3884D]" />
          <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
            {isAr ? "يبدأ رمضان بإذن الله بعد" : "Ramadan begins, in shāʾa Allāh, in"}
          </div>
          <div className="mt-3 text-[64px] font-light tabular-nums leading-none">
            {status.daysUntil}
          </div>
          <div className="mt-1 text-[14px] text-white/70">
            {status.daysUntil === 1
              ? (isAr ? "يومًا واحدًا" : "day")
              : (isAr ? "أيّام" : "days")}
          </div>
          <div className="mt-4 text-[12px] text-white/60">
            {status.start.toLocaleDateString(isAr ? "ar" : "en-GB", { day: "numeric", month: "long", year: "numeric" })} · {isAr ? `١ رمضان ${status.hijriYear}` : `1 Ramadan ${status.hijriYear} AH`}
          </div>
          <p className="mt-5 text-[12px] text-white/60 leading-relaxed">
            {isAr
              ? "البداية الفعليّة وفق رؤية الهلال محلّيًّا."
              : "Actual start follows local moon-sighting."}
          </p>
        </motion.div>

        <div className="mt-5 rounded-2xl bg-white border border-[#E8E5DD] p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#B3884D] mt-0.5 flex-shrink-0" />
            <p className={`text-[13px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "قال النبي ﷺ: «من صام رمضان إيمانًا واحتسابًا غُفر له ما تقدّم من ذنبه»."
                : "The Prophet ﷺ said: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins are forgiven.' (Bukhari 38)"}
            </p>
          </div>
        </div>

        <BrowseAllReminders isAr={isAr} day={browseDay} setDay={setBrowseDay} />
      </div>
    );
  }

  // ─── During Ramadan ───────────────────────────────────────────────
  if (status.state === "during") {
    const reminder = reminderForDay(status.day);
    // Compute Iftar countdown using Maghrib time
    let iftarCountdown = null;
    if (timings?.timings?.Maghrib) {
      const [h, m] = timings.timings.Maghrib.split(":").map((n) => parseInt(n, 10));
      const iftar = new Date(now);
      iftar.setHours(h, m, 0, 0);
      iftarCountdown = fmtCountdown(iftar - now);
    }

    return (
      <div className="max-w-md mx-auto pb-12" data-testid="ramadan-page">
        <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2" data-testid="ramadan-back">
          <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
        </Link>
        <div className="mt-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[#B3884D]">{isAr ? `يوم ${status.day}` : `Day ${status.day}`}</p>
          <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
            {isAr ? "رمضان مبارك" : "Ramadān Mubārak"}
          </h1>
        </div>

        {/* Iftar countdown — the hero card during Ramadan */}
        {iftarCountdown ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-3xl bg-[#1C1D1B] text-white p-6"
            data-testid="iftar-countdown"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                  {isAr ? "الإفطار خلال" : "Iftar in"}
                </div>
                <div className="mt-2 text-[44px] font-light tabular-nums leading-none">
                  {String(iftarCountdown.h).padStart(2, "0")}:{String(iftarCountdown.m).padStart(2, "0")}:{String(iftarCountdown.s).padStart(2, "0")}
                </div>
              </div>
              <Sunset className="w-10 h-10 text-[#B3884D]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
              {timings?.timings?.Imsak && (
                <div className="rounded-xl bg-white/5 px-3 py-2.5 flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-white/60" />
                  <div>
                    <div className="text-white/50 text-[10px]">{isAr ? "الإمساك" : "Sahūr ends"}</div>
                    <div className="font-medium tabular-nums">{timings.timings.Imsak}</div>
                  </div>
                </div>
              )}
              <div className="rounded-xl bg-white/5 px-3 py-2.5 flex items-center gap-2">
                <Sunset className="w-3.5 h-3.5 text-white/60" />
                <div>
                  <div className="text-white/50 text-[10px]">{isAr ? "المغرب" : "Maghrib"}</div>
                  <div className="font-medium tabular-nums">{timings.timings.Maghrib}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-white/40">{isAr ? "بتوقيت مكّة المكرّمة" : "Makkah time"}</div>
          </motion.div>
        ) : (
          <div className="mt-5 rounded-3xl bg-[#1C1D1B] text-white p-6 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
            <span className="text-[12px] text-white/60">{isAr ? "جاري تحميل الأوقات..." : "Loading prayer times…"}</span>
          </div>
        )}

        {/* Daily reminder */}
        <motion.div
          key={reminder.day}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 rounded-3xl bg-white border border-[#E8E5DD] p-5"
          data-testid="daily-reminder"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
            <Sparkles className="w-3 h-3" /> {isAr ? "تذكير اليوم" : "Today's reminder"}
          </div>
          <h2 className={`mt-3 text-[20px] font-medium leading-snug text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? reminder.title_ar : reminder.title_en}
          </h2>
          <p className={`mt-3 text-[14px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? reminder.body_ar : reminder.body_en}
          </p>
          {reminder.source && reminder.source !== "—" && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-[#8E8F8A]">
              <BookOpen className="w-3 h-3" />
              {reminder.source}
            </div>
          )}
        </motion.div>

        <BrowseAllReminders isAr={isAr} day={browseDay} setDay={setBrowseDay} currentDay={status.day} />
      </div>
    );
  }

  // ─── Default fallback (post-Ramadan or year not in our table) ─────
  return (
    <div className="max-w-md mx-auto pb-12" data-testid="ramadan-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2" data-testid="ramadan-back">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>
      <div className="mt-1">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "رمضان" : "Ramadan"}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
          {isAr ? "ذكريات رمضانيّة" : "Ramadan reflections"}
        </h1>
        <p className="mt-2 text-[14px] text-[#5C5D58]">
          {isAr ? "تصفّح تذكيرات الشّهر الكريم في أيّ وقت." : "Browse the Ramadan reminders any time of year."}
        </p>
      </div>
      <BrowseAllReminders isAr={isAr} day={browseDay} setDay={setBrowseDay} />
    </div>
  );
}

function BrowseAllReminders({ isAr, day, setDay, currentDay = null }) {
  // If a specific day is selected, show its reminder
  const selected = day != null ? reminderForDay(day) : null;
  return (
    <div className="mt-7">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
        {isAr ? "كلّ التذكيرات" : "All daily reminders"}
      </div>
      {selected ? (
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-4" data-testid="browse-selected">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDay(null)}
              className="text-[11px] text-[#8E8F8A] underline"
              data-testid="browse-close"
            >
              {isAr ? "رجوع" : "Back"}
            </button>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
              {isAr ? `يوم ${selected.day}` : `Day ${selected.day}`}
            </div>
          </div>
          <h3 className={`mt-2 text-[18px] font-medium ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? selected.title_ar : selected.title_en}
          </h3>
          <p className={`mt-2 text-[13px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? selected.body_ar : selected.body_en}
          </p>
          {selected.source && selected.source !== "—" && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-[#8E8F8A]">
              <BookOpen className="w-3 h-3" /> {selected.source}
            </div>
          )}
          <div className="mt-3 flex justify-between text-[11px]">
            <button
              onClick={() => setDay(Math.max(1, selected.day - 1))}
              disabled={selected.day <= 1}
              className="inline-flex items-center gap-1 text-[#1C1D1B] disabled:text-[#C4BFB3]"
            >
              <ChevronLeft className="w-3 h-3" /> {isAr ? "السّابق" : "Previous"}
            </button>
            <button
              onClick={() => setDay(Math.min(30, selected.day + 1))}
              disabled={selected.day >= 30}
              className="inline-flex items-center gap-1 text-[#1C1D1B] disabled:text-[#C4BFB3]"
            >
              {isAr ? "التّالي" : "Next"} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2" data-testid="browse-grid">
          {RAMADAN_REMINDERS.map((r) => {
            const isToday = r.day === currentDay;
            return (
              <button
                key={r.day}
                onClick={() => setDay(r.day)}
                className={`aspect-square rounded-xl text-[13px] font-medium tabular-nums border transition active:scale-[0.97] ${
                  isToday
                    ? "bg-[#B3884D] text-white border-[#B3884D]"
                    : "bg-white text-[#1C1D1B] border-[#E8E5DD] hover:border-[#B3884D]"
                }`}
                data-testid={`browse-day-${r.day}`}
              >
                {r.day}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
