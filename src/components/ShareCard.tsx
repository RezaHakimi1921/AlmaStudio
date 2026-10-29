"use client";

import { useState } from "react";
import { useTrack } from "@/lib/track-context";
import { CheckIcon, HeartIcon, ShareIcon } from "./Icons";

/** "Send to your partner" — native share sheet, falls back to copying the link. */
export function ShareCard({ title, garden = false }: { title: string; garden?: boolean }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrack();

  async function share() {
    // shared links are tagged so the stats show visits that came via the partner
    const url = `${window.location.origin}${window.location.pathname}?src=hamrah`;
    const text = `${title} — آتلیه آلما`;
    trackEvent("share");
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("این لینک را کپی کنید:", url);
    }
  }

  return (
    <section className="share-card" data-reveal>
      <span className="share-card__heart" aria-hidden="true">
        <HeartIcon size={20} />
      </span>
      <div className="share-card__copy">
        <h2>این صفحه را برای همراهتان بفرستید</h2>
        <p>تا هر دو با آمادگی کامل به آتلیه بیایید.</p>
      </div>
      <button
        type="button"
        className={`cta-btn share-card__btn${garden ? " cta-btn--garden" : ""}`}
        onClick={share}
      >
        {copied ? <CheckIcon size={16} /> : <ShareIcon />}
        <span>{copied ? "لینک کپی شد" : "ارسال برای همراه"}</span>
      </button>
    </section>
  );
}
