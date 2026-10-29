"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, PinIcon } from "./Icons";

type Props = {
  title?: string;
  address: string;
  mapsUrl?: string;
  showMaps?: boolean;
};

export function AddressCard({ title, address, mapsUrl = "", showMaps = false }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <section className="solid-card link-address" data-reveal>
      <span className="link-address__pin" aria-hidden="true">
        <PinIcon size={22} />
      </span>
      {title ? <h2>{title}</h2> : null}
      <p>{address}</p>
      <div className="link-address__actions">
        <button type="button" className="chip-btn" onClick={copy} aria-live="polite">
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? "کپی شد" : "کپی آدرس"}</span>
        </button>
        {showMaps && mapsUrl ? (
          <a className="chip-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <PinIcon size={16} />
            <span>نمایش روی نقشه</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
