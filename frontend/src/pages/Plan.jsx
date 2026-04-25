import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sun, Moon, Loader2, ArrowRight, RefreshCw, Footprints } from "lucide-react";
import { Link } from "react-router-dom";
import { LangContext } from "../components/Layout";

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function parseHM(str) {
  const [h, m] = str.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

export default function Plan() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  const tawafCount = parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10);
  const saiCount = parseInt(localStorage.getItem("umrah_sai_count") || "0", 10);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Makkah", country: "SA", method: 4 },
      })
      .then((r) => setData(r.data?.data))
      .catch(() => setErr("Could not load prayer times."))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  let nextPrayer = null;
  if (data?.timings) {
    for (const name of PRAYER_NAMES) {
      const t = data.timings[name];
      if (t && parseHM(t) > nowMin) {
        nextPrayer = { name, time: t };
        break;
      }
    }
    if (!nextPrayer) nextPrayer = { name: "Fajr", time: data.timings.Fajr, tomorrow: true };
  }

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="plan-page">
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "اليوم" : "Today"}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
          {isAr ? "خطّة يومك" : "Your day in Makkah"}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-3xl bg-[#1C1D1B] text-[#F8F6F0] p-6"
        data-testid="next-prayer-card"
      >
        {loading ? (
          <div className="flex items-center gap-2 text-white/70 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading prayer times…</div>
        ) : err ? (
          <div className="text-sm text-white/70">{err}</div>
        ) : nextPrayer ? (
          <>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
              {isAr ? "الصلاة القادمة" : "Next prayer"}
              {nextPrayer.tomorrow && (isAr ? " · غداً" : " · tomorrow")}
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-[44px] font-light tracking-tight tabular-nums">{nextPrayer.time}</div>
              <div className="text-[20px] font-medium">{nextPrayer.name}</div>
            </div>
            <div className="mt-3 text-[12px] text-white/60">
              Makkah · {data?.date?.readable}
            </div>
          </>
        ) : null}
      </motion.div>

      {data?.timings && (
        <div className="mt-4 rounded-3xl bg-white border border-[#E8E5DD] p-2" data-testid="prayer-grid">
          {PRAYER_NAMES.map((name) => {
            const time = data.timings[name];
            const past = time && parseHM(time) <= nowMin;
            const isNext = nextPrayer?.name === name && !nextPrayer?.tomorrow;
            return (
              <div
                key={name}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                  isNext ? "bg-[#F8F6F0] border border-[#B3884D]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {name === "Fajr" || name === "Isha" ? (
                    <Moon className="w-4 h-4 text-[#5C5D58]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#B3884D]" />
                  )}
                  <span className={`text-[14px] ${past ? "text-[#8E8F8A]" : "text-[#1C1D1B]"} ${isNext ? "font-semibold" : ""}`}>{name}</span>
                </div>
                <span className={`tabular-nums text-[14px] ${past ? "text-[#8E8F8A]" : "text-[#1C1D1B]"}`}>{time}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-7">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
          {isAr ? "متابعة العمرة" : "Resume your Umrah"}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/tawaf"
            className="tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-4 hover:border-[#B3884D]"
            data-testid="resume-tawaf"
          >
            <div className="flex items-center gap-2 text-[#5C5D58] text-[11px] uppercase tracking-[0.18em]">
              <RefreshCw className="w-3.5 h-3.5" /> Tawaf
            </div>
            <div className="mt-2 text-[28px] font-light text-[#1C1D1B] tabular-nums">{tawafCount}/7</div>
            <div className="mt-1 text-[12px] text-[#B3884D] inline-flex items-center gap-1">
              {tawafCount === 0 ? "Start" : tawafCount >= 7 ? "Complete" : "Continue"} <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
          <Link
            to="/sai"
            className="tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-4 hover:border-[#B3884D]"
            data-testid="resume-sai"
          >
            <div className="flex items-center gap-2 text-[#5C5D58] text-[11px] uppercase tracking-[0.18em]">
              <Footprints className="w-3.5 h-3.5" /> Sa'i
            </div>
            <div className="mt-2 text-[28px] font-light text-[#1C1D1B] tabular-nums">{saiCount}/7</div>
            <div className="mt-1 text-[12px] text-[#B3884D] inline-flex items-center gap-1">
              {saiCount === 0 ? "Start" : saiCount >= 7 ? "Complete" : "Continue"} <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
