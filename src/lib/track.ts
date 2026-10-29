"use client";

import type { TrackEvent } from "./types";

function skip() {
  try {
    return new URLSearchParams(window.location.search).has("shot");
  } catch {
    return true;
  }
}

/** Fire-and-forget anonymous counter. Never blocks navigation. */
export function track(page: string, event: TrackEvent) {
  if (typeof window === "undefined" || skip()) return;
  const body = JSON.stringify({ page, event });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "text/plain" }))) return;
  } catch {
    /* fall through */
  }
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => undefined);
}
