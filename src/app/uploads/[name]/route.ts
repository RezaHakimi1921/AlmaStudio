import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves files uploaded from the admin panel at runtime.
 * Next.js only serves files that were in /public at build time, so without
 * this route new uploads (hero photos, gallery) would 404 in production.
 */
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const SAFE_NAME = /^[A-Za-z0-9._-]+$/;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const type = TYPES[path.extname(name).toLowerCase()];
  if (!SAFE_NAME.test(name) || name.startsWith(".") || !type) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(data.length),
        // file names are unique (timestamp + random), so they never change
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
