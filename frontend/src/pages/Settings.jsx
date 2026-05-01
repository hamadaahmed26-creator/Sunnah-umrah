import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Play, Square, BellRing, Mail, BookOpen } from "lucide-react";
import { LangContext } from "../components/Layout";
import {
  loadSettings,
  saveSettings,
  PRAYERS,
} from "../lib/adhanScheduler";

const PRAYER_AR = {
  Fajr: "الفجر",
  Dhuhr: "الظّهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export default function Settings() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [settings, setSettings] = React.useState(() => loadSettings());
  const [playing, setPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  const update = (next) => {
    setSettings(next);
    saveSettings(next);
  };

  const togglePrayer = (p) => {
    update({
      ...settings,
      prayers: { ...settings.prayers, [p]: !settings.prayers[p] },
    });
  };

  const toggleEnabled = () => {
    update({ ...settings, enabled: !settings.enabled });
  };

  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/adhan-makkah.mp3");
      audioRef.current.preload = "auto";
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    return audioRef.current;
  };

  const handlePreview = () => {
    const a = ensureAudio();
    if (playing) {
      a.pause();
      a.currentTime = 0;
      setPlaying(false);
    } else {
      a.currentTime = 0;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="settings-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
        {isAr ? "الإعدادات" : "Settings"}
      </p>
      <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
        {isAr ? "تنبيهات الأذان" : "Adhan reminders"}
      </h1>
      <p className="mt-3 text-[13px] text-[#5C5D58] leading-[1.7]">
        {isAr
          ? "اسمع نداء الأذان الهادئ من مكّة عند كلّ صلاة. التّنبيه يعمل فقط عندما يكون التّطبيق مفتوحًا — لا يستهلك بطّاريّتك في الخلفيّة."
          : "Hear the gentle adhan from Makkah at every prayer time. Plays only while the app is open — no battery drain in the background."}
      </p>

      {/* Master toggle */}
      <div
        className="mt-6 rounded-2xl bg-white border border-[#E8E5DD] p-4 flex items-center justify-between"
        data-testid="settings-master"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FBF1DD] grid place-items-center">
            {settings.enabled ? (
              <Volume2 className="w-4 h-4 text-[#7B5C24]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8E8F8A]" />
            )}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[#1C1D1B]">
              {isAr ? "تشغيل الأذان" : "Adhan audio"}
            </div>
            <div className="text-[11px] text-[#8E8F8A]">
              {settings.enabled
                ? (isAr ? "مفعّل" : "On")
                : (isAr ? "متوقّف" : "Off")}
            </div>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={settings.enabled}
          onClick={toggleEnabled}
          className={`relative w-12 h-7 rounded-full transition-colors ${
            settings.enabled ? "bg-[#1C1D1B]" : "bg-[#E8E5DD]"
          }`}
          data-testid="settings-master-toggle"
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              settings.enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Per-prayer toggles */}
      {settings.enabled && (
        <div className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] divide-y divide-[#E8E5DD]" data-testid="settings-prayers">
          {PRAYERS.map((p) => (
            <div
              key={p}
              className="flex items-center justify-between p-3.5"
              data-testid={`settings-prayer-${p.toLowerCase()}`}
            >
              <div className="flex items-center gap-2.5">
                <BellRing className="w-3.5 h-3.5 text-[#B3884D]" />
                <span className={`text-[13px] font-medium text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? PRAYER_AR[p] : p}
                </span>
              </div>
              <button
                role="switch"
                aria-checked={settings.prayers[p]}
                onClick={() => togglePrayer(p)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  settings.prayers[p] ? "bg-[#2A5A4A]" : "bg-[#E8E5DD]"
                }`}
                data-testid={`settings-prayer-toggle-${p.toLowerCase()}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.prayers[p] ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      <button
        onClick={handlePreview}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] hover:bg-black text-white py-3.5 text-[14px] font-medium shadow-[0_12px_28px_-10px_rgba(28,29,27,0.5)] tap-pulse"
        data-testid="settings-preview"
      >
        {playing ? (
          <>
            <Square className="w-4 h-4" />
            {isAr ? "إيقاف" : "Stop preview"}
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            {isAr ? "استمع للأذان" : "Preview adhan"}
          </>
        )}
      </button>

      <p className="mt-3 text-[11px] text-[#8E8F8A] leading-snug text-center">
        {isAr
          ? "أذان من المسجد الحرام، بصوت الشّيخ علي أحمد ملّا — تسجيل عام، حقوقه محفوظة لمصدره."
          : "Adhan from Masjid al-Ḥaram by Shaykh Ali Ahmed Mulla. Public-domain recording from archive.org."}
      </p>

      {/* Other helpful links */}
      <div className="mt-8 space-y-2">
        <Link
          to="/about"
          className="block rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition tap-pulse"
          data-testid="settings-about"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#7B5C24]" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#1C1D1B]">
                {isAr ? "المصادر والمنهج" : "Sources & methodology"}
              </div>
              <div className="text-[11px] text-[#8E8F8A]">
                {isAr ? "البخاري، مسلم، الألباني..." : "Bukhārī · Muslim · al-Albānī"}
              </div>
            </div>
          </div>
        </Link>
        <Link
          to="/privacy"
          className="block rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5 hover:border-[#B3884D] transition tap-pulse"
          data-testid="settings-privacy"
        >
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#7B5C24]" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#1C1D1B]">
                {isAr ? "الخصوصيّة" : "Privacy policy"}
              </div>
              <div className="text-[11px] text-[#8E8F8A]">
                {isAr ? "ما الذي نجمعه — وما لا نجمعه" : "What we collect — and don't"}
              </div>
            </div>
          </div>
        </Link>
      </div>

      <p className="mt-8 text-center text-[12px] text-[#8E8F8A] italic">
        {isAr
          ? "تقبّل الله منّا ومنكم"
          : "Taqabbal-Allāhu minnā wa minkum."}
      </p>
    </div>
  );
}
