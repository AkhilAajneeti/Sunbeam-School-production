/**
 * SEED — ACHIEVEMENTS.  Three content types from one source file.
 *
 *     npm run seed:achievements
 *     npm run seed:achievements -- --force-media
 *     npm run seed:achievements -- --dry
 *
 * ═══ WHY ONE FILE BECAME THREE COLLECTIONS ═════════════════════════════════
 *
 * data/achievements.ts exports FOUR arrays with three distinct shapes:
 *
 *     majors[]          poster, kicker, detail, itemised facts   → Major Achievement
 *     credentials[]     figure, title, body, icon                → Credential
 *     sportRecord[]     title, meta, body                     ┐
 *     academicRecord[]  title, meta, body                     ┘  → Achievement Record
 *
 * ⚠ THE TWO RECORD ARRAYS SHARE ONE COLLECTION, SEPARATED BY `category`.
 * Their shapes are identical to the field. Two collections with the same three
 * columns is duplication an editor has to learn twice, and the page already
 * treats them as two boards of one thing.
 *
 * ⚠ AND THAT IS WHY RECORD SLUGS ARE NAMESPACED. Merging two arrays into one
 * collection means a title appearing in both would collide on a
 * collection-unique uid. `sport-…` / `academic-…` guarantees it cannot, and the
 * slug is an identity key here rather than a URL — no record has a page.
 *
 * ⚠ MAJOR SLUGS COME FROM THE SOURCE'S OWN `id`, NOT FROM THE TITLE.
 * `m.id` is rendered as the article's HTML id and is therefore an anchor target
 * — data/newsEvents.ts links to it. Deriving 'robowunder' from "RoboWunder
 * International Robotics Championship" would produce a different string and
 * quietly break that link.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { slugify, namespacedSlug } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/achievements.ts');

const MAJOR = 'api::achievement-major.achievement-major';
const CREDENTIAL = 'api::credential.credential';
const RECORD = 'api::achievement-record.achievement-record';

const args = new Set(process.argv.slice(2));
const FORCE_MEDIA = args.has('--force-media');
const DRY = args.has('--dry');

/** Tally helper so each section reports the same way. */
const tally = () => ({ created: 0, updated: 0 });
const bump = (t, outcome) => { t[outcome] += 1; };
const report = (label, t, extra = '') =>
  console.log(`    ${label.padEnd(22)} ${t.created} created, ${t.updated} updated${extra}`);

await withStrapi(async (strapi) => {
  const { majors, credentials, sportRecord, academicRecord } = await loadWebData(DATA_FILE);

  for (const [name, arr] of Object.entries({ majors, credentials, sportRecord, academicRecord })) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(`Expected a non-empty "${name}" array in ${DATA_FILE}`);
    }
  }

  console.log(`\n  Seeding achievements${DRY ? '  (dry run)' : ''}\n`);

  /* ── 1 · MAJOR ACHIEVEMENTS ─────────────────────────────────────────────── */
  const majorTally = tally();
  let uploaded = 0;
  let reused = 0;

  for (const [index, m] of majors.entries()) {
    const slug = m.id;

    if (!m.art?.absolutePath) throw new Error(`Major "${slug}" has no resolvable art path`);

    if (DRY) {
      console.log(`    major     ${slug}`);
      majorTally.created += 1;
      continue;
    }

    const { file, reused: wasReused } = await uploadMedia(strapi, {
      absolutePath: m.art.absolutePath,
      name: `achievement-${slug}`,
      alternativeText: m.alt,
      caption: m.title,
      force: FORCE_MEDIA,
    });
    wasReused ? reused++ : uploaded++;

    bump(
      majorTally,
      await upsertBySlug(strapi, MAJOR, slug, {
        title: m.title,
        kicker: m.kicker,
        detail: m.detail,
        /* Repeatable component: an array of objects, not an array of strings.
           The source is string[], so each is wrapped. */
        facts: (m.facts ?? []).map((value) => ({ value })),
        alt: m.alt,
        art: file.id,
        displayOrder: index,
      }),
    );
  }

  /* ── 2 · CREDENTIALS ────────────────────────────────────────────────────── */
  const credTally = tally();

  for (const [index, c] of credentials.entries()) {
    const slug = slugify(c.title);

    if (DRY) {
      console.log(`    credential ${slug}`);
      credTally.created += 1;
      continue;
    }

    bump(
      credTally,
      await upsertBySlug(strapi, CREDENTIAL, slug, {
        title: c.title,
        figure: c.figure ?? null,
        body: c.body,
        icon: c.icon,
        displayOrder: index,
      }),
    );
  }

  /* ── 3 · RECORDS, BOTH BOARDS ───────────────────────────────────────────── */
  const recordTally = tally();

  for (const [category, rows] of [
    ['sport', sportRecord],
    ['academic', academicRecord],
  ]) {
    for (const [index, r] of rows.entries()) {
      const slug = namespacedSlug(category, r.title);

      if (DRY) {
        console.log(`    record    ${slug}`);
        recordTally.created += 1;
        continue;
      }

      bump(
        recordTally,
        await upsertBySlug(strapi, RECORD, slug, {
          title: r.title,
          meta: r.meta,
          body: r.body,
          category,
          displayOrder: index,
        }),
      );
    }
  }

  console.log('');
  report('Major achievements', majorTally, DRY ? '' : `, media: ${uploaded} uploaded / ${reused} reused`);
  report('Credentials', credTally);
  report('Records', recordTally);
  console.log('');
});
