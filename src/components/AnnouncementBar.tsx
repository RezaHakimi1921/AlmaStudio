"use client";

import { useState } from "react";
import { useClientValue } from "@/lib/client";
import type { Announcement } from "@/lib/types";
import { CloseIcon, SparkIcon } from "./Icons";

function dismissKey(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return `alma-ann-${h}`;
}

/** Campaign / notice ribbon at the very top of the page. Dismissible per session. */
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const key = dismissKey(announcement.text);
  const stored = useClientValue(() => {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  });
  const [closed, setClosed] = useState(false);
  if (closed || stored) return null;

  const festival = announcement.tone === "festival";

  function dismiss() {
    setClosed(true);
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`announce${festival ? " announce--festival" : " announce--info"}`}
      role="region"
      aria-label="اطلاعیه"
    >
      {festival ? (
        <span className="announce__sparkles" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ ["--i" as string]: i }} />
          ))}
        </span>
      ) : null}
      <span className="announce__icon" aria-hidden="true">
        <SparkIcon size={16} />
      </span>
      <p className="announce__text">{announcement.text}</p>
      {announcement.linkUrl && announcement.linkLabel ? (
        <a className="announce__cta" href={announcement.linkUrl} target="_blank" rel="noopener noreferrer">
          {announcement.linkLabel}
        </a>
      ) : null}
      <button type="button" className="announce__close" aria-label="بستن اطلاعیه" onClick={dismiss}>
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
