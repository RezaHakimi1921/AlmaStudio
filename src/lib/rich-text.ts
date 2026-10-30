/**
 * The page body is stored as a tiny HTML subset: <p>, <br>, <b>.
 * Everything else (attributes, scripts, styles, other tags) is removed.
 * Works on the server and in the browser (no DOM needed).
 */
const ALLOWED = new Set(["p", "br", "b"]);
const RENAME: Record<string, string> = { strong: "b", div: "p" };

export function sanitizeBodyHtml(input: string): string {
  let html = String(input ?? "");
  // drop whole dangerous blocks, including their content
  html = html.replace(/<(script|style|iframe|object|embed|template|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<\s*(\/?)\s*([a-zA-Z0-9]+)[^>]*>/g, (_m, close: string, rawTag: string) => {
    const tag = RENAME[rawTag.toLowerCase()] ?? rawTag.toLowerCase();
    if (!ALLOWED.has(tag)) return "";
    if (tag === "br") return close ? "" : "<br>";
    return `<${close}${tag}>`;
  });
  // stray "<" that isn't a tag anymore
  html = html.replace(/<(?!\/?(p|b|br)>)/g, "&lt;");
  // tidy: empty paragraphs / bold, nested paragraphs from pasted divs
  html = html
    .replace(/<p>\s*(<br>)?\s*<\/p>/g, "")
    .replace(/<b>\s*<\/b>/g, "")
    .replace(/<p>\s*<p>/g, "<p>")
    .replace(/<\/p>\s*<\/p>/g, "</p>")
    .trim();
  // plain text without paragraphs → one paragraph per line
  if (html && !/<p>/.test(html)) {
    html = html
      .split(/\n+|(?:<br>\s*){2,}/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `<p>${l}</p>`)
      .join("\n");
  }
  return html;
}
