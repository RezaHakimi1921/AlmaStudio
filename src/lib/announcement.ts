import { tehranDateKey } from "./tehran";
import type { Announcement } from "./types";

/** Is the announcement switched on and inside its date window (Tehran day)? */
export function isAnnouncementLive(a: Announcement, now = new Date()) {
  if (!a.enabled || !a.text.trim()) return false;
  const today = tehranDateKey(now);
  if (a.startDate && today < a.startDate) return false;
  if (a.endDate && today > a.endDate) return false;
  return true;
}
