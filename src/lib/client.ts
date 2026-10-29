import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true only after hydration on the client — no setState-in-effect needed */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Read a client-only snapshot (null during SSR / hydration). */
export function useClientValue<T>(read: () => T): T | null {
  return useSyncExternalStore(noop, read, () => null);
}

export function hasShotParam() {
  return new URLSearchParams(window.location.search).has("shot");
}
