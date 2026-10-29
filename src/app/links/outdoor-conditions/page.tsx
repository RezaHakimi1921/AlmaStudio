import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { LinkPageView } from "@/components/LinkPageView";

export default async function OutdoorConditionsPage() {
  const page = await getPage("outdoor-conditions");
  if (!page) notFound();
  return <LinkPageView page={page} />;
}
