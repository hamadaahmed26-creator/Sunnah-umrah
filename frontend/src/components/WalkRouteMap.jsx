// In-app walking-directions map. Uses Leaflet + free OpenStreetMap tiles,
// and the public OSRM demo server for the route geometry + turn-by-turn
// steps. No API keys, no Google/Apple Maps — fully embedded in our app.
//
// Props:
//   from = { lat, lng }  — usually the user's GPS position
//   to   = { lat, lng, label_en?, label_ar? }
//   isAr = boolean
//   onClose? = () => void   (optional close button)
import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Loader2, X, Footprints, ChevronRight } from "lucide-react";

// Default Leaflet marker icons don't load via webpack — replace with inline SVG
const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 0 0 3px rgba(37,99,235,.25);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:#8B4540;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 4px 8px rgba(0,0,0,.25);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 22],
});

function FitBounds({ from, to, route }) {
  const map = useMap();
  React.useEffect(() => {
    if (!from || !to) return;
    const points = route?.length
      ? route.map(([lat, lng]) => L.latLng(lat, lng))
      : [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)];
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 17 });
  }, [from, to, route, map]);
  return null;
}

export default function WalkRouteMap({ from, to, isAr, onClose }) {
  const [route, setRoute] = React.useState(null);
  const [steps, setSteps] = React.useState([]);
  const [distance, setDistance] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!from || !to) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    // OSRM public demo — free, no key. Walking profile = "foot".
    const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.code !== "Ok" || !data.routes?.length) {
          throw new Error("no_route");
        }
        const r = data.routes[0];
        const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        setDistance(r.distance);
        setDuration(r.duration);
        const allSteps = (r.legs || []).flatMap((l) => l.steps || []);
        setSteps(allSteps);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Graceful fallback: just show a straight line if routing fails.
        setRoute([
          [from.lat, from.lng],
          [to.lat, to.lng],
        ]);
        const dist = haversine(from, to);
        setDistance(dist);
        setDuration(Math.round((dist / 1.4))); // ~1.4 m/s walking pace
        setSteps([]);
        setError("routing_unavailable");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const destLabel = to ? (isAr ? to.label_ar : to.label_en) || "" : "";
  const km = distance != null ? (distance / 1000).toFixed(2) : "—";
  const mins = duration != null ? Math.max(1, Math.round(duration / 60)) : "—";

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E5DD]" data-testid="walk-route-map">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8E5DD] bg-[#F8F6F0]">
        <Navigation className="w-4 h-4 text-[#2A5A4A]" />
        <div className="flex-1 min-w-0">
          <div className={`text-[13px] font-semibold text-[#1C1D1B] truncate ${isAr ? "font-arabic text-right" : ""}`}>
            {destLabel || (isAr ? "الوجهة" : "Destination")}
          </div>
          <div className={`text-[11px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
            {loading
              ? (isAr ? "جاري حساب المسار…" : "Routing…")
              : (isAr ? `${km} كم · حوالى ${mins} دقيقة سيرًا` : `${km} km · about ${mins} min walk`)}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-[#E8E5DD] tap-pulse"
            aria-label="close"
            data-testid="walk-route-close"
          >
            <X className="w-4 h-4 text-[#5C5D58]" />
          </button>
        )}
      </div>

      {/* Map */}
      <div className="relative" style={{ height: 300 }}>
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/70 backdrop-blur-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#2A5A4A]" />
          </div>
        )}
        {from && to && (
          <MapContainer
            center={[from.lat, from.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[from.lat, from.lng]} icon={userIcon} />
            <Marker position={[to.lat, to.lng]} icon={destIcon} />
            {route && (
              <Polyline positions={route} pathOptions={{ color: "#2A5A4A", weight: 5, opacity: 0.85 }} />
            )}
            <FitBounds from={from} to={to} route={route} />
          </MapContainer>
        )}
      </div>

      {/* Turn-by-turn steps. Only shown if we got real ones from OSRM. */}
      {steps.length > 0 && (
        <div className="max-h-[180px] overflow-y-auto">
          {steps.slice(0, 12).map((s, i) => {
            const m = s.maneuver || {};
            const instr = humanise(m, s, isAr);
            const meters = Math.round(s.distance || 0);
            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-4 py-2.5 ${i ? "border-t border-[#E8E5DD]" : ""}`}
                data-testid={`walk-step-${i}`}
              >
                <div className="w-7 h-7 rounded-full bg-[#F1F4F1] grid place-items-center flex-shrink-0">
                  <Footprints className="w-3.5 h-3.5 text-[#2A5A4A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12.5px] text-[#1C1D1B] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                    {instr}
                  </div>
                  {meters > 0 && (
                    <div className="text-[10px] text-[#8E8F8A]">
                      {meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters} m`}
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-[#8E8F8A] ${isAr ? "rotate-180" : ""}`} />
              </div>
            );
          })}
        </div>
      )}

      {error === "routing_unavailable" && (
        <div className={`px-4 py-2.5 text-[11px] text-[#8B4540] border-t border-[#E8E5DD] bg-[#FFF8F8] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "تعذّر تحميل التّوجيه — نعرض خطًّا مستقيمًا فقط."
            : "Detailed turn-by-turn unavailable — showing straight-line direction only."}
        </div>
      )}
    </div>
  );
}

// Haversine in metres
function haversine(a, b) {
  const R = 6371000;
  const t = (deg) => (deg * Math.PI) / 180;
  const dLat = t(b.lat - a.lat);
  const dLng = t(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Convert OSRM maneuver to a short, human sentence in EN or AR.
function humanise(m, step, isAr) {
  const type = m.type || "continue";
  const mod = m.modifier;
  const road = step.name || "";
  const T = (en, ar) => (isAr ? ar : en);

  const turnPhrase = (() => {
    if (type === "depart")  return T("Head out", "اتّجه إلى الأمام");
    if (type === "arrive")  return T("Arrive at destination", "وصلت إلى الوجهة");
    if (type === "turn") {
      const dir = mod === "left"        ? T("left", "يسارًا")
                : mod === "right"       ? T("right", "يمينًا")
                : mod === "sharp left"  ? T("sharp left", "يسارًا حادًّا")
                : mod === "sharp right" ? T("sharp right", "يمينًا حادًّا")
                : mod === "slight left" ? T("slightly left", "يسارًا قليلًا")
                : mod === "slight right"? T("slightly right", "يمينًا قليلًا")
                : T("straight", "للأمام");
      return T(`Turn ${dir}`, `انعطف ${dir}`);
    }
    if (type === "new name") return T("Continue", "تابع المسير");
    if (type === "continue") return T("Continue", "تابع المسير");
    if (type === "merge")    return T("Merge", "اندمج");
    if (type === "fork")     return T("Take the fork", "خذ المتفرّع");
    if (type === "end of road") return T("End of road", "نهاية الطّريق");
    if (type === "roundabout")  return T("At the roundabout", "عند الدّوار");
    return T("Continue", "تابع المسير");
  })();

  if (road && type !== "arrive" && type !== "depart") {
    return `${turnPhrase} · ${road}`;
  }
  return turnPhrase;
}
