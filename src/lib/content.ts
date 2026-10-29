import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import type { LinkPageContent, LinkSlug, SiteContent } from "./types";
import { LINK_SLUGS } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as SiteContent;
    if (!parsed?.pages?.length) return structuredClone(defaultContent);
    return parsed;
  } catch {
    const seed = structuredClone(defaultContent);
    await writeContent(seed);
    return seed;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(content, null, 2), "utf8");
}

export async function getPage(slug: string): Promise<LinkPageContent | null> {
  const content = await readContent();
  return content.pages.find((p) => p.slug === slug) ?? null;
}

export async function updatePage(
  slug: LinkSlug,
  page: LinkPageContent,
): Promise<SiteContent> {
  const content = await readContent();
  const idx = content.pages.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error("صفحه یافت نشد");
  content.pages[idx] = { ...page, slug };
  await writeContent(content);
  return content;
}

export function isLinkSlug(value: string): value is LinkSlug {
  return (LINK_SLUGS as readonly string[]).includes(value);
}
