/**
 * Detach every uploaded file from the publications collection.
 *
 * ⚠⚠ WRITTEN TO UNDO A SPECIFIC MISTAKE. An earlier run of
 * seed/attach-documents.mjs matched a publication on TITLE alone — and five
 * clubs each publish a "First Edition, June 2026", so one club's newsletter
 * was attached to all five. Any match key that is not unique will do this
 * again; publications are identified by (group, title), never by title.
 *
 * With no file attached, each row falls back to its own `href`, which is the
 * school's own correct link for that club.
 */
import { withStrapi } from '../lib/strapi.mjs';

const UID = 'api::publication.publication';

await withStrapi(async (strapi) => {
  const rows = await strapi.documents(UID).findMany({ status: 'draft', populate: { file: true } });
  let cleared = 0;
  for (const r of rows) {
    if (!r.file) continue;
    const pub = await strapi.documents(UID).findOne({ documentId: r.documentId, status: 'published' });
    await strapi.documents(UID).update({
      documentId: r.documentId,
      data: { file: null },
      status: pub ? 'published' : 'draft',
    });
    console.log(`    cleared  ${String(r.group).padEnd(28)} ${r.title}`);
    cleared += 1;
  }
  console.log(`\n    ${cleared} detached\n`);
});
