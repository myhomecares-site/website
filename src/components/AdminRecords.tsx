"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { careForms } from "@/lib/site";
import { flatten, labelOf, schemaFor, type Values } from "@/lib/care-form-values";
import { Icon } from "@/components/icons";

type Row = {
  entry_key: string;
  phone: string;
  form_slug: string;
  client_name: string | null;
  form_date: string | null;
  saved_at: string;
  values: Values;
};

const titleFor = (slug: string) => careForms.find((f) => f.slug === slug)?.title || slug;
const fmtPhone = (p: string) => (p && p.length === 10 ? `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}` : p);

export function AdminRecords() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", form_slug: s }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) setRows(d.entries as Row[]);
      else setError(d.error || "Could not load records.");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(""); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (slug && r.form_slug !== slug) return false;
      if (!q) return true;
      return `${r.client_name || ""} ${r.phone} ${titleFor(r.form_slug)}`.toLowerCase().includes(q);
    });
  }, [rows, slug, query]);

  const del = async (r: Row) => {
    if (!confirm(`Delete this ${titleFor(r.form_slug)} entry for ${r.client_name || "this client"}? This cannot be undone.`)) return;
    const res = await fetch("/api/admin-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", phone: r.phone, form_slug: r.form_slug, entry_key: r.entry_key }),
    });
    if (res.ok) setRows((prev) => prev.filter((x) => !(x.phone === r.phone && x.form_slug === r.form_slug && x.entry_key === r.entry_key)));
  };

  const signOut = async () => {
    await fetch("/api/staff-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    window.location.href = "/staff-login";
  };

  const exportCSV = () => {
    const q = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const header = ["Saved", "Form", "Caregiver phone", "Client", "Form date", "Details"].map(q).join(",");
    const lines = filtered.map((r) => {
      const schema = schemaFor(r.form_slug);
      const details = schema ? flatten(schema, r.values).map(([l, v]) => `${l}: ${v}`).join(" | ") : "";
      return [new Date(r.saved_at).toLocaleString("en-US"), titleFor(r.form_slug), fmtPhone(r.phone), r.client_name || "", r.form_date || "", details].map(q).join(",");
    });
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mhc-form-records.csv";
    a.click();
  };

  const usedSlugs = Array.from(new Set(rows.map((r) => r.form_slug)));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Form records</h1>
          <p className="text-sm text-muted">All care-form entries saved by your team, across every device.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/monthly-log" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">
            <Icon name="clock" className="h-4 w-4" /> Monthly log
          </Link>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">
            <Icon name="download" className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">Sign out</button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="">All forms</option>
          {careForms.filter((f) => usedSlugs.includes(f.slug)).map((f) => (
            <option key={f.slug} value={f.slug}>{f.title}</option>
          ))}
        </select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by client, caregiver, or form…" className="min-w-[16rem] flex-1 rounded-lg border border-border bg-white px-3.5 py-2 text-sm outline-none focus:border-primary" />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted">Loading records…</p>
      ) : error ? (
        <p className="rounded-lg border border-[color:#f0c9c5] bg-[color:#fbe9e7] px-4 py-3 text-sm text-[color:#b3261e]">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">No records found.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted">{filtered.length} record{filtered.length === 1 ? "" : "s"}</p>
          {filtered.map((r) => {
            const key = `${r.phone}.${r.form_slug}.${r.entry_key}`;
            const isOpen = open === key;
            const lb = schemaFor(r.form_slug) ? labelOf(schemaFor(r.form_slug)!, r.values) : { title: r.client_name || "Entry", sub: "" };
            const pairs = schemaFor(r.form_slug) ? flatten(schemaFor(r.form_slug)!, r.values) : [];
            return (
              <div key={key} className="rounded-xl border border-border bg-white card-shadow">
                <button onClick={() => setOpen(isOpen ? null : key)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{r.client_name || lb.title || "Entry"}</p>
                    <p className="text-xs text-muted">
                      {titleFor(r.form_slug)} · {fmtPhone(r.phone)}{r.form_date ? ` · ${r.form_date}` : ""} · saved {new Date(r.saved_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <Icon name="arrow" className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-[270deg]" : "rotate-90"}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-4 py-3">
                    {pairs.length === 0 ? (
                      <p className="text-sm text-muted">No details recorded.</p>
                    ) : (
                      <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                        {pairs.map(([l, v], i) => (
                          <div key={i} className="text-sm">
                            <dt className="font-semibold text-ink-soft">{l}</dt>
                            <dd className="text-muted">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <div className="mt-4">
                      <button onClick={() => del(r)} className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-primary-dark hover:bg-surface">Delete entry</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
