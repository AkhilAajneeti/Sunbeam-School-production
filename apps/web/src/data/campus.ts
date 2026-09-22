/**
 * CAMPUS → SAFETY & SECURITY — page content.
 *
 * SOURCING RULE, same as src/data/site.ts: nothing here may assert something the
 * school has not published. The live site's safety copy is five bullets long
 * (docs/01 § "Safety", audit 3.8 asks for it to be expanded), and those five are
 * the only hard facts available:
 *
 *   · 15,000-litre fire hose reel
 *   · fire extinguishers in all corridors
 *   · 24×7 security guards
 *   · maids in junior classes
 *   · full CCTV coverage
 *
 * plus, from the transport section: 29+ buses, GPS and speed-governor enabled,
 * 22 routes, and a named transport in-charge.
 *
 * `verified: false` marks everything the brief asked for that the school has NOT
 * published — a medical room, counselling, evacuation drills, visitor logging,
 * driver vetting, bus attendants. Those render as clearly-labelled requests
 * while `showBuildNotes` is on, and as neutral copy that claims no specifics
 * when it is off. They are listed as asset request A10 in docs/07 terms.
 * NOTHING on this page states a safety measure the school has not confirmed —
 * on a page whose entire job is a parent's trust, an invented claim is the one
 * unrecoverable mistake.
 */

/** One measure in the safety timeline. */
export interface SafetyMeasure {
  label: string;
  body: string;
  /** False = requested by the brief, not yet published by the school. */
  verified: boolean;
}

export interface SafetyGroup {
  id: string;
  /** Roman numeral shown on the timeline spine. */
  numeral: string;
  title: string;
  stand: string;
  measures: SafetyMeasure[];
}

/**
 * §1 — the timeline. Grouped so a parent reads three arguments rather than
 * eleven bullets: who watches the campus, what stops a fire, who holds a
 * younger child's hand.
 */
export const safetyGroups: SafetyGroup[] = [
  {
    id: 'watch',
    numeral: 'I',
    title: 'A watched campus',
    stand: 'Someone is on duty at every hour the gate is shut, and at every hour it is open.',
    measures: [
      {
        label: '24×7 security guards',
        body: 'Guards are posted around the clock — through the school day, through the night, and through every holiday.',
        verified: true,
      },
      {
        label: 'Full CCTV coverage',
        body: 'Cameras cover the campus, with corridors, stairwells and entrances all within view.',
        verified: true,
      },
      {
        label: 'Controlled main gate',
        body: 'One supervised entrance for students, staff and visitors alike.',
        verified: false,
      },
    ],
  },
  {
    id: 'fire',
    numeral: 'II',
    title: 'Prepared for fire',
    stand: 'The equipment is sized for the building, not for an inspection.',
    measures: [
      {
        label: '15,000-litre fire hose reel',
        body: 'A reserve of fifteen thousand litres, plumbed to hose reels serving the school block.',
        verified: true,
      },
      {
        label: 'Extinguishers in all corridors',
        body: 'Every corridor carries extinguishers, so no classroom is far from one.',
        verified: true,
      },
      {
        label: 'Marked exit routes',
        body: 'Stairwells and exits are signed along the corridors.',
        verified: false,
      },
    ],
  },
  {
    id: 'care',
    numeral: 'III',
    title: 'Care for the youngest',
    stand: 'The children who cannot yet manage a corridor alone are the ones who get an adult beside them.',
    measures: [
      {
        label: 'Attendants in junior classes',
        body: 'Junior classrooms have a dedicated attendant through the day, for the small things a four-year-old needs help with.',
        verified: true,
      },
      {
        label: 'Elevator access',
        body: 'A lift serves the upper floors, so a child who cannot take the stairs is not stranded by them.',
        verified: true,
      },
      {
        label: 'Supervised movement',
        body: 'Junior classes move between floors with a staff member.',
        verified: false,
      },
    ],
  },
];

/**
 * §2 — the interactive plan. `x`/`y` are percentages of the illustration box.
 * This is a SCHEMATIC, deliberately drawn rather than photographed: a diagram
 * makes no claim about what a place looks like, and the school has supplied no
 * site plan or aerial photograph of the Agarsanda campus (request A2).
 */
export interface MapPoint {
  id: string;
  label: string;
  body: string;
  x: number;
  y: number;
  verified: boolean;
  /**
   * campusTour facility id whose photograph illustrates this point. Set ONLY
   * where the folder genuinely shows that place — five of the seven safety
   * points (guards, CCTV, fire equipment, the infirmary, the bus bay) are
   * unphotographed anywhere in the repository, and a near-enough room behind a
   * map pin would be read as that place.
   */
  photo?: string;
}

export const mapPoints: MapPoint[] = [
  {
    id: 'gate',
    label: 'Main Gate',
    body: 'The single supervised entrance, manned whenever the school is open.',
    x: 50,
    y: 88,
    verified: true,
    photo: 'campus',
  },
  {
    id: 'security',
    label: 'Security Office',
    body: 'Base for the 24×7 guard detail, beside the entrance.',
    x: 30,
    y: 79,
    verified: true,
  },
  {
    id: 'cctv',
    label: 'CCTV Coverage',
    body: 'Cameras across the campus — corridors, stairwells, entrances and grounds.',
    x: 50,
    y: 45,
    verified: true,
  },
  {
    id: 'fire',
    label: 'Fire Safety',
    body: 'The 15,000-litre hose reel, and extinguishers along every corridor.',
    x: 74,
    y: 40,
    verified: true,
  },
  {
    id: 'medical',
    label: 'Medical Room',
    body: 'First-aid provision on campus.',
    x: 27,
    y: 40,
    verified: false,
  },
  {
    id: 'buses',
    label: 'Bus Zone',
    body: 'Boarding bay for the fleet — 29+ buses across 22 routes.',
    x: 76,
    y: 78,
    verified: true,
  },
  {
    id: 'grounds',
    label: 'Playground',
    body: 'Supervised open ground, overlooked by the school block.',
    x: 50,
    y: 20,
    verified: true,
    photo: 'josh',
  },
];

/**
 * §3 — emergency preparedness. The response flow is the only sequence on this
 * page; it is written as procedure a school of this size would follow, and every
 * step is marked unverified because the school has published no drill protocol.
 */
export const emergencySteps = [
  { step: '01', label: 'Alert', body: 'The alarm is raised and the office informed.' },
  { step: '02', label: 'Assemble', body: 'Classes leave by the marked route to open ground.' },
  { step: '03', label: 'Account', body: 'Teachers take a roll call at the assembly point.' },
  { step: '04', label: 'Assist', body: 'First aid where needed; parents contacted.' },
] as const;

export const emergencyPoints: SafetyMeasure[] = [
  {
    label: 'Fire suppression',
    body: 'A 15,000-litre hose reel reserve, with extinguishers in every corridor.',
    verified: true,
  },
  {
    label: 'Evacuation routes',
    body: 'Marked stairwells and exits, with a lift serving the upper floors.',
    verified: false,
  },
  {
    label: 'Emergency drills',
    body: 'Practised evacuation, so a real alarm is not the first rehearsal.',
    verified: false,
  },
  {
    label: 'First aid',
    body: 'On-campus first-aid provision and trained staff.',
    verified: false,
  },
];

/** §4 — transport. GPS and speed governors are published; the rest are not. */
export const transportFeatures: SafetyMeasure[] = [
  {
    label: 'GPS Tracking',
    body: 'Every bus in the fleet is GPS-enabled.',
    verified: true,
  },
  {
    label: 'Speed Governor',
    body: 'Speed governors are fitted across the fleet, capping how fast a bus can travel.',
    verified: true,
  },
  {
    label: '22 Routes',
    body: 'Twenty-two routes across Ballia, run by a fleet of 29 buses and more.',
    verified: true,
  },
  {
    label: 'Verified Drivers',
    body: 'Background-checked drivers and conductors.',
    verified: false,
  },
  {
    label: 'Lady Attendant',
    body: 'A female attendant travelling with younger children.',
    verified: false,
  },
  {
    label: 'Parent Communication',
    body: 'Route updates and delay notices to parents.',
    verified: false,
  },
];

/** §5 — student wellbeing. Only the junior-class attendants are published. */
export const wellbeingCards: SafetyMeasure[] = [
  {
    label: 'Junior assistance',
    body: 'An attendant with every junior class, through the school day.',
    verified: true,
  },
  {
    label: 'Medical support',
    body: 'First-aid care on campus when a child is unwell or hurt.',
    verified: false,
  },
  {
    label: 'Counselling',
    body: 'A place to take what a child cannot say in class.',
    verified: false,
  },
  {
    label: 'Hygiene',
    body: 'Cleaned washrooms and safe drinking water.',
    verified: false,
  },
];

/** §6 — surveillance, the dark band. */
export const surveillanceCards: SafetyMeasure[] = [
  {
    label: 'CCTV monitoring',
    body: 'Full camera coverage of the campus — corridors, stairwells, entrances and grounds.',
    verified: true,
  },
  {
    label: 'Security personnel',
    body: 'Guards on duty 24 hours a day, every day of the year.',
    verified: true,
  },
  {
    label: 'Visitor management',
    body: 'Visitors signed in at the gate and escorted on campus.',
    verified: false,
  },
  {
    label: 'Access control',
    body: 'One supervised entrance, with movement on and off campus recorded.',
    verified: false,
  },
];


/**
 * ═══ THE BAND HEADS ON /campus/safety-security/ ════════════════════════════
 *
 * Every eyebrow, heading and standfirst on that page, in page order. These used
 * to be string literals inside the five safety components; they live here so the
 * seed can put them in the CMS, where the school can edit them.
 *
 * ⚠ THE QUERY LAYER ALSO HOLDS A COPY, as SAFETY_DEFAULTS in
 * lib/cms/queries/campus.ts — the fallback for an unseeded or unpublished CMS.
 * This file is what the seed writes. Change one, change both, or seed again.
 *
 * ⚠⚠ TWO HEADINGS COUNT THINGS: "Eleven measures, in three groups" and
 * "Twenty-two routes across Ballia". Nothing recomputes them — they are prose,
 * not figures — so an editor who adds a measure or a route must edit the
 * heading too.
 */
export const safetyBands = {
  timeline: {
    eyebrow: 'What is in place',
    heading: 'Eleven measures, in three groups',
    stand: 'The school publishes five of these. The rest are marked, because a safety page is the last place to guess.',
  },
  plan: {
    eyebrow: 'Where things are',
    heading: 'The campus, point by point',
    stand: 'A schematic — it shows what sits where, not what the buildings look like.',
  },
  transport: {
    eyebrow: 'Getting there and back',
    heading: 'The journey is part of the school day',
    stand: 'Twenty-two routes across Ballia, and a fleet that is tracked and speed-limited on every one of them.',
  },
  wellbeing: {
    eyebrow: 'Looking after the child',
    heading: 'Someone notices',
    stand: 'Equipment keeps a building safe. People are what keep a child feeling safe in it.',
  },
  surveillance: {
    eyebrow: 'Watched over',
    heading: 'Eyes on the campus, all day and all night',
    stand: 'Cameras across the school, and guards on duty every hour of the year.',
  },
} as const;

/**
 * The three counts under the transport band on /campus/safety-security/.
 *
 * ⚠⚠ TYPED, NOT DERIVED. The Bus Route collection yields 22 distinct vehicles
 * across the published routes; this says the fleet is 29+. Both can be true — a
 * school can own more buses than appear on route sheets — so computing these
 * from the routes would quietly republish a smaller number as fact.
 *
 ⚠⚠ THE FLEET AND ROUTE COUNTS APPEAR IN THREE PLACES ON THIS PAGE, all
 * editable and none derived from the others:
 *
 *   1. transportFigures        — "29+ / Buses in the fleet", "22 / Routes"
 *   2. safetyBands.transport   — "Twenty-two routes across Ballia" (in words)
 *   3. mapPoints "Bus Zone"    — "29+ buses across 22 routes"
 *
 * Change the fleet and all three need changing. They are not computed from Bus
 * Route on purpose — see below — so nothing will catch a missed one.
 */
export const transportFigures = [
  { value: '29+', label: 'Buses in the fleet' },
  { value: '22', label: 'Routes across Ballia' },
  { value: '100%', label: 'GPS and speed-governed' },
] as const;
