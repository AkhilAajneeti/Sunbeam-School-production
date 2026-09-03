/**
 * THE CRITICAL THINKING & CREATIVITY PAGE — one named field per section.
 *
 *     npm run seed:critical-thinking [-- --dry]
 *
 * The fourth page modelled by SHAPE, and the first where a shape repeats WITHIN
 * one page: 02 and 03 are both "copy, a run of single words each with a symbol,
 * and a photograph or two", so both are `philosophy.marked-list`. 03 simply
 * leaves the second photograph empty. Two components for two sections that look
 * alike would have been two places to fix the same thing.
 *
 * ⚠ WHAT IS NOT SEEDED, BECAUSE IT IS NOT CONTENT: the 01–04 numerals, the dot
 * fields and grain, the word IMPACT set behind the photograph at poster scale,
 * the sparks, every reveal delay, THE 01–04 NUMBERING DOWN THE ARC (the page
 * counts the entries), and the SVG paths behind each symbol — the CMS stores
 * which symbol, the site knows how to draw it.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/critical-thinking.json');
const UID = 'api::critical-thinking-page.critical-thinking-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

await withStrapi(async (strapi) => {
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  console.log(`\n  Seeding Critical Thinking & Creativity${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0, reused = 0;

  /**
   * ⚠ THE NAME IS PASSED IN, NOT TAKEN FROM THE FILENAME.
   * Media reuse is BY NAME. `05.jpg` under summer-camp is one of seven numbered
   * photographs with that basename in this repository; under its basename this
   * page would silently take whichever was uploaded first.
   */
  async function up(assetPath, name, alt) {
    if (!assetPath) return null;
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

  /** 02 and 03 are the same shape, so they are built by the same function. */
  const markedList = async (s) => ({
    kicker: s.kicker,
    heading: s.heading,
    headingSecond: s.headingSecond || null,
    headingEm: s.headingEm || null,
    body: paras(s.body),
    marks: s.marks.map((m) => ({ label: m.label, mark: m.mark })),
    imageOne: await up(s.imageOne, s.imageOneName, s.imageOneAlt),
    imageOneAlt: s.imageOneAlt ?? null,
    imageTwo: await up(s.imageTwo, s.imageTwoName, s.imageTwoAlt),
    imageTwoAlt: s.imageTwoAlt ?? null,
  });

  const payload = {
    sectionOne: {
      kicker: fx.sectionOne.kicker,
      heading: fx.sectionOne.heading,
      headingEm: fx.sectionOne.headingEm || null,
      quote: fx.sectionOne.quote || null,
      quoteAuthor: fx.sectionOne.quoteAuthor || null,
      body: paras(fx.sectionOne.body),
      caption: fx.sectionOne.caption || null,
      captionSecond: fx.sectionOne.captionSecond || null,
      image: await up(fx.sectionOne.image, fx.sectionOne.imageName, fx.sectionOne.imageAlt),
      imageAlt: fx.sectionOne.imageAlt,
    },

    sectionTwo: await markedList(fx.sectionTwo),
    sectionThree: await markedList(fx.sectionThree),

    sectionFour: {
      kicker: fx.sectionFour.kicker,
      heading: fx.sectionFour.heading,
      headingSecond: fx.sectionFour.headingSecond || null,
      index: paras(fx.sectionFour.index),
      body: paras(fx.sectionFour.body),
      closingLine: fx.sectionFour.closingLine || null,
      imageOne: await up(fx.sectionFour.imageOne, fx.sectionFour.imageOneName, fx.sectionFour.imageOneAlt),
      imageOneAlt: fx.sectionFour.imageOneAlt,
      imageTwo: await up(fx.sectionFour.imageTwo, fx.sectionFour.imageTwoName, fx.sectionFour.imageTwoAlt),
      imageTwoAlt: fx.sectionFour.imageTwoAlt,
      imageThree: await up(fx.sectionFour.imageThree, fx.sectionFour.imageThreeName, fx.sectionFour.imageThreeAlt),
      imageThreeAlt: fx.sectionFour.imageThreeAlt,
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
    console.log('    Critical Thinking & Creativity   updated');
  } else {
    await strapi.documents(UID).create({ data: payload, status: 'published' });
    console.log('    Critical Thinking & Creativity   created');
  }

  console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused\n`);
});
