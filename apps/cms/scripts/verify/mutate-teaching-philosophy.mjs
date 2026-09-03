/**
 * PROVE AN EDIT IN THE ADMIN REACHES THE PAGE.
 *
 *     node scripts/verify/mutate-teaching-philosophy.mjs apply | revert
 *
 * One field per mechanism: a plain string, a paragraph inside a repeatable
 * component, and a card label inside a nested repeatable. If all three move, the
 * whole shape is wired.
 */
import { withStrapi } from '../lib/strapi.mjs';
const UID = 'api::teaching-philosophy-page.teaching-philosophy-page';
const mode = process.argv[2];
if (!['apply', 'revert'].includes(mode)) { console.error('usage: apply | revert'); process.exit(1); }

const CASES = {
  apply: { kicker: 'Mutation proof one', para: 'Mutation proof two.', card: 'Mutation proof three' },
  revert: { kicker: 'Every child is different', para: null, card: 'Words' },
};
const c = CASES[mode];

await withStrapi(async (app) => {
  const doc = await app.documents(UID).findFirst({ populate: { sectionOne: { populate: { body: true, image: true } }, sectionThree: { populate: { cards: { populate: { icon: true } }, image: true } } }, status: 'draft' });
  const one = doc.sectionOne, three = doc.sectionThree;
  const body = (one.body ?? []).map((p, i) => ({ text: i === 0 && c.para ? c.para : p.text }));
  const cards = (three.cards ?? []).map((x, i) => ({ label: i === 0 ? c.card : x.label, icon: x.icon?.id ?? x.icon }));
  await app.documents(UID).update({
    documentId: doc.documentId,
    data: {
      sectionOne: { ...one, image: one.image?.id ?? one.image, kicker: c.kicker, body },
      sectionThree: { ...three, image: three.image?.id ?? three.image, cards },
    },
    status: 'published',
  });
  console.log(`\n  ${mode}: kicker="${c.kicker}"  card="${c.card}"${c.para ? `  paragraph="${c.para}"` : '  paragraph restored by re-seed'}\n`);
});
