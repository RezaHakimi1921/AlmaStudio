import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { LinkPageView } from "@/components/LinkPageView";

export default async function OutdoorPrepPage() {
  const page = await getPage("outdoor-prep");
  if (!page) notFound();
  return <LinkPageView page={page} />;
}
