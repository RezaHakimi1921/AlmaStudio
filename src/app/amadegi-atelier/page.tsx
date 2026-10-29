import { LinkPageLoader } from "@/components/LinkPageLoader";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return pageMetadata("studio-prep");
}

export default function AmadegiAtelierPage() {
  return <LinkPageLoader slug="studio-prep" />;
}
