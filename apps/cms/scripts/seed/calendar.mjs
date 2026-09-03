/**
 * SEED — CALENDAR DOCUMENTS (academicCalendar.ts → api::calendar-document).
 *
 *     npm run seed:calendar [-- --dry] [-- --force-media]
 *
 * ⚠ THE PDFs MOVE INTO THE MEDIA LIBRARY, NOT JUST THEIR PATHS. The source
 * points at /calendar/*.pdf in apps/web/public/, which means publishing next
 * year's planner is currently a developer task: drop a file in the repo, edit a
 * path, rebuild. Uploading them makes it what it should be — the office replaces
 * a file in the admin.
 *
 * `href` survives as a fallback for anything genuinely external, and the query
 * layer prefers the uploaded document when one exists. Nothing in the UI
 * changes: the download link resolves to a URL either way.
 *
 * ⚠ TWO SHAPES IN ONE COLLECTION, SEPARATED BY `kind`. Some years the school
 * published a PDF; 2024 exists only as seven scanned sheets. The card renders
 * differently for each and the source models it with an optional `sheets` array,
 * so `kind` is carried across rather than inferred — a PDF year with no file
 * attached yet is still a PDF year, and should not silently render as a gallery.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, basename } from 'node:path';
import { access } from 'node:fs/promises';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { buildPhotoComponents, toPoints } from '../lib/components.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/academicCalendar.ts');
const PUBLIC_DIR = resolve(HERE, '../../../web/public');
const UID = 'api::calendar-document.calendar-document';
const PAGE_UID = 'api::academic-calendar-page.academic-calendar-page';

const args = new Set(process.argv.slice(2));
const FORCE_MEDIA = args.has('--force-media');
const DRY = args.has('--dry');

const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

await withStrapi(async (strapi) => {
  const { calendars, calendarSource, calendarCarries, calendarPlanning } =
    await loadWebData(DATA_FILE);

  if (!Array.isArray(calendars) || calendars.length === 0) {
    throw new Error(`Expected a non-empty "calendars" array in ${DATA_FILE}`);
  }

  console.log(`\n  Seeding ${calendars.length} calendar documents${DRY ? '  (dry run)' : ''}\n`);

  let created = 0;
  let updated = 0;
  let uploaded = 0;
  let reused = 0;
  let docsUploaded = 0;

  for (const [index, c] of calendars.entries()) {
    /* The year is the identity — "2026–27" slugs to 2026-27. Note the source
       uses an EN DASH, which slugify folds to a hyphen. */
    const slug = slugify(c.year);

    if (DRY) {
      console.log(`    ${slug.padEnd(10)} ${c.kind}${c.sheets ? ` · ${c.sheets.length} sheets` : ''}${c.href ? ' · pdf' : ''}`);
      created++;
      continue;
    }

    if (!c.image?.absolutePath) throw new Error(`Calendar "${slug}" has no cover image`);

    const cover = await uploadMedia(strapi, {
      absolutePath: c.image.absolutePath,
      name: `calendar-${slug}-cover`,
      alternativeText: c.alt,
      caption: `${c.type} ${c.year}`,
      force: FORCE_MEDIA,
    });
    cover.reused ? reused++ : uploaded++;

    /* The PDF, where the source names one that actually exists on disk. */
    let documentId = null;
    if (c.href?.startsWith('/')) {
      const pdfPath = join(PUBLIC_DIR, c.href.replace(/^\/+/, ''));
      if (await exists(pdfPath)) {
        const doc = await uploadMedia(strapi, {
          absolutePath: pdfPath,
          name: `calendar-${slug}-${basename(c.href, '.pdf')}`,
          caption: `${c.type} ${c.year}`,
          force: FORCE_MEDIA,
        });
        doc.reused ? reused++ : (uploaded++, docsUploaded++);
        documentId = doc.file.id;
      } else {
        /* Loud, not silent: a broken download link on a calendar page is the
           kind of thing nobody notices until a parent needs the dates. */
        console.warn(`    ⚠ ${slug}: href "${c.href}" has no file at ${pdfPath} — left as a plain link`);
      }
    }

    const sheets = await buildPhotoComponents(strapi, c.sheets, {
      prefix: `calendar-${slug}-sheet`,
      force: FORCE_MEDIA,
    });
    uploaded += sheets.uploaded;
    reused += sheets.reused;

    const outcome = await upsertBySlug(strapi, UID, slug, {
      year: c.year,
      type: c.type,
      alt: c.alt,
      kind: c.kind,
      href: c.href ?? null,
      size: c.size ?? null,
      extent: c.extent ?? null,
      current: Boolean(c.current),
      image: cover.file.id,
      document: documentId,
      sheets: sheets.entries,
      displayOrder: index,
    });

    outcome === 'created' ? created++ : updated++;
    console.log(`    ${outcome.padEnd(7)}  ${slug.padEnd(10)} ${c.kind}${sheets.entries.length ? ` · ${sheets.entries.length} sheets` : ''}${documentId ? ' · pdf' : ''}`);
  }

  /* ── THE PAGE'S OWN PROSE ───────────────────────────────────────────────
     Everything on /academics/academic-calendar/ that is not one of the
     documents above: the source link and the two card strips. A Single Type,
     because there is exactly one such page — and the first real use of
     shared.point, whose `{ n, mark, k, v }` shape these two arrays already
     have and which recurs in a dozen other data files. */
  if (!DRY) {
    const outcome = await upsertSingle(strapi, PAGE_UID, {
      source: calendarSource ?? null,
      carries: toPoints(calendarCarries),
      planning: toPoints(calendarPlanning),
      seo: {
        metaTitle: 'Academic Calendar — Sunbeam School Ballia',
        metaDescription:
          "Sunbeam School Ballia's published academic calendars and monthly planners, by session.",
        noIndex: false,
      },
    });
    console.log(`    ${outcome.padEnd(7)}  page content (${calendarCarries?.length ?? 0} carries, ${calendarPlanning?.length ?? 0} planning)`);
  }

  console.log(
    `\n  Done — ${created} created, ${updated} updated` +
      (DRY ? '' : `, media: ${uploaded} uploaded (${docsUploaded} pdf) / ${reused} reused`) +
      '\n',
  );
});
