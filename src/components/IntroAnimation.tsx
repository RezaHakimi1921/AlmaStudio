"use client";

import { useEffect, useState } from "react";
import type { IntroTheme } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

type Props = {
  theme: IntroTheme;
  brand: string;
  label: string;
  heroImageUrl: string;
};

const DURATION_MS = 3200;

function shouldSkipIntro() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return new URLSearchParams(window.location.search).has("shot");
}

/**
 * Cinematic photo intro — Ken Burns on real photography + glass brand reveal.
 * Reference feel: Artepersia soft slideshow / Studio Sky premium photography.
 */
export function IntroAnimation({ theme, brand, label, heroImageUrl }: Props) {
  const [visible, setVisible] = useState(() => !shouldSkipIntro());
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const garden = theme.startsWith("outdoor");

  useEffect(() => {
    if (shouldSkipIntro()) {
      setVisible(false);
      return;
    }
    const hold = window.setTimeout(() => setPhase("hold"), 900);
    const leave = window.setTimeout(() => setPhase("out"), DURATION_MS - 700);
    const done = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`cinema-intro cinema-intro--${phase}${garden ? " cinema-intro--garden" : ""}`}
      aria-hidden="true"
    >
      <div className="cinema-intro__photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="cinema-intro__photo"
          src={heroImageUrl}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="cinema-intro__veil" />
        <div className="cinema-intro__grain" />
      </div>
      <div className="cinema-intro__copy">
        <AlmaAppleLogo size={42} className="alma-logo--on-dark" />
        <p className="cinema-intro__brand">{brand}</p>
        <p className="cinema-intro__label">{label}</p>
        <span className="cinema-intro__line" />
      </div>
    </div>
  );
}
