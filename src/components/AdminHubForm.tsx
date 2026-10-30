"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeMediaUrl } from "@/lib/media";
import type { HubSettings, SiteSettings } from "@/lib/types";
import { HeroImageField } from "./HeroImageField";

export function AdminHubForm({ hub, settings }: { hub: HubSettings; settings: SiteSettings }) {
  const router = useRouter();
  const [draft, setDraft] = useState<HubSettings>({
    ...hub,
    heroImageUrl: normalizeMediaUrl(hub.heroImageUrl),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [synced, setSynced] = useState(hub);
  if (synced !== hub) {
    setSynced(hub);
    setDraft({ ...hub, heroImageUrl: normalizeMediaUrl(hub.heroImageUrl) });
  }

  function updateField<K extends keyof HubSettings>(key: K, value: HubSettings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const next: SiteSettings = {
        ...settings,
        hub: {
          title: draft.title.trim() || settings.hub.title,
          subtitle: draft.subtitle.trim(),
          heroImageUrl: normalizeMediaUrl(draft.heroImageUrl) || settings.hub.heroImageUrl,
        },
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: next }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "ذخیره ناموفق بود");
        return;
      }
      setMessage("هاب ذخیره شد");
      router.refresh();
    } catch {
      setError("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form admin-card glass" onSubmit={onSave}>
      <h2 style={{ margin: 0, color: "var(--alma-red)" }}>هاب اصلی (/)</h2>
      <p style={{ margin: 0, color: "var(--alma-muted)" }}>
        تصویر، عنوان و زیرعنوان شیشه‌ای صفحهٔ ورود — برای مشتریان روی alma.artepersia.com
      </p>

      <label>
        عنوان هاب
        <input
          value={draft.title}
          maxLength={80}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
      </label>
      <label>
        زیرعنوان هاب
        <input
          value={draft.subtitle}
          maxLength={200}
          onChange={(e) => updateField("subtitle", e.target.value)}
          required
        />
      </label>

      <HeroImageField
        label="تصویر هیرو هاب"
        value={draft.heroImageUrl}
        onChange={(url) => updateField("heroImageUrl", url)}
        onMessage={setMessage}
        onError={setError}
      />

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <div className="admin-actions">
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره هاب"}
        </button>
        <a className="admin-btn admin-btn--ghost" href="/" target="_blank" rel="noreferrer">
          مشاهده هاب
        </a>
      </div>
    </form>
  );
}