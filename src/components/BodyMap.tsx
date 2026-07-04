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

// A simple, recognizable human silhouette (viewBox 0 0 100 200).
function Silhouette() {
  return (
    <g fill="#dfeaf1" stroke="#8098a8" strokeWidth="1.3" strokeLinejoin="round">
      <circle cx="50" cy="15" r="11" />
      <rect x="46" y="24" width="8" height="7" />
      {/* torso */}
      <path d="M33 33 Q50 27 67 33 L63 92 Q50 97 37 92 Z" />
      {/* arms */}
      <path d="M34 34 L23 40 L18 96 L26 97 L33 46 Z" />
      <path d="M66 34 L77 40 L82 96 L74 97 L67 46 Z" />
      {/* legs */}
      <path d="M39 90 L37 140 L35 192 L46 192 L48 140 L49 96 Z" />
      <path d="M61 90 L63 140 L65 192 L54 192 L52 140 L51 96 Z" />
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
        className="mx-auto block h-auto w-full max-w-[9rem] cursor-crosshair rounded-lg border border-border bg-white"
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
