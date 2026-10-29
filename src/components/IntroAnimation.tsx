"use client";

import { useEffect, useState } from "react";
import type { IntroTheme } from "@/lib/types";

type Props = {
  theme: IntroTheme;
  brand: string;
  label: string;
};

const DURATION_MS = 2200;

function shouldSkipIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return new URLSearchParams(window.location.search).has("shot");
}

export function IntroAnimation({ theme, brand, label }: Props) {
  const [visible, setVisible] = useState(() => !shouldSkipIntro());
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (shouldSkipIntro()) {
      setVisible(false);
      return;
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), DURATION_MS - 450);
    const doneTimer = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-overlay${leaving ? " intro-overlay--leave" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-glow" />
      {theme === "outdoor-conditions" && (
        <div className="intro-motif">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="intro-petal"
              style={{
                left: `${8 + i * 11}%`,
                animationDelay: `${i * 0.12}s`,
                animationDuration: `${1.8 + (i % 3) * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}
      {theme === "outdoor-prep" && (
        <div className="intro-motif">
          <span className="intro-ray intro-ray--a" />
          <span className="intro-ray intro-ray--b" />
          <span className="intro-ray intro-ray--c" />
        </div>
      )}
      {theme === "studio-prep" && (
        <div className="intro-aperture">
          <svg viewBox="0 0 120 120" width="140" height="140" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(255,248,245,0.85)"
              strokeWidth="3"
            />
            <circle
              cx="60"
              cy="60"
              r="18"
              fill="rgba(255,248,245,0.2)"
              stroke="rgba(255,248,245,0.9)"
              strokeWidth="2"
            />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path
                key={deg}
                d="M60 8 L72 48 L60 60 Z"
                fill="rgba(255,248,245,0.55)"
                transform={`rotate(${deg} 60 60)`}
              />
            ))}
          </svg>
        </div>
      )}
      {theme === "studio-conditions" && (
        <div className="intro-apple">
          <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
            <path
              d="M60 28c8-14 22-16 28-14-6 8-6 16-2 22 12 6 22 20 22 36 0 24-18 42-40 42s-40-18-40-42c0-16 10-30 22-36 4-6 4-14-2-22 6-2 20 0 28 14z"
              fill="#fff1f0"
            />
            <path d="M60 28c0-10 8-18 16-20-2 10-8 16-16 20z" fill="#7a1212" />
          </svg>
        </div>
      )}
      <div className="intro-copy">
        <p className="intro-brand">{brand}</p>
        <p className="intro-label">{label}</p>
      </div>
    </div>
  );
}
