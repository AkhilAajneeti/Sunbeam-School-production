/**
 * SEED — JOB POSTINGS (career.ts → api::job-posting).
 *
 *     npm run seed:career [-- --dry] [-- --force-media]
 *
 * ⚠ THE POSTER IS THE POSTING. The school publishes vacancies only as designed
 * graphics — there is no structured job text anywhere — so the long `alt` is the
 * only machine-readable form of each vacancy and is carried verbatim. It runs to
 * several hundred words on some posters, which is why the field allows 4000
 * characters rather than the usual 500.
 *
 * ⚠ SLUGS COME FROM THE TITLE because career.ts gives its posters no ids. Two
 * posters share the title "Vacancies — teaching and non-academic staff" in
 * spirit but not in text; if that ever changes, this seed will collide loudly on
 * the unique slug rather than silently overwrite one with the other.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/career.ts');
const UID = 'api::job-posting.job-posting';

const args = new Set(process.argv.slice(2));
const FORCE_MEDIA = args.has('--force-media');
const DRY = args.has('--dry');

await withStrapi(async (strapi) => {
  const { posters } = await loadWebData(DATA_FILE);

  if (!Array.isArray(posters) || posters.length === 0) {
    throw new Error(`Expected a non-empty "posters" array in ${DATA_FILE}`);
  }

  console.log(`\n  Seeding ${posters.length} job postings${DRY ? '  (dry run)' : ''}\n`);

  let created = 0;
  let updated = 0;
  let uploaded = 0;
  let reused = 0;
  const seen = new Set();

  for (const [index, p] of posters.entries()) {
    const slug = slugify(p.title);

    if (seen.has(slug)) {
      throw new Error(
        `Duplicate job-posting slug "${slug}" — two posters share the title ${JSON.stringify(p.title)}. Give one a distinct title.`,
      );
    }
    seen.add(slug);

    if (!p.src?.absolutePath) throw new Error(`Job poster "${slug}" has no resolvable image path`);

    if (DRY) {
      console.log(`    ${slug}`);
      created++;
      continue;
    }

    const { file, reused: wasReused } = await uploadMedia(strapi, {
      absolutePath: p.src.absolutePath,
      name: `job-${slug}`,
      alternativeText: p.alt,
      caption: p.title,
      force: FORCE_MEDIA,
    });
    wasReused ? reused++ : uploaded++;

    const outcome = await upsertBySlug(strapi, UID, slug, {
      title: p.title,
      tag: p.tag,
      alt: p.alt,
      dated: p.dated ?? null,
      /* The source models Hindi as an optional `lang: 'hi'` and English as the
         absence of the field. An enumeration with an explicit default is the
         same information without a meaningful absence, and the query maps it
         back so the component's `lang === 'hi'` check is untouched. */
      lang: p.lang === 'hi' ? 'hi' : 'en',
      image: file.id,
      displayOrder: index,
    });

    outcome === 'created' ? created++ : updated++;
    console.log(`    ${outcome.padEnd(7)}  ${slug}`);
  }

  console.log(
    `\n  Done — ${created} created, ${updated} updated` +
      (DRY ? '' : `, media: ${uploaded} uploaded / ${reused} reused`) +
      '\n',
  );
});
