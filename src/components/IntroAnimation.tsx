"use client";

import { useEffect, useState } from "react";
import type { IntroTheme } from "@/lib/types";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

type Props = {
  theme: IntroTheme;
  brand: string;
  label: string;
};

const DURATION_MS = 2100;

function shouldSkipIntro() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return new URLSearchParams(window.location.search).has("shot");
}

export function IntroAnimation({ theme, brand, label }: Props) {
  const [visible, setVisible] = useState(() => !shouldSkipIntro());
  const [leaving, setLeaving] = useState(false);
  const garden = theme.startsWith("outdoor");

  useEffect(() => {
    if (shouldSkipIntro()) {
      setVisible(false);
      return;
    }
    const leaveTimer = window.setTimeout(() => setLeaving(true), DURATION_MS - 420);
    const doneTimer = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-overlay${garden ? " intro-overlay--garden" : ""}${leaving ? " intro-overlay--leave" : ""}`}
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
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.7 + (i % 3) * 0.2}s`,
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
          <svg viewBox="0 0 120 120" width="130" height="130" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(248,243,237,0.85)" strokeWidth="3" />
            <circle cx="60" cy="60" r="18" fill="rgba(248,243,237,0.18)" stroke="rgba(248,243,237,0.9)" strokeWidth="2" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path
                key={deg}
                d="M60 8 L72 48 L60 60 Z"
                fill="rgba(248,243,237,0.5)"
                transform={`rotate(${deg} 60 60)`}
              />
            ))}
          </svg>
        </div>
      )}
      {theme === "studio-conditions" && (
        <div className="intro-apple">
          <AlmaAppleLogo size={96} />
        </div>
      )}
      <div className="intro-copy">
        <AlmaAppleLogo size={36} />
        <p className="intro-brand">{brand}</p>
        <p className="intro-label">{label}</p>
      </div>
    </div>
  );
}
