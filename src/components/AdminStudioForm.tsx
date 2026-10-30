"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUnsavedGuard } from "@/lib/unsaved";
import type { SiteSettings, StudioInfo } from "@/lib/types";
import { saveSettings } from "./AdminSettingsForm";

type Override = { title: string; slug: string; fields: string[] };

const FIELDS: { key: keyof StudioInfo; label: string; hint?: string; ltr?: boolean; multiline?: boolean; placeholder?: string }[] = [
  { key: "phone", label: "شماره تماس", hint: "برای دکمه «تماس با آتلیه»", ltr: true, placeholder: "09121234567" },
  { key: "addressTitle", label: "عنوان کارت آدرس", placeholder: "آدرس آتلیه آلما" },
  { key: "address", label: "آدرس", multiline: true },
  { key: "mapsUrl", label: "لینک گوگل‌مپ", ltr: true, placeholder: "https://maps.google.com/…" },
  { key: "neshanUrl", label: "لینک نشان", ltr: true, placeholder: "https://nshn.ir/…" },
  { key: "instagramUrl", label: "لینک اینستاگرام", ltr: true, placeholder: "https://instagram.com/…" },
  { key: "baleUrl", label: "لینک بله", ltr: true, placeholder: "https://ble.ir/…" },
];

export function AdminStudioForm({ initial, overrides }: { initial: SiteSettings; overrides: Override[] }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(s.studio) !== JSON.stringify(initial.studio);
  useUnsavedGuard(dirty);

  const [synced, setSynced] = useState(initial);
  if (synced !== initial) {
    setSynced(initial);
    setS(initial);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      setS(await saveSettings(s));
      setMessage("ذخیره شد ✓ — همه لینک‌ها به‌روز شدند");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-settings" onSubmit={save}>
      <section className="admin-card glass admin-section">
        <div className="admin-grid">
          {FIELDS.map((f) => (
            <label key={f.key} className={f.multiline ? "span-2" : undefined}>
              {f.label}
              {f.multiline ? (
                <textarea
                  value={s.studio[f.key]}
                  onChange={(e) => {
                    setS((p) => ({ ...p, studio: { ...p.studio, [f.key]: e.target.value } }));
                    setMessage("");
                  }}
                />
              ) : (
                <input
                  value={s.studio[f.key]}
                  dir={f.ltr ? "ltr" : undefined}
                  inputMode={f.key === "phone" ? "tel" : f.ltr ? "url" : undefined}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    setS((p) => ({ ...p, studio: { ...p.studio, [f.key]: e.target.value } }));
                    setMessage("");
                  }}
                />
              )}
              {f.hint ? <small>{f.hint}</small> : null}
            </label>
          ))}
        </div>
        <p className="hero-upload__hint">
          اینکه هر دکمه روی کدام لینک نمایش داده شود، در ویرایش همان لینک (بخش «تماس و آدرس») روشن/خاموش می‌شود.
        </p>
      </section>

      {overrides.length ? (
        <section className="admin-card glass admin-section">
          <h2>لینک‌هایی که مقدار مخصوص خودشان را دارند</h2>
          <p className="hero-upload__hint">
            این موارد روی آن لینک به‌جای اطلاعات بالا نمایش داده می‌شوند (مثلاً آدرس باغ برای صفحه‌های فضای باز).
          </p>
          <ul className="override-list">
            {overrides.map((o) => (
              <li key={o.slug}>
                <Link href={`/admin/${o.slug}`}>{o.title}</Link>
                <span>{o.fields.join("، ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="admin-savebar glass-strong">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        {!message && !error && dirty ? <p className="admin-dirty">تغییرات ذخیره نشده</p> : null}
        <button className="admin-btn" type="submit" disabled={saving || !dirty}>
          {saving ? "در حال ذخیره..." : dirty ? "ذخیره" : "ذخیره شده"}
        </button>
      </div>
    </form>
  );
}
