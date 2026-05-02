// Platform-aware geolocation error helpers.
//
// Goal: when the user denies (or the device blocks) the location permission,
// show a clear, helpful, *platform-specific* message instead of a raw error.
// Works on real Safari (iOS), Chrome (Android), Capacitor wrappers — and
// degrades gracefully inside the Emergent preview iframe (which strips the
// permission silently for security reasons).

// GeolocationPositionError codes
//   1 = PERMISSION_DENIED
//   2 = POSITION_UNAVAILABLE
//   3 = TIMEOUT
export function describeGeoError(err, isAr) {
  const code = err && typeof err.code === "number" ? err.code : 0;
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";

  // Are we inside a sandboxed iframe? (Emergent preview, dev tools, etc.)
  // window.top !== window.self is the cleanest signal — and a same-origin
  // crash here is itself a strong "iframe with restrictions" indicator.
  let inIframe = false;
  try { inIframe = window.top !== window.self; } catch { inIframe = true; }

  const isIOS    = /iPad|iPhone|iPod/i.test(ua);
  const isMacOS  = /Macintosh/i.test(ua) && !isIOS;
  const isAndroid = /Android/i.test(ua);

  // 1 = PERMISSION_DENIED
  if (code === 1) {
    if (inIframe) {
      return {
        title: isAr ? "تعذّر الوصول للموقع داخل المعاينة" : "Location blocked inside this preview",
        message: isAr
          ? "هذه نافذة معاينة مغلقة لا تسمح بـ GPS. سيعمل الموقع بشكل طبيعي حين يُنشر التّطبيق على Safari وعلى هواتف iOS و Android."
          : "This is a sandboxed preview that blocks GPS for security. Location will work normally on the live website (Safari) and inside the iOS / Android app.",
        steps: null,
      };
    }
    if (isIOS) {
      return {
        title: isAr ? "إذن الموقع مغلق" : "Location is turned off",
        message: isAr
          ? "اتّبع هذه الخطوات لتفعيل الـ GPS:"
          : "To turn it on, follow these steps:",
        steps: isAr
          ? [
              "افتح إعدادات الـ iPhone",
              "اضغط Safari ← الموقع",
              "اختر «اسأل» أو «السّماح»",
              "ارجع إلى التّطبيق وأعد المحاولة",
            ]
          : [
              "Open the iPhone Settings app",
              "Tap Safari → Location",
              "Choose 'Ask' or 'Allow'",
              "Return here and tap Try again",
            ],
      };
    }
    if (isMacOS) {
      return {
        title: isAr ? "إذن الموقع مغلق" : "Location is turned off",
        message: isAr
          ? "اتّبع هذه الخطوات على Mac:"
          : "On macOS Safari:",
        steps: isAr
          ? [
              "Safari ← الإعدادات ← مواقع الويب ← الموقع",
              "اختر sunnahumrah.app ← السّماح",
              "أعد تحميل الصّفحة",
            ]
          : [
              "Safari → Settings → Websites → Location",
              "Set this site to 'Allow'",
              "Reload the page",
            ],
      };
    }
    if (isAndroid) {
      return {
        title: isAr ? "إذن الموقع مغلق" : "Location is turned off",
        message: isAr
          ? "للتّفعيل على Android:"
          : "On Android Chrome:",
        steps: isAr
          ? [
              "اضغط القفل بجانب العنوان",
              "أذونات الموقع ← السّماح",
              "أعد المحاولة",
            ]
          : [
              "Tap the lock icon next to the URL",
              "Permissions → Location → Allow",
              "Tap Try again",
            ],
      };
    }
    return {
      title: isAr ? "إذن الموقع مغلق" : "Location is turned off",
      message: isAr
        ? "افتح إعدادات المتصفّح وفعّل خدمة الموقع لهذا الموقع، ثمّ أعد المحاولة."
        : "Open your browser settings, allow Location for this site, then try again.",
      steps: null,
    };
  }

  // 2 = POSITION_UNAVAILABLE — device GPS is on but couldn't get a fix
  if (code === 2) {
    return {
      title: isAr ? "تعذّر تحديد الموقع" : "Couldn't get a location fix",
      message: isAr
        ? "تأكّد من تفعيل خدمات الموقع وأنّك في مكان مفتوح، ثمّ أعد المحاولة."
        : "Make sure Location Services are on and you're in a place with sky view (GPS works best outdoors), then try again.",
      steps: null,
    };
  }

  // 3 = TIMEOUT — took too long
  if (code === 3) {
    return {
      title: isAr ? "استغرق التّحديد وقتًا طويلًا" : "Location took too long",
      message: isAr
        ? "الإشارة ضعيفة. اخرج للهواء الطّلق وأعد المحاولة."
        : "Signal looks weak. Step outside if you can, then try again.",
      steps: null,
    };
  }

  return {
    title: isAr ? "تعذّر الوصول للموقع" : "Couldn't access location",
    message: isAr
      ? "تحقّق من إعدادات الموقع في المتصفّح وأعد المحاولة."
      : "Check your browser's location settings and try again.",
    steps: null,
  };
}
