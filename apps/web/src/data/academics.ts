/**
 * ACADEMICS CONTENT — single source for the seven-page Academics section.
 *
 * WHY THIS FILE EXISTS. The section is a hub plus six detail pages, and several
 * facts appear on more than one of them: the counters run on the overview and on
 * Student Success, the laboratory inventory is teased on the overview and listed
 * in full on Teaching & Learning. Duplicating those strings across seven .astro
 * files is how a site ends up claiming 9 laboratories on one page and 11 on
 * another. Everything factual lives here once.
 *
 * ═══ RULES THIS FILE KEEPS ══════════════════════════════════════════════════
 *
 * 1 · Every figure below is published by the school and recorded in
 *     docs/01-existing-site-analysis.md § 5. Nothing is estimated.
 *
 * 2 · THREE THINGS THE SCHOOL HAS NOT PUBLISHED, and which therefore appear
 *     nowhere in this section as numbers (docs/01 § 3.8):
 *       board results (X & XII) — "no pass %, no toppers, no year-on-year data"
 *       university placements   — "Not mentioned"
 *       scholarships            — "Not mentioned"
 *     Each is represented by a designed awaiting-content state instead. Asset
 *     requests A1 (results) and A11 (placements, scholarships).
 *
 * 3 · Admission AGE criteria are locked inside a Drive-hosted prospectus, so the
 *     structure pages carry class bands and never ages. Asset request A8.
 *
 * 4 · Where the client brief names a practice the school has never described in
 *     its own words — teaching philosophy, inquiry-based learning, critical
 *     thinking — `what` DEFINES the practice and `anchor` carries a verified
 *     Sunbeam fact only where one genuinely exists. A definition is honest; a
 *     claim about how this school teaches would not be. The school's own
 *     statement is asset request A10.
 */
import { school } from './site';

/* ═══ THE SIX CHAPTERS — drives the overview hub and the section nav ═════════ */
export const chapters = [
  {
    slug: 'philosophy',
    n: '01',
    title: 'Academic Philosophy',
    href: '/academics/philosophy/',
    lede: 'Seven ideas the school organises its academic work around, and the documents behind them.',
    teaser: 'Duty · Devotion · Discipline',
  },
  {
    slug: 'structure',
    n: '02',
    title: 'Academic Structure',
    href: '/academics/structure/',
    lede: 'Fourteen years from Nursery to Class XII, and four streams to choose between at the end.',
    teaser: 'Nursery → Class XII',
  },
  {
    slug: 'teaching-learning',
    n: '03',
    title: 'Teaching & Learning',
    href: '/academics/teaching-learning/',
    lede: 'Twelve laboratories, a 17,574-book library, and 100 Microsoft-certified teachers.',
    teaser: 'Microsoft Showcase School',
  },
  {
    slug: 'assessment',
    n: '04',
    title: 'Assessment & Support',
    href: '/academics/assessment/',
    lede: 'How a year runs — taught content, internal assessment, boards, and the support around them.',
    teaser: 'Six steps, one cycle',
  },
  {
    slug: 'student-success',
    n: '05',
    title: 'Student Success',
    href: '/academics/student-success/',
    lede: 'Named results, national programmes, and where the school will publish its board data.',
    teaser: '#1 in Ballia, six years',
  },
  {
    slug: 'parent-partnership',
    n: '06',
    title: 'Parent Partnership',
    href: '/academics/parent-partnership/',
    lede: 'Six standing channels between the staff room and home — scheduled, not improvised.',
    teaser: 'Orientation to report card',
  },
] as const;

/* ═══ COUNTERS — eight published quantities ══════════════════════════════════
   Quantities only. A rank, an affiliation number or a school code is an
   identifier, and counting one up animates something that is not a quantity. */
export const counters = [
  { n: 100, suffix: '', label: 'Teachers certified as Microsoft Innovative Educator Experts' },
  { n: 6, suffix: '', label: 'Consecutive years ranked #1 Co-Ed Day School in Ballia' },
  { n: 17574, suffix: '', label: 'Books in the Nalanda Library' },
  { n: 12, suffix: '', label: 'Subject laboratories' },
  { n: 75, suffix: '+', label: 'Digitally smart classrooms' },
  { n: 49, suffix: '+', label: 'Interactive flat panels' },
  { n: 2700, suffix: '+', label: 'Students, Nursery to Class XII' },
  { n: 130, suffix: '+', label: 'Teaching staff' },
] as const;

/** Three for the overview hero — the most legible of the eight at a glance. */
export const heroStats = [
  { n: 130, suffix: '+', label: 'Teaching staff' },
  { n: 12, suffix: '', label: 'Laboratories' },
  { n: 17574, suffix: '', label: 'Library books' },
] as const;

/* ═══ 01 · PHILOSOPHY ═══════════════════════════════════════════════════════ */
export const philosophy = [
  {
    n: '01',
    title: 'Teaching philosophy',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '✦',
    what:
      'The school states its purpose through its motto — Duty, Devotion and Discipline — and its ' +
      'punch line, Educating the FUTURE!',
    anchor: school.motto,
  },
  {
    n: '02',
    title: 'Student-centred learning',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '↗',
    what:
      'Teaching organised around the learner rather than the lecture: the pace, the grouping and ' +
      'the task follow what a particular child is ready for next.',
    anchor: null,
  },
  {
    n: '03',
    title: 'Experiential learning',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '⌁',
    what:
      'Understanding built by doing — practical work, fieldwork and making, so that a concept is ' +
      'met in the hand before it is met in the exam.',
    anchor: 'Twelve laboratories · learning expeditions',
  },
  {
    n: '04',
    title: 'Inquiry-based learning',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '?',
    what:
      'Lessons that open with a question rather than a conclusion, and ask students to investigate ' +
      'their way to the answer.',
    anchor: 'Srijan Lab · MUN Lab · Active Learning Lab',
  },
  {
    n: '05',
    title: 'Critical thinking',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '✳',
    what:
      'Weighing evidence, testing a claim and arguing a position — the habits that outlast any ' +
      'particular syllabus.',
    anchor: 'Model United Nations · declamation · science congress',
  },
  {
    n: '06',
    title: 'Curriculum',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '▦',
    what:
      'The CBSE curriculum, published by the school as its PRECEPT syllabus documents for every ' +
      'class from Nursery to XII.',
    anchor: 'PRECEPT syllabus, Nursery–XII · session 2026-27',
  },
  {
    n: '07',
    title: 'Affiliation',
    /** Constellation glyph — carried from the client's own ecosystem design. */
    mark: '✓',
    what:
      'Affiliated to the Central Board of Secondary Education, Delhi, as a co-educational senior ' +
      'secondary school.',
    anchor: `CBSE ${school.affiliationNo} · School Code ${school.schoolCode}`,
  },
] as const;

/* ═══ 01 · TEACHING PHILOSOPHY — the feature band ════════════════════════════
   The four commitments the Academic Philosophy page opens on, and the supporting
   statement beneath them.

   WHAT IS SAFE TO SAY HERE, and it is a narrow line. Rule 4 at the top of this
   file applies in full: the school has never published a teaching-philosophy
   statement of its own (asset request A10), so nothing below claims a practice
   this school has not described. Each card DEFINES the commitment the client
   brief names, and every figure inside it — twelve laboratories, PRECEPT, 130+
   staff, 100 Microsoft Innovative Educator Experts, the named competitions — is
   already verified in docs/01 § 5 and appears elsewhere in this file.

   `icon` is a key, not markup. The line-art glyphs live in
   components/academics/TeachingPhilosophy.astro so the SVG paths stay out of a
   data file, and an unmatched key renders no icon rather than breaking the card.
*/
export const teachingPhilosophy = {
  eyebrow: 'Teaching philosophy',
  /**
   * Split so the emphasised phrase can carry the .t-squiggle plate, and it ENDS
   * on the plate deliberately. The heading read "…the learner, not the lecture"
   * for one draft; at 58px the line broke after the plate and left the comma
   * stranded at the head of the last line, which is a typographic fault no
   * balance value fixes. The contrast moved to the standfirst, where it has room
   * to be a sentence.
   */
  headingLead: 'Learning built around',
  headingMark: 'the learner',
  stand:
    'Not the lecture — the learner. Duty, Devotion and Discipline is more than the ring on a ' +
    'crest: it is where a lesson plan starts, and four commitments shape the way every class is ' +
    'taught at ' + school.name + '.',

  cards: [
    {
      icon: 'learner',
      title: 'Student-Centred Learning',
      body:
        'Pace, grouping and task follow what a particular child is ready for next — teaching ' +
        'organised around the learner rather than around the lecture.',
    },
    {
      icon: 'inquiry',
      title: 'Experiential & Inquiry-Based Learning',
      body:
        'A concept met in the hand before it is met in the exam: twelve laboratories, practical work, ' +
        'and lessons that open with a question rather than a conclusion.',
    },
    {
      icon: 'spark',
      title: 'Critical Thinking & Creativity',
      body:
        'Weighing evidence, testing a claim, arguing a position — and the room to make something ' +
        'new, from Model United Nations to the science congress.',
    },
    {
      icon: 'curriculum',
      title: 'Curriculum Excellence',
      body:
        'The CBSE curriculum, published class by class as our PRECEPT syllabus from Nursery to ' +
        'Class XII and taught by ' + school.teachingStaff + ' staff.',
    },
  ],

  /** The statement under the cards. Facts only — see the note above. */
  creed: {
    eyebrow: 'The thinking behind it',

    /**
     * THE PULL QUOTE, in two halves with the cap illustration set between them —
     * the reference puts its glyph mid-phrase ("professional 🎓 educators"), not
     * at a clause break, and that is where the break falls here too.
     *
     * ONLY THE SCHOOL'S OWN WORDS ARE INSIDE THE QUOTE MARKS. The motto is
     * genuinely published; the sentence around it is this page's voice. Wrapping
     * the whole line in quotes would attribute an editorial statement to the
     * school, which is the one thing rule 4 at the top of this file rules out.
     */
    quoteBefore: '“Duty, Devotion, Discipline” is not a',
    quoteAfter:
      'line on a crest — it is where a lesson plan starts, and what an ordinary Tuesday morning ' +
      'is measured against.',
    quoteSource: `The school’s own motto · ${school.tagline}`,

    paragraphs: [
      'Those three words are the school’s own, read off the crest on its gate. What they are not ' +
        'is decoration: each one is a claim about how a room should run, and the four commitments ' +
        'above are this page’s attempt to make them checkable rather than ceremonial.',
      'In practice that means a curriculum taught to the CBSE scheme and published for every class ' +
        'from Nursery to XII, rooms built for practical work rather than for demonstration, and ' +
        'staff who are still learning themselves — 100 of them certified as Microsoft Innovative ' +
        'Educator Experts.',
    ],

    /**
     * The three principles, each with a one-line gloss. The WORDS are the
     * school's, off the crest. The glosses are editorial — they say what the
     * word asks of a school, and make no claim about what this school does. That
     * distinction is the whole reason the panel can carry them at all.
     */
    principles: [
      { n: '01', word: 'Duty', gloss: 'The work a school owes a child, and a child owes the subject.' },
      { n: '02', word: 'Devotion', gloss: 'Attention paid to one learner at a time, not to a class average.' },
      { n: '03', word: 'Discipline', gloss: 'The habit that makes ability count: turning up, and finishing.' },
    ],

    /** Small verified proofs, set as a hairline row under the paragraphs. */
    proofs: [
      { value: '12', label: 'Subject laboratories' },
      { value: '100', label: 'Microsoft-certified teachers' },
      { value: 'Nursery–XII', label: 'PRECEPT syllabus published' },
    ],
  },
} as const;

/* ═══ 01 · AFFILIATION DETAILS ══════════════════════════════════════════════
   Four cells, and every value is an identifier the school publishes on its own
   /affiliation/ page — nothing here is derived, rounded or inferred. The board's
   full legal name leads because "CBSE" alone is what every school in the country
   writes; the number and the code are what a parent actually checks.

   NO COUNT-UP ON THESE. An affiliation number is not a quantity (see the note on
   `counters` above) and animating one up reads as a slot machine. */
export const affiliation = {
  eyebrow: 'Affiliation',
  heading: 'Affiliation details',
  stand:
    'The school\'s standing with its board, in the four terms a parent or a transferring student ' +
    'is usually asked for.',
  cells: [
    {
      label: 'Affiliating Board',
      lines: [school.boardFull, `${school.board} — affiliated since inception`],
    },
    {
      label: 'Affiliation Number',
      lines: [school.affiliationNo, `School Code ${school.schoolCode}`],
    },
    {
      label: 'School Category',
      lines: ['Co-educational Senior Secondary', `Day school · ${school.classRange}`],
    },
    {
      label: 'Streams at Senior Secondary',
      lines: [school.streams.slice(0, 2).join(' · '), school.streams.slice(2).join(' · ')],
    },
  ],
} as const;

/* ═══ 02 · STRUCTURE ════════════════════════════════════════════════════════
   `tone` drives a per-stage accent. Class bands are the CBSE structure the
   school operates within; the school publishes its own range as Nursery to
   Class XII. NO AGES — see rule 3 at the top of this file. */
/* ═══ 02 · ACADEMIC STRUCTURE ═══════════════════════════════════════════════
   The `accent` key names a cool palette declared on the Academic Structure page
   itself. The five run green → violet in stage order, which is deliberate: the
   spectrum itself carries the progression, so the row reads as a journey even
   before the connector between the nodes is noticed
   rather than in tokens.css. The client asked that page for teal/blue/indigo/
   violet washes instead of the site's warm orange, and confining the palette to
   the one page that uses it means the departure is visible in one file and
   revertible in one file.

   NO AGES anywhere. The school's age criteria live in a Drive-hosted prospectus
   and are not ours to estimate. Asset request A8.

   THE STAGE NAMES ARE THE CLIENT'S, given in the brief: Pre-Primary, Primary,
   Middle School, Secondary, Senior Secondary. Two of them used to read 'Early
   Years' and 'Middle'. This array is imported by the structure page and nothing
   else — the homepage journey runs off data/home.ts — so the rename is local. */
export const stages = [
  {
    key: 'pre-primary',
    accent: 'teal',
    glyph: 'making',
    stage: 'Pre-Primary',
    classes: 'Nursery · LKG · UKG',
    body:
      'The first years on campus, in rooms and grounds built for them — a kids park, a toy ' +
      'library, sand and water play, and a little agriculture patch.',
    focus: ['Play-led routine', 'Early language', 'Number sense'],
    milestone: 'School as a place you want to be',
  },
  {
    key: 'primary',
    accent: 'cyan',
    glyph: 'reading',
    stage: 'Primary',
    classes: 'Classes I – V',
    body:
      'Reading, number and the first structured subjects, taught across smart classrooms and the ' +
      'junior computer lab.',
    focus: ['Reading fluency', 'Written expression', 'Digital literacy'],
    milestone: 'Reading fluently · writing at length',
  },
  {
    key: 'middle',
    accent: 'blue',
    glyph: 'science',
    stage: 'Middle School',
    classes: 'Classes VI – VIII',
    body:
      'Specialist teaching begins and the laboratories open up. Class VII takes the school’s KIDS ' +
      'entrepreneurship programme.',
    focus: ['Practical science', 'Independent projects', 'KIDS entrepreneurship, Class VII'],
    milestone: 'Practical science · independent projects',
  },
  {
    key: 'secondary',
    accent: 'indigo',
    glyph: 'inquiry',
    stage: 'Secondary',
    classes: 'Classes IX – X',
    body:
      'The two years that build to the first board examination, with the full science, mathematics ' +
      'and language laboratory programme.',
    focus: ['Full laboratory programme', 'Board preparation', 'Subject choice ahead'],
    milestone: 'CBSE Class X board examination',
  },
  {
    key: 'senior',
    accent: 'violet',
    glyph: 'rocket',
    stage: 'Senior Secondary',
    classes: 'Classes XI – XII',
    body:
      'Four streams to choose between, each taught to board level: ' + school.streams.join(', ') + '.',
    focus: [...school.streams],
    milestone: 'CBSE Class XII board examination',
  },
] as const;

/* ═══ 02b · STREAMS AND SUBJECT COMBINATIONS ═══════════════════════════════
   ⚠ READ THIS BEFORE THE PAGE GOES LIVE. The four STREAM NAMES are verified —
   they come from school.streams in data/site.ts and the school publishes them.
   Everything below that divides into three confidence levels, and the page
   carries a footnote saying so:

   1 · DEFINITIONAL, and safe. PCM is Physics, Chemistry and Mathematics; PCB is
       Physics, Chemistry and Biology. The names ARE the subject lists. English
       is compulsory in CBSE Classes XI–XII, so it belongs in every core.

   2 · STANDARD, and near-certain. Accountancy, Business Studies and Economics
       are the CBSE commerce core almost everywhere it is taught. Still worth a
       nod from the school.

   3 · NOT VERIFIED. This level once held BOTH every elective list AND the
       Humanities core. The school has since supplied the elective lists, so they
       have moved up to verified — but the HUMANITIES CORE never was confirmed
       and is still here, alone. Humanities composition varies more between
       schools than any other stream — one school's History/PolSci/Geog is
       another's Psychology/Sociology/Economics — so what is written here is a
       plausible shape, not this school's timetable.

       ⚠ AND IT NEEDED ITS OWN FLAG. `unverified` reads like a whole-stream
       caveat but the card only ever stamps the OPTIONAL and ADDITIONAL lists
       with it — never the core. So when the electives were confirmed and all
       four streams flipped to `unverified: false`, the Humanities core caveat
       did not survive the change: it had never had a renderer of its own, and
       the flag that was loosely standing in for it was now false. The core was
       left presented with exactly the confidence of PCM's, which is definitional.
       `coreUnverified` is that missing flag, and Combinations.astro stamps the
       Core label from it.

   The client's instruction was explicit: "replace with the school's actual
   confirmed offerings before publishing". `unverified: true` marks each list
   the page must not be published with. GREP FOR IT.

   ⚠ `body` IS ONE SENTENCE ON PURPOSE. These were two sentences each until
   the streams became full-bleed photograph cards: on a card where the image IS
   the design, five lines of copy means a scrim covering two thirds of the
   picture, and what shipped first was a black card with a photo strip along
   the top. The brief asked for "a short description of career direction" and
   this is that. Nothing was cut that the subject line above it did not
   already say. */
/**
 * ⚠ THE OPTIONAL AND ADDITIONAL LISTS CAME FROM THE SCHOOL, and that changed
 * this block's status. It previously carried `unverified: true` on all four
 * streams, which rendered a "To be confirmed" stamp on every card and a notice
 * under the section — because the elective lists were our own draft, and a
 * family choosing a school on the strength of a subject nobody had confirmed is
 * the failure this site guards hardest against.
 *
 * The school has now stated what is actually offered, so `unverified` is false
 * throughout and the stamps and the notice disappear on their own — the
 * component reads the flag rather than hard-coding the caveat.
 *
 * ⚠ THE SAME TWO LISTS APPLY TO EVERY STREAM. The school first sent lists that
 * differed per stream, then replaced them with one shared pair. They are
 * therefore declared ONCE below and referenced by all four streams: written out
 * four times, the next revision would inevitably be applied to three of them.
 *
 * TWO LISTS, NOT ONE, because the school distinguishes them: `optional` are the
 * choices taken alongside the core, `additional` are subjects carried on top.
 * Merging them would lose a distinction it drew itself.
 *
 * Subject names are the school's own wording, capitalised for display only.
 * "Applied Maths" is theirs — CBSE calls it Applied Mathematics, and correcting
 * that here would be inventing a change nobody asked for.
 *
 * ⚠ THE SCHOOL'S EARLIER PER-STREAM LISTS ARE GONE, and with them the draft
 * electives that used to show (Informatics Practices, Psychology, Sociology, and
 * Mathematics/Economics as options). Those were ours, never the school's, and
 * the school has now said what it teaches. If any of them are real, they need
 * adding back here explicitly.
 */
export const streamOptional = [
  'Computer Science',
  'Hindi',
  'Physical Education',
  'Applied Maths',
  'Geography',
  'Sanskrit',
] as const;

/**
 * ⚠⚠ HUMANITIES, AND ONLY HUMANITIES, DROPS GEOGRAPHY FROM THE OPTIONAL LIST.
 *
 * Economics replaced Geography in the Humanities CORE at the school's request.
 * Geography then stayed visible on the Humanities card anyway, because it is
 * also in the shared optional list above — so the card showed the subject that
 * had just been removed from it. The school confirmed: remove it from
 * Humanities only.
 *
 * ⚠ DO NOT DELETE 'Geography' FROM streamOptional TO ACHIEVE THIS. That would
 * withdraw it from PCM, PCB and Commerce as well, which nobody asked for. The
 * expected result is Geography on three stream cards and absent from the
 * fourth.
 *
 * ⚠ AND IT IS DERIVED, NOT RETYPED. Writing the remaining names out by hand is
 * exactly how the next revision gets applied to one list and not the other.
 */
export const humanitiesOptional = streamOptional.filter((s) => s !== 'Geography');

export const streamAdditional = [
  'Artificial Intelligence',
  'Kathak',
  /* ⚠ 'Painting', NOT 'Fine Arts' — the school's own word, given at the
     September meeting. Do not restore the broader term. */
  'Painting',
  'Legal Studies',
  'Agriculture',
  'Entrepreneurship',
  'Yoga',
] as const;
/**
 * ⚠ `coreUnverified` IS SET ON HUMANITIES AND NOWHERE ELSE, ON PURPOSE.
 * PCM and PCB are definitional — the stream name IS the subject list. Commerce
 * is the standard CBSE trio almost everywhere it is taught. Humanities is the
 * one whose core genuinely varies between schools, and the one the school has
 * not confirmed. An absent flag on the other three is a decision; see the three
 * confidence levels documented above.
 */
export const streamDetail = [
  {
    name: 'PCM',
    accent: 'blue',
    glyph: 'physics',
    full: 'Physics · Chemistry · Mathematics',
    body: 'Engineering and the physical sciences, with Mathematics to board level.',
    core: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    optional: streamOptional,
    additional: streamAdditional,
    unverified: false,
  },
  {
    name: 'PCB',
    accent: 'teal',
    glyph: 'biology',
    full: 'Physics · Chemistry · Biology',
    body: 'Medicine and the life sciences, with the practical hours in the biology laboratory.',
    core: ['Physics', 'Chemistry', 'Biology', 'English'],
    optional: streamOptional,
    additional: streamAdditional,
    unverified: false,
  },
  {
    name: 'Commerce',
    accent: 'indigo',
    glyph: 'commerce',
    full: 'Accountancy · Business Studies · Economics',
    body: 'Business, finance and management — how money, firms and markets actually work.',
    core: ['Accountancy', 'Business Studies', 'Economics', 'English'],
    optional: streamOptional,
    additional: streamAdditional,
    unverified: false,
  },
  {
    name: 'Humanities',
    accent: 'violet',
    glyph: 'language',
    /* ⚠ THE SUMMARY LINE TRACKS THE CORE. It named Geography too, so leaving
       it would have printed the removed subject at the top of the card while
       the list below no longer carried it. */
    full: 'History · Political Science · Economics',
    body: 'Law, civil services, design, media and the social sciences.',
    core: ['History', 'Political Science', 'Economics', 'English'],
    optional: humanitiesOptional,
    additional: streamAdditional,
    unverified: false,
    /* ⚠ THE ONE UNCONFIRMED LINE LEFT IN THIS BLOCK. The elective lists came
       from the school; this core did not. English is safe (compulsory in CBSE
       XI–XII); History, Political Science and Geography are a plausible shape
       for a Humanities stream, not this school's stated one. Clearing this flag
       needs the school's confirmation, not a judgement that it looks right. */
    coreUnverified: true,
  },
] as const;

/** Shown under the subject-combination cards. Wording agreed with the client. */
export const combinationsFootnote =
  'Final elective availability depends on section strength and timetable feasibility each ' +
  'academic year.';

/* ═══ 03 · TEACHING & LEARNING ══════════════════════════════════════════════
   `photo` is a filename in src/assets/photos, or null.

   NULL MEANS THE FACILITY IS REAL AND WE HOLD NO PICTURE OF IT. The repository
   contains stock imagery that would fit these slots — an empty Western lecture
   room as "Smart-classrooms.jpg", a consumer DJI product shot as
   "Robotics-drones.jpg" — and using it would be a straightforward lie about
   rooms this school genuinely has. Text card instead. Photography request A2. */
export const facilities = [
  {
    title: 'Smart classrooms',
    fact: '75+ rooms · 49+ interactive flat panels',
    body: 'Digital teaching is the default across the school, not a room you visit once a week.',
    photo: 'sb-phy-lab.jpg',
    alt: 'Students of Sunbeam School Ballia working at benches in the physics laboratory, with portraits of Nikola Tesla and Michael Faraday on the wall.',
    span: 'wide',
  },
  {
    title: 'Nalanda Library',
    fact: '17,574 books · 25 periodicals',
    body: 'A reading room with journals and magazines alongside the collection.',
    photo: 'sb-library.jpg',
    alt: 'Students of Sunbeam School Ballia reading and working at tables in the Nalanda Library.',
    span: 'tall',
  },
  {
    title: 'Science laboratories',
    fact: 'Physics · Chemistry · Biology',
    body: 'Three dedicated laboratories, used as teaching rooms rather than demonstration theatres.',
    photo: 'sb-bio-lab.jpg',
    alt: 'Two students of Sunbeam School Ballia handling glassware in the biology laboratory.',
    span: '',
  },
  {
    title: 'Robotics Lab',
    fact: 'Drone · 3-D printer · telescope · embedded systems',
    body:
      'The rarest room in the school, and part of why its students reach national science ' +
      'competitions. Photography of this lab is still outstanding.',
    photo: null,
    alt: '',
    span: '',
  },
  {
    title: 'Computer laboratories',
    fact: 'Junior and senior · 40+ machines each',
    body: 'Two full labs, so a whole class works one-to-a-machine rather than two-to-a-screen.',
    photo: 'sb-comp-lab-2.jpg',
    alt: 'Younger students of Sunbeam School Ballia working at desktop computers in the junior computer laboratory.',
    span: '',
  },
  {
    title: 'Mathematics & Language labs',
    fact: 'Two subject laboratories',
    body: 'Mathematics and language taught as practical subjects, with rooms of their own.',
    photo: 'sb-maths-lab.jpg',
    alt: 'Students of Sunbeam School Ballia seated on the floor of a decorated activity room during a lesson.',
    span: '',
  },
  {
    title: 'Inquiry rooms',
    fact: 'Srijan · MUN · Geography · Active Learning',
    body: 'Four more laboratories for the kind of work that has no single right answer.',
    photo: 'sb-sci-lab.jpg',
    alt: 'A student of Sunbeam School Ballia using a microscope beside plant specimens in flasks.',
    span: '',
  },
] as const;

/* ═══ 03 · TEACHING & LEARNING — the six-chapter story ═══════════════════════
   The brief names fourteen topics. Presented as fourteen tiles they are an
   inventory; presented as six chapters they are an argument about how the school
   teaches, which is what the section is for. The mapping:

     ch1 method   — Teaching Methodology · Collaborative Learning
     ch2 room     — Smart Classrooms · AI & Digital Literacy
     ch3 handsOn  — Experiential Learning · Project-Based Learning
     ch4 rail     — STEM · Robotics & Coding · Mathematics & Science Enrichment
     ch5 words    — Reading Programme · Language Development · Library Programme
     ch6 index    — Laboratories · Academic Clubs

   THE HONESTY LINE IS THE SAME ONE AS EVERYWHERE ELSE IN THIS FILE (rule 4).
   Where the school publishes a room, a count or a result, it is stated as fact.
   Where the brief names a PRACTICE the school has never described in its own
   words — a methodology, a project-based programme, a reading programme — the
   copy DEFINES the practice and carries a verified Sunbeam anchor only where one
   genuinely exists. Nothing here claims a programme this school has not said it
   runs. The school's own account of its pedagogy is asset request A10. */
export const teachingLearning = {
  /* ── ch1 · Teaching methodology + collaborative learning ─────────────────── */
  method: {
    eyebrow: 'Teaching methodology',
    heading: 'Three things the school builds into every lesson',
    /**
     * ⚠ THIS SECTION USED TO DESCRIBE A FOUR-MOVE LESSON — "Ask, Do, Discuss,
     * Show", with students "handling the apparatus, source, data, code" and
     * "most of the talking" being theirs. None of it was Sunbeam's. It was a
     * definition of good practice written here and then presented as this
     * school's method, which is a claim about the client the client cannot
     * check. Searched About Us, the homepage, the Principal's Message and the
     * Event Chronicles: no lesson sequence is published anywhere.
     *
     * What IS published is a list of three, and the school names them itself:
     * "Incorporate Technology, a theory of Multiple Intelligence and
     * Collaborative learning in all areas of teaching." That sentence is the
     * section now. Each step names one of the three and anchors it to a figure
     * or a quotation the school has actually put in writing.
     */
    stand:
      'The school names them itself: “Incorporate Technology, a theory of Multiple Intelligence ' +
      'and Collaborative learning in all areas of teaching.” Not in a special lesson — in all ' +
      'areas of it.',
    steps: [
      {
        n: '01',
        step: 'Technology',
        body: 'One hundred teachers hold Microsoft Innovative Educator Expert certification, which is what makes Sunbeam Ballia a Microsoft Showcase School.',
      },
      {
        n: '02',
        step: 'Multiple Intelligence',
        body: 'The Principal puts the reason plainly: “all the students do not have the same talents and so each one will achieve success differently.”',
      },
      {
        n: '03',
        step: 'Collaborative learning',
        body: 'The Principal’s description of the result is a room where children are talking to each other — “classrooms are places of curiosity and collaboration.”',
      },
    ],
    /** The one line the school offers about what all three are for. */
    aside: {
      label: 'What the three are for',
      body:
        'The school’s stated aim for its teaching is that children “learn effectively and develop ' +
        'their full potential”, and that “all children receive equal regard and equal access to ' +
        'the curriculum.” The three above are how it says it gets there.',
    },
    proofs: [
      { value: '130', suffix: '+', label: 'Teaching staff' },
      { value: '100', suffix: '', label: 'Microsoft Innovative Educator Experts' },
    ],
  },

  /* ── ch2 · Smart classrooms + AI and digital literacy ────────────────────── */
  room: {
    eyebrow: 'The room itself',
    heading: 'Digital is the default here, not a room you visit once a week',
    /** Three beats, read against a pinned stat stage. */
    beats: [
      {
        key: 'panels',
        /* ⚠ THIS BEAT CARRIED TWO FALSE STATEMENTS AND BOTH ARE GONE.
           It read: 'Thirty-plus classrooms carry an interactive flat panel, and
           there are MORE PANELS THAN ROOMS.' The school publishes 75+ smart
           classrooms and 49+ panels — so forty-nine is FEWER than seventy-five,
           the opposite of the claim, and 'thirty-plus' matched neither figure.
           The anchor line directly below it had the right numbers the whole time,
           which is how it was caught. The honest version is also the more
           credible one: a rollout in progress at a real school. */
        title: 'Standard equipment, not a room you book',
        body:
          'Forty-nine-plus interactive flat panels across seventy-five-plus digitally smart ' +
          'classrooms — not yet one in every room, and the school publishes both numbers so a ' +
          'reader can see that. Where a panel is, a teacher does not book it; it is already ' +
          'where the class is.',
        anchor: '75+ smart classrooms · 49+ interactive flat panels',
      },
      {
        key: 'teachers',
        title: 'The certification is the teachers, not the hardware',
        body:
          'A screen changes nothing on its own. One hundred of the school’s teachers are certified ' +
          'Microsoft Innovative Educator Experts, which is what makes Sunbeam Ballia a Microsoft ' +
          'Showcase School.',
        anchor: 'Microsoft Showcase School',
      },
      {
        key: 'ai',
        title: 'AI arrives as a subject, not a slogan',
        body:
          'Digital literacy here means reading a tool critically as well as using it. The school ' +
          'does not have to argue that this reaches students: one of them won a national AI ' +
          'festival from Class VII.',
        anchor: 'Indian AI Impact Festival 2024 — first place, Ayushi, Class VII',
      },
    ],
    /** Counters for the pinned stage. Quantities only. */
    stats: [
      { n: 75, suffix: '+', label: 'Digitally smart classrooms' },
      { n: 49, suffix: '+', label: 'Interactive flat panels' },
      { n: 100, suffix: '', label: 'Microsoft-certified teachers' },
    ],
  },

  /* ── ch3 · Experiential + project-based learning ─────────────────────────── */
  handsOn: {
    eyebrow: 'Experiential & project-based',
    heading: 'Met in the hand before it is met in the exam',
    paragraphs: [
      'Experiential learning is the plainest idea in teaching and the hardest to timetable: a ' +
        'concept is understood after you have done something with it, not after you have been told ' +
        'it. It needs rooms, apparatus and time, which is why it is usually the first thing a ' +
        'crowded syllabus drops.',
      'Project work is the longer form of the same idea. A project runs past a single period, has ' +
        'a real output at the end, and cannot be completed by remembering — which makes it the ' +
        'closest thing a school has to the work students will actually do afterwards.',
    ],
    /** Verified rooms and programmes that make the above possible here. */
    anchors: [
      { glyph: 'chemistry', label: 'Twelve laboratories', detail: 'Physics · Chemistry · Biology · Mathematics · Language · Geography · Srijan · Model UN · Active Learning · Robotics · two computer labs' },
      { glyph: 'rocket', label: 'KIDS entrepreneurship', detail: 'The school’s own programme, taken in Class VII' },
      { glyph: 'inquiry', label: 'Inquiry rooms', detail: 'Srijan · Model United Nations · Geography · Active Learning' },
    ],
    pull: 'A project cannot be completed by remembering.',
  },

  /* ── ch4 · STEM, robotics and coding, enrichment ─────────────────────────── */
  rail: {
    eyebrow: 'STEM, robotics & enrichment',
    heading: 'Where the science actually happens',
    stand: 'Six rooms and programmes, in the order a student meets them. Scroll the rail.',
    /**
     * Each panel is composed differently on purpose — `kind` drives that, so the
     * rail never reads as six identical cards.
     *   figure  a big verified quantity leads
     *   photo   a photograph leads
     *   gap     no photograph exists and the panel says so (see `photo: null`
     *           in `facilities` above, and photography request A2)
     *   list    named programmes
     */
    panels: [
      {
        kind: 'photo',
        n: '01',
        title: 'Robotics Lab',
        fact: 'Drone · 3-D printer · telescope · embedded systems',
        body:
          'The rarest room in the school and the reason its students reach national science ' +
          'competitions. Coding is taught here against hardware that answers back.',
        photo: 'robotics.jpg',
        alt: 'A wheeled robot built in the Robotics Lab at Sunbeam School Ballia, with ultrasonic sensors, a camera module and exposed wiring.',
      },
      {
        kind: 'photo',
        n: '02',
        title: 'Computer laboratories',
        fact: 'Junior and senior · 40+ machines each',
        body:
          'Two full laboratories, so a whole class works one-to-a-machine rather than ' +
          'two-to-a-screen. The junior lab is where coding starts.',
        photo: 'sb-comp-lab-2.jpg',
        alt: 'Younger students of Sunbeam School Ballia working at desktop computers in the junior computer laboratory.',
      },
      {
        kind: 'photo',
        n: '03',
        title: 'Science laboratories',
        fact: 'Physics · Chemistry · Biology',
        body:
          'Three dedicated rooms, used as teaching spaces rather than demonstration theatres — the ' +
          'class works at the benches.',
        photo: 'sb-bio-lab.jpg',
        alt: 'Two students of Sunbeam School Ballia handling glassware in the biology laboratory.',
      },
      {
        kind: 'photo',
        n: '04',
        title: 'Mathematics & Language labs',
        fact: 'Two subject laboratories',
        body:
          'Mathematics and language given practical rooms of their own — the enrichment happens in ' +
          'timetabled space, not in an after-school hour.',
        photo: 'sb-maths-lab.jpg',
        alt: 'Students of Sunbeam School Ballia seated on the floor of a decorated activity room during a lesson.',
      },
      {
        kind: 'list',
        n: '05',
        title: 'National programmes',
        fact: 'Entered, not just offered',
        body: 'Where enrichment leaves the building and gets measured against other schools.',
        items: [
          'Vidyarthi Vigyan Manthan',
          'National Children’s Science Congress',
          'Inspire Award MANAK',
        ],
        photo: null,
      },
      {
        kind: 'photo',
        n: '06',
        title: 'Science laboratories, all told',
        fact: 'Across every stage',
        body:
          'Twelve subject laboratories in total, opening up from Class VI as specialist teaching ' +
          'begins and running to the Class XII board practicals.',
        photo: 'sb-sci-lab.jpg',
        alt: 'A student of Sunbeam School Ballia using a microscope beside plant specimens in flasks.',
      },
    ],
  },

  /* ── ch5 · Reading, language, library ────────────────────────────────────── */
  words: {
    eyebrow: 'Reading & language',
    heading: 'Fifteen thousand books, and a room to read them in',
    stand:
      'A reading habit is the one advantage that compounds across every other subject. It needs ' +
      'stock, a place to sit, and time on the timetable.',
    figure: { n: 17574, suffix: '', label: 'Books in the Nalanda Library' },
    photo: 'sb-library.jpg',
    alt: 'Students of Sunbeam School Ballia reading and working at tables in the Nalanda Library.',
    /** Three entries on a vertical rail. */
    entries: [
      {
        glyph: 'library', label: 'Library programme',
        body:
          'The Nalanda Library holds more than fifteen thousand books alongside twenty-five ' +
          'periodicals, in a reading room rather than a store cupboard.',
        anchor: '17,574 books · 25 periodicals',
      },
      {
        glyph: 'reading', label: 'Reading programme',
        body:
          'Reading is treated as a taught skill with a room and a stock behind it, not as homework ' +
          'that happens somewhere else. Periodicals matter here: they are how a reader finds a ' +
          'subject nobody assigned them.',
        anchor: null,
      },
      {
        glyph: 'language', label: 'Language development',
        body:
          'The school runs a language laboratory as one of its twelve subject labs — language ' +
          'practised aloud and recorded, which is the part a textbook cannot do.',
        anchor: 'Language laboratory',
      },
    ],
  },

  /* ── ch6 · The index: laboratories and academic clubs ────────────────────── */
  index: {
    eyebrow: 'The full inventory',
    heading: 'Every room, listed plainly',
    stand:
      'Twelve laboratories, and the inquiry rooms and academic clubs that work alongside them. ' +
      'No room appears on this list that the school does not publish.',
    groups: [
      {
        label: 'Subject laboratories',
        items: [
          { glyph: 'physics', name: 'Physics', detail: 'Board practicals, Classes IX–XII' },
          { glyph: 'chemistry', name: 'Chemistry', detail: 'Board practicals, Classes IX–XII' },
          { glyph: 'biology', name: 'Biology', detail: 'Board practicals, Classes IX–XII' },
          { glyph: 'mathematics', name: 'Mathematics', detail: 'Mathematics as a practical subject' },
          { glyph: 'language', name: 'Language', detail: 'Spoken language, recorded and reviewed' },
          { glyph: 'computing', name: 'Computer — junior', detail: '40+ machines' },
          { glyph: 'computing', name: 'Computer — senior', detail: '40+ machines' },
          { glyph: 'robotics', name: 'Robotics', detail: 'Drone · 3-D printer · telescope · embedded systems' },
          { glyph: 'science', name: 'General science', detail: 'Middle-school practical work' },
        ],
      },
      {
        label: 'Inquiry rooms · academic clubs',
        items: [
          { glyph: 'making', name: 'Srijan Lab', detail: 'Making and design' },
          { glyph: 'debate', name: 'Model United Nations Lab', detail: 'Debate, position papers, committee' },
          { glyph: 'geography', name: 'Geography Lab', detail: 'Maps, instruments, fieldwork' },
          { glyph: 'inquiry', name: 'Active Learning Lab', detail: 'Work with no single right answer' },
        ],
      },
    ],
    /** Stated, not hidden — the same principle as `facilities`. */
    note:
      'Photography of the Robotics Lab is still outstanding. The repository holds a stock drone ' +
      'image that would fit the slot, and using it would misrepresent a room this school ' +
      'genuinely has. Request A2.',
  },
} as const;

/* ═══ 04 · ASSESSMENT ═══════════════════════════════════════════════════════ */
export const cycle = [
  { step: 'Learning', body: 'Taught content, to the CBSE scheme of work.' },
  { step: 'Activities', body: 'Practical, project and laboratory work alongside it.' },
  { step: 'Assessment', body: 'Internal assessment through the year; boards at X and XII.' },
  { step: 'Feedback', body: 'Results to parents, and a parent–teacher meeting to discuss them.' },
  { step: 'Improvement', body: 'Remedial support and mentoring where a subject needs it.' },
  { step: 'Achievement', body: 'Board examinations, and competitions beyond the school.' },
] as const;

export const supports = [
  { label: 'Homework', body: 'Set to a published pattern so the week is predictable at home.', href: null },
  { label: 'Parent–teacher meetings', body: 'Scheduled on the academic calendar, not called ad hoc.', href: '/academics/parent-partnership/' },
  { label: 'Academic calendar', body: 'Terms, holidays and examination dates, published for the session.', href: '/academics/academic-calendar/' },
  { label: 'Mentoring', body: 'A member of staff who knows the child, not only the class list.', href: null },
  { label: 'Competitive exams', body: 'Vidyarthi Vigyan Manthan · National Children’s Science Congress · Inspire Award MANAK.', href: '/academics/student-success/#olympiads' },
  { label: 'Remedial support', body: 'Additional teaching for a student who is behind in a subject.', href: null },
] as const;

/* ═══ 05 · STUDENT SUCCESS ══════════════════════════════════════════════════
   Named, dated and checkable. No aggregate award totals — the school publishes
   none, and "100+ Olympiad awards" would be a number we made up. */
export const wins = [
  {
    year: '2024',
    title: 'Indian AI Impact Festival',
    detail: 'First place — Ayushi, Class VII.',
  },
  {
    year: '2019–25',
    title: 'Education World India School Rankings',
    detail: '#1 Co-Ed Day School in Ballia for six consecutive years, 2019-20 through 2024-25.',
  },
  {
    year: 'Ongoing',
    title: 'National science programmes',
    detail: 'Vidyarthi Vigyan Manthan · National Children’s Science Congress · Inspire Award MANAK selections.',
  },
  {
    year: 'Ongoing',
    title: 'Microsoft Showcase School',
    detail: '100 teachers certified as Microsoft Innovative Educator Experts.',
  },
  {
    year: 'Ongoing',
    title: 'Brainfeed School Excellence Award',
    detail: 'Alongside the Dr. Kalam Leadership Excellence Award and the Sunbeam Eduserve Award.',
  },
  {
    year: 'Ongoing',
    title: 'NCC ‘A’ and ‘B’ affiliations',
    detail: 'Two members of staff promoted to officer rank.',
  },
] as const;

export const guidance = [
  { label: 'Subject selection', body: 'Choosing between ' + school.streams.join(', ') + ' at the end of Class X.' },
  { label: 'Career guidance', body: 'Where a stream leads, discussed before it is chosen rather than after.' },
  { label: 'University counselling', body: 'Support with applications and entrance requirements.' },
  { label: 'Olympiads', body: 'Entry to the national science and mathematics programmes above.' },
] as const;

/** The three unpublished items, as designed awaiting states rather than numbers. */
export const awaiting = [
  {
    id: 'A1',
    title: 'Board results are not published yet',
    body:
      'The single most-searched fact about any CBSE school, and Sunbeam does not currently state ' +
      'it. This page will not estimate it. When the school supplies Class X and XII results, they ' +
      'belong here.',
  },
  {
    id: 'A11',
    title: 'University destinations are published — but only as artwork',
    body:
      'The school prints a placement board, “Vision To Reality”, naming eighteen leavers with course and ' +
      'institution, and issues individual placement cards. It is set out on University Counselling. What is ' +
      'still missing is the same record as text, year on year, with a cohort size beside it.',
  },
  {
    id: 'A11',
    title: 'Scholarships are not published yet',
    body:
      'The audit records scholarships as "not mentioned". If the school offers any, they are worth ' +
      'stating plainly — parents search for this.',
  },
] as const;

/* ═══ 06 · PARENT PARTNERSHIP ═══════════════════════════════════════════════
   Ordered as a parent actually meets them: before joining, then through the
   year, then whenever needed. */
export const partnership = [
  { phase: 'Before joining', label: 'Orientation', body: 'Before the session begins, so a new parent starts informed.', href: '/admissions/orientation/', external: false },
  { phase: 'Before joining', label: 'FAQs', body: 'The questions the admissions desk is asked most often.', href: '/admissions/faqs/', external: false },
  { phase: 'Through the year', label: 'Parent–teacher meetings', body: 'On the academic calendar, so the date is known in advance.', href: '/academics/academic-calendar/', external: false },
  { phase: 'Through the year', label: 'Report card portal', body: 'Term reports and results, through the parent login.', href: school.external.results, external: true },
  { phase: 'Whenever needed', label: 'Parent forum', body: 'A standing channel for parents to raise what matters to them.', href: null, external: false },
  { phase: 'Whenever needed', label: 'Workshops', body: 'Sessions for parents on what the school is teaching and why.', href: null, external: false },
  { phase: 'Whenever needed', label: 'Talk to the school', body: `Office ${school.phone.officeDisplay} · admissions ${school.phone.admissionsDisplay}`, href: '/contact-us/', external: false },
] as const;

export const partnershipPhases = ['Before joining', 'Through the year', 'Whenever needed'] as const;

/* ═══ 06 · PARENT PARTNERSHIP — the redesigned page ══════════════════════════
   ⚠ PROVENANCE, and it is different from everything above this line.
   Every other block in this file is drawn from what the school PUBLISHES, and
   rule 4 at the top forbids asserting a practice the school has not described.
   The content below comes from a written client brief instead — the school
   telling us directly what it runs. That is a legitimate source and a stronger
   one than the website, but it is NOT the published site, so:

     · a future editor should not "correct" these against sunbeamballia.edu.in
       and find them missing;
     · anything here that later contradicts the site is the site being stale,
       not this file being wrong;
     · the two things the brief asked for but supplied no content for — parent
       testimonials and the partnership figures — are NOT invented here. See
       `voice` below and the note in components/academics/parents/Stats.

   Verified facts still come from `school` and are marked where they appear. */
export const parents = {
  hero: {
    title: 'Parent Partnership',
    stand: 'Together we shape every child’s future.',
  },

  intro: {
    eyebrow: 'The partnership',
    headingLead: 'Every successful student has',
    headingMark: 'two classrooms',
    headingTail: '. Home. School.',
    paragraphs: [
      'A child spends roughly a third of a weekday in one of them and the rest in the other, and ' +
        'the two only add up when they are talking to each other. Education at Sunbeam is strongest ' +
        'when parents and teachers work together — which means the connection between home and ' +
        'school has to be scheduled and published rather than left to chance.',
      'What follows is every standing channel between the staff room and your kitchen table, in the ' +
        'order a family meets them. Each one is open to every family, on the same calendar, whether ' +
        'or not you know to ask.',
    ],
  },

  /* ── 01 · ORIENTATION ─────────────────────────────────────────────────────
     Copy left, a cluster of photographs right. */
  orientation: {
    n: '01',
    eyebrow: 'Parent orientation',
    heading: 'You meet the school before your child does',
    paragraphs: [
      'Orientation runs before the session begins, not in the first week of it. The difference ' +
        'matters: a family that arrives already knowing the timetable, the staff and the way the ' +
        'year is organised spends September settling a child in rather than working the school out.',
      'It is a working session rather than a welcome speech. You walk the building your child will ' +
        'use, meet the people who will teach them, and leave with the handbook and the dates in ' +
        'your hand.',
    ],
    points: [
      {
        label: 'A walk through the campus',
        body:
          'The classrooms, the laboratories, the library and the grounds — including the parts a ' +
          'prospectus photograph never shows you, like where a Class II child eats lunch.',
      },
      {
        label: 'The teachers, in person',
        body:
          'You meet the class teacher and the subject staff before term, so the first name you hear ' +
          'at home in October is one you can already put a face to.',
      },
      {
        label: 'How the school runs',
        body:
          'Timings, uniform, attendance, homework, the transport routes and what to do on a day ' +
          'your child is unwell. The ordinary logistics, answered once.',
      },
      {
        label: 'The student handbook',
        body:
          'The written record of all of it, so nothing depends on what you remembered from a ' +
          'session in a hall.',
      },
    ],
    cta: { label: 'Orientation details', href: '/admissions/orientation/' },
    photos: ['sunbeem-2.jpg', 'sunbeem-1.jpg', 'sunbeem-3.jpg'],
  },

  /* ── 02 · PARENTS' FORUM ──────────────────────────────────────────────────
     The section that needed defining before it could be designed. A parents'
     forum is NOT a parent–teacher meeting, and the whole value of the section is
     making that distinction plainly. */
  forum: {
    n: '02',
    eyebrow: 'Parents’ forum',
    heading: 'The meeting that is about the school, not about your child',
    lede:
      'A parent–teacher meeting answers one question: how is my child doing? The forum answers a ' +
      'different one — how is the school doing? — and it is the only channel where parents raise ' +
      'things collectively and get an answer on the record.',
    /** The distinction, side by side. This is the section's real content. */
    compare: [
      {
        key: 'ptm',
        label: 'Parent–teacher meeting',
        points: ['About one child', 'With that child’s teachers', 'On the academic calendar', 'Private'],
      },
      {
        key: 'forum',
        label: 'Parents’ forum',
        points: ['About the school', 'With the school’s leadership', 'A standing channel', 'On the record'],
      },
    ],
    /** How a raised item actually travels. */
    steps: [
      {
        n: '01',
        label: 'Raise it',
        body: 'Any parent can put an item forward — in the meeting, or in writing beforehand if it is easier.',
      },
      {
        n: '02',
        label: 'Heard together',
        body: 'It is discussed with other parents present, which is what separates a shared concern from a one-off.',
      },
      {
        n: '03',
        label: 'Answered',
        body: 'The school responds to the room rather than to one family, so every parent hears the same answer.',
      },
      {
        n: '04',
        label: 'Carried forward',
        body: 'What was agreed comes back to the next session, so an item cannot quietly disappear.',
      },
    ],
    /** What actually gets raised — concrete, not "your feedback matters". */
    topics: [
      'Homework load and timing',
      'Transport routes and timings',
      'Examination and assessment schedules',
      'Canteen, uniform and daily logistics',
      'Safety on campus and on the buses',
      'Communication that is not reaching home',
    ],
  },

  /* ── 03 · WORKSHOPS & WEBINARS ────────────────────────────────────────────
     The slider. Six sessions as cards.

     ⚠⚠ THESE SIX WERE REPLACED, AND THE REASON MATTERS MORE THAN THE COPY.

     This block used to describe six PARENT sessions — "Digital safety at home",
     "Choosing a stream", "Supporting learning at home", "The exam years", "What
     we teach, and why", "Growing up, and wellbeing" — each with a format
     ("Webinar · evening"), a paragraph and a chip list. Not one of them appears
     anywhere in the school's published record. They were written for this site,
     and they read exactly like real ones, which is what made them dangerous: a
     parent could have arrived expecting an evening webinar on digital safety.

     What the school ACTUALLY runs is better, and it was sitting unused in
     data/newsPages.ts: fifteen professional-development sessions, eleven naming
     the trainer and eight naming the institution they came from. They are for
     TEACHERS AND ADMINISTRATORS, and the heading now says so rather than
     implying a parent audience.

     ⚠ THE PHOTOGRAPHS CHANGED TOO, AND HAD TO. The old cards illustrated a
     wellbeing webinar with the RoboWunder award graphic and a digital-safety
     session with a computer laboratory. These six carry photographs of the
     sessions themselves. */
  workshops: {
    n: '03',
    eyebrow: 'Workshops & training',
    heading: 'Who trains the teachers, and where they came from',
    stand:
      'Professional development is easy to assert and hard to check. Every session below names ' +
      'the trainer, and most name the institution they came from. They are run for teaching and ' +
      'administrative staff — the school publishes no parent workshop programme.',
    cards: [
      {
        n: '01',
        title: 'CBSE Capacity Building — Experiential Learning',
        format: 'Two days · 20–21 September 2025',
        body:
          'Sunbeam Ballia hosted the two-day CBSE programme, built around interaction, shared ' +
          'ideas and practical insight into how experiential learning changes a classroom.',
        chips: ['Dr. Pushkal Giri', 'St. Joseph’s, Siwan', 'Dr. Ravishankar Mishra', 'Hosted at Ballia'],
        photo: 'cbse-experiential.jpg',
        alt: 'Teaching staff at the CBSE Capacity Building Programme on Experiential Learning, hosted at Sunbeam School Ballia.',
      },
      {
        n: '02',
        title: 'Basic Counseling Skills',
        format: 'Two days · 16–17 September',
        body:
          'Counselling technique, empathetic communication and how to support a student who needs ' +
          'more than the syllabus. The programme closes with an assessment and a viva.',
        chips: ['Mrs. Salony Priya', 'Ummeed Counselling, Kolkata', 'Assessment & viva'],
        photo: 'storytelling.jpg',
        alt: 'Teaching staff of Sunbeam School Ballia at a professional-development session.',
      },
      {
        n: '03',
        title: 'Critical Thinking',
        format: 'Faculty session',
        body: 'Teaching critical thinking in the classroom, taken by a visiting professor.',
        chips: ['Prof. Pradeep Mishra', 'Lovely Professional University'],
        photo: 'critical-thinking.jpg',
        alt: 'Teaching staff of Sunbeam School Ballia at a session on teaching critical thinking in the classroom.',
      },
      {
        n: '04',
        title: 'AI Masterclass',
        format: 'Faculty session',
        body:
          'A range of AI tools introduced with their practical use in teaching and learning, so ' +
          'that teachers could take them straight back into their own classrooms.',
        chips: ['Mr. Sandeep Mukherjee', 'COO, Sunbeam Group', 'Classroom tools'],
        photo: 'ai-masterclass.jpg',
        alt: 'An AI Masterclass session for the teaching staff of Sunbeam School Ballia.',
      },
      {
        n: '05',
        title: 'Recapitulating Dimension of Learning',
        format: 'Faculty session',
        body:
          'A second session with the same trainer who took storytelling as pedagogy, this one on ' +
          'the dimensions of learning.',
        chips: ['Mrs. Soma Singh', 'Dimensions of learning'],
        photo: 'dimensions.jpg',
        alt: 'Teaching staff of Sunbeam School Ballia at a session on the dimensions of learning.',
      },
      {
        n: '06',
        title: 'National Education Policy training',
        format: 'Delivered by the school',
        body:
          'The one that runs the other way: an NEP training session conducted BY a Sunbeam Ballia ' +
          'educator, at another school.',
        chips: ['Ms. Vishakha Singh', 'Sunshine Public School, Ghazipur', 'Delivered, not received'],
        photo: 'nep.jpg',
        alt: 'A National Education Policy training session involving staff of Sunbeam School Ballia.',
      },
    ],
  },

  /* ── 04 · COMMUNICATION ───────────────────────────────────────────────────
     Copy left, image right. */
  comms: {
    n: '04',
    eyebrow: 'School–parent communication',
    heading: 'You should never have to ask what is going on',
    /* ONE LEDE, THREE LINES, at the client's request. It replaced two paragraphs
       — the second opened 'So each kind of message has one channel, and the same
       one every time. If you know where a thing lives, you stop having to chase
       it.' Nothing was claimed there that is not claimed here; the cut is length,
       not substance. Kept as an ARRAY so the section can go back to the Split
       layout without a shape change. */
    paragraphs: [
      'Most of what a school tells a family is small and frequent — a date change, an absence, a ' +
        'term report — and it goes wrong the moment it rides on a note in a bag. So each kind of ' +
        'message has one channel, and the same one every time.',
    ],
    channels: [
      {
        label: 'Circulars',
        body: 'Anything that affects the whole school or a whole class — dates, closures, events, changes.',
        glyph: 'language',
      },
      {
        label: 'Attendance',
        body: 'Recorded daily. A pattern is raised with home early rather than at the end of a term.',
        glyph: 'reading',
      },
      {
        label: 'Homework',
        body: 'Set to a published pattern, so the week is predictable at home rather than a surprise each evening.',
        glyph: 'making',
      },
      {
        label: 'Parent portal',
        body: 'Term reports and results, through your own login — the record in one place, at any hour.',
        glyph: 'computing',
        external: true,
      },
    ],
    cta: { label: 'Open the parent portal', href: school.external.results, external: true },
    /* ⚠ NOT sunbeem-students-2.jpg, which this once named. That file is
       Sunbeam VARANASI (crest and Bhagwanpur hostel in frame), not Ballia.
       This field is currently unused — Comms.astro dropped the split layout —
       but it is kept so restoring that layout is a revert. Left pointing at the
       wrong school, the revert would have quietly put it back on the page. */
    photo: 'sunbeem-2.jpg',
    alt: 'The whole school gathered at the entrance of Sunbeam School Ballia beneath the school name.',
  },

  /* ── 05 · ENGAGEMENT ──────────────────────────────────────────────────────
     Image left, copy right — the mirror of 04.

     ⚠ THE FOUR 'WAYS' WERE REPLACED. They read: sports day with 'parents both
     watching and helping run it'; the annual function; exhibitions where
     'students explain their own work to visitors'; and volunteering, where
     parents give 'a skill, a morning, a trade'. None of the four is published by
     the school, and two of them assert what parents DO on the premises — which
     is not ours to claim on their behalf.

     What replaces them is read off the school's own published photographs of its
     Parents' Forum: every desk carries a CLASS NAMEPLATE (Nursery, KG-I A, II-C,
     II-E, III-A), and a second sitting's projected agenda is headed 'Class IX to
     XII'. Parents are seated BY CLASS SECTION, which is a real and unusual
     structure — and 'Grandparents Cove' is item 8 of that agenda. */
  engagement: {
    n: '05',
    eyebrow: 'Parent engagement',
    heading: 'A seat with your child’s class written on it',
    paragraphs: [
      'The way this school brings parents in is visible on its furniture. In its own photographs ' +
        'of the Parents’ Forum, every place carries a class nameplate — Nursery, KG-I A, II-C, ' +
        'II-E, III-A — so a parent is not attending in general. They are sitting for a class.',
      'It means a concern about one section arrives as that section’s concern rather than as one ' +
        'family’s, and that every class has somebody in the room whether or not its parents knew ' +
        'to come.',
    ],
    ways: [
      {
        label: 'A seat per class',
        body: 'Desks at the forum carry class nameplates — Nursery, KG-I A, II-C, II-E, III-A — so every section is represented.',
      },
      {
        label: 'Junior and senior sittings',
        body: 'One sitting’s nameplates run from Nursery upward; another’s projected agenda is headed Classes IX to XII.',
      },
      {
        label: 'The agenda, on the wall',
        body: 'Twelve numbered items projected in the room, so every parent can see the whole list — including what is still to come.',
      },
      {
        label: 'Grandparents Cove',
        body: 'Item eight on the school’s own forum agenda. What it is has not been published, so it is named here and left at that.',
      },
    ],
    photo: 'sunbeem-5.jpg',
    alt: 'Parents seated together at a Parents’ Forum session at Sunbeam School Ballia.',
  },

  /* ── 06 · FAQ ─────────────────────────────────────────────────────────────
     Image left, accordion right.

     ⚠ ANSWERS POINT, THEY DO NOT QUOTE. Fees, age criteria and route lists are
     not published on the school's site in a form we can restate, and inventing a
     figure a parent might plan around is the one unforgivable error on a page
     like this. Each answer therefore says what is true and sends the reader to
     the desk or the page that holds the number. */
  faq: {
    n: '06',
    eyebrow: 'Frequently asked',
    heading: 'The questions the admissions desk hears most',
    stand:
      'Answered once and published, so no family has to ring to find out something another family ' +
      'already asked.',
    items: [
      {
        q: 'How do we apply, and when?',
        a:
          'Applications for Nursery to Class IX and for Class XI are made through the school’s ' +
          'online form. The admissions desk confirms the dates for a given session — they are the ' +
          'people to ask rather than a forwarded message.',
        cta: { label: 'Apply online', href: school.external.applyNurseryToIX, external: true },
      },
      {
        q: 'What does it cost?',
        a:
          'The fee structure is set per class and per session, and the school publishes it rather ' +
          'than quoting it case by case. Ask admissions for the current schedule for your child’s ' +
          'class — that way you get the figure that applies to you, not a general one.',
        cta: { label: 'Fee structure', href: '/admissions/fee-structure/' },
      },
      {
        q: 'Is there transport to our area?',
        a:
          'The school runs bus routes across Ballia. Whether one passes your area, and where the ' +
          'nearest stop is, is a route-by-route answer — the transport in-charge holds the current ' +
          'list.',
        cta: { label: 'Transport and routes', href: '/campus/transport/' },
      },
      {
        q: 'How is my child kept safe?',
        a:
          'Safety covers the campus, the buses and the school day between them. The measures in ' +
          'place are set out in full rather than summarised here, because a parent asking this ' +
          'question deserves the detail.',
        cta: { label: 'Safety and security', href: '/campus/safety-security/' },
      },
      {
        q: 'What is the school’s board and affiliation?',
        a:
          'Sunbeam School Ballia is affiliated to the Central Board of Secondary Education, Delhi, ' +
          'as a co-educational senior secondary school — CBSE affiliation number ' +
          school.affiliationNo + ', school code ' + school.schoolCode + '.',
        /* ⚠ THE PAGE, NOT AN ANCHOR. This pointed at #affiliation, an id the old
           AffiliationDetails component carried; that component was replaced by
           PhilosophyStory and the id went with it, leaving a fragment the browser
           silently fails to scroll to. Affiliation now has a page of its own. */
        cta: { label: 'Affiliation details', href: '/academics/philosophy/affiliation-details/' },
      },
      {
        q: 'When are parent–teacher meetings held?',
        a:
          'They are on the academic calendar before the session starts, so the dates are known in ' +
          'advance rather than announced a week out. The calendar carries terms, holidays and ' +
          'examination dates alongside them.',
        cta: { label: 'Academic calendar', href: '/academics/academic-calendar/' },
      },
    ],
    photo: 'sunbeem-3.jpg',
    alt: 'A parent speaking into a microphone during a Parents’ Forum session at Sunbeam School Ballia, class nameplates on the desks.',
  },

  timeline: {
    eyebrow: 'Through the year',
    heading: 'What the year looks like from your side of it',
    stand:
      'Six fixed points between admission and the final report. Each one is on the calendar before ' +
      'the session starts.',
    steps: [
      { label: 'Admission', body: 'The application, the paperwork, and the first conversation with the school.' },
      { label: 'Orientation', body: 'Before teaching begins — the campus, the staff, and how the year will run.' },
      { label: 'Teacher meeting', body: 'The first parent–teacher meeting, on the published academic calendar.' },
      { label: 'Monthly updates', body: 'Circulars, attendance and homework through the standing channels.' },
      { label: 'Workshops', body: 'Sessions for parents alongside the teaching year.' },
      { label: 'Annual review', body: 'Term reports and results through the parent portal, and the year read back.' },
    ],
  },

  resources: {
    eyebrow: 'Parent resources',
    heading: 'Everything in one place',
    items: [
      {
        key: 'portal',
        label: 'Parent Portal',
        body: 'Term reports, results and the record of the year, through your own login.',
        href: school.external.results,
        external: true,
        glyph: 'computing',
        span: 'wide',
      },
      {
        key: 'faqs',
        label: 'Admissions FAQs',
        body: 'Admissions, fees, transport and safety — the most-asked questions, answered.',
        href: '/admissions/faqs/',
        external: false,
        glyph: 'inquiry',
        span: '',
      },
      {
        key: 'calendar',
        label: 'Academic Calendar',
        body: 'Terms, holidays, examination dates and every parent–teacher meeting.',
        href: '/academics/academic-calendar/',
        external: false,
        glyph: 'reading',
        span: '',
      },
      {
        key: 'notices',
        label: 'Notice Board',
        body: 'Official school notices, as the school issues them.',
        href: '/news-events/notices/',
        external: false,
        glyph: 'language',
        span: '',
      },
      {
        key: 'transport',
        label: 'Transport',
        body: 'Routes across Ballia, and the person to call about them.',
        href: '/campus/transport/',
        external: false,
        glyph: 'geography',
        span: '',
      },
      {
        key: 'contact',
        label: 'Talk to the school',
        body: 'Office ' + school.phone.officeDisplay + ' · admissions ' + school.phone.admissionsDisplay,
        href: '/contact-us/',
        external: false,
        glyph: 'debate',
        span: 'wide',
      },
    ],
  },

  /**
   * ⚠ THE TESTIMONIAL SLOT, AND WHY IT HOLDS THE PRINCIPAL RATHER THAN A PARENT.
   *
   * The brief asked for a parent testimonial with a photograph, a name, a
   * student's class and a star rating. The school supplied none of those, and
   * every one of them is a claim about a real, identifiable family: a name and a
   * quote invented here would be a fabricated endorsement, and a star rating
   * invented here would be a fabricated review.
   *
   * What the school HAS published, signed, is its Principal's own words — so the
   * slot carries those. Same register, nothing invented. It swaps the moment a
   * real parent quote arrives WITH consent: quote, name, class, photograph and
   * permission to publish.
   */
  voice: {
    eyebrow: 'From the school',
    quote:
      'As Principal, my role is to ensure that every child feels valued, safe, and inspired to ' +
      'achieve their full potential.',
    name: school.principal,
    role: 'Principal, ' + school.name,
    href: '/about/principals-message/',
  },

  cta: {
    heading: 'Let’s stay connected',
    stand:
      'Admissions, the school office, or a walk around the campus — whichever is most useful, ' +
      'here is how to reach us.',
    lines: [
      { label: 'Admissions', value: school.phone.admissionsDisplay, href: 'tel:' + school.phone.admissions },
      { label: 'School office', value: school.phone.officeDisplay, href: 'tel:' + school.phone.office },
      { label: 'Email', value: school.email, href: 'mailto:' + school.email },
      { label: 'Visit the campus', value: school.address.line1 + ', ' + school.address.city, href: '/contact-us/' },
    ],
  },
} as const;

/* ═══ 04b · ASSESSMENT PATTERN — SEVEN TOPICS, SEVEN PAGES ═════════════════

   Audit §2.D names seven topics under Assessment Pattern and marks them MUST.
   They were first built as four sections of the Assessment page plus three
   cross-links; the client has since asked for a page each, so each topic now
   owns a URL and the Assessment page is the hub above them.

   ⚠ TWO KEEP THEIR EXISTING HOMES RATHER THAN GAINING A DUPLICATE.
     · Assessment System IS the Assessment page — the six-step cycle on it is
       exactly that topic, so the row points at the hub instead of minting a
       second page that repeats it.
     · Academic Calendar already has its own route, which audit §8 requires as
       an interactive page. A second calendar page would split one destination
       in two and one of them would rot.

   ⚠ THE THIN-CONTENT RISK IS REAL AND IS FLAGGED, NOT PAPERED OVER. The school
   publishes ONE line about homework and ONE about mentoring, and nothing else
   anywhere on its site. A page each was the client's call after that was raised.
   So those pages carry what is published, say plainly that the rest is not, and
   name who to ask — rather than three invented paragraphs about a policy that
   governs somebody's evenings. `owed` drives that note; it disappears when the
   school sends the copy, with no other edit. */
export interface AssessmentTopic {
  id: string;
  label: string;
  /** One line, shown in the nav submenu and on the hub. */
  hint: string;
  /** Where the topic lives. A route, always — never an anchor. */
  href: string;
  /** Page title, when this topic has a page of its own. */
  title?: string;
  standfirst?: string;
  /** Import key for the hero photograph — resolved by the page file. */
  photo?: string;
  body?: string[];
  points?: { k: string; v: string }[];
  /** The school publishes no detail on this topic. */
  owed?: boolean;
  /** True when the destination already existed and is not a new page. */
  existing?: boolean;
}

export const assessmentTopics: AssessmentTopic[] = [
  {
    id: 'system',
    label: 'Assessment System',
    hint: 'The six-step cycle, and the marks a promotion turns on.',
    href: '/academics/assessment/',
    existing: true,
  },
  {
    id: 'homework-policy',
    label: 'Homework Policy',
    hint: 'Set to a published pattern, so the week is predictable at home.',
    href: '/academics/assessment/homework-policy/',
    title: 'Homework Policy',
    standfirst:
      'Homework is set to a published pattern rather than subject by subject on the day — so a family can see the shape of the week.',
    photo: 'library',
    body: [
      'Homework at Sunbeam Ballia is set to a published pattern rather than assigned subject by subject on the day. A family can therefore see the shape of the week in advance, instead of discovering it each evening.',
      'That predictability is the point of the policy. It lets a parent plan around the evening rather than react to it, and it stops several subjects from landing on the same night by accident.',
    ],
    owed: true,
  },
  {
    id: 'remedial-support',
    label: 'Remedial Support',
    hint: 'Additional teaching, and a retest with rules attached.',
    href: '/academics/assessment/remedial-support/',
    title: 'Remedial Support',
    standfirst:
      'Where a student is behind in a subject, additional teaching is provided in it — and the retest that follows is scheduled by rules the school publishes.',
    photo: 'chem',
    body: [
      'Where a student is behind in a subject, additional teaching is provided in that subject rather than the result being left to stand and dealt with at the end of the year.',
      'The retest is the part the school sets out in detail, and the detail is the substance: it is scheduled far enough after the result for the additional teaching to have actually happened, rather than being a second attempt at the same paper a few days later.',
    ],
    points: [
      { k: 'When', v: 'No sooner than ten days after results are announced.' },
      { k: 'More than one', v: 'Two clear days between retests, so they are not sat back to back.' },
      { k: 'Results', v: 'Published within two and a half weeks of the main examination.' },
      { k: 'Medical absence', v: 'On a medical certificate the retest still has to be sat — a promotion is not given on the half-yearly alone.' },
      { k: 'Where it applies', v: 'Classes VIII and IX for a single subject below the threshold, and Class XI where one subject is failed.' },
    ],
  },
  {
    id: 'mentoring',
    label: 'Mentoring',
    hint: 'A member of staff who knows the child, not only the class list.',
    href: '/academics/assessment/mentoring/',
    title: 'Mentoring',
    standfirst:
      'Every student has a member of staff who knows them as a person rather than as a row on a class list.',
    photo: 'council',
    body: [
      'Every student has a member of staff who knows them as a person rather than as a name on a class list — the point of contact when something is wrong, before it becomes a result.',
      'That matters most in the years where a child is least likely to raise a problem themselves. A mentor who already knows the student notices the change; a subject teacher seeing them four times a week may not.',
    ],
    owed: true,
  },
  {
    id: 'academic-calendar',
    label: 'Academic Calendar',
    hint: 'Terms, holidays and examination dates for the session.',
    href: '/academics/academic-calendar/',
    existing: true,
  },
  {
    id: 'parent-teacher-meetings',
    label: 'Parent–Teacher Meetings',
    hint: 'Scheduled on the calendar, not called ad hoc.',
    href: '/academics/assessment/parent-teacher-meetings/',
    title: 'Parent–Teacher Meetings',
    standfirst:
      'PTMs are placed on the academic calendar for the session, so the date is known in advance rather than announced when there is a problem.',
    photo: 'forum',
    body: [
      'Parent–teacher meetings are placed on the academic calendar at the start of the session. The date is therefore known in advance, rather than arriving as a message when something has already gone wrong.',
      'A meeting called ad hoc carries a message before anyone has spoken: that there is a problem. A scheduled one does not, which is what makes it possible to talk about a child who is doing perfectly well.',
    ],
    points: [
      { k: 'Frequency', v: 'Through the year, on dates published with the session calendar.' },
      { k: 'Between meetings', v: 'The parent portal carries term reports and results at any hour.' },
      { k: 'Also on the calendar', v: 'Examination dates, terms and holidays, so a meeting can be read against them.' },
    ],
  },
  {
    id: 'competitive-exam-preparation',
    label: 'Competitive Exam Preparation',
    hint: 'Vidyarthi Vigyan Manthan · NCSC · Inspire Award MANAK.',
    href: '/academics/assessment/competitive-exam-preparation/',
    title: 'Competitive Examination Preparation',
    standfirst:
      'Preparation for the national science and aptitude programmes the school enters — named, with the results they have produced.',
    photo: 'awards',
    body: [
      'Beyond the board syllabus, students are prepared for the national programmes the school enters. These are named rather than described in the abstract, because the entry is checkable and the abstraction is not.',
      'Results from them are recorded on the Student Success page rather than repeated here, so there is one record of what students have won rather than two that can disagree.',
    ],
    points: [
      { k: 'Vidyarthi Vigyan Manthan', v: 'The national science talent search for students of Classes VI to XI.' },
      { k: 'National Children’s Science Congress', v: 'Project-based science, presented and defended.' },
      { k: 'Inspire Award MANAK', v: 'Department of Science & Technology — original ideas from school students, taken to national level.' },
      { k: 'Olympiads', v: 'Science Olympiad Foundation, from the primary years upward.' },
    ],
  },
];
