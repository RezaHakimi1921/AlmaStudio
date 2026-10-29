import Link from "next/link";
import { readContent } from "@/lib/content";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();

  return (
    <main className="home-shell">
      <AlmaAppleLogo size={52} variant="lockup" />
      <p className="home-brand" style={{ marginTop: "0.75rem" }}>
        آلما
      </p>
      <p className="home-lead">
        آتلیه عکاسی نوزاد و بارداری — لینک‌های اختصاصی مشتریان با هویت یکپارچه آلما و تجربه
        جدا برای هر موضوع.
      </p>
      <ul className="home-list">
        {content.pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/links/${page.slug}`} className="glass">
              <strong>{page.title}</strong>
              <span>
                {page.moodTag} · /links/{page.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "1.75rem" }}>
        <Link
          href="/admin"
          className="cta-btn"
          style={{ display: "inline-flex", width: "auto", paddingInline: "1.4rem" }}
        >
          ورود به پنل مدیریت
        </Link>
      </p>
    </main>
  );
}
