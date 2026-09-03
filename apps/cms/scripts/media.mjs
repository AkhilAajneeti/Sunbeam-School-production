/**
 * MEDIA BACKUP AND RESTORE.
 *
 *     npm run media:backup                    → backups/uploads-<utc>.tar.gz
 *     npm run media:list
 *     npm run media:restore -- <file> --yes   [--into <dir>]
 *
 * ═══ WHY THIS IS SEPARATE FROM db.mjs, AND WHY BOTH ARE REQUIRED ═══════════
 *
 * ⚠⚠ THE DATABASE DUMP DOES NOT CONTAIN THE IMAGES. Strapi's local upload
 * provider writes the files to `public/uploads` and stores only a ROW per file —
 * name, hash, mime, dimensions, url. So `pg_restore` brings back every file
 * *record* and not one file. Restore a database onto a machine without that
 * directory and the CMS looks perfect while every image on the site 404s.
 *
 * That gap was found during the 2026-08-27 restore rehearsal (docs/11), where it
 * did not bite only because the rehearsal ran on the same machine the uploads
 * were already sitting on. It is 351 MB and 4,172 files here, git-ignored, and
 * it was the least-protected thing in the project.
 *
 * ⚠ A RECOVERY IS BOTH HALVES, IN THIS ORDER: restore the uploads, then the
 * database. The other way round leaves a window where the CMS serves records
 * pointing at files that are not there yet.
 *
 * ⚠ THE ARCHIVE IS BUILT INSIDE THE CONTAINER-FREE HOST FILESYSTEM, with tar
 * rather than a zip, because the tree is deep and the names contain spaces and
 * non-ASCII characters that this project's photographs came with.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BACKUPS = resolve(HERE, '../../../backups');
const UPLOADS = resolve(HERE, '../public/uploads');

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};

function run(cmdName, args, opts = {}) {
  return new Promise((ok, fail) => {
    const p = spawn(cmdName, args, { stdio: 'inherit', ...opts });
    p.on('close', (code) => (code === 0 ? ok() : fail(new Error(`${cmdName} exited ${code}`))));
    p.on('error', fail);
  });
}

/** Every file under a directory, recursively — the only honest way to count. */
function countFiles(dir) {
  let n = 0;
  let bytes = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name);
      if (e.isDirectory()) walk(f);
      else { n++; bytes += statSync(f).size; }
    }
  };
  if (existsSync(dir)) walk(dir);
  return { n, bytes };
}

const mb = (b) => `${(b / 1024 / 1024).toFixed(0)} MB`;

/**
 * ⚠ FORWARD SLASHES FOR tar, ALWAYS. Even with --force-local, GNU tar under Git
 * Bash mishandles a Windows path written with backslashes — `-C C:Users…`
 * fails where `-C C:/Users/…` succeeds, with the same unhelpful "exited 2".
 * node's resolve() returns backslashes on this platform, so every path handed
 * to tar goes through here.
 */
const forTar = (p) => p.replace(/\\/g, '/');

async function backup() {
  if (!existsSync(UPLOADS)) throw new Error(`No uploads directory at ${UPLOADS}`);
  const { n, bytes } = countFiles(UPLOADS);
  if (n === 0) {
    throw new Error('public/uploads is empty — refusing to write an archive that would look like a backup of nothing.');
  }

  mkdirSync(BACKUPS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const file = join(BACKUPS, `uploads-${stamp}.tar.gz`);

  /* -C the parent so the archive contains `uploads/…` and can be unpacked
     anywhere without carrying an absolute path with it. */
  /* ⚠ --force-local. GNU tar (which Git Bash provides on Windows) reads
     "C:/…" as host:path and tries to open a network connection — "Cannot
     connect to C: resolve failed". The flag tells it every path is a local
     one, which on this platform is always true. */
  await run('tar', ['--force-local', '-czf', forTar(file), '-C', forTar(dirname(UPLOADS)), basename(UPLOADS)]);

  const size = statSync(file).size;
  console.log(`\n  ✔ ${basename(file)}  (${mb(size)} archived from ${n} files, ${mb(bytes)})\n`);
  return file;
}

function list() {
  if (!existsSync(BACKUPS)) return console.log('\n  no backups yet\n');
  const files = readdirSync(BACKUPS).filter((f) => f.startsWith('uploads-')).sort().reverse();
  if (!files.length) return console.log('\n  no media backups yet\n');
  console.log('');
  for (const f of files) {
    const s = statSync(join(BACKUPS, f));
    console.log(`  ${f}  ${mb(s.size).padStart(8)}   ${s.mtime.toISOString()}`);
  }
  console.log('');
}

async function restore() {
  const file = rest.find((a) => !a.startsWith('--') && a !== flag('into'));
  if (!file) throw new Error('Usage: npm run media:restore -- <file> --yes [--into <dir>]');
  const abs = resolve(file.includes('/') || file.includes('\\') ? file : join(BACKUPS, file));
  if (!existsSync(abs)) throw new Error(`No such archive: ${abs}`);

  /* Unpacking writes `uploads/` INTO the target, so the target is the parent. */
  const target = flag('into') ? resolve(flag('into')) : dirname(UPLOADS);

  if (!rest.includes('--yes')) {
    console.log(`\n  This unpacks ${basename(abs)} into "${target}",`);
    console.log('  overwriting files of the same name.');
    console.log('  Re-run with --yes if that is what you want.\n');
    process.exit(1);
  }

  mkdirSync(target, { recursive: true });
  await run('tar', ['--force-local', '-xzf', forTar(abs), '-C', forTar(target)]);

  const { n, bytes } = countFiles(join(target, 'uploads'));
  console.log(`\n  ✔ restored ${n} files (${mb(bytes)}) into ${join(target, 'uploads')}\n`);
}

try {
  if (cmd === 'backup') await backup();
  else if (cmd === 'list') list();
  else if (cmd === 'restore') await restore();
  else {
    console.log('\n  usage: media.mjs backup | list | restore -- <file> --yes [--into <dir>]\n');
    process.exit(1);
  }
} catch (err) {
  console.error(`\n  ✖ ${err.message}\n`);
  process.exit(1);
}
