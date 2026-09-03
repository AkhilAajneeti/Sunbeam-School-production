/**
 * A STABLE SLUG FROM A TITLE.
 *
 * ⚠ THIS IS AN IDENTITY KEY, NOT A URL. Notices carried their own `id` in the
 * source data and that was used directly. Most other data files do not — a
 * credential and a record are plain objects with a title and nothing to key on —
 * so the seed derives one, and it must derive the SAME one every run or
 * idempotency breaks and the second run duplicates everything.
 *
 * ⚠ CURLY PUNCTUATION IS EVERYWHERE IN THIS CONTENT AND MUST NOT SURVIVE.
 * The data files use typographic apostrophes and em dashes throughout —
 * "Kho-Kho Girls’ Championship", "Education World — #1 Co-Ed Day School".
 * Normalising to NFKD and stripping combining marks also folds accented Latin
 * to ASCII, so "Ayushi" and any future "José" both key cleanly.
 *
 * ⚠ DEVANAGARI SURVIVES NORMALISATION AND WOULD PRODUCE AN EMPTY SLUG.
 * data/notices.ts already carries "अन्नबोध — Annabodh". Stripping non-ASCII
 * would leave "annabodh" there, which is fine, but a title that is ONLY
 * Devanagari would slug to ''. The guard at the end throws rather than writing
 * an empty key that silently collides with the next empty one.
 */

export function slugify(input) {
  const slug = String(input)
    .normalize('NFKD')
    // Combining marks left behind by NFKD — é → e + ́ → e
    .replace(/[̀-ͯ]/g, '')
    // Curly quotes and apostrophes vanish rather than becoming separators, so
    // "Girls’ Championship" is girls-championship, not girls--championship.
    .replace(/['’‘`´]/g, '')
    .toLowerCase()
    // Everything else that is not a letter, digit or hyphen becomes a separator.
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  if (!slug) {
    throw new Error(
      `slugify() produced an empty slug for ${JSON.stringify(input)} — give this item an explicit id.`,
    );
  }

  return slug;
}

/**
 * Slug prefixed with a namespace.
 *
 * Used where one collection holds what were separate arrays in the source —
 * achievement records merge `sportRecord` and `academicRecord`, so a title
 * appearing in both would collide on a collection-unique uid field.
 */
export function namespacedSlug(namespace, input) {
  return `${slugify(namespace)}-${slugify(input)}`;
}

export default slugify;
