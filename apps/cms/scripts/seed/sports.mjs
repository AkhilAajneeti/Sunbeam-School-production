/**
 * SEED — SPORTS, EXCURSIONS & SCHOOL ACTIVITIES (G5).
 *
 *     npm run seed:sports [-- --dry] [-- --force-media]
 *
 *   sports.ts           facilities[]      → Sport Facility      (collection)
 *                       games.outdoor/indoor → Game             (collection, `arena` enum)
 *                       figures, ladder, coaching → Sports Page (single)
 *   sportsRecord.ts     record[]          → Sports Record       (collection)
 *   excursions.ts       sections[]        → Excursion Section   (collection)
 *                       expeditions[]     → Expedition          (collection)
 *   schoolActivities.ts ChroniclePage     → News Item + News Category Page
 *
 * ═══ SCHOOL ACTIVITIES REUSE news-item ═════════════════════════════════════
 *
 * ⚠ NO NEW CONTENT TYPE FOR THEM. data/schoolActivities.ts is typed
 * `ChroniclePage` — the same page → groups → items shape the four news
 * chronicles use, down to the field names. It is seeded as category `activity`
 * with its own News Category Page record. A separate type would have been the
 * same six columns under a second name, and an editor would have had to learn
 * two identical forms.
 *
 * ⚠ THE CATEGORY IS `activity`, NOT `school-activity`. `school-event` already
 * exists for /news-events/school-events/, and two enum values differing by one
 * word is a filter someone gets wrong at 5pm.
 *
 * ═══ WHAT IS NOT STORED ════════════════════════════════════════════════════
 *
 * ⚠ `activityItems`, `PER_PAGE`, `pageCount`, `activityPage(n)`. The whole
 * pagination is arithmetic over the items — six per page, ceil of the count.
 * It is recomputed in the query layer so /page/2/ follows the content instead
 * of a stored number.
 *
 * ⚠ `sports.achievements`. Dead in the source — no component imports it, and
 * every entry is already a Major Achievement or a Sports Record.
 *
 * ⚠ `shot` / `photo`. Filename → image lookup maps built by a Vite glob. The
 * seed resolves each `shots: string[]` through them and uploads the result, so
 * the CMS holds photographs rather than filenames pointing at a folder.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { buildPhotoComponents } from '../lib/components.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const D = (f) => resolve(HERE, `../../../web/src/data/${f}`);

const FACILITY = 'api::sport-facility.sport-facility';
const GAME = 'api::game.game';
const RECORD = 'api::sports-record.sports-record';
const SECTION = 'api::excursion-section.excursion-section';
const EXPEDITION = 'api::expedition.expedition';
const SPORTS_PAGE = 'api::sports-page.sports-page';
const NEWS_ITEM = 'api::news-item.news-item';
const NEWS_PAGE = 'api::news-category-page.news-category-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

const facts = (a) => (a ?? []).map((value) => ({ value }));
const paras = (a) => (a ?? []).filter(Boolean).map((text) => ({ text }));

await withStrapi(async (strapi) => {
  const sports = await loadWebData(D('sports.ts'));
  const rec = await loadWebData(D('sportsRecord.ts'));
  const exc = await loadWebData(D('excursions.ts'));
  const acts = await loadWebData(D('schoolActivities.ts'));
  /* ⚠ photosFor LIVES IN workshopPhotos.ts, NOT schoolActivities.ts. Seeding
     with a  fallback silently gave every activity an empty
     gallery — ten items with no photographs and no error anywhere. */
  const { photosFor } = await loadWebData(D('workshopPhotos.ts'));

  console.log(`\n  Seeding sports / excursions / activities${DRY ? '  (dry run)' : ''}\n`);

  const tally = { created: 0, updated: 0, uploaded: 0, reused: 0 };
  const bump = (o) => (o === 'created' ? tally.created++ : tally.updated++);
  const media = (r) => { r.reused ? tally.reused++ : tally.uploaded++; };

  /** shots:[filename] → shared.photo entries, resolved through a lookup map. */
  const shotsToPhotos = async (names, lookup, prefix, alt) => {
    const imgs = (names ?? []).map((n) => lookup?.[n]).filter(Boolean);
    const built = await buildPhotoComponents(
      strapi, imgs.map((image) => ({ image, alt })), { prefix, force: FORCE_MEDIA },
    );
    tally.uploaded += built.uploaded;
    tally.reused += built.reused;
    return built.entries;
  };

  /* ── 1 · SPORT FACILITIES ───────────────────────────────────────────────── */
  for (const [i, f] of (sports.facilities ?? []).entries()) {
    const slug = f.id ?? slugify(f.name);
    if (DRY) { tally.created++; continue; }

    let leadId = null;
    if (f.lead?.absolutePath) {
      const r = await uploadMedia(strapi, {
        absolutePath: f.lead.absolutePath, name: `sport-${slug}-lead`,
        alternativeText: f.alt ?? f.name, force: FORCE_MEDIA,
      });
      media(r); leadId = r.file.id;
    }

    const support = await buildPhotoComponents(
      strapi, (f.support ?? []).map((image) => ({ image, alt: f.alt ?? f.name })),
      { prefix: `sport-${slug}`, force: FORCE_MEDIA },
    );
    tally.uploaded += support.uploaded; tally.reused += support.reused;

    bump(await upsertBySlug(strapi, FACILITY, slug, {
      name: f.name, kicker: f.kicker ?? null, body: f.body,
      brief: f.brief ?? null, notes: facts(f.notes), alt: f.alt ?? null,
      lead: leadId, support: support.entries, displayOrder: i,
    }));
  }
  console.log(`    sport facilities   ${(sports.facilities ?? []).length}`);

  /* ── 2 · GAMES (one type, arena enum) ───────────────────────────────────── */
  let gi = 0;
  for (const arena of ['outdoor', 'indoor']) {
    for (const g of sports.games?.[arena] ?? []) {
      const slug = slugify(`${g.name}-${arena}`);
      if (DRY) { tally.created++; gi++; continue; }

      let photoId = null;
      if (g.photo?.absolutePath) {
        const r = await uploadMedia(strapi, {
          absolutePath: g.photo.absolutePath, name: `game-${slug}`,
          alternativeText: g.alt ?? g.name, force: FORCE_MEDIA,
        });
        media(r); photoId = r.file.id;
      }

      bump(await upsertBySlug(strapi, GAME, slug, {
        name: g.name, arena, icon: g.icon, blurb: g.blurb,
        venue: g.venue ?? null, alt: g.alt ?? null, photo: photoId, displayOrder: gi++,
      }));
    }
  }
  console.log(`    games              ${gi}`);

  /* ── 3 · SPORTS RECORD ──────────────────────────────────────────────────── */
  for (const [i, b] of (rec.record ?? []).entries()) {
    const slug = b.id ?? slugify(b.title);
    if (DRY) { tally.created++; continue; }

    bump(await upsertBySlug(strapi, RECORD, slug, {
      title: b.title, kicker: b.kicker ?? null, body: b.body,
      more: b.more ?? null, alt: b.alt ?? null,
      podiums: (b.podiums ?? []).map((p) => ({ event: p.event, places: facts(p.places) })),
      shots: await shotsToPhotos(b.shots, rec.shot, `record-${slug}`, b.alt ?? b.title),
      displayOrder: i,
    }));
  }
  console.log(`    sports records     ${(rec.record ?? []).length}`);

  /* ── 4 · EXCURSION SECTIONS ─────────────────────────────────────────────── */
  for (const [i, s] of (exc.sections ?? []).entries()) {
    const slug = s.id ?? slugify(s.title);
    if (DRY) { tally.created++; continue; }

    let artId = null;
    if (s.art?.absolutePath) {
      const r = await uploadMedia(strapi, {
        absolutePath: s.art.absolutePath, name: `excursion-${slug}-art`,
        alternativeText: s.alt ?? s.title, force: FORCE_MEDIA,
      });
      media(r); artId = r.file.id;
    }

    bump(await upsertBySlug(strapi, SECTION, slug, {
      title: s.title, body: paras(s.body), place: s.place ?? null,
      year: s.year ?? null, who: s.who ?? null, lang: s.lang ?? null,
      needs: s.needs ?? null, alt: s.alt ?? null, art: artId,
      shots: await shotsToPhotos(s.shots, exc.photo, `excursion-${slug}`, s.alt ?? s.title),
      displayOrder: i,
    }));
  }
  console.log(`    excursion sections ${(exc.sections ?? []).length}`);

  /* ── 5 · EXPEDITIONS ────────────────────────────────────────────────────── */
  for (const [i, e] of (exc.expeditions ?? []).entries()) {
    const slug = slugify(e.name);
    if (DRY) { tally.created++; continue; }
    bump(await upsertBySlug(strapi, EXPEDITION, slug, {
      name: e.name, note: e.note, kind: e.kind, icon: e.icon ?? null, displayOrder: i,
    }));
  }
  console.log(`    expeditions        ${(exc.expeditions ?? []).length}`);

  /* ── 6 · SCHOOL ACTIVITIES → news-item (category: activity) ─────────────── */
  const page = acts.schoolActivities;
  let actCount = 0;
  if (!DRY && page) {
    bump(await upsertBySlug(strapi, NEWS_PAGE, page.slug, {
      title: page.title, standfirst: page.standfirst, eyebrow: page.eyebrow,
      heading: page.heading, stand: page.stand,
      groups: (page.groups ?? []).map((g) => ({ groupId: g.id, label: g.label, note: g.note ?? null })),
      displayOrder: 5,
    }));

    let order = 0;
    for (const g of page.groups ?? []) {
      for (const item of g.items ?? []) {
        const slug = item.slug;
        if (!slug) throw new Error(`Activity "${item.title}" has no slug`);

        let artId = null;
        if (item.art?.absolutePath) {
          const r = await uploadMedia(strapi, {
            absolutePath: item.art.absolutePath, name: `activity-${slug}-art`,
            alternativeText: item.alt ?? item.title, force: FORCE_MEDIA,
          });
          media(r); artId = r.file.id;
        }

        const gallery = item.photoDir
          ? await buildPhotoComponents(
              strapi,
              photosFor(item.photoDir, item.photoSkip ?? [])
                .map((image) => ({ image, alt: `${item.title} at Sunbeam School Ballia` })),
              { prefix: `activity-${slug}`, force: FORCE_MEDIA },
            )
          : { entries: [], uploaded: 0, reused: 0 };
        tally.uploaded += gallery.uploaded; tally.reused += gallery.reused;

        bump(await upsertBySlug(strapi, NEWS_ITEM, slug, {
          title: item.title, category: 'activity', group: g.id,
          meta: item.meta, body: item.body,
          result: item.result ?? null, when: item.when ?? null, href: item.href ?? null,
          fit: item.fit === 'contain' ? 'contain' : 'cover',
          art: artId, gallery: gallery.entries, displayOrder: order++,
        }));
        actCount++;
      }
    }
  }
  console.log(`    school activities  ${actCount}`);

  /* ⚠ THE PARTICIPATION MOSAIC'S FIVE PHOTOGRAPHS.
     data/sports.ts exposed them through a named map () and the
     band picked five by name. They are photographs of the school, which makes
     them editable content — the LAYOUT (which tile each occupies) stays in the
     component, because that is design. Order here is the order the mosaic
     reads them in. */
  const MONTAGE = ['joshArch', 'courtHoop', 'parkSwings', 'joshNetsWide', 'parkTube'];
  const MONTAGE_ALT = [
    'The JOSH ground at Sunbeam School Ballia, seen through the school gateway arch',
    'The basketball court at Sunbeam School Ballia',
    'The junior playground swings at Sunbeam School Ballia',
    'Volleyball nets on the JOSH ground at Sunbeam School Ballia',
    'Climbing frames in the junior playground at Sunbeam School Ballia',
  ];

  /* ── 7 · SPORTS PAGE ────────────────────────────────────────────────────── */
  if (!DRY) {
    const montage = await buildPhotoComponents(
      strapi,
      MONTAGE.map((k, i) => ({ image: sports.img?.[k], alt: MONTAGE_ALT[i] })).filter((m) => m.image),
      { prefix: 'sports-montage', force: FORCE_MEDIA },
    );
    tally.uploaded += montage.uploaded; tally.reused += montage.reused;

    const outcome = await upsertSingle(strapi, SPORTS_PAGE, {
      montage: montage.entries,
      figures: (sports.figures ?? []).map((f) => ({
        figure: String(f.figure), label: f.label, note: f.note ?? null,
      })),
      ladder: (sports.ladder ?? []).map((r) => ({
        step: r.step, title: r.title, body: r.body, items: facts(r.items),
        milestone: r.milestone ?? null, glyph: r.glyph ?? null,
        accent: r.accent ?? 'teal', pending: Boolean(r.pending),
      })),
      coaching: (sports.coaching ?? []).map((c) => ({
        icon: c.icon ?? null, figure: c.figure ?? null,
        title: c.title, body: c.body, proof: c.proof ?? null,
      })),
    });
    console.log(`    sports page        ${outcome}`);
  }

  console.log('');
  console.log(`  ${tally.created} created, ${tally.updated} updated`);
  if (!DRY) console.log(`  Media — ${tally.uploaded} uploaded, ${tally.reused} reused`);
  console.log('');
});
