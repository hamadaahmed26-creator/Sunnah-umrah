import React from "react";
import { Download, X, Share } from "lucide-react";

/*
 Tiny "Install app" prompt.
 - On Android/Chrome/Edge: uses the native beforeinstallprompt event.
 - On iOS Safari: shows a one-line tip pointing to "Share → Add to Home Screen"
   since iOS gives no programmatic install API.
 The user can dismiss it; we remember the choice for 30 days.
*/

const KEY = "umrah_install_dismissed_until";

function isStandalone() {
  return (
    window.matchMedia &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true)
  );
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}

export default function InstallPrompt() {
  const [evt, setEvt] = React.useState(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const dismissedUntil = parseInt(localStorage.getItem(KEY) || "0", 10);
    if (dismissedUntil && Date.now() < dismissedUntil) return;
    if (isStandalone()) return;

    if (isIOS()) {
      // On iOS we just show a hint after a short delay
      const t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    }

    const onPrompt = (e) => {
      e.preventDefault();
      setEvt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    setShow(false);
    // Snooze for 30 days
    localStorage.setItem(KEY, String(Date.now() + 30 * 86400 * 1000));
  };

  const install = async () => {
    if (!evt) return;
    evt.prompt();
    try {
      await evt.userChoice;
    } catch (_) {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-3 right-3 bottom-[10.5rem] sm:bottom-32 z-[80] max-w-md mx-auto"
      data-testid="install-prompt"
    >
      <div className="rounded-2xl bg-[#1C1D1B] text-white p-3 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#B3884D] grid place-items-center flex-shrink-0">
          {isIOS() ? <Share className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium">Install Sunnah Umrah</div>
          <div className="text-[11px] text-white/70 truncate">
            {isIOS() ? "Tap the Share icon, then \"Add to Home Screen\"." : "Add to your home screen — works offline."}
          </div>
        </div>
        {!isIOS() && evt && (
          <button
            onClick={install}
            className="rounded-full bg-[#B3884D] hover:bg-[#a07939] text-white text-xs font-semibold px-3 py-1.5 tap-pulse"
            data-testid="install-prompt-install"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          className="w-8 h-8 grid place-items-center rounded-full bg-white/10 text-white/80 tap-pulse"
          aria-label="dismiss"
          data-testid="install-prompt-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
