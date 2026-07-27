import crypto from "crypto";

// Signed HR-session cookie, shared by the HR login API and the HR data/file
// APIs. Standalone from staff auth: HR needs only the HR access code.
// Must match the HMAC scheme used in middleware.ts (payload `hr.<exp>`).
const SECRET =
  process.env.STAFF_SECRET ||
  process.env.FORM_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "mhc-dev-secret-change-me";

export const HR_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
export const HR_COOKIE = "mhc_hr";

// The HR access code. Overridable via env; defaults to the code Dave chose.
export const HR_CODE = process.env.HR_ACCESS_CODE || "Cares718!";

export function makeHrToken(): string {
  const exp = Date.now() + HR_TTL_MS;
  const sig = crypto.createHmac("sha256", SECRET).update(`hr.${exp}`).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyHrToken(token: string): boolean {
  const parts = (token || "").split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(`hr.${exp}`).digest("hex");
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
