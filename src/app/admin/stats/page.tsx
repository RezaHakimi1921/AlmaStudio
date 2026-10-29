import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { readStats } from "@/lib/stats";
import { faJalali, tehranDateKey, toFaDigits } from "@/lib/tehran";
import type { TrackEvent } from "@/lib/types";
import { AdminHeader } from "@/components/AdminHeader";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

const EVENT_LABELS: { key: TrackEvent | "maps"; label: string }[] = [
  { key: "view", label: "بازدید" },
  { key: "call", label: "تماس" },
  { key: "maps", label: "مسیریابی" },
  { key: "instagram", label: "اینستاگرام" },
  { key: "bale", label: "بله" },
  { key: "share", label: "ارسال برای همراه" },
  { key: "gallery", label: "رفتن به نمونه‌کارها" },
];

type Counts = Partial<Record<TrackEvent, number>>;

function lastDays(n: number) {
  const out: string[] = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) out.push(tehranDateKey(new Date(now - i * 86_400_000)));
  return out;
}

const n = (v: number | undefined) => v ?? 0;
const fa = (v: number) => toFaDigits(v.toLocaleString("en-US"));
const value = (c: Counts, key: TrackEvent | "maps") =>
  key === "maps" ? n(c.map_google) + n(c.map_neshan) : n(c[key]);

function add(into: Counts, from: Counts) {
  for (const [k, v] of Object.entries(from)) {
    into[k as TrackEvent] = n(into[k as TrackEvent]) + n(v);
  }
}

type Props = { searchParams: Promise<{ d?: string }> };

export default async function AdminStatsPage({ searchParams }: Props) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { d } = await searchParams;
  const range = RANGES.includes(Number(d) as (typeof RANGES)[number]) ? Number(d) : 30;

  const [stats, content] = await Promise.all([readStats(), readContent()]);
  const days = lastDays(range);

  const names: Record<string, string> = Object.fromEntries(
    content.pages.map((p) => [p.slug, p.title]),
  );
  names.gallery = "صفحه نمونه‌کارها";
  const pageKeys = [...content.pages.map((p) => p.slug), "gallery"];

  const total: Counts = {};
  const perPage: Record<string, Counts> = Object.fromEntries(pageKeys.map((k) => [k, {}]));
  const perDay = days.map((day) => {
    const c: Counts = {};
    for (const [page, counts] of Object.entries(stats.days[day] ?? {})) {
      add(c, counts);
      add(total, counts);
      if (perPage[page]) add(perPage[page], counts);
    }
    return { day, c };
  });

  const maxViews = Math.max(1, ...perDay.map((x) => n(x.c.view)));
  const linkViews = pageKeys
    .filter((k) => k !== "gallery")
    .reduce((sum, k) => sum + n(perPage[k].view), 0);
  const callRate = linkViews ? (n(total.call) / linkViews) * 100 : 0;

  return (
    <main className="admin-shell admin-stats">
      <AdminHeader title="آمار بازدید و کلیک" subtitle="بدون ذخیره هیچ اطلاعات شخصی — فقط شمارش" />

      <nav className="admin-cat-tabs" aria-label="بازه زمانی">
        {RANGES.map((r) => (
          <Link key={r} href={`/admin/stats?d=${r}`} className={r === range ? "is-active" : undefined}>
            {toFaDigits(r)} روز اخیر
          </Link>
        ))}
      </nav>

      <div className="stat-tiles">
        <div className="stat-tile">
          <span>بازدید</span>
          <strong>{fa(n(total.view))}</strong>
        </div>
        <div className="stat-tile stat-tile--accent">
          <span>تماس</span>
          <strong>{fa(n(total.call))}</strong>
        </div>
        <div className="stat-tile">
          <span>مسیریابی</span>
          <strong>{fa(value(total, "maps"))}</strong>
        </div>
        <div className="stat-tile">
          <span>نرخ تماس از بازدید</span>
          <strong>
            {toFaDigits(callRate.toFixed(1))}
            <small>٪</small>
          </strong>
        </div>
      </div>

      <section className="admin-card glass admin-section">
        <h2>روند روزانه بازدید</h2>
        <div className="day-chart" role="img" aria-label="نمودار بازدید روزانه">
          {perDay.map(({ day, c }) => (
            <div
              key={day}
              className="day-chart__col"
              title={`${faJalali(day)} — بازدید ${fa(n(c.view))} · تماس ${fa(n(c.call))}`}
            >
              <span className="day-chart__bar" style={{ height: `${(n(c.view) / maxViews) * 100}%` }}>
                {n(c.call) ? <i className="day-chart__call" /> : null}
              </span>
            </div>
          ))}
        </div>
        <div className="day-chart__legend">
          <span>{faJalali(days[0])}</span>
          <span>
            <i className="day-chart__call day-chart__call--legend" /> روزهایی که تماس داشته
          </span>
          <span>{faJalali(days[days.length - 1])}</span>
        </div>
      </section>

      <section className="admin-card glass admin-section">
        <h2>به تفکیک صفحه</h2>
        <div className="stat-table-wrap">
          <table className="stat-table">
            <thead>
              <tr>
                <th>صفحه</th>
                {EVENT_LABELS.map((e) => (
                  <th key={e.key}>{e.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageKeys.map((k) => (
                <tr key={k}>
                  <th>{names[k] ?? k}</th>
                  {EVENT_LABELS.map((e) => (
                    <td key={e.key}>{fa(value(perPage[k], e.key))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hero-upload__hint">
          بازدیدها و کلیک‌ها به وقت تهران و روزانه شمرده می‌شوند. بازدیدهای پنل مدیریت و ربات‌های
          پیش‌نمایش لینک (تلگرام، واتس‌اپ و…) شمرده نمی‌شوند.
        </p>
      </section>
    </main>
  );
}
