// Single source of truth for ALL affiliate URLs in the app.
//
// Travelpayouts uses one Marker ID across its native brands (Aviasales for
// flights, Hotellook for hotels, Yesim for eSIM). Once a Marker is set,
// every click to those brands attributes commission to your account — no
// per-offer "Connect" step required for these three.
//
// Amazon Associates uses a separate `tag=` param on every product URL.
//
// Both keys live in /app/frontend/.env so the same codebase works in dev
// and prod, and so we never hard-code IDs in components.

const TP_MARKER = process.env.REACT_APP_TP_MARKER || "";
const AMAZON_TAG = process.env.REACT_APP_AMAZON_TAG || "";

// Append `?marker=...` (or `&marker=...`) without breaking existing query strings.
function withMarker(url) {
  if (!TP_MARKER) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}marker=${TP_MARKER}`;
}

// ─── HOTELS — Hotellook (Travelpayouts native meta-search; aggregates Booking, Agoda, etc.)
export function hotellookSearch({ destination, checkin, checkout, adults }) {
  const params = new URLSearchParams({
    destination,
    checkIn: checkin,
    checkOut: checkout,
    adults: String(adults),
    children: "0",
  });
  return withMarker(`https://search.hotellook.com/hotels?${params.toString()}`);
}

// ─── FLIGHTS — Aviasales (Travelpayouts native; comparable to Skyscanner)
export function aviasalesTo(destIata) {
  return withMarker(`https://www.aviasales.com/search?destination=${destIata}`);
}

// ─── eSIM — Yesim (Travelpayouts partner; user already connected this offer)
export function yesimSaudi() {
  return withMarker("https://yesim.tech/");
}

// ─── AMAZON UK — product affiliate links
export function amazonUk(asin) {
  const base = `https://www.amazon.co.uk/dp/${asin}`;
  if (!AMAZON_TAG) return base;
  return `${base}?tag=${AMAZON_TAG}`;
}

// ─── Disclosure copy used on every page that shows affiliate links.
export function affiliateDisclosure(isAr) {
  return isAr
    ? "نتعاون مع Hotellook وAviasales وYesim (عبر Travelpayouts) وAmazon UK — قد نحصل على عمولة صغيرة عند الشّراء عبر هذه الرّوابط، بدون أيّ تكلفة إضافيّة عليك."
    : "We partner with Hotellook, Aviasales and Yesim (via Travelpayouts) and Amazon UK — we may earn a small commission on purchases made through these links, at no extra cost to you.";
}

// Exposed for debug / testing only.
export const __debug = { TP_MARKER, AMAZON_TAG };
