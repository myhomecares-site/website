"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { careFormSchemas, type FormBlock, type FormField } from "@/lib/care-forms";
import { Icon } from "@/components/icons";

/*
  Interactive, on-device care-form tool.
  - Uncontrolled inputs (values read from the DOM on save) so typing never
    triggers React re-renders — stays fast even on very large forms.
  - Forms with several section headings render as collapsible <details> so a
    closed section isn't laid out; the page opens instantly on any device.
  - Entries save in localStorage on THIS device (no server, no PHI transmitted).
*/

type Values = Record<string, string | boolean>;
type Entry = { id: string; savedAt: string; values: Values };

const storeKey = (slug: string) => `mhc_careform_${slug}`;

const inputCls =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function widthCls(w?: FormField["width"]) {
  if (w === "full") return "col-span-6";
  if (w === "third") return "col-span-6 sm:col-span-2";
  return "col-span-6 sm:col-span-3";
}

// ---- id helpers ------------------------------------------------------------
function fieldId(bi: number, name: string) { return `b${bi}.f.${name}`; }
function taId(bi: number) { return `b${bi}.ta`; }
function checkId(bi: number, ii: number) { return `b${bi}.c.${ii}`; }
function scaleId(bi: number) { return `b${bi}.scale`; }
function cellId(bi: number, r: number, c: number) { return `b${bi}.t.${r}.${c}`; }
function sigId(bi: number, ri: number, k: "name" | "date") { return `b${bi}.s.${ri}.${k}`; }
function ctId(bi: number, r: number, c: number) { return `b${bi}.ct.${r}.${c}`; }
function skId(bi: number, r: number, k: "yes" | "no" | "date" | "rn") { return `b${bi}.sk.${r}.${k}`; }

function tableRowCount(b: Extract<FormBlock, { kind: "table" }>) {
  return b.rowLabels ? b.rowLabels.length : (b.rows || 4);
}

// Read every named input in the form into a values map.
function readForm(form: HTMLFormElement): Values {
  const vals: Values = {};
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select").forEach((el) => {
    const id = el.getAttribute("name");
    if (!id) return;
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      if (el.checked) vals[id] = true;
    } else if (el instanceof HTMLInputElement && el.type === "radio") {
      if (el.checked) vals[id] = el.value;
    } else if (el.value) {
      vals[id] = el.value;
    }
  });
  return vals;
}

function summarize(schema: FormBlock[], values: Values) {
  let client = "", date = "";
  schema.forEach((b, bi) => {
    if (b.kind === "fields") {
      b.fields.forEach((f) => {
        const v = values[fieldId(bi, f.name)];
        if (typeof v === "string" && v) {
          if (!client && /(name|client|participant)/i.test(f.label)) client = v;
          if (!date && f.type === "date") date = v;
        }
      });
    }
  });
  return { client, date };
}

function labelOf(schema: FormBlock[], values: Values): { title: string; sub: string } {
  const fv: Record<string, string> = {};
  schema.forEach((b, bi) => {
    if (b.kind === "fields") {
      b.fields.forEach((f) => {
        const v = values[fieldId(bi, f.name)];
        if (typeof v === "string" && v.trim()) fv[f.name] = v.trim();
      });
    }
  });
  if (fv.caregiver) {
    const title = fv.caregiverNo ? `${fv.caregiver} · #${fv.caregiverNo}` : fv.caregiver;
    const sub = [fv.month, fv.client ? `Client: ${fv.client}` : ""].filter(Boolean).join(" · ");
    return { title, sub };
  }
  const { client, date } = summarize(schema, values);
  return { title: client || "Untitled entry", sub: date ? `Form date ${date}` : "" };
}

function flatten(schema: FormBlock[], values: Values): [string, string][] {
  const out: [string, string][] = [];
  schema.forEach((b, bi) => {
    if (b.kind === "fields") {
      b.fields.forEach((f) => { const v = values[fieldId(bi, f.name)]; if (v) out.push([f.label, String(v)]); });
    } else if (b.kind === "textarea") {
      const v = values[taId(bi)]; if (v) out.push([b.label, String(v)]);
    } else if (b.kind === "checklist") {
      const items = b.items.filter((_, ii) => values[checkId(bi, ii)]);
      if (items.length) out.push([b.title, items.join(", ")]);
    } else if (b.kind === "scale") {
      const v = values[scaleId(bi)]; if (v !== undefined && v !== "") out.push([b.title, String(v)]);
    } else if (b.kind === "table") {
      const rows: string[] = [];
      const rc = tableRowCount(b);
      const colStart = b.rowLabels ? 1 : 0;
      for (let r = 0; r < rc; r++) {
        const cells: string[] = [];
        let hasInput = false;
        if (b.rowLabels) cells.push(b.rowLabels[r]);
        for (let c = colStart; c < b.columns.length; c++) {
          const val = String(values[cellId(bi, r, c)] || "");
          if (val.trim()) hasInput = true;
          cells.push(val);
        }
        if (hasInput) rows.push(cells.join(" / "));
      }
      if (rows.length) out.push([b.title || "Table", rows.join(" ; ")]);
    } else if (b.kind === "signatures") {
      b.roles.forEach((role, ri) => {
        const n = values[sigId(bi, ri, "name")]; const d = values[sigId(bi, ri, "date")];
        if (n || d) out.push([role, `${n || ""} ${d || ""}`.trim()]);
      });
    } else if (b.kind === "checktable") {
      b.rowLabels.forEach((label, r) => {
        const checked = b.columns.filter((_, c) => values[ctId(bi, r, c)]);
        if (checked.length) out.push([label, checked.join(", ")]);
      });
    } else if (b.kind === "skilltable") {
      b.items.forEach((item, r) => {
        const yes = values[skId(bi, r, "yes")]; const no = values[skId(bi, r, "no")];
        const d = values[skId(bi, r, "date")]; const rn = values[skId(bi, r, "rn")];
        if (yes || no || d || rn) {
          const sat = yes ? "Yes" : no ? "No" : "";
          out.push([item, [sat, d ? String(d) : "", rn ? `RN: ${rn}` : ""].filter(Boolean).join(" · ")]);
        }
      });
    }
  });
  return out;
}

// ---- component -------------------------------------------------------------
export function CareFormApp({ slug, title }: { slug: string; title: string }) {
  const schema = careFormSchemas[slug];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initial, setInitial] = useState<Values>({});
  const [formKey, setFormKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(storeKey(slug));
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [slug]);

  if (!schema) return null;

  // Group blocks into sections by heading, preserving original block indexes.
  const headingCount = schema.filter((b) => b.kind === "heading").length;
  const collapsible = headingCount >= 3;
  type Sec = { heading: string | null; items: { block: FormBlock; bi: number }[] };
  const sections: Sec[] = [];
  let cur: Sec = { heading: null, items: [] };
  schema.forEach((b, bi) => {
    if (b.kind === "heading") { sections.push(cur); cur = { heading: b.text, items: [] }; }
    else cur.items.push({ block: b, bi });
  });
  sections.push(cur);
  const visibleSections = sections.filter((s) => s.items.length > 0);

  const persist = (next: Entry[]) => {
    setEntries(next);
    try { localStorage.setItem(storeKey(slug), JSON.stringify(next)); } catch { /* ignore */ }
  };
  const toast = (m: string) => {
    setToastMsg(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 1800);
  };

  const saveEntry = () => {
    if (!formRef.current) return;
    const values = readForm(formRef.current);
    const id = editingId || "e" + Date.now();
    const entry: Entry = { id, savedAt: new Date().toISOString(), values };
    persist([entry, ...entries.filter((e) => e.id !== id)]);
    setEditingId(id);
    toast(editingId ? "Entry updated" : "Entry saved on this device");
  };
  const newEntry = () => { setInitial({}); setEditingId(null); setFormKey((k) => k + 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const editEntry = (e: Entry) => { setInitial(e.values); setEditingId(e.id); setFormKey((k) => k + 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const deleteEntry = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    if (editingId === id) newEntry();
    toast("Entry deleted");
  };

  const printForm = () => {
    formRef.current?.querySelectorAll("details").forEach((d) => { d.open = true; });
    setTimeout(() => window.print(), 40);
  };
  const toggleAll = () => {
    const all = formRef.current?.querySelectorAll("details");
    if (!all) return;
    const anyClosed = Array.from(all).some((d) => !d.open);
    all.forEach((d) => { d.open = anyClosed; });
  };

  const exportCSV = () => {
    const q = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const header = ["Saved", "Name", "Date", "Details"].map(q).join(",");
    const rows = entries.map((e) => {
      const { client, date } = summarize(schema, e.values);
      const details = flatten(schema, e.values).map(([l, v]) => `${l}: ${v}`).join(" | ");
      return [new Date(e.savedAt).toLocaleString("en-US"), client, date, details].map(q).join(",");
    });
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}-entries.csv`;
    a.click();
    toast("CSV downloaded");
  };

  return (
    <div ref={topRef}>
      <div className="print-area rounded-2xl border border-border bg-white p-6 sm:p-8 card-shadow">
        {/* Toolbar */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <h2 className="text-lg font-bold text-ink">{editingId ? "Editing entry" : "New entry"}</h2>
            <p className="text-sm text-muted">Fill it in, then save on this device, print, or export. Data stays on this device.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {collapsible && (
              <button type="button" onClick={toggleAll} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface">
                Expand / collapse all
              </button>
            )}
            <button type="button" onClick={saveEntry} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark">
              <Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> {editingId ? "Update entry" : "Save entry"}
            </button>
            <button type="button" onClick={printForm} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
              <Icon name="download" className="h-4 w-4" /> Print / PDF
            </button>
            <button type="button" onClick={newEntry} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface">
              New / Clear
            </button>
          </div>
        </div>

        {/* Print-only branded header */}
        <div className="mb-6 hidden print:block">
          <p className="text-lg font-bold text-ink">{site.name}</p>
          <p className="text-sm text-muted">{title} · Licensed Maryland RSA ({site.license})</p>
        </div>

        <form key={formKey} ref={formRef} className="care-form space-y-6">
          {visibleSections.map((sec, si) =>
            sec.heading == null ? (
              <div key={si} className="space-y-8">
                {sec.items.map(({ block, bi }) => <Block key={bi} block={block} bi={bi} initial={initial} />)}
              </div>
            ) : collapsible ? (
              <details key={si} open={si === 0} className="group overflow-hidden rounded-xl border border-border print:border-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 bg-surface-2 px-4 py-3 text-sm font-bold uppercase tracking-wide text-ink">
                  {sec.heading}
                  <Icon name="arrow" className="h-4 w-4 rotate-90 text-muted transition-transform group-open:rotate-[270deg]" />
                </summary>
                <div className="space-y-8 p-4 sm:p-5">
                  {sec.items.map(({ block, bi }) => <Block key={bi} block={block} bi={bi} initial={initial} />)}
                </div>
              </details>
            ) : (
              <div key={si} className="space-y-6">
                <h3 className="-mx-6 border-y border-border bg-surface-2 px-6 py-2 text-sm font-bold uppercase tracking-wide text-ink sm:-mx-8 sm:px-8">{sec.heading}</h3>
                {sec.items.map(({ block, bi }) => <Block key={bi} block={block} bi={bi} initial={initial} />)}
              </div>
            )
          )}
        </form>
      </div>

      {/* Saved entries (device only) */}
      <div className="no-print mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">
            Saved entries {mounted && entries.length > 0 && <span className="text-muted">· {entries.length}</span>}
          </h3>
          {mounted && entries.length > 0 && (
            <button type="button" onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface">
              <Icon name="download" className="h-4 w-4" /> Export CSV
            </button>
          )}
        </div>

        {!mounted ? null : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-8 text-center text-sm text-muted">
            No saved entries yet. Fill in the form above and choose <span className="font-semibold text-ink-soft">Save entry</span>. Entries are stored only on this device.
          </div>
        ) : (
          <>
            {entries.length > 3 && (
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or number..."
                className="mb-3 w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            )}
            <div className="space-y-3">
              {entries
                .map((e) => ({ e, label: labelOf(schema, e.values) }))
                .filter(({ label }) => !query || `${label.title} ${label.sub}`.toLowerCase().includes(query.toLowerCase()))
                .map(({ e, label }) => (
                  <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 card-shadow">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{label.title}</p>
                      <p className="text-xs text-muted">
                        {label.sub ? `${label.sub} · ` : ""}Saved {new Date(e.savedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                        {editingId === e.id && <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 font-semibold text-primary">editing</span>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editEntry(e)} className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-surface">Open</button>
                      <button type="button" onClick={() => deleteEntry(e.id)} className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-primary-dark hover:bg-surface">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
        <p className="mt-3 text-xs text-muted">
          Entries are saved only in this browser on this device (no server). Clearing your browser data will remove them. Use Print / PDF or Export CSV to keep a permanent copy.
        </p>
      </div>

      {toastMsg && (
        <div className="no-print fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// ---- block renderer (uncontrolled) ----------------------------------------
function Block({ block, bi, initial }: { block: FormBlock; bi: number; initial: Values }) {
  const dv = (id: string) => (initial[id] as string) || "";
  const dc = (id: string) => !!initial[id];

  switch (block.kind) {
    case "fields":
      return (
        <fieldset>
          {block.title && <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>}
          <div className="grid grid-cols-6 gap-4">
            {block.fields.map((f) => {
              const id = fieldId(bi, f.name);
              return (
                <label key={f.name} className={`${widthCls(f.width)} block`}>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{f.label}</span>
                  <input type={f.type || "text"} name={id} defaultValue={dv(id)} className={inputCls} />
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    case "checklist": {
      const cols = block.columns === 3 ? "sm:grid-cols-3" : block.columns === 1 ? "" : "sm:grid-cols-2";
      return (
        <fieldset>
          <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>
          <div className={`grid grid-cols-1 gap-x-6 gap-y-2.5 ${cols}`}>
            {block.items.map((it, ii) => {
              const id = checkId(bi, ii);
              return (
                <label key={it} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <input type="checkbox" name={id} defaultChecked={dc(id)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/30" />
                  {it}
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    }
    case "textarea": {
      const id = taId(bi);
      return (
        <label className="block">
          <span className="mb-1 block text-base font-bold text-ink">{block.label}</span>
          <textarea rows={block.rows || 3} name={id} defaultValue={dv(id)} className={inputCls} />
        </label>
      );
    }
    case "scale": {
      const id = scaleId(bi);
      const nums = Array.from({ length: block.max - block.min + 1 }, (_, i) => block.min + i);
      return (
        <fieldset>
          <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>
          <div className="flex flex-wrap items-end gap-3">
            {block.labelMin && <span className="text-xs text-muted">{block.labelMin}</span>}
            <div className="flex flex-wrap gap-1.5">
              {nums.map((n) => (
                <label key={n} className="flex flex-col items-center gap-1 text-xs text-ink-soft">
                  <input type="radio" name={id} value={String(n)} defaultChecked={initial[id] === String(n)} className="h-4 w-4 text-primary focus:ring-primary/30" />
                  {n}
                </label>
              ))}
            </div>
            {block.labelMax && <span className="text-xs text-muted">{block.labelMax}</span>}
          </div>
        </fieldset>
      );
    }
    case "table": {
      const rc = tableRowCount(block);
      const colStart = block.rowLabels ? 1 : 0;
      return (
        <div>
          {block.title && <h3 className="mb-3 text-base font-bold text-ink">{block.title}</h3>}
          {block.note && <p className="mb-2 text-xs text-muted">{block.note}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} className="border border-border bg-surface px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rc }).map((_, r) => (
                  <tr key={r}>
                    {block.rowLabels && <td className="border border-border px-2 py-1.5 font-medium text-ink-soft">{block.rowLabels[r]}</td>}
                    {block.columns.slice(colStart).map((_, ci) => {
                      const c = ci + colStart;
                      const id = cellId(bi, r, c);
                      return (
                        <td key={c} className="border border-border p-0">
                          <input type="text" name={id} defaultValue={dv(id)} className="w-full border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20" />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    case "signatures":
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {block.roles.map((role, ri) => (
            <div key={role}>
              <div className="flex items-end gap-3">
                <input type="text" name={sigId(bi, ri, "name")} defaultValue={dv(sigId(bi, ri, "name"))} aria-label={`${role} signature`} className="flex-1 border-0 border-b border-ink/40 bg-transparent px-1 py-1 text-sm focus:border-primary focus:outline-none" />
                <input type="date" name={sigId(bi, ri, "date")} defaultValue={dv(sigId(bi, ri, "date"))} aria-label={`${role} date`} className="w-36 border-0 border-b border-ink/40 bg-transparent px-1 py-1 text-sm focus:border-primary focus:outline-none" />
              </div>
              <p className="mt-1 text-xs text-muted">{role} · Signature / Date</p>
            </div>
          ))}
        </div>
      );
    case "heading":
      return (
        <h3 className="-mx-6 mt-2 border-y border-border bg-surface-2 px-6 py-2 text-sm font-bold uppercase tracking-wide text-ink sm:-mx-8 sm:px-8">
          {block.text}
        </h3>
      );
    case "checktable":
      return (
        <div>
          {block.title && <h4 className="mb-2 text-base font-bold text-ink">{block.title}</h4>}
          {block.note && <p className="mb-2 text-xs text-muted">{block.note}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-surface px-2 py-1.5" />
                  {block.columns.map((c) => (
                    <th key={c} className="border border-border bg-surface px-2 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-muted">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rowLabels.map((label, r) => (
                  <tr key={r}>
                    <td className="border border-border px-2 py-1.5 font-medium text-ink-soft">{label}</td>
                    {block.columns.map((_, c) => {
                      const id = ctId(bi, r, c);
                      return (
                        <td key={c} className="border border-border p-0 text-center">
                          <span className="flex items-center justify-center py-1.5">
                            <input type="checkbox" name={id} defaultChecked={dc(id)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "skilltable":
      return (
        <div>
          {block.title && <h4 className="mb-2 text-base font-bold text-ink">{block.title}</h4>}
          {block.note && <p className="mb-2 text-xs text-muted">{block.note}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <thead>
                <tr>
                  {["#", "Skill assessment & demonstration", "Satisfactory", "Date", "Observation RN"].map((h) => (
                    <th key={h} className="border border-border bg-surface px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.items.map((item, r) => {
                  const yesId = skId(bi, r, "yes"); const noId = skId(bi, r, "no");
                  return (
                    <tr key={r}>
                      <td className="border border-border px-2 py-1.5 text-center text-muted">{r + 1}</td>
                      <td className="border border-border px-2 py-1.5 text-ink-soft">{item}</td>
                      <td className="border border-border px-2 py-1.5 whitespace-nowrap">
                        <label className="mr-3 inline-flex items-center gap-1">
                          <input type="checkbox" name={yesId} defaultChecked={dc(yesId)} onChange={(e) => { if (e.target.checked) { const o = e.target.closest("tr")?.querySelector<HTMLInputElement>(`input[name="${noId}"]`); if (o) o.checked = false; } }} className="h-4 w-4" /> Yes
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input type="checkbox" name={noId} defaultChecked={dc(noId)} onChange={(e) => { if (e.target.checked) { const o = e.target.closest("tr")?.querySelector<HTMLInputElement>(`input[name="${yesId}"]`); if (o) o.checked = false; } }} className="h-4 w-4" /> No
                        </label>
                      </td>
                      <td className="border border-border p-0">
                        <input type="date" name={skId(bi, r, "date")} defaultValue={dv(skId(bi, r, "date"))} className="w-full border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none" />
                      </td>
                      <td className="border border-border p-0">
                        <input type="text" name={skId(bi, r, "rn")} defaultValue={dv(skId(bi, r, "rn"))} className="w-full border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "note":
      return <p className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-ink-soft">{block.text}</p>;
    default:
      return null;
  }
}
