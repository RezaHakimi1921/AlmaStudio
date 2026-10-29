import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPage, isLinkSlug } from "@/lib/content";
import { AdminEditForm } from "@/components/AdminEditForm";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditPage({ params }: Props) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const { slug } = await params;
  if (!isLinkSlug(slug)) notFound();

  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className="admin-shell">
      <AdminEditForm page={page} />
    </main>
  );
}
