"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./icons";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the My Home Cares assistant. I can help with our services, service areas, payment options, or getting started. How can I help you today?";

const SUGGESTIONS = [
  "What services do you offer?",
  "Do you accept Medicaid?",
  "How soon can care start?",
  "I'd like a free consultation",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m.content !== GREETING) }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        data?.reply ||
        `Sorry, I couldn't respond just now. Please call us at ${site.phone}.`;
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Sorry, I couldn't respond just now. Please call us at ${site.phone}.` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
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
        <div className="fixed bottom-24 right-4 z-50 flex h-[32rem] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Icon name="heart-hand" className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">My Home Cares Assistant</p>
              <p className="text-xs text-white/80">Typically replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto rounded-full p-1.5 transition hover:bg-white/15">
              <Icon name="x" className="h-5 w-5" />
            </button>
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
                  {m.content}
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

            {/* Suggestions (only before the first user message) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
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
            <Icon name="phone" className="h-3.5 w-3.5" /> Prefer to talk? Call {site.phone}
          </a>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-white p-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark disabled:opacity-50"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>
          <p className="bg-white pb-2 text-center text-[10px] text-muted-light">
            AI assistant, may not be perfect. For urgent needs, call {site.phone}.
          </p>
        </div>
      )}
    </>
  );
}
