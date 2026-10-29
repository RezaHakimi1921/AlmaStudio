"use client";

import { useRef, useState } from "react";
import { mediaPreviewSrc, normalizeMediaUrl } from "@/lib/media";
import { toFaDigits } from "@/lib/tehran";
import { uploadImage } from "@/lib/upload-client";
import { MAX_UPLOAD_MB, faBytes } from "@/lib/upload-limits";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  onMessage?: (msg: string) => void;
  onError?: (msg: string) => void;
};

export function HeroImageField({
  label = "تصویر هیرو",
  value,
  onChange,
  onMessage,
  onError,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [bust, setBust] = useState(0);
  const clean = normalizeMediaUrl(value);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    onError?.("");
    onMessage?.("");
    try {
      const r = await uploadImage(file, "hero");
      const url = normalizeMediaUrl(r.url);
      onChange(url);
      setBust(Date.now());
      onMessage?.(
        `تصویر آپلود شد (${faBytes(r.originalBytes)} ← ${faBytes(r.savedBytes)}) — برای اعمال ذخیره کنید`,
      );
    } catch (err) {
      onError?.((err as Error).message || "خطا در آپلود");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <fieldset className="hero-upload">
      <legend>{label}</legend>
      <label>
        آپلود از دستگاه
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => onUpload(e.target.files?.[0] || null)}
        />
      </label>
      <p className="hero-upload__hint">
        {uploading
          ? "در حال آپلود و فشرده‌سازی…"
          : `JPG، PNG یا WebP تا ${toFaDigits(MAX_UPLOAD_MB)} مگابایت — عکس خودکار سبک می‌شود (معمولاً زیر ۶۰۰ کیلوبایت)`}
      </p>
      <label>
        یا URL / مسیر
        <input
          value={value}
          dir="ltr"
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(normalizeMediaUrl(e.target.value))}
          placeholder="/heroes/… یا /uploads/… یا https://…"
        />
      </label>
      {clean ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${clean}-${bust}`}
          src={mediaPreviewSrc(clean, bust || undefined)}
          alt=""
          className="hero-upload__preview"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0.35";
          }}
          onLoad={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "1";
          }}
        />
      ) : null}
      {clean ? (
        <p className="hero-upload__hint" dir="ltr">
          {clean}
        </p>
      ) : null}
    </fieldset>
  );
}
