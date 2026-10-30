"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_PATH, GALLERY_THEMES } from "@/lib/gallery";
import { toFaDigits } from "@/lib/tehran";
import type { GalleryCategory, GalleryImage, SiteSettings } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { uploadImage } from "@/lib/upload-client";
import { faBytes } from "@/lib/upload-limits";
import { Switch, saveSettings } from "./AdminSettingsForm";
import { ImagePicker } from "./ImagePicker";
import { useUndo } from "./UndoToast";
import { moveItem, useSortable } from "@/lib/sortable";
import { useUnsavedGuard } from "@/lib/unsaved";

export function AdminGalleryManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [cat, setCat] = useState<GalleryCategory>("newborn");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const images = s.gallery.images;
  const inCat = images.filter((i) => i.category === cat);
  const { handleProps, itemProps } = useSortable(inCat.length, moveInCat);
  const { offer, toast } = useUndo();
  useUnsavedGuard(dirty);

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

  async function onFiles(files: File[]) {
    if (!files.length) return;
    setError("");
    setMessage("");
    const added: GalleryImage[] = [];
    const list = files;
    let before = 0;
    let after = 0;
    for (let i = 0; i < list.length; i++) {
      setBusy(`در حال آپلود و فشرده‌سازی ${toFaDigits(i + 1)} از ${toFaDigits(list.length)}…`);
      try {
        const r = await uploadImage(list[i], "gallery");
        before += r.originalBytes;
        after += r.savedBytes;
        added.push({ id: `img-${Date.now()}-${i}`, url: r.url, caption: "", category: cat });
      } catch (err) {
        setError((err as Error).message || `${list[i].name}: خطا در آپلود`);
      }
    }
    setBusy("");
    if (added.length) {
      const next = { ...s, gallery: { ...s.gallery, images: [...added, ...s.gallery.images] } };
      setS(next);
      await persist(
        next,
        `${toFaDigits(added.length)} تصویر اضافه شد ✓ — حجم ${faBytes(before)} ← ${faBytes(after)}`,
      );
    }
  }

  function update(id: string, patch: Partial<GalleryImage>) {
    setImages(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  }

  /** reorder inside the visible category; other categories keep their order */
  function moveInCat(from: number, to: number) {
    setS((p) => {
      const all = p.gallery.images;
      const ids = all.filter((i) => i.category === cat).map((i) => i.id);
      const reordered = moveItem(ids, from, to);
      const byId = new Map(all.map((i) => [i.id, i]));
      let k = 0;
      const next = all.map((i) => (i.category === cat ? byId.get(reordered[k++])! : i));
      return { ...p, gallery: { ...p.gallery, images: next } };
    });
    setDirty(true);
    setMessage("");
  }

  function remove(img: GalleryImage) {
    const index = images.findIndex((x) => x.id === img.id);
    setImages(images.filter((x) => x.id !== img.id));
    offer("عکس از گالری حذف شد", () => {
      setS((p) => {
        const list = [...p.gallery.images];
        list.splice(Math.min(index, list.length), 0, img);
        return { ...p, gallery: { ...p.gallery, images: list } };
      });
      setDirty(true);
    });
  }


  return (
    <div className="admin-gallery">
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>نمایش گالری</h2>
            <p>
              عکس‌ها را با ⠿ بکشید تا ترتیبشان عوض شود. صفحه عمومی:{" "}
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

        <ImagePicker
          multiple
          title={`+ افزودن تصویر به «${GALLERY_THEMES[cat].label}»`}
          busy={busy || undefined}
          onFiles={onFiles}
        />

        {inCat.length ? (
          <div className="admin-gallery__grid">
            {inCat.map((img, i) => (
              <figure key={img.id} className="admin-gallery__item" {...itemProps(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" loading="lazy" />
                <input
                  value={img.caption}
                  maxLength={120}
                  placeholder="توضیح کوتاه (اختیاری)"
                  onChange={(e) => update(img.id, { caption: e.target.value })}
                />
                <div className="admin-gallery__tools">
                  <button {...handleProps(i)}>⠿</button>
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
                    onClick={() => remove(img)}
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

      {toast}
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
