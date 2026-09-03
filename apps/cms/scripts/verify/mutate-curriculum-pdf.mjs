/**
 * PROVE AN UPLOADED PDF REACHES THE CARD.
 *
 *     node scripts/verify/mutate-curriculum-pdf.mjs apply
 *     npm run seed:curriculum                       # revert
 *
 * Adding a media field is not the same as the field working. This uploads a real
 * PDF of a known size, attaches it to the first class and to the first resource
 * card, and leaves the page to be inspected:
 *
 *   1. the syllabus card must link to /uploads/… and NOT to the school's site,
 *      because an uploaded file takes precedence over the pasted link
 *   2. it must print the size DERIVED FROM THE FILE — nobody typed 3 MB
 *   3. the resource card must gain target="_blank", which it does not have when
 *      it points at a page on this site
 *
 * The PDF is generated here rather than committed: a fixture binary that exists
 * only to be thrown away is a fixture binary somebody will later mistake for
 * content.
 */
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

if (process.argv[2] !== 'apply') {
  console.error('usage: apply   (revert with: npm run seed:curriculum)');
  process.exit(1);
}

const UID = 'api::curriculum-page.curriculum-page';
const TARGET_MB = 3;

/** The smallest thing a PDF reader will open, padded to a known size. */
function makePdf(path, megabytes) {
  const head = '%PDF-1.4\n'
    + '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
    + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
    + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]>>endobj\n';
  const tail = 'trailer<</Root 1 0 R/Size 4>>\n%%EOF\n';
  /* Padding lives in a comment, so the file stays a valid PDF at any size. */
  const pad = megabytes * 1024 * 1024 - head.length - tail.length - 2;
  writeFileSync(path, head + '%' + 'A'.repeat(Math.max(0, pad)) + '\n' + tail);
}

const pdf = join(tmpdir(), 'precept-upload-proof.pdf');
makePdf(pdf, TARGET_MB);

const bare = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k] ?? null]));

await withStrapi(async (app) => {
  const { file } = await uploadMedia(app, {
    absolutePath: pdf, name: 'precept-upload-proof', alternativeText: null, force: true,
  });
  console.log(`\n  uploaded: ${file.name}  ${Math.round(file.size / 1024)} MB (${file.size} KB)  ${file.url}`);

  const doc = await app.documents(UID).findFirst({
    populate: {
      stages: { populate: { classes: { populate: { file: true } } } },
      sectionFive: { populate: { tiles: { populate: { file: true } } } },
    },
    status: 'draft',
  });

  const stages = (doc.stages ?? []).map((s, i) => ({
    ...bare(s, ['label', 'range', 'blurb', 'mark']),
    classes: (s.classes ?? []).map((c, j) => ({
      ...bare(c, ['label', 'href', 'sizeMb']),
      /* ⚠ The pasted link is left in place ON PURPOSE. The card must prefer the
         upload while the link is still sitting underneath it. */
      file: i === 0 && j === 0 ? file.id : (c.file?.id ?? null),
    })),
  }));

  const five = doc.sectionFive;

  await app.documents(UID).update({
    documentId: doc.documentId,
    data: {
      stages,
      sectionFive: {
        ...bare(five, ['kicker', 'heading', 'headingEm']),
        tiles: (five.tiles ?? []).map((t, i) => ({
          ...bare(t, ['label', 'value', 'mark', 'href']),
          file: i === 0 ? file.id : (t.file?.id ?? null),
        })),
      },
    },
    status: 'published',
  });

  console.log('  attached to: stages[0].classes[0]  and  sectionFive.tiles[0]\n');
});

unlinkSync(pdf);
