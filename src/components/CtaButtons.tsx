"use client";

import { useTrack } from "@/lib/track-context";
import { ChatIcon, InstagramIcon } from "./Icons";

type Props = {
  showInstagram: boolean;
  instagramUrl: string;
  showBale: boolean;
  baleUrl: string;
  garden?: boolean;
};

/** Social / messenger links at the end of the page (Instagram + optional Bale). */
export function CtaButtons({
  showInstagram,
  instagramUrl,
  showBale,
  baleUrl,
  garden = false,
}: Props) {
  const instagram = showInstagram && Boolean(instagramUrl);
  const bale = showBale && Boolean(baleUrl);
  const trackEvent = useTrack();
  if (!instagram && !bale) return null;

  return (
    <div className="cta-stack" data-reveal>
      <p className="cta-heading">با ما در ارتباط باشید</p>
      <div className={`social-row${instagram && bale ? " social-row--two" : ""}`}>
        {instagram ? (
          <a
            className={`cta-btn cta-btn--shine${garden ? " cta-btn--garden" : ""}`}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("instagram")}
          >
            <InstagramIcon />
            <span>اینستاگرام</span>
          </a>
        ) : null}
        {bale ? (
          <a
            className="cta-btn cta-btn--ghost"
            href={baleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("bale")}
          >
            <ChatIcon />
            <span>پیام در بله</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
