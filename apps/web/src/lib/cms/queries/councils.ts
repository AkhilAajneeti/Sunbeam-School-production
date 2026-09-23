/**
 * ═══ THE TWO COUNCILS, FROM THE CMS ════════════════════════════════════════
 *
 * The STUDENT council on /beyond-academics/student-council/ and the ADVISORY
 * council that closes /about/history-legacy/. Two unrelated bodies — one is
 * children, the other academics and officials — sharing a module because they
 * are the same shape: a board the school publishes, and the roll printed on it.
 *
 * ⚠ NEITHER IS THE SCHOOL MANAGEMENT COMMITTEE, which is a statutory CBSE
 * filing and comes from the disclosure page.
 *
 * ⚠ NOTHING HERE CORRECTS A SPELLING. Both rolls are typed from the school's
 * own boards and several entries look like mistakes — 'Health & Hygine
 * Inspector', 'Adiyta Verma', 'Sport Vice Captain', 'Vanarasi'. They are the
 * school's, and a tidy-up in this layer would be invisible to whoever typed
 * them and wrong on screen. See the content types' own descriptions.
 */
import { cmsFetchOne } from '../client';
import { STUDENT_COUNCIL_POPULATE, ADVISORY_COUNCIL_POPULATE } from '../populate';
import type { StrapiFile } from '../types';

/* ── The student council ─────────────────────────────────────────────── */

/** The three houses, by the names the school gives them. */
export type House = 'love' | 'joy' | 'hope';

export interface CouncilPost {
  post: string;
  name: string;
  /** Only where the post names a house — drives the dot, nothing else. */
  house?: House;
}

export interface CouncilBody {
  id: string;
  label: string;
  offices: CouncilPost[];
  posts: CouncilPost[];
}

export interface StudentCouncil {
  session: string;
  intro: string;
  board: StrapiFile | null;
  bodies: CouncilBody[];
  /** For the meta description, and for anyone checking the roll is complete. */
  count: number;
}

interface RawPost {
  post: string | null;
  name: string | null;
  house: string | null;
}

interface RawStudentCouncil {
  session: string | null;
  intro: string | null;
  board: StrapiFile | null;
  seniorOffices: RawPost[] | null;
  seniorPosts: RawPost[] | null;
  juniorOffices: RawPost[] | null;
  juniorPosts: RawPost[] | null;
}

const HOUSES: House[] = ['love', 'joy', 'hope'];

/**
 * ⚠ A ROW MISSING EITHER HALF IS DROPPED, NOT RENDERED BLANK. A card reading
 * "Head Boy" with no name under it, or a name with no post, is worse than the
 * row being absent until the school finishes typing it.
 */
function posts(rows: RawPost[] | null | undefined): CouncilPost[] {
  return (rows ?? [])
    .filter((r) => r.post?.trim() && r.name?.trim())
    .map((r) => {
      const house = HOUSES.includes(r.house as House) ? (r.house as House) : undefined;
      return { post: r.post!.trim(), name: r.name!.trim(), ...(house ? { house } : {}) };
    });
}

export async function getStudentCouncil(): Promise<StudentCouncil | null> {
  const row = await cmsFetchOne<RawStudentCouncil>('/api/student-council-page', {
    populate: STUDENT_COUNCIL_POPULATE,
  });
  if (!row) return null;

  const bodies: CouncilBody[] = [
    {
      id: 'senior',
      label: "Senior Student's Council",
      offices: posts(row.seniorOffices),
      posts: posts(row.seniorPosts),
    },
    {
      id: 'junior',
      label: "Junior Student's Council",
      offices: posts(row.juniorOffices),
      posts: posts(row.juniorPosts),
    },
  ]
    /* ⚠ AND A BODY WITH NOBODY IN IT DOES NOT APPEAR. A heading reading
       "Junior Student's Council" over empty ground says less than nothing. */
    .filter((b) => b.offices.length + b.posts.length > 0);

  return {
    session: row.session?.trim() ?? '',
    intro: row.intro?.trim() ?? '',
    board: row.board ?? null,
    bodies,
    count: bodies.reduce((n, b) => n + b.offices.length + b.posts.length, 0),
  };
}

/* ── The advisory council ────────────────────────────────────────────── */

export interface Advisor {
  name: string;
  /** The bold line under the name, where the board sets one. */
  office?: string;
  /** The lighter line beneath, as printed. */
  affiliation?: string;
}

export interface AdvisoryCouncil {
  board: StrapiFile | null;
  advisors: Advisor[];
  /**
   * ⚠ THE BOARD'S TEXT ALTERNATIVE, BUILT HERE RATHER THAN STORED. The page
   * draws no list, so this string is the only form these names exist in for a
   * screen reader or for search — and building it from the same rows the admin
   * edits is what stops it going stale behind a replaced image.
   */
  alt: string;
}

interface RawAdvisor {
  name: string | null;
  office: string | null;
  affiliation: string | null;
}

interface RawAdvisoryCouncil {
  board: StrapiFile | null;
  advisors: RawAdvisor[] | null;
}

/** Spelt out, because "Its 15 members" reads as a digit mid-sentence aloud. */
const WORDS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty',
];

export async function getAdvisoryCouncil(): Promise<AdvisoryCouncil | null> {
  const row = await cmsFetchOne<RawAdvisoryCouncil>('/api/advisory-council', {
    populate: ADVISORY_COUNCIL_POPULATE,
  });
  if (!row) return null;

  const advisors: Advisor[] = (row.advisors ?? [])
    .filter((a) => a.name?.trim())
    .map((a) => ({
      name: a.name!.trim(),
      ...(a.office?.trim() ? { office: a.office.trim() } : {}),
      ...(a.affiliation?.trim() ? { affiliation: a.affiliation.trim() } : {}),
    }));

  /* Semicolons between people, commas within one, so a screen reader pauses
     where the board's own layout puts a gap. */
  const roll = advisors
    .map((a) => [a.name, a.office, a.affiliation].filter(Boolean).join(', '))
    .join('; ');

  const n = advisors.length;
  const count = n < WORDS.length ? WORDS[n] : String(n);

  return {
    board: row.board ?? null,
    advisors,
    /* ⚠ THE NAMES ARE ONLY INCLUDED IF THERE ARE ANY. An alt ending "Its no
       members are: ." is worse than a plain description of the board. */
    alt: roll
      ? `The Sunbeam School Ballia advisory council board. Its ${count} members are: ${roll}.`
      : 'The Sunbeam School Ballia advisory council board.',
  };
}
