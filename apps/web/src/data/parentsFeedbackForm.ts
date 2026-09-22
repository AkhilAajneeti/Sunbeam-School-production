/**
 * "YOUR VOICE MATTERS" — the feedback form's content and settings.
 *
 * ═══ THIS FILE NEVER FEEDS THE PAGE ABOVE IT ═══════════════════════════════
 *
 * ⚠⚠ FORM INPUT GOES TO THE SCHOOL OFFICE. PAGE DISPLAY COMES FROM A HUMAN WHO
 * CHECKED AND GOT CONSENT. Nothing a parent types here may ever appear in the
 * voices carousel — not automatically, not "after moderation", not behind a
 * flag. Wiring the two together is how a site ends up publishing either spam or
 * a real parent's name without their permission. The two data files
 * (parentsFeedback.ts and this one) do not import each other, and that
 * separation is the safeguard.
 *
 * ═══ THE FORM DOES NOT PRETEND TO SUBMIT ═══════════════════════════════════
 *
 * ⚠⚠ THE ENDPOINT IS NOW WIRED — feedback lands in Strapi under Parent
 * Feedback. It is resolved at build time from STRAPI_PUBLIC_URL (falling back
 * to STRAPI_URL) and stamped onto the <form> as a data attribute, exactly as
 * the contact form does. It is NOT a `PUBLIC_*` variable: Astro inlines every
 * one of those into the client bundle, and this repo bans that prefix so that
 * nobody adds `PUBLIC_STRAPI_TOKEN` beside it and ships the CMS credential to
 * every visitor. See lib/cms/config.ts.
 *
 * ⚠⚠ AN EMPTY ENDPOINT REMAINS A SUPPORTED STATE, AND THE HONEST FAILURE STAYS.
 * Build with no Strapi configured and the endpoint is '', and the form
 * validates fully and then states plainly that nothing was sent and nothing was
 * stored, pointing the parent at the office line instead.
 *
 * A form that appears to submit into nothing is worse than one that admits it.
 * It takes a parent's name, their child's name, their phone number and
 * something they may have taken courage to write, and drops all of it while
 * thanking them for it.
 *
 * Mirrors data/alumniRegistration.ts + components/alumni/ArForm.astro, which is
 * the same problem already solved once on this site. Follow that contract
 * rather than inventing a second form idiom.
 */
import { school } from './site';

/**
 * ⚠ STRAPI_PUBLIC_URL OVERRIDES STRAPI_URL, AND IN PRODUCTION IT MUST. The
 * build talks to Strapi server-to-server and may reach it on a private address;
 * this URL is typed into a visitor's browser, so it has to be the public one.
 * They are the same thing in development and different the moment Strapi sits
 * behind a private network.
 */
const strapiBase = (
  import.meta.env.STRAPI_PUBLIC_URL ??
  import.meta.env.STRAPI_URL ??
  ''
).replace(/\/+$/, '');

export const feedbackSettings = {
  /** '' = not wired up, and the form says so. See the file header. */
  endpoint: strapiBase ? `${strapiBase}/api/parent-feedbacks` : null,
  successMessage: 'Thank you. Your feedback has been sent to the school.',
  contactPhone: school.phone.office,
  contactPhoneDisplay: school.phone.officeDisplay,
  contactEmail: school.email,
};

/**
 * ⚠⚠ "CLASS", NOT "CLASS & SECTION". The reference comp asks for a section
 * letter. This project documents no section letters anywhere — not in site.ts,
 * not on any academics page — so offering "A–D" would invent the shape of the
 * school, and a parent picking "Section C" would be telling the office
 * something the school never asked.
 *
 * The range is the school's own: `school.classRange` is "Nursery to Class XII".
 */
const CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class I',
  'Class II',
  'Class III',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
  'Class XI',
  'Class XII',
] as const;

/**
 * ⚠⚠ EVERY OPTION NAMES SOMETHING THIS SITE ALREADY DOCUMENTS. A dropdown is a
 * claim: listing "Robotics lab" or "Swimming" would tell a parent the school
 * runs it. Each of these has a page behind it — teaching, staff, campus,
 * sport, safety, transport, communication — plus an escape hatch, so a parent
 * whose answer is not on the list is not pushed into one that is wrong.
 */
const APPRECIATE = [
  'Teaching and learning',
  'Teachers and staff',
  'Campus and facilities',
  'Sports and activities',
  'Safety and care',
  'Transport',
  'Communication with parents',
  'Something else',
] as const;

/**
 * The band's own copy, from the client's design.
 *
 * ⚠ THE THREE BENEFITS DESCRIBE THE FORM, NOT THE SCHOOL. "Your feedback
 * guides what the school looks at next" is a statement about what this form is
 * for; it makes no claim about results, numbers or outcomes. That is the line
 * this page holds — nothing here asserts anything about Sunbeam that would need
 * checking.
 *
 * ⚠ THE SCRIPT FLOURISH IS DECORATIVE AND aria-hidden. It is set in Caveat,
 * which is already self-hosted for the homepage reviews band.
 */
export const feedbackBand = {
  eyebrow: 'Share your experience',
  /** `{{…}}` marks the words set in orange. */
  heading: 'Your Voice {{Matters}}',
  standfirst:
    'Every suggestion, appreciation and idea helps us make Sunbeam better for our children.',
  flourish: ['Together', 'for Brighter', 'Futures'],
  benefits: [
    {
      icon: 'heart' as const,
      title: 'Help Us Improve',
      body: 'Your feedback guides what the school looks at next.',
    },
    {
      icon: 'people' as const,
      title: 'Stronger Community',
      body: 'Parents and teachers building a better place to learn, together.',
    },
    {
      icon: 'star' as const,
      title: 'Celebrate What Works',
      body: 'Kind words reach the staff they are about.',
    },
  ],
  submitLabel: 'Submit feedback',
  reachLabel: 'Or speak to the school office:',
  recommendLabel: 'Would you recommend Sunbeam to other parents?',
  ratingLabel: 'Overall experience',
  ratingHint: 'Tap to rate',
};

export type FeedbackFieldType = 'text' | 'tel' | 'select' | 'textarea';

export interface FeedbackField {
  name: string;
  label: string;
  type: FeedbackFieldType;
  required: boolean;
  hint?: string;
  options?: readonly string[];
  /** autocomplete token, or 'off'. */
  auto?: string;
  /** Extra validation beyond "not empty" — matches ArForm's rule names. */
  rule?: 'phone';
  /** Spans both columns. */
  wide?: boolean;
  /** The select's empty first option. Each one reads differently in the comp. */
  placeholder?: string;
}

export const feedbackFields: FeedbackField[] = [
  {
    name: 'parentName',
    label: 'Parent name',
    type: 'text',
    required: true,
    hint: 'Enter your name',
    auto: 'name',
  },
  {
    name: 'studentName',
    label: 'Student name',
    type: 'text',
    required: true,
    hint: 'Enter student’s name',
    auto: 'off',
  },
  {
    name: 'studentClass', label: 'Class', type: 'select', required: true,
    options: CLASSES, placeholder: 'Select class',
  },
  /**
   * ⚠ OPTIONAL, AND THAT IS A CONTENT DECISION. A parent leaving praise has no
   * reason to give a number, and a parent raising something difficult may
   * deliberately not want to be rung back. Requiring it quietly filters
   * feedback down to the people comfortable being telephoned — which is the
   * opposite of what a feedback form is for.
   */
  {
    name: 'phone',
    label: 'Phone number',
    type: 'tel',
    required: false,
    hint: 'Optional — if you would like a reply',
    auto: 'tel',
    rule: 'phone',
  },
  {
    name: 'appreciate',
    label: 'What do you appreciate most?',
    type: 'select',
    required: false,
    options: APPRECIATE,
    placeholder: 'Select an option',
  },
  {
    name: 'feedback',
    label: 'Your feedback',
    type: 'textarea',
    required: true,
    hint: 'Share your thoughts, suggestions or appreciation…',
    wide: true,
  },
];

/**
 * The star rating.
 *
 * ⚠⚠ FIVE REAL RADIOS IN A FIELDSET, NOT A DIV WITH CLICK HANDLERS. A div
 * looks identical and cannot be used by a keyboard at all. The labels below are
 * what a screen reader announces, so they have to say what the star means.
 */
export const ratingOptions = [
  { value: '5', label: 'Excellent' },
  { value: '4', label: 'Very good' },
  { value: '3', label: 'Good' },
  { value: '2', label: 'Fair' },
  { value: '1', label: 'Poor' },
] as const;

/** Would you recommend Sunbeam? — optional, so there is no "no answer" option. */
export const recommendOptions = ['Yes', 'Maybe', 'No'] as const;
