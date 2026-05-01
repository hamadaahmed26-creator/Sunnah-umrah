# Affiliate Signups — Step-by-Step

> Sunnah Umrah's `/shop` page already works without any tags (links work, you just earn nothing). The moment you complete each signup below and paste the tag into `frontend/.env.production`, every click from the app starts earning commission.

---

## 1️⃣ Amazon Associates UK

**Earnings:** ~3% on most categories, up to 8% on books / luxury beauty. Payout monthly via bank transfer once £25 is earned.

### Step-by-step

1. Open **`https://affiliate-program.amazon.co.uk/`**
2. Click **Sign up** (top-right). Sign in with your normal Amazon UK account (the same one you shop with).
3. **Account information** → confirm your name, address, phone number (must match your bank).
4. **Website and Mobile App List** — add:
   - `https://sunnahumrah.app`
5. **Profile** → preferred Store ID: type `sunnahumrah` (Amazon may suffix `-21` for UK → `sunnahumrah-21`).
6. **Niche/topics**: pick **Books**, **Travel**, **Religious products**, **Lifestyle**.
7. **Traffic sources**: tick **Direct (mobile app users)**, **Organic search**.
8. **How you drive traffic**: paste this:
   > Sunnah Umrah is a step-by-step Umrah companion app (PWA + iOS/Android). The Shop section recommends Amazon UK products genuinely useful to Muslim pilgrims — Ihram clothing, Islamic books, Sidr honey, prayer mats, Zamzam containers — alongside hotels and eSIMs. Promotion is contextual and in-app only.
9. **How many monthly visitors**: pick the lowest realistic option (`<500`). Amazon won't reject for low traffic.
10. **Payment & tax info**: same UK address + Revolut account ending 0917 (or main bank).
11. **Click "Finish"**. You're approved **instantly** ✅
12. **Find your tracking ID**: top-right → **Manage Your Tracking IDs**. Copy something like `sunnahumrah-21`.

### After signup

📩 **Send me your tracking ID** (e.g., `sunnahumrah-21`).

I'll add it to `frontend/.env.production` as:
```
REACT_APP_AMAZON_TAG=sunnahumrah-21
```

Every Amazon link in the Shop will then carry your tag → commission lands in your account 30–60 days after each sale.

### ⚠️ Amazon rules to NEVER break (otherwise you get banned)
- ❌ Don't click your own links — Amazon detects this within 1–2 clicks
- ❌ Don't email Amazon links to people (only in-app + on website)
- ❌ Don't display the price as static — Amazon prices change, so the app shows "From £X" and the real price comes up on Amazon
- ❌ Don't use a URL shortener (e.g., bit.ly) — direct links only
- ✅ DO add the affiliate disclosure (already done in the Shop footer)

### 180-day rule
You **must make 3 qualifying sales within 180 days** of signing up, or Amazon closes your account. Once your app launches and gets ~50 daily users, this happens easily. If you're worried, ask 3 family members to buy something via your link.

---

## 2️⃣ Skyscanner Travel Affiliate (via Travelpayouts)

Skyscanner doesn't run direct affiliates — they use **Travelpayouts** (a Russian-based meta-affiliate network that handles 80% of travel affiliates).

**Earnings:** ~$0.50–$2 per outbound flight click, ~50% commission on hotel/car bookings.

### Step-by-step

1. Open **`https://www.travelpayouts.com/`**
2. Click **Sign up** (top-right). Use your UK email + a strong password.
3. Verify your email (check inbox + spam).
4. Profile setup → **What's your role?** → Pick **Web/App owner**. **Country?** → United Kingdom.
5. Dashboard → **My tools** → **Skyscanner**. Click **Connect** / **Activate**.
6. Skyscanner application form opens. Fill in:
   - **Website**: `https://sunnahumrah.app`
   - **Traffic type**: Mobile app + content
   - **Audience**: Muslim pilgrims travelling for Umrah
   - **Description**: Same description as above (or the network profile we used for CJ)
   - **Estimated monthly clicks**: <1,000
7. Submit. Skyscanner reviews within **2–7 days**.
8. Once approved, you get a unique **Associate ID** (a 6–8 character string like `c5a7f2`).

### After approval

📩 **Send me your Associate ID** (e.g., `c5a7f2`).

I'll add it to `frontend/.env.production` as:
```
REACT_APP_SKYSCANNER_TAG=c5a7f2
```

Flight cards in the Shop will then carry your tag.

### Bonus — Travelpayouts has more partners

Once you have a Travelpayouts account, you can ALSO apply to:
- **Hotels.com** (sometimes higher commissions than Booking.com)
- **Vrbo** (Airbnb-style stays)
- **Wego** (the Saudi-focused travel meta — VERY high pilgrim traffic)
- **GetYourGuide** (Ziyārah-related tours)

All free. Apply to all, plug tags into the env file.

---

## 3️⃣ Already-active partners (no action needed)

You're already earning on:
- 🏨 **Booking.com** — pending CJ approval (1–7 days from your application)
- 📶 **Airalo** — using `REACT_APP_AIRALO_REF` (set this whenever you sign up)
- 💳 **Stripe Sadaqah** — using your live Stripe key (when you go live)

---

## ✅ TL;DR — what to do this week

1. Today: sign up for **Amazon Associates UK** (10 min, instant approval) → send me tag
2. Today: sign up for **Travelpayouts → Skyscanner** (10 min + 2-7 day wait) → send me ID when approved
3. While waiting: also sign up to **Wego** through Travelpayouts (Saudi-focused = perfect for your audience)
4. When Booking.com CJ approves: send me the PID

Estimated total earnings once your app has 1,000 active monthly users:
- Amazon (4% of users buy something at ~£15 avg): ~£24/mo
- Booking.com (1% book a hotel at ~£200 / 4% commission): ~£80/mo
- Skyscanner (5% click through, $1 each): ~£40/mo
- Airalo (3% buy eSIM at ~£10 / 10% commission): ~£3/mo
- **Conservative total: ~£150/month with 1k users**

10x that with 10k users. Pure passive once set up. 🟢
