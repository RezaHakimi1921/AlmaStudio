import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPage, getSettings, isLinkSlug } from "@/lib/content";
import { AdminEditForm } from "@/components/AdminEditForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditPage({ params }: Props) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const { slug } = await params;
  if (!isLinkSlug(slug)) notFound();

  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page) notFound();

  return (
    <main className="admin-shell">
      <AdminEditForm page={page} settings={settings} />
    </main>
  );
}
