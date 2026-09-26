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
const LEADER = 'api::leader-message.leader-message';
const NEWS = 'api::news-item.news-item';

export interface Leaf {
  label: string;
  to: string;
  note?: string;
  /**
   * ⚠ "THIS LINK IS A PAGE, EVEN THOUGH IT OPENS A LIST."
   *
   * Most pages are a single type, or a collection filtered to one record, and
   * the sidebar can work that out for itself. A few are neither: the whole of
   * /beyond-academics/excursions/ is the Excursion Sections collection — every
   * row is one band of that one page — so an unfiltered list IS the page, and
   * nothing in the URL says so. This flag is how it says so.
   *
   * ⚠ IT IS NOT A LABEL FOR ANY LIST YOU WANT PROMOTED. Setting it on a real
   * list view — "all philosophy pages" — would put a collection in the pages
   * column under a name that is not a page.
   */
  page?: true;
}
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
      /* ⚠⚠ THE THREE MESSAGES ARE PAGES, AND THEY ARE NAMED ONE BY ONE.
         Each is a row inside the Leader Message collection, so the nav showed
         one link called "Leader Messages" and the school had three pages in
         its own menu it could not find. The rows below are keyed on `role`,
         which is what the pages themselves look up. */
      { label: 'Our Journey — the History page', to: single('api::history-page.history-page'), note: 'The story, the timeline, and the Chairman’s and Secretary’s signed messages at #leadership.' },
      { label: 'Director’s Message', to: list(LEADER, { role: 'director' }) },
      { label: 'Principal’s Message', to: list(LEADER, { role: 'principal' }) },
      { label: 'Vice Principal’s Message', to: list(LEADER, { role: 'vice-principal' }) },
      {
        label: 'Advisory Council',
        to: single('api::advisory-council.advisory-council'),
        note: 'The board that closes the History page. NOT the student council, and NOT the School Management Committee — that one is a statutory filing on the Disclosure Page. ⚠ The member rows are not drawn on screen: they become the board image’s description, so a new board means retyping them in the same save.',
      },
      { label: 'Vision & Mission', to: single('api::vision-mission-page.vision-mission-page') },
      { label: 'All leader messages', to: list(LEADER), note: 'The same three in one list, with their portraits and credentials.' },
    ],
  },

  {
    label: 'Academics',
    note: 'Forty-six pages, grouped the way the website groups them.',
    /* ⚠ THIS LEAF IS FIRST ON PURPOSE, AND IT DECIDES WHERE THE COLLECTION
       SITS IN THE SIDEBAR. group-nav indexes a content type by the FIRST leaf
       that mentions it, walking leaves before branches — so without this,
       Academic Topic was filed under "Academic Philosophy" simply because
       "All philosophy pages" was the first link to name it. It holds all
       forty-six academics pages, so it belongs to Academics itself. */
    leaves: [
      { label: 'All academics pages', to: list(TOPIC), note: 'Every one of the forty-six, in one list. The groups below are the same pages, sorted the way the website sorts them.' },
      { label: 'Academics — the section landing page', to: list(TOPIC, { route: '/academics/' }), note: 'What /academics/ itself says, above the seven groups.' },
    ],
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
          { label: 'Academic Philosophy — the section landing page', to: list(TOPIC, { route: '/academics/philosophy/' }), note: 'What /academics/philosophy/ itself says.' },
          { label: 'Affiliation Details', to: list(TOPIC, { route: '/academics/philosophy/affiliation-details/' }), note: 'The CBSE affiliation, as the school publishes it.' },
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
          { label: 'Academic Structure — the section landing page', to: list(TOPIC, { route: '/academics/structure/' }), note: 'What /academics/structure/ itself says.' },
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
        /**
         * ⚠ THE BRANCH IS NAMED FOR THE PAGE AN EDITOR IS LOOKING FOR, not for
         * the content type. The timetables live under Class Corner on the site
         * and that is the name the school uses for them; a sidebar group
         * called "Class Timetable" sent people hunting for "Class Corner" and
         * finding nothing.
         *
         * ⚠ A UID THAT IS NOT IN THIS MAP IS NOT GROUPED AT ALL. admin/
         * group-nav.ts indexes the sidebar from these leaves — a new content
         * type that is missing here still exists in the Content Manager, but
         * it falls outside every heading and is genuinely hard to find. Add
         * the leaf at the same time as the content type.
         */
        label: 'Class Corner',
        leaves: [
          {
            label: 'Class Corner — the page itself',
            to: list(TOPIC, { route: '/academics/class-corner/' }),
            note: 'The heading over the cards, the line under them, and the words around the two Academic Excellence boards. The cards and the boards are the two entries below.',
          },
          {
            label: 'Academic Excellence boards',
            to: list('api::board-topper.board-topper'),
            note: 'The two boards at the entrance, one row per name. Next session’s topper is a new row — nothing else has to change. ⚠ Every row is a named child and a published mark, transcribed from the boards themselves.',
          },
          {
            label: 'Class Corner cards',
            to: list('api::class-corner-document.class-corner-document'),
            note: 'The four cards on the page. Replace a document by uploading over its file.',
          },
          {
            label: 'Class Timetable',
            to: list('api::class-timetable.class-timetable'),
            note: 'One entry per class. Replace a sheet by uploading over its image — the page updates itself.',
          },
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
          { label: 'Teaching & Learning — the section landing page', to: list(TOPIC, { route: '/academics/teaching-learning/' }), note: 'What /academics/teaching-learning/ itself says.' },
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
        label: 'Career Development & Student Success',
        note: 'The eight pages under this heading in the site menu. Each one is a single record; its sections are named after what they say rather than after a field.',
        leaves: [
          { label: 'Career Guidance', to: list(TOPIC, { route: '/academics/student-success/career-guidance/' }), note: 'The programme, the one-to-one desks, the photo story and the closing statement.' },
          { label: 'University Counselling', to: list(TOPIC, { route: '/academics/student-success/university-counselling/' }), note: 'The placement board, the CUET result cards, the four destination counts and the close.' },
          { label: 'Subject Selection Guidance', to: list(TOPIC, { route: '/academics/student-success/subject-selection/' }), note: 'The four streams, where the choice is discussed, the four steps and the rooms.' },
          { label: 'Alumni Interaction', to: list(TOPIC, { route: '/academics/student-success/alumni-interaction/' }), note: 'The posters, the path and the closing statement.' },
          { label: 'Board Results', to: list(TOPIC, { route: '/academics/board-results/' }), note: '⚠ THIS PAGE SAYS THE SCHOOL PUBLISHES NO BOARD RESULTS. When it does publish them, this is where that whole position is rewritten.' },
          { label: 'Olympiad Achievements', to: list(TOPIC, { route: '/academics/student-success/olympiad-achievements/' }), note: 'SOF from Nursery, the national programmes, and the full list. No award total — the school keeps none.' },
          { label: 'Scholarships', to: list(TOPIC, { route: '/academics/student-success/scholarships/' }), note: '⚠ EMPTY ON PURPOSE. The school publishes no scholarship terms; the page says so rather than inventing any.' },
          { label: 'Student Success Stories', to: list(TOPIC, { route: '/academics/student-success/success-stories/' }), note: 'The three award graphics, the milestones by reach, and the helpline box.' },
          { label: 'Career Development — the section landing page', to: list(TOPIC, { route: '/academics/student-success/' }), note: 'What /academics/student-success/ itself says, above the eight.' },
          { label: 'All student-success pages', to: list(TOPIC, { group: 'student-success' }), note: 'The same eight in one list, plus the section hub.' },
        ],
      },
      {
        label: 'Parent Partnership',
        /**
         * WARNING: workshops-webinars IS EXCLUDED AND NOT DELETED.
         * That page reads getChroniclePage() — the workshops chronicle — and
         * never touches its academic-topic record at all. An editor who found it
         * would change a page and see nothing happen.
         */
        leaves: [
          {
            /* ⚠ TWO COLLECTIONS, AND THE ORDER HERE IS THE WORKFLOW. Feedback
               is what a parent SENT; a testimonial is what the school has
               permission to PRINT. They are listed together so nobody goes
               looking for the quotes in the inbox. */
            label: 'Parent Testimonials (cleared for the site)',
            to: list('api::parent-testimonial.parent-testimonial'),
            note: 'Only quotes a parent has agreed to. The carousel on /parents-feedback/ reads these.',
          },
          {
            label: 'Parent Feedback (private inbox)',
            to: list('api::parent-feedback.parent-feedback'),
            note: 'What the form receives. No page reads it — treat every row as private.',
          },
          { label: 'Parent Partnership — the section landing page', to: list(TOPIC, { route: '/academics/parent-partnership/' }), note: 'What /academics/parent-partnership/ itself says.' },
          { label: 'Parent Orientation', to: list(TOPIC, { route: '/academics/parent-partnership/parent-orientation/' }) },
          { label: 'Parents’ Forum', to: list(TOPIC, { route: '/academics/parent-partnership/parents-forum/' }) },
          { label: 'School–Parent Communication', to: list(TOPIC, { route: '/academics/parent-partnership/school-parent-communication/' }) },
          { label: 'Parent Engagement Initiatives', to: list(TOPIC, { route: '/academics/parent-partnership/parent-engagement/' }) },
          { label: 'Frequently Asked Questions', to: list(TOPIC, { route: '/academics/parent-partnership/faqs/' }) },
          /* ⚠⚠ WORKSHOPS & WEBINARS IS NOT LISTED HERE, AND THAT IS THE POINT
             OF THE WARNING ABOVE. It renders from the workshops chronicle and
             never reads its academic-topic record, so a row pointing at that
             record would let somebody edit a page and watch nothing change. */
          { label: 'All parent pages', to: list(TOPIC, { group: 'parent-partnership' }, [['route', '/academics/parent-partnership/workshops-webinars/']]), note: 'The same pages in one list. Workshops & Webinars is edited under News & Events → Workshops.' },
        ],
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
            label: 'Excursions & Educational Tours',
            to: list('api::excursion-section.excursion-section'),
            /* ⚠ THE WHOLE PAGE IS THIS COLLECTION — see `page` on Leaf. It is
               named here the way the website's own menu names it, because that
               is what somebody looking for it will have in mind. */
            page: true,
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
        label: 'Student Council',
        leaves: [
          {
            label: 'Student Council',
            to: single('api::student-council-page.student-council-page'),
            note: 'The council board and the forty-five names on it, senior and junior. ⚠ The image and the lists are the same children — a new session means uploading the new board AND retyping the roll in one save. Spellings are copied from the board exactly, mistakes included.',
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
