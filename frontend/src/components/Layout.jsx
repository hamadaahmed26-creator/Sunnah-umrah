import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, MessageCircle, CalendarDays, Users, Languages, MapPin } from "lucide-react";
import { useT } from "../lib/i18n";

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
  const navItems = [
    { to: "/", icon: Home, label: lang === "ar" ? "الرئيسية" : "Home", id: "tour" },
    { to: "/plan", icon: CalendarDays, label: lang === "ar" ? "اليوم" : "Plan", id: "plan" },
    { to: "/places", icon: MapPin, label: lang === "ar" ? "زيارات" : "Places", id: "places" },
    { to: "/lost", icon: Compass, label: lang === "ar" ? "تائه" : "Lost", id: "lost" },
    { to: "/group", icon: Users, label: lang === "ar" ? "المجموعة" : "Group", id: "group" },
    { to: "/chat", icon: MessageCircle, label: lang === "ar" ? "اسأل" : "Ask", id: "chat" },
  ];

  return (
    <div className="min-h-screen pattern-bg grain relative" data-testid="app-shell">
      <header className="relative z-10 px-5 pt-6 pb-4 flex items-center justify-between" data-testid="app-header">
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
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="tap-pulse inline-flex items-center gap-1.5 rounded-full border border-[#E8E5DD] bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-[#1C1D1B]"
          data-testid="lang-toggle"
        >
          <Languages className="w-3.5 h-3.5" />
          {lang === "en" ? "العربية" : "English"}
        </button>
      </header>

      <main className="relative z-10 pb-44 sm:pb-32 px-5" data-testid="app-main">{children}</main>

      <nav
        className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-white/85 backdrop-blur-xl rounded-3xl px-2 py-2 border border-[#E8E5DD] shadow-[0_10px_40px_-8px_rgba(28,29,27,0.18)] flex items-end gap-0.5"
        data-testid="bottom-nav"
        style={{ direction: "ltr" }}
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
    </div>
  );
}
