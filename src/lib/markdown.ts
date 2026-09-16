import { marked } from "marked";

/** Heuristic: does this string already contain rendered HTML? */
export function isHtml(content: string): boolean {
  const trimmed = content.trim();
  return (
    /^<[a-z][\s\S]*>/i.test(trimmed) ||
    /<(?:p|h[1-6]|ul|ol|li|strong|em|blockquote|div|br\s*\/?|table)[\s>]/i.test(trimmed)
  );
}

/**
 * Convert GFM markdown to HTML (tables, nested lists, multi-line blockquotes,
 * etc.). If the content is already HTML it is returned unchanged so notes that
 * have been edited in the rich-text editor round-trip safely.
 */
export function markdownToHtml(markdown: string): string {
  if (isHtml(markdown)) {
    return markdown;
  }
  return marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
}
