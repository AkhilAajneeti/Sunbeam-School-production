/**
 * PAGE META — route-level SEO and hero content.
 *
 * ⚠ ONE REQUEST FOR THE WHOLE SITE, NOT ONE PER PAGE. There are 74 rows and a
 * build renders 174 pages; fetching per page would be 174 round trips for a
 * table that fits comfortably in one. The whole set is loaded once, indexed by
 * route, and every page looks itself up in memory.
 *
 * ⚠ THE KEY IS THE ROUTE, IN ASTRO'S TRAILING-SLASH FORM — `/academics/`, `/`.
 * The project sets `trailingSlash: 'always'` and every internal href already
 * uses it, but a lookup that disagrees with the seed by one slash finds nothing
 * and the page silently loses its title. `normaliseRoute` is the single place
 * that shape is decided, and both sides go through it.
 *
 * ⚠ A MISSING ROW IS NOT AN ERROR. Dynamic routes — /alumni/<slug>/ and the
 * news detail pages — have no page-meta row by design: their SEO comes from the
 * record they render. They pass their own title and description as props, and
 * the lookup returning null is the expected path, not a fault.
 */
import { cmsFetchAll } from '../client';
import { PAGE_META_POPULATE } from '../populate';
import type { StrapiFile, SeoComponent } from '../types';

interface CrumbComponent {
  id: number;
  label: string;
  href: string;
}

export interface PageMeta {
  route: string;
  seo: SeoComponent;
  titleStandalone: boolean;
  heroTitle: string | null;
  heroStandfirst: string | null;
  heroAlt: string | null;
  heroPosition: string | null;
  heroBanner: StrapiFile | null;
  crumbs: { label: string; href: string }[];
}

interface RawPageMeta extends Omit<PageMeta, 'crumbs'> {
  crumbs: CrumbComponent[] | null;
}

/**
 * One canonical shape for a route key: leading slash, trailing slash, no query
 * or hash. `/` stays `/`.
 */
export function normaliseRoute(input: string): string {
  let r = (input || '/').split('?')[0].split('#')[0];
  if (!r.startsWith('/')) r = `/${r}`;
  if (!r.endsWith('/')) r = `${r}/`;
  return r;
}

let index: Map<string, PageMeta> | null = null;

async function loadIndex(): Promise<Map<string, PageMeta>> {
  if (index) return index;

  const rows = await cmsFetchAll<RawPageMeta>('/api/page-metas', {
    populate: PAGE_META_POPULATE,
    sort: ['route:asc'],
  });

  const map = new Map<string, PageMeta>();
  for (const r of rows) {
    map.set(normaliseRoute(r.route), {
      ...r,
      crumbs: (r.crumbs ?? []).map((c) => ({ label: c.label, href: c.href })),
    });
  }

  /* ⚠ CACHED ONLY WHEN THE CLIENT'S CACHE IS. In dev the client refetches so a
     CMS edit shows up on reload; holding a module-level index here would defeat
     that for the one content type where "did my edit appear?" is the whole
     verification. */
  if (import.meta.env.PROD) index = map;
  return map;
}

/** Metadata for one route, or null where none is expected (dynamic routes). */
export async function getPageMeta(route: string): Promise<PageMeta | null> {
  const map = await loadIndex();
  return map.get(normaliseRoute(route)) ?? null;
}

/**
 * The full <title>, composed rather than stored.
 *
 * ⚠ THE SCHOOL'S NAME WAS HARDCODED IN 66 OF 67 TITLES. Every page ended
 * " — Sunbeam School Ballia", which meant renaming the school would have meant
 * editing 66 rows. `metaTitle` now holds the page's own part and the name comes
 * from site-settings, so the two cannot drift. The rendered string is identical.
 *
 * `titleStandalone` is the homepage, whose title LEADS with the name instead of
 * ending in it — stored whole and returned untouched.
 */
export function composeTitle(meta: PageMeta | null, schoolName: string, fallback?: string): string {
  if (!meta?.seo?.metaTitle) return fallback ?? schoolName;
  return meta.titleStandalone ? meta.seo.metaTitle : `${meta.seo.metaTitle} — ${schoolName}`;
}

/** Testing and dev hygiene. */
export function clearPageMetaIndex(): void {
  index = null;
}
