"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlockType, ContentBlock, LinkPageContent } from "@/lib/types";
import { BLOCK_TYPE_LABELS } from "@/lib/types";

function newBlock(type: BlockType): ContentBlock {
  return {
    id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: "",
    body: "",
    price: "",
    imageUrl: "",
    imageAlt: "",
    phone: "",
    bold: false,
  };
}

export function AdminEditForm({ page }: { page: LinkPageContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState<LinkPageContent>({
    ...page,
    phone: page.phone || "",
    published: page.published !== false,
    blocks: page.blocks.map((b) => ({ ...b })),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof LinkPageContent>(
    key: K,
    value: LinkPageContent[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setDraft((prev) => {
      const idx = prev.blocks.findIndex((b) => b.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.blocks.length) return prev;
      const blocks = [...prev.blocks];
      const tmp = blocks[idx];
      blocks[idx] = blocks[next];
      blocks[next] = tmp;
      return { ...prev, blocks };
    });
  }

  function removeBlock(id: string) {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));
  }

  function addBlock(type: BlockType) {
    setDraft((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock(type)] }));
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
      <p style={{ margin: 0, color: "var(--alma-muted)" }}>/links/{page.slug}</p>

      <label>
        عنوان
        <input value={draft.title} onChange={(e) => updateField("title", e.target.value)} required />
      </label>
      <label>
        زیرعنوان
        <input value={draft.subtitle || ""} onChange={(e) => updateField("subtitle", e.target.value)} />
      </label>
      <label>
        برچسب حال‌وهوا
        <input value={draft.moodTag} onChange={(e) => updateField("moodTag", e.target.value)} />
      </label>
      <label>
        برند
        <input value={draft.brandLabel} onChange={(e) => updateField("brandLabel", e.target.value)} required />
      </label>
      <label>
        برچسب اینترو
        <input value={draft.introLabel} onChange={(e) => updateField("introLabel", e.target.value)} />
      </label>
      <label>
        خوشامد
        <textarea value={draft.greeting || ""} onChange={(e) => updateField("greeting", e.target.value)} />
      </label>
      <label>
        تصویر هیرو (URL)
        <input value={draft.heroImageUrl} onChange={(e) => updateField("heroImageUrl", e.target.value)} />
      </label>
      <label>
        تلفن تماس (خالی = دکمه غیرفعال)
        <input
          value={draft.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="مثلاً 02112345678"
          inputMode="tel"
        />
      </label>
      <label>
        پیام پایانی
        <input value={draft.closingMessage || ""} onChange={(e) => updateField("closingMessage", e.target.value)} />
      </label>
      <label>
        عنوان آدرس
        <input value={draft.addressTitle || ""} onChange={(e) => updateField("addressTitle", e.target.value)} />
      </label>
      <label>
        آدرس
        <textarea value={draft.address || ""} onChange={(e) => updateField("address", e.target.value)} />
      </label>
      <label>
        لینک اینستاگرام
        <input value={draft.instagramUrl} onChange={(e) => updateField("instagramUrl", e.target.value)} />
      </label>
      <label>
        لینک نقشه
        <input value={draft.mapsUrl} onChange={(e) => updateField("mapsUrl", e.target.value)} />
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
      <label>
        وضعیت انتشار
        <select
          value={draft.published ? "1" : "0"}
          onChange={(e) => updateField("published", e.target.value === "1")}
        >
          <option value="1">منتشر شده</option>
          <option value="0">پیش‌نویس</option>
        </select>
      </label>

      <h2 style={{ margin: "0.5rem 0 0", color: "var(--alma-red-deep)", fontSize: "1.1rem" }}>
        بلوک‌های محتوا
      </h2>
      <p style={{ margin: 0, color: "var(--alma-muted)", fontSize: "0.88rem" }}>
        افزودن، جابه‌جایی و ویرایش بصری — بدون سینتکس لوله.
      </p>

      <div className="block-editor">
        {draft.blocks.map((block, index) => (
          <div key={block.id} className="block-editor-item">
            <div className="block-editor-toolbar">
              <strong>
                #{index + 1} · {BLOCK_TYPE_LABELS[block.type]}
              </strong>
              <div className="tools">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => moveBlock(block.id, -1)}>
                  بالا
                </button>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => moveBlock(block.id, 1)}>
                  پایین
                </button>
                <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeBlock(block.id)}>
                  حذف
                </button>
              </div>
            </div>

            <label>
              نوع بلوک
              <select
                value={block.type}
                onChange={(e) => updateBlock(block.id, { type: e.target.value as BlockType })}
              >
                {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
                  <option key={t} value={t}>
                    {BLOCK_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            {(block.type === "text" ||
              block.type === "note" ||
              block.type === "price" ||
              block.type === "image" ||
              block.type === "contact") && (
              <label>
                عنوان
                <input
                  value={block.title || ""}
                  onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                />
              </label>
            )}

            {(block.type === "text" ||
              block.type === "note" ||
              block.type === "price" ||
              block.type === "contact") && (
              <label>
                متن
                <textarea
                  value={block.body || ""}
                  onChange={(e) => updateBlock(block.id, { body: e.target.value })}
                />
              </label>
            )}

            {block.type === "price" && (
              <label>
                قیمت
                <input
                  value={block.price || ""}
                  onChange={(e) => updateBlock(block.id, { price: e.target.value })}
                />
              </label>
            )}

            {block.type === "image" && (
              <>
                <label>
                  آدرس تصویر
                  <input
                    value={block.imageUrl || ""}
                    onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                  />
                </label>
                <label>
                  توضیح تصویر
                  <input
                    value={block.imageAlt || ""}
                    onChange={(e) => updateBlock(block.id, { imageAlt: e.target.value })}
                  />
                </label>
              </>
            )}

            {block.type === "contact" && (
              <label>
                تلفن این بلوک (اختیاری؛ وگرنه تلفن صفحه)
                <input
                  value={block.phone || ""}
                  onChange={(e) => updateBlock(block.id, { phone: e.target.value })}
                  inputMode="tel"
                />
              </label>
            )}

            {(block.type === "text" || block.type === "note") && (
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={Boolean(block.bold)}
                  onChange={(e) => updateBlock(block.id, { bold: e.target.checked })}
                />
                متن ضخیم
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="admin-actions">
        {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
          <button
            key={t}
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => addBlock(t)}
          >
            + {BLOCK_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

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
