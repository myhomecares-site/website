"use client";

import { useState } from "react";
import { Icon } from "./icons";

type Props = {
  compact?: boolean;
  source?: string;
  withTime?: boolean;
  title?: string;
};

const CARE = [
  "Skilled Nursing",
  "Personal Care",
  "Companion Care",
  "Respite Care",
  "Homemaking",
  "Meal Planning",
  "Not sure yet",
];

export function LeadForm({ compact = false, source = "contact", withTime = false, title }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k) as string) || "";

    const payload = {
      source,
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      message: get("message"),
      best_time: get("best_time"),
      company: get("company"), // honeypot
      // RSA client-intake details (full form only)
      relationship: get("relationship"),
      city: get("city"),
      care_needed: fd.getAll("care_needed").map(String),
      timeframe: get("timeframe"),
      schedule: get("schedule"),
      payment: get("payment"),
    };

    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-dark">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="text-lg font-bold text-ink">Thank you, we&apos;ll be in touch</h3>
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
  const chip =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {title && <h3 className="mb-1 text-lg font-bold text-ink">{title}</h3>}

      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <input name="name" required placeholder="Full name *" className={inputCls} autoComplete="name" />
        <input name="phone" required placeholder="Phone *" className={inputCls} autoComplete="tel" inputMode="tel" />
      </div>
      <input name="email" type="email" required placeholder="Email *" className={inputCls} autoComplete="email" />

      {!compact && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="relationship" className={inputCls} defaultValue="">
              <option value="" disabled>Who needs care?</option>
              <option>Myself</option>
              <option>My parent</option>
              <option>My spouse</option>
              <option>Another family member</option>
              <option>Other</option>
            </select>
            <input name="city" placeholder="City (Maryland)" className={inputCls} autoComplete="address-level2" />
          </div>

          <div>
            <label className={labelCls}>Type of care needed</label>
            <div className="flex flex-wrap gap-2">
              {CARE.map((c) => (
                <label key={c} className={chip}>
                  <input type="checkbox" name="care_needed" value={c} className="accent-primary" />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <select name="timeframe" className={inputCls} defaultValue="">
              <option value="" disabled>How soon is care needed?</option>
              <option>As soon as possible</option>
              <option>Within 2 weeks</option>
              <option>Within a month</option>
              <option>Just planning ahead</option>
            </select>
            <select name="schedule" className={inputCls} defaultValue="">
              <option value="" disabled>Care schedule</option>
              <option>A few hours per week</option>
              <option>Part-time</option>
              <option>Full-time</option>
              <option>24/7 or live-in</option>
              <option>Not sure</option>
            </select>
          </div>

          <select name="payment" className={inputCls} defaultValue="">
            <option value="" disabled>How will care be paid for?</option>
            <option>Private pay</option>
            <option>Long-term care insurance</option>
            <option>Medicaid waiver</option>
            <option>Not sure</option>
          </select>
        </>
      )}

      {withTime && (
        <select name="best_time" className={inputCls} defaultValue="">
          <option value="" disabled>Best time to call…</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
      )}

      <textarea
        name="message"
        rows={compact ? 2 : 3}
        placeholder="Anything else we should know about your loved one's needs?"
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
