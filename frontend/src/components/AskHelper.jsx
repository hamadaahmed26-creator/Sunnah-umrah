import React from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Loader2, Send, Sparkles } from "lucide-react";
import { LangContext } from "./Layout";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function getSession() {
  let s = localStorage.getItem("umrah_chat_session");
  if (!s) {
    s = `s_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem("umrah_chat_session", s);
  }
  return s;
}

/*
 Floating "Ask the Companion" button. Tapping it opens a small chat
 sheet pre-loaded with the CURRENT step's title — so the user can
 ask "what if my wudu breaks during Tawaf?" right from inside the
 tour, without losing their place.
*/
export default function AskHelper({ stepLabel }) {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const sessionId = React.useMemo(getSession, []);

  const ask = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setAnswer("");
    try {
      const contextPrefix = stepLabel
        ? (isAr
            ? `أنا الآن في خطوة "${stepLabel}". `
            : `I'm currently at the step: "${stepLabel}". `)
        : "";
      const res = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: contextPrefix + text,
        language: lang,
      });
      setAnswer(res.data.reply || "");
    } catch (e) {
      setAnswer(isAr ? "تعذّر الاتصال. حاول مجدّدًا." : "Connection failed. Try again.");
    }
    setSending(false);
  };

  const reset = () => {
    setInput("");
    setAnswer("");
  };

  return (
    <>
      {/* Floating button — sits above the bottom nav */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[14rem] sm:bottom-44 right-4 z-[60] rounded-full bg-[#B3884D] hover:bg-[#a07939] text-white shadow-lg w-14 h-14 grid place-items-center tap-pulse"
        aria-label={isAr ? "اسأل" : "ask"}
        data-testid="ask-helper-fab"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70]"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-[71] bg-[#F8F6F0] rounded-t-3xl border-t border-[#E8E5DD] max-h-[88vh] overflow-y-auto"
              data-testid="ask-helper-sheet"
            >
              <div className="max-w-md mx-auto p-5 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B3884D]" />
                    <h2 className="text-[18px] font-medium text-[#1C1D1B]">
                      {isAr ? "اسأل المرافق" : "Ask the Companion"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8E5DD] grid place-items-center tap-pulse"
                    aria-label="close"
                    data-testid="ask-helper-close"
                  >
                    <X className="w-4 h-4 text-[#1C1D1B]" />
                  </button>
                </div>

                {stepLabel && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E8E5DD] px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#5C5D58]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3884D]" />
                    {stepLabel}
                  </div>
                )}

                {!answer && (
                  <div className="mt-4 grid gap-2">
                    {(isAr
                      ? [
                          "ماذا أفعل إذا انتقض وضوئي أثناء الطواف؟",
                          "هل تكفيني صلاة الركعتين خلف المقام؟",
                          "كيف أعرف أنني أكملت سبعة أشواط؟",
                        ]
                      : [
                          "What do I do if my wudu breaks during Tawaf?",
                          "Can I pray the 2 raka'ah anywhere if Maqam Ibrahim is crowded?",
                          "How do I know I've completed 7 laps correctly?",
                        ]
                    ).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(q)}
                        className={`tap-pulse text-left rounded-2xl bg-white border border-[#E8E5DD] px-4 py-3 text-sm text-[#1C1D1B] hover:border-[#B3884D] ${
                          isAr ? "font-arabic text-right" : ""
                        }`}
                        data-testid={`ask-suggestion-${i}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {answer && (
                  <div
                    className={`mt-4 rounded-2xl bg-white border border-[#E8E5DD] p-4 text-[14px] leading-relaxed text-[#1C1D1B] ${
                      isAr ? "font-arabic text-right" : ""
                    }`}
                    data-testid="ask-answer"
                  >
                    {answer}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-2 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ask()}
                    placeholder={isAr ? "اكتب سؤالك…" : "Type your question…"}
                    className={`flex-1 bg-transparent outline-none px-3 text-sm text-[#1C1D1B] placeholder:text-[#8E8F8A] ${
                      isAr ? "font-arabic text-right" : ""
                    }`}
                    autoFocus
                    data-testid="ask-helper-input"
                  />
                  <button
                    onClick={ask}
                    disabled={sending || !input.trim()}
                    className="tap-pulse w-10 h-10 rounded-full bg-[#B3884D] hover:bg-[#997441] text-white grid place-items-center disabled:opacity-50"
                    aria-label="send"
                    data-testid="ask-helper-send"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
