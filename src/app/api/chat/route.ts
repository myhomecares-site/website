import { NextResponse } from "next/server";
import { site, services, conditions, regions } from "@/lib/site";
import { faqs } from "@/lib/faq";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const counties = regions.flatMap((r) => r.counties);

const KNOWLEDGE = `
ABOUT MY HOME CARES
- Licensed Maryland Residential Service Agency (RSA), regulated by the Office of Health Care Quality (OHCQ). License ${site.license}.
- Caring for Maryland families since ${site.founded}. Phone ${site.phone}. Email ${site.email}.
- Slogan: "Where Service Matters."

SERVICES
${services.map((s) => `- ${s.title}: ${s.short}`).join("\n")}

SPECIALIZED CARE
${conditions.map((c) => `- ${c.name}: ${c.subhead}`).join("\n")}

SERVICE AREA
- All of Maryland, across the Central, Capital, Western, Southern, and Eastern Shore regions, covering these counties: ${counties.join(", ")}.

PAYMENT OPTIONS
- Private pay, long-term care insurance, and Maryland Medicaid home- and community-based waiver programs.

KEY FACTS / FAQ
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}
`.trim();

const SYSTEM = `You are the friendly virtual assistant for My Home Cares, a licensed Maryland home care agency (RSA). You help families and prospective caregivers on the website.

Use ONLY the information below to answer. If you don't know something, say so warmly and invite them to call ${site.phone} or request a free consultation.

${KNOWLEDGE}

RULES:
- Be warm, concise, and reassuring. Keep replies short (2-4 sentences) unless asked for detail.
- You are NOT a medical professional. Do not give medical, clinical, diagnostic, or dosage advice. For health questions, suggest speaking with their doctor or our care team. For emergencies, tell them to call 911.
- Do not quote specific prices. Explain that cost depends on care needs and hours, and list the payment options, then offer a free consultation.
- Gently guide interested visitors toward a free consultation (the "Schedule a Consultation" button or calling ${site.phone}). For job seekers, point them to the Careers page and the online application.
- Never invent services, facts, reviews, or guarantees. Stay on topics related to My Home Cares and home care in Maryland.
- Do not use em dashes. Use commas or periods instead.`;

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  // Sanitize: keep only valid roles/strings, cap history, ensure it starts with a user turn.
  const cleaned: Msg[] = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-12);
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "No message provided" }, { status: 422 });
  }

  const key = process.env.ANTHROPIC_API_KEY || process.env.CHAT_API_KEY;
  const model = process.env.CHAT_MODEL || "claude-3-5-haiku-latest";

  // Graceful fallback so the widget still helps before an API key is configured.
  if (!key) {
    return NextResponse.json({
      reply:
        `Thanks for reaching out! I can help you learn about our home care services across Maryland. ` +
        `For the fastest answer, call our care team at ${site.phone} or schedule a free consultation on our Contact page.`,
      fallback: true,
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        system: SYSTEM,
        messages: cleaned,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Chat API error:", res.status, detail);
      return NextResponse.json({
        reply: `I'm having trouble responding right now. Please call our care team at ${site.phone} and we'll be glad to help.`,
        fallback: true,
      });
    }

    const data = await res.json();
    const reply: string =
      Array.isArray(data?.content) && data.content[0]?.text
        ? data.content[0].text
        : `Thanks for your message! Please call ${site.phone} and our team will help right away.`;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat request failed:", err);
    return NextResponse.json({
      reply: `I'm having trouble responding right now. Please call our care team at ${site.phone}.`,
      fallback: true,
    });
  }
}
