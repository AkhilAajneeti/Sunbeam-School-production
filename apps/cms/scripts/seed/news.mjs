/**
 * SEED — NEWS (newsPages.ts + newsEvents.ts → news-item, news-category-page).
 *
 *     npm run seed:news [-- --dry] [-- --force-media]
 *
 * ═══ FOUR INDEX/DETAIL PAIRS BECOME ONE COLLECTION ═════════════════════════
 *
 * data/newsPages.ts exported four ChroniclePage objects — workshops,
 * competitions, celebrations, schoolEvents — each with the identical shape:
 * a page header, a handful of named groups, and items inside them. They are one
 * content type separated by `category`, and the group headers live on a
 * companion `news-category-page` record.
 *
 * ═══ WHAT IS DELIBERATELY *NOT* SEEDED ═════════════════════════════════════
 *
 * ⚠ THE ACHIEVEMENTS CHRONICLE. data/newsEvents.ts builds it with
 * `majors.map(...)` — every field is a projection of a Major Achievement that
 * G1 already migrated. Copying those three items in here would give one fact two
 * owners, and an editor correcting a Major would find the chronicle still
 * showing the old wording. Its PAGE HEADER is seeded (it is genuine page copy);
 * its items are derived at query time.
 *
 * ⚠ THE /news-events/ LANDING STREAMS. Three of its six streams derive from
 * collections that do not exist yet — sports records (G5) and parent workshops
 * (G8). Freezing them into the CMS now is exactly the duplication-of-derived-
 * values that was ruled out for /campus/transport/. The landing page is revisited
 * after G5 and G8.
 *
 * ═══ GALLERIES ════════════════════════════════════════════════════════════
 *
 * ⚠ `photoDir` NAMED A FOLDER; THE CMS HOLDS THE PHOTOGRAPHS. The source pointed
 * at a directory and let a Vite glob decide the contents, which meant adding a
 * photograph to an event was a repository commit. The seed resolves the folder
 * once — in the same natural sort the site used — and uploads what it finds.
 *
 * ⚠ ALT TEXT IS STORED WITHOUT ITS POSITION. The site renders
 * "<title> at Sunbeam School Ballia — photograph 3 of 12"; only the first half is
 * stored, because "3 of 12" is a fact about the array and goes stale the moment
 * an editor adds a photograph. The component still appends it.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { buildPhotoComponents } from '../lib/components.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const NEWS_PAGES = resolve(HERE, '../../../web/src/data/newsPages.ts');
const NEWS_EVENTS = resolve(HERE, '../../../web/src/data/newsEvents.ts');
const PHOTOS = resolve(HERE, '../../../web/src/data/workshopPhotos.ts');

const ITEM = 'api::news-item.news-item';
const PAGE = 'api::news-category-page.news-category-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

/** ChroniclePage export name → the `category` enum value on news-item. */
const CATEGORY = {
  workshops: 'workshop',
  competitions: 'competition',
  celebrations: 'celebration',
  schoolEvents: 'school-event',
};

const S = 'Sunbeam School Ballia';

await withStrapi(async (strapi) => {
  const np = await loadWebData(NEWS_PAGES);
  const ne = await loadWebData(NEWS_EVENTS);
  const { photosFor } = await loadWebData(PHOTOS);

  const pages = {
    workshops: np.workshops,
    competitions: np.competitions,
    celebrations: np.celebrations,
    schoolEvents: np.schoolEvents,
    /* Header only — see the file note. */
    achievements: ne.achievementsPage,
  };

  console.log(`\n  Seeding news${DRY ? '  (dry run)' : ''}\n`);

  let pagesCreated = 0;
  let pagesUpdated = 0;
  let itemsCreated = 0;
  let itemsUpdated = 0;
  let uploaded = 0;
  let reused = 0;
  let galleryPhotos = 0;
  const seenSlugs = new Set();

  let pageOrder = 0;
  for (const [key, page] of Object.entries(pages)) {
    /* ── the index page's own copy ─────────────────────────────────────── */
    if (!DRY) {
      const outcome = await upsertBySlug(strapi, PAGE, page.slug, {
        title: page.title,
        standfirst: page.standfirst,
        eyebrow: page.eyebrow,
        heading: page.heading,
        stand: page.stand,
        groups: page.groups.map((g) => ({
          groupId: g.id,
          label: g.label,
          note: g.note ?? null,
        })),
        displayOrder: pageOrder,
      });
      outcome === 'created' ? pagesCreated++ : pagesUpdated++;
    } else {
      pagesCreated++;
    }
    pageOrder++;

    /* ⚠ The achievements chronicle has NO items of its own. */
    if (key === 'achievements') {
      console.log(`    ${page.slug.padEnd(14)} header only (items derive from Major Achievement)`);
      continue;
    }

    const category = CATEGORY[key];
    let order = 0;
    let n = 0;

    for (const group of page.groups) {
      for (const item of group.items) {
        const slug = item.slug;
        if (!slug) throw new Error(`${key}: item "${item.title}" has no slug`);

        /* ⚠ SLUGS ARE UNIQUE ACROSS THE WHOLE COLLECTION, not per category —
           four chronicles are one table now. A collision would silently
           overwrite; this stops the seed instead. */
        if (seenSlugs.has(slug)) {
          throw new Error(`Duplicate news-item slug "${slug}" (in ${key})`);
        }
        seenSlugs.add(slug);

        if (DRY) {
          const photos = item.art ? 1 : (item.photoDir ? '?' : 0);
          console.log(`    ${category.padEnd(14)} ${slug.padEnd(38)} photos=${photos}`);
          itemsCreated++;
          order++;
          n++;
          continue;
        }

        /* The card face / hero. Only three items carry one. */
        let artId = null;
        if (item.art?.absolutePath) {
          const r = await uploadMedia(strapi, {
            absolutePath: item.art.absolutePath,
            name: `news-${slug}-art`,
            alternativeText: `${item.title} at ${S}`,
            caption: item.title,
            force: FORCE_MEDIA,
          });
          r.reused ? reused++ : uploaded++;
          artId = r.file.id;
        }

        /* ⚠ THE GALLERY IS RESOLVED BY THE SITE'S OWN FUNCTION, not by re-globbing
           here. data/workshopPhotos.ts owns the ordering rule — natural sort, so
           "photo 2" precedes "photo 10" — and the skip-list semantics. Calling it
           means the CMS gallery is in the same order the page has always shown,
           rather than in whatever order a second implementation happened to pick. */
        const resolved = item.photoDir
          ? photosFor(item.photoDir, item.photoSkip ?? [])
          : [];

        const gallery = await buildPhotoComponents(
          strapi,
          resolved.map((img) => ({ image: img, alt: `${item.title} at ${S}` })),
          { prefix: `news-${slug}`, force: FORCE_MEDIA },
        );
        uploaded += gallery.uploaded;
        reused += gallery.reused;
        galleryPhotos += gallery.entries.length;

        const outcome = await upsertBySlug(strapi, ITEM, slug, {
          title: item.title,
          category,
          group: group.id,
          meta: item.meta,
          body: item.body,
          result: item.result ?? null,
          when: item.when ?? null,
          href: item.href ?? null,
          fit: item.fit === 'contain' ? 'contain' : 'cover',
          art: artId,
          gallery: gallery.entries,
          displayOrder: order,
        });

        outcome === 'created' ? itemsCreated++ : itemsUpdated++;
        order++;
        n++;
      }
    }

    console.log(`    ${page.slug.padEnd(14)} ${String(n).padStart(3)} items`);
  }

  console.log('');
  console.log(`  Pages — ${pagesCreated} created, ${pagesUpdated} updated`);
  console.log(`  Items — ${itemsCreated} created, ${itemsUpdated} updated`);
  if (!DRY) console.log(`  Media — ${uploaded} uploaded, ${reused} reused (${galleryPhotos} gallery photos)`);
  console.log('');
});
