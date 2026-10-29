"use client";

import { useCallback, useEffect, useState } from "react";
import type { IntroTheme } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

type Props = {
  theme: IntroTheme;
  brand: string;
  label: string;
  heroImageUrl: string;
  onDone?: () => void;
};

const DURATION_MS = 3600;
const EXIT_MS = 800;
const PARTICLES = 14;

/**
 * Cinematic opening:
 * 1. dark frame → camera iris opens on the hero photo (clip-path aperture)
 * 2. apple mark blooms with light rings
 * 3. brand + label wipe in, a light sweep crosses the type
 * 4. floating petals (studio) / leaves (garden) drift up
 * 5. the frame lifts away to reveal the page. Tap anywhere to skip.
 */
export function IntroAnimation({ theme, brand, label, heroImageUrl, onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const garden = theme.startsWith("outdoor");

  const finish = useCallback(() => {
    setPhase((p) => (p === "in" ? "out" : p));
  }, []);

  useEffect(() => {
    const leave = window.setTimeout(finish, DURATION_MS - EXIT_MS);
    return () => window.clearTimeout(leave);
  }, [finish]);

  useEffect(() => {
    if (phase !== "out") return;
    onDone?.();
    const t = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase, onDone]);

  if (phase === "gone") return null;

  return (
    <div
      className={`cinema-intro cinema-intro--${phase}${garden ? " cinema-intro--garden" : ""}`}
      onClick={finish}
      role="presentation"
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
        <div className="cinema-intro__leak" />
        <div className="cinema-intro__grain" />
      </div>

      <div className="cinema-intro__blades" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="cinema-intro__particles" aria-hidden="true">
        {Array.from({ length: PARTICLES }, (_, i) => (
          <span
            key={i}
            style={{
              ["--x" as string]: `${(i * 71) % 100}%`,
              ["--d" as string]: `${0.4 + ((i * 37) % 17) / 10}s`,
              ["--s" as string]: `${0.6 + ((i * 13) % 7) / 10}`,
              ["--r" as string]: `${(i * 53) % 360}deg`,
            }}
          />
        ))}
      </div>

      <div className="cinema-intro__copy" aria-hidden="true">
        <div className="cinema-intro__mark">
          <span className="cinema-intro__ring" />
          <span className="cinema-intro__ring" />
          <AlmaAppleLogo size={54} className="alma-logo--on-dark" />
        </div>
        <p className="cinema-intro__brand">
          <span className="cinema-intro__brand-text">{brand}</span>
        </p>
        <p className="cinema-intro__label">{label}</p>
        <span className="cinema-intro__line" />
      </div>

      <span className="cinema-intro__skip">برای ورود بزنید</span>
      <span className="cinema-intro__progress" aria-hidden="true" />
    </div>
  );
}
