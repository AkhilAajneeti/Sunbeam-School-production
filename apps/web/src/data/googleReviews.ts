/**
 * GOOGLE REVIEWS — what the "Parent & Student Voices" band renders.
 *
 * ═══ SOURCE, AND HOW MUCH OF IT WAS CHECKED ════════════════════════════════
 *
 * The Google reviews widget on sunbeamballia.edu.in (TrustIndex), read 11
 * September 2026 and RE-VERIFIED against the served HTML on 15 September 2026
 * by parsing the page rather than reading a screenshot.
 *
 * Of the eight entries below: all 8 names matched the live widget character for
 * character, all 8 star counts matched, and 7 of 8 texts matched exactly. The
 * eighth is noted on Krishna Singh's entry. The total, 368, matched.
 *
 * ⚠⚠ THE DESIGN COMP FOR THIS BAND IS ENTIRELY FABRICATED AND NONE OF IT IS
 * HERE. It carries "Priya Singh · Parent", "Amit Verma · Parent", "Sneha
 * Tiwari · Alumni", "Rohit Sharma · Parent", a 4.8/5 score, "500+ reviews",
 * "500+ Happy Families", stock-photo avatars and topic tags ("Caring
 * Teachers", "Great Environment"). Every one of those is an invented statement
 * attributed to a real school. The LAYOUT came from that comp. The CONTENT
 * comes from the widget. Do not copy a figure back off it.
 *
 * ═══ THE SIX RULES ═════════════════════════════════════════════════════════
 *
 * ⚠ 1. "Best sc hool" KEEPS ITS TYPO. It is a quotation from a member of the
 * public, not copy to tidy. The same goes for the one-word entries: "Good" is
 * what the person wrote, and padding it out puts words in their mouth.
 *
 * ⚠⚠ 2. THE TWO-STAR REVIEW STAYS IN. Bhawna Agrawal's entry is in the
 * school's own widget, in this position. Dropping it turns a review feed into a
 * testimonial reel — which is the exact move that makes everything around it
 * untrustworthy. The aggregate already says not everything is five stars;
 * hiding the one review that shows it is the dishonest half of a half-truth.
 *
 * ⚠ 3. NO TIMESTAMPS, AND THE DATA IS WHY. The comp shows "2 weeks ago" on
 * every card. In the live widget the `ti-date` element is EMPTY on all eight
 * reviews — not five, all of them — and the underlying `data-time` attribute is
 * the same placeholder value on six. There is no date here that can honestly be
 * shown, so the field does not exist and the card is designed without it.
 *
 * ⚠ 4. NO ROLES. Google publishes a name, not a relationship to the school.
 * "Parent" or "Alumni" under a real person's name would be a guess about them.
 *
 * ⚠ 5. NO PROFILE PHOTOGRAPHS. Two of these reviewers have a Google avatar.
 * Their appearing in a widget does not authorise copying a real person's face
 * onto this site. Every card renders the initial instead — which is what Google
 * itself falls back to when there is no photo.
 *
 * ⚠ 6. NO TOPIC TAGS. These reviews are one to eight words long. There is
 * nothing to tag.
 */

export interface GoogleReview {
  /** Exactly as Google shows it, lower-case initials and all. */
  name: string;
  /** Whole stars 1–5, as published. */
  stars: number;
  /** Verbatim. */
  text: string;
}

/**
 * ⚠ ORDER IS THE WIDGET'S, NOT A RANKING. Re-sorting by star count would put
 * the five-star reviews first and bury the two — see rule 2.
 */
export const reviews: GoogleReview[] = [
  { name: 'priya singh rajput', stars: 5, text: 'Best sc hool' },
  {
    name: 'Krishna Singh',
    stars: 5,
    /**
     * ⚠⚠ THE FULL SENTENCE, ENDING "…of students." — NOT the truncated form.
     *
     * The widget CLAMPS this card visually and shows "…complete development of"
     * with a Read more control. The published text underneath is complete, and
     * the build brief's transcription captured what the clamp displayed. Storing
     * that would ship a CSS rendering artifact as though the reviewer had
     * stopped mid-phrase. "Verbatim" means the sentence they wrote, so the
     * `clipped` flag the brief specified is not needed and does not exist.
     */
    text: 'Excellent study environment. School focus over complete development of students.',
  },
  { name: 'Rudr Charsiya', stars: 5, text: 'Good' },
  { name: 'govind prasad', stars: 5, text: 'Nice and very good' },
  { name: 'Pramod Keshari', stars: 4, text: 'Good' },
  { name: 'Bhawna Agrawal', stars: 2, text: 'Good' },
  { name: 'Swati Agrawal', stars: 4, text: 'A very nice school in whole Ballia city' },
  { name: 'prachi singh', stars: 5, text: 'All good' },
];

/**
 * The aggregate, as the widget states it.
 *
 * ⚠ `total` AND `word` ARE BOTH IN THE SERVED HTML — "GOOD" and "Based on 368
 * reviews", both confirmed by parsing it.
 *
 * ⚠⚠ `score` IS THE ONE FIGURE ON THIS PAGE THAT COULD NOT BE VERIFIED FROM
 * THE MARKUP. The widget publishes no number: it renders the word GOOD and a
 * row of four full stars plus one half star. 4.4 is consistent with that half
 * star (TrustIndex draws one between roughly 4.3 and 4.7) and is what the brief
 * recorded from the widget on 11 September, so it stands — but it came from a
 * reading of the widget rather than from its HTML, and if it is ever questioned
 * that is where to look. It is NOT derived from the eight reviews above; those
 * are a sample of 368 and averaging them would produce a different, invented
 * number.
 */
export const rating = { score: 4.4, outOf: 5, word: 'Good', total: 368 };

/**
 * The closing strip.
 *
 * ⚠⚠ THE THIRD TILE CARRIES NO QUANTITY, ON PURPOSE. The comp's "500+ Happy
 * Families" is unpublished anywhere, describes families rather than reviews,
 * and is flatly contradicted by a two-star review sitting above it. The tile
 * says where the reviews come from, which is true and needs no number.
 */
export const strip = [
  { icon: 'people' as const, value: `${rating.total}`, label: 'Reviews on Google' },
  { icon: 'star' as const, value: `${rating.score} / ${rating.outOf}`, label: 'Average rating' },
  { icon: 'heart' as const, value: 'Ballia', label: 'Where families have reviewed us' },
];
