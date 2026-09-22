/**
 * SEED — NCC, SCOUTS & GUIDES.
 *
 *     npm run seed:uniformed-groups [-- --dry]
 *
 * Source: apps/web/src/data/uniformedGroups.ts. ⚠ READ ITS HEADER before
 * changing anything here — it records, fact by fact, where each one came from,
 * and which two are the school describing itself rather than evidence.
 *
 * ⚠⚠ `verified` TRAVELS WITH EACH FACT and is not decoration. The page prints
 * an attribution on any fact whose `verified` is false, because those two
 * claims are about other schools in the district and nothing independent
 * supports them. Do not default it to true to tidy the output.
 *
 * ⚠ THE NCC SECTION SHIPS WITHOUT PHOTOGRAPHS, ON PURPOSE. No NCC photograph
 * exists in this repository — the folders that look like candidates hold a
 * cooking activity, a Prabhat Pheri and a BHU visit. Borrowing one of those and
 * captioning it as NCC is exactly what this page's own caption rule forbids.
 * `pending` is what puts it on the outstanding list instead.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { upsertSingle } from '../lib/upsert.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const DATA_FILE = resolve(WEB, 'data/uniformedGroups.ts');
const PHOTO_DIR = resolve(WEB, 'assets/scouts-and-guides');

const UID = 'api::uniformed-groups-page.uniformed-groups-page';
const DRY = new Set(process.argv.slice(2)).has('--dry');

await withStrapi(async (strapi) => {
  const { uniformedGroups, scoutsPhotos } = await loadWebData(DATA_FILE);

  console.log(`\n  Seeding NCC, Scouts & Guides${DRY ? '  (dry run)' : ''}\n`);

  if (DRY) {
    for (const g of uniformedGroups) {
      console.log(`    ${g.slug.padEnd(15)} ${g.facts.length} facts, ${g.record.length} record entries`);
    }
    console.log(`    photographs     ${scoutsPhotos.length} (scouts only)\n`);
    return;
  }

  /* The six scouts photographs, uploaded in the order the page shows them. */
  const photos = [];
  for (const p of scoutsPhotos) {
    const { file } = await uploadMedia(strapi, {
      absolutePath: resolve(PHOTO_DIR, p.file),
      name: `scouts-${p.file.replace(/\.[^.]+$/, '')}`,
      alternativeText: p.alt,
      caption: p.caption,
    });
    photos.push({ image: file.id, alt: p.alt, caption: p.caption });
  }
  console.log(`    photographs         ${photos.length} uploaded`);

  const groups = uniformedGroups.map((g) => ({
    slug: g.slug,
    name: g.name,
    blurb: g.blurb,
    facts: g.facts.map((f) => ({ label: f.label, body: f.body, verified: f.verified })),
    /* shared.point requires `owed` and `flag`; neither applies to a record
       entry, so both are false rather than left undefined. */
    record: g.record.map((r) => ({ title: r.title, body: r.body, owed: false, flag: false })),
    photos: g.slug === 'scouts-guides' ? photos : [],
    pending: g.pending,
  }));

  console.log(`    groups              ${await upsertSingle(strapi, UID, { groups })}`);

  for (const g of groups) {
    console.log(
      `      ${g.slug.padEnd(15)} ${String(g.facts.length).padStart(2)} facts · ` +
        `${String(g.record.length).padStart(2)} record · ${String(g.photos.length).padStart(2)} photos`,
    );
  }
  console.log('');
});
