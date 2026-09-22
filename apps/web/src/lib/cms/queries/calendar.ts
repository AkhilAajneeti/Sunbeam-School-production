/**
 * ACADEMIC CALENDAR QUERIES.
 *
 * ⚠ MIRRORS data/academicCalendar.ts — `calendars`, `calendarSource`,
 * `calendarCarries` and `calendarPlanning`. The first is a Collection Type
 * (there is one document per session and the school adds one a year); the other
 * three are the page's own prose and live on a Single Type beside it.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import { CALENDAR_DOCUMENT_POPULATE, ACADEMIC_CALENDAR_PAGE_POPULATE } from '../populate';
import { fileUrl } from '../media';
import type {
  CalendarDocument, AcademicCalendarPage, PointItem, StrapiFile, PhotoComponent,
} from '../types';

/** What Strapi sends for shared.point, before it is mapped back. */
interface RawPoint {
  id: number;
  number: string | null;
  icon: string | null;
  title: string;
  body: string;
}
type RawCalendar = CalendarDocument & { document?: StrapiFile | null };
type RawPage = Omit<AcademicCalendarPage, 'carries' | 'planning' | 'shots'> & {
  shots: PhotoComponent[] | null;
  carries: RawPoint[] | null;
  planning: RawPoint[] | null;
};

/**
 * Map shared.point back to the `{ n, mark, k, v }` the .astro files destructure.
 * See the PointItem doc in ../types.ts for why the two shapes differ.
 */
const points = (raw: RawPoint[] | null | undefined): PointItem[] =>
  (raw ?? []).map((p) => ({ n: p.number, mark: p.icon, k: p.title, v: p.body }));

/**
 * Published calendars, newest session first.
 *
 * ⚠ `href` PREFERS THE UPLOADED FILE. The source pointed at /calendar/*.pdf in
 * public/, which made publishing next year's planner a developer job. The PDFs
 * are in the media library now, so `href` resolves to the uploaded document
 * where one exists and falls back to the original public path where it does not
 * — the download link works either way and the card is unchanged.
 */
export async function getCalendars(): Promise<CalendarDocument[]> {
  const raw = await cmsFetchAll<RawCalendar>('/api/calendar-documents', {
    populate: CALENDAR_DOCUMENT_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return raw.map((c) => ({
    ...c,
    href: c.document ? fileUrl(c.document) : c.href,
  }));
}

/** The page's own prose and card strips. */
export async function getAcademicCalendarPage(): Promise<AcademicCalendarPage> {
  const raw = await cmsFetchOne<RawPage>('/api/academic-calendar-page', {
    populate: ACADEMIC_CALENDAR_PAGE_POPULATE,
  });

  /* ⚠ A SINGLE TYPE THAT HAS NEVER BEEN SAVED RETURNS null, NOT AN OBJECT.
     Returning empty arrays rather than throwing means the page renders its
     documents with the card strips simply absent, which is a far better failure
     than a build that dies because nobody has opened that form yet. */
  return {
    source: raw?.source ?? null,
    carries: points(raw?.carries),
    planning: points(raw?.planning),
    shots: raw?.shots ?? [],
    seo: raw?.seo ?? null,
  };
}

/** Everything /academics/academic-calendar/ needs. */
export async function getAcademicCalendarPageData(): Promise<{
  calendars: CalendarDocument[];
  calendarSource: string | null;
  calendarCarries: PointItem[];
  calendarPlanning: PointItem[];
  calendarShots: PhotoComponent[];
}> {
  const [calendars, page] = await Promise.all([getCalendars(), getAcademicCalendarPage()]);

  return {
    calendars,
    calendarSource: page.source,
    calendarCarries: page.carries,
    calendarPlanning: page.planning,
    calendarShots: page.shots,
  };
}
