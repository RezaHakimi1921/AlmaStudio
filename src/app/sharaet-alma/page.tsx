import { LinkPageLoader } from "@/components/LinkPageLoader";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return pageMetadata("studio-conditions");
}

export default function SharaetAlmaPage() {
  return <LinkPageLoader slug="studio-conditions" />;
}
