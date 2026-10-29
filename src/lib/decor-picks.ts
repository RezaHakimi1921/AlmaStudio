"use client";

/** The visitor's chosen decor numbers, kept on their own phone only. */
const KEY = "alma-decor-picks";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  if (cache !== null) return cache;
  try {
    cache = localStorage.getItem(KEY) || "";
  } catch {
    cache = "";
  }
  return cache;
}

export function getPicksSnapshot() {
  return read();
}

export function parsePicks(raw: string): number[] {
  return raw
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
}

export function subscribePicks(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setPicks(nums: number[]) {
  cache = [...new Set(nums)].join(",");
  try {
    localStorage.setItem(KEY, cache);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
