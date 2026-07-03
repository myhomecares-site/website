import { NextResponse } from "next/server";
import { site, services, conditions, regions, locations, careForms } from "@/lib/site";
import { faqs } from "@/lib/faq";
import { posts } from "@/lib/posts";

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
- Private pay, long-term care insurance, and Maryland Medicaid home- and community-based waiver programs (such as Community First Choice and the Community Options Waiver).

KEY FACTS / FAQ
${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}
`.trim();

// Real site links so the assistant can point people to the exact page.
const PAGES = `
KEY PAGES (link with markdown, e.g. [Contact](/contact)):
- Home: /
- All services: /home-care
- Service areas overview: /service-areas
- About us: /about
- Contact / free consultation: /contact
- Careers (jobs): /careers
- Apply for a job: /job-application
- Caregiver jobs: /caregivers
- CareLink Staffing: /carelink-staffing
- Reviews: /reviews
- FAQ: /faq
- Blog: /blog

SERVICE PAGES
${services.map((s) => `- ${s.title}: /${s.slug}`).join("\n")}

SPECIALIZED CARE PAGES
${conditions.map((c) => `- ${c.name}: /${c.slug}`).join("\n")}

SERVICE AREA PAGES (Maryland counties and regions)
${locations.map((l) => `- ${l.name}: /${l.slug}`).join("\n")}

BLOG ARTICLES
${posts.slice(0, 12).map((p) => `- ${p.title}: /blog/${p.slug}`).join("\n")}

CARE FORMS (fillable and printable documentation)
${careForms.map((f) => `- ${f.title}: /${f.slug}`).join("\n")}
`.trim();

function buildSystem(path: string, lang: string) {
  const here = path && path !== "/" ? path : "the home page";
  return `You are the My Home Cares Assistant, the friendly virtual assistant for My Home Cares, a licensed Maryland home care agency (RSA). You help families and prospective caregivers on the website.

Use ONLY the information below to answer. If you don't know something, say so warmly and invite them to call ${site.phone} or request a free consultation.

${KNOWLEDGE}

${PAGES}

CONTEXT
- The visitor is currently on: ${here}.
- Preferred language: ${lang === "es" ? "Spanish" : "English"}.

RULES
- Be warm, concise, and reassuring. Keep replies short (2 to 4 sentences) unless asked for detail.
- LANGUAGE: Reply in the same language as the visitor's latest message. If they write in Spanish, answer fully in Spanish. Otherwise use ${lang === "es" ? "Spanish" : "English"}.
- LINK OUT: When you mention a service, specialized care type, county or region, blog article, or care form, include a markdown link to its page from the lists above, e.g. "our [Personal Care](/personal-care) service". Use real paths only. Prefer the most specific page.
- You are NOT a medical professional. Do not give medical, clinical, diagnostic, or dosage advice. For health questions, suggest speaking with their doctor or our care team. For emergencies, tell them to call 911.
- Do not quote specific prices. Explain that cost depends on care needs and hours, list the payment options, then offer a free consultation.
- Gently guide interested visitors toward a free consultation or the [Contact page](/contact) or calling ${site.phone}. For job seekers, point them to [Careers](/careers) and the [application](/job-application).
- Never invent services, facts, reviews, or guarantees. Stay on topics related to My Home Cares and home care in Maryland.
- Do not use em dashes. Use commas or periods instead.

LEAD CAPTURE
- When a visitor wants a free consultation, a callback, or to be contacted, offer to have the care team reach out and collect their details conversationally: their name, and a phone number or email. Optionally ask their city or county, what kind of care they need, and their timeframe. Ask for only one or two missing items at a time; keep it natural, never pushy.
- Once you have at least a name AND a phone number or email, AND the visitor agrees to be contacted, include this hidden marker on its very last line, filling only known fields (leave others as empty strings):
<<<LEAD {"name":"","phone":"","email":"","city":"","care_needed":"","timeframe":"","message":""}>>>
- Never mention this marker or that you are saving data. In the visible reply, warmly confirm that you have shared their details with the care team and that someone will reach out soon.

FOLLOW-UP SUGGESTIONS
- End EVERY reply with this hidden marker containing 2 to 3 short tappable follow-up questions the visitor might ask next, in the reply's language:
<<<SUGGEST ["...","...","..."]>>>
- Never mention this marker. Keep each suggestion under 6 words.`;
}

function extractMarker(text: string, name: string): { value: string | null; stripped: string } {
  const re = new RegExp(`<<<${name}\\s*([\\s\\S]*?)>>>`, "i");
  const m = text.match(re);
  if (!m) return { value: null, stripped: text };
  return { value: m[1].trim(), stripped: text.replace(m[0], "").trim() };
}

async function saveLead(origin: string, lead: Record<string, string>) {
  const name = (lead.name || "").trim();
  const phone = (lead.phone || "").trim();
  const email = (lead.email || "").trim();
  if (!name || (!phone && !email)) return false;
  try {
    await fetch(`${origin}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        message: (lead.message || "Requested a callback through the website assistant.").trim(),
        source: "chat",
        city: (lead.city || "").trim(),
        care_needed: lead.care_needed ? [String(lead.care_needed).trim()] : [],
        timeframe: (lead.timeframe || "").trim(),
      }),
    });
    return true;
  } catch (err) {
    console.error("Chat lead save failed:", err);
    return false;
  }
}

export async function POST(req: Request) {
  let body: { messages?: Msg[]; path?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
  const lang = body.lang === "es" ? "es" : "en";

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const cleaned: Msg[] = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-14);
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift();

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "No message provided" }, { status: 422 });
  }

  const key = process.env.ANTHROPIC_API_KEY || process.env.CHAT_API_KEY;
  const model = process.env.CHAT_MODEL || "claude-3-5-haiku-latest";

  if (!key) {
    return NextResponse.json({
      reply:
        `Thanks for reaching out! I can help you learn about our home care services across Maryland. ` +
        `For the fastest answer, call our care team at ${site.phone} or schedule a free consultation on our [Contact page](/contact).`,
      suggestions: ["What services do you offer?", "Do you accept Medicaid?", "I'd like a callback"],
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
        max_tokens: 600,
        system: buildSystem(path, lang),
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
    let reply: string =
      Array.isArray(data?.content) && data.content[0]?.text
        ? data.content[0].text
        : `Thanks for your message! Please call ${site.phone} and our team will help right away.`;

    // Pull hidden markers out of the reply.
    const lead = extractMarker(reply, "LEAD");
    reply = lead.stripped;
    const sug = extractMarker(reply, "SUGGEST");
    reply = sug.stripped;

    let suggestions: string[] = [];
    if (sug.value) {
      try {
        const parsed = JSON.parse(sug.value);
        if (Array.isArray(parsed)) suggestions = parsed.filter((s) => typeof s === "string").slice(0, 3);
      } catch { /* ignore malformed */ }
    }

    let leadSaved = false;
    if (lead.value) {
      try {
        const parsed = JSON.parse(lead.value) as Record<string, string>;
        const origin = new URL(req.url).origin;
        leadSaved = await saveLead(origin, parsed);
      } catch (err) {
        console.error("Chat lead parse failed:", err);
      }
    }

    return NextResponse.json({ reply: reply.trim(), suggestions, leadSaved });
  } catch (err) {
    console.error("Chat request failed:", err);
    return NextResponse.json({
      reply: `I'm having trouble responding right now. Please call our care team at ${site.phone}.`,
      fallback: true,
    });
  }
}
