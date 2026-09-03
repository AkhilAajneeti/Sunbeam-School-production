/**
 * SEED — NOTICES.  The reference migration; every other type follows its shape.
 *
 *     npm run seed:notices              create or update, reuse existing media
 *     npm run seed:notices -- --force-media   re-upload the posters too
 *     npm run seed:notices -- --dry     report what would change, write nothing
 *
 * ═══ IDEMPOTENT, BY SLUG ═══════════════════════════════════════════════════
 *
 * The source data's `id` ("world-environment-day") becomes the notice's `slug`,
 * and slug is the identity used on both sides. Running this twice creates
 * nothing the second time — it updates in place. That matters because the
 * schema WILL change at least once, and a seed that duplicates on re-run makes
 * every schema change a manual cleanup.
 *
 * ⚠ IT DOES NOT DELETE. A notice removed from notices.ts is left alone in
 * Strapi rather than destroyed, because after go-live the CMS is the source of
 * truth and this script must never be able to erase an editor's work. Removals
 * are a deliberate act in the admin.
 *
 * ⚠ EVERYTHING IS CREATED PUBLISHED. These 24 notices are already public on the
 * school's own site; importing them as drafts would take the page live empty.
 * An UPDATE, though, does not silently republish — see the note further down.
 *
 * ⚠ displayOrder PRESERVES THE FILE'S CURATED ORDER. notices.ts is sorted
 * newest-first with the undated ones held at the end in gallery order, and that
 * ordering is editorial, not derivable: eight of the 24 print no date at all.
 * Sorting by date alone in Postgres would also float those NULLs to the top,
 * which is the opposite of what the page shows today.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/notices.ts');

const UID = 'api::notice.notice';

const args = new Set(process.argv.slice(2));
const FORCE_MEDIA = args.has('--force-media');
const DRY = args.has('--dry');

await withStrapi(async (strapi) => {
  const { notices } = await loadWebData(DATA_FILE);

  if (!Array.isArray(notices) || notices.length === 0) {
    throw new Error(`No notices found in ${DATA_FILE}`);
  }

  console.log(`\n  Seeding ${notices.length} notices${DRY ? '  (dry run)' : ''}\n`);

  let created = 0;
  let updated = 0;
  let mediaUploaded = 0;
  let mediaReused = 0;

  for (const [index, n] of notices.entries()) {
    const slug = n.id;

    if (!n.image?.absolutePath) {
      throw new Error(`Notice "${slug}" has no resolvable image path`);
    }

    const existing = await strapi.documents(UID).findFirst({
      filters: { slug },
      status: 'published',
    });

    if (DRY) {
      console.log(`    ${existing ? 'update' : 'create'}  ${slug}`);
      existing ? updated++ : created++;
      continue;
    }

    /* Media first — the document needs the file id. */
    const { file, reused } = await uploadMedia(strapi, {
      absolutePath: n.image.absolutePath,
      name: `notice-${slug}`,
      alternativeText: n.alt,
      caption: n.title,
      force: FORCE_MEDIA,
    });
    reused ? mediaReused++ : mediaUploaded++;

    const data = {
      title: n.title,
      slug,
      sub: n.sub ?? null,
      date: n.date ?? null,
      dateLabel: n.dateLabel ?? null,
      alt: n.alt,
      featured: Boolean(n.featured),
      displayOrder: index,
      image: file.id,
    };

    if (existing) {
      /* ⚠ status: 'published' ON UPDATE IS DELIBERATE AND NARROW. These
         documents were created published by this same script; passing the
         status keeps the published version in step with the draft rather than
         leaving the page showing stale text after a re-run. It does NOT
         publish anything an editor had deliberately unpublished, because such
         a document would not have matched the findFirst above. */
      await strapi.documents(UID).update({
        documentId: existing.documentId,
        data,
        status: 'published',
      });
      updated++;
      console.log(`    updated  ${slug}`);
    } else {
      await strapi.documents(UID).create({
        data,
        status: 'published',
      });
      created++;
      console.log(`    created  ${slug}`);
    }
  }

  console.log(
    `\n  Done — ${created} created, ${updated} updated` +
      (DRY ? '' : `, media: ${mediaUploaded} uploaded / ${mediaReused} reused`) +
      '\n',
  );
});
