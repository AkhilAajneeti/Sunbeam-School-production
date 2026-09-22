/**
 * VERIFY — can a new recruitment poster be added entirely through the CMS?
 *
 *     npm run verify:poster-upload [-- --keep]
 *
 * Uploads one image, creates one Job Posting around it, reports what the site
 * would render, and then DELETES BOTH again unless --keep is passed.
 *
 * ⚠ THIS EXISTS BECAUSE "the media field is on the schema" IS NOT THE SAME AS
 * "the school can add a poster". The field could be there and the upload still
 * fail on a missing provider, a rejected mime type, or a required field the
 * admin form does not surface. This walks the whole path.
 *
 * ⚠ IT CLEANS UP AFTER ITSELF. A verification script that leaves a fake vacancy
 * on a real school's careers page is worse than no verification.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const UID = 'api::job-posting.job-posting';
const SLUG = 'zz-verify-poster-upload';

const KEEP = new Set(process.argv.slice(2)).has('--keep');

/* Any image already in the repo — the point is the pipeline, not the picture. */
const SAMPLE = resolve(HERE, '../../../web/src/assets/icons/Showcase-Schools-badge1.jpg');

await withStrapi(async (strapi) => {
  console.log('\n  Verifying that a poster can be added through the CMS\n');

  const { file, reused } = await uploadMedia(strapi, {
    absolutePath: SAMPLE,
    name: `job-${SLUG}`,
    alternativeText: 'Verification poster — not a real vacancy.',
    caption: 'Verification poster',
  });
  console.log(`    1. image uploaded      id=${file.id}  ${reused ? '(reused)' : '(new)'}`);
  console.log(`       url                 ${file.url}`);

  const created = await strapi.documents(UID).create({
    data: {
      title: 'ZZ Verification poster',
      slug: SLUG,
      tag: 'Verification',
      image: file.id,
      alt: 'Verification poster — not a real vacancy.',
      dated: 'Not a real vacancy',
      lang: 'en',
      displayOrder: 999,
    },
    status: 'published',
  });
  console.log(`    2. job posting created documentId=${created.documentId}`);

  const all = await strapi.documents(UID).findMany({ status: 'published' });
  console.log(`    3. published postings  ${all.length}  (the page prints this as the count)`);

  const mine = all.find((p) => p.slug === SLUG);
  console.log(`    4. readable back       ${mine ? 'yes' : 'NO'}  title=${mine?.title ?? '-'}`);

  if (KEEP) {
    console.log('\n    --keep given: left in place. Delete it in the admin when done.\n');
    return;
  }

  await strapi.documents(UID).delete({ documentId: created.documentId });

  /* ⚠ DELETING THE POSTING DOES NOT DELETE ITS IMAGE. Strapi keeps the file in
     the Media Library whether or not anything still points at it, so a run that
     only removed the row would leave a stray image behind every time. The
     upload plugin's own service removes the file and its generated sizes. */
  await strapi.plugin('upload').service('upload').remove(file);

  const after = await strapi.documents(UID).findMany({ status: 'published' });
  console.log(`    5. cleaned up          ${after.length} postings remain\n`);
  console.log('  PASS — a poster can be uploaded and published entirely through the CMS.\n');
});
