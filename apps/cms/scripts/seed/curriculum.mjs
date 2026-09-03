/**
 * THE CURRICULUM PAGE — one named field per section, and the stages above them.
 *
 *     npm run seed:curriculum [-- --dry]
 *
 * The fifth page modelled by SHAPE, and the only one with no photographs at all:
 * it is a page of lists, so it is modelled as lists.
 *
 * ⚠ THE STAGES ARE NOT INSIDE A SECTION. They are drawn TWICE — as the journey
 * across the top of 01 and as the rows of the library in 02 — so they sit above
 * both. Putting a copy in each section would let an editor change one and leave
 * the page contradicting itself.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 01–05 numerals, the dot
 * fields, the PRECEPT ghost word, the raised panel and the books illustration,
 * every reveal and pop delay, THE COLOUR OF EACH CARD (the page holds a palette
 * per section and cycles it, so cards recolour themselves as they are added),
 * the PRECEPT tag and the "View PDF" / "Issued by the school" wording — that
 * last pair is interface, and it switches on whether a link is there.
 *
 * ⚠ THE COUNT IN THE NOTE IS COMPUTED. The sentence is stored with {count} in
 * it and the page fills in how many classes there actually are, so the note can
 * never disagree with the cards above it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = resolve(HERE, '../fixtures/curriculum.json');
const UID = 'api::curriculum-page.curriculum-page';

const DRY = process.argv.includes('--dry');

await withStrapi(async (strapi) => {
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  console.log(`\n  Seeding Curriculum${DRY ? '  (dry run)' : ''}\n`);

  const paras = (list) => (list ?? []).map((text) => ({ text }));
  const lede = (s) => ({
    kicker: s.kicker, heading: s.heading, headingEm: s.headingEm || null, body: paras(s.body),
  });
  const tiles = (s) => ({
    kicker: s.kicker, heading: s.heading, headingEm: s.headingEm || null,
    tiles: s.tiles.map((t) => ({
      label: t.label, value: t.value, mark: t.mark, href: t.href || null, file: null,
    })),
  });

  const payload = {
    stages: fx.stages.map((s) => ({
      label: s.label, range: s.range, blurb: s.blurb, mark: s.mark,
      classes: s.classes.map((c) => ({
        label: c.label, href: c.href || null, sizeMb: c.sizeMb ?? null,
        /* The fifteen syllabi are already published on the school's own site at
           43-48 MB each, so they are linked, not re-uploaded. An editor can
           upload one over the top at any time and it takes precedence. */
        file: null,
      })),
    })),
    sectionOne: lede(fx.sectionOne),
    sectionTwo: lede(fx.sectionTwo),
    sectionThree: tiles(fx.sectionThree),
    sectionFour: tiles(fx.sectionFour),
    sectionFive: tiles(fx.sectionFive),
  };

  if (DRY) {
    console.log(`    stages ${payload.stages.length}, classes `
      + payload.stages.reduce((n, s) => n + s.classes.length, 0));
    for (const k of Object.keys(payload).filter((x) => x !== 'stages')) console.log(`    ${k}`);
    console.log('');
    return;
  }

  const existing = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (existing) {
    await strapi.documents(UID).update({ documentId: existing.documentId, data: payload, status: 'published' });
    console.log('    Curriculum   updated');
  } else {
    await strapi.documents(UID).create({ data: payload, status: 'published' });
    console.log('    Curriculum   created');
  }

  console.log(`\n  ${payload.stages.length} stages · `
    + `${payload.stages.reduce((n, s) => n + s.classes.length, 0)} classes · `
    + `${[payload.sectionThree, payload.sectionFour, payload.sectionFive].reduce((n, s) => n + s.tiles.length, 0)} tiles\n`);
});
