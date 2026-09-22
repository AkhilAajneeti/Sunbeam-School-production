/**
 * SEED — PUBLICATIONS (data/publications.ts → api::publication + api::publications-page).
 *
 *     npm run seed:publications [-- --dry]
 *
 *   clubs[]    → Publication rows, group = the club's id
 *   magazine   → Publication rows, group = 'school-magazine'
 *   newspaper  → Publication rows, group = 'e-newspaper'
 *   headings   → Publications Page . groupHeadings
 *   myraAlt    → Publications Page . myraPages[].alt, paired with its scan
 *   myra-0N.jpeg → Publications Page . myraPages[].image  (uploaded)
 *
 * ⚠⚠ EVERY href IS THE SCHOOL'S OWN, transcribed from its live page. This script
 * copies them; it does not compose, tidy or upgrade them. In particular the
 * `http://` on the school's own PDFs is deliberate — that is the scheme its page
 * uses, and the host redirects to https anyway.
 *
 * ⚠ THE SLUG IS DERIVED FROM group + title, NOT title alone. Three bands each
 * contain a "First Edition, June 2026", and slugging the title alone would
 * collide so that four of the five club newsletters overwrote one another.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/publications.ts');

/**
 * ⚠⚠ THE SCANS ARE UPLOADED FROM THE REPO, AND ONLY THE FIRST TIME MATTERS.
 * src/assets holds the June 2026 issue; once these are in the Media Library the
 * school replaces them THERE, and re-running this seed would overwrite whatever
 * they uploaded with June 2026 again. Run it once per environment to prime the
 * page — it is deliberately not part of the aggregate `npm run seed`.
 */
const MYRA_DIR = resolve(HERE, '../../../web/src/assets/publications/myra-stem-lab');
const MYRA_FILES = ['myra-01.jpeg', 'myra-02.jpeg', 'myra-03.jpeg', 'myra-04.jpeg', 'myra-05.jpeg'];

const PUBLICATION = 'api::publication.publication';
const PAGE = 'api::publications-page.publications-page';

const DRY = new Set(process.argv.slice(2)).has('--dry');

await withStrapi(async (strapi) => {
  const { clubs, magazine, newspaper, myraAlt } = await loadWebData(DATA_FILE);

  console.log(`\n  Seeding publications${DRY ? '  (dry run)' : ''}\n`);

  /**
   * The five newsletter pages, each uploaded and paired with its alt line.
   *
   * ⚠ THE PAIRING IS BY INDEX, which is safe only because both lists are fixed
   * at five in the same order — the scans are numbered myra-01..05 and
   * data/publications.ts lists its alt lines in that order. If either ever
   * grows, pair them by filename rather than trusting position.
   */
  const myraPages = [];
  if (!DRY) {
    for (const [i, name] of MYRA_FILES.entries()) {
      const { file: uploaded } = await uploadMedia(strapi, {
        absolutePath: resolve(MYRA_DIR, name),
        name: `publications-${name.split('.')[0]}`,
        alternativeText: (myraAlt ?? [])[i] ?? '',
      });
      myraPages.push({ image: uploaded.id, alt: (myraAlt ?? [])[i] ?? '' });
    }
    console.log(`    myra pages          ${myraPages.length} uploaded`);
  }

  /* Every band, flattened to rows, keeping the school's own order. */
  const groups = [...clubs, magazine, newspaper];

  /* ⚠ MYRA IS NOT IN data/publications.ts AND STILL NEEDS A ROW. Its band is the
     newsletter rail rather than a list of download cards, so it has no entry in
     `groups` — but its heading goes through the same mechanism as every other
     band, and without a row here an editor would find the one heading on the
     page they cannot change. */
  const headings = [
    ...groups.map((g) => ({ label: g.id, value: g.heading })),
    { label: 'myra-stem-lab', value: 'MYRA STEM LAB' },
  ];
  const rows = [];
  for (const g of groups) {
    for (const [i, item] of (g.items ?? []).entries()) {
      rows.push({ group: g.id, heading: g.heading, title: item.title, href: item.href, order: i });
    }
  }

  let created = 0;
  let updated = 0;
  const seen = new Set();

  for (const r of rows) {
    const slug = slugify(`${r.group}-${r.title}`);
    if (seen.has(slug)) {
      throw new Error(
        `Duplicate publication slug "${slug}" — two entries in ${r.group} share the title ` +
          `${JSON.stringify(r.title)}. Give one a distinct title.`,
      );
    }
    seen.add(slug);

    if (DRY) {
      created++;
      continue;
    }

    const outcome = await upsertBySlug(strapi, PUBLICATION, slug, {
      title: r.title,
      href: r.href,
      group: r.group,
      displayOrder: r.order,
    });
    outcome === 'created' ? created++ : updated++;
  }

  console.log(`    publications        ${rows.length}`);

  if (!DRY) {
    /* ⚠ label = the machine key, value = the heading shown on the page. The
       query layer matches a Publication's `group` against the label, so they
       must agree exactly — see the single type's own description. */
    await upsertSingle(strapi, PAGE, {
      groupHeadings: headings,
      myraPages,
    });
    console.log('    Publications Page   updated');
  }

  console.log(
    `\n  Done - ${created} created, ${updated} updated, ` +
      `${headings.length} group headings, ${myraPages.length} newsletter pages\n`,
  );
});
