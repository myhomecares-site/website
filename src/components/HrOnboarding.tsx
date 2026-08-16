"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ONBOARDING_SECTIONS,
  itemKey,
  percentComplete,
  type OnboardingStatus,
} from "@/lib/onboarding";
import { careForms } from "@/lib/site";
import { Icon } from "@/components/icons";

// Assessment forms HR runs during onboarding (in display order).
const HR_FORM_SLUGS = ["participant-assessment-form", "pain-evaluation", "unlicensed-aide-skills-assessment"];
const HR_FORMS = HR_FORM_SLUGS
  .map((slug) => careForms.find((f) => f.slug === slug))
  .filter((f): f is NonNullable<typeof f> => Boolean(f));

type Rec = {
  id?: string;
  name: string;
  position: string;
  date_applied: string | null;
  start_date: string | null;
  onboarding_lead: string;
  items: Record<string, OnboardingStatus>;
  notes: string;
  updated_at?: string;
};

const blank = (): Rec => ({
  name: "",
  position: "",
  date_applied: null,
  start_date: null,
  onboarding_lead: "",
  items: {},
  notes: "",
});

const STATUSES: { v: OnboardingStatus; label: string; cls: string }[] = [
  { v: "", label: "Not started", cls: "border-border text-muted" },
  { v: "done", label: "Done", cls: "border-accent bg-accent-50 text-accent-dark" },
  { v: "pending", label: "Pending", cls: "border-[#e6b980] bg-[#fff4e5] text-[#a15c00]" },
  { v: "na", label: "N/A", cls: "border-border bg-surface text-ink-soft" },
];

async function api(action: string, extra: Record<string, unknown> = {}) {
  const res = await fetch("/api/hr-onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  const d = await res.json().catch(() => ({}));
  return { ok: res.ok && d.ok, data: d };
}

export function HrOnboarding() {
  const [records, setRecords] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Rec | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { ok, data } = await api("list");
    if (ok) setRecords(data.records as Rec[]);
    else setError(data.error || "Could not load records.");
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => `${r.name} ${r.position} ${r.onboarding_lead}`.toLowerCase().includes(q));
  }, [records, query]);

  const draftPct = draft ? percentComplete(draft.items) : 0;

  const setField = (k: keyof Rec, v: unknown) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setItem = (key: string, v: OnboardingStatus) =>
    setDraft((d) => (d ? { ...d, items: { ...d.items, [key]: v } } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) { alert("Add the new hire's name first."); return; }
    setBusy(true);
    const { ok, data } = await api("save", { record: draft });
    setBusy(false);
    if (!ok) { alert(data.error || "Could not save."); return; }
    const saved = data.record as Rec;
    setRecords((prev) => {
      const i = prev.findIndex((r) => r.id === saved.id);
      if (i >= 0) { const next = [...prev]; next[i] = saved; return next; }
      return [saved, ...prev];
    });
    setDraft(null);
  };

  const del = async (r: Rec) => {
    if (!r.id) { setDraft(null); return; }
    if (!confirm(`Delete the onboarding record for ${r.name || "this hire"}? This cannot be undone.`)) return;
    const { ok } = await api("delete", { id: r.id });
    if (ok) { setRecords((prev) => prev.filter((x) => x.id !== r.id)); setDraft(null); }
  };

  const signOut = async () => {
    await fetch("/api/hr-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    window.location.href = "/hr-login";
  };

  // ---- Editor view --------------------------------------------------------
  if (draft) {
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setDraft(null)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to list
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink">{draftPct}% complete</span>
            <button onClick={save} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60">
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${draftPct}%` }} />
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Employee name</span>
            <input value={draft.name} onChange={(e) => setField("name", e.target.value)} className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Position</span>
            <input value={draft.position} onChange={(e) => setField("position", e.target.value)} className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Date applied</span>
            <input type="date" value={draft.date_applied || ""} onChange={(e) => setField("date_applied", e.target.value || null)} className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Start date</span>
            <input type="date" value={draft.start_date || ""} onChange={(e) => setField("start_date", e.target.value || null)} className={inp} /></label>
          <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Onboarding lead</span>
            <input value={draft.onboarding_lead} onChange={(e) => setField("onboarding_lead", e.target.value)} className={inp} /></label>
        </div>

        <div className="mt-6 space-y-5">
          {ONBOARDING_SECTIONS.map((sec, si) => (
            <div key={sec.title} className="rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-3 text-sm font-bold text-ink">{si + 1}. {sec.title}</h3>
              <div className="space-y-2.5">
                {sec.items.map((item, ii) => {
                  const key = itemKey(si, ii);
                  const cur = draft.items[key] || "";
                  return (
                    <div key={key} className="flex flex-col gap-2 border-b border-border/60 pb-2.5 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-ink-soft">{item}</span>
                      <div className="flex shrink-0 flex-wrap gap-1.5">
                        {STATUSES.map((s) => (
                          <button
                            key={s.v || "none"}
                            type="button"
                            onClick={() => setItem(key, s.v)}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${cur === s.v ? s.cls : "border-border text-muted hover:bg-surface"}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <label className="block rounded-2xl border border-border bg-white p-5">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Notes</span>
            <textarea value={draft.notes} onChange={(e) => setField("notes", e.target.value)} rows={3} className={inp} />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => del(draft)} className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-primary-dark hover:bg-surface">Delete record</button>
          <button onClick={save} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  // ---- List view ----------------------------------------------------------
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">HR onboarding</h1>
          <p className="text-sm text-muted">Track each new hire through onboarding, and download the master templates.</p>
        </div>
        <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">Sign out</button>
      </div>

      {/* Template downloads */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <a href="/api/hr-files?file=checklist" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 card-shadow">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name="download" className="h-5 w-5" /></span>
          <span><span className="block text-sm font-bold text-ink">Onboarding Checklist</span><span className="text-xs text-muted">Word template · one per employee</span></span>
        </a>
        <a href="/api/hr-files?file=tracker" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 card-shadow">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name="download" className="h-5 w-5" /></span>
          <span><span className="block text-sm font-bold text-ink">Onboarding Tracker</span><span className="text-xs text-muted">Excel roster · all hires at a glance</span></span>
        </a>
      </div>

      {/* Assessment forms HR runs during onboarding */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Assessment forms</h2>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {HR_FORMS.map((f) => (
          <a key={f.slug} href={`/${f.slug}`} className="flex flex-col rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 card-shadow">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name="check" className="h-5 w-5" strokeWidth={2.5} /></span>
            <span className="mt-3 text-sm font-bold text-ink">{f.title}</span>
            <span className="mt-1 flex-1 text-xs leading-relaxed text-muted">{f.summary}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Open form <Icon name="arrow" className="h-3.5 w-3.5" /></span>
          </a>
        ))}
      </div>
      <a href="/incident-report" className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 card-shadow">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><Icon name="shield-heart" className="h-5 w-5" /></span>
        <span><span className="block text-sm font-bold text-ink">Incident report</span><span className="text-xs text-muted">File an incident — emailed to you and the administrator.</span></span>
      </a>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setDraft(blank())} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> New hire
        </button>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, position, or lead…" className="min-w-[16rem] flex-1 rounded-lg border border-border bg-white px-3.5 py-2 text-sm outline-none focus:border-primary" />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted">Loading…</p>
      ) : error ? (
        <p className="rounded-lg border border-[color:#f0c9c5] bg-[color:#fbe9e7] px-4 py-3 text-sm text-[color:#b3261e]">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">No hires tracked yet. Click “New hire” to start one.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const pct = percentComplete(r.items || {});
            return (
              <button key={r.id} onClick={() => setDraft({ ...blank(), ...r, items: r.items || {} })} className="flex w-full items-center gap-4 rounded-xl border border-border bg-white px-4 py-3 text-left card-shadow transition hover:border-primary/30">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.name || "Unnamed hire"}</p>
                  <p className="text-xs text-muted">
                    {[r.position, r.start_date ? `Starts ${r.start_date}` : "", r.onboarding_lead ? `Lead: ${r.onboarding_lead}` : ""].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex w-28 shrink-0 items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${pct === 100 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink-soft">{pct}%</span>
                </div>
                <Icon name="arrow" className="h-4 w-4 shrink-0 text-muted" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
