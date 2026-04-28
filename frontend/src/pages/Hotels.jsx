import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, ArrowLeft, ExternalLink, Calendar, Users, Building2, Wifi } from "lucide-react";
import { LangContext } from "../components/Layout";

// Booking.com Affiliate ID — sign up free at https://www.booking.com/affiliate-program
// then paste your AID below (or set REACT_APP_BOOKING_AID in .env). Until set,
// the search still works but the user pays full price (no commission to you).
const BOOKING_AID = process.env.REACT_APP_BOOKING_AID || "";

// Airalo eSIM affiliate referral code — sign up free at
// https://www.airalo.com/affiliate-program. Paste your code below or set
// REACT_APP_AIRALO_REF in .env. Default is the Airalo deep link to the
// Saudi Arabia eSIM page so users can buy data before their trip.
const AIRALO_REF = process.env.REACT_APP_AIRALO_REF || "";

const CITIES = [
  {
    key: "makkah",
    name_en: "Makkah",
    name_ar: "مكة المكرمة",
    subtitle_en: "Walking distance to the Ḥaram",
    subtitle_ar: "بالقرب من المسجد الحرام",
    ss: "Makkah,Saudi Arabia",
    image: "/images/places/jabal-al-nur.jpg",
  },
  {
    key: "madinah",
    name_en: "Madīnah",
    name_ar: "المدينة المنورة",
    subtitle_en: "Near Masjid an-Nabawī",
    subtitle_ar: "قرب المسجد النبوي",
    ss: "Medina,Saudi Arabia",
    image: "/images/places/masjid-nabawi.jpg",
  },
];

function plusDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
}

export default function Hotels() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const today = new Date().toISOString().slice(0, 10);
  const [checkin, setCheckin] = React.useState(today);
  const [checkout, setCheckout] = React.useState(plusDays(new Date(), 7));
  const [adults, setAdults] = React.useState(2);

  const buildBookingUrl = (city) => {
    const params = new URLSearchParams({
      ss: city.ss,
      checkin,
      checkout,
      group_adults: String(adults),
      no_rooms: "1",
      group_children: "0",
    });
    if (BOOKING_AID) params.set("aid", BOOKING_AID);
    return `https://www.booking.com/searchresults.html?${params.toString()}`;
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="hotels-page">
      <Link to="/plan" className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B]">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "رجوع" : "Back"}</span>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "السفر" : "Travel"}</p>
        <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "احجز فندقًا" : "Book a hotel"}
        </h1>
        <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "بحث مباشر على Booking.com — آلاف الفنادق في مكة والمدينة." : "Live search on Booking.com — thousands of hotels in Makkah & Madīnah."}
        </p>
      </div>

      {/* Date / guest selector */}
      <div className="mt-5 rounded-2xl bg-white border border-[#E8E5DD] p-4 grid grid-cols-2 gap-3" data-testid="hotels-form">
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {isAr ? "الوصول" : "Check-in"}
          </label>
          <input
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className="mt-1 w-full bg-transparent outline-none text-[14px] text-[#1C1D1B]"
            data-testid="hotels-checkin"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {isAr ? "المغادرة" : "Check-out"}
          </label>
          <input
            type="date"
            min={checkin}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className="mt-1 w-full bg-transparent outline-none text-[14px] text-[#1C1D1B]"
            data-testid="hotels-checkout"
          />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {isAr ? "الضيوف" : "Guests"}
          </label>
          <div className="mt-1 flex items-center gap-3">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-8 h-8 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] text-[#1C1D1B]"
              data-testid="hotels-guests-minus"
            >−</button>
            <span className="text-[18px] tabular-nums w-8 text-center" data-testid="hotels-guests-value">{adults}</span>
            <button
              onClick={() => setAdults(Math.min(8, adults + 1))}
              className="w-8 h-8 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] text-[#1C1D1B]"
              data-testid="hotels-guests-plus"
            >+</button>
            <span className={`text-[12px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "كبار" : adults === 1 ? "adult" : "adults"}
            </span>
          </div>
        </div>
      </div>

      {/* City cards */}
      <div className="mt-5 space-y-3" data-testid="hotels-cities">
        {CITIES.map((c, i) => (
          <motion.a
            key={c.key}
            href={buildBookingUrl(c)}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="block rounded-2xl bg-white border border-[#E8E5DD] overflow-hidden hover:border-[#B3884D] transition active:scale-[0.99]"
            data-testid={`hotels-city-${c.key}`}
          >
            <div className="relative aspect-[16/8] bg-[#1C1D1B]">
              <img src={c.image} alt={c.name_en} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <div className={`text-[18px] font-semibold ${isAr ? "font-arabic" : ""}`}>{isAr ? c.name_ar : c.name_en}</div>
                <div className={`text-[11px] opacity-85 ${isAr ? "font-arabic" : ""}`}>{isAr ? c.subtitle_ar : c.subtitle_en}</div>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-[#1C1D1B]">
                <Hotel className="w-4 h-4 text-[#B3884D]" />
                <span className={isAr ? "font-arabic" : ""}>{isAr ? "ابحث عن الفنادق" : "Search hotels"}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#5C5D58]" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* eSIM data — Airalo affiliate */}
      <div className="mt-5">
        <div className={`text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2 ${isAr ? "font-arabic" : ""}`}>
          {isAr ? "بيانات الهاتف" : "Mobile data"}
        </div>
        <a
          href={`https://www.airalo.com/saudi-arabia-esim${AIRALO_REF ? `?utm_source=sunnahumrah&utm_medium=affiliate&ref=${encodeURIComponent(AIRALO_REF)}` : ""}`}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl bg-white border border-[#E8E5DD] p-4 hover:border-[#B3884D] transition active:scale-[0.99]"
          data-testid="hotels-esim"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F8F6F0] grid place-items-center flex-shrink-0">
              <Wifi className="w-4 h-4 text-[#2A5A4A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "شريحة eSIM للسعودية" : "Saudi Arabia eSIM"}
              </div>
              <div className={`text-[12px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "بيانات فورية على هاتفك — Airalo" : "Instant data on your phone · Airalo"}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#8E8F8A]" />
          </div>
        </a>
      </div>

      {/* Disclosure — required by Booking.com affiliate terms */}
      <div className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
        <div className="flex items-start gap-2 text-[11px] text-[#5C5D58] leading-relaxed">
          <Building2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8E8F8A]" />
          <p className={isAr ? "font-arabic text-right" : ""}>
            {isAr
              ? "نتعاون مع Booking.com وAiralo — قد نحصل على عمولة صغيرة عند الحجز عبر هذه الروابط، بدون أيّ تكلفة إضافية عليك."
              : "We partner with Booking.com and Airalo — we may earn a small commission on bookings made through these links, at no extra cost to you."}
          </p>
        </div>
      </div>
    </div>
  );
}
