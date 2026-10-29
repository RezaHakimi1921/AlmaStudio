import { isoToJalali, jalaliToIso, jalaliWeekday, jalaliMonthLength } from "../src/lib/jalali";
const fmt = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", { timeZone: "UTC", year: "numeric", month: "numeric", day: "numeric" });
let bad = 0, n = 0;
for (let t = Date.UTC(1990, 0, 1); t <= Date.UTC(2060, 0, 1); t += 86400000) {
  const d = new Date(t);
  const iso = d.toISOString().slice(0, 10);
  const j = isoToJalali(iso)!;
  const parts = fmt.formatToParts(d);
  const get = (k: string) => Number(parts.find((p) => p.type === k)!.value);
  const ok = get("year") === j.jy && get("month") === j.jm && get("day") === j.jd;
  const back = jalaliToIso(j.jy, j.jm, j.jd) === iso;
  const wd = jalaliWeekday(j.jy, j.jm, j.jd) === (d.getUTCDay() + 1) % 7;
  if (!ok || !back || !wd) { bad++; if (bad < 5) console.log("MISMATCH", iso, j, parts.map(p=>p.value).join("")); }
  n++;
}
console.log(`jalali: checked ${n} days, mismatches ${bad}`);
if (bad) process.exit(1);
if (jalaliMonthLength(1403, 12) !== 30 || jalaliMonthLength(1404, 12) !== 29) process.exit(1);

