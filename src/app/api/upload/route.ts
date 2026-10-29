import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { normalizeMediaUrl } from "@/lib/media";
import { MAX_EDGE, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limits";
import type { UploadPurpose } from "@/lib/upload-limits";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * Admin image upload.
 * Every photo is auto-rotated, resized (longest edge per purpose), converted to
 * WebP and stripped of metadata (EXIF/GPS) — a 10 MB camera photo usually ends
 * up around 200–600 KB. Animated GIFs are stored as-is.
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "فرم نامعتبر" }, { status: 400 });
  }

  const file = form.get("file");
  const purposeRaw = String(form.get("purpose") || "hero");
  const purpose: UploadPurpose =
    purposeRaw === "gallery" || purposeRaw === "decor" ? purposeRaw : "hero";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "فایل ارسال نشد" }, { status: 400 });
  }
  if (/heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) {
    return NextResponse.json(
      { ok: false, error: "فرمت HEIC آیفون پشتیبانی نمی‌شود؛ عکس را با فرمت JPG بفرستید" },
      { status: 400 },
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "فقط JPG، PNG، WebP یا GIF" }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: `حجم هر عکس باید کمتر از ${MAX_UPLOAD_MB} مگابایت باشد` },
      { status: 400 },
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  const id = `${Date.now()}-${randomBytes(4).toString("hex")}`;
  let output: Buffer = input;
  let ext = ".gif";
  let width: number | undefined;
  let height: number | undefined;

  if (file.type !== "image/gif") {
    try {
      const edge = MAX_EDGE[purpose];
      const { data, info } = await sharp(input, { failOn: "none" })
        .rotate() // honour camera orientation before EXIF is dropped
        .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      output = data;
      ext = ".webp";
      width = info.width;
      height = info.height;
    } catch {
      return NextResponse.json(
        { ok: false, error: "این فایل قابل خواندن نیست؛ عکس دیگری انتخاب کنید" },
        { status: 400 },
      );
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const name = `${id}${ext}`;
  await fs.writeFile(path.join(uploadDir, name), output);

  const url = normalizeMediaUrl(`/uploads/${name}`);
  return NextResponse.json({
    ok: true,
    url,
    path: url,
    originalBytes: input.length,
    savedBytes: output.length,
    width,
    height,
  });
}
