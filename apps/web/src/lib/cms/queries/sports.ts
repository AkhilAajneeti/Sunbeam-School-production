/**
 * SPORTS, EXCURSIONS & SCHOOL ACTIVITIES QUERIES (G5).
 *
 * ⚠ SHAPES MIRROR data/sports.ts, data/sportsRecord.ts and data/excursions.ts,
 * so the consuming components change only their import.
 *
 * ⚠⚠ SCHOOL-ACTIVITY PAGINATION IS COMPUTED, NOT STORED. data/schoolActivities.ts
 * exported `PER_PAGE`, `pageCount` and `activityPage(n)` — all arithmetic over
 * the item list. They are recomputed here, so /page/2/ follows the content
 * rather than a number somebody has to remember to update.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import {
  SPORT_FACILITY_POPULATE, GAME_POPULATE, SPORTS_RECORD_POPULATE,
  EXCURSION_SECTION_POPULATE, EXPEDITION_POPULATE, SPORTS_PAGE_POPULATE,
} from '../populate';
import { getChroniclePage } from './news';
import type { StrapiFile, PhotoComponent } from '../types';
import type { ChroniclePage, ChronicleItem } from './news';

interface RawFact { id: number; value: string }
const values = (a: RawFact[] | null | undefined) => (a ?? []).map((f) => f.value);
const images = (a: PhotoComponent[] | null | undefined) =>
  (a ?? []).map((p) => p.image).filter(Boolean);

/* ── SPORT FACILITIES ────────────────────────────────────────────────────── */

export interface SportFacility {
  id: string; name: string; kicker: string | null; body: string;
  brief: string | null; notes: string[]; alt: string | null;
  lead: StrapiFile | null; support: StrapiFile[];
}
interface RawFacility {
  slug: string; name: string; kicker: string | null; body: string;
  brief: string | null; notes: RawFact[] | null; alt: string | null;
  lead: StrapiFile | null; support: PhotoComponent[] | null; displayOrder: number;
}

export async function getSportFacilities(): Promise<SportFacility[]> {
  const raw = await cmsFetchAll<RawFacility>('/api/sport-facilities', {
    populate: SPORT_FACILITY_POPULATE, sort: ['displayOrder:asc'],
  });
  return raw.map((f) => ({
    id: f.slug, name: f.name, kicker: f.kicker, body: f.body, brief: f.brief,
    notes: values(f.notes), alt: f.alt, lead: f.lead ?? null, support: images(f.support),
  }));
}

/* ── GAMES ───────────────────────────────────────────────────────────────── */

export interface Game {
  name: string; icon: string; blurb: string; venue: string | null;
  alt: string | null; photo: StrapiFile | null;
}
interface RawGame extends Game { slug: string; arena: 'outdoor' | 'indoor'; displayOrder: number }

/**
 * ⚠ RETURNED AS { outdoor, indoor }, the shape GamesRail destructures. One
 * collection with an `arena` enum in the CMS; two rails on the page.
 */
export async function getGames(): Promise<{ outdoor: Game[]; indoor: Game[] }> {
  const raw = await cmsFetchAll<RawGame>('/api/games', {
    populate: GAME_POPULATE, sort: ['displayOrder:asc'],
  });
  const pick = (arena: 'outdoor' | 'indoor') =>
    raw.filter((g) => g.arena === arena).map(({ name, icon, blurb, venue, alt, photo }) =>
      ({ name, icon, blurb, venue, alt, photo: photo ?? null }));
  return { outdoor: pick('outdoor'), indoor: pick('indoor') };
}

/* ── SPORTS RECORD ───────────────────────────────────────────────────────── */

export interface Podium { event: string; places: string[] }
export interface RecordBlock {
  id: string; kicker: string | null; title: string; body: string;
  more: string | null; alt: string | null; podiums: Podium[]; shots: StrapiFile[];
}
interface RawPodium { id: number; event: string; places: RawFact[] | null }
interface RawRecord {
  slug: string; kicker: string | null; title: string; body: string;
  more: string | null; alt: string | null;
  podiums: RawPodium[] | null; shots: PhotoComponent[] | null; displayOrder: number;
}

export async function getSportsRecord(): Promise<RecordBlock[]> {
  const raw = await cmsFetchAll<RawRecord>('/api/sports-records', {
    populate: SPORTS_RECORD_POPULATE, sort: ['displayOrder:asc'],
  });
  return raw.map((r) => ({
    id: r.slug, kicker: r.kicker, title: r.title, body: r.body,
    more: r.more, alt: r.alt,
    podiums: (r.podiums ?? []).map((p) => ({ event: p.event, places: values(p.places) })),
    /* ⚠ `shots` IS StrapiFile[] NOW, NOT string[]. The source stored filenames
       that indexed a Vite-glob map; the CMS holds the photographs themselves. */
    shots: images(r.shots),
  }));
}

/* ── SPORTS PAGE ─────────────────────────────────────────────────────────── */

interface RawFigure { id: number; figure: string; label: string; note: string | null }
interface RawRung {
  id: number; step: string; title: string; body: string; items: RawFact[] | null;
  milestone: string | null; glyph: string | null; accent: string; pending: boolean;
}
interface RawCoach {
  id: number; icon: string | null; figure: string | null;
  title: string; body: string; proof: string | null;
}
interface RawSportsPage {
  figures: RawFigure[] | null; ladder: RawRung[] | null; coaching: RawCoach[] | null;
}

export async function getSportsPage() {
  const p = await cmsFetchOne<RawSportsPage>('/api/sports-page', { populate: SPORTS_PAGE_POPULATE });
  return {
    figures: (p?.figures ?? []).map(({ figure, label, note }) => ({ figure, label, note })),
    ladder: (p?.ladder ?? []).map((r) => ({
      step: r.step, title: r.title, body: r.body, items: values(r.items),
      milestone: r.milestone, glyph: r.glyph, accent: r.accent, pending: r.pending,
    })),
    coaching: (p?.coaching ?? []).map(({ icon, figure, title, body, proof }) =>
      ({ icon, figure, title, body, proof })),
  };
}

/* ── EXCURSIONS ──────────────────────────────────────────────────────────── */

export interface ExcursionSection {
  id: string; title: string; body: string[]; place: string | null;
  year: string | null; who: string | null; lang: string | null;
  needs: string | null; alt: string | null;
  art: StrapiFile | null; shots: StrapiFile[];
}
interface RawParagraph { id: number; text: string }
interface RawSection {
  slug: string; title: string; body: RawParagraph[] | null; place: string | null;
  year: string | null; who: string | null; lang: string | null; needs: string | null;
  alt: string | null; art: StrapiFile | null; shots: PhotoComponent[] | null; displayOrder: number;
}

export async function getExcursionSections(): Promise<ExcursionSection[]> {
  const raw = await cmsFetchAll<RawSection>('/api/excursion-sections', {
    populate: EXCURSION_SECTION_POPULATE, sort: ['displayOrder:asc'],
  });
  return raw.map((s) => ({
    id: s.slug, title: s.title,
    body: (s.body ?? []).map((p) => p.text),
    place: s.place, year: s.year, who: s.who, lang: s.lang,
    needs: s.needs, alt: s.alt, art: s.art ?? null, shots: images(s.shots),
  }));
}

export interface Expedition { name: string; note: string; kind: string; icon: string | null }

export async function getExpeditions(): Promise<Expedition[]> {
  const raw = await cmsFetchAll<Expedition & { slug: string; displayOrder: number }>(
    '/api/expeditions', { populate: EXPEDITION_POPULATE, sort: ['displayOrder:asc'] },
  );
  return raw.map(({ name, note, kind, icon }) => ({ name, note, kind, icon }));
}

/* ── SCHOOL ACTIVITIES (reuses news-item, category `activity`) ────────────── */

/** Items per page, as data/schoolActivities.ts set it. */
export const PER_PAGE = 6;

/**
 * The whole activities chronicle, plus the pagination derived from it.
 *
 * ⚠ `pageCount` AND EACH PAGE'S SLICE ARE COMPUTED. The source exported them as
 * constants and a function; both are arithmetic over the item list, so storing
 * them would mean a second place to update when an activity is added — and
 * /page/2/ silently pointing at the wrong six.
 */
export async function getActivitiesData(): Promise<{
  schoolActivities: ChroniclePage;
  activityItems: ChronicleItem[];
  pageCount: number;
  activityPage: (n: number) => ChroniclePage;
}> {
  const page = await getChroniclePage('school-activities');
  const activityItems = page.groups.flatMap((g) => g.items);
  const pageCount = Math.max(1, Math.ceil(activityItems.length / PER_PAGE));

  /** One page of the chronicle, keeping the page header and re-grouping. */
  const activityPage = (n: number): ChroniclePage => {
    const start = (n - 1) * PER_PAGE;
    const slice = activityItems.slice(start, start + PER_PAGE);
    return {
      ...page,
      groups: page.groups
        .map((g) => ({ ...g, items: g.items.filter((i) => slice.includes(i)) }))
        .filter((g) => g.items.length > 0),
    };
  };

  return { schoolActivities: page, activityItems, pageCount, activityPage };
}
