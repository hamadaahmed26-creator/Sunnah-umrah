import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Footprints, Compass, MessageCircle, BookOpen, CalendarClock, Users } from "lucide-react";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Home() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);

  const actions = [
    { to: "/tawaf", icon: RefreshCw, label: t("tawafCounter"), id: "tawaf" },
    { to: "/sai", icon: Footprints, label: t("saiCounter"), id: "sai" },
    { to: "/lost", icon: Compass, label: t("findGate"), id: "lost" },
    { to: "/chat", icon: MessageCircle, label: t("askScholar"), id: "chat" },
    { to: "/plan", icon: CalendarClock, label: lang === "ar" ? "خطّة اليوم" : "Today's plan", id: "plan" },
    { to: "/group", icon: Users, label: lang === "ar" ? "مجموعة العائلة" : "Family group", id: "group" },
  ];

  return (
    <div className="max-w-md mx-auto" data-testid="home-page">
      <motion.section {...fade} transition={{ duration: 0.5 }} className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{t("welcome")}</p>
        <h1 className="mt-2 text-[34px] leading-[1.05] font-light tracking-tight text-[#1C1D1B]" data-testid="home-tagline">
          {t("tagline")}
        </h1>
        <p className="mt-3 text-[15px] text-[#5C5D58] max-w-[34ch]">{t("subWelcome")}</p>
      </motion.section>

      <motion.section
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-7 rounded-[28px] overflow-hidden border border-[#E8E5DD] bg-[#1C1D1B] text-[#F8F6F0]"
        data-testid="home-hero-card"
      >
        <div className="p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#B3884D]">Guide</div>
          <div className="mt-2 text-[22px] font-medium leading-tight">
            {lang === "ar" ? "الإحرام · الطواف · السعي · الحلق" : "Ihram · Tawaf · Sa'i · Halq"}
          </div>
          <p className="mt-3 text-sm text-white/70 max-w-[36ch]">
            {lang === "ar"
              ? "ست خطوات على هدي السنة، مع الأدعية الصحيحة وكيفية أدائها."
              : "Six steps on the Prophetic way, with authentic du'as and how to perform them."}
          </p>
          <Link
            to="/guide"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B3884D] hover:bg-[#997441] text-white text-sm font-medium px-5 py-3"
            data-testid="start-guide-btn"
          >
            <BookOpen className="w-4 h-4" />
            {t("startGuide")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          className="h-28 w-full bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(28,29,27,0) 0%, rgba(28,29,27,0.9) 90%), url("https://images.unsplash.com/photo-1591604157118-b94e2684f857?crop=entropy&cs=srgb&fm=jpg&q=80&w=900")',
          }}
        />
      </motion.section>

      <motion.section {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="mt-7">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-3">{t("quickActions")}</div>
        <div className="grid grid-cols-2 gap-3" data-testid="quick-actions">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.id}
                to={a.to}
                className="tap-pulse rounded-2xl bg-white border border-[#E8E5DD] p-4 flex flex-col gap-3 hover:border-[#B3884D] transition-colors"
                data-testid={`quick-${a.id}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] grid place-items-center">
                  <Icon className="w-[18px] h-[18px] text-[#1C1D1B]" />
                </div>
                <div className="text-sm font-medium text-[#1C1D1B] leading-snug">{a.label}</div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      <motion.section {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="mt-7 mb-4">
        <div className="rounded-2xl border border-[#E8E5DD] bg-white p-5">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8E8F8A]">Reminder</div>
          <p className={`mt-2 text-[15px] text-[#1C1D1B] ${lang === "ar" ? "font-arabic text-right" : ""}`}>
            {lang === "ar"
              ? "«إنّما الأعمالُ بالنيّاتِ» — حدّد نيّتك ولْتَحضُر قلبك."
              : "“Actions are by intentions.” — Renew your intention; bring your heart present."}
          </p>
        </div>
      </motion.section>
    </div>
  );
}
