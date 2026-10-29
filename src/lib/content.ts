import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-content";
import type { LinkPageContent, LinkSlug, SiteContent } from "./types";
import { LINK_SLUGS } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

function blocksToHtml(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((raw) => {
      const b = raw as Record<string, unknown>;
      const title = b.title ? `<p><b>${String(b.title)}</b></p>` : "";
      const body = b.body ? `<p>${String(b.body)}</p>` : "";
      const price = b.price ? `<p><b>${String(b.price)}</b></p>` : "";
      return `${title}${body}${price}`;
    })
    .join("\n");
}

function migratePage(raw: Record<string, unknown>, fallback: LinkPageContent): LinkPageContent {
  const slug = String(raw.slug || fallback.slug);
  const hasNew = typeof raw.bodyHtml === "string";
  return {
    slug,
    title: String(raw.title ?? fallback.title),
    subtitle: String(raw.subtitle ?? fallback.subtitle ?? ""),
    moodTag: String(raw.moodTag ?? fallback.moodTag),
    brandLabel: String(raw.brandLabel ?? fallback.brandLabel),
    heroImageUrl: String(raw.heroImageUrl ?? fallback.heroImageUrl),
    introTheme: (raw.introTheme as LinkPageContent["introTheme"]) || fallback.introTheme,
    introLabel: String(raw.introLabel ?? fallback.introLabel),
    phone: raw.phone != null ? String(raw.phone) : fallback.phone || "",
    bodyHtml: hasNew
      ? String(raw.bodyHtml)
      : raw.greeting
        ? `<p>${String(raw.greeting)}</p>\n${blocksToHtml(raw.blocks)}`
        : fallback.bodyHtml,
    packagesText:
      raw.packagesText != null ? String(raw.packagesText) : fallback.packagesText || "",
    notesText: raw.notesText != null ? String(raw.notesText) : fallback.notesText || "",
    closingMessage: String(raw.closingMessage ?? fallback.closingMessage ?? ""),
    addressTitle: String(raw.addressTitle ?? fallback.addressTitle ?? ""),
    address: String(raw.address ?? fallback.address ?? ""),
    instagramUrl: String(raw.instagramUrl ?? fallback.instagramUrl),
    mapsUrl: String(raw.mapsUrl ?? fallback.mapsUrl),
    neshanUrl: String(raw.neshanUrl ?? fallback.neshanUrl ?? ""),
    baleUrl: String(raw.baleUrl ?? fallback.baleUrl ?? ""),
    showInstagram:
      raw.showInstagram != null ? Boolean(raw.showInstagram) : fallback.showInstagram,
    showMaps: raw.showMaps != null ? Boolean(raw.showMaps) : fallback.showMaps,
    showNeshan: raw.showNeshan != null ? Boolean(raw.showNeshan) : false,
    showBale: raw.showBale != null ? Boolean(raw.showBale) : false,
    published: raw.published != null ? Boolean(raw.published) : true,
  };
}

function migrateContent(parsed: unknown): SiteContent {
  if (!parsed || typeof parsed !== "object") return structuredClone(defaultContent);
  const pages = (parsed as { pages?: unknown }).pages;
  if (!Array.isArray(pages) || !pages.length) return structuredClone(defaultContent);

  const bySlug = new Map(
    pages.map((p) => {
      const raw = p as Record<string, unknown>;
      return [String(raw.slug), raw] as const;
    }),
  );

  return {
    pages: LINK_SLUGS.map((slug) => {
      const fallback = defaultContent.pages.find((p) => p.slug === slug)!;
      const raw = bySlug.get(slug);
      return raw ? migratePage(raw, fallback) : structuredClone(fallback);
    }),
  };
}

export async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return migrateContent(JSON.parse(raw));
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
  const fallback = defaultContent.pages.find((p) => p.slug === slug)!;
  content.pages[idx] = migratePage(
    { ...page, slug } as unknown as Record<string, unknown>,
    fallback,
  );
  await writeContent(content);
  return content;
}

export function isLinkSlug(value: string): value is LinkSlug {
  return (LINK_SLUGS as readonly string[]).includes(value);
}
