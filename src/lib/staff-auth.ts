import crypto from "crypto";

// Signed staff-session cookie shared by the login API and the admin API.
// Must match the HMAC scheme used in middleware.ts (payload `staff.<exp>`).
const SECRET =
  process.env.STAFF_SECRET ||
  process.env.FORM_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "mhc-dev-secret-change-me";

export const STAFF_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
export const STAFF_COOKIE = "mhc_staff";

export function makeStaffToken(): string {
  const exp = Date.now() + STAFF_TTL_MS;
  const sig = crypto.createHmac("sha256", SECRET).update(`staff.${exp}`).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyStaffToken(token: string): boolean {
  const parts = (token || "").split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(`staff.${exp}`).digest("hex");
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
