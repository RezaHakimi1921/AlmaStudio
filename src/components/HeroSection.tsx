"use client";

import { AlmaAppleLogo } from "./AlmaAppleLogo";
import { ChevronDownIcon } from "./Icons";

type Props = {
  title: string;
  subtitle?: string;
  brandLabel: string;
  moodTag: string;
  heroImageUrl: string;
  overlay: string;
};

export function HeroSection({
  title,
  subtitle,
  brandLabel,
  moodTag,
  heroImageUrl,
  overlay,
}: Props) {
  return (
    <header className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-photo"
        src={heroImageUrl}
        alt=""
        decoding="async"
        fetchPriority="high"
      />
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
