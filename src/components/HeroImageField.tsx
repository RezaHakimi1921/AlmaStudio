"use client";

import { useRef, useState } from "react";
import { mediaPreviewSrc, normalizeMediaUrl } from "@/lib/media";

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
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        onError?.(data.error || "آپلود ناموفق بود");
        return;
      }
      const url = normalizeMediaUrl(data.url);
      onChange(url);
      setBust(Date.now());
      onMessage?.("تصویر آپلود شد — برای اعمال ذخیره کنید");
    } catch {
      onError?.("خطا در آپلود");
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
        {uploading ? "در حال آپلود…" : "JPG / PNG / WebP / GIF تا ۸MB — بدون اسلش انتهایی در مسیر"}
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
