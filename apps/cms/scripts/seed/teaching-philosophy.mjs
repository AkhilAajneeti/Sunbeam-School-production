/**
 * THE TEACHING PHILOSOPHY PAGE — one named field per visual section.
 *
 *     npm run seed:teaching-philosophy [-- --dry]
 *
 * ═══ WHY THIS PAGE HAS ITS OWN TYPE ════════════════════════════════════════
 *
 * Every other academics page reads a repeatable list of generic `shared.section`
 * blocks, which is right for forty-six bespoke designs and wrong for the person
 * editing them: the Content Manager showed a row called `abilities` and nothing
 * that said it was section 03.
 *
 * Here the six sections are SIX NAMED FIELDS in the page's own order. An editor
 * sees "01 — Recognising Individual Potential" and edits the words under it.
 *
 * ⚠ FIXED FIELDS, NOT A LIST, ON PURPOSE. A repeatable list lets an editor
 * reorder, delete or add sections — on a page whose layout, GSAP timeline and
 * anchors are built around five specific sections, each of those breaks it.
 * Named fields make the malformed states unreachable rather than merely
 * discouraged.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 01–05 numerals, the
 * washes, grids and dot fields, the float ornaments, every parallax and reveal
 * delay, the constellation's radius, and the ANGLE of each ability on the ring —
 * that last one was stored once and is exactly `i × 360 ÷ cards`, so the page
 * computes it and adding a card re-spaces the ring on its own.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/teaching-philosophy.json');
const UID = 'api::teaching-philosophy-page.teaching-philosophy-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

await withStrapi(async (strapi) => {
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));

  console.log(`\n  Seeding Teaching Philosophy${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0, reused = 0;

  /**
   * ⚠ THE NAME IS PASSED IN, NOT DERIVED FROM THE FILENAME.
   * Media reuse is BY NAME. Five of these photographs are already in the library
   * under the names the academics seed gave them; passing the same name reuses
   * the file instead of storing a second copy of the same picture under a second
   * name. The icons are new and get their own `ability-…` names, because
   * `bulb.png` and `Words.png` are far too generic to be safe.
   */
  async function up(assetPath, name, alt) {
    const abs = join(WEB_SRC, assetPath);
    if (!existsSync(abs)) throw new Error(`missing asset: ${assetPath}`);
    if (DRY) return null;
    const r = await uploadMedia(strapi, {
      absolutePath: abs, name, alternativeText: alt ?? null, force: FORCE_MEDIA,
    });
    r.reused ? reused++ : uploaded++;
    return r.file.id;
  }

  const paras = (list) => (list ?? []).map((text) => ({ text }));

  const statement = async (s) => ({
    kicker: s.kicker,
    heading: s.heading,
    headingEm: s.headingEm || null,
    quote: s.quote || null,
    quoteAuthor: s.quoteAuthor || null,
    body: paras(s.body),
    image: await up(s.image, s.imageName, s.imageAlt),
    imageAlt: s.imageAlt,
  });

  const payload = {
    sectionOne: await statement(fx.sectionOne),

    sectionTwo: {
      kicker: fx.sectionTwo.kicker,
      heading: fx.sectionTwo.heading,
      quote: fx.sectionTwo.quote || null,
      quoteAuthor: fx.sectionTwo.quoteAuthor || null,
      body: paras(fx.sectionTwo.body),
      imageUpper: await up(fx.sectionTwo.imageUpper, fx.sectionTwo.imageUpperName, fx.sectionTwo.imageUpperAlt),
      imageUpperAlt: fx.sectionTwo.imageUpperAlt,
      imageLower: await up(fx.sectionTwo.imageLower, fx.sectionTwo.imageLowerName, fx.sectionTwo.imageLowerAlt),
      imageLowerAlt: fx.sectionTwo.imageLowerAlt,
    },

    sectionThree: {
      kicker: fx.sectionThree.kicker,
      heading: fx.sectionThree.heading,
      body: paras(fx.sectionThree.body),
      image: await up(fx.sectionThree.image, fx.sectionThree.imageName, fx.sectionThree.imageAlt),
      imageAlt: fx.sectionThree.imageAlt,
      cards: await Promise.all(fx.sectionThree.cards.map(async (c) => ({
        label: c.label,
        icon: await up(c.icon, c.iconName, `${c.label} — one of the abilities named on the Teaching Philosophy page`),
      }))),
    },

    sectionFour: await statement(fx.sectionFour),
    sectionFive: await statement(fx.sectionFive),

    close: {
      headingLines: paras(fx.close.headingLines),
      quote: fx.close.quote,
      quoteAuthor: fx.close.quoteAuthor || null,
      image: await up(fx.close.image, fx.close.imageName, fx.close.imageAlt),
      imageAlt: fx.close.imageAlt,
    },
  };

  if (DRY) {
    for (const k of Object.keys(payload)) console.log(`    ${k}`);
    console.log('');
    return;
  }

  /* A single type: one document, created on first run and updated thereafter. */
  const existing = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (existing) {
    await strapi.documents(UID).update({ documentId: existing.documentId, data: payload, status: 'published' });
    console.log('    Teaching Philosophy   updated');
  } else {
    await strapi.documents(UID).create({ data: payload, status: 'published' });
    console.log('    Teaching Philosophy   created');
  }

  console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused\n`);
});
