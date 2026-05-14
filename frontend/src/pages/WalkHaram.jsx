import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Loader2, Footprints, AlertTriangle, RefreshCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import WalkRouteMap from "../components/WalkRouteMap";
import { describeGeoError } from "../lib/locationErrors";
import { saveLastKnownGeo } from "../lib/prayerPreferences";
import { getCurrentPosition } from "../lib/geolocation";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Walk to the Ḥaram — focused, single-purpose page. Auto-locates, then
// shows the in-app walking map straight to the nearest gate. No compass
// arrow, no "Bab #" UI — that's what /lost is for. This page is the
// "I'm in Makkah, just take me there" tile from the home grid.
export default function WalkHaram() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [phase, setPhase] = React.useState("idle"); // idle | locating | routing | ready | error
  const [coords, setCoords] = React.useState(null);
  const [gate, setGate] = React.useState(null);
  const [errInfo, setErrInfo] = React.useState(null);

  const locate = React.useCallback(async () => {
    setPhase("locating");
    setErrInfo(null);
    try {
      const { lat, lng } = await getCurrentPosition({ timeoutMs: 12000 });
      setCoords({ lat, lng });
      saveLastKnownGeo({ lat, lng });
      setPhase("routing");
      try {
        const res = await axios.post(`${API}/gates/nearest`, { lat, lng });
        setGate(res.data?.gate);
        setPhase("ready");
      } catch (e) {
        setPhase("error");
        setErrInfo({
          title: isAr ? "خطأ في الخادم" : "Server error",
          message: isAr
            ? "تعذّر تحميل أبواب الحرم. تحقّق من الاتّصال وحاول مرّة أخرى."
            : "Couldn't load Haram gates. Check your connection and try again.",
          steps: null,
        });
      }
    } catch (err) {
      setPhase("error");
      setErrInfo(describeGeoError(err, isAr));
    }
  }, [isAr]);

  // No auto-trigger on mount — iOS Capacitor WebView shows the
  // permission prompt better when triggered from an explicit user tap.

  // Native fallback link (small, secondary)
  const openExternalMaps = () => {
    const dest = gate ? `${gate.lat},${gate.lng}` : "21.4225,39.8262";
    const ua = navigator.userAgent || "";
    const url = /iPad|iPhone|iPod|Macintosh/i.test(ua)
      ? `https://maps.apple.com/?daddr=${dest}&q=Masjid+al-Haram&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="walk-haram-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2" data-testid="walk-haram-back">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>

      <p className="text-xs uppercase tracking-[0.22em] text-[#8B4540]">
        {isAr ? "اتّجه إلى الحرم" : "Walk to the Ḥaram"}
      </p>
      <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
        {isAr ? "خذني إلى المسجد الحرام" : "Take me to Masjid al-Ḥaram"}
      </h1>
      <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
        {isAr
          ? "نوجّهك سيرًا على الأقدام إلى أقرب باب من المسجد الحرام، خطوة بخطوة."
          : "We'll guide you on foot to the nearest gate of Masjid al-Ḥaram, step by step."}
      </p>

      {/* Idle state — explicit user tap to start locating */}
      {phase === "idle" && (
        <button
          onClick={locate}
          className="mt-6 w-full tap-pulse inline-flex items-center justify-center gap-2 rounded-full bg-[#8B4540] hover:bg-[#713934] text-white px-6 py-4 text-sm font-medium"
          data-testid="walk-haram-start"
        >
          <MapPin className="w-4 h-4" />
          {isAr ? "ابدأ التّوجيه إلى الحرم" : "Find my way to the Ḥaram"}
        </button>
      )}

      {/* Locating state */}
      {(phase === "locating" || phase === "routing") && (
        <div
          className="mt-6 rounded-2xl bg-white border border-[#E8E5DD] p-4 flex items-center gap-3 text-sm text-[#5C5D58]"
          data-testid="walk-haram-loading"
        >
          <Loader2 className="w-4 h-4 animate-spin text-[#2A5A4A]" />
          {phase === "locating"
            ? (isAr ? "جاري تحديد موقعك…" : "Finding your location…")
            : (isAr ? "جاري حساب أقرب باب…" : "Finding the nearest gate…")}
        </div>
      )}

      {/* Error state — friendly, platform-aware */}
      {phase === "error" && errInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-[#FFF8F8] border border-[#EBD5D2] p-4"
          data-testid="walk-haram-error"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#8B4540] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                {errInfo.title}
              </div>
              <p className={`mt-1 text-[12.5px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                {errInfo.message}
              </p>
              {errInfo.steps && (
                <ol className={`mt-2 list-decimal text-[12px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right pr-5" : "pl-5"}`}>
                  {errInfo.steps.map((s, i) => (
                    <li key={i} className="mb-0.5">{s}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={locate}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] text-white text-[13px] font-medium px-4 py-2.5 tap-pulse"
              data-testid="walk-haram-retry"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              {isAr ? "حاول مرّة أخرى" : "Try again"}
            </button>
            <button
              onClick={openExternalMaps}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#E8E5DD] bg-white text-[#1C1D1B] text-[13px] font-medium px-4 py-2.5 tap-pulse"
              data-testid="walk-haram-external"
            >
              <Footprints className="w-3.5 h-3.5" />
              {isAr ? "افتح خرائط الجوّال" : "Use phone maps"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Ready — show the in-app walking map */}
      {phase === "ready" && coords && gate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
          data-testid="walk-haram-ready"
        >
          <div className="mb-2 flex items-center gap-2 text-[12px] text-[#5C5D58]">
            <MapPin className="w-3.5 h-3.5 text-[#8B4540]" />
            <span className={isAr ? "font-arabic" : ""}>
              {isAr
                ? `أقرب باب: ${gate.name_ar}`
                : `Nearest gate: ${gate.name_en} (Bab #${gate.number})`}
            </span>
          </div>
          <WalkRouteMap
            from={coords}
            to={{
              lat: gate.lat,
              lng: gate.lng,
              label_en: `${gate.name_en} · Masjid al-Ḥaram`,
              label_ar: `${gate.name_ar} · المسجد الحرام`,
            }}
            isAr={isAr}
          />

          {/* Small secondary fallback — opens native maps app */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={locate}
              className="text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] inline-flex items-center gap-1 tap-pulse"
              data-testid="walk-haram-recheck"
            >
              <RefreshCcw className="w-3 h-3" />
              {isAr ? "إعادة الفحص" : "Re-check location"}
            </button>
            <button
              onClick={openExternalMaps}
              className="text-[11px] text-[#5C5D58] hover:text-[#1C1D1B] underline-offset-2 hover:underline tap-pulse"
              data-testid="walk-haram-open-external"
            >
              {isAr ? "افتح في خرائط الهاتف" : "Open in phone maps"}
            </button>
          </div>

          <p className={`mt-4 text-[11px] text-[#8E8F8A] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr
              ? "تعمل التّوجيهات داخل التّطبيق دون الحاجة لفتح خرائط جوجل أو آبل."
              : "Walking directions work entirely inside the app — no need to open Google or Apple Maps."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
