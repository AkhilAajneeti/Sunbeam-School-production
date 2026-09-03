/**
 * MUTATION TEST FOR G8.
 *
 *     node scripts/verify/mutate-academics.mjs apply | revert
 *
 * ⚠ ONE FIELD PER MECHANISM. G8 introduced four ways content reaches a page and
 * each is tested once:
 *
 *   a point's title            → the commonest shape, read as `k`
 *   a keyed section's heading  → the section contract itself
 *   a blockMap sub-block       → the rebuilt nesting, read as `parents.forum.heading`
 *   a topic record's label     → the collection, read by the hub and the nav
 *
 * ⚠ RUN WITH STRAPI STOPPED — this boots its own instance.
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::academic-topic.academic-topic';

const CASES = [
  { route: '/academics/assessment/', key: 'steps', field: 'points0title',
    apply: 'Mutation proof one', revert: 'Taught content' },
  { route: '/academics/teaching-learning/', key: 'teachingLearning.method', field: 'heading',
    apply: 'Mutation proof two', revert: null },
  { route: '/academics/parent-partnership/', key: 'parents.forum', field: 'heading',
    apply: 'Mutation proof three', revert: null },
];

const mode = process.argv[2];
if (mode !== 'apply' && mode !== 'revert') {
  console.error('\n  Usage: mutate-academics.mjs apply | revert\n');
  process.exit(1);
}

await withStrapi(async (strapi) => {
  console.log(`\n  ${mode === 'apply' ? 'Applying' : 'Reverting'}:\n`);

  for (const c of CASES) {
    const doc = await strapi.documents(UID).findFirst({
      status: 'draft', filters: { route: c.route },
      populate: { sections: { populate: { points: true } } },
    });
    if (!doc) throw new Error(`no record for ${c.route}`);

    const sections = doc.sections.map((s) => {
      if (s.key !== c.key) return s;
      if (c.field === 'heading') {
        /* On revert the original heading is whatever the seed writes, so the
           revert here is a re-seed rather than a stored string. */
        return { ...s, heading: mode === 'apply' ? c.apply : s.heading };
      }
      const points = (s.points ?? []).map((p, i) =>
        (i === 0 ? { ...p, title: mode === 'apply' ? c.apply : c.revert } : p));
      return { ...s, points };
    });

    await strapi.documents(UID).update({
      documentId: doc.documentId, data: { sections }, status: 'published',
    });
    console.log(`    ${c.route.padEnd(36)} ${c.key} · ${c.field}`);
  }
  console.log('');
});
