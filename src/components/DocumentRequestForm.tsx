"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";

const DOCUMENTS = [
  "Participant Assessment",
  "Caregiver Service Plan",
  "Medication Administration Record (MAR)",
  "Pain Evaluation",
  "Emergency Medical Data Sheet",
  "Caregiver Daily Log",
  "Skills Assessment",
  "Other (describe below)",
];

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelCls = "mb-1 block text-sm font-semibold text-ink-soft";

export function DocumentRequestForm() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const toggleDoc = (d: string) =>
    setDocuments((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      requester_name: String(fd.get("requester_name") || ""),
      requester_role: String(fd.get("requester_role") || ""),
      organization: String(fd.get("organization") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      preferred_contact: String(fd.get("preferred_contact") || ""),
      client_name: String(fd.get("client_name") || ""),
      client_dob: String(fd.get("client_dob") || ""),
      relationship: String(fd.get("relationship") || ""),
      documents,
      reason: String(fd.get("reason") || ""),
      delivery_method: String(fd.get("delivery_method") || ""),
      notes: String(fd.get("notes") || ""),
      authorized,
      company: String(fd.get("company") || ""),
    };
    if (!payload.requester_name || (!payload.phone && !payload.email) || !payload.client_name || documents.length === 0 || !authorized) {
      setError("Please fill in your name, a phone or email, the client name, at least one document, and confirm your authorization.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/document-request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please call us.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Could not submit right now. Please call us.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-accent-100 bg-accent-50 p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Thank you. To protect our clients&apos; privacy, our team will verify your identity and authorization before
          releasing anything, then contact you to arrange secure delivery. For anything urgent, call {site.phone}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-wide text-primary">Your information</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelCls}>Your name *</span><input name="requester_name" required className={inputCls} /></label>
          <label className="block"><span className={labelCls}>Your role</span>
            <select name="requester_role" className={inputCls} defaultValue="">
              <option value="" disabled>Select…</option>
              <option>Nurse monitor</option><option>Case manager / supports planner</option>
              <option>Physician / provider</option><option>Family / representative</option><option>Other</option>
            </select>
          </label>
          <label className="block"><span className={labelCls}>Organization / agency</span><input name="organization" className={inputCls} /></label>
          <label className="block"><span className={labelCls}>Preferred contact method</span>
            <select name="preferred_contact" className={inputCls} defaultValue="Phone"><option>Phone</option><option>Email</option></select>
          </label>
          <label className="block"><span className={labelCls}>Phone *</span><input name="phone" type="tel" className={inputCls} /></label>
          <label className="block"><span className={labelCls}>Email *</span><input name="email" type="email" className={inputCls} /></label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-wide text-primary">Client &amp; authorization</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelCls}>Client name *</span><input name="client_name" required className={inputCls} /></label>
          <label className="block"><span className={labelCls}>Client date of birth</span><input name="client_dob" type="date" className={inputCls} /></label>
        </div>
        <label className="block"><span className={labelCls}>Your relationship / basis for access</span>
          <select name="relationship" className={inputCls} defaultValue="">
            <option value="" disabled>Select…</option>
            <option>Client&apos;s nurse monitor</option>
            <option>Case manager / supports planner</option>
            <option>Legal representative / power of attorney</option>
            <option>Family member with authorization</option>
            <option>Provider involved in the client&apos;s care</option>
            <option>Other</option>
          </select>
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold uppercase tracking-wide text-primary">Documents requested *</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {DOCUMENTS.map((d) => (
            <label key={d} className="flex items-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink-soft has-[:checked]:border-primary has-[:checked]:bg-primary-50">
              <input type="checkbox" checked={documents.includes(d)} onChange={() => toggleDoc(d)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
              {d}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold uppercase tracking-wide text-primary">Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelCls}>Reason for request</span><input name="reason" className={inputCls} /></label>
          <label className="block"><span className={labelCls}>Preferred secure delivery</span>
            <select name="delivery_method" className={inputCls} defaultValue="Secure email">
              <option>Secure email</option><option>Fax</option><option>Mail</option><option>In-person pickup</option>
            </select>
          </label>
        </div>
        <label className="block"><span className={labelCls}>Anything else we should know?</span><textarea name="notes" rows={3} className={inputCls} /></label>
      </fieldset>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-ink-soft">
        <input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
        <span>I confirm I am authorized to receive this client&apos;s records, and I understand they contain protected health information that will be released only after My Home Cares verifies my identity and authorization. *</span>
      </label>

      {error && <p className="rounded-lg border border-[color:#f0c9c5] bg-[color:#fbe9e7] px-4 py-3 text-sm text-[color:#b3261e]">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Submitting…" : "Submit request"} <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
