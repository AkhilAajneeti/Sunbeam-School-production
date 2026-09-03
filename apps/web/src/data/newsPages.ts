import type { ImageMetadata } from 'astro';
/**
 * NEWS & EVENTS — THE FOUR SUB-PAGES.
 *
 * ═══ WHERE EVERY LINE COMES FROM ═══════════════════════════════════════════
 *
 * Read off the school's own pages — `/workshops/`, `/event-chronicles/`,
 * `/school-activities/` and `/press-release/` — and nothing else. Names of
 * guests, institutions, dates, positions and scores are all as the school
 * published them.
 *
 * ⚠ NOTHING IS INFERRED. Where the school gives a date, it is here; where it
 * does not, the field is simply absent rather than estimated. Several items
 * carry a year and no day, and that is how they appear.
 *
 * ⚠ WHY THIS IS NOT THE WHOLE ARCHIVE. Their School Activities page alone runs
 * to 148 headings and 4,536 images on one URL. The brief was to take the
 * RELEVANT content, not everything, so what is dropped is: social-media
 * captions used as headings ("Dear viewers", "An Enriching Experience"), items
 * already covered better elsewhere on this site (sport belongs on Sports,
 * excursions have their own page, alumni have their own section), and the
 * duplicate `event-chronicles-main`.
 *
 * ⚠ THE FIFTH AND SIXTH CATEGORIES ARE NOT HERE, deliberately:
 *   · Recent achievements — /beyond-academics/achievements/ already exists and
 *     the client asked for it left alone. A second achievements page would
 *     split one story across two URLs and one of them would rot.
 *   · Important announcements — the school's own /notice/ and /admission-notice/
 *     pages are EMPTY. There is no content to build from. It stays a section on
 *     the News & Events index until assets A7 and C7 land.
 *
 * ⚠ AND ONE FIND THAT BELONGS SOMEWHERE ELSE. `/press-release/` publishes the
 * CBSE board results — 100% at X and XII, Rishikant 98.4% and district topper,
 * Sarvakritika district topper, Jahnavi and Aditya Singh 94.2% at XII. docs/01
 * records board results as the single largest content gap on the site and
 * docs/07 lists them as blocking asset A1. They are not missing; they are
 * buried. They belong on Student Success (audit 2.E5), not here.
 */

export interface ChronicleItem {
  title: string;
  /**
   * ⚠ TYPED, NOT DERIVED FROM THE TITLE. A slug generated from the heading
   * changes the moment the heading is edited, and every link to that page —
   * including any a parent has bookmarked or the school has shared — breaks
   * silently. Written down, the URL survives a rewording.
   *
   * Only workshops carry one: they are the items with a detail page behind
   * them. An item without a slug renders as a card that does not open.
   */
  slug?: string;
  /** Who led it, who won it, or where it was — never a guess. */
  meta: string;
  body: string;
  /** A published result or outcome, printed as the item's receipt. */
  result?: string;
  /** Session or date, exactly as the school states it. Absent if unstated. */
  when?: string;
  /**
   * Folder under src/assets/workshops/ holding this session's photographs.
   * Absent until the school supplies them — see data/workshopPhotos.ts.
   */
  photoDir?: string;
  /**
   * Filenames inside `photoDir` to leave out — for when a supplied folder
   * contains a picture of a different event. Named rather than deleted: the
   * file stays where the client put it, and the exclusion is visible and
   * reversible in one line.
   */
  photoSkip?: string[];
  /**
   * A ready ImageMetadata for the card face, used INSTEAD of resolving a folder.
   *
   * ⚠ THIS EXISTS FOR THE AWARD GRAPHICS. Workshop and activity cards resolve
   * their picture from `photoDir` through the assets glob; the three major
   * achievements are single designed posters already imported by
   * data/achievements.ts, with no folder to point at.
   */
  art?: ImageMetadata;
  /**
   * How the card face treats that picture. Defaults to 'cover'.
   *
   * ⚠ 'contain' IS NOT A PREFERENCE, IT IS A CORRECTION. The award graphics are
   * designed posters — each carries its own headline, crest and framed photo.
   * Cover-cropping one into a landscape card slices the headline off, which is
   * the exact fault recorded in the header of Majors.astro: an earlier build
   * used a poster as a full-bleed background and lost the words on it.
   */
  fit?: 'cover' | 'contain';
  /**
   * An explicit destination, used INSTEAD of `base + slug`.
   *
   * ⚠ FOR CARDS THAT POINT AT A SECTION OF ANOTHER PAGE. The achievements cards
   * open the full record at /beyond-academics/achievements/#<id>; composed from
   * a slug that would have produced '…/#robowunder/', which is not a route.
   */
  href?: string;
}

export interface ChronicleGroup {
  id: string;
  label: string;
  note: string;
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

/* ═══ 1 · WORKSHOPS ═══════════════════════════════════════════════════════ */

export const workshops: ChroniclePage = {
  slug: 'workshops',
  title: 'Workshops',
  standfirst:
    'Fifteen sessions run for the people who teach — counselling, pedagogy, AI in the classroom and the CBSE capacity-building programme.',
  eyebrow: 'Workshops',
  /* ⚠ THIS HEADING AND STANDFIRST WERE REWRITTEN BECAUSE THE OLD PAIR CLAIMED
     MORE THAN THE PAGE DELIVERS. They read "The school trains its teachers in
     public / …names the trainer, the institution and the date". Counted against
     the data: 11 of 14 sessions name a person, 8 name an institution, and only
     4 carry a date. A page that opens by promising all three and then breaks the
     promise ten times is worse than one that opens modestly.

     What replaces it is the same argument made in numbers that are true, and
     those numbers are COUNTED AT BUILD TIME on the index page rather than typed
     here — so they cannot drift as sessions are added. */
  heading: 'Who trains the teachers, and where they came from',
  stand:
    'Professional development is easy to assert and hard to check. Every session below carries whatever the school has actually published about it — the trainer where they are named, the institution where it is stated, the date where there is one. Nothing is filled in for the sake of a tidy page.',
  groups: [
    {
      id: 'teaching',
      label: 'Teaching practice',
      note: 'Pedagogy, classroom method and subject teaching.',
      items: [
        {
          title: 'CBSE Capacity Building Programme on Experiential Learning',
          slug: 'cbse-experiential-learning',
          meta: 'Dr. Pushkal Giri, Principal, St. Joseph’s School, Siwan · Dr. Ravishankar Mishra, Vice Principal, Heritage International Public School, Kushinagar',
          body:
            'Sunbeam School Ballia hosted the two-day CBSE Capacity Building Programme on Experiential Learning. Sessions were conducted by Dr. Pushkal Giri, Principal of St. Joseph’s School, Siwan, Bihar, and Dr. Ravishankar Mishra, Vice Principal of Heritage International Public School, Kushinagar — built around interaction, shared ideas and practical insight into how experiential learning changes a classroom.',
          when: '20–21 September 2025',
        },
        {
          title: 'Embracing Innovation and Change in the English Classroom',
          slug: 'innovation-english-classroom',
          meta: 'Ms. Lakshmi Prakash · Hotel Ballians',
          body:
            'The school took part in a professional development training titled “Embracing Innovation and Change in the English Classroom for Better Outcomes”, held at Hotel Ballians and led by Ms. Lakshmi Prakash. The Principal, the Dean Academics and educators attended. The session focused on innovative teaching practices to lift student engagement and learning outcomes.',
          when: '20 December 2025',
        },
        {
          title: 'Storytelling as Pedagogy, and Teaching Science',
          slug: 'storytelling-as-pedagogy',
          photoDir: 'Storytelling-Pedagogy',
          meta: 'Ms. Soma Singh',
          body: 'Storytelling as a teaching method, and science instruction for the middle and secondary grades.',
        },
        {
          title: 'Recapitulating Dimension of Learning',
          slug: 'dimensions-of-learning',
          photoDir: 'Recapitulating-Dimension-of-Learning2',
          meta: 'Mrs. Soma Singh',
          body: 'A second session with the same trainer, on the dimensions of learning.',
        },
        {
          title: 'Critical Thinking',
          slug: 'critical-thinking',
          photoDir: 'CriticalThinking',
          meta: 'Prof. Pradeep Mishra, Lovely Professional University',
          body: 'Teaching critical thinking in the classroom.',
        },
        {
          title: 'Science and Innovation',
          slug: 'science-and-innovation',
          meta: 'Faculty workshop',
          body: 'A workshop on science teaching and innovation.',
          photoDir: 'science&innovation',
        },
        {
          /* ⚠ THIS ONE WAS DROPPED ONCE AND HAS BEEN PUT BACK. It was left out
             because QCT/CIC is an unexplained acronym with no named trainer and
             no date — but the school lists it, the standing instruction is that
             this site mirrors their page, and omitting it made the hero's
             "Fourteen sessions" disagree with the thirteen cards below it.

             The body says exactly what is knowable and no more. Guessing at the
             expansion of an acronym on a page whose whole argument is "we name
             the trainer and the institution" would undercut the page. */
          title: 'QCT/CIC workshop session',
          slug: 'qct-cic',
          photoDir: 'QCT-CIC2',
          /* Two files in that folder are student science-competition results, not
             this workshop — see the note on photosFor(). */
          photoSkip: ['QCT-CIC1', 'QCT-CIC3'],
          meta: 'Faculty workshop',
          body: 'Listed by the school as a workshop session on QCT/CIC. No trainer, date or expansion of the acronym is published alongside it.',
        },
      ],
    },
    {
      id: 'counselling',
      label: 'Counselling & wellbeing',
      note: 'Training in supporting students beyond the syllabus.',
      items: [
        {
          title: 'Basic Counseling Skills — two-day training',
          slug: 'basic-counselling-skills',
          meta: 'Mrs. Salony Priya',
          body:
            'Mrs. Salony Priya led a two-day session on Basic Counseling Skills for teaching staff. Teachers took an active part throughout, working on counselling technique, empathetic communication and how to support a student who needs more than the syllabus.',
          when: '16–17 September',
        },
        {
          title: 'Basic Counseling Skills — final assessment and viva',
          slug: 'basic-counselling-skills-viva',
          meta: 'Mrs. Saloni Priya, Founder Director, Ummeed Counselling & Consulting Services, Kolkata',
          body: 'The assessment that closes the counselling programme — counselling psychology and empowerment for educators.',
        },
        {
          title: 'Teacher–Student Bond: from teaching to mentorship',
          slug: 'teacher-student-bond',
          meta: 'Mr. Kartik Bajoria',
          body:
            'Mr. Kartik Bajoria conducted a session for teachers on “Teacher–Student Bond: Teaching to Mentorship”. It focused on building stronger teacher–student connections — trust, empathy, and guiding students beyond academics.',
        },
      ],
    },
    {
      id: 'leadership',
      label: 'Leadership & policy',
      note: 'Where the school’s leadership goes to learn.',
      items: [
        {
          title: 'AI Masterclass',
          slug: 'ai-masterclass',
          meta: 'Mr. Sandeep Mukherjee, Chief Operating Officer, Sunbeam Group of Educational Institutions',
          body:
            'Mr. Sandeep Mukherjee, Chief Operating Officer of the Sunbeam Group of Educational Institutions, conducted an AI Masterclass for teaching staff. He introduced a range of AI tools and explained their practical use in teaching and learning, so that teachers could take them back into their own classrooms.',
        },
        {
          title: '16th Eduexcellence Annual International Conference — EduCarnival 2025',
          slug: 'educarnival-2025',
          meta: 'IIT Delhi',
          body: 'A two-day conference on emerging trends, innovation and global best practice in education. Attended by Dr. Kunwar Arun Singh, Director; Mr. Pankaj Singh, Senior Academic Head; Mr. Jai Prakash Yadav, Middle Academic Head; and Mr. Prashant Upadhyay, Primary Academic Head.',
          when: '2025',
        },
        /* ⚠ ONE ENTRY BECAME TWO, BECAUSE THE SCHOOL RUNS TWO. Their workshops
           page heads these separately — "DHK-EDU-SERVE TRAINING PROGRAM 2024-25"
           and "…23-24" — and this site had collapsed both into a single
           "Administrators' and Teachers' Training". That is the same fault as
           dropping QCT/CIC: the count on the page stops matching the count on
           theirs, and one of two real programmes disappears.

           ⚠ THE THREE-DAY / LAHARTARA DETAIL SITS ON 2023–24 AND IS NOT CERTAIN.
           It came from the old merged entry, and the school does not say which
           session it describes. It is left on the earlier programme rather than
           duplicated onto both — but it is the one line here worth checking with
           them before launch. */
        {
          title: 'DHK Eduserve Training Programme 2024–25',
          slug: 'dhk-eduserve-2024-25',
          photoDir: 'DHK-EDU-SERVE-TRAINING-PROGRAM-2024-25',
          meta: 'DHK Eduserve',
          body: 'The 2024–25 training programme run for the school by DHK Eduserve, attended by teaching and administrative staff.',
          when: '2024–25',
        },
        {
          title: 'DHK Eduserve Training Programme 2023–24',
          slug: 'dhk-eduserve-2023-24',
          photoDir: 'DHK-EDU-SERVE-TRAINING-PROGRAM',
          meta: 'DHK Eduserve · Sunbeam Lahartara, Varanasi',
          body: 'A three-day residential training for administrators and teachers, run by DHK Eduserve at Sunbeam Lahartara, Varanasi.',
          when: '2023–24',
        },
        {
          title: 'National Education Policy training',
          slug: 'nep-training',
          photoDir: 'National-Education-Policy',
          meta: 'Ms. Vishakha Singh · Sunshine Public School, Ghazipur',
          body: 'An NEP training session — conducted BY a Sunbeam Ballia educator, at another school.',
          result: 'Delivered by the school, not received by it',
        },
      ],
    },
  ],
};

/* ═══ 2 · COMPETITIONS ════════════════════════════════════════════════════ */

export const competitions: ChroniclePage = {
  slug: 'competitions',
  title: 'Competitions',
  standfirst:
    'Where the school competes and what it hosts — from a Class I speaking contest to a district chess championship run on its own ground.',
  eyebrow: 'Competitions',
  heading: 'Entered, hosted, and placed',
  stand:
    'Every position below is one the school published. Where it hosted rather than competed, the full field is named — a district championship is a harder thing to run than to enter.',
  groups: [
    {
      id: 'arts',
      label: 'Arts & culture',
      note: 'Music, dance, painting and the spoken word.',
      items: [
        {
          title: 'Mandal Level Kala Utsav',
        slug: 'mandal-kala-utsav',
          meta: 'U.P. Mandal — Azamgarh',
          body: 'Students competed at divisional level across music, crafts and dance.',
          result: '1st — Solo Singing · 1st — Local Crafts & Toys · 1st — Group Instrumental Music · 2nd — Regional Folk Dance. Winners qualified for the state level.',
          when: '2025',
        },
        {
          title: 'Janpad Stariya Kala Utsav Pratiyogita',
        slug: 'janpad-kala-utsav',
          meta: 'Mentors: Mr. Nurul · Ms. Archana · Mr. Amit',
          body: 'The district round of Kala Utsav, across music, dance and art.',
          result: 'Numerous trophies and medals; students selected for the State Level in Music, Dance and Art',
          when: '2025',
        },
        {
          title: 'Kala Utsav at GGIC Ballia, and the Sambhagiya Shastriya Evam Sugam Sangeet Pratiyogita at Mau',
        slug: 'kala-utsav-ggic-and-mau',
          meta: 'Mentors: Mr. Nurul · Ms. Archana · Mr. Amit',
          body: 'Two further arts competitions, one in Ballia and one at Mau. Winners were felicitated in assembly.',
          when: '2025',
        },
        {
          title: 'Indian Folk Painting Competition',
        slug: 'indian-folk-painting',
          meta: 'Impetus · Classes III–V',
          body: 'Students showed the richness of Indian folk art in their own strokes.',
        },
        {
          title: 'Shining Star Kids Fashion Show',
        slug: 'shining-star-fashion-show',
          meta: 'Miss Ayana Pandey, Class VIII',
          body: 'A contest of more than seventy entrants, with the award presented by Miss Universe India 2024, Riya Singha.',
          result: 'Winner — over 70 contestants',
          when: '2025',
        },
      ],
    },
    {
      id: 'academic',
      label: 'Academic & speaking',
      note: 'Olympiads, quizzes and competitive speaking.',
      items: [
        {
          title: 'Science Olympiad Foundation — Zonal Excellence Award',
        slug: 'sof-zonal-excellence',
          meta: 'Classes III–V',
          body: 'The SOF zonal award, with a ₹500 voucher, for students in the primary years.',
          result: 'Zonal Excellence Award',
        },
        {
          title: 'SOF Olympiad — Nursery to Class II',
        slug: 'sof-olympiad-juniors',
          meta: 'Science Olympiad Foundation',
          body: 'The school’s youngest entrants were felicitated for their performance in the SOF Olympiad.',
          when: '2025',
        },
        {
          title: 'Cohort Inter-Branch Attire Speak Competition',
        slug: 'attire-speak-competition',
        photoDir: 'attire-speak-competition',
          meta: 'Class I',
          body: 'A speaking competition across Sunbeam branches, entered by the school’s six-year-olds.',
          result: '1st — Avinashi Yadav · 3rd — Mariam Ali',
          when: '2025',
        },
        {
          title: 'IPN Yuva Conclave — Gwalior edition',
        slug: 'ipn-yuva-conclave',
          meta: 'IPN',
          body: 'Students travelled to the Gwalior edition of the conclave and were felicitated in morning assembly on their return.',
          when: '2025',
        },
      ],
    },
    {
      id: 'hosted',
      label: 'Hosted at Sunbeam',
      note: 'District championships the school ran on its own ground.',
      items: [
        {
          title: 'Chaturang 2.0 — District Level Chess Championship',
        slug: 'chaturang-chess-championship',
        photoDir: 'chaturang-chess-championship',
          meta: 'Chief Guest: Mr. Umesh Singh, Secretary, Ballia Sports Association',
          body: 'The school hosted the district chess championship, opening it with a ceremony attended by schools from across Ballia and closing it by felicitating every winner and participant.',
          when: '2025',
        },
        {
          title: 'District Junior Volleyball Championship',
        slug: 'district-junior-volleyball',
          meta: 'Ballia Sports Association · hosted at Sunbeam',
          body: 'A district championship run on the school ground, with the full field placed.',
          result: 'Boys — 1st Sohaon Ballia, 2nd Veer Lorik Stadium, 3rd Sunbeam & Narahi · Girls — 1st Narahi Ballia, 2nd Sunbeam Ballia, 3rd Veer Lorik · Best players: Ritika Singh (Sunbeam) and Ashish Rai (Narahi)',
          when: '2025',
        },
        {
          title: 'District Junior Hockey Championship — final',
        slug: 'district-junior-hockey',
          meta: 'Sunbeam Ballia v Stadium Ballia',
          body: 'The school’s hockey side took the district final.',
          result: 'Won 3–0',
          when: '2025',
        },
      ],
    },
  ],
};

/* ═══ 3 · CELEBRATIONS ════════════════════════════════════════════════════ */

export const celebrations: ChroniclePage = {
  slug: 'celebrations',
  title: 'Celebrations',
  standfirst:
    'The national days, the festivals and the mornings the school stops for — with the guests who came and the classes who ran them.',
  eyebrow: 'Celebrations',
  heading: 'The year, marked',
  stand:
    'A school calendar is a cultural document. These are the days Sunbeam Ballia sets aside, and who stood on the stage when it did.',
  groups: [
    {
      id: 'national',
      label: 'National days',
      note: 'The days the flag goes up.',
      items: [
        {
          title: 'Independence Day',
        slug: 'independence-day',
        /* Seventeen photographs the school sent directly, August 2025. */
        photoDir: 'independence-day',
          meta: 'Chief Guest: Mr. Ashutosh Kumar Pandey, IRS, Deputy Commissioner of Income Tax',
          body: 'The national flag hoisted by the chief guest, followed by cultural performances, patriotic songs and student acts.',
          when: '2025 · the 78th',
        },
        {
          title: 'Republic Day',
        slug: 'republic-day',
        photoDir: 'republic-day',
          meta: 'Whole school',
          body: 'The school’s Republic Day assembly and cultural programme.',
        },
        {
          title: 'Birth anniversary of Major Dhyan Chand',
        slug: 'major-dhyan-chand',
          meta: 'Ceremonial lamp lighting by the Director',
          body: 'A tribute to the hockey wizard on his birth anniversary — lamp lighting by the Director, followed by floral tribute.',
          when: '2025',
        },
        {
          title: 'National Voters’ Day',
        slug: 'national-voters-day',
          meta: 'Vote-awareness programme',
          body: 'A programme run to explain the vote to students old enough to be thinking about it.',
        },
      ],
    },
    {
      id: 'festivals',
      label: 'Festivals',
      note: 'Marked across the year, across faiths.',
      items: [
        {
          title: 'Durga Pooja, Vijaya Dashami and Janmashtami',
        slug: 'durga-pooja-and-janmashtami',
        photoDir: 'durga-pooja-and-janmashtami',
          meta: 'Devotional and cultural festival celebration',
          body: 'The school’s devotional and cultural programme across the autumn festivals.',
        },
        {
          title: 'Holi',
        slug: 'holi',
        photoDir: 'holi',
          meta: 'Whole school',
          body: 'The school’s Holi celebration.',
        },
        {
          title: 'Lohri and Baisakhi',
        slug: 'lohri-and-baisakhi',
        photoDir: 'lohri-and-baisakhi',
          meta: 'Whole school',
          body: 'The harvest festivals, marked together.',
        },
        {
          title: 'Viswakarma Pooja',
        slug: 'viswakarma-pooja',
        photoDir: 'viswakarma-pooja',
          meta: 'Whole school',
          body: 'The Viswakarma Pooja celebration.',
        },
        {
          title: 'Sawan',
        slug: 'sawan',
        photoDir: 'sawan',
          meta: 'Whole school',
          body: 'The school’s Sawan celebration.',
        },
      ],
    },
    {
      id: 'school',
      label: 'The school’s own days',
      note: 'Teachers, grandparents, and the ends of things.',
      items: [
        {
          title: 'Teachers’ Day — the student-led programme',
        slug: 'teachers-day-students',
        photoDir: 'teachers-day-students',
          meta: 'KG to Class XII',
          body: 'Music and dance from every year group — and Class XII students stepping into the shoes of their teachers to take classes for the day.',
          when: '2025',
        },
        {
          title: 'Teachers’ Day — the staff evening',
        slug: 'teachers-day-staff',
          meta: 'Teaching and support staff',
          body: 'Games, mementos and tokens of thanks for the staff, run by the school administration.',
          when: '2025',
        },
        {
          title: 'Heritage Week',
        slug: 'heritage-week',
          meta: 'Classes III–V',
          body: 'A week inside the culture and traditions of India — art, dance and music, and the stories behind them.',
          when: '2025',
        },
        {
          title: 'Grandparents’ Day',
        slug: 'grandparents-day',
        photoDir: 'grandparents-day',
          meta: 'Held before the examinations',
          body: 'The school’s Grandparents’ Day celebration, timed before the examination season.',
        },
        {
          title: 'International Women’s Day',
        slug: 'womens-day',
        photoDir: 'womens-day',
          meta: 'Whole school',
          body: 'The school’s Women’s Day programme.',
        },
        {
          title: 'Farewell — Class XII',
        slug: 'farewell-class-xii',
        photoDir: 'farewell-class-xii',
          meta: 'Class XII',
          body: 'The leavers’ assembly and farewell for the outgoing Class XII.',
          when: '2025',
        },
        {
          title: 'KG Convocation and KG Farewell',
        slug: 'kg-convocation',
        photoDir: 'kg-convocation',
          meta: 'Kindergarten',
          body: 'The school’s youngest leavers get a convocation of their own.',
        },
      ],
    },
  ],
};

/* ═══ 4 · SCHOOL EVENTS ═══════════════════════════════════════════════════ */

export const schoolEvents: ChroniclePage = {
  slug: 'school-events',
  title: 'School Events',
  standfirst:
    'The programmes the school runs and the people it brings in — an IRS officer, a retired professor, Monash University, and a book fair opened by the CRO.',
  eyebrow: 'School events',
  heading: 'Who the school brings through the gate',
  stand:
    'The measure of a school’s programme is who agrees to come and speak at it. Every guest below is named, with their office, as the school published it.',
  groups: [
    {
      id: 'guests',
      label: 'Visiting speakers',
      note: 'Named guests, and what they came to say.',
      items: [
        {
          title: 'Guiding Futures, Shaping Lives',
        slug: 'guiding-futures',
        photoDir: 'Guiding-Futures',
          meta: 'Mr. Ashutosh Kumar Pandey, IRS, Deputy Commissioner of Income Tax · Classes IX–XII',
          body: 'A career-guidance session in which the officer shared his own educational journey and the lessons in it, in an interactive session with the senior school.',
          when: '2025',
        },
        {
          title: 'Kindness over Violence',
        slug: 'kindness-over-violence',
        photoDir: 'Kindness-over-Violence',
          meta: 'Mrs. Pratima Gupta, Assistant Director, Sunbeam Group',
          body: 'A session on choosing compassion and empathy over anger and conflict, with students interacting throughout.',
        },
        {
          title: 'Seventeen books, given to the library',
        slug: 'author-book-donation',
        photoDir: 'Seventeen-books',
          meta: 'Mr. Ramesh Chandra Srivastava, retired professor and author',
          body: 'The author gifted seventeen of his own books to the school library, and spoke to students about building the habits of reading and writing.',
          result: '17 books donated',
        },
        {
          title: 'Reading Carnival — the book fair',
        slug: 'reading-carnival',
        photoDir: 'Reading-Carnival',
          meta: 'Inaugurated by Shri Tribhuvan Ram, CRO Ballia',
          body: 'A book fair open to students, parents and visitors, running until the thirtieth of August.',
          when: 'to 30 August',
        },
      ],
    },
    {
      id: 'programmes',
      label: 'Programmes',
      note: 'What the school runs for its own students.',
      items: [
        {
          title: 'Monash Innovation Guarantee — the school’s first',
        slug: 'monash-innovation-guarantee',
        photoDir: 'Monash-Innovation',
          meta: 'K.R. Mangalam World School, G.K-II, New Delhi · in collaboration with Monash University, Australia · Mentor: Mr. Arun Pandey',
          body: 'Students travelled to Delhi for an international innovation project on entrepreneurship, run with Monash University — the first the school has entered.',
          when: '27–29 August 2025',
        },
        {
          title: 'Impetus — Classes III to V',
        slug: 'impetus',
        photoDir: 'Impetus—ClassesIII-V',
          meta: 'Science Quest · Maths Mania · Digital Dash · Hindi Vani Vihar · Spell Bee · Community Connect · English Quest',
          body: 'A multi-event programme for the primary years, from experiments and mental arithmetic to public speaking in Hindi and English.',
          when: '2025',
        },
        {
          title: 'Child Parent Teacher Dialogue',
        slug: 'child-parent-teacher-dialogue',
          meta: 'Parents, teachers and students across classes',
          body: 'A three-way session on progress, feedback and suggestions, with parents taking an active part.',
          when: '2025',
        },
        {
          title: 'Class XII Physics — the half-deflection method',
        slug: 'class-xii-physics-practical',
          meta: 'Class XII-B',
          body: 'Students determined the internal resistance of a galvanometer and calculated its figure of merit — the practical, done properly.',
          when: '2025',
        },
      ],
    },
    {
      id: 'recognition',
      label: 'Recognition',
      note: 'What the school and its people have been given.',
      items: [
        {
          title: 'Cfore School Rankings — School Excellence Award',
        slug: 'cfore-school-rankings',
          meta: 'Cfore',
          body: 'The school was ranked first in Ballia and recognised among Uttar Pradesh’s best day co-ed schools.',
          result: 'Ranked No. 1 in Ballia',
          when: '2025',
        },
        {
          title: 'CUET (UG) results',
        slug: 'cuet-ug-results',
        photoDir: 'CUET-(UG)-results',
          meta: 'PCM · Commerce · Humanities',
          body: 'The school marked its students’ CUET (UG) results across all three streams.',
          when: '2025',
        },
        {
          title: 'IPN Leadership Summit — Uttar Pradesh Dialogue',
        slug: 'ipn-leadership-summit',
          meta: 'Theme: School Education 5.0 — Nurturing the Human & Tech Connect',
          body: 'Three of the school’s leaders represented Sunbeam Ballia at the summit.',
          when: '2025',
        },
        {
          title: 'Best performing classes, and staff of the month',
        slug: 'monthly-awards',
          meta: 'Monthly, in assembly',
          body: 'A standing monthly award: best discipline, best performing, neatest, most energetic and best reading culture — extended to monitors, the bus monitor, support staff, the driver and the conductor.',
          result: 'Recognition reaches the driver and the conductor, not only the classroom',
          when: '2025',
        },
      ],
    },
  ],
};

export const chronicles: ChroniclePage[] = [workshops, competitions, celebrations, schoolEvents];
