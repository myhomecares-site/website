import { NextResponse } from "next/server";
import { sendMail, brandedEmail } from "@/lib/mail";

export const runtime = "nodejs";

type Payload = {
  requester_name?: string;
  requester_role?: string;
  organization?: string;
  phone?: string;
  email?: string;
  preferred_contact?: string;
  client_name?: string;
  client_dob?: string;
  relationship?: string;
  documents?: string[];
  reason?: string;
  delivery_method?: string;
  notes?: string;
  authorized?: boolean;
  company?: string; // honeypot
};

const esc = (s: string) => String(s || "").replace(/</g, "&lt;");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const requester_name = (body.requester_name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const client_name = (body.client_name || "").trim();
  const documents = Array.isArray(body.documents) ? body.documents.filter((d) => typeof d === "string") : [];

  if (!requester_name || (!phone && !email) || !client_name || documents.length === 0 || !body.authorized) {
    return NextResponse.json(
      { error: "Please provide your name, contact info, the client name, at least one document, and confirm your authorization." },
      { status: 422 }
    );
  }

  const record = {
    requester_name,
    requester_role: (body.requester_role || "").trim(),
    organization: (body.organization || "").trim(),
    phone,
    email,
    preferred_contact: (body.preferred_contact || "").trim(),
    client_name,
    client_dob: (body.client_dob || "").trim(),
    relationship: (body.relationship || "").trim(),
    documents,
    reason: (body.reason || "").trim(),
    delivery_method: (body.delivery_method || "").trim(),
    notes: (body.notes || "").trim(),
    authorized: !!body.authorized,
    source: "document-request",
    status: "new",
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/mhc_document_requests`, {
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
        console.error("Doc request insert failed:", res.status, await res.text());
        return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 502 });
      }
    } catch (err) {
      console.error("Doc request error:", err);
      return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 502 });
    }
  } else {
    console.log("[doc-request] (no datastore configured):", JSON.stringify(record));
  }

  await notify(record).catch((e) => console.error("Doc request notify failed:", e));
  await ack(record).catch((e) => console.error("Doc request ack failed:", e));

  return NextResponse.json({ ok: true });
}

type Rec = {
  requester_name: string; requester_role: string; organization: string; phone: string; email: string;
  preferred_contact: string; client_name: string; client_dob: string; relationship: string;
  documents: string[]; reason: string; delivery_method: string; notes: string; authorized: boolean;
};

async function notify(r: Rec) {
  const to = (process.env.NOTIFY_TO || "info@myhomecares.com").split(",").map((s) => s.trim());
  const rows: [string, string][] = [
    ["Requester", r.requester_name],
    ["Role / title", r.requester_role],
    ["Organization", r.organization],
    ["Phone", r.phone],
    ["Email", r.email],
    ["Preferred contact", r.preferred_contact],
    ["Client name", r.client_name],
    ["Client DOB", r.client_dob],
    ["Relationship / authorization", r.relationship],
    ["Documents requested", r.documents.join(", ")],
    ["Reason", r.reason],
    ["Delivery method", r.delivery_method],
    ["Notes", r.notes || "—"],
    ["Authorization confirmed", r.authorized ? "Yes" : "No"],
  ].filter(([, v]) => v) as [string, string][];

  const html = brandedEmail(
    "New document / assessment request",
    `<p style="color:#b3261e;font-weight:bold;margin:0 0 12px">Verify the requester's identity and authorization before releasing any records.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join("")}
    </table>
    <p style="color:#99a0aa;font-size:12px;margin-top:14px">Submitted through the document request page on myhomecares.com.</p>`
  );
  await sendMail({ to, subject: `Document request from ${r.requester_name} (client: ${r.client_name})`, html, replyTo: r.email || undefined });
}

async function ack(r: Rec) {
  if (!r.email) return;
  const name = esc(r.requester_name) || "there";
  const html = brandedEmail(
    `Thank you, ${name}!`,
    `<p style="color:#5b6168;line-height:1.6;margin:0 0 12px">We received your request for ${r.client_name ? `records for <strong>${esc(r.client_name)}</strong>` : "records"}. To protect our clients' privacy, our team will verify your identity and authorization before releasing anything, then contact you to arrange secure delivery.</p>
    <p style="color:#5b6168;line-height:1.6;margin:0">For anything urgent, call us at (410) 231-3076.<br/>Warmly,<br/>The My Home Cares Team</p>`
  );
  await sendMail({ to: [r.email], subject: "We received your document request, My Home Cares", html });
}
