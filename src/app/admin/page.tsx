import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { publicPathForSlug } from "@/lib/routes";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminHubForm } from "@/components/AdminHubForm";
import { AlmaAppleLogo } from "@/components/AlmaAppleLogo";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <main className="admin-shell">
        <AlmaAppleLogo size={44} variant="lockup" />
        <AdminLoginForm />
      </main>
    );
  }

  const content = await readContent();

  return (
    <main className="admin-shell">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <AlmaAppleLogo size={40} variant="lockup" />
          <p className="home-lead" style={{ marginBottom: "1rem" }}>
            ویرایش هاب و چهار لینک مشتری
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminHubForm hub={content.hub} />

      <h2 style={{ margin: "1.5rem 0 0.75rem", color: "var(--alma-red-deep)", fontSize: "1.15rem" }}>
        صفحات لینک
      </h2>
      <ul className="home-list">
        {content.pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/admin/${page.slug}`} className="glass">
              <strong>
                {page.title}{" "}
                {!page.published ? <span className="draft-badge">پیش‌نویس</span> : null}
              </strong>
              <span>
                {page.moodTag} · ویرایش · {publicPathForSlug(page.slug)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
