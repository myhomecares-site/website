import { NextResponse } from "next/server";
import { sendMail, brandedEmail } from "@/lib/mail";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  best_time?: string;
  source?: string;
  company?: string; // honeypot
  // RSA client-intake details
  relationship?: string;
  city?: string;
  care_needed?: string[];
  timeframe?: string;
  schedule?: string;
  payment?: string;
};

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  if (!name || (!phone && !email)) {
    return NextResponse.json({ error: "Please provide your name and a way to reach you." }, { status: 422 });
  }

  const details = {
    relationship: (body.relationship || "").trim(),
    city: (body.city || "").trim(),
    care_needed: Array.isArray(body.care_needed) ? body.care_needed : [],
    timeframe: (body.timeframe || "").trim(),
    schedule: (body.schedule || "").trim(),
    payment: (body.payment || "").trim(),
  };

  const record = {
    name,
    phone,
    email,
    message: (body.message || "").trim(),
    best_time: body.best_time || null,
    source: body.source || "website",
    type: "lead",
    details,
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
    console.log("[lead] (no datastore configured):", JSON.stringify(record));
  }

  await notify(record).catch((err) => console.error("Email notify failed:", err));
  await autoReply(record).catch((err) => console.error("Auto-reply failed:", err));

  return NextResponse.json({ ok: true });
}

// Friendly confirmation sent automatically to the person who reached out.
async function autoReply(r: { name: string; email: string }) {
  if (!r.email) return;
  const name = String(r.name || "").replace(/</g, "&lt;") || "there";
  const html = brandedEmail(
    `Thank you, ${name}!`,
    `<p style="color:#5b6168;line-height:1.6;margin:0 0 12px">We've received your request and a member of our care team will reach out shortly to discuss how we can help you and your loved one. For anything urgent, call us at (410) 231-3076.</p>
    <p style="color:#5b6168;line-height:1.6;margin:0">Warmly,<br/>The My Home Cares Team</p>`
  );
  await sendMail({ to: [r.email], subject: "We received your request — My Home Cares", html });
}

type LeadRecord = {
  name: string;
  phone: string;
  email: string;
  message: string;
  best_time: string | null;
  source: string;
  type: string;
  details: {
    relationship: string;
    city: string;
    care_needed: string[];
    timeframe: string;
    schedule: string;
    payment: string;
  };
  created_at: string;
};

async function notify(r: LeadRecord) {
  const to = (process.env.NOTIFY_TO || "info@myhomecares.com").split(",").map((s) => s.trim());
  const subject = `New consultation request from ${r.name} — myhomecares.com`;
  const d = r.details;

  const fields: [string, string][] = [
    ["Name", r.name],
    ["Phone", r.phone],
    ["Email", r.email],
    ...(d.relationship ? ([["Who needs care", d.relationship]] as [string, string][]) : []),
    ...(d.city ? ([["City", d.city]] as [string, string][]) : []),
    ...(d.care_needed.length ? ([["Care needed", d.care_needed.join(", ")]] as [string, string][]) : []),
    ...(d.timeframe ? ([["Timeframe", d.timeframe]] as [string, string][]) : []),
    ...(d.schedule ? ([["Schedule", d.schedule]] as [string, string][]) : []),
    ...(d.payment ? ([["Payment method", d.payment]] as [string, string][]) : []),
    ...(r.best_time ? ([["Best time to call", r.best_time]] as [string, string][]) : []),
    ["Message", r.message || "—"],
    ["Page / source", r.source],
  ];

  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${String(v).replace(/</g, "&lt;")}</td></tr>`
    )
    .join("");

  const html = brandedEmail(
    "New consultation request",
    `<p style="color:#5b6168;margin:0 0 14px">Submitted through myhomecares.com.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>
    <p style="color:#99a0aa;font-size:12px;margin-top:16px">Reply directly to this email to reach the person${r.email ? ` (${r.email})` : ""}.</p>`
  );

  await sendMail({ to, subject, html, replyTo: r.email || undefined });
}
