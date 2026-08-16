"use client";

import { useState } from "react";
import { INCIDENT_SECTIONS, type IRField } from "@/lib/incident-report";
import { Icon } from "./icons";

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-light";
const labelCls = "block text-xs font-semibold uppercase tracking-wide text-muted mb-1.5";
const chip =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition has-[:checked]:border-primary has-[:checked]:bg-primary-50 has-[:checked]:text-primary";

function Field({ f }: { f: IRField }) {
  const req = "required" in f && f.required;
  const label = (
    <label className={labelCls}>
      {f.label}
      {req && " *"}
    </label>
  );

  if (f.kind === "textarea") {
    return (
      <div className="sm:col-span-2">
        {label}
        {f.hint && <p className="mb-1.5 -mt-1 text-xs text-muted-light">{f.hint}</p>}
        <textarea name={f.name} rows={3} required={f.required} className={input} />
      </div>
    );
  }
  if (f.kind === "checks") {
    return (
      <div className="sm:col-span-2">
        {label}
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => (
            <label key={o} className={chip}>
              <input type="checkbox" name={f.name} value={o} className="accent-primary" /> {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (f.kind === "radio") {
    return (
      <div className="sm:col-span-2">
        {label}
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => (
            <label key={o} className={chip}>
              <input type="radio" name={f.name} value={o} className="accent-primary" /> {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  // text
  return (
    <div className={f.half ? "" : "sm:col-span-2"}>
      {label}
      <input type={f.type || "text"} name={f.name} required={f.required} className={input} />
    </div>
  );
}

export function IncidentReportForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string | string[]> = { company: String(fd.get("company") || "") };
    for (const s of INCIDENT_SECTIONS) {
      for (const f of s.fields) {
        payload[f.name] = f.kind === "checks" ? fd.getAll(f.name).map(String) : String(fd.get(f.name) || "");
      }
    }
    try {
      const res = await fetch("/api/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Something went wrong");
      setStatus("ok");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-10 text-center card-shadow">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-dark">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="text-lg font-bold text-ink">Incident report submitted</h3>
        <p className="max-w-md text-sm text-muted">
          A copy has been emailed to you and to the My Home Cares administrator. If this involves immediate
          danger, call the administrator now.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-2 text-sm font-semibold text-primary">
          File another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-xl border border-[color:#e6b980] bg-[color:#fff4e5] px-4 py-3 text-sm font-semibold text-[color:#a15c00]">
        If you suspect abuse, neglect, or exploitation — tell the administrator now. Do not wait to finish this form.
      </div>

      {INCIDENT_SECTIONS.map((sec) => (
        <div key={sec.title} className="space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
              <span className="inline-block h-4 w-1 rounded-full bg-accent" />
              {sec.title}
            </h3>
            {sec.intro && <p className="mt-1 text-sm text-muted">{sec.intro}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sec.fields.map((f) => (
              <Field key={f.name} f={f} />
            ))}
          </div>
        </div>
      ))}

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === "error" && <p className="text-sm font-medium text-primary-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Submitting…" : "Submit incident report"}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
      <p className="text-xs text-muted-light">
        Confidential · client record. A copy is emailed to you and to info@myhomecares.com on submit.
      </p>
    </form>
  );
}
