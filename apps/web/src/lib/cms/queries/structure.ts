/**
 * THE ACADEMIC STRUCTURE STAGE PAGES — Pre-Primary through Senior Secondary.
 *
 * ⚠ ONE QUERY FOR FIVE PAGES, because they are one shape. Every band on every
 * one of them is a label, a heading, paragraphs, photographs and a run of cells.
 * What differs is how each page draws that, and the page owns it — so five
 * bespoke queries would have been the same forty lines written five times.
 *
 * ⚠ NOTHING HERE CARRIES A NUMBER, A POSITION OR A DELAY. The 01/02/03 down each
 * run, the percentages the Pre-Primary stops sit at on their curve, and every
 * stagger are derived in the page. They were stored once and were a plain
 * sequence every time.
 */
import { cmsFetchOne } from '../client';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { QueryObject } from '../client';
import type { StrapiFile } from '../types';

interface RawParagraph { text: string | null }
interface RawShot { key: string | null; image: StrapiFile | null; alt: string | null }
interface RawCell {
  label: string | null; value: string | null; mark: string | null;
  note: string | null; sub: string | null; caption: string | null;
  flag: boolean | null; image?: StrapiFile | null; alt?: string | null;
  number: string | null; suffix: string | null; state: string | null;
  href: string | null;
}
interface RawBand {
  kicker: string | null; heading: string | null;
  body: RawParagraph[] | null; caption: string | null;
  shots: RawShot[] | null; cells: RawCell[] | null; cellsTwo: RawCell[] | null;
}

export interface Shot { key: string; image: StrapiFile | null; alt: string }
export interface Cell {
  label: string; value: string; mark: string;
  note: string; sub: string; caption: string; flag: boolean;
  image: StrapiFile | null; alt: string;
  /**
   * ⚠ A FIGURE THE PAGE PRINTS — 17,574 books, 75 classrooms — with whatever
   * follows it. Empty on a run that is simply numbered 01, 02, 03: the page
   * counts those itself.
   */
  number: string; suffix: string;
  /** How firmly the school has published the row: yes | part | info. */
  state: string;
  /** Where the card goes, on the runs that are links. */
  href: string;
}
export interface Band {
  kicker: string; heading: string; body: string[]; caption: string;
  shots: Shot[]; cells: Cell[]; cellsTwo: Cell[];
}

/** One stream after Class X, and the subjects in it. */
export interface Stream {
  label: string; mark: string; sub: string; value: string; note: string;
  core: string[]; optional: string[]; additional: string[];
  /** True when the school has NOT published this stream's core subjects. */
  owed: boolean;
}
interface RawStream {
  label: string | null; mark: string | null; sub: string | null;
  value: string | null; note: string | null;
  core: RawParagraph[] | null; optional: RawParagraph[] | null; additional: RawParagraph[] | null;
  owed: boolean | null;
}

/** Every band is populated the same way, so the spec is built, not written out. */
export function structurePopulate(sections: readonly string[]): QueryObject {
  const band = {
    populate: {
      body: true,
      shots: { populate: { image: true } },
      cells: { populate: { image: true } },
      cellsTwo: { populate: { image: true } },
    },
  };
  return Object.fromEntries(sections.map((s) => [s, band]));
}

/**
 * Read one stage page and hand back its bands under the names the page uses.
 *
 * A band that is missing comes back EMPTY rather than undefined, so a page that
 * reads `open.body[0]` on a record nobody has filled in yet renders nothing
 * instead of failing the build.
 */
export async function getStructurePage<K extends string>(
  endpoint: string,
  sections: readonly K[],
): Promise<Record<K, Band>> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<Record<string, RawBand | null>>(endpoint, { populate: structurePopulate(sections) }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);

  const cells = (list: RawCell[] | null | undefined): Cell[] => (list ?? []).map((c) => ({
    label: t(c.label), value: t(c.value), mark: c.mark ?? '',
    note: t(c.note), sub: t(c.sub), caption: t(c.caption),
    flag: Boolean(c.flag), image: c.image ?? null, alt: t(c.alt),
    number: c.number ?? '', suffix: c.suffix ?? '', state: c.state ?? '', href: c.href ?? '',
  }));

  const band = (b: RawBand | null | undefined): Band => ({
    kicker: t(b?.kicker),
    heading: t(b?.heading),
    body: (b?.body ?? []).map((p) => t(p.text)).filter(Boolean),
    caption: t(b?.caption),
    shots: (b?.shots ?? []).map((s) => ({ key: s.key ?? '', image: s.image ?? null, alt: t(s.alt) })),
    cells: cells(b?.cells),
    cellsTwo: cells(b?.cellsTwo),
  });

  return Object.fromEntries(sections.map((s) => [s, band(raw?.[s])])) as Record<K, Band>;
}

/* ── the five pages ───────────────────────────────────────────────────────── */

const PRE_PRIMARY = ['open', 'doing', 'land', 'play', 'abh', 'first', 'firstBand', 'close'] as const;
const PRIMARY = ['open', 'rail', 'appr', 'act', 'val', 'space', 'jrn', 'close'] as const;
const MIDDLE = ['open', 'exp', 'doing', 'four', 'subj', 'lab', 'ach', 'jrn', 'close'] as const;
const SECONDARY = ['open', 'board', 'deep', 'beyond', 'jrn', 'close'] as const;
const SENIOR = ['open', 'beyond', 'board', 'more', 'jrn', 'close'] as const;

/* ── the two stream pages: a page-level list beside the bands ─────────────── */

const STREAMS_OFFERED = ['paths', 'x', 'dir', 'sure'] as const;
const SUBJECT_COMBINATIONS = ['open', 'worlds', 'map', 'close'] as const;

/**
 * ⚠ THE STREAMS ARE READ ONCE AND HANDED TO EVERY BAND. Both pages draw the
 * same four in several places; a copy per band is a copy that can drift.
 */
async function getStreamPage<K extends string>(endpoint: string, sections: readonly K[]) {
  const [raw, school] = await Promise.all([
    cmsFetchOne<Record<string, unknown>>(endpoint, {
      populate: {
        ...structurePopulate(sections),
        streams: { populate: { core: true, optional: true, additional: true } },
      },
    }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);
  const texts = (l: RawParagraph[] | null | undefined) => (l ?? []).map((x) => t(x.text)).filter(Boolean);

  const cells = (list: RawCell[] | null | undefined): Cell[] => (list ?? []).map((c) => ({
    label: t(c.label), value: t(c.value), mark: c.mark ?? '',
    note: t(c.note), sub: t(c.sub), caption: t(c.caption),
    flag: Boolean(c.flag), image: c.image ?? null, alt: t(c.alt),
    number: c.number ?? '', suffix: c.suffix ?? '', state: c.state ?? '', href: c.href ?? '',
  }));

  const band = (b: RawBand | null | undefined): Band => ({
    kicker: t(b?.kicker), heading: t(b?.heading),
    body: (b?.body ?? []).map((p) => t(p.text)).filter(Boolean),
    caption: t(b?.caption),
    shots: (b?.shots ?? []).map((s) => ({ key: s.key ?? '', image: s.image ?? null, alt: t(s.alt) })),
    cells: cells(b?.cells), cellsTwo: cells(b?.cellsTwo),
  });

  const streams: Stream[] = ((raw?.streams ?? []) as RawStream[]).map((x) => ({
    label: t(x.label), mark: x.mark ?? '', sub: t(x.sub), value: t(x.value), note: t(x.note),
    core: texts(x.core), optional: texts(x.optional), additional: texts(x.additional),
    owed: Boolean(x.owed),
  }));

  const bands = Object.fromEntries(
    sections.map((s) => [s, band(raw?.[s] as RawBand | null)]),
  ) as Record<K, Band>;

  return { streams, ...bands };
}

export const getStreamsOffered = () => getStreamPage('/api/streams-offered-page', STREAMS_OFFERED);
export const getSubjectCombinations = () => getStreamPage('/api/subject-combinations-page', SUBJECT_COMBINATIONS);

/* ── Teaching & Learning: the same shape, six more pages ──────────────────── */

const METHODOLOGY = ['open', 'three', 'collab', 'plat', 'close'] as const;
const SMART_CLASSROOMS = ['room', 'sys', 'beyond', 'prac', 'close'] as const;
const EXPERIENTIAL_LEARNING = ['open', 'path', 'proj', 'close'] as const;
const STEM_ROBOTICS = ['rooms', 'bots', 'use', 'eco', 'close'] as const;
const READING_LANGUAGE = ['lib', 'round', 'lab', 'stage', 'close'] as const;
const LABORATORIES_CLUBS = ['rooms', 'twelve', 'spaces', 'interlude', 'close'] as const;

export const getMethodology = () => getStructurePage('/api/methodology-page', METHODOLOGY);
export const getSmartClassrooms = () => getStructurePage('/api/smart-classrooms-page', SMART_CLASSROOMS);
export const getExperientialLearning = () => getStructurePage('/api/experiential-learning-page', EXPERIENTIAL_LEARNING);
export const getStemRobotics = () => getStructurePage('/api/stem-robotics-page', STEM_ROBOTICS);
export const getReadingLanguage = () => getStructurePage('/api/reading-language-page', READING_LANGUAGE);
export const getLaboratoriesClubs = () => getStructurePage('/api/laboratories-clubs-page', LABORATORIES_CLUBS);

/* ── Assessment & Support: the same shape, six more pages ─────────────────── */

const ASSESSMENT = ['open', 'cycle', 'struct', 'sup', 'conv', 'next', 'close'] as const;
const HOMEWORK_POLICY = ['open', 'item', 'frame', 'clear', 'gap', 'ask', 'close'] as const;
const REMEDIAL_SUPPORT = ['open', 'journey', 'rules', 'note', 'close'] as const;
const MENTORING = ['open', 'rel', 'jrn', 'roles', 'human', 'final'] as const;
const PARENT_TEACHER = ['open', 'agenda', 'why', 'close'] as const;
const COMPETITIVE_EXAM = ['open', 'list', 'feat', 'gal', 'close'] as const;

export const getAssessment = () => getStructurePage('/api/assessment-page', ASSESSMENT);
export const getHomeworkPolicy = () => getStructurePage('/api/homework-policy-page', HOMEWORK_POLICY);
export const getRemedialSupport = () => getStructurePage('/api/remedial-support-page', REMEDIAL_SUPPORT);
export const getMentoring = () => getStructurePage('/api/mentoring-page', MENTORING);
export const getParentTeacher = () => getStructurePage('/api/parent-teacher-page', PARENT_TEACHER);
export const getCompetitiveExam = () => getStructurePage('/api/competitive-exam-page', COMPETITIVE_EXAM);

export const getPrePrimary = () => getStructurePage('/api/pre-primary-page', PRE_PRIMARY);
export const getPrimaryStage = () => getStructurePage('/api/primary-stage-page', PRIMARY);
export const getMiddleSchool = () => getStructurePage('/api/middle-school-page', MIDDLE);
export const getSecondaryStage = () => getStructurePage('/api/secondary-stage-page', SECONDARY);
export const getSeniorSecondary = () => getStructurePage('/api/senior-secondary-page', SENIOR);
