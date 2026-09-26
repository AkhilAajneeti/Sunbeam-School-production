/**
 * NEWS QUERIES — the four chronicles, plus the derived achievements one.
 *
 * ⚠ THE RETURNED SHAPE IS data/newsPages.ts's `ChroniclePage`, DELIBERATELY.
 * Each index route did `workshops.groups.flatMap(g => g.items)` and each detail
 * route passed `page={workshops}` into DetailPage. Rebuilding the same
 * page → groups → items nesting here means those ten routes change one import
 * line each, and DetailPage/CardGrid keep every calculation they already had.
 *
 * ⚠ FOUR CHRONICLES ARE ONE COLLECTION. `category` separates them; `group`
 * points at a groupId on the page record. The nesting is reassembled here, once,
 * rather than in four places.
 *
 * ⚠⚠ ACHIEVEMENTS IS DERIVED AND HAS NO news-item ROWS. data/newsEvents.ts built
 * it as `majors.map(...)` — every field a projection of a Major Achievement.
 * Storing copies would give one fact two owners, so the projection happens here
 * instead, against the live Major records. Editing a Major updates the chronicle.
 */
import { cmsFetchAll } from '../client';
import { NEWS_ITEM_POPULATE, NEWS_CATEGORY_PAGE_POPULATE } from '../populate';
import { getMajors } from './achievements';
import type { StrapiFile, PhotoComponent, Major } from '../types';

export type NewsCategory = 'workshop' | 'competition' | 'celebration' | 'school-event' | 'activity';

/** ChroniclePage slug → the enum stored on news-item. */
const SLUG_TO_CATEGORY: Record<string, NewsCategory> = {
  workshops: 'workshop',
  competitions: 'competition',
  celebrations: 'celebration',
  'school-events': 'school-event',
  /* School activities live at /beyond-academics/, not /news-events/ — same
     ChroniclePage shape, different URL space. See seed/sports.mjs. */
  'school-activities': 'activity',
};

export interface ChronicleItem {
  title: string;
  slug: string;
  meta: string;
  body: string;
  result?: string | null;
  when?: string | null;
  href?: string | null;
  fit?: 'cover' | 'contain';
  art: StrapiFile | null;
  gallery: PhotoComponent[];
}

export interface ChronicleGroup {
  id: string;
  label: string;
  note: string | null;
  items: ChronicleItem[];
}

export interface ChroniclePage {
  slug: string;
  title: string;
  standfirst: string;
  eyebrow: string;
  heading: string;
  stand: string;
  groups: ChronicleGroup[];
}

interface RawGroup { id: number; groupId: string; label: string; note: string | null }
interface RawPage {
  slug: string; title: string; standfirst: string; eyebrow: string;
  heading: string; stand: string; groups: RawGroup[] | null; displayOrder: number;
}
interface RawItem extends Omit<ChronicleItem, 'gallery'> {
  category: NewsCategory;
  group: string;
  displayOrder: number;
  gallery: PhotoComponent[] | null;
}

const S = 'Sunbeam School Ballia';

/**
 * The achievements chronicle, projected from Major Achievement.
 *
 * ⚠ EVERY LINE HERE MIRRORS data/newsEvents.ts's own mapping, including
 * `fit: 'contain'` — these are designed award graphics with their own headline,
 * and cropping one to fill a card cuts its headline off.
 */
function majorsAsItems(majors: Major[]): ChronicleItem[] {
  return majors.map((m) => ({
    title: m.title,
    /* The Major's slug, not a new one: it is the anchor id Majors.astro renders
       and the URL /news-events/achievements/<slug>/ already uses. */
    slug: m.slug,
    meta: m.kicker,
    body: m.detail,
    result: m.facts.join(' · '),
    when: null,
    href: null,
    fit: 'contain' as const,
    art: m.art,
    gallery: [],
  }));
}

/**
 * One chronicle page, fully assembled.
 *
 * @param slug 'workshops' | 'competitions' | 'celebrations' | 'school-events' | 'achievements'
 */
export async function getChroniclePage(slug: string): Promise<ChroniclePage> {
  /* A filtered COLLECTION query, so cmsFetchAll — cmsFetchOne is for single
     types and would unwrap the wrong shape. */
  const [p] = await cmsFetchAll<RawPage>('/api/news-category-pages', {
    filters: { slug: { $eq: slug } },
    populate: NEWS_CATEGORY_PAGE_POPULATE,
  });

  if (!p) throw new Error(`No news-category-page published for slug "${slug}"`);

  const groups = p.groups ?? [];

  /* Achievements carries a header only — its items come from the Majors. */
  if (slug === 'achievements') {
    const majors = await getMajors();
    return {
      slug: p.slug, title: p.title, standfirst: p.standfirst,
      eyebrow: p.eyebrow, heading: p.heading, stand: p.stand,
      groups: groups.map((g) => ({
        id: g.groupId, label: g.label, note: g.note,
        items: majorsAsItems(majors),
      })),
    };
  }

  const category = SLUG_TO_CATEGORY[slug];
  if (!category) throw new Error(`Unknown chronicle slug "${slug}"`);

  const items = await cmsFetchAll<RawItem>('/api/news-items', {
    filters: { category: { $eq: category } },
    populate: NEWS_ITEM_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return {
    slug: p.slug,
    title: p.title,
    standfirst: p.standfirst,
    eyebrow: p.eyebrow,
    heading: p.heading,
    stand: p.stand,
    groups: groups.map((g) => ({
      id: g.groupId,
      label: g.label,
      note: g.note,
      items: items
        .filter((i) => i.group === g.groupId)
        .map((i) => ({
          title: i.title, slug: i.slug, meta: i.meta, body: i.body,
          result: i.result, when: i.when, href: i.href, fit: i.fit,
          art: i.art ?? null,
          gallery: i.gallery ?? [],
        })),
    })),
  };
}

/**
 * The photographs a detail page shows in its gallery.
 *
 * ⚠⚠ `art` NO LONGER SWALLOWS THE GALLERY. This used to return `[item.art]` and
 * nothing else whenever an item had one, so an entry with a banner AND a photo
 * folder showed the banner and silently dropped every photograph — which is
 * what a school editor hit the first time they filled both fields.
 *
 * The two mean different things and now go to different places: `art` is the
 * page's banner (see DetailPage), the gallery is the gallery. Nothing is
 * dropped either way — a portrait `art`, which a panoramic banner would slice
 * through the middle, is put back at the front of this list instead.
 *
 * ⚠ CHANGING THIS CHANGED NO LIVE PAGE. Of 84 published news items, exactly two
 * carried an `art` file when this was written, and both were the same test
 * entry; no school content used the old rule at all.
 */
export function photosOf(item: ChronicleItem): StrapiFile[] {
  return item.gallery.map((g) => g.image).filter(Boolean);
}

/** The card face: the art, else the first gallery photograph. */
export function faceOf(item: ChronicleItem): StrapiFile | null {
  return item.art ?? item.gallery[0]?.image ?? null;
}

/** Alt text, matching what the site has always rendered. */
export function photoAlt(item: ChronicleItem, index: number, total: number): string {
  return `${item.title} at ${S} — photograph ${index + 1} of ${total}`;
}
