import Link from "next/link";
import { readContent } from "@/lib/content";
import { publicPathForSlug } from "@/lib/routes";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";
import { HubLinkIcon } from "@/components/HubLinkIcon";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();
  const { hub, pages } = content;

  return (
    <main className="hub-page">
      <section className="hub-hero" aria-label="معرفی آتلیه آلما">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hub-hero__photo"
          src={hub.heroImageUrl}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="hub-hero__veil" />
        <div className="hub-hero__copy glass-strong">
          <AlmaAppleLogo size={48} className="alma-logo--on-dark" />
          <h1 className="hub-hero__title">{hub.title}</h1>
          <p className="hub-hero__subtitle">{hub.subtitle}</p>
        </div>
      </section>

      <section className="hub-body">
        <header className="hub-body__head">
          <p className="hub-body__eyebrow">لینک‌های مشتریان</p>
          <p className="hub-body__hint">یکی از موضوع‌ها را انتخاب کنید</p>
        </header>

        <ul className="hub-list">
          {pages
            .filter((page) => page.published)
            .map((page) => {
              const href = publicPathForSlug(page.slug);
              return (
                <li key={page.slug}>
                  <Link href={href} className="hub-card glass">
                    <span className="hub-card__icon" data-slug={page.slug}>
                      <HubLinkIcon slug={page.slug} />
                    </span>
                    <span className="hub-card__text">
                      <strong className="hub-card__title">{page.title}</strong>
                      <span className="hub-card__mood">{page.moodTag}</span>
                      <span className="hub-card__desc">{page.subtitle}</span>
                    </span>
                    <span className="hub-card__enter" aria-hidden="true">
                      ورود
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                        <path
                          d="M12.5 4.5 7 10l5.5 5.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>

        <footer className="hub-admin">
          <p className="hub-admin__note">ورود مدیریت فقط برای تیم آتلیه</p>
          <Link href="/admin" className="hub-admin__link">
            پنل مدیریت
          </Link>
        </footer>
      </section>
    </main>
  );
}
