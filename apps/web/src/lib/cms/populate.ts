/**
 * WHAT EACH CONTENT TYPE HAS TO ASK FOR.
 *
 * ═══ WHY THIS IS ONE FILE AND NOT AN ARGUMENT AT EVERY CALL SITE ═══════════
 *
 * Strapi returns scalar fields only. Relations, components, media and dynamic
 * zones come back ABSENT unless the query names them — and absent, not
 * errored. A page that forgets to populate its image renders a card with no
 * poster, no warning anywhere, and a build that goes green.
 *
 * Keeping the specs here means each is written once and reused by every query
 * that needs it, so a field added to a content type is populated everywhere the
 * moment it is added here.
 *
 * ⚠ `populate: '*'` IS A TRAP AND IS NOT USED IN THIS PROJECT. It goes exactly
 * one level deep. It looks like it works — the relation comes back, the object
 * is there — and everything nested inside is quietly missing. That is harmless
 * for a flat media field and actively misleading once a dynamic zone exists,
 * where the components arrive populated and their images do not. Naming fields
 * explicitly costs a line and fails visibly instead.
 */
import type { QueryObject } from './client';

/** A notice is flat: a title, some text, and one poster. */
export const NOTICE_POPULATE: QueryObject = {
  image: true,
};

/**
 * A major achievement carries a poster and a repeatable component.
 *
 * ⚠ `facts` MUST BE NAMED. It is a component, and components are exactly the
 * thing that comes back missing rather than errored when unpopulated — the card
 * would render its heading, its poster and its detail, and simply have no
 * itemised proof under them, on a build that reported success.
 */
export const MAJOR_POPULATE: QueryObject = {
  art: true,
  facts: true,
};

/* Credentials and achievement records are entirely scalar — no relations, no
   components, no media — so they need no populate at all. Named here anyway so
   the absence is visibly a decision rather than an oversight. */
export const CREDENTIAL_POPULATE: QueryObject = {};
/**
 * The three band headings on Beyond Academics → Achievements, plus the two
 * record-board headers.
 *
 * ⚠ `body: true` IS THE STANDFIRST. structure.section keeps its standfirst as
 * body[0].text — a repeatable paragraph component — so without populating it
 * every band loses its opening line and silently falls back to the default.
 */
export const ACHIEVEMENTS_PAGE_POPULATE = {
  majors: { populate: { body: true } },
  recognition: { populate: { body: true } },
  record: { populate: { body: true } },
  recordBoards: true,
} as const;

export const ACHIEVEMENT_RECORD_POPULATE: QueryObject = {};

/* ── CAREER ──────────────────────────────────────────────────────────────── */

export const JOB_POSTING_POPULATE: QueryObject = {
  image: true,
};

/**
 * ⚠ THE TWO BAND HEADS NEED `body` POPULATED — it is shared.paragraph[] and
 * carries the line under each heading. `wall: true` returns the head with an
 * undefined stand, which then shows the default for ever.
 */
export const CAREER_PAGE_POPULATE: QueryObject = {
  wall: { populate: { body: true } },
  apply: { populate: { body: true } },
  applyMethods: true,
};

/* ── ALUMNI ──────────────────────────────────────────────────────────────── */

export const ALUMNUS_POPULATE: QueryObject = {
  poster: true,
};

/**
 * ⚠⚠ THE NESTED `{ populate: { image: true } }` IS THE WHOLE POINT OF THIS FILE.
 *
 * `gallery: true` populates the component array — you get the right number of
 * entries, each with its alt and caption — AND EVERY `image` IS MISSING. The
 * page renders a gallery of the correct length containing nothing, on a build
 * that reports success. Media inside a component needs its own populate, one
 * level deeper, every time.
 */
export const ALUMNI_MEET_POPULATE: QueryObject = {
  cover: true,
  description: true,
  gallery: { populate: { image: true } },
};

export const ALUMNI_STORY_POPULATE: QueryObject = {
  photo: true,
  story: true,
  gallery: { populate: { image: true } },
};

/* ── ACADEMIC CALENDAR ───────────────────────────────────────────────────── */

export const CALENDAR_DOCUMENT_POPULATE: QueryObject = {
  image: true,
  document: true,
  sheets: { populate: { image: true } },
};

export const ACADEMIC_CALENDAR_PAGE_POPULATE: QueryObject = {
  carries: true,
  planning: true,
  shots: { populate: { image: true } },
  seo: { populate: { ogImage: true } },
};

/* ── GLOBAL ──────────────────────────────────────────────────────────────── */

/**
 * ⚠ EVERY COMPONENT NAMED. site-setting is entirely components — address,
 * contact, social, external links, affiliation, the motto parts, the streams
 * and the quick-access tiles. Miss one and that whole group silently vanishes
 * from 57 pages at once, which is the single widest blast radius in the site.
 */
export const SITE_SETTINGS_POPULATE: QueryObject = {
  mottoParts: true,
  streams: true,
  address: true,
  contact: true,
  social: true,
  external: true,
  affiliation: true,
  quickAccess: true,
};

/** Route metadata. `seo.ogImage` and the banner are media, one level down. */
export const PAGE_META_POPULATE: QueryObject = {
  seo: { populate: { ogImage: true } },
  heroBanner: true,
  crumbs: true,
};

/* ── NEWS ────────────────────────────────────────────────────────────────── */

/**
 * ⚠ THE GALLERY'S IMAGES NEED THEIR OWN POPULATE, one level deeper. `gallery:
 * true` returns the right number of entries with their alt text and no
 * photographs at all — 241 of them, silently.
 */
export const NEWS_ITEM_POPULATE: QueryObject = {
  art: true,
  gallery: { populate: { image: true } },
};

/** The index page header. `groups` is a flat component — no nested media. */
export const NEWS_CATEGORY_PAGE_POPULATE: QueryObject = {
  groups: true,
};

/* ── CAMPUS / FACILITIES / TRANSPORT (G4) ────────────────────────────────── */

export const BUS_ROUTE_POPULATE: QueryObject = { stops: true };

/** ⚠ Nested media again — `gallery: true` alone returns entries with no photo. */
export const CAMPUS_FACILITY_POPULATE: QueryObject = {
  gallery: { populate: { image: true } },
};

/**
 * ⚠ THE BAND HEADS NEED `body` POPULATED, NOT JUST THE COMPONENT. `body` is
 * shared.paragraph[] and carries the standfirst; `timeline: true` returns the
 * head with its eyebrow and heading and an undefined stand, which then falls
 * back to the default for ever and looks like the CMS value is ignored.
 */
const BAND = { populate: { body: true } };

export const TRANSPORT_PAGE_POPULATE: QueryObject = {
  overview: BAND,
  overviewFigures: true,
  finder: BAND,
  safetyHead: BAND,
  contactHead: BAND,
  safety: true,
};

/** `groups` contains a repeatable component of its own, so it needs naming too. */
export const FACILITIES_PAGE_POPULATE: QueryObject = {
  figures: BAND,
  kpis: true,
  groups: { populate: { items: true } },
  whyCards: true,
  progression: true,
};

/**
 * ⚠ THE BAND HEADINGS ARE COMPONENTS, SO THEY MUST BE NAMED HERE. Strapi
 * returns a component field as `undefined` unless it is populated — there is no
 * error and no warning, so a heading added to the schema but forgotten here
 * simply falls back to its default for ever and looks like the CMS value is
 * being ignored.
 *
 * ⚠ `featured` NEEDS ITS `tags` POPULATED TOO. `tags` is itself a component
 * (shared.fact[]) inside shared.point; `featured: true` returns the points with
 * their highlights missing.
 */
export const CAMPUS_TOUR_PAGE_POPULATE: QueryObject = {
  overview: true,
  overviewStats: true,
  categories: true,
  gallery: true,
  featuredHead: true,
  featured: { populate: { tags: true } },
  journeyHead: true,
  journey: true,
  visit: true,
};

export const CAMPUS_SAFETY_PAGE_POPULATE: QueryObject = {
  timeline: BAND,
  plan: BAND,
  transport: BAND,
  transportFigures: true,
  wellbeing: BAND,
  surveillance: BAND,
  safetyGroups: { populate: { measures: true } },
  mapPoints: true,
  emergencySteps: true,
  emergencyPoints: true,
  transportFeatures: true,
  wellbeingCards: true,
  surveillanceCards: true,
};

/* ── SPORTS / EXCURSIONS / ACTIVITIES (G5) ───────────────────────────────── */

export const SPORT_FACILITY_POPULATE: QueryObject = {
  notes: true,
  lead: true,
  support: { populate: { image: true } },
};

export const GAME_POPULATE: QueryObject = { photo: true };

/** `podiums.places` is a component inside a component — two levels down. */
export const SPORTS_RECORD_POPULATE: QueryObject = {
  podiums: { populate: { places: true } },
  shots: { populate: { image: true } },
};

export const EXCURSION_SECTION_POPULATE: QueryObject = {
  body: true,
  art: true,
  shots: { populate: { image: true } },
};

export const EXPEDITION_POPULATE: QueryObject = {};

/** `ladder.items` is likewise nested one level deeper than the rung itself. */
export const SPORTS_PAGE_POPULATE: QueryObject = {
  figures: true,
  ladder: { populate: { items: true } },
  coaching: true,
};

/* ── HOMEPAGE & ABOUT (G6) ───────────────────────────────────────────────── */

/**
 * ⚠ WRITTEN OUT IN FULL RATHER THAN `'*'`. A single-type this wide has media
 * two levels down — `facilities.shots.image`, `events.image`,
 * `affiliations.logo` — and `populate: '*'` stops at one level, which would
 * return the components with their pictures missing and no error to show for
 * it. Every nested media field is named here on purpose.
 */
export const HOMEPAGE_POPULATE: QueryObject = {
  heroActions: true,
  heroStats: true,
  heroSlides: { populate: { image: true } },
  storyParagraphs: true,
  storyChecks: true,
  storyStat: true,
  storyCta: true,
  storyLinks: true,
  storyPhotos: { populate: { image: true } },
  stages: { populate: { photo: true } },
  learningParagraphs: true,
  learningPhoto: { populate: { image: true } },
  learningEvidence: true,
  learningLink: true,
  facilities: { populate: { shots: { populate: { image: true } } } },
  voicesItems: { populate: { photo: true } },
  beyondSport: { populate: { photo: true } },
  beyondStrands: { populate: { photo: true } },
  beyondLinks: true,
  principalCta: true,
  events: { populate: { image: true } },
  affiliations: { populate: { logo: true } },
  achievementsLead: true,
  achievementsLeadCta: true,
  achievementsPhotos: { populate: { image: true } },
  achievementsInstitutional: true,
  achievementsStudent: true,
};

export const LEADER_MESSAGE_POPULATE: QueryObject = {
  paragraphs: true,
  fullMessage: true,
  credentials: true,
  portrait: true,
};

export const VISION_MISSION_POPULATE: QueryObject = {
  cipher: true,
  greeting: true,
  /* ⚠ NAMED, NOT COVERED BY A PARENT `true`. A component left out of a
     populate spec arrives undefined, and the page would render as though the
     school had written nothing. */
  sections: { populate: { body: true, points: true } },
};

export const HISTORY_PAGE_POPULATE: QueryObject = {
  history: true,
  facts: true,
  onward: true,
  voices: { populate: { portrait: true, paragraphs: true } },
};

/* ── DISCLOSURE / UNIFORM / SERVICES / CONTACT (G7) ──────────────────────── */

/**
 * ⚠ THE TWO DOCUMENT LISTS AND THE CALLOUT PHOTO EACH HOLD MEDIA ONE LEVEL
 * DOWN, and `boardResults` holds a component inside a component. `populate: '*'`
 * reaches none of them: it would return thirteen certificates with no file and
 * three result years with no figures, and nothing would error.
 */
export const DISCLOSURE_POPULATE: QueryObject = {
  sections: true,
  quickInfo: true,
  sourcePdfFile: true,
  generalInformation: true,
  certificates: { populate: { file: true } },
  academicDocs: { populate: { file: true } },
  boardResults: { populate: { classX: true, classXii: true } },
  staffSummary: true,
  infrastructure: true,
  calloutPhoto: { populate: { image: true } },
};

export const UNIFORM_POPULATE: QueryObject = {
  catalogues: { populate: { file: true } },
  classGroups: true,
  seasons: true,
  shoeRows: true,
  notes: true,
};

export const RESULT_PAGE_POPULATE: QueryObject = {
  points: true,
  cardPhoto: { populate: { image: true } },
  closePhoto: { populate: { image: true } },
};

export const TC_PAGE_POPULATE: QueryObject = {
  help: true,
  photo: { populate: { image: true } },
};

export const CONTACT_PAGE_POPULATE: QueryObject = { fields: true, classOptions: true };

/* ── ACADEMICS (G8) ──────────────────────────────────────────────────────── */

/**
 * ⚠ THREE LEVELS DEEP IN PLACES. A section holds a stream, which holds three
 * subject lists; a section holds a point, which holds a photograph. `populate:
 * '*'` reaches the section and stops — every page would render its headings and
 * none of its content, and nothing would error.
 */
export const ACADEMIC_TOPIC_POPULATE: QueryObject = {
  body: true,
  /* The page's own keyed photographs. One level down, so it needs naming. */
  photos: { populate: { image: true } },
  points: { populate: { image: true, tags: true, children: true } },
  sections: {
    populate: {
      body: true,
      points: { populate: { image: true, tags: true, children: true } },
      details: { populate: { links: true } },
      facts: true,
      figures: true,
      stats: true,
      links: true,
      photos: { populate: { image: true } },
      streams: { populate: { core: true, optional: true, additional: true } },
      awards: { populate: { image: true } },
      stories: { populate: { image: true, poster: true } },
      results: { populate: { image: true } },
      faqs: { populate: { answers: true, cta: true } },
    },
  },
};

/**
 * The Teaching Philosophy page — six named sections, each a component with its
 * own media. `populate: '*'` reaches the components but not the images inside
 * them, which is the whole reason these specs are written out.
 */
export const TEACHING_PHILOSOPHY_POPULATE: QueryObject = {
  sectionOne: { populate: { body: true, image: true } },
  sectionTwo: { populate: { body: true, imageUpper: true, imageLower: true } },
  sectionThree: { populate: { body: true, image: true, cards: { populate: { icon: true } } } },
  sectionFour: { populate: { body: true, image: true } },
  sectionFive: { populate: { body: true, image: true } },
  close: { populate: { headingLines: true, image: true } },
};

/** Experiential & Inquiry — two shared shapes and two of its own. */
export const EXPERIENTIAL_POPULATE: QueryObject = {
  sectionOne: { populate: { body: true, imageUpper: true, imageLower: true } },
  sectionTwo: { populate: { headingWords: true, steps: { populate: { photo: true, icon: true } } } },
  sectionThree: { populate: { body: true, entries: true, imageOne: true, imageTwo: true, imageThree: true } },
  close: { populate: { headingLines: true, image: true } },
};

/** Curriculum — the stages, two openings and three runs of cards. */
export const CURRICULUM_POPULATE: QueryObject = {
  stages: { populate: { classes: { populate: { file: true } } } },
  sectionOne: { populate: { body: true } },
  sectionTwo: { populate: { body: true } },
  sectionThree: { populate: { tiles: { populate: { file: true } } } },
  sectionFour: { populate: { tiles: { populate: { file: true } } } },
  sectionFive: { populate: { tiles: { populate: { file: true } } } },
};

/** Critical Thinking — a credited statement, two marked lists and a collage. */
export const CRITICAL_THINKING_POPULATE: QueryObject = {
  sectionOne: { populate: { body: true, image: true } },
  sectionTwo: { populate: { body: true, marks: true, imageOne: true, imageTwo: true } },
  sectionThree: { populate: { body: true, marks: true, imageOne: true, imageTwo: true } },
  sectionFour: { populate: { index: true, body: true, imageOne: true, imageTwo: true, imageThree: true } },
};

/** Student-Centred Learning — three shared shapes and one collage. */
export const STUDENT_CENTRED_POPULATE: QueryObject = {
  sectionOne: { populate: { body: true, image: true } },
  sectionTwo: { populate: { index: true, body: true, imageOne: true, imageTwo: true, imageThree: true } },
  sectionThree: { populate: { body: true, image: true, cards: { populate: { icon: true } } } },
  close: { populate: { headingLines: true, image: true } },
};

/* ── PUBLICATIONS ───────────────────────────────────────────── */

/**
 * The Publication collection is entirely scalar — title, href, group, order —
 * so it needs no populate at all. Only the page's two component lists do.
 */
/**
 * NCC, Scouts & Guides.
 *
 * ⚠ THE NESTED MEDIA MUST BE NAMED. `groups` is a component holding components,
 * one of which carries an image; populating `groups: true` returns the groups
 * with empty photo rows and no error.
 */
/**
 * ⚠ `image` MUST BE NAMED. `sheets` is a component carrying a media field, and
 * a component populated with `true` comes back WITHOUT its media — the page
 * then renders a class with the right number of sections and no pictures.
 */
export const CLASS_CORNER_POPULATE = {
  file: true,
} as const;

export const CLASS_TIMETABLE_POPULATE = {
  sheets: { populate: { image: true } },
} as const;

/* ⚠ EVERY COMPONENT LIST IS NAMED. A repeatable component that is not listed
   here arrives undefined, and the council page renders as though the school
   had published a board with nobody on it. */
export const STUDENT_COUNCIL_POPULATE = {
  board: true,
  seniorOffices: true,
  seniorPosts: true,
  juniorOffices: true,
  juniorPosts: true,
} as const;

export const ADVISORY_COUNCIL_POPULATE = {
  board: true,
  advisors: true,
} as const;

export const UNIFORMED_GROUPS_POPULATE = {
  intro: { populate: { body: true } },
  groups: {
    populate: {
      facts: true,
      /* ⚠ NAMED, NOT COVERED BY A PARENT `true`. A component that is not listed
         here simply arrives undefined, and the page renders as though the
         school had not supplied any officers. */
      officers: true,
      record: true,
      photos: { populate: { image: true } },
    },
  },
} as const;

export const PUBLICATIONS_PAGE_POPULATE: QueryObject = {
  groupHeadings: true,
  /* ⚠ `image` MUST BE NAMED. myraPages is a component carrying a media field,
     and a component populated with `true` comes back without its media — the
     rail would render five alt strings attached to nothing. */
  myraPages: { populate: { image: true } },
};
