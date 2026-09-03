/**
 * CAREER QUERIES.
 *
 * ⚠ MIRRORS data/career.ts — which exported `posters` and `posterCount`.
 * career.astro renders a wall of the school's own recruitment graphics and
 * counts them in its copy, so both come from here.
 */
import { cmsFetchAll } from '../client';
import { JOB_POSTING_POPULATE } from '../populate';
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
