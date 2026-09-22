/**
 * PARENTS' FEEDBACK — the page's content.
 *
 * ⚠⚠ THIS FILE NEVER RECEIVES ANYTHING THE FORM COLLECTS. Form input goes to
 * the school office; page display comes from a human who checked it and got
 * consent. data/parentsFeedbackForm.ts and this file do not import each other,
 * and that separation is the safeguard — see that file's header.
 *
 * ═══ TESTIMONIALS SHIP EMPTY, AND THAT IS THE POINT ════════════════════════
 *
 * The reference design carries four testimonial cards — "Mrs. Priya Sharma,
 * Parent of Aarav Sharma, Class IV" and three in the same shape. Those families
 * do not exist. Neither do their quotes, their children or their classes. A
 * card like that is a fabricated endorsement attributed to a real family at a
 * real school.
 *
 * So `testimonials` is empty, the entire band is wrapped in
 * `{testimonials.length > 0 && (…)}` in the component, and the page does not
 * render it at all. Not hidden with CSS, not a greyed placeholder, not lorem —
 * absent. The carousel is built and wired in full, so the band returns complete
 * the moment the school supplies real feedback.
 *
 * ⚠⚠ FOUR THINGS ARE NEEDED TOGETHER PER PARENT: the quote, the parent's name,
 * the child's class, and WRITTEN CONSENT TO PUBLISH. If you cannot get all
 * four, leave the entry out — three quarters of a testimonial is a fabricated
 * one.
 *
 * ⚠ THERE IS NO `rating` FIELD, DELIBERATELY. A school publishing its own five
 * stars is marketing, not testimony. If ratings ever come from a third party
 * that shows them, `source` is the field that would carry the attribution.
 *
 * ⚠ THIS CALL HAS BEEN MADE ON THIS SITE BEFORE — see
 * components/academics/parents/Voice.astro.
 */
import type { ImageMetadata } from 'astro';

export interface ParentTestimonial {
  /** Verbatim. Never edited for tone, length or grammar. */
  quote: string;
  parentName: string;
  /** The RELATION, never the child's name — "Parent of a Class IV student". */
  relation: string;
  /** Only if consented. */
  className?: string;
  image?: ImageMetadata;
  /** Where it was published, so a reader can check it. */
  source?: string;
}

/**
 * ⚠⚠ LAYOUT PREVIEW ONLY — GATED SO IT CANNOT SHIP.
 *
 * `import.meta.env.DEV` is false in every build, so these never reach dist/.
 * They exist so the band can be seen rendering before real testimonials arrive.
 *
 * ⚠ THE NAMES ARE OBVIOUSLY PLACEHOLDER AND THE RELATION SAYS SO IN CAPITALS,
 * so a review screenshot taken in dev cannot be mistaken for live copy.
 *
 * ⚠ THREE DIFFERENT LENGTHS, WHICH IS WHAT A LAYOUT PREVIEW IS FOR. They show
 * that cards equalise to the tallest in view — so real testimonials should be
 * kept to a similar length, roughly two to four lines, or one long entry
 * stretches every card beside it.
 */
const PREVIEW_ONLY: ParentTestimonial[] = [
  {
    quote: 'A short one, to show the floor of the card.',
    parentName: 'Sample Parent A',
    relation: 'PREVIEW — not a real testimonial',
  },
  {
    quote:
      'A middling one, long enough to wrap onto three lines at the two-up width this rail uses, which is roughly where a real testimonial should sit.',
    parentName: 'Sample Parent B',
    relation: 'PREVIEW — not a real testimonial',
  },
  {
    quote:
      'A deliberately long one, written to overflow the others and demonstrate that every card in view grows to match the tallest among them. If a real testimonial runs to this length, the card beside it inherits the height and the band starts to look unbalanced — which is the reason to keep them close in length rather than a rule about writing.',
    parentName: 'Sample Parent C',
    relation: 'PREVIEW — not a real testimonial',
  },
];

/**
 * ⚠⚠ EMPTY UNTIL THE SCHOOL SUPPLIES REAL FEEDBACK WITH CONSENT. Adding entries
 * here is all that is needed — the band, carousel, arrows and dots are already
 * built and will appear on their own.
 */
export const testimonials: ParentTestimonial[] = import.meta.env.DEV ? PREVIEW_ONLY : [];

export interface ParticipationItem {
  /** Printed on the card. Two digits, matching the client's design. */
  n: string;
  /** The school's own heading for it. */
  title: string;
  /** One or more paragraphs, in the school's own words. */
  paras: string[];
  /** The page on this site that writes it up in full. Recorded, not rendered. */
  href: string;
}

/**
 * ═══ PARENT PARTICIPATION ══════════════════════════════════════════════════
 *
 * ⚠⚠ EVERY LINE IN `paras` IS THE SCHOOL'S OWN, COPIED VERBATIM. These are
 * transcriptions, not summaries. Do not tighten, re-order, merge, paraphrase or
 * "fix" them, and do not add a sentence to balance a short card against a long
 * one. The exclamation marks, the EN DASH in "teaching–learning", the American
 * "program" and the sentence fragments are all the school's.
 *
 * ⚠ THE TITLES ARE THE SCHOOL'S HEADINGS TOO. "Child Parent Teacher Dialogue"
 * carries no hyphens. "Art Integrated Class Project" is not "Art Integrated
 * Learning".
 *
 * ⚠⚠ THE CARDS GO NOWHERE. They were briefly wrapped in an <a>; the client's
 * call is that nothing here is clickable. So there is no anchor — and no hover
 * lift either, because a card that rises under the cursor promises a click it
 * will not honour.
 *
 * `href` IS NOT RENDERED. It is the record of which page writes each item up in
 * full, so a claim can be checked without hunting for it. The `cta` field that
 * used to sit beside it is gone: it held a label the project wrote rather than
 * the school.
 */
export const participation: ParticipationItem[] = [
  {
    n: '01',
    title: 'Parents’ Forum',
    paras: [
      'Today, we successfully conducted the Parents’ Forum for classes Nursery to V, creating a meaningful platform for collaboration between parents and teachers.',
      'Parents actively participated, shared valuable feedback, and appreciated the efforts taken for their children’s growth and wellbeing.',
    ],
    href: '/academics/parent-partnership/parents-forum/',
  },
  {
    n: '02',
    title: 'Child Parent Teacher Dialogue',
    paras: [
      'The session provided an opportunity to discuss progress, share feedback, and exchange valuable suggestions.',
      'Parents actively participated and their insights will surely help us in further strengthening the teaching–learning process.',
    ],
    href: '/news-events/notices/',
  },
  {
    n: '03',
    title: 'Art Integrated Class Project',
    paras: [
      'Heartfelt feedback from parents.',
      'The students showcased incredible talent and teamwork, while parents actively participated and appreciated the creative learning approach.',
    ],
    href: '/academics/parent-partnership/parent-engagement/',
  },
  {
    n: '04',
    title: 'Parent Orientation',
    paras: [
      'Parents as Partners in Learning!',
      'At Sunbeam School Ballia, we believe that education is a shared journey, and when parents and teachers work together, the results are extraordinary!',
      'The program also featured a Parents Interface Session, where parents had the opportunity to interact one-on-one with the leadership team, fostering a stronger school-community bond.',
      'Parents were an integral part of this experience, interacting with their children, exploring the activities, and witnessing the vibrant learning ecosystem we nurture at Sunbeam.',
    ],
    href: '/academics/parent-partnership/parent-orientation/',
  },
  {
    n: '05',
    title: 'Second Parents Orientation Programme',
    paras: [
      'Today we have conducted the Second Parents Orientation Programme successfully. Glimpses of the same are shared for your reference.',
    ],
    href: '/academics/parent-partnership/parent-orientation/',
  },
];

/**
 * The closing band.
 *
 * The client's design supplies the heading and the thank-you; the body restates
 * the school's own aim rather than promising anything new. The second line,
 * "Thank you, parents!", is set in the component because it is a fixed piece of
 * the band's typography rather than editable copy.
 */
export const closing = {
  heading: 'Together, we shape brighter futures.',
  body: 'We remain committed to nurturing curiosity, character and confidence in every child.',
  cta: { label: 'Parent Partnership', href: '/academics/parent-partnership/' },
};
