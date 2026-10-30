import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/lib/content";
import { isAnnouncementLive } from "@/lib/announcement";
import { LinkPageView } from "@/components/LinkPageView";
import { withStudio } from "@/lib/studio";

export async function LinkPageLoader({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page) notFound();
  return (
    <LinkPageView
      page={withStudio(page, settings.studio)}
      settings={settings}
      announcementLive={isAnnouncementLive(settings.announcement)}
    />
  );
}
