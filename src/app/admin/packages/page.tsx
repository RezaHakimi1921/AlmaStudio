import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminPackagesManager } from "@/components/AdminPackagesManager";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSettings();
  return (
    <main className="admin-shell">
      <AdminHeader title="پکیج‌ها و قیمت" subtitle="پیش‌نمایش پایین همان چیزی است که مشتری می‌بیند" />
      <AdminPackagesManager initial={settings} />
    </main>
  );
}
