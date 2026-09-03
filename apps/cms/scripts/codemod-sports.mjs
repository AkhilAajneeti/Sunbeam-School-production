/**
 * CODEMOD — point the sports / excursions / activities consumers at the CMS.
 *
 *     node scripts/codemod-sports.mjs --dry
 *     node scripts/codemod-sports.mjs
 *
 * ⚠ INSERTS *INSIDE* THE FRONTMATTER. The G4 version prepended to position 0,
 * which put the import above the opening `---` and broke 21 components — Astro
 * then reads it as template output, not frontmatter. This finds the opening
 * fence and inserts after it.
 *
 * ⚠ ONE await PER QUERY, NOT PER IMPORT. A file taking `{ record }` and
 * `{ shot }` from the same module gets one call and one destructure.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../web');
const SRC = join(WEB, 'src');
const CMS_DIR = join(SRC, 'lib', 'cms');
const DRY = process.argv.includes('--dry');

/**
 * data module → { query, names it can supply }.
 * A name the query does not supply is left alone and reported, rather than
 * silently destructured to undefined.
 */
const MAP = {
  sports: {
    facilities: ['getSportFacilities', (n) => n],
    games: ['getGames', (n) => n],
    figures: ['getSportsPage', (n) => n],
    ladder: ['getSportsPage', (n) => n],
    coaching: ['getSportsPage', (n) => n],
    montage: ['getSportsPage', (n) => n],
  },
  sportsRecord: { record: ['getSportsRecord', () => 'record'] },
  excursions: {
    sections: ['getExcursionSections', () => 'sections'],
    expeditions: ['getExpeditions', () => 'expeditions'],
  },
  schoolActivities: {
    schoolActivities: ['getActivitiesData', (n) => n],
    activityItems: ['getActivitiesData', (n) => n],
    activityPage: ['getActivitiesData', (n) => n],
    pageCount: ['getActivitiesData', (n) => n],
  },
};

/** Queries that return a bare array rather than a named object. */
const BARE = {
  getSportFacilities: 'facilities',
  getSportsRecord: 'record',
  getExcursionSections: 'sections',
  getExpeditions: 'expeditions',
};

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'lib') walk(f, out); }
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

function specifierTo(file) {
  let rel = relative(dirname(file), CMS_DIR).split(sep).join('/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

let changed = 0;
const report = [];
const skipped = [];

for (const file of walk(SRC)) {
  let src = readFileSync(file, 'utf8');
  const before = src;

  /** query fn → the names to take from it */
  const need = new Map();
  let unknown = null;

  for (const [mod, names] of Object.entries(MAP)) {
    const re = new RegExp(`import \\{([^}]*)\\} from ['"][^'"]*data/${mod}['"];?\\n?`);
    const m = src.match(re);
    if (!m) continue;

    const wanted = m[1].split(',').map((s) => s.trim()).filter(Boolean);
    for (const w of wanted) {
      const entry = names[w];
      if (!entry) { unknown = `${mod}.${w}`; continue; }
      const [fn] = entry;
      if (!need.has(fn)) need.set(fn, new Set());
      need.get(fn).add(w);
    }
    src = src.replace(re, '');
  }

  if (unknown) { skipped.push(`  ${relative(SRC, file).split(sep).join('/')} — unmapped: ${unknown}`); continue; }
  if (need.size === 0) continue;

  const spec = specifierTo(file);
  const lines = [];
  lines.push(`import { ${[...need.keys()].join(', ')} } from '${spec}';`);
  lines.push('');
  for (const [fn, names] of need) {
    const bare = BARE[fn];
    if (bare) lines.push(`const ${[...names][0]} = await ${fn}();`);
    else lines.push(`const { ${[...names].join(', ')} } = await ${fn}();`);
  }

  const arr = src.split('\n');
  const open = arr.findIndex((l) => l.trim() === '---');
  if (open === -1) { skipped.push(`  ${relative(SRC, file)} — no frontmatter fence`); continue; }
  arr.splice(open + 1, 0, ...lines);
  src = arr.join('\n').replace(/\n{4,}/g, '\n\n\n');

  report.push(`  ${relative(SRC, file).split(sep).join('/').padEnd(50)} ${[...need.keys()].join(' ')}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} files\n`);
console.log(report.sort().join('\n'));
if (skipped.length) { console.log('\n  SKIPPED\n'); console.log(skipped.join('\n')); }
console.log('');
