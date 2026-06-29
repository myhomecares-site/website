import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let code = "";
  try {
    code = (((await req.json()) as { code?: string })?.code || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const expected = process.env.TRAINING_ACCESS_CODE;
  if (!expected) {
    return NextResponse.json(
      { error: "Training access isn't configured yet. Please contact the office." },
      { status: 503 }
    );
  }

  if (!code || code !== expected) {
    return NextResponse.json({ error: "Incorrect access code." }, { status: 401 });
  }

  const store = await cookies();
  store.set("mhc_train", "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ ok: true });
}
