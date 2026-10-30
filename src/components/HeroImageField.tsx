"use client";

import { useState } from "react";
import { mediaPreviewSrc, normalizeMediaUrl } from "@/lib/media";
import { uploadImage } from "@/lib/upload-client";
import { faBytes } from "@/lib/upload-limits";
import { ImagePicker } from "./ImagePicker";

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
  const [uploading, setUploading] = useState(false);
  const [bust, setBust] = useState(0);
  const clean = normalizeMediaUrl(value);

  async function onUpload(file: File | undefined) {
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
    }
  }

  return (
    <fieldset className="hero-upload">
      <legend>{label}</legend>

      {clean ? (
        <figure className="hero-upload__current">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <figcaption>عکس فعلی</figcaption>
        </figure>
      ) : null}

      <ImagePicker
        compact={Boolean(clean)}
        title={clean ? "تعویض عکس" : "انتخاب عکس"}
        busy={uploading ? "در حال آپلود و فشرده‌سازی…" : undefined}
        onFiles={(files) => onUpload(files[0])}
      />

      <details className="hero-upload__advanced">
        <summary>پیشرفته: وارد کردن آدرس عکس به‌صورت دستی</summary>
        <input
          value={value}
          dir="ltr"
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(normalizeMediaUrl(e.target.value))}
          placeholder="/heroes/… یا /uploads/… یا https://…"
          aria-label="آدرس عکس"
        />
      </details>
    </fieldset>
  );
}
