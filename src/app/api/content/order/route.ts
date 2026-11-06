import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { reorderPages } from "@/lib/content";

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { slugs?: unknown } | null;
  if (!body || !Array.isArray(body.slugs) || !body.slugs.every((s) => typeof s === "string")) {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
  await reorderPages(body.slugs as string[]);
  return NextResponse.json({ ok: true });
}
