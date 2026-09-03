/**
 * PROVE AN EDIT IN THE ADMIN REACHES THE PAGE.
 *
 *     node scripts/verify/mutate-experiential.mjs apply
 *     npm run seed:experiential-inquiry          # revert
 *
 * This page is worth testing harder than the two before it, because two of its
 * sections are DERIVED rather than typed: the arrows between the three words and
 * the line breaks in the close are drawn from HOW MANY entries there are. A test
 * that only changed text would leave the interesting half unproven.
 *
 * Four mechanisms, one field each:
 *   1. headingWords   a repeatable that DRIVES A COMPUTED HEADING - dropping to
 *                     two words must leave exactly one arrow, not two
 *   2. steps[].label  a nested repeatable that also carries media
 *   3. entries[].value a repeatable pair
 *   4. headingLines   a repeatable that DRIVES THE LINE BREAKS - three lines to
 *                     two must leave one <br>, and the italic must follow to the
 *                     new last line
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::experiential-inquiry-page.experiential-inquiry-page';
const mode = process.argv[2];
if (mode !== 'apply') {
  console.error('usage: apply   (revert with: npm run seed:experiential-inquiry)');
  process.exit(1);
}

const POPULATE = {
  sectionTwo: { populate: { headingWords: true, steps: { populate: { photo: true, icon: true } } } },
  sectionThree: { populate: { body: true, entries: true, imageOne: true, imageTwo: true, imageThree: true } },
  close: { populate: { headingLines: true, image: true } },
};

/** Media comes back as an object and must go back as an id. */
const id = (m) => (m && typeof m === 'object' ? m.id : m) ?? null;

await withStrapi(async (app) => {
  const doc = await app.documents(UID).findFirst({ populate: POPULATE, status: 'draft' });
  if (!doc) throw new Error('no Experiential document to mutate');

  const two = doc.sectionTwo, three = doc.sectionThree, close = doc.close;

  await app.documents(UID).update({
    documentId: doc.documentId,
    data: {
      sectionTwo: {
        ...two,
        /* THREE WORDS DOWN TO TWO. One arrow must survive, not two. */
        headingWords: [{ text: 'Notice' }, { text: 'Wonder' }],
        steps: (two.steps ?? []).map((s, i) => ({
          ...s,
          label: i === 0 ? 'Mutation proof one' : s.label,
          photo: id(s.photo), icon: id(s.icon),
        })),
      },
      sectionThree: {
        ...three,
        entries: (three.entries ?? []).map((e, i) => ({
          ...e, value: i === 0 ? 'Mutation proof two.' : e.value,
        })),
        imageOne: id(three.imageOne), imageTwo: id(three.imageTwo), imageThree: id(three.imageThree),
      },
      close: {
        ...close,
        /* THREE LINES DOWN TO TWO. One break must survive, and the italic must
           move to "Wonder about it." */
        headingLines: [{ text: 'Mutation proof three.' }, { text: 'Wonder about it.' }],
        image: id(close.image),
      },
    },
    status: 'published',
  });

  console.log('\n  applied:');
  console.log('    headingWords  3 -> 2   Notice / Wonder          (expect ONE arrow)');
  console.log('    steps[0]              "Mutation proof one"');
  console.log('    entries[0]            "Mutation proof two."');
  console.log('    headingLines  3 -> 2  "Mutation proof three." (expect ONE <br>, italic on line 2)\n');
});
