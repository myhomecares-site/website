import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

/*
  Secure, server-backed storage for the interactive care forms.
  - A person signs in with their telephone number + a personal PIN.
  - PINs are stored only as a salted PBKDF2 hash (never in plain text).
  - Auth returns a short-lived signed token; save/list/delete use the token.
  - Entries (PHI) are stored in Supabase with RLS on (service-role only here).
*/

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const SECRET = process.env.FORM_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-secret-change-me";
const TOKEN_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

function normPhone(p: string) {
  return String(p || "").replace(/\D/g, "").slice(-10);
}
function hashPin(pin: string, salt: string) {
  return crypto.pbkdf2Sync(pin, salt, 100000, 32, "sha256").toString("hex");
}
function makeToken(phone: string) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${phone}.${exp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}
function verifyToken(token: string): string | null {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [phone, exp, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${phone}.${exp}`).digest("hex");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Date.now()) return null;
  return phone;
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
  if (!SUPA_URL || !SUPA_KEY) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const action = String(body.action || "");

  // ---- auth (sign in or first-time set-up) ----
  if (action === "auth") {
    const phone = normPhone(String(body.phone || ""));
    const pin = String(body.pin || "").trim();
    if (phone.length !== 10) return NextResponse.json({ error: "Enter a valid 10-digit telephone number." }, { status: 422 });
    if (!/^\d{4,6}$/.test(pin)) return NextResponse.json({ error: "PIN must be 4 to 6 digits." }, { status: 422 });

    const r = await supa(`mhc_form_users?phone=eq.${phone}&select=phone,pin_salt,pin_hash`);
    const rows = r.ok ? ((await r.json()) as { pin_salt: string; pin_hash: string }[]) : [];
    if (rows.length === 0) {
      // First time: create the account with this PIN.
      const salt = crypto.randomBytes(16).toString("hex");
      const pin_hash = hashPin(pin, salt);
      const ins = await supa(`mhc_form_users`, {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ phone, pin_salt: salt, pin_hash }),
      });
      if (!ins.ok) {
        console.error("user create failed", ins.status, await ins.text());
        return NextResponse.json({ error: "Could not set up your account. Please try again." }, { status: 502 });
      }
      return NextResponse.json({ ok: true, token: makeToken(phone), created: true });
    }
    // Existing: verify PIN.
    const u = rows[0];
    const check = hashPin(pin, u.pin_salt);
    if (check.length !== u.pin_hash.length || !crypto.timingSafeEqual(Buffer.from(check), Buffer.from(u.pin_hash))) {
      return NextResponse.json({ error: "That PIN doesn't match this telephone number." }, { status: 401 });
    }
    await supa(`mhc_form_users?phone=eq.${phone}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_seen: new Date().toISOString() }) }).catch(() => {});
    return NextResponse.json({ ok: true, token: makeToken(phone) });
  }

  // All other actions require a valid token.
  const phone = verifyToken(String(body.token || ""));
  if (!phone) return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  const slug = String(body.form_slug || "").slice(0, 80);

  if (action === "list") {
    const r = await supa(`mhc_form_entries?phone=eq.${phone}&form_slug=eq.${encodeURIComponent(slug)}&select=entry_key,values,client_name,form_date,saved_at&order=saved_at.desc`);
    if (!r.ok) return NextResponse.json({ error: "Could not load entries." }, { status: 502 });
    const rows = (await r.json()) as { entry_key: string; values: unknown; saved_at: string }[];
    return NextResponse.json({ ok: true, entries: rows.map((x) => ({ id: x.entry_key, values: x.values, savedAt: x.saved_at })) });
  }

  if (action === "save") {
    const entry_key = String(body.entry_key || "").slice(0, 60) || "e" + Date.now();
    const values = body.values && typeof body.values === "object" ? body.values : {};
    const record = {
      phone,
      form_slug: slug,
      entry_key,
      values,
      client_name: String(body.client_name || "").slice(0, 120),
      form_date: String(body.form_date || "").slice(0, 40),
      saved_at: new Date().toISOString(),
    };
    const r = await supa(`mhc_form_entries?on_conflict=phone,form_slug,entry_key`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(record),
    });
    if (!r.ok) {
      console.error("entry save failed", r.status, await r.text());
      return NextResponse.json({ error: "Could not save. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, id: entry_key });
  }

  if (action === "delete") {
    const entry_key = String(body.entry_key || "");
    const r = await supa(`mhc_form_entries?phone=eq.${phone}&form_slug=eq.${encodeURIComponent(slug)}&entry_key=eq.${encodeURIComponent(entry_key)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    if (!r.ok) return NextResponse.json({ error: "Could not delete." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
