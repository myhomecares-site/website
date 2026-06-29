"use client";

import { useState, type ReactNode } from "react";
import { jobs } from "@/lib/jobs";
import { Icon } from "./icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHIFTS = ["Morning", "Afternoon", "Evening", "Overnight"];
const TYPES = ["Full-time", "Part-time", "Per diem"];
const CERTS = ["CNA", "GNA", "CMT", "CPR", "First Aid", "RN", "LPN", "None yet"];
const HEARD = ["Indeed", "Facebook", "Referral from staff", "Google", "Community event", "Other"];

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";
const chip =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 border-b border-border pb-2 text-sm font-bold text-ink">
      <span className="inline-block h-4 w-1 rounded-full bg-accent" />
      {children}
    </h3>
  );
}

function YesNo({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}{required && " *"}</label>
      <div className="flex gap-2">
        {["Yes", "No"].map((v) => (
          <label key={v} className={chip}>
            <input type="radio" name={name} value={v} required={required} className="accent-primary" />
            {v}
          </label>
        ))}
      </div>
    </div>
  );
}

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

    let totalBytes = 0;
    for (const value of fd.values()) if (value instanceof File) totalBytes += value.size;
    if (totalBytes > 4 * 1024 * 1024) {
      setStatus("error");
      setError("Your attachments are over 4 MB total. Please reduce the file size, or email large files to info@myhomecares.com.");
      return;
    }

    try {
      const res = await fetch("/api/apply/", { method: "POST", body: fd });
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
        <h3 className="text-lg font-bold text-ink">Application received, thank you!</h3>
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

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <input type="hidden" name="source" value={defaultPosition ? `careers:${defaultPosition}` : "careers"} />

      {/* Your information */}
      <div className="space-y-4">
        <SectionTitle>Your information</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full name *</label>
            <input name="name" required className={input} autoComplete="name" />
          </div>
          <div>
            <label className={labelCls}>Phone *</label>
            <input name="phone" required className={input} autoComplete="tel" inputMode="tel" />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input name="email" type="email" required className={input} autoComplete="email" />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input name="city" className={input} autoComplete="address-level2" />
            </div>
            <div>
              <label className={labelCls}>ZIP</label>
              <input name="zip" className={`${input} w-24`} inputMode="numeric" autoComplete="postal-code" />
            </div>
          </div>
        </div>
      </div>

      {/* Position & availability */}
      <div className="space-y-4">
        <SectionTitle>Position &amp; availability</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Position</label>
            <select name="position" className={input} defaultValue={defaultPosition || ""}>
              <option value="">Select a position…</option>
              {jobs.map((j) => (
                <option key={j.slug} value={j.title}>{j.title}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Employment type</label>
            <select name="employment_type" className={input} defaultValue="">
              <option value="">Select…</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Earliest start date</label>
            <input name="start_date" type="date" className={input} />
          </div>
          <YesNo name="transportation" label="Reliable transportation?" />
        </div>
        <div>
          <label className={labelCls}>Availability, days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <label key={d} className={chip}>
                <input type="checkbox" name="days" value={d} className="accent-primary" />
                {d.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Availability, shifts</label>
          <div className="flex flex-wrap gap-2">
            {SHIFTS.map((s) => (
              <label key={s} className={chip}>
                <input type="checkbox" name="shifts" value={s} className="accent-primary" />
                {s}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications & experience */}
      <div className="space-y-4">
        <SectionTitle>Certifications &amp; experience</SectionTitle>
        <div>
          <label className={labelCls}>Certifications held</label>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((c) => (
              <label key={c} className={chip}>
                <input type="checkbox" name="certs_held" value={c} className="accent-primary" />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>License / certification number</label>
            <input name="license_number" className={input} placeholder="If applicable" />
          </div>
          <div>
            <label className={labelCls}>Years of caregiving experience</label>
            <input name="experience" className={input} placeholder="e.g., 3 years" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Languages spoken</label>
          <input name="languages" className={input} placeholder="e.g., English, Spanish" />
        </div>
      </div>

      {/* Maryland RSA eligibility */}
      <div className="space-y-4">
        <SectionTitle>Maryland RSA eligibility</SectionTitle>
        <p className="-mt-1 text-xs text-muted">
          Required for Maryland Residential Service Agency caregivers. Your answers help us confirm
          eligibility before hire.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <YesNo name="over_18" label="Are you 18 or older?" required />
          <YesNo name="work_authorized" label="Authorized to work in the U.S.?" required />
          <YesNo name="background_check" label="Willing to complete a criminal background check?" required />
          <YesNo name="tb_screening" label="Willing to provide a current TB screening / health clearance?" />
        </div>
      </div>

      {/* Reference */}
      <div className="space-y-4">
        <SectionTitle>Professional reference</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Name</label>
            <input name="reference_name" className={input} />
          </div>
          <div>
            <label className={labelCls}>Relationship</label>
            <input name="reference_relationship" className={input} placeholder="e.g., Former supervisor" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input name="reference_phone" className={input} inputMode="tel" />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <SectionTitle>Documents</SectionTitle>
        <div className="rounded-xl border border-dashed border-border bg-surface p-4">
          <p className="text-xs text-muted">Resume and any certifications (PDF, Word, or image, up to 4 MB total).</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Resume</label>
              <input type="file" name="resume" accept=".pdf,.doc,.docx" className="block w-full cursor-pointer text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary-100" />
            </div>
            <div>
              <label className={labelCls}>Certification files</label>
              <input type="file" name="certifications" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple className="block w-full cursor-pointer text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional */}
      <div className="space-y-4">
        <SectionTitle>A little more</SectionTitle>
        <div>
          <label className={labelCls}>How did you hear about us?</label>
          <select name="heard_about" className={input} defaultValue="">
            <option value="">Select…</option>
            {HEARD.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Message / cover note</label>
          <textarea name="message" rows={3} className={input} placeholder="Tell us what drives your passion for caregiving…" />
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Submit Application"}
          {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
        </button>
        <p className="mt-3 text-center text-xs text-muted-light">
          Your information is used only for hiring purposes and is never shared.
        </p>
      </div>
    </form>
  );
}
