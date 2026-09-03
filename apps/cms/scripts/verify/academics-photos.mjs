/**
 * EVERY PLANNED PHOTOGRAPH SLOT IS IN THE DATABASE, WITH ITS PICTURE AND ITS
 * DESCRIPTION.
 *
 * A record whose photo list is short is not an error and does not fail a build;
 * the page simply renders a gap. So the plan is reconciled against the database
 * slot by slot, and the alt is compared as stored - with its token, not filled.
 */
import { readFileSync } from 'node:fs';
import { withStrapi } from '../lib/strapi.mjs';
const plan = JSON.parse(readFileSync(new URL('../fixtures/academics-photo-plan.json', import.meta.url), 'utf8'));
await withStrapi(async (app) => {
  const rows = await app.documents('api::academic-topic.academic-topic').findMany({
    fields: ['route'], pagination: { limit: -1 }, status: 'published',
    populate: { photos: { fields: ['key', 'alt'], populate: { image: { fields: ['name'] } } } },
  });
  const got = new Map(rows.map((r) => [r.route, r.photos ?? []]));
  let bad = 0, slots = 0;
  for (const [route, want] of Object.entries(plan)) {
    const have = got.get(route);
    if (!have) { console.log(`  ✗ no record for ${route}`); bad++; continue; }
    for (const s of want) {
      slots++;
      const m = have.find((h) => h.key === s.key);
      if (!m) { console.log(`  ✗ ${route} missing slot "${s.key}"`); bad++; continue; }
      if (!m.image) { console.log(`  ✗ ${route} slot "${s.key}" has no picture`); bad++; }
      if ((s.alt ?? '') !== (m.alt ?? '')) {
        console.log(`  ✗ ${route} slot "${s.key}" alt differs`);
        console.log(`      planned ${JSON.stringify(s.alt)}`);
        console.log(`      stored  ${JSON.stringify(m.alt)}`);
        bad++;
      }
    }
  }
  const all = rows.flatMap((r) => r.photos ?? []);
  console.log(`\n  ACADEMICS PHOTOGRAPHS IN STRAPI\n`);
  console.log(`    records with photos ${rows.filter((r) => r.photos?.length).length}`);
  console.log(`    slots planned       ${slots}`);
  console.log(`    slots stored        ${all.length}`);
  console.log(`    distinct files      ${new Set(all.map((p) => p.image?.name)).size}`);
  console.log(bad ? `\n  ✗ ${bad} problem(s)\n` : `\n  ✔ every planned slot is stored with its picture and description\n`);
  if (bad) process.exitCode = 1;
});
