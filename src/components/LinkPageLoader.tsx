import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { getPage, getSettings } from "@/lib/content";
import { isAnnouncementLive } from "@/lib/announcement";
import { LinkPageView } from "@/components/LinkPageView";
import { withStudio } from "@/lib/studio";

export async function LinkPageLoader({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page) notFound();
  // start fetching the hero photo with the HTML — before any JS runs
  preload(page.heroImageUrl, { as: "image", fetchPriority: "high" });
  return (
    <LinkPageView
      page={withStudio(page, settings.studio)}
      settings={settings}
      announcementLive={isAnnouncementLive(settings.announcement)}
    />
  );
}
