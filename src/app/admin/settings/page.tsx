import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminSettingsForm } from "@/components/AdminSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSettings();
  return (
    <main className="admin-shell">
      <AdminHeader title="اطلاعیه، ساعات و سوالات" subtitle="روی همه لینک‌ها نمایش داده می‌شود" />
      <AdminSettingsForm initial={settings} />
    </main>
  );
}
