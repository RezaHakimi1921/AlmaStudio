import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Used by deploy/auto-deploy.sh to confirm the new version is up. */
export function GET() {
  return NextResponse.json(
    { ok: true, sha: process.env.GIT_SHA || "dev" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
