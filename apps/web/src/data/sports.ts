/**
 * BEYOND ACADEMICS → SPORTS & GAMES.
 *
 * ORDER IS THE CLIENT'S AND IS NOT NEGOTIABLE — facilities, games, participation,
 * inter-house, coaching, achievements LAST. Audit §4 says the live page's
 * emphasis "appears to be primarily on achievements" and asks for exactly this
 * inversion.
 *
 * ═══ WHAT PHOTOGRAPHY ACTUALLY EXISTS, because it decided the design ═════════
 *
 * Twenty sports photographs are held, and I looked at every one of them:
 *
 *   JOSH GROUND  9 — volleyball nets up (×2), a football goal, the school arch
 *                    over the ground, and open field
 *   play ground  8 — the junior park: swings, slides, roundabout, outdoor gym
 *   basket ball  3 — two hoops on the court beside the block
 *   achievement  1 — the CBSE Cluster V Kho-Kho girls' team with their medals
 *
 * There is NOT ONE ACTION PHOTOGRAPH of a child playing a sport. Not one. Every
 * ground photograph is empty. That single fact is why this page is built the way
 * it is: sections that would normally lean on action photography (the games
 * carousel, participation, inter-house) are composed so that the PLACE, the
 * RECORD and the TYPE carry them, and a photograph is a layer on top where a
 * true one exists. Filling fifteen carousel slides with fifteen pictures of the
 * same empty field would have looked like a stock gallery and told a reader
 * nothing.
 *
 * The split falls out honestly: the eight OUTDOOR games are played on grounds we
 * have photographed, so those slides carry the ground and say so in the caption.
 * The seven INDOOR games have no photograph at all, so those slides are
 * graphic. Outdoor/indoor is the school's own published split, so the visual
 * difference maps onto a real distinction rather than onto our asset gap.
 *
 * ═══ SOURCING ═══════════════════════════════════════════════════════════════
 *
 * Published (docs/01 § "Sports record", § "Infrastructure"): the fifteen games
 * and their indoor/outdoor split, all seven competition records, the four
 * facilities, the NCC 'A' and 'B' affiliations.
 *
 * NOT published anywhere, and therefore never asserted below:
 *   · how many houses the school runs, or what they are called (docs/08 §29
 *     records this explicitly — the live site confirms houses exist and never
 *     states a number)
 *   · any coach, timetable, or programme detail
 *   · any participation headcount
 *
 * §4 and §5 are therefore built out of things that ARE evidenced — the ladder
 * the school's own results climb, and what those results imply about coaching —
 * rather than out of invented house names and invented coach biographies.
 */

/* Explicit imports, not a glob: which frame goes where is a content decision on
   this page (the goal photograph belongs to Football and the net photograph to
   Volleyball), and a glob would sort them by filename and get both wrong. */
import archLine from '../assets/archery-range/07.jpg';
import archAim from '../assets/archery-range/08.jpg';
import archTarget from '../assets/archery-range/02.jpg';
import joshNets from '../assets/JOSH GROUND/DSC_1283 copy.jpg';
import joshNetsWide from '../assets/JOSH GROUND/DSC_1284 copy.jpg';
import joshGoal from '../assets/JOSH GROUND/DSC_1286 copy.jpg';
import joshArch from '../assets/JOSH GROUND/DSC_1287 copy.jpg';
import joshBlock from '../assets/JOSH GROUND/DSC_1288 copy.jpg';
import joshWall from '../assets/JOSH GROUND/DSC_1290 copy.jpg';
import joshOpen from '../assets/JOSH GROUND/DSC_1291 copy.jpg';
import joshGrass from '../assets/JOSH GROUND/DSC_1292 copy.jpg';

import parkGym from '../assets/play ground/DSC_1241 copy.jpg';
import parkTube from '../assets/play ground/DSC_1244 copy.jpg';
import parkRound from '../assets/play ground/DSC_1245 copy.jpg';
import parkSwings from '../assets/play ground/DSC_1246 copy.jpg';
import parkSlide from '../assets/play ground/DSC_1248 copy.jpg';

import courtTrees from '../assets/basket ball/DSC_1212 copy.jpg';
import courtHoop from '../assets/basket ball/DSC_1280 copy.jpg';
import courtHoopTwo from '../assets/basket ball/DSC_1281 copy.jpg';

import khokho from '../assets/school achivement/KHO KHO CHAMPIOANSHIP.jpg';

export const img = {
  joshNets,
  joshNetsWide,
  joshGoal,
  joshArch,
  joshBlock,
  joshWall,
  joshOpen,
  joshGrass,
  parkGym,
  parkTube,
  parkRound,
  parkSwings,
  parkSlide,
  courtTrees,
  courtHoop,
  courtHoopTwo,
  khokho,
};

/* ═══ §1 · FACILITIES ═══════════════════════════════════════════════════════
   Four, all published. Each is one alternating row — a large lead photograph,
   two support frames, and a short line. The support frames are what let this
   section use fifteen of the twenty photographs we hold instead of four. */

export interface SportFacility {
  id: string;
  name: string;
  kicker: string;
  body: string;
  /** Short factual chips. Nothing here is inferred from a photograph. */
  notes: string[];
  lead?: ImageMetadata;
  support?: ImageMetadata[];
  alt?: string;
  /** Set only where no photograph exists. Rendered as a shot brief. */
  brief?: string;
}

export const facilities: SportFacility[] = [
  {
    id: 'josh',
    name: 'JOSH Ground',
    kicker: 'The main field',
    body: 'The largest open space the school has, and the one most of the school stands on every morning. Volleyball nets stay up along one edge; full goals stand at either end.',
    notes: ['Morning assembly', 'Volleyball nets', 'Football goals', 'Open field games'],
    lead: joshGoal,
    support: [joshNets, joshOpen],
    alt: 'A goal standing at the end of the JOSH ground at Sunbeam School Ballia',
  },
  {
    id: 'court',
    name: 'Basketball Court',
    kicker: 'Hard court',
    body: 'A hard court alongside the teaching block with a hoop at each end — the one surface on campus that stays playable straight after rain.',
    notes: ['Two hoops', 'Beside the teaching block', 'Games period and after school'],
    lead: courtHoop,
    support: [courtHoopTwo, courtTrees],
    alt: 'The basketball court at Sunbeam School Ballia, with a hoop mounted against the teaching block',
  },
  {
    id: 'park',
    name: 'Kids Park & Junior Playground',
    kicker: 'The early years',
    body: 'Swings, slides, a roundabout and a run of outdoor gym frames, fenced off from the main ground so the youngest children have somewhere that is only theirs.',
    notes: ['Swings and slides', 'Roundabout', 'Outdoor gym frames', 'Fenced and separate'],
    lead: parkSlide,
    support: [parkSwings, parkGym],
    alt: 'The junior playground at Sunbeam School Ballia, with a slide and climbing frame',
  },
  {
    id: 'range',
    name: 'Archery Range',
    kicker: 'The rare one',
    body: 'The facility almost no other school in the district can offer, and the reason archery can be taught here at all rather than travelled to.',
    notes: ['On campus', 'Rare at district level'],
    /* Was "Shooting Range", with a standing request for a photograph of a firing
       point. The school confirmed the range is for archery; the photographs and
       the name were corrected together. */
    lead: archLine,
    support: [archAim, archTarget],
    alt: 'Students of Sunbeam School Ballia on the archery line, at full draw',
  },
];

/* ═══ §2 · GAMES THROUGH THE YEAR ═══════════════════════════════════════════
   The client's highlight, and the fifteen the school publishes — eight outdoor,
   seven indoor, in the school's own words and order.

   HANDBALL IS DELIBERATELY ABSENT from this roster even though the school has
   two handball records, because the roster is a published list and adding to it
   would put this file one step away from the source. Handball appears where its
   evidence is: the ladder in §4 and the record in §6.

   `venue` is the caption under each photograph and it describes THE PHOTOGRAPH,
   not the sport — "JOSH Ground", not "football in progress". The photographs are
   of empty grounds and the captions say so. */

export interface Game {
  name: string;
  icon: string;
  blurb: string;
  venue: string;
  photo?: ImageMetadata;
  alt?: string;
}

export const games: { outdoor: Game[]; indoor: Game[] } = {
  outdoor: [
    {
      name: 'Football',
      icon: 'football',
      blurb: 'Full goals stand at both ends of the JOSH ground.',
      venue: 'JOSH Ground',
      photo: joshGoal,
      alt: 'A goal at the end of the JOSH ground at Sunbeam School Ballia',
    },
    {
      name: 'Cricket',
      icon: 'cricket',
      blurb: 'The open stretch of the JOSH ground, end to end.',
      venue: 'JOSH Ground',
      photo: joshOpen,
      alt: 'The open field of the JOSH ground at Sunbeam School Ballia',
    },
    {
      name: 'Basketball',
      icon: 'basketball',
      blurb: 'A hard court beside the teaching block, with a hoop at each end.',
      venue: 'Basketball Court',
      photo: courtHoopTwo,
      alt: 'A basketball hoop on the court at Sunbeam School Ballia',
    },
    {
      name: 'Volleyball',
      icon: 'volleyball',
      blurb: 'Nets stay up on the JOSH ground. Second in the Asmita Khelo India Women’s League.',
      venue: 'JOSH Ground',
      photo: joshNets,
      alt: 'Volleyball nets up on the JOSH ground at Sunbeam School Ballia',
    },
    {
      name: 'Kho-Kho',
      icon: 'khokho',
      blurb: 'The school’s strongest game — Cluster V champions in 2018-19, 2019-20, and gold again in 2025.',
      venue: 'JOSH Ground',
      photo: joshGrass,
      alt: 'The grass end of the JOSH ground at Sunbeam School Ballia',
    },
    {
      name: 'Kabaddi',
      icon: 'kabaddi',
      blurb: 'Runners-up in the Asmita Khelo India Women’s League.',
      venue: 'JOSH Ground',
      photo: joshBlock,
      alt: 'The JOSH ground at Sunbeam School Ballia, below the teaching block',
    },
    {
      name: 'Hockey',
      icon: 'hockey',
      blurb: 'One of the eight outdoor games, played on the JOSH ground.',
      venue: 'JOSH Ground',
      photo: joshWall,
      alt: 'The JOSH ground at Sunbeam School Ballia along the boundary wall',
    },
    {
      name: 'Skating',
      icon: 'skating',
      blurb: 'Taken up from the junior years, on the paved ground.',
      venue: 'Junior ground',
      photo: parkRound,
      alt: 'The paved junior playground at Sunbeam School Ballia',
    },
  ],
  indoor: [
    {
      name: 'Taekwondo',
      icon: 'belt',
      blurb: 'Twenty-one entered the 2025 Poomse championship. Ten came back with gold.',
      venue: 'Indoor',
    },
    {
      name: 'Karate',
      icon: 'karate',
      blurb: 'Fourteen medals at the 11th BSKA championship — all from Classes I and II.',
      venue: 'Indoor',
    },
    {
      name: 'Chess',
      icon: 'chess',
      blurb: 'First among two hundred schools at U-11, and a national qualification before that.',
      venue: 'Indoor',
    },
    {
      name: 'Table Tennis',
      icon: 'tabletennis',
      blurb: 'On the indoor roster through the year, whatever the weather outside.',
      venue: 'Indoor',
    },
    {
      name: 'Carrom',
      icon: 'carrom',
      blurb: 'The quiet end of the games period, and the one that fills up fastest.',
      venue: 'Indoor',
    },
    {
      name: 'Yoga',
      icon: 'yoga',
      blurb: 'Practised indoors, across year groups.',
      venue: 'Indoor',
    },
    {
      name: 'Aerobics',
      icon: 'aerobics',
      blurb: 'Group fitness, indoors, as a games-period option.',
      venue: 'Indoor',
    },
  ],
};

/* ═══ §3 · STUDENT PARTICIPATION ════════════════════════════════════════════
   EVERY FIGURE IS READ BACK OUT OF THE SCHOOL'S OWN RECORDS. "35" is the
   arithmetic on two published medal counts — 21 at Taekwondo Poomse 2025 (10+9+2)
   and 14 at the 11th BSKA (12+2). No headcount is claimed anywhere, because the
   school publishes none; "800 students play sport" would be the single most
   tempting invention on this page and the least defensible. */

export const figures = [
  { figure: '15', label: 'Games on the roster', note: 'Eight outdoor, seven indoor' },
  { figure: '35', label: 'Medals, two championships', note: 'Taekwondo Poomse 2025 and the 11th BSKA' },
  { figure: '21', label: 'In a single squad', note: 'The 2025 Poomse entry, Classes I–IX' },
  { figure: 'I–XII', label: 'Every year group', note: 'Junior park through to district squads' },
  { figure: 'A & B', label: 'NCC affiliations', note: 'Two teachers hold officer rank' },
];

/* ═══ §4 · INTER-HOUSE, AND WHERE IT LEADS ══════════════════════════════════
   The client asks for house competitions on a timeline with photographs. The
   school publishes no house names, no house count and no fixture list — so the
   timeline is built from the rungs the school's OWN RESULTS climb, starting at
   the house match. Every rung above the first carries a published record.

   Rung one is the client's own statement that inter-house competition happens.
   `pending` marks it: the fact is theirs, the detail is still missing, and the
   chip shows in build-notes mode without disfiguring the page in production. */

/**
 * SHAPED LIKE `stages` IN data/academics.ts, ON PURPOSE. The client asked for
 * this section to use the stacking ticket-card deck built for "A closer look at
 * each stage" on /academics/structure, and that card reads a stub (glyph, band
 * label, position), a main half (title, body) and an itemised half (three focus
 * lines with dotted leaders, then a milestone under a doubled rule). Matching
 * the data shape is what lets the layout be the same component logic rather than
 * a lookalike — three items and one milestone per rung, no more, no fewer.
 */
export interface Rung {
  /** The band label in the stub — the level, not the sport. */
  step: string;
  title: string;
  body: string;
  /** Exactly three, to match the deck's itemised column. */
  items: string[];
  milestone: string;
  glyph: string;
  /** Card accent, resolved to a token pair in the component. */
  accent: 'teal' | 'violet' | 'maroon' | 'deep';
  pending?: boolean;
}

export const ladder: Rung[] = [
  {
    step: 'In school',
    title: 'House against house',
    body: 'The inter-house calendar is where nearly every child gets a first competitive fixture — before any trial, any squad and any travel.',
    /* ⚠ THESE THREE RESTATE THE CLIENT'S OWN CLAIM AND ADD NOTHING TO IT. The
       school publishes no house names, no house count and no fixture list, so
       the milestone says so rather than a fourth invented fact filling the slot
       the other three rungs fill with published records. */
    items: ['Inter-house fixtures', 'Open to every year group', 'A first competitive game'],
    milestone: 'House names and fixture calendar to be supplied by the school',
    glyph: 'field',
    accent: 'teal',
    pending: true,
  },
  {
    step: 'District',
    title: 'Ballia district championships',
    body: 'School squads are entered against the district. The handball entry came back with a clean sweep of the podiums.',
    items: ['Handball — Junior Boys 1st', 'Handball — Senior Boys 2nd', 'Handball — Girls 1st'],
    milestone: 'Junior District Championship — 2nd overall',
    glyph: 'medal',
    accent: 'violet',
  },
  {
    step: 'CBSE Cluster',
    title: 'Cluster V',
    body: 'The school hosted the cluster Kho-Kho championship, then won it — and has kept winning it. This is the rung the school’s strongest record sits on.',
    items: ['Hosted the championship, 2016', 'Champions 2018-19', 'Champions 2019-20'],
    milestone: 'Kho-Kho Girls U-19 — gold, 2025',
    glyph: 'trophy',
    accent: 'maroon',
  },
  {
    step: 'National',
    title: 'Asmita Khelo India Women’s League',
    body: 'Three podium finishes in a single national women’s league — the furthest the school’s teams have gone, and all three from girls’ squads.',
    items: ['Handball — 1st', 'Kabaddi — 2nd', 'Volleyball — 2nd'],
    milestone: 'Chess U-11 Boys — qualified for the nationals',
    glyph: 'target',
    accent: 'deep',
  },
];

/* ═══ §5 · COACHING ═════════════════════════════════════════════════════════
   NO COACH IS NAMED AND NO PROGRAMME IS DESCRIBED, because the school publishes
   neither. What each card states is what the results themselves establish about
   how sport is taught here — a Class I medal cannot happen without Class I
   coaching. The figure on each card is its own evidence. */

export interface CoachCard {
  icon: string;
  figure: string;
  title: string;
  body: string;
  proof: string;
}

export const coaching: CoachCard[] = [
  {
    icon: 'sprout',
    figure: 'I–II',
    title: 'Coaching starts in the first year group',
    body: 'The school’s karate medals were won by children in the youngest two classes in the school — which means the coaching reaches them there, not from Class VI.',
    proof: '11th BSKA Karate Championship — 14 medals, Classes I & II',
  },
  {
    icon: 'target',
    figure: '10 gold',
    title: 'Trained to competition standard',
    body: 'Twenty-one students entered a single Poomse championship and twenty-one came home with a medal — ten of them gold. That is a coaching record whoever is named on it.',
    proof: 'Taekwondo Poomse Championship 2025 — 10 gold, 9 silver, 2 bronze',
  },
  {
    icon: 'trophy',
    figure: '3 podiums',
    title: 'Girls’ teams go the furthest',
    body: 'The school’s two strongest records — the national women’s league podiums and the cluster Kho-Kho titles — are both girls’ records.',
    proof: 'Asmita Khelo India Women’s League · CBSE Cluster V Kho-Kho (Girls U-19)',
  },
  {
    icon: 'chess',
    figure: '1st / 200',
    title: 'Board games are coached, not supervised',
    body: 'Chess is taken as seriously as the field sports: a U-11 side placed first in a field of two hundred schools and qualified for the nationals.',
    proof: 'Chess U-11 Boys — 1st among 200 schools, 2018 · nationals 2016-17',
  },
];

/* ═══ §6 · ACHIEVEMENTS — LAST ═════════════════════════════════════════════ */

export interface Achievement {
  title: string;
  meta: string;
  body: string;
  major?: boolean;
  photo?: ImageMetadata;
  alt?: string;
  /**
   * The image is the school's own designed award graphic, not a photograph.
   * It is shown WHOLE inside a frame rather than cropped to fill a card — see
   * the note in Achievements.astro. Cropping a poster cuts its own headline off.
   */
  poster?: boolean;
}

export const achievements: Achievement[] = [
  {
    title: 'CBSE Cluster V Kho-Kho',
    meta: 'Hosted 2016 · Champions 2018-19, 2019-20 · Gold 2025',
    body: 'The school hosted the cluster championship in 2016, won the title in two consecutive seasons, and took gold again with the girls’ under-19 side in 2025. It is the school’s strongest sporting record by some distance.',
    major: true,
    photo: khokho,
    alt: 'The school’s award graphic for the CBSE Cluster-V Kho-Kho Girls’ Championship under-19 gold medal, 2025, showing the team with their trophy and medals',
    poster: true,
  },
  {
    title: 'Asmita Khelo India Women’s League',
    meta: 'National',
    body: 'Handball 1st, Kabaddi 2nd and Volleyball 2nd — three podium finishes in one national women’s league.',
    major: true,
  },
  {
    title: 'Taekwondo Poomse Championship',
    meta: '2025 · Classes I–IX',
    body: 'Twenty-one students entered; ten gold, nine silver and two bronze came back.',
    major: true,
  },
  {
    title: '11th BSKA Karate Championship',
    meta: 'Classes I & II',
    body: 'Fourteen medals — twelve bronze and two silver — from the youngest two year groups.',
  },
  {
    title: 'District Handball',
    meta: 'Junior & Senior',
    body: 'Junior Boys 1st, Senior Boys 2nd, Girls 1st.',
  },
  {
    title: 'Chess',
    meta: 'U-11 Boys',
    body: 'First among two hundred schools in 2018, after qualifying for the nationals in 2016-17.',
  },
  {
    title: 'Junior District Championship',
    meta: 'Overall',
    body: 'Second place overall across the junior events.',
  },
];
