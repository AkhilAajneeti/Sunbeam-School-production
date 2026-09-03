/**
 * THE EXPERIENTIAL & INQUIRY-BASED LEARNING PAGE — one named field per section.
 *
 *     npm run seed:experiential-inquiry [-- --dry]
 *
 * The third page modelled by SHAPE. Its opening and its close are the same two
 * components Teaching Philosophy uses; only the two middle sections are new, and
 * both are new because the page genuinely draws something no other page draws —
 * a line with three beats hung off it, and a collage with a list beside it.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 02–05 numerals, the
 * ivory → paper → sand → ink ground rhythm, the washes and grids, the float
 * ornaments, every parallax and reveal delay, the collage geometry, THE ARROWS
 * BETWEEN EXPLORE, QUESTION AND DISCOVER, and the `i × 160` stagger down the
 * path — the page derives that from how many steps there are, so adding a fourth
 * re-times the run on its own.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/experiential-inquiry.json');
const UID = 'api::experiential-inquiry-page.experiential-inquiry-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

await withStrapi(async (strapi) => {
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  console.log(`\n  Seeding Experiential & Inquiry Learning${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0, reused = 0;

  /**
   * ⚠ THE NAME IS PASSED IN, NOT TAKEN FROM THE FILENAME.
   * Media reuse is BY NAME, and two of these files are `05.jpg` and `01.jpg` in
   * different activity folders. Under their basenames they would collide with
   * every other numbered photograph in the library and the page would carry the
   * wrong pictures — full slots, correct descriptions, wrong photographs.
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
      imageUpper: await up(fx.sectionOne.imageUpper, fx.sectionOne.imageUpperName, fx.sectionOne.imageUpperAlt),
      imageUpperAlt: fx.sectionOne.imageUpperAlt,
      imageLower: await up(fx.sectionOne.imageLower, fx.sectionOne.imageLowerName, fx.sectionOne.imageLowerAlt),
      imageLowerAlt: fx.sectionOne.imageLowerAlt,
    },

    sectionTwo: {
      kicker: fx.sectionTwo.kicker,
      headingWords: paras(fx.sectionTwo.headingWords),
      steps: await Promise.all(fx.sectionTwo.steps.map(async (s) => ({
        label: s.label,
        body: s.body,
        photo: await up(s.photo, s.photoName, s.photoAlt),
        photoAlt: s.photoAlt,
        /* The mark carries no description: it sits inside an aria-hidden span
           because the photograph beside it already says what the step is. */
        icon: await up(s.icon, s.iconName, null),
      }))),
    },

    sectionThree: {
      kicker: fx.sectionThree.kicker,
      heading: fx.sectionThree.heading,
      headingEm: fx.sectionThree.headingEm || null,
      body: paras(fx.sectionThree.body),
      entries: fx.sectionThree.entries.map((e) => ({ label: e.label, value: e.value })),
      imageOne: await up(fx.sectionThree.imageOne, fx.sectionThree.imageOneName, fx.sectionThree.imageOneAlt),
      imageOneAlt: fx.sectionThree.imageOneAlt,
      imageTwo: await up(fx.sectionThree.imageTwo, fx.sectionThree.imageTwoName, fx.sectionThree.imageTwoAlt),
      imageTwoAlt: fx.sectionThree.imageTwoAlt,
      imageThree: await up(fx.sectionThree.imageThree, fx.sectionThree.imageThreeName, fx.sectionThree.imageThreeAlt),
      imageThreeAlt: fx.sectionThree.imageThreeAlt,
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
    console.log('    Experiential & Inquiry Learning   updated');
  } else {
    await strapi.documents(UID).create({ data: payload, status: 'published' });
    console.log('    Experiential & Inquiry Learning   created');
  }

  console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused\n`);
});
