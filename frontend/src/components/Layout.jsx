import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, MessageCircle, Users, Languages, MapPin } from "lucide-react";
import { useT } from "../lib/i18n";
import QuickDuas from "./QuickDuas";
import { useAdhanScheduler } from "../lib/adhanScheduler";

export const LangContext = React.createContext({ lang: "en", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = React.useState(() => localStorage.getItem("umrah_lang") || "en");
  React.useEffect(() => {
    localStorage.setItem("umrah_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export default function Layout({ children }) {
  const { lang, setLang } = React.useContext(LangContext);
  const t = useT(lang);
  const loc = useLocation();
  // Mount the adhan scheduler at the app root — it self-disables when the
  // user hasn't enabled adhan in Settings.
  useAdhanScheduler();
  const navItems = [
    { to: "/", icon: Home, label: lang === "ar" ? "الرئيسية" : "Home", id: "tour" },
    { to: "/places", icon: MapPin, label: lang === "ar" ? "زيارات" : "Places", id: "places" },
    { to: "/lost", icon: Compass, label: lang === "ar" ? "تائه" : "Lost", id: "lost" },
    { to: "/group", icon: Users, label: lang === "ar" ? "المجموعة" : "Group", id: "group" },
    { to: "/chat", icon: MessageCircle, label: lang === "ar" ? "اسأل" : "Ask", id: "chat" },
  ];

  return (
    <div className="min-h-screen pattern-bg grain relative" data-testid="app-shell">
      <header
        className="relative z-30 px-5 pb-4 flex items-center justify-between"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
        data-testid="app-header"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/apple-touch-icon.png"
            alt="Sunnah Umrah"
            className="w-9 h-9 rounded-[10px] shadow-sm"
            data-testid="app-logo"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-[#1C1D1B]" data-testid="app-name">
              {t("appName")}
            </div>
            <div className={`text-[11px] uppercase tracking-[0.18em] text-[#8E8F8A] ${lang === "ar" ? "font-arabic" : ""}`}>
              {lang === "ar" ? "على السنّة · خطوة بخطوة" : "Sunnah · Step by step"}
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="tap-pulse relative z-40 inline-flex items-center gap-1.5 rounded-full border border-[#E8E5DD] bg-white shadow-sm px-4 py-2.5 text-[13px] font-medium text-[#1C1D1B] active:scale-95 transition-transform"
          data-testid="lang-toggle"
          aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
        >
          <Languages className="w-4 h-4" />
          {lang === "en" ? "العربية" : "English"}
        </button>
      </header>

      <main className="relative z-10 pb-44 sm:pb-32 px-5" data-testid="app-main">{children}</main>

      {/* Hide the floating bottom nav on the new home dashboard — its tiles
          already cover everything the nav offers, so we get a cleaner first
          impression and more vertical space for content. */}
      {loc.pathname !== "/" && loc.pathname !== "/home" && (
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-[60] bg-white/95 backdrop-blur-xl rounded-3xl px-2 py-2 border border-[#E8E5DD] shadow-[0_10px_40px_-8px_rgba(28,29,27,0.18)] flex items-end gap-0.5"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          direction: "ltr",
        }}
        data-testid="bottom-nav"
      >
        {navItems.map((it) => {
          const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.id}
              to={it.to}
              className={`tap-pulse rounded-2xl px-2.5 py-1.5 flex flex-col items-center gap-0.5 min-w-[58px] transition-colors ${
                active ? "bg-[#B3884D] text-white shadow-[0_4px_12px_-2px_rgba(179,136,77,0.45)]" : "text-[#5C5D58] hover:text-[#1C1D1B]"
              }`}
              data-testid={`nav-${it.id}`}
              aria-label={it.label}
            >
              <Icon className="w-[19px] h-[19px]" strokeWidth={2.1} />
              <span className={`text-[9.5px] leading-none font-medium tracking-tight ${lang === "ar" ? "font-arabic text-[10px]" : ""}`}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
      )}
      <QuickDuas isAr={lang === "ar"} />
    </div>
  );
}
