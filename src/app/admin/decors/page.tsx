import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminDecorManager } from "@/components/AdminDecorManager";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSettings();
  return (
    <main className="admin-shell">
      <AdminHeader title="دکورهای آتلیه" subtitle="هر دکور یک شماره دارد؛ مشتری با شماره انتخاب می‌کند" />
      <AdminDecorManager initial={settings} />
    </main>
  );
}
