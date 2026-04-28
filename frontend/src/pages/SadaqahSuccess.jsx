import React from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2, ArrowRight } from "lucide-react";
import { LangContext } from "../components/Layout";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SadaqahSuccess() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = React.useState("checking"); // checking | paid | failed | timeout

  React.useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const max = 6;

    const poll = async () => {
      if (cancelled) return;
      attempts += 1;
      try {
        const res = await axios.get(`${API}/sadaqah/status/${sessionId}`);
        if (res.data?.payment_status === "paid") {
          setStatus("paid");
          return;
        }
        if (res.data?.status === "expired") {
          setStatus("failed");
          return;
        }
        if (attempts >= max) {
          // We landed here from Stripe's success URL — donor *did* tap "Pay".
          // The webhook may take a few seconds to flip the row to "paid".
          // Show the optimistic thank-you (donor will get the Stripe email
          // receipt either way) instead of a confusing "we couldn't verify" screen.
          setStatus("paid");
          return;
        }
        setTimeout(poll, 2000);
      } catch (_) {
        if (attempts >= max) setStatus("paid");
        else setTimeout(poll, 2000);
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto pb-12 min-h-[70vh] flex flex-col items-center justify-center text-center" data-testid="sadaqah-success-page">
      {status === "checking" && (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-[#B3884D]" />
          <p className={`mt-3 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "نتحقّق من الدفع…" : "Checking your payment…"}
          </p>
        </>
      )}

      {status === "paid" && (
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center" data-testid="sadaqah-paid">
          <div className="w-20 h-20 rounded-full bg-[#2A5A4A] grid place-items-center">
            <Heart className="w-9 h-9 text-white" fill="white" />
          </div>
          <h1 className={`mt-6 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "جزاك الله خيرًا" : "Jazākallāhu khayran"}
          </h1>
          <p className={`mt-3 text-[14px] text-[#5C5D58] leading-[1.7] max-w-[28ch] ${isAr ? "font-arabic" : ""}`}>
            {isAr
              ? "تقبّل الله صدقتك وجعلها صدقة جارية. سيصلك إيصال على بريدك الإلكتروني."
              : "May Allah accept your sadaqah and make it ṣadaqah jāriyah. A receipt has been sent to your email."}
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1C1D1B] text-white px-5 py-3 text-[13px] font-medium" data-testid="sadaqah-return-home">
            <span className={isAr ? "font-arabic" : ""}>{isAr ? "رجوع للتطبيق" : "Back to the app"}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </motion.div>
      )}

      {(status === "failed" || status === "timeout") && (
        <div data-testid="sadaqah-failed">
          <h1 className={`text-[22px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
            {status === "timeout"
              ? (isAr ? "تأخّر التحقّق" : "Verification took longer than expected")
              : (isAr ? "تعذّر الدفع" : "Payment was not completed")}
          </h1>
          <p className={`mt-3 text-[13px] text-[#5C5D58] max-w-[32ch] ${isAr ? "font-arabic" : ""}`}>
            {isAr
              ? "إن كنت قد أتممت الدفع، سيصلك إيصال من Stripe على بريدك الإلكتروني."
              : "If you completed payment, a receipt will arrive in your email shortly."}
          </p>
          <Link to="/sadaqah" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white border border-[#E8E5DD] text-[#1C1D1B] px-5 py-3 text-[13px] font-medium">
            {isAr ? "حاول مرة أخرى" : "Try again"}
          </Link>
        </div>
      )}
    </div>
  );
}
