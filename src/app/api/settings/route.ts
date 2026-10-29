import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { settings?: unknown };
  try {
    body = (await request.json()) as { settings?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "داده نامعتبر" }, { status: 400 });
  }
  if (!body.settings) {
    return NextResponse.json({ ok: false, error: "تنظیمات ارسال نشد" }, { status: 400 });
  }
  const settings = await updateSettings(body.settings);
  return NextResponse.json({ ok: true, settings });
}
