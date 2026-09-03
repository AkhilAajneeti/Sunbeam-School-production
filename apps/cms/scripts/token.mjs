/**
 * MINT THE READ-ONLY API TOKEN THE ASTRO BUILD USES.
 *
 *     npm run token:read-only
 *
 * ═══ WHY THIS SCRIPT EXISTS ════════════════════════════════════════════════
 *
 * Strapi stores an API token's access key HASHED (128 hex characters, salted
 * with API_TOKEN_SALT). The plaintext is shown exactly once, in the admin, at
 * the moment of creation — after that it is unrecoverable, by anyone, including
 * from the database. A token whose value was not written down is not a token
 * you can look up; it is a token you replace.
 *
 * So rather than asking someone to hunt for a value that may no longer exist,
 * this mints a fresh one under a known name and prints it once. Re-running it
 * REGENERATES the same named token: the old key stops working immediately and a
 * new one is printed. That is the intended way to rotate it.
 *
 * ⚠ read-only IS A REAL BOUNDARY, NOT A LABEL. A token of this type can call
 * find and findOne and nothing else. Even if the value leaks, it cannot create,
 * update, delete, or reach the admin API. The build never needs more than this.
 *
 * ⚠ THE VALUE GOES IN apps/web/.env, WHICH IS GITIGNORED. It must never be
 * given a PUBLIC_ prefix — see the header of apps/web/src/lib/cms/config.ts for
 * what that would leak.
 */
import { withStrapi } from './lib/strapi.mjs';

const TOKEN_NAME = process.argv[2] ?? 'Astro Build (read-only)';

await withStrapi(async (strapi) => {
  const service = strapi.service('admin::api-token');

  const existing = await strapi.db.query('admin::api-token').findOne({
    where: { name: TOKEN_NAME },
  });

  let accessKey;

  if (existing) {
    const regenerated = await service.regenerate(existing.id);
    accessKey = regenerated.accessKey;
    console.log(`\n  Regenerated "${TOKEN_NAME}" — the previous key no longer works.`);
  } else {
    const created = await service.create({
      name: TOKEN_NAME,
      description: 'Used by the Astro build to read published content. Created by scripts/token.mjs.',
      type: 'read-only',
      lifespan: null,
    });
    accessKey = created.accessKey;
    console.log(`\n  Created "${TOKEN_NAME}".`);
  }

  console.log('\n  Add this to apps/web/.env :\n');
  console.log(`STRAPI_URL=http://localhost:1337`);
  console.log(`STRAPI_TOKEN=${accessKey}`);
  console.log('\n  It will not be shown again.\n');
});
