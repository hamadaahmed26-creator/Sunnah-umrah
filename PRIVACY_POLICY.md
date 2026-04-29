# Privacy Policy — Sunnah Umrah

**Effective date**: [DATE OF PUBLICATION — fill in before submitting]
**App name**: Sunnah Umrah
**Bundle ID**: com.sunnahumrah.app
**Contact**: privacy@sunnahumrah.com

---

## 1. Who we are

Sunnah Umrah ("we", "us", "the app") is a step-by-step companion for Muslim
pilgrims performing ʿUmrah. The app is provided by **[YOUR LEGAL NAME OR
COMPANY NAME]** ("the Operator").

---

## 2. What we collect — and what we do NOT

We have built Sunnah Umrah to require **as little personal data as possible**.

### 2.1 Information we collect on-device only (never leaves your phone)
- Your **language preference** (English or Arabic)
- Your **Tawaf and Saʿi lap count**
- Your **current step** in the guided tour
- Whether you have seen the welcome screen

This information is stored only in your phone's local storage and is **never
sent to our servers**.

### 2.2 Information we send to our server only when you actively use a feature
- **AI Companion chat (`/api/chat`)** — the question you type is sent to
  Anthropic Claude (via Emergent's LLM proxy) so we can return an answer.
  The question is logged for debugging purposes for up to 30 days, then
  deleted. We do **not** require or collect your name, email, or any account.
- **Stay Together group (`/api/group/*`)** — when you create or join a group,
  we store the group code, the display name you chose, your tawaf/saʿi count
  if you publish it, and (only if you tap "share location") your current
  latitude/longitude. Group members can see each other's data. You can leave
  a group at any time; data is purged 14 days after the last member checks in.
- **I'm Lost gate finder (`/api/gates/nearest`)** — your current GPS
  coordinates are sent in a single request to compute the nearest gate of
  Masjid al-Ḥaram. We **do not log or store these coordinates**.
- **Sadaqah donations (`/api/sadaqah/*`)** — your card details go directly to
  Stripe; we never see them. We log the Stripe session ID and amount donated
  for our own accounting.

### 2.3 Information we do NOT collect
- Real name, email address, phone number, or postal address
- Marketing identifiers (IDFA, GAID)
- Background location tracking
- Photos, contacts, calendar, microphone, or camera
- Behavioural analytics, advertising IDs, or tracking pixels

---

## 3. Third-party services we use

| Service | What it does | Data sent | Privacy policy |
|---|---|---|---|
| **Stripe** | Processes Sadaqah donation payments | Your card details, billing address, donation amount. Stripe sends you an email receipt directly. | https://stripe.com/privacy |
| **Anthropic Claude (via Emergent)** | Powers the AI Companion chat | The question you type | https://www.anthropic.com/legal/privacy |
| **Aladhan API** | Provides daily prayer times | City name (Makkah / Madīnah / your chosen city) | https://aladhan.com/privacy-policy |
| **Booking.com Affiliate** | Hotel search redirect | When you tap a hotel link, you leave the app and go to booking.com — they handle data from there | https://www.booking.com/content/privacy.html |
| **Airalo Affiliate** | eSIM purchase redirect | When you tap the eSIM card, you leave the app and go to airalo.com — they handle data from there | https://www.airalo.com/privacy-policy |
| **Apple App Store / Google Play** | Distribute the app | Your account is governed by their respective policies | apple.com/legal/privacy / policies.google.com/privacy |

We do **not** sell your data to any third party.

---

## 4. Children

The app is suitable for users of all ages. We do not knowingly collect
information from children under 13 / 16 (per local definitions of "child").
Group features require a display name that the user types in — children
should use a pseudonym (first name only).

---

## 5. Your rights

You can:
- **Delete all your data** by uninstalling the app (this clears all on-device
  storage).
- **Leave a group** at any time using the in-app "Leave group" control —
  this removes your row from our server.
- **Request deletion** of any data on our server by emailing
  privacy@sunnahumrah.com with the group code or Stripe session ID. We will
  process the request within 30 days.

If you are an EU/UK resident: under the GDPR / UK-GDPR, you also have the
right to access, rectify, port, or restrict processing of your data. Contact
privacy@sunnahumrah.com.

If you are a California resident: under the CCPA, you may request a copy of
your personal information and request deletion. Contact
privacy@sunnahumrah.com.

---

## 6. Data retention

| Data | Retention |
|---|---|
| AI chat questions | 30 days, then deleted |
| Group codes & members | 14 days after last activity, then auto-purged |
| Sadaqah transaction logs | 7 years (required for tax / accounting) |
| GPS coordinates | Not stored — used in a single request and discarded |

---

## 7. Security

- All traffic between the app and our servers is over **HTTPS / TLS 1.3**.
- Our database (MongoDB) is access-controlled and not publicly exposed.
- Stripe payment details never touch our servers — they are tokenised on
  your device and sent directly to Stripe.

---

## 8. Changes to this policy

We may update this policy. The "Effective date" at the top will reflect any
change. For material changes, we will surface a notice in the app.

---

## 9. Contact

Questions, requests, or concerns:

**Email**: privacy@sunnahumrah.com
**Operator**: [YOUR LEGAL NAME OR COMPANY NAME]
**Address**: [YOUR ADDRESS — required by Apple/Google if you are an
individual developer; you can use a virtual mailbox service]

---

*May Allah accept your ʿUmrah — taqabbalAllāhu minnā wa minkum.*
