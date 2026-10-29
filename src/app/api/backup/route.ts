import { spawn } from "child_process";
import { Readable } from "stream";
import { isAuthenticated } from "@/lib/auth";
import { isoToJalali } from "@/lib/jalali";
import { tehranDateKey } from "@/lib/tehran";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin "download backup": streams data/ (content, settings, stats) and
 * public/uploads/ (all photos) as one .tar.gz — nothing is buffered in memory.
 */
export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const j = isoToJalali(tehranDateKey())!;
  const stamp = `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(j.jd).padStart(2, "0")}`;

  const tar = spawn("tar", ["-chzf", "-", "data", "public/uploads"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "ignore"],
  });

  const body = Readable.toWeb(tar.stdout) as ReadableStream<Uint8Array>;
  return new Response(body, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="alma-backup-${stamp}.tar.gz"`,
      "Cache-Control": "no-store",
    },
  });
}
