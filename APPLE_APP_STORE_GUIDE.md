# 🍎 How to Put Sunnah Umrah on the iPhone App Store

**This guide is for YOU (Hamada), not a developer.** Every step is written like
I'm sitting next to you. No jargon. Read it once. Then do it slowly.

---

## ⏱ How long will this take?
- **Day 1 (1 hour):** Apple Developer signup (waiting for approval)
- **Day 2–3 (3 hours):** Set up Mac, install tools, wrap your app
- **Day 4 (2 hours):** Make pretty screenshots + write app description
- **Day 5 (1 hour):** Submit to Apple
- **Day 5–8:** Apple reviews it (you wait)
- **Day 9 (5 minutes):** It's LIVE on the App Store 🎉

**Total: ~7 hours of YOUR work + ~5 days of waiting.**

---

## 💰 What will it cost?
- **Apple Developer Account: £79 per year (forever)** — you need this to upload anything to the App Store
- That's it. Everything else is free.

---

## 🛠 What you'll need
- [ ] A Mac (you said you're getting one)
- [ ] Your iPhone (for testing)
- [ ] A passport or driving license (for Apple verification)
- [ ] A credit/debit card (for the £79)
- [ ] Coffee ☕

---

# PART 1: Apple Developer Account
**(Do this on Day 1, FIRST — because it takes 24–48 hours to get approved.)**

## Step 1.1
Go to: **https://developer.apple.com/programs/enroll/**

## Step 1.2
Click the big blue **"Start Your Enrollment"** button.

## Step 1.3
Sign in with your **Apple ID** (the same one you use for iCloud and the App Store).
If you don't have one, make one at appleid.apple.com first.

## Step 1.4
It asks **"Individual" or "Organization"?**
👉 **Pick: Individual.**

(Organization is for companies with a "D-U-N-S Number" which is a whole nightmare.
Individual is simpler. You can change to Organization later if you start a Ltd company.)

## Step 1.5
Fill in your details exactly as they appear on your passport:
- Full legal name
- Address
- Phone number

## Step 1.6
Pay the **£79/year** fee.

## Step 1.7
Apple emails you. **Wait 24–48 hours.** Sometimes faster, sometimes longer.
You'll get an email saying *"Welcome to the Apple Developer Program."* ✅

**You can't do anything else until this approval comes through. Be patient.**

---

# PART 2: Set up your Mac
**(Do this on Day 2 — only AFTER your Apple Developer account is approved.)**

## Step 2.1 — Install Xcode
Open **App Store** on your Mac → search **"Xcode"** → click **Install**.

⚠️ Xcode is HUGE (about 15 GB) and takes **1–2 hours** to download.
Plug your Mac in. Get tea.

## Step 2.2 — Install Node.js
Go to: **https://nodejs.org**
Click the **big green LTS button** to download.
Run the installer. Just keep clicking Next.

## Step 2.3 — Open Terminal
On your Mac, press **Cmd + Space** → type **"Terminal"** → press Enter.
A black/white text window opens. **This is where you'll type the magic commands.**
Don't be scared. You just copy-paste.

## Step 2.4 — Install one helper tool
In Terminal, copy-paste this line and press Enter:

```
sudo gem install cocoapods
```

It asks for your Mac password. Type it (you won't see the letters, that's normal).
Wait 2 minutes for it to finish.

## Step 2.5 — Sign Xcode into your Apple ID
Open Xcode → top menu **Xcode → Settings → Accounts** tab
Click the **"+"** button → choose **"Apple ID"** → sign in with the same Apple ID you used for the Developer Program.

You should see your name with **"Apple Development"** and **"Apple Distribution"** under it. ✅

---

# PART 3: Get your app on your Mac
**(Day 2 or 3 — about 30 minutes.)**

## Step 3.1 — Save the code to GitHub
Inside Emergent, click the **"Save to Github"** button in the chat input.
This puts your code on GitHub.com. You'll get a URL like:
`https://github.com/yourname/sunnah-umrah`

## Step 3.2 — Download to your Mac
In Terminal on your Mac, type these one at a time (replace `yourname` with your real GitHub name):

```
cd Desktop
git clone https://github.com/yourname/sunnah-umrah.git
cd sunnah-umrah/frontend
yarn install
```

That last line takes 2–3 minutes.

---

# PART 4: Wrap your web app into an iPhone app
**(Day 3 — about 1 hour. This is the cool part.)**

We're going to use a tool called **Capacitor**. Think of it as a magic box: you put
your web app in, and a real iPhone app pops out.

## Step 4.1 — Add Capacitor
Still in Terminal, still inside the `frontend` folder, paste:

```
yarn add @capacitor/core @capacitor/cli @capacitor/ios
yarn build
npx cap init "Sunnah Umrah" "app.sunnahumrah" --web-dir=build
npx cap add ios
```

When asked anything, just press Enter to accept defaults.

This creates a folder called `ios` inside your project. **That folder IS your iPhone app.** ✨

## Step 4.2 — Open it in Xcode
In Terminal:
```
npx cap open ios
```

Xcode opens. You'll see lots of files on the left. Don't touch them.

## Step 4.3 — Set the App Icon
Inside Xcode, on the left, click:
**App → App → Assets → AppIcon**

Drag your app icon image into each of the empty slots.
You need it in many sizes (1024×1024 down to 20×20). Easiest way to make all the sizes from one file:

**Go to: https://www.appicon.co**
Upload one 1024×1024 PNG of your icon. It generates ALL the sizes in a zip.
Unzip → drag each one into the matching slot in Xcode.

## Step 4.4 — Set the App Name and Bundle ID
Top of Xcode, click on **"App"** in the file list. A settings panel opens on the right.

- **Display Name**: type **Sunnah Umrah**
- **Bundle Identifier**: should already say **app.sunnahumrah** (don't change)
- **Version**: **1.0.0**
- **Build**: **1**

Under **Signing & Capabilities** tab → **Team**: pick **your name (Personal Team)** from the dropdown.

## Step 4.5 — Test on your iPhone
Plug your iPhone into your Mac with a USB cable.
Unlock the phone. Tap **"Trust This Computer"** when it asks.

In Xcode, at the top, where it says "Any iOS Device", click and choose **your iPhone** from the list.
Press the big **▶️ Play button** (top-left).

The app installs on your phone. You'll see it on your home screen as **"Sunnah Umrah"** with your icon! 🎉

On your phone: **Settings → General → VPN & Device Management → trust your developer profile.**
Now you can open the app.

---

# PART 5: Prepare the App Store listing
**(Day 4 — about 2 hours.)**

## Step 5.1 — Go to App Store Connect
Open Safari, go to: **https://appstoreconnect.apple.com**
Sign in with your Apple ID.

## Step 5.2 — Make a new app
Click **My Apps → + → New App.**

Fill in:
- **Platform**: iOS
- **Name**: Sunnah Umrah
- **Primary Language**: English (U.K.)
- **Bundle ID**: choose **app.sunnahumrah** from the dropdown (it'll be there now)
- **SKU**: just type **sunnah-umrah-001**
- **User Access**: Full Access

Click **Create**.

## Step 5.3 — Fill in the "App Information" section

**Subtitle (30 chars max):**
> Step-by-step guided Umrah

**Category Primary:** Reference
**Category Secondary:** Travel

**Privacy Policy URL:** `https://sunnahumrah.app/privacy`

## Step 5.4 — Fill in the "Pricing" section

- **Price**: Free
- Available in: All countries

## Step 5.5 — Write the App Description

**Description (max 4000 chars):**
```
Sunnah Umrah is a step-by-step companion for performing Umrah according to the authentic Sunnah.

WHAT'S INSIDE:
• 15 clear steps from Miqat to Tahalul
• Authentic du'as with audio recitation
• Interactive Tawaf and Sa'i counters
• Live prayer times for your location
• Qibla compass
• AI fiqh assistant — ask questions, get answers from authentic Salafi sources
• Walk to the Haram — turn-by-turn directions in the app
• Group tracking — never lose your family in the crowd
• 26 historical Ziyarah places with photos and stories
• Readiness checklist before you travel
• Full English and Arabic support

WHO IT'S FOR:
Whether it's your first Umrah or your fifth, this app keeps you focused, calm and confident every step of the way. Designed especially with first-time pilgrims and reverts in mind.

ALL CONTENT VERIFIED:
Religious texts are sourced from Sahih al-Bukhari, Sahih Muslim, Manasik al-Albani, and the fatawa of Shaykh Ibn Baz and Shaykh Ibn Uthaymin (rahimahumullah).

PRIVACY:
We don't track you. Your data stays on your phone.

FREE FOREVER.

May Allah accept your Umrah.
```

**Keywords (100 chars max):**
```
umrah,hajj,sunnah,islam,muslim,kaaba,makkah,madinah,salafi,quran,prayer,qibla,tawaf,dua,zikr
```

**Support URL:** `https://sunnahumrah.app`
**Marketing URL:** `https://sunnahumrah.app`

## Step 5.6 — Screenshots (REQUIRED — without these, Apple rejects)

You need screenshots in these sizes:
- **iPhone 6.7"** (iPhone 14 Pro Max or 15 Pro Max) — 1290×2796 px — minimum **3 screenshots**
- **iPad 12.9"** — optional but adds polish

**Easiest way to make these:**
1. On your iPhone, open your app at `sunnahumrah.app` in Safari (or the wrapped app from Xcode)
2. Press **Side button + Volume Up** at the same time → takes a screenshot
3. Screenshot these 5 pages:
   - Home dashboard
   - Tour step (e.g. Tawaf step with timeline visible)
   - Walk to Haram map
   - Ask page (AI chat)
   - Checklist page

Drag the 5 screenshots into App Store Connect → **App Store → 6.7" Display → drag here.**

## Step 5.7 — Build upload
Back in Xcode on your Mac:
- Top menu: **Product → Archive**
- Wait 1–2 minutes
- A window pops up. Click **Distribute App → App Store Connect → Upload → Next → Next → Upload.**
- Wait 5–10 minutes.

Back in App Store Connect, refresh the page. You'll see **"Build 1"** appear under "Build". Select it. ✅

## Step 5.8 — Age rating
Click **"Age Rating"** in the sidebar → answer the questions honestly. For this app, everything is "None" except **"Unrestricted Web Access"** if you keep the AI chat → answer **"Frequent/Intense"** there (Apple is OK with it as long as you declare it).

Final age: **4+** is normal.

## Step 5.9 — Submit for Review
Top right of the app page, click the big **"Add for Review"** button → then **"Submit"**.

---

# PART 6: The waiting game

Apple usually replies in **3–5 days**. Sometimes 24 hours, sometimes 2 weeks.

Possible outcomes:
- ✅ **Approved** → app goes live within 24h, you get an email
- ⚠️ **Rejected** → they tell you exactly why. Fix it. Resubmit. Usually small things like "add a privacy URL" or "describe what your AI chat is for". Reject → fix → resubmit cycle is normal — even big apps go through this.

---

# 🔁 PART 7: Updating the app later

Whenever you change the code in Emergent and want to push it to the App Store:

1. Save to GitHub (Emergent button)
2. On Mac, in Terminal:
   ```
   cd Desktop/sunnah-umrah/frontend
   git pull
   yarn install
   yarn build
   npx cap sync
   npx cap open ios
   ```
3. In Xcode: bump **Build** number (1 → 2 → 3 etc), then **Product → Archive → Distribute → Upload.**
4. In App Store Connect, select the new build, write what's new, submit.

Apple usually approves UPDATES in 24 hours (faster than first submission).

---

# 🚑 IF YOU GET STUCK

**Common issues + plain-English fixes:**

| Error | What to do |
|---|---|
| "Build failed - signing error" in Xcode | Xcode → Preferences → Accounts → click your team → "Download Manual Profiles" |
| "Apple ID locked" | Wait 24 hours, then try again. Or call Apple Support: +44 800 048 0408 |
| "Bundle ID already exists" | Someone else took `app.sunnahumrah`. Try `app.sunnahumrah.uk` instead |
| "App Store rejected: missing privacy" | Add the privacy URL link in App Store Connect → App Information |
| "Capacitor command not found" | In Terminal: `yarn add @capacitor/cli` |

---

# 🆘 SHORTCUT — If this all feels too much

You can pay someone on **Fiverr** £30–£60 to do PART 4 only (the Capacitor wrapping + Xcode build). Search **"capacitor ios build"** on Fiverr.

You still need to do Parts 1, 5, 6 yourself because those need YOUR Apple ID.

---

That's it. Print this out. Stick it next to your Mac. Tick off each box as you go.
May Allah make it easy for you. 🤲
