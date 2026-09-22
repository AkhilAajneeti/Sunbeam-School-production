/**
 * NAVIGATION — docs/04-sitemap-homepage-ia.md § F1, F2.
 *
 * TEN main items — the audit's own numbered sections, in the audit's order.
 * Of its 13 sections, §9 Uniform Catalogue is not in use, §13 Alumni
 * Testimonials is a homepage band rather than a destination, and §10 Notices
 * is reached from Latest News & Events and the utility bar rather than from a
 * menu item of its own. That leaves §1–§8, §11 and §12.
 *
 * Menu contents are scoped to the sections the audit names; anything it does not
 * list has been dropped from the menus rather than left as unowned surface.
 * There is no Admissions item: the audit never mentions one.
 *
 * Columns carry no headings — every entry is a link, so a menu cannot present a
 * label that goes nowhere. Each group's landing page leads its own column.
 */
import { school } from "./site";

/* Preview art for the mega menu's right-hand panel. Imported explicitly rather
   than globbed: there are ten of them, each chosen for a specific destination,
   and a glob would make it impossible to see at a glance which link shows what.
   All are the school's own photography. */
import imgCampus from "../assets/photos/sunbeem-1.jpg";
import imgChairman from "../assets/photos/Chairman-sunbeam.jpg";
import imgDirector from "../assets/photos/directorImage.jpeg";
import imgPrincipal from "../assets/photos/sb-principal.jpg";
import imgVicePrincipal from "../assets/photos/vicePrincipal.jpeg";
import imgCorridor from "../assets/corridor and stairs/DSC_1210 copy.jpg";
import imgInvestiture from "../assets/school-activities/investiture-ceremony/04.jpg";
import imgLibrary from "../assets/library/DSC_1224 copy.jpg";
import imgChem from "../assets/chem lab/DSC_1262 copy.jpg";
import imgComputer from "../assets/computer lab/DSC_1204 copy.jpg";
import imgJosh from "../assets/JOSH GROUND/DSC_1283 copy.jpg";
import imgBasket from "../assets/basket ball/DSC_1212 copy.jpg";
import imgActivity from "../assets/activity learning lab/DSC_1215 copy.jpg";

export interface NavChild {
  label: string;
  href: string;
  note?: string;
  /**
   * Mega-menu card fields. All optional — a link with none of them still
   * renders, it simply shows as a plain card, so adding a destination never
   * requires filling in three extra properties first.
   */
  icon?: string;
  /** One line on the card. Says what the page is FOR, never restates the title. */
  desc?: string;
  /** Art for the preview panel when this card is hovered. */
  img?: ImageMetadata;
  /**
   * Second level. Every href below points at a section that VERIFIABLY exists —
   * each one was read off the built HTML rather than assumed, because a submenu
   * of dead anchors is worse than no submenu at all. A link with no real
   * sections gets no children, and therefore no expand arrow.
   */
  children?: NavChild[];
}

export interface NavItem {
  label: string;
  href: string;
  /**
   * Mega-menu link groups — one array per column, all links, no headings.
   * Items without columns are direct links, shallow by design.
   */
  columns?: NavChild[][];
  /** Contextual CTA shown in the mega-menu's featured panel. */
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    /** Asset brief for the featured image — docs/06 §02. */
    imageBrief: string;
  };
}

/**
 * Utility bar links — what a returning parent or student actually comes back
 * for, so they never scroll a persuasion page to reach it.
 *
 * Kept deliberately short. Academic Calendar now sits in the Academics menu and
 * the footer, Download TC and Parent Login are dormant external systems, and
 * Mandatory Public Disclosure keeps its permanent footer slot for regulatory
 * findability — none of them earn a place in a bar this size.
 *
 * `tier` controls how the bar sheds links as it narrows, rather than letting
 * them wrap into a second line:
 *   1 — always visible
 *   2 — hidden below 768px
 * Everything dropped is still reachable from the drawer's Quick Links and the
 * footer, so nothing becomes unreachable.
 */
/**
 * ⚠ THE BAR NOW MIRRORS THE SCHOOL'S OWN TOP BAR, in its order and its wording:
 * Mandatory Public Disclosure · Notice · Contact Us · Apply Online Class Nursery
 * to IX · Apply Online Class XI · Login · Result · Download T.C
 *
 * ⚠ INTERNAL WHERE WE HAVE THE PAGE, EXTERNAL WHERE THE SCHOOL OWNS THE ACTION.
 * The first three open pages on this site — sending a reader out to the old site
 * for a page we have built better is a downgrade. The five that follow are the
 * school's own portals and forms, and they open in a new tab.
 *
 * ⚠ THREE TIERS, BECAUSE EIGHT LINKS PLUS A PHONE NUMBER DO NOT FIT A LAPTOP.
 * The bar sheds by tier rather than wrapping to a second line:
 *   1 — always visible                     Notice · Result
 *   2 — hidden below 1024px                Contact Us · Login · Download T.C
 *   3 — hidden below 1280px                Disclosure · both application forms
 * Everything shed stays reachable from the drawer's Quick Links and the footer,
 * and Mandatory Public Disclosure additionally holds its permanent footer slot
 * for the regulatory reason noted above.
 */
export const utilityLinks = [
  { label: "Mandatory Public Disclosure", href: "/general-info/", tier: 3 },
  { label: "Notice", href: "/news-events/notices/", tier: 1 },
  /* ⚠ CONTACT SITS HERE ON THE CLIENT'S INSTRUCTION. It was removed from the
     MAIN navbar earlier and given to the footer; this is the utility bar above
     it, which is a different row and the one the client asked for. */
  { label: "Contact Us", href: "/contact-us/", tier: 2 },
  { label: "Apply Online Class Nursery to IX", href: school.external.applyFormNurseryToIX, external: true, tier: 3 },
  { label: "Apply Online Class XI", href: school.external.applyFormClassXI, external: true, tier: 3 },
  { label: "Login", href: school.external.parentLogin, external: true, tier: 2 },
  /* ⚠ INTERNAL NOW. These two used to send the reader to the school's own
     pages; both now exist on this site, wrapping the same portal and the same
     lookup. Leaving them pointing outward would have made the new pages
     unreachable from the bar that is supposed to lead to them. */
  { label: "Result", href: "/result/", tier: 1 },
  { label: "Download T.C", href: "/download-tc/", tier: 2 },
] as const;

export const mainNav: NavItem[] = [
  {
    label: "About Us",
    href: "/about/",
    // Audit §1, verbatim. The Chairman, Secretary and other dignitaries are
    // carried inside the History section rather than given their own links.
    columns: [
      [
        {
          label: "Our Journey",
          href: "/about/history-legacy/",
          icon: "school",
          desc: "From Varanasi in 1972 to Agarsanda in 2013.",
          img: imgCampus,
        },
        {
          label: "Vision and Mission",
          href: "/about/vision-mission/",
          icon: "compass",
          desc: "What the school is for, in its own words.",
          img: imgCampus,
        },
        {
          label: "Legacy of the institution",
          href: "/about/history-legacy/#leadership",
          icon: "badge",
          desc: "The Chairman, Secretary and dignitaries behind it.",
          img: imgChairman,
        },
      ],
      [
        {
          label: "Director's Message",
          href: "/about/directors-message/",
          icon: "teacher",
          desc: "Dr. Kunwar Arun Singh on the year ahead.",
          img: imgDirector,
        },
        {
          label: "Principal's Message",
          href: "/about/principals-message/",
          icon: "students",
          desc: "Mrs. Arpita Singh on daily school life.",
          img: imgPrincipal,
        },
        /* ⚠ COLUMN LEVEL, NOT NESTED UNDER ANOTHER ENTRY. MobileNav renders
           item.columns.flat() and never descends into `children`, so anything a
           level deeper than this is desktop-only and invisible on a phone.
           ⚠ NO `img` YET — the Vice Principal's portrait has not been supplied
           (A17), and the nav card falls back to its own default rather than
           borrowing the Principal's photograph. */
        {
          label: "Vice Principal's Message",
          href: "/about/vice-principals-message/",
          icon: "teacher",
          desc: "Mr. Pankaj Singh on academics and resilience.",
          img: imgVicePrincipal,
        },
        // { label: 'Achievements & Recognition', href: '/about/achievements/' },
      ],
    ],
    feature: {
      eyebrow: "Since 1972",
      title: "Fifty years of Sunbeam. Thirteen in Ballia.",
      body: "From 456 students in 2013 to more than 2,700 today.",
      href: "/about/history-legacy/",
      cta: "Our history",
      imageBrief:
        "Campus wide shot, 3:2 — establishing view of the Agarsanda campus",
    },
  },
  {
    label: "Academics",
    href: "/academics/",
    // Audit §2 headings A–F only. The bullets beneath each one are page content,
    // not menu entries — carrying all 49 of them turned the panel into a wall.
    // §8's calendar and planner join them, being §-level items in their own right.
    columns: [
      [
        {
          label: "Academic Philosophy",
          href: "/academics/philosophy/",
          icon: "bulb",
          desc: "Teaching philosophy, curriculum and affiliation.",
          img: imgActivity,
          children: [
            { label: "Teaching Philosophy", href: "/academics/philosophy/teaching-philosophy/", icon: "bulb" },
            { label: "Student-Centred Learning", href: "/academics/philosophy/student-centred-learning/", icon: "hand" },
            { label: "Experiential & Inquiry-Based Learning", href: "/academics/philosophy/experiential-inquiry/", icon: "compass" },
            { label: "Critical Thinking & Creativity", href: "/academics/philosophy/critical-thinking/", icon: "target" },
            { label: "Curriculum", href: "/academics/philosophy/curriculum/", icon: "book" },
            { label: "Affiliation Details", href: "/academics/philosophy/affiliation-details/", icon: "badge" },
          ],
        },
        {
          label: "Academic Structure",
          href: "/academics/structure/",
          icon: "school",
          desc: "Pre-primary to senior secondary, and the streams.",
          img: imgCampus,
          children: [
            { label: "Streams Offered", href: "/academics/structure/streams-offered/", icon: "school" },
            { label: "Subject Combinations", href: "/academics/structure/subject-combinations/", icon: "book" },
            { label: "Pre-Primary", href: "/academics/structure/pre-primary/", icon: "panel" },
            { label: "Primary", href: "/academics/structure/primary/", icon: "target" },
            { label: "Middle School", href: "/academics/structure/middle-school/", icon: "cap" },
            { label: "Secondary", href: "/academics/structure/secondary/", icon: "compass" },
            { label: "Senior Secondary", href: "/academics/structure/senior-secondary/", icon: "badge" },
          ],
        },
        {
          /**
           * ⚠⚠ THIS SITS AT COLUMN LEVEL, NOT NESTED AS A CHILD, AND THAT IS
           * NOT A TIDINESS CHOICE. The mobile drawer renders `columns.flat()`
           * and NEVER DESCENDS INTO `children` — anything a level deeper is a
           * desktop-only link. Class Corner is a parent-facing utility (class
           * teachers, timetable, monitors, exam dates), so it has to be
           * reachable on a phone. It originally shipped nested and was
           * invisible on mobile.
           */
          label: "Class Corner",
          href: "/academics/class-corner/",
          icon: "badge",
          desc: "Class teachers, timetables, monitors and exam dates.",
          img: imgCorridor,
        },
        {
          label: "Teaching & Learning",
          href: "/academics/teaching-learning/",
          icon: "panel",
          desc: "Smart classrooms, STEM, robotics and the labs.",
          img: imgComputer,
          /* ⚠ SIX CHILDREN FOR FOURTEEN BULLETS. The grouping is the school's
             own — the six blocks the /academics/teaching-learning/ page is
             already built from, whose eyebrows name them. See the mapping table
             in data/teachingTopics.ts. */
          children: [
            { label: "Teaching Methodology", href: "/academics/teaching-learning/methodology/", icon: "bulb" },
            { label: "Smart Classrooms & Digital Literacy", href: "/academics/teaching-learning/smart-classrooms/", icon: "panel" },
            { label: "Experiential & Project-Based Learning", href: "/academics/teaching-learning/experiential-learning/", icon: "hand" },
            { label: "STEM, Robotics & Enrichment", href: "/academics/teaching-learning/stem-robotics/", icon: "target" },
            { label: "Reading, Language & Library", href: "/academics/teaching-learning/reading-language/", icon: "book" },
            { label: "Laboratories & Academic Clubs", href: "/academics/teaching-learning/laboratories-clubs/", icon: "school" },
          ],
        },
        {
          label: "Assessment Pattern",
          href: "/academics/assessment/",
          icon: "badge",
          desc: "Assessment, homework, PTMs and remedial support.",
          img: imgChem,
          /* Audit §2.D names seven topics under Assessment Pattern and marks
             them MUST. Each now has a page: five new ones under this route, and
             two that already existed and were NOT duplicated —

               · Assessment System is this page. The six-step cycle on it is
                 exactly that topic, so the row points at the parent rather than
                 minting a second page that repeats it.
               · Academic Calendar keeps its own route, which audit §8 requires
                 as an interactive page. A second calendar would split one
                 destination in two and one of them would go stale.

             ⚠ EVERY href IS A ROUTE, NOT AN ANCHOR. An earlier pass pointed four
             of these at `#homework`-style sections on the parent page. Those are
             now pages, so the anchors are gone and the hrefs move with them —
             leaving them would have produced exactly the submenu of dead anchors
             the note on `children` warns about. */
          /* ⚠ EVERY GLYPH IS ONE ALREADY IN FacIcon, not a new drawing. Seven
             bespoke icons would be seven more shapes to keep consistent with a
             set of fifty that already share a stroke weight and corner radius.
             `panel` stands in for the calendar because the set has no calendar
             — it is a ruled board, which is the nearest true thing rather than
             a wrong metaphor. */
          children: [
            { label: "Assessment System", href: "/academics/assessment/", icon: "target" },
            { label: "Homework Policy", href: "/academics/assessment/homework-policy/", icon: "book" },
            { label: "Remedial Support", href: "/academics/assessment/remedial-support/", icon: "hand" },
            /* ⚠ `compass`, NOT `teacher`. `teacher` and `panel` both draw a
               board-and-stand and rendered as near-twins at 15px, so Mentoring
               and Academic Calendar were two rows a reader could not tell
               apart. Guidance is the better metaphor anyway. */
            { label: "Mentoring", href: "/academics/assessment/mentoring/", icon: "compass" },
            { label: "Academic Calendar", href: "/academics/academic-calendar/", icon: "panel" },
            { label: "Parent–Teacher Meetings", href: "/academics/assessment/parent-teacher-meetings/", icon: "speech" },
            { label: "Competitive Exam Preparation", href: "/academics/assessment/competitive-exam-preparation/", icon: "cap" },
          ],
        },
      ],
      [
        {
          label: "Career Development & Student Success",
          href: "/academics/student-success/",
          icon: "cap",
          desc: "Counselling, board results, olympiads, scholarships.",
          img: imgPrincipal,
          children: [
            { label: "Career Guidance", href: "/academics/student-success/career-guidance/", icon: "compass" },
            { label: "University Counselling", href: "/academics/student-success/university-counselling/", icon: "cap" },
            { label: "Subject Selection Guidance", href: "/academics/student-success/subject-selection/", icon: "target" },
            { label: "Alumni Interaction", href: "/academics/student-success/alumni-interaction/", icon: "speech" },
            { label: "Board Results", href: "/academics/board-results/", icon: "badge" },
            { label: "Olympiad Achievements", href: "/academics/student-success/olympiad-achievements/", icon: "star" },
            { label: "Scholarships", href: "/academics/student-success/scholarships/", icon: "bulb" },
            { label: "Student Success Stories", href: "/academics/student-success/success-stories/", icon: "hand" },
          ],
        },
        {
          label: "Parent Partnership",
          href: "/academics/parent-partnership/",
          icon: "heart",
          desc: "Orientation, forum, workshops and communication.",
          img: imgCampus,
          children: [
            { label: "Parent Orientation", href: "/academics/parent-partnership/parent-orientation/", icon: "hand" },
            { label: "Parents’ Forum", href: "/academics/parent-partnership/parents-forum/", icon: "speech" },
            { label: "Workshops & Webinars", href: "/academics/parent-partnership/workshops-webinars/", icon: "panel" },
            { label: "School–Parent Communication", href: "/academics/parent-partnership/school-parent-communication/", icon: "mail" },
            { label: "Parent Engagement Initiatives", href: "/academics/parent-partnership/parent-engagement/", icon: "star" },
            { label: "Frequently Asked Questions", href: "/academics/parent-partnership/faqs/", icon: "bulb" },
            /* ⚠ THE ONE ENTRY IN THIS GROUP WHOSE PATH SITS OUTSIDE THE SECTION.
               /parents-feedback/ is a top-level route on the client’s
               instruction; it is listed here because this is where a parent
               looks for it, and without the entry the page is an orphan. */
            { label: "Parents’ Feedback", href: "/parents-feedback/", icon: "speech" },
          ],
        },
        // §8, kept as the single item the audit names it.
      ],
    ],
    feature: {
      eyebrow: "Teaching & Learning",
      title: "A Microsoft Showcase School",
      body: "100 teachers certified as Innovative Educator Experts.",
      href: "/academics/teaching-learning/",
      cta: "How we teach",
      imageBrief:
        "Robotics lab in use, 3:2 — students operating equipment, teacher present",
    },
  },
  {
    label: "Campus Tour",
    href: "/campus/",
    // Audit §3's facility list verbatim, with Facilities and Infrastructure
    // merged into the tour rather than kept as separate menu sections. §7 adds
    // Transport, named exactly as the audit names it.
    columns: [
      [
        {
          label: "Campus Tour",
          href: "/campus/",
          icon: "field",
          desc: "Sixty-eight photographs, room by room.",
          img: imgCampus,
        },
        {
          label: "Safety & Security",
          href: "/campus/safety-security/",
          icon: "shield",
          desc: "Guards, CCTV, fire equipment and transport.",
          img: imgCampus,
        },
        {
          label: "Facilities & Infrastructure",
          href: "/campus/facilities-infrastructure/",
          icon: "flask",
          desc: "Forty-seven facilities across six groups.",
          img: imgLibrary,
        },
      ],
    ],
    feature: {
      eyebrow: "The Campus",
      title: "An archery range, and 17,574 books",
      body: "Facilities most district schools simply do not have.",
      href: "/campus/",
      cta: "Take the tour",
      imageBrief:
        "Shooting range in use, 3:2 — the rarest facility the school has",
    },
  },
  {
    label: "Beyond Academics",
    /* POINTS AT THE SPORTS PAGE, NOT AT A SECTION INDEX, because there is no
       section index: `/beyond-academics/` is a 404 and clicking the top-level
       item took the reader nowhere. Sports & Games is the only page built under
       this branch, so it is where the parent leads until an index exists.
       Restore this to "/beyond-academics/" the moment that page is built. */
    href: "/beyond-academics/sports/",
    // Audit §4 headings only — facilities, games, participation, inter-house and
    // coaching are bullets under "Sports & Games", so they live on that page.
    // Achievements stay a separate entry because §4 asks for them shown apart.
    // §5 keeps School Activities here.
    columns: [
      [
        {
          label: "Sports & Games",
          href: "/beyond-academics/sports/",
          icon: "ball",
          desc: "Fifteen sports, indoor and outdoor.",
          img: imgBasket,
        },
        {
          label: "Achievements",
          href: "/beyond-academics/achievements/",
          icon: "target",
          desc: "District, state and national honours.",
          img: imgJosh,
        },
        {
          label: "Excursions & Educational Tours",
          href: "/beyond-academics/excursions/",
          icon: "globe",
          desc: "Trips, expeditions and field visits.",
          img: imgJosh,
        },
        /* ⚠ THE LABEL IS ONE OF FOUR THINGS THAT MOVE TOGETHER — see the header
           of src/pages/beyond-academics/ncc-scouts-guides.astro. If this is
           ever narrowed to just "NCC" or just "Scouts", the page titles, the
           meta description and the CMS group names all have to follow.
           ⚠ COLUMN LEVEL, NOT NESTED. MobileNav renders item.columns.flat()
           and never descends into `children`, so a deeper entry would be
           desktop-only and invisible on a phone. */
        {
          label: "NCC, Scouts & Guides",
          href: "/beyond-academics/ncc-scouts-guides/",
          icon: "shield",
          desc: "Cadets, the troop, and the district meeting.",
        },
        /* ⚠ COLUMN LEVEL, NOT NESTED — same reason as the entry above: the
           mobile drawer renders columns.flat() and never descends into
           `children`. A page naming twenty-six students by name has to be
           reachable on the phone those students' parents are holding. */
        {
          label: "Student Council",
          href: "/beyond-academics/student-council/",
          icon: "badge",
          desc: "The senior and junior councils, and the posts they hold.",
          img: imgInvestiture,
        },
        /* UNDER BEYOND ACADEMICS BECAUSE THAT IS WHERE THE SCHOOL PUTS IT —
           the live site's footer lists Publications in its BEYOND ACADEMICS
           column. The path matches the live URL, /publications/, so it sits
           outside this branch's directory; that is deliberate and the same
           exception /parents-feedback/ makes. Without this entry the page is an
           orphan. */
        {
          label: "Publications",
          href: "/publications/",
          icon: "book",
          desc: "Club newsletters, magazines and the e-newspaper.",
          img: imgLibrary,
        },
      ],
    ],
    feature: {
      eyebrow: "Beyond Academics",
      title: "Every child plays",
      // 15 = the school's own published lists: 7 indoor + 8 outdoor. The house
      // count is NOT verified anywhere on the live site, so it is not claimed.
      body: "Fifteen sports, indoor and outdoor, and room to take part.",
      href: "/beyond-academics/sports/",
      cta: "Sport at Sunbeam",
      imageBrief: "Sports participation mid-game, 3:2 — not a podium shot",
    },
  },
  // §5 · School Activities — its own numbered section, so its own menu item.
  {
    label: "School Activities",
    href: "/beyond-academics/school-activities/",
  },
  // §6 · "The Career section should be available directly on the main
  // navigation menu for easier accessibility to prospective applicants."
  { label: "Career", href: "/career/" },
  // §7 · Transport.
  { label: "Transport", href: "/campus/transport/" },
  // §8 · School Planner & Academic Calendar. Also kept inside the Academics
  // menu, because §8 asks for it to sit under Academics as well.

  {
    label: "News & Events",
    href: "/news-events/",
    /* ⚠ FOUR ROUTES AND TWO ANCHORS — the split is by how much content there is,
       not by taste.

       Audit §11 names six things this section must keep current. Four of them
       turned out to have a page's worth of published material behind them once
       the school's own site was read properly: fourteen workshops with named
       trainers, thirty-five dated events, a full district-championship results
       table. Those get routes — /news-events/workshops/, /competitions/,
       /celebrations/, /school-events/ — built from data/newsPages.ts.

       The other two do NOT, and forcing a route on them would produce two thin
       pages that rot:
         · Recent achievements → /beyond-academics/achievements/ already exists.
           A second achievements page splits one story across two URLs and one
           of them goes stale.
         · Important announcements → the school's own /notice/ and
           /admission-notice/ pages are EMPTY. There is nothing to build from
           until assets A7 and C7 land, so it stays a section on the index.

       An earlier pass removed this dropdown entirely, when it held only "News &
       Events" and "Notices" — two rows for one page, which was a menu that
       existed to look like a menu. Six named destinations is a different thing.

       ⚠ THE TWO REMAINING ANCHOR hrefs MUST MATCH A SECTION id ON THE INDEX:
       `achievements` and `announcements`, set from `streams` in
       data/newsEvents.ts. Rename an id there and this menu points at nothing,
       silently. */
    columns: [
      [
        {
          label: "Recent achievements",
          href: "/news-events/#achievements",
          icon: "badge",
          desc: "What the school has just won.",
          img: imgCampus,
        },
        {
          label: "School events",
          href: "/news-events/school-events/",
          icon: "hall",
          desc: "The guests it brings through the gate.",
          img: imgCampus,
        },
        {
          label: "Competitions",
          href: "/news-events/competitions/",
          icon: "target",
          desc: "Entered, hosted, and placed.",
          img: imgCampus,
        },
      ],
      [
        {
          label: "Workshops",
          href: "/news-events/workshops/",
          icon: "speech",
          desc: "How the school trains its teachers.",
          img: imgCampus,
        },
        {
          label: "Celebrations",
          href: "/news-events/celebrations/",
          icon: "music",
          desc: "The school year, marked.",
          img: imgCampus,
        },
        /* ⚠ REMOVED WITH THE STREAM IT POINTED AT. The News & Events index
           now shows achievements alone, so #announcements is an anchor to a
           section that is no longer in the document — the browser loads the page
           and silently does not scroll, which reads as a broken link. The
           announcements DATA is still in newsEvents.ts; restore this entry the
           moment those items get a section or a page of their own. */
      ],
    ],
    feature: {
      eyebrow: "Notice Board",
      title: "Official notices, in one place",
      body: "Circulars and announcements as they are issued.",
      href: "/news-events/notices/",
      cta: "Read notices",
      imageBrief:
        "Notice board or assembly announcement, 3:2 — documentary, not staged",
    },
  },
  {
    label: "Alumni",
    href: "/alumni/",
    // Audit §12.2 — "Include an Alumni Registration form to encourage former
    // students to reconnect with the school."
    columns: [
      [
        {
          label: "Alumni",
          href: "/alumni/",
          icon: "students",
          desc: "Where Sunbeam Ballia students are now.",
          img: imgCampus,
        },
        {
          label: "Alumni Registration",
          href: "/alumni/registration/",
          icon: "badge",
          desc: "Reconnect with the school and your year group.",
          img: imgLibrary,
        },
      ],
    ],
    feature: {
      eyebrow: "Alumni",
      title: "Tell us where you are now",
      body: "Register to reconnect with the school and with your year group.",
      href: "/alumni/registration/",
      cta: "Register",
      imageBrief:
        "Alumni gathering or returning student on campus, 3:2 — candid",
    },
  },
  /* ⚠⚠ UNIFORM CATALOGUE CAME OUT OF THE MAIN BAR AGAIN, and the reason is
     measurement, not taste. It was added here only while the Apply Online pill
     was absent; with Admissions back in that slot the row needs the width, and
     ten labels plus a pill wrapped “Alumni” onto a second line at 1280-1920.
     It is not orphaned — footerUtility below still carries it, and so does the
     mobile drawer’s Quick Links. */
];

/**
 * Footer utility row — docs/06 §16 row 2. Also the safety net for what the top
 * bar sheds: Mandatory Public Disclosure is CBSE-required and must stay
 * findable regardless of how short the utility bar gets.
 */
export const footerUtility = [
  { label: "Admissions", href: "/admissions/" },
  { label: "Uniform Catalogue", href: "/admissions/uniform-catalogue/" },
  {
    label: "Notices",
    href: "/news-events/notices/",
    icon: "log",
    desc: "Official circulars as they are issued.",
    img: imgCampus,
  },
  { label: "Latest News & Events", href: "/news-events/" },
  {
    label: "Alumni",
    href: "/alumni/",
    icon: "students",
    desc: "Where Sunbeam Ballia students are now.",
    img: imgCampus,
  },
  {
    label: "Alumni Registration",
    href: "/alumni/registration/",
    icon: "badge",
    desc: "Reconnect with the school and your year group.",
    img: imgLibrary,
  },
    { label: "Career", href: "/career/" },
  // { label: "Results", href: school.external.results },
  // { label: "Download TC", href: school.external.downloadTC },
  {
    label: "Mandatory Public Disclosure",
    href: "/general-info/",
  },
  { label: "Contact", href: "/contact-us/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "Accessibility", href: "/accessibility/" },
] as const;
