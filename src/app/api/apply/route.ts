import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

type ApplyPayload = {
  name?: string;
  phone?: string;
  email?: string;
  position?: string;
  employment_type?: string;
  availability_days?: string[];
  availability_shifts?: string[];
  start_date?: string;
  experience?: string;
  message?: string;
  source?: string;
  company?: string; // honeypot
};

export async function POST(req: Request) {
  let body: ApplyPayload;
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

  const app = {
    name,
    phone,
    email,
    position: (body.position || "").trim(),
    employment_type: (body.employment_type || "").trim(),
    availability_days: Array.isArray(body.availability_days) ? body.availability_days : [],
    availability_shifts: Array.isArray(body.availability_shifts) ? body.availability_shifts : [],
    start_date: (body.start_date || "").trim(),
    experience: (body.experience || "").trim(),
    message: (body.message || "").trim(),
    source: body.source || "careers",
    created_at: new Date().toISOString(),
  };

  // 1) Store in Supabase
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/mhc_applications`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(app),
      });
      if (!res.ok) console.error("Supabase application insert failed:", res.status, await res.text());
    } catch (err) {
      console.error("Application store error:", err);
    }
  } else {
    console.log("[application] (no datastore configured):", JSON.stringify(app));
  }

  // 2) Generate PDF + 3) email it — best effort, never blocks the applicant's success.
  try {
    const pdfBase64 = await buildPdf(app);
    await emailApplication(app, pdfBase64);
  } catch (err) {
    console.error("Application PDF/email failed:", err);
  }

  return NextResponse.json({ ok: true });
}

type App = {
  name: string;
  phone: string;
  email: string;
  position: string;
  employment_type: string;
  availability_days: string[];
  availability_shifts: string[];
  start_date: string;
  experience: string;
  message: string;
  source: string;
  created_at: string;
};

async function buildPdf(a: App): Promise<string> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(0, 0.62, 0.9);
  const ink = rgb(0.11, 0.11, 0.12);
  const grey = rgb(0.36, 0.38, 0.42);

  const margin = 56;
  let y = 740;

  page.drawText("My Home Cares", { x: margin, y, size: 20, font: bold, color: blue });
  y -= 22;
  page.drawText("Job Application", { x: margin, y, size: 13, font: bold, color: ink });
  y -= 14;
  page.drawText(`Submitted ${new Date(a.created_at).toLocaleString("en-US")}`, { x: margin, y, size: 9, font, color: grey });
  y -= 10;
  page.drawLine({ start: { x: margin, y }, end: { x: 556, y }, thickness: 1, color: rgb(0.9, 0.91, 0.93) });
  y -= 26;

  const wrap = (text: string, max: number, size: number, f = font): string[] => {
    const out: string[] = [];
    for (const para of (text || "—").split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const test = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(test, size) > max) {
          if (line) out.push(line);
          line = word;
        } else line = test;
      }
      out.push(line);
    }
    return out;
  };

  const field = (label: string, value: string) => {
    page.drawText(label.toUpperCase(), { x: margin, y, size: 8, font: bold, color: grey });
    y -= 13;
    for (const line of wrap(value || "—", 500, 11)) {
      page.drawText(line, { x: margin, y, size: 11, font, color: ink });
      y -= 15;
    }
    y -= 8;
  };

  field("Position applied for", a.position || "Not specified");
  field("Name", a.name);
  field("Phone", a.phone);
  field("Email", a.email);
  field("Employment type", a.employment_type || "—");
  field("Earliest start date", a.start_date || "—");
  field("Availability — days", a.availability_days.length ? a.availability_days.join(", ") : "—");
  field("Availability — shifts", a.availability_shifts.length ? a.availability_shifts.join(", ") : "—");
  field("Relevant experience", a.experience || "—");
  field("Message", a.message || "—");

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

async function emailApplication(a: App, pdfBase64: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = (process.env.APPLY_NOTIFY_TO || "info@myhomecares.com,lulu@myhomecares.com")
    .split(",")
    .map((s) => s.trim());
  const from = process.env.NOTIFY_FROM || "My Home Cares Careers <notifications@homelycare.io>";
  const subject = `New job application — ${a.name}${a.position ? ` (${a.position})` : ""}`;
  const safe = (s: string) => String(s || "—").replace(/</g, "&lt;");

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2 style="color:#009ee6">New job application</h2>
    <p style="color:#5b6168">A candidate applied through myhomecares.com. The full application is attached as a PDF.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${[
        ["Position", a.position || "—"],
        ["Name", a.name],
        ["Phone", a.phone],
        ["Email", a.email],
        ["Employment type", a.employment_type || "—"],
        ["Start date", a.start_date || "—"],
        ["Days", a.availability_days.join(", ") || "—"],
        ["Shifts", a.availability_shifts.join(", ") || "—"],
      ]
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee">${k}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${safe(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="color:#99a0aa;font-size:12px;margin-top:16px">Reply to this email to reach the candidate${a.email ? ` (${a.email})` : ""}.</p>
  </div>`;

  const fileName = `Application-${a.name.replace(/[^a-z0-9]+/gi, "-")}.pdf`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: a.email || undefined,
      attachments: [{ filename: fileName, content: pdfBase64 }],
    }),
  });
  if (!res.ok) console.error("Resend application email failed:", res.status, await res.text());
}
