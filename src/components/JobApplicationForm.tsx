"use client";

import { useState } from "react";
import { Icon } from "./icons";

const positions = [
  "Registered Nurse (RN)",
  "Licensed Practical Nurse (LPN)",
  "Certified Nursing Assistant (CNA)",
  "Certified Medical Technician (CMT)",
  "Caregiver / Companion",
  "Speech Pathologist",
  "Physical / Occupational Therapist",
  "Other",
];

export function JobApplicationForm() {
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
        body: JSON.stringify({ ...data, source: "job-application", type: "application" }),
      });
      if (!res.ok) throw new Error("Something went wrong");
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
        <h3 className="text-lg font-bold">Application received</h3>
        <p className="text-sm text-muted">Thank you for your interest. Our team will review your application and be in touch.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Full name *" className={inputCls} autoComplete="name" />
        <input name="phone" required placeholder="Phone *" className={inputCls} autoComplete="tel" />
      </div>
      <input name="email" type="email" required placeholder="Email *" className={inputCls} autoComplete="email" />
      <select name="position" className={inputCls} defaultValue="">
        <option value="" disabled>Position of interest…</option>
        {positions.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <textarea name="message" rows={4} placeholder="Tell us about your experience and availability" className={inputCls} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Submit Application"}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
    </form>
  );
}
