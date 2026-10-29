"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentBlock, LinkPageContent } from "@/lib/types";

export function AdminEditForm({ page }: { page: LinkPageContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState<LinkPageContent>(page);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const blocksText = useMemo(
    () =>
      draft.blocks
        .map((b) => {
          const parts = [b.type, b.title || "", b.body || "", b.price || ""];
          return parts.join(" | ");
        })
        .join("\n"),
    [draft.blocks],
  );

  function updateField<K extends keyof LinkPageContent>(
    key: K,
    value: LinkPageContent[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function parseBlocks(text: string): ContentBlock[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [typeRaw, title = "", body = "", price = ""] = line
          .split("|")
          .map((s) => s.trim());
        const type =
          typeRaw === "heading" ||
          typeRaw === "price" ||
          typeRaw === "note" ||
          typeRaw === "paragraph"
            ? typeRaw
            : "paragraph";
        return {
          id: draft.blocks[index]?.id || `b-${Date.now()}-${index}`,
          type,
          title: title || undefined,
          body,
          price: price || undefined,
        };
      });
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
    <form className="admin-form admin-card" onSubmit={onSave}>
      <h1 style={{ margin: 0, color: "var(--alma-red-deep)" }}>{page.title}</h1>
      <p style={{ margin: 0, color: "var(--alma-muted)" }}>/links/{page.slug}</p>

      <label>
        عنوان
        <input
          value={draft.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
      </label>
      <label>
        زیرعنوان
        <input
          value={draft.subtitle || ""}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />
      </label>
      <label>
        برند
        <input
          value={draft.brandLabel}
          onChange={(e) => updateField("brandLabel", e.target.value)}
          required
        />
      </label>
      <label>
        برچسب اینترو
        <input
          value={draft.introLabel}
          onChange={(e) => updateField("introLabel", e.target.value)}
        />
      </label>
      <label>
        خوشامد
        <textarea
          value={draft.greeting || ""}
          onChange={(e) => updateField("greeting", e.target.value)}
        />
      </label>
      <label>
        آدرس تصویر هیرو
        <input
          value={draft.heroImageUrl}
          onChange={(e) => updateField("heroImageUrl", e.target.value)}
        />
      </label>
      <label>
        بلوک‌ها (هر خط: type | title | body | price)
        <textarea
          style={{ minHeight: 180 }}
          defaultValue={blocksText}
          onBlur={(e) => updateField("blocks", parseBlocks(e.target.value))}
        />
      </label>
      <label>
        پیام پایانی
        <input
          value={draft.closingMessage || ""}
          onChange={(e) => updateField("closingMessage", e.target.value)}
        />
      </label>
      <label>
        عنوان آدرس
        <input
          value={draft.addressTitle || ""}
          onChange={(e) => updateField("addressTitle", e.target.value)}
        />
      </label>
      <label>
        آدرس
        <textarea
          value={draft.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </label>
      <label>
        لینک اینستاگرام
        <input
          value={draft.instagramUrl}
          onChange={(e) => updateField("instagramUrl", e.target.value)}
        />
      </label>
      <label>
        لینک نقشه
        <input
          value={draft.mapsUrl}
          onChange={(e) => updateField("mapsUrl", e.target.value)}
        />
      </label>
      <label>
        نمایش اینستاگرام
        <select
          value={draft.showInstagram ? "1" : "0"}
          onChange={(e) => updateField("showInstagram", e.target.value === "1")}
        >
          <option value="1">بله</option>
          <option value="0">خیر</option>
        </select>
      </label>
      <label>
        نمایش نقشه
        <select
          value={draft.showMaps ? "1" : "0"}
          onChange={(e) => updateField("showMaps", e.target.value === "1")}
        >
          <option value="1">بله</option>
          <option value="0">خیر</option>
        </select>
      </label>

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <a className="admin-btn admin-btn--ghost" href={`/links/${page.slug}`} target="_blank" rel="noreferrer">
          مشاهده صفحه
        </a>
        <a className="admin-btn admin-btn--ghost" href="/admin">
          بازگشت
        </a>
      </div>
    </form>
  );
}
