/**
 * SEED — CAMPUS, FACILITIES & TRANSPORT (G4).
 *
 *     npm run seed:campus [-- --dry] [-- --force-media]
 *
 *   transport.ts    routes[]            → Bus Route            (collection)
 *                   safety, aliases     → Transport Page       (single)
 *   facilities.ts   kpis, groups, …     → Facilities Page      (single)
 *   campusTour.ts   facilities[]        → Campus Facility      (collection)
 *                   overviewStats, …    → Campus Tour Page     (single)
 *   campus.ts       safety, map, …      → Campus Safety Page   (single)
 *
 * ═══ WHAT IS DELIBERATELY NOT STORED ═══════════════════════════════════════
 *
 * ⚠ THE TRANSPORT COUNTS. `stats.buses`, `stats.runs` and `stats.stops` are
 * computed from the routes themselves — 22 distinct vehicles across 28 runs
 * serving 91 boarding points. They are recomputed in the query layer from Bus
 * Route, so adding a route updates the page. Storing them would give one fact
 * two owners and go stale the first time the school changed a route.
 *
 * ⚠ `coverage`. The stop → runs index is a groupBy over the routes. Same rule.
 *
 * ⚠ `transportContact`. Its phone and display duplicate
 * site-settings.contact.transport / transportDisplay, and its name duplicates
 * transportIncharge. The transport page reads site-settings instead — one
 * number, edited in one place.
 *
 * ⚠ `allItems`, `shot`, `allFrames`. Flattenings of data stored elsewhere.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { buildPhotoComponents } from '../lib/components.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const D = (f) => resolve(HERE, `../../../web/src/data/${f}`);

const BUS = 'api::bus-route.bus-route';
const FACILITY = 'api::campus-facility.campus-facility';
const TRANSPORT_PAGE = 'api::transport-page.transport-page';
const FACILITIES_PAGE = 'api::facilities-page.facilities-page';
const TOUR_PAGE = 'api::campus-tour-page.campus-tour-page';
const SAFETY_PAGE = 'api::campus-safety-page.campus-safety-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

const facts = (arr) => (arr ?? []).map((value) => ({ value }));

/**
 * {eyebrow, heading} → structure.section.
 *
 * ⚠ `eyebrow` BECOMES `kicker`. The component calls the top line `kicker`; the
 * page and the data file call it an eyebrow. This is the one place the two
 * names meet, and getting it wrong is silent — the band just keeps showing its
 * built-in default.
 *
 * Returns null for a missing band so Strapi clears the field rather than
 * writing an empty component nobody can tell apart from a real one.
 */
const band = (b) =>
  b
    ? {
        kicker: b.eyebrow ?? null,
        heading: b.heading || null,
        /* ⚠ THE STANDFIRST IS body[0], because structure.section has no
           single-line stand field. The query layer reads body[0].text back. An
           empty stand writes no paragraph rather than an empty one, so the
           admin shows an empty list instead of a blank row. */
        body: b.stand ? [{ text: b.stand }] : [],
      }
    : null;

/** {count, suffix, label, icon?, note?} → shared.stat */
const stats = (arr) =>
  (arr ?? []).map((s) => ({
    count: s.count, suffix: s.suffix ?? '', label: s.label,
    icon: s.icon ?? null, note: s.note ?? null,
  }));

/**
 * Anything card-shaped → shared.point.
 *
 * ⚠ FIVE DIFFERENT SOURCE SHAPES LAND HERE. whyCards use {icon,title,body},
 * progression uses {label,body,icon}, emergencySteps use {step,label,body},
 * journey uses {id,label,body}. They are the same card on the page and the
 * same component in the CMS; the query layer maps each back to the field names
 * its own component already destructures.
 */
const points = (arr) =>
  (arr ?? []).map((p) => ({
    number: p.n ?? p.step ?? null,
    icon: p.icon ?? p.mark ?? p.id ?? null,
    title: p.title ?? p.label ?? p.k,
    body: p.body ?? p.v,
  }));

/** {label, body, icon?, verified?} → shared.measure */
const measures = (arr) =>
  (arr ?? []).map((m) => ({
    label: m.label, body: m.body,
    icon: m.icon ?? null,
    verified: m.verified !== false,
  }));

await withStrapi(async (strapi) => {
  const transport = await loadWebData(D('transport.ts'));
  const facilities = await loadWebData(D('facilities.ts'));
  const tour = await loadWebData(D('campusTour.ts'));
  const campus = await loadWebData(D('campus.ts'));

  console.log(`\n  Seeding campus / facilities / transport${DRY ? '  (dry run)' : ''}\n`);

  let created = 0, updated = 0, uploaded = 0, reused = 0;
  const seen = new Set();

  /* ── 1 · BUS ROUTES ─────────────────────────────────────────────────────── */
  for (const [i, r] of (transport.routes ?? []).entries()) {
    /* ⚠ THE SLUG MUST DISTINGUISH LEGS. Several buses run a morning and an
       afternoon leg under the same `bus` name; slugging the name alone would
       collide and one leg would overwrite the other. */
    const slug = slugify(`${r.bus}-${r.leg ?? 'run'}-${i}`);
    if (seen.has(slug)) throw new Error(`Duplicate bus-route slug ${slug}`);
    seen.add(slug);

    if (DRY) { created++; continue; }

    const outcome = await upsertBySlug(strapi, BUS, slug, {
      bus: r.bus, vehicle: r.vehicle, leg: r.leg ?? null,
      driver: r.driver, phone: r.phone,
      stops: facts(r.stops),
      staffOnly: Boolean(r.staffOnly),
      displayOrder: i,
    });
    outcome === 'created' ? created++ : updated++;
  }
  console.log(`    bus routes          ${(transport.routes ?? []).length}`);

  /* ── 2 · CAMPUS FACILITIES (tour, with galleries) ───────────────────────── */
  let facCreated = 0, facUpdated = 0;
  for (const [i, f] of (tour.facilities ?? []).entries()) {
    const slug = f.id ?? slugify(f.name);
    if (DRY) { facCreated++; continue; }

    const gallery = await buildPhotoComponents(
      strapi,
      (f.images ?? []).map((img) => ({ image: img, alt: f.alt })),
      { prefix: `campus-${slug}`, force: FORCE_MEDIA },
    );
    uploaded += gallery.uploaded;
    reused += gallery.reused;

    const outcome = await upsertBySlug(strapi, FACILITY, slug, {
      name: f.name, blurb: f.blurb, brief: f.brief ?? null,
      alt: f.alt, pending: Boolean(f.pending),
      gallery: gallery.entries,
      displayOrder: i,
    });
    outcome === 'created' ? facCreated++ : facUpdated++;
  }
  console.log(`    campus facilities   ${(tour.facilities ?? []).length}`);

  if (DRY) {
    console.log(`\n  Would create ${created} routes, ${facCreated} facilities, 4 page singles\n`);
    return;
  }

  /* ── 3 · THE FOUR PAGE SINGLES ──────────────────────────────────────────── */
  const singles = [
    ['Transport Page', TRANSPORT_PAGE, {
      overview: band(transport.transportBands?.overview),
      overviewCta: transport.transportBands?.cta ?? null,
      overviewFigures: measures(transport.transportBands?.figures),
      finder: band(transport.transportBands?.finder),
      finderSearchLabel: transport.transportBands?.finderCopy?.searchLabel ?? null,
      finderAreasHeading: transport.transportBands?.finderCopy?.areasHeading ?? null,
      finderStaffNote: transport.transportBands?.finderCopy?.staffNote ?? null,
      finderDriverNote: transport.transportBands?.finderCopy?.driverNote ?? null,
      finderEmptyHeading: transport.transportBands?.finderCopy?.emptyHeading ?? null,
      finderEmptyBody: transport.transportBands?.finderCopy?.emptyBody ?? null,
      finderEmptyCta: transport.transportBands?.finderCopy?.emptyCta ?? null,
      safetyHead: band(transport.transportBands?.safetyHead),
      contactHead: band(transport.transportBands?.contactHead),
      safety: measures(transport.safety),
      /* A plain map of misspelling → canonical stop. JSON because it is a
         lookup table, not a list an editor adds rows to one at a time. */
      stopAliases: transport.stopAliases ?? {},
    }],
    ['Facilities Page', FACILITIES_PAGE, {
      kpis: stats(facilities.kpis),
      groups: (facilities.groups ?? []).map((g) => ({
        groupId: g.id, eyebrow: g.eyebrow ?? null, title: g.title, stand: g.stand ?? null,
        items: (g.items ?? []).map((it) => ({
          label: it.label, body: it.body, icon: it.icon ?? null,
          unlisted: Boolean(it.unlisted), photo: it.photo ?? null,
        })),
      })),
      whyCards: points(facilities.whyCards),
      progression: points(facilities.progression),
      figures: band(facilities.facilitiesBands?.figures),
    }],
    /*
     * ⚠ `band()` MAPS eyebrow → kicker. structure.section calls its top line
     * `kicker`; the page calls it an eyebrow. Same line, two names, and the
     * query layer maps it back — so a field seeded as `eyebrow` lands nowhere
     * and the band silently shows its default for ever.
     *
     * ⚠ THE SIX FEATURED ROOMS GO IN AS shared.point, with `icon` carrying the
     * facility id and `tags` the highlights — the same shape `journey` already
     * uses, which is why `points()` handles it unchanged apart from the tags.
     */
    ['Campus Tour Page', TOUR_PAGE, {
      overview: band(tour.bands?.overview),
      overviewStats: stats(tour.overviewStats),
      categories: band(tour.bands?.categories),
      gallery: band(tour.bands?.gallery),
      featuredHead: band(tour.bands?.featured),
      featured: (tour.featured ?? []).map((r) => ({
        icon: r.id, title: r.title, body: r.body, tags: facts(r.highlights),
      })),
      journeyHead: band(tour.bands?.journey),
      journey: points(tour.journey),
      visitCtaLabel: tour.visitCta?.label ?? null,
      visitCtaHref: tour.visitCta?.href ?? null,
      visitCallLabel: tour.visitCta?.callLabel ?? null,
      visit: band(tour.bands?.visit),
    }],
    ['Campus Safety Page', SAFETY_PAGE, {
      safetyGroups: (campus.safetyGroups ?? []).map((g) => ({
        groupId: g.id, numeral: g.numeral ?? null, title: g.title, stand: g.stand ?? null,
        measures: measures(g.measures),
      })),
      mapPoints: (campus.mapPoints ?? []).map((p) => ({
        pointId: p.id, label: p.label, body: p.body,
        x: p.x, y: p.y, verified: p.verified !== false, photo: p.photo ?? null,
      })),
      emergencySteps: points(campus.emergencySteps),
      emergencyPoints: measures(campus.emergencyPoints),
      transportFeatures: measures(campus.transportFeatures),
      timeline: band(campus.safetyBands?.timeline),
      plan: band(campus.safetyBands?.plan),
      transport: band(campus.safetyBands?.transport),
      /* shared.figure keeps `figure` a STRING, so "29+" and "100%" survive. */
      transportFigures: (campus.transportFigures ?? []).map((f) => ({
        figure: f.value, label: f.label, note: f.note ?? null,
      })),
      wellbeing: band(campus.safetyBands?.wellbeing),
      surveillance: band(campus.safetyBands?.surveillance),
      wellbeingCards: points(campus.wellbeingCards),
      surveillanceCards: points(campus.surveillanceCards),
    }],
  ];

  for (const [label, uid, data] of singles) {
    const outcome = await upsertSingle(strapi, uid, data);
    console.log(`    ${label.padEnd(20)}${outcome}`);
  }

  console.log('');
  console.log(`  Routes     — ${created} created, ${updated} updated`);
  console.log(`  Facilities — ${facCreated} created, ${facUpdated} updated`);
  console.log(`  Media      — ${uploaded} uploaded, ${reused} reused`);
  console.log('');
});
