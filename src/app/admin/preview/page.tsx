import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { PreviewFrame } from "@/components/PreviewFrame";

export const dynamic = "force-dynamic";

/** Loaded inside the admin's preview iframe; the page data arrives by postMessage. */
export default async function AdminPreviewPage() {
  if (!(await isAuthenticated())) redirect("/admin");
  return <PreviewFrame />;
}
