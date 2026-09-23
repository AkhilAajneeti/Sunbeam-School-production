/**
 * PUBLICATIONS QUERIES.
 *
 * ⚠ MIRRORS data/publications.ts — which exported `clubs`, `magazine`,
 * `newspaper` and `myraAlt`. The page destructures exactly those names, so the
 * shapes returned here match them and the component changed only its import.
 *
 * ═══ WHY A COLLECTION AND NOT A LIST IN A SINGLE TYPE ══════════════════════
 *
 * This is the one page on the site whose content the school genuinely adds to —
 * a new e-newspaper issue every month or two. As a collection, that is one new
 * row with a title, a link and a group. As a repeatable component inside a
 * single type it would be a nested list 33 entries long that an editor has to
 * scroll and reorder by hand.
 *
 * ⚠⚠ NOTHING HERE INVENTS A PUBLICATION. Every href was transcribed from the
 * school's own page. A group with no rows renders no band at all, which is the
 * correct behaviour — an empty "Quiz Club" heading is worse than its absence.
 */
import { fileUrl } from '../media';
import { cmsFetchAll, cmsFetchOne } from '../client';
import { PUBLICATIONS_PAGE_POPULATE } from '../populate';
import type { StrapiFile } from '../types';

export interface Publication {
  title: string;
  href: string;
}

export interface PublicationGroup {
  /** Doubles as the section's DOM id and its aria-labelledby target. */
  id: string;
  heading: string;
  items: Publication[];
}

interface RawPublication {
  title: string;
  href: string;
  group: string;
  displayOrder: number;
  file: StrapiFile | null;
}
interface RawDetail { id: number; label: string | null; value: string | null }
interface RawMyraPage { id: number; image: StrapiFile | null; alt: string | null }
interface RawPublicationsPage {
  groupHeadings: RawDetail[] | null;
  myraPages: RawMyraPage[] | null;
}

/** One page of the MYRA newsletter. `image` is null where the CMS has none. */
export interface MyraPage {
  image: StrapiFile | null;
  alt: string;
}

/**
 * ⚠ THE CLUB BANDS RENDER IN THIS ORDER, and it is the school's own. It is not
 * alphabetical and not a ranking; re-sorting would silently reorder the page.
 */
const CLUB_GROUPS = [
  'entrepreneurial-chronicles',
  'quiz-club',
  'moon-club',
  'heritage-club',
  'financial-literacy-club',
] as const;

/**
 * ⚠⚠ THE HEADINGS FALL BACK TO THE ORIGINALS. An unseeded or unpublished CMS
 * would otherwise render bands with blank headings — worse than the old
 * hardcoded page, not better. Clearing a heading in the admin therefore
 * restores its default rather than emptying it.
 */
const HEADING_DEFAULTS: Record<string, string> = {
  'entrepreneurial-chronicles': 'Entrepreneurial Chronicles',
  'quiz-club': 'Quiz Club',
  'moon-club': 'Moon Club',
  'heritage-club': 'Heritage Club',
  'financial-literacy-club': 'Financial Literacy Club',
  'school-magazine': 'Our School Magazine',
  'e-newspaper': 'E-Newspaper',
  /* ⚠ THE MYRA HEADING GOES THROUGH THE SAME MECHANISM as every other band,
     rather than getting a field of its own. It is a heading over a group of
     publications like the rest; the only difference is that its group is shown
     as page scans instead of download cards. */
  'myra-stem-lab': 'MYRA STEM LAB',
};

/**
 * ⚠ THE ALT TEXT DESCRIBES WHAT EACH PAGE SHOWS. The school's own widget ships
 * all five with empty alt; these were written for this site and are the
 * fallback if the CMS has none.
 *
 * ⚠⚠ AND THE COUNT IS LOAD-BEARING. Where the CMS has no pages at all, the
 * component falls back to five bundled scans and pairs them with these five
 * strings by index. Add a sixth string here without a sixth scan and the rail
 * renders an alt for a page that does not exist.
 */
const MYRA_ALT_DEFAULTS = [
  'Page one of the MYRA STEM Lab newsletter, June 2026 — the Centre of Excellence cover.',
  'A page of the MYRA STEM Lab newsletter showing student activities and a timetable.',
  'A page of the MYRA STEM Lab newsletter covering a pitch competition.',
  'A page of the MYRA STEM Lab newsletter with project write-ups and a world map.',
  'The closing page of the MYRA STEM Lab newsletter, carrying the school crest.',
];

/** Everything /publications/ renders. */
export async function getPublicationsData(): Promise<{
  clubs: PublicationGroup[];
  magazine: PublicationGroup;
  newspaper: PublicationGroup;
  myraHeading: string;
  /** Empty when the CMS has none — the component then shows its bundled scans. */
  myraPages: MyraPage[];
  myraAlt: string[];
}> {
  const [rows, page] = await Promise.all([
    /* ⚠ `file` MUST BE POPULATED BY NAME. A media field left out of populate
       comes back undefined, and every publication would fall through to its
       old off-site href as though nothing had been uploaded. */
    cmsFetchAll<RawPublication>('/api/publications', {
      sort: ['displayOrder:asc'],
      populate: { file: true },
    }),
    cmsFetchOne<RawPublicationsPage>('/api/publications-page', {
      populate: PUBLICATIONS_PAGE_POPULATE,
    }),
  ]);

  /* label = the machine key, value = the heading. See the schema's note. */
  const headings = new Map<string, string>();
  for (const h of page?.groupHeadings ?? []) {
    if (h.label?.trim() && h.value?.trim()) headings.set(h.label.trim(), h.value.trim());
  }
  const headingFor = (id: string) => headings.get(id) || HEADING_DEFAULTS[id] || id;

  const itemsIn = (id: string): Publication[] =>
    rows.filter((r) => r.group === id).map((r) => ({
      title: r.title,
      /* ⚠ THE UPLOADED FILE WINS. A publication held in this CMS is served
         from it; `href` is only the fallback for one still hosted on the
         school's old site, and it is the thing being retired. */
      href: r.file ? fileUrl(r.file) : r.href,
    }));

  const group = (id: string): PublicationGroup => ({
    id,
    heading: headingFor(id),
    items: itemsIn(id),
  });

  /**
   * ⚠ A PAGE WITHOUT AN IMAGE IS DROPPED, not rendered as a gap. `image` is
   * required in the CMS, so this only happens if a row was saved before the
   * field existed — but a rail plate with nothing in it reads as a broken
   * image, and one fewer page reads as five pages.
   */
  const myraPages: MyraPage[] = (page?.myraPages ?? [])
    .filter((m) => m.image)
    .map((m, i) => ({
      image: m.image,
      alt: m.alt?.trim() || MYRA_ALT_DEFAULTS[i] || '',
    }));

  return {
    /* ⚠ A CLUB WITH NO PUBLICATIONS IS DROPPED, not rendered as an empty band.
       The component maps over whatever it is given, so the filter is the whole
       mechanism — no `{items.length > 0 && …}` needed downstream. */
    clubs: CLUB_GROUPS.map(group).filter((g) => g.items.length > 0),
    magazine: group('school-magazine'),
    newspaper: group('e-newspaper'),
    myraHeading: headingFor('myra-stem-lab'),
    myraPages,
    /* The fallback alts, used only when `myraPages` is empty and the component
       falls back to its bundled scans. */
    myraAlt: MYRA_ALT_DEFAULTS,
  };
}
