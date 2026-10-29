"use client";

import { hasShotParam, useClientValue } from "@/lib/client";
import { CallButton } from "./CallButton";
import { PinIcon } from "./Icons";

type Props = {
  phone: string;
  showMaps?: boolean;
  mapsUrl?: string;
  garden?: boolean;
  brand?: string;
  visible?: boolean;
};

export function ContactBar({
  phone,
  showMaps = false,
  mapsUrl = "",
  garden = false,
  brand,
  visible = true,
}: Props) {
  const shot = useClientValue(hasShotParam) === true;

  const split = showMaps && Boolean(mapsUrl);

  return (
    <nav
      aria-label="تماس سریع"
      className={`float-cta glass-strong${garden ? " float-cta--garden" : ""}${split ? " float-cta--split" : ""}${shot ? " float-cta--static" : ""}${visible ? "" : " is-waiting"}`}
    >
      <CallButton phone={phone} garden={garden} brand={brand} className="call-btn--primary">
        <span>تماس با آتلیه</span>
      </CallButton>
      {split ? (
        <a
          className="cta-btn cta-btn--ghost"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PinIcon size={18} />
          <span>مسیریاب</span>
        </a>
      ) : null}
    </nav>
  );
}
