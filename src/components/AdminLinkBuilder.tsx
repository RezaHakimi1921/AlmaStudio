"use client";

import { useState } from "react";
import { useIsClient } from "@/lib/client";
import { KNOWN_SOURCES, SOURCE_RE } from "@/lib/sources";
import { CheckIcon, CopyIcon } from "./Icons";

type PageOption = { path: string; label: string };

const CHANNELS = ["insta", "bale", "sms", "whatsapp", "telegram", "eitaa", "rubika", "card"];

/** Builds tagged links ("?src=insta") so the stats can tell which channel works. */
export function AdminLinkBuilder({ pages }: { pages: PageOption[] }) {
  const [path, setPath] = useState(pages[0]?.path ?? "/");
  const [channel, setChannel] = useState("insta");
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState(false);

  const src = channel === "custom" ? custom.trim().toLowerCase() : channel;
  const valid = SOURCE_RE.test(src);
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const url = `${origin}${path}?src=${src}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("کپی کنید:", url);
    }
  }

  return (
    <div className="link-builder">
      <div className="admin-grid">
        <label>
          صفحه
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          کجا می‌گذارید؟
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {KNOWN_SOURCES[c]}
              </option>
            ))}
            <option value="custom">کانال دیگر…</option>
          </select>
        </label>
        {channel === "custom" ? (
          <label className="span-2">
            نام کوتاه انگلیسی کانال (حروف کوچک، عدد، خط تیره)
            <input
              dir="ltr"
              value={custom}
              maxLength={24}
              placeholder="yalda-campaign"
              onChange={(e) => setCustom(e.target.value)}
            />
          </label>
        ) : null}
      </div>
      <div className="link-builder__out">
        <code dir="ltr">{valid ? url : "—"}</code>
        <button type="button" className="chip-btn" disabled={!valid} onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? "کپی شد" : "کپی لینک"}</span>
        </button>
      </div>
    </div>
  );
}
