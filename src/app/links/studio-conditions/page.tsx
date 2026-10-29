import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { LinkPageView } from "@/components/LinkPageView";

export default async function StudioConditionsPage() {
  const page = await getPage("studio-conditions");
  if (!page) notFound();
  return <LinkPageView page={page} />;
}
