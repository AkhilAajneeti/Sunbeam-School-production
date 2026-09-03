/**
 * BOOT STRAPI INSIDE A SCRIPT.
 *
 * ⚠ SEEDING GOES THROUGH THE DOCUMENT SERVICE, NOT THROUGH HTTP. Loading the
 * application in-process means no API token, no network hop, no server needing
 * to be running, and lifecycle hooks and validation still fire exactly as they
 * would in the admin. A seed that posts to /api/... would need a full-access
 * token stored somewhere, which is a credential this project does not need to
 * create in order to move its own data.
 *
 * ⚠ THE PROCESS MUST BE DESTROYED EXPLICITLY. A loaded Strapi holds the
 * Postgres pool open and node will never exit on its own.
 *
 * ⚠ REQUIRED, NOT IMPORTED — AND THAT IS NOT A STYLE CHOICE. Strapi 5.52's
 * ESM build contains a bare directory import (`lodash/fp`), which Node's ESM
 * resolver rejects outright:
 *
 *     ERR_UNSUPPORTED_DIR_IMPORT ... Did you mean to import "lodash/fp.js"?
 *
 * The CommonJS build resolves the same specifier without complaint, so the
 * loader below reaches for it deliberately. Changing this back to a top-level
 * `import` breaks every seed script in this directory.
 */
import { createRequire } from 'node:module';
import { connect } from 'node:net';

const require = createRequire(import.meta.url);
const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * ⚠⚠ REFUSE TO BOOT IF A STRAPI IS ALREADY RUNNING.
 *
 * Every seed, extractor and verifier here boots its OWN Strapi in-process, which
 * means running one while `npm run develop` is up puts two instances against a
 * single database. That is not a theoretical hazard: it emptied every
 * content-type table on 2026-08-27 (docs/09). `compileStrapi()` writes to
 * `dist/` and regenerates `types/generated/` — underneath a live instance that
 * is reading them — and Strapi reconciles the schema against whatever it can see
 * when it finishes booting.
 *
 * The preflight guard cannot cover this: it runs on `predevelop`/`prestart`, and
 * a seed is neither. So the check lives here, where every script goes through.
 *
 * ⚠ NOT A LOCK, AND NOT A SUBSTITUTE FOR THE RULE. It sees a bound port, so it
 * cannot catch an instance still booting. One Strapi at a time, always.
 */
async function refuseIfStrapiIsRunning() {
  const port = Number(process.env.PORT ?? 1337);
  const busy = await new Promise((done) => {
    const sock = connect({ port, host: '127.0.0.1' });
    const finish = (v) => { sock.destroy(); done(v); };
    sock.setTimeout(1500);
    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error', () => finish(false));
  });
  if (!busy) return;

  console.error(`\n  ✖ Refusing to run — something is already serving port ${port}.\n`);
  console.error('    This script boots its own Strapi, and two instances against one');
  console.error('    database is what emptied every content-type table on 2026-08-27.');
  console.error('    See docs/09-cms-data-loss-and-db-safety.md.\n');
  console.error('    Stop it first. `strapi develop` is TWO node processes — killing the');
  console.error('    npm wrapper leaves the server holding the port:\n');
  console.error('      Get-CimInstance Win32_Process -Filter "Name=\'node.exe\'" |');
  console.error('        Where-Object { $_.CommandLine -match \'strapi\' } |');
  console.error('        ForEach-Object { Stop-Process -Id $_.ProcessId -Force }\n');
  process.exit(1);
}

/** @returns {Promise<object>} a loaded Strapi instance */
export async function bootStrapi() {
  await refuseIfStrapiIsRunning();
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  // Scripts are noisy enough without request logging.
  app.log.level = process.env.SEED_LOG_LEVEL ?? 'warn';

  return app;
}

/**
 * Run a function with a booted Strapi and always shut down afterwards.
 * @param {(strapi: object) => Promise<void>} fn
 */
export async function withStrapi(fn) {
  const strapi = await bootStrapi();
  let failed = false;

  try {
    await fn(strapi);
  } catch (err) {
    failed = true;
    console.error('\n  Seed failed:', err?.message ?? err, '\n');
    /* ⚠ YUP HIDES THE USEFUL PART. A Strapi validation failure reports "4 errors
       occurred" and puts the field paths and messages in `details.errors`, which
       neither the message nor the stack shows. Printing them turns a dead end
       into a fix. */
    for (const e of err?.details?.errors ?? []) {
      console.error(`    · ${(e.path ?? []).join('.')} — ${e.message}`);
    }
    if (process.env.SEED_TRACE) console.error(err);
  }

  /* ⚠ SHUTDOWN EMITS AN *UNHANDLED* REJECTION, WHICH try/catch CANNOT SEE.
     knex's pool (tarn) aborts every connection still pending when it closes and
     rejects each one with `Error: aborted`. Those rejections belong to promises
     inside the pool, not to the one destroy() returns — so wrapping the await
     changes nothing and the script still dies on a stack trace after having
     committed every row successfully.
     The guard below drops exactly that error and nothing else: anything with a
     different message is re-thrown so a genuine fault still surfaces. A real
     failure from the seed itself is caught above and decides the exit code. */
  process.on('unhandledRejection', (err) => {
    if (err instanceof Error && err.message === 'aborted') return;
    throw err;
  });

  try {
    await strapi.destroy();
  } catch {
    /* teardown noise only */
  }

  process.exit(failed ? 1 : 0);
}

export default withStrapi;
