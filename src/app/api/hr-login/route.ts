import { NextResponse } from "next/server";
import crypto from "crypto";
import { makeHrToken, HR_COOKIE, HR_TTL_MS, HR_CODE } from "@/lib/hr-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { code?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Logout
  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(HR_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  const given = String(body.code || "");
  const a = Buffer.from(given);
  const b = Buffer.from(HR_CODE);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect HR access code." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(HR_COOKIE, makeHrToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(HR_TTL_MS / 1000),
  });
  return res;
}
