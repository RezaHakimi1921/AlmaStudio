import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminGalleryManager } from "@/components/AdminGalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const settings = await getSettings();
  return (
    <main className="admin-shell">
      <AdminHeader title="نمونه‌کارها" subtitle="گالری بارداری، نوزاد و کودک" />
      <AdminGalleryManager initial={settings} />
    </main>
  );
}
