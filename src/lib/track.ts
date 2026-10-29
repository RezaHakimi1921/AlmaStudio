"use client";

import { normalizeSource } from "./sources";
import type { TrackEvent } from "./types";

const SRC_KEY = "alma-src";

function skip() {
  try {
    return new URLSearchParams(window.location.search).has("shot");
  } catch {
    return true;
  }
}

/**
 * Where did this visit come from? "?src=insta" on the first page of the visit
 * is remembered for the whole session, so a later call/map click is credited
 * to the same channel.
 */
export function currentSource(): string {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("src");
    if (fromUrl) {
      const src = normalizeSource(fromUrl);
      sessionStorage.setItem(SRC_KEY, src);
      return src;
    }
    return sessionStorage.getItem(SRC_KEY) || "direct";
  } catch {
    return "direct";
  }
}

/** Fire-and-forget anonymous counter. Never blocks navigation. */
export function track(page: string, event: TrackEvent) {
  if (typeof window === "undefined" || skip()) return;
  const body = JSON.stringify({ page, event, src: currentSource() });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "text/plain" }))) return;
  } catch {
    /* fall through */
  }
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => undefined);
}
