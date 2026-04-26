import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { Users, Copy, Check, Loader2, RefreshCw, Share2, QrCode } from "lucide-react";
import { LangContext } from "../components/Layout";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Group() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const { code: codeFromUrl } = useParams();

  const [code, setCode] = React.useState(() => localStorage.getItem("umrah_group_code") || "");
  const [name, setName] = React.useState(() => localStorage.getItem("umrah_user_name") || "");
  const [joinInput, setJoinInput] = React.useState("");
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [showQr, setShowQr] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState("");

  const inviteUrl = code ? `${window.location.origin}/group/join/${code}` : "";

  // Generate QR for the invite link whenever the user opens the QR panel.
  React.useEffect(() => {
    if (!showQr || !inviteUrl) return;
    QRCode.toDataURL(inviteUrl, { width: 320, margin: 1, color: { dark: "#1C1D1B", light: "#F8F6F0" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [showQr, inviteUrl]);

  const userId = React.useMemo(() => {
    let u = localStorage.getItem("umrah_user_id");
    if (!u) {
      u = `u_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("umrah_user_id", u);
    }
    return u;
  }, []);

  React.useEffect(() => {
    if (code) {
      localStorage.setItem("umrah_group_code", code);
    }
  }, [code]);

  React.useEffect(() => {
    if (name) localStorage.setItem("umrah_user_name", name);
  }, [name]);

  const refresh = React.useCallback(async (c) => {
    if (!c) return;
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(`${API}/group/${c}`);
      setMembers(res.data?.members || []);
    } catch (e) {
      setErr(e?.response?.status === 404 ? "Group code not found." : "Could not load group.");
    }
    setLoading(false);
  }, []);

  const checkin = React.useCallback(
    async (c) => {
      if (!c || !name) return;
      const tawaf_count = parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10);
      const sai_count = parseInt(localStorage.getItem("umrah_sai_count") || "0", 10);
      let lat = null, lng = null;
      try {
        await new Promise((res, rej) => {
          if (!navigator.geolocation) return rej();
          navigator.geolocation.getCurrentPosition(
            (p) => { lat = p.coords.latitude; lng = p.coords.longitude; res(); },
            () => rej(),
            { timeout: 4000 }
          );
        });
      } catch (_) {}
      try {
        await axios.put(`${API}/group/${c}/checkin`, {
          user_id: userId, name, tawaf_count, sai_count, lat, lng,
        });
        refresh(c);
      } catch (_) {}
    },
    [name, userId, refresh]
  );

  React.useEffect(() => {
    if (code && name) {
      checkin(code);
      const id = setInterval(() => refresh(code), 10000);
      return () => clearInterval(id);
    }
  }, [code, name, checkin, refresh]);

  // Deep-link auto-join: if /group/join/:code is opened, prefill and try to join.
  React.useEffect(() => {
    if (!codeFromUrl) return;
    const c = codeFromUrl.toUpperCase();
    setJoinInput(c);
    // Strip the join URL once consumed so refreshes don't keep retrying.
    navigate("/group", { replace: true });
    if (!name.trim()) {
      setErr(isAr ? "أدخل اسمك أولًا، ثم اضغط انضم." : "Enter your name first, then tap Join.");
      return;
    }
    (async () => {
      setLoading(true); setErr("");
      try {
        const res = await axios.post(`${API}/group/join`, { code: c });
        if (res.data?.ok) {
          setCode(c);
          await checkin(c);
        }
      } catch (e) {
        setErr(e?.response?.status === 404 ? "Group code not found." : "Could not join group.");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromUrl]);

  const createGroup = async () => {
    if (!name.trim()) { setErr("Please enter your name first."); return; }
    setLoading(true); setErr("");
    try {
      const res = await axios.post(`${API}/group/create`);
      setCode(res.data.code);
      await checkin(res.data.code);
    } catch (e) {
      setErr("Could not create group.");
    }
    setLoading(false);
  };

  const joinGroup = async () => {
    if (!name.trim()) { setErr("Please enter your name first."); return; }
    const c = joinInput.trim().toUpperCase();
    if (c.length !== 6) { setErr("Enter the 6-character code."); return; }
    setLoading(true); setErr("");
    try {
      const res = await axios.post(`${API}/group/join`, { code: c });
      if (res.data.ok) {
        setCode(c);
        await checkin(c);
      }
    } catch (e) {
      setErr(e?.response?.status === 404 ? "Group code not found." : "Could not join group.");
    }
    setLoading(false);
  };

  const leave = () => {
    setCode("");
    setMembers([]);
    localStorage.removeItem("umrah_group_code");
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const shareInvite = async () => {
    const shareText = isAr
      ? `انضم إلى مجموعتي في تطبيق "العمرة على السنة" — الرمز: ${code}\n${inviteUrl}`
      : `Join my Sunnah Umrah group — code: ${code}\n${inviteUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sunnah Umrah", text: shareText, url: inviteUrl });
        return;
      } catch (_) { /* user cancelled */ }
    }
    // Fallback: copy invite text to clipboard
    try { await navigator.clipboard.writeText(shareText); } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="group-page">
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "المجموعة" : "Family / Group"}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
          {isAr ? "ابقَ مع رفقائك" : "Stay together"}
        </h1>
        <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
          {isAr
            ? "أنشئ رمزًا أو انضم إلى مجموعة لترى تقدّم رفاقك في كلّ وقت."
            : "Create or join a 6-character code to see each other's ritual progress in real time."}
        </p>
      </div>

      <div className="mt-5 rounded-2xl bg-white border border-[#E8E5DD] p-4">
        <label className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "اسمك" : "Your name"}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isAr ? "مثال: أحمد" : "e.g. Ahmed"}
          className="mt-2 w-full px-3 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#E8E5DD] text-sm outline-none focus:border-[#B3884D]"
          data-testid="group-name-input"
        />
      </div>

      {!code ? (
        <div className="mt-4 grid gap-3">
          <button
            onClick={createGroup}
            disabled={loading}
            className="tap-pulse rounded-full bg-[#B3884D] hover:bg-[#997441] text-white text-sm font-medium px-5 py-3 inline-flex items-center justify-center gap-2"
            data-testid="group-create-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            {isAr ? "أنشئ مجموعة جديدة" : "Create new group"}
          </button>
          <div className="rounded-2xl bg-white border border-[#E8E5DD] p-4">
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "أدخل الرمز" : "Enter code"}</label>
            <div className="mt-2 flex gap-2">
              <input
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="ABC123"
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#E8E5DD] text-sm tracking-[0.3em] outline-none focus:border-[#B3884D] uppercase tabular-nums"
                data-testid="group-join-input"
              />
              <button
                onClick={joinGroup}
                disabled={loading}
                className="tap-pulse rounded-xl bg-[#1C1D1B] text-white text-sm px-4"
                data-testid="group-join-btn"
              >
                {isAr ? "انضم" : "Join"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-[#E8E5DD] bg-white p-5" data-testid="group-active">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">{isAr ? "رمز المجموعة" : "Group code"}</div>
              <div className="mt-1 text-[32px] font-light tracking-[0.3em] tabular-nums" data-testid="group-code">{code}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={copyCode} className="tap-pulse w-10 h-10 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] grid place-items-center" data-testid="group-copy" aria-label="copy code">
                {copied ? <Check className="w-4 h-4 text-[#2A5A4A]" /> : <Copy className="w-4 h-4 text-[#1C1D1B]" />}
              </button>
              <button onClick={() => refresh(code)} className="tap-pulse w-10 h-10 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] grid place-items-center" data-testid="group-refresh" aria-label="refresh">
                <RefreshCw className={`w-4 h-4 text-[#1C1D1B] ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Add-people actions */}
          <div className="mt-4 grid grid-cols-2 gap-2" data-testid="group-actions">
            <button
              onClick={shareInvite}
              className="tap-pulse rounded-full bg-[#1C1D1B] text-white text-[13px] font-medium px-4 py-2.5 inline-flex items-center justify-center gap-2"
              data-testid="group-share"
            >
              <Share2 className="w-4 h-4" />
              <span className={isAr ? "font-arabic" : ""}>
                {isAr ? "شارك مع العائلة" : "Share with family"}
              </span>
            </button>
            <button
              onClick={() => setShowQr((v) => !v)}
              className="tap-pulse rounded-full bg-white border border-[#E8E5DD] text-[#1C1D1B] text-[13px] font-medium px-4 py-2.5 inline-flex items-center justify-center gap-2"
              data-testid="group-qr-toggle"
            >
              <QrCode className="w-4 h-4" />
              <span className={isAr ? "font-arabic" : ""}>
                {isAr ? (showQr ? "أخفِ الرمز" : "اعرض الرمز") : (showQr ? "Hide QR" : "Show QR")}
              </span>
            </button>
          </div>

          {showQr && (
            <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4 flex flex-col items-center" data-testid="group-qr-panel">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Join QR code" className="w-56 h-56 rounded-xl" data-testid="group-qr-image" />
              ) : (
                <div className="w-56 h-56 grid place-items-center text-[12px] text-[#8E8F8A]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
              <p className={`mt-3 text-center text-[12px] text-[#5C5D58] leading-relaxed max-w-[28ch] ${isAr ? "font-arabic" : ""}`}>
                {isAr
                  ? "اطلب من رفيقك مسح هذا الرمز بكاميرته للانضمام فورًا."
                  : "Have your family scan this with their phone camera — they'll join instantly."}
              </p>
            </div>
          )}

          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
              {members.length} {isAr ? "أعضاء" : "members"}
            </div>
            <ul className="space-y-2" data-testid="group-members">
              {members.map((m) => (
                <li key={m.user_id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD]">
                  <div>
                    <div className="text-[14px] font-medium text-[#1C1D1B]" data-testid={`member-name-${m.user_id}`}>{m.name || "Unnamed"}</div>
                    <div className="text-[11px] text-[#5C5D58]">
                      Tawaf {m.tawaf_count ?? 0}/7 · Sa'i {m.sai_count ?? 0}/7
                      {m.lat && m.lng ? " · 📍 shared" : ""}
                    </div>
                  </div>
                  <div className="text-[10px] text-[#8E8F8A]">{m.last_ago || ""}</div>
                </li>
              ))}
              {members.length === 0 && !loading && (
                <li className="text-sm text-[#8E8F8A]">{isAr ? "لا يوجد أعضاء بعد." : "No members yet — share the code!"}</li>
              )}
            </ul>
          </div>

          <button
            onClick={leave}
            className="mt-5 w-full tap-pulse rounded-full border border-[#E8E5DD] bg-white px-5 py-2.5 text-sm text-[#8B4540]"
            data-testid="group-leave"
          >
            {isAr ? "مغادرة المجموعة" : "Leave group"}
          </button>
        </div>
      )}

      {err && <div className="mt-3 text-sm text-[#8B4540]" data-testid="group-error">{err}</div>}
    </div>
  );
}
