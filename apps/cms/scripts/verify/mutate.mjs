/**
 * MUTATION TEST — prove the rendered page follows the CMS, not the code.
 *
 *     node scripts/verify/mutate.mjs apply
 *     node scripts/verify/mutate.mjs revert
 *
 * ⚠ THE POINT IS NOT THAT THE FIELD EXISTS. Check 1 already showed the content
 * is in Strapi and check 2 that the page reads it. Neither proves an EDITOR can
 * change the page: a build could be reading a stale cache, a fallback, or a
 * literal that happens to match. Changing the record and watching the HTML move
 * is the only thing that does.
 *
 * ⚠ THREE FIELDS, CHOSEN TO EXERCISE THREE DIFFERENT MECHANISMS:
 *   · heroTitle          — the `{{…}}` emphasis marker and the newline break
 *   · heroDeck           — the `{currentStrength}` token filled from Site Settings
 *   · affiliationsHeading — a plain heading that used to be literal markup
 *
 * ⚠ RUN WITH STRAPI STOPPED. This boots its own instance, and two Strapi
 * processes against one database is the failure that cost this project a day.
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::homepage.homepage';

const MUTATIONS = {
  heroTitle: {
    apply: 'Mutation {{proof}} one\nsecond line',
    revert: 'Where Ballia’s \nFuture Leaders {{Take Shape}}',
  },
  heroDeck: {
    apply: 'Mutation proof two — {currentStrength} students.',
    revert: 'A Sunbeam institution since 2013 — {currentStrength} students, Nursery to Class XII, on a campus built for how children actually learn.',
  },
  affiliationsHeading: {
    apply: 'Mutation {{proof three}}',
    revert: 'Affiliations & recognition{{ partners}}',
  },
};

const mode = process.argv[2];
if (mode !== 'apply' && mode !== 'revert') {
  console.error('  Usage: mutate.mjs apply | revert');
  process.exit(1);
}

await withStrapi(async (strapi) => {
  const doc = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (!doc) throw new Error('no homepage record — seed first');

  const data = Object.fromEntries(
    Object.entries(MUTATIONS).map(([field, v]) => [field, v[mode]]),
  );

  /* ⚠ PUBLISHED, NOT DRAFT. The site builds from published content; writing a
     draft would leave the page unchanged and the test would "fail" for a reason
     that has nothing to do with whether the wiring works. */
  await strapi.documents(UID).update({
    documentId: doc.documentId, data, status: 'published',
  });

  console.log(`\n  ${mode === 'apply' ? 'Applied' : 'Reverted'}:`);
  for (const [k, v] of Object.entries(data)) {
    console.log(`    ${k.padEnd(22)} ${JSON.stringify(v.slice(0, 56))}`);
  }
  console.log('');
});
