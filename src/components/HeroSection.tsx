"use client";

import Link from "next/link";
import { AlmaAppleLogo } from "./AlmaAppleLogo";
import { ChevronDownIcon, HomeIcon } from "./Icons";
import { SkeletonImage } from "./SkeletonImage";

type Props = {
  title: string;
  subtitle?: string;
  brandLabel: string;
  moodTag: string;
  heroImageUrl: string;
  overlay: string;
  /** «صفحه اصلی» pill (hidden inside the admin live preview) */
  showHome?: boolean;
};

export function HeroSection({
  title,
  subtitle,
  brandLabel,
  moodTag,
  heroImageUrl,
  overlay,
  showHome = true,
}: Props) {
  return (
    <header className="hero skel">
      <SkeletonImage className="hero-photo" src={heroImageUrl} fetchPriority="high" />
      {showHome ? (
        <Link href="/" className="hero-home" aria-label="رفتن به صفحه اصلی آتلیه آلما">
          <HomeIcon size={16} />
          <span>صفحه اصلی</span>
        </Link>
      ) : null}
      <div className="hero-veil" style={{ background: overlay }} aria-hidden="true" />
      <div className="hero-shine" aria-hidden="true" />
      <div className="hero-copy">
        <div className="hero-glass">
          <p className="mood-pill hero-stagger" style={{ ["--n" as string]: 0 }}>
            {moodTag}
          </p>
          <div className="hero-brand-row hero-stagger" style={{ ["--n" as string]: 1 }}>
            <AlmaAppleLogo size={36} className="alma-logo--on-dark" />
            <p className="hero-brand">{brandLabel}</p>
          </div>
          <h1 className="hero-title hero-stagger" style={{ ["--n" as string]: 2 }}>
            {title}
          </h1>
          {subtitle ? (
            <p className="hero-sub hero-stagger" style={{ ["--n" as string]: 3 }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        <a href="#content" className="hero-scroll" aria-label="مشاهده جزئیات">
          <ChevronDownIcon size={20} />
        </a>
      </div>
    </header>
  );
}
