/**
 * ═══ ACADEMIC EXCELLENCE — THE TWO MOUNTED BOARDS ══════════════════════════
 *
 * A row-for-row transcription of the two boards mounted in the school: Class X
 * and Class XII, one row per session.
 *
 * Transcribed from a rendering of the school's two boards supplied by the
 * client, 21 Sep 2026: 9 sessions for Class X (2017-18 → 2025-26) and 8 for
 * Class XII (2018-19 → 2025-26).
 *
 * ═══ THE FOUR TRANSCRIPTION RULES ══════════════════════════════════════════
 *
 * 1 · NOTHING MAY BE ROUNDED, REORDERED, CORRECTED OR FILLED IN. Every name is
 *     spelled as the board spells it and every percentage is copied to two
 *     decimals as printed. If a row looks wrong, the board has to change — not
 *     this file.
 *
 * 2 · THE BOARD'S EMPTY FUTURE ROWS ARE NOT REPRODUCED. 2026-27, 2027-28 and
 *     2028-29 are ruled and blank, waiting to be filled. An empty row on a wall
 *     is a promise; on a web page it reads as missing data.
 *
 * 3 · CLASS X 2024-25 IS ONE ROW WITH TWO NAMES — 'ANANYA TIWARI & SHREYA
 *     YADAV', both at 98.20. The board gives them the session jointly. DO NOT
 *     split them into two rows with a rank between them.
 *
 * 4 · CLASS XII 2022-23 READS `97 40` ON THE BOARD — the decimal is not legible
 *     in the photograph. Store it as '97.40' with `check: true`, which renders
 *     an asterisk and a footnote. KEEP THE FLAG until the school confirms.
 *
 * ⚠ ONE NAME APPEARS ON BOTH BOARDS. 'ANSHU YADAV' is Class X 2018-19 and
 * Class XII 2020-21 — exactly the two-year gap that would make it one student
 * who topped twice. THE SITE DOES NOT SAY SO. It is very probably the same
 * person, and "very probably" is not something to publish about a named child.
 *
 * ⚠⚠ NO COMPARATIVE CLAIM BELONGS ANYWHERE NEAR THIS DATA. Not "district
 * topper", not "best in Ballia", not a rank. The client mentioned a
 * "continuous district topper" record; no wording for it has been confirmed,
 * so no such sentence is published. See site.ts → gaps.A14.
 */

export interface TopperRow {
  /** As the board prints it: '2017-18'. */
  session: string;
  /**
   * As the board spells it, in capitals. The stored spelling is the record;
   * the title-casing happens in the component. DO NOT "fix" a spelling here to
   * match a hunch.
   */
  name: string;
  /** Two decimals, exactly as printed. A string so '98.20' keeps its zero. */
  percent: string;
  /** The figure is not legible on the photograph — renders an asterisk. */
  check?: true;
}

/**
 * ⚠⚠ OLDEST FIRST, THE ORDER THE BOARD IS ENGRAVED IN. A visitor wants the
 * newest session at the top and gets it — the component reverses a copy. The
 * DATA keeps the board's order so the transcription can be checked against the
 * photograph line by line, which is the only way an error in it would ever be
 * found. Do not reverse these arrays.
 */
export const classX: TopperRow[] = [
  { session: '2017-18', name: 'ARYAN SINGH YADAV', percent: '94.80' },
  { session: '2018-19', name: 'ANSHU YADAV', percent: '96.40' },
  { session: '2019-20', name: 'JANHVI UPADHYAY', percent: '97.00' },
  { session: '2020-21', name: 'SRISHTI SINGH', percent: '96.40' },
  { session: '2021-22', name: 'RISHIKANT', percent: '98.40' },
  { session: '2022-23', name: 'PRINCE KUMAR ADITYA', percent: '97.20' },
  { session: '2023-24', name: 'ADITI YADAV', percent: '97.60' },
    // ⚠ RULE 3: one row, two names, one session. Do not split.
  { session: '2024-25', name: 'ANANYA TIWARI & SHREYA YADAV', percent: '98.20' },
  { session: '2025-26', name: 'AASTHA YADAV', percent: '97.20' },
];

export const classXII: TopperRow[] = [
  { session: '2018-19', name: 'SHALU VERMA', percent: '78.43' },
  { session: '2019-20', name: 'SHAMBHAVI', percent: '94.00' },
  { session: '2020-21', name: 'ANSHU YADAV', percent: '94.80' },
  { session: '2021-22', name: 'ADITYA SINGH', percent: '94.20' },
    // ⚠ RULE 4: the board reads `97 40` — decimal not legible. Keep the flag.
  { session: '2022-23', name: 'SANDHYA YADAV', percent: '97.40', check: true },
  { session: '2023-24', name: 'UTPAL SINGH TOMAR', percent: '98.00' },
  { session: '2024-25', name: 'PRIYANKA MAURYA', percent: '98.60' },
  { session: '2025-26', name: 'ANISHA ALTAF', percent: '97.20' },
];

/**
 * ⚠ THE HIGHLIGHT IS ARITHMETIC, NOT A RANKING. The comparison lives here so
 * the component states nothing of its own — it only tints the row this returns
 * and labels it "Highest on this board". A tint and a label, not a trophy.
 *
 * ⚠ RETURNS null ON AN EMPTY BOARD. `reduce` without an initial value throws
 * on an empty array, which would take the whole PAGE down rather than just
 * this section. Both boards are populated today; the guard is for the day one
 * is emptied to be re-checked against the wall.
 */
const peak = (rows: TopperRow[]): TopperRow | null =>
  rows.length
    ? rows.reduce((a, b) => (parseFloat(b.percent) > parseFloat(a.percent) ? b : a))
    : null;

export const bestX = peak(classX);
export const bestXII = peak(classXII);

/** 'first — last' from the board's own order, for the table's standfirst. */
const span = (rows: TopperRow[]): string | null =>
  rows.length ? `${rows[0].session} – ${rows[rows.length - 1].session}` : null;

export const spanX = span(classX);
export const spanXII = span(classXII);

/** The page uses this to decide whether the section exists at all. */
export const hasBoards = classX.length > 0 || classXII.length > 0;
