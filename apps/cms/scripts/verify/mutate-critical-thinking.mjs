/**
 * PROVE AN EDIT IN THE ADMIN REACHES THE PAGE.
 *
 *     node scripts/verify/mutate-critical-thinking.mjs apply
 *     npm run seed:critical-thinking            # revert
 *
 * Four mechanisms, one field each:
 *   1. caption          a plain string on a section widened for this page
 *   2. marks[0].mark    AN ENUMERATION - the symbol must change with it, which
 *                       proves the CMS chooses the drawing without owning it
 *   3. marks (03)       four entries to three: the 01-04 numbering is COUNTED by
 *                       the page, so it must renumber and not leave an 04
 *   4. closingLine      the short line that ends 04
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::critical-thinking-page.critical-thinking-page';
const mode = process.argv[2];
if (mode !== 'apply') {
  console.error('usage: apply   (revert with: npm run seed:critical-thinking)');
  process.exit(1);
}

const POPULATE = {
  sectionOne: { populate: { body: true, image: true } },
  sectionTwo: { populate: { body: true, marks: true, imageOne: true, imageTwo: true } },
  sectionThree: { populate: { body: true, marks: true, imageOne: true, imageTwo: true } },
  sectionFour: { populate: { index: true, body: true, imageOne: true, imageTwo: true, imageThree: true } },
};

const id = (m) => (m && typeof m === 'object' ? m.id : m) ?? null;

await withStrapi(async (app) => {
  const doc = await app.documents(UID).findFirst({ populate: POPULATE, status: 'draft' });
  if (!doc) throw new Error('no Critical Thinking document to mutate');

  const { sectionOne: one, sectionTwo: two, sectionThree: three, sectionFour: four } = doc;

  await app.documents(UID).update({
    documentId: doc.documentId,
    data: {
      sectionOne: { ...one, caption: 'Mutation proof one', image: id(one.image) },
      sectionTwo: {
        ...two,
        marks: (two.marks ?? []).map((m, i) => (
          i === 0 ? { label: 'Mutation proof two', mark: 'medal' } : { label: m.label, mark: m.mark }
        )),
        imageOne: id(two.imageOne), imageTwo: id(two.imageTwo),
      },
      sectionThree: {
        ...three,
        /* FOUR ENTRIES DOWN TO THREE. The run must end at 03, not 04. */
        marks: (three.marks ?? []).slice(0, 3).map((m) => ({ label: m.label, mark: m.mark })),
        imageOne: id(three.imageOne), imageTwo: id(three.imageTwo),
      },
      sectionFour: {
        ...four,
        closingLine: 'Mutation proof four.',
        imageOne: id(four.imageOne), imageTwo: id(four.imageTwo), imageThree: id(four.imageThree),
      },
    },
    status: 'published',
  });

  console.log('\n  applied:');
  console.log('    caption               "Mutation proof one"');
  console.log('    marks[0] (02)         "Mutation proof two" + symbol medal');
  console.log('    marks (03)   4 -> 3   (expect the run to end at 03)');
  console.log('    closingLine           "Mutation proof four."\n');
});
