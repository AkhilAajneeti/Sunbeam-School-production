/**
 * ALUMNI REGISTRATION — configuration, kept apart from alumni CONTENT.
 *
 * ⚠⚠ EVERYTHING IN THIS FILE IS PROPOSED UI, NOT PUBLISHED SCHOOL POLICY.
 * Sunbeam Ballia operates no alumni register: its own /alumni/registration/ page
 * is a placeholder, and nothing on sunbeamballia.edu.in describes a registration
 * process, an alumni association, a membership or a benefit attached to one.
 * The fields, the benefit strip and the engagement cards below are the
 * experience being DESIGNED for the new site. The page states that on its face.
 *
 * ⚠ THE SEPARATION IS THE POINT. data/alumniMeets.ts holds what the school has
 * actually published — the Pradiptam 2.0 meet, its wording, its photographs.
 * This file holds what we are proposing. Mixing the two is how a design concept
 * ends up quoted back as a school commitment.
 *
 * ⚠⚠ `endpoint` IS null, AND THE FORM READS IT. With no endpoint the form
 * validates fully, then explains that nothing was sent and offers the school's
 * real office line. Point it at a real URL and the same form posts and shows the
 * success state — no markup changes. A form that appears to submit into nothing
 * collects real personal data from people who believe the school asked for it,
 * which is worse than one that is honest about not being wired up yet.
 */
import { school } from './site';

export interface RegistrationField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required: boolean;
  /** Placeholder / helper shown inside the control. */
  hint?: string;
  /** autocomplete token, so a browser can fill it correctly. */
  auto?: string;
  /** Options for a select. */
  options?: readonly string[];
  /** Spans both columns on desktop. */
  wide?: boolean;
  /** Validation beyond "not empty". */
  rule?: 'email' | 'phone' | 'year';
}

/**
 * ⚠⚠ THE ENDPOINT IS BUILT FROM THE ENVIRONMENT, NOT TYPED IN. It is the same
 * Strapi origin the contact form posts to, and the same rule applies: on a
 * deploy where STRAPI_PUBLIC_URL is unset this resolves to null and the form
 * goes back to saying plainly that nothing was sent — which is the only honest
 * thing a form with nowhere to post can do. It must never fall back to a
 * hard-coded localhost, because that fails silently in production.
 */
const strapiBase = (
  import.meta.env.STRAPI_PUBLIC_URL ??
  import.meta.env.STRAPI_URL ??
  ''
).replace(/\/+$/, '');

export const registrationSettings = {
  enabled: true,
  /** ⚠ null = not wired up. See above and the file header. */
  endpoint: strapiBase ? `${strapiBase}/api/alumni-registrations` : (null as string | null),
  successMessage: 'Thank you. Your registration has been submitted.',
  contactPhone: school.phone.office,
  contactPhoneDisplay: school.phone.officeDisplay,
  contactEmail: school.email,
};

/**
 * ⚠ THE CLASS LIST IS THE SCHOOL'S OWN RANGE — Nursery to Class XII, which
 * data/site.ts records and the footer prints. It is not an invented curriculum.
 */
const CLASSES = [
  'Class XII',
  'Class XI',
  'Class X',
  'Class IX',
  'Class VIII or below',
  'Other',
] as const;

export const registrationFields: RegistrationField[] = [
  { name: 'name', label: 'Full name', type: 'text', required: true, hint: 'Your name as it was on the school roll', auto: 'name' },
  { name: 'year', label: 'Passing year', type: 'text', required: true, hint: 'e.g. 2019', auto: 'off', rule: 'year' },
  { name: 'email', label: 'Email address', type: 'email', required: true, hint: 'you@example.com', auto: 'email', rule: 'email' },
  { name: 'mobile', label: 'Mobile number', type: 'tel', required: true, hint: '10-digit mobile number', auto: 'tel', rule: 'phone' },
  { name: 'course', label: 'Class completed', type: 'select', required: true, options: CLASSES },
  { name: 'location', label: 'Current location', type: 'text', required: false, hint: 'City, country', auto: 'address-level2' },
  { name: 'profession', label: 'Profession', type: 'text', required: false, hint: 'What you do now', auto: 'organization-title' },
  { name: 'organisation', label: 'Organisation', type: 'text', required: false, hint: 'Where you work or study', auto: 'organization' },
  { name: 'message', label: 'Message', type: 'textarea', required: false, hint: 'Anything you would like the school to know', wide: true },
];

/**
 * The purpose strip. ⚠ WRITTEN AS INTENT, NOT AS SERVICE. Each line says what
 * registering is FOR, not what the school will do — because no undertaking has
 * been made. "Receive school updates" would be a promise; "so the school can
 * reach you" is a description of the form.
 */
export const registrationBenefits = [
  { n: '01', mark: 'megaphone', k: 'Stay updated', v: 'So news of a meet can reach you rather than passing you by.' },
  { n: '02', mark: 'hands', k: 'Reconnect', v: 'So the people you sat with can be found again.' },
  { n: '03', mark: 'grow', k: 'Give back', v: 'If you would like to offer your experience to students who follow.' },
  { n: '04', mark: 'medal', k: 'Be proud', v: 'Your course after school is part of the school’s record too.' },
] as const;

/**
 * The right-hand column of the registration card.
 *
 * ⚠⚠ EVERY ONE IS PHRASED AS A POSSIBILITY, NOT A PROGRAMME. The school runs no
 * alumni community, no mentorship scheme and no events calendar for former
 * students — none is published anywhere on its site. "Mentorship opportunities"
 * as a flat statement would announce a programme that does not exist, so the
 * copy says what registering would make possible instead.
 */
export const engagementCards = [
  {
    mark: 'person',
    k: 'An alumni list worth having',
    v: 'A register is the first thing any alumni community needs. There isn’t one yet — this would be it.',
  },
  {
    mark: 'calendar',
    k: 'An invitation to the next meet',
    v: 'The school has held its alumni meet. Registering is how an invitation to the next one would find you.',
  },
  {
    mark: 'speech',
    k: 'A way to offer mentorship',
    v: 'No mentorship scheme is published. If one is set up, the people who volunteered here are where it starts.',
  },
  {
    mark: 'quote',
    k: 'Your account, in your words',
    v: 'The school publishes its alumni cards but not their stories. Yours could be the first, with your consent.',
  },
] as const;
