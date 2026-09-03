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
    }],
    ['Campus Tour Page', TOUR_PAGE, {
      overviewStats: stats(tour.overviewStats),
      journey: points(tour.journey),
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
