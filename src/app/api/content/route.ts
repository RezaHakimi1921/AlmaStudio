import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { isLinkSlug, readContent, updateHub, updatePage } from "@/lib/content";
import type { HubContent, LinkPageContent } from "@/lib/types";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    page?: LinkPageContent;
    hub?: HubContent;
  };

  if (body.hub) {
    const content = await updateHub(body.hub);
    return NextResponse.json({ ok: true, content });
  }

  if (!body.page?.slug || !isLinkSlug(body.page.slug)) {
    return NextResponse.json({ ok: false, error: "اسلاگ نامعتبر" }, { status: 400 });
  }

  const content = await updatePage(body.page.slug, body.page);
  return NextResponse.json({ ok: true, content });
}
