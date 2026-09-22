/**
 * SEED — THE ACHIEVEMENTS PAGE'S OWN FURNITURE.
 *
 *     npm run seed:achievements-page
 *     npm run seed:achievements-page -- --dry
 *
 * ⚠ THIS IS NOT THE ACHIEVEMENTS. Those are three separate collections seeded
 * by `npm run seed:achievements` — Achievement Majors, Credentials and
 * Achievement Records. This seeds only the three band headings wrapped around
 * them, and the two headers on the record boards.
 *
 * ⚠⚠ THE COPY BELOW IS WHAT WAS HARDCODED IN THE THREE COMPONENTS, MOVED
 * VERBATIM. It is duplicated in ACHIEVEMENTS_DEFAULTS in
 * apps/web/src/lib/cms/queries/achievements.ts, and the duplication is
 * deliberate: the frontend needs a value when the CMS is unreachable at build
 * time, and this needs one to write on a first run. If you change a heading,
 * change it in the CMS — not in either of these, which are only the starting
 * point and the fallback.
 *
 * ⚠ THE BANNER, PAGE TITLE AND SEO ARE NOT SEEDED HERE. They live on the Page
 * Meta row for /beyond-academics/achievements/ and are seeded by
 * `npm run seed:page-meta`, which is where every page on the site keeps them —
 * banner upload included.
 */
import { withStrapi } from '../lib/strapi.mjs';
import { upsertSingle } from '../lib/upsert.mjs';

const UID = 'api::achievements-page.achievements-page';
const DRY = new Set(process.argv.slice(2)).has('--dry');

/** structure.section wants its standfirst as body[0].text. */
const section = (kicker, heading, stand) => ({
  kicker,
  heading,
  body: [{ text: stand }],
});

const DATA = {
  majors: section(
    'First, and at full size',
    'Major achievements',
    'An international robotics placing, a national innovation ranking and a cluster championship — the three the school has published award graphics for.',
  ),
  recognition: section(
    'Judged from outside',
    'What others have recognised',
    'Six credentials awarded by bodies other than the school — a district ranking held for six years running, a Microsoft designation, and three national awards.',
  ),
  record: section(
    'The rest of it',
    'The full record',
    'Everything else the school has published, on two boards.',
  ),

  /* ⚠ `category` IS THE JOIN KEY to Achievement Records, not a label. The page
     puts every record whose category is 'sport' under the sport header. */
  recordBoards: [
    {
      category: 'sport',
      label: 'Sport',
      note: 'Every competition record the school publishes.',
    },
    {
      category: 'academic',
      label: 'Academic & innovation',
      note: 'Science, technology and public speaking.',
    },
  ],
};

await withStrapi(async (strapi) => {
  console.log('\n  Seeding the Achievements page\n');

  if (DRY) {
    console.log(JSON.stringify(DATA, null, 2));
    console.log('\n  --dry: nothing written.\n');
    return;
  }

  console.log(`    achievements page   ${await upsertSingle(strapi, UID, DATA)}`);
  console.log('\n  Done. The achievements themselves: npm run seed:achievements\n');
});
