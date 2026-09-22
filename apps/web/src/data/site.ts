/**
 * VERIFIED SCHOOL FACTS — single source of truth.
 *
 * Every value below was extracted from the live site (sunbeamballia.edu.in) or
 * read directly off the official logo artwork, and is recorded in
 * docs/01-existing-site-analysis.md § 5 "Verified facts inventory".
 *
 * RULE: nothing may be added to this file that the school has not published.
 * Unverified content belongs in `pending` with a docs/07 asset-request id.
 */

/**
 * Build-note switch. The outstanding-asset callouts are for the team, not for
 * parents — flip to false for any client preview or launch.
 */
export const showBuildNotes = false;

export const school = {
  name: 'Sunbeam School Ballia',
  shortName: 'Sunbeam Ballia',

  /**
   * Motto — read from the crest ring on the official logo artwork.
   * Text extraction never surfaced this; it is only visible in the emblem.
   * The strongest Sunbeam-specific brand asset available to the design.
   */
  motto: 'Duty · Devotion · Discipline',
  mottoParts: ['Duty', 'Devotion', 'Discipline'],

  /** Group phrase, used by Sunbeam group-wide. Confirm primacy — asset A3. */
  groupPhrase: 'Lighting the Lamp of Knowledge',
  /** Tagline in use on the Ballia site. Confirm primacy — asset A3. */
  tagline: 'Educating the FUTURE!',

  /**
   * ⚠ THE SWITCH BEHIND THE HEADER'S ADMISSIONS BUTTON.
   *
   * The client asked that Admissions live in the header and draw attention
   * "once admission opens". That is a state, not a permanent style, so it is a
   * flag rather than a hard-coded animation: true makes the header button pulse,
   * false leaves it as an ordinary button that still works. Flip this one value
   * when the intake closes — nothing else needs touching.
   */
  admissionsOpen: true,

  established: 2013,
  groupFounded: 1972,
  groupFoundedAt: 'Varanasi',
  /* ⚠ THE FOUNDER MOTHER IS NAMED NOW. This read “and his wife”, which the
     school’s own notice board contradicts: its remembrance poster names her
     Mrs. Deesh Ishrat Madhok, Founder Mother of Sunbeam (data/notices.ts).
     The client supplied the same name. A co-founder who is only “his wife” on
     a school’s own history page is a small erasure worth undoing. */
  /* ⚠ TYPOGRAPHIC QUOTES, NOT APOSTROPHES. The nickname was set with straight
     '...' — a prime mark, not a quotation mark — while every other quoted
     phrase on the site curls. The client writes it ‘Ishrat’ too. */
  founders: "Dr. Amrit Lal ‘Ishrat’ Madhok and Mrs. Deesh ‘Ishrat’ Madhok",

  openingStrength: 456,
  currentStrength: '2,700+',
  teachingStaff: '130+',

  board: 'CBSE',
  boardFull: 'Central Board of Secondary Education, Delhi',
  affiliationNo: '2131962',
  schoolCode: '70205',

  /**
   * ⚠ READ OFF THE BOARD'S OWN LETTER, NOT OFF A SCHOOL PAGE. Everything in
   * this block comes from AFFL.pdf — the Affiliation/Upgradation Letter the
   * school publishes at item 01 of its Mandatory Public Disclosure. The
   * /affiliation/ page carries only the number and the code; the letter carries
   * the period, the letter number and the UDISE code.
   *
   *   NO : CBSE/2131962/EX-00497-2526/2025-26/        Dated: 13/03/2024
   *   SUBJECT: Extension of General Affiliation up to Senior Secondary Level
   *   Affiliation No used as User ID for both OASIS and LOC/Registration → 2131962
   *   School No → 70205 · Affiliated for → Extension of General Affiliation
   *   Category → Extension of Affiliation
   *   Period of affiliation → 01.04.2025 to 31.03.2030
   *
   * ⚠ THE UDISE CODE IS OFF THE PRINCIPAL'S STAMP at the foot of that letter,
   * which reads "UDISE CODE: 09631300403 / CBSE Affi. No: 2131962 / School
   * Code: 70205". It appears nowhere else on the school's site — not on
   * /affiliation/, not in the Mandatory Public Disclosure table.
   */
  udise: '09631300403',
  affiliationPeriod: '01.04.2025 to 31.03.2030',
  affiliationLetterNo: 'CBSE/2131962/EX-00497-2526/2025-26',
  affiliationLetterDated: '13.03.2024',
  affiliationSubject: 'Extension of General Affiliation up to Senior Secondary Level',

  classRange: 'Nursery to Class XII',
  streams: ['PCM', 'PCB', 'Commerce', 'Humanities'],

  principal: 'Mrs. Arpita Singh',

  address: {
    line1: 'Agarsanda, near Hanuman Temple',
    city: 'Ballia',
    state: 'Uttar Pradesh',
    pin: '277001',
    country: 'India',
    landmark: '2 km from Ballia Roadways Bus Stand on Garwar Road',
  },

  phone: {
    admissions: '+917755005908',
    admissionsDisplay: '+91 77550 05908',
    office: '+917755005905',
    officeDisplay: '+91 77550 05905',
    transport: '+917755005909',
    transportDisplay: '+91 77550 05909',
    transportIncharge: 'Mr. Sheo Sarjan Singh',
  },

  /** Finding X6 — a domain address is requested (decision C1). */
  email: 'sunbeamballia2131962@gmail.com',

  /**
   * ⚠ THE RECRUITMENT INBOX, AND IT IS NOT `email` ABOVE. Read off the school's
   * own hiring posters in src/assets/jobs — it is printed on seven of the ten
   * (job-2, 3, 4, 5, 6, 7, 8, 10) and is plainly the address the school wants
   * applications sent to. `email` is the general office address and appears on
   * none of them; sending a CV there would be a guess.
   *
   * ⚠ job-9 PRINTS A SECOND ADDRESS, principalsunbeamballia@gmail.com, and it is
   * deliberately NOT recorded here. It appears on exactly one poster, alongside
   * this one, so it reads as a copy to the principal rather than the route in.
   * Recording both would make the career page ask an applicant to choose.
   */
  recruitmentEmail: 'appointmentsunbeamballia@gmail.com',

  social: {
    facebook: 'https://www.facebook.com/sunbeambui8413/',
    instagram: 'https://www.instagram.com/sunbeamballia/',
    linkedin: 'https://www.linkedin.com/in/sunbeamschoolballia70205/',
    // x + youtube withheld pending audit 14.3 decision (asset request A9).
  },

  external: {
    applyNurseryToIX: 'https://sunbeamballia.edu.in/apply-online/',
    applyClassXI: 'https://sunbeamballia.edu.in/apply-online/',
    results: 'https://sbb.nascorptechnologies.com/',
    parentLogin: 'https://sbb.nascorptechnologies.com/',
    downloadTC: 'https://sunbeamballia.edu.in/download-tc/',

    /* The school's own results page, which is what its top bar's "Result" link
       opens — distinct from `results` above, the portal itself. */
    resultPage: 'https://sunbeamballia.edu.in/result/',

    /* ⚠ THE TWO DIRECT APPLICATION FORMS, read off the school's own top bar.
       They are deliberately NOT used for `applyNurseryToIX`/`applyClassXI`
       above: those feed generic "Apply online" buttons across the site and point
       at the school's own landing page, which survives a form being re-issued.
       These two carry session codes in the query string and are used only where
       the school itself uses them — the utility bar. */
    applyFormNurseryToIX: 'https://sbb.nascorptechnologies.com/gw/gls/onlineAppForms?code=KRnfFWgLwE3a7431k0',
    applyFormClassXI: 'https://sbb.nascorptechnologies.com/gw/adm/applyOnlineRegistration?fm=2',

    /* The school's own copies. Both are linked from its Mandatory Public
       Disclosure page; the letter is item 01 there. Recorded as https —
       the disclosure page prints http, and the host serves both. */
    affiliationLetter: 'https://sunbeamballia.edu.in/wp-content/uploads/AFFL.pdf',
    mandatoryDisclosure: 'https://sunbeamballia.edu.in/general-info/',
  },
} as const;

/**
 * Recognition — homepage §03b proof strip.
 * All four verified from /about-us/ and /affiliation/.
 */
/**
 * Heritage lede — homepage §03b, the band directly under the banner.
 *
 * The figure completes the heading as one sentence: "50 · Years of Sunbeam."
 * Both numbers are verified — the group was founded in Varanasi in 1972 and the
 * Ballia campus opened at Agarsanda in 2013 (docs/01 § 5). The body is editorial
 * phrasing of those same two facts; it makes no claim they do not.
 *
 * NOTE — this band previously carried the four recognition proofs. They are all
 * still on the page: the #1 ranking leads the Story stat card and the
 * Achievements section, CBSE and Microsoft appear in Affiliations with their
 * marks, and the 2,700-from-456 figure is in the Story checklist.
 */
export const heritageLede = {
  figure: '50',
  eyebrow: '1972 — Today',
  heading: 'Years of Sunbeam. Thirteen in Ballia.',
  body:
    'Half a century of the same conviction — that a school owes a child more than ' +
    'a curriculum — carried from Varanasi into Agarsanda.',
} as const;

/**
 * §04 Parent Quick Access — six destinations, all existing on the live site.
 * Deliberately no icons: docs/06 "no cards, no boxes, no icon circles".
 */
export const quickAccess = [
  { label: 'Admissions', desc: 'Process, dates and fees', href: '/admissions/' },
  { label: 'Transport', desc: '22 routes across Ballia', href: '/campus/transport/' },
  { label: 'Academic Calendar', desc: 'Terms, holidays and events', href: '/academics/academic-calendar/' },
  { label: 'Notice Board', desc: 'Official school notices', href: '/news-events/notices/' },
  { label: 'Results', desc: 'Student report card portal', href: school.external.results, external: true },
  { label: 'Contact', desc: 'Reach the school office', href: '/contact-us/' },
] as const;

/**
 * Content awaiting the client — mirrors docs/07-client-asset-requests.md.
 * Surfaced in code so nothing ships unnoticed.
 */
export const pending = {
  A1: 'Board results — Class X and XII, three sessions',
  A2: 'Professional campus photography — every image on this page',
  A3: 'Vision and Mission statement text; confirm primary motto/tagline',
  A4: 'Alumni video testimonials, names, batches, consent',
  A5: "Rewritten homepage welcome copy, and the FULL Principal's message proofread (audit 1.12). The Director's message has been supplied and is live",
  A7: 'News, events and notices — content plus an update cadence owner',
  A8: 'Admission eligibility, age criteria, dates, fee data',
  A9: 'Decision on YouTube and X — maintain or remove (audit 14.3)',
  A14: "Class Corner — the Examination In-charge's name, designation and contact (never published; the placeholder was removed at the client's request 19 Sep 2026). Also: confirmation of the Class XII 2022-23 figure 97.40, whose decimal point is not legible on the board; and agreed wording for the \"continuous district topper\" record, which is NOT published until the school supplies it.",
  B1: 'Affiliation and partner logos, with permission to use each mark',
  B2: 'Vector logo originals — only an 816px raster exists',
} as const;
