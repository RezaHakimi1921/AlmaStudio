import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
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

  const withPhone = content.pages.find((p) => p.phone.trim());
  const withMaps = content.pages.find((p) => p.showMaps && p.mapsUrl.trim());
  const withNeshan = content.pages.find((p) => p.showNeshan && p.neshanUrl.trim());
  const maps = [
    withNeshan ? { key: "neshan", label: "نشان", href: withNeshan.neshanUrl.trim() } : null,
    withMaps ? { key: "google", label: "گوگل‌مپ", href: withMaps.mapsUrl.trim() } : null,
  ].filter((m): m is { key: string; label: string; href: string } => m !== null);

  return (
    <DecorCatalog
      items={decors.items.filter((d) => d.visible)}
      phone={withPhone?.phone ?? ""}
      maps={maps}
      announcement={isAnnouncementLive(announcement) ? announcement : null}
      backHref={safeBackHref(from)}
    />
  );
}
