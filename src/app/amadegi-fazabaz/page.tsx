import { LinkPageLoader } from "@/components/LinkPageLoader";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return pageMetadata("outdoor-prep");
}

export default function AmadegiFazabazPage() {
  return <LinkPageLoader slug="outdoor-prep" />;
}
