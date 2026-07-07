import { NextResponse } from "next/server";
import crypto from "crypto";
import { makeStaffToken, STAFF_COOKIE, STAFF_TTL_MS } from "@/lib/staff-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Logout
  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(STAFF_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  const expected = process.env.STAFF_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Staff access is not configured. Set the STAFF_PASSWORD environment variable." },
      { status: 503 }
    );
  }

  const given = String(body.password || "");
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, makeStaffToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(STAFF_TTL_MS / 1000),
  });
  return res;
}
