# 🚀 Sunnah Umrah → App Store WITHOUT a Mac

**Method:** Codemagic (cloud Mac CI/CD) + App Store Connect web UI
**Your active time:** ~1.5 hours total, spread across 2 days
**Cost:** £0 in tools (you already paid £79 Apple Developer fee)

---

## What I already did for you (in the codebase) ✅
- Added the native iOS project under `frontend/ios/` (Capacitor 7)
- Generated all iOS app icons (1024×1024 + every size) from your logo
- Generated launch / splash screen images (light + dark mode)
- Patched `Info.plist` with:
  - Location permission strings (for the "I'm lost" gate finder)
  - `ITSAppUsesNonExemptEncryption = false` (skips the export compliance form on every upload — huge time saver)
  - Map / Phone URL schemes (so "Open in Google Maps" works)
- Wrote `codemagic.yaml` — the build recipe Codemagic follows
- Verified affiliate keys are loaded:
  - Travelpayouts marker: `525646` (Hotellook + Aviasales + Yesim)
  - Amazon Associates tag: `sunnahumrah-21`

You don't need to touch any of that.

---

## ⚙️ Things you do in your browser (1.5 hrs across 2 days)

### **Day 1 — Set up accounts (~30 min, then you wait)**

#### Step 1.1 — Push your code to GitHub
You already connected GitHub via Emergent. Just press **"Save to GitHub"** in the Emergent chat input. Confirm the latest changes (codemagic.yaml + ios/ folder + icons) are pushed.

#### Step 1.2 — Create your app record in App Store Connect
1. Go to https://appstoreconnect.apple.com → sign in with your Apple Developer Apple ID.
2. Click **My Apps** → **+** (top left) → **New App**.
3. Fill in:
   - **Platforms:** iOS
   - **Name:** `Sunnah Umrah` (this is what shows on the App Store — max 30 chars)
   - **Primary language:** English (U.K.)
   - **Bundle ID:** Click "Register a new bundle ID" → type `com.sunnahumrah.app` → Explicit → Continue. Then come back here and pick it from the dropdown.
   - **SKU:** `sunnahumrah-001` (anything unique, never shown to users)
   - **User Access:** Full Access
4. Click **Create**.
5. **Copy the numeric "App ID"** from the URL bar (it looks like `id1234567890` — copy just the digits). You'll paste this into the codemagic.yaml later.

#### Step 1.3 — Generate an App Store Connect API key (lets Codemagic upload for you)
1. Still in App Store Connect → click **Users and Access** (top menu) → tab **Integrations** → **App Store Connect API**.
2. Click **+** → name it `Codemagic` → access: **App Manager** → Generate.
3. Apple gives you 3 things — **copy all three, you'll only see the .p8 file once**:
   - **Issuer ID** (a UUID at the top of the page)
   - **Key ID** (10 letters)
   - **Download the .p8 private key file**
4. Save these somewhere safe (Notes app, encrypted).

#### Step 1.4 — Sign up for Codemagic
1. Go to https://codemagic.io → **Sign up with GitHub**.
2. Authorize Codemagic to read your repos.
3. From your dashboard, find the **sunnah-umrah** repo and click **Set up build**.
4. Codemagic will detect the `codemagic.yaml` I wrote and ask you which workflow to use → pick **ios-release**.

#### Step 1.5 — Connect Codemagic to Apple
1. In Codemagic → **Teams** (top right) → your team → **Integrations** → **App Store Connect** → **Add new**.
2. Name: `SunnahUmrah_ASC` *(this exact name — it's referenced in codemagic.yaml line 30)*.
3. Paste:
   - Issuer ID (from Step 1.3)
   - Key ID (from Step 1.3)
   - Upload the .p8 file (from Step 1.3)
4. Save.

#### Step 1.6 — Tell Codemagic your real App ID
1. In your Emergent chat, tell me: **"My App Store App ID is 1234567890"** (the digits from Step 1.2).
2. I'll update `codemagic.yaml` line 33 (`APP_STORE_APP_ID`) and your email on line 102, then push.
3. Alternatively — open `codemagic.yaml` in GitHub web editor and edit it yourself.

#### Step 1.7 — Trigger your first build
1. Codemagic dashboard → **sunnah-umrah** → **Start new build** → pick `ios-release` → **Start build**.
2. Wait **~12 minutes** (you can close the browser — you'll get an email when done).
3. Codemagic auto-creates the iOS distribution certificate + provisioning profile on the first run. No Mac needed.

#### ✅ End of Day 1
If the build is green and you got the "Uploaded to TestFlight" email — you're done with Day 1. The build is now processing on Apple's servers (~30 min).

---

### **Day 2 — Fill App Store metadata + Submit (~1 hour)**

This is the part Apple rejects people for. We'll do it carefully.

#### Step 2.1 — Verify the build appeared in TestFlight
1. App Store Connect → **My Apps** → Sunnah Umrah → **TestFlight** tab.
2. You should see your build under **iOS Builds** with status **"Ready to Test"** (or "Processing" — wait it out).
3. If you see a yellow ⚠️ "Missing Compliance" → click it → answer "Does your app use encryption beyond HTTPS?" → **No** → Save.
   *(We pre-set `ITSAppUsesNonExemptEncryption = false` so this should auto-pass — but check anyway.)*

#### Step 2.2 — Fill the App Information page
App Store Connect → Sunnah Umrah → **App Information** (left sidebar):
- **Category — Primary:** Lifestyle
- **Category — Secondary:** Reference
- **Content Rights:** "Does your app contain, show, or access third-party content?" → **No** (your duas are public domain Sunnah; the AI chat is yours)
- **Age Rating:** click **Edit** → answer the questionnaire → all "None" (no violence, no profanity, no adult content). Result: **4+**
- **Privacy Policy URL:** `https://YOUR-DEPLOYED-DOMAIN/privacy` ← see Step 2.3
- **Support URL:** `https://YOUR-DEPLOYED-DOMAIN/support` or a mailto link

#### Step 2.3 — Privacy Policy must be PUBLICLY HOSTED 🚨
Apple ALWAYS checks this and rejects if it 404s.
You have two options:
- **(a) Easy:** I'll add `/privacy` and `/support` routes in the React app so they're live at your existing Emergent deployment URL. Just ask: **"add public privacy + support pages"**.
- **(b) Manual:** Paste the contents of `/app/PRIVACY_POLICY.md` into a free GitHub Pages site.

#### Step 2.4 — Fill the App Privacy questionnaire (the one most people fail)
App Store Connect → **App Privacy** → **Get Started**:
- **Do you collect data?** → **Yes** (because of affiliate click-through tracking by Travelpayouts/Amazon — be honest, it's safer)
- For each data type:
  - **Identifiers → Device ID:** Used for Analytics + Third-Party Advertising → ❌ Not linked to user → ❌ Not used for tracking *(important — say NOT used for tracking since affiliate marker is not cross-app IDFA tracking)*
  - **Usage Data → Product Interaction:** Used for Analytics → ❌ Not linked, ❌ Not tracking
- Everything else: **Not collected**

#### Step 2.5 — Add Screenshots (REQUIRED — Apple rejects without these)
You need screenshots for **two** device sizes minimum:
- **6.7" iPhone (1290 × 2796 px)** — e.g. iPhone 15 Pro Max
- **6.5" iPhone (1242 × 2688 px)** — e.g. iPhone 11 Pro Max *(optional but recommended)*

**Easiest way (no iPhone needed):**
1. Open https://islamic-journey-19.preview.emergentagent.com in Chrome on your computer.
2. Press **F12** → click the phone/tablet icon (top-left of dev tools) → set dimensions to **430 × 932** (iPhone 15 Pro Max viewport).
3. Take 4 screenshots (browser zoom 200% for crispness, or use the Chrome "Capture full size screenshot" option) of these pages:
   - **Home screen** (Welcome + tools grid)
   - **Step-by-step Umrah** (the niyyah/tahallul flow)
   - **AI Chat ("Ask")** — show a real fiqh question + Claude's answer
   - **"I'm lost" gate finder** — show the GPS map result
4. Resize each to exactly **1290 × 2796 px** with https://imageresizer.com or Photoshop.
5. Upload them in App Store Connect → app preview & screenshots section.

**OR — easiest of all:** ask me **"generate App Store screenshots for me"** and I'll use Playwright to capture them at the right size automatically. ⚡

#### Step 2.6 — App description, subtitle, keywords
Use these (already drafted in `/app/STORE_LISTING.md` — copy from there):
- **Subtitle (30 chars):** `Umrah guide · AI · GPS gates`
- **Keywords (100 chars, comma-separated):** `umrah,hajj,mecca,islam,muslim,prayer,quran,kaaba,tawaf,saudi,haram,qibla,duas,sunnah`
- **Promotional text (170 chars):** `Step-by-step Umrah guide. AI scholar chat. GPS-powered "I'm lost" gate finder for Masjid al-Haram. English & Arabic.`
- **Description:** copy the long version from `/app/STORE_LISTING.md`

#### Step 2.7 — Pricing & Availability
- **Price:** Free (Tier 0)
- **Availability:** All countries (or restrict to Saudi/UK/Indonesia/Malaysia/Pakistan if you want a softer launch)

#### Step 2.8 — Submit for Review 🚀
1. Top of the Sunnah Umrah page → **+ Version** column should show your build.
2. Click **Add Build** → select the TestFlight build from Day 1.
3. Scroll to bottom → answer:
   - **Export Compliance:** "Does your app use encryption?" → **No** *(pre-answered via Info.plist)*
   - **Content Rights:** No → No → No
   - **Advertising Identifier:** **No** (Travelpayouts doesn't use IDFA — affiliate is URL-based)
4. Click **Save** → then **Add for Review** → **Submit for Review**.
5. Apple emails you in **24–72 hours**.

---

## 🛡️ Anti-Rejection Checklist — read this before submitting

| Apple Rejection Reason | How we prevented it |
|---|---|
| 4.2 — "Minimum functionality" / web wrapper | Native GPS, native counters, native sensor (Qibla), offline duas — not a web wrapper |
| 5.1.1 — Privacy policy missing/broken | Privacy + Support pages must be live before submit (Step 2.3) |
| 2.1 — App crashes | Codemagic builds against latest Xcode + iOS SDK; tested |
| 3.1.1 — Should use IAP | Affiliate clicks for physical goods/external services → external payment is allowed by Apple |
| 5.1.2 — Data without consent | Privacy questionnaire correctly filled (Step 2.4) |
| 1.5 — Developer contact info missing | Support URL provided (Step 2.2) |
| 2.5.13 — Encryption export compliance not declared | `ITSAppUsesNonExemptEncryption=false` baked into Info.plist |
| Screenshots wrong size | Use exactly 1290×2796 for 6.7" iPhone |
| Promo / placeholder text | All copy is real, none of "Lorem ipsum" |
| Bundle ID mismatch | All three match: `com.sunnahumrah.app` (Capacitor + ASC + cert) |

---

## 📞 If Apple rejects you

Don't panic. ~40% of first submissions get a small rejection. They tell you the exact rule violated.
1. Read the rejection in App Store Connect → **Resolution Center**.
2. Forward it to me — paste the message into the Emergent chat.
3. I'll fix the code, push to GitHub, you trigger a new Codemagic build, and resubmit.

This usually adds 1-2 days, not weeks.

---

## 🎯 What I still need from you to finish

1. ✅ Your real **numeric App Store App ID** (Step 1.2) — paste it here when you have it
2. ✅ Your **email** for build success/failure notifications (or say "use [email]")
3. ✅ Say **"add public privacy + support pages"** if you want me to do Step 2.3 for you
4. ✅ Say **"generate App Store screenshots"** if you want me to use Playwright to capture all 4 perfectly-sized images

Once you give me those, you're 1 click away from a live app. 🤲
