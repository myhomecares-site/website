// Shared helpers for reading care-form entry "values" maps against a schema.
// Used by the interactive form app and the admin records view.
import { careFormSchemas, type FormBlock } from "@/lib/care-forms";

export type Values = Record<string, string | boolean>;

export function fieldId(bi: number, name: string) { return `b${bi}.f.${name}`; }
export function taId(bi: number) { return `b${bi}.ta`; }
export function checkId(bi: number, ii: number) { return `b${bi}.c.${ii}`; }
export function scaleId(bi: number) { return `b${bi}.scale`; }
export function cellId(bi: number, r: number, c: number) { return `b${bi}.t.${r}.${c}`; }
export function sigId(bi: number, ri: number, k: "name" | "date") { return `b${bi}.s.${ri}.${k}`; }
export function ctId(bi: number, r: number, c: number) { return `b${bi}.ct.${r}.${c}`; }
export function skId(bi: number, r: number, k: "yes" | "no" | "date" | "rn") { return `b${bi}.sk.${r}.${k}`; }
export function bmId(bi: number) { return `b${bi}.bm`; }
export function eId(bi: number) { return `b${bi}.es`; }

export function tableRowCount(b: Extract<FormBlock, { kind: "table" }>) {
  return b.rowLabels ? b.rowLabels.length : (b.rows || 4);
}

export function summarize(schema: FormBlock[], values: Values) {
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

export function labelOf(schema: FormBlock[], values: Values): { title: string; sub: string } {
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
    const title = fv.caregiverNo ? `${fv.caregiver} · ${fv.caregiverNo}` : fv.caregiver;
    const sub = [fv.month, fv.client ? `Client: ${fv.client}` : ""].filter(Boolean).join(" · ");
    return { title, sub };
  }
  const { client, date } = summarize(schema, values);
  return { title: client || "Untitled entry", sub: date ? `Form date ${date}` : "" };
}

export function flatten(schema: FormBlock[], values: Values): [string, string][] {
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
    } else if (b.kind === "bodymap") {
      const raw = values[bmId(bi)];
      if (typeof raw === "string" && raw) {
        try {
          const pins = JSON.parse(raw) as { id: number; side: string; note: string }[];
          if (Array.isArray(pins) && pins.length) out.push(["Body map", pins.map((p) => `#${p.id} ${p.side}${p.note ? `: ${p.note}` : ""}`).join("; ")]);
        } catch { /* ignore */ }
      }
    } else if (b.kind === "esign") {
      const raw = values[eId(bi)];
      if (typeof raw === "string" && raw) {
        try {
          const s = JSON.parse(raw) as { mode: string; name?: string; agreed?: boolean; reason?: string; note?: string; witness?: string; date?: string };
          let v = "";
          if (s.mode === "type") v = `Signed (typed): ${s.name || ""}${s.agreed ? " · agreed" : ""}`;
          else if (s.mode === "draw") v = "Signed (drawn)";
          else v = `Unable to sign — ${s.reason || ""}${s.note ? `: ${s.note}` : ""}${s.witness ? ` · witness ${s.witness}` : ""}`;
          if (s.date) v += ` · ${s.date}`;
          out.push([b.role, v]);
        } catch { /* ignore */ }
      }
    }
  });
  return out;
}

// Look up a schema by slug (for the admin view, which stores the form_slug).
export function schemaFor(slug: string): FormBlock[] | null {
  return careFormSchemas[slug] || null;
}
