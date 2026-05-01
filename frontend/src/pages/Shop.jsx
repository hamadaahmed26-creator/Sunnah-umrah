import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";
import { SHOP_CATEGORIES, SHOP_PRODUCTS, productsByCategory } from "../lib/shop";

export default function Shop() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [active, setActive] = React.useState(SHOP_CATEGORIES[0].id);
  const items = productsByCategory(active);

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="shop-page">
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "متجر السّفر" : "Pre-trip shop"}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
          {isAr ? "كلّ ما تحتاجه قبل الإقلاع" : "Pack what you'll need — before you fly"}
        </h1>
        <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
          {isAr
            ? "منتقاة بعناية. تُشحن إلى منزلك من Amazon UK قبل سفرك."
            : "Hand-picked. Delivered to your UK door from Amazon UK — before you fly."}
        </p>
        {/* Reality reminder — important so users aren't confused about Zamzam */}
        <div className="mt-3 rounded-xl bg-[#FFF8EE] border border-[#EBD9B0] p-3 flex items-start gap-2">
          <span className="text-[14px] flex-shrink-0">💡</span>
          <p className={`text-[11px] text-[#6E5424] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr
              ? "هذه أدوات قبل السّفر. لا يمكن شحن ماء زمزم تجاريًّا — ستحصل على ٥ لتر مجّانيّة من مطار جدّة عند العودة."
              : "These are pre-trip essentials shipped in the UK. Zamzam water itself can't be sold or shipped — you'll receive a free 5L bottle at Jeddah airport on the way home."}
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mt-5 -mx-5 px-5 overflow-x-auto" data-testid="shop-categories">
        <div className="flex gap-2 min-w-max">
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-3 py-2 rounded-full text-[12px] font-medium border transition whitespace-nowrap ${
                active === c.id
                  ? "bg-[#1C1D1B] text-white border-[#1C1D1B]"
                  : "bg-white text-[#1C1D1B] border-[#E8E5DD] hover:border-[#B3884D]"
              }`}
              data-testid={`shop-cat-${c.id}`}
            >
              <span className="mr-1">{c.icon_emoji}</span>
              {isAr ? c.label_ar : c.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-5 grid grid-cols-1 gap-3" data-testid="shop-products">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} isAr={isAr} />
        ))}
      </div>

      {/* Affiliate disclosure (legally required for Amazon Associates / CJ) */}
      <div className="mt-7 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2A5A4A] mt-0.5 flex-shrink-0" />
          <p className={`text-[11px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr
              ? "بعض الرّوابط تحت برامج الإحالة مع Amazon UK وBooking.com وAiralo وSkyscanner. عندما تشتري عبرها قد نحصل على عمولةٍ صغيرةٍ تساعد على تطوير التّطبيق — دون أيّة تكلفة عليك. نختار فقط ما يفيد الحاجّ فعلًا."
              : "Some links use affiliate programs with Amazon UK, Booking.com, Airalo, and Skyscanner. When you buy through them, we may earn a small commission that helps keep this app running — at no extra cost to you. We only feature items genuinely useful to pilgrims."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, isAr }) {
  const { name_en, name_ar, desc_en, desc_ar, price, url, internal, source, tag } = product;
  const cls =
    "block tap-pulse rounded-2xl bg-gradient-to-br from-white to-[#FBF8F1] border border-[#E8E5DD] hover:border-[#B3884D] hover:shadow-[0_8px_18px_-12px_rgba(179,136,77,0.4)] transition active:scale-[0.99] p-4";
  const Inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-[#B3884D] bg-[#FBF1DD] rounded-full px-1.5 py-0.5 font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              {isAr ? "مختار" : "Curated"}
            </span>
            {tag === "before" && (
              <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-[#2A5A4A] bg-[#E7F1EB] rounded-full px-1.5 py-0.5 font-semibold">
                {isAr ? "قبل السّفر" : "Pack before you fly"}
              </span>
            )}
            {tag === "souvenir" && (
              <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider text-[#8B4540] bg-[#F4E1DF] rounded-full px-1.5 py-0.5 font-semibold">
                {isAr ? "سنّة يوميّة" : "Sunnah daily essentials"}
              </span>
            )}
          </div>
          <h3 className={`text-[15px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`} data-testid={`product-name-${product.id}`}>
            {isAr ? name_ar : name_en}
          </h3>
          <p className={`mt-1.5 text-[12px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? desc_ar : desc_en}
          </p>
        </div>
        {price != null && (
          <div className="text-right flex-shrink-0">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#8E8F8A]">{isAr ? "السّعر" : "From"}</div>
            <div className="mt-0.5 text-[18px] font-medium tabular-nums text-[#1C1D1B]" data-testid={`product-price-${product.id}`}>
              £{price.toFixed(2)}
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[#8E8F8A]">
          {sourceLabel(source, isAr)}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1C1D1B]">
          {price != null
            ? (isAr ? "اشترِ" : "Buy")
            : (isAr ? "تصفّح" : "Browse")}
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </>
  );
  return internal ? (
    <Link to={url} className={cls} data-testid={`product-${product.id}`}>{Inner}</Link>
  ) : (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cls}
      data-testid={`product-${product.id}`}
    >
      {Inner}
    </a>
  );
}

function sourceLabel(source, isAr) {
  switch (source) {
    case "amazon":     return "Amazon UK";
    case "booking":    return "Booking.com";
    case "airalo":     return "Airalo";
    case "skyscanner": return "Skyscanner";
    default:           return isAr ? "شريك" : "Partner";
  }
}
