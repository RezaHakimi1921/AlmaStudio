"use client";

import { useClientValue } from "@/lib/client";
import { FA_DAYS, faTime, tehranNow, timeToMinutes } from "@/lib/tehran";
import type { DayHours, WorkingHours } from "@/lib/types";
import { ClockIcon } from "./Icons";

type Status = { open: boolean; text: string };

function computeStatus(days: DayHours[]): Status {
  const { day, minutes } = tehranNow();
  const today = days[day];
  if (today?.open) {
    const from = timeToMinutes(today.from);
    const to = timeToMinutes(today.to);
    if (minutes >= from && minutes < to) {
      return { open: true, text: `هم‌اکنون پذیرای شما هستیم · تا ${faTime(today.to)}` };
    }
    if (minutes < from) {
      return { open: false, text: `امروز از ${faTime(today.from)} در خدمت شما هستیم` };
    }
  }
  for (let step = 1; step <= 7; step++) {
    const d = days[(day + step) % 7];
    if (d?.open) {
      const when = step === 1 ? "فردا" : FA_DAYS[d.day];
      return { open: false, text: `${when} از ${faTime(d.from)} در خدمت شما هستیم` };
    }
  }
  return { open: false, text: "برای هماهنگی پیام بگذارید" };
}

/** Group consecutive days with identical hours: "شنبه تا چهارشنبه" */
function groupDays(days: DayHours[]) {
  const groups: { label: string; value: string; includes: number[] }[] = [];
  let i = 0;
  while (i < days.length) {
    const start = days[i];
    let j = i;
    const same = (a: DayHours, b: DayHours) =>
      a.open === b.open && (!a.open || (a.from === b.from && a.to === b.to));
    while (j + 1 < days.length && same(days[j + 1], start)) j++;
    const label = i === j ? FA_DAYS[start.day] : `${FA_DAYS[start.day]} تا ${FA_DAYS[days[j].day]}`;
    const value = start.open ? `${faTime(start.from)} تا ${faTime(start.to)}` : "در کنار خانواده‌ایم";
    groups.push({ label, value, includes: days.slice(i, j + 1).map((d) => d.day) });
    i = j + 1;
  }
  return groups;
}

export function HoursCard({ hours }: { hours: WorkingHours }) {
  // string snapshot (stable for useSyncExternalStore), parsed below
  const raw = useClientValue(() => {
    const s = computeStatus(hours.days);
    return `${s.open ? 1 : 0}|${s.text}`;
  });
  const today = useClientValue(() => tehranNow().day);
  const status: Status | null = raw
    ? { open: raw.startsWith("1"), text: raw.slice(2) }
    : null;

  return (
    <section className="solid-card section-card hours-card" data-reveal>
      <h2 className="card-title">
        <span className="card-title__icon">
          <ClockIcon />
        </span>
        ساعات پذیرش آتلیه
      </h2>

      <p
        className={`hours-status${status ? (status.open ? " is-open" : " is-closed") : ""}`}
        aria-live="polite"
      >
        <span className="hours-status__dot" aria-hidden="true" />
        <span>{status ? status.text : " "}</span>
      </p>

      <ul className="hours-list">
        {groupDays(hours.days).map((g) => (
          <li
            key={g.label}
            className={today != null && g.includes.includes(today) ? "is-today" : undefined}
          >
            <span>{g.label}</span>
            <span>{g.value}</span>
          </li>
        ))}
      </ul>

      {hours.note ? <p className="hours-note">{hours.note}</p> : null}
    </section>
  );
}
