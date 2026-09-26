/**
 * ═══ CLASS CORNER · THE PAGE'S OWN PROSE ═══════════════════════════════════
 *
 * ⚠⚠ MOVED OUT OF ClassCornerPage.astro AND Toppers.astro VERBATIM. The cards
 * and the board rows were already in the CMS; these are the words around them,
 * which the school still could not change.
 *
 * ⚠ data/toppers.ts IS A DIFFERENT FILE AND STILL THE SEED'S SOURCE for the
 * seventeen names. This one carries only the copy.
 *
 * ⚠ EVERY BAND CARRIES A NON-STRING VALUE — a block of nothing but strings is
 * read by the seed's classifier as a key→prose map and loses its heading
 * without a word. `body: []` is what keeps a heading-only band intact.
 */

export const classCornerDocs = {
  kicker: '',
  heading: 'Class documents',
  body: [] as string[],
};

export const classCornerFoot = {
  kicker: '',
  heading: '',
  body: [
    'These documents are published and revised by the school office. If one is out of date, or you cannot find your child’s class in it, [contact the school office](/contact-us/).',
  ],
};

export const toppersIntro = {
  kicker: 'Academic Excellence',
  heading: 'The names on the board',
  body: [
    'The school mounts two boards at the entrance — one for Class X, one for Class XII — carrying the session topper and their percentage. These are those boards, transcribed row for row.',
  ],
};

/**
 * ⚠ THE LABEL AND THE TWO NOTES THAT QUALIFY A FIGURE. The asterisk note is
 * shown against a single row; the footnote appears under the pair only when a
 * row actually carries the flag. Neither is decoration — together they are the
 * page saying which numbers it could not read, and removing them would turn an
 * unverified figure into a confident one.
 */
export const toppersLabels = {
  kicker: 'Highest on this board',
  heading: '',
  body: [
    'The decimal point is not legible on the board; awaiting the school’s confirmation.',
    'Transcribed from the school’s own boards. A figure marked * is one the photograph does not render clearly and is awaiting confirmation.',
  ],
};
