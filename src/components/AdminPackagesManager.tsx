"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_THEMES } from "@/lib/gallery";
import { faMoney, parseFaNumber, toFaDigits } from "@/lib/tehran";
import type { GalleryCategory, SiteSettings, StudioPackage } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { Switch, saveSettings } from "./AdminSettingsForm";
import { PackagesSection } from "./PackagesSection";

/** Money field: type with Persian or English digits, shows ۴٬۵۰۰٬۰۰۰ */
function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
}) {
  return (
    <span className="money-input">
      <input
        inputMode="numeric"
        value={value ? faMoney(value) : ""}
        placeholder={placeholder}
        onChange={(e) => {
          const n = parseFaNumber(e.target.value);
          onChange(Number.isFinite(n) ? Math.min(n, 1e12) : 0);
        }}
      />
      <small>تومان</small>
    </span>
  );
}

export function AdminPackagesManager({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [preview, setPreview] = useState<"all" | GalleryCategory>("all");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  const items = s.packages.items;

  function setItems(next: StudioPackage[]) {
    setS((p) => ({ ...p, packages: { items: next } }));
    setDirty(true);
    setMessage("");
  }
  const update = (id: string, patch: Partial<StudioPackage>) =>
    setItems(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  async function save() {
    setSaving(true);
    setError("");
    try {
      setS(await saveSettings(s));
      setDirty(false);
      setMessage("ذخیره شد ✓");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  // warnings that help the studio catch mistakes before customers see them
  const warnings = items.flatMap((p) => {
    const w: string[] = [];
    const name = p.name || "بدون نام";
    if (!p.name.trim()) w.push("یک پکیج نام ندارد و ذخیره نمی‌شود");
    if (p.price > 0 && p.price < 10000) w.push(`«${name}»: قیمت ${faMoney(p.price)} تومان خیلی کم است — صفرها را چک کنید`);
    if (p.oldPrice && p.oldPrice <= p.price) w.push(`«${name}»: قیمت قبل از تخفیف باید بیشتر از قیمت فعلی باشد`);
    return w;
  });

  const previewList = items.filter(
    (p) => p.visible && p.name.trim() && (preview === "all" || p.category === preview),
  );

  return (
    <div className="admin-gallery">
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>پکیج‌ها</h2>
            <p>
              برای هر صفحه در ویرایش همان صفحه انتخاب کنید کدام پکیج‌ها نمایش داده شوند. پکیجی که «برچسب»
              دارد برجسته نمایش داده می‌شود.
            </p>
          </div>
        </div>

        <div className="admin-faq">
          {items.map((p, i) => (
            <div key={p.id} className={`admin-faq__item${p.visible ? "" : " is-hidden"}`}>
              <div className="admin-faq__bar">
                <strong>پکیج {toFaDigits(i + 1)}</strong>
                <div className="admin-faq__tools">
                  <Switch checked={p.visible} onChange={(v) => update(p.id, { visible: v })} label="نمایش" />
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} aria-label="بالا">
                    ▲
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)} aria-label="پایین">
                    ▼
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    aria-label="حذف"
                    onClick={() => {
                      if (window.confirm(`پکیج «${p.name || "بدون نام"}» حذف شود؟`)) {
                        setItems(items.filter((x) => x.id !== p.id));
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="admin-grid">
                <label>
                  نام پکیج
                  <input
                    value={p.name}
                    maxLength={80}
                    placeholder="مثلاً پکیج طلایی نوزاد"
                    onChange={(e) => update(p.id, { name: e.target.value })}
                  />
                </label>
                <label>
                  دسته
                  <select
                    value={p.category}
                    onChange={(e) => update(p.id, { category: e.target.value as GalleryCategory })}
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {GALLERY_THEMES[c].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  قیمت (خالی = «قیمت با تماس»)
                  <MoneyInput value={p.price} onChange={(n) => update(p.id, { price: n })} placeholder="۴٬۵۰۰٬۰۰۰" />
                </label>
                <label>
                  قیمت قبل از تخفیف (اختیاری)
                  <MoneyInput value={p.oldPrice} onChange={(n) => update(p.id, { oldPrice: n })} />
                </label>
                <label>
                  برچسب (اختیاری)
                  <input
                    value={p.badge}
                    maxLength={30}
                    placeholder="پیشنهاد ما / پرفروش‌ترین"
                    onChange={(e) => update(p.id, { badge: e.target.value })}
                  />
                </label>
                <label>
                  توضیح کوتاه (اختیاری)
                  <input
                    value={p.description}
                    maxLength={300}
                    onChange={(e) => update(p.id, { description: e.target.value })}
                  />
                </label>
                <label className="span-2">
                  امکانات (هر خط یک مورد)
                  <textarea
                    value={p.features.join("\n")}
                    placeholder={"۱۵ عکس ادیت‌شده\n۲ دکور\nآلبوم ۲۰×۳۰"}
                    onChange={(e) => update(p.id, { features: e.target.value.split("\n") })}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() =>
            setItems([
              ...items,
              {
                id: `pkg-${Date.now()}`,
                name: "",
                price: 0,
                oldPrice: 0,
                badge: "",
                description: "",
                features: [],
                category: "newborn",
                visible: true,
              },
            ])
          }
        >
          + افزودن پکیج
        </button>
      </section>

      <section className="admin-card glass admin-section admin-preview-block">
        <div className="admin-section__head">
          <div>
            <h2>پیش‌نمایش — همان چیزی که مشتری می‌بیند</h2>
            <p>قبل از ذخیره قیمت‌ها و متن‌ها را اینجا چک کنید.</p>
          </div>
        </div>
        <div className="admin-cat-tabs">
          {(["all", ...GALLERY_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={preview === c ? "is-active" : undefined}
              onClick={() => setPreview(c)}
            >
              {c === "all" ? "همه" : GALLERY_THEMES[c].label}
            </button>
          ))}
        </div>
        {warnings.length ? (
          <ul className="admin-warnings">
            {warnings.map((w) => (
              <li key={w}>⚠ {w}</li>
            ))}
          </ul>
        ) : null}
        <div className="admin-phone-frame">
          {previewList.length ? (
            <PackagesSection
              packages={previewList.map((p) => ({ ...p, features: p.features.filter((f) => f.trim()) }))}
              garden={preview === "kids"}
              reveal={false}
            />
          ) : (
            <p className="hero-upload__hint" style={{ textAlign: "center", padding: "1.5rem 0" }}>
              پکیج قابل نمایشی در این دسته نیست.
            </p>
          )}
        </div>
      </section>

      <div className="admin-savebar glass-strong">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button className="admin-btn" type="button" disabled={!dirty || saving} onClick={save}>
          {saving ? "در حال ذخیره..." : dirty ? "ذخیره تغییرات" : "همه چیز ذخیره است"}
        </button>
      </div>
    </div>
  );
}
