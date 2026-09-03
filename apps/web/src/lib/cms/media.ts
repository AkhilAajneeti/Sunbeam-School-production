/**
 * TURNING A STRAPI FILE INTO SOMETHING <img> CAN USE.
 *
 * ═══ WHY THE SITE NO LONGER OPTIMISES ITS OWN IMAGES ═══════════════════════
 *
 * Astro's <Picture> takes an ImageMetadata produced by importing a file from
 * src/assets, and derives every width itself at build time. That is why this
 * project was generating 8,328 image variants into a 948 MB dist/ and taking
 * 23m46s to build: the cost is paid again, in full, on every single build,
 * including one that only changed a line of text.
 *
 * Strapi derives its sizes ONCE, at upload, into config/plugins.ts's
 * breakpoints — which were set to the widths this site actually asks for. So
 * the work happens when a poster is uploaded, not when the site is built, and
 * the build stops touching images altogether.
 *
 * ⚠ THE BREAKPOINTS IN apps/cms/config/plugins.ts AND THE WIDTHS REQUESTED IN
 * COMPONENTS ARE ONE DECISION IN TWO PLACES. Change a component's `sizes` and
 * the derivative it wants may not exist. `srcSet` degrades safely — it emits
 * whatever Strapi did generate — but the browser then downloads a larger file
 * than it needed.
 *
 * ⚠ DERIVATIVES KEEP THE SOURCE FORMAT. Strapi resizes; it does not convert.
 * A JPEG upload yields JPEG derivatives, so these are correctly-sized JPEGs
 * rather than the AVIF/WebP the old build emitted. Correct size is the larger
 * win by far, and format conversion is a later, separate change — an upload
 * hook or imgproxy — not a reason to keep image processing in the build.
 */
import { STRAPI_URL } from './config';
import type { StrapiFile, StrapiFormat } from './types';

/** Absolute URL for a Strapi-relative path. Already-absolute URLs pass through. */
export function mediaUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${STRAPI_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** The file's own URL, full size. */
export function fileUrl(file: StrapiFile | null | undefined): string {
  return mediaUrl(file?.url);
}

/**
 * Every derivative, smallest first, with the original appended.
 * Files with no derivatives return just the original.
 */
export function formatsOf(file: StrapiFile | null | undefined): StrapiFormat[] {
  if (!file) return [];

  const derived = Object.values(file.formats ?? {}).filter(
    (f): f is StrapiFormat => Boolean(f?.url && f?.width),
  );

  const original: StrapiFormat | null =
    file.width && file.height
      ? { url: file.url, width: file.width, height: file.height, mime: file.mime, size: 0 }
      : null;

  const all = original ? [...derived, original] : derived;

  /* De-duplicate by width — Strapi skips a breakpoint at or above the source
     width, but a source that happens to match one exactly yields two entries
     of the same width, and a duplicate descriptor makes a srcset invalid. */
  const byWidth = new Map<number, StrapiFormat>();
  for (const f of all) if (!byWidth.has(f.width)) byWidth.set(f.width, f);

  return [...byWidth.values()].sort((a, b) => a.width - b.width);
}

/** A `srcset` string, or '' when there is nothing to describe. */
export function srcSet(file: StrapiFile | null | undefined): string {
  return formatsOf(file)
    .map((f) => `${mediaUrl(f.url)} ${f.width}w`)
    .join(', ');
}

/**
 * The smallest derivative at least `targetWidth` across, else the largest there
 * is. Used for the `src` fallback, which only matters to browsers that ignore
 * srcset — but it should still not be the 1600px original.
 */
export function formatAtLeast(
  file: StrapiFile | null | undefined,
  targetWidth: number,
): StrapiFormat | null {
  const all = formatsOf(file);
  if (all.length === 0) return null;
  return all.find((f) => f.width >= targetWidth) ?? all[all.length - 1];
}

/**
 * Intrinsic dimensions, for the width/height attributes that reserve space and
 * stop the page shifting as posters load. Falls back to the largest derivative
 * when the original's dimensions are absent.
 */
export function dimensions(file: StrapiFile | null | undefined): { width: number; height: number } | null {
  if (file?.width && file?.height) return { width: file.width, height: file.height };

  const all = formatsOf(file);
  const largest = all[all.length - 1];
  return largest ? { width: largest.width, height: largest.height } : null;
}

/**
 * Strip the `{{…}}` emphasis markers from a heading, keeping the words.
 *
 * ⚠ THE MARKER TRAVELS WITH THE CONTENT, NOT WITH THE PAGE. One heading —
 * "A word from our {{Principal}}" — is rendered in two places: the homepage
 * panel underlines the marked words, and /about/principals-message/ prints the
 * sentence plain, exactly as it always has. Storing two headings so each could
 * be styled differently would let the school correct one and not the other.
 */
export function plainHeading(text: string | null | undefined): string {
  return (text ?? '').replace(/\{\{([\s\S]*?)\}\}/g, '$1');
}

/**
 * Fill `{token}` placeholders in CMS text from values the site already owns.
 *
 * ⚠ THIS IS HOW A DERIVED FIGURE STAYS DERIVED INSIDE A SENTENCE. The hero
 * deck reads "… — {currentStrength} students, Nursery to Class XII …". The roll
 * belongs to Site Settings; the sentence belongs to the homepage. Writing the
 * number into the sentence would give one fact two homes, and the day the roll
 * changes only one of them would be corrected.
 *
 * An unknown token is left exactly as typed rather than blanked, so a
 * mistyped placeholder shows itself instead of quietly deleting a number.
 */
export function fillTokens(
  text: string | null | undefined,
  vars: Record<string, string | number | null | undefined>,
): string {
  return (text ?? '').replace(/\{(\w+)\}/g, (whole, key) => {
    const v = vars[key];
    return v === undefined || v === null ? whole : String(v);
  });
}
