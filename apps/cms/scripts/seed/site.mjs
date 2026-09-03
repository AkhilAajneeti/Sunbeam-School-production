/**
 * SEED — SITE SETTINGS (site.ts → api::site-setting).
 *
 *     npm run seed:site [-- --dry]
 *
 * ═══ THE HIGHEST-LEVERAGE MIGRATION IN THE PROJECT ═════════════════════════
 *
 * `data/site.ts` exports `school`, and 57 files import it — more than any other
 * module in the repository by a wide margin. The school's own phone number
 * appears on the masthead, the footer, the contact panel, the careers page and
 * two dozen academic pages, and today changing it is a code edit and a deploy.
 *
 * ⚠ THE SHAPE IS PRESERVED EXACTLY, AND THAT IS THE WHOLE DESIGN.
 * Consumers read `school.phone.officeDisplay`, `school.address.city`,
 * `school.external.results` — nested, by name. The content type mirrors that
 * nesting with named components rather than flattening it into
 * `phoneOfficeDisplay`, so every one of those 57 files changes only its import
 * line. A flatter schema would have been marginally simpler here and would have
 * cost 57 rewrites there.
 *
 * ⚠ WHAT IS DELIBERATELY LEFT BEHIND IN site.ts:
 *   · `showBuildNotes` — a build flag, not content.
 *   · `pending`        — the A1–A9 asset tracker. Project management, and it is
 *                        gated behind showBuildNotes so it never renders.
 *   · `heritageLede`   — homepage copy. It moves with the homepage in G6, not
 *                        here, because that is where an editor will look for it.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { upsertSingle } from '../lib/upsert.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(HERE, '../../../web/src/data/site.ts');
const UID = 'api::site-setting.site-setting';

const DRY = process.argv.includes('--dry');

/** string[] → shared.fact entries. */
const facts = (arr) => (arr ?? []).map((value) => ({ value }));

await withStrapi(async (strapi) => {
  const { school, quickAccess } = await loadWebData(DATA_FILE);

  if (!school?.name) throw new Error(`Expected a "school" export in ${DATA_FILE}`);

  const data = {
    name: school.name,
    shortName: school.shortName,
    motto: school.motto,
    mottoParts: facts(school.mottoParts),
    groupPhrase: school.groupPhrase ?? null,
    tagline: school.tagline ?? null,
    admissionsOpen: Boolean(school.admissionsOpen),
    established: school.established,
    groupFounded: school.groupFounded ?? null,
    groupFoundedAt: school.groupFoundedAt ?? null,
    founders: school.founders ?? null,
    openingStrength: school.openingStrength ?? null,
    currentStrength: school.currentStrength ?? null,
    teachingStaff: school.teachingStaff ?? null,
    classRange: school.classRange ?? null,
    principal: school.principal ?? null,
    streams: facts(school.streams),

    address: {
      line1: school.address.line1,
      city: school.address.city,
      state: school.address.state,
      pin: school.address.pin,
      country: school.address.country,
      landmark: school.address.landmark ?? null,
    },

    /* ⚠ PHONES AND EMAILS ARE ONE COMPONENT even though site.ts keeps emails at
       the top level and numbers under `phone`. An editor looking for "how do
       people reach us" should find one form, not two — and the query layer maps
       it back apart so `school.phone.office` and `school.email` both still
       resolve exactly as they do today. */
    contact: {
      admissions: school.phone.admissions,
      admissionsDisplay: school.phone.admissionsDisplay,
      office: school.phone.office,
      officeDisplay: school.phone.officeDisplay,
      transport: school.phone.transport,
      transportDisplay: school.phone.transportDisplay,
      transportIncharge: school.phone.transportIncharge ?? null,
      email: school.email,
      recruitmentEmail: school.recruitmentEmail,
    },

    social: {
      facebook: school.social?.facebook ?? null,
      instagram: school.social?.instagram ?? null,
      linkedin: school.social?.linkedin ?? null,
      /* ⚠ BLANK ON PURPOSE. Audit 14.3 says not to ship links to dormant
         channels; the school has not confirmed these are maintained (C9). */
      youtube: null,
      x: null,
    },

    external: {
      applyNurseryToIX: school.external.applyNurseryToIX ?? null,
      applyClassXI: school.external.applyClassXI ?? null,
      applyFormNurseryToIX: school.external.applyFormNurseryToIX ?? null,
      applyFormClassXI: school.external.applyFormClassXI ?? null,
      results: school.external.results ?? null,
      resultPage: school.external.resultPage ?? null,
      parentLogin: school.external.parentLogin ?? null,
      downloadTC: school.external.downloadTC ?? null,
      affiliationLetter: school.external.affiliationLetter ?? null,
      mandatoryDisclosure: school.external.mandatoryDisclosure ?? null,
    },

    affiliation: {
      board: school.board,
      boardFull: school.boardFull,
      affiliationNo: school.affiliationNo,
      schoolCode: school.schoolCode,
      udise: school.udise,
      affiliationPeriod: school.affiliationPeriod ?? null,
      affiliationLetterNo: school.affiliationLetterNo ?? null,
      affiliationLetterDated: school.affiliationLetterDated ?? null,
      affiliationSubject: school.affiliationSubject ?? null,
    },

    quickAccess: (quickAccess ?? []).map((q) => ({
      label: q.label,
      description: q.desc ?? null,
      href: q.href,
      external: Boolean(q.external),
    })),
  };

  if (DRY) {
    console.log(`\n  Would upsert Site Settings for "${data.name}"`);
    console.log(`    streams        ${data.streams.length}`);
    console.log(`    mottoParts     ${data.mottoParts.length}`);
    console.log(`    quickAccess    ${data.quickAccess.length}`);
    console.log(`    phones         ${data.contact.officeDisplay} / ${data.contact.admissionsDisplay}\n`);
    return;
  }

  const outcome = await upsertSingle(strapi, UID, data);

  console.log(`\n  Site Settings ${outcome} — ${data.name}`);
  console.log(`    ${data.streams.length} streams · ${data.quickAccess.length} quick links · affiliation ${data.affiliation.affiliationNo}\n`);
});
