# 🍎 Mac Day One — Kid-Level Checklist (Sunnah Umrah → App Store)

**Assumption:** Apple Developer = APPROVED ✅ · Mac = IN HAND ✅ · GitHub push = DONE ✅

**Total active time:** ~2.5 hours

**What you need nearby:**
- ✅ The Mac (plugged in)
- ✅ Your iPhone + a USB-C or Lightning cable (to plug iPhone into Mac)
- ✅ Apple ID email + password (not just Face ID)
- ✅ GitHub username + password (or SSH key)
- ✅ A cup of tea ☕

---

## PART 1 — Install Xcode (5 min of clicks, 40 min of waiting)

### Step 1.1
Tap the **Apple logo** (top-left corner of screen) → **System Settings** → **Apple ID** (your name at top of sidebar) → make sure you're signed in with the same Apple ID you used for the Developer enrollment. ✅

### Step 1.2
Open the **App Store** (rocket icon in Dock, or Launchpad → App Store)

### Step 1.3
In the search bar (top left), type **Xcode** → press Enter → click **GET** → click **Install**. 

Enter Apple ID password when prompted.

**⚠️ Xcode is 40 GB — it takes 20–60 min to download. Let it run in the background. Go grab tea. Move on to Part 2 while it downloads.**

### Step 1.4 (while downloading)
Open **Terminal** app (Spotlight: press ⌘+Space → type "Terminal" → Enter)

In Terminal, paste this (one line at a time, pressing Enter after each):

```bash
xcode-select --install
```

A popup asks to install Command Line Tools → click **Install** → Agree → wait for install.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
This installs **Homebrew** (tool that installs other tools). Press Enter/Return when asked, put in your Mac password when asked (⚠️ password won't show when typing — that's normal).

```bash
brew install node
npm install -g yarn
```
Installs Node.js + Yarn (needed for building the app).

### ☕ When Xcode is done downloading
Open Xcode once from Launchpad → it'll ask to agree to licence → click **Agree** → wait a couple minutes for it to "Install additional components" → **quit Xcode when it finishes**.

---

## PART 2 — Get the code from GitHub (10 min)

### Step 2.1 — Clone your repo
In Terminal:

```bash
cd ~
git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME.git sunnah-umrah
cd sunnah-umrah/frontend
yarn install
```

⚠️ Replace `YOUR-GITHUB-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub details (find them at github.com after logging in).

If Git asks for password → paste your GitHub **Personal Access Token** (NOT your GitHub password — GitHub removed password auth). Make one at: github.com → top-right profile → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick `repo` → copy the token.

### Step 2.2 — Quick sanity check
Still in the Terminal:

```bash
ls -la
```

You should see folders like `src`, `public`, `android`, `package.json`. ✅ Good.

---

## PART 3 — Create the iOS project (5 min)

### Step 3.1 — Make the iOS folder
In Terminal (still inside `sunnah-umrah/frontend`):

```bash
yarn cap:add:ios
```

Wait 2-3 min. This creates a fresh `ios/` folder with an Xcode project inside.

### Step 3.2 — Sync your React build into it
```bash
yarn cap:sync
```

Wait 1 min.

### Step 3.3 — Paste permission strings into Info.plist

Open the file in Finder:

```bash
open ios/App/App/Info.plist
```

This opens Info.plist in Xcode.

In Xcode, right-click anywhere in the blank area of the file → **Add Row** → type the key name → press Tab → paste the value. Repeat for all 4 keys below.

**Paste these 4 keys exactly (copy from `/app/IOS_INFO_PLIST.md`):**

| Key | Type | Value (the message iOS shows) |
|---|---|---|
| `NSLocationWhenInUseUsageDescription` | String | Sunnah Umrah uses your location to show direction to the Ka'bah, find your nearest gate of Masjid al-Haram, and share with your family group. |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | String | Sunnah Umrah uses your location to show direction to the Ka'bah, find your nearest gate of Masjid al-Haram, and share with your family group. |
| `NSMotionUsageDescription` | String | Sunnah Umrah uses motion sensors to power the Qibla compass needle. |
| `NSCameraUsageDescription` | String | Sunnah Umrah uses your camera only when you scan a family member's group QR code. |

Save (⌘+S) → close Xcode window.

---

## PART 4 — Generate app icons (5 min)

### Step 4.1 — Drop your master icon
You need a **1024×1024 PNG** of your app icon (the gold Ka'bah on charcoal, the same one in `/app/frontend/public/icon-512.png`).

In Terminal:

```bash
mkdir -p resources
cp public/icon-512.png resources/icon.png
cp public/icon-512.png resources/splash.png
```

(We're reusing your existing icon for both. Good enough for launch — we can upgrade later.)

### Step 4.2 — Generate all sizes
```bash
yarn add -D @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#F8F6F0' --splashBackgroundColor '#F8F6F0'
yarn cap:sync
```

Wait 2 min. Every required icon + splash size is now auto-generated for iOS + Android.

---

## PART 5 — Test on your real iPhone (20 min)

### Step 5.1 — Plug iPhone into Mac
- Plug your iPhone into the Mac with a USB-C or Lightning cable
- On the iPhone, a popup asks **"Trust this computer?"** → tap **Trust** → enter your iPhone passcode

### Step 5.2 — Open project in Xcode
In Terminal:

```bash
yarn cap:open:ios
```

Xcode opens with your project loaded.

### Step 5.3 — Set your Team (fixes Apple signing)
1. In Xcode's left sidebar, click the **blue App icon** at the very top (the project name)
2. Center panel → click **Signing & Capabilities** tab
3. **Team** dropdown → select **your name (Personal Team)** or your paid developer team
4. **Bundle Identifier** should say `com.sunnahumrah.app` ✅ leave it
5. If you see a red error like "Failed to register bundle identifier" → click **Try Again** button

### Step 5.4 — Pick your iPhone
Top of Xcode window, there's a device dropdown next to the ▶ button:
- Click it → pick **your iPhone name** (not a simulator)

### Step 5.5 — Press ▶ to run
- Click the big **▶ Play button** (top-left of Xcode)
- Xcode builds the app (wait 2-5 min first time)
- App installs on your iPhone and launches 🎉

### Step 5.6 — Trust the developer profile on iPhone
First run only — your iPhone refuses to open "Untrusted Developer".

On iPhone:
1. **Settings** → **General** → **VPN & Device Management**
2. Under Developer App, tap **your Apple Developer email** 
3. Tap **Trust** → confirm

Go back to home screen → tap the Sunnah Umrah icon → app launches ✅

### Step 5.7 — Test these features on real iPhone
- ✅ Qibla compass — tap **Allow location** → iOS native popup appears → tap Allow → needle spins
- ✅ "I'm Lost" gate finder — GPS works
- ✅ Group → "Share my live location" toggle → iOS popup → works
- ✅ Tour → Tawaf → all steps show correctly
- ✅ Language toggle EN ↔ AR

If ALL of these work → you're ready to submit! 🚀

---

## PART 6 — Generate App Store screenshots (10 min)

Still in Terminal:

```bash
yarn screenshots
```

This runs Playwright in the background, generates 16 screenshots (8 iPhone + 8 Android) into the folder `/app/store_screenshots/` (or wherever the script saves — check the path when it finishes).

**Open the folder in Finder** → you'll see files like `ios-01-tour-home.png`, `ios-02-tawaf-lap.png`, etc.

### 💾 COPY THESE SCREENSHOTS TO YOUR HP NOW

Before you return the Mac! Options:
- **USB stick**: drag-drop the folder to a USB stick
- **Email**: zip the folder, email it to yourself
- **AirDrop to iPhone** → then sync to HP via USB
- **Upload to Google Drive / iCloud Drive** → download on HP later

⚠️ **Without these, you can't finish the App Store listing from HP.**

---

## PART 7 — Upload to App Store Connect (15 min)

### Step 7.1 — Archive the build in Xcode
1. In Xcode, top menu: **Product → Archive**
2. Wait 3–5 min for build
3. The **Organizer** window opens showing your archive

### Step 7.2 — Upload to Apple
1. In Organizer, click your latest archive → click **Distribute App**
2. Select **App Store Connect** → Next
3. Select **Upload** → Next
4. Leave all defaults checked → Next → Next
5. Select **Automatically manage signing** → Next
6. Click **Upload**
7. Wait 5-10 min for upload → "Upload Successful" ✅

### Step 7.3 — Screenshot the "Upload Successful" screen
📸 Take a screenshot so you have proof the build is in Apple's system. Then close Xcode.

---

## PART 8 — App Store Connect listing (can be finished on HP later!)

**⚠️ You can do this step from the Mac now, OR from your HP afterwards. Both work.** Safari on Mac is easier because you're already logged in.

### Step 8.1 — Open App Store Connect
Go to **appstoreconnect.apple.com** → sign in → **My Apps** → **+** → **New App**

### Step 8.2 — Create the app record
- Platforms: **iOS**
- Name: **Sunnah Umrah**
- Primary Language: **English (U.K.)**
- Bundle ID: **com.sunnahumrah.app** (should auto-appear from your upload)
- SKU: `SUNNAH-UMRAH-001` (any unique string)
- User Access: Full Access

### Step 8.3 — Fill in the listing
The sidebar shows sections to fill. Copy-paste from `/app/STORE_LISTING.md` and `/app/STORE_PUBLISHING.md`. Key fields:

| Field | Value |
|---|---|
| Subtitle | Step-by-step, the Sunnah way |
| Category (Primary) | **Reference** |
| Category (Secondary) | **Lifestyle** |
| Description | Copy from `/app/STORE_PUBLISHING.md` §9 |
| Keywords | `umrah, hajj, mecca, makkah, sunnah, dua, qibla, prayer, tawaf, sai, ziyarah, kaaba` |
| Support URL | `https://sunnahumrah.app` |
| Marketing URL | `https://sunnahumrah.app` |
| Privacy Policy URL | `https://sunnahumrah.app/privacy` ⚠️ required |
| Age Rating | tap **Edit** → answer all NO except "Infrequent/Mild Mature/Suggestive Themes" (Islamic content can touch on some topics) → Result: **4+** |
| App Privacy | Declare: Location (not linked) + Usage Data None + Identifiers None |

### Step 8.4 — Upload screenshots
Drag-drop the 8 iPhone screenshots you generated in Part 6 into the **6.7" iPhone** section.

### Step 8.5 — Pick your uploaded build
Section **Build** → click **+** → select the build you uploaded in Part 7.

### Step 8.6 — Submit for Review
Click **Submit for Review** → answer the final questions:
- Uses ITMS-encryption: **No**
- Content Rights: **No, it does not contain, show, or access third-party content**
- Advertising Identifier: **No**

Click **Submit** 🎉

---

## ⏱️ After submission — PURE WAITING

Apple reviews your app. Usual timeline: **2–3 days**, sometimes **5 days**.

You'll get an email:
- ✅ **"Your app is ready for distribution"** → log in → click **Release** → app goes LIVE on App Store within 1-2h 🕋
- ❌ **"Rejection"** → Apple explains why → I help you fix → resubmit (takes another 24-48h)

---

## 🆘 STUCK? Paste the error to me

If ANY step errors out:
1. Take a screenshot
2. Send to me in chat
3. I'll tell you exactly what to click

Most common first-time errors:
- "No Team found" → finish Apple Developer enrollment
- "Bundle ID already exists" → someone else registered it first (unlikely for you — it's auto-created on first upload)
- "Provisioning profile issue" → click **Try Again** in Xcode 3x; usually auto-resolves

---

## ⏱️ Timing summary

| Phase | Minutes | Can interrupt? |
|---|---|---|
| Part 1 — Install Xcode | 60 (mostly downloading) | ✅ Yes, background task |
| Part 2 — Clone GitHub | 10 | — |
| Part 3 — iOS project | 15 | — |
| Part 4 — Icons | 5 | — |
| Part 5 — Test on iPhone | 20 | — |
| Part 6 — Screenshots | 10 | — |
| Part 7 — Upload to Apple | 15 | — |
| Part 8 — Listing forms | 30 | ✅ Yes, can finish on HP |
| **TOTAL on Mac** | **~2h 45min** | **Plenty of buffer in 6 hours** |

You have 3+ hours of buffer for anything that takes longer than expected. 😌

---

*May Allah accept your work and make this a means of benefit for every pilgrim who uses it. 🤲*
