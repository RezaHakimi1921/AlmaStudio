"use client";

import { hasShotParam } from "./client";

const KEY = "alma-intro-seen-at";
const REPLAY_AFTER_MS = 24 * 60 * 60 * 1000; // once per day

let decided: boolean | null = null;

/**
 * Should the cinematic intro be skipped?
 * Decided once per page load (stable for useSyncExternalStore):
 * skip for ?shot, reduced motion, or if it already played in the last 24h.
 */
export function shouldSkipIntro(): boolean {
  if (decided !== null) return decided;
  let seenRecently = false;
  try {
    const at = Number(localStorage.getItem(KEY) || 0);
    seenRecently = at > 0 && Date.now() - at < REPLAY_AFTER_MS;
  } catch {
    /* storage blocked → just play it */
  }
  decided =
    hasShotParam() ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    seenRecently;
  return decided;
}

export function markIntroSeen() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
