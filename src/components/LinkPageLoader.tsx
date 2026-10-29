import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { LinkPageView } from "@/components/LinkPageView";

export async function LinkPageLoader({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return <LinkPageView page={page} />;
}
