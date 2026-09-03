/**
 * PROVE AN EDIT IN THE ADMIN REACHES THE PAGE.
 *
 *     node scripts/verify/mutate-curriculum.mjs apply
 *     npm run seed:curriculum                  # revert
 *
 * Five mechanisms, one field each. Three of them are the point of this page's
 * model and could not be tested on any page before it:
 *
 *   1. stages[0].label   EDITED ONCE, DRAWN TWICE — it must change on the
 *                        journey at the top AND on the library row below
 *   2. a class removed   the note under the library says "N classes, N
 *                        documents", and N is COUNTED — it must fall to 14
 *   3. a href cleared    that card must stop being a link and say the syllabus
 *                        is issued by the school, not link to nowhere
 *   4. tiles[0].label    a plain string inside a repeatable
 *   5. a tile removed    the colours are CYCLED by the page, so the cards after
 *                        it must take the previous card's colour rather than
 *                        leaving a gap
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::curriculum-page.curriculum-page';
const mode = process.argv[2];
if (mode !== 'apply') {
  console.error('usage: apply   (revert with: npm run seed:curriculum)');
  process.exit(1);
}

const POPULATE = {
  stages: { populate: { classes: true } },
  sectionOne: { populate: { body: true } },
  sectionTwo: { populate: { body: true } },
  sectionThree: { populate: { tiles: true } },
  sectionFour: { populate: { tiles: true } },
  sectionFive: { populate: { tiles: true } },
};

const bare = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k] ?? null]));

await withStrapi(async (app) => {
  const doc = await app.documents(UID).findFirst({ populate: POPULATE, status: 'draft' });
  if (!doc) throw new Error('no Curriculum document to mutate');

  const stages = (doc.stages ?? []).map((s, i) => ({
    ...bare(s, ['label', 'range', 'blurb', 'mark']),
    label: i === 0 ? 'Mutation proof one' : s.label,
    classes: (s.classes ?? [])
      /* Drop one class from the first stage: the note must recount. */
      .filter((c, j) => !(i === 0 && j === 0))
      /* Clear one link: that card must stop being an anchor. */
      .map((c, j) => ({ ...bare(c, ['label', 'href', 'sizeMb']), href: i === 0 && j === 0 ? null : c.href })),
  }));

  const three = doc.sectionThree;

  await app.documents(UID).update({
    documentId: doc.documentId,
    data: {
      stages,
      sectionThree: {
        ...bare(three, ['kicker', 'heading', 'headingEm']),
        tiles: (three.tiles ?? [])
          .slice(0, -1)                       /* one card fewer — colours must re-cycle */
          .map((t, i) => ({
            ...bare(t, ['label', 'value', 'mark', 'href']),
            label: i === 0 ? 'Mutation proof two' : t.label,
          })),
      },
    },
    status: 'published',
  });

  const total = stages.reduce((n, s) => n + s.classes.length, 0);
  console.log('\n  applied:');
  console.log('    stages[0].label    "Mutation proof one"  (expect it TWICE — journey and library)');
  console.log(`    one class removed  (expect the note to say ${total}, not 15)`);
  console.log('    one href cleared   (expect "Issued by the school" on that card)');
  console.log('    tiles[0].label     "Mutation proof two"');
  console.log('    one tile removed   (expect 4 cards, colours re-cycled)\n');
});
