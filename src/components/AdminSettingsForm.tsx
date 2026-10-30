"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FA_DAYS, faJalali } from "@/lib/tehran";
import { normalizeMediaUrl } from "@/lib/media";
import type { DayHours, FaqItem, SiteSettings } from "@/lib/types";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeroImageField } from "./HeroImageField";
import { JalaliDatePicker, PersianTimeSelect } from "./JalaliDatePicker";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="admin-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-switch__track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export async function saveSettings(settings: SiteSettings) {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string; settings?: SiteSettings };
  if (!res.ok || !data.ok || !data.settings) throw new Error(data.error || "ذخیره ناموفق بود");
  return data.settings;
}

export function AdminSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // fresh server data after router.refresh() → reset the form (no effect needed)
  const [syncedInitial, setSyncedInitial] = useState(initial);
  if (syncedInitial !== initial) {
    setSyncedInitial(initial);
    setS(initial);
  }

  const a = s.announcement;
  const hub = s.hub;
  const setHub = (patch: Partial<SiteSettings["hub"]>) =>
    setS((p) => ({ ...p, hub: { ...p.hub, ...patch } }));
  const setA = (patch: Partial<SiteSettings["announcement"]>) =>
    setS((p) => ({ ...p, announcement: { ...p.announcement, ...patch } }));
  const setHours = (patch: Partial<SiteSettings["hours"]>) =>
    setS((p) => ({ ...p, hours: { ...p.hours, ...patch } }));
  const setDay = (day: number, patch: Partial<DayHours>) =>
    setHours({ days: s.hours.days.map((d) => (d.day === day ? { ...d, ...patch } : d)) });
  const setFaq = (patch: Partial<SiteSettings["faq"]>) =>
    setS((p) => ({ ...p, faq: { ...p.faq, ...patch } }));
  const setItem = (id: string, patch: Partial<FaqItem>) =>
    setFaq({ items: s.faq.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  const moveItem = (index: number, dir: -1 | 1) => {
    const items = [...s.faq.items];
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    [items[index], items[j]] = [items[j], items[index]];
    setFaq({ items });
  };

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload: SiteSettings = {
        ...s,
        hub: {
          ...s.hub,
          heroImageUrl: normalizeMediaUrl(s.hub.heroImageUrl),
        },
      };
      setS(await saveSettings(payload));
      setMessage("ذخیره شد ✓");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-settings" onSubmit={onSave}>
      {/* ---------------- Hub hero ---------------- */}
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>هاب اصلی (/)</h2>
            <p>
              تصویر، عنوان و زیرعنوان شیشه‌ای صفحهٔ ورود — برای مشتریان روی alma.artepersia.com
            </p>
          </div>
        </div>
        <div className="admin-grid">
          <label>
            عنوان هاب
            <input
              value={hub.title}
              maxLength={80}
              onChange={(e) => setHub({ title: e.target.value })}
              required
            />
          </label>
          <label className="span-2">
            زیرعنوان هاب
            <input
              value={hub.subtitle}
              maxLength={200}
              onChange={(e) => setHub({ subtitle: e.target.value })}
              required
            />
          </label>
        </div>
        <HeroImageField
          label="تصویر هیرو هاب"
          value={hub.heroImageUrl}
          onChange={(url) => setHub({ heroImageUrl: url })}
          onMessage={setMessage}
          onError={setError}
        />
      </section>

      {/* ---------------- Announcement ---------------- */}
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>نوار اطلاعیه</h2>
            <p>برای جشنواره، تخفیف یا تعطیلی — بالای همه صفحه‌ها نمایش داده می‌شود.</p>
          </div>
          <Switch checked={a.enabled} onChange={(v) => setA({ enabled: v })} label="نمایش" />
        </div>

        <div className="admin-grid">
          <label>
            نوع
            <select
              value={a.tone}
              onChange={(e) => setA({ tone: e.target.value === "info" ? "info" : "festival" })}
            >
              <option value="festival">جشنواره و تخفیف (پرزرق‌وبرق)</option>
              <option value="info">اطلاع‌رسانی (آرام)</option>
            </select>
          </label>
          <label className="span-2">
            متن اطلاعیه
            <input
              value={a.text}
              maxLength={220}
              onChange={(e) => setA({ text: e.target.value })}
              placeholder="مثلاً: جشنواره یلدا — ۲۰٪ تخفیف عکاسی نوزاد"
            />
          </label>
          <label>
            متن دکمه (اختیاری)
            <input
              value={a.linkLabel}
              maxLength={40}
              onChange={(e) => setA({ linkLabel: e.target.value })}
              placeholder="رزرو"
            />
          </label>
          <label>
            لینک دکمه (اختیاری)
            <input
              value={a.linkUrl}
              dir="ltr"
              onChange={(e) => setA({ linkUrl: e.target.value })}
              placeholder="https://ble.ir/… یا tel:…"
            />
          </label>
          <div className="admin-field">
            <span>از تاریخ (اختیاری)</span>
            <JalaliDatePicker
              value={a.startDate}
              onChange={(v) => setA({ startDate: v })}
              placeholder="از همین حالا"
              label="تاریخ شروع"
            />
            <small>{a.startDate ? `از ابتدای ${faJalali(a.startDate)} نمایش داده می‌شود` : "از همین حالا"}</small>
          </div>
          <div className="admin-field">
            <span>تا تاریخ (اختیاری)</span>
            <JalaliDatePicker
              value={a.endDate}
              onChange={(v) => setA({ endDate: v })}
              placeholder="بدون پایان"
              label="تاریخ پایان"
            />
            <small>
              {a.endDate ? `تا پایان ${faJalali(a.endDate)} — بعد از آن خودکار پنهان می‌شود` : "بدون پایان"}
            </small>
          </div>
        </div>

        {a.text.trim() ? (
          <div className="admin-preview">
            <span>پیش‌نمایش</span>
            <AnnouncementBar key={`${a.text}-${a.tone}`} announcement={{ ...a, enabled: true }} />
          </div>
        ) : null}
      </section>

      {/* ---------------- Hours ---------------- */}
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>ساعات پذیرش</h2>
            <p>به وقت تهران. روزهای بسته با عبارت «در کنار خانواده‌ایم» نمایش داده می‌شوند.</p>
          </div>
          <Switch checked={s.hours.enabled} onChange={(v) => setHours({ enabled: v })} label="نمایش" />
        </div>

        <div className="admin-hours">
          {s.hours.days.map((d) => (
            <div key={d.day} className={`admin-hours__row${d.open ? "" : " is-closed"}`}>
              <Switch
                checked={d.open}
                onChange={(v) => setDay(d.day, { open: v })}
                label={FA_DAYS[d.day]}
              />
              <span className="admin-hours__label">از</span>
              <PersianTimeSelect
                value={d.from}
                disabled={!d.open}
                label={`شروع ${FA_DAYS[d.day]}`}
                onChange={(v) => setDay(d.day, { from: v })}
              />
              <span className="admin-hours__label">تا</span>
              <PersianTimeSelect
                value={d.to}
                disabled={!d.open}
                label={`پایان ${FA_DAYS[d.day]}`}
                onChange={(v) => setDay(d.day, { to: v })}
              />
            </div>
          ))}
        </div>
        <label>
          توضیح کوتاه (اختیاری)
          <input
            value={s.hours.note}
            maxLength={160}
            onChange={(e) => setHours({ note: e.target.value })}
            placeholder="پذیرش با هماهنگی و رزرو قبلی"
          />
        </label>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="admin-card glass admin-section">
        <div className="admin-section__head">
          <div>
            <h2>سوالات متداول</h2>
            <p>هر سوال را جدا می‌توانید پنهان کنید. ترتیب با دکمه‌های ▲ ▼.</p>
          </div>
          <Switch checked={s.faq.enabled} onChange={(v) => setFaq({ enabled: v })} label="نمایش بخش" />
        </div>

        <div className="admin-faq">
          {s.faq.items.map((item, i) => (
            <div key={item.id} className={`admin-faq__item${item.visible ? "" : " is-hidden"}`}>
              <div className="admin-faq__bar">
                <strong>سوال {(i + 1).toLocaleString("fa-IR")}</strong>
                <div className="admin-faq__tools">
                  <Switch
                    checked={item.visible}
                    onChange={(v) => setItem(item.id, { visible: v })}
                    label="نمایش"
                  />
                  <button type="button" className="admin-icon-btn" onClick={() => moveItem(i, -1)} aria-label="بالا">
                    ▲
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => moveItem(i, 1)} aria-label="پایین">
                    ▼
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn admin-icon-btn--danger"
                    aria-label="حذف"
                    onClick={() => {
                      if (window.confirm("این سوال حذف شود؟")) {
                        setFaq({ items: s.faq.items.filter((x) => x.id !== item.id) });
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <input
                value={item.question}
                onChange={(e) => setItem(item.id, { question: e.target.value })}
                placeholder="متن سوال"
                aria-label="متن سوال"
              />
              <textarea
                value={item.answer}
                onChange={(e) => setItem(item.id, { answer: e.target.value })}
                placeholder="پاسخ"
                aria-label="پاسخ"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() =>
            setFaq({
              items: [
                ...s.faq.items,
                { id: `faq-${Date.now()}`, question: "", answer: "", visible: true },
              ],
            })
          }
        >
          + افزودن سوال
        </button>
        <p className="hero-upload__hint">سوال‌های بدون متن هنگام ذخیره حذف می‌شوند.</p>
      </section>

      <div className="admin-savebar glass-strong">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-ok">{message}</p> : null}
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}
