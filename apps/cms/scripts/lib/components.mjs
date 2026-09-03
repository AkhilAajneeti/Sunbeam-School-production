/**
 * BUILDING COMPONENT PAYLOADS FOR A SEED.
 *
 * Strapi takes a repeatable component as a plain array of objects, and a media
 * field inside one as a file id. So a gallery of eight photographs is eight
 * uploads followed by one array — and every remaining data file in this project
 * has at least one gallery.
 *
 * ⚠ SEPARATE FROM media.mjs ON PURPOSE. That module is about getting one file
 * into the library idempotently and is used by the verified notice and
 * achievement seeds; this is about assembling component shapes on top of it.
 * Keeping them apart means a change here cannot affect those.
 *
 * ⚠ PHOTO NAMES MUST BE STABLE AND UNIQUE ACROSS THE WHOLE LIBRARY. Media has
 * no natural key, so uploadMedia reuses by filename. Two galleries that both
 * name their first photo `gallery-01` would silently share one file. Callers
 * pass a `prefix` that includes the owning document's slug for that reason.
 */
import { uploadMedia } from './media.mjs';

/**
 * Upload a list of `{ image, alt, caption? }` and return shared.photo entries.
 *
 * @param {object} strapi
 * @param {Array<{image?: {absolutePath?: string}, alt: string, caption?: string}>} photos
 * @param {object} opts
 * @param {string} opts.prefix  stable, document-scoped, e.g. `meet-pradiptam-2-0`
 * @param {boolean} [opts.force]
 * @returns {Promise<{entries: object[], uploaded: number, reused: number}>}
 */
export async function buildPhotoComponents(strapi, photos, { prefix, force = false } = {}) {
  const entries = [];
  let uploaded = 0;
  let reused = 0;

  for (const [i, p] of (photos ?? []).entries()) {
    const absolutePath = p?.image?.absolutePath;
    if (!absolutePath) {
      throw new Error(`${prefix}: gallery entry ${i} has no resolvable image path`);
    }

    const { file, reused: wasReused } = await uploadMedia(strapi, {
      absolutePath,
      /* Zero-padded so the media library lists them in gallery order rather than
         1, 10, 11, 2 — the editor browsing it should see what the page shows. */
      name: `${prefix}-${String(i + 1).padStart(2, '0')}`,
      alternativeText: p.alt,
      caption: p.caption ?? null,
      force,
    });

    wasReused ? reused++ : uploaded++;

    entries.push({
      image: file.id,
      alt: p.alt,
      caption: p.caption ?? null,
    });
  }

  return { entries, uploaded, reused };
}

/**
 * Turn `string[]` into shared.paragraph entries.
 *
 * ⚠ NOT A RICH-TEXT FIELD, AND THAT IS THE POINT. The source data models body
 * copy as an array where each entry is its own <p>, and several of those arrays
 * are marked VERBATIM in their source file — the school's own sentences, in its
 * own order. A rich-text field would merge them into one editable blob and the
 * paragraph breaks would become a matter of whoever edits it next.
 */
export function toParagraphs(lines) {
  return (lines ?? [])
    .filter((t) => typeof t === 'string' && t.trim().length > 0)
    .map((text) => ({ text }));
}

export default buildPhotoComponents;

/**
 * Map the project's `{ n, mark, k, v }` card shape onto shared.point.
 *
 * ⚠ THE SOURCE'S FIELD NAMES ARE ONE-LETTER AND THE COMPONENT'S ARE NOT.
 * `k`/`v` read fine inside a data file that a developer wrote; they read as
 * nothing at all in an admin form that a school secretary has to fill in. The
 * component uses number/icon/title/body, and the query layer maps back so the
 * .astro files keep destructuring `n`, `mark`, `k`, `v` unchanged.
 */
export function toPoints(items) {
  return (items ?? []).map((p) => ({
    number: p.n ?? null,
    icon: p.mark ?? p.icon ?? null,
    title: p.k ?? p.title,
    body: p.v ?? p.body,
  }));
}
