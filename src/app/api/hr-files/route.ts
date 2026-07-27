import { NextResponse } from "next/server";
import { verifyHrToken, HR_COOKIE } from "@/lib/hr-auth";
import { hrFiles, type HrFileKey } from "@/lib/hr-files-data";

export const runtime = "nodejs";

function getCookie(req: Request, name: string): string {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

export async function GET(req: Request) {
  if (!verifyHrToken(getCookie(req, HR_COOKIE))) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const key = new URL(req.url).searchParams.get("file") as HrFileKey | null;
  if (!key || !(key in hrFiles)) {
    return NextResponse.json({ error: "Unknown file." }, { status: 404 });
  }
  const f = hrFiles[key];
  const bytes = Buffer.from(f.b64, "base64");
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": f.type,
      "Content-Disposition": `attachment; filename="${f.filename}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "no-store",
    },
  });
}
