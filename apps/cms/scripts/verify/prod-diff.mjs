/**
 * PRODUCTION DIFF — does the migrated page still say the same thing?
 *
 *     node scripts/verify/prod-diff.mjs /            /about/history-legacy/
 *     node scripts/verify/prod-diff.mjs --all        # every route in the sitemap
 *
 * ═══ WHY THIS IS THE CHECK THAT COUNTS ═════════════════════════════════════
 *
 * Every other check in this migration confirms that the CMS holds the content
 * and that the page reads it. None of them can tell you the page still READS
 * THE SAME. A component that quietly loses a paragraph, a heading whose
 * emphasis moved, an alt text that became empty — all of those build cleanly,
 * pass a schema check, and are wrong.
 *
 * sunbeam-school-lemon.vercel.app is the site as it was BEFORE any of this
 * began. Diffing the locally built HTML against it, as text, is the only
 * evidence that 162 pages of rewiring changed nothing a reader can see.
 *
 * ⚠ TEXT, NOT MARKUP. The markup legitimately changed — <Picture> became
 * <img srcset>, a heading gained a wrapper, image URLs now point at Strapi. So
 * the comparison is on what the page SAYS: tags dropped, entities decoded,
 * whitespace collapsed. A difference here is a difference a reader would notice.
 *
 * ⚠ SCRIPT AND STYLE CONTENT IS REMOVED FIRST. Both carry text nodes that are
 * never rendered, and inlined CSS differs between builds for reasons that have
 * nothing to do with content.
 */
import { readFile, readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../../../web/dist');
const NL = String.fromCharCode(10);
const PROD = 'https://sunbeam-school-lemon.vercel.app';

/**
 * WARNING: PRODUCTION IS NOT THIS BRANCH ANY MORE.
 *
 * On 2026-09-01 origin/main advanced seventeen commits past 53aaf25 - the commit
 * this work is based on - and took the tree back to a flat, CMS-free Astro site.
 * Production builds from that. The two are cousins, not versions, so comparing
 * them whole will always differ, and a check that always fails reports nothing.
 *
 * baseline.json says which differences come from that split, which are ours and
 * deliberate, and - by exclusion - which are neither. Every entry names its cause;
 * nothing is waved through for having been there yesterday.
 */
const BASELINE = JSON.parse(
  readFileSync(new URL('./baseline.json', import.meta.url), 'utf8'),
);
const BASELINE_WORDS = new Set(BASELINE.baseline.flatMap((b) => b.words));
const MIGRATION_ROUTES = BASELINE.migration.flatMap((m) => m.routes);
/* Routes whose whole content differs because of the lineage split - a redirect
   stub's entire text is its notice, so a word list cannot express it. */
const BASELINE_ROUTES = new Set((BASELINE.baselineRoutes ?? []).flatMap((b) => b.routes));

/** Does this route match a recorded migration entry (`**` matches a subtree)? */
const isMigrationRoute = (route) => MIGRATION_ROUTES.some((pat) =>
  pat.endsWith('**') ? route.startsWith(pat.slice(0, -2)) : pat === route);

/** A word with its `×n` suffix removed, so counts do not defeat the match. */
const bare = (w) => w.replace(/×d+$/, '');

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  '#39': "'", '#8217': '’', '#8216': '‘', '#8220': '“',
  '#8221': '”', '#8211': '–', '#8212': '—', '#160': ' ',
};

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

/** Words present on one side and not the other — the readable form of a diff. */
function wordDelta(a, b) {
  const count = (s) => {
    const m = new Map();
    for (const w of s.split(' ')) m.set(w, (m.get(w) ?? 0) + 1);
    return m;
  };
  const [ca, cb] = [count(a), count(b)];
  const only = (x, y) => {
    const out = [];
    for (const [w, n] of x) {
      const d = n - (y.get(w) ?? 0);
      if (d > 0) out.push(d > 1 ? `${w}×${d}` : w);
    }
    return out;
  };
  return { missing: only(cb, ca), extra: only(ca, cb) };
}

async function routes() {
  const found = [];
  const walk = async (dir, base = '') => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) await walk(join(dir, e.name), `${base}/${e.name}`);
      else if (e.name === 'index.html') found.push(`${base}/`);
    }
  };
  await walk(DIST);
  return found.sort();
}

const argv = process.argv.slice(2);
const list = argv.includes('--all') ? await routes() : argv.filter((a) => a.startsWith('/'));
if (list.length === 0) {
  console.error('  Give one or more routes, or --all');
  process.exit(1);
}

let same = 0;
const differing = [];

for (const route of list) {
  const file = join(DIST, route === '/' ? 'index.html' : join(route, 'index.html'));

  let local;
  try { local = textOf(await readFile(file, 'utf8')); }
  catch { differing.push({ route, note: 'not built locally' }); continue; }

  let remote;
  try {
    const res = await fetch(`${PROD}${route}`);
    if (!res.ok) { differing.push({ route, note: `production ${res.status}` }); continue; }
    remote = textOf(await res.text());
  } catch (err) {
    differing.push({ route, note: `fetch failed — ${err.message}` });
    continue;
  }

  if (local === remote) { same++; continue; }
  differing.push({ route, ...wordDelta(local, remote) });
}

/**
 * Three buckets, because "different" is not one thing:
 *   baseline  - production is on the other lineage; not ours
 *   migration - we changed this deliberately, and baseline.json says where
 *   regression - neither. Must be zero.
 */
const baselineOnly = [];
const migration = [];
const regressions = [];

for (const d of differing) {
  /* ⚠ ORDER MATTERS. A "production 404" on a page THIS branch created is the
     expected answer, not a fault - production cannot have a page we have not
     pushed. Checking the note first filed every new page as a regression. */
  if (isMigrationRoute(d.route)) { migration.push(d); continue; }
  if (BASELINE_ROUTES.has(d.route)) { baselineOnly.push(d); continue; }
  if (d.note) { regressions.push(d); continue; }
  const words = [...(d.missing ?? []), ...(d.extra ?? [])].map(bare);
  if (words.length && words.every((w) => BASELINE_WORDS.has(w))) { baselineOnly.push(d); continue; }
  regressions.push(d);
}

const show = (d) => {
  console.log(`    ${d.route}`);
  if (d.note) { console.log(`      ${d.note}`); return; }
  if (d.missing?.length) console.log(`      lost:  ${d.missing.slice(0, 24).join(' ')}${d.missing.length > 24 ? ` …+${d.missing.length - 24}` : ''}`);
  if (d.extra?.length) console.log(`      new:   ${d.extra.slice(0, 24).join(' ')}${d.extra.length > 24 ? ` …+${d.extra.length - 24}` : ''}`);
};

console.log(`${NL}  AGAINST PRODUCTION  (${BASELINE.productionBranch} @ ${BASELINE.productionCommitAtLastCheck}; this branch is based on ${BASELINE.baselineCommit})${NL}`);
console.log(`    identical            ${same}/${list.length}`);
console.log(`    baseline difference  ${baselineOnly.length}   (production is on the other lineage)`);
console.log(`    our migration        ${migration.length}   (recorded in baseline.json)`);
console.log(`    UNEXPLAINED          ${regressions.length}`);

if (migration.length && process.argv.includes('--verbose')) {
  console.log(`${NL}  our migration${NL}`);
  for (const d of migration) show(d);
}

if (regressions.length) {
  console.log(`${NL}  ✗ UNEXPLAINED — neither a baseline difference nor a recorded change${NL}`);
  for (const d of regressions) show(d);
} else {
  console.log(`${NL}  ✔ every difference is either the lineage split or a recorded migration change`);
}
console.log('');
process.exit(regressions.length ? 1 : 0);