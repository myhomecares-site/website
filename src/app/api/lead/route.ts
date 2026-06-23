import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  best_time?: string;
  position?: string;
  source?: string;
  type?: string;
  company?: string; // honeypot
};

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot — silently accept bots without storing.
  if (body.company) return NextResponse.json({ ok: true });

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();

  if (!name || (!phone && !email)) {
    return NextResponse.json({ error: "Please provide your name and a way to reach you." }, { status: 422 });
  }

  const record = {
    name,
    phone,
    email,
    message: (body.message || "").trim(),
    best_time: body.best_time || null,
    position: body.position || null,
    source: body.source || "website",
    type: body.type || "lead",
    created_at: new Date().toISOString(),
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/mhc_leads`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Supabase insert failed:", res.status, detail);
        return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 502 });
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 502 });
    }
  } else {
    // Supabase not configured yet — log so nothing is lost during setup.
    console.log("[lead] (no datastore configured):", JSON.stringify(record));
  }

  return NextResponse.json({ ok: true });
}
