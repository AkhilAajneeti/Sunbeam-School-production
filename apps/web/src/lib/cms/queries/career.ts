/**
 * CAREER QUERIES.
 *
 * ⚠ MIRRORS data/career.ts — which exported `posters` and `posterCount`.
 * career.astro renders a wall of the school's own recruitment graphics and
 * counts them in its copy, so both come from here.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import { JOB_POSTING_POPULATE, CAREER_PAGE_POPULATE } from '../populate';
import type { JobPosting } from '../types';

/** Every published vacancy poster, in the order the wall shows them. */
export async function getJobPostings(): Promise<JobPosting[]> {
  return cmsFetchAll<JobPosting>('/api/job-postings', {
    populate: JOB_POSTING_POPULATE,
    sort: ['displayOrder:asc'],
  });
}

/**
 * The wall and its count together.
 *
 * ⚠ THE COUNT IS DERIVED, NEVER STORED. data/career.ts computed
 * `posterCount = posters.length`, and the page prints it in a sentence. A stored
 * number is a number that disagrees with the wall the first time somebody adds
 * a poster and forgets to update it.
 */
export async function getCareerPageData(): Promise<{
  posters: JobPosting[];
  posterCount: number;
}> {
  const posters = await getJobPostings();
  return { posters, posterCount: posters.length };
}

/* ── THE PAGE'S OWN COPY ──────────────────────────────────────────────────── */

interface RawBand {
  id: number;
  kicker: string | null;
  heading: string | null;
  body: { id: number; text: string }[] | null;
}
/* shared.measure — `label` is the term, `body` the note beneath it. */
interface RawMethod { id: number; label: string | null; body: string | null }
interface RawCareerPage {
  wall: RawBand | null;
  ctaCvLabel: string | null;
  ctaCallLabel: string | null;
  apply: RawBand | null;
  applyMethods: RawMethod[] | null;
}

export interface CareerBand { heading: string; stand: string }

/**
 * ⚠⚠ THE DEFAULTS ARE THE COPY THAT USED TO BE HARDCODED IN career.astro, and
 * they live here so there is exactly one of each.
 *
 * Every field reads `cms value ?? default`, which means an unseeded or
 * unpublished CMS still renders a complete page — and that clearing a field in
 * the admin RESTORES the default rather than emptying the band. To change a
 * heading an editor types a new one; deleting the old is not how.
 *
 * ⚠ THE POSTING COUNT IS NOT HERE AND MUST NOT BE. It is `posters.length`, so
 * it cannot drift from the wall the way a typed number would.
 *
 * ⚠ THE ADDRESS, EMAIL AND PHONE ARE NOT HERE EITHER. They come from Site
 * Settings, which is where all 57 references to them come from. Only the label
 * and the note around each are editable.
 */
const CAREER_DEFAULTS = {
  wall: {
    heading: 'Work at Sunbeam',
    stand:
      'Every notice the school has published, newest first. Each one names the roles, the ' +
      'subjects and the qualification it asks for — select a poster to read it at full size.',
  },
  ctaCvLabel: 'Send your CV',
  ctaCallLabel: 'Call the office',
  apply: {
    heading: 'How to apply',
    stand: 'Three ways to reach the school about a post.',
  },
  applyMethods: [
    {
      label: 'By email',
      note:
        'Attach your CV and say which role you are applying for. Most of the notices above ask ' +
        'for applications this way.',
    },
    { label: 'By phone', note: 'The school office, during school hours.' },
    {
      label: 'In person',
      note:
        'Driver and conductor applicants are asked to bring their documents and driving licence ' +
        'to the school office.',
    },
  ],
};

const careerBand = (raw: RawBand | null | undefined, fb: CareerBand): CareerBand => ({
  heading: raw?.heading?.trim() || fb.heading,
  stand: raw?.body?.[0]?.text?.trim() || fb.stand,
});

/** The page's editable copy, with every field falling back to its original. */
export async function getCareerCopy() {
  const p = await cmsFetchOne<RawCareerPage>('/api/career-page', {
    populate: CAREER_PAGE_POPULATE,
  });

  const methods = (p?.applyMethods ?? []).filter((m) => m.label?.trim());

  return {
    wall: careerBand(p?.wall, CAREER_DEFAULTS.wall),
    ctaCvLabel: p?.ctaCvLabel?.trim() || CAREER_DEFAULTS.ctaCvLabel,
    ctaCallLabel: p?.ctaCallLabel?.trim() || CAREER_DEFAULTS.ctaCallLabel,
    apply: careerBand(p?.apply, CAREER_DEFAULTS.apply),
    /* ⚠ ALL THREE OR NONE. A partly-filled list would silently drop a method
       from the page; falling back as a whole keeps the three rows intact. */
    applyMethods:
      methods.length === CAREER_DEFAULTS.applyMethods.length
        ? methods.map((m) => ({ label: m.label as string, note: m.body ?? '' }))
        : CAREER_DEFAULTS.applyMethods,
  };
}
