import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ShieldCheck, Mail, Heart } from "lucide-react";

// About / Sources page — required for Apple App Store approval of religious apps.
// Lists the exact Salafi sources used throughout the app, names the
// scholars consulted, and adds a religious-accuracy disclaimer that protects
// both the user and the developer from misuse.

export default function About() {
  return (
    <div className="max-w-2xl mx-auto pb-16" data-testid="about-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">About this app</p>
      <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
        Sources & methodology
      </h1>
      <p className="mt-3 text-[13px] text-[#5C5D58] leading-[1.7]">
        Sunnah Umrah is a quiet, ad-free companion built for Muslim pilgrims who want to
        perform ʿUmrah strictly upon the way of the Prophet ﷺ as understood by the
        early generations (the Salaf as-Sāliḥ) and conveyed by trustworthy scholars.
      </p>

      {/* Sources */}
      <section className="mt-8 rounded-2xl bg-white border border-[#E8E5DD] p-5" data-testid="about-sources">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <BookOpen className="w-3.5 h-3.5" />
          Primary sources
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          Every duʿāʾ, ruling and step is traced to:
        </h2>
        <ul className="mt-4 space-y-3 text-[13px] text-[#3F3722] leading-relaxed">
          <li>
            <strong>Ṣaḥīḥ al-Bukhārī</strong> &amp; <strong>Ṣaḥīḥ Muslim</strong> — the two most
            authentic collections of hadīth.
          </li>
          <li>
            <strong>Bulūgh al-Marām</strong> by al-Ḥāfiẓ Ibn Ḥajar al-ʿAsqalānī — chapters on
            Hajj &amp; ʿUmrah.
          </li>
          <li>
            <strong>Ḥiṣn al-Muslim</strong> by Saʿīd b. ʿAlī al-Qaḥṭānī — fortress of the
            Muslim, used for the daily and travel adhkār.
          </li>
          <li>
            <strong>Manāsik al-Ḥajj wal-ʿUmrah</strong> by Shaykh Muḥammad Nāṣir al-Dīn
            al-Albānī — concise rites of Hajj and ʿUmrah on the Sunnah.
          </li>
          <li>
            <strong>Riyāḍ aṣ-Ṣāliḥīn</strong> by al-Imām al-Nawawī — used for general adab
            and dhikr.
          </li>
          <li>
            <strong>Tafsīr as-Saʿdī</strong> by Shaykh ʿAbd al-Raḥmān b. Nāṣir al-Saʿdī — for
            verses cited within the tour and Ziyārah.
          </li>
        </ul>
        <p className="mt-4 text-[12px] text-[#8E8F8A] italic">
          Every step in the guided tour cites its source so you can verify it yourself.
        </p>
      </section>

      {/* Scholarly verification */}
      <section className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="about-methodology">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#2A5A4A]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Methodology
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          What we include — and what we leave out
        </h2>
        <ul className="mt-4 space-y-3 text-[13px] text-[#3F3722] leading-relaxed list-disc pl-5">
          <li>
            We restrict ourselves to actions and duʿāʾs <em>established</em> from the
            Prophet ﷺ in authentic narrations.
          </li>
          <li>
            We deliberately exclude practices that have no basis in the Sunnah, even when
            they are common today (e.g. raising the hands at the Yemeni Corner, kissing it,
            congregational duʿāʾ during Saʿī).
          </li>
          <li>
            Where scholars differ, we follow the position best supported by the evidence as
            understood by the major Salafī scholars of the past century — Ibn Bāz,
            al-ʿUthaymīn, al-Albānī, Ibn Jibrīn (raḥimahum-Allāh) — without disrespect to
            those who hold other views.
          </li>
          <li>
            Arabic texts of duʿāʾs are kept as transmitted; English is translation, not
            substitute.
          </li>
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="mt-4 rounded-2xl bg-[#FFF8EE] border border-[#EBD9B0] p-5" data-testid="about-disclaimer">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8B6A1F]">
          <Heart className="w-3.5 h-3.5" />
          Religious accuracy disclaimer
        </div>
        <h2 className="mt-2 text-[18px] font-medium text-[#1C1D1B]">
          A guide, not a substitute for a scholar
        </h2>
        <p className="mt-3 text-[13px] text-[#3F3722] leading-relaxed">
          This app is offered as a sincere educational reminder, not as a binding fatwā.
          Every effort has been made to verify sources, but human error is possible.
          Before acting on any specific ruling — particularly for situations the app does
          not cover — please consult a qualified scholar of Ahl al-Sunnah wa'l-Jamāʿah.
        </p>
        <p className="mt-3 text-[13px] text-[#3F3722] leading-relaxed">
          The AI Companion (Ask) is an assistant, not a muftī. It can be wrong. Treat its
          answers as a starting point for further study, not as a religious verdict.
        </p>
        <p className="mt-3 text-[12px] text-[#8E8F8A] italic">
          If you ever find an error in this app, please email us — corrections are
          treated as the most important reports we receive.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-4 rounded-2xl bg-white border border-[#E8E5DD] p-5" data-testid="about-contact">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <Mail className="w-3.5 h-3.5" />
          Contact
        </div>
        <p className="mt-3 text-[13px] text-[#3F3722] leading-relaxed">
          Report a religious error, suggest a feature, or just say salām:
          <br />
          <a href="mailto:hello@sunnahumrah.app" className="text-[#B3884D] underline">
            hello@sunnahumrah.app
          </a>
        </p>
        <p className="mt-3 text-[12px] text-[#8E8F8A]">
          See also our{" "}
          <Link to="/privacy" className="text-[#B3884D] underline">
            privacy policy
          </Link>
          .
        </p>
      </section>

      <p className="mt-8 text-center text-[12px] text-[#8E8F8A] italic">
        Taqabbal-Allāhu minnā wa minkum — may Allah accept from us and from you.
      </p>
    </div>
  );
}
