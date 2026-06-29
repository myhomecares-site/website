import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";

export const runtime = "nodejs";

type Attachment = { filename: string; content: string };

type Details = {
  city: string;
  zip: string;
  transportation: string;
  certs_held: string[];
  license_number: string;
  languages: string;
  over_18: string;
  work_authorized: string;
  background_check: string;
  tb_screening: string;
  reference_name: string;
  reference_relationship: string;
  reference_phone: string;
  heard_about: string;
};

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
  documents: string;
  details: Details;
  created_at: string;
};

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (fd.get("company")) return NextResponse.json({ ok: true }); // honeypot

  const str = (k: string) => ((fd.get(k) as string) || "").trim();
  const name = str("name");
  const phone = str("phone");
  const email = str("email");
  if (!name || (!phone && !email)) {
    return NextResponse.json({ error: "Please provide your name and a way to reach you." }, { status: 422 });
  }

  // Attachments
  const attachments: Attachment[] = [];
  const docNames: string[] = [];
  const cleanBase = name.replace(/[^a-z0-9 .-]/gi, "").trim() || "Applicant";
  const addFile = async (file: File, prefix: string) => {
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const filename = `${prefix} - ${cleanBase}.${ext}`;
    attachments.push({ filename, content: buf.toString("base64") });
    docNames.push(filename);
  };
  const resume = fd.get("resume");
  if (resume instanceof File && resume.size > 0) await addFile(resume, "Resume");
  let ci = 1;
  for (const c of fd.getAll("certifications")) {
    if (c instanceof File && c.size > 0) await addFile(c, `Certification ${ci++}`);
  }

  const app: App = {
    name,
    phone,
    email,
    position: str("position"),
    employment_type: str("employment_type"),
    availability_days: fd.getAll("days").map(String),
    availability_shifts: fd.getAll("shifts").map(String),
    start_date: str("start_date"),
    experience: str("experience"),
    message: str("message"),
    source: str("source") || "careers",
    documents: docNames.join(", "),
    details: {
      city: str("city"),
      zip: str("zip"),
      transportation: str("transportation"),
      certs_held: fd.getAll("certs_held").map(String),
      license_number: str("license_number"),
      languages: str("languages"),
      over_18: str("over_18"),
      work_authorized: str("work_authorized"),
      background_check: str("background_check"),
      tb_screening: str("tb_screening"),
      reference_name: str("reference_name"),
      reference_relationship: str("reference_relationship"),
      reference_phone: str("reference_phone"),
      heard_about: str("heard_about"),
    },
    created_at: new Date().toISOString(),
  };

  // Store
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

  // PDF + email
  try {
    const pdfBase64 = await buildPdf(app);
    const all: Attachment[] = [{ filename: `Application - ${cleanBase}.pdf`, content: pdfBase64 }, ...attachments];
    await emailApplication(app, all);
  } catch (err) {
    console.error("Application PDF/email failed:", err);
  }

  await applicantReply(app).catch((err) => console.error("Applicant auto-reply failed:", err));

  return NextResponse.json({ ok: true });
}

// Friendly confirmation sent automatically to the applicant.
async function applicantReply(a: App) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !a.email) return;
  const from = process.env.NOTIFY_FROM || "My Home Cares Careers <notifications@homelycare.io>";
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1d1d1f">
    <h2 style="color:#009ee6">Thanks for applying, ${a.name.replace(/</g, "&lt;")}!</h2>
    <p style="color:#5b6168;line-height:1.6">We've received your application${a.position ? ` for <strong>${a.position.replace(/</g, "&lt;")}</strong>` : ""} and our team will review it and be in touch soon. We're excited that you're considering a career with My Home Cares.</p>
    <p style="color:#5b6168;line-height:1.6">If you have questions in the meantime, just reply to this email or call (410) 231-3076.</p>
    <p style="color:#5b6168;line-height:1.6">Warmly,<br/>The My Home Cares Team<br/>Where Service Matters</p>
  </div>`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [a.email],
      reply_to: "info@myhomecares.com",
      subject: "We received your application — My Home Cares",
      html,
    }),
  }).catch(() => {});
}

async function buildPdf(a: App): Promise<string> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(0, 0.62, 0.9);
  const ink = rgb(0.11, 0.11, 0.12);
  const grey = rgb(0.36, 0.38, 0.42);
  const margin = 56;

  let page: PDFPage = pdf.addPage([612, 792]);
  let y = 740;
  const ensure = () => {
    if (y < 70) {
      page = pdf.addPage([612, 792]);
      y = 740;
    }
  };

  page.drawText("My Home Cares", { x: margin, y, size: 20, font: bold, color: blue });
  y -= 22;
  page.drawText("Caregiver Job Application", { x: margin, y, size: 13, font: bold, color: ink });
  y -= 14;
  page.drawText(`Submitted ${new Date(a.created_at).toLocaleString("en-US")}`, { x: margin, y, size: 9, font, color: grey });
  y -= 10;
  page.drawLine({ start: { x: margin, y }, end: { x: 556, y }, thickness: 1, color: rgb(0.9, 0.91, 0.93) });
  y -= 24;

  const wrap = (text: string, max: number, size: number, f: PDFFont): string[] => {
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

  const heading = (text: string) => {
    ensure();
    y -= 4;
    page.drawText(text.toUpperCase(), { x: margin, y, size: 9, font: bold, color: blue });
    y -= 16;
  };
  const field = (label: string, value: string) => {
    ensure();
    page.drawText(label, { x: margin, y, size: 8, font: bold, color: grey });
    y -= 12;
    for (const line of wrap(value || "—", 500, 10.5, font)) {
      ensure();
      page.drawText(line, { x: margin, y, size: 10.5, font, color: ink });
      y -= 14;
    }
    y -= 6;
  };

  const d = a.details;
  heading("Applicant");
  field("Name", a.name);
  field("Phone", a.phone);
  field("Email", a.email);
  field("City / ZIP", [d.city, d.zip].filter(Boolean).join(", ") || "—");

  heading("Position & availability");
  field("Position applied for", a.position || "Not specified");
  field("Employment type", a.employment_type || "—");
  field("Earliest start date", a.start_date || "—");
  field("Reliable transportation", d.transportation || "—");
  field("Availability — days", a.availability_days.join(", ") || "—");
  field("Availability — shifts", a.availability_shifts.join(", ") || "—");

  heading("Certifications & experience");
  field("Certifications held", d.certs_held.join(", ") || "—");
  field("License / certification number", d.license_number || "—");
  field("Years of experience", a.experience || "—");
  field("Languages spoken", d.languages || "—");

  heading("Maryland RSA eligibility");
  field("18 or older", d.over_18 || "—");
  field("Authorized to work in the U.S.", d.work_authorized || "—");
  field("Willing to complete background check", d.background_check || "—");
  field("Willing to provide TB / health clearance", d.tb_screening || "—");

  heading("Reference");
  field("Reference", [d.reference_name, d.reference_relationship, d.reference_phone].filter(Boolean).join(" · ") || "—");

  heading("Additional");
  field("How they heard about us", d.heard_about || "—");
  field("Documents attached", a.documents || "None");
  field("Message", a.message || "—");

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

async function emailApplication(a: App, attachments: Attachment[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = (process.env.APPLY_NOTIFY_TO || "info@myhomecares.com,lulu@myhomecares.com")
    .split(",")
    .map((s) => s.trim());
  const from = process.env.NOTIFY_FROM || "My Home Cares Careers <notifications@homelycare.io>";
  const subject = `New caregiver application — ${a.name}${a.position ? ` (${a.position})` : ""}`;
  const safe = (s: string) => String(s || "—").replace(/</g, "&lt;");
  const d = a.details;

  const rows: [string, string][] = [
    ["Position", a.position || "—"],
    ["Name", a.name],
    ["Phone", a.phone],
    ["Email", a.email],
    ["City / ZIP", [d.city, d.zip].filter(Boolean).join(", ") || "—"],
    ["Employment type", a.employment_type || "—"],
    ["Start date", a.start_date || "—"],
    ["Transportation", d.transportation || "—"],
    ["Days", a.availability_days.join(", ") || "—"],
    ["Shifts", a.availability_shifts.join(", ") || "—"],
    ["Certifications", d.certs_held.join(", ") || "—"],
    ["License #", d.license_number || "—"],
    ["Experience", a.experience || "—"],
    ["18+ / Work auth", `${d.over_18 || "—"} / ${d.work_authorized || "—"}`],
    ["Background check / TB", `${d.background_check || "—"} / ${d.tb_screening || "—"}`],
    ["Reference", [d.reference_name, d.reference_phone].filter(Boolean).join(" · ") || "—"],
    ["Documents", a.documents || "None attached"],
  ];

  const html = `<div style="font-family:Arial,sans-serif;max-width:580px;margin:auto">
    <h2 style="color:#009ee6">New caregiver application</h2>
    <p style="color:#5b6168">Submitted through myhomecares.com. The full application PDF${a.documents ? ", resume/certifications," : ""} are attached.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#1d1d1f;border-bottom:1px solid #eee">${safe(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="color:#99a0aa;font-size:12px;margin-top:16px">Reply to this email to reach the candidate${a.email ? ` (${a.email})` : ""}.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, reply_to: a.email || undefined, attachments }),
  });
  if (!res.ok) console.error("Resend application email failed:", res.status, await res.text());
}
