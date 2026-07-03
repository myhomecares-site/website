"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import { Icon } from "./icons";

type Msg = { role: "user" | "assistant"; content: string };
type Lang = "en" | "es";

const STR: Record<Lang, {
  greeting: string; starters: string[]; placeholder: string; subtitle: string;
  call: string; disclaimer: string; aria: string; typing: string;
}> = {
  en: {
    greeting: "Hi! I'm the My Home Cares Assistant. I can help with our services, service areas, payment options, care forms, or getting started. How can I help you today?",
    starters: ["What services do you offer?", "Do you accept Medicaid?", "How soon can care start?", "I'd like a free consultation"],
    placeholder: "Type your message...",
    subtitle: "Typically replies instantly",
    call: `Prefer to talk? Call ${site.phone}`,
    disclaimer: `AI assistant, may not be perfect. For urgent needs, call ${site.phone}.`,
    aria: "Chat with us",
    typing: "typing",
  },
  es: {
    greeting: "¡Hola! Soy el Asistente de My Home Cares. Puedo ayudarle con nuestros servicios, áreas de servicio, opciones de pago, formularios de cuidado o cómo empezar. ¿En qué puedo ayudarle hoy?",
    starters: ["¿Qué servicios ofrecen?", "¿Aceptan Medicaid?", "¿Qué tan pronto puede empezar?", "Quiero una consulta gratis"],
    placeholder: "Escriba su mensaje...",
    subtitle: "Normalmente responde al instante",
    call: `¿Prefiere hablar? Llame al ${site.phone}`,
    disclaimer: `Asistente de IA, puede no ser perfecto. Para urgencias, llame al ${site.phone}.`,
    aria: "Chatee con nosotros",
    typing: "escribiendo",
  },
};

const GREETINGS = [STR.en.greeting, STR.es.greeting];

// Render markdown links [text](/path) and bare URLs as clickable anchors.
function renderRich(text: string, isUser: boolean): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
  const linkCls = isUser ? "font-semibold text-white underline underline-offset-2" : "font-semibold text-primary underline underline-offset-2";
  let last = 0, k = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      const external = !href.startsWith("/");
      nodes.push(
        <a key={k++} href={href} className={linkCls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{m[1]}</a>
      );
    } else if (m[3]) {
      nodes.push(<a key={k++} href={m[3]} target="_blank" rel="noopener noreferrer" className={linkCls}>{m[3]}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: STR.en.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(STR.en.starters);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, typing, open, suggestions]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Switch language before the conversation starts.
  function switchLang(next: Lang) {
    setLang(next);
    setMessages((m) => (m.length === 1 ? [{ role: "assistant", content: STR[next].greeting }] : m));
    setSuggestions((s) => (messages.length === 1 ? STR[next].starters : s));
  }

  function typeOut(full: string): Promise<void> {
    return new Promise((resolve) => {
      setTyping(true);
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let i = 0;
      const tick = () => {
        i = Math.min(full.length, i + 4);
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: full.slice(0, i) };
          return copy;
        });
        if (i < full.length) setTimeout(tick, 12);
        else { setTyping(false); resolve(); }
      };
      setTimeout(tick, 12);
    });
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading || typing) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => !GREETINGS.includes(m.content)),
          path: typeof window !== "undefined" ? window.location.pathname : "/",
          lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply: string = data?.reply || `Sorry, I couldn't respond just now. Please call us at ${site.phone}.`;
      setLoading(false);
      await typeOut(reply);
      const s: string[] = Array.isArray(data?.suggestions) ? data.suggestions.filter((x: unknown) => typeof x === "string") : [];
      setSuggestions(s);
    } catch {
      setLoading(false);
      setMessages((m) => [...m, { role: "assistant", content: `Sorry, I couldn't respond just now. Please call us at ${site.phone}.` }]);
    }
  }

  const t = STR[lang];

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : t.aria}
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_rgba(0,199,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:bg-accent-dark"
      >
        <Icon name={open ? "x" : "chat"} className="h-6 w-6" />
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[32rem] max-h-[calc(100vh_-_7rem)] w-[calc(100vw_-_2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Icon name="heart-hand" className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">My Home Cares Assistant</p>
              <p className="text-xs text-white/80">{t.subtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {/* Language toggle */}
              <div className="flex overflow-hidden rounded-full bg-white/15 text-[11px] font-semibold">
                {(["en", "es"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLang(l)}
                    className={`px-2 py-1 transition ${lang === l ? "bg-white text-primary" : "text-white/85 hover:bg-white/10"}`}
                    aria-label={l === "en" ? "English" : "Español"}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 transition hover:bg-white/15">
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-3.5 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-white"
                      : "rounded-bl-sm border border-border bg-white text-ink-soft"
                  }`}
                >
                  {renderRich(m.content, m.role === "user")}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-white px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-light [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-light [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-light" />
                </div>
              </div>
            )}

            {/* Suggestion chips (dynamic) */}
            {suggestions.length > 0 && !loading && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick call CTA */}
          <a
            href={site.phoneHref}
            className="flex items-center justify-center gap-2 border-t border-border bg-white py-2 text-xs font-semibold text-primary transition hover:bg-primary-50"
          >
            <Icon name="phone" className="h-3.5 w-3.5" /> {t.call}
          </a>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border bg-white p-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="submit"
              disabled={loading || typing || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark disabled:opacity-50"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>
          <p className="bg-white pb-2 text-center text-[10px] text-muted-light">{t.disclaimer}</p>
        </div>
      )}
    </>
  );
}
