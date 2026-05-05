import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Hosted privacy policy. App Store + Play Store both REQUIRE a public URL
// before approving submission, so this lives at /privacy on sunnahumrah.app.
// Source content is in /app/PRIVACY_POLICY.md — this is a hand-formatted React
// version so search engines can index it cleanly.

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto pb-12 prose prose-sm sm:prose-base prose-headings:font-medium prose-headings:text-[#1C1D1B] prose-p:text-[#5C5D58] prose-li:text-[#5C5D58] prose-a:text-[#B3884D]" data-testid="privacy-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <h1 className="text-[28px] font-medium tracking-tight">Privacy Policy</h1>
      <p className="text-[12px] uppercase tracking-[0.22em] text-[#8E8F8A]">Sunnah Umrah · sunnahumrah.app</p>

      <h2>1. Who we are</h2>
      <p>
        Sunnah Umrah ("we", "us", "the app") is a step-by-step companion for Muslim pilgrims performing ʿUmrah.
        Operated by Hamada Ahmed (United Kingdom). Bundle ID: <code>com.sunnahumrah.app</code>.
        Contact: <a href="mailto:privacy@sunnahumrah.app">privacy@sunnahumrah.app</a>.
      </p>

      <h2>2. What we collect — and what we do NOT</h2>
      <p>We have built Sunnah Umrah to require <strong>as little personal data as possible</strong>.</p>
      <h3>On-device only (never leaves your phone)</h3>
      <ul>
        <li>Your language preference (English / Arabic)</li>
        <li>Your Tawaf and Saʿi lap count</li>
        <li>Your current step in the guided tour</li>
        <li>Whether you've seen the welcome screen</li>
      </ul>
      <h3>Sent to our server only when you actively use a feature</h3>
      <ul>
        <li><strong>AI Companion chat</strong> — your question is forwarded to Anthropic Claude (via Emergent) and an answer is returned. Logs auto-delete after 30 days. No name, email, or account required.</li>
        <li><strong>Stay Together group</strong> — your chosen display name, Tawaf/Saʿi count, and (only if you opt in) your latitude/longitude. Auto-purged 14 days after last activity.</li>
        <li><strong>I'm Lost gate finder</strong> — your GPS coordinates are sent in a single request to compute the nearest gate. We do <strong>not</strong> log or store them.</li>
      </ul>
      <h3>What we do NOT collect</h3>
      <ul>
        <li>Real name, email, phone number, or postal address</li>
        <li>Advertising identifiers (IDFA, GAID, etc.)</li>
        <li>Background location tracking</li>
        <li>Photos, contacts, calendar, microphone, or camera</li>
        <li>Behavioural analytics or tracking pixels</li>
      </ul>

      <h2>3. Third-party services</h2>
      <ul>
        <li><strong>Anthropic Claude (via Emergent)</strong> — powers the AI Companion. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Policy</a></li>
        <li><strong>Aladhan API</strong> — daily prayer times. <a href="https://aladhan.com/privacy-policy" target="_blank" rel="noreferrer">Policy</a></li>
        <li><strong>Travelpayouts</strong> — affiliate redirects to Hotellook (hotels), Aviasales (flights), and Yesim (eSIM). <a href="https://www.travelpayouts.com/legal/privacy_policy" target="_blank" rel="noreferrer">Policy</a></li>
        <li><strong>Amazon UK Associates</strong> — affiliate links on shop product pages. <a href="https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ" target="_blank" rel="noreferrer">Policy</a></li>
      </ul>
      <p>We do <strong>not</strong> sell your data to any third party.</p>

      <h2>4. Children</h2>
      <p>
        The app is suitable for all ages. We do not knowingly collect information from children under 13 / 16.
        Group features require a display name typed by the user — children should use a pseudonym.
      </p>

      <h2>5. Your rights</h2>
      <ul>
        <li><strong>Delete all your data</strong> by uninstalling the app (clears all on-device storage).</li>
        <li><strong>Leave a group</strong> any time using the in-app control.</li>
        <li><strong>Request server-side deletion</strong> by emailing <a href="mailto:privacy@sunnahumrah.app">privacy@sunnahumrah.app</a> with your group code. Processed within 30 days.</li>
      </ul>
      <p>EU / UK residents have full GDPR / UK-GDPR rights (access, rectify, port, restrict). California residents have CCPA rights. Contact us via the email above.</p>

      <h2>6. Data retention</h2>
      <ul>
        <li>AI chat questions — 30 days</li>
        <li>Group codes &amp; members — 14 days after last activity</li>
        <li>GPS coordinates — not stored, discarded after the single request</li>
      </ul>

      <h2>7. Security</h2>
      <ul>
        <li>All traffic over HTTPS / TLS 1.3</li>
        <li>Database access-controlled and not publicly exposed</li>
      </ul>

      <h2>8. Changes</h2>
      <p>We may update this policy. Material changes will be surfaced inside the app.</p>

      <h2>9. Contact</h2>
      <p>
        <a href="mailto:privacy@sunnahumrah.app">privacy@sunnahumrah.app</a>
      </p>

      <hr />
      <p className="text-center text-[12px] text-[#8E8F8A] italic">
        May Allah accept your ʿUmrah — taqabbalAllāhu minnā wa minkum.
      </p>
    </div>
  );
}
