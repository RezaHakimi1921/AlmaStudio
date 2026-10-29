import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return (
      <main className="admin-shell">
        <p className="home-brand" style={{ fontSize: "2.4rem" }}>
          آلما
        </p>
        <AdminLoginForm />
      </main>
    );
  }

  const content = await readContent();

  return (
    <main className="admin-shell">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <div>
          <p className="home-brand" style={{ fontSize: "2.2rem" }}>
            آلما
          </p>
          <p className="home-lead" style={{ marginBottom: "1rem" }}>
            ویرایش چهار لینک مشتری
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <ul className="home-list">
        {content.pages.map((page) => (
          <li key={page.slug}>
            <Link href={`/admin/${page.slug}`}>
              <strong>{page.title}</strong>
              <span>ویرایش · /links/{page.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
