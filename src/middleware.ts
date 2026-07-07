import { NextResponse, type NextRequest } from "next/server";

// Staff-only gate for internal pages (admin records, resources, and the care
// documentation forms). A shared staff password sets a signed cookie; this
// middleware verifies it and redirects to /staff-login when missing.

const SECRET =
  process.env.STAFF_SECRET ||
  process.env.FORM_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "mhc-dev-secret-change-me";

const PROTECTED_EXACT = new Set<string>([
  "/resources",
  "/participant-assessment-form",
  "/caregiver-service-plan",
  "/medication-administration-records",
  "/pain-evaluation",
  "/emergency-medical-data-sheet",
  "/caregiver-daily-log-form",
  "/unlicensed-aide-skills-assessment",
]);

function isProtected(pathname: string) {
  const s = pathname.replace(/\/$/, "") || "/";
  return s.startsWith("/admin") || PROTECTED_EXACT.has(s);
}

async function hmacHex(msg: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyStaff(token: string): Promise<boolean> {
  const parts = (token || "").split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await hmacHex(`staff.${exp}`);
  return sig.length === expected.length && sig === expected;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = req.cookies.get("mhc_staff")?.value || "";
  if (await verifyStaff(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/staff-login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on page routes only (skip API, Next internals, and static files).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand|wp-content|.*\\.).*)"],
};
