import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Check, RotateCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import { CHECKLIST_ITEMS } from "../lib/checklist";
import { loadProfile } from "../lib/userProfile";

const STORAGE_KEY = "umrah_checklist";

function loadTicks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveTicks(t) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {}
}

export default function Checklist() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const profile = loadProfile();

  const [ticks, setTicks] = React.useState(() => loadTicks());

  // Personalise: filter gender-specific + travelers-specific items.
  // We don't collect gender in onboarding yet, so show BOTH the ♂ Iḥrām
  // and ♀ modest items to everyone — users tick whichever applies. That
  // beats forcing a gender question in a religious context.
  const items = React.useMemo(() => {
    return CHECKLIST_ITEMS.filter((i) => {
      if (i.travelers_only && profile.travelers !== i.travelers_only) return false;
      return true;
    });
  }, [profile.travelers]);

  const essentials = items.filter((i) => i.tier === "essential");
  const recommended = items.filter((i) => i.tier === "recommended");
  const totalCount = items.length;
  const tickedCount = items.filter((i) => ticks[i.id]).length;
  const pct = totalCount === 0 ? 0 : Math.round((tickedCount / totalCount) * 100);

  const toggle = (id) => {
    const next = { ...ticks, [id]: !ticks[id] };
    setTicks(next);
    saveTicks(next);
  };
  const markAll = () => {
    const next = {};
    items.forEach((i) => { next[i.id] = true; });
    setTicks(next);
    saveTicks(next);
  };
  const reset = () => {
    setTicks({});
    saveTicks({});
  };

  // Group items by group_en within each tier for visual headers.
  const groupByGroup = (list) => {
    const out = [];
    let currentGroup = null;
    for (const it of list) {
      const gKey = it.group_en;
      if (gKey !== currentGroup) {
        out.push({ isHeader: true, group_en: it.group_en, group_ar: it.group_ar, icon: it.group_icon });
        currentGroup = gKey;
      }
      out.push({ isHeader: false, item: it });
    }
    return out;
  };

  return (
    <div className="max-w-md mx-auto pb-28" data-testid="checklist-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2"
        data-testid="checklist-back"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>

      <p className="text-xs uppercase tracking-[0.22em] text-[#8B4540]">
        {isAr ? "قائمة الاستعداد" : "Readiness checklist"}
      </p>
      <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? "تجهّز للعمرة" : "Get ready for ʿUmrah"}
      </h1>
      <p className={`mt-2 text-[14px] text-[#5C5D58] max-w-[36ch] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "قبل أن تبدأ، تأكّد من أنّك جهّزت كلّ ما يلزم. هذه القائمة ترشدك خطوة بخطوة."
          : "Before you begin, make sure you have everything ready. This checklist walks you through it, step by step."}
      </p>

      {/* Progress bar */}
      <div className="mt-5 rounded-2xl bg-white border border-[#E8E5DD] p-4" data-testid="checklist-progress">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.22em] text-[#B3884D] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "الجاهزيّة" : "Your progress"}
            </p>
            <p className={`mt-0.5 text-[22px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? `أنت جاهز ${pct}%` : `You're ${pct}% ready`}
            </p>
          </div>
          <p className="text-[12px] text-[#8E8F8A] tabular-nums flex-shrink-0">
            {tickedCount} / {totalCount}
          </p>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-[#F1EFE8] overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-[#2A5A4A]"
            data-testid="checklist-progress-fill"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={markAll}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#E8E5DD] bg-white text-[#1C1D1B] tap-pulse inline-flex items-center gap-1.5 ${isAr ? "font-arabic" : ""}`}
            data-testid="checklist-mark-all"
          >
            <Check className="w-3 h-3" />
            {isAr ? "تمّ كلّ شيء" : "Mark all complete"}
          </button>
          {tickedCount > 0 && (
            <button
              onClick={reset}
              className={`text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] inline-flex items-center gap-1 tap-pulse ${isAr ? "font-arabic" : ""}`}
              data-testid="checklist-reset"
            >
              <RotateCcw className="w-3 h-3" />
              {isAr ? "إعادة" : "Reset"}
            </button>
          )}
        </div>
      </div>

      {/* ESSENTIAL */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#2A5A4A]" />
          <h2 className={`text-[11px] uppercase tracking-[0.22em] text-[#2A5A4A] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "أساسيّ — مطلوب" : "Essential — required"}
          </h2>
        </div>
        <p className={`text-[12px] text-[#5C5D58] leading-snug mb-3 ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "هذه الأمور لا بدّ منها لأداء العمرة." : "These are required to perform ʿUmrah."}
        </p>
        <div className="space-y-2">
          {groupByGroup(essentials).map((row, i) =>
            row.isHeader ? (
              <GroupHeader key={`h-${i}`} icon={row.icon} en={row.group_en} ar={row.group_ar} isAr={isAr} />
            ) : (
              <ChecklistRow key={row.item.id} item={row.item} checked={!!ticks[row.item.id]} onToggle={() => toggle(row.item.id)} isAr={isAr} />
            )
          )}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="mt-7">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#B3884D]" />
          <h2 className={`text-[11px] uppercase tracking-[0.22em] text-[#B3884D] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "مُستحسَن — مفيد" : "Recommended — helpful"}
          </h2>
        </div>
        <p className={`text-[12px] text-[#5C5D58] leading-snug mb-3 ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "هذه تسهّل عليك الرّحلة وتجعلها أريح." : "These will make your journey smoother."}
        </p>
        <div className="space-y-2">
          {groupByGroup(recommended).map((row, i) =>
            row.isHeader ? (
              <GroupHeader key={`h-${i}`} icon={row.icon} en={row.group_en} ar={row.group_ar} isAr={isAr} />
            ) : (
              <ChecklistRow key={row.item.id} item={row.item} checked={!!ticks[row.item.id]} onToggle={() => toggle(row.item.id)} isAr={isAr} />
            )
          )}
        </div>
      </div>

      {/* Final CTA */}
      <Link
        to="/tour"
        className="mt-7 flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] text-white px-6 py-4 text-[14px] font-medium tap-pulse"
        data-testid="checklist-start-tour"
      >
        {isAr ? "أنا جاهز — ابدأ دليل العمرة" : "I'm ready — start ʿUmrah guide"}
        <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
      </Link>
    </div>
  );
}

function GroupHeader({ icon, en, ar, isAr }) {
  return (
    <div className={`flex items-center gap-2 pt-1 ${isAr ? "flex-row-reverse" : ""}`}>
      <span className="text-[15px] leading-none">{icon}</span>
      <h3 className={`text-[12px] font-semibold text-[#1C1D1B] uppercase tracking-[0.15em] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? ar : en}
      </h3>
    </div>
  );
}

function ChecklistRow({ item, checked, onToggle, isAr }) {
  const [open, setOpen] = React.useState(false);
  const title = isAr ? item.title_ar : item.title_en;
  const info = isAr ? item.info_ar : item.info_en;
  const shopLabel = isAr ? item.shop_ar : item.shop_en;
  const learnLabel = isAr ? item.learn_ar : item.learn_en;

  return (
    <div
      className={`rounded-2xl border p-3 transition ${
        checked ? "bg-[#F4F8F4] border-[#C5DBC9]" : "bg-white border-[#E8E5DD]"
      }`}
      data-testid={`checklist-item-${item.id}`}
    >
      <div className={`flex items-start gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
        <button
          onClick={onToggle}
          aria-checked={checked}
          role="checkbox"
          className="flex-shrink-0 mt-0.5 tap-pulse"
          data-testid={`checklist-tick-${item.id}`}
        >
          {checked ? (
            <CheckCircle2 className="w-5 h-5 text-[#2A5A4A]" strokeWidth={2.2} />
          ) : (
            <Circle className="w-5 h-5 text-[#C6C7C1]" strokeWidth={1.8} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full text-left tap-pulse ${isAr ? "text-right" : ""}`}
            data-testid={`checklist-expand-${item.id}`}
          >
            <p className={`text-[13.5px] font-medium leading-snug ${checked ? "text-[#3E5E4B] line-through" : "text-[#1C1D1B]"} ${isAr ? "font-arabic" : ""}`}>
              {title}
            </p>
            {(info || item.shop_to || item.learn_to) && (
              <p className={`mt-0.5 text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
                {open ? (isAr ? "إخفاء التّفاصيل" : "Hide details") : (isAr ? "التّفاصيل" : "Details")}
              </p>
            )}
          </button>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              {info && (
                <p className={`mt-2 text-[12.5px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                  {info}
                </p>
              )}
              {(item.shop_to || item.learn_to) && (
                <div className={`mt-2 flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                  {item.learn_to && (
                    <Link
                      to={item.learn_to}
                      className={`inline-flex items-center gap-1 rounded-full border border-[#E8E5DD] bg-white px-3 py-1 text-[11px] font-medium text-[#1C1D1B] tap-pulse ${isAr ? "font-arabic flex-row-reverse" : ""}`}
                      data-testid={`checklist-learn-${item.id}`}
                    >
                      📘 {learnLabel}
                    </Link>
                  )}
                  {item.shop_to && (
                    <Link
                      to={item.shop_to}
                      className={`inline-flex items-center gap-1 rounded-full border border-[#EBD9B0] bg-[#FBF4E4] px-3 py-1 text-[11px] font-medium text-[#6E5120] tap-pulse ${isAr ? "font-arabic flex-row-reverse" : ""}`}
                      data-testid={`checklist-shop-${item.id}`}
                    >
                      🛒 {shopLabel}
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
