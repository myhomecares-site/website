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

// Anatomical human silhouette (viewBox 0 0 100 230), used for front and back.
function Silhouette() {
  return (
    <g fill="#e4eef4" stroke="#728ea1" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M50 5 C43 5 38 10 38 17 C38 22 40 26 44 28 C40 29 37 32 35 37 C33 42 32 47 30 54 L25 82 C24 87 22 92 20 96 C18 100 17 105 18 109 C19 112 22 112 24 109 C26 106 28 101 29 96 L33 72 C34 66 36 61 38 58 C38 64 37 73 38 82 L39 104 C37 116 35 132 34 152 L33 200 C33 206 36 209 41 209 C45 209 47 206 47 201 L49 152 C49 140 50 128 50 120 C50 128 51 140 51 152 L53 201 C53 206 55 209 59 209 C64 209 67 206 67 200 L66 152 C65 132 63 116 61 104 L62 82 C63 73 62 64 62 58 C64 61 66 66 67 72 L71 96 C72 101 74 106 76 109 C78 112 81 112 82 109 C83 105 82 100 80 96 C78 92 76 87 75 82 L70 54 C68 47 67 42 65 37 C63 32 60 29 56 28 C60 26 62 22 62 17 C62 10 57 5 50 5 Z" />
      <ellipse cx="20" cy="112" rx="4.5" ry="6" />
      <ellipse cx="80" cy="112" rx="4.5" ry="6" />
      <path d="M33 205 C31 210 30 215 33 216 L46 216 C47 213 47 209 47 206 Z" />
      <path d="M67 205 C69 210 70 215 67 216 L54 216 C53 213 53 209 53 206 Z" />
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
        viewBox="0 0 100 230"
        className="mx-auto block h-auto w-full max-w-[8.5rem] cursor-crosshair rounded-lg border border-border bg-white"
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
