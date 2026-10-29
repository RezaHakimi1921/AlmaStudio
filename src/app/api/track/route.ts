import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { recordEvent } from "@/lib/stats";
import { LINK_SLUGS, TRACK_EVENTS } from "@/lib/types";
import type { TrackEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGES = new Set<string>([...LINK_SLUGS, "gallery"]);
const EVENTS = new Set<string>(TRACK_EVENTS);
const BOT_RE = /bot|crawler|spider|preview|facebookexternalhit|telegrambot|whatsapp/i;

export async function POST(request: Request) {
  if (BOT_RE.test(request.headers.get("user-agent") || "")) {
    return new NextResponse(null, { status: 204 });
  }
  // the studio's own visits (logged-in admin) are not counted
  if (await isAuthenticated()) {
    return new NextResponse(null, { status: 204 });
  }
  let body: { page?: unknown; event?: unknown };
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const page = String(body.page ?? "");
  const event = String(body.event ?? "");
  if (!PAGES.has(page) || !EVENTS.has(event)) {
    return new NextResponse(null, { status: 400 });
  }
  try {
    await recordEvent(page, event as TrackEvent);
  } catch {
    /* stats are best-effort */
  }
  return new NextResponse(null, { status: 204 });
}
