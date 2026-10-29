import { promises as fs } from "fs";
import path from "path";
import { defaultContent, defaultSettings } from "./default-content";
import { normalizeMediaUrl } from "./media";
import { parseFaNumber } from "./tehran";
import type {
  DayHours,
  Decor,
  FaqItem,
  GalleryImage,
  LinkPageContent,
  LinkSlug,
  SiteContent,
  SiteSettings,
  StudioPackage,
} from "./types";
import { GALLERY_CATEGORIES, LINK_SLUGS } from "./types";

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
    heroImageUrl: normalizeMediaUrl(String(raw.heroImageUrl ?? fallback.heroImageUrl)),
    introTheme: (raw.introTheme as LinkPageContent["introTheme"]) || fallback.introTheme,
    introLabel: String(raw.introLabel ?? fallback.introLabel),
    phone: raw.phone != null ? String(raw.phone) : fallback.phone || "",
    bodyHtml: hasNew
      ? String(raw.bodyHtml)
      : raw.greeting
        ? `<p>${String(raw.greeting)}</p>\n${blocksToHtml(raw.blocks)}`
        : fallback.bodyHtml,
    packageFilter: (["none", "all", ...GALLERY_CATEGORIES] as string[]).includes(String(raw.packageFilter))
      ? (raw.packageFilter as LinkPageContent["packageFilter"])
      : "none",
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

const str = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const bool = (v: unknown, fallback: boolean) => (v == null ? fallback : Boolean(v));
const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validate + fill defaults for site-wide settings (also used on save). */
export function migrateSettings(raw: unknown): SiteSettings {
  const d = defaultSettings;
  const r = obj(raw);

  const a = obj(r.announcement);
  const announcement = {
    enabled: bool(a.enabled, d.announcement.enabled),
    tone: a.tone === "info" ? ("info" as const) : ("festival" as const),
    text: str(a.text, d.announcement.text).slice(0, 220),
    linkLabel: str(a.linkLabel, d.announcement.linkLabel).slice(0, 40),
    linkUrl: str(a.linkUrl, d.announcement.linkUrl).trim(),
    startDate: DATE_RE.test(str(a.startDate)) ? str(a.startDate) : "",
    endDate: DATE_RE.test(str(a.endDate)) ? str(a.endDate) : "",
  };

  const h = obj(r.hours);
  const rawDays = Array.isArray(h.days) ? h.days.map(obj) : [];
  const days: DayHours[] = d.hours.days.map((def) => {
    const found = rawDays.find((x) => Number(x.day) === def.day) ?? {};
    const from = str(found.from, def.from);
    const to = str(found.to, def.to);
    return {
      day: def.day,
      open: bool(found.open, def.open),
      from: TIME_RE.test(from) ? from : def.from,
      to: TIME_RE.test(to) ? to : def.to,
    };
  });
  const hours = {
    enabled: bool(h.enabled, d.hours.enabled),
    note: str(h.note, d.hours.note).slice(0, 160),
    days,
  };

  const f = obj(r.faq);
  const faqItems: FaqItem[] = Array.isArray(f.items)
    ? f.items
        .map(obj)
        .map((x, i) => ({
          id: str(x.id) || `faq-${Date.now()}-${i}`,
          question: str(x.question).trim().slice(0, 300),
          answer: str(x.answer).trim().slice(0, 2000),
          visible: bool(x.visible, true),
        }))
        .filter((x) => x.question)
    : structuredClone(d.faq.items);
  const faq = { enabled: bool(f.enabled, d.faq.enabled), items: faqItems };

  const g = obj(r.gallery);
  const images: GalleryImage[] = Array.isArray(g.images)
    ? g.images
        .map(obj)
        .map((x, i) => ({
          id: str(x.id) || `img-${Date.now()}-${i}`,
          url: normalizeMediaUrl(str(x.url).trim()),
          caption: str(x.caption).trim().slice(0, 120),
          category: (GALLERY_CATEGORIES as readonly string[]).includes(str(x.category))
            ? (str(x.category) as GalleryImage["category"])
            : "newborn",
        }))
        .filter((x) => x.url)
    : [];
  const gallery = { enabled: bool(g.enabled, d.gallery.enabled), images };

  const isCat = (v: unknown): v is GalleryImage["category"] =>
    (GALLERY_CATEGORIES as readonly string[]).includes(str(v));
  const money = (v: unknown) => {
    const n = typeof v === "number" ? Math.round(v) : parseFaNumber(str(v));
    return Number.isFinite(n) && n > 0 ? Math.min(n, 1e12) : 0;
  };

  const dc = obj(r.decors);
  const decorItems: Decor[] = Array.isArray(dc.items)
    ? dc.items
        .map(obj)
        .map((x, i) => ({
          id: str(x.id) || `decor-${Date.now()}-${i}`,
          number: Math.max(1, Math.min(9999, Math.round(Number(x.number)) || i + 1)),
          name: str(x.name).trim().slice(0, 80),
          category: isCat(x.category) ? x.category : "newborn",
          imageUrl: str(x.imageUrl).trim(),
          note: str(x.note).trim().slice(0, 300),
          visible: bool(x.visible, true),
        }))
        .filter((x) => x.imageUrl)
        .sort((a, b) => a.number - b.number)
    : [];
  const decors = { enabled: bool(dc.enabled, d.decors.enabled), items: decorItems };

  const pk = obj(r.packages);
  const packageItems: StudioPackage[] = Array.isArray(pk.items)
    ? pk.items
        .map(obj)
        .map((x, i) => ({
          id: str(x.id) || `pkg-${Date.now()}-${i}`,
          name: str(x.name).trim().slice(0, 80),
          price: money(x.price),
          oldPrice: money(x.oldPrice),
          badge: str(x.badge).trim().slice(0, 30),
          description: str(x.description).trim().slice(0, 300),
          features: (Array.isArray(x.features) ? x.features : [])
            .map((f) => str(f).trim().slice(0, 140))
            .filter(Boolean)
            .slice(0, 20),
          category: isCat(x.category) ? x.category : "newborn",
          visible: bool(x.visible, true),
        }))
        .filter((x) => x.name)
    : [];
  const packages = { items: packageItems };

  const hubRaw = obj(r.hub);
  const hub = {
    title: str(hubRaw.title, d.hub.title).slice(0, 80) || d.hub.title,
    subtitle: str(hubRaw.subtitle, d.hub.subtitle).slice(0, 200),
    heroImageUrl:
      normalizeMediaUrl(str(hubRaw.heroImageUrl, d.hub.heroImageUrl)) || d.hub.heroImageUrl,
  };

  return { hub, announcement, hours, faq, gallery, decors, packages };
}

function migrateContent(parsed: unknown): SiteContent {
  if (!parsed || typeof parsed !== "object") return structuredClone(defaultContent);
  const pages = (parsed as { pages?: unknown }).pages;
  if (!Array.isArray(pages) || !pages.length) return structuredClone(defaultContent);
  const settings = migrateSettings((parsed as { settings?: unknown }).settings);

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
    settings,
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
  // write to a temp file then rename, so a crash never leaves half a JSON file
  const tmp = `${DATA_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2), "utf8");
  await fs.rename(tmp, DATA_PATH);
}

export async function getSettings(): Promise<SiteSettings> {
  return (await readContent()).settings;
}

export async function updateSettings(next: unknown): Promise<SiteSettings> {
  const content = await readContent();
  content.settings = migrateSettings(next);
  await writeContent(content);
  return content.settings;
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
