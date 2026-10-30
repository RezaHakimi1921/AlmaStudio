import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
import { studioMaps } from "@/lib/studio";
import { isAnnouncementLive } from "@/lib/announcement";
import { DecorCatalog } from "@/components/DecorCatalog";
import { safeBackHref } from "@/lib/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "دکورهای آتلیه | آتلیه آلما",
  description: "دکور دلخواهتان را انتخاب کنید و شماره‌اش را هنگام رزرو بگویید",
  openGraph: {
    title: "دکورهای آتلیه آلما",
    description: "دکور دلخواهتان را با شماره انتخاب کنید",
    locale: "fa_IR",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ from?: string }> };

export default async function DecorPage({ searchParams }: Props) {
  const [{ from }, content] = await Promise.all([searchParams, readContent()]);
  const { decors, announcement } = content.settings;
  if (!decors.enabled) notFound();

  const { studio } = content.settings;

  return (
    <DecorCatalog
      items={decors.items.filter((d) => d.visible)}
      phone={studio.phone}
      maps={studioMaps(studio)}
      announcement={isAnnouncementLive(announcement) ? announcement : null}
      backHref={safeBackHref(from)}
    />
  );
}
