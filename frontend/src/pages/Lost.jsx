import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";
import WalkRouteMap from "../components/WalkRouteMap";
import { describeGeoError } from "../lib/locationErrors";
import { bearing, haversine, compass8Localised } from "../lib/geo";
import { getCurrentPosition } from "../lib/geolocation";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;

export default function Lost() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  const [loading, setLoading] = React.useState(false);
  const [errInfo, setErrInfo] = React.useState(null);
  const [coords, setCoords] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [shareWithRouter, setShareWithRouter] = React.useState(false);

  const locate = async () => {
    setLoading(true);
    setErrInfo(null);
    try {
      const { lat, lng, accuracy } = await getCurrentPosition({ timeoutMs: 12000 });
      setCoords({ lat, lng });
      if (!Number.isFinite(accuracy) || accuracy > 100) {
        setErrInfo({title:isAr ? "دقة الموقع غير كافية" : "Location is too uncertain",
          message:isAr ? "تحقّق من رقم الباب أو اسأل موظفي الحرم." : "Check a posted gate number or ask mosque staff."});
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/gates`, {timeout:10000});
        const ranked = res.data.filter(g => Number.isFinite(g.lat) && Number.isFinite(g.lng)).map(gate => ({
          gate, distance_km:haversine(lat,lng,gate.lat,gate.lng)/1000,
          bearing_deg:bearing(lat,lng,gate.lat,gate.lng)
        })).sort((a,b) => a.distance_km-b.distance_km);
        if (!ranked.length) throw new Error("No mapped gates");
        setData({...ranked[0],accuracy,others:ranked.slice(1,4)});
      } catch (e) {
        setErrInfo({
          title: lang === "ar" ? "خطأ في الخادم" : "Server error",
          message: lang === "ar"
            ? "تعذّر تحميل أبواب الحرم. تحقّق من الاتّصال وحاول مرّة أخرى."
            : "Couldn't load Haram gates. Check your connection and try again.",
          steps: null,
        });
      }
    } catch (err) {
      setErrInfo(describeGeoError(err, lang === "ar"));
    }
    setLoading(false);
  };

  const isAr = lang === "ar";

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
            {isAr ? "ابحث عن باب على الخريطة" : "Find a mapped gate"}
          </h1>
          <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
            {isAr
              ? "اعرض المسافة التقريبية بخط مستقيم إلى الأبواب المسجّلة. اتبع اللوحات وإرشادات الموظفين."
              : "Compare approximate straight-line distances to mapped gates. Follow posted signs and staff directions."}
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
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#B3884D]">{isAr ? "باب على الخريطة" : "Mapped gate"}</div>
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
                {Math.round(data.bearing_deg)}° {compass8Localised(data.bearing_deg,isAr)}
              </div>
            </div>
          </div>

          <p>GPS ±{Math.round(data.accuracy)} m</p>
          {coords && !shareWithRouter && <button onClick={() => setShareWithRouter(true)}>
            {isAr ? "شارك موقعك مع مزوّد الخرائط لعرض مسار تقريبي" : "Share my location with the map provider to see an estimated route"}
          </button>}
          {coords && shareWithRouter && (
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
                setShareWithRouter(false);
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
