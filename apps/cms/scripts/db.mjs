/**
 * DATABASE BACKUP AND RESTORE.
 *
 *     npm run db:backup              → backups/sunbeam-<utc>.dump
 *     npm run db:restore -- <file>   → restores it (asks for --yes)
 *     npm run db:list                → what is in backups/
 *
 * ═══ WHY THIS EXISTS, AND WHY THE SEEDS ARE NOT A SUBSTITUTE ═══════════════
 *
 * The G3 incident wiped every migrated table and the seeds put it all back —
 * which was only possible because, at that moment, the source of truth was
 * still a set of .ts files in the repository.
 *
 * ⚠ THAT STOPS BEING TRUE THE DAY THE SCHOOL PUBLISHES ANYTHING. A notice
 * written in the admin exists in exactly one place. `npm run seed` would not
 * restore it; it would restore the repository's idea of the content and silently
 * discard the school's. From go-live, this file is the recovery path and the
 * seeds are a one-way import.
 *
 * ⚠ THE FORMAT IS CUSTOM, NOT PLAIN SQL. pg_restore can then be selective —
 * one table, or schema-only — which is what you want at 9am with a page
 * mangled and the rest of the site fine.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, statSync, createWriteStream, createReadStream, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BACKUPS = resolve(HERE, '../../../backups');
const CONTAINER = process.env.PG_CONTAINER ?? 'sunbeam-postgres';
const DB = process.env.DATABASE_NAME ?? 'sunbeam';
const USER = process.env.DATABASE_USERNAME ?? 'sunbeam';

const [cmd, ...rest] = process.argv.slice(2);

/**
 * Run a docker command, streaming stdout to `out` and stdin from `input`.
 *
 * ⚠⚠ `input` EXISTS BECAUSE THE RESTORE PATH DID NOT WORK.
 *
 * `docker exec -i … pg_restore` reads the dump from STDIN, and nothing was
 * being written to it — stdin was `'ignore'`, so pg_restore read end-of-file
 * immediately and reported "input file is too short (read 0, expected 5)".
 *
 * The backup half had always worked, which is what made it dangerous: six
 * dumps sat in backups/ looking like a safety net, and the first time one was
 * needed it could not be put back. A backup you have never restored is a
 * hypothesis, not a backup — which is exactly why a restore rehearsal is on
 * the pre-production list rather than something to find out during an
 * incident. Found during one.
 */
function run(args, out, input) {
  return new Promise((ok, fail) => {
    const p = spawn('docker', args, {
      stdio: [input ? 'pipe' : 'ignore', out ? 'pipe' : 'inherit', 'inherit'],
    });
    if (out) p.stdout.pipe(out);
    if (input) input.pipe(p.stdin);
    p.on('close', (code) => (code === 0 ? ok() : fail(new Error(`docker exited ${code}`))));
    p.on('error', fail);
  });
}

async function backup() {
  mkdirSync(BACKUPS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const file = join(BACKUPS, `sunbeam-${stamp}.dump`);

  await run(
    ['exec', CONTAINER, 'pg_dump', '-U', USER, '-d', DB, '--format=custom'],
    createWriteStream(file),
  );

  const size = statSync(file).size;
  if (size < 10_000) {
    throw new Error(`Backup is only ${size} bytes — that is not a real dump. Aborting rather than leaving a false safety net.`);
  }
  console.log(`\n  ✔ ${basename(file)}  (${(size / 1024).toFixed(0)} KB)\n`);
  return file;
}

function list() {
  if (!existsSync(BACKUPS)) return console.log('\n  no backups yet\n');
  const files = readdirSync(BACKUPS).filter((f) => f.endsWith('.dump')).sort().reverse();
  if (!files.length) return console.log('\n  no backups yet\n');
  console.log('');
  for (const f of files) {
    const s = statSync(join(BACKUPS, f));
    console.log(`  ${f}  ${(s.size / 1024).toFixed(0).padStart(6)} KB   ${s.mtime.toISOString()}`);
  }
  console.log('');
}

/**
 * Read a `--flag value` pair out of the argument list.
 *
 * ⚠ `--into` EXISTS SO A RESTORE CAN BE REHEARSED WITHOUT RISKING THE REAL
 * DATABASE. A recovery procedure you can only try by overwriting production is
 * one nobody tries, which is precisely how this project ended up with six dumps
 * and a restore path that had never worked. With `--into` the rehearsal is
 * boring: restore into a disposable database, check it, drop it.
 */
function flag(name) {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
}

/** Create an empty database, dropping any previous one of the same name. */
async function create() {
  const name = flag('name') ?? rest.find((a) => !a.startsWith('--'));
  if (!name) throw new Error('Usage: node scripts/db.mjs create --name <database>');
  if (name === DB) throw new Error(`Refusing to recreate "${DB}" — that is the live database.`);
  if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error(`Not a safe database name: ${name}`);

  await run(['exec', CONTAINER, 'psql', '-U', USER, '-d', 'postgres', '-c',
    `drop database if exists ${name}`]);
  await run(['exec', CONTAINER, 'psql', '-U', USER, '-d', 'postgres', '-c',
    `create database ${name} owner ${USER}`]);
  console.log(`\n  ✔ created empty database "${name}"\n`);
}

/** Drop a disposable database. Never the live one. */
async function drop() {
  const name = flag('name') ?? rest.find((a) => !a.startsWith('--'));
  if (!name) throw new Error('Usage: node scripts/db.mjs drop --name <database>');
  if (name === DB) throw new Error(`Refusing to drop "${DB}" — that is the live database.`);
  if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error(`Not a safe database name: ${name}`);

  await run(['exec', CONTAINER, 'psql', '-U', USER, '-d', 'postgres', '-c',
    `drop database if exists ${name}`]);
  console.log(`\n  ✔ dropped "${name}"\n`);
}

async function restore() {
  const file = rest.find((a) => !a.startsWith('--') && a !== flag('into'));
  if (!file) throw new Error('Usage: npm run db:restore -- <file> --yes [--into <database>]');
  const abs = resolve(file.includes('/') || file.includes('\\') ? file : join(BACKUPS, file));
  if (!existsSync(abs)) throw new Error(`No such backup: ${abs}`);

  const target = flag('into') ?? DB;

  if (!rest.includes('--yes')) {
    console.log(`\n  This REPLACES the contents of "${target}" with ${basename(abs)}.`);
    console.log('  Re-run with --yes if that is what you want.\n');
    process.exit(1);
  }

  /* --clean --if-exists so a restore over a live database replaces rather than
     collides; the alternative is dozens of "already exists" errors and a
     half-restored database, which is worse than either outcome. */
  const size = statSync(abs).size;
  if (size < 10_000) {
    throw new Error(`${basename(abs)} is only ${size} bytes — refusing to restore from a file that cannot be a real dump.`);
  }

  await run(
    [
      'exec', '-i', CONTAINER, 'pg_restore', '-U', USER, '-d', target,
      '--clean', '--if-exists', '--no-owner', '--no-privileges',
    ],
    undefined,
    createReadStream(abs),
  );

  console.log(`\n  restored ${basename(abs)} (${(size / 1024).toFixed(0)} KB) into "${target}"`);
  console.log('  restart Strapi before using the admin\n');
}

try {
  if (cmd === 'backup') await backup();
  else if (cmd === 'list') list();
  else if (cmd === 'restore') await restore();
  else if (cmd === 'create') await create();
  else if (cmd === 'drop') await drop();
  else {
    console.log('\n  usage: db.mjs backup | list | create --name <db> | drop --name <db>');
    console.log('         db.mjs restore -- <file> --yes [--into <db>]\n');
    process.exit(1);
  }
} catch (err) {
  console.error(`\n  ✖ ${err.message}\n`);
  process.exit(1);
}
