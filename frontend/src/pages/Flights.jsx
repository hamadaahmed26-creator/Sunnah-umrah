import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plane, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { LangContext } from "../components/Layout";
import { affiliateDisclosure } from "../lib/affiliate";

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Live flight search page (TravelPayouts / Aviasales Data API).
 * Lets the user toggle JED ↔ MED. Each card opens Aviasales with our affiliate
 * marker so commission attributes back. Prices are 48h-cached from Aviasales
 * users' recent searches — accurate enough for "from £X" comparison.
 */
export default function Flights() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [destination, setDestination] = React.useState("JED");
  const [rows, setRows] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const r = await axios.get(`${API}/api/flights/search`, {
          params: { destination, currency: "gbp", limit: 15, one_way: true },
          timeout: 12000,
        });
        if (!cancelled) setRows(r.data.results || []);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.detail || e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [destination]);

  return (
    <div className="px-4 pt-6 pb-24 max-w-2xl mx-auto" data-testid="flights-page">
      <Link
        to="/"
        data-testid="flights-back"
        className="inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B] mb-4"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>
      <h1 className={`text-[26px] font-semibold tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? "رحلات إلى الحجاز" : "Flights to the Ḥijāz"}
      </h1>
      <p className={`mt-1 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "أسعار محدّثة كل ساعة من Aviasales — اضغط للحجز."
          : "Live prices refreshed hourly from Aviasales — tap any card to book."}
      </p>

      {/* JED / MED toggle */}
      <div className="mt-5 inline-flex rounded-full bg-[#F0EDE5] p-1 border border-[#E8E5DD]" data-testid="flights-toggle">
        {[
          { code: "JED", en: "Jeddah",  ar: "جدّة" },
          { code: "MED", en: "Madinah", ar: "المدينة" },
        ].map((d) => (
          <button
            key={d.code}
            onClick={() => setDestination(d.code)}
            data-testid={`flights-dest-${d.code}`}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${
              destination === d.code
                ? "bg-[#1C1D1B] text-white"
                : "text-[#5C5D58] hover:text-[#1C1D1B]"
            }`}
          >
            {isAr ? d.ar : d.en}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-5 space-y-2.5" data-testid="flights-results">
        {loading && (
          <div className="flex items-center gap-2 text-[#5C5D58] text-[13px] py-6 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isAr ? "جارٍ البحث عن أرخص الأسعار..." : "Finding the cheapest fares..."}
          </div>
        )}
        {err && !loading && (
          <div className="rounded-xl border border-[#F1C0A4] bg-[#FFF1E9] text-[#8B4540] text-[13px] p-3">
            {isAr ? "تعذّر تحميل الأسعار. أعد المحاولة." : "Couldn't load prices. Please try again."}
          </div>
        )}
        {!loading && !err && rows && rows.length === 0 && (
          <div className="rounded-xl border border-[#E8E5DD] bg-[#F8F6F0] text-[#5C5D58] text-[13px] p-4 text-center">
            {isAr ? "لا توجد أسعار محفوظة الآن — حاول لاحقًا." : "No cached fares right now — try later."}
          </div>
        )}
        {!loading && rows && rows.map((r, i) => (
          <a
            key={`${r.airline}-${r.depart_date}-${i}`}
            href={r.book_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-testid={`flight-card-${i}`}
            className="block tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-4 hover:border-[#B3884D] hover:shadow-[0_10px_22px_-14px_rgba(179,136,77,0.45)] transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FFF7E6] grid place-items-center flex-shrink-0 border border-[#EBD9B0]">
                <Plane className="w-[19px] h-[19px] text-[#7B5C24]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <div className="text-[20px] font-bold text-[#1C1D1B] leading-none">£{r.price}</div>
                  <div className="text-[11px] text-[#8E8F8A] uppercase tracking-[0.12em] font-semibold">
                    {r.airline}
                    {r.flight_number ? ` ${r.flight_number}` : ""}
                  </div>
                </div>
                <div className="mt-1.5 text-[12.5px] text-[#3F3722]">
                  {r.depart_date}
                  {r.return_date ? ` → ${r.return_date}` : (isAr ? " · ذهاب فقط" : " · one way")}
                  {" · "}
                  {r.transfers === 0
                    ? (isAr ? "مباشر" : "direct")
                    : (isAr ? `${r.transfers} توقّف` : `${r.transfers} stop${r.transfers > 1 ? "s" : ""}`)}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#B3884D] flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>

      <p className={`mt-6 text-[10.5px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
        {affiliateDisclosure(isAr)}
      </p>
    </div>
  );
}
