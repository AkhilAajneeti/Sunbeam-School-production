/**
 * ═══ BRING THE SCHOOL'S DOCUMENTS INTO THIS CMS ════════════════════════════
 *
 *     npm run seed:attach-documents [-- --dry]
 *
 * Uploads the fourteen Mandatory Public Disclosure PDFs and attaches each to
 * the record that used to LINK to it on
 * sunbeamballia.edu.in/wp-content/uploads/. After this the site serves them
 * itself and nothing on those pages depends on the school's old domain.
 *
 * ═══ WHY THIS IS NOT A NORMAL SEED ═════════════════════════════════════════
 *
 * ⚠⚠ IT READS THE LIVE RECORD AND WRITES IT BACK WITH ONE FIELD ADDED. It does
 * NOT rebuild the disclosure page from a fixture the way seed/pages.mjs does,
 * and it deliberately does not go through upsertSingle. That guard exists to
 * stop a fixture-shaped seed discarding an editor's work — the risk it guards
 * against cannot arise here, because every value written back is the value
 * that was just read. Nothing can be lost that was not already there.
 *
 * ⚠ THE COMPONENTS ARE SENT WHOLE, BECAUSE STRAPI REPLACES THEM WHOLE. A
 * repeatable component is not patched field by field; the array you send is
 * the array that survives. So every existing field is copied across and only
 * `file` is added. Drop a field from the mapping below and it is gone from the
 * page.
 *
 * ⚠ `file` WINS OVER `href` IN shared.document. The old hrefs are left in
 * place on purpose — they are what the records say the school published, and
 * they cost nothing while a file is attached. Clearing them would throw away
 * the provenance of every certificate to remove a string nothing reads.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { withStrapi } from '../lib/strapi.mjs';
import { uploadMedia } from '../lib/media.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const MPD_DIR = resolve(WEB, 'assets/disclosure-docs');

const DISCLOSURE = 'api::disclosure-page.disclosure-page';
const DRY = new Set(process.argv.slice(2)).has('--dry');

/** key on the shared.document component → the PDF that belongs to it. */
const KEYS = [
  'AFFL', 'TRST', 'NOC', 'RTE', 'BSC', 'FSC', 'SCP', 'SDW',
  'FEE', 'ACD', 'SMC', 'PTA', 'BRS',
];

await withStrapi(async (strapi) => {
  console.log(`\n  Attaching the school's documents${DRY ? '  (dry run)' : ''}\n`);

  const missing = [...KEYS, 'MPD']
    .map((k) => `${k}.pdf`)
    .filter((f) => !existsSync(resolve(MPD_DIR, f)));
  if (missing.length) throw new Error(`Missing from assets/disclosure-docs: ${missing.join(', ')}`);

  if (DRY) {
    console.log(`    disclosure   ${KEYS.length} certificates and filings, plus MPD.pdf as the source`);
    return;
  }

  /* ── 1 · Upload, once each ─────────────────────────────────────────── */
  const uploads = {};
  for (const key of [...KEYS, 'MPD']) {
    const { file } = await uploadMedia(strapi, {
      absolutePath: resolve(MPD_DIR, `${key}.pdf`),
      name: `disclosure-${key.toLowerCase()}`,
      alternativeText: `${key} — Sunbeam School Ballia, mandatory public disclosure.`,
    });
    uploads[key] = file.id;
  }
  console.log(`    uploaded            ${Object.keys(uploads).length} disclosure PDFs`);

  /* ── 2 · Attach them to the disclosure page ────────────────────────── */
  const page = await strapi.documents(DISCLOSURE).findFirst({
    status: 'draft',
    populate: { certificates: { populate: { file: true } }, academicDocs: { populate: { file: true } } },
  });
  if (!page) throw new Error('No disclosure-page record to attach to.');

  /* ⚠ EVERY FIELD IS CARRIED OVER, NOT JUST THE ONES THIS SCRIPT CARES
     ABOUT — see the header on why a component array is all-or-nothing. */
  const attach = (rows) =>
    (rows ?? []).map((r) => ({
      key: r.key,
      icon: r.icon,
      title: r.title,
      description: r.description,
      href: r.href,
      file: uploads[r.key] ?? r.file?.id ?? null,
    }));

  const certificates = attach(page.certificates);
  const academicDocs = attach(page.academicDocs);

  const published = await strapi.documents(DISCLOSURE).findFirst({ status: 'published' });
  await strapi.documents(DISCLOSURE).update({
    documentId: page.documentId,
    data: { certificates, academicDocs, sourcePdfFile: uploads.MPD },
    status: published ? 'published' : 'draft',
  });

  const hit = [...certificates, ...academicDocs].filter((r) => r.file).length;
  console.log(`    disclosure page     ${hit} documents attached, + MPD as the source PDF`);

  /* ── 3 · The publications are NOT attached here ────────────────────
     ⚠⚠ REMOVED AFTER IT WENT WRONG, AND THE REASON MATTERS MORE THAN THE
     CODE. This section matched a publication on TITLE, and five clubs each
     publish a "First Edition, June 2026" — so one club's newsletter was
     attached to all five before anyone looked. A key that is not unique will
     do that again: publications are identified by (group, title).

     ⚠ AND THE FILES ARE TOO BIG TO BRING IN UNCONSIDERED. The eleven
     publications still hosted on the school's old domain come to 662 MB, one
     of them 221 MB — over Strapi's default 200 MB upload limit, and far too
     much to carry in the repository. That is a decision about hosting, not a
     script to run quietly. The `file` field exists on the publication content
     type and wins over `href`, so any one of them can be uploaded from the
     admin the moment the question is settled. */

  console.log('');
});
