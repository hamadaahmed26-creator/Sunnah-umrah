import React from "react";
import axios from "axios";
import { Send, Loader2, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function getSession() {
  let s = localStorage.getItem("umrah_chat_session");
  if (!s) {
    s = `s_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem("umrah_chat_session", s);
  }
  return s;
}

export default function Chat() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const sessionId = React.useMemo(getSession, []);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    axios
      .get(`${API}/chat/${sessionId}/messages`)
      .then((r) => setMessages(r.data || []))
      .catch(() => {});
  }, [sessionId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text, id: `tmp_${Date.now()}` }]);
    setSending(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: text,
        language: lang,
      });
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply, id: `r_${Date.now()}` }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: lang === "ar" ? "تعذّر الاتصال. حاول مجدّدًا." : "Connection failed. Try again.", id: `e_${Date.now()}` },
      ]);
    }
    setSending(false);
  };

  const isAr = lang === "ar";
  const suggestions = isAr
    ? ["كيف أُحرم بالعمرة من الميقات؟", "ما الذي يبطل الإحرام؟", "هل يصحّ الطواف بدون وضوء؟"]
    : ["How do I enter Ihram at the Miqat?", "What invalidates Ihram?", "Can I do Tawaf without wudu?"];

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-180px)] flex flex-col" data-testid="chat-page">
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{t("chatTitle")}</p>
        <h1 className="mt-2 text-[26px] font-medium tracking-tight text-[#1C1D1B] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B3884D]" />
          {isAr ? "اسأل المرافق" : "Ask the Companion"}
        </h1>
        <p className="mt-1 text-[13px] text-[#5C5D58]">{t("chatHint")}</p>
      </div>

      <div ref={scrollRef} className="mt-4 flex-1 overflow-y-auto no-scrollbar pr-1" data-testid="chat-list">
        {messages.length === 0 && (
          <div className="grid gap-2 mt-4" data-testid="chat-suggestions">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className={`tap-pulse text-left rounded-2xl bg-white border border-[#E8E5DD] px-4 py-3 text-sm text-[#1C1D1B] hover:border-[#B3884D] ${
                  isAr ? "font-arabic text-right" : ""
                }`}
                data-testid={`suggestion-${i}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3 pt-2 pb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                m.role === "user"
                  ? "ms-auto bg-[#1C1D1B] text-[#F8F6F0]"
                  : "me-auto bg-white border border-[#E8E5DD] text-[#1C1D1B]"
              } ${isAr ? "font-arabic text-right" : ""}`}
              data-testid={`msg-${m.role}`}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div className="me-auto bg-white border border-[#E8E5DD] rounded-2xl px-4 py-3 text-sm text-[#5C5D58] inline-flex items-center gap-2" data-testid="chat-typing">
              <Loader2 className="w-4 h-4 animate-spin" /> {isAr ? "يكتب…" : "Thinking…"}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 pt-2 pb-3 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/95 to-transparent">
        <div className="flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-2 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("typeQuestion")}
            className={`flex-1 bg-transparent outline-none px-3 text-sm text-[#1C1D1B] placeholder:text-[#8E8F8A] ${
              isAr ? "font-arabic text-right" : ""
            }`}
            data-testid="chat-input"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="tap-pulse w-10 h-10 rounded-full bg-[#B3884D] hover:bg-[#997441] text-white grid place-items-center disabled:opacity-50"
            data-testid="chat-send"
            aria-label="send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
