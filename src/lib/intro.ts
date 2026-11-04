"use client";

import { hasShotParam } from "./client";

const KEY = "alma-intro-seen-at";
const REPLAY_AFTER_MS = 24 * 60 * 60 * 1000; // once per day

/**
 * Remembered in memory too: in-app browsers (Instagram, Bale…) sometimes block
 * storage, and client-side navigation (back → forward) must still skip the intro.
 */
let playedInMemory = false;

/**
 * Should the cinematic intro be skipped?
 * Skip for ?shot, reduced motion, or if it already played in the last 24h.
 * Read fresh on every mount — the caller latches the first answer so the intro
 * is never cut short halfway through its own playback.
 */
export function shouldSkipIntro(): boolean {
  if (hasShotParam()) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (/[?&]intro=1\b/.test(window.location.search)) return false; // force: ?intro=1
  if (playedInMemory) return true;
  try {
    const at = Number(localStorage.getItem(KEY) || 0);
    return at > 0 && Date.now() - at < REPLAY_AFTER_MS;
  } catch {
    return false; // storage blocked → just play it (once, thanks to playedInMemory)
  }
}

/** Call the moment the intro starts — not when it ends — so leaving early still counts. */
export function markIntroSeen() {
  playedInMemory = true;
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
