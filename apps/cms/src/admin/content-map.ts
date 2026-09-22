/**
 * THE SITE, AS AN EDITOR THINKS OF IT.
 *
 * ═══ WHAT THIS IS, AND WHAT IT IS NOT ══════════════════════════════════════
 *
 * A map from the school's own information architecture onto the content types
 * that already exist. Every leaf is a link into the Content Manager — filtered
 * where one type serves several parts of the site.
 *
 * ⚠ IT CREATES NOTHING. No content type, no record, no route, no field. Strapi's
 * own Content Manager still lists everything exactly as before; this is a second
 * way in, arranged the way the website is arranged rather than alphabetically.
 *
 * ⚠ WHY A PAGE AND NOT A NESTED SIDEBAR. Strapi's Content Manager sidebar cannot
 * be regrouped — it renders "Collection Types" and "Single Types" alphabetically
 * and offers no hook to nest them — and `addMenuLink` has no grouping either, so
 * forty links would land flat in the left rail and be worse than the list they
 * replaced. One page that draws the tree is the only shape that gives real
 * nesting, and it is fully supported.
 *
 * ⚠ THE ACADEMIC GROUPS ARE FILTERS ON A FIELD THAT ALREADY EXISTS. Each links
 * to `academic-topic` filtered by its `group`, so the 46 records stay one
 * collection and appear under the heading the site puts them under. Adding a
 * page in the admin puts it in the right group automatically.
 */

/** A Content Manager route for one collection, optionally filtered. */
const list = (uid: string, filters?: Record<string, string>, exclude?: Array<[string, string]>) => {
  const base = `content-manager/collection-types/${uid}`;
  if (!filters && !exclude) return base;
  /* Strapi's own list-view filter shape. Written out rather than guessed: this
     is what the UI produces when you filter by hand. */
  const clauses = [
    ...Object.entries(filters ?? {}).map(([field, value]) => [field, '$eq', value]),
    /* `$ne` is how a stale record is kept out of a list without deleting it. */
    ...(exclude ?? []).map(([field, value]) => [field, '$ne', value]),
  ];
  const q = clauses
    .map(([field, op, value], i) => `filters[$and][${i}][${field}][${op}]=${encodeURIComponent(value)}`)
    .join('&');
  return `${base}?${q}`;
};

/** A Content Manager route for one single type. */
const single = (uid: string) => `content-manager/single-types/${uid}`;

const TOPIC = 'api::academic-topic.academic-topic';
const NEWS = 'api::news-item.news-item';

export interface Leaf { label: string; to: string; note?: string }
export interface Branch { label: string; note?: string; leaves?: Leaf[]; branches?: Branch[] }

export const CONTENT_MAP: Branch[] = [
  {
    label: 'Site & Global',
    note: 'Settings and page headers that apply across the whole site.',
    leaves: [
      { label: 'Site Settings', to: single('api::site-setting.site-setting'), note: 'Name, phones, addresses, social links — used everywhere.' },
      { label: 'Page Meta', to: list('api::page-meta.page-meta'), note: 'Each page’s hero, title and search description.' },
      { label: 'Homepage', to: single('api::homepage.homepage') },
    ],
  },

  {
    label: 'About Us',
    leaves: [
      { label: 'Leader Messages', to: list('api::leader-message.leader-message'), note: 'The Director’s and the Principal’s messages.' },
      { label: 'History', to: single('api::history-page.history-page') },
      { label: 'Vision & Mission', to: single('api::vision-mission-page.vision-mission-page') },
    ],
  },

  {
    label: 'Academics',
    note: 'Forty-six pages, grouped the way the website groups them.',
    branches: [
      {
        label: 'Academic Philosophy',
        leaves: [
          { label: 'Teaching Philosophy', to: single('api::teaching-philosophy-page.teaching-philosophy-page'), note: 'Edited section by section — 01 to 05 and the closing statement.' },
          { label: 'Student-Centred Learning', to: single('api::student-centred-learning-page.student-centred-learning-page'), note: 'Edited section by section — 01 to 03 and the closing statement.' },
          { label: 'Experiential & Inquiry Learning', to: single('api::experiential-inquiry-page.experiential-inquiry-page'), note: 'Edited section by section — 01 to 03 and the closing statement.' },
          { label: 'Critical Thinking & Creativity', to: single('api::critical-thinking-page.critical-thinking-page'), note: 'Edited section by section — 01 to 04.' },
          { label: 'Curriculum', to: single('api::curriculum-page.curriculum-page'), note: 'The stages and the syllabus library, then 01 to 05.' },
          /**
           * WARNING: THE TEACHING PHILOSOPHY ROW IS FILTERED OUT OF THIS LIST.
           *
           * That page moved to its own single type above, and Astro reads only
           * that. Its old academic-topic record still exists and still holds the
           * route's sections and photographs, but NOTHING READS THEM - so an
           * editor who found it would change a page and see nothing happen.
           *
           * The record is NOT deleted. It is excluded from this list by route,
           * so there is one obvious place to edit that page and no decoy beside
           * it. Strapi's own Content Manager still lists it, as it lists
           * everything; this map is what an editor is meant to navigate by.
           */
          { label: 'All philosophy pages', to: list(TOPIC, { group: 'philosophy' }, [['route', '/academics/philosophy/teaching-philosophy/'], ['route', '/academics/philosophy/student-centred-learning/'], ['route', '/academics/philosophy/experiential-inquiry/'], ['route', '/academics/philosophy/critical-thinking/'], ['route', '/academics/philosophy/curriculum/']]), note: 'Affiliation Details and the section hub.' },
        ],
      },
      {
        label: 'Academic Structure',
        leaves: [
          { label: 'Pre-Primary', to: single('api::pre-primary-page.pre-primary-page'), note: 'Edited band by band — 01 to 08.' },
          { label: 'Primary', to: single('api::primary-stage-page.primary-stage-page'), note: 'Edited band by band — 01 to 08.' },
          { label: 'Middle School', to: single('api::middle-school-page.middle-school-page'), note: 'Edited band by band — 01 to 09.' },
          { label: 'Secondary', to: single('api::secondary-stage-page.secondary-stage-page'), note: 'Edited band by band — 01 to 06.' },
          { label: 'Senior Secondary', to: single('api::senior-secondary-page.senior-secondary-page'), note: 'Edited band by band — 01 to 06.' },
          /**
           * WARNING: THE FOUR ROWS ABOVE ARE FILTERED OUT OF THE LIST BELOW.
           * Those pages moved to their own single types and Astro reads only
           * those. Their old academic-topic records still hold the runs and the
           * photographs, but NOTHING READS THEM — an editor who found one would
           * change a page and see nothing happen. The records are NOT deleted.
           */
          { label: 'Streams Offered', to: single('api::streams-offered-page.streams-offered-page'), note: 'The four streams, then 01 to 04.' },
          { label: 'Subject Combinations', to: single('api::subject-combinations-page.subject-combinations-page'), note: 'The four streams and their subjects, then 01 to 04.' },
          { label: 'All other structure pages', to: list(TOPIC, { group: 'structure' }, [
            ['route', '/academics/structure/pre-primary/'],
            ['route', '/academics/structure/primary/'],
            ['route', '/academics/structure/middle-school/'],
            ['route', '/academics/structure/secondary/'],
            ['route', '/academics/structure/senior-secondary/'],
            ['route', '/academics/structure/streams-offered/'],
            ['route', '/academics/structure/subject-combinations/'],
          ]), note: 'The Academic Structure hub itself. Every stage page above now has its own editor.' },
        ],
      },
      {
        label: 'Teaching & Learning',
        leaves: [
          { label: 'Methodology', to: single('api::methodology-page.methodology-page'), note: 'Edited band by band — 01 to 05.' },
          { label: 'Smart Classrooms', to: single('api::smart-classrooms-page.smart-classrooms-page'), note: 'Edited band by band — 01 to 05.' },
          { label: 'Experiential Learning', to: single('api::experiential-learning-page.experiential-learning-page'), note: 'Edited band by band — 01 to 04.' },
          { label: 'STEM & Robotics', to: single('api::stem-robotics-page.stem-robotics-page'), note: 'Edited band by band — 01 to 05.' },
          { label: 'Reading & Language', to: single('api::reading-language-page.reading-language-page'), note: 'Edited band by band — 01 to 05.' },
          { label: 'Laboratories & Clubs', to: single('api::laboratories-clubs-page.laboratories-clubs-page'), note: 'Edited band by band — 01 to 05.' },
          /**
           * WARNING: THE SIX ROWS ABOVE ARE FILTERED OUT OF THE LIST BELOW.
           * Each moved to its own single type and Astro reads only that. The old
           * academic-topic records still hold their runs and photographs, but
           * NOTHING READS THEM — an editor who found one would change a page and
           * see nothing happen. The records are NOT deleted, only kept out of
           * the list an editor is meant to navigate by.
           */
          { label: 'All other teaching pages', to: list(TOPIC, { group: 'teaching-learning' }, [
            ['route', '/academics/teaching-learning/methodology/'],
            ['route', '/academics/teaching-learning/smart-classrooms/'],
            ['route', '/academics/teaching-learning/experiential-learning/'],
            ['route', '/academics/teaching-learning/stem-robotics/'],
            ['route', '/academics/teaching-learning/reading-language/'],
            ['route', '/academics/teaching-learning/laboratories-clubs/'],
          ]), note: 'The Teaching & Learning hub itself. Every page above now has its own editor.' },
        ],
      },
      {
        label: 'Assessment',
        leaves: [
          { label: 'Assessment System', to: single('api::assessment-page.assessment-page'), note: 'Edited band by band — 01 to 06.' },
          { label: 'Homework Policy', to: single('api::homework-policy-page.homework-policy-page'), note: 'Edited band by band — 01 to 06.' },
          { label: 'Remedial Support', to: single('api::remedial-support-page.remedial-support-page'), note: 'Edited band by band — 01 to 03.' },
          { label: 'Mentoring', to: single('api::mentoring-page.mentoring-page'), note: 'Edited band by band — 01 to 05.' },
          { label: 'Parent–Teacher Meetings', to: single('api::parent-teacher-page.parent-teacher-page'), note: 'Edited band by band — 01 to 03.' },
          { label: 'Competitive Exam Preparation', to: single('api::competitive-exam-page.competitive-exam-page'), note: 'Edited band by band — 01 to 02.' },
          { label: 'Academic Calendar', to: single('api::academic-calendar-page.academic-calendar-page'), note: 'The sessions, the two card strips and the page’s three photographs.' },
          /**
           * WARNING: THE SIX ROWS ABOVE ARE FILTERED OUT OF THE LIST BELOW.
           * Each moved to its own single type and Astro reads only that. The old
           * academic-topic records still hold their runs, but NOTHING READS THEM
           * — an editor who found one would change a page and see nothing
           * happen. They are NOT deleted, only kept out of the list an editor is
           * meant to navigate by.
           */
          { label: 'All other assessment pages', to: list(TOPIC, { group: 'assessment' }, [
            ['route', '/academics/assessment/'],
            ['route', '/academics/assessment/homework-policy/'],
            ['route', '/academics/assessment/remedial-support/'],
            ['route', '/academics/assessment/mentoring/'],
            ['route', '/academics/assessment/parent-teacher-meetings/'],
            ['route', '/academics/assessment/competitive-exam-preparation/'],
          ]), note: 'Anything in this group without an editor of its own.' },
        ],
      },
      {
        label: 'Student Success',
        leaves: [{ label: 'All student-success pages', to: list(TOPIC, { group: 'student-success' }), note: 'Board Results, Career Guidance, Olympiads, Scholarships, Subject Selection, Success Stories, University Counselling, Alumni Interaction.' }],
      },
      {
        label: 'Parent Partnership',
        /**
         * WARNING: workshops-webinars IS EXCLUDED AND NOT DELETED.
         * That page reads getChroniclePage() — the workshops chronicle — and
         * never touches its academic-topic record at all. An editor who found it
         * would change a page and see nothing happen.
         */
        leaves: [{ label: 'All parent pages', to: list(TOPIC, { group: 'parent-partnership' }, [['route', '/academics/parent-partnership/workshops-webinars/']]), note: 'Parents’ Forum, Parent Engagement, Orientation, Communication, FAQs. Workshops & Webinars is edited under News & Events → Workshops.' }],
      },
      {
        label: 'The Academics landing page',
        leaves: [{ label: 'Academics overview', to: list(TOPIC, { group: 'overview' }) }],
      },
    ],
  },

  {
    label: 'Beyond Academics',
    branches: [
      {
        label: 'Sports',
        leaves: [
          { label: 'Sports Page', to: single('api::sports-page.sports-page') },
          { label: 'Sport Facilities', to: list('api::sport-facility.sport-facility') },
          { label: 'Games', to: list('api::game.game') },
          { label: 'Sports Records', to: list('api::sports-record.sports-record'), note: 'Championships, camps and results.' },
        ],
      },
      {
        label: 'Excursions',
        leaves: [
          {
            label: 'Excursion Sections',
            to: list('api::excursion-section.excursion-section'),
            note: 'The whole page. Each row is one band — text, poster and photographs. The banner and page title are on Page Meta.',
          },
          /* ⚠⚠ NOT CURRENTLY ON THE SITE, AND THE LABEL HAS TO SAY SO.
             The "Learning Expeditions" section was removed from the excursions
             page at the client's instruction, re-added once in a redesigned
             form, and removed again on the same instruction. The seven rows and
             the component that renders them were both kept so it can come back
             — but until it does, anything edited here changes nothing a visitor
             can see, and an editor has no way of knowing that from the CMS.
             ⚠ IF THE SECTION IS EVER RESTORED, delete this note with the same
             commit. A stale "not shown" warning on a section that IS shown is
             worse than none. */
          {
            label: 'Expeditions (not shown)',
            to: list('api::expedition.expedition'),
            note: 'Kept for a section that was removed from the page. Editing these changes nothing on the site today.',
          },
        ],
      },
      {
        label: 'NCC, Scouts & Guides',
        leaves: [
          {
            label: 'NCC, Scouts & Guides Page',
            to: single('api::uniformed-groups-page.uniformed-groups-page'),
            note: 'Both groups, their facts, their record and their photographs. The banner and page title are on Page Meta.',
          },
        ],
      },
      {
        label: 'Publications',
        leaves: [
          {
            label: 'Publications',
            to: list('api::publication.publication'),
            note: 'One row per newsletter, magazine or e-paper. `group` decides which band it appears under.',
          },
          {
            label: 'Publications Page',
            to: single('api::publications-page.publications-page'),
            note: 'The band headings, and the MYRA STEM Lab newsletter pages. The banner and page title are on Page Meta.',
          },
        ],
      },
      {
        label: 'School Activities',
        leaves: [{ label: 'All activities', to: list(NEWS, { category: 'activity' }), note: 'The activities chronicle.' }],
      },
      {
        label: 'Achievements',
        leaves: [
          /* ⚠ THE PAGE ROW FIRST, because it is the only SINGLE type here and
             the three below are the lists it wraps. It holds the three band
             headings and nothing else — editing it never changes what is
             listed underneath. */
          {
            label: 'Achievements Page',
            to: single('api::achievements-page.achievements-page'),
            note: 'The three band headings. The banner and page title are on Page Meta.',
          },
          { label: 'Major Achievements', to: list('api::achievement-major.achievement-major') },
          { label: 'Achievement Records', to: list('api::achievement-record.achievement-record') },
          { label: 'Credentials', to: list('api::credential.credential') },
        ],
      },
    ],
  },

  {
    label: 'News & Events',
    note: 'One collection, shown by section. Adding an item puts it wherever its category says.',
    leaves: [
      { label: 'Celebrations', to: list(NEWS, { category: 'celebration' }) },
      { label: 'Workshops', to: list(NEWS, { category: 'workshop' }) },
      { label: 'Competitions', to: list(NEWS, { category: 'competition' }) },
      { label: 'School Events', to: list(NEWS, { category: 'school-event' }) },
      { label: 'Every item', to: list(NEWS), note: 'All categories together.' },
      { label: 'Section headers', to: list('api::news-category-page.news-category-page') },
      { label: 'Notices', to: list('api::notice.notice') },
    ],
  },

  {
    label: 'Campus',
    leaves: [
      { label: 'Facilities Page', to: single('api::facilities-page.facilities-page') },
      { label: 'Campus Facilities', to: list('api::campus-facility.campus-facility') },
      { label: 'Safety & Security', to: single('api::campus-safety-page.campus-safety-page') },
      { label: 'Campus Tour', to: single('api::campus-tour-page.campus-tour-page') },
      { label: 'Transport Page', to: single('api::transport-page.transport-page') },
      { label: 'Bus Routes', to: list('api::bus-route.bus-route') },
    ],
  },

  {
    label: 'School Administration',
    leaves: [
      { label: 'Teachers', to: list('api::teacher.teacher'), note: 'The staff list published in the disclosure.' },
      { label: 'Job Postings', to: list('api::job-posting.job-posting') },
      { label: 'Alumni', to: list('api::alumnus.alumnus') },
      { label: 'Alumni Stories', to: list('api::alumni-story.alumni-story') },
      { label: 'Alumni Meets', to: list('api::alumni-meet.alumni-meet') },
    ],
  },

  {
    label: 'Documents & Services',
    leaves: [
      { label: 'Mandatory Public Disclosure', to: single('api::disclosure-page.disclosure-page') },
      { label: 'Uniform', to: single('api::uniform-page.uniform-page') },
      { label: 'Contact', to: single('api::contact-page.contact-page') },
      { label: 'Result', to: single('api::result-page.result-page') },
      { label: 'Transfer Certificate', to: single('api::tc-page.tc-page') },
      { label: 'Calendar Documents', to: list('api::calendar-document.calendar-document') },
    ],
  },
];
