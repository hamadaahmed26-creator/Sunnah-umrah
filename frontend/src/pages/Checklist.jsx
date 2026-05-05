import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Check, X, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";
import { CHECKLIST_ITEMS } from "../lib/checklist";
import { loadProfile } from "../lib/userProfile";

const STORAGE_KEY = "umrah_checklist";

// Item state model: 'have' | 'missing' | undefined.
// Backwards compat: prior `true` boolean → 'have'.
function loadStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out = {};
    for (const k of Object.keys(parsed)) {
      const v = parsed[k];
      if (v === true || v === "have") out[k] = "have";
      else if (v === "missing") out[k] = "missing";
    }
    return out;
  } catch { return {}; }
}
function saveStates(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function Checklist() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const profile = loadProfile();

  const [states, setStates] = React.useState(() => loadStates());
  const missingRefs = React.useRef({});

  const items = React.useMemo(() => {
    return CHECKLIST_ITEMS.filter((i) => {
      if (i.travelers_only && profile.travelers !== i.travelers_only) return false;
      return true;
    });
  }, [profile.travelers]);

  const haveCount = items.filter((i) => states[i.id] === "have").length;
  const missingItems = items.filter((i) => states[i.id] === "missing");
  const totalCount = items.length;
  const pct = totalCount === 0 ? 0 : Math.round((haveCount / totalCount) * 100);

  const setItemState = (id, value) => {
    const next = { ...states };
    if (next[id] === value) delete next[id]; // toggle off
    else next[id] = value;
    setStates(next);
    saveStates(next);
  };
  const markAll = () => {
    const next = {};
    items.forEach((i) => { next[i.id] = "have"; });
    setStates(next);
    saveStates(next);
  };
  const reset = () => {
    setStates({});
    saveStates({});
  };

  // Scroll to first missing item that has an action — used by the "Help me
  // sort what's missing" CTA. Falls back to the missing summary card.
  const scrollToFirstMissing = () => {
    const first = missingItems.find((i) => i.actions && i.actions.length > 0);
    const target = first ? missingRefs.current[first.id] : missingRefs.current.__summary;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Group items by group_en within each tier for visual headers.
  const groupByGroup = (list) => {
    const out = [];
    let currentGroup = null;
    for (const it of list) {
      if (it.group_en !== currentGroup) {
        out.push({ isHeader: true, group_en: it.group_en, group_ar: it.group_ar, icon: it.group_icon });
        currentGroup = it.group_en;
      }
      out.push({ isHeader: false, item: it });
    }
    return out;
  };

  const essentials = items.filter((i) => i.tier === "essential");
  const recommended = items.filter((i) => i.tier === "recommended");

  return (
    <div className="max-w-md mx-auto pb-32" data-testid="checklist-page">
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
            {haveCount} / {totalCount}
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
          {(haveCount > 0 || missingItems.length > 0) && (
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

      {/* MISSING SUMMARY — surfaces only when at least one ❌ has been chosen.
          Solves the friend's "missing items summary" + "help me sort these"
          spec in one panel: shows the gap, the human prompt, and a single
          smart action that scrolls to the first shoppable missing item. */}
      <AnimatePresence>
        {missingItems.length > 0 && (
          <motion.div
            ref={(el) => { missingRefs.current.__summary = el; }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-2xl bg-[#FFF8F3] border border-[#EBD5B0] p-4"
            data-testid="checklist-missing-summary"
          >
            <div className={`flex items-start gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
              <Sparkles className="w-4 h-4 text-[#7A4A1A] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr
                    ? `أنت تحتاج ${missingItems.length} ${missingItems.length === 1 ? "أمرًا" : "أمور"} بعد`
                    : `You still need ${missingItems.length} ${missingItems.length === 1 ? "item" : "items"}`}
                </p>
                <ul className={`mt-1.5 space-y-0.5 ${isAr ? "text-right" : ""}`}>
                  {missingItems.slice(0, 4).map((it) => (
                    <li
                      key={it.id}
                      className={`text-[12px] text-[#5C4218] leading-snug ${isAr ? "font-arabic" : ""}`}
                    >
                      • {isAr ? it.title_ar : it.title_en}
                    </li>
                  ))}
                  {missingItems.length > 4 && (
                    <li className={`text-[11px] text-[#8E8F8A] italic ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? `و ${missingItems.length - 4} أخرى…` : `and ${missingItems.length - 4} more…`}
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <button
              onClick={scrollToFirstMissing}
              className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] text-white text-[13px] font-medium px-4 py-2.5 tap-pulse ${isAr ? "font-arabic flex-row-reverse" : ""}`}
              data-testid="checklist-help-me-sort"
            >
              {isAr ? "ساعدني أرتّبها" : "Help me sort these"}
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESSENTIAL */}
      <div className="mt-6">
        <SectionHeader color="#2A5A4A" isAr={isAr} title_en="Essential — required" title_ar="أساسيّ — مطلوب" desc_en="These are required to perform ʿUmrah." desc_ar="هذه الأمور لا بدّ منها لأداء العمرة." />
        <div className="space-y-2 mt-3">
          {groupByGroup(essentials).map((row, i) =>
            row.isHeader ? (
              <GroupHeader key={`h-e-${i}`} icon={row.icon} en={row.group_en} ar={row.group_ar} isAr={isAr} />
            ) : (
              <ChecklistRow
                key={row.item.id}
                item={row.item}
                state={states[row.item.id]}
                onSet={(v) => setItemState(row.item.id, v)}
                isAr={isAr}
                domRef={(el) => { missingRefs.current[row.item.id] = el; }}
              />
            )
          )}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="mt-7">
        <SectionHeader color="#B3884D" isAr={isAr} title_en="Recommended — helpful" title_ar="مُستحسَن — مفيد" desc_en="These will make your journey smoother." desc_ar="هذه تسهّل عليك الرّحلة وتجعلها أريح." />
        <div className="space-y-2 mt-3">
          {groupByGroup(recommended).map((row, i) =>
            row.isHeader ? (
              <GroupHeader key={`h-r-${i}`} icon={row.icon} en={row.group_en} ar={row.group_ar} isAr={isAr} />
            ) : (
              <ChecklistRow
                key={row.item.id}
                item={row.item}
                state={states[row.item.id]}
                onSet={(v) => setItemState(row.item.id, v)}
                isAr={isAr}
                domRef={(el) => { missingRefs.current[row.item.id] = el; }}
              />
            )
          )}
        </div>
      </div>

      {/* Trust line — friend's spec: tiny reassurance under affiliate exposure */}
      <p
        className={`mt-6 text-[11px] text-[#8E8F8A] inline-flex items-center gap-1.5 ${isAr ? "flex-row-reverse font-arabic" : ""}`}
        data-testid="checklist-trust-line"
      >
        <ShieldCheck className="w-3 h-3" />
        {isAr ? "نُريك مزوّدين موثوقين فقط" : "We only show trusted providers"}
      </p>

      {/* Final CTA — flips between "ready" and "complete missing" wording */}
      {missingItems.length > 0 ? (
        <button
          onClick={scrollToFirstMissing}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-[#8B4540] hover:bg-[#713934] text-white px-6 py-4 text-[14px] font-medium tap-pulse"
          data-testid="checklist-finish-missing"
        >
          {isAr
            ? "أنت قريب من الجاهزيّة — لنكمل ما بقي"
            : "You're almost ready — let's complete the remaining items"}
          <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <Link
          to="/tour"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] text-white px-6 py-4 text-[14px] font-medium tap-pulse"
          data-testid="checklist-start-tour"
        >
          {isAr ? "أنا جاهز — ابدأ دليل العمرة" : "I'm ready — start ʿUmrah guide"}
          <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        </Link>
      )}
    </div>
  );
}

function SectionHeader({ color, isAr, title_en, title_ar, desc_en, desc_ar }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <h2 className={`text-[11px] uppercase tracking-[0.22em] ${isAr ? "font-arabic" : ""}`} style={{ color }}>
          {isAr ? title_ar : title_en}
        </h2>
      </div>
      <p className={`text-[12px] text-[#5C5D58] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? desc_ar : desc_en}
      </p>
    </>
  );
}

function GroupHeader({ icon, en, ar, isAr }) {
  return (
    <div className={`flex items-center gap-2 pt-2 ${isAr ? "flex-row-reverse" : ""}`}>
      <span className="text-[15px] leading-none">{icon}</span>
      <h3 className={`text-[12px] font-semibold text-[#1C1D1B] uppercase tracking-[0.15em] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? ar : en}
      </h3>
    </div>
  );
}

function ChecklistRow({ item, state, onSet, isAr, domRef }) {
  const have = state === "have";
  const missing = state === "missing";
  const title = isAr ? item.title_ar : item.title_en;
  const info = isAr ? item.info_ar : item.info_en;
  const prompt = isAr ? item.missing_prompt_ar : item.missing_prompt_en;

  return (
    <div
      ref={domRef}
      className={`rounded-2xl border p-3 transition ${
        have
          ? "bg-[#F4F8F4] border-[#C5DBC9]"
          : missing
            ? "bg-[#FFF8F3] border-[#EBD5B0]"
            : "bg-white border-[#E8E5DD]"
      }`}
      data-testid={`checklist-item-${item.id}`}
    >
      <div className={`flex items-start gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
        <div className="flex-shrink-0 mt-0.5">
          {have ? (
            <CheckCircle2 className="w-5 h-5 text-[#2A5A4A]" strokeWidth={2.2} />
          ) : missing ? (
            <div className="w-5 h-5 rounded-full bg-[#8B4540] grid place-items-center">
              <X className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-[#C6C7C1]" strokeWidth={1.8} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13.5px] font-medium leading-snug ${have ? "text-[#3E5E4B] line-through" : "text-[#1C1D1B]"} ${isAr ? "font-arabic" : ""}`}>
            {title}
          </p>
          {info && !missing && !have && (
            <p className={`mt-0.5 text-[11.5px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic" : ""}`}>
              {info}
            </p>
          )}

          {/* Two-state pills: "I have this" / "I don't have this".
              Pressing the active one again clears it (back to neutral). */}
          {!have && !missing && (
            <div className={`mt-2 flex flex-wrap gap-1.5 ${isAr ? "justify-end" : ""}`}>
              <button
                onClick={() => onSet("have")}
                className={`text-[11px] font-medium px-3 py-1 rounded-full border border-[#C5DBC9] bg-white text-[#2A5A4A] tap-pulse inline-flex items-center gap-1 ${isAr ? "font-arabic flex-row-reverse" : ""}`}
                data-testid={`checklist-have-${item.id}`}
              >
                <Check className="w-3 h-3" /> {isAr ? "عندي" : "I have this"}
              </button>
              <button
                onClick={() => onSet("missing")}
                className={`text-[11px] font-medium px-3 py-1 rounded-full border border-[#EBD5B0] bg-white text-[#8B4540] tap-pulse inline-flex items-center gap-1 ${isAr ? "font-arabic flex-row-reverse" : ""}`}
                data-testid={`checklist-missing-${item.id}`}
              >
                <X className="w-3 h-3" /> {isAr ? "ليس عندي" : "I don't have this"}
              </button>
            </div>
          )}

          {have && (
            <button
              onClick={() => onSet("have")}
              className={`mt-1 text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] tap-pulse ${isAr ? "font-arabic" : ""}`}
              data-testid={`checklist-undo-${item.id}`}
            >
              {isAr ? "تراجع" : "Undo"}
            </button>
          )}

          {/* Help panel — ONLY rendered when state === 'missing'. The whole
              "be a guide, not a salesman" idea: appear at the moment of
              need, with 1-2 trustworthy actions, never before. */}
          <AnimatePresence>
            {missing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className={`mt-2.5 text-[12.5px] text-[#5C4218] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                  {prompt || info}
                </p>
                {item.actions && item.actions.length > 0 && (
                  <>
                    <p className={`mt-2 text-[11px] text-[#7A4A1A] font-semibold ${isAr ? "font-arabic text-right" : ""}`}>
                      {isAr ? "هل تريد المساعدة؟" : "Want help finding the best option?"}
                    </p>
                    <div className={`mt-1.5 flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
                      {item.actions.map((a, i) => {
                        const label = isAr ? a.label_ar : a.label_en;
                        const cls = `inline-flex items-center gap-1.5 rounded-full border border-[#EBD9B0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6E5120] tap-pulse ${isAr ? "font-arabic flex-row-reverse" : ""}`;
                        return a.external ? (
                          <a
                            key={i}
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cls}
                            data-testid={`checklist-action-${item.id}-${i}`}
                          >
                            <span>{a.icon}</span>
                            {label}
                          </a>
                        ) : (
                          <Link
                            key={i}
                            to={a.to}
                            className={cls}
                            data-testid={`checklist-action-${item.id}-${i}`}
                          >
                            <span>{a.icon}</span>
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
                <button
                  onClick={() => onSet("missing")}
                  className={`mt-2.5 text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B] tap-pulse ${isAr ? "font-arabic" : ""}`}
                  data-testid={`checklist-cancel-missing-${item.id}`}
                >
                  {isAr ? "إخفاء" : "Hide"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
