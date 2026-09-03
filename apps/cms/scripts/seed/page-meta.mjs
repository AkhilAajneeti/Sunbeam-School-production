/**
 * SEED — PAGE META (fixtures/page-meta.json → api::page-meta).
 *
 *     npm run seed:page-meta [-- --dry] [-- --force-media]
 *
 * ⚠ IT SEEDS FROM THE FIXTURE, NOT FROM THE .astro FILES. Extraction is a
 * separate, reviewable step (scripts/extract/) so that what lands in the
 * database is something a human read first. Re-extract, diff the fixture, then
 * seed.
 *
 * ⚠ IDENTITY IS THE ROUTE. `/academics/philosophy/` — with both slashes, exactly
 * as Astro serves it. That is what the page will look itself up by, so any
 * normalising difference between here and the lookup is a page that silently
 * finds no metadata.
 *
 * ═══ MEDIA IS KEYED ON THE SOURCE FILE, NOT ON THE ROUTE ═══════════════════
 *
 * ⚠ 71 ROUTES SHARE 39 BANNERS — sunbeem-1.jpg alone is the banner for fourteen
 * pages. Naming each upload after its route would put fourteen byte-identical
 * copies in the media library, and an editor replacing "the campus photo" would
 * have to find and change all fourteen. Naming after the SOURCE PATH means one
 * upload, fourteen references, and one place to change it.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertByKey } from '../lib/upsert.mjs';
import { slugify } from '../lib/slug.mjs';

/**
 * ⚠ HTML ENTITIES ARE DECODED ON THE WAY IN, NOT LEFT AS TYPED.
 *
 * These rows were extracted from RENDERED pages, so a description that reads
 * "Calendar & Monthly Planner" arrived as "Calendar &#38; Monthly Planner" —
 * already escaped once. Storing that and letting Astro escape it again produced
 *
 *     <meta name="description" content="… Calendar &#38;#38; Monthly Planner …">
 *
 * which is what a search result and every shared link would print. The CMS
 * should hold the CHARACTER; escaping is the renderer's job and it only gets to
 * do it once. Caught by comparing head tags against production — the page text
 * was identical, because the fault was in an attribute.
 */
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
};
const decode = (v) =>
  typeof v === 'string'
    ? v.replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (whole, e) => {
        if (e[0] === '#') {
          const code = e[1] === 'x' || e[1] === 'X'
            ? parseInt(e.slice(2), 16)
            : parseInt(e.slice(1), 10);
          return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
        }
        return ENTITIES[e.toLowerCase()] ?? whole;
      })
    : v;


const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = resolve(HERE, '../fixtures/page-meta.json');
const WEB_SRC = resolve(HERE, '../../../web/src');
const UID = 'api::page-meta.page-meta';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

/** 'assets/photos/sunbeem-1.jpg' → 'banner-photos-sunbeem-1' */
const mediaName = (rel) =>
  `banner-${slugify(rel.replace(/^assets\//, '').replace(/\.[a-z0-9]+$/i, ''))}`;

await withStrapi(async (strapi) => {
  const { rows } = JSON.parse(await readFile(FIXTURE, 'utf8'));

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(`No rows in ${FIXTURE} — run the extractors first`);
  }

  console.log(`\n  Seeding ${rows.length} page-meta rows${DRY ? '  (dry run)' : ''}\n`);

  let created = 0;
  let updated = 0;
  let uploaded = 0;
  let reused = 0;
  const noBanner = [];
  const bannerCache = new Map();

  for (const row of rows) {
    

    if (DRY) {
      console.log(`    ${row.route.padEnd(46)} ${row.banner ? 'banner' : '—'}`);
      created++;
      continue;
    }

    let bannerId = null;
    if (row.banner) {
      if (bannerCache.has(row.banner)) {
        bannerId = bannerCache.get(row.banner);
        reused++;
      } else {
        const abs = join(WEB_SRC, row.banner);
        const { file, reused: wasReused } = await uploadMedia(strapi, {
          absolutePath: abs,
          name: mediaName(row.banner),
          alternativeText: row.heroAlt ?? row.heroTitle ?? null,
          force: FORCE_MEDIA,
        });
        wasReused ? reused++ : uploaded++;
        bannerId = file.id;
        bannerCache.set(row.banner, bannerId);
      }
    } else {
      noBanner.push(row.route);
    }

    const outcome = await upsertByKey(strapi, UID, 'route', row.route, {
      seo: {
        metaTitle: decode(row.seo.metaTitle),
        metaDescription: decode(row.seo.metaDescription),
        noIndex: Boolean(row.seo.noIndex),
      },
      titleStandalone: Boolean(row.titleStandalone),
      heroTitle: decode(row.heroTitle) ?? null,
      heroStandfirst: decode(row.heroStandfirst) ?? null,
      heroAlt: decode(row.heroAlt) ?? null,
      heroPosition: row.heroPosition ?? null,
      heroBanner: bannerId,
      crumbs: (row.crumbs ?? []).map((c) => ({
        label: decode(c.label),
        href: c.href,
        description: null,
        external: false,
      })),
    });

    outcome === 'created' ? created++ : updated++;
  }

  console.log(`  Done — ${created} created, ${updated} updated`);
  if (!DRY) {
    console.log(`  Media — ${uploaded} uploaded, ${reused} reused (${bannerCache.size} distinct banners)`);
  }
  if (noBanner.length) {
    console.log(`\n  No banner (by design — these pages open on their own hero):`);
    for (const r of noBanner) console.log(`    ${r}`);
  }
  console.log('');
});
