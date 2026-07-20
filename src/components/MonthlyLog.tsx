"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { flatten, schemaFor, type Values } from "@/lib/care-form-values";
import { PrintLetterhead } from "@/components/PrintLetterhead";
import { Icon } from "@/components/icons";

const SLUG = "caregiver-daily-log-form";

type Row = {
  entry_key: string;
  phone: string;
  form_slug: string;
  client_name: string | null;
  form_date: string | null;
  saved_at: string;
  values: Values;
};

type Visit = {
  date: string;
  timeIn: string;
  timeOut: string;
  hours: string;
  care: string;
  meals: string;
  observations: string;
  notes: string;
  caregiver: string;
  signature: string;
  savedAt: string;
};

type Group = {
  key: string;
  client: string;
  monthKey: string; // YYYY-MM for sorting
  monthLabel: string; // "July 2026"
  visits: Visit[];
  totalHours: number;
};

const fmtPhone = (p: string) => (p && p.length === 10 ? `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}` : p);

// Format a YYYY-MM-DD date as a friendly label without timezone drift.
function friendlyDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function monthParts(iso: string): { key: string; label: string } {
  const m = /^(\d{4})-(\d{2})/.exec(iso || "");
  if (!m) return { key: "0000-00", label: "Undated" };
  const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  return { key: `${m[1]}-${m[2]}`, label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
}

// Pull a single daily visit out of a saved entry using the form schema labels.
function toVisit(r: Row): Visit {
  const schema = schemaFor(r.form_slug);
  const map: Record<string, string> = {};
  if (schema) flatten(schema, r.values).forEach(([l, v]) => { map[l] = v; });
  const care = ["Personal care provided", "Home & daily support"].map((k) => map[k]).filter(Boolean).join("; ");
  return {
    date: r.form_date || map["Date"] || "",
    timeIn: map["Time in"] || "",
    timeOut: map["Time out"] || "",
    hours: map["Total hours"] || "",
    care,
    meals: map["Meals & fluids provided"] || "",
    observations: map["Observations & changes in condition"] || "",
    notes: map["Notes"] || "",
    caregiver: map["Caregiver name"] || "",
    signature: map["Caregiver signature"] || "",
    savedAt: r.saved_at,
  };
}

export function MonthlyLog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [client, setClient] = useState("");
  const [monthKey, setMonthKey] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list", form_slug: SLUG }),
        });
        const d = await res.json().catch(() => ({}));
        if (res.ok && d.ok) setRows(d.entries as Row[]);
        else setError(d.error || "Could not load records.");
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Group daily visits by client + calendar month.
  const groups = useMemo<Group[]>(() => {
    const by = new Map<string, Group>();
    for (const r of rows) {
      const visit = toVisit(r);
      const c = (r.client_name || visit.caregiver ? r.client_name : "") || "Unnamed client";
      const mp = monthParts(visit.date);
      const key = `${c}||${mp.key}`;
      let g = by.get(key);
      if (!g) {
        g = { key, client: c, monthKey: mp.key, monthLabel: mp.label, visits: [], totalHours: 0 };
        by.set(key, g);
      }
      g.visits.push(visit);
      const h = parseFloat(visit.hours);
      if (!isNaN(h)) g.totalHours += h;
    }
    for (const g of by.values()) {
      g.visits.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.savedAt.localeCompare(b.savedAt)));
    }
    return Array.from(by.values()).sort((a, b) =>
      a.client === b.client ? b.monthKey.localeCompare(a.monthKey) : a.client.localeCompare(b.client)
    );
  }, [rows]);

  const clients = useMemo(() => Array.from(new Set(groups.map((g) => g.client))).sort(), [groups]);
  const monthsForClient = useMemo(
    () => groups.filter((g) => g.client === client).sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
    [groups, client]
  );
  const selected = groups.find((g) => g.client === client && g.monthKey === monthKey) || null;

  const round = (n: number) => Math.round(n * 100) / 100;

  const exportCSV = () => {
    if (!selected) return;
    const q = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const header = ["Date", "Time in", "Time out", "Hours", "Care provided", "Caregiver", "Signature"].map(q).join(",");
    const lines = selected.visits.map((v) =>
      [v.date, v.timeIn, v.timeOut, v.hours, v.care, v.caregiver, v.signature].map(q).join(",")
    );
    const totals = ["", "", "Total", String(round(selected.totalHours)), "", "", ""].map(q).join(",");
    const blob = new Blob([[header, ...lines, totals].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `monthly-log-${selected.client}-${selected.monthKey}.csv`.replace(/\s+/g, "_");
    a.click();
  };

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Monthly log</h1>
          <p className="text-sm text-muted">
            Daily visits rolled up by client and month. Built automatically from the caregiver daily logs.
          </p>
        </div>
        <Link href="/admin/records" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> All form records
        </Link>
      </div>

      {loading ? (
        <p className="no-print py-10 text-center text-sm text-muted">Loading daily visits…</p>
      ) : error ? (
        <p className="no-print rounded-lg border border-[color:#f0c9c5] bg-[color:#fbe9e7] px-4 py-3 text-sm text-[color:#b3261e]">{error}</p>
      ) : groups.length === 0 ? (
        <p className="no-print rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          No daily visits have been logged yet. Once caregivers file daily logs, monthly logs will appear here.
        </p>
      ) : (
        <>
          <div className="no-print mb-6 flex flex-wrap gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Client</label>
              <select
                value={client}
                onChange={(e) => { setClient(e.target.value); setMonthKey(""); }}
                className="min-w-[14rem] rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Month</label>
              <select
                value={monthKey}
                onChange={(e) => setMonthKey(e.target.value)}
                disabled={!client}
                className="min-w-[12rem] rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
              >
                <option value="">Select a month…</option>
                {monthsForClient.map((g) => (
                  <option key={g.monthKey} value={g.monthKey}>{g.monthLabel} · {g.visits.length} visit{g.visits.length === 1 ? "" : "s"}</option>
                ))}
              </select>
            </div>
            {selected && (
              <div className="flex items-end gap-2">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
                  <Icon name="download" className="h-4 w-4" /> Print / Save PDF
                </button>
                <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface">
                  Export CSV
                </button>
              </div>
            )}
          </div>

          {!selected ? (
            <div className="no-print grid gap-3 sm:grid-cols-2">
              {groups.map((g) => (
                <button
                  key={g.key}
                  onClick={() => { setClient(g.client); setMonthKey(g.monthKey); }}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-left card-shadow transition hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <p className="font-semibold text-ink">{g.client}</p>
                  <p className="text-sm text-muted">{g.monthLabel}</p>
                  <p className="mt-1 text-xs text-muted">
                    {g.visits.length} visit{g.visits.length === 1 ? "" : "s"} · {round(g.totalHours)} hrs total
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="print-area care-form rounded-2xl border border-border bg-white p-5 sm:p-7">
              <PrintLetterhead title="Caregiver Monthly Log" />

              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{selected.client}</h2>
                  <p className="text-sm text-muted">{selected.monthLabel}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted">Visits: <span className="font-semibold text-ink">{selected.visits.length}</span></p>
                  <p className="text-muted">Total hours: <span className="font-semibold text-ink">{round(selected.totalHours)}</span></p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
                      <th className="border border-border px-2 py-2">Date</th>
                      <th className="border border-border px-2 py-2">In</th>
                      <th className="border border-border px-2 py-2">Out</th>
                      <th className="border border-border px-2 py-2">Hrs</th>
                      <th className="border border-border px-2 py-2">Care provided</th>
                      <th className="border border-border px-2 py-2">Caregiver</th>
                      <th className="border border-border px-2 py-2">Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.visits.map((v, i) => (
                      <tr key={i} className="align-top">
                        <td className="whitespace-nowrap border border-border px-2 py-2 font-medium text-ink">{v.date ? friendlyDate(v.date) : "—"}</td>
                        <td className="whitespace-nowrap border border-border px-2 py-2 text-ink-soft">{v.timeIn || "—"}</td>
                        <td className="whitespace-nowrap border border-border px-2 py-2 text-ink-soft">{v.timeOut || "—"}</td>
                        <td className="whitespace-nowrap border border-border px-2 py-2 text-ink-soft">{v.hours || "—"}</td>
                        <td className="border border-border px-2 py-2 text-ink-soft">{v.care || "—"}</td>
                        <td className="whitespace-nowrap border border-border px-2 py-2 text-ink-soft">{v.caregiver || "—"}</td>
                        <td className="whitespace-nowrap border border-border px-2 py-2 text-ink-soft">{v.signature || "—"}</td>
                      </tr>
                    ))}
                    <tr className="bg-surface font-semibold text-ink">
                      <td className="border border-border px-2 py-2" colSpan={3}>Total</td>
                      <td className="border border-border px-2 py-2">{round(selected.totalHours)}</td>
                      <td className="border border-border px-2 py-2" colSpan={3}></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[11px] leading-snug text-muted">
                This monthly log is compiled from individual daily visit records filed by caregivers. {site.name} · License {site.license}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
