/**
 * THE ACADEMIC STRUCTURE STAGE PAGES — one named field per band.
 *
 *     npm run seed:structure [-- --dry] [-- --only=secondary]
 *
 * ONE SEED FOR ALL OF THEM, because they are one shape. Every band on every one
 * of these pages is a label, a heading, some paragraphs, some photographs and a
 * run of cells; what differs is how each page LAYS THAT OUT, and no layout
 * decision reaches this file.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 01–09 band numerals, the
 * ground colours, the dot fields and drifting ghost words, the rails and the
 * curve the Pre-Primary stops hang from, every reveal / mask / pop / drift delay
 * and its stagger, the SVG behind each symbol — and THE 01, 02, 03 DOWN EVERY
 * RUN. All nineteen numbered runs across these pages were a plain sequence, so
 * the page counts them and adding a cell renumbers the run on its own.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FX = resolve(HERE, '../fixtures');

/** Which fixture feeds which single type. */
const PAGES = [
  { fixture: 'pre-primary', uid: 'api::pre-primary-page.pre-primary-page', label: 'Pre-Primary' },
  { fixture: 'primary-stage', uid: 'api::primary-stage-page.primary-stage-page', label: 'Primary' },
  { fixture: 'middle-school', uid: 'api::middle-school-page.middle-school-page', label: 'Middle School' },
  { fixture: 'secondary-stage', uid: 'api::secondary-stage-page.secondary-stage-page', label: 'Secondary' },
  { fixture: 'senior-secondary', uid: 'api::senior-secondary-page.senior-secondary-page', label: 'Senior Secondary' },
  /* These two carry a page-level list of streams beside their bands. */
  { fixture: 'streams-offered', uid: 'api::streams-offered-page.streams-offered-page', label: 'Streams Offered', pageList: 'streams' },
  { fixture: 'subject-combinations', uid: 'api::subject-combinations-page.subject-combinations-page', label: 'Subject Combinations', pageList: 'streams' },
];

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FORCE_MEDIA = args.includes('--force-media');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1];

await withStrapi(async (strapi) => {
  console.log(`\n  Seeding Academic Structure${DRY ? '  (dry run)' : ''}\n`);
  let uploaded = 0, reused = 0;

  /**
   * ⚠ THE NAME IS PASSED IN, NOT TAKEN FROM THE FILENAME.
   * Media reuse is BY NAME, and these assets include `DSC_1274 copy.jpg` and a
   * dozen numbered activity photographs. Under their basenames the pages would
   * silently take whichever was uploaded first — full slots, correct
   * descriptions, wrong photographs.
   */
  async function up(assetPath, name, alt) {
    if (!assetPath) return null;
    const abs = join(WEB_SRC, assetPath);
    if (!existsSync(abs)) throw new Error(`missing asset: ${assetPath}`);
    if (DRY) return null;
    const r = await uploadMedia(strapi, { absolutePath: abs, name, alternativeText: alt ?? null, force: FORCE_MEDIA });
    r.reused ? reused += 1 : uploaded += 1;
    return r.file.id;
  }

  const paras = (list) => (list ?? []).map((text) => ({ text }));

  const cells = async (list) => Promise.all((list ?? []).map(async (c) => ({
    label: c.label ?? null,
    value: c.value ?? null,
    mark: c.mark ?? null,
    note: c.note ?? null,
    sub: c.sub ?? null,
    caption: c.caption ?? null,
    flag: Boolean(c.flag),
    /* A few runs give every item its own photograph. */
    image: await up(c.image, c.imageName, c.alt),
    alt: c.alt ?? null,
  })));

  /**
   * ⚠ THE FOUR STREAMS ARE EDITED ONCE AND DRAWN EVERYWHERE on their page — as
   * cards, as a comparison, as a directions list and as the subject map. They
   * sit beside the bands rather than inside one, so no two copies can drift.
   */
  const streams = (list) => (list ?? []).map((x) => ({
    label: x.label ?? null,
    mark: x.mark ?? null,
    sub: x.sub ?? null,
    value: x.value ?? null,
    note: x.note ?? null,
    core: (x.core ?? []).map((text) => ({ text })),
    optional: (x.optional ?? []).map((text) => ({ text })),
    additional: (x.additional ?? []).map((text) => ({ text })),
    owed: Boolean(x.owed),
  }));

  const band = async (b) => ({
    kicker: b.kicker ?? null,
    heading: b.heading ?? null,
    body: paras(b.body),
    caption: b.caption ?? null,
    shots: await Promise.all((b.shots ?? []).map(async (s) => ({
      key: s.key,
      image: await up(s.asset, s.name, s.alt),
      alt: s.alt,
    }))),
    cells: await cells(b.cells),
    cellsTwo: await cells(b.cellsTwo),
  });

  for (const page of PAGES) {
    if (ONLY && page.fixture !== ONLY) continue;
    const file = `${FX}/${page.fixture}.json`;
    if (!existsSync(file)) { console.log(`    ${page.label.padEnd(18)} — no fixture yet, skipped`); continue; }

    const fx = JSON.parse(readFileSync(file, 'utf8'));
    const payload = {};
    for (const [name, b] of Object.entries(fx)) {
      /* The page-level list is an array of streams, not a band. */
      if (name === page.pageList) { payload[name] = streams(b); continue; }
      payload[name] = await band(b);
    }

    if (DRY) {
      console.log(`    ${page.label.padEnd(18)} ${Object.keys(payload).length} bands`);
      continue;
    }

    const existing = await strapi.documents(page.uid).findFirst({ status: 'draft' });
    if (existing) {
      await strapi.documents(page.uid).update({ documentId: existing.documentId, data: payload, status: 'published' });
      console.log(`    ${page.label.padEnd(18)} updated  (${Object.keys(payload).length} bands)`);
    } else {
      await strapi.documents(page.uid).create({ data: payload, status: 'published' });
      console.log(`    ${page.label.padEnd(18)} created  (${Object.keys(payload).length} bands)`);
    }
  }

  console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused\n`);
});
