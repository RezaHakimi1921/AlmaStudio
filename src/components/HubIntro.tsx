"use client";

import { useCallback, useEffect, useState } from "react";
import { useClientValue } from "@/lib/client";
import { markIntroSeen, shouldSkipIntro } from "@/lib/intro";
import { AlmaAppleLogo } from "./AlmaAppleLogo";

const DURATION_MS = 3000;
const EXIT_MS = 700;

/**
 * Opening of the main page (`/`): a red apple blooms, «آتلیه آلما» is revealed, the frame lifts.
 * Same rules as the link intros — plays once per visitor (24 h), never for reduced-motion,
 * skippable by tap, the «ورود» button, Enter or Escape. `?intro=1` forces it for testing.
 */
export function HubIntro() {
  const stored = useClientValue(shouldSkipIntro);
  // latch the first real answer (marking it "seen" flips the live value)
  const [skip, setSkip] = useState<boolean | null>(null);
  if (skip === null && stored !== null) setSkip(stored);
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const playing = skip === false && phase === "in";

  const finish = useCallback(() => setPhase((p) => (p === "in" ? "out" : p)), []);

  useEffect(() => {
    if (skip === false) markIntroSeen();
  }, [skip]);

  useEffect(() => {
    if (!playing) return;
    const leave = window.setTimeout(finish, DURATION_MS - EXIT_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(leave);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, finish]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (skip === true || phase === "gone") return null;

  return (
    <div
      className={`hub-intro hub-intro--${phase}${skip === false ? " is-ready" : ""}`}
      onClick={finish}
      role="presentation"
    >
      <span className="hub-intro__glow" aria-hidden="true" />
      <div className="hub-intro__center" aria-hidden="true">
        <div className="hub-intro__mark">
          <span className="hub-intro__ring" />
          <span className="hub-intro__ring" />
          <AlmaAppleLogo size={92} />
        </div>
        <p className="hub-intro__name">
          <span className="hub-intro__name-text">آتلیه آلما</span>
        </p>
        <span className="hub-intro__line" />
      </div>
      <button type="button" className="hub-intro__skip">
        ورود
      </button>
      <span className="hub-intro__progress" aria-hidden="true" />
    </div>
  );
}
