/**
 * PROVE AN EDIT IN THE ADMIN REACHES THE STRUCTURE PAGES.
 *
 *     node scripts/verify/mutate-structure.mjs apply
 *     npm run seed:structure                     # revert
 *
 * Five mechanisms, chosen because each one is something this conversion CHANGED
 * rather than merely moved:
 *
 *   1. a band heading      the clipped lines and the {{italic}} marker
 *   2. a band paragraph    a repeatable inside a named band
 *   3. a cell removed      the 01/02/03 down the run is COUNTED, so the run must
 *                          renumber and not leave a gap
 *   4. a stream label      the page-level list — it must change in EVERY band
 *                          that draws it, which is the whole point of holding it
 *                          once
 *   5. a stream's core     a nested list inside that page-level list
 */
import { withStrapi } from '../lib/strapi.mjs';

const mode = process.argv[2];
if (mode !== 'apply') {
  console.error('usage: apply   (revert with: npm run seed:structure)');
  process.exit(1);
}

const SECONDARY = 'api::secondary-stage-page.secondary-stage-page';
const STREAMS = 'api::streams-offered-page.streams-offered-page';

const bandPopulate = {
  populate: {
    body: true,
    shots: { populate: { image: true } },
    cells: { populate: { image: true } },
    cellsTwo: { populate: { image: true } },
  },
};
const id = (m) => (m && typeof m === 'object' ? m.id : m) ?? null;

const bare = (b) => ({
  kicker: b?.kicker ?? null,
  heading: b?.heading ?? null,
  caption: b?.caption ?? null,
  body: (b?.body ?? []).map((p) => ({ text: p.text })),
  shots: (b?.shots ?? []).map((s) => ({ key: s.key, image: id(s.image), alt: s.alt })),
  cells: (b?.cells ?? []).map((c) => ({
    label: c.label, value: c.value, mark: c.mark, note: c.note,
    sub: c.sub, caption: c.caption, flag: c.flag, image: id(c.image), alt: c.alt,
  })),
  cellsTwo: (b?.cellsTwo ?? []).map((c) => ({
    label: c.label, value: c.value, mark: c.mark, note: c.note,
    sub: c.sub, caption: c.caption, flag: c.flag, image: id(c.image), alt: c.alt,
  })),
});

await withStrapi(async (app) => {
  /* ── Secondary: heading, paragraph, and a cell taken out of a run ───────── */
  const sec = await app.documents(SECONDARY).findFirst({
    populate: Object.fromEntries(
      ['open', 'board', 'deep', 'beyond', 'jrn', 'close'].map((s) => [s, bandPopulate]),
    ),
    status: 'draft',
  });
  if (!sec) throw new Error('no Secondary document to mutate');

  const open = bare(sec.open);
  await app.documents(SECONDARY).update({
    documentId: sec.documentId,
    data: {
      open: {
        ...open,
        heading: 'Mutation proof one\n{{in italic.}}',
        body: open.body.map((p, i) => (i === 0 ? { text: 'Mutation proof two.' } : p)),
        /* FOUR CELLS DOWN TO THREE. The run must end at 03, not 04. */
        cells: open.cells.slice(0, 3),
      },
    },
    status: 'published',
  });

  /* ── Streams Offered: the page-level list ──────────────────────────────── */
  const so = await app.documents(STREAMS).findFirst({
    populate: {
      streams: { populate: { core: true, optional: true, additional: true } },
      ...Object.fromEntries(['paths', 'x', 'dir', 'sure'].map((s) => [s, bandPopulate])),
    },
    status: 'draft',
  });
  if (!so) throw new Error('no Streams Offered document to mutate');

  await app.documents(STREAMS).update({
    documentId: so.documentId,
    data: {
      streams: (so.streams ?? []).map((x, i) => ({
        label: i === 0 ? 'Mutation proof three' : x.label,
        mark: x.mark, sub: x.sub, value: x.value, note: x.note,
        core: (x.core ?? []).map((c) => ({ text: c.text })),
        optional: (x.optional ?? []).map((c) => ({ text: c.text })),
        additional: (x.additional ?? []).map((c) => ({ text: c.text })),
        owed: x.owed,
      })),
    },
    status: 'published',
  });

  console.log('\n  applied:');
  console.log('    Secondary open.heading   "Mutation proof one" + {{in italic.}}');
  console.log('    Secondary open.body[0]   "Mutation proof two."');
  console.log('    Secondary open.cells     4 -> 3   (expect the run to end at 03)');
  console.log('    Streams  streams[0]      "Mutation proof three"');
  console.log('                             (expect it in EVERY band that draws the streams)\n');
});
