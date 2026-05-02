// User profile — captured during onboarding on first launch.
// Stored locally only (no server). Powers personalized greetings, trip
// countdown, accessibility shortcuts, and beginner-mode hints.

const KEY = "umrah_user_profile";

export const DEFAULT_PROFILE = {
  done: false,             // onboarding completed
  travelers: null,         // "solo" | "spouse" | "family" | "wheelchair"
  experience: null,        // "first" | "returning" | "helping"
  knowledge: null,         // "confident" | "refresher" | "beginner"
  tripDate: null,          // ISO date string "YYYY-MM-DD" or null
  name: null,              // optional display name
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

// Days between today and the trip date. Returns null if no trip date.
// Negative = past, 0 = today, positive = upcoming.
export function daysUntilTrip(tripDate) {
  if (!tripDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const trip = new Date(tripDate);
  trip.setHours(0, 0, 0, 0);
  const diffMs = trip - today;
  return Math.round(diffMs / 86400000);
}

// Smart prompt based on days until trip.
export function tripPrompt(days, isAr) {
  if (days === null) return null;
  if (days < 0) return null; // trip is in the past — caller hides the card
  if (days === 0) {
    return isAr
      ? "اليوم هو اليوم! تقبّل الله منك."
      : "Today's the day! May Allah accept it from you.";
  }
  if (days <= 6) {
    return isAr
      ? "أيّامك الأخيرة — قلّم أظفارك، تعطّر، واستعدّ للإحرام."
      : "Final days — clip your nails, perfume yourself, prepare your iḥrām.";
  }
  if (days <= 13) {
    return isAr
      ? "اشترِ الإحرام، احصل على شريحة eSIM، وراجع الخطوات."
      : "Get your iḥrām, buy an eSIM, review the steps.";
  }
  if (days <= 29) {
    return isAr
      ? "قدّم على التّأشيرة، أكّد الفندق، وراجع المواقيت."
      : "Apply for visa, confirm hotel, review the Mīqāts.";
  }
  if (days <= 59) {
    return isAr
      ? "احجز الفندق والطّيران الآن قبل ارتفاع الأسعار."
      : "Book hotels & flights now before prices climb.";
  }
  return isAr
    ? "وقتٌ كافٍ — اقرأ عن الخطوات وادعُ الله أن يتقبّل منك."
    : "Plenty of time — read up on the steps and ask Allah to accept it.";
}
