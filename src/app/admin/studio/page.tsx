import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminStudioForm } from "@/components/AdminStudioForm";

export const dynamic = "force-dynamic";

export default async function AdminStudioPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  const content = await readContent();
  const overrides = content.pages
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      fields: (
        [
          ["phone", "شماره"],
          ["address", "آدرس"],
          ["addressTitle", "عنوان آدرس"],
          ["instagramUrl", "اینستاگرام"],
          ["mapsUrl", "گوگل‌مپ"],
          ["neshanUrl", "نشان"],
          ["baleUrl", "بله"],
        ] as const
      )
        .filter(([k]) => p[k].trim())
        .map(([, label]) => label),
    }))
    .filter((o) => o.fields.length);
  return (
    <main className="admin-shell">
      <AdminHeader title="اطلاعات تماس آتلیه" subtitle="یک بار وارد کنید؛ همه لینک‌ها از همین استفاده می‌کنند" />
      <AdminStudioForm initial={content.settings} overrides={overrides} />
    </main>
  );
}
