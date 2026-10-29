"use client";

import { AlmaAppleLogo } from "./AlmaAppleLogo";

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
      <div className="hero-copy">
        <div className="hero-glass">
          <p className="mood-pill">{moodTag}</p>
          <div className="hero-brand-row">
            <AlmaAppleLogo size={36} className="alma-logo--on-dark" />
            <p className="hero-brand">{brandLabel}</p>
          </div>
          <h1 className="hero-title">{title}</h1>
          {subtitle ? <p className="hero-sub">{subtitle}</p> : null}
        </div>
      </div>
    </header>
  );
}
