"use client";

import Link from "next/link";
import { useTrack } from "@/lib/track-context";
import { GALLERY_PATH, GALLERY_THEMES } from "@/lib/gallery";
import { withFromParam } from "@/lib/routes";
import type { GalleryImage } from "@/lib/types";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { ArrowLeftIcon, ImagesIcon } from "./Icons";
import { SkeletonImage } from "./SkeletonImage";

/** Inviting card that leads to the full gallery ("نمونه‌کارها"). */
export function GalleryTeaser({ images, from }: { images: GalleryImage[]; from: string }) {
  const trackEvent = useTrack();
  const covers = GALLERY_CATEGORIES.map((c) => images.find((i) => i.category === c)).filter(
    (i): i is GalleryImage => Boolean(i),
  );
  const thumbs = covers.length >= 3 ? covers : images.slice(0, 3);
  if (!thumbs.length) return null;

  return (
    <Link
      href={withFromParam(GALLERY_PATH, from)}
      className="gallery-teaser"
      data-reveal
      onClick={() => trackEvent("gallery")}
    >
      <div className="gallery-teaser__stack" aria-hidden="true">
        {thumbs.map((img, i) => (
          <span key={img.id} className="gallery-teaser__thumb skel" style={{ ["--i" as string]: i }}>
            <SkeletonImage src={img.url} loading="lazy" />
          </span>
        ))}
      </div>
      <div className="gallery-teaser__copy">
        <span className="gallery-teaser__kicker">
          <ImagesIcon size={16} /> نمونه‌کارهای آلما
        </span>
        <strong>لحظه‌هایی که ثبت کرده‌ایم</strong>
        <span className="gallery-teaser__cats">
          {GALLERY_CATEGORIES.map((c) => GALLERY_THEMES[c].label).join(" · ")}
        </span>
      </div>
      <span className="gallery-teaser__go" aria-hidden="true">
        <ArrowLeftIcon />
      </span>
    </Link>
  );
}
