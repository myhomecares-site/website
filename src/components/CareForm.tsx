"use client";

import { useRef } from "react";
import { site } from "@/lib/site";
import { careFormSchemas, type FormBlock, type FormField } from "@/lib/care-forms";
import { Icon } from "@/components/icons";

const inputCls =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function widthCls(w?: FormField["width"]) {
  if (w === "full") return "col-span-6";
  if (w === "third") return "col-span-6 sm:col-span-2";
  return "col-span-6 sm:col-span-3"; // half (default)
}

function Fields({ block }: { block: Extract<FormBlock, { kind: "fields" }> }) {
  return (
    <fieldset>
      {block.title && <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>}
      <div className="grid grid-cols-6 gap-4">
        {block.fields.map((f) => (
          <label key={f.name} className={`${widthCls(f.width)} block`}>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{f.label}</span>
            <input type={f.type || "text"} name={f.name} className={inputCls} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Checklist({ block }: { block: Extract<FormBlock, { kind: "checklist" }> }) {
  const cols = block.columns === 3 ? "sm:grid-cols-3" : block.columns === 1 ? "" : "sm:grid-cols-2";
  return (
    <fieldset>
      <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>
      <div className={`grid grid-cols-1 gap-x-6 gap-y-2.5 ${cols}`}>
        {block.items.map((it) => (
          <label key={it} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary/30" />
            {it}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Textarea({ block }: { block: Extract<FormBlock, { kind: "textarea" }> }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-bold text-ink">{block.label}</span>
      <textarea rows={block.rows || 3} className={inputCls} />
    </label>
  );
}

function Scale({ block, idx }: { block: Extract<FormBlock, { kind: "scale" }>; idx: number }) {
  const nums = Array.from({ length: block.max - block.min + 1 }, (_, i) => block.min + i);
  return (
    <fieldset>
      <legend className="mb-3 text-base font-bold text-ink">{block.title}</legend>
      <div className="flex flex-wrap items-end gap-3">
        {block.labelMin && <span className="text-xs text-muted">{block.labelMin}</span>}
        <div className="flex flex-wrap gap-1.5">
          {nums.map((n) => (
            <label key={n} className="flex flex-col items-center gap-1 text-xs text-ink-soft">
              <input type="radio" name={`scale-${idx}`} value={n} className="h-4 w-4 text-primary focus:ring-primary/30" />
              {n}
            </label>
          ))}
        </div>
        {block.labelMax && <span className="text-xs text-muted">{block.labelMax}</span>}
      </div>
    </fieldset>
  );
}

function Table({ block }: { block: Extract<FormBlock, { kind: "table" }> }) {
  const bodyRows = block.rowLabels
    ? block.rowLabels.map((label) => ({ label, inputs: block.columns.length - 1 }))
    : Array.from({ length: block.rows || 4 }, () => ({ label: null as string | null, inputs: block.columns.length }));
  return (
    <div>
      {block.title && <h3 className="mb-3 text-base font-bold text-ink">{block.title}</h3>}
      {block.note && <p className="mb-2 text-xs text-muted">{block.note}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr>
              {block.columns.map((c) => (
                <th key={c} className="border border-border bg-surface px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>
                {row.label !== null && (
                  <td className="border border-border px-2 py-1.5 font-medium text-ink-soft">{row.label}</td>
                )}
                {Array.from({ length: row.inputs }).map((_, ci) => (
                  <td key={ci} className="border border-border p-0">
                    <input type="text" className="w-full border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Signatures({ block }: { block: Extract<FormBlock, { kind: "signatures" }> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {block.roles.map((role) => (
        <div key={role}>
          <div className="flex items-end gap-3">
            <input type="text" aria-label={`${role} signature`} className="flex-1 border-0 border-b border-ink/40 bg-transparent px-1 py-1 text-sm focus:border-primary focus:outline-none" />
            <input type="date" aria-label={`${role} date`} className="w-36 border-0 border-b border-ink/40 bg-transparent px-1 py-1 text-sm focus:border-primary focus:outline-none" />
          </div>
          <p className="mt-1 text-xs text-muted">{role} · Signature / Date</p>
        </div>
      ))}
    </div>
  );
}

export function CareForm({ slug, title }: { slug: string; title: string }) {
  const blocks = careFormSchemas[slug];
  const formRef = useRef<HTMLFormElement>(null);
  if (!blocks) return null;

  return (
    <div className="print-area rounded-2xl border border-border bg-white p-6 sm:p-8 card-shadow">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Complete this form</h2>
          <p className="text-sm text-muted">Fill it in below, then print or save as PDF. You can also print it blank.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Icon name="download" className="h-4 w-4" /> Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={() => formRef.current?.reset()}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Print-only branded header */}
      <div className="mb-6 hidden print:block">
        <p className="text-lg font-bold text-ink">{site.name}</p>
        <p className="text-sm text-muted">{title} · Licensed Maryland RSA ({site.license})</p>
      </div>

      <form ref={formRef} className="care-form space-y-8">
        {blocks.map((block, i) => {
          switch (block.kind) {
            case "fields":
              return <Fields key={i} block={block} />;
            case "checklist":
              return <Checklist key={i} block={block} />;
            case "textarea":
              return <Textarea key={i} block={block} />;
            case "scale":
              return <Scale key={i} block={block} idx={i} />;
            case "table":
              return <Table key={i} block={block} />;
            case "signatures":
              return <Signatures key={i} block={block} />;
            case "note":
              return (
                <p key={i} className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-ink-soft">
                  {block.text}
                </p>
              );
            default:
              return null;
          }
        })}
      </form>
    </div>
  );
}
