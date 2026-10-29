import { promises as fs } from "fs";
import path from "path";
import { tehranDateKey } from "./tehran";
import type { TrackEvent } from "./types";

/**
 * Anonymous click counters — no IP, no cookies, no personal data.
 * Shape: { days: { "2026-10-30": { "studio-prep": { "view": 12, "call": 3 } } } }
 */
export type StatsFile = {
  days: Record<string, Record<string, Partial<Record<TrackEvent, number>>>>;
};

const STATS_PATH = path.join(process.cwd(), "data", "stats.json");
const KEEP_DAYS = 400;

let queue: Promise<unknown> = Promise.resolve();

export async function readStats(): Promise<StatsFile> {
  try {
    const parsed = JSON.parse(await fs.readFile(STATS_PATH, "utf8")) as StatsFile;
    return parsed && typeof parsed.days === "object" ? parsed : { days: {} };
  } catch {
    return { days: {} };
  }
}

async function writeStats(stats: StatsFile) {
  await fs.mkdir(path.dirname(STATS_PATH), { recursive: true });
  const tmp = `${STATS_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(stats), "utf8");
  await fs.rename(tmp, STATS_PATH);
}

/** Serialized so concurrent requests never overwrite each other. */
export function recordEvent(page: string, event: TrackEvent) {
  const run = queue.then(async () => {
    const stats = await readStats();
    const day = tehranDateKey();
    const byPage = (stats.days[day] ??= {});
    const counters = (byPage[page] ??= {});
    counters[event] = (counters[event] ?? 0) + 1;

    const keys = Object.keys(stats.days).sort();
    for (const k of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) {
      delete stats.days[k];
    }
    await writeStats(stats);
  });
  queue = run.catch(() => undefined);
  return run;
}
