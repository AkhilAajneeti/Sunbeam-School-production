/**
 * STOP EVERY STRAPI PROCESS AND RELEASE THE DEVELOPMENT LOCK.
 *
 *     npm run stop
 *
 * ⚠ THIS EXISTS BECAUSE "STOP STRAPI" IS NOT ONE ACTION. `strapi develop` runs
 * a supervisor and a server; Ctrl-C in the right terminal ends both, but a
 * killed npm wrapper, a closed terminal or a stopped background task leaves the
 * server alive and holding port 1337. That orphan is what allowed a second
 * instance to start alongside it on 2026-08-27 and cost the database (docs/09).
 *
 * So this does not trust the lock file: it finds every node process whose
 * command line mentions strapi and ends it, then reports whether the port
 * actually came free. Anything less is a stop you have to verify by hand, and
 * therefore one that sometimes is not verified.
 */
import { spawnSync } from 'node:child_process';
import { connect } from 'node:net';
import { rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCK = resolve(HERE, '../.strapi-develop.lock');
const PORT = Number(process.env.PORT ?? 1337);

function strapiPids() {
  if (process.platform === 'win32') {
    const ps = spawnSync('powershell', ['-NoProfile', '-Command',
      "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | " +
      "Where-Object { $_.CommandLine -match 'strapi' } | " +
      'ForEach-Object { $_.ProcessId }',
    ], { encoding: 'utf8' });
    return (ps.stdout ?? '').split(/\s+/).map(Number).filter((n) => n && n !== process.pid);
  }
  const ps = spawnSync('pgrep', ['-f', 'strapi'], { encoding: 'utf8' });
  return (ps.stdout ?? '').split(/\s+/).map(Number).filter((n) => n && n !== process.pid);
}

const portFree = () => new Promise((done) => {
  const sock = connect({ port: PORT, host: '127.0.0.1' });
  const finish = (v) => { sock.destroy(); done(v); };
  sock.setTimeout(1500);
  sock.once('connect', () => finish(false));
  sock.once('timeout', () => finish(true));
  sock.once('error', () => finish(true));
});

const pids = strapiPids();
if (pids.length === 0) console.log('\n  no strapi processes running');
else {
  console.log(`\n  stopping ${pids.length} strapi process(es): ${pids.join(', ')}`);
  for (const pid of pids) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
    else { try { process.kill(pid, 'SIGKILL'); } catch { /* already gone */ } }
  }
}

if (existsSync(LOCK)) { rmSync(LOCK, { force: true }); console.log('  released the development lock'); }

/* Give the OS a moment to release the socket before reporting. */
await new Promise((r) => setTimeout(r, 2000));
const free = await portFree();
console.log(free ? `  ✔ port ${PORT} is free\n` : `  ✖ port ${PORT} is STILL in use — something else is holding it\n`);
process.exit(free ? 0 : 1);
