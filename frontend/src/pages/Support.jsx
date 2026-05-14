import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LifeBuoy,
  Mail,
  HelpCircle,
  Bug,
  Lightbulb,
  Clock,
  Compass,
  Users,
  MapPin,
  MessageCircle,
} from "lucide-react";

// Public Support page — required by Apple App Store and Google Play Store
// as a "Support URL" before submission. Lists how to get help, common
// troubleshooting, bug reporting, and response-time expectations.
//
// Lives at /support. Linked from About, Settings, and the App Store
// Connect "Support URL" field.

const TROUBLESHOOTING = [
  {
    icon: MapPin,
    title: "GPS / location not working",
    body: "Open iPhone Settings → Privacy & Security → Location Services → Sunnah Umrah → set to While Using. Then in the app, pull-to-refresh on the I'm Lost or Qibla screen.",
  },
  {
    icon: Compass,
    title: "Qibla compass keeps spinning",
    body: "iPhones need a one-time figure-8 calibration. Hold the phone flat, move it in a figure-8 motion for 5 seconds. Stay away from metal surfaces and magnetic phone cases.",
  },
  {
    icon: Users,
    title: "Can't join my group",
    body: "Group codes are 6 characters and case-sensitive. Make sure you're connected to the internet (Haram Wi-Fi can be slow — try mobile data). Groups auto-expire 14 days after the last activity.",
  },
  {
    icon: MessageCircle,
    title: "AI Companion (Ask) not replying",
    body: "Usually a brief network hiccup at the Haram. Wait 10 seconds, swipe down to retry. If it keeps failing, force-quit the app (swipe up + swipe up on the card) and reopen.",
  },
];

export default function Support() {
  return (
    <div className="max-w-2xl mx-auto pb-16" data-testid="support-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4"
        data-testid="support-back-link"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
        Help & Support
      </p>
      <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
        We're here — assalāmu ʿalaykum
      </h1>
      <p className="mt-3 text-[13px] text-[#5C5D58] leading-[1.7]">
        Sunnah Umrah is built by a small team who really wants every pilgrim's
        ʿUmrah to be smooth. If anything in the app isn't working — or just
        feels off — please reach out. Every email is read by a human, usually
        within 24-48 hours.
      </p>

      {/* Primary contact */}
      <section
        className="mt-8 rounded-2xl bg-white border border-[#E8E5DD] p-5"
        data-testid="support-contact"
      >
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <Mail className="w-3.5 h-3.5" />
          Email us directly
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          The fastest way to get help
        </h2>
        <p className="mt-3 text-[13px] text-[#3F3722] leading-relaxed">
          Send us a message at:
        </p>
        <a
          href="mailto:Hamada.ahmed26@hotmail.com?subject=Sunnah%20Umrah%20support"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1C1D1B] text-white px-5 py-2.5 text-[13px] font-medium no-underline hover:bg-[#3F3722] transition-colors"
          data-testid="support-email-button"
        >
          <Mail className="w-3.5 h-3.5" />
          Hamada.ahmed26@hotmail.com
        </a>
        <div className="mt-5 flex items-center gap-2 text-[12px] text-[#8E8F8A]">
          <Clock className="w-3.5 h-3.5" />
          Typical reply time: <strong className="text-[#3F3722]">within 48 hours</strong>
        </div>
        <p className="mt-3 text-[12px] text-[#8E8F8A] leading-relaxed">
          To help us answer faster, please include your iPhone model, iOS
          version (Settings → General → About), and a screenshot if something
          looks broken.
        </p>
      </section>

      {/* Quick troubleshooting */}
      <section
        className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5"
        data-testid="support-troubleshooting"
      >
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#2A5A4A]">
          <LifeBuoy className="w-3.5 h-3.5" />
          Quick fixes
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          Common issues — try these first
        </h2>
        <div className="mt-4 space-y-4">
          {TROUBLESHOOTING.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-3"
                data-testid={`support-tip-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-[#E8E5DD] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#B3884D]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-medium text-[#1C1D1B]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#3F3722] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bug reports + feature requests */}
      <section
        className="mt-4 rounded-2xl bg-white border border-[#E8E5DD] p-5"
        data-testid="support-feedback"
      >
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <Bug className="w-3.5 h-3.5" />
          Report a bug or request a feature
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          Help us make the app better
        </h2>
        <ul className="mt-4 space-y-3 text-[13px] text-[#3F3722] leading-relaxed list-disc pl-5">
          <li>
            <strong>Found a bug?</strong> Email{" "}
            <a
              href="mailto:Hamada.ahmed26@hotmail.com?subject=Bug%20report"
              className="text-[#B3884D] underline"
            >
              Hamada.ahmed26@hotmail.com
            </a>{" "}
            with the steps to reproduce it. A screenshot helps a lot.
          </li>
          <li>
            <strong>Found a religious error?</strong> Send the source you
            believe is correct — we treat these as the highest priority and
            fix them within 24 hours.
          </li>
          <li>
            <strong>Have a feature idea?</strong> We read every suggestion. Most
            of the app's best features came from pilgrim emails.
          </li>
        </ul>
      </section>

      {/* Self-serve links */}
      <section
        className="mt-4 rounded-2xl bg-[#FFF8EE] border border-[#EBD9B0] p-5"
        data-testid="support-self-serve"
      >
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8B6A1F]">
          <HelpCircle className="w-3.5 h-3.5" />
          Browse on your own
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          Answers already in the app
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/faq"
            className="rounded-xl bg-white border border-[#E8E5DD] p-4 no-underline hover:border-[#B3884D] transition-colors"
            data-testid="support-link-faq"
          >
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#1C1D1B]">
              <HelpCircle className="w-4 h-4 text-[#B3884D]" />
              FAQ
            </div>
            <p className="mt-1 text-[12px] text-[#8E8F8A] leading-snug">
              Common pilgrim questions, Salafī-vetted answers.
            </p>
          </Link>
          <Link
            to="/about"
            className="rounded-xl bg-white border border-[#E8E5DD] p-4 no-underline hover:border-[#B3884D] transition-colors"
            data-testid="support-link-about"
          >
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#1C1D1B]">
              <BookIcon />
              About & Sources
            </div>
            <p className="mt-1 text-[12px] text-[#8E8F8A] leading-snug">
              Which scholars, which books, our methodology.
            </p>
          </Link>
          <Link
            to="/privacy"
            className="rounded-xl bg-white border border-[#E8E5DD] p-4 no-underline hover:border-[#B3884D] transition-colors"
            data-testid="support-link-privacy"
          >
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#1C1D1B]">
              <Lightbulb className="w-4 h-4 text-[#B3884D]" />
              Privacy Policy
            </div>
            <p className="mt-1 text-[12px] text-[#8E8F8A] leading-snug">
              What we collect (almost nothing). What we don't.
            </p>
          </Link>
          <Link
            to="/checklist"
            className="rounded-xl bg-white border border-[#E8E5DD] p-4 no-underline hover:border-[#B3884D] transition-colors"
            data-testid="support-link-checklist"
          >
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#1C1D1B]">
              <Compass className="w-4 h-4 text-[#B3884D]" />
              Pre-departure checklist
            </div>
            <p className="mt-1 text-[12px] text-[#8E8F8A] leading-snug">
              Documents, packing, what to do before you fly.
            </p>
          </Link>
        </div>
      </section>

      <p className="mt-8 text-center text-[12px] text-[#8E8F8A] italic">
        May Allah accept your ʿUmrah — taqabbalAllāhu minnā wa minkum.
      </p>
    </div>
  );
}

// Tiny inline icon helper — keeps the import list short.
function BookIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#B3884D]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
