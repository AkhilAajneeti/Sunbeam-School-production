/**
 * SHAPES THE CMS RETURNS.
 *
 * Hand-written rather than generated, deliberately. Strapi can emit types with
 * `strapi ts:generate-types`, but they describe the CONTENT MODEL — every field
 * optional, every relation a union, media possibly an array — not the shape a
 * populated query actually comes back as. Using them means a nullish check on
 * every field in every component, which is noise around real logic.
 *
 * These describe what the queries in ./queries/ actually return, after
 * population and after normalisation. When a schema changes, this file changes
 * with it, and TypeScript then points at every page that needs attention.
 */

/** One derivative Strapi generated at upload. Widths come from config/plugins.ts. */
export interface StrapiFormat {
  url: string;
  width: number;
  height: number;
  mime: string;
  size: number;
}

/**
 * A file from the media library.
 *
 * ⚠ `formats` IS NULL FOR SMALL ORIGINALS. Strapi only derives a size that is
 * genuinely smaller than the source, so an image narrower than the smallest
 * breakpoint has none at all — and an SVG never has any. Everything reading
 * this must cope with an empty object; ./media.ts does.
 */
export interface StrapiFile {
  id: number;
  url: string;
  /** Present on every upload. Kilobytes, as Strapi reports it. */
  size?: number;
  name?: string;
  width: number | null;
  height: number | null;
  mime: string;
  alternativeText: string | null;
  caption: string | null;
  formats: Record<string, StrapiFormat> | null;
}

/** Envelope every Strapi collection response arrives in. */
export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

/** Fields every Strapi document carries. */
export interface StrapiDocument {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/* ── NOTICE ──────────────────────────────────────────────────────────────── */

/**
 * A notice poster, as the site consumes it.
 *
 * ⚠ `date` AND `dateLabel` ARE BOTH REQUIRED AND NEITHER REPLACES THE OTHER.
 * `date` is ISO and exists only for sorting and for the year filter. `dateLabel`
 * is what the poster itself prints and is the only thing ever shown — and it
 * carries precision an ISO date cannot hold: "11 – 16 March 2024" is a range,
 * "June 2026" has no day. Deriving the label from the date would silently
 * rewrite both. Eight of the twenty-four posters print no date at all, so both
 * fields are legitimately absent together.
 */
export interface Notice extends StrapiDocument {
  title: string;
  slug: string;
  sub: string | null;
  date: string | null;
  dateLabel: string | null;
  alt: string;
  featured: boolean;
  displayOrder: number;
  image: StrapiFile;
}

/* ── ACHIEVEMENTS ────────────────────────────────────────────────────────── */

/**
 * An award-graphic achievement, shown at full size.
 *
 * ⚠ `facts` IS string[] HERE, NOT THE COMPONENT SHAPE STRAPI SENDS. Strapi
 * returns a repeatable component as `[{ id, value }]`, because Strapi has no
 * list-of-strings field and a repeatable component is the only thing that gives
 * an editor an "add entry" button rather than a raw JSON box. The query module
 * flattens it back to string[] so Majors.astro's own `m.facts.map()` is
 * untouched — the CMS's storage shape is not the component's problem.
 *
 * ⚠ `slug` IS AN ANCHOR TARGET, NOT DECORATION. It is rendered as the article's
 * HTML id and data/newsEvents.ts links to it. The values are the source file's
 * own ids — robowunder, innovation, khokho — and must not be regenerated from
 * titles.
 */
export interface Major extends StrapiDocument {
  title: string;
  slug: string;
  kicker: string;
  detail: string;
  facts: string[];
  alt: string;
  displayOrder: number;
  art: StrapiFile;
}

/**
 * Third-party recognition.
 *
 * ⚠ `icon` MUST BE A NAME SportIcon KNOWS. It is an enumeration in Strapi for
 * exactly that reason: a free-text field lets an editor type "cup" and get a
 * silently empty icon with no error anywhere. `figure` is null wherever the
 * school publishes no number, and the card omits it.
 */
export interface Credential extends StrapiDocument {
  title: string;
  slug: string;
  figure: string | null;
  body: string;
  icon: string;
  displayOrder: number;
}

/**
 * One line of the full record.
 *
 * ⚠ ONE COLLECTION, TWO BOARDS. `sportRecord` and `academicRecord` were
 * separate arrays with identical shapes; they are one content type separated by
 * `category`, so an editor learns one form rather than two.
 */
export interface AchievementRecord extends StrapiDocument {
  title: string;
  slug: string;
  meta: string;
  body: string;
  category: 'sport' | 'academic';
  displayOrder: number;
}

/* ── SHARED COMPONENTS ───────────────────────────────────────────────────── */

/**
 * A captioned photograph — Strapi's `shared.photo`.
 *
 * ⚠ THE FIELD IS `image` AND IT IS A StrapiFile, not an ImageMetadata. Every
 * gallery in this project used to hold Astro image imports; they now hold CMS
 * media, and the components render them through CmsImage.astro.
 */
export interface PhotoComponent {
  id: number;
  image: StrapiFile;
  alt: string;
  caption: string | null;
}

/**
 * One numbered explanatory card — Strapi's `shared.point`.
 *
 * ⚠ RETURNED IN THE SOURCE'S OWN `{ n, mark, k, v }` SHAPE, not the component's.
 * The CMS uses readable field names because a school secretary fills that form
 * in; the .astro files have destructured n/mark/k/v since they were written and
 * are not being rewritten for a rename. The query layer maps between them.
 */
export interface PointItem {
  n: string | null;
  mark: string | null;
  k: string;
  v: string;
}

/** A counted figure — Strapi's `shared.stat`. */
export interface StatItem {
  count: number;
  suffix: string;
  label: string;
  icon: string | null;
  note: string | null;
}

/** Page metadata — Strapi's `shared.seo`. */
export interface SeoComponent {
  metaTitle: string;
  metaDescription: string;
  ogImage: StrapiFile | null;
  noIndex: boolean;
}

/* ── CAREER ──────────────────────────────────────────────────────────────── */

/**
 * A recruitment poster.
 *
 * ⚠ `alt` CARRIES THE WHOLE VACANCY. The school publishes vacancies only as
 * designed graphics, so the alt text — several hundred words on some posters —
 * is the only machine-readable form of the job. It is not decoration.
 */
export interface JobPosting extends StrapiDocument {
  title: string;
  slug: string;
  tag: string;
  alt: string;
  dated: string | null;
  /** 'hi' where the poster itself is in Hindi; the page sets `lang` on the figure. */
  lang: 'en' | 'hi';
  displayOrder: number;
  image: StrapiFile;
}

/* ── ALUMNI ──────────────────────────────────────────────────────────────── */

export interface Alumnus extends StrapiDocument {
  name: string;
  slug: string;
  study: string;
  placed: string;
  alt: string;
  video: string | null;
  displayOrder: number;
  poster: StrapiFile;
}

/**
 * A reunion.
 *
 * ⚠ THERE IS NO `published` FIELD. The source data had one; it maps onto
 * Strapi's own draft/publish state instead, so an unpublished meet is invisible
 * to the read-only token rather than being returned with a flag the site has to
 * remember to filter on.
 */
export interface AlumniMeet extends StrapiDocument {
  title: string;
  slug: string;
  subtitle: string | null;
  session: string;
  description: string[];
  coverAlt: string | null;
  featured: boolean;
  source: string | null;
  displayOrder: number;
  cover: StrapiFile | null;
  gallery: PhotoComponent[];
}

export interface AlumniStory extends StrapiDocument {
  name: string;
  slug: string;
  batch: string | null;
  photoAlt: string | null;
  profession: string | null;
  organisation: string | null;
  study: string | null;
  quote: string | null;
  story: string[];
  featured: boolean;
  displayOrder: number;
  photo: StrapiFile | null;
  gallery: PhotoComponent[];
}

/* ── ACADEMIC CALENDAR ───────────────────────────────────────────────────── */

/**
 * A published calendar or planner.
 *
 * ⚠ `kind` IS CARRIED, NOT INFERRED FROM WHAT IS ATTACHED. Some years the
 * school published a PDF; 2024 exists only as scanned sheets. A PDF year whose
 * file has not been uploaded yet is still a PDF year and must not silently
 * render as a sheet gallery.
 *
 * ⚠ `href` IS RESOLVED IN THE QUERY. It prefers the uploaded `document` and
 * falls back to the original public path, so the download link works either way.
 */
export interface CalendarDocument extends StrapiDocument {
  year: string;
  slug: string;
  type: string;
  alt: string;
  kind: 'PDF' | 'Sheets';
  href: string | null;
  size: string | null;
  extent: string | null;
  current: boolean;
  displayOrder: number;
  image: StrapiFile;
  sheets: PhotoComponent[];
}

export interface AcademicCalendarPage {
  source: string | null;
  carries: PointItem[];
  planning: PointItem[];
  /**
   * The page's photographs, IN THE ORDER IT PLACES THEM — the two calendar
   * sheets, then the frame that closes the page. They used to come from the
   * shared academics record, which meant this page's words were edited here and
   * its pictures somewhere else entirely.
   */
  shots: PhotoComponent[];
  seo: SeoComponent | null;
}
