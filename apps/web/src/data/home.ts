/**
 * HOMEPAGE CONTENT — §05 to §09.
 *
 * Content is kept out of the components so it can be swapped for a CMS or
 * Content Collection later without touching layout.
 *
 * PROVENANCE RULE, as in site.ts: every factual claim below is traceable to the
 * live site (see docs/01 § 5). Anything the school has not published is either
 * absent or carries a `pending` note — it is never invented to fill a layout.
 */

/* --------------------------------------------------------------------------
   §05 · THE SUNBEAM STORY — audit 1.6, 1.7, 1.8
   -------------------------------------------------------------------------- */

export const story = {
  eyebrow: 'Our Story',
  heading: 'Fifty years of Sunbeam. Thirteen in Ballia.',
  paragraphs: [
    "Sunbeam began in Varanasi in 1972, founded by Dr. Amrit Lal 'Ishrat' Madhok and his wife on a conviction that the schools around them were not meeting the whole of a child's needs.",
    'The Ballia campus opened at Agarsanda in 2013 with 456 students, carrying the same conviction into a new district.',
    'Today more than 2,700 students study here, from Nursery to Class XII, across Science, Commerce and Humanities.',
  ],
  quote: 'Lighting the Lamp of Knowledge',
  quoteAttribution: 'The founding phrase of the Sunbeam group',

  /** Checklist — all verified, docs/01 § 5. */
  checks: [
    'Founded in Varanasi in 1972 · Ballia campus since 2013',
    '2,700+ students across Science, Commerce and Humanities',
    'Twelve laboratories, a 17,574-book library and an archery range',
  ],

  /** The single strongest verified proof, given the violet card. */
  stat: {
    value: '#1',
    title: 'Co-ed day school in Ballia',
    detail: 'Education World, six consecutive years — 2019-20 to 2024-25',
  },

  bentoLabel: 'A heritage school, built for what comes next',
  cta: { label: 'Read our story', href: '/about/history-legacy/' },
  links: [
    { label: 'Our Journey', href: '/about/history-legacy/' },
    { label: 'Vision and Mission', href: '/about/vision-mission/' },
  ],
  media: {
    primary: 'Contemporary campus wide shot, 4:5 portrait — the Agarsanda campus',
    inset: 'Earliest available Sunbeam Ballia photograph, 2013–2015, 3:2',
  },
} as const;

/* --------------------------------------------------------------------------
   §06 · ACADEMIC JOURNEY — audit 2.B1–B7

   Descriptions are deliberately STRUCTURAL (class ranges, board, streams) —
   all verifiable. The richer stage narrative is asset request A6 and must come
   from the school; we do not write a curriculum on its behalf.
   -------------------------------------------------------------------------- */

export const stages = [
  {
    range: 'Nursery – UKG',
    name: 'Pre-Primary',
    badge: 'Foundational',
    years: '3 Years',
    detail: 'Nursery, LKG and UKG, with their own play spaces, toy library and garden.',
    href: '/academics/structure/pre-primary/',
    imageBrief: 'Pre-Primary child, 4:5 portrait, eye level',
  },
  {
    range: 'Classes I – V',
    name: 'Primary',
    badge: 'Primary',
    years: '5 Years',
    detail: 'The foundation years, taught across language, mathematics, science and the arts.',
    href: '/academics/structure/primary/',
    imageBrief: 'Primary pupil, 4:5 portrait, eye level',
  },
  {
    range: 'Classes VI – VIII',
    name: 'Middle School',
    badge: 'Middle',
    years: '3 Years',
    detail: 'Laboratory work, robotics and enterprise begin in earnest.',
    /* ⚠ WAS '/academics/structure/middle/'. The stage page was renamed to
       middle-school when the client's stage names were adopted ('Middle' →
       'Middle School'); this link was not updated with it, so the homepage
       journey sent readers to the no-404 placeholder instead of the page. The
       other four stage links were already correct. */
    href: '/academics/structure/middle-school/',
    imageBrief: 'Middle School student, 4:5 portrait, eye level',
  },
  {
    range: 'Classes IX – X',
    name: 'Secondary',
    photo: 'lab',
    badge: 'Secondary',
    years: '2 Years',
    detail: 'Preparation for the CBSE Class X board examination.',
    href: '/academics/structure/secondary/',
    imageBrief: 'Secondary student, 4:5 portrait, eye level',
  },
  {
    range: 'Classes XI – XII',
    name: 'Senior Secondary',
    photo: 'senior',
    badge: 'Senior Secondary',
    years: '2 Years',
    detail: 'Four streams: PCM, PCB, Commerce and Humanities.',
    href: '/academics/structure/senior-secondary/',
    imageBrief: 'Senior Secondary student, 4:5 portrait, eye level',
  },
] as const;

/* --------------------------------------------------------------------------
   §07 · LEARNING AT SUNBEAM — audit 2.A + 2.C

   Every row is a FACT the school has published, not a claim we are making on
   its behalf. That is the whole argument of this section: a Microsoft Showcase
   designation and a drone in a school lab persuade in a way that adjectives
   about "innovative pedagogy" never do.
   -------------------------------------------------------------------------- */

export const learning = {
  eyebrow: 'Teaching & Learning',
  heading: 'Learning you can watch happen.',
  paragraphs: [
    'A Sunbeam classroom is meant to be busy. Children build, test, argue a case, fly a drone, run a company, take something apart to see how it works.',
    'The evidence is in the equipment the school actually owns and the certifications its teachers actually hold.',
  ],
  evidence: [
    {
      title: 'Robotics, drones & coding',
      detail: 'A robotics lab equipped with a drone, a 3-D printer, a telescope and embedded system design.',
    },
    {
      title: 'AI & digital literacy',
      detail: 'A Microsoft Showcase School, with 100 teachers certified as Microsoft Innovative Educator Experts.',
    },
    {
      title: 'Twelve laboratories',
      detail: 'Physics, Chemistry, Biology, Mathematics, Language, Geography, Srijan, Model UN and Computing.',
    },
    {
      title: 'Enterprise from Class VII',
      detail: 'KIDS Entrepreneurship, plus two computer labs of 40+ machines each.',
    },
    {
      title: 'Smart classrooms',
      detail: '75+ digitally smart classrooms and 49+ interactive flat panels.',
    },
  ],
  link: { label: 'Our academic philosophy', href: '/academics/philosophy/' },
  imageBrief:
    'Robotics lab IN USE — hands on the drone or 3-D printer, faces engaged, teacher present. 4:5, min 2400px',
} as const;

/* --------------------------------------------------------------------------
   §08 · CAMPUS EXPERIENCE — audit 3.2–3.7

   The six facilities the audit names, in the audit's own words, every one
   labelled. Labels are persistent, never hover-revealed: a hover-only label
   does not exist on a touch device.
   -------------------------------------------------------------------------- */

export const facilities = [
  {
    name: 'Academic Blocks',
    qualifier: '75+ smart classrooms · 49+ interactive panels',
    detail:
      'Four floors at Agarsanda housing 75+ digitally smart classrooms and 49+ interactive flat panels, with the prayer grounds and playground alongside.',
    href: '/campus/classrooms/',
    // sunbeem-1 — verified photograph of the campus exterior.
    photo: 'campus',
    brief: 'Academic blocks, 3:2',
  },
  {
    name: 'Archery Range',
    qualifier: 'A facility few district schools have',
    detail:
      'A dedicated archery range on the Agarsanda campus — among the least common facilities at any school in the district.',
    href: '/campus/archery-range/',
    /* The tiles were empty for want of a photograph; these are the school's own,
       taken on the line. See the note on the facility in campusTour.ts. */
    photo: 'archery',
  },
  {
    name: 'Nalanda Library',
    qualifier: '17,574 books · 25 periodicals',
    detail:
      'A collection of 17,574 books, plus 25 periodicals, magazines and journals — with a separate toy library for the youngest classes.',
    href: '/campus/library/',
    photo: 'library',
    brief: 'Nalanda Library showing real stack depth, readers at tables. 3:2',
  },
  {
    name: 'Science Laboratories',
    qualifier: 'Physics · Chemistry · Biology',
    detail:
      'Physics, Chemistry and Biology laboratories, alongside Mathematics, Language, Geography, Srijan and Model UN labs, and two computer labs of 40+ machines each.',
    href: '/campus/laboratories/',
    photo: 'lab',
    brief: 'Science lab with equipment IN USE, students working. 3:2',
  },
  {
    name: 'Conference Room',
    qualifier: 'Meetings, briefings and parent sessions',
    /* ⚠⚠ NO detail HERE, DELIBERATELY. This used to carry
       "[NEEDED — B3] …" — an internal authoring marker that was rendering on
       the live homepage. The facility is named by audit 3.4 but the school has
       published no description of it, and inventing one is not an option, so
       the panel prints its name and qualifier and nothing else. Asset B3 is
       still open: when the copy arrives it goes here.
       ⚠ A build-time grep for [NEEDED / TBD / TODO belongs in CI so this
       cannot happen again. */
    href: '/campus/conference-room/',
    brief: 'Conference room — not photographed anywhere on the live site. 3:2',
  },
  {
    name: 'Auditorium',
    qualifier: 'Sankalp Hall & Naman Hall',
    detail:
      'Two halls — Sankalp and Naman — for assembly, performance and school ceremony, with the prayer grounds Naman and Abhayeti serving the senior and junior blocks.',
    href: '/campus/auditorium/',
    // sunbeem-4 — verified photograph taken in the hall.
    photo: 'auditorium',
    brief: 'Auditorium FULL and in use, not an empty hall. 3:2',
  },
  {
    name: 'Sports Facilities',
    qualifier: 'Fifteen games, indoor and outdoor',
    detail:
      'Grounds and courts for hockey, football, basketball, kho-kho, volleyball, kabaddi, cricket and skating, with indoor provision for chess, table tennis, carrom, yoga, taekwondo and karate.',
    href: '/beyond-academics/sports/',
    // The ground, the court and the junior park are all photographed now.
    photo: 'sports',
    brief: 'Outdoor grounds in use — a game in progress. 3:2',
  },
] as const;

/* --------------------------------------------------------------------------
   §12 · STUDENT & ALUMNI VOICES — audit 13.1

   Audit 13.1 asks for a dedicated testimonial section on the homepage, and
   13.2–13.6 specify what each testimonial should cover: current profession,
   higher education journey, career achievements, and their experience here.

   `pending: true` renders the wall in an awaiting-content state — real layout,
   real motion, visibly empty cards. NOTHING here is invented: writing quotes
   and attributing them to students of a real school is not a placeholder, it is
   a fabrication. Set `pending: false` and fill `items` when the school supplies
   them (asset A4).
   -------------------------------------------------------------------------- */

export const voices = {
  eyebrow: 'Alumni',
  heading: 'What our students say',
  /* ⚠ NOT “in their own words”. The section carries no quotes: the school has
     published placements, not testimonials, and promising a voice the page does
     not have is the kind of small untruth a parent notices. Audit 13.6 — the
     alumnus speaking — arrives with asset A4. */
  deck: 'Former students, where their degree took them and who they work for — every line taken from the school\x27s own alumni cards.',
  pending: true,

  /**
   * READY TO FILL. Add nine entries and the grid populates itself — no layout
   * changes needed. Keep quotes to roughly 90–120 characters so the pill cards
   * stay two lines deep.
   *
   *   { quote: '…', name: 'Full Name', classOf: '2019', photo: importedImage }
   *
   * `photo` is optional; without it the card falls back to the school monogram.
   */
  items: [] as Array<{
    quote: string;
    name: string;
    classOf: string;
    photo?: ImageMetadata;
  }>,

  /** How many slots to lay out while `items` is empty. */
  slots: 9,
} as const;

/* --------------------------------------------------------------------------
   §09 · BEYOND ACADEMICS — audit 4.3–4.7

   The audit is explicit that participation comes BEFORE achievement, which
   inverts how the current site frames sport. Sport therefore leads, and the
   medal record is held back for §14.

   Sport lists are the school's own published lists: 7 indoor + 8 outdoor = 15.
   The number of houses is NOT published anywhere and is therefore not claimed.
   -------------------------------------------------------------------------- */

export const beyond = {
  eyebrow: 'Beyond Academics',
  heading: 'Every child plays. Every child performs.',
  deck: 'Fifteen games, indoor and outdoor, and a calendar built around taking part rather than being selected.',
  sport: {
    title: 'Sport',
    body: 'Games run through the year, across inter-house competition and coaching, on grounds and courts built for daily use rather than for a single sports day.',
    indoor: 'Chess, table tennis, carrom, aerobics, yoga, taekwondo and karate',
    outdoor: 'Hockey, skating, football, basketball, kho-kho, volleyball, kabaddi and cricket',
    href: '/beyond-academics/sports/',
    brief: 'Sport PARTICIPATION mid-game — not a podium, not a medal shot. 3:2, min 2400px',
  },
  strands: [
    {
      title: 'Performing & visual arts',
      body: 'A dedicated art room, a dance room and music, with the annual production on the Sankalp Hall stage.',
      href: '/beyond-academics/arts/',
      brief: 'Art room or a performance in progress. 4:5',
    },
    {
      title: 'Leadership & service',
      body: 'Student council, school houses, community service, and NCC affiliated at both ‘A’ and ‘B’ certificate levels.',
      href: '/beyond-academics/student-council/',
      brief: 'Student council or a community service activity. 4:5',
    },
  ],
  links: [
    { label: 'Sport at Sunbeam', href: '/beyond-academics/sports/' },
    { label: 'All of Beyond Academics', href: '/beyond-academics/' },
  ],
} as const;
