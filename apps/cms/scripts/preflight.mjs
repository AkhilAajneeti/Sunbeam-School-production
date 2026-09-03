/**
 * PREFLIGHT — refuse to start Strapi if a content type has gone missing.
 *
 * Runs automatically before `npm run develop` and `npm run start`.
 * Override for a deliberate deletion with:  ALLOW_CONTENT_TYPE_DROP=1
 *
 * ═══ THE FAILURE THIS EXISTS TO STOP ═══════════════════════════════════════
 *
 * Strapi reconciles the database against the content types it can see at boot,
 * and a content type it CANNOT see is treated as deleted: its table is dropped,
 * with every row in it, silently and without confirmation.
 *
 * That was reproduced deliberately on 2026-08-27. A throwaway content type was
 * created, a sentinel row inserted, the content-type directory removed, and
 * Strapi restarted — the table was gone. No prompt, no warning in the log, no
 * error. The same mechanism explains the G3 incident, where a rename done as
 * `rm -rf site-setting && mv site-settings site-setting` removed a content type
 * directory and a sequence of failed boots followed.
 *
 * The dangerous property is that this is indistinguishable from an ordinary
 * mistake: a bad merge, a half-finished rename, a `git checkout` of one
 * directory, an incomplete deploy. Any of them silently destroys content.
 *
 * ⚠ THIS CHECKS FOR *DATA*, NOT MERELY FOR TABLES. An empty orphan table is
 * noise; an orphan table with 400 rows in it is the school's content about to
 * be deleted. Only the second stops the boot.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { connect } from 'node:net';

const HERE = dirname(fileURLToPath(import.meta.url));
const API_DIR = resolve(HERE, '../src/api');
const CONTAINER = process.env.PG_CONTAINER ?? 'sunbeam-postgres';
const DB = process.env.DATABASE_NAME ?? 'sunbeam';
const USER = process.env.DATABASE_USERNAME ?? 'sunbeam';

/** Every collectionName declared on disk. */
function schemasOnDisk() {
  const names = new Set();
  if (!existsSync(API_DIR)) return names;
  for (const api of readdirSync(API_DIR, { withFileTypes: true })) {
    if (!api.isDirectory()) continue;
    const ctDir = join(API_DIR, api.name, 'content-types');
    if (!existsSync(ctDir)) continue;
    for (const ct of readdirSync(ctDir, { withFileTypes: true })) {
      if (!ct.isDirectory()) continue;
      const f = join(ctDir, ct.name, 'schema.json');
      if (!existsSync(f)) continue;
      try {
        const j = JSON.parse(readFileSync(f, 'utf8'));
        if (j.collectionName) names.add(j.collectionName);
      } catch {
        /* A schema that will not parse is its own failure; Strapi reports it. */
      }
    }
  }
  return names;
}

function psql(sql) {
  try {
    return execFileSync('docker', ['exec', CONTAINER, 'psql', '-U', USER, '-d', DB, '-tAc', sql], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * ⚠⚠⚠ A SECOND INSTANCE IS THE THIRD WAY IN, AND IT COST THIS PROJECT THE
 * DATABASE A SECOND TIME — on 2026-08-27, during G6.
 *
 * Two `strapi develop` processes were started seconds apart. The second lost
 * the race for port 1337 and exited, but not before it had done the two things
 * that matter: it CLEANED dist/ and it REGENERATED types/generated/. The first
 * instance was still booting through that same directory. What came out was a
 * contentTypes.d.ts containing not one api:: type and a dist/ mid-rebuild —
 * and Strapi, seeing no content types, dropped every content-type table in the
 * database. 24 notices, 65 news items, 74 page-metas, everything.
 *
 * The component tables and the media library survived, which is what makes it
 * so easy to miss: the admin loads, the media library is full, and only a row
 * count says anything is wrong.
 *
 * ⚠ THIS IS NOT A LOCK. It is a check for a listener on the port, which is the
 * cheap and reliable signal. It cannot see an instance mid-boot that has not
 * bound yet — so the rule stands regardless: ONE Strapi at a time, and stop the
 * running one before starting or seeding.
 *
 * ⚠ `npm run develop` IS TWO NODE PROCESSES — a supervisor and the server it
 * spawns. Killing the npm wrapper leaves the server running and holding the
 * port; that orphan is what produced the overlap here. Kill the tree, or check
 * the port, before starting again.
 */
const PORT = Number(process.env.PORT ?? 1337);

/**
 * ⚠ A TCP CONNECT, NOT AN HTTP REQUEST. The first version asked
 * `GET /_health` and got nothing back — Strapi answers that route on HEAD — so
 * the guard reported "all clear" with Strapi plainly running. Whether the
 * server likes the request is beside the point; whether anything holds the port
 * is the whole question, and a socket answers it without knowing the protocol.
 */
function portInUse(port) {
  return new Promise((done) => {
    const sock = connect({ port, host: '127.0.0.1' });
    const finish = (v) => { sock.destroy(); done(v); };
    sock.setTimeout(1500);
    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error', () => finish(false));
  });
}

{
  if (await portInUse(PORT)) {
    console.error(`\n  ✖ PREFLIGHT FAILED — something is already serving port ${PORT}.\n`);
    console.error('    Starting a second Strapi against one database is how this project');
    console.error('    lost every content-type table on 2026-08-27. The second instance');
    console.error('    cleans dist/ and rewrites the generated types underneath the first,');
    console.error('    which then boots seeing no content types and drops their tables.\n');
    console.error('    Stop the running instance first. Note that `strapi develop` runs TWO');
    console.error('    node processes — killing the npm wrapper leaves the server alive:\n');
    console.error('      PowerShell:  Get-CimInstance Win32_Process -Filter "Name=\'node.exe\'" |');
    console.error('                     Where-Object { $_.CommandLine -match \'strapi\' } |');
    console.error('                     ForEach-Object { Stop-Process -Id $_.ProcessId -Force }\n');
    process.exit(1);
  }
}

/**
 * ⚠ EMPTY GENERATED TYPES ARE THE FINGERPRINT OF THE ABOVE.
 *
 * types/generated/contentTypes.d.ts is written at boot. Interrupt that — or let
 * a second instance write it while the first reads it — and it comes back with
 * the plugin types and none of the project's own. It is not itself the cause of
 * a drop, but it is the visible mark left by the thing that is, and it is
 * checked here because it costs nothing and it is unambiguous.
 */
const GENERATED = resolve(HERE, '../types/generated/contentTypes.d.ts');
if (existsSync(GENERATED)) {
  const generated = readFileSync(GENERATED, 'utf8');
  const apiTypes = (generated.match(/^export interface Api/gm) ?? []).length;
  if (apiTypes === 0) {
    console.error('\n  ✖ PREFLIGHT FAILED — the generated types contain no content types.\n');
    console.error(`    ${GENERATED}`);
    console.error('    has the plugin types and not one api:: type, which means type');
    console.error('    generation was interrupted — usually by a second Strapi instance.\n');
    console.error('    Make sure nothing else is running, then regenerate:\n');
    console.error('      npm run strapi -- ts:generate-types\n');
    console.error('    And check the database before trusting it:\n');
    console.error('      npm run verify:counts\n');
    process.exit(1);
  }
}

/**
 * ⚠⚠ A PARTIAL dist/ IS THE OTHER HALF OF THIS, AND IT IS THE QUIET ONE.
 *
 * Strapi loads compiled output from dist/. If a build is interrupted — an EPERM
 * cleaning the directory, a second instance holding it open, a killed process —
 * dist/ can end up with FEWER content types than src/. Two things then follow:
 *
 *   · the loud case: a route registers for a type Strapi cannot resolve, and the
 *     boot dies with "Cannot read properties of undefined (reading 'kind')".
 *     Nothing is lost, because it fails before schema sync.
 *   · the quiet case: the type is absent entirely, nothing errors, Strapi boots
 *     happily against fewer content types than the database has — and drops the
 *     rest. This is the most likely path the G3 data loss actually took.
 *
 * The schema check below cannot see it: src/ is complete in both cases. So the
 * comparison is made here, before anything touches the database.
 */
const DIST_API = resolve(HERE, '../dist/src/api');
if (existsSync(DIST_API)) {
  const srcApis = readdirSync(API_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name);
  const distApis = new Set(
    readdirSync(DIST_API, { withFileTypes: true })
      .filter((e) => e.isDirectory()).map((e) => e.name),
  );
  const missing = srcApis.filter((a) => !distApis.has(a));

  if (missing.length > 0) {
    console.error('\n  ✖ PREFLIGHT FAILED — dist/ is incomplete.\n');
    console.error('    These APIs exist in src/ but not in the compiled output:\n');
    for (const m of missing) console.error(`      ${m}`);
    console.error('\n    A half-compiled dist/ makes Strapi see fewer content types than');
    console.error('    the database has — which is how tables get dropped silently.\n');
    console.error('    Fix by rebuilding from clean:\n');
    console.error('      rm -rf dist && npm run develop\n');
    process.exit(1);
  }
}

/* No database reachable is not this script's problem — Strapi will say so far
   more clearly than a preflight guard can. */
const probe = psql('select 1');
if (probe === null) process.exit(0);

const onDisk = schemasOnDisk();
if (onDisk.size === 0) {
  console.error('\n  ✖ PREFLIGHT: no content-type schemas found on disk at all.');
  console.error('    Refusing to start — Strapi would treat EVERY table as deleted.\n');
  process.exit(1);
}

/* Candidate content-type tables: public, not Strapi/plugin internals, not the
   component or link side-tables Strapi manages alongside them. */
const rows = psql(`
  select table_name from information_schema.tables
  where table_schema = 'public'
    and table_type = 'BASE TABLE'
    and table_name not like 'strapi_%'
    and table_name not like 'admin_%'
    and table_name not like 'up_%'
    and table_name not like 'i18n_%'
    and table_name not like 'components_%'
    and table_name not like '%_cmps'
    and table_name not like '%_lnk'
    /* ⚠ AND '%_mph'. files_related_mph is the upload plugin's POLYMORPHIC join
       between media and whatever references it — 764 rows here — and it does not
       end in _lnk like every other join table. The first version of this guard
       flagged it on a perfectly healthy tree, which is how a safety check earns
       the reputation that gets it switched off. */
    and table_name not like '%_mph'
    and table_name not in ('files','upload_folders')
  order by table_name;
`);

const tables = (rows ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
const orphans = tables.filter((t) => !onDisk.has(t));

const withData = [];
for (const t of orphans) {
  const n = Number(psql(`select count(*) from "${t}"`) ?? '0');
  if (n > 0) withData.push({ table: t, rows: n });
}

if (withData.length === 0) process.exit(0);

if (process.env.ALLOW_CONTENT_TYPE_DROP === '1') {
  console.warn('\n  ⚠ PREFLIGHT: proceeding with ALLOW_CONTENT_TYPE_DROP=1.');
  for (const o of withData) console.warn(`      ${o.table} (${o.rows} rows) will be DROPPED by Strapi.`);
  console.warn('');
  process.exit(0);
}

console.error('\n  ✖ PREFLIGHT FAILED — refusing to start Strapi.\n');
console.error('    These tables hold data but have no content type on disk.');
console.error('    Starting Strapi now would DROP them, rows included:\n');
for (const o of withData) console.error(`      ${o.table.padEnd(34)} ${String(o.rows).padStart(6)} rows`);
console.error('\n    Most likely one of:');
console.error('      · a rename that removed the old directory  (this caused the G3 incident)');
console.error('      · an incomplete checkout, merge or deploy');
console.error('      · a content type deleted on another branch\n');
console.error('    If the deletion is DELIBERATE — back up first, then:');
console.error('      npm run db:backup');
console.error('      ALLOW_CONTENT_TYPE_DROP=1 npm run develop\n');
process.exit(1);
