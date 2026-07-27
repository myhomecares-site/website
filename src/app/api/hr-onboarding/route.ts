import { NextResponse } from "next/server";
import { verifyHrToken, HR_COOKIE } from "@/lib/hr-auth";

export const runtime = "nodejs";

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const TABLE = "mhc_hr_onboarding";

function getCookie(req: Request, name: string): string {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

async function supa(path: string, init?: RequestInit) {
  return fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPA_KEY as string,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function clean(v: unknown, max = 200): string {
  return String(v ?? "").slice(0, max);
}
function dateOrNull(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

export async function POST(req: Request) {
  if (!verifyHrToken(getCookie(req, HR_COOKIE))) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!SUPA_URL || !SUPA_KEY) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const action = String(body.action || "");

  if (action === "list") {
    const r = await supa(`${TABLE}?select=*&order=updated_at.desc&limit=1000`);
    if (!r.ok) return NextResponse.json({ error: "Could not load records." }, { status: 502 });
    return NextResponse.json({ ok: true, records: await r.json() });
  }

  if (action === "save") {
    const rec = (body.record || {}) as Record<string, unknown>;
    const items = (rec.items && typeof rec.items === "object") ? rec.items : {};
    const row = {
      name: clean(rec.name),
      position: clean(rec.position),
      date_applied: dateOrNull(rec.date_applied),
      start_date: dateOrNull(rec.start_date),
      onboarding_lead: clean(rec.onboarding_lead),
      items,
      notes: clean(rec.notes, 4000),
      updated_at: new Date().toISOString(),
    };
    const id = clean(rec.id, 40);
    let r: Response;
    if (id) {
      r = await supa(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
    } else {
      r = await supa(TABLE, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
    }
    if (!r.ok) return NextResponse.json({ error: "Could not save." }, { status: 502 });
    const data = await r.json();
    return NextResponse.json({ ok: true, record: Array.isArray(data) ? data[0] : data });
  }

  if (action === "delete") {
    const id = clean(body.id, 40);
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    const r = await supa(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    if (!r.ok) return NextResponse.json({ error: "Could not delete." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
