/**
 * SEED — DISCLOSURE, UNIFORM, SERVICES & CONTACT (G7).
 *
 *     npm run seed:pages [-- --dry] [-- --force-media]
 *
 * ═══ WHERE EACH FIELD COMES FROM ═══════════════════════════════════════════
 *
 *   data/disclosure.ts  → disclosure-page + 131 Teacher records
 *   data/uniform.ts     → uniform-page (catalogue PDFs → Strapi media)
 *   data/services.ts    → result-page, tc-page
 *   site-settings       → contact-page reads it; nothing is copied
 *
 * ⚠ THE PROSE IS TRANSCRIBED HERE, NOT READ FROM THE COMPONENTS. Section
 * headings, kickers, notes, form labels and every status message were literals
 * in markup or in a <script>, which `loadWebData` cannot see. They are written
 * out below character for character; the production diff is what proves the
 * transcription, exactly as it did for G6's headings.
 *
 * ⚠ NOTHING HERE READS A FILE THE MIGRATION DELETES, so unlike G6 this seed
 * needs no fixture: data/disclosure.ts, data/uniform.ts and data/services.ts
 * stay on disk as the source of record for a re-seed.
 *
 * ⚠⚠ THIS IS A REGULATORY FILING. Every figure on the disclosure page is
 * transcribed from documents the school has filed with CBSE. Nothing here may
 * be tidied, rounded or corrected: the page has to keep agreeing with the PDFs
 * linked beside it, and the PDFs are the document of record.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web');
const P = (p) => resolve(WEB, 'src', p);

const DISCLOSURE = 'api::disclosure-page.disclosure-page';
const TEACHER = 'api::teacher.teacher';
const UNIFORM = 'api::uniform-page.uniform-page';
const RESULT = 'api::result-page.result-page';
const TC = 'api::tc-page.tc-page';
const CONTACT = 'api::contact-page.contact-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

/** {k,v,href,from,mark,unit} → shared.detail, whichever subset is present. */
const details = (a) => (a ?? []).map((d) => ({
  icon: d.mark ?? null,
  label: d.k,
  value: String(d.v),
  href: d.href ?? null,
  note: d.from ?? d.unit ?? null,
}));

/** {n,mark,k,v} → shared.point. */
const points = (a) => (a ?? []).map((p) => ({
  number: p.n ?? null, icon: p.mark ?? null, title: p.k, body: p.v,
}));

const facts = (a) => (a ?? []).map((value) => ({ value }));
/** The catalogue's notes are full sentences, not short facts — shared.paragraph. */
const paras = (a) => (a ?? []).map((text) => ({ text }));

await withStrapi(async (strapi) => {
  const disclosure = await loadWebData(P('data/disclosure.ts'));
  const uniform = await loadWebData(P('data/uniform.ts'));
  const services = await loadWebData(P('data/services.ts'));
  const site = await loadWebData(P('data/site.ts'));
  const schoolName = site.school.name;

  console.log(`\n  Seeding disclosure, uniform, services & contact${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0;
  let reused = 0;
  const up = async (absolutePath, name, alt) => {
    if (!absolutePath) return null;
    const r = await uploadMedia(strapi, {
      absolutePath, name, alternativeText: alt ?? null, force: FORCE_MEDIA,
    });
    r.reused ? reused++ : uploaded++;
    return r.file.id;
  };

  /* ── DISCLOSURE ─────────────────────────────────────────────────────────── */

  /**
   * ⚠ THE ANCHORS ARE THE PAGE'S OWN IDS AND ARE LINKABLE. They were written
   * once in a `sections` array for the rail and again as literal text in each
   * section heading, so the two could disagree. One record now feeds both.
   */
  const SECTIONS = [
    { anchor: 'mp-general', label: 'General Information' },
    { anchor: 'mp-docs', label: 'Documents & Certificates' },
    { anchor: 'mp-results', label: 'Results & Academics' },
    { anchor: 'mp-staff', label: 'Staff & Teaching' },
    { anchor: 'mp-infra', label: 'School Infrastructure' },
  ];

  const docs = (a) => (a ?? []).map((c) => ({
    key: c.key ?? null, icon: c.mark ?? null, title: c.k,
    description: c.v, href: c.href, file: null,
  }));

  const disclosureData = {
    sections: SECTIONS,

    quickInfo: details(disclosure.quickInfo),
    quickNote: `As filed in the school’s Mandatory Public Disclosure. ${disclosure.disclosureSource.covers}.`,

    sourcePdfHref: disclosure.disclosureSource.pdf,
    sourcePdfFile: null,
    sourcePage: disclosure.disclosureSource.page,
    sourceCovers: disclosure.disclosureSource.covers,

    railLabel: 'Disclosure',
    railPdfTitle: 'Complete Disclosure PDF',
    railPdfBody: 'The full Mandatory Public Disclosure document, as filed with CBSE.',
    railPdfViewLabel: 'View PDF',
    railPdfDownloadLabel: 'Download PDF',

    generalInformation: details(disclosure.generalInformation),
    certificates: docs(disclosure.certificates),
    academicDocs: docs(disclosure.academicDocs),
    docViewLabel: 'View PDF',

    boardResults: (disclosure.boardResults ?? []).map((r) => ({
      year: r.year,
      classX: { registered: r.x.registered, passed: r.x.passed, percentage: r.x.percentage },
      classXii: { registered: r.xii.registered, passed: r.xii.passed, percentage: r.xii.percentage },
    })),
    /* ⚠ `**registered**` / `*appeared*` — see ui/RichLine.astro. The emphasis is
       the point of the sentence, not decoration: it is the school distinguishing
       what it publishes from what it does not. */
    boardResultsNote: 'As published by the school in its “Last Three Years Board Result” document. It records students **registered** and **passed**; a separate figure for students *appeared* is not published, so none is shown.',

    staffSummary: details(disclosure.staffSummary),
    /**
     * ⚠ `{teacherCount}` AND `{outsideCount}` ARE TOKENS, NOT NUMBERS.
     * Both are arithmetic over the Teacher collection — the filing lists 131
     * people and headlines 121 teachers, and the difference is what the sentence
     * explains. Writing either number in would mean correcting this paragraph by
     * hand every time a teacher is added, and it would silently go stale.
     */
    staffLead: 'The filing names **{teacherCount} members of staff** individually. Its own headline figure of **{headlineCount} teachers** counts the TGT, PGT, PRT, NTT, wellness and special-education posts; the remaining {outsideCount} — physical education, other staff, the Principal and the Vice Principal — are listed but sit outside that total.',
    staffHeadlineCount: 121,

    infrastructure: details(disclosure.infrastructure),
    inspectionVideo: disclosure.inspectionVideo,

    calloutHeading: 'All information is published in accordance with CBSE Mandatory Disclosure norms.',
    /* ⚠ `{filedPhone}` / `{filedEmail}`, NOT the Site Settings display form. A
       regulatory page quotes the number it filed — see the note in
       queries/pages.ts. Both resolve from the quick card above. */
    calloutBody: 'Every figure and document on this page is taken from the school’s own filing and the certificates linked beside it. For any query or clarification, please contact the school office on [{filedPhone}]({filedTel}), or write to [{filedEmail}]({filedEmailHref}).',
    calloutPhoto: DRY ? null : {
      image: await up(P('assets/photos/sunbeem-1.jpg'), 'disclosure-callout',
        'The main building of Sunbeam School Ballia at Agarsanda, its name across the front elevation.'),
      alt: 'The main building of Sunbeam School Ballia at Agarsanda, its name across the front elevation.',
      caption: null,
    },
  };

  if (!DRY) console.log(`    disclosure page     ${await upsertSingle(strapi, DISCLOSURE, disclosureData)}`);

  /* ── TEACHERS ───────────────────────────────────────────────────────────── */
  if (!DRY) {
    let created = 0;
    let updated = 0;
    const seen = new Set();
    for (const t of disclosure.teachers ?? []) {
      /**
       * ⚠ THE SLUG DISAMBIGUATES DUPLICATE NAMES WITH THE FILED ROW NUMBER.
       * The filing has more than one person of the same name, and a slug
       * collision would silently merge two members of staff into one row.
       */
      let slug = slugify(t.name);
      if (seen.has(slug)) slug = `${slug}-${t.n}`;
      seen.add(slug);

      const outcome = await upsertBySlug(strapi, TEACHER, slug, {
        filedOrder: t.n,
        name: t.name,
        designation: t.designation,
        qualification: t.qualification,
      });
      outcome === 'created' ? created++ : updated++;
    }
    console.log(`    teachers            ${created} created, ${updated} updated`);
  }

  /* ── UNIFORM ────────────────────────────────────────────────────────────── */

  /**
   * ⚠ THE CATALOGUES MOVE INTO STRAPI MEDIA. They were two PDFs in the site's
   * public directory — 51 MB of it — so a new edition needed a developer and a
   * deploy. `href` in the source is the public path; the file at that path is
   * what gets uploaded, and the component then links the Strapi file.
   */
  const catalogues = [];
  if (!DRY) {
    for (const c of uniform.catalogues ?? []) {
      catalogues.push({
        number: c.n, icon: c.mark, title: c.title, session: c.session,
        revised: c.revised, linkedAs: c.linkedAs,
        originHref: c.origin, pages: c.pages, size: c.size,
        file: await up(resolve(WEB, 'public', c.href.replace(/^\//, '')),
          `uniform-${slugify(c.title)}-${slugify(c.session)}`, c.title),
      });
    }
  }

  const uniformData = {
    topKicker: 'Our catalogues',
    topHeading: 'Explore our official\n{{uniform catalogues}}',
    topBody: 'The school publishes two uniform documents. Both are reproduced here exactly as issued — view them in the browser or download the original file.',
    topNote: 'Everything further down this page is read out of those catalogues: the class groups they are organised by, the four seasons, the shoe list and the school’s own eleven notes. The source is the school’s [Uniform page]({sourceHref}).',

    catalogues,

    classesKicker: 'Explore by class',
    classesHeading: 'How the catalogues\n{{are organised}}',
    classesNote: 'Every page of the current catalogue is headed with one of these three groups, then split into boys and girls across the four seasons.',
    classGroups: points(uniform.classGroups),

    seasonsKicker: 'Uniform through the year',
    seasonsHeading: 'Seasons & when\n{{uniforms are worn}}',
    seasons: details(uniform.seasons),

    shoesKicker: 'Footwear',
    shoesHeading: uniform.shoeTable.heading,
    shoesNote: uniform.shoeTable.note,
    shoeRows: (uniform.shoeTable.rows ?? []).map(({ classes, boys, girls, days }) =>
      ({ classes, boys, girls, days })),

    notesTitle: 'Important information',
    notesBody: 'The catalogue’s own notes, reproduced word for word.',
    notes: paras(uniform.uniformNotes),

    downloadKicker: 'Download the complete catalogues',
    downloadHeading: 'View or download\n{{the official PDFs}}',
    downloadNote: 'Both files are the school’s own, unaltered. {schoolName} publishes them on its [Uniform page]({sourceHref}); nothing on this page replaces or redraws them.',

    sourceHref: uniform.uniformSource,
    sourceLabel: 'Uniform page',
  };

  if (!DRY) console.log(`    uniform page        ${await upsertSingle(strapi, UNIFORM, uniformData)}`);

  /* ── RESULT ─────────────────────────────────────────────────────────────── */
  const resultData = {
    openKicker: 'Report card',
    /* ⚠ THE SCHOOL’S OWN QUESTION, WORD FOR WORD. Its Result page asks exactly
       this; the page presents that line rather than rewriting it. */
    openHeading: 'Want to check\n{{your report card?}}',
    openBody: 'Report cards are issued through the school’s online portal.',

    cardKicker: 'Online result',
    /* ⚠ THE SAME LINE IN THE SCHOOL'S OWN CASING, set as a statement rather than
       repeated at headline size. */
    cardHeading: 'WANT TO CHECK YOUR REPORT CARD?',
    cardBody: 'The portal opens in a new tab, so this page stays where you left it.',
    ctaLabel: 'Click here',

    /* ⚠ THE TWO PHOTOGRAPHS AND THEIR ALT TEXT. The alt interpolated the school
       name from a local `const S`; the picture and what it shows are editorial,
       the frame and the parallax around them are not. */
    cardPhoto: DRY ? null : {
      image: await up(P('assets/photos/sunbeem-5.jpg'), 'result-card',
        `Students of ${schoolName} at work in a classroom.`),
      alt: `Students of ${schoolName} at work in a classroom.`,
      caption: null,
    },
    /* ⚠ EMPTY alt, AND THAT IS CORRECT. The closing band is aria-hidden
       decoration behind a heading; describing it would announce it twice. */
    closePhoto: DRY ? null : {
      image: await up(P('assets/photos/sunbeem-3.jpg'), 'result-close', null),
      alt: '',
      caption: null,
    },
    points: points(services.resultPoints),

    closeHeading: 'Every result\ntells {{a story.}}',
    sourcePage: services.resultSourcePage,
  };

  if (!DRY) console.log(`    result page         ${await upsertSingle(strapi, RESULT, resultData)}`);

  /* ── TRANSFER CERTIFICATE ───────────────────────────────────────────────── */

  /**
   * ⚠ THE HELP ITEMS INTERPOLATE THE OFFICE NUMBER. The source built the fourth
   * one from `school.phone.officeDisplay`; the token keeps that derivation
   * rather than freezing today's number into the CMS.
   */
  const help = points(services.tcHelp).map((h) => ({
    ...h,
    body: h.body.replace(/\+?91[\s\d]{8,}/, '{officePhone}'),
  }));

  const tcData = {
    cardHeading: 'Download Transfer Certificate',
    cardBody: 'Please enter the enrolment number provided at the time of admission.',
    fieldLabel: 'Enrolment number',
    fieldPlaceholder: 'Enter enrolment number',
    submitLabel: 'Search',
    busyLabel: 'Searching…',
    formNote: 'The certificate search runs on the school’s own records system.',

    photo: DRY ? null : {
      image: await up(P('assets/photos/sunbeem-1.jpg'), 'tc-campus',
        `The main building of ${schoolName} at Agarsanda, seen across its front lawn.`),
      alt: `The main building of ${schoolName} at Agarsanda, seen across its front lawn.`,
      caption: null,
    },
    helpTitle: 'Important information',
    help,

    errEmpty: 'Please enter your enrolment number.',
    errShort: 'That enrolment number looks too short.',
    /* ⚠ SPLIT IN THREE because the middle is a link the school may reword, and
       the tail carries the office number as a token. The script joins them. */
    statusNoEndpointLead: 'This search is handled by the school’s own records system.',
    statusNoEndpointLink: 'Continue on the school’s Transfer Certificate page',
    statusNoEndpointTail: 'to look up your certificate, or call the office on {officePhone}.',
    statusFound: 'Certificate found.',
    statusFoundLink: 'View or download it',
    statusNotFound: 'No certificate was found for that enrolment number. Please check it and try again.',
    statusError: 'That search could not be completed just now. Please try again, or contact the school office.',

    sourcePage: services.tcSourcePage,
  };

  if (!DRY) console.log(`    tc page             ${await upsertSingle(strapi, TC, tcData)}`);

  /* ── CONTACT ────────────────────────────────────────────────────────────── */

  /**
   * ⚠ THE FIELD KEYS MATCH THE INPUT IDS and are not editorial. Everything the
   * reader sees — the label and the message shown when the field is wrong —
   * lives together so the two cannot drift apart, which they could when the
   * label was in the markup and the error was in the script.
   */
  const contactData = {
    eyebrow: 'Contact us',
    heading: 'Get in touch',
    standfirst: "Admissions, transport, fees or a question about your child's class — send it here, or call the office directly. Someone from the school will come back to you.",

    fields: [
      { key: 'cf-name', label: 'Name', error: 'Please tell us your name.', required: true },
      { key: 'cf-email', label: 'Email', error: 'Please enter an email address we can reply to.', required: true },
      { key: 'cf-subject', label: 'Subject', error: null, required: false },
      { key: 'cf-phone', label: 'Phone number', error: null, required: false },
      { key: 'cf-city', label: 'City', error: null, required: false },
      /* ⚠ THE MESSAGE BOX. The form shipped without one for a while: the page
         offered "a message form that reaches the office" and gave a parent
         nowhere to write the message. Its label and error live here with the
         rest so the school can reword them. */
      { key: 'cf-message', label: 'Message', error: 'Please write your message.', required: true },
    ],
    /* ⚠ NOT DERIVED FROM `school.classRange`. That string is "Nursery to Class
       XII", a different granularity; splitting it here would invent a grouping
       the school has not published. */
    classOptions: facts([
      'Pre-Primary',
      'Classes I – V',
      'Classes VI – VIII',
      'Classes IX – X',
      'Classes XI – XII',
    ]),
    classPlaceholder: 'Select a class',
    classLabel: 'Class',
    consentLabel: 'I accept the privacy and terms.',
    consentError: 'Please accept the privacy and terms to continue.',
    submitLabel: 'Send Message',
    sendingLabel: 'Sending…',
    statusSuccess: 'Thank you — your message has reached the school. We will reply soon.',
    statusFailure: 'Sorry, that did not send. Please try again, or call the office on {officePhone}.',
    statusNotConnected: 'This form is not connected to the school’s inbox yet. Please call the office on {officePhone} meanwhile.',

    addressHeading: 'Address',
    contactHeading: 'Contact details',
    socialHeading: 'Join us on social',
    locationHeading: 'Where the school is',
  };

  if (!DRY) console.log(`    contact page        ${await upsertSingle(strapi, CONTACT, contactData)}`);

  console.log('');
  if (!DRY) console.log(`  Media — ${uploaded} uploaded, ${reused} reused`);
  console.log('');
});
