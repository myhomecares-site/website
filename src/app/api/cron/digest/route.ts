import { NextResponse } from "next/server";
import { sendMail, brandedEmail } from "@/lib/mail";

export const runtime = "nodejs";

// Weekly insights digest, triggered by Vercel Cron (see vercel.json).
// Reads the past week's consultation requests + applications and emails a summary.
export async function GET(req: Request) {
  // Protect the endpoint: Vercel Cron sends this header when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const fetchRows = async (table: string, select: string) => {
    const r = await fetch(`${url}/rest/v1/${table}?select=${select}&created_at=gte.${since}&order=created_at.desc`, { headers });
    if (!r.ok) {
      console.error(`Digest read ${table} failed:`, r.status, await r.text());
      return [] as Record<string, unknown>[];
    }
    return (await r.json()) as Record<string, unknown>[];
  };

  const leads = await fetchRows("mhc_leads", "name,source,details,created_at");
  const apps = await fetchRows("mhc_applications", "name,position,source,details,created_at");

  const tally = (items: string[]) => {
    const m = new Map<string, number>();
    for (const it of items) {
      const v = (it || "").trim();
      if (v) m.set(v, (m.get(v) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const d = (row: Record<string, unknown>) => (row.details || {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

  const leadCities = tally(leads.map((l) => str(d(l).city)));
  const leadServices = tally(leads.flatMap((l) => arr(d(l).care_needed)));
  const leadPayment = tally(leads.map((l) => str(d(l).payment)));
  const leadSource = tally(leads.map((l) => str(l.source)));
  const appPositions = tally(apps.map((a) => str(a.position)));

  const top = (pairs: [string, number][], n = 5) =>
    pairs.length ? pairs.slice(0, n).map(([k, v]) => `${k} (${v})`).join(", ") : "—";

  const html = brandedEmail(
    "Weekly insights",
    `<p style="color:#5b6168;margin:0 0 14px">${new Date(since).toLocaleDateString("en-US")} – ${new Date().toLocaleDateString("en-US")}</p>
    <h3 style="margin:0 0 6px;color:#1d2a39">Consultation requests: ${leads.length}</h3>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">
      ${[
        ["Top counties/cities", top(leadCities)],
        ["Services requested", top(leadServices)],
        ["Payment methods", top(leadPayment)],
        ["Lead sources", top(leadSource)],
      ].map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${v}</td></tr>`).join("")}
    </table>
    <h3 style="margin:18px 0 6px;color:#1d2a39">Job applications: ${apps.length}</h3>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <tr><td style="padding:6px 12px;font-weight:600;color:#33373d;border-bottom:1px solid #eee;white-space:nowrap">By position</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${top(appPositions)}</td></tr>
    </table>
    <p style="color:#99a0aa;font-size:12px;margin-top:16px">All submissions are in your Supabase database. This is an automated weekly summary.</p>`
  );

  const to = (process.env.DIGEST_TO || "info@myhomecares.com").split(",").map((s) => s.trim());
  await sendMail({
    to,
    subject: `Weekly insights, ${leads.length} requests, ${apps.length} applications`,
    html,
  });

  return NextResponse.json({ ok: true, leads: leads.length, applications: apps.length });
}
