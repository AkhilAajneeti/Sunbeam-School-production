/**
 * ROW COUNTS FOR EVERY CONTENT TYPE.
 *
 *     npm run verify:counts
 *
 * ⚠ RUN THIS AFTER ANYTHING THAT COULD HAVE LEFT TWO STRAPI PROCESSES ALIVE AT
 * ONCE. Schema reconciliation runs at boot, and the failure it produces is
 * silent: the site keeps building, the admin keeps loading, and a table is
 * simply empty. A count is the cheapest way to know, and the incident this
 * project already had (docs/09) went unnoticed for hours for want of one.
 */
import { withStrapi } from '../lib/strapi.mjs';

await withStrapi(async (strapi) => {
  const uids = Object.keys(strapi.contentTypes)
    .filter((u) => u.startsWith('api::'))
    .sort();

  const lines = [];
  for (const uid of uids) {
    let n;
    try { n = await strapi.documents(uid).count(); } catch { n = 'ERROR'; }
    const name = uid.replace('api::', '').split('.')[0];
    const kind = strapi.contentTypes[uid].kind === 'singleType' ? '  single' : '';
    lines.push(`    ${name.padEnd(26)}${String(n).padStart(5)}${kind}`);
  }

  const media = await strapi.db.query('plugin::upload.file').count();
  lines.push(`    ${'media files'.padEnd(26)}${String(media).padStart(5)}`);

  console.log(`\n  CONTENT TYPES\n\n${lines.join('\n')}\n`);
});
