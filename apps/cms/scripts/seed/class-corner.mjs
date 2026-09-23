/**
 * ═══ SEED THE CLASS CORNER CARDS ═══════════════════════════════════════════
 *
 *     npm run seed:class-corner [-- --dry]
 *
 * Uploads the school's own documents from apps/web/src/assets/class-corner and
 * creates one entry per card, so the office can replace any of them from the
 * admin afterwards.
 *
 * ⚠⚠ THE DOCUMENTS WERE FETCHED FROM THE SCHOOL'S OLD SITE ON PURPOSE, AND
 * THAT CHANGES WHO KEEPS THEM CURRENT. Until now these cards linked straight
 * at sunbeamballia.edu.in/wp-content/uploads/… — always whatever the school
 * had just published, at the cost of sending a parent off this site. Held
 * here, the file is whatever was last uploaded HERE: when the office revises
 * the monitors list, it has to be uploaded to the CMS too or this page serves
 * last session's copy and says nothing.
 *
 * ⚠ THIS IS A FIRST FILL, NOT THE WAY THE PAGE IS MAINTAINED. Re-running
 * pushes the fixture's files back over whatever the school has since uploaded
 * — it is an upsert by slug and the fields are written whole.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import { withStrapi } from '../lib/strapi.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const DOC_DIR = resolve(WEB, 'assets/class-corner');
const FIXTURE = resolve(HERE, '../fixtures/class-corner.json');

const UID = 'api::class-corner-document.class-corner-document';
const DRY = new Set(process.argv.slice(2)).has('--dry');

await withStrapi(async (strapi) => {
  const cards = JSON.parse(readFileSync(FIXTURE, 'utf8'));

  console.log(`\n  Seeding Class Corner${DRY ? '  (dry run)' : ''}\n`);

  if (DRY) {
    for (const c of cards) {
      console.log(`    ${c.slug.padEnd(22)} ${c.file ? 'file: ' + c.file : 'link: ' + c.link}`);
    }
    console.log('');
    return;
  }

  for (const c of cards) {
    let fileId = null;

    if (c.file) {
      /* ⚠ THE UPLOAD NAME IS THE CARD'S, NOT THE SCHOOL'S FILE NAME.
         `WhatsApp-Image-2026-06-24-at-14.18.48` tells an editor looking for the
         examination schedule nothing at all. */
      const { file } = await uploadMedia(strapi, {
        absolutePath: resolve(DOC_DIR, c.file),
        name: `class-corner-${c.slug}`,
        alternativeText: `${c.title} — Sunbeam School Ballia.`,
      });
      fileId = file.id;
    }

    const action = await upsertBySlug(strapi, UID, c.slug, {
      title: c.title,
      slug: c.slug,
      body: c.body,
      icon: c.icon,
      order: c.order,
      /* ⚠ ONE OR THE OTHER, NEVER BOTH. A card with a file AND a link would
         have two destinations and the page would have to pick one silently. */
      file: fileId,
      link: c.link ?? null,
      pending: c.pending ?? null,
      needs: c.needs ?? null,
    });

    console.log(
      `    ${c.slug.padEnd(22)} ${(c.file ? 'file' : 'link').padEnd(5)} ${action}`,
    );
  }

  console.log(`\n    ${cards.length} cards\n`);
});
