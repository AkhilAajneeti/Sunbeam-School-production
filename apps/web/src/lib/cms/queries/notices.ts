/**
 * NOTICE QUERIES — the reference for every content type that follows.
 *
 * ⚠ THESE EXPORTS DELIBERATELY MIRROR data/notices.ts. The old module exported
 * `notices`, `featuredNotices`, `noticeYears` and `noticeSource`, and the page
 * that consumes them is a carefully built piece of UI that is not being
 * redesigned. Matching the shape means the component's own logic — the rotator,
 * the year filter, the search, the load-more — is untouched, and the only edit
 * to it is where the data comes from.
 *
 * ⚠ ONLY PUBLISHED NOTICES ARE RETURNED. Strapi's default for a read-only token
 * is published-only, which is what a static build must have: a draft an editor
 * is midway through writing has no business appearing on the live site. Drafts
 * are visible in the admin's preview, not here.
 */
import { cmsFetchAll } from '../client';
import { NOTICE_POPULATE } from '../populate';
import type { Notice } from '../types';

/**
 * The school's own notice page.
 *
 * ⚠ STILL A CONSTANT, NOT CMS CONTENT — on purpose. It is one external URL that
 * has never changed and belongs with the other external destinations in
 * data/site.ts. It moves into a `site-settings` single type when that is built,
 * along with the rest of site.ts, rather than becoming a lone editable field
 * with nowhere sensible to live in the admin.
 */
export const noticeSource = 'https://sunbeamballia.edu.in/notice/';

/**
 * Every published notice, in the order the page shows them.
 *
 * ⚠ SORTED BY displayOrder, NOT BY date, AND THAT IS NOT LAZINESS. Eight of the
 * twenty-four posters print no date at all. Sorting by date in Postgres puts
 * those NULLs FIRST on a descending sort — the undated posters would lead the
 * page, which is the exact opposite of the intended order, where they sit at
 * the end. displayOrder was seeded from the curated order in data/notices.ts
 * and is what an editor drags to change it.
 */
export async function getNotices(): Promise<Notice[]> {
  return cmsFetchAll<Notice>('/api/notices', {
    populate: NOTICE_POPULATE,
    sort: ['displayOrder:asc'],
  });
}

/**
 * The rotating featured set.
 *
 * ⚠ THE FALLBACK IS THE POINT. If nobody has flagged anything the rotator still
 * has something to show — the three most recent — rather than rendering an
 * empty band. Same rule the old data module used.
 */
export function selectFeatured(all: Notice[]): Notice[] {
  const flagged = all.filter((n) => n.featured);
  return flagged.length > 0 ? flagged : all.slice(0, 3);
}

/**
 * Years present in the data, newest first.
 *
 * ⚠ DERIVED, NEVER TYPED — the same rule the old module documented. A year with
 * no notice cannot appear in the filter, and a notice published in a new year
 * adds its year automatically. A hand-kept list would show a year that filters
 * to nothing.
 */
export function selectYears(all: Notice[]): string[] {
  return Array.from(
    new Set(all.filter((n) => n.date).map((n) => n.date!.slice(0, 4))),
  ).sort((a, b) => Number(b) - Number(a));
}

/**
 * Everything the notices page needs, in one call and therefore one request.
 * The three derived values are computed from the same array rather than
 * re-queried, so they cannot disagree with the grid they describe.
 */
export async function getNoticesPageData(): Promise<{
  notices: Notice[];
  featuredNotices: Notice[];
  noticeYears: string[];
  noticeSource: string;
}> {
  const notices = await getNotices();

  return {
    notices,
    featuredNotices: selectFeatured(notices),
    noticeYears: selectYears(notices),
    noticeSource,
  };
}
