/**
 * JOIN WHAT THE CODEMOD TOOK OUT OF A PAGE WITH WHAT THE CMS ALREADY HELD.
 *
 *     node scripts/extract/structure-fixture.mjs <PageName>
 *
 * The codemod writes `<page>.raw.json`: the prose it removed, and the NAME of
 * each photograph slot and each run it left behind. This fills those names in
 * from the two places that already hold them —
 *
 *   · academics-photo-plan.json  the asset path, upload name and alt for a slot
 *   · academics.json             the rows of each run, as the page declared them
 *
 * — and writes the fixture the seed reads.
 *
 * ⚠ NOTHING IS TYPED IN HERE. Every value comes from one of those two files or
 * from the raw capture, so a fixture that disagrees with the page it replaced is
 * not possible by hand-slip; it would take a bug in one of the three.
 *
 * ⚠ n, nx AND ny ARE DROPPED ON PURPOSE. Every numbered run on these pages was
 * a plain 01, 02, 03 sequence and the two positions were percentages on a drawn
 * curve. The page derives all three now.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = resolve(HERE, '../fixtures');
const WEB_SRC = resolve(HERE, '../../../web/src');

const PAGES = {
  SecondaryPage: { fixture: 'secondary-stage', route: '/academics/structure/secondary/' },
  SeniorSecondaryPage: { fixture: 'senior-secondary', route: '/academics/structure/senior-secondary/' },
  MiddleSchoolPage: { fixture: 'middle-school', route: '/academics/structure/middle-school/' },
  PrimaryPage: { fixture: 'primary-stage', route: '/academics/structure/primary/' },
  PrePrimaryPage: { fixture: 'pre-primary', route: '/academics/structure/pre-primary/' },
  StreamsOfferedPage: { fixture: 'streams-offered', route: '/academics/structure/streams-offered/', pageRun: { field: 'streams', list: 'streams' } },
  SubjectCombinationsPage: { fixture: 'subject-combinations', route: '/academics/structure/subject-combinations/', pageRun: { field: 'streams', list: 'worlds' } },
};

const PAGE = process.argv[2];
const cfg = PAGES[PAGE];
if (!cfg) { console.error(`usage: structure-fixture.mjs <${Object.keys(PAGES).join('|')}>`); process.exit(1); }

const raw = JSON.parse(readFileSync(`${FX}/${cfg.fixture}.raw.json`, 'utf8'));
const plan = JSON.parse(readFileSync(`${FX}/academics-photo-plan.json`, 'utf8'))[cfg.route] ?? [];
const lists = JSON.parse(readFileSync(`${FX}/academics.json`, 'utf8'))[`components/academics/structure/${PAGE}.astro`] ?? {};

const bySlot = Object.fromEntries(plan.map((r) => [r.key, r]));

/** The page's own field names, as they land on structure.cell. */
const FIELD = {
  k: 'label', v: 'value', mark: 'mark', sub: 'sub', alt: 'alt',
  who: 'note', hired: 'flag', photo: 'image', cap: 'caption',
  name: 'label', line: 'value', dir: 'note', body: 'value', state: 'state',
  core: 'core', optional: 'optional', additional: 'additional', coreOwed: 'owed',
};
/* `tint` and `key` were only ever a CSS modifier suffix, running in list order. */
const DROP = new Set(['n', 'nx', 'ny', 'tint', 'key']);

const problems = [];
const out = {};

for (const [name, band] of Object.entries(raw)) {
  const section = {
    kicker: band.kicker,
    heading: band.heading,
    body: band.body,
    caption: band.caption,
    shots: [],
    cells: [],
    cellsTwo: [],
  };

  for (const s of band.shots) {
    const row = bySlot[s.key];
    if (!row) { problems.push(`${name}: no photo-plan row for ${s.key}`); continue; }
    if (!existsSync(join(WEB_SRC, row.asset))) { problems.push(`${name}: missing asset ${row.asset}`); continue; }
    /* The plan resolves the alt for a slot whose alt was an attribute; where it
       was a template literal in the markup the capture carries it instead. */
    const alt = s.alt ?? row.alt;
    if (!alt) { problems.push(`${name}: no alt for ${s.key}`); continue; }
    section.shots.push({ key: s.key, asset: row.asset, name: row.name, alt });
  }

  for (const run of band.runs) {
    /* A run is either a list the page already declared, or rows written out by
       hand for a band the codemod could not lift by machine. */
    const rows = run.rows ?? lists[run.list];
    if (!Array.isArray(rows)) { problems.push(`${name}: no rows for run "${run.list}"`); continue; }
    section[run.field] = rows.map((r) => {
      if (typeof r === 'string') return { label: r };
      const cell = {};
      for (const [k, v] of Object.entries(r)) {
        if (DROP.has(k)) continue;
        if (!FIELD[k]) { problems.push(`${name}: ${run.list}.${k} has nowhere to go on a cell`); continue; }
        cell[FIELD[k]] = v;
      }
      /* A cell that carries its own photograph holds an absolute path from the
         page's data. It becomes a path under web/src plus an upload name — and
         the name is FOLDER-QUALIFIED, because media reuse is by name and
         'DSC_1246 copy' is one of a numbered empty-campus series. */
      if (cell.image && typeof cell.image === 'object' && cell.image.__image) {
        const rel = cell.image.__image
          .split(String.fromCharCode(92)).join('/')
          .replace(/^.*?\/web\/src\//, '');
        const parts = rel.split('/');
        const base = parts[parts.length - 1].replace(/\.[^.]+$/, '');
        if (!existsSync(join(WEB_SRC, rel))) problems.push(`${name}: missing cell asset ${rel}`);
        cell.image = rel;
        cell.imageName = (parts.length > 1 ? parts[parts.length - 2] + '-' : '') + base;
        cell.imageName = cell.imageName.toLowerCase().split(' ').join('-');
      }
      return cell;
    });
  }

  out[name] = section;
}

/**
 * ⚠ THE PAGE-LEVEL LIST. Both stream pages draw the same four streams in every
 * band, so the list sits beside the bands rather than inside one of them —
 * exactly as the Curriculum stages do. Edited once, drawn everywhere.
 */
if (cfg.pageRun) {
  const rows = lists[cfg.pageRun.list];
  if (!Array.isArray(rows)) problems.push(`no rows for the page list "${cfg.pageRun.list}"`);
  else {
    out[cfg.pageRun.field] = rows.map((r) => {
      const item = {};
      for (const [k, v] of Object.entries(r)) {
        if (DROP.has(k)) continue;
        if (!FIELD[k]) { problems.push(`${cfg.pageRun.list}.${k} has nowhere to go on a stream`); continue; }
        item[FIELD[k]] = v;
      }
      return item;
    });
  }
}

console.log(`\n  ${PAGE}`);
for (const [k, v] of Object.entries(out)) {
  if (Array.isArray(v)) { console.log(`    ${k.padEnd(9)} ${v.length} row(s) — the page-level list`); continue; }
  console.log(`    ${k.padEnd(9)} body:${String(v.body.length).padEnd(2)} shots:${String(v.shots.length).padEnd(2)}`
    + ` cells:${String(v.cells.length).padEnd(2)} cellsTwo:${v.cellsTwo.length}`);
}
if (problems.length) {
  console.error('\n  PROBLEMS');
  for (const p of problems) console.error(`    ⚠ ${p}`);
  process.exit(1);
}

writeFileSync(`${FX}/${cfg.fixture}.json`, JSON.stringify(out, null, 2) + '\n');
console.log(`\n  written: fixtures/${cfg.fixture}.json\n`);
