/**
 * CAMPUS → FACILITIES & INFRASTRUCTURE — the complete inventory.
 *
 * CONTENT PRESERVATION IS THE POINT OF THIS FILE. The brief's first requirement
 * is that nothing on the live site is lost, so this is a checklist as much as a
 * data file: every facility recorded in docs/01 § "Infrastructure" appears
 * below, and each one is tagged with the group it renders in. If an item is here
 * it is on the page somewhere — the Facility Explorer renders the full list, so
 * an entry cannot be silently dropped by being left out of a designed section.
 *
 * FIVE ITEMS RECOVERED. The brief's own list omitted five things the live site
 * carries, and they are restored here: the LANGUAGE LAB, the SRIJAN LAB, the
 * SAND POOL, the LITTLE AGRICULTURE LAND and the KIDS ENTREPRENEURSHIP
 * programme for Class 7. Losing them would have failed the one requirement that
 * mattered most.
 *
 * SIX ITEMS ARE ON THE BRIEF BUT NOT IN docs/01 — Cyber Zone, FUTUDOS Music,
 * Open Air Classroom, Career Counselling, BCS Counsellors and a distinct
 * Swimming Pool (docs records a "water pool" in the early-years area, which may
 * or may not be the same thing). They are marked `unlisted: true`: they render
 * exactly like everything else, because the brief states they are on the
 * official site, but the flag records that this repository's own audit of the
 * live site did not find them — so a reviewer can check the six rather than
 * re-checking forty.
 */

export interface Item {
  label: string;
  /** What it is FOR — never just a restatement of the name. */
  body: string;
  icon: string;
  /** On the brief, but absent from docs/01's audit of the live site. */
  unlisted?: boolean;
  /**
   * Facility id from campusTour.ts, used as the card's background photograph.
   *
   * SET ONLY WHERE THE FOLDER GENUINELY DEPICTS THAT FACILITY. Ten of the
   * forty-seven items qualify; the rest are left blank rather than borrowing a
   * near-enough room, because a laboratory photograph behind "Robotics Lab"
   * would be read as the robotics lab. The card design handles both states —
   * without a photo it is simply the plain white card.
   */
  photo?: string;
}

export interface Group {
  id: string;
  eyebrow: string;
  title: string;
  stand: string;
  items: Item[];
}

/**
 * §2 — the KPI band. Every figure is published (docs/01 § 5) except staff
 * numbers other than teaching, which the school does not give a count for.
 */
export const kpis = [
  { count: 2700, suffix: '+', label: 'Students', icon: 'students', note: 'Nursery to Class XII, from 456 in 2013' },
  { count: 130, suffix: '+', label: 'Teaching staff', icon: 'teacher', note: '100 are Microsoft Innovative Educator Experts' },
  { count: 75, suffix: '+', label: 'Smart classrooms', icon: 'panel', note: 'With 49+ interactive flat panels' },
  { count: 12, suffix: '', label: 'Laboratories', icon: 'flask', note: 'Science, computing, language and innovation' },
  { count: 17574, suffix: '', label: 'Library books', icon: 'book', note: 'Plus 25 periodicals, magazines and journals' },
  { count: 29, suffix: '+', label: 'Buses', icon: 'bus', note: 'GPS-tracked and speed-governed, 22 routes' },
  { count: 80, suffix: '+', label: 'Computers', icon: 'desktop', note: '40+ junior, 40+ senior' },
  { count: 49, suffix: '+', label: 'Interactive panels', icon: 'spark', note: 'A Microsoft Showcase School' },
] as const;

/** §3 — everything, in six groups. */
export const groups: Group[] = [
  {
    id: 'learning',
    eyebrow: 'Where lessons happen',
    title: 'Learning Environment',
    /* ⚠ WAS 'Thirty-plus classrooms wired for teaching' — a figure matching
       nothing the school publishes, and one the very next item contradicted with
       the real 75+. Both numbers below are the published pair. */
    stand: 'Seventy-five-plus classrooms wired for teaching, and the rooms that are not classrooms at all.',
    items: [
      { label: 'Nursery to Class XII', body: 'One campus carries a child from their first day to their board year.', icon: 'school', photo: 'campus' },
      { label: 'Smart Classrooms', body: '75+ digitally equipped rooms, used in ordinary lessons rather than for demonstrations.', icon: 'panel' },
      { label: 'Interactive Flat Panels', body: '49+ IFP screens — the teaching surface a Microsoft Showcase School is expected to have.', icon: 'spark' },
      { label: 'Open Air Classroom', body: 'A teaching space outdoors, for the lessons that are better held in the open.', icon: 'tree', unlisted: true },
      { label: 'Elevator', body: 'Lift access to the upper floors, so no child is stranded by a staircase.', icon: 'lift' },
    ],
  },
  {
    id: 'science',
    eyebrow: 'Where things get made',
    title: 'Science & Innovation',
    stand: 'Ten laboratories. A school this size is not required to have a drone, a 3-D printer and a telescope — this one does.',
    items: [
      { label: 'Physics Lab', body: 'Senior practicals through the board year, with apparatus for a full class.', icon: 'atom' },
      { label: 'Chemistry Lab', body: 'Bench room for a whole practical group, with reagent shelving and a preparation store.', icon: 'flask', photo: 'chemistry' },
      { label: 'Biology Lab', body: 'Microscope stations, specimen models and dissection tables.', icon: 'leaf', photo: 'biology' },
      { label: 'Mathematics Lab', body: 'Manipulatives and models — mathematics as something handled rather than copied.', icon: 'compass' },
      { label: 'Geography Lab', body: 'Maps, globes and survey instruments for fieldwork preparation.', icon: 'globe' },
      { label: 'Robotics Lab', body: 'A drone, a 3-D printer, a telescope and embedded system design kits.', icon: 'robot' },
      { label: 'Active Learning Lab', body: 'Built for making and testing rather than writing about it.', icon: 'bulb', photo: 'activity' },
      { label: 'Srijan Lab', body: "The school's creation space — srijan, to create.", icon: 'spark' },
      { label: 'Language Lab', body: 'Listening and speaking practice, away from the written page.', icon: 'speech' },
      { label: 'MUN Lab', body: 'Model United Nations — debate, committee procedure and position papers.', icon: 'gavel' },
    ],
  },
  {
    id: 'digital',
    eyebrow: 'Screens and networks',
    title: 'Digital Learning',
    stand: 'Two full computer laboratories, split so juniors are not queuing behind board-year practicals.',
    items: [
      { label: 'Junior Computer Lab', body: '40+ computers, sized so a junior class works one to a machine.', icon: 'desktop', photo: 'computer' },
      { label: 'Senior Computer Lab', body: '40+ computers for board-year practicals and the coding programme.', icon: 'desktop', photo: 'computer' },
      { label: 'Cyber Zone', body: 'Supervised access for research, projects and digital-literacy work.', icon: 'wifi', unlisted: true },
      { label: 'Microsoft Showcase School', body: '100 teachers certified as Microsoft Innovative Educator Experts.', icon: 'badge' },
    ],
  },
  {
    id: 'creative',
    eyebrow: 'Reading, making, performing',
    title: 'Library & Creative Spaces',
    stand: 'Fifteen thousand books for the seniors, and a toy library for the ones who cannot read yet.',
    items: [
      { label: 'Nalanda Library', body: '17,574 books, 25 periodicals, magazines and journals, with a Ballia literature collection.', icon: 'book', photo: 'library' },
      { label: 'Toy Library', body: 'Borrowable toys for the early years — a first lending system, at four years old.', icon: 'toy' },
      { label: 'Art Room', body: 'A dedicated room for drawing, painting and craft.', icon: 'brush' },
      { label: 'Dance Room', body: 'Sprung floor space for rehearsal and the annual function.', icon: 'dance' },
      { label: 'FUTUDOS Music', body: 'The music programme, with instruments and instruction.', icon: 'music', unlisted: true },
      { label: 'Sankalp Hall', body: 'The main auditorium — assembly, annual function and visiting speakers.', icon: 'hall' },
      { label: 'Naman Hall', body: 'The second hall, for year-group events and seminars.', icon: 'hall' },
    ],
  },
  {
    id: 'sport',
    eyebrow: 'Out of the classroom',
    title: 'Sports & Student Life',
    stand: 'Fifteen sports across indoor and outdoor, an archery range, and an early-years area with its own water.',
    items: [
      { label: 'Indoor Sports', body: 'Chess, table tennis, carrom, aerobics, yoga, taekwondo and karate.', icon: 'indoor' },
      { label: 'Outdoor Sports', body: 'Hockey, skating, football, basketball, kho-kho, volleyball, kabaddi and cricket.', icon: 'ball', photo: 'basketball' },
      { label: 'Archery Range', body: 'The rarest facility the school has, and one very few district schools offer.', icon: 'target', photo: 'archery' },
      { label: 'JOSH Playground', body: 'The main field — assembly, athletics and inter-house fixtures.', icon: 'field', photo: 'josh' },
      { label: 'Naman Prayer Ground', body: 'The senior block’s assembly and prayer ground.', icon: 'prayer' },
      { label: 'Abhayeti Prayer Ground', body: 'The junior block’s own prayer ground.', icon: 'prayer' },
      { label: 'Kids Park', body: 'Swings and play equipment for the early years.', icon: 'swing', photo: 'ground' },
      { label: 'Water Pool', body: 'A shallow water play area in the early-years zone.', icon: 'water' },
      { label: 'Sand Pool', body: 'Sand play alongside the water pool — messy, and deliberately so.', icon: 'sand' },
      { label: 'Little Agriculture Land', body: 'A planting plot the youngest children actually dig, sow and water.', icon: 'sprout' },
      { label: 'KIDS Entrepreneurship', body: 'A Class 7 programme that runs a real venture end to end.', icon: 'coin' },
    ],
  },
  {
    id: 'safety',
    eyebrow: 'Getting there, and being safe there',
    title: 'Safety, Transport & Care',
    stand: 'A fleet that is tracked and speed-limited, cameras across the campus, and guards on duty all year.',
    items: [
      { label: 'Bus Facilities', body: '29+ buses across 22 routes, with a named transport in-charge.', icon: 'bus' },
      { label: 'GPS Tracking', body: 'Every bus in the fleet is GPS-enabled.', icon: 'gps' },
      { label: 'Speed Governor', body: 'Governors fitted fleet-wide, capping how fast a bus can travel.', icon: 'speed' },
      { label: 'CCTV', body: 'Full camera coverage — corridors, stairwells, entrances and grounds.', icon: 'camera' },
      { label: '24×7 Security', body: 'Guards on duty every hour of the year.', icon: 'shield' },
      { label: 'Fire Safety', body: 'A 15,000-litre hose reel reserve, with extinguishers in every corridor.', icon: 'flame' },
      { label: 'Infirmary', body: 'On-campus medical room and first-aid care.', icon: 'cross' },
      { label: 'Junior Class Attendants', body: 'A dedicated attendant with every junior class through the day.', icon: 'hand' },
      { label: 'Career Counselling', body: 'Subject choice, stream selection and university guidance.', icon: 'compass', unlisted: true },
      { label: 'BCS Counsellors', body: 'Trained counsellors available to students.', icon: 'heart', unlisted: true },
    ],
  },
];

/** Flat list — the Facility Explorer renders this, so nothing can go missing. */
export const allItems = groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, groupId: g.id })));

/** §8 — why any of it matters, written as benefit rather than inventory. */
export const whyCards = [
  { icon: 'panel', title: 'Modern Learning', body: 'Thirty-plus smart rooms mean the technology is in ordinary lessons, not wheeled in for visitors.' },
  { icon: 'robot', title: 'Innovation', body: 'A drone, a 3-D printer and a telescope put building and testing inside the school week.' },
  { icon: 'desktop', title: 'Technology', body: 'Eighty-plus computers across two labs — enough that a child works alone, not in a group of four.' },
  { icon: 'shield', title: 'Safety', body: 'Tracked buses, full CCTV and guards on duty around the clock, so the day is bounded at both ends.' },
  { icon: 'brush', title: 'Creativity', body: 'Art, dance, music and a toy library — the subjects that are usually the first to lose their room.' },
  { icon: 'sprout', title: 'Holistic Development', body: 'Fifteen sports, a planting plot and a Class 7 venture programme, alongside the board syllabus.' },
];

/** §7 — the arc a student travels, arrival to graduation. */
export const progression = [
  { label: 'Arrival', body: 'A tracked bus from one of 22 routes, through a supervised gate.', icon: 'bus' },
  { label: 'Smart Classroom', body: 'The first lesson of the day on an interactive panel.', icon: 'panel' },
  { label: 'Laboratory', body: 'Practical period — one of ten labs, depending on the year.', icon: 'flask' },
  { label: 'Library', body: 'A free period among 17,574 books, or the reading programme.', icon: 'book' },
  { label: 'Sports', body: 'Games on the JOSH ground, the courts, or the archery range.', icon: 'ball' },
  { label: 'Innovation', body: 'Robotics, Srijan or the Active Learning Lab after the timetable.', icon: 'robot' },
  { label: 'Leadership', body: 'MUN committee, student council, or the KIDS venture in Class 7.', icon: 'gavel' },
  { label: 'Graduation', body: 'Out through Class XII, with counselling on where next.', icon: 'cap' },
] as const;


/**
 * The one editable band head on /campus/facilities-infrastructure/.
 *
 * ⚠ THE OTHER TWO BANDS ON THAT PAGE ARE SHARED WITH /campus/ — the photo wall
 * and the visit call-to-action are the same components, and their copy is
 * edited in Campus Tour Page. Duplicating them here is how one heading becomes
 * two that disagree.
 */
export const facilitiesBands = {
  figures: {
    eyebrow: 'The campus in figures',
    heading: 'What the school actually has',
    stand: 'Every number below is one Sunbeam Ballia publishes.',
  },
} as const;
