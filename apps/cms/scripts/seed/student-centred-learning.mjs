/**
 * THE STUDENT-CENTRED LEARNING PAGE — one named field per visual section.
 *
 *     npm run seed:student-centred-learning [-- --dry]
 *
 * The second page to get this treatment, and the first to prove the point of it:
 * three of its four sections reuse components built for Teaching Philosophy.
 * Only the collage in 02 is new. Pages are modelled by SHAPE, not one component
 * set each — otherwise forty-six pages would mean forty-six sets and a Content
 * Manager nobody could read.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 01–03 numerals, the washes
 * and grids, the float ornaments, every parallax and reveal delay, the collage
 * geometry, and the ANGLE of each ability on the ring — nine cards sit at
 * 10°, 50°, 90° …, which is `10 + i × 40`, so the page computes it and adding a
 * card re-spaces the ring on its own.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/student-centred-learning.json');
const UID = 'api::student-centred-learning-page.student-centred-learning-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

await withStrapi(async (strapi) => {
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  console.log(`\n  Seeding Student-Centred Learning${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0, reused = 0;

  /**
   * ⚠ THE NAME IS PASSED IN, NOT TAKEN FROM THE FILENAME.
   * Media reuse is BY NAME, and these files are `02.jpg`, `03.jpg`, `05.jpg` in
   * two different activity folders. Under their basenames the investiture photos
   * and the Little Agriculturists photo would collide and the page would carry
   * the wrong pictures — full slots, correct descriptions, wrong photographs.
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

  const payload = {
    sectionOne: {
      kicker: fx.sectionOne.kicker,
      heading: fx.sectionOne.heading,
      headingEm: fx.sectionOne.headingEm || null,
      quote: fx.sectionOne.quote || null,
      quoteAuthor: fx.sectionOne.quoteAuthor || null,
      body: paras(fx.sectionOne.body),
      image: await up(fx.sectionOne.image, fx.sectionOne.imageName, fx.sectionOne.imageAlt),
      imageAlt: fx.sectionOne.imageAlt,
    },

    sectionTwo: {
      heading: fx.sectionTwo.heading,
      headingSecond: fx.sectionTwo.headingSecond || null,
      index: paras(fx.sectionTwo.index),
      body: paras(fx.sectionTwo.body),
      imageOne: await up(fx.sectionTwo.imageOne, fx.sectionTwo.imageOneName, fx.sectionTwo.imageOneAlt),
      imageOneAlt: fx.sectionTwo.imageOneAlt,
      imageTwo: await up(fx.sectionTwo.imageTwo, fx.sectionTwo.imageTwoName, fx.sectionTwo.imageTwoAlt),
      imageTwoAlt: fx.sectionTwo.imageTwoAlt,
      imageThree: await up(fx.sectionTwo.imageThree, fx.sectionTwo.imageThreeName, fx.sectionTwo.imageThreeAlt),
      imageThreeAlt: fx.sectionTwo.imageThreeAlt,
    },

    sectionThree: {
      kicker: fx.sectionThree.kicker || null,
      heading: fx.sectionThree.heading,
      headingEm: fx.sectionThree.headingEm || null,
      body: paras(fx.sectionThree.body),
      image: await up(fx.sectionThree.image, fx.sectionThree.imageName, fx.sectionThree.imageAlt),
      imageAlt: fx.sectionThree.imageAlt,
      cards: await Promise.all(fx.sectionThree.cards.map(async (c) => ({
        label: c.label,
        icon: await up(c.icon, c.iconName, `${c.label} — one of the abilities named on the Student-Centred Learning page`),
      }))),
    },

    close: {
      headingLines: paras(fx.close.headingLines),
      quote: fx.close.quote || null,
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

  const existing = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (existing) {
    await strapi.documents(UID).update({ documentId: existing.documentId, data: payload, status: 'published' });
    console.log('    Student-Centred Learning   updated');
  } else {
    await strapi.documents(UID).create({ data: payload, status: 'published' });
    console.log('    Student-Centred Learning   created');
  }

  console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused\n`);
});
