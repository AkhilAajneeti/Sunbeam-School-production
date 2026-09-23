/**
 * ═══ SEED THE TWO COUNCILS ═════════════════════════════════════════════════
 *
 *     npm run seed:councils [-- --dry] [-- --force]
 *
 * The STUDENT council board that opens /beyond-academics/student-council/, and
 * the ADVISORY council board that closes /about/history-legacy/. Two records,
 * one script, because they are the same job done twice and a school replacing
 * one board usually has the other in hand.
 *
 * ⚠⚠ THEY ARE DIFFERENT BODIES AND MUST NOT BE MERGED. One is children; the
 * other is academics, officials and the group's directors. Neither is the
 * School Management Committee, which is a statutory CBSE filing and lives on
 * the disclosure page.
 *
 * ═══ WHY IT READS THE .ts FILES RATHER THAN A FIXTURE ══════════════════════
 *
 * ⚠ BOTH ROLLS WERE TRANSCRIBED OFF PHOTOGRAPHS OF THE SCHOOL'S BOARDS, name
 * by name, at 3× magnification — forty-five children and fifteen adults. Re-
 * typing them into a JSON fixture would put a second transcription between the
 * boards and the CMS, and a slip in it would publish a child's name wrong with
 * nothing to compare against. loadWebData bundles the data files themselves,
 * so what is seeded is what was read off the boards.
 *
 * ⚠ THE DATA FILES STAY IN THE REPOSITORY AFTER THIS RUNS, and they are no
 * longer what the pages render — the CMS is. They are kept because they carry
 * the provenance: which spellings are the school's own, why the houses have
 * both a name and a colour, and why 'Mrs. Aditi Singh, Principal' is not this
 * school's Principal. Deleting them would throw that away.
 *
 * ═══ THIS IS A FIRST FILL, NOT HOW THE PAGES ARE MAINTAINED ════════════════
 *
 * ⚠⚠ RE-RUNNING PUSHES THE DATA FILES BACK OVER WHATEVER THE SCHOOL HAS SINCE
 * TYPED. Both are single types written whole by upsertSingle, so its timestamp
 * guard is what stands between a re-run and somebody's work — it will refuse
 * rather than overwrite. Do not reach for --force to get past that; copy the
 * admin's version into the data file first.
 *
 * After this, a new session is entered in the admin: upload the new board AND
 * retype the roll in the same save. Half the job leaves this year's faces over
 * last year's names.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { withStrapi } from '../lib/strapi.mjs';
import { upsertSingle } from '../lib/upsert.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');

const STUDENT_DATA = resolve(WEB, 'data/studentCouncil.ts');
const ADVISORY_DATA = resolve(WEB, 'data/advisoryCouncil.ts');
const BOARD_DIR = resolve(WEB, 'assets/council');

const STUDENT_UID = 'api::student-council-page.student-council-page';
const ADVISORY_UID = 'api::advisory-council.advisory-council';

const DRY = new Set(process.argv.slice(2)).has('--dry');

/** council.post takes exactly these three, and `house` only where there is one. */
const toPost = (p) => ({
  post: p.post,
  name: p.name,
  house: p.house ?? null,
});

await withStrapi(async (strapi) => {
  console.log(`\n  Seeding the councils${DRY ? '  (dry run)' : ''}\n`);

  const boards = {
    student: resolve(BOARD_DIR, 'StudentCouncil.jpeg'),
    advisory: resolve(BOARD_DIR, 'advisoryCouncil.jpeg'),
  };
  const missing = Object.entries(boards).filter(([, p]) => !existsSync(p));
  if (missing.length) {
    throw new Error(
      `Missing from assets/council: ${missing.map(([k]) => k).join(', ')}`,
    );
  }

  const { councils, councilIntro, councilSession } = await loadWebData(STUDENT_DATA);
  const { advisors } = await loadWebData(ADVISORY_DATA);

  const senior = councils.find((c) => c.id === 'senior');
  const junior = councils.find((c) => c.id === 'junior');
  if (!senior || !junior) throw new Error('studentCouncil.ts no longer has a senior and a junior body.');

  const studentCount =
    senior.offices.length + senior.posts.length + junior.offices.length + junior.posts.length;

  if (DRY) {
    console.log(`    student council   session ${councilSession}, ${studentCount} posts`);
    console.log(`                      senior ${senior.offices.length} + ${senior.posts.length}, junior ${junior.offices.length} + ${junior.posts.length}`);
    console.log(`    advisory council  ${advisors.length} members`);
    console.log('');
    return;
  }

  /* ── 1 · The boards ────────────────────────────────────────────────────
     ⚠ THE UPLOAD NAME IS THE BODY'S, NOT THE FILE'S. 'advisoryCouncil' and
     'StudentCouncil' sit next to each other in a media library of a thousand
     files and an editor replacing one has to be able to tell which. */
  const { file: studentBoard } = await uploadMedia(strapi, {
    absolutePath: boards.student,
    name: `student-council-board-${councilSession}`,
    alternativeText: `The Sunbeam School Ballia student council board for ${councilSession}.`,
  });
  const { file: advisoryBoard } = await uploadMedia(strapi, {
    absolutePath: boards.advisory,
    name: 'advisory-council-board',
    alternativeText: 'The Sunbeam School Ballia advisory council board.',
  });
  console.log('    uploaded            2 council boards');

  /* ── 2 · The student council ───────────────────────────────────────── */
  const studentAction = await upsertSingle(strapi, STUDENT_UID, {
    session: councilSession,
    intro: councilIntro,
    board: studentBoard.id,
    seniorOffices: senior.offices.map(toPost),
    seniorPosts: senior.posts.map(toPost),
    juniorOffices: junior.offices.map(toPost),
    juniorPosts: junior.posts.map(toPost),
  });
  console.log(`    student council     ${studentCount} posts, session ${councilSession}  ${studentAction}`);

  /* ── 3 · The advisory council ──────────────────────────────────────── */
  const advisoryAction = await upsertSingle(strapi, ADVISORY_UID, {
    board: advisoryBoard.id,
    advisors: advisors.map((a) => ({
      name: a.name,
      office: a.office ?? null,
      affiliation: a.affiliation ?? null,
    })),
  });
  console.log(`    advisory council    ${advisors.length} members  ${advisoryAction}`);

  console.log('');
});
