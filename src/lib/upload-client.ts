"use client";

import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "./upload-limits";
import type { UploadPurpose } from "./upload-limits";

export type UploadResult = {
  url: string;
  originalBytes: number;
  savedBytes: number;
};

const SHRINK_OVER = 3 * 1024 * 1024; // pre-shrink in the browser above 3 MB
const CLIENT_EDGE = 2800;

/**
 * Big camera photos are first shrunk in the browser (faster on slow mobile
 * internet), then the server makes the final WebP.
 */
async function preShrink(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.size <= SHRINK_OVER) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, CLIENT_EDGE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.9));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file; // browser can't decode → let the server try
  }
}

export async function uploadImage(file: File, purpose: UploadPurpose): Promise<UploadResult> {
  if (/\.hei[cf]$/i.test(file.name) || /heic|heif/i.test(file.type)) {
    throw new Error("فرمت HEIC آیفون پشتیبانی نمی‌شود؛ عکس را با فرمت JPG بفرستید");
  }
  const body = await preShrink(file);
  if (body.size > MAX_UPLOAD_BYTES) {
    throw new Error(`حجم «${file.name}» بیشتر از ${MAX_UPLOAD_MB} مگابایت است`);
  }
  const form = new FormData();
  form.append("file", body instanceof File ? body : new File([body], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
  form.append("purpose", purpose);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  let data: { ok?: boolean; url?: string; error?: string; savedBytes?: number } = {};
  try {
    data = await res.json();
  } catch {
    /* nginx 413 etc. */
  }
  if (res.status === 413) throw new Error(`حجم «${file.name}» از حد مجاز سرور بیشتر است`);
  if (!res.ok || !data.ok || !data.url) throw new Error(data.error || "آپلود ناموفق بود");
  return { url: data.url, originalBytes: file.size, savedBytes: data.savedBytes ?? body.size };
}
