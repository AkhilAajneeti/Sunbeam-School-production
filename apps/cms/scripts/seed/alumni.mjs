/**
 * SEED — ALUMNI.  Three content types from two source files.
 *
 *     npm run seed:alumni [-- --dry] [-- --force-media]
 *
 *     data/alumni.ts       alumni[]        → Alumnus       (placement cards)
 *     data/alumniMeets.ts  alumniMeets[]   → Alumni Meet   (reunions + galleries)
 *     data/alumniMeets.ts  alumniStories[] → Alumni Story  (profiles)
 *
 * ═══ `published` BECOMES STRAPI'S OWN PUBLISH STATE ════════════════════════
 *
 * Both meets and stories carry a `published: boolean` in the source, and the
 * components filter on it. That is exactly what Strapi's draft/publish is for,
 * so it is NOT a field on either content type: an unpublished meet is created as
 * a DRAFT, which the read-only token cannot see at all.
 *
 * The difference matters. As a field, an unpublished meet would still be
 * returned by the API and the site would depend on remembering to filter it —
 * one forgotten `.filter()` away from publishing something the school had
 * deliberately withheld. As draft state, it cannot reach the site by accident.
 *
 * ⚠ RE-RUNS DO NOT RE-PUBLISH. `publish` applies only when a document is first
 * created; an existing one keeps whatever state the editor left it in. Flipping
 * `published: false` in the source will therefore NOT unpublish a live meet —
 * that is a deliberate act in the admin, not a side effect of a seed.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { buildPhotoComponents, toParagraphs } from '../lib/components.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ALUMNI_FILE = resolve(HERE, '../../../web/src/data/alumni.ts');
const MEETS_FILE = resolve(HERE, '../../../web/src/data/alumniMeets.ts');

const ALUMNUS = 'api::alumnus.alumnus';
const MEET = 'api::alumni-meet.alumni-meet';
const STORY = 'api::alumni-story.alumni-story';

const args = new Set(process.argv.slice(2));
const FORCE_MEDIA = args.has('--force-media');
const DRY = args.has('--dry');

const tally = () => ({ created: 0, updated: 0, drafts: 0 });
const bump = (t, outcome) => {
  if (outcome === 'created') t.created++;
  else if (outcome === 'created-draft') { t.created++; t.drafts++; }
  else t.updated++;
};
const media = { uploaded: 0, reused: 0 };
const countMedia = (r) => { media.uploaded += r.uploaded ?? 0; media.reused += r.reused ?? 0; };

await withStrapi(async (strapi) => {
  const { alumni } = await loadWebData(ALUMNI_FILE);
  const { alumniMeets, alumniStories } = await loadWebData(MEETS_FILE);

  for (const [name, arr] of Object.entries({ alumni, alumniMeets, alumniStories })) {
    if (!Array.isArray(arr)) throw new Error(`Expected an "${name}" array`);
  }

  console.log(`\n  Seeding alumni${DRY ? '  (dry run)' : ''}\n`);

  /* ── 1 · ALUMNUS (placement cards) ──────────────────────────────────────── */
  const alumTally = tally();

  for (const [index, a] of alumni.entries()) {
    const slug = slugify(a.name);

    if (DRY) { console.log(`    alumnus  ${slug}`); alumTally.created++; continue; }
    if (!a.poster?.absolutePath) throw new Error(`Alumnus "${slug}" has no poster path`);

    const { file, reused } = await uploadMedia(strapi, {
      absolutePath: a.poster.absolutePath,
      name: `alumnus-${slug}`,
      alternativeText: a.alt,
      caption: a.name,
      force: FORCE_MEDIA,
    });
    reused ? media.reused++ : media.uploaded++;

    bump(alumTally, await upsertBySlug(strapi, ALUMNUS, slug, {
      name: a.name,
      study: a.study,
      placed: a.placed,
      alt: a.alt,
      video: a.video ?? null,
      poster: file.id,
      displayOrder: index,
    }));
  }

  /* ── 2 · ALUMNI MEETS ───────────────────────────────────────────────────── */
  const meetTally = tally();

  for (const [index, m] of alumniMeets.entries()) {
    /* ⚠ THE SOURCE ALREADY HAS A SLUG and it is a route segment —
       /alumni/pradiptam-2-0-2026-27/ — so it is taken verbatim, never
       regenerated from the title, which would change the URL. */
    const slug = m.slug;

    if (DRY) { console.log(`    meet     ${slug}${m.published ? '' : '  (draft)'}`); meetTally.created++; continue; }

    let coverId = null;
    if (m.cover?.absolutePath) {
      const { file, reused } = await uploadMedia(strapi, {
        absolutePath: m.cover.absolutePath,
        name: `meet-${slug}-cover`,
        alternativeText: m.coverAlt ?? m.title,
        caption: m.title,
        force: FORCE_MEDIA,
      });
      reused ? media.reused++ : media.uploaded++;
      coverId = file.id;
    }

    const gallery = await buildPhotoComponents(strapi, m.gallery, {
      prefix: `meet-${slug}`,
      force: FORCE_MEDIA,
    });
    countMedia(gallery);

    bump(meetTally, await upsertBySlug(
      strapi, MEET, slug,
      {
        title: m.title,
        subtitle: m.subtitle ?? null,
        session: m.session,
        description: toParagraphs(m.description),
        cover: coverId,
        coverAlt: m.coverAlt ?? null,
        gallery: gallery.entries,
        featured: Boolean(m.featured),
        source: m.source ?? null,
        displayOrder: index,
      },
      { publish: m.published !== false },
    ));
  }

  /* ── 3 · ALUMNI STORIES ─────────────────────────────────────────────────── */
  const storyTally = tally();

  for (const [index, s] of alumniStories.entries()) {
    const slug = slugify(s.name);

    if (DRY) { console.log(`    story    ${slug}${s.published ? '' : '  (draft)'}`); storyTally.created++; continue; }

    let photoId = null;
    if (s.photo?.absolutePath) {
      const { file, reused } = await uploadMedia(strapi, {
        absolutePath: s.photo.absolutePath,
        name: `alumni-story-${slug}`,
        alternativeText: s.photoAlt ?? s.name,
        caption: s.name,
        force: FORCE_MEDIA,
      });
      reused ? media.reused++ : media.uploaded++;
      photoId = file.id;
    }

    const gallery = await buildPhotoComponents(strapi, s.gallery, {
      prefix: `alumni-story-${slug}`,
      force: FORCE_MEDIA,
    });
    countMedia(gallery);

    bump(storyTally, await upsertBySlug(
      strapi, STORY, slug,
      {
        name: s.name,
        batch: s.batch ?? null,
        photo: photoId,
        photoAlt: s.photoAlt ?? null,
        profession: s.profession ?? null,
        organisation: s.organisation ?? null,
        study: s.study ?? null,
        quote: s.quote ?? null,
        story: toParagraphs(s.story),
        gallery: gallery.entries,
        featured: Boolean(s.featured),
        displayOrder: index,
      },
      { publish: s.published !== false },
    ));
  }

  const line = (label, t) =>
    console.log(`    ${label.padEnd(16)} ${t.created} created, ${t.updated} updated${t.drafts ? ` (${t.drafts} as draft)` : ''}`);

  console.log('');
  line('Alumni', alumTally);
  line('Meets', meetTally);
  line('Stories', storyTally);
  if (!DRY) console.log(`    ${'Media'.padEnd(16)} ${media.uploaded} uploaded, ${media.reused} reused`);
  console.log('');
});
