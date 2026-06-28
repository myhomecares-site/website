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

  // Email notification straight to the business — no third party involved.
  await notify(record).catch((err) => console.error("Email notify failed:", err));

  return NextResponse.json({ ok: true });
}

type LeadRecord = {
  name: string;
  phone: string;
  email: string;
  message: string;
  best_time: string | null;
  position: string | null;
  source: string;
  type: string;
  created_at: string;
};

async function notify(r: LeadRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // notifications disabled until configured

  const to = (process.env.NOTIFY_TO || "info@myhomecares.com").split(",").map((s) => s.trim());
  const from = process.env.NOTIFY_FROM || "My Home Cares Website <onboarding@resend.dev>";
  const isApplication = r.type === "application";
  const label = isApplication ? "New job application" : "New inquiry";
  const subject = `${label} from ${r.name} — myhomecares.com`;

  const fields: [string, string][] = [
    ["Name", r.name],
    ["Phone", r.phone],
    ["Email", r.email],
    ...(r.position ? ([["Position", r.position]] as [string, string][]) : []),
    ...(r.best_time ? ([["Best time to call", r.best_time]] as [string, string][]) : []),
    ["Message", r.message || "—"],
    ["Page / source", r.source],
  ];

  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee">${k}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${String(v).replace(/</g, "&lt;")}</td></tr>`
    )
    .join("");

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2 style="color:#009ee6">${label}</h2>
    <p style="color:#5b6168">Submitted through myhomecares.com.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>
    <p style="color:#99a0aa;font-size:12px;margin-top:16px">Reply directly to this email to reach the person${r.email ? ` (${r.email})` : ""}.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, reply_to: r.email || undefined }),
  });
  if (!res.ok) console.error("Resend send failed:", res.status, await res.text());
}
