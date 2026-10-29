import Link from "next/link";
import { readContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();

  return (
    <main className="home-shell">
      <p className="home-brand animate-rise">آلما</p>
      <p className="home-lead animate-rise" style={{ animationDelay: "0.08s" }}>
        آتلیه عکاسی نوزاد و بارداری — لینک‌های اختصاصی مشتریان برای شرایط و آمادگی
        جلسات.
      </p>
      <ul className="home-list">
        {content.pages.map((page, i) => (
          <li key={page.slug} className="animate-rise" style={{ animationDelay: `${0.12 + i * 0.05}s` }}>
            <Link href={`/links/${page.slug}`}>
              <strong>{page.title}</strong>
              <span>/links/{page.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "1.75rem" }}>
        <Link href="/admin" className="cta-btn" style={{ display: "inline-flex", width: "auto", paddingInline: "1.4rem" }}>
          ورود به پنل مدیریت
        </Link>
      </p>
    </main>
  );
}
