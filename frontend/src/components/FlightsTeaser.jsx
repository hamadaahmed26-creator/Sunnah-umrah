import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plane, ArrowRight } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Live "Flights from £X to Jeddah this week" banner.
 * Pulled live from TravelPayouts via /api/flights/cheapest, cached server-side
 * 30 min. Falls back silently if the API is down — no broken UI.
 */
export default function FlightsTeaser({ isAr = false, destination = "JED" }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await axios.get(`${API}/api/flights/cheapest`, {
          params: { destination, currency: "gbp" },
          timeout: 8000,
        });
        if (!cancelled && r.data && !r.data.empty) setData(r.data);
      } catch (_) { /* silent — banner just hides */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [destination]);

  if (loading || !data) return null;

  const city = destination === "MED"
    ? (isAr ? "المدينة" : "Madinah")
    : (isAr ? "جدّة" : "Jeddah");

  return (
    <Link
      to="/flights"
      data-testid="home-flights-teaser"
      className="mt-4 block tap-pulse rounded-2xl border border-[#EBD9B0] bg-gradient-to-r from-[#FFF7E6] to-[#F4DCA1] p-3.5 hover:border-[#B3884D] hover:shadow-[0_10px_22px_-12px_rgba(179,136,77,0.55)] transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#EBD9B0]">
          <Plane className="w-[18px] h-[18px] text-[#7B5C24]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] uppercase tracking-[0.18em] text-[#8B6A1F] font-semibold ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "أرخص رحلات الأسبوع" : "Cheapest flights this week"}
          </div>
          <div className={`mt-0.5 text-[14px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr
              ? `لندن ← ${city} من £${data.price}`
              : `London → ${city} from £${data.price}`}
          </div>
          <div className={`mt-0.5 text-[11px] text-[#6E5424] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
            {data.airline} · {data.depart_date}
            {data.transfers === 0 ? (isAr ? " · مباشر" : " · direct") : ""}
          </div>
        </div>
        <ArrowRight className={`w-4 h-4 text-[#7B5C24] flex-shrink-0 ${isAr ? "rotate-180" : ""}`} />
      </div>
    </Link>
  );
}
