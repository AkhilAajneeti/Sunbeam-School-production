/**
 * START STRAPI IN DEVELOPMENT — EXACTLY ONE AT A TIME.
 *
 *     npm run develop        (this)
 *     npm run stop           release the lock and kill the tree
 *
 * ═══ WHY `strapi develop` IS NOT CALLED DIRECTLY ANY MORE ══════════════════
 *
 * On 2026-08-27 two `strapi develop` processes were started seconds apart. The
 * second lost the race for port 1337 and exited — but not before it had cleaned
 * `dist/` and regenerated `types/generated/` underneath the first, which then
 * finished booting, saw no content types, and dropped every content-type table
 * in the database. Full account in docs/09.
 *
 * The preflight port check catches the ordinary case. It cannot catch this one:
 * Strapi does its destructive setup work BEFORE it binds the port, so during the
 * ~15 seconds of a boot there is nothing listening for a second start to find.
 *
 * ⚠ SO THE LOCK IS TAKEN BEFORE ANYTHING IS COMPILED, and it names the process
 * that holds it. A second start reads the file, checks whether that process is
 * still alive, and refuses — with the pid, so there is something to act on.
 *
 * ⚠ A STALE LOCK IS NOT AN OBSTACLE. If the recorded processes are gone the file
 * is a leftover from a hard kill; it is reported, removed, and startup
 * continues. A lock that outlives its owner is a lock people learn to delete
 * without reading, which is worse than no lock at all.
 *
 * ⚠ THE CHILD IS KILLED WITH ITS TREE. `strapi develop` spawns a second node
 * process that does the serving, and killing only the parent leaves that one
 * holding port 1337 — the orphan that caused the overlap in the first place.
 */
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK = resolve(HERE, '../.strapi-develop.lock');

const alive = (pid) => {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch (err) { return err.code === 'EPERM'; }
};

/* ── refuse, or clear a stale lock ───────────────────────────────────────── */
if (existsSync(LOCK)) {
  let held = null;
  try { held = JSON.parse(readFileSync(LOCK, 'utf8')); } catch { /* unreadable = stale */ }

  const owners = [held?.pid, held?.childPid].filter(alive);

  if (owners.length > 0) {
    console.error('\n  ✖ Strapi is already running in development.\n');
    console.error(`    lock      ${LOCK}`);
    console.error(`    started   ${held?.started ?? 'unknown'}`);
    console.error(`    database  ${held?.database ?? 'unknown'}`);
    console.error(`    pids      ${owners.join(', ')}\n`);
    console.error('    Two Strapi instances against one database empties every');
    console.error('    content-type table — see docs/09. Stop the running one first:\n');
    console.error('      npm run stop\n');
    process.exit(1);
  }

  console.warn(`\n  ⚠ Clearing a stale lock (pid ${held?.pid ?? '?'} is gone).\n`);
  rmSync(LOCK, { force: true });
}

const database = process.env.DATABASE_NAME ?? '(from .env)';
writeFileSync(LOCK, JSON.stringify({
  pid: process.pid,
  childPid: null,
  started: new Date().toISOString(),
  database,
}, null, 2));

/* ── run strapi develop, and own its lifetime ────────────────────────────── */
const bin = resolve(HERE, '../node_modules/@strapi/strapi/bin/strapi.js');
const child = spawn(process.execPath, [bin, 'develop'], { stdio: 'inherit' });

writeFileSync(LOCK, JSON.stringify({
  pid: process.pid,
  childPid: child.pid,
  started: new Date().toISOString(),
  database,
}, null, 2));

let releasing = false;
function release(code) {
  if (releasing) return;
  releasing = true;
  rmSync(LOCK, { force: true });

  /* Kill the tree, not just the child — see the header note about orphans. */
  if (child.pid && alive(child.pid)) {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      try { process.kill(-child.pid, 'SIGKILL'); } catch { /* already gone */ }
    }
  }
  process.exit(code ?? 0);
}

child.on('exit', (code) => release(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
  process.on(sig, () => release(0));
}
process.on('exit', () => { if (!releasing) rmSync(LOCK, { force: true }); });
