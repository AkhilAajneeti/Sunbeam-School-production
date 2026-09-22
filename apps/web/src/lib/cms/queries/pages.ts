/**
 * DISCLOSURE, UNIFORM, SERVICES & CONTACT QUERIES (G7).
 *
 * ⚠ THE RETURNED SHAPES MIRROR data/disclosure.ts, data/uniform.ts and
 * data/services.ts, so each component changes its import and one line of
 * frontmatter and nothing else. `boardResults` still comes back as
 * `{ year, x, xii }` even though the CMS stores `classX` / `classXii`, because
 * the table markup reads `r.x.registered` and renaming that here would mean
 * editing a regulatory table for no reason.
 *
 * ⚠ EVERY `{token}` IS FILLED FROM SITE SETTINGS. The office number, the school
 * email and the school name appear inside sentences on these pages; they belong
 * to Site Settings and are substituted at build time rather than stored twice.
 * `siteTokens()` is the one place that mapping lives.
 *
 * ⚠ WHAT IS *NOT* HERE, DELIBERATELY:
 *   · the T.C. endpoint and its field name — vendor integration, kept in code
 *   · the map embed URL — built from the school's own name and address
 *   · the staff table's search, sort and paging controls — interface chrome
 *   · `designations` — DERIVED from the teacher list, never a typed list
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import { fillTokens, fileUrl } from '../media';
import { getSchool } from './site';
import {
  DISCLOSURE_POPULATE, UNIFORM_POPULATE, RESULT_PAGE_POPULATE,
  TC_PAGE_POPULATE, CONTACT_PAGE_POPULATE,
} from '../populate';
import type { StrapiFile, PhotoComponent, PointItem } from '../types';
import type { School } from './site';

/* ── SHARED SHAPES ───────────────────────────────────────────────────────── */

interface RawDetail {
  id: number; icon: string | null; label: string; value: string;
  href: string | null; note: string | null;
}
interface RawDocument {
  id: number; key: string | null; icon: string | null; title: string;
  description: string | null; href: string | null; file: StrapiFile | null;
}
interface RawParagraph { id: number; text: string }
interface RawFact { id: number; value: string }

/** `{k, v, href, from/unit, mark}` — the field names the components already use. */
export interface DetailRow {
  mark: string | null; k: string; v: string; href: string | null; note: string | null;
}
const details = (a: RawDetail[] | null | undefined): DetailRow[] =>
  (a ?? []).map((d) => ({ mark: d.icon, k: d.label, v: d.value, href: d.href, note: d.note }));

/**
 * ⚠ `file` WINS OVER `href`. Today every certificate points at a PDF on the
 * school's own domain; uploading a refiled one into Strapi is meant to be
 * enough, without a developer editing a URL.
 */
export interface DocCard {
  key: string | null; mark: string | null; k: string; v: string; href: string;
}
const documents = (a: RawDocument[] | null | undefined, fileUrlOf: (f: StrapiFile) => string): DocCard[] =>
  (a ?? []).map((d) => ({
    key: d.key, mark: d.icon, k: d.title, v: d.description ?? '',
    href: d.file ? fileUrlOf(d.file) : (d.href ?? '#'),
  }));

const texts = (a: RawParagraph[] | null | undefined) => (a ?? []).map((p) => p.text);
const values = (a: RawFact[] | null | undefined) => (a ?? []).map((f) => f.value);

/** `{n, mark, k, v}` — the shape the point strips already destructure. */
export interface PointRow { n: string | null; mark: string | null; k: string; v: string }
const points = (a: PointItem[] | null | undefined): PointRow[] =>
  (a ?? []).map((p) => ({ n: p.number, mark: p.icon, k: p.title, v: p.body }));

/**
 * The substitutions available inside any CMS sentence on these pages.
 *
 * ⚠ ADD TO THIS RATHER THAN WRITING A VALUE INTO CONTENT. The moment a phone
 * number is typed into a paragraph it has two owners, and the TC page's script
 * already carried a hardcoded `+917755005905` that Site Settings could not
 * correct — exactly the fault this closes.
 */
export function siteTokens(school: School): Record<string, string> {
  return {
    schoolName: school.name ?? '',
    principal: school.principal ?? '',
    email: school.email ?? '',
    officePhone: school.phone.officeDisplay ?? '',
    officeTel: school.phone.office ?? '',
    admissionsPhone: school.phone.admissionsDisplay ?? '',
    admissionsTel: school.phone.admissions ?? '',
    currentStrength: school.currentStrength ?? '',
    affiliationNo: school.affiliationNo ?? '',
    schoolCode: school.schoolCode ?? '',
    /* ⚠ THE RESULTS PORTAL IS A SITE SETTING, NOT A ROUTE. A sentence that links
       to it should say {resultsUrl} rather than carry the address, so the
       address stays in the one place that owns it. */
    resultsUrl: school.external?.results ?? '',
  };
}

/* ── DISCLOSURE ──────────────────────────────────────────────────────────── */

interface RawSection { id: number; anchor: string; label: string }
interface RawResultRow { id: number; registered: number; passed: number; percentage: string }
interface RawBoardResult { id: number; year: string; classX: RawResultRow | null; classXii: RawResultRow | null }

interface RawDisclosure {
  sections: RawSection[] | null;
  quickInfo: RawDetail[] | null; quickNote: string | null;
  sourcePdfHref: string | null; sourcePdfFile: StrapiFile | null;
  sourcePage: string | null; sourceCovers: string | null;
  railLabel: string | null; railPdfTitle: string | null; railPdfBody: string | null;
  railPdfViewLabel: string | null; railPdfDownloadLabel: string | null;
  generalInformation: RawDetail[] | null;
  certificates: RawDocument[] | null; academicDocs: RawDocument[] | null;
  docViewLabel: string | null;
  boardResults: RawBoardResult[] | null; boardResultsNote: string | null;
  staffSummary: RawDetail[] | null; staffLead: string | null; staffHeadlineCount: number | null;
  infrastructure: RawDetail[] | null; inspectionVideo: string | null;
  calloutHeading: string | null; calloutBody: string | null;
  calloutPhoto: PhotoComponent | null;
}

export interface Teacher {
  n: number; name: string; designation: string; qualification: string;
}
interface RawTeacher extends Teacher { slug: string; filedOrder: number }

/**
 * All 131 rows, in the order they were filed.
 *
 * ⚠ SORTED BY `filedOrder`, NOT BY NAME. The table's first column is the
 * filing's own row number and the default sort is ascending on it, so the page
 * shows the document rather than a re-ordering of it.
 */
export async function getTeachers(): Promise<Teacher[]> {
  const raw = await cmsFetchAll<RawTeacher>('/api/teachers', {
    sort: ['filedOrder:asc'],
  });
  return raw.map((t) => ({
    n: t.filedOrder, name: t.name,
    designation: t.designation, qualification: t.qualification,
  }));
}

/**
 * ⚠ DERIVED, NEVER A TYPED LIST — as the source said. A designation added to a
 * teacher appears in the filter with no other change, and the filter can never
 * offer an option the table cannot show.
 */
export const designationsOf = (teachers: Teacher[]) =>
  ['All designations', ...Array.from(new Set(teachers.map((t) => t.designation)))];

export async function getDisclosure() {
  const [d, school, teachers] = await Promise.all([
    cmsFetchOne<RawDisclosure>('/api/disclosure-page', { populate: DISCLOSURE_POPULATE }),
    getSchool(),
    getTeachers(),
  ]);

  /**
   * ⚠ THROUGH fileUrl(), NOT `f.url` DIRECTLY. Strapi's local upload provider
   * returns a ROOT-RELATIVE path — "/uploads/x.pdf" — which resolves against the
   * SITE's domain, not the CMS's. A raw `f.url` therefore produces a link that
   * looks right in the markup and 404s in production. fileUrl() prefixes
   * STRAPI_URL, exactly as CmsImage already does for pictures.
   */
  const fileUrlOf = (f: StrapiFile) => fileUrl(f);
  const headline = d?.staffHeadlineCount ?? 0;

  const quick = details(d?.quickInfo);

  /**
   * ⚠ THE CALLOUT QUOTES WHAT THE SCHOOL *FILED*, NOT SITE SETTINGS' DISPLAY
   * FORM. The filing states "7755005905"; Site Settings renders the same number
   * as "+91 77550 05905" for the rest of the site. On a regulatory page the two
   * must not diverge from the document, so the closing paragraph reuses the
   * exact values already shown in the quick-information card above it.
   *
   * ⚠ FOUND BY THE href SCHEME, NOT BY THE LABEL. Matching on "Contact" or
   * "School email" would break the moment CBSE renames a row.
   */
  const byScheme = (scheme: string) => quick.find((r) => r.href?.startsWith(scheme));
  const phoneRow = byScheme('tel:');
  const emailRow = byScheme('mailto:');

  /* Counts the staff paragraph talks about — arithmetic, not stored copy. */
  const vars = {
    ...siteTokens(school),
    teacherCount: String(teachers.length),
    headlineCount: String(headline),
    outsideCount: String(Math.max(0, teachers.length - headline)),
    filedPhone: phoneRow?.v ?? school.phone.officeDisplay ?? '',
    filedTel: phoneRow?.href ?? `tel:${school.phone.office ?? ''}`,
    filedEmail: emailRow?.v ?? school.email ?? '',
    filedEmailHref: emailRow?.href ?? `mailto:${school.email ?? ''}`,
  };

  return {
    sections: (d?.sections ?? []).map((s, i) => ({
      id: s.anchor,
      label: s.label,
      /* The section number follows position; it is never stored. */
      n: String(i + 1).padStart(2, '0'),
    })),

    quickInfo: quick,
    quickNote: fillTokens(d?.quickNote, vars),

    source: {
      pdf: d?.sourcePdfFile ? fileUrl(d.sourcePdfFile) : (d?.sourcePdfHref ?? '#'),
      page: d?.sourcePage ?? '',
      covers: d?.sourceCovers ?? '',
    },
    rail: {
      label: d?.railLabel ?? '',
      pdfTitle: d?.railPdfTitle ?? '',
      pdfBody: d?.railPdfBody ?? '',
      viewLabel: d?.railPdfViewLabel ?? '',
      downloadLabel: d?.railPdfDownloadLabel ?? '',
    },

    generalInformation: details(d?.generalInformation),
    certificates: documents(d?.certificates, fileUrlOf),
    academicDocs: documents(d?.academicDocs, fileUrlOf),
    docViewLabel: d?.docViewLabel ?? 'View PDF',

    /* ⚠ `{ year, x, xii }` — the table's own field names, kept. */
    boardResults: (d?.boardResults ?? []).map((r) => ({
      year: r.year,
      x: {
        registered: r.classX?.registered ?? 0,
        passed: r.classX?.passed ?? 0,
        percentage: r.classX?.percentage ?? '',
      },
      xii: {
        registered: r.classXii?.registered ?? 0,
        passed: r.classXii?.passed ?? 0,
        percentage: r.classXii?.percentage ?? '',
      },
    })),
    boardResultsNote: d?.boardResultsNote ?? '',

    staffSummary: details(d?.staffSummary),
    staffLead: fillTokens(d?.staffLead, vars),

    infrastructure: details(d?.infrastructure),
    inspectionVideo: d?.inspectionVideo ?? '',

    callout: {
      heading: d?.calloutHeading ?? '',
      body: fillTokens(d?.calloutBody, vars),
      photo: d?.calloutPhoto?.image ?? null,
      alt: d?.calloutPhoto?.alt ?? '',
    },

    teachers,
  };
}

/* ── UNIFORM ─────────────────────────────────────────────────────────────── */

interface RawCatalogue {
  id: number; number: string | null; icon: string | null; title: string;
  session: string | null; revised: string | null; linkedAs: string | null;
  file: StrapiFile | null; originHref: string | null;
  pages: number | null; size: string | null;
}
interface RawShoeRow { id: number; classes: string; boys: string; girls: string; days: string }

interface RawUniform {
  topKicker: string | null; topHeading: string | null;
  topBody: string | null; topNote: string | null;
  catalogues: RawCatalogue[] | null;
  classesKicker: string | null; classesHeading: string | null; classesNote: string | null;
  classGroups: PointItem[] | null;
  seasonsKicker: string | null; seasonsHeading: string | null; seasons: RawDetail[] | null;
  shoesKicker: string | null; shoesHeading: string | null; shoesNote: string | null;
  shoeRows: RawShoeRow[] | null;
  notesTitle: string | null; notesBody: string | null; notes: RawParagraph[] | null;
  downloadKicker: string | null; downloadHeading: string | null; downloadNote: string | null;
  sourceHref: string | null; sourceLabel: string | null;
}

export async function getUniform() {
  const [u, school] = await Promise.all([
    cmsFetchOne<RawUniform>('/api/uniform-page', { populate: UNIFORM_POPULATE }),
    getSchool(),
  ]);

  const vars = { ...siteTokens(school), sourceHref: u?.sourceHref ?? '#' };

  return {
    top: {
      kicker: u?.topKicker ?? '',
      heading: u?.topHeading ?? '',
      body: u?.topBody ?? '',
      note: fillTokens(u?.topNote, vars),
    },
    /* ⚠ `href` IS THE STRAPI FILE. A new edition is an upload, not a deploy. */
    catalogues: (u?.catalogues ?? []).map((c) => ({
      n: c.number, mark: c.icon, title: c.title, session: c.session,
      revised: c.revised, linkedAs: c.linkedAs,
      href: c.file ? fileUrl(c.file) : (c.originHref ?? '#'),
      origin: c.originHref ?? '', pages: c.pages ?? 0, size: c.size ?? '',
    })),
    classes: {
      kicker: u?.classesKicker ?? '',
      heading: u?.classesHeading ?? '',
      note: u?.classesNote ?? '',
      groups: points(u?.classGroups),
    },
    seasonsBlock: {
      kicker: u?.seasonsKicker ?? '',
      heading: u?.seasonsHeading ?? '',
      seasons: details(u?.seasons),
    },
    shoes: {
      kicker: u?.shoesKicker ?? '',
      heading: u?.shoesHeading ?? '',
      note: u?.shoesNote ?? '',
      rows: (u?.shoeRows ?? []).map(({ classes, boys, girls, days }) =>
        ({ classes, boys, girls, days })),
    },
    notes: {
      title: u?.notesTitle ?? '',
      body: u?.notesBody ?? '',
      items: texts(u?.notes),
    },
    download: {
      kicker: u?.downloadKicker ?? '',
      heading: u?.downloadHeading ?? '',
      note: fillTokens(u?.downloadNote, vars),
    },
    source: u?.sourceHref ?? '',
    sourceLabel: u?.sourceLabel ?? '',
  };
}

/* ── RESULT ──────────────────────────────────────────────────────────────── */

interface RawResultPage {
  openKicker: string | null; openHeading: string | null; openBody: string | null;
  cardKicker: string | null; cardHeading: string | null; cardBody: string | null;
  ctaLabel: string | null; points: PointItem[] | null;
  cardPhoto: PhotoComponent | null; closePhoto: PhotoComponent | null;
  closeHeading: string | null; sourcePage: string | null;
}

export async function getResultPage() {
  const [r, school] = await Promise.all([
    cmsFetchOne<RawResultPage>('/api/result-page', { populate: RESULT_PAGE_POPULATE }),
    getSchool(),
  ]);
  const vars = siteTokens(school);

  return {
    openKicker: r?.openKicker ?? '',
    openHeading: r?.openHeading ?? '',
    openBody: fillTokens(r?.openBody, vars),
    cardKicker: r?.cardKicker ?? '',
    cardHeading: r?.cardHeading ?? '',
    cardBody: fillTokens(r?.cardBody, vars),
    ctaLabel: r?.ctaLabel ?? '',
    points: points(r?.points).map((p) => ({ ...p, v: fillTokens(p.v, vars) })),
    cardPhoto: r?.cardPhoto?.image ?? null,
    cardPhotoAlt: r?.cardPhoto?.alt ?? '',
    closePhoto: r?.closePhoto?.image ?? null,
    closePhotoAlt: r?.closePhoto?.alt ?? '',
    closeHeading: r?.closeHeading ?? '',
    sourcePage: r?.sourcePage ?? '',
    /* ⚠ THE PORTAL IS SITE SETTINGS', not this page's. One ERP address. */
    portal: school.external.results ?? '#',
  };
}

/* ── TRANSFER CERTIFICATE ────────────────────────────────────────────────── */

interface RawTcPage {
  cardHeading: string | null; cardBody: string | null;
  fieldLabel: string | null; fieldPlaceholder: string | null;
  submitLabel: string | null; busyLabel: string | null; formNote: string | null;
  helpTitle: string | null; help: PointItem[] | null;
  photo: PhotoComponent | null;
  errEmpty: string | null; errShort: string | null;
  statusNoEndpointLead: string | null; statusNoEndpointLink: string | null;
  statusNoEndpointTail: string | null;
  statusFound: string | null; statusFoundLink: string | null;
  statusNotFound: string | null; statusError: string | null;
  sourcePage: string | null;
}

export async function getTcPage() {
  const [t, school] = await Promise.all([
    cmsFetchOne<RawTcPage>('/api/tc-page', { populate: TC_PAGE_POPULATE }),
    getSchool(),
  ]);
  const vars = siteTokens(school);
  const f = (v: string | null | undefined) => fillTokens(v, vars);

  return {
    cardHeading: t?.cardHeading ?? '',
    cardBody: f(t?.cardBody),
    fieldLabel: t?.fieldLabel ?? '',
    fieldPlaceholder: t?.fieldPlaceholder ?? '',
    submitLabel: t?.submitLabel ?? '',
    busyLabel: t?.busyLabel ?? '',
    formNote: f(t?.formNote),
    photo: t?.photo?.image ?? null,
    photoAlt: t?.photo?.alt ?? '',
    helpTitle: t?.helpTitle ?? '',
    help: points(t?.help).map((p) => ({ ...p, v: f(p.v) })),
    /**
     * ⚠ THESE GO TO THE BROWSER AS `data-` ATTRIBUTES. The lookup script stays
     * in code; only its wording comes from here, so the school can reword an
     * error without a developer and cannot break the search doing it.
     */
    messages: {
      errEmpty: f(t?.errEmpty),
      errShort: f(t?.errShort),
      noEndpointLead: f(t?.statusNoEndpointLead),
      noEndpointLink: f(t?.statusNoEndpointLink),
      noEndpointTail: f(t?.statusNoEndpointTail),
      found: f(t?.statusFound),
      foundLink: f(t?.statusFoundLink),
      notFound: f(t?.statusNotFound),
      error: f(t?.statusError),
    },
    sourcePage: t?.sourcePage ?? '',
    officeTel: school.phone.office ?? '',
    officePhone: school.phone.officeDisplay ?? '',
  };
}

/* ── CONTACT ─────────────────────────────────────────────────────────────── */

interface RawContactField {
  id: number; key: string; label: string; error: string | null; required: boolean;
}
interface RawContactPage {
  eyebrow: string | null; heading: string | null; standfirst: string | null;
  fields: RawContactField[] | null;
  classOptions: RawFact[] | null; classPlaceholder: string | null; classLabel: string | null;
  consentLabel: string | null; consentError: string | null;
  submitLabel: string | null; sendingLabel: string | null;
  statusSuccess: string | null; statusFailure: string | null; statusNotConnected: string | null;
  addressHeading: string | null; contactHeading: string | null;
  socialHeading: string | null; locationHeading: string | null;
}

export async function getContactPage() {
  const [c, school] = await Promise.all([
    cmsFetchOne<RawContactPage>('/api/contact-page', { populate: CONTACT_PAGE_POPULATE }),
    getSchool(),
  ]);
  const vars = siteTokens(school);
  const f = (v: string | null | undefined) => fillTokens(v, vars);

  return {
    eyebrow: c?.eyebrow ?? '',
    heading: c?.heading ?? '',
    standfirst: f(c?.standfirst),

    /** Keyed by input id so the markup can look one up rather than index it. */
    fields: Object.fromEntries((c?.fields ?? []).map((x) =>
      [x.key, { label: x.label, error: f(x.error), required: x.required }])),
    fieldList: (c?.fields ?? []).map((x) =>
      ({ key: x.key, label: x.label, error: f(x.error), required: x.required })),

    classOptions: values(c?.classOptions),
    classPlaceholder: c?.classPlaceholder ?? '',
    classLabel: c?.classLabel ?? '',
    consentLabel: c?.consentLabel ?? '',
    consentError: f(c?.consentError),
    submitLabel: c?.submitLabel ?? '',
    sendingLabel: c?.sendingLabel ?? '',
    statusSuccess: f(c?.statusSuccess),
    statusFailure: f(c?.statusFailure),
    statusNotConnected: f(c?.statusNotConnected),

    addressHeading: c?.addressHeading ?? '',
    contactHeading: c?.contactHeading ?? '',
    socialHeading: c?.socialHeading ?? '',
    locationHeading: c?.locationHeading ?? '',
  };
}
