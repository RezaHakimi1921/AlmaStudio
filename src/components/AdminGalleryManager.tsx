"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_PATH, GALLERY_THEMES } from "@/lib/gallery";
import { toFaDigits } from "@/lib/tehran";
import type { GalleryCategory, GalleryImage, SiteSettings } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { Switch, saveSettings } from "./AdminSettingsForm";

export function AdminGalleryManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [s, setS] = useState<SiteSettings>(initial);
  const [cat, setCat] = useState<GalleryCategory>("newborn");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const images = s.gallery.images;
  const inCat = images.filter((i) => i.category === cat);

  function setImages(next: GalleryImage[]) {
    setS((p) => ({ ...p, gallery: { ...p.gallery, images: next } }));
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

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setMessage("");
    const added: GalleryImage[] = [];
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      setBusy(`در حال آپلود ${toFaDigits(i + 1)} از ${toFaDigits(list.length)}…`);
      const body = new FormData();
      body.append("file", list[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
        if (!res.ok || !data.ok || !data.url) {
          setError(`${list[i].name}: ${data.error || "آپلود ناموفق"}`);
          continue;
        }
        added.push({
          id: `img-${Date.now()}-${i}`,
          url: data.url,
          caption: "",
          category: cat,
        });
      } catch {
        setError(`${list[i].name}: خطا در آپلود`);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
    setBusy("");
    if (added.length) {
      const next = { ...s, gallery: { ...s.gallery, images: [...added, ...s.gallery.images] } };
      setS(next);
      await persist(next, `${toFaDigits(added.length)} تصویر اضافه و ذخیره شد ✓`);
    }
  }

  function update(id: string, patch: Partial<GalleryImage>) {
    setImages(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  }

  function move(id: string, dir: -1 | 1) {
    const ids = inCat.map((i) => i.id);
    const idx = ids.indexOf(id);
    const swapWith = ids[idx + dir];
    if (!swapWith) return;
    const a = images.findIndex((i) => i.id === id);
    const b = images.findIndex((i) => i.id === swapWith);
    const next = [...images];
    [next[a], next[b]] = [next[b], next[a]];
    setImages(next);
  }

  return (
    <div className="admin-gallery">
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>نمایش گالری</h2>
            <p>
              صفحه عمومی:{" "}
              <a href={GALLERY_PATH} target="_blank" rel="noreferrer" dir="ltr">
                {GALLERY_PATH}
              </a>{" "}
              — روی هر لینک هم یک کارت «نمونه‌کارها» نمایش داده می‌شود.
            </p>
          </div>
          <Switch
            checked={s.gallery.enabled}
            onChange={(v) => {
              const next = { ...s, gallery: { ...s.gallery, enabled: v } };
              setS(next);
              void persist(next, v ? "گالری فعال شد ✓" : "گالری پنهان شد");
            }}
            label="فعال"
          />
        </div>

        <div className="admin-cat-tabs" role="tablist">
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
              <small>{toFaDigits(images.filter((i) => i.category === c).length)}</small>
            </button>
          ))}
        </div>

        <label className="admin-dropzone">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={Boolean(busy)}
            onChange={(e) => onFiles(e.target.files)}
          />
          <strong>{busy || `+ افزودن تصویر به «${GALLERY_THEMES[cat].label}»`}</strong>
          <span>چند تصویر را با هم انتخاب کنید · JPG / PNG / WebP تا ۸ مگابایت</span>
        </label>

        {inCat.length ? (
          <div className="admin-gallery__grid">
            {inCat.map((img, i) => (
              <figure key={img.id} className="admin-gallery__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" loading="lazy" />
                <input
                  value={img.caption}
                  maxLength={120}
                  placeholder="توضیح کوتاه (اختیاری)"
                  onChange={(e) => update(img.id, { caption: e.target.value })}
                />
                <div className="admin-gallery__tools">
                  <button type="button" className="admin-icon-btn" onClick={() => move(img.id, -1)} disabled={i === 0} aria-label="جلوتر">
                    ▶
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => move(img.id, 1)}
                    disabled={i === inCat.length - 1}
                    aria-label="عقب‌تر"
                  >
                    ◀
                  </button>
                  <select
                    value={img.category}
                    aria-label="دسته"
                    onChange={(e) => update(img.id, { category: e.target.value as GalleryCategory })}
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {GALLERY_THEMES[c].label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    aria-label="حذف"
                    onClick={() => {
                      if (window.confirm("این تصویر از گالری حذف شود؟")) {
                        setImages(images.filter((x) => x.id !== img.id));
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
            هنوز تصویری در این دسته نیست.
          </p>
        )}
      </section>

      <div className="admin-savebar glass-strong">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button className="admin-btn" type="button" disabled={!dirty || Boolean(busy)} onClick={() => persist(s)}>
          {dirty ? "ذخیره تغییرات" : "همه چیز ذخیره است"}
        </button>
      </div>
    </div>
  );
}
