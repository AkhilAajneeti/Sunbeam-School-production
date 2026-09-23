/**
 * ═══ THE STUDENT COUNCIL ═══════════════════════════════════════════════════
 *
 * The school's own roll of office-holders, senior and junior, transcribed from
 * the board the school published: COUNCIL MEMBERS 2026-27.
 *
 * ⚠⚠ THIS FILE WAS REPLACED WHOLE WHEN THE 2026-27 BOARD ARRIVED, AND THE
 * REASON IS WORTH KEEPING. It previously held the PREVIOUS session's roll —
 * Ashish Verma as Head Boy, houses called Red, Yellow and Green. The board
 * supersedes it, and the same children appear on both a year apart: 'Sarthak
 * Goal', Vice Captain of Yellow House, is the board's 'Sarthak Goel', Head
 * Boy. Riddhi Sharma moved from Health & Hygiene Inspector to Junior Head
 * Girl. That is a session turning over, not two sources disagreeing.
 *
 * ⚠⚠ EVERY NAME AND EVERY POST IS COPIED EXACTLY AS THE BOARD PRINTS IT,
 * INCLUDING THE SPELLINGS THAT LOOK LIKE MISTAKES:
 *
 *   · 'Health & Hygine Inspector' — the JUNIOR caption, missing its second e.
 *     The senior caption spells it 'Health & Hygiene Inspector'. Both stand,
 *     inconsistent with each other, because the board is inconsistent.
 *   · 'Adiyta Verma' — not Aditya.
 *   · 'Sport Vice Captain' — singular, beside a 'Sports Captain'.
 *   · 'Health & Hygiene Sub. Inspector' — the board's own abbreviation.
 *
 * The previous board misspelt Prefect as 'Perfect' throughout and this one
 * does not. DO NOT carry the old spelling forward, and do not correct the new
 * ones listed above: what is published is what the school said.
 *
 * These are named children holding named offices. A spelling corrected here on
 * a hunch is this site telling a parent their child's title is something the
 * school never said it was, and nothing in the page would show that it had
 * been changed. If one of them is genuinely wrong, the SCHOOL's board has to
 * change and this file follows it.
 *
 * ⚠ THE HOUSES ARE NAMED, NOT COLOURED — and the two are not the same thing.
 * The board says Love, Joy and Hope where the old roll said Red, Yellow and
 * Green. They are the same three houses: on the board the Love House captains
 * wear red, the Joy House captains yellow and the Hope House captains green,
 * and the investiture photograph shows a flag reading "RED HOUSE ... LOVE".
 * The colour below is therefore the house's own, read off its uniforms — it
 * drives the dot and nothing else.
 *
 * ⚠ WHAT IS NOT HERE IS NOT MISSING, IT IS UNPUBLISHED. The board lists three
 * houses and no fourth, though the investiture photograph shows a blue flag as
 * well. Do not pad these lists out to a tidy shape.
 */

/** The three houses, by the names the school gives them. */
export type House = 'love' | 'joy' | 'hope';

export interface CouncilPost {
  /** The post, exactly as the board writes it. */
  post: string;
  /** The holder, exactly as the board spells it. */
  name: string;
  /** Only where the post names a house — drives the dot, nothing else. */
  house?: House;
}

export interface CouncilBody {
  id: string;
  label: string;
  /**
   * The four head offices, set larger. They are separated from the rest
   * because the board itself leads with them — the senior Head Boy and Head
   * Girl are printed at twice the size of everyone else — not because the
   * other twenty-five matter less.
   */
  offices: CouncilPost[];
  posts: CouncilPost[];
}

/** The session the board covers. Printed on the page so the roll dates itself. */
export const councilSession = '2026-27';

/**
 * ⚠ CLIENT-SUPPLIED PROSE — VERBATIM. Not re-punctuated, not tightened, not
 * made grammatical. It is the school's sentence about its own students.
 */
export const councilIntro =
  'Our school gives the opportunities to students to prove their qualities, may it be at school level or at classroom level.';

export const councils: CouncilBody[] = [
  {
    id: 'senior',
    label: "Senior Student's Council",
    offices: [
      { post: 'Head Boy', name: 'Sarthak Goel' },
      { post: 'Head Girl', name: 'Richa Gupta' },
      { post: 'Vice Head Boy', name: 'Ujwal Pratap Singh' },
      { post: 'Vice Head Girl', name: 'Swati Tiwari' },
    ],
    posts: [
      { post: 'Captain Love House', name: 'Amna Meraj', house: 'love' },
      { post: 'Captain Joy House', name: 'Anubhav Yadav', house: 'joy' },
      { post: 'Captain Hope House', name: 'Jagriti Pandey', house: 'hope' },
      { post: 'Vice Captain Love House', name: 'Shaurya Vardhan Singh', house: 'love' },
      { post: 'Vice Captain Joy House', name: 'Palak Verma', house: 'joy' },
      { post: 'Vice Captain Hope House', name: 'Manshi Rai', house: 'hope' },
      { post: 'Secretary General', name: 'Shristi Gupta' },
      { post: 'Head Prefect', name: 'Madeeha Najam' },
      { post: 'Vice Head Prefect', name: 'Shruti Pathak' },
      { post: 'Discipline Head', name: 'Bhoomi Soni' },
      { post: 'Vice Discipline Head', name: 'Ankit Kumar' },
      { post: 'Cultural Head', name: 'Supriya Singh' },
      { post: 'Vice Cultural Head', name: 'Harshita Singh' },
      { post: 'Sports Captain', name: 'Rudra Pratap Singh' },
      { post: 'Sport Vice Captain', name: 'Ritika Singh' },
      { post: 'Health & Hygiene Inspector', name: 'Ayushi Gupta' },
      { post: 'Health & Hygiene Sub. Inspector', name: 'Ragini' },
      { post: 'Career Counselling Prefect', name: 'Adiyta Verma' },
      { post: 'Cyber Head', name: 'Deepak Kumar' },
      { post: 'Deputy Cyber Head', name: 'Arya Mishra' },
      { post: 'Literary Head', name: 'Divyansh Shekhar Shukla' },
      { post: 'AI & Robotics Head', name: 'Gaurav Singh' },
      { post: 'Financial Literacy Head', name: 'Shivangi Yadav' },
      { post: 'Social Outreach Prefect', name: 'Soumya Singh' },
      { post: 'NCC Head', name: 'Shuryansh Singh' },
    ],
  },
  {
    id: 'junior',
    label: "Junior Student's Council",
    offices: [
      { post: 'Head Boy', name: 'Dhairya Agrawal' },
      { post: 'Head Girl', name: 'Riddhi Sharma' },
      { post: 'Vice Head Boy', name: 'Kanishk Yadav' },
      { post: 'Vice Head Girl', name: 'Shanvi Tripathi' },
    ],
    posts: [
      { post: 'Captain Love House', name: 'Ravjot Kaur', house: 'love' },
      { post: 'Captain Joy House', name: 'Shashwat Chaudhary', house: 'joy' },
      { post: 'Captain Hope House', name: 'Samarth Agrawal', house: 'hope' },
      { post: 'Vice Captain Love House', name: 'Mandavi Pandey', house: 'love' },
      { post: 'Vice Captain Joy House', name: 'Aradhya Jha', house: 'joy' },
      { post: 'Vice Captain Hope House', name: 'Surya Pratap Mishra', house: 'hope' },
      { post: 'Cultural Head', name: 'Shambhavi Srivastava' },
      { post: 'Literary Head', name: 'Gargi Pathak' },
      { post: 'Discipline Head', name: 'Shreysh Kumar Gupta' },
      /* ⚠ 'Hygine' IS THE BOARD'S SPELLING ON THE JUNIOR SIDE. See the header. */
      { post: 'Health & Hygine Inspector', name: 'Rudra Gupta' },
      { post: 'Sports Captain', name: 'Anamika Pandey' },
      { post: 'Sports Vice Captain', name: 'Kavya Gupta' },
    ],
  },
];

/** For the meta description and for anyone checking the roll is complete. */
export const councilCount = councils.reduce(
  (n, c) => n + c.offices.length + c.posts.length,
  0,
);
