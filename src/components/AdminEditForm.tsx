"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { LinkPageContent, SiteSettings, StudioInfo } from "@/lib/types";
import { publicPathForSlug } from "@/lib/routes";
import { normalizeMediaUrl } from "@/lib/media";
import { withStudio } from "@/lib/studio";
import { confirmLeave, useUnsavedGuard } from "@/lib/unsaved";
import { HeroImageField } from "@/components/HeroImageField";
import { Switch } from "./AdminSettingsForm";
import { SimpleTextEditor } from "./SimpleTextEditor";
import { LivePreview } from "./LivePreview";
import { ChevronDownIcon } from "./Icons";

function Section({
  title,
  hint,
  open = false,
  children,
}: {
  title: string;
  hint?: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="edit-section" open={open}>
      <summary>
        <span>
          <strong>{title}</strong>
          {hint ? <small>{hint}</small> : null}
        </span>
        <ChevronDownIcon className="edit-section__chev" />
      </summary>
      <div className="edit-section__body">{children}</div>
    </details>
  );
}

/** A contact field that falls back to the studio info when left empty. */
function StudioField({
  label,
  value,
  studioValue,
  onChange,
  ltr = false,
  multiline = false,
  inputMode,
}: {
  label: string;
  value: string;
  studioValue: string;
  onChange: (v: string) => void;
  ltr?: boolean;
  multiline?: boolean;
  inputMode?: "tel" | "url";
}) {
  const own = value.trim().length > 0;
  const common = {
    value,
    dir: ltr ? "ltr" : undefined,
    placeholder: studioValue ? `از اطلاعات آتلیه: ${studioValue}` : "در «اطلاعات آتلیه» وارد نشده",
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  } as const;
  return (
    <label className="studio-field">
      <span className="studio-field__label">
        {label}
        <em className={own ? "is-own" : ""}>{own ? "مخصوص همین لینک" : "از اطلاعات آتلیه"}</em>
      </span>
      {multiline ? <textarea {...common} /> : <input {...common} inputMode={inputMode} />}
      {own ? (
        <button type="button" className="studio-field__reset" onClick={() => onChange("")}>
          برگرداندن به اطلاعات آتلیه
        </button>
      ) : null}
    </label>
  );
}

type Props = { page: LinkPageContent; settings: SiteSettings };

export function AdminEditForm({ page, settings }: Props) {
  const router = useRouter();
  const studio: StudioInfo = settings.studio;
  const [draft, setDraft] = useState<LinkPageContent>({
    ...page,
    heroImageUrl: normalizeMediaUrl(page.heroImageUrl),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // after router.refresh() the server sends a fresh `page`: reset the draft
  const [syncedPage, setSyncedPage] = useState(page);
  if (syncedPage !== page) {
    setSyncedPage(page);
    setDraft({ ...page, heroImageUrl: normalizeMediaUrl(page.heroImageUrl) });
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify({ ...page, heroImageUrl: normalizeMediaUrl(page.heroImageUrl) });
  useUnsavedGuard(dirty);

  function updateField<K extends keyof LinkPageContent>(key: K, value: LinkPageContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setMessage("");
  }

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = { ...draft, heroImageUrl: normalizeMediaUrl(draft.heroImageUrl) };
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: payload }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "ذخیره ناموفق بود");
        return;
      }
      setMessage("ذخیره شد ✓");
      router.refresh();
    } catch {
      setError("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  const effective = withStudio(draft, studio);

  return (
    <form className="edit-form" onSubmit={onSave}>
      <header className="edit-form__head">
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => confirmLeave(dirty) && router.push("/admin")}
        >
          بازگشت به پنل
        </button>
        <h1>{draft.title || page.title}</h1>
        <p>
          <a href={publicPathForSlug(page.slug)} target="_blank" rel="noreferrer" dir="ltr">
            {publicPathForSlug(page.slug)}
          </a>
          {!draft.published ? <span className="draft-badge">پیش‌نویس — مشتری نمی‌بیند</span> : null}
        </p>
      </header>

      <Section title="متن صفحه" hint="عنوان، متن اصلی، نکات و پیام پایانی" open>
        <label>
          عنوان صفحه
          <input value={draft.title} onChange={(e) => updateField("title", e.target.value)} required />
        </label>
        <label>
          یک خط زیر عنوان
          <input value={draft.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
        </label>
        <label>
          جمله کوتاه بالای عنوان
          <input
            value={draft.moodTag}
            placeholder="مثلاً: حرفه‌ای و صمیمی"
            onChange={(e) => updateField("moodTag", e.target.value)}
          />
        </label>
        <div className="admin-field">
          <span>متن اصلی</span>
          <SimpleTextEditor
            label="متن اصلی"
            value={draft.bodyHtml}
            onChange={(html) => updateField("bodyHtml", html)}
            placeholder="متن خوش‌آمد و توضیحات را اینجا بنویسید…"
          />
        </div>
        <label>
          نکات مهم (هر خط یک نکته)
          <textarea
            value={draft.notesText}
            onChange={(e) => updateField("notesText", e.target.value)}
            style={{ minHeight: 110 }}
          />
        </label>
        <label>
          پیام پایانی
          <input value={draft.closingMessage} onChange={(e) => updateField("closingMessage", e.target.value)} />
        </label>
      </Section>

      <Section title="عکس بالای صفحه" hint="عکسی که اول صفحه و در انیمیشن ورود دیده می‌شود">
        <HeroImageField
          label="عکس اصلی بالای صفحه"
          value={draft.heroImageUrl}
          onChange={(url) => updateField("heroImageUrl", url)}
          onMessage={setMessage}
          onError={setError}
        />
      </Section>

      <Section
        title="تماس و آدرس"
        hint="خالی = از «اطلاعات آتلیه»؛ فقط اگر این لینک فرق دارد پر کنید"
      >
        <div className="switch-grid">
          <Switch
            checked={draft.showAddress}
            onChange={(v) => updateField("showAddress", v)}
            label="نمایش کارت آدرس"
          />
          <Switch
            checked={draft.showMaps}
            onChange={(v) => updateField("showMaps", v)}
            label="دکمه گوگل‌مپ"
          />
          <Switch
            checked={draft.showNeshan}
            onChange={(v) => updateField("showNeshan", v)}
            label="دکمه نشان"
          />
          <Switch
            checked={draft.showInstagram}
            onChange={(v) => updateField("showInstagram", v)}
            label="دکمه اینستاگرام"
          />
          <Switch checked={draft.showBale} onChange={(v) => updateField("showBale", v)} label="دکمه بله" />
        </div>
        <StudioField
          label="شماره تماس"
          value={draft.phone}
          studioValue={studio.phone}
          onChange={(v) => updateField("phone", v)}
          ltr
          inputMode="tel"
        />
        {!effective.phone.trim() ? (
          <p className="hero-upload__hint">بدون شماره، دکمه «تماس با آتلیه» روی این صفحه نمایش داده نمی‌شود.</p>
        ) : null}
        {draft.showAddress ? (
          <>
            <StudioField
              label="عنوان آدرس"
              value={draft.addressTitle}
              studioValue={studio.addressTitle}
              onChange={(v) => updateField("addressTitle", v)}
            />
            <StudioField
              label="آدرس"
              value={draft.address}
              studioValue={studio.address}
              onChange={(v) => updateField("address", v)}
              multiline
            />
          </>
        ) : null}
        {draft.showMaps ? (
          <StudioField
            label="لینک گوگل‌مپ"
            value={draft.mapsUrl}
            studioValue={studio.mapsUrl}
            onChange={(v) => updateField("mapsUrl", v)}
            ltr
            inputMode="url"
          />
        ) : null}
        {draft.showNeshan ? (
          <StudioField
            label="لینک نشان"
            value={draft.neshanUrl}
            studioValue={studio.neshanUrl}
            onChange={(v) => updateField("neshanUrl", v)}
            ltr
            inputMode="url"
          />
        ) : null}
        {draft.showInstagram ? (
          <StudioField
            label="لینک اینستاگرام"
            value={draft.instagramUrl}
            studioValue={studio.instagramUrl}
            onChange={(v) => updateField("instagramUrl", v)}
            ltr
            inputMode="url"
          />
        ) : null}
        {draft.showBale ? (
          <StudioField
            label="لینک بله"
            value={draft.baleUrl}
            studioValue={studio.baleUrl}
            onChange={(v) => updateField("baleUrl", v)}
            ltr
            inputMode="url"
          />
        ) : null}
      </Section>

      <Section title="پکیج‌ها" hint="کارت‌های قیمت این صفحه">
        <label>
          کدام پکیج‌ها نمایش داده شوند؟
          <select
            value={draft.packageFilter}
            onChange={(e) => updateField("packageFilter", e.target.value as LinkPageContent["packageFilter"])}
          >
            <option value="none">هیچ‌کدام</option>
            <option value="all">همه پکیج‌ها</option>
            <option value="pregnancy">فقط بارداری</option>
            <option value="newborn">فقط نوزاد</option>
            <option value="kids">فقط کودک</option>
          </select>
          <small className="hero-upload__hint">پکیج‌ها را در «پنل ← پکیج‌ها و قیمت» تعریف کنید.</small>
        </label>
        {draft.packageFilter === "none" ? (
          <label>
            یا یک فهرست ساده (هر خط یک مورد — اختیاری)
            <textarea
              value={draft.packagesText}
              onChange={(e) => updateField("packagesText", e.target.value)}
              style={{ minHeight: 100 }}
            />
          </label>
        ) : null}
      </Section>

      <Section title="پیشرفته" hint="معمولاً نیازی به تغییر نیست">
        <label>
          متن انیمیشن ورود
          <input
            value={draft.introLabel}
            placeholder="مثلاً: لحظه‌های ماندگار"
            onChange={(e) => updateField("introLabel", e.target.value)}
          />
        </label>
        <label>
          نام آتلیه روی عکس
          <input value={draft.brandLabel} onChange={(e) => updateField("brandLabel", e.target.value)} />
        </label>
      </Section>

      <div className="admin-savebar glass-strong edit-form__savebar">
        <Switch
          checked={draft.published}
          onChange={(v) => updateField("published", v)}
          label={draft.published ? "منتشر" : "پیش‌نویس"}
        />
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        {!error && !message && dirty ? <p className="admin-dirty">تغییرات ذخیره نشده</p> : null}
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPreviewOpen(true)}>
          پیش‌نمایش
        </button>
        <button className="admin-btn" type="submit" disabled={saving || !dirty}>
          {saving ? "در حال ذخیره..." : dirty ? "ذخیره" : "ذخیره شده"}
        </button>
      </div>

      <LivePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        page={effective}
        settings={settings}
      />
    </form>
  );
}
