import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
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
            ویرایش ساده هر لینک — عنوان، تصویر، متن، تلفن
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <ul className="home-list">
        {content.pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/admin/${page.slug}`} className="glass">
              <strong>
                {page.title}{" "}
                {!page.published ? <span className="draft-badge">پیش‌نویس</span> : null}
              </strong>
              <span>
                {page.moodTag} · ویرایش · /links/{page.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
