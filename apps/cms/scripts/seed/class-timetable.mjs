/**
 * ═══ SEED THE CLASS TIMETABLES ═════════════════════════════════════════════
 *
 *     npm run seed:class-timetable [-- --dry]
 *
 * Uploads the 73 sheets in apps/web/src/assets/timetable and creates one entry
 * per class, so the school can replace any sheet from the admin afterwards.
 *
 * ⚠⚠ THIS IS A FIRST FILL, NOT THE WAY THE PAGE IS MAINTAINED. Once these
 * entries exist, a new timetable goes up by replacing the image on the sheet
 * in Content Manager → Class Timetable. Re-running this would push the
 * FIXTURE'S files back over whatever the school has since uploaded — it is an
 * upsert by slug, and the sheets are written whole.
 *
 * ⚠ THE FIXTURE IS THE ONLY RECORD OF WHICH FILE BELONGS TO WHICH SECTION.
 * The school's file names do not all say: classes VI–VIII are fifteen pages of
 * one export with the section printed only ON the sheet. Those were read off
 * the sheets themselves (page 6 names Class VII A, page 11 names Class VIII A)
 * — if the school re-exports, open them and check before regenerating.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import { withStrapi } from '../lib/strapi.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const SHEET_DIR = resolve(WEB, 'assets/timetable');
const FIXTURE = resolve(HERE, '../fixtures/class-timetable.json');

const UID = 'api::class-timetable.class-timetable';
const DRY = new Set(process.argv.slice(2)).has('--dry');

await withStrapi(async (strapi) => {
  const classes = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  const total = classes.reduce((n, c) => n + c.sheets.length, 0);

  console.log(`\n  Seeding class timetables${DRY ? '  (dry run)' : ''}\n`);

  if (DRY) {
    for (const c of classes) {
      console.log(`    ${c.slug.padEnd(12)} ${c.label.padEnd(10)} ${c.stage.padEnd(12)} ${c.sheets.length} sheets`);
    }
    console.log(`\n    ${classes.length} classes, ${total} sheets\n`);
    return;
  }

  let uploaded = 0;

  for (const c of classes) {
    const sheets = [];
    for (const s of c.sheets) {
      /* ⚠ THE UPLOAD NAME CARRIES THE CLASS AND SECTION, not the school's file
         name. '1a' and '11a' are indistinguishable in a media library of a
         thousand files, and an editor replacing Class XI section A has to be
         able to find the one they mean. */
      const { file } = await uploadMedia(strapi, {
        absolutePath: resolve(SHEET_DIR, s.file),
        name: `timetable-${c.slug}${s.section ? '-' + s.section.toLowerCase() : ''}`,
        alternativeText: s.section
          ? `The weekly timetable for ${c.label}, section ${s.section}, at Sunbeam School Ballia.`
          : `The weekly timetable for ${c.label} at Sunbeam School Ballia.`,
      });
      sheets.push({ section: s.section, image: file.id });
      uploaded += 1;
    }

    const action = await upsertBySlug(strapi, UID, c.slug, {
      label: c.label,
      slug: c.slug,
      stage: c.stage,
      order: c.order,
      sheets,
    });

    console.log(`    ${c.slug.padEnd(12)} ${String(sheets.length).padStart(2)} sheets  ${action}`);
  }

  console.log(`\n    ${classes.length} classes, ${uploaded} sheets uploaded\n`);
});
