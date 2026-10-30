"use client";

import Link from "next/link";
import { useTrack } from "@/lib/track-context";
import { withFromParam } from "@/lib/routes";
import { toFaDigits } from "@/lib/tehran";
import type { Decor } from "@/lib/types";
import { ArrowLeftIcon } from "./Icons";

export const DECOR_PATH = "/dekor";

/** Invites visitors to browse the numbered studio sets before their session. */
export function DecorTeaser({ items, from }: { items: Decor[]; from: string }) {
  const trackEvent = useTrack();
  const shown = items.slice(0, 4);
  if (!shown.length) return null;

  return (
    <Link
      href={withFromParam(DECOR_PATH, from)}
      className="decor-teaser"
      data-reveal
      onClick={() => trackEvent("decor")}
    >
      <div className="decor-teaser__thumbs" aria-hidden="true">
        {shown.map((d) => (
          <span key={d.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.imageUrl} alt="" loading="lazy" />
            <i>{toFaDigits(d.number)}</i>
          </span>
        ))}
      </div>
      <div className="decor-teaser__copy">
        <strong>دکور جلسه‌تان را انتخاب کنید</strong>
        <span>
          {toFaDigits(items.length)} دکور با شماره — انتخاب کنید و هنگام رزرو بگویید
        </span>
      </div>
      <span className="gallery-teaser__go" aria-hidden="true">
        <ArrowLeftIcon />
      </span>
    </Link>
  );
}
