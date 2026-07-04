"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/*
  Easy participant signature. Three ways to sign, whichever suits the person:
  - Draw:  finger / mouse signature pad (best on a tablet or phone)
  - Type:  type the name, it renders in cursive as the signature
  - Unable to sign: the RN records verbal consent (or the reason) + witness
  Saves as JSON in a hidden input so it stores and prints with the form.
*/

type Mode = "draw" | "type" | "unable";
type Sig = { mode: Mode; drawing?: string; name?: string; agreed?: boolean; reason?: string; note?: string; witness?: string; date?: string };

function parse(s: string): Sig {
  try { const v = JSON.parse(s); return v && typeof v === "object" ? v : { mode: "draw" }; }
  catch { return { mode: "draw" }; }
}

const cursive = { fontFamily: '"Snell Roundhand", "Brush Script MT", "Segoe Script", "Bradley Hand", cursive' };

export function SignaturePad({ name, initial, role }: { name: string; initial: string; role: string }) {
  const init = parse(initial);
  const [mode, setMode] = useState<Mode>(init.mode || "draw");
  const [typed, setTyped] = useState(init.name || "");
  const [agreed, setAgreed] = useState(!!init.agreed);
  const [reason, setReason] = useState(init.reason || "Verbal consent given");
  const [note, setNote] = useState(init.note || "");
  const [witness, setWitness] = useState(init.witness || "");
  const [date, setDate] = useState(init.date || "");
  const [drawing, setDrawing] = useState(init.drawing || "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  // Restore a saved drawing onto the canvas when the draw tab shows.
  useEffect(() => {
    if (mode !== "draw") return;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (drawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = drawing;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const pos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };
  const start = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.strokeStyle = "#1d1d1f";
  };
  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y); ctx.stroke();
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setDrawing(canvasRef.current!.toDataURL("image/png"));
  };
  const clear = () => {
    const c = canvasRef.current;
    if (c) c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setDrawing("");
  };

  const sig: Sig =
    mode === "draw" ? { mode, drawing, date }
    : mode === "type" ? { mode, name: typed, agreed, date }
    : { mode, reason, note, witness, date };
  const hasContent =
    (mode === "draw" && !!drawing) ||
    (mode === "type" && !!typed) ||
    (mode === "unable" && !!(reason || note || witness));
  const serialized = hasContent ? JSON.stringify(sig) : "";

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${mode === m ? "bg-primary text-white" : "border border-border bg-white text-ink-soft hover:bg-surface"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-sm font-bold text-ink">{role}</p>
      <div className="no-print mb-3 flex flex-wrap gap-2">
        {tab("draw", "Draw")}
        {tab("type", "Type")}
        {tab("unable", "Unable to sign")}
      </div>

      {mode === "draw" && (
        <div>
          <canvas
            ref={canvasRef}
            width={480}
            height={150}
            style={{ touchAction: "none" }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="h-[150px] w-full cursor-crosshair rounded-lg border border-border bg-white"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-muted">Sign above with a finger or mouse.</span>
            <button type="button" onClick={clear} className="no-print rounded-lg border border-border px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-white">Clear</button>
          </div>
        </div>
      )}

      {mode === "type" && (
        <div>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type full name"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-2 flex min-h-[52px] items-center rounded-lg border border-border bg-white px-4">
            <span style={cursive} className="text-3xl text-ink">{typed || " "}</span>
          </div>
          <label className="mt-2 flex items-start gap-2.5 text-sm text-ink-soft">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
            I reviewed this assessment and agree it is accurate.
          </label>
        </div>
      )}

      {mode === "unable" && (
        <div className="space-y-2.5">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Reason</span>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none">
              <option>Verbal consent given</option>
              <option>Physically unable to sign</option>
              <option>Declined to sign</option>
              <option>Other</option>
            </select>
          </label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes (optional)" className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <input type="text" value={witness} onChange={(e) => setWitness(e.target.value)} placeholder="Witness / RN name" className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Date</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none" />
      </div>

      <input type="hidden" name={name} value={serialized} readOnly />
    </div>
  );
}
