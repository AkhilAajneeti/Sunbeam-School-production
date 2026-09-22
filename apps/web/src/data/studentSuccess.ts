/**
 * STUDENT SUCCESS — the data behind the five sliders in this section.
 *
 * ⚠ EVERY ARRAY HERE IS THE RECORD, NOT A SAMPLE. A card exists because the
 * school published the thing it describes; a card that would have to be
 * invented is simply absent, and the component renders its awaiting state.
 * `scholarships` is empty for exactly that reason — see its own note.
 *
 * ⚠ ADDING A RECORD IS ONE ENTRY HERE AND NO COMPONENT CHANGE. Every slider
 * reads its length for the counter and its dots, so five cards, twenty or fifty
 * lay out identically.
 *
 * SOURCES, all inside this repository:
 *   assets/school-activities/career-counselling/  — eight published frames.
 *   assets/school-event/CUET-(UG)-results/        — four CUET result cards and
 *                                                   four college placement cards.
 *   assets/placement/                             — the Vision To Reality board.
 *   assets/school achivement/                     — three award graphics.
 *   data/achievements.ts, data/newsPages.ts, data/academics.ts.
 */

/* ── CAREER GUIDANCE ────────────────────────────────────────────────────────
   ⚠ READ OFF THE SCHOOL'S OWN PHOTOGRAPHS, and nothing beyond them. The school
   published twenty-six frames of day one; eight are in this repository. The
   visiting speaker is NOT named: his name is printed on the slide behind him
   but cannot be read with certainty at this resolution, and the school
   published no caption. A name guessed off a blurred slide would be worse than
   no name. ASSET REQUEST: the school's own caption for the two days. */
import cg1 from '../assets/school-activities/career-counselling/01.jpg';
import cg2 from '../assets/school-activities/career-counselling/02.jpg';
import cg3 from '../assets/school-activities/career-counselling/03.jpg';
import cg4 from '../assets/school-activities/career-counselling/04.jpg';
import cg5 from '../assets/school-activities/career-counselling/05.jpg';
import cg6 from '../assets/school-activities/career-counselling/06.jpg';
import cg7 from '../assets/school-activities/career-counselling/07.jpg';
import cg8 from '../assets/school-activities/career-counselling/08.jpg';

const S = 'Sunbeam School Ballia';

export interface PhotoRecord {
  src: ImageMetadata;
  alt: string;
  caption: string;
}

export const careerGuidanceImages: PhotoRecord[] = [
  { src: cg3, alt: `A student of ${S} and a family member seated opposite a counsellor working from a laptop, the school's Class X and XI career counselling banner behind them`, caption: 'One-to-one counselling · Classes X & XI' },
  { src: cg8, alt: `A visiting speaker addressing the senior school of ${S} on a lapel microphone, his projected deck headed "Dream BIG aim HIGH"`, caption: 'The hall session · day one' },
  { src: cg1, alt: `The hall at ${S} during the career counselling session, the senior school seated in rows facing the projected deck`, caption: 'The senior school, seated' },
  { src: cg6, alt: `A student of ${S} seated opposite a counsellor at a career counselling desk, a file of papers between them`, caption: 'At the desk' },
  { src: cg2, alt: `Students of ${S} waiting their turn at the career counselling session`, caption: 'Waiting to be seen' },
  { src: cg4, alt: `A career counselling desk at ${S}, the counsellor's laptop open between the chairs`, caption: 'The counsellor’s table' },
  { src: cg5, alt: `A student of ${S} in conversation with a counsellor during the career counselling programme`, caption: 'The conversation' },
  { src: cg7, alt: `The career counselling programme at ${S}, tables set out beneath the school's own hand-painted banner`, caption: 'The room, set out' },
];

/* ── CAREER GUIDANCE · THE PAGE'S OWN PROSE ─────────────────────────────────
   ⚠⚠ MOVED OUT OF CareerGuidancePage.astro VERBATIM. Every line below was
   written in that component's markup, which meant the school could not correct
   a word of its own careers programme without a developer. Nothing here is new
   copy and nothing was tidied on the way across.

   ⚠ THE MARKUP SURVIVED THE MOVE, IT WAS NOT DROPPED. `**bold**`, `*italic*`
   and `[label](/href)` are the three marks ui/RichLine.astro parses — the same
   three the rest of the migrated copy uses. The emphasis in these paragraphs is
   doing real work (it quotes the school's own banner and its own blackboard),
   so flattening it to plain text would have lost the point of the sentence.

   ⚠ A HEADING IS TWO LINES, `{{…}}` FOR THE ITALIC HALF — ui/ClipHeading.astro
   renders one clipped span per line. The line break is editorial: it is where
   the sentence turns. */

export const careerGuidanceOpen = {
  kicker: 'A conversation that counts',
  heading: 'It opens\n{{with a room.}}',
  body: [
    'The programme begins as a single session for the whole senior school. A visiting speaker takes the hall on a lapel microphone under a deck headed **\u201cDream BIG aim HIGH\u201d**, opening on a line from Swami Vivekananda \u2014 *\u201cknowledge does not mean simply intellectual assent, it means realisation.\u201d*',
    'Beside the stage the school has chalked one word on a blackboard and left it there: **CAREER**. Twenty-six photographs of the day were published, and a second day separately.',
    'The school does not publish who spoke or what was covered \u2014 his name is printed on the slide behind him but cannot be read with certainty, so it is not guessed at here. The full gallery is under [School Activities](/beyond-academics/school-activities/career-counselling/).',
  ],
};

export const careerGuidanceMain = {
  kicker: 'One student, one counsellor',
  heading: 'One\n{{at a time.}}',
  body: [
    'The school\u2019s own hand-painted banner sets the audience, and it is a specific one: **\u201cCareer Counseling \u2014 Class X & XI \u2014 Your Journey.\u201d** Behind that banner the day stops being an assembly. Each student takes a chair opposite a counsellor working from a laptop, and several bring a parent or an elder sibling to sit alongside.',
  ],
};

export const careerGuidanceGive = {
  kicker: 'What it gives',
  heading: 'Clarity today,\n{{confidence tomorrow.}}',  /* ⚠ EMPTY ON PURPOSE, AND IT HAS TO BE HERE. This band is a heading over
     four columns and carries no prose of its own — but a block of nothing but
     plain strings is read by the seed's classifier as a key→prose map rather
     than an editorial block, and its kicker and heading are then dropped
     without a word. One non-string value is what tells the two apart. */
  body: [] as string[],
};

export const careerGuidanceClose = {
  kicker: 'A day, in two halves',
  heading: 'Your journey,\n{{in their words.}}',
  body: [
    'The school publishes the programme, the year groups it is for, and twenty-six photographs of the first day. It does not publish who spoke, what was covered, or how a family books a session \u2014 and none of that is invented here.',
  ],
};

/* ── OLYMPIADS ──────────────────────────────────────────────────────────────
   ⚠ NO AWARD TOTAL, ANYWHERE. The original client brief asked for "100+
   Olympiad awards". The school publishes no total, so there is none here and
   none is derivable from this array.

   ⚠ `category` DRIVES THE FILTER CHIPS, and a chip only renders if at least one
   record carries it. Categories with no verified record therefore never appear
   as an empty filter.

   The photographs are of ROOMS, and every alt says so. There is no photograph
   of a Sunbeam student sitting an olympiad paper in this repository, and none is
   implied. ASSET REQUEST: an olympiad sitting, and the SOF award graphics. */
import olyComposite from '../assets/composite lab/DSC_1255 copy.jpg';
import olyMaths from '../assets/photos/sb-maths-lab.jpg';
import olyActivity from '../assets/activity learning lab/DSC_1215 copy.jpg';
import olyLib from '../assets/library/DSC_1226 copy.jpg';
import olySci from '../assets/photos/sb-sci-lab.jpg';
import olyBio from '../assets/photos/sb-bio-lab.jpg';

export interface OlympiadRecord {
  title: string;
  category: 'Science' | 'Innovation' | 'Aptitude';
  classes: string;
  year: string;
  image: ImageMetadata;
  alt: string;
  description: string;
  link: string;
}

export const olympiads: OlympiadRecord[] = [
  {
    title: 'SOF Olympiad',
    category: 'Science',
    classes: 'Nursery – Class II',
    year: 'Ongoing',
    image: olyActivity,
    alt: `The activity learning room at ${S}, its worktables set out for group work`,
    description: 'The Science Olympiad Foundation paper, sat from the youngest years upward — the earliest point at which a Sunbeam child’s work is measured from outside the building.',
    link: '/academics/assessment/competitive-exam-preparation/',
  },
  {
    title: 'SOF Zonal Excellence Award',
    category: 'Science',
    classes: 'Classes III – V',
    year: 'Ongoing',
    image: olyLib,
    alt: `The Nalanda Library at ${S}, its shelves signed by subject`,
    description: 'The zonal award, which the school records as carrying a ₹500 voucher. A zonal award is a placing across schools, not a certificate for turning up.',
    link: '/academics/assessment/competitive-exam-preparation/',
  },
  {
    title: 'Vidyarthi Vigyan Manthan',
    category: 'Science',
    classes: 'Classes VI – XI',
    year: 'Ongoing',
    image: olyComposite,
    alt: `The composite laboratory at ${S}, benches and apparatus laid out along the room`,
    description: 'The national science talent search. The school records students qualifying to the national level of it.',
    link: '/academics/assessment/competitive-exam-preparation/',
  },
  {
    title: 'National Children’s Science Congress',
    category: 'Science',
    classes: 'Senior school',
    year: 'Ongoing',
    image: olySci,
    alt: `A student of ${S} using a microscope beside plant specimens in flasks`,
    description: 'Project-based science, presented and defended rather than answered on a paper. National-level qualification is recorded.',
    link: '/academics/assessment/competitive-exam-preparation/',
  },
  {
    title: 'Inspire Award MANAK',
    category: 'Innovation',
    classes: 'Senior school',
    year: 'Ongoing',
    image: olyMaths,
    alt: `The mathematics laboratory at ${S}, its models and charts set out on the working surfaces`,
    description: 'The Department of Science & Technology’s scheme for original ideas from school students. Student innovations have been selected for it.',
    link: '/academics/assessment/competitive-exam-preparation/',
  },
  {
    title: 'Indian AI Impact Festival',
    category: 'Aptitude',
    classes: 'Class VII',
    year: '2024',
    image: olyBio,
    alt: `Two students of ${S} handling glassware in the biology laboratory`,
    description: 'Ayushi, of Class VII, placed first — one of the small number of named individual results the school publishes.',
    link: '/academics/student-success/success-stories/',
  },
];

/* ── UNIVERSITY RESULT CARDS ────────────────────────────────────────────────
   ⚠ EVERY FIGURE IS PRINTED ON THE CARD ITSELF. The school issues one graphic
   per student; the score, the percentiles and the institution are read off it.
   No average, no cohort size and no placement rate appears — the school
   publishes none, and a mean of four cards would be a statistic we invented. */
import ucPriyanka from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-04.jpg';
import ucPrachi from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-01.jpg';
import ucManya from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-03.jpg';
import ucManish from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-02.jpg';
import ucPrachiPl from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-05.jpg';
import ucPriyankaPl from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-06.jpg';
import ucPranjalPl from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-07.jpg';
import ucAnkitPl from '../assets/school-event/CUET-(UG)-results/CUET-(UG)-results-08.jpg';

export interface ResultRecord {
  image: ImageMetadata;
  alt: string;
  name: string;
  exam: string;
  score: string;
  description: string;
}

export const universityResults: ResultRecord[] = [
  {
    image: ucPriyanka,
    alt: `${S}'s CUET (UG) 2025 result card for Priyanka Maurya of the Humanities stream, showing an NTA score of 967 out of 1250 with her subject percentiles`,
    name: 'Priyanka Maurya',
    exam: 'CUET (UG) 2025 · Humanities',
    score: 'NTA 967 / 1250',
    description: 'History 98.64 · Political Science 98.00 · English 97.90 · Geography 96.05 · General Aptitude 94.93.',
  },
  {
    image: ucPrachi,
    alt: `${S}'s CUET (UG) 2025 result card for Prachi Chaurasia of the Commerce stream, showing an NTA score of 888 out of 1250 with her subject percentiles`,
    name: 'Prachi Chaurasia',
    exam: 'CUET (UG) 2025 · Commerce',
    score: 'NTA 888 / 1250',
    description: 'Economics 99.94 · Accountancy 99.78 · Business Studies 99.38.',
  },
  {
    image: ucManya,
    alt: `${S}'s CUET (UG) 2025 result card for Manya Chaturvedi of the Humanities stream, showing an NTA score of 884 out of 1250 with her subject percentiles`,
    name: 'Manya Chaturvedi',
    exam: 'CUET (UG) 2025 · Humanities',
    score: 'NTA 884 / 1250',
    description: 'Political Science 99.32 · General Aptitude 97.18 · History 94.51. Head Prefect, on the badge in her own card.',
  },
  {
    image: ucManish,
    alt: `${S}'s CUET (UG) 2025 result card for Manish Kumar Singh of the PCM stream, showing an NTA percentile of 82 with his subject percentiles`,
    name: 'Manish Kumar Singh',
    exam: 'CUET (UG) 2025 · PCM',
    score: 'NTA percentile 82%',
    description: 'Physics 97.64 · Chemistry 97.14 · Mathematics 92.35.',
  },
  {
    image: ucPrachiPl,
    alt: `${S}'s college placement card for Prachi Chaurasia at Kirori Mal College, University of Delhi, batch 2024-25`,
    name: 'Prachi Chaurasia',
    exam: 'College placement · Batch 2024-25',
    score: 'Kirori Mal College, DU',
    description: 'The same student’s placement card, issued alongside her CUET result.',
  },
  {
    image: ucPriyankaPl,
    alt: `${S}'s college placement card for Priyanka Maurya at Miranda House, University of Delhi, batch 2024-25`,
    name: 'Priyanka Maurya',
    exam: 'College placement · Batch 2024-25',
    score: 'Miranda House, DU',
    description: 'One of the ten University of Delhi placements named on the board.',
  },
  {
    image: ucPranjalPl,
    alt: `${S}'s college placement card for Pranjal Singh at Dyal Singh College, University of Delhi, batch 2024-25`,
    name: 'Pranjal Singh',
    exam: 'College placement · Batch 2024-25',
    score: 'Dyal Singh College, DU',
    description: 'Named on the strip along the top of the placement board.',
  },
  {
    image: ucAnkitPl,
    alt: `${S}'s college placement card for Ankit Singh at UPES Dehradun, batch 2024-25`,
    name: 'Ankit Singh',
    exam: 'College placement · Batch 2024-25',
    score: 'UPES Dehradun',
    description: 'One of the five placements outside Delhi and Varanasi on the board.',
  },
];

/* ── SUCCESS STORIES ────────────────────────────────────────────────────────
   ⚠ THE THREE MAJORS ARE POSTERS, NOT PHOTOGRAPHS — designed graphics with
   their own headline, crest and framed photograph inside. They are shown whole;
   cropping one to a landscape frame removes the headline, which is the part
   carrying the fact. Hence `poster: true`, which the card renders `contain`. */
import ssRobo from '../assets/school achivement/robo.jpg';
import ssInnov from '../assets/school achivement/innoventure.jpg';
import ssKho from '../assets/school achivement/KHO KHO CHAMPIOANSHIP.jpg';

export interface StoryRecord {
  student: string;
  title: string;
  category: 'Innovation' | 'Academic' | 'Sports';
  year: string;
  location: string;
  image: ImageMetadata;
  alt: string;
  description: string;
  poster?: boolean;
  link: string;
}

export const successStories: StoryRecord[] = [
  {
    student: 'Master Deepak Kumar',
    title: '2nd place · USD 1,500',
    category: 'Innovation',
    year: '2025-26',
    location: 'Kuala Lumpur, Malaysia',
    image: ssRobo,
    alt: `${S}'s award graphic for the RoboWunder International Robotics Championship in Kuala Lumpur, showing Deepak Kumar with his drone and the team receiving the award`,
    description: 'RoboWunder International Robotics Championship — the furthest afield the school has competed, and the only international placing in its record.',
    poster: true,
    link: '/academics/student-success/success-stories/',
  },
  {
    student: 'National School Innovation Ranking',
    title: 'Rank 2 · Uttar Pradesh',
    category: 'Innovation',
    year: '2025',
    location: 'Uttar Pradesh',
    image: ssInnov,
    alt: `${S}'s award graphic for securing second position in Uttar Pradesh at the National School Innovation Awards, showing the citation being presented on stage`,
    description: 'CBSE, for the school’s work in nurturing an innovation mindset among its students.',
    poster: true,
    link: '/academics/student-success/success-stories/',
  },
  {
    student: 'Kho-Kho, girls’ under-19',
    title: 'Gold · CBSE Cluster V',
    category: 'Sports',
    year: '2025',
    location: 'CBSE Cluster V',
    image: ssKho,
    alt: `${S}'s award graphic for the CBSE Cluster-V Kho-Kho Girls' Championship under-19 gold medal of 2025, showing the team with their trophy and medals`,
    description: 'Champions in 2018-19 and 2019-20, and the school hosted the championship in 2016 — its strongest sporting record by some distance.',
    poster: true,
    link: '/beyond-academics/achievements/',
  },
];

/**
 * The individual placings the school names but made no artwork for. Rendered as
 * the "read another way" milestones rather than as cards, because a card
 * without an image would sit oddly beside three that have one.
 */
export const successMilestones = [
  { n: '01', mark: 'globe', k: 'Kuala Lumpur', v: 'Deepak Kumar, second at an international robotics championship, with a 1,500 USD prize.' },
  { n: '02', mark: 'chart', k: 'Uttar Pradesh', v: 'Rank 2 in the state at CBSE’s National School Innovation Ranking.' },
  { n: '03', mark: 'medal', k: 'Class VII', v: 'Ayushi placed first at the Indian AI Impact Festival, 2024.' },
  { n: '04', mark: 'hands', k: 'Class IV', v: 'The top three positions across the Sunbeam group at the Virtual Interbranch Declamation.' },
] as const;

/* ── SCHOLARSHIPS ───────────────────────────────────────────────────────────
   ⚠⚠ THE ARRAY IS EMPTY, AND THAT IS THE HONEST STATE OF THE RECORD.
   The design brief's reference art shows four cards — "Kaushal Scholarship
   Examination", "Academic Achievers", "Sports Scholarships 2025" and
   "Lang Wiz 2025". NOT ONE of those is published by the school. Worse, a
   "Kaushal scholarship" was already invented once in this codebase and removed:
   the only occurrences of the word were in our own copy, citing an activity
   record that carries no such line. The site audit records scholarships as
   "not mentioned".

   Fees are the one subject on a school website where a plausible guess does
   measurable harm: a family may choose this school partly because of a
   scholarship summary and discover at the fee counter that it was ours. So the
   slider renders its awaiting state, and the page points at the office.

   ⚠ THE UI IS ALREADY BUILT FOR THE FILLED STATE. Adding a record is one entry
   below and no component change.
   ASSET REQUEST: the school's scholarship terms, if any exist. */
export interface ScholarshipRecord {
  title: string;
  category: string;
  year: string;
  image: ImageMetadata;
  alt: string;
  description: string;
  link: string;
}

export const scholarships: ScholarshipRecord[] = [];

/**
 * Where recognition IS recorded on this site.
 *
 * ⚠ THESE ARE NOT SCHOLARSHIP CATEGORIES AND ARE NOT LABELLED AS ANY. The brief
 * offers four possible categories "ONLY if supported by the official content";
 * none is supported as a scholarship. What IS supported is that the school
 * publishes achievements of these kinds, so the row points at the pages that
 * carry them and says exactly that.
 */
export const recognitionPaths = [
  { n: '01', mark: 'medal', k: 'Academic achievement', v: 'Named CUET results and university placements, card by card.', href: '/academics/student-success/university-counselling/' },
  { n: '02', mark: 'cup', k: 'Sporting achievement', v: 'CBSE Cluster and national placings, listed by event and year.', href: '/beyond-academics/achievements/' },
  { n: '03', mark: 'bulb', k: 'Competition achievement', v: 'National and international placings the school made artwork for.', href: '/academics/student-success/success-stories/' },
  { n: '04', mark: 'atom', k: 'Olympiad participation', v: 'The national programmes the school enters, and from which class.', href: '/academics/student-success/olympiad-achievements/' },
] as const;
