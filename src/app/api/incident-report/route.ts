import { NextResponse } from "next/server";
import { sendMail, brandedEmail } from "@/lib/mail";
import { INCIDENT_SECTIONS } from "@/lib/incident-report";

export const runtime = "nodejs";

type Payload = Record<string, string | string[] | undefined>;

const asStr = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(", ") : String(v || "")).trim();
const asArr = (v: string | string[] | undefined) => (Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const preparerName = asStr(body.preparer_name);
  const preparerEmail = asStr(body.preparer_email);
  const clientName = asStr(body.client_name);
  const b1 = asStr(body.b1_what_happened);
  if (!preparerName || !preparerEmail || !clientName || !b1) {
    return NextResponse.json({ error: "Please add your name, your email, the client name, and what happened." }, { status: 422 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(preparerEmail)) {
    return NextResponse.json({ error: "Please enter a valid email so you receive a copy." }, { status: 422 });
  }

  // Normalize every known field into a flat data object.
  const data: Record<string, string | string[]> = {};
  for (const s of INCIDENT_SECTIONS) {
    for (const f of s.fields) {
      data[f.name] = f.kind === "checks" ? asArr(body[f.name]) : asStr(body[f.name]);
    }
  }

  const record = {
    report_date: asStr(body.report_date) || null,
    preparer_name: preparerName,
    preparer_email: preparerEmail,
    client_name: clientName,
    caregiver_name: asStr(body.caregiver_name),
    severity: asStr(body.severity),
    incident_types: asArr(body.incident_types),
    status: asStr(body.status),
    data,
    created_at: new Date().toISOString(),
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/mhc_incident_reports`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(record),
      });
      if (!res.ok) console.error("Incident report insert failed:", res.status, await res.text());
    } catch (err) {
      console.error("Incident report store error:", err);
    }
  } else {
    console.log("[incident-report] (no datastore configured):", JSON.stringify(record));
  }

  await email(body, preparerName, preparerEmail, clientName).catch((err) => console.error("Incident report email failed:", err));

  return NextResponse.json({ ok: true });
}

async function email(body: Payload, preparerName: string, preparerEmail: string, clientName: string) {
  const esc = (s: string) => s.replace(/</g, "&lt;").replace(/\n/g, "<br/>");
  const sections = INCIDENT_SECTIONS.map((s) => {
    const rows = s.fields
      .map((f) => {
        const v = f.kind === "checks" ? asArr(body[f.name]).join(", ") : asStr(body[f.name]);
        if (!v) return "";
        return `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${f.label}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${esc(v)}</td></tr>`;
      })
      .join("");
    if (!rows) return "";
    return `<h3 style="margin:18px 0 6px;color:#0b3b60;font-size:15px">${s.title}</h3><table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>`;
  }).join("");

  const html = brandedEmail(
    "Incident report filed",
    `<p style="color:#5b6168;margin:0 0 6px">A new incident report was submitted through myhomecares.com.</p>
     <p style="color:#99a0aa;font-size:12px;margin:0 0 12px">Confidential · client record. Filed by ${esc(preparerName)} regarding ${esc(clientName)}.</p>
     ${sections}
     <p style="color:#99a0aa;font-size:12px;margin-top:16px">This form records what was said to the agency. Items under “Alleged” stay unverified until proven; completing this form is not a finding of fact.</p>`
  );

  // Send to the agency and to the preparer (deduped).
  const agency = (process.env.NOTIFY_TO || "info@myhomecares.com").split(",").map((s) => s.trim());
  const recipients = Array.from(new Set([...agency, preparerEmail].map((e) => e.toLowerCase())));

  await sendMail({
    to: recipients,
    subject: `Incident report — ${clientName} (filed by ${preparerName})`,
    html,
    replyTo: preparerEmail,
  });
}
