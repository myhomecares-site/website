"use client";

import { useState } from "react";
import { jobs } from "@/lib/jobs";
import { Icon } from "./icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHIFTS = ["Morning", "Afternoon", "Evening", "Overnight"];
const TYPES = ["Full-time", "Part-time", "Per diem"];

export function ApplicationForm({
  defaultPosition = "",
  onDone,
}: {
  defaultPosition?: string;
  onDone?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      position: fd.get("position"),
      employment_type: fd.get("employment_type"),
      availability_days: fd.getAll("days"),
      availability_shifts: fd.getAll("shifts"),
      start_date: fd.get("start_date"),
      experience: fd.get("experience"),
      message: fd.get("message"),
      source: fd.get("source") || "careers",
      company: fd.get("company"), // honeypot
    };
    try {
      const res = await fetch("/api/apply/", {
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
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-dark">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="text-lg font-bold text-ink">Application received — thank you!</h3>
        <p className="max-w-sm text-sm text-muted">
          Our team will review your application and reach out soon. We appreciate your interest in joining My Home Cares.
        </p>
        {onDone && (
          <button onClick={onDone} className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
            Close
          </button>
        )}
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";
  const label = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="source" value={defaultPosition ? `careers:${defaultPosition}` : "careers"} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input name="name" required className={input} autoComplete="name" />
        </div>
        <div>
          <label className={label}>Phone *</label>
          <input name="phone" required className={input} autoComplete="tel" inputMode="tel" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Email *</label>
          <input name="email" type="email" required className={input} autoComplete="email" />
        </div>
        <div>
          <label className={label}>Position</label>
          <select name="position" className={input} defaultValue={defaultPosition || ""}>
            <option value="">Select a position…</option>
            {jobs.map((j) => (
              <option key={j.slug} value={j.title}>
                {j.title}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Employment type</label>
          <select name="employment_type" className={input} defaultValue="">
            <option value="">Select…</option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Earliest start date</label>
          <input name="start_date" type="date" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Availability — days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <label key={d} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary">
              <input type="checkbox" name="days" value={d} className="accent-primary" />
              {d.slice(0, 3)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={label}>Availability — shifts</label>
        <div className="flex flex-wrap gap-2">
          {SHIFTS.map((s) => (
            <label key={s} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary">
              <input type="checkbox" name="shifts" value={s} className="accent-primary" />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={label}>Relevant experience</label>
        <input name="experience" className={input} placeholder="e.g., 3 years as a CNA in home care" />
      </div>

      <div>
        <label className={label}>Message / cover note</label>
        <textarea name="message" rows={3} className={input} placeholder="Tell us what drives your passion for caregiving…" />
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Submit Application"}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
      <p className="text-center text-xs text-muted-light">
        Your information is used only for hiring purposes and is never shared.
      </p>
    </form>
  );
}
