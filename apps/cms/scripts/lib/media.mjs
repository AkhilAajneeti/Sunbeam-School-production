/**
 * IDEMPOTENT MEDIA UPLOAD.
 *
 * Every seed script needs the same thing: put a file from apps/web/src/assets/
 * into Strapi's media library, and do not create a second copy of it when the
 * script runs again.
 *
 * ⚠ IDENTITY IS THE FILE NAME WE GIVE IT, NOT THE PATH ON DISK. Strapi has no
 * natural key for an upload — re-running an upload of the same bytes produces a
 * second row with a new hash. So each caller supplies a stable name derived
 * from the content it belongs to (`notice-world-environment-day`), and this
 * looks that name up before uploading anything. Re-running the seed then
 * re-uses the existing file rather than filling the library with duplicates.
 *
 * ⚠ ALTERNATIVE TEXT IS SET AT UPLOAD TIME AND IS NOT THE CONTENT TYPE'S `alt`.
 * The site's alt text lives on the notice, because the same poster could in
 * principle be reused with different surrounding wording. Setting it here too
 * means the media library is not full of nameless images for whoever browses it
 * in the admin.
 */
import { stat, readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

/** Extension → mime. Only what this project actually stores. */
const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',

  /* ⚠ NOT ONLY IMAGES. The uniform catalogues are PDFs and the disclosure
     certificates may be uploaded as PDFs too — both are media the school
     replaces annually, so they belong in the library beside the photographs
     rather than in the repository. */
  '.pdf': 'application/pdf',
};

/**
 * Find an existing library file by its exact name.
 * @returns {Promise<object|null>}
 */
export async function findMediaByName(strapi, name) {
  const [existing] = await strapi.db.query('plugin::upload.file').findMany({
    where: { name },
    limit: 1,
  });
  return existing ?? null;
}

/**
 * Upload a file from disk, or return the one already there under this name.
 *
 * @param {object}  strapi
 * @param {object}  opts
 * @param {string}  opts.absolutePath  file on disk
 * @param {string}  opts.name          stable identity, WITHOUT extension
 * @param {string} [opts.alternativeText]
 * @param {string} [opts.caption]
 * @param {boolean}[opts.force]        re-upload even if a match exists
 * @returns {Promise<{file: object, reused: boolean}>}
 */
export async function uploadMedia(strapi, opts) {
  const { absolutePath, name, alternativeText, caption, force = false } = opts;

  const ext = extname(absolutePath).toLowerCase();
  const mimetype = MIME[ext];
  if (!mimetype) {
    throw new Error(`Unsupported media extension "${ext}" for ${absolutePath}`);
  }

  const fileName = `${name}${ext}`;

  if (!force) {
    const existing = await findMediaByName(strapi, fileName);
    if (existing) return { file: existing, reused: true };
  }

  const stats = await stat(absolutePath);

  /* ⚠ Strapi 5's upload service takes a formidable-shaped descriptor, not a
     Buffer or a stream. `filepath` is what it reads; `originalFileName` is what
     it slugifies into the stored name. */
  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: {
      fileInfo: {
        name: fileName,
        alternativeText: alternativeText ?? null,
        caption: caption ?? null,
      },
    },
    files: {
      filepath: absolutePath,
      originalFileName: fileName,
      mimetype,
      size: stats.size,
    },
  });

  return { file, reused: false };
}

export default uploadMedia;
