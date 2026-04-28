import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { LangContext } from "../components/Layout";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PRESETS = [
  { key: "small",  amount: 3,  label_en: "Light",   label_ar: "خفيفة" },
  { key: "medium", amount: 7,  label_en: "Generous",label_ar: "كريمة" },
  { key: "large",  amount: 20, label_en: "Bountiful",label_ar: "وفيرة" },
];

export default function Sadaqah() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [selected, setSelected] = React.useState("medium");
  const [custom, setCustom] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  const isCustom = selected === "custom";

  const startCheckout = async () => {
    setErr("");
    setLoading(true);
    try {
      const body = {
        package: selected,
        origin_url: window.location.origin,
      };
      if (isCustom) {
        const amt = parseFloat(custom);
        if (!amt || amt < 1) {
          setErr(isAr ? "أدخل مبلغًا صحيحًا (الحد الأدنى $1)" : "Enter a valid amount ($1 minimum).");
          setLoading(false);
          return;
        }
        body.custom_amount = amt;
      }
      const res = await axios.post(`${API}/sadaqah/checkout`, body);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setErr(isAr ? "تعذّر بدء الدفع" : "Could not start checkout.");
        setLoading(false);
      }
    } catch (e) {
      setErr(e?.response?.data?.detail || (isAr ? "خطأ في الدفع" : "Checkout error."));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="sadaqah-page">
      <Link to="/plan" className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B]">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "رجوع" : "Back"}</span>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "صدقة" : "Sadaqah"}</p>
        <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "ادعم سُنّة العمرة" : "Support Sunnah Umrah"}
        </h1>
        <p className={`mt-3 text-[14px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "نقدّم هذا التطبيق مجّانًا لكلّ مسلم. صدقتك تُعيننا على تطويره، وتشغيل خوادم الذكاء الاصطناعي، وإبقاء الفتاوى متاحةً للجميع — صدقة جارية إن شاء الله."
            : "This app is free for every Muslim. Your sadaqah keeps it running — AI servers, hosting, and free guidance for everyone. May Allah accept it as ṣadaqah jāriyah."}
        </p>
      </div>

      <div className="mt-6 space-y-2" data-testid="sadaqah-presets">
        {PRESETS.map((p) => {
          const active = selected === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setSelected(p.key)}
              className={`w-full flex items-center justify-between rounded-2xl border px-4 py-4 transition ${
                active
                  ? "bg-[#2A5A4A] border-[#2A5A4A] text-white"
                  : "bg-white border-[#E8E5DD] text-[#1C1D1B] hover:border-[#B3884D]"
              }`}
              data-testid={`sadaqah-preset-${p.key}`}
            >
              <span className={`text-[14px] font-medium ${isAr ? "font-arabic" : ""}`}>
                {isAr ? p.label_ar : p.label_en}
              </span>
              <span className="text-[20px] font-semibold tabular-nums">${p.amount}</span>
            </button>
          );
        })}
        <button
          onClick={() => setSelected("custom")}
          className={`w-full flex items-center justify-between rounded-2xl border px-4 py-4 transition ${
            isCustom
              ? "bg-[#2A5A4A] border-[#2A5A4A] text-white"
              : "bg-white border-[#E8E5DD] text-[#1C1D1B] hover:border-[#B3884D]"
          }`}
          data-testid="sadaqah-preset-custom"
        >
          <span className={`text-[14px] font-medium ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "مبلغ مخصّص" : "Custom amount"}
          </span>
          <span className="text-[14px]">$ —</span>
        </button>
      </div>

      {isCustom && (
        <div className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] p-4">
          <label className={`text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "اكتب المبلغ بالدولار" : "Enter amount (USD)"}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[24px] text-[#5C5D58]">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              placeholder="10.00"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="flex-1 text-[24px] tabular-nums bg-transparent outline-none text-[#1C1D1B]"
              data-testid="sadaqah-custom-input"
            />
          </div>
        </div>
      )}

      {err && (
        <div className="mt-3 rounded-2xl bg-[#FBE9E7] text-[#8B4540] text-[12px] px-4 py-3" data-testid="sadaqah-error">
          {err}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={startCheckout}
        disabled={loading}
        className="mt-5 w-full rounded-full bg-[#1C1D1B] hover:bg-black text-white py-4 text-[15px] font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
        data-testid="sadaqah-checkout-btn"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
        <span className={isAr ? "font-arabic" : ""}>
          {loading ? (isAr ? "جارٍ التحويل…" : "Redirecting…") : (isAr ? "تابع للدفع الآمن" : "Continue to secure checkout")}
        </span>
      </motion.button>

      <p className={`mt-4 text-center text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? "الدفع آمن عبر Stripe — لا نخزّن بيانات بطاقتك." : "Secure payment via Stripe — we never store your card details."}
      </p>
    </div>
  );
}
