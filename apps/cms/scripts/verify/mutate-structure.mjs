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
const SMART = 'api::smart-classrooms-page.smart-classrooms-page';
const MENTOR = 'api::mentoring-page.mentoring-page';

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
    /* ⚠ Carried through, or writing a band back would wipe the figures. */
    number: c.number, suffix: c.suffix, state: c.state,
  })),
  cellsTwo: (b?.cellsTwo ?? []).map((c) => ({
    label: c.label, value: c.value, mark: c.mark, note: c.note,
    sub: c.sub, caption: c.caption, flag: c.flag, image: id(c.image), alt: c.alt,
    /* ⚠ Carried through, or writing a band back would wipe the figures. */
    number: c.number, suffix: c.suffix, state: c.state,
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

  /* ── Smart Classrooms: the figure, and what follows it ─────────────────── */
  const sm = await app.documents(SMART).findFirst({
    populate: Object.fromEntries(
      ['room', 'sys', 'beyond', 'prac', 'close'].map((s) => [s, bandPopulate]),
    ),
    status: 'draft',
  });
  if (!sm) throw new Error('no Smart Classrooms document to mutate');

  const sys = bare(sm.sys);
  await app.documents(SMART).update({
    documentId: sm.documentId,
    data: {
      sys: {
        ...sys,
        /* ⚠ THE FIGURE IS CONTENT HERE, not a position in the run. The seed
           dropped it once and "75+" rendered as nothing at all. */
        cells: sys.cells.map((c, i) => (i === 0 ? { ...c, number: '9999', suffix: '%' } : c)),
      },
    },
    status: 'published',
  });

  /* ── Mentoring: a rail that numbers its own steps ──────────────────────── */
  const mn = await app.documents(MENTOR).findFirst({
    populate: Object.fromEntries(
      ['open', 'rel', 'jrn', 'roles', 'human', 'final'].map((s) => [s, bandPopulate]),
    ),
    status: 'draft',
  });
  if (!mn) throw new Error('no Mentoring document to mutate');

  const jrn = bare(mn.jrn);
  await app.documents(MENTOR).update({
    documentId: mn.documentId,
    data: {
      jrn: {
        ...jrn,
        /* ⚠ THE RAIL NUMBERS ITS OWN STEPS. Four stages down to three must end
           at 03 — the number is not stored on the cell. */
        cells: jrn.cells.slice(0, 3).map((c, i) => (
          i === 0 ? { ...c, label: 'Mutation proof five' } : c
        )),
      },
    },
    status: 'published',
  });

  console.log('\n  applied:');
  console.log('    Secondary open.heading   "Mutation proof one" + {{in italic.}}');
  console.log('    Secondary open.body[0]   "Mutation proof two."');
  console.log('    Secondary open.cells     4 -> 3   (expect the run to end at 03)');
  console.log('    Streams  streams[0]      "Mutation proof three"');
  console.log('                             (expect it in EVERY band that draws the streams)');
  console.log('    Smart    sys.cells[0]     number 9999, suffix %   (expect "9999%" on the card)');
  console.log('    Mentor   jrn.cells        4 -> 3, first "Mutation proof five"');
  console.log('                             (expect the rail to end at 03)\n');
});
