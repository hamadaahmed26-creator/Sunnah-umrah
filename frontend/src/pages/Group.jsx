import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LangContext } from "../components/Layout";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api/families`;
const KEY = "umrah_family_v2";
const secret = /^[A-Za-z0-9_-]{43}$/;
const groupCode = /^[a-f0-9]{24}$/;

function savedMembership() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return groupCode.test(value?.code) && secret.test(value?.token) ? value : null;
  } catch {
    return null;
  }
}

export default function Group() {
  const { lang } = useContext(LangContext);
  const ar = lang === "ar";
  const t = (en, arabic) => ar ? arabic : en;
  const navigate = useNavigate();
  const { code: linkCode } = useParams();
  const [invite, setInvite] = useState(null);
  const [session, setSession] = useState(savedMembership);
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const statuses = {
    together: t("With the family", "مع العائلة"),
    meeting_point: t("At our meeting point", "عند نقطة اللقاء"),
    need_call: t("Please call me", "اتصلوا بي من فضلكم"),
  };

  useEffect(() => {
    if (!linkCode) return;
    const token = window.location.hash.slice(1);
    if (secret.test(token) && groupCode.test(linkCode)) setInvite({ code: linkCode, invite: token });
    else setNotice(ar ? "هذا الرابط غير صالح. اطلب دعوة جديدة." : "This link is unavailable. Ask your family for a new invitation.");
    navigate("/group", { replace: true });
  }, [linkCode, navigate, ar]);

  function save(next) {
    setSession(next);
    setUnavailable(false);
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next));
      else localStorage.removeItem(KEY);
    } catch {
      setNotice(t("This browser cannot remember your membership after you close it.", "لا يستطيع هذا المتصفح حفظ عضويتك بعد إغلاقه."));
    }
  }

  useEffect(() => {
    setMembers([]);
    if (!session) return;
    const controller = new AbortController();
    async function refresh() {
      try {
        const result = await axios.get(`${API}/${session.code}`, {
          headers: { Authorization: `Bearer ${session.token}` }, signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setMembers(result.data.members);
          setUnavailable(false);
          setNotice("");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setMembers([]);
        setUnavailable([401, 404].includes(error.response?.status));
        setNotice(ar ? "تعذّر تحديث المجموعة. تحقّق من الاتصال وصلاحية العضوية." : "Could not refresh the group. Check your connection and membership.");
      }
    }
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [session, revision, ar]);

  async function action(callback) {
    setNotice("");
    setBusy(true);
    try {
      await callback();
    } catch {
      setNotice(t("The change could not be confirmed. Check your connection and try again.", "تعذّر تأكيد التغيير. تحقّق من الاتصال وحاول مجددًا."));
    } finally {
      setBusy(false);
    }
  }
  const headers = session ? { Authorization: `Bearer ${session.token}` } : {};
  const invitationUrl = session?.invite ? `${window.location.origin}/group/join/${session.code}#${session.invite}` : "";
  const button = "min-h-12 rounded-xl border border-emerald-900 px-4 py-2 text-start disabled:opacity-50";
  return <main className="mx-auto max-w-md space-y-4 py-6" dir={ar ? "rtl" : "ltr"}>
    <Link to="/">{t("Home", "الرئيسية")}</Link>
    <h1 className="text-3xl font-semibold">{t("Family check-in", "تواصل العائلة")}</h1>
    <p>{t("Share a name and a short update with invited relatives. Your location stays private. Groups expire after 14 days.", "شارك اسمًا وتحديثًا قصيرًا مع أقاربك المدعوين. موقعك خاص. تنتهي المجموعة بعد ١٤ يومًا.")}</p>
    {notice && <p role="status">{notice}</p>}
    {!session ? <form className="grid gap-3" onSubmit={event => {
      event.preventDefault();
      action(async () => {
        const result = await axios.post(invite ? API + "/join" : API, { name: name.trim(), ...invite });
        save(result.data); setInvite(null);
      });
    }}>
      <label>{t("Name to show your family", "الاسم الذي يظهر لعائلتك")}
        <input className="block w-full rounded border p-3" required maxLength={45} value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button className={button} disabled={busy || !name.trim()}>{invite ? t("Join this family", "انضم لهذه العائلة") : t("Create family group", "أنشئ مجموعة عائلية")}</button>
      <p>{t("To join an existing family, open its private invitation link.", "للانضمام إلى مجموعة موجودة، افتح رابط الدعوة الخاص بها.")}</p>
    </form> : <section className="grid gap-3">
      {invite && <p>{t("Leave this group first to accept the new invitation.", "غادر هذه المجموعة أولًا لقبول الدعوة الجديدة.")}</p>}
      {members.length > 0 && <><h2>{t("Family updates", "تحديثات العائلة")}</h2><ul>{members.map((m, i) =>
        <li key={i}>{m.name}{m.self ? t(" (you)", " (أنت)") : ""} · {statuses[m.status] || t("Joined", "انضم")}</li>)}</ul></>}
      <h2>{t("Share an update", "شارك تحديثًا")}</h2>
      {Object.entries(statuses).map(([status, label]) => <button className={button} key={status} disabled={busy || unavailable} onClick={() => action(async () => {
        await axios.put(`${API}/${session.code}/checkin`, { status }, { headers }); setRevision(n => n + 1);
      })}>{label}</button>)}
      {invitationUrl && !unavailable && <>
        <label>{t("Private invitation · share only with your family", "دعوة خاصة · شاركها مع عائلتك فقط")}
          <input className="block w-full rounded border p-3" readOnly value={invitationUrl} onFocus={e => e.target.select()} />
        </label>
        <button className={button} disabled={busy} onClick={() => action(async () => {
          const result = await axios.post(`${API}/${session.code}/invite`, {}, { headers });
          save({ ...session, invite: result.data.invite });
        })}>{t("Replace invitation link", "استبدال رابط الدعوة")}</button>
      </>}
      <button className={button} disabled={busy} onClick={() => action(async () => {
        if (!unavailable) await axios.delete(`${API}/${session.code}/me`, { headers });
        save(null); setMembers([]);
      })}>{unavailable ? t("Clear expired membership", "إزالة العضوية المنتهية") : t("Leave and remove my check-in", "مغادرة المجموعة وحذف تحديثي")}</button>
    </section>}
  </main>;
}
