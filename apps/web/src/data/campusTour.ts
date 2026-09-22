/**
 * CAMPUS TOUR — categories, gallery and copy.
 *
 * IMAGES ARE GLOBBED, NOT LISTED. `import.meta.glob(..., { eager: true })` hands
 * Astro real ImageMetadata for every file in a facility folder, so adding a
 * photograph to `src/assets/library/` puts it in the Library category, the
 * masonry wall, the lightbox and the photo count without anyone editing this
 * file. A hand-written list of 68 filenames would have gone stale on the first
 * delivery of new photography.
 *
 * WHAT IS REAL AND WHAT IS NOT. Every folder below is the school's own
 * professional shoot — the library shelves are labelled "Ballia Literature", so
 * the provenance is visible in the frames themselves. Five facilities the brief
 * asked for have NO photograph anywhere in the repository:
 *
 *   Shooting Range · Auditorium & Seminar Hall · Medical Centre
 *   Robotics Lab   · Smart Classrooms
 *
 * They are kept in the page as `pending` categories that render a labelled shot
 * brief, because the shooting range in particular is the rarest thing this
 * school has and dropping it would hide the campus's best argument. Two files in
 * `src/assets/photos` LOOK like they would fill these slots and must not be used
 * — `Robotics-drones.jpg` is a consumer DJI product shot and
 * `Smart-classrooms.jpg` is an empty Western lecture theatre. Neither is Ballia.
 *
 * `src/assets/corridor and stairs/` is excluded: all six frames are stored
 * rotated 90° (the "KG-2B" door signs read sideways) with no EXIF orientation
 * flag to correct them, so they would render on their side. They return to the
 * Academic Buildings category the moment they are re-exported upright.
 */

type Glob = Record<string, { default: ImageMetadata }>;

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/**/*.{jpg,jpeg,JPG,JPEG,png,PNG}',
  { eager: true }
) as Glob;

/** Every image in one asset folder, filename-sorted so the order is stable. */
const folder = (name: string): ImageMetadata[] =>
  Object.keys(files)
    .filter((p) => p.startsWith(`../assets/${name}/`))
    .sort()
    .map((p) => files[p].default);

/**
 * The same, restricted to files whose name starts with `prefix`.
 *
 * ⚠ WHY THIS EXISTS. `computer lab/` holds two different rooms shot years apart:
 * five `DSC_*` frames of an EMPTY lab with every machine under a dust sheet, and
 * eleven `it-*` frames of the senior lab full of students working. Plain
 * `folder()` sorts by filename, so `DSC_` sorts before `it-` and the covered,
 * empty room became the lead image everywhere the computer labs appear.
 *
 * A dust-sheeted room is a photograph of a facility not being used, which is the
 * opposite of what these pages are for.
 */
const folderStarting = (name: string, prefix: string): ImageMetadata[] =>
  Object.keys(files)
    .filter((p) => p.startsWith(`../assets/${name}/`) && (p.split('/').pop() ?? '').startsWith(prefix))
    .sort()
    .map((p) => files[p].default);

const single = (path: string): ImageMetadata | undefined => files[`../assets/${path}`]?.default;

export interface Facility {
  id: string;
  name: string;
  /** One line for the card, written to say what the room is FOR. */
  blurb: string;
  images: ImageMetadata[];
  /** No photography yet — renders a brief instead of a cover. */
  pending?: boolean;
  /** Shot brief, used when `pending`. */
  brief?: string;
  /** Alt-text stem; the index is appended for individual frames. */
  alt: string;
}

/** §3 — the categories. Order runs academic → resource → sport → grounds. */
export const facilities: Facility[] = [
  {
    id: 'campus',
    name: 'Academic Buildings',
    blurb: 'The four-storey teaching block at Agarsanda, wrapped around the school ground.',
    images: [single('photos/sunbeem-1.jpg')].filter(Boolean) as ImageMetadata[],
    alt: 'The Sunbeam School Ballia teaching block seen across the school ground',
  },
  {
    id: 'library',
    name: 'Nalanda Library',
    blurb: 'Reading tables, a magazine rack and shelves that run to a Ballia literature section of their own.',
    images: folder('library'),
    alt: 'The Nalanda Library at Sunbeam School Ballia',
  },
  {
    id: 'chemistry',
    name: 'Chemistry Laboratory',
    blurb: 'Fume space, reagent shelving and bench room for a full practical class at once.',
    images: folder('chem lab'),
    alt: 'The chemistry laboratory at Sunbeam School Ballia',
  },
  {
    id: 'biology',
    name: 'Biology Laboratory',
    blurb: 'Microscope benches, specimen models and the dissection tables behind them.',
    images: folder('bio lab'),
    alt: 'The biology laboratory at Sunbeam School Ballia',
  },
  {
    id: 'composite',
    name: 'Composite Science Lab',
    blurb: 'The junior science room, where the first experiments happen before subjects separate.',
    images: folder('composite lab'),
    alt: 'The composite science laboratory at Sunbeam School Ballia',
  },
  {
    id: 'computer',
    name: 'Computer Laboratories',
    blurb: 'Two labs of networked desktops — one for the juniors, one for board-year practicals.',
    /* `it-*` only: the school supplied eleven new frames of the senior lab in
       use, and they replace five older shots of the room empty with its machines
       under dust sheets. See the note on folderStarting(). */
    images: folderStarting('computer lab', 'it-'),
    alt: 'Senior students at work in the computer laboratory at Sunbeam School Ballia',
  },
  {
    id: 'activity',
    name: 'Activity Learning Lab',
    blurb: 'A room built for making things rather than writing about them.',
    images: folder('activity learning lab'),
    alt: 'The activity learning lab at Sunbeam School Ballia',
  },
  {
    id: 'multimedia',
    name: 'Multimedia Room',
    blurb: 'Projection and audio for whole-year screenings, talks and inter-house rounds.',
    images: folder('multimedia room'),
    alt: 'The multimedia room at Sunbeam School Ballia',
  },
  {
    id: 'ground',
    name: 'Playground',
    blurb: 'Open ground for the junior school — the first place anyone runs at break.',
    images: folder('play ground'),
    alt: 'The playground at Sunbeam School Ballia',
  },
  {
    id: 'josh',
    name: 'JOSH Ground',
    blurb: 'The main field, where assembly, athletics and inter-house fixtures all happen.',
    images: folder('JOSH GROUND'),
    alt: 'The JOSH ground at Sunbeam School Ballia',
  },
  {
    id: 'basketball',
    name: 'Basketball Court',
    blurb: 'A full court, in use through the games period and after school.',
    images: folder('basket ball'),
    alt: 'The basketball court at Sunbeam School Ballia',
  },

  /**
   * ⚠ CALLED THE SHOOTING RANGE UNTIL THE SCHOOL CONFIRMED WHAT IT IS.
   *
   * The facility carried the name "Shooting Range" and a standing photography
   * request for "lanes, safety line and a student on the firing point". The
   * photographs that eventually arrived are archery — recurve bows at full draw,
   * quivers, arm guards, a coach on the line — because the range IS the archery
   * range, confirmed by the school.
   *
   * Both were changed together. A picture of bows under a heading that says
   * shooting is the kind of quiet mismatch this site exists not to make, and
   * leaving the old name would have kept a standing request open for a facility
   * that does not exist.
   */
  {
    id: 'archery',
    name: 'Archery Range',
    blurb: 'The rarest facility the school has, and one very few district schools can offer.',
    images: folder('archery-range'),
    alt: 'Students of Sunbeam School Ballia on the archery line, at full draw',
  },
  {
    id: 'auditorium',
    name: 'Auditorium & Seminar Hall',
    blurb: 'Sankalp and Naman Hall — assembly, annual function and visiting speakers.',
    images: [],
    pending: true,
    brief: 'Sankalp or Naman Hall with an audience seated, 16:9 — stage lit, hall full',
    alt: 'The auditorium at Sunbeam School Ballia',
  },
  {
    id: 'medical',
    name: 'Medical Centre',
    blurb: 'First-aid care on campus, for the days a child needs looking after.',
    images: [],
    pending: true,
    brief: 'The infirmary, 4:3 — bed, first-aid cabinet and the attending staff member',
    alt: 'The medical room at Sunbeam School Ballia',
  },
  {
    id: 'robotics',
    name: 'Robotics Lab',
    blurb: 'Where the coding and robotics programme actually builds things.',
    images: [],
    pending: true,
    brief: 'Robotics lab in use, 4:3 — students at the kits, teacher present. NOT a stock drone shot',
    alt: 'The robotics laboratory at Sunbeam School Ballia',
  },
  {
    id: 'smart',
    name: 'Smart Classrooms',
    blurb: 'Interactive panels in the teaching rooms, used in ordinary lessons.',
    images: [],
    pending: true,
    brief: "A Sunbeam Ballia smart classroom mid-lesson, 16:9 — panel in use, children's work on the walls",
    alt: 'A smart classroom at Sunbeam School Ballia',
  },
];

/** Facilities with real photography — the gallery and marquee draw from these. */
export const shot = facilities.filter((f) => !f.pending && f.images.length > 0);

/** Every frame, flattened, with its facility attached — the masonry wall. */
export const allFrames = shot.flatMap((f) =>
  f.images.map((src, i) => ({ src, facility: f.name, id: f.id, alt: `${f.alt} (${i + 1})` }))
);

/**
 * §2 — the overview figures.
 *
 * `count` drives the count-up; everything shown is either a published school
 * figure (docs/01 § 5) or a literal count of the photographs in this repository,
 * which is a fact about the page rather than a claim about the school.
 */
export const overviewStats = [
  { count: 11, suffix: '', label: 'Facilities photographed', note: 'Across the Agarsanda campus' },
  { count: 17574, suffix: '', label: 'Books in the library', note: 'Nalanda Library' },
  { count: 75, suffix: '+', label: 'Smart classrooms', note: '49+ interactive panels' },
  { count: 12, suffix: '', label: 'Subject laboratories', note: 'Science, computing and activity' },
] as const;

/** §7 — a day, in the order a student actually meets the campus. */
export const journey = [
  { id: 'josh', label: 'Morning Assembly', body: 'The whole school on the JOSH ground, before the first bell.' },
  { id: 'smart', label: 'Smart Classroom', body: 'Into the teaching block, and the day’s first lesson on the panel.' },
  { id: 'chemistry', label: 'Laboratories', body: 'Practical period — chemistry, biology or the composite lab downstairs.' },
  { id: 'library', label: 'Library', body: 'A free period among the shelves, or the reading programme.' },
  { id: 'josh', label: 'Sports', body: 'Games period on the ground, or the basketball court.' },
  { id: 'activity', label: 'Activities', body: 'Clubs, the activity lab, and whatever the house is rehearsing.' },
  { id: 'medical', label: 'Medical Support', body: 'And on the days it is needed, someone to look after them.' },
] as const;

/**
 * ═══ THE BAND HEADINGS ═════════════════════════════════════════════════════
 *
 * Every eyebrow and heading on /campus/, in page order. These used to be string
 * literals inside the seven tour components; they live here so the seed can put
 * them in the CMS, where the school can edit them.
 *
 * ⚠ THE QUERY LAYER ALSO HOLDS A COPY, as TOUR_DEFAULTS in
 * lib/cms/queries/campus.ts. That is the fallback for an unseeded or
 * unpublished CMS — this file is what the seed writes. If you change one,
 * change both, or seed again.
 *
 * ⚠ THE GALLERY HAS NO HEADING HERE ON PURPOSE. Masonry's heading counts the
 * photographs it is about to render ("N frames of the campus"); a number typed
 * by hand would go stale the moment a photograph is added. Only its eyebrow is
 * editable.
 */
export const bands = {
  overview: { eyebrow: 'The campus at a glance', heading: 'Twelve laboratories, a library, and room to run' },
  categories: { eyebrow: 'Where to look', heading: 'Every facility, by the room it is' },
  gallery: { eyebrow: 'The whole wall', heading: '' },
  featured: { eyebrow: 'Worth stopping at', heading: 'Six rooms, and what each one is for' },
  journey: { eyebrow: 'A day, end to end', heading: 'How a student meets the campus' },
  visit: { eyebrow: 'Come and see it', heading: 'Experience our campus in person' },
} as const;

/**
 * The visit call-to-action.
 *
 * ⚠ THE PHONE NUMBER IS NOT HERE. VisitCta reads it from site settings
 * (`school.phone.admissions`), which is where all fifty-seven references to it
 * come from. Only the words around it are editable.
 */
export const visitCta = {
  label: 'Book a campus visit',
  href: '/admissions/campus-visit/',
  callLabel: 'Or call admissions',
} as const;

/**
 * §5 — the six featured rooms.
 *
 * ⚠ `id` MATCHES A FACILITY SLUG, exactly as `journey` above does. The row
 * supplies the words; the photographs come from that facility's gallery, and a
 * row whose id matches nothing simply does not render.
 *
 * ⚠ TRANSCRIBED FROM Featured.astro, WHERE THESE WERE HARDCODED. The prose is
 * unchanged — em dashes and all. The component keeps the same array as a
 * fallback until the CMS is seeded everywhere; see the note there.
 */
export const featured = [
  {
    id: 'library',
    title: 'Nalanda Library',
    body:
      'Fifteen thousand books, a magazine rack, and shelving that runs from mythology to a ' +
      'Ballia literature section of its own. Round tables at the centre for group reading, ' +
      'long tables along the wall for the ones who want quiet.',
    highlights: ['17,574 volumes', 'Dedicated reading programme', 'Ballia literature collection'],
  },
  {
    id: 'chemistry',
    title: 'Chemistry Laboratory',
    body:
      'Bench room for a full practical class at once, with reagent shelving along the wall and ' +
      'preparation space behind. Senior practicals run here through the board year.',
    highlights: ['Full-class bench capacity', 'Reagent and apparatus store', 'Board practical ready'],
  },
  {
    id: 'biology',
    title: 'Biology Laboratory',
    body:
      'Microscope benches, specimen models and charts, and the dissection tables behind them — ' +
      'a room set up so a class can work in pairs rather than watch a demonstration.',
    highlights: ['Microscope stations', 'Specimen and model collection', 'Paired practical layout'],
  },
  {
    id: 'computer',
    title: 'Computer Laboratories',
    body:
      'Two laboratories of networked desktops — one sized for the junior school, one for board-year ' +
      'practicals. Part of what a Microsoft Showcase School is expected to have, and does.',
    highlights: ['Two networked labs', 'Junior and senior provision', 'Microsoft Showcase School'],
  },
  {
    id: 'composite',
    title: 'Composite Science Lab',
    body:
      'The junior science room, where the first experiments happen before physics, chemistry and ' +
      'biology separate into rooms of their own.',
    highlights: ['Middle-school science', 'All three disciplines', 'First practical experience'],
  },
  {
    id: 'josh',
    title: 'JOSH Ground',
    body:
      'The main field. Morning assembly happens here, and so do athletics, inter-house fixtures and ' +
      'the games period for most of the school.',
    highlights: ['Morning assembly', 'Inter-house fixtures', 'Athletics and games'],
  },
] as const;
