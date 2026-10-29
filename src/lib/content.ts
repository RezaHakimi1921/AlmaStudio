import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import type { ContentBlock, LinkPageContent, LinkSlug, SiteContent } from "./types";
import { LINK_SLUGS } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

function migrateBlock(raw: Record<string, unknown>, index: number): ContentBlock {
  const oldType = String(raw.type || "text");
  let type: ContentBlock["type"] = "text";
  if (oldType === "note" || oldType === "price" || oldType === "image" || oldType === "contact" || oldType === "text") {
    type = oldType;
  } else if (oldType === "heading" || oldType === "paragraph") {
    type = "text";
  }

  return {
    id: String(raw.id || `b-${index}`),
    type,
    title: raw.title ? String(raw.title) : undefined,
    body: raw.body != null ? String(raw.body) : undefined,
    price: raw.price ? String(raw.price) : undefined,
    imageUrl: raw.imageUrl ? String(raw.imageUrl) : undefined,
    imageAlt: raw.imageAlt ? String(raw.imageAlt) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    bold: Boolean(raw.bold),
  };
}

function migratePage(raw: Record<string, unknown>, fallback?: LinkPageContent): LinkPageContent {
  const slug = String(raw.slug || fallback?.slug || "");
  const defaults = defaultContent.pages.find((p) => p.slug === slug) || fallback || defaultContent.pages[0];
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : defaults.blocks;

  return {
    slug,
    title: String(raw.title || defaults.title),
    subtitle: raw.subtitle != null ? String(raw.subtitle) : defaults.subtitle,
    moodTag: String(raw.moodTag || defaults.moodTag),
    brandLabel: String(raw.brandLabel || defaults.brandLabel),
    greeting: raw.greeting != null ? String(raw.greeting) : defaults.greeting,
    heroImageUrl: String(raw.heroImageUrl || defaults.heroImageUrl),
    introTheme: (raw.introTheme as LinkPageContent["introTheme"]) || defaults.introTheme,
    introLabel: String(raw.introLabel || defaults.introLabel),
    phone: raw.phone != null ? String(raw.phone) : defaults.phone || "",
    blocks: (blocksRaw as Record<string, unknown>[]).map(migrateBlock),
    closingMessage:
      raw.closingMessage != null ? String(raw.closingMessage) : defaults.closingMessage,
    addressTitle: raw.addressTitle != null ? String(raw.addressTitle) : defaults.addressTitle,
    address: raw.address != null ? String(raw.address) : defaults.address,
    instagramUrl: String(raw.instagramUrl || defaults.instagramUrl),
    mapsUrl: String(raw.mapsUrl || defaults.mapsUrl),
    showInstagram:
      raw.showInstagram != null ? Boolean(raw.showInstagram) : defaults.showInstagram,
    showMaps: raw.showMaps != null ? Boolean(raw.showMaps) : defaults.showMaps,
    published: raw.published != null ? Boolean(raw.published) : true,
  };
}

function migrateContent(parsed: unknown): SiteContent {
  if (!parsed || typeof parsed !== "object") return structuredClone(defaultContent);
  const pages = (parsed as { pages?: unknown }).pages;
  if (!Array.isArray(pages) || pages.length === 0) return structuredClone(defaultContent);

  const bySlug = new Map(
    pages.map((p) => {
      const page = migratePage(p as Record<string, unknown>);
      return [page.slug, page] as const;
    }),
  );

  return {
    pages: LINK_SLUGS.map((slug) => {
      const existing = bySlug.get(slug);
      const fallback = defaultContent.pages.find((p) => p.slug === slug)!;
      return existing ? migratePage(existing as unknown as Record<string, unknown>, fallback) : structuredClone(fallback);
    }),
  };
}

export async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const migrated = migrateContent(JSON.parse(raw));
    return migrated;
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
  content.pages[idx] = migratePage(page as unknown as Record<string, unknown>, page);
  content.pages[idx].slug = slug;
  await writeContent(content);
  return content;
}

export function isLinkSlug(value: string): value is LinkSlug {
  return (LINK_SLUGS as readonly string[]).includes(value);
}

/** Force-reset content file to defaults (used once after redesign). */
export async function resetContentToDefaults(): Promise<SiteContent> {
  const seed = structuredClone(defaultContent);
  await writeContent(seed);
  return seed;
}
