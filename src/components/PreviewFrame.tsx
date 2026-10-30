"use client";

import { useEffect, useState } from "react";
import { isAnnouncementLive } from "@/lib/announcement";
import type { LinkPageContent, SiteSettings } from "@/lib/types";
import { LinkPageView } from "./LinkPageView";

export type PreviewMessage = {
  type: "alma-preview";
  page: LinkPageContent;
  settings: SiteSettings;
};

/** Renders unsaved admin changes exactly like the public page. */
export function PreviewFrame() {
  const [data, setData] = useState<PreviewMessage | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data as PreviewMessage;
      if (msg?.type === "alma-preview") setData(msg);
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "alma-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!data) return <p className="preview-wait">در حال آماده‌سازی پیش‌نمایش…</p>;

  return (
    <LinkPageView
      key={data.page.slug}
      page={data.page}
      settings={data.settings}
      announcementLive={isAnnouncementLive(data.settings.announcement)}
      preview
    />
  );
}
