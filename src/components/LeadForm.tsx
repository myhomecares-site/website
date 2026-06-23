"use client";

import { useState } from "react";
import { Icon } from "./icons";

type Props = {
  compact?: boolean;
  source?: string;
  withTime?: boolean;
  title?: string;
};

export function LeadForm({ compact = false, source = "contact", withTime = false, title }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Something went wrong");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="text-lg font-bold text-ink">Thank you — we&apos;ll be in touch</h3>
        <p className="text-sm text-muted">
          A member of our care team will reach out shortly. For urgent needs, call us directly.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-2 text-sm font-semibold text-primary">
          Send another message
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {title && <h3 className="mb-1 text-lg font-bold text-ink">{title}</h3>}
      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <input name="name" required placeholder="Full name *" className={inputCls} autoComplete="name" />
        <input name="phone" required placeholder="Phone *" className={inputCls} autoComplete="tel" inputMode="tel" />
      </div>
      <input name="email" type="email" required placeholder="Email *" className={inputCls} autoComplete="email" />
      {withTime && (
        <select name="best_time" className={inputCls} defaultValue="">
          <option value="" disabled>
            Best time to call…
          </option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
      )}
      <textarea
        name="message"
        rows={compact ? 2 : 3}
        placeholder="How can we help you and your loved one?"
        className={inputCls}
      />
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request a Free Consultation"}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
      <p className="text-center text-xs text-muted-light">
        We respect your privacy. Your information is only used to contact you about care.
      </p>
    </form>
  );
}
