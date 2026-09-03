/**
 * MUTATION TEST FOR G7 — prove these pages follow the CMS.
 *
 *     node scripts/verify/mutate-pages.mjs apply
 *     node scripts/verify/mutate-pages.mjs revert
 *
 * ⚠ ONE FIELD PER MECHANISM, not one per page. What is being tested is that
 * each *route from CMS to pixel* works, and G7 introduced four of them:
 *
 *   disclosure.sections[0].label   → a component array feeding two places at
 *                                    once (the rail and the section heading)
 *   disclosure.boardResultsNote    → RichLine's inline emphasis
 *   uniform.topHeading             → ClipHeading's line split and {{italic}}
 *   tc.submitLabel                 → a string that reaches a <script> as a
 *                                    data- attribute and is written into the DOM
 *   contact.heading                → plain interpolation
 *
 * ⚠ RUN WITH STRAPI STOPPED — this boots its own instance.
 */
import { withStrapi } from '../lib/strapi.mjs';

const CASES = [
  {
    uid: 'api::disclosure-page.disclosure-page',
    field: 'sections',
    apply: (v) => v.map((s, i) => (i === 0 ? { ...s, label: 'Mutation proof one' } : s)),
    revert: (v) => v.map((s, i) => (i === 0 ? { ...s, label: 'General Information' } : s)),
    populate: { sections: true },
  },
  {
    uid: 'api::disclosure-page.disclosure-page',
    field: 'boardResultsNote',
    apply: () => 'Mutation **proof** two, *emphasised*.',
    revert: () => 'As published by the school in its “Last Three Years Board Result” document. It records students **registered** and **passed**; a separate figure for students *appeared* is not published, so none is shown.',
  },
  {
    uid: 'api::uniform-page.uniform-page',
    field: 'topHeading',
    apply: () => 'Mutation proof\n{{three}}',
    revert: () => 'Explore our official\n{{uniform catalogues}}',
  },
  {
    uid: 'api::tc-page.tc-page',
    field: 'submitLabel',
    apply: () => 'Mutation four',
    revert: () => 'Search',
  },
  {
    uid: 'api::contact-page.contact-page',
    field: 'heading',
    apply: () => 'Mutation proof five',
    revert: () => 'Get in touch',
  },
];

const mode = process.argv[2];
if (mode !== 'apply' && mode !== 'revert') {
  console.error('\n  Usage: mutate-pages.mjs apply | revert\n');
  process.exit(1);
}

await withStrapi(async (strapi) => {
  console.log(`\n  ${mode === 'apply' ? 'Applying' : 'Reverting'}:\n`);

  for (const c of CASES) {
    const doc = await strapi.documents(c.uid).findFirst({
      status: 'draft', populate: c.populate ?? undefined,
    });
    if (!doc) throw new Error(`no record for ${c.uid} — seed first`);

    const next = c[mode](doc[c.field]);
    /* ⚠ PUBLISHED: the site builds from published content, so a draft write
       would leave the page unchanged and the test would fail for the wrong
       reason. */
    await strapi.documents(c.uid).update({
      documentId: doc.documentId, data: { [c.field]: next }, status: 'published',
    });

    const shown = Array.isArray(next) ? next[0]?.label : String(next).slice(0, 52);
    console.log(`    ${c.uid.replace('api::', '').split('.')[0].padEnd(18)} ${c.field.padEnd(18)} ${JSON.stringify(shown)}`);
  }
  console.log('');
});
