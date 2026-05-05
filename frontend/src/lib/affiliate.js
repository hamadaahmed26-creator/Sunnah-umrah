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

// ─── FLIGHTS — Aviasales (Travelpayouts native; user is approved)
//
// We build the Aviasales path-based search URL so the page lands on a
// pre-filled, ready-to-go result instead of an empty search box. Format:
//   https://www.aviasales.com/search/{ORIG}{DDMM}{DEST}{DDMM}1?currency=gbp
// Defaults: London origin, depart in ~30 days, 7-night return, 1 adult, GBP.
function ddmm(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}${mm}`;
}
export function aviasalesTo(destIata, origIata = "LON") {
  const depart = new Date();
  depart.setDate(depart.getDate() + 30);
  const ret = new Date(depart);
  ret.setDate(ret.getDate() + 7);
  const path = `${origIata}${ddmm(depart)}${destIata}${ddmm(ret)}1`;
  return withMarker(`https://www.aviasales.com/search/${path}?currency=gbp&locale=en`);
}

// ─── eSIM — Yesim (Travelpayouts partner; user already connected this offer)
export function yesimSaudi() {
  return withMarker("https://yesim.tech/");
}

// ─── AMAZON UK — search-based affiliate links
//
// We deliberately use SEARCH URLs (not /dp/ASIN) because:
//  1. ASINs occasionally get delisted → user lands on a 404 ("Uh-oh") page
//  2. Search results stay fresh — Amazon ranks the best/in-stock items first
//  3. Commission still attributes to your tag for ANYTHING they buy in the
//     same session (24-hour cookie window)
export function amazonUkSearch(query) {
  const q = encodeURIComponent(query);
  const base = `https://www.amazon.co.uk/s?k=${q}`;
  if (!AMAZON_TAG) return base;
  return `${base}&tag=${AMAZON_TAG}`;
}

// Kept for any direct-ASIN links elsewhere (currently unused in shop).
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
