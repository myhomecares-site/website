"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";

type Opt = { v: string; label: string; icon: string; href?: string; svc?: string };

const WHO: Opt[] = [
  { v: "my parent", label: "My parent", icon: "heart-hand" },
  { v: "my spouse", label: "My spouse", icon: "users" },
  { v: "myself", label: "Myself", icon: "heart-hand" },
  { v: "someone else", label: "Someone else", icon: "users" },
];

const NEEDS: Opt[] = [
  { v: "personal", label: "Bathing, dressing & hygiene", icon: "heart-hand", href: "/personal-care", svc: "Personal Care" },
  { v: "companion", label: "Company & everyday support", icon: "users", href: "/companion-care", svc: "Companion Care" },
  { v: "nursing", label: "Skilled nursing / medical", icon: "stethoscope", href: "/skilled-nursing", svc: "Skilled Nursing" },
  { v: "memory", label: "Memory loss / dementia", icon: "brain", href: "/alzheimers-dementia-care-maryland", svc: "Dementia Care" },
  { v: "mobility", label: "Mobility & getting around", icon: "activity", href: "/personal-care", svc: "Personal Care" },
  { v: "home", label: "Meals & housekeeping", icon: "home", href: "/homemaking", svc: "Homemaking" },
  { v: "recovery", label: "Recovery after a hospital stay", icon: "stethoscope", href: "/post-surgery-home-care-maryland", svc: "Post-Surgery Care" },
];

const AMOUNT: Opt[] = [
  { v: "a few hours a week", label: "A few hours a week", icon: "clock" },
  { v: "daily help", label: "Daily help", icon: "clock" },
  { v: "around-the-clock or live-in", label: "Around-the-clock / live-in", icon: "clock", href: "/24-hour-live-in-care-maryland", svc: "24-Hour & Live-In Care" },
];

export function CareFinder() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const toggleNeed = (v: string) =>
    setNeeds((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  // Recommended service pages, de-duplicated.
  const recs = (() => {
    const out: { svc: string; href: string; icon: string }[] = [];
    const seen = new Set<string>();
    NEEDS.filter((n) => needs.includes(n.v)).forEach((n) => {
      if (n.href && n.svc && !seen.has(n.href)) { seen.add(n.href); out.push({ svc: n.svc, href: n.href, icon: n.icon }); }
    });
    const amt = AMOUNT.find((a) => a.v === amount);
    if (amt?.href && amt.svc && !seen.has(amt.href)) { seen.add(amt.href); out.push({ svc: amt.svc, href: amt.href, icon: "clock" }); }
    if (out.length === 0) out.push({ svc: "Home Care", href: "/home-care", icon: "heart-hand" });
    return out;
  })();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) || "");
    if (get("company")) { setStatus("ok"); return; } // honeypot
    const needLabels = NEEDS.filter((n) => needs.includes(n.v)).map((n) => n.label);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "care-finder",
          name: get("name"),
          phone: get("phone"),
          email: get("email"),
          relationship: who,
          timeframe: amount,
          care_needed: recs.map((r) => r.svc),
          message: `Care Finder: for ${who || "a loved one"}; needs ${needLabels.join(", ") || "help at home"}; ${amount || "amount TBD"}.`,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) setStatus("ok");
      else { setError(d.error || "Something went wrong. Please call us."); setStatus("error"); }
    } catch {
      setError("Could not submit right now. Please call us.");
      setStatus("error");
    }
  }

  const totalQ = 3;
  const progress = step >= totalQ ? 100 : Math.round((step / totalQ) * 100);

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-6 shadow-xl sm:p-8">
      {/* Progress */}
      {step < totalQ && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>Step {step + 1} of {totalQ}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Step 0: who */}
      {step === 0 && (
        <div className="animate-rise">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">Who needs a little help?</h3>
          <p className="mt-1.5 text-sm text-muted">A few quick questions and we&apos;ll point you to the right care.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {WHO.map((o) => (
              <button key={o.v} type="button" onClick={() => { setWho(o.v); setStep(1); }}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 ${who === o.v ? "border-primary bg-primary-50" : "border-border bg-white"}`}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name={o.icon} className="h-5 w-5" /></span>
                <span className="font-semibold text-ink">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: needs (multi) */}
      {step === 1 && (
        <div className="animate-rise">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">What&apos;s hardest right now?</h3>
          <p className="mt-1.5 text-sm text-muted">Choose all that apply.</p>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {NEEDS.map((o) => {
              const on = needs.includes(o.v);
              return (
                <button key={o.v} type="button" onClick={() => toggleNeed(o.v)}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${on ? "border-primary bg-primary-50" : "border-border bg-white hover:border-primary/30"}`}>
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${on ? "bg-primary text-white" : "bg-surface text-primary"}`}>
                    <Icon name={on ? "check" : o.icon} className="h-4 w-4" strokeWidth={on ? 2.5 : undefined} />
                  </span>
                  <span className="text-sm font-medium text-ink-soft">{o.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-muted hover:text-ink">← Back</button>
            <button type="button" onClick={() => setStep(2)} disabled={needs.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">
              Continue <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: amount */}
      {step === 2 && (
        <div className="animate-rise">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">How much support is needed?</h3>
          <p className="mt-1.5 text-sm text-muted">A rough sense is fine, we&apos;ll tailor the plan together.</p>
          <div className="mt-5 space-y-2.5">
            {AMOUNT.map((o) => (
              <button key={o.v} type="button" onClick={() => { setAmount(o.v); setStep(3); }}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition hover:border-primary/40 ${amount === o.v ? "border-primary bg-primary-50" : "border-border bg-white"}`}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name="clock" className="h-5 w-5" /></span>
                <span className="font-semibold text-ink">{o.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-muted hover:text-ink">← Back</button>
          </div>
        </div>
      )}

      {/* Step 3: result + lead capture */}
      {step === 3 && status !== "ok" && (
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-dark">
            <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} /> Here&apos;s where we can help
          </span>
          <h3 className="mt-3 text-xl font-bold text-ink sm:text-2xl">Based on what you shared</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {recs.map((r) => (
              <Link key={r.href} href={r.href} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-100">
                <Icon name={r.icon} className="h-4 w-4" /> {r.svc}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Share your details and our care team will reach out, usually the same day, with a free, no-obligation plan.
            Prefer to talk now? Call <a href={site.phoneHref} className="font-semibold text-primary">{site.phone}</a>.
          </p>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input name="name" required placeholder="Your name" className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <input name="phone" type="tel" required placeholder="Phone" className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <input name="email" type="email" placeholder="Email (optional)" className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 sm:col-span-2" />
            {error && <p className="text-sm font-medium text-primary-dark sm:col-span-2">{error}</p>}
            <div className="flex items-center justify-between sm:col-span-2">
              <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-muted hover:text-ink">← Back</button>
              <button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60">
                {status === "loading" ? "Sending…" : "Get my free plan"} <Icon name="arrow" className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success */}
      {status === "ok" && (
        <div className="animate-rise py-4 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
            <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <h3 className="mt-4 text-xl font-bold text-ink">Thank you, we&apos;ll be in touch soon.</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Our care team will reach out shortly to talk through a plan for {who || "your loved one"}. For anything urgent, call {site.phone}.
          </p>
        </div>
      )}
    </div>
  );
}
