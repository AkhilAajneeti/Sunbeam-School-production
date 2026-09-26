/**
 * ═══ SEED THE ACADEMIC EXCELLENCE BOARDS ═══════════════════════════════════
 *
 *     npm run seed:toppers [-- --dry]
 *
 * The two boards at the school entrance, one row per name.
 *
 * ⚠⚠ IT READS data/toppers.ts RATHER THAN A FIXTURE, AND THAT IS DELIBERATE.
 * Those seventeen rows were transcribed off photographs of the boards, line by
 * line, at magnification. Re-typing them into a JSON fixture would put a second
 * transcription between the boards and the CMS, and a slip in it would publish
 * a child's name or a mark wrong with nothing to compare against.
 *
 * ⚠ THE BOARD'S OWN ORDER IS KEPT — oldest first, as engraved. The page shows
 * the newest at the top by reversing a copy. Storing it newest-first would make
 * the transcription impossible to check against the photograph.
 *
 * ⚠ THIS IS A FIRST FILL, NOT HOW THE BOARDS ARE MAINTAINED. Next session's
 * topper is a new row in Content Manager → Board Topper. Re-running pushes the
 * data file's rows back over whatever the school has since corrected — it is an
 * upsert keyed on board + session.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { upsertByKey } from '../lib/upsert.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const DATA = resolve(WEB, 'data/toppers.ts');

const UID = 'api::board-topper.board-topper';
const DRY = new Set(process.argv.slice(2)).has('--dry');

await withStrapi(async (strapi) => {
  const { classX, classXII } = await loadWebData(DATA);

  /* ⚠ THE KEY IS BOARD + SESSION, NOT THE NAME. A board carries one topper per
     session, and a name can repeat across boards; a session cannot repeat on
     one board. Keyed on the name, a correction to a spelling would create a
     second row rather than fix the first. */
  const rows = [
    ...classX.map((r, i) => ({ ...r, board: 'class-x', order: i })),
    ...classXII.map((r, i) => ({ ...r, board: 'class-xii', order: i })),
  ];

  console.log(`\n  Seeding the academic excellence boards${DRY ? '  (dry run)' : ''}\n`);

  if (DRY) {
    console.log(`    Class X    ${classX.length} names`);
    console.log(`    Class XII  ${classXII.length} names`);
    const flagged = rows.filter((r) => r.check).length;
    if (flagged) console.log(`    ${flagged} figure(s) awaiting the school's confirmation`);
    console.log('');
    return;
  }

  let n = 0;
  for (const r of rows) {
    /* board + session, because the same session is on both boards — see the
       note on rowKey in the schema. */
    const rowKey = `${r.board}-${r.session}`;
    await upsertByKey(strapi, UID, 'rowKey', rowKey, {
      rowKey,
      board: r.board,
      session: r.session,
      name: r.name,
      percent: r.percent,
      /* `check: true` in the data file means the figure could not be read off
         the photograph — the page prints an asterisk rather than a guess. */
      needsCheck: Boolean(r.check),
      order: r.order,
    });
    n += 1;
    console.log(`    ${r.board.padEnd(10)} ${r.session}  ${r.percent.padStart(6)}  ${r.name}${r.check ? '  *' : ''}`);
  }

  console.log(`\n    ${n} names across two boards\n`);
});
