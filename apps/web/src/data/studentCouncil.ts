/**
 * ═══ THE STUDENT COUNCIL ═══════════════════════════════════════════════════
 *
 * The school's own roll of office-holders, senior and junior, transcribed from
 * the list the school published.
 *
 * ⚠⚠ EVERY NAME AND EVERY POST IS COPIED EXACTLY AS PUBLISHED, INCLUDING THE
 * SPELLINGS THAT LOOK LIKE MISTAKES. This is the rule that matters most in
 * this file, because almost every one of them will look like something to fix:
 *
 *   · 'Head Perfect' and 'Vice Head Perfect' — the school's own list says
 *     Perfect. Its investiture sashes say PREFECT. DO NOT reconcile them here.
 *   · 'Career Counseling Perfect' — the same word again, and the American
 *     spelling of Counseling. Both stand.
 *   · 'Miss vaishnavi Kaur' — lower-case v, as published.
 *   · 'Sarthak Goal' — not Goel.
 *   · 'Asstt. Discipline Head' — the school's own abbreviation.
 *
 * These are named children holding named offices. A spelling corrected here on
 * a hunch is this site telling a parent their child's title is something the
 * school never said it was, and nothing in the page would show that it had
 * been changed. If one of them is genuinely wrong, the SCHOOL's list has to
 * change and this file follows it.
 *
 * ⚠ WHAT IS NOT HERE IS NOT MISSING, IT IS UNPUBLISHED. The school lists a Red,
 * a Yellow and a Green house captain and no fourth, and lists junior house
 * captains but no junior vice-captains. The investiture photograph shows a
 * blue house flag as well. That is not enough to publish a Blue House captain,
 * so none appears. Do not pad these lists out to a tidy shape.
 */

export type House = 'red' | 'yellow' | 'green';

export interface CouncilPost {
  /** The post, exactly as the school writes it. */
  post: string;
  /** The holder, exactly as the school spells it. */
  name: string;
  /** Only where the post names a house — drives the dot, nothing else. */
  house?: House;
}

export interface CouncilBody {
  id: string;
  label: string;
  /**
   * The four head offices, set larger. They are separated from the rest
   * because the school's own list leads with them, not because the other
   * twenty posts matter less.
   */
  offices: CouncilPost[];
  posts: CouncilPost[];
}

/**
 * ⚠ CLIENT-SUPPLIED PROSE — VERBATIM. Not re-punctuated, not tightened, not
 * made grammatical. It is the school's sentence about its own students.
 */
export const councilIntro =
  'Our school gives the opportunities to students to prove their qualities, may it be at school level or at classroom level.';

export const councils: CouncilBody[] = [
  {
    id: 'senior',
    label: 'Senior Student Council',
    offices: [
      { post: 'Head Boy', name: 'Master Ashish Verma' },
      { post: 'Head Girl', name: 'Miss vaishnavi Kaur' },
      { post: 'Vice Head Boy', name: 'Master Aditya Mishra' },
      { post: 'Vice Head Girl', name: 'Miss Vidya Singh' },
    ],
    posts: [
      { post: 'Captain, Red House', name: 'Sakshi Verma', house: 'red' },
      { post: 'Vice Captain, Red House', name: 'Shivam Singh', house: 'red' },
      { post: 'Captain, Yellow House', name: 'Rashika Pandey', house: 'yellow' },
      { post: 'Vice Captain, Yellow House', name: 'Sarthak Goal', house: 'yellow' },
      { post: 'Captain, Green House', name: 'Faizan Ansari', house: 'green' },
      { post: 'Vice Captain, Green House', name: 'Jagriti Pandey', house: 'green' },
      { post: 'Discipline Head', name: 'Aditya Kumar Pandey' },
      { post: 'Asstt. Discipline Head', name: 'Drishika Verma' },
      { post: 'Head Perfect', name: 'Shreya Singh' },
      { post: 'Vice Head Perfect', name: 'Kushagra Chaurasia' },
      { post: 'Sports Captain', name: 'Ankit Kumar Yadav' },
      { post: 'Sports Vice Captain', name: 'Ritika Singh' },
      { post: 'Cultural Head', name: 'Anushka Tiwari' },
      { post: 'Vice Cultural Head', name: 'Arohi Singh' },
      { post: 'Career Counseling Perfect', name: 'Lisha Singh' },
      { post: 'Health & Hygiene Inspector', name: 'Ayushi Gupta' },
      { post: 'Health & Hygiene Sub-Inspector', name: 'Aditi Pandey' },
      { post: 'Technical Head', name: 'Shashwat Jha' },
      { post: 'Luminary', name: 'Srijit Chaturvedi' },
      { post: 'Literary', name: 'Shivalika' },
    ],
  },
  {
    id: 'junior',
    label: 'Junior Student Council',
    offices: [
      { post: 'Jr. Head Boy', name: 'Anmol Kumar Singh' },
      { post: 'Jr. Head Girl', name: 'Esha Mishra' },
      { post: 'Jr. Vice Head Boy', name: 'Aariz Ahmad' },
      { post: 'Jr. Vice Head Girl', name: 'Talat Bano' },
    ],
    posts: [
      { post: 'Jr. Cultural Head', name: 'Arohi Jaiswal' },
      { post: 'Jr. Health & Hygiene Inspector', name: 'Riddhi Sharma' },
      { post: 'Discipline Head (Junior)', name: 'Janhvi Singh' },
      { post: 'Jr. Captain, Red House', name: 'Rudransh Kumar', house: 'red' },
      { post: 'Jr. Captain, Yellow House', name: 'Aadhya Gupta', house: 'yellow' },
      { post: 'Jr. Captain, Green House', name: 'Saumya Verma', house: 'green' },
    ],
  },
];

/** For the meta description and for anyone checking the roll is complete. */
export const councilCount = councils.reduce(
  (n, c) => n + c.offices.length + c.posts.length,
  0,
);
