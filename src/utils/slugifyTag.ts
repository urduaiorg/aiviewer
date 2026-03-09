/**
 * Converts a raw tag string into a URL-safe slug.
 * "UI/UX" → "ui-ux", "Claude Opus 4.6" → "claude-opus-4-6"
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\/\\]/g, '-')      // slashes → hyphens
    .replace(/[^a-z0-9\s-]/g, '') // strip special chars (keep spaces & hyphens)
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '');       // trim leading/trailing hyphens
}
