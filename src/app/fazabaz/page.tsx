import { LinkPageLoader } from "@/components/LinkPageLoader";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return pageMetadata("outdoor-conditions");
}

export default function FazabazPage() {
  return <LinkPageLoader slug="outdoor-conditions" />;
}
