/**
 * CAMPUS, FACILITIES & TRANSPORT QUERIES (G4).
 *
 * ⚠ THE RETURNED SHAPES MIRROR data/transport.ts, data/facilities.ts,
 * data/campusTour.ts and data/campus.ts, so the components that consume them
 * change only their import.
 *
 * ⚠⚠ EVERY DERIVED VALUE IS RECOMPUTED HERE, NOT STORED.
 *
 * `stats.buses`, `stats.runs`, `stats.stops`, `coverage`, `allItems`, `shot`
 * and `allFrames` were all computed from other data in the source files, and
 * they stay computed. The transport page's own meta description carried
 * "22 buses across 28 route runs and 91 boarding points" as frozen text after
 * G2; `transportCountsSentence()` below rebuilds it from the routes, so adding
 * a route changes the sentence instead of leaving it wrong.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import {
  BUS_ROUTE_POPULATE, CAMPUS_FACILITY_POPULATE, TRANSPORT_PAGE_POPULATE,
  FACILITIES_PAGE_POPULATE, CAMPUS_TOUR_PAGE_POPULATE, CAMPUS_SAFETY_PAGE_POPULATE,
} from '../populate';
import { getSchool } from './site';
import type { StrapiFile, PhotoComponent, StatItem } from '../types';

/* ── shared component shapes as Strapi sends them ─────────────────────────── */
interface RawFact { id: number; value: string }
interface RawPoint { id: number; number: string | null; icon: string | null; title: string; body: string }
interface RawMeasure { id: number; label: string; body: string; icon: string | null; verified: boolean }
interface RawStat { id: number; count: number; suffix: string; label: string; icon: string | null; note: string | null }

const values = (a: RawFact[] | null | undefined) => (a ?? []).map((f) => f.value);
const toStats = (a: RawStat[] | null | undefined): StatItem[] =>
  (a ?? []).map(({ count, suffix, label, icon, note }) => ({ count, suffix, label, icon, note }));
const toMeasures = (a: RawMeasure[] | null | undefined) =>
  (a ?? []).map(({ label, body, icon, verified }) => ({ label, body, icon, verified }));

/* ── TRANSPORT ───────────────────────────────────────────────────────────── */

export interface RouteRun {
  bus: string; slug: string; vehicle: number; leg?: string | null;
  driver: string; phone: string; stops: string[]; staffOnly?: boolean;
}

interface RawRoute extends Omit<RouteRun, 'stops'> { stops: RawFact[] | null; displayOrder: number }
interface RawTransportPage { safety: RawMeasure[] | null; stopAliases: Record<string, string> | null }

export async function getBusRoutes(): Promise<RouteRun[]> {
  const raw = await cmsFetchAll<RawRoute>('/api/bus-routes', {
    populate: BUS_ROUTE_POPULATE,
    sort: ['displayOrder:asc'],
  });
  return raw.map((r) => ({ ...r, stops: values(r.stops) }));
}

/**
 * Everything /campus/transport/ needs.
 *
 * ⚠ `coverage` AND `stats` ARE COMPUTED, exactly as data/transport.ts computed
 * them — including the detail that staff-only runs are excluded from coverage
 * but still counted as runs.
 */
export async function getTransportData() {
  const [routes, page, school] = await Promise.all([
    getBusRoutes(),
    cmsFetchOne<RawTransportPage>('/api/transport-page', { populate: TRANSPORT_PAGE_POPULATE }),
    getSchool(),
  ]);

  const map = new Map<string, number[]>();
  routes.forEach((r, i) => {
    if (r.staffOnly) return;
    for (const s of r.stops) {
      const at = map.get(s) ?? [];
      at.push(i);
      map.set(s, at);
    }
  });

  const coverage = [...map.entries()]
    .map(([stop, runs]) => ({ stop, runs }))
    .sort((a, b) => a.stop.localeCompare(b.stop, 'en'));

  const stats = {
    buses: new Set(routes.map((r) => r.vehicle)).size,
    runs: routes.length,
    stops: coverage.length,
  };

  return {
    routes,
    coverage,
    stats,
    safety: toMeasures(page?.safety),
    stopAliases: page?.stopAliases ?? {},
    /* ⚠ FROM SITE SETTINGS, NOT STORED TWICE. data/transport.ts kept its own
       copy of the transport in-charge's name and number; both already live on
       site-settings.contact, and two copies of a phone number is one wrong
       number waiting to happen. */
    transportContact: {
      role: 'Transport In-charge',
      name: school.phone.transportIncharge,
      phone: school.phone.transport,
      display: school.phone.transportDisplay,
    },
  };
}

/**
 * The sentence the transport page's meta description is built from.
 *
 * ⚠ THIS EXISTS BECAUSE G2 FROZE IT. page-meta stored the rendered text —
 * "22 buses across 28 route runs and 91 boarding points" — which was correct on
 * the day and wrong the moment a route changed. The route now composes its own
 * description from live counts and page-meta's stored one is ignored for this
 * one page.
 */
export function transportCountsSentence(stats: { buses: number; runs: number; stops: number }): string {
  return `${stats.buses} buses across ${stats.runs} route runs and ${stats.stops} boarding points`;
}

/* ── FACILITIES ──────────────────────────────────────────────────────────── */

export interface FacilityItem {
  label: string; body: string; icon: string | null;
  unlisted?: boolean; photo?: string | null;
}
interface RawGroup {
  id: number; groupId: string; eyebrow: string | null; title: string;
  stand: string | null; items: FacilityItem[] | null;
}
interface RawFacilitiesPage {
  kpis: RawStat[] | null; groups: RawGroup[] | null;
  whyCards: RawPoint[] | null; progression: RawPoint[] | null;
}

/** whyCards / progression → {icon, title, body} as the cards destructure them. */
const toCards = (a: RawPoint[] | null | undefined) =>
  (a ?? []).map(({ icon, title, body }) => ({ icon, title, body, label: title }));

export async function getFacilitiesData() {
  const p = await cmsFetchOne<RawFacilitiesPage>('/api/facilities-page', {
    populate: FACILITIES_PAGE_POPULATE,
  });

  const groups = (p?.groups ?? []).map((g) => ({
    id: g.groupId, eyebrow: g.eyebrow, title: g.title, stand: g.stand,
    items: (g.items ?? []).map((i) => ({ ...i, unlisted: Boolean(i.unlisted) })),
  }));

  return {
    kpis: toStats(p?.kpis),
    groups,
    /* Derived, exactly as facilities.ts derived it. */
    allItems: groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, groupId: g.id }))),
    whyCards: toCards(p?.whyCards),
    progression: toCards(p?.progression),
  };
}

/* ── CAMPUS TOUR ─────────────────────────────────────────────────────────── */

export interface CampusFacility {
  id: string; name: string; blurb: string; brief?: string | null;
  alt: string; pending?: boolean; images: StrapiFile[];
}
interface RawFacility {
  slug: string; name: string; blurb: string; brief: string | null;
  alt: string; pending: boolean; gallery: PhotoComponent[] | null; displayOrder: number;
}
interface RawTourPage { overviewStats: RawStat[] | null; journey: RawPoint[] | null }

export async function getCampusTourData() {
  const [raw, page] = await Promise.all([
    cmsFetchAll<RawFacility>('/api/campus-facilities', {
      populate: CAMPUS_FACILITY_POPULATE, sort: ['displayOrder:asc'],
    }),
    cmsFetchOne<RawTourPage>('/api/campus-tour-page', { populate: CAMPUS_TOUR_PAGE_POPULATE }),
  ]);

  const facilities: CampusFacility[] = raw.map((f) => ({
    id: f.slug, name: f.name, blurb: f.blurb, brief: f.brief,
    alt: f.alt, pending: f.pending,
    images: (f.gallery ?? []).map((g) => g.image).filter(Boolean),
  }));

  /* Both derived, as campusTour.ts derived them. */
  const shot = facilities.filter((f) => !f.pending && f.images.length > 0);
  /* ⚠ THE KEY IS `src`, AND `facility` IS THE NAME. campusTour.ts shaped each
     frame that way and Masonry.astro destructures exactly those names — a frame
     keyed `image` renders an empty wall with no error. */
  const allFrames = shot.flatMap((f) =>
    f.images.map((src) => ({ src, alt: f.alt, facility: f.name, id: f.id })),
  );

  return {
    facilities,
    shot,
    allFrames,
    overviewStats: toStats(page?.overviewStats),
    /* journey stored its facility reference in `icon`; the band reads `id`. */
    journey: (page?.journey ?? []).map((j) => ({ id: j.icon, label: j.title, body: j.body })),
  };
}

/* ── CAMPUS SAFETY ───────────────────────────────────────────────────────── */

interface RawSafetyGroup {
  id: number; groupId: string; numeral: string | null; title: string;
  stand: string | null; measures: RawMeasure[] | null;
}
interface RawMapPoint {
  id: number; pointId: string; label: string; body: string;
  x: number; y: number; verified: boolean; photo: string | null;
}
interface RawSafetyPage {
  safetyGroups: RawSafetyGroup[] | null; mapPoints: RawMapPoint[] | null;
  emergencySteps: RawPoint[] | null; emergencyPoints: RawMeasure[] | null;
  transportFeatures: RawMeasure[] | null; wellbeingCards: RawPoint[] | null;
  surveillanceCards: RawPoint[] | null;
}

export async function getCampusSafetyData() {
  const p = await cmsFetchOne<RawSafetyPage>('/api/campus-safety-page', {
    populate: CAMPUS_SAFETY_PAGE_POPULATE,
  });

  return {
    safetyGroups: (p?.safetyGroups ?? []).map((g) => ({
      id: g.groupId, numeral: g.numeral, title: g.title, stand: g.stand,
      measures: toMeasures(g.measures),
    })),
    mapPoints: (p?.mapPoints ?? []).map((m) => ({
      id: m.pointId, label: m.label, body: m.body,
      x: m.x, y: m.y, verified: m.verified, photo: m.photo,
    })),
    /* emergencySteps stored their numeral in `number`; the band reads `step`. */
    emergencySteps: (p?.emergencySteps ?? []).map((s) => ({ step: s.number, label: s.title, body: s.body })),
    emergencyPoints: toMeasures(p?.emergencyPoints),
    transportFeatures: toMeasures(p?.transportFeatures),
    wellbeingCards: toCards(p?.wellbeingCards),
    surveillanceCards: toCards(p?.surveillanceCards),
  };
}
