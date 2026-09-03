/**
 * SITE SETTINGS — the global school record.
 *
 * ⚠⚠ THIS MODULE RETURNS THE EXACT SHAPE data/site.ts EXPORTED, AND THAT IS
 * DELIBERATE. Fifty-seven files read `school.phone.officeDisplay`,
 * `school.address.city`, `school.external.results`, `school.streams.join(...)`.
 * Rebuilding that shape here means each of those files changes ONE LINE — its
 * import — rather than every reference inside it.
 *
 * The CMS stores contact details as one component because that is the sensible
 * admin form; site.ts split numbers under `phone` and left emails at the top
 * level. The mapping between the two lives here and nowhere else.
 *
 * ⚠ IT THROWS IF SITE SETTINGS HAVE NOT BEEN PUBLISHED. Every page on the site
 * shows the school's name; there is no sensible partial render. A build that
 * cannot read this should stop with an instruction, not quietly emit 174 pages
 * with an empty masthead.
 */
import { cmsFetchOne } from '../client';
import { SITE_SETTINGS_POPULATE } from '../populate';
import type { StrapiFile } from '../types';

interface FactComponent { id: number; value: string }
interface LinkComponent {
  id: number;
  label: string;
  description: string | null;
  href: string;
  external: boolean;
}

interface RawSiteSettings {
  name: string;
  shortName: string;
  motto: string;
  mottoParts: FactComponent[] | null;
  groupPhrase: string | null;
  tagline: string | null;
  admissionsOpen: boolean;
  established: number;
  groupFounded: number | null;
  groupFoundedAt: string | null;
  founders: string | null;
  openingStrength: number | null;
  currentStrength: string | null;
  teachingStaff: string | null;
  classRange: string | null;
  principal: string | null;
  streams: FactComponent[] | null;
  address: Record<string, string | null>;
  contact: Record<string, string | null>;
  social: Record<string, string | null>;
  external: Record<string, string | null>;
  affiliation: Record<string, string | null>;
  quickAccess: LinkComponent[] | null;
}

/** The shape data/site.ts exported, rebuilt from the CMS. */
export interface School {
  name: string;
  shortName: string;
  motto: string;
  mottoParts: string[];
  groupPhrase: string | null;
  tagline: string | null;
  admissionsOpen: boolean;
  established: number;
  groupFounded: number | null;
  groupFoundedAt: string | null;
  founders: string | null;
  openingStrength: number | null;
  currentStrength: string | null;
  teachingStaff: string | null;
  classRange: string | null;
  principal: string | null;
  streams: string[];
  board: string | null;
  boardFull: string | null;
  affiliationNo: string | null;
  schoolCode: string | null;
  udise: string | null;
  affiliationPeriod: string | null;
  affiliationLetterNo: string | null;
  affiliationLetterDated: string | null;
  affiliationSubject: string | null;
  email: string | null;
  recruitmentEmail: string | null;
  address: {
    line1: string | null; city: string | null; state: string | null;
    pin: string | null; country: string | null; landmark: string | null;
  };
  phone: {
    admissions: string | null; admissionsDisplay: string | null;
    office: string | null; officeDisplay: string | null;
    transport: string | null; transportDisplay: string | null;
    transportIncharge: string | null;
  };
  social: Record<string, string | null>;
  external: Record<string, string | null>;
}

export interface QuickAccessItem {
  label: string;
  desc: string | null;
  href: string;
  external: boolean;
}

const values = (arr: FactComponent[] | null | undefined): string[] =>
  (arr ?? []).map((f) => f.value);

/**
 * The school record and the quick-access tiles.
 *
 * One request, cached for the build — so all 57 consumers share a single round
 * trip no matter how many pages import it.
 */
export async function getSiteSettings(): Promise<{
  school: School;
  quickAccess: QuickAccessItem[];
}> {
  const raw = await cmsFetchOne<RawSiteSettings>('/api/site-setting', {
    populate: SITE_SETTINGS_POPULATE,
  });

  if (!raw?.name) {
    throw new Error(
      [
        '',
        '  Site Settings have not been published in Strapi.',
        '',
        '  Every page on this site prints the school name, so there is no',
        '  partial render worth emitting. Seed and publish them:',
        '',
        '      cd apps/cms && npm run seed:site',
        '',
      ].join('\n'),
    );
  }

  const c = raw.contact ?? {};
  const a = raw.affiliation ?? {};

  const school: School = {
    name: raw.name,
    shortName: raw.shortName,
    motto: raw.motto,
    mottoParts: values(raw.mottoParts),
    groupPhrase: raw.groupPhrase,
    tagline: raw.tagline,
    admissionsOpen: raw.admissionsOpen,
    established: raw.established,
    groupFounded: raw.groupFounded,
    groupFoundedAt: raw.groupFoundedAt,
    founders: raw.founders,
    openingStrength: raw.openingStrength,
    currentStrength: raw.currentStrength,
    teachingStaff: raw.teachingStaff,
    classRange: raw.classRange,
    principal: raw.principal,
    streams: values(raw.streams),

    /* Affiliation was flat on `school` and is a component in the CMS. */
    board: a.board ?? null,
    boardFull: a.boardFull ?? null,
    affiliationNo: a.affiliationNo ?? null,
    schoolCode: a.schoolCode ?? null,
    udise: a.udise ?? null,
    affiliationPeriod: a.affiliationPeriod ?? null,
    affiliationLetterNo: a.affiliationLetterNo ?? null,
    affiliationLetterDated: a.affiliationLetterDated ?? null,
    affiliationSubject: a.affiliationSubject ?? null,

    /* Emails sat at the top level; they live with the phones in the CMS. */
    email: c.email ?? null,
    recruitmentEmail: c.recruitmentEmail ?? null,

    address: {
      line1: raw.address?.line1 ?? null,
      city: raw.address?.city ?? null,
      state: raw.address?.state ?? null,
      pin: raw.address?.pin ?? null,
      country: raw.address?.country ?? null,
      landmark: raw.address?.landmark ?? null,
    },

    phone: {
      admissions: c.admissions ?? null,
      admissionsDisplay: c.admissionsDisplay ?? null,
      office: c.office ?? null,
      officeDisplay: c.officeDisplay ?? null,
      transport: c.transport ?? null,
      transportDisplay: c.transportDisplay ?? null,
      transportIncharge: c.transportIncharge ?? null,
    },

    social: raw.social ?? {},
    external: raw.external ?? {},
  };

  const quickAccess: QuickAccessItem[] = (raw.quickAccess ?? []).map((q) => ({
    label: q.label,
    desc: q.description,
    href: q.href,
    external: q.external,
  }));

  return { school, quickAccess };
}

/** Convenience for the many files that need only the school record. */
export async function getSchool(): Promise<School> {
  return (await getSiteSettings()).school;
}
