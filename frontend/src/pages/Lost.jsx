import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, MapPin, Navigation, Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";
import WalkRouteMap from "../components/WalkRouteMap";
import { describeGeoError } from "../lib/locationErrors";
import { saveLastKnownGeo } from "../lib/prayerPreferences";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function bearingLabel(deg, lang) {
  const dirs_en = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirs_ar = ["ش", "شش", "ش‎ق", "ج‎ق", "ج", "ج‎غ", "غ", "ش‎غ"];
  const d = (lang === "ar" ? dirs_ar : dirs_en)[Math.round(deg / 45) % 8];
  return `${Math.round(deg)}° ${d}`;
}

export default function Lost() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  const [loading, setLoading] = React.useState(false);
  const [errInfo, setErrInfo] = React.useState(null);
  const [coords, setCoords] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [heading, setHeading] = React.useState(0);

  const locate = () => {
    if (!navigator.geolocation) {
      setErrInfo(describeGeoError({ code: 2 }, lang === "ar"));
      return;
    }
    setLoading(true);
    setErrInfo(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        saveLastKnownGeo({ lat, lng });
        try {
          const res = await axios.post(`${API}/gates/nearest`, { lat, lng });
          setData(res.data);
        } catch (e) {
          setErrInfo({
            title: lang === "ar" ? "خطأ في الخادم" : "Server error",
            message: lang === "ar"
              ? "تعذّر تحميل أبواب الحرم. تحقّق من الاتّصال وحاول مرّة أخرى."
              : "Couldn't load Haram gates. Check your connection and try again.",
            steps: null,
          });
        }
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setErrInfo(describeGeoError(err, lang === "ar"));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  React.useEffect(() => {
    const onOrient = (e) => {
      // alpha: rotation around z-axis (0..360)
      if (typeof e.alpha === "number") setHeading(e.alpha);
    };
    window.addEventListener("deviceorientation", onOrient, true);
    return () => window.removeEventListener("deviceorientation", onOrient, true);
  }, []);

  const isAr = lang === "ar";
  const targetBearing = data?.bearing_deg ?? 0;
  const arrowAngle = (targetBearing - heading + 360) % 360;

  // Native-maps fallback (small secondary link only — never the primary CTA)
  const openExternalMaps = () => {
    const dest = data?.gate ? `${data.gate.lat},${data.gate.lng}` : "21.4225,39.8262";
    const ua = navigator.userAgent || "";
    const url = /iPad|iPhone|iPod|Macintosh/i.test(ua)
      ? `https://maps.apple.com/?daddr=${dest}&q=Masjid+al-Haram&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="lost-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8B4540]">{t("lost")}</p>
          <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
            {isAr ? "اعثر على أقرب باب" : "Find your nearest gate"}
          </h1>
          <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
            {isAr
              ? "اضغط الزرّ ليحدّد الـ GPS أقرب باب من المسجد الحرام إليك ويُريك المسار سيرًا."
              : "Tap the button to use GPS, find the nearest Bab (gate) of Masjid al-Haram, and get walking directions in-app."}
          </p>
        </div>
      </div>

      {!data && (
        <>
          <button
            onClick={locate}
            disabled={loading}
            className="mt-6 w-full tap-pulse inline-flex items-center justify-center gap-2 rounded-full bg-[#8B4540] hover:bg-[#713934] text-white px-6 py-4 text-sm font-medium"
            data-testid="locate-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            {loading ? t("locating") : t("enableLocation")}
          </button>
          <p className="mt-3 text-center text-xs text-[#8E8F8A]" data-testid="lost-hint">
            {isAr
              ? "يحتاج التطبيق إلى إذن الموقع (GPS) للعمل."
              : "This feature needs location (GPS) permission to work."}
          </p>

          <div className="mt-4 rounded-2xl border border-[#E8E5DD] bg-white p-3 text-[12px] text-[#5C5D58] leading-relaxed">
            <p className={isAr ? "font-arabic text-right" : ""}>
              {isAr
                ? "يعمل الـ GPS بدقّة على هاتفك حين تكون في الخارج. نُغطّي ١٢ بابًا رئيسيًا للمسجد الحرام (الملك عبد العزيز، السلام، الفتح، العمرة، الملك فهد، أم هانئ، أجياد، الصفا، بني شيبة، المروة، القرارة، النبي ﷺ)."
                : "GPS works most accurately on your phone outdoors. We cover the 12 main gates of Masjid al-Haram (King Abdulaziz, Salam, Fath, Umrah, King Fahd, Umm Hani, Ajyad, Safa, Bani Shaybah, Marwah, Qarara, Nabi)."}
            </p>
          </div>
        </>
      )}

      {errInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-[#FFF8F8] border border-[#EBD5D2] p-4"
          data-testid="lost-error"
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
              data-testid="lost-retry"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              {isAr ? "حاول مرّة أخرى" : "Try again"}
            </button>
          </div>
        </motion.div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-[#E8E5DD] bg-white p-6"
          data-testid="nearest-gate-card"
        >
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#B3884D]">{t("nearestGate")}</div>
          <div className="mt-2 text-[22px] font-medium text-[#1C1D1B] leading-tight" data-testid="nearest-gate-name">
            {isAr ? data.gate.name_ar : data.gate.name_en}
          </div>
          <div className="mt-1 text-sm text-[#5C5D58]">
            Bab #{data.gate.number}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{t("distance")}</div>
              <div className="mt-1 text-2xl font-light text-[#1C1D1B] tabular-nums">
                {(data.distance_km * 1000).toFixed(0)}
                <span className="text-sm text-[#5C5D58] ms-1">m</span>
              </div>
            </div>
            <div className="rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{t("bearing")}</div>
              <div className="mt-1 text-2xl font-light text-[#1C1D1B] tabular-nums">
                {bearingLabel(data.bearing_deg, lang)}
              </div>
            </div>
          </div>

          <div className="mt-7 flex justify-center" style={{ direction: "ltr" }}>
            <div className="relative w-44 h-44 rounded-full border border-[#E8E5DD] grid place-items-center bg-[#F8F6F0]">
              <div className="absolute top-2 text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">N</div>
              <motion.div
                className="absolute inset-0 grid place-items-center"
                animate={{ rotate: arrowAngle }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                <Navigation className="w-12 h-12 text-[#2A5A4A]" strokeWidth={2.2} fill="#2A5A4A" />
              </motion.div>
              <Compass className="absolute w-44 h-44 text-[#E8E5DD]" strokeWidth={1} />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-[#8E8F8A]">
            {isAr ? "وجّه هاتفك في اتجاه السهم الأخضر" : "Point your phone toward the green arrow"}
          </p>

          {/* In-app walking-route map with turn-by-turn (OSRM, no Google) — primary action */}
          {coords && (
            <div className="mt-6" data-testid="lost-route-map">
              <WalkRouteMap
                from={coords}
                to={{
                  lat: data.gate.lat,
                  lng: data.gate.lng,
                  label_en: data.gate.name_en,
                  label_ar: data.gate.name_ar,
                }}
                isAr={isAr}
              />
            </div>
          )}

          {data.others?.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">{t("others")}</div>
              <ul className="space-y-2" data-testid="other-gates">
                {data.others.map((o) => (
                  <li
                    key={o.gate.id}
                    className="flex items-center justify-between rounded-xl border border-[#E8E5DD] bg-white px-4 py-3 text-sm"
                  >
                    <span className="text-[#1C1D1B]">{isAr ? o.gate.name_ar : o.gate.name_en}</span>
                    <span className="text-[#8E8F8A] tabular-nums">{(o.distance_km * 1000).toFixed(0)} m</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer — re-check + small secondary fallback */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setData(null);
                setCoords(null);
                setErrInfo(null);
              }}
              className="text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] inline-flex items-center gap-1 tap-pulse"
              data-testid="lost-recheck"
            >
              <RefreshCcw className="w-3 h-3" />
              {isAr ? "إعادة الفحص" : "Re-check location"}
            </button>
            <button
              onClick={openExternalMaps}
              className="text-[11px] text-[#5C5D58] hover:text-[#1C1D1B] underline-offset-2 hover:underline tap-pulse"
              data-testid="open-maps"
            >
              {isAr ? "افتح في خرائط الهاتف" : "Open in phone maps"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
