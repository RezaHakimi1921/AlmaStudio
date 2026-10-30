"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { Switch, saveSettings } from "./AdminSettingsForm";

/** Switch the announcement ribbon on/off right from the dashboard. */
export function AnnouncementQuickToggle({
  initial,
  status,
  live,
}: {
  initial: SiteSettings;
  status: string;
  live: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(initial.announcement.enabled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle(v: boolean) {
    setOn(v);
    setBusy(true);
    setError("");
    try {
      // re-read so a change made in another tab is not overwritten
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = (await res.json()) as { settings?: SiteSettings };
      const base = data.settings ?? initial;
      await saveSettings({ ...base, announcement: { ...base.announcement, enabled: v } });
      router.refresh();
    } catch (err) {
      setOn(!v);
      setError((err as Error).message || "ذخیره نشد");
    } finally {
      setBusy(false);
    }
  }

  const text = initial.announcement.text.trim();

  return (
    <section className={`dash-ann${live ? " is-live" : ""}`}>
      <div className="dash-ann__copy">
        <span>نوار اطلاعیه · {status}</span>
        <strong>{text || "متنی برای اطلاعیه نوشته نشده"}</strong>
        {error ? <em className="admin-error">{error}</em> : null}
      </div>
      <div className="dash-ann__actions">
        <Switch checked={on} onChange={(v) => !busy && text && toggle(v)} label={busy ? "…" : on ? "روشن" : "خاموش"} />
        <Link href="/admin/settings" className="chip-btn">
          ویرایش
        </Link>
      </div>
    </section>
  );
}
