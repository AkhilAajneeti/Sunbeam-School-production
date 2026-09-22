/**
 * ACHIEVEMENT QUERIES.
 *
 * ⚠ THESE EXPORTS MIRROR data/achievements.ts. That file exported `majors`,
 * `credentials`, `sportRecord` and `academicRecord`; three components consume
 * them and none of those components is being redesigned, so the shapes returned
 * here match what they already destructure.
 *
 * ⚠ ONLY PUBLISHED ITEMS ARE RETURNED — the read-only token cannot see drafts.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import {
  MAJOR_POPULATE,
  CREDENTIAL_POPULATE,
  ACHIEVEMENT_RECORD_POPULATE,
  ACHIEVEMENTS_PAGE_POPULATE,
} from '../populate';
import type { Major, Credential, AchievementRecord } from '../types';

/** What Strapi actually sends for a repeatable component. */
interface RawFact {
  id: number;
  value: string;
}
type RawMajor = Omit<Major, 'facts'> & { facts: RawFact[] | null };

/**
 * The award-graphic achievements, widest reach first.
 *
 * ⚠ `facts` IS FLATTENED TO string[] HERE AND NOWHERE ELSE. Doing it in the
 * query means Majors.astro never learns that Strapi models a list of strings as
 * a list of objects — which is a storage detail, not something a card that
 * renders three bullet points should have to know.
 */
export async function getMajors(): Promise<Major[]> {
  const raw = await cmsFetchAll<RawMajor>('/api/achievement-majors', {
    populate: MAJOR_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return raw.map((m) => ({
    ...m,
    facts: (m.facts ?? []).map((f) => f.value),
  }));
}

/** Third-party recognition, in the order the page shows them. */
export async function getCredentials(): Promise<Credential[]> {
  return cmsFetchAll<Credential>('/api/credentials', {
    populate: CREDENTIAL_POPULATE,
    sort: ['displayOrder:asc'],
  });
}

/**
 * Both record boards, in one request, split by category.
 *
 * ⚠ ONE FETCH AND A CLIENT-SIDE SPLIT, NOT TWO FILTERED FETCHES. Twenty-one
 * rows is far below a single page, so filtering server-side would cost a second
 * round trip to save nothing — and the two boards are always rendered together
 * by the same component.
 */
export async function getAchievementRecords(): Promise<{
  sportRecord: AchievementRecord[];
  academicRecord: AchievementRecord[];
}> {
  const all = await cmsFetchAll<AchievementRecord>('/api/achievement-records', {
    populate: ACHIEVEMENT_RECORD_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return {
    sportRecord: all.filter((r) => r.category === 'sport'),
    academicRecord: all.filter((r) => r.category === 'academic'),
  };
}

/* ══ THE PAGE'S OWN FURNITURE ═════════════════════════════════════════════
 *
 * Everything above returns the ACHIEVEMENTS. What follows returns the three
 * band headings wrapped around them, and the two headers on the record boards.
 *
 * ⚠ THE BANNER, PAGE TITLE AND SEO ARE NOT HERE. They come from the Page Meta
 * row for /beyond-academics/achievements/ — PageHero and BaseLayout both look
 * themselves up by pathname — which is also where the banner is uploaded. There
 * is deliberately no second place to set them.
 */

interface RawParagraph { id: number; text: string | null }
interface RawBand {
  kicker: string | null;
  heading: string | null;
  body: RawParagraph[] | null;
}
interface RawRecordBoard {
  id: number;
  category: 'sport' | 'academic';
  label: string | null;
  note: string | null;
}
interface RawAchievementsPage {
  majors: RawBand | null;
  recognition: RawBand | null;
  record: RawBand | null;
  recordBoards: RawRecordBoard[] | null;
}

export interface AchievementBand {
  eyebrow: string;
  heading: string;
  stand: string;
}

/**
 * ⚠⚠ THESE DEFAULTS ARE THE COPY THAT WAS HARDCODED IN THE THREE COMPONENTS,
 * MOVED VERBATIM — not rewritten, not improved. They are what the page shows if
 * the CMS row is empty, missing, or unreachable, so a failed fetch degrades to
 * the page as it shipped rather than to blank headings.
 *
 * ⚠ AND THEY ARE THE REASON EVERY FIELD READS `cms ?? default`. An editor who
 * clears a heading gets the default back, not an empty <h2>. Emptying a band is
 * not something the design supports; rewording it is.
 */
const ACHIEVEMENTS_DEFAULTS = {
  majors: {
    eyebrow: 'First, and at full size',
    heading: 'Major achievements',
    stand:
      'An international robotics placing, a national innovation ranking and a cluster championship — the three the school has published award graphics for.',
  },
  recognition: {
    eyebrow: 'Judged from outside',
    heading: 'What others have recognised',
    stand:
      'Six credentials awarded by bodies other than the school — a district ranking held for six years running, a Microsoft designation, and three national awards.',
  },
  record: {
    eyebrow: 'The rest of it',
    heading: 'The full record',
    stand: 'Everything else the school has published, on two boards.',
  },
} as const;

/** The two board headers, in the order the page prints them. */
const BOARD_DEFAULTS = [
  { category: 'sport' as const, label: 'Sport', note: 'Every competition record the school publishes.' },
  { category: 'academic' as const, label: 'Academic & innovation', note: 'Science, technology and public speaking.' },
];

const band = (
  raw: RawBand | null | undefined,
  fb: { eyebrow: string; heading: string; stand: string },
): AchievementBand => ({
  eyebrow: raw?.kicker?.trim() || fb.eyebrow,
  heading: raw?.heading?.trim() || fb.heading,
  stand: raw?.body?.[0]?.text?.trim() || fb.stand,
});

/**
 * The three band headings and the two record-board headers.
 *
 * ⚠ MEMOISED FOR THE LIFE OF THE BUILD. Three components each want their own
 * band and would otherwise fetch the whole row three times. The promise is
 * cached rather than the value, so concurrent callers share one request instead
 * of racing to start several.
 */
let pagePromise: Promise<RawAchievementsPage | null> | null = null;

function achievementsPage(): Promise<RawAchievementsPage | null> {
  pagePromise ??= cmsFetchOne<RawAchievementsPage>('/api/achievements-page', {
    populate: ACHIEVEMENTS_PAGE_POPULATE,
  });
  return pagePromise;
}

export async function getAchievementsBands(): Promise<{
  majors: AchievementBand;
  recognition: AchievementBand;
  record: AchievementBand;
}> {
  const page = await achievementsPage();
  return {
    majors: band(page?.majors, ACHIEVEMENTS_DEFAULTS.majors),
    recognition: band(page?.recognition, ACHIEVEMENTS_DEFAULTS.recognition),
    record: band(page?.record, ACHIEVEMENTS_DEFAULTS.record),
  };
}

/**
 * The two record-board headers, keyed to the category they head.
 *
 * ⚠ THE CATEGORY IS WHAT JOINS A HEADER TO ITS ROWS, so a header whose category
 * an editor changes takes its records with it. The order follows the CMS row
 * order, which is what an editor drags.
 *
 * ⚠ A CATEGORY MISSING FROM THE CMS KEEPS ITS DEFAULT HEADER rather than
 * vanishing. The records filed under it still exist, and dropping the header
 * would drop a whole board of published rows off the page — a heading an editor
 * forgot to add is a smaller problem than content silently disappearing.
 */
export async function getRecordBoards(): Promise<
  { category: 'sport' | 'academic'; label: string; note: string }[]
> {
  const page = await achievementsPage();
  const rows = page?.recordBoards ?? [];

  const fromCms = rows
    .filter((r) => r.category)
    .map((r) => {
      const fb = BOARD_DEFAULTS.find((d) => d.category === r.category);
      return {
        category: r.category,
        label: r.label?.trim() || fb?.label || r.category,
        note: r.note?.trim() || fb?.note || '',
      };
    });

  const missing = BOARD_DEFAULTS.filter(
    (d) => !fromCms.some((r) => r.category === d.category),
  );
  return [...fromCms, ...missing];
}
