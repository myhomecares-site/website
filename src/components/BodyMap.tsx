"use client";

import { useState, type MouseEvent } from "react";

/*
  Interactive body diagram. Tap a figure (front or back) to drop a numbered pin
  at that spot, then describe it. Pins are stored as JSON in a hidden input so
  they save with the rest of the (uncontrolled) care form.
*/

type Marker = { id: number; side: "front" | "back"; x: number; y: number; note: string };

function parse(initial: string): Marker[] {
  try {
    const v = JSON.parse(initial);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// Smooth anatomical human silhouette (viewBox 0 0 100 200), for front and back.
function Silhouette() {
  return (
    <g fill="#e4eef4" stroke="#5f7788" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M50 6 C44 6 40 10 40 16 C40 21 43 25 47 27 C42 28 38 31 36 36 L33 44 C31 49 29 55 27 63 L22 92 C21 97 23 100 26 100 C28 100 30 98 30 94 L34 66 C35 61 37 58 39 56 C39 62 39 70 40 78 L41 108 C39 118 37 132 36 150 L35 196 C35 201 37 204 41 204 C44 204 46 201 46 197 L48 150 C49 138 49 126 50 118 C51 126 51 138 52 150 L54 197 C54 201 56 204 59 204 C63 204 65 201 65 196 L64 150 C63 132 61 118 59 108 L60 78 C61 70 61 62 61 56 C63 58 65 61 66 66 L70 94 C70 98 72 100 74 100 C77 100 79 97 78 92 L73 63 C71 55 69 49 67 44 L64 36 C62 31 58 28 53 27 C57 25 60 21 60 16 C60 10 56 6 50 6 Z" />
    </g>
  );
}

function Figure({
  side,
  markers,
  onAdd,
  onRemove,
}: {
  side: "front" | "back";
  markers: Marker[];
  onAdd: (side: "front" | "back", x: number, y: number) => void;
  onRemove: (id: number) => void;
}) {
  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    onAdd(side, Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10);
  };
  return (
    <div className="flex-1">
      <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-muted">{side}</p>
      <svg
        viewBox="0 0 100 200"
        className="mx-auto block h-auto w-full max-w-[9.5rem] cursor-crosshair rounded-lg border border-border bg-white"
        onClick={handleClick}
      >
        <Silhouette />
        {markers.filter((m) => m.side === side).map((m) => (
          <g key={m.id} onClick={(e) => { e.stopPropagation(); onRemove(m.id); }} className="cursor-pointer">
            <circle cx={m.x} cy={m.y} r="6.5" fill="#00c700" stroke="#fff" strokeWidth="1.5" />
            <text x={m.x} y={m.y + 3} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">{m.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BodyMap({ name, initial, label }: { name: string; initial: string; label?: string }) {
  const [markers, setMarkers] = useState<Marker[]>(() => parse(initial));

  const add = (side: "front" | "back", x: number, y: number) => {
    setMarkers((m) => {
      const nextId = m.reduce((mx, x2) => Math.max(mx, x2.id), 0) + 1;
      return [...m, { id: nextId, side, x, y, note: "" }];
    });
  };
  const remove = (id: number) => setMarkers((m) => m.filter((x) => x.id !== id));
  const setNote = (id: number, note: string) => setMarkers((m) => m.map((x) => (x.id === id ? { ...x, note } : x)));

  return (
    <div>
      {label && <p className="mb-2 text-sm font-bold text-ink">{label}</p>}
      <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
        <Figure side="front" markers={markers} onAdd={add} onRemove={remove} />
        <Figure side="back" markers={markers} onAdd={add} onRemove={remove} />
      </div>
      <p className="mt-1.5 text-xs text-muted">Tap the body to add a pin. Tap a pin to remove it.</p>

      {markers.length > 0 && (
        <ul className="mt-3 space-y-2">
          {markers.map((m) => (
            <li key={m.id} className="flex items-center gap-2.5">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{m.id}</span>
              <span className="w-12 shrink-0 text-xs font-semibold uppercase text-muted">{m.side}</span>
              <input
                type="text"
                value={m.note}
                onChange={(e) => setNote(m.id, e.target.value)}
                placeholder="Describe (e.g., Stage 2 ulcer, bruise, wound)"
                className="flex-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-primary-dark hover:bg-surface"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Saved with the form (read by readForm) */}
      <input type="hidden" name={name} value={markers.length ? JSON.stringify(markers) : ""} readOnly />
    </div>
  );
}
