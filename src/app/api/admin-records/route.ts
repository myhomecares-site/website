import { NextResponse } from "next/server";
import { verifyStaffToken, STAFF_COOKIE } from "@/lib/staff-auth";

export const runtime = "nodejs";

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

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

export async function POST(req: Request) {
  if (!verifyStaffToken(getCookie(req, STAFF_COOKIE))) {
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
    const slug = String(body.form_slug || "");
    let q = `mhc_form_entries?select=entry_key,phone,form_slug,client_name,form_date,saved_at,values&order=saved_at.desc&limit=1000`;
    if (slug) q += `&form_slug=eq.${encodeURIComponent(slug)}`;
    const r = await supa(q);
    if (!r.ok) return NextResponse.json({ error: "Could not load records." }, { status: 502 });
    return NextResponse.json({ ok: true, entries: await r.json() });
  }

  if (action === "delete") {
    const phone = String(body.phone || "");
    const slug = String(body.form_slug || "");
    const entry_key = String(body.entry_key || "");
    const r = await supa(
      `mhc_form_entries?phone=eq.${encodeURIComponent(phone)}&form_slug=eq.${encodeURIComponent(slug)}&entry_key=eq.${encodeURIComponent(entry_key)}`,
      { method: "DELETE", headers: { Prefer: "return=minimal" } }
    );
    if (!r.ok) return NextResponse.json({ error: "Could not delete." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
