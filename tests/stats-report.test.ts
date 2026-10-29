import { buildReport, change, dayKeys } from "../src/lib/stats-report";
import assert from "node:assert/strict";
const now = Date.UTC(2026, 9, 30, 12); // 30 Oct 2026, noon UTC (= 15:30 Tehran)
const [d0] = dayKeys(1, 0, now);            // today
const [y] = dayKeys(1, 1, now);             // yesterday
const [p] = dayKeys(1, 7, now);             // 7 days ago (previous 7-day window)
assert.equal(d0, "2026-10-30"); assert.equal(y, "2026-10-29"); assert.equal(p, "2026-10-23");
const stats = {
  days: {
    [d0]: { "studio-prep": { view: 10, call: 2 }, gallery: { view: 3 } },
    [y]: { "studio-prep": { view: 5, map_google: 1, map_neshan: 2 } },
    [p]: { "studio-prep": { view: 4, call: 1 } },
    "2020-01-01": { "studio-prep": { view: 999 } },
  },
  sources: {
    [d0]: { insta: { view: 8, call: 2 }, direct: { view: 5 } },
    [y]: { bale: { view: 5, map_neshan: 2 }, insta: { map_google: 1 } },
  },
};
const r = buildReport(stats, 7, ["studio-prep", "gallery"], now);
assert.equal(r.total.view, 18);            // 10+3+5, old 999 excluded
assert.equal(r.total.call, 2);
assert.equal(r.previous.view, 4);          // only the earlier window
assert.equal(r.perPage["studio-prep"].view, 15);
assert.equal(r.perPage.gallery.view, 3);
assert.equal(r.perSource.insta.view, 8);
assert.equal(r.perSource.insta.map_google, 1);
assert.equal(r.perSource.bale.map_neshan, 2);
assert.equal(r.perDay.length, 7);
assert.equal(r.perDay[6].c.view, 13);      // today last
assert.equal(change(18, 4), 350);
assert.equal(change(5, 0), null);
console.log("stats-report: all assertions passed");
