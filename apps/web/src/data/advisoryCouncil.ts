/**
 * ═══ THE ADVISORY COUNCIL ══════════════════════════════════════════════════
 *
 * The fifteen people on the school's own ADVISORY COUNCIL board, transcribed
 * from it.
 *
 * ⚠⚠ THIS IS NOT THE STUDENT COUNCIL AND NOT THE MANAGEMENT COMMITTEE. Three
 * different bodies, and the site carries all three separately:
 *
 *   · the STUDENT council      → data/studentCouncil.ts, children, 2026-27
 *   · the SCHOOL MANAGEMENT    → data/disclosure.ts, the statutory CBSE body
 *     COMMITTEE (SMC)
 *   · this ADVISORY COUNCIL    → academics, officials and the group's own
 *                                 directors, advising the school
 *
 * Do not merge any of them. The SMC is a filing the board has to make; this is
 * a panel the school chose.
 *
 * ⚠⚠ IT IS SUNBEAM BALLIA'S OWN BOARD, WHICH IS WORTH RECORDING BECAUSE MOST
 * OF THESE PEOPLE SIT ELSEWHERE. The board carries the Ballia crest and its
 * 'Estd. 2013', and two members are local to Ballia — Mr. Bharat Singh, an
 * ex-M.P. for Ballia, and Dr. Ganesh Pathak, retired Principal of PG College
 * Dubey Chhapra Ballia. The rest are the Sunbeam group's directors and
 * academics from BHU, JNU, UP College and Liverpool John Moores.
 *
 * ⚠⚠ 'Mrs. Aditi Singh — Principal' IS NOT THIS SCHOOL'S PRINCIPAL, AND THAT
 * MUST NOT BE QUIETLY RECONCILED. Sunbeam Ballia's Principal is Mrs. Arpita
 * Singh — the Mandatory Public Disclosure says so and data/site.ts follows it.
 * The board names no school against Mrs. Aditi Singh, exactly as it names none
 * against several other members, so she is most likely a principal elsewhere
 * in the group sitting on this panel. The board is reproduced as printed and
 * the page does not gloss it. If the school means something else, the school
 * says so and this file follows.
 *
 * ⚠ EVERY LINE IS AS PRINTED, INCLUDING 'Vanarasi' UNDER MRS. AMRITA BURMAN
 * where every other entry spells it Varanasi, and the full stop the board puts
 * after 'BHU, Varanasi.' and nowhere else. These are named adults and their
 * stated credentials; a tidy-up here is this site restating someone's post as
 * something the school never wrote.
 */

export interface Advisor {
  /** As printed. 'Prof. Dr. Raghwendra Pratap Singh' wraps on the board; that
   *  is the artwork running out of width, not two lines of meaning. */
  name: string;
  /**
   * The bold line beneath the name, where the board sets one — an office held.
   * Most members have none and carry only an affiliation.
   */
  office?: string;
  /** The lighter line beneath, as printed. */
  affiliation?: string;
}

/**
 * ⚠ THE BOARD'S OWN ORDER, LEFT TO RIGHT AND THEN DOWN. It is NOT alphabetical
 * and NOT ranked — the Chairperson leads, but the Vice Chairperson is sixth and
 * the Director is ninth. Re-sorting this list would invent a hierarchy the
 * school did not publish.
 */
export const advisors: Advisor[] = [
  {
    name: 'Dr. Deepak Madhok',
    office: 'Chairperson',
    affiliation: 'Sunbeam Group of Educational Institutions',
  },
  {
    name: 'Dr. Rameshwar Dubey',
    affiliation:
      'Prof. Liverpool Business School, Liverpool John Moores University',
  },
  { name: 'Prof. Ram Chandra', affiliation: 'JNU Delhi' },
  { name: 'Mr. Arvind Singh', office: 'Retd. IAS' },
  {
    name: 'Prof. Abhijeet Singh',
    affiliation: 'Institute of Management Sciences, BHU, Varanasi.',
  },
  {
    name: 'Ms. Bharti Madhok',
    office: 'Vice Chairperson',
    affiliation: 'Sunbeam Group of Educational Institutions',
  },
  { name: 'Mr. Bharat Singh', affiliation: 'Ex. M.P. Ballia (Uttar Pradesh)' },
  {
    name: 'Dr. Anand Singh',
    office: 'Professor & Head',
    affiliation: 'Department of Horticulture, BHU Varanasi',
  },
  {
    name: 'Mrs. Amrita Burman',
    office: 'Director',
    /* ⚠ 'Vanarasi' IS THE BOARD'S SPELLING HERE. See the header. */
    affiliation: 'Sunbeam Group of Educational Institutions Vanarasi',
  },
  {
    name: 'Dr. Ganesh Pathak',
    office: 'Retd. Principal',
    affiliation: 'PG College Dubey Chhapra Ballia',
  },
  {
    name: 'Mrs. Pratima Gupta',
    office: 'Asst. Director',
    affiliation: 'Sunbeam Group of Educational Institutions',
  },
  {
    name: 'Mrs. Salony Priya',
    affiliation: 'Founder / Director of Ummeed Counselling, Kolkata',
  },
  {
    name: 'Prof. Manish Singh',
    affiliation: 'HOD, Dept. of Agricultural Economics UP College, Varanasi',
  },
  {
    name: 'Prof. Dr. Raghwendra Pratap Singh',
    affiliation: 'HOD, Dept. of Agriculture Chemistry UP College, Varanasi',
  },
  {
    /* ⚠ NOT THIS SCHOOL'S PRINCIPAL. See the header before touching this. The
       board sets 'Mrs. India Earth, 2018' in bold and 'Principal' beneath it,
       in that order, and that order is kept. */
    name: 'Mrs. Aditi Singh',
    office: 'Mrs. India Earth, 2018',
    affiliation: 'Principal',
  },
];

export const advisorCount = advisors.length;
