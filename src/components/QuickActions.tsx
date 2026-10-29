"use client";

import { CallButton } from "./CallButton";
import { InstagramIcon, PinIcon } from "./Icons";

type Props = {
  phone: string;
  garden?: boolean;
  brand?: string;
  showInstagram: boolean;
  instagramUrl: string;
  showMaps: boolean;
  mapsUrl: string;
};

/** Thumb-friendly shortcuts right under the hero — the 3 things visitors want most. */
export function QuickActions({
  phone,
  garden = false,
  brand,
  showInstagram,
  instagramUrl,
  showMaps,
  mapsUrl,
}: Props) {
  return (
    <div className="quick-actions" data-reveal>
      <div className="quick-actions__item">
        <CallButton phone={phone} garden={garden} brand={brand} className="quick-btn">
          <span className="sr-only">تماس</span>
        </CallButton>
        <span className="quick-actions__label">تماس</span>
      </div>

      {showMaps && mapsUrl ? (
        <div className="quick-actions__item">
          <a className="quick-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <PinIcon size={22} />
            <span className="sr-only">مسیریاب</span>
          </a>
          <span className="quick-actions__label">مسیریاب</span>
        </div>
      ) : null}

      {showInstagram && instagramUrl ? (
        <div className="quick-actions__item">
          <a className="quick-btn" href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={22} />
            <span className="sr-only">اینستاگرام</span>
          </a>
          <span className="quick-actions__label">اینستاگرام</span>
        </div>
      ) : null}
    </div>
  );
}
