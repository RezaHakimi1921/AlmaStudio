"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_THEMES } from "@/lib/gallery";
import { parseFaNumber, toFaDigits } from "@/lib/tehran";
import { uploadImage } from "@/lib/upload-client";
import { faBytes } from "@/lib/upload-limits";
import type { Decor, GalleryCategory, SiteSettings } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { Switch, saveSettings } from "./AdminSettingsForm";
import { ImagePicker } from "./ImagePicker";
import { DECOR_PATH } from "./DecorTeaser";

export function AdminDecorManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [cat, setCat] = useState<GalleryCategory>("newborn");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const items = s.decors.items;
  const counts = new Map<number, number>();
  items.forEach((d) => counts.set(d.number, (counts.get(d.number) ?? 0) + 1));
  const duplicates = [...counts.entries()].filter(([, c]) => c > 1).map(([n]) => n);

  function setItems(next: Decor[]) {
    setS((p) => ({ ...p, decors: { ...p.decors, items: next } }));
    setDirty(true);
    setMessage("");
  }

  async function persist(next: SiteSettings, okText = "ذخیره شد ✓") {
    setError("");
    try {
      const saved = await saveSettings(next);
      setS(saved);
      setDirty(false);
      setMessage(okText);
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "خطا در ذخیره");
    }
  }

  async function onFiles(files: File[]) {
    if (!files.length) return;
    setError("");
    setMessage("");
    const list = files;
    let nextNumber = Math.max(0, ...items.map((d) => d.number)) + 1;
    const added: Decor[] = [];
    let before = 0;
    let after = 0;
    for (let i = 0; i < list.length; i++) {
      setBusy(`در حال آپلود و فشرده‌سازی ${toFaDigits(i + 1)} از ${toFaDigits(list.length)}…`);
      try {
        const r = await uploadImage(list[i], "decor");
        before += r.originalBytes;
        after += r.savedBytes;
        added.push({
          id: `decor-${Date.now()}-${i}`,
          number: nextNumber++,
          name: "",
          category: cat,
          imageUrl: r.url,
          note: "",
          visible: true,
        });
      } catch (err) {
        setError((err as Error).message);
      }
    }
    setBusy("");
    if (added.length) {
      const next = { ...s, decors: { ...s.decors, items: [...items, ...added] } };
      setS(next);
      await persist(
        next,
        `${toFaDigits(added.length)} دکور اضافه شد ✓ — حجم ${faBytes(before)} ← ${faBytes(after)}. حالا اسمشان را بنویسید.`,
      );
    }
  }

  function update(id: string, patch: Partial<Decor>) {
    setItems(items.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  return (
    <div className="admin-gallery">
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>کاتالوگ دکورها</h2>
            <p>
              صفحه عمومی:{" "}
              <a href={DECOR_PATH} target="_blank" rel="noreferrer" dir="ltr">
                {DECOR_PATH}
              </a>{" "}
              — مشتری روی ♡ می‌زند و شماره‌ها را برایتان می‌فرستد.
            </p>
          </div>
          <Switch
            checked={s.decors.enabled}
            onChange={(v) => {
              const next = { ...s, decors: { ...s.decors, enabled: v } };
              setS(next);
              void persist(next, v ? "کاتالوگ دکور فعال شد ✓" : "کاتالوگ دکور پنهان شد");
            }}
            label="فعال"
          />
        </div>

        <div className="admin-cat-tabs" role="tablist" aria-label="دسته دکورهای جدید">
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === cat}
              className={c === cat ? "is-active" : undefined}
              style={{ ["--c" as string]: GALLERY_THEMES[c].accent }}
              onClick={() => setCat(c)}
            >
              {GALLERY_THEMES[c].label}
            </button>
          ))}
        </div>

        <ImagePicker
          multiple
          title={`+ افزودن دکور به «${GALLERY_THEMES[cat].label}»`}
          busy={busy || undefined}
          onFiles={onFiles}
        />

        {duplicates.length ? (
          <p className="admin-error">
            شماره تکراری: {duplicates.map((n) => toFaDigits(n)).join("، ")} — هر دکور باید شماره یکتا داشته باشد.
          </p>
        ) : null}

        {items.length ? (
          <div className="admin-gallery__grid admin-decor__grid">
            {items.map((d) => (
              <figure key={d.id} className={`admin-gallery__item${d.visible ? "" : " is-hidden"}`}>
                <div className="admin-decor__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.imageUrl} alt="" loading="lazy" />
                  <span>{toFaDigits(d.number)}</span>
                </div>
                <label className="admin-decor__field">
                  شماره
                  <input
                    inputMode="numeric"
                    value={toFaDigits(d.number)}
                    onChange={(e) => {
                      const n = parseFaNumber(e.target.value);
                      if (Number.isFinite(n) && n > 0) update(d.id, { number: Math.min(n, 9999) });
                    }}
                  />
                </label>
                <input
                  value={d.name}
                  maxLength={80}
                  placeholder="نام دکور، مثلاً «ابر و ماه»"
                  onChange={(e) => update(d.id, { name: e.target.value })}
                />
                <input
                  value={d.note}
                  maxLength={300}
                  placeholder="توضیح (اختیاری)"
                  onChange={(e) => update(d.id, { note: e.target.value })}
                />
                <div className="admin-gallery__tools admin-decor__tools">
                  <select
                    value={d.category}
                    aria-label="دسته"
                    onChange={(e) => update(d.id, { category: e.target.value as GalleryCategory })}
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {GALLERY_THEMES[c].label}
                      </option>
                    ))}
                  </select>
                  <Switch checked={d.visible} onChange={(v) => update(d.id, { visible: v })} label="نمایش" />
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    aria-label="حذف"
                    onClick={() => {
                      if (window.confirm(`دکور ${toFaDigits(d.number)} حذف شود؟`)) {
                        setItems(items.filter((x) => x.id !== d.id));
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <p className="hero-upload__hint" style={{ textAlign: "center", padding: "1.2rem 0" }}>
            هنوز دکوری اضافه نشده است.
          </p>
        )}
      </section>

      <div className="admin-savebar glass-strong">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button
          className="admin-btn"
          type="button"
          disabled={!dirty || Boolean(busy) || duplicates.length > 0}
          onClick={() => persist(s)}
        >
          {dirty ? "ذخیره تغییرات" : "همه چیز ذخیره است"}
        </button>
      </div>
    </div>
  );
}
