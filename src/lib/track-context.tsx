"use client";

import { createContext, useCallback, useContext } from "react";
import { track } from "./track";
import type { TrackEvent } from "./types";

const TrackPageContext = createContext<string>("");

export function TrackProvider({ page, children }: { page: string; children: React.ReactNode }) {
  return <TrackPageContext.Provider value={page}>{children}</TrackPageContext.Provider>;
}

/** Returns a stable fn that counts an event for the current page. */
export function useTrack() {
  const page = useContext(TrackPageContext);
  return useCallback(
    (event: TrackEvent) => {
      if (page) track(page, event);
    },
    [page],
  );
}
