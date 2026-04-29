import React from "react";
import { motion } from "framer-motion";
import { Compass, Loader2, Smartphone, RotateCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import { bearing, formatDistance, haversine } from "../lib/geo";

// Centre of the Ka'bah
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function Qibla() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [coords, setCoords] = React.useState(null);
  const [geoErr, setGeoErr] = React.useState("");
  const [heading, setHeading] = React.useState(null); // device heading (deg, 0=N)
  const [needsPermission, setNeedsPermission] = React.useState(false);
  const [orientationErr, setOrientationErr] = React.useState("");

  // Get user coordinates
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setGeoErr(isAr ? "متصفّحك لا يدعم تحديد الموقع." : "Geolocation not supported on this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setGeoErr(
        e.code === 1
          ? (isAr ? "تم رفض إذن الموقع." : "Location permission denied.")
          : (isAr ? "تعذّر الحصول على الموقع." : "Could not get your location.")
      ),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [isAr]);

  // Listen to device orientation for live compass needle. iOS 13+ requires an
  // explicit user gesture before granting permission.
  const startOrientation = React.useCallback(async () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      setOrientationErr(isAr ? "البوصلة غير مدعومة على هذا الجهاز." : "Compass not supported on this device.");
      return;
    }
    // iOS-specific permission flow
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== "granted") {
          setOrientationErr(isAr ? "تم رفض إذن البوصلة." : "Compass permission denied.");
          return;
        }
      } catch (_) {
        setOrientationErr(isAr ? "تعذّر تشغيل البوصلة." : "Could not enable compass.");
        return;
      }
    }
    setNeedsPermission(false);
    setOrientationErr("");
    const handler = (e) => {
      // iOS: webkitCompassHeading is true compass heading (0 = N).
      // Android: alpha goes 0–360 but is opposite direction; convert: 360 - alpha
      let h = null;
      if (typeof e.webkitCompassHeading === "number") {
        h = e.webkitCompassHeading;
      } else if (typeof e.alpha === "number") {
        h = 360 - e.alpha;
      }
      if (h != null) setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
  }, [isAr]);

  React.useEffect(() => {
    // Auto-start on Android (no permission needed). iOS shows the "Enable" button.
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      setNeedsPermission(true);
    } else {
      startOrientation();
    }
  }, [startOrientation]);

  // Bearing from user → Ka'bah (true bearing, 0 = N)
  const qiblaBearing = coords ? bearing(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG) : null;
  const distance = coords ? haversine(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG) : null;

  // Needle rotation = qibla bearing relative to where the phone is pointing.
  const needleAngle = qiblaBearing != null && heading != null
    ? (qiblaBearing - heading + 360) % 360
    : qiblaBearing;

  const aligned = needleAngle != null && (needleAngle < 5 || needleAngle > 355);

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="qibla-page">
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "البوصلة" : "Compass"}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
          {isAr ? "اتجاه القبلة" : "Qibla direction"}
        </h1>
        <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
          {isAr
            ? "ضع هاتفك أفقيًا واتبع السهم نحو الكعبة المشرّفة."
            : "Lay your phone flat and follow the arrow toward the Holy Ka'bah."}
        </p>
      </div>

      {/* Compass dial */}
      <div className="mt-6 rounded-3xl bg-white border border-[#E8E5DD] p-6 flex flex-col items-center">
        {!coords && !geoErr ? (
          <div className="h-[280px] flex items-center justify-center text-[#8E8F8A] text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : geoErr ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-center px-4">
            <Compass className="w-8 h-8 text-[#B3884D] mb-3" />
            <div className="text-[14px] text-[#1C1D1B] font-medium">{geoErr}</div>
            <div className="text-[12px] text-[#8E8F8A] mt-1 max-w-[28ch]">
              {isAr
                ? "اسمح بالوصول إلى الموقع في إعدادات المتصفح."
                : "Allow location access in your browser settings."}
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-[280px] h-[280px]" data-testid="qibla-dial">
              <svg viewBox="0 0 280 280" className="w-full h-full">
                {/* Outer ring */}
                <circle cx="140" cy="140" r="130" fill="#F8F6F0" stroke="#E8E5DD" strokeWidth="1" />
                <circle cx="140" cy="140" r="110" fill="none" stroke="#EFEAE0" strokeWidth="1" strokeDasharray="2 4" />

                {/* Cardinal letters — these rotate with the device so N always points to true north */}
                <g transform={`rotate(${heading != null ? -heading : 0} 140 140)`}>
                  <text x="140" y="22" textAnchor="middle" fontSize="14" fontWeight="600" fill="#8B4540">N</text>
                  <text x="262" y="146" textAnchor="middle" fontSize="12" fill="#8E8F8A">E</text>
                  <text x="140" y="266" textAnchor="middle" fontSize="12" fill="#8E8F8A">S</text>
                  <text x="18" y="146" textAnchor="middle" fontSize="12" fill="#8E8F8A">W</text>

                  {/* Tick marks every 30° */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1="140" y1="14" x2="140" y2="22"
                      stroke="#B3A88A"
                      strokeWidth="1.5"
                      transform={`rotate(${i * 30} 140 140)`}
                    />
                  ))}
                </g>

                {/* Qibla needle — rotates to point toward the Ka'bah */}
                {needleAngle != null && (
                  <g
                    transform={`rotate(${needleAngle} 140 140)`}
                    style={{ transition: "transform 220ms ease-out" }}
                    data-testid="qibla-needle"
                  >
                    {/* Arrow shaft */}
                    <line x1="140" y1="140" x2="140" y2="40" stroke={aligned ? "#2A5A4A" : "#B3884D"} strokeWidth="3" strokeLinecap="round" />
                    {/* Arrowhead */}
                    <polygon
                      points="140,28 132,52 148,52"
                      fill={aligned ? "#2A5A4A" : "#B3884D"}
                    />
                    {/* Ka'bah icon at the tip */}
                    <rect x="131" y="14" width="18" height="14" fill="#1C1D1B" stroke="white" strokeWidth="1" rx="1" />
                    <rect x="131" y="22" width="18" height="2" fill="#B3884D" />
                  </g>
                )}

                {/* Centre pivot */}
                <circle cx="140" cy="140" r="6" fill="#1C1D1B" />
                <circle cx="140" cy="140" r="3" fill="#B3884D" />
              </svg>
            </div>

            {/* Bearing readout */}
            <div className="mt-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                {isAr ? "اتجاه الكعبة" : "Bearing to Ka'bah"}
              </div>
              <div className="mt-1 text-[28px] font-light tabular-nums text-[#1C1D1B]" data-testid="qibla-bearing">
                {qiblaBearing != null ? `${Math.round(qiblaBearing)}°` : "—"}
              </div>
              {distance != null && (
                <div className="text-[12px] text-[#5C5D58] mt-1" data-testid="qibla-distance">
                  {formatDistance(distance, isAr)} {isAr ? "إلى مكة" : "to Makkah"}
                </div>
              )}
              {aligned && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-[#2A5A4A] font-medium"
                  data-testid="qibla-aligned"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2A5A4A]" />
                  {isAr ? "أنت تواجه القبلة" : "You're facing the Qibla"}
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>

      {/* iOS permission prompt */}
      {needsPermission && coords && (
        <button
          onClick={startOrientation}
          className="mt-4 w-full tap-pulse rounded-full bg-[#1C1D1B] text-white text-sm font-medium px-5 py-3 inline-flex items-center justify-center gap-2"
          data-testid="qibla-enable-compass"
        >
          <Smartphone className="w-4 h-4" />
          {isAr ? "فعّل البوصلة" : "Enable compass"}
        </button>
      )}

      {orientationErr && (
        <div className="mt-3 text-[12px] text-[#8B4540] text-center" data-testid="qibla-orientation-err">
          {orientationErr}
        </div>
      )}

      {/* Tip */}
      <div className="mt-5 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-[#B3884D] mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-[#5C5D58] leading-relaxed">
            {isAr
              ? "إذا بدا السهم غير دقيق، حرّك هاتفك على شكل ثمانية ٨ بضع مرات لمعايرة البوصلة."
              : "If the needle drifts, wave your phone in a figure-8 a few times to recalibrate the compass."}
          </p>
        </div>
      </div>
    </div>
  );
}
