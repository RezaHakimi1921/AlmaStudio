import type { StatsFile } from "./stats";
import { tehranDateKey } from "./tehran";
import type { TrackEvent } from "./types";

export type Counts = Partial<Record<TrackEvent, number>>;

export const n = (v: number | undefined) => v ?? 0;

export function add(into: Counts, from: Counts) {
  for (const [k, v] of Object.entries(from)) {
    into[k as TrackEvent] = n(into[k as TrackEvent]) + n(v);
  }
}

/** Tehran day keys for the last `count` days ending `endOffset` days ago (oldest first). */
export function dayKeys(count: number, endOffset = 0, now = Date.now()) {
  const out: string[] = [];
  for (let i = count - 1 + endOffset; i >= endOffset; i--) {
    out.push(tehranDateKey(new Date(now - i * 86_400_000)));
  }
  return out;
}

export type Report = {
  days: string[];
  total: Counts;
  previous: Counts;
  perPage: Record<string, Counts>;
  perDay: { day: string; c: Counts }[];
  perSource: Record<string, Counts>;
};

/** Aggregate the raw daily counters for a range, plus the same-length range before it. */
export function buildReport(stats: StatsFile, range: number, pages: string[], now = Date.now()): Report {
  const days = dayKeys(range, 0, now);
  const prevDays = dayKeys(range, range, now);

  const total: Counts = {};
  const previous: Counts = {};
  const perPage: Record<string, Counts> = Object.fromEntries(pages.map((k) => [k, {}]));
  const perSource: Record<string, Counts> = {};

  const perDay = days.map((day) => {
    const c: Counts = {};
    for (const [page, counts] of Object.entries(stats.days[day] ?? {})) {
      add(c, counts);
      add(total, counts);
      add((perPage[page] ??= {}), counts);
    }
    for (const [src, counts] of Object.entries(stats.sources?.[day] ?? {})) {
      add((perSource[src] ??= {}), counts);
    }
    return { day, c };
  });

  for (const day of prevDays) {
    for (const counts of Object.values(stats.days[day] ?? {})) add(previous, counts);
  }

  return { days, total, previous, perPage, perDay, perSource };
}

/** % change vs previous period; null when there is nothing to compare with. */
export function change(now: number, before: number): number | null {
  if (!before) return null;
  return Math.round(((now - before) / before) * 100);
}
