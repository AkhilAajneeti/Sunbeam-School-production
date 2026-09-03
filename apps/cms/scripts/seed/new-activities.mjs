/**
 * SCHOOL ACTIVITIES ADDED FROM PHOTOGRAPHS THE SCHOOL SENT.
 *
 *     npm run seed:new-activities [-- --dry]
 *
 * ═══ WHY THIS IS A SEED AND NOT AN ADMIN ENTRY ═════════════════════════════
 *
 * These two activities could have been typed into the admin in ten minutes, and
 * then existed in exactly one place — a database that is restored from a nightly
 * dump. Written here they are in git, reviewable in a diff, idempotent, and a
 * rebuilt database reproduces them. That is the same discipline every other
 * seed follows, and the reason `npm run seed` can be run twice without changing
 * anything.
 *
 * ⚠ IT UPSERTS BY SLUG AND DELETES NOTHING. An activity removed from the fixture
 * stays in the database — deliberately. A seed that deletes is a seed that can
 * quietly remove something the school wrote in the admin, and from go-live the
 * admin is the source of truth, not this repository.
 *
 * ⚠ CATEGORY IS `activity`. School activities are news-item rows: the chronicle
 * shape was identical field for field, so G-whichever reused it rather than
 * adding a content type nobody needed. `school-event` is a DIFFERENT category
 * and a different page.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/new-activities.json');
const UID = 'api::news-item.news-item';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

await withStrapi(async (strapi) => {
  const { activities } = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  const site = await loadWebData(resolve(WEB_SRC, 'data/site.ts'));
  const schoolName = site.school.name;

  console.log(`\n  Seeding school activities from sent photographs${DRY ? '  (dry run)' : ''}\n`);

  let created = 0, updated = 0, uploaded = 0, reused = 0;

  for (const a of activities) {
    /**
     * ⚠ THE UPLOAD NAME IS PREFIXED WITH THE SLUG.
     * These files are 01.jpg … 11.jpg, and media reuse is BY NAME. Uploading
     * them under their basenames would hand every activity the first one's
     * photographs — the slot full, the description right, the picture wrong,
     * and nothing in a build or a text diff able to see it.
     */
    const gallery = [];
    for (let i = 1; i <= a.count; i++) {
      const file = `${String(i).padStart(2, '0')}.jpg`;
      const abs = join(WEB_SRC, a.dir, file);
      if (!existsSync(abs)) throw new Error(`missing photograph: ${a.dir}/${file}`);

      const alt = a.alt.replaceAll('{schoolName}', schoolName);
      if (DRY) { gallery.push({ image: null, alt, caption: null }); continue; }

      const r = await uploadMedia(strapi, {
        absolutePath: abs,
        name: `activity-${a.slug}-${String(i).padStart(2, '0')}`,
        alternativeText: alt,
        force: FORCE_MEDIA,
      });
      r.reused ? reused++ : uploaded++;
      gallery.push({ image: r.file.id, alt, caption: null });
    }

    if (DRY) { console.log(`    ${a.slug.padEnd(26)} ${a.count} photographs`); continue; }

    /**
     * WARNING: A SLUG THAT ALREADY BELONGS TO ANOTHER CATEGORY IS NOT OURS.
     *
     * news-item holds every chronicle on the site - celebrations, workshops,
     * competitions and activities - and upsert matches on slug alone. Seeding an
     * activity called "independence-day" therefore found the 78th Independence
     * Day CELEBRATION and overwrote it: its title, its body, its chief guest and
     * its category, gone, and a new page appearing elsewhere to cover the trace.
     * Nothing failed; the production diff is the only reason it was noticed.
     */
    const [clash] = await strapi.documents(UID).findMany({
      filters: { slug: a.slug }, fields: ['category', 'title'], status: 'published',
    });
    if (clash && clash.category !== 'activity') {
      throw new Error(
        `slug "${a.slug}" already belongs to a ${clash.category} ("${clash.title}"). ` +
        'Choose another slug rather than overwriting it.',
      );
    }

    const outcome = await upsertBySlug(strapi, UID, a.slug, {
      title: a.title,
      category: 'activity',
      group: a.group,
      meta: a.meta,
      body: a.body,
      when: a.when ?? null,
      fit: a.fit,
      displayOrder: a.displayOrder,
      gallery,
    });
    outcome === 'created' ? created++ : updated++;
    console.log(`    ${a.slug.padEnd(26)} ${outcome}, ${a.count} photographs`);
  }

  if (!DRY) {
    console.log(`\n  ${created} created, ${updated} updated`);
    console.log(`  Media — ${uploaded} uploaded, ${reused} reused\n`);
  } else {
    console.log('');
  }
});
