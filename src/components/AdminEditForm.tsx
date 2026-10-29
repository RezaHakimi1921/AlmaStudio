"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LinkPageContent } from "@/lib/types";
import { publicPathForSlug } from "@/lib/routes";

export function AdminEditForm({ page }: { page: LinkPageContent }) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<LinkPageContent>({ ...page });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<K extends keyof LinkPageContent>(
    key: K,
    value: LinkPageContent[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  /** Wrap selected text in <b>…</b> inside the body textarea */
  function wrapBold() {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    const selected = value.slice(start, end) || "متن پررنگ";
    const next =
      value.slice(0, start) + `<b>${selected}</b>` + value.slice(end);
    updateField("bodyHtml", next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + 3 + selected.length;
      el.setSelectionRange(pos, pos);
    });
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
      setMessage("تصویر هیرو آپلود شد — برای اعمال ذخیره کنید");
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
        body: JSON.stringify({ page: draft }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "ذخیره ناموفق بود");
        return;
      }
      setMessage("ذخیره شد");
      router.refresh();
    } catch {
      setError("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form admin-card glass" onSubmit={onSave}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, color: "var(--alma-red)" }}>{page.title}</h1>
        {!draft.published ? <span className="draft-badge">پیش‌نویس</span> : null}
      </div>
      <p style={{ margin: 0, color: "var(--alma-muted)" }}>
        ویرایش ساده · {publicPathForSlug(page.slug)}
      </p>

      <label>
        عنوان
        <input value={draft.title} onChange={(e) => updateField("title", e.target.value)} required />
      </label>
      <label>
        زیرعنوان
        <input value={draft.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
      </label>
      <label>
        برچسب حال‌وهوا
        <input value={draft.moodTag} onChange={(e) => updateField("moodTag", e.target.value)} />
      </label>
      <label>
        برند
        <input value={draft.brandLabel} onChange={(e) => updateField("brandLabel", e.target.value)} />
      </label>
      <label>
        برچسب اینترو
        <input value={draft.introLabel} onChange={(e) => updateField("introLabel", e.target.value)} />
      </label>
      <fieldset className="hero-upload">
        <legend>تصویر هیرو</legend>
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
          {uploading ? "در حال آپلود…" : "JPG / PNG / WebP / GIF تا ۸MB — در public/uploads ذخیره می‌شود"}
        </p>
        <label>
          یا URL / مسیر (fallback)
          <input
            value={draft.heroImageUrl}
            onChange={(e) => updateField("heroImageUrl", e.target.value)}
            placeholder="/uploads/… یا https://…"
          />
        </label>
        {draft.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={draft.heroImageUrl}
            alt=""
            className="hero-upload__preview"
          />
        ) : null}
      </fieldset>

      <fieldset className="hero-upload">
        <legend>شماره تماس این لینک</legend>
        <label>
          شماره برای دکمه «تماس با آتلیه» (هر لینک جدا)
          <input
            value={draft.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="مثلاً 02155123456 یا 09121234567"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
          />
        </label>
        <p className="hero-upload__hint">
          {draft.phone.trim()
            ? "روی صفحهٔ عمومی دکمه تماس با همین شماره (tel:) نمایش داده می‌شود."
            : "خالی بگذارید تا دکمه تماس روی این لینک نشان داده نشود."}
        </p>
      </fieldset>
      <label>
        اینستاگرام
        <input value={draft.instagramUrl} onChange={(e) => updateField("instagramUrl", e.target.value)} />
      </label>
      <label>
        مسیریاب گوگل
        <input
          value={draft.mapsUrl}
          onChange={(e) => updateField("mapsUrl", e.target.value)}
          dir="ltr"
          placeholder="https://maps.google.com/…"
        />
      </label>
      <label>
        مسیریاب نشان (اختیاری)
        <input
          value={draft.neshanUrl}
          onChange={(e) => updateField("neshanUrl", e.target.value)}
          dir="ltr"
          placeholder="https://nshn.ir/…"
        />
      </label>
      <label>
        پیام‌رسان بله (اختیاری)
        <input
          value={draft.baleUrl}
          onChange={(e) => updateField("baleUrl", e.target.value)}
          dir="ltr"
          placeholder="https://ble.ir/username"
        />
      </label>

      <div className="admin-actions">
        <label style={{ flex: 1 }}>
          نمایش اینستاگرام
          <select
            value={draft.showInstagram ? "1" : "0"}
            onChange={(e) => updateField("showInstagram", e.target.value === "1")}
          >
            <option value="1">بله</option>
            <option value="0">خیر</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          نمایش گوگل‌مپ
          <select
            value={draft.showMaps ? "1" : "0"}
            onChange={(e) => updateField("showMaps", e.target.value === "1")}
          >
            <option value="1">بله</option>
            <option value="0">خیر</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          نمایش نشان
          <select
            value={draft.showNeshan ? "1" : "0"}
            onChange={(e) => updateField("showNeshan", e.target.value === "1")}
          >
            <option value="1">بله</option>
            <option value="0">خیر</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          نمایش بله
          <select
            value={draft.showBale ? "1" : "0"}
            onChange={(e) => updateField("showBale", e.target.value === "1")}
          >
            <option value="1">بله</option>
            <option value="0">خیر</option>
          </select>
        </label>
        <label style={{ flex: 1 }}>
          انتشار
          <select
            value={draft.published ? "1" : "0"}
            onChange={(e) => updateField("published", e.target.value === "1")}
          >
            <option value="1">منتشر</option>
            <option value="0">پیش‌نویس</option>
          </select>
        </label>
      </div>

      <div>
        <div className="admin-actions" style={{ marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--alma-ink)" }}>متن اصلی صفحه</span>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={wrapBold}>
            پررنگ (Bold)
          </button>
        </div>
        <textarea
          ref={bodyRef}
          value={draft.bodyHtml}
          onChange={(e) => updateField("bodyHtml", e.target.value)}
          style={{ minHeight: 180 }}
          placeholder="<p>متن…</p> — از دکمه پررنگ برای <b>متن</b> استفاده کنید"
        />
      </div>

      <label>
        پکیج‌ها و قیمت (هر خط یک مورد — اختیاری)
        <textarea
          value={draft.packagesText}
          onChange={(e) => updateField("packagesText", e.target.value)}
          style={{ minHeight: 110 }}
        />
      </label>
      <label>
        نکات مهم (هر خط یک نکته — اختیاری)
        <textarea
          value={draft.notesText}
          onChange={(e) => updateField("notesText", e.target.value)}
          style={{ minHeight: 110 }}
        />
      </label>
      <label>
        پیام پایانی
        <input
          value={draft.closingMessage}
          onChange={(e) => updateField("closingMessage", e.target.value)}
        />
      </label>
      <label>
        عنوان آدرس
        <input
          value={draft.addressTitle}
          onChange={(e) => updateField("addressTitle", e.target.value)}
        />
      </label>
      <label>
        آدرس
        <textarea
          value={draft.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </label>

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <a
          className="admin-btn admin-btn--ghost"
          href={publicPathForSlug(page.slug)}
          target="_blank"
          rel="noreferrer"
        >
          مشاهده
        </a>
        <Link className="admin-btn admin-btn--ghost" href="/admin">
          بازگشت
        </Link>
      </div>
    </form>
  );
}
