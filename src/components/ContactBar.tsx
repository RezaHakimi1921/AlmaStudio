"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { hasShotParam, useClientValue, useIsClient } from "@/lib/client";
import { CallButton } from "./CallButton";
import { CloseIcon, NavigateIcon, PinIcon } from "./Icons";

type MapLink = { key: string; label: string; href: string };

type Props = {
  phone: string;
  maps: MapLink[];
  garden?: boolean;
  brand?: string;
  visible?: boolean;
};

/**
 * The single home for "call" and "directions" — always under the thumb.
 * One map app → direct link. Two (Google + Neshan) → a small chooser sheet.
 */
export function ContactBar({ phone, maps, garden = false, brand, visible = true }: Props) {
  const shot = useClientValue(hasShotParam) === true;
  const isClient = useIsClient();
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheet(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const hasPhone = phone.trim().length > 0;
  const hasMaps = maps.length > 0;
  if (!hasPhone && !hasMaps) return null;

  return (
    <>
      <nav
        aria-label="تماس و مسیریابی"
        className={`float-cta glass-strong${garden ? " float-cta--garden" : ""}${hasPhone && hasMaps ? " float-cta--split" : ""}${shot ? " float-cta--static" : ""}${visible ? "" : " is-waiting"}`}
      >
        {hasPhone ? (
          <CallButton phone={phone} garden={garden} brand={brand} className="call-btn--primary">
            <span>تماس با آتلیه</span>
          </CallButton>
        ) : null}

        {maps.length === 1 ? (
          <a
            className="cta-btn cta-btn--ghost"
            href={maps[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PinIcon size={18} />
            <span>مسیریاب</span>
          </a>
        ) : null}

        {maps.length > 1 ? (
          <button
            type="button"
            className="cta-btn cta-btn--ghost"
            aria-haspopup="dialog"
            aria-expanded={sheet}
            onClick={() => setSheet(true)}
          >
            <PinIcon size={18} />
            <span>مسیریاب</span>
          </button>
        ) : null}
      </nav>

      {isClient && sheet
        ? createPortal(
            <div
              className={`map-sheet${garden ? " map-sheet--garden" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label="انتخاب مسیریاب"
              onClick={() => setSheet(false)}
            >
              <div className="map-sheet__panel" onClick={(e) => e.stopPropagation()}>
                <div className="map-sheet__head">
                  <p>با کدام برنامه مسیریابی کنید؟</p>
                  <button type="button" aria-label="بستن" onClick={() => setSheet(false)}>
                    <CloseIcon />
                  </button>
                </div>
                {maps.map((m) => (
                  <a
                    key={m.key}
                    className="map-sheet__option"
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSheet(false)}
                  >
                    <span className="map-sheet__icon">
                      {m.key === "neshan" ? <NavigateIcon /> : <PinIcon />}
                    </span>
                    <span>{m.label}</span>
                  </a>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
