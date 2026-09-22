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
interface RawTransportPage {
  overview: RawBand | null;
  overviewCta: string | null;
  overviewFigures: RawMeasure[] | null;
  finder: RawBand | null;
  finderSearchLabel: string | null;
  finderAreasHeading: string | null;
  finderStaffNote: string | null;
  finderDriverNote: string | null;
  finderEmptyHeading: string | null;
  finderEmptyBody: string | null;
  finderEmptyCta: string | null;
  safetyHead: RawBand | null;
  contactHead: RawBand | null;
  safety: RawMeasure[] | null;
  stopAliases: Record<string, string> | null;
}

/**
 * ⚠⚠ TWO OF THESE BODIES CARRY TOKENS, AND THAT IS THE WHOLE POINT.
 *
 * `{buses}`, `{runs}` and `{stops}` are replaced with counts computed from the
 * Bus Route collection. The alternative — letting an editor type "22 buses over
 * 28 route runs" — freezes three numbers that the routes themselves already
 * know, and they go wrong the first time a route is added. This is the same
 * rule transportCountsSentence() exists for.
 *
 * An editor who deletes a brace gets the literal word on the page rather than a
 * crash, which is the right failure for a CMS field.
 */
const fill = (text: string, stats: { buses: number; runs: number; stops: number }) =>
  text
    .replace(/\{buses\}/g, String(stats.buses))
    .replace(/\{runs\}/g, String(stats.runs))
    .replace(/\{stops\}/g, String(stats.stops));

/**
 * The copy that used to sit in TransportBands.astro and RouteFinder.astro.
 * Every band reads `cms value ?? default` — see TOUR_DEFAULTS for the reasoning,
 * which is unchanged here.
 */
const TRANSPORT_DEFAULTS = {
  overview: {
    eyebrow: 'Transport',
    heading: 'A bus from most of Ballia',
    stand:
      'The school runs {buses} buses over {runs} route runs, calling at {stops} published ' +
      'boarding points. Every route names its driver and prints a direct mobile number for ' +
      'them — so the person driving your child is someone you can reach.',
  },
  overviewCta: 'Find your route',
  /* The route finder's own prose. Its data labels — First stop, Driver, /stop —
     are not here: they label the route data rather than say anything. */
  finderCopy: {
    searchLabel: 'Search by area or boarding point',
    areasHeading: 'Areas we cover',
    staffNote: 'As published in the school’s route list.',
    driverNote: 'The number below still reaches this vehicle’s driver.',
    emptyHeading: 'No published stop matches',
    emptyBody:
      'Routes are set each session and the published list may not name every pick-up point. ' +
      'Speak to the transport in-charge before assuming your area is not covered.',
    emptyCta: 'Contact the transport in-charge',
  },
  finder: {
    eyebrow: 'Route finder',
    heading: 'Find the bus that stops near you',
    stand: 'Type a locality, or pick one below. {stops} boarding points across {runs} runs.',
  },
  safetyHead: {
    eyebrow: 'Safety',
    heading: 'What is fitted, and what we can confirm',
    stand: 'Every line below is stated on the school’s own pages.',
  },
  contactHead: {
    eyebrow: 'Contact',
    heading: 'Anything the routes don’t answer',
    stand:
      'Allocation, stop changes, timings, charges and complaints all go to the transport ' +
      'in-charge — not to the driver.',
  },
  /* ⚠ CAPTIONS ONLY — the numbers above them are computed from Bus Route. */
  figures: [
    { label: 'Buses on published routes', body: 'From a stated fleet of 29 and more' },
    { label: 'Route runs', body: 'Several buses make two trips' },
    { label: 'Boarding points', body: 'Across Ballia and the surrounding blocks' },
  ],
};

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

  /* Bands are filled AFTER stats is computed, so the tokens resolve. */
  const tband = (raw: RawBand | null | undefined, fb: { eyebrow: string; heading: string; stand: string }) => {
    const b = band(raw, fb);
    return { ...b, stand: fill(b.stand, stats) };
  };

  const figures = (page?.overviewFigures ?? []).length
    ? toMeasures(page?.overviewFigures).map((m) => ({ label: m.label, note: m.body }))
    : TRANSPORT_DEFAULTS.figures.map((f) => ({ label: f.label, note: f.body }));

  return {
    routes,
    coverage,
    stats,
    overviewBand: tband(page?.overview, TRANSPORT_DEFAULTS.overview),
    overviewCta: page?.overviewCta?.trim() || TRANSPORT_DEFAULTS.overviewCta,
    overviewFigures: figures,
    finderBand: tband(page?.finder, TRANSPORT_DEFAULTS.finder),
    finderCopy: {
      searchLabel: page?.finderSearchLabel?.trim() || TRANSPORT_DEFAULTS.finderCopy.searchLabel,
      areasHeading: page?.finderAreasHeading?.trim() || TRANSPORT_DEFAULTS.finderCopy.areasHeading,
      staffNote: page?.finderStaffNote?.trim() || TRANSPORT_DEFAULTS.finderCopy.staffNote,
      driverNote: page?.finderDriverNote?.trim() || TRANSPORT_DEFAULTS.finderCopy.driverNote,
      emptyHeading: page?.finderEmptyHeading?.trim() || TRANSPORT_DEFAULTS.finderCopy.emptyHeading,
      emptyBody: page?.finderEmptyBody?.trim() || TRANSPORT_DEFAULTS.finderCopy.emptyBody,
      emptyCta: page?.finderEmptyCta?.trim() || TRANSPORT_DEFAULTS.finderCopy.emptyCta,
    },
    safetyHeadBand: tband(page?.safetyHead, TRANSPORT_DEFAULTS.safetyHead),
    contactHeadBand: tband(page?.contactHead, TRANSPORT_DEFAULTS.contactHead),
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
  figures: RawBand | null;
  kpis: RawStat[] | null; groups: RawGroup[] | null;
  whyCards: RawPoint[] | null; progression: RawPoint[] | null;
}

/**
 * ⚠⚠ THE ONE EDITABLE BAND HEAD ON /campus/facilities-infrastructure/.
 *
 * The other two bands on that page — the photo wall and the visit
 * call-to-action — are the SAME COMPONENTS as /campus/ and read their copy from
 * Campus Tour Page. Editing them here would need a second copy of both, which
 * is how one heading becomes two that disagree.
 *
 * See TOUR_DEFAULTS below for why every band carries a fallback.
 */
const FACILITIES_DEFAULTS = {
  figures: {
    eyebrow: 'The campus in figures',
    heading: 'What the school actually has',
    stand: 'Every number below is one Sunbeam Ballia publishes.',
  },
};

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
    figuresBand: band(p?.figures, FACILITIES_DEFAULTS.figures),
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
/**
 * A `structure.section` as Strapi sends it — only the head fields are used.
 *
 * ⚠ THE STANDFIRST IS `body[0]`, not a field of its own. structure.section has
 * no single-line standfirst; `body` is shared.paragraph[] and the first entry is
 * the line under the heading. Anything an editor types below the first
 * paragraph is ignored by these bands — which is why the schema describes the
 * field as "the standfirst" rather than "body".
 */
interface RawBand {
  id: number;
  kicker: string | null;
  heading: string | null;
  body: { id: number; text: string }[] | null;
}

/** `shared.point` with its `tags`, which carry the featured rooms' highlights. */
interface RawFeatured extends RawPoint { tags: RawFact[] | null }

interface RawTourPage {
  overview: RawBand | null;
  overviewStats: RawStat[] | null;
  categories: RawBand | null;
  gallery: RawBand | null;
  featuredHead: RawBand | null;
  featured: RawFeatured[] | null;
  journeyHead: RawBand | null;
  journey: RawPoint[] | null;
  visit: RawBand | null;
  visitCtaLabel: string | null;
  visitCtaHref: string | null;
  visitCallLabel: string | null;
}

export interface TourBand { eyebrow: string; heading: string; stand: string }
export interface FeaturedRoom { id: string; title: string; body: string; highlights: string[] }

/**
 * ⚠⚠ THE DEFAULTS ARE THE COPY THAT USED TO BE HARDCODED IN THE COMPONENTS, AND
 * THEY LIVE HERE SO THERE IS EXACTLY ONE OF EACH.
 *
 * Every band reads `cms value ?? default`. That means:
 *
 *   · an unseeded or unpublished CMS never renders a headless band — the page
 *     is always shippable, which matters because this is the campus tour and a
 *     missing heading reads as a broken page rather than as missing content;
 *   · clearing a field in the admin RESTORES THE DEFAULT rather than emptying
 *     the band. That is a deliberate trade and worth knowing: to change a
 *     heading an editor must type a new one, not delete the old.
 *
 * ⚠ DO NOT COPY THESE STRINGS BACK INTO A COMPONENT. The whole point of this
 * migration is that the components no longer carry copy.
 */
const TOUR_DEFAULTS = {
  overview: { eyebrow: 'The campus at a glance', heading: 'Twelve laboratories, a library, and room to run' },
  categories: { eyebrow: 'Where to look', heading: 'Every facility, by the room it is' },
  gallery: { eyebrow: 'The whole wall', heading: '' },
  featuredHead: { eyebrow: 'Worth stopping at', heading: 'Six rooms, and what each one is for' },
  journeyHead: { eyebrow: 'A day, end to end', heading: 'How a student meets the campus' },
  visit: { eyebrow: 'Come and see it', heading: 'Experience our campus in person' },
  visitCtaLabel: 'Book a campus visit',
  visitCtaHref: '/admissions/campus-visit/',
  visitCallLabel: 'Or call admissions',
} as const;

const band = (
  raw: RawBand | null | undefined,
  fallback: { eyebrow: string; heading: string; stand?: string },
): TourBand => ({
  eyebrow: raw?.kicker?.trim() || fallback.eyebrow,
  heading: raw?.heading?.trim() || fallback.heading,
  stand: raw?.body?.[0]?.text?.trim() || fallback.stand || '',
});

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

  /* ⚠ `icon` CARRIES THE FACILITY ID, for `featured` exactly as it already does
     for `journey` — both bands match a card to a facility by that key, and the
     photograph comes from the facility rather than from the card. A room whose
     `icon` matches no facility simply does not render. */
  const featured: FeaturedRoom[] = (page?.featured ?? []).map((f) => ({
    id: f.icon ?? '',
    title: f.title,
    body: f.body,
    highlights: values(f.tags),
  }));

  return {
    facilities,
    shot,
    allFrames,
    overviewStats: toStats(page?.overviewStats),
    /* journey stored its facility reference in `icon`; the band reads `id`. */
    journey: (page?.journey ?? []).map((j) => ({ id: j.icon, label: j.title, body: j.body })),

    /* Band copy — see TOUR_DEFAULTS for why each one has a fallback. */
    overviewBand: band(page?.overview, TOUR_DEFAULTS.overview),
    categoriesBand: band(page?.categories, TOUR_DEFAULTS.categories),
    galleryBand: band(page?.gallery, TOUR_DEFAULTS.gallery),
    featuredBand: band(page?.featuredHead, TOUR_DEFAULTS.featuredHead),
    journeyBand: band(page?.journeyHead, TOUR_DEFAULTS.journeyHead),
    visitBand: band(page?.visit, TOUR_DEFAULTS.visit),
    visitCtaLabel: page?.visitCtaLabel?.trim() || TOUR_DEFAULTS.visitCtaLabel,
    visitCtaHref: page?.visitCtaHref?.trim() || TOUR_DEFAULTS.visitCtaHref,
    visitCallLabel: page?.visitCallLabel?.trim() || TOUR_DEFAULTS.visitCallLabel,

    /* ⚠ EMPTY UNTIL SEEDED, AND THE COMPONENT FALLS BACK TO ITS OWN ROWS. The
       six featured rooms are the one piece of this band with no sensible
       default here — they are 6 × (title + body + 3 highlights), which belongs
       in the seed, not in a constant in the query layer. */
    featured,
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
/**
 * ⚠⚠ THE FIVE BAND HEADS, IN PAGE ORDER. Their defaults are the copy that used
 * to be hardcoded in the five components, and they live here so there is exactly
 * one of each — see TOUR_DEFAULTS for the full reasoning, which applies
 * unchanged: an unseeded CMS never renders a headless band, and clearing a field
 * in the admin restores the default rather than emptying it.
 *
 * ⚠ TWO HEADINGS COUNT THINGS — "Eleven measures, in three groups" and
 * "Twenty-two routes across Ballia". They are editable like any other line, so
 * an editor who adds a measure must update the heading too; nothing here
 * recomputes them, because the sentence is prose rather than a figure.
 */
const SAFETY_DEFAULTS = {
  timeline: {
    eyebrow: 'What is in place',
    heading: 'Eleven measures, in three groups',
    stand: 'The school publishes five of these. The rest are marked, because a safety page is the last place to guess.',
  },
  plan: {
    eyebrow: 'Where things are',
    heading: 'The campus, point by point',
    stand: 'A schematic — it shows what sits where, not what the buildings look like.',
  },
  transport: {
    eyebrow: 'Getting there and back',
    heading: 'The journey is part of the school day',
    stand: 'Twenty-two routes across Ballia, and a fleet that is tracked and speed-limited on every one of them.',
  },
  wellbeing: {
    eyebrow: 'Looking after the child',
    heading: 'Someone notices',
    stand: 'Equipment keeps a building safe. People are what keep a child feeling safe in it.',
  },
  surveillance: {
    eyebrow: 'Watched over',
    heading: 'Eyes on the campus, all day and all night',
    stand: 'Cameras across the school, and guards on duty every hour of the year.',
  },
};

/** shared.figure — a string figure, so "29+" and "100%" survive as written. */
interface RawFigure { id: number; figure: string; label: string; note: string | null }

interface RawSafetyPage {
  timeline: RawBand | null; plan: RawBand | null; transport: RawBand | null;
  transportFigures: RawFigure[] | null;
  wellbeing: RawBand | null; surveillance: RawBand | null;
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
    /* Band copy — see SAFETY_DEFAULTS for why each carries a fallback. */
    timelineBand: band(p?.timeline, SAFETY_DEFAULTS.timeline),
    planBand: band(p?.plan, SAFETY_DEFAULTS.plan),
    transportBand: band(p?.transport, SAFETY_DEFAULTS.transport),
    /* ⚠ TYPED IN THE CMS, NOT DERIVED FROM Bus Route. getTransportData()
       computes 22 distinct vehicles from the published routes; this band says
       "29+ buses in the fleet". Both can be true — a school can own more buses
       than appear on route sheets — so computing these would silently change a
       published number. It is a content decision, not a refactor. */
    transportFigures: (p?.transportFigures ?? []).map((f) => ({
      value: f.figure, label: f.label, note: f.note,
    })),
    wellbeingBand: band(p?.wellbeing, SAFETY_DEFAULTS.wellbeing),
    surveillanceBand: band(p?.surveillance, SAFETY_DEFAULTS.surveillance),

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
