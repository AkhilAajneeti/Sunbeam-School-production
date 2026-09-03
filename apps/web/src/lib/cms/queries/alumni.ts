/**
 * ALUMNI QUERIES.
 *
 * ⚠ MIRRORS data/alumni.ts AND data/alumniMeets.ts, which between them exported
 * `alumni`, `publishedMeets`, `featuredMeet`, `publishedStories` and
 * `alumniGallery`. Four of those five were DERIVED — filters and flatMaps over
 * two base arrays — and they stay derived here, computed from what one request
 * returned rather than re-queried, so they cannot disagree with each other.
 *
 * ⚠ "PUBLISHED" NEEDS NO FILTER ANY MORE. The source arrays carried a
 * `published` boolean and every consumer had to remember `.filter(m =>
 * m.published)`. In Strapi that state is the document's own, and the read-only
 * token cannot see a draft at all — so an unpublished meet is not filtered out,
 * it never arrives. The names below keep the word only because the components
 * destructure them.
 */
import { cmsFetchAll } from '../client';
import { ALUMNUS_POPULATE, ALUMNI_MEET_POPULATE, ALUMNI_STORY_POPULATE } from '../populate';
import type { Alumnus, AlumniMeet, AlumniStory, PhotoComponent } from '../types';

/** What Strapi sends for a repeatable paragraph component. */
interface RawParagraph {
  id: number;
  text: string;
}
type RawMeet = Omit<AlumniMeet, 'description'> & { description: RawParagraph[] | null };
type RawStory = Omit<AlumniStory, 'story'> & { story: RawParagraph[] | null };

/** Flatten shared.paragraph back to the string[] the components render. */
const paragraphs = (raw: RawParagraph[] | null | undefined): string[] =>
  (raw ?? []).map((p) => p.text);

/** Alumni placement cards. */
export async function getAlumni(): Promise<Alumnus[]> {
  return cmsFetchAll<Alumnus>('/api/alumni', {
    populate: ALUMNUS_POPULATE,
    sort: ['displayOrder:asc'],
  });
}

/** Published reunions, in page order. */
export async function getAlumniMeets(): Promise<AlumniMeet[]> {
  const raw = await cmsFetchAll<RawMeet>('/api/alumni-meets', {
    populate: ALUMNI_MEET_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return raw.map((m) => ({ ...m, description: paragraphs(m.description) }));
}

/** Published alumni profiles. Empty today — the school has supplied none. */
export async function getAlumniStories(): Promise<AlumniStory[]> {
  const raw = await cmsFetchAll<RawStory>('/api/alumni-stories', {
    populate: ALUMNI_STORY_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return raw.map((s) => ({ ...s, story: paragraphs(s.story) }));
}

/**
 * Everything the alumni pages need, in two requests.
 *
 * ⚠ `featuredMeet` KEEPS ITS FALLBACK. data/alumniMeets.ts defined it as "the
 * flagged one, else the newest", so a page whose editor has flagged nothing
 * still has a headline meet instead of an empty band.
 */
export async function getAlumniPageData(): Promise<{
  alumni: Alumnus[];
  publishedMeets: AlumniMeet[];
  featuredMeet: AlumniMeet | undefined;
  publishedStories: AlumniStory[];
  alumniGallery: PhotoComponent[];
}> {
  const [alumni, publishedMeets, publishedStories] = await Promise.all([
    getAlumni(),
    getAlumniMeets(),
    getAlumniStories(),
  ]);

  return {
    alumni,
    publishedMeets,
    featuredMeet: publishedMeets.find((m) => m.featured) ?? publishedMeets[0],
    publishedStories,
    /* Every photograph across every published meet — the page's gallery strip.
       Exactly the flatMap the data file did. */
    alumniGallery: publishedMeets.flatMap((m) => m.gallery ?? []),
  };
}
