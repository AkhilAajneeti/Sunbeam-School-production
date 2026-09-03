/**
 * COMPARE TWO DATABASES, TABLE BY TABLE.
 *
 *     node scripts/verify/compare-db.mjs sunbeam sunbeam_rehearsal
 *
 * ═══ WHY THIS IS THE HEART OF A RESTORE REHEARSAL ══════════════════════════
 *
 * "The restore ran without errors" is not the same claim as "the data is there".
 * pg_restore reports errors it could not ignore; it says nothing about a table
 * that came back with 3 rows instead of 74, or one that was in the source and is
 * simply absent from the copy.
 *
 * So this counts every table on both sides and diffs the counts. It reads the
 * databases directly rather than through Strapi, deliberately: Strapi can only
 * be pointed at one database at a time, and booting it against the copy is a
 * separate step of the rehearsal — one that must not be the thing that decides
 * whether the copy is good.
 */
import { execFileSync } from 'node:child_process';

const CONTAINER = process.env.PG_CONTAINER ?? 'sunbeam-postgres';
const USER = process.env.DATABASE_USERNAME ?? 'sunbeam';

const [source, target] = process.argv.slice(2);
if (!source || !target) {
  console.error('\n  Usage: compare-db.mjs <source-db> <target-db>\n');
  process.exit(1);
}

function psql(db, sql) {
  return execFileSync(
    'docker',
    ['exec', CONTAINER, 'psql', '-U', USER, '-d', db, '-tAc', sql],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim();
}

/**
 * ⚠ COUNTED WITH count(*), NOT n_live_tup. The planner statistic is an estimate
 * that a freshly restored database has not gathered yet — it reads 0 for tables
 * that are full, which in a rehearsal is the most misleading possible answer.
 */
function counts(db) {
  const tables = psql(db, `
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `).split('\n').map((s) => s.trim()).filter(Boolean);

  const out = new Map();
  for (const t of tables) out.set(t, Number(psql(db, `select count(*) from "${t}"`)));
  return out;
}

const a = counts(source);
const b = counts(target);

const names = [...new Set([...a.keys(), ...b.keys()])].sort();
const missing = [];
const extra = [];
const differing = [];
let identical = 0;
let rowsSource = 0;
let rowsTarget = 0;

for (const t of names) {
  const x = a.get(t);
  const y = b.get(t);
  rowsSource += x ?? 0;
  rowsTarget += y ?? 0;

  if (x === undefined) { extra.push(`${t} (${y} rows)`); continue; }
  if (y === undefined) { missing.push(`${t} (${x} rows)`); continue; }
  if (x !== y) { differing.push({ t, x, y }); continue; }
  identical++;
}

console.log(`\n  ${source}  →  ${target}\n`);
console.log(`    tables            ${a.size} source · ${b.size} restored`);
console.log(`    identical counts  ${identical}/${names.length}`);
console.log(`    total rows        ${rowsSource} source · ${rowsTarget} restored\n`);

if (missing.length) {
  console.log('  ✖ TABLES MISSING FROM THE RESTORE\n');
  for (const m of missing) console.log(`      ${m}`);
  console.log('');
}
if (extra.length) {
  console.log('  ⚠ TABLES ONLY IN THE RESTORE\n');
  for (const e of extra) console.log(`      ${e}`);
  console.log('');
}
if (differing.length) {
  console.log('  ✖ ROW COUNTS THAT DIFFER\n');
  for (const d of differing) console.log(`      ${d.t.padEnd(40)} ${String(d.x).padStart(6)} → ${String(d.y).padStart(6)}`);
  console.log('');
}

const ok = !missing.length && !differing.length;
console.log(ok ? '  ✔ every table restored with the same number of rows\n' : '  ✖ RESTORE IS NOT FAITHFUL\n');
process.exit(ok ? 0 : 1);
