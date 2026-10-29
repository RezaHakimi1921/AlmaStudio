"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { HubContent } from "@/lib/types";

export function AdminHubForm({ hub }: { hub: HubContent }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<HubContent>({ ...hub });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<K extends keyof HubContent>(key: K, value: HubContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function onHeroUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setError(data.error || "آپلود ناموفق بود");
        return;
      }
      updateField("heroImageUrl", data.url);
      setMessage("تصویر هاب آپلود شد — برای اعمال ذخیره کنید");
    } catch {
      setError("خطا در آپلود");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hub: draft }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "ذخیره ناموفق بود");
        return;
      }
      setMessage("هاب ذخیره شد");
      router.refresh();
    } catch {
      setError("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form admin-card glass" onSubmit={onSave}>
      <h2 style={{ margin: 0, color: "var(--alma-red)" }}>هاب اصلی (/)</h2>
      <p style={{ margin: 0, color: "var(--alma-muted)" }}>
        تصویر، عنوان و زیرعنوان شیشه‌ای صفحهٔ ورود — برای مشتریان روی alma.artepersia.com
      </p>

      <label>
        عنوان هاب
        <input
          value={draft.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
      </label>
      <label>
        زیرعنوان هاب
        <input
          value={draft.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          required
        />
      </label>

      <fieldset className="hero-upload">
        <legend>تصویر هیرو هاب</legend>
        <label>
          آپلود از دستگاه
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => onHeroUpload(e.target.files?.[0] || null)}
          />
        </label>
        <p className="hero-upload__hint">
          {uploading
            ? "در حال آپلود…"
            : "JPG / PNG / WebP / GIF تا ۸MB — همان API آپلود صفحات"}
        </p>
        <label>
          یا URL / مسیر
          <input
            value={draft.heroImageUrl}
            onChange={(e) => updateField("heroImageUrl", e.target.value)}
            placeholder="/heroes/… یا /uploads/…"
          />
        </label>
        {draft.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.heroImageUrl} alt="" className="hero-upload__preview" />
        ) : null}
      </fieldset>

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره هاب"}
        </button>
        <a className="admin-btn admin-btn--ghost" href="/" target="_blank" rel="noreferrer">
          مشاهده هاب
        </a>
      </div>
    </form>
  );
}
