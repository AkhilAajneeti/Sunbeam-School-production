/**
 * CAREER — the school's recruitment posters.
 *
 * ═══ WHAT THIS FILE IS ═════════════════════════════════════════════════════
 *
 * Ten hiring banners the client supplied in `src/assets/jobs/`, published as a
 * poster wall on /career/. The client chose the poster-wall treatment and chose
 * to publish all ten as-is; this file is the record of what each one says.
 *
 * ⚠ `alt` IS A TRANSCRIPTION, NOT A DESCRIPTION, AND THAT IS THE WHOLE POINT OF
 * THIS FILE. Every word on this page — role, subject, salary, qualification,
 * phone number — is pixels inside a JPEG. To Google and to a screen reader an
 * untranscribed poster wall is a blank page: a teacher searching "PGT vacancy
 * Ballia" would never find it, and a blind applicant would hear "image, image,
 * image" ten times. The transcriptions cost nothing on screen and are the only
 * thing that makes the page findable and readable. They are long ON PURPOSE.
 *
 * ⚠ EVERY TRANSCRIPTION IS READ OFF THE POSTER, NEVER INFERRED. Where a poster
 * is ambiguous the transcription stays vague rather than resolving it. Nothing
 * here is checked against data/site.ts and made to agree with it — see the note
 * on contacts below, which is a real conflict and is recorded rather than tidied
 * away.
 *
 * ⚠ THE POSTERS DISAGREE WITH EACH OTHER ABOUT HOW TO APPLY. Between them they
 * print five phone numbers — 7755005905, 7318096919, 7755801294, 7755005907,
 * 7678922046 — of which only 7755005905 is in site.ts, and two email addresses,
 * neither of which is site.ts's `email`. They are transcribed exactly as printed
 * because that is what the poster says; the page's own "How to apply" panel uses
 * the single pair the client chose (site.recruitmentEmail + the office number)
 * so an applicant is never asked to pick between five numbers.
 *
 * ⚠ THREE POSTERS ADVERTISE DATES THAT HAVE PASSED — job-5 (Dec 2024 – Jan
 * 2025), job-6 (Dec 2023 – Jan 2024) and job-7 (31 Dec 2023). This was raised
 * with the client, who chose to publish all ten as-is; the decision is theirs
 * and is deliberate rather than an oversight. Those three carry `dated: true`,
 * which does two things: it sorts them to the end of the wall, and it puts the
 * campaign date in the caption so a reader sees WHEN the walk-in was before they
 * plan a journey to Agarsanda. Flipping the flag off is the one edit needed if
 * the school ever wants them hidden instead.
 */
import job1 from '../assets/jobs/job-1.jpg';
import job2 from '../assets/jobs/job-2.jpg';
import job3 from '../assets/jobs/job-3.jpg';
import job4 from '../assets/jobs/job-4.jpg';
import job5 from '../assets/jobs/job-5.jpg';
import job6 from '../assets/jobs/job-6.jpeg';
import job7 from '../assets/jobs/job-7.jpeg';
import job8 from '../assets/jobs/job-8.jpeg';
import job9 from '../assets/jobs/job-9.jpeg';
import job10 from '../assets/jobs/job-10.jpeg';

export interface Poster {
  src: ImageMetadata;
  /** The caption under the frame, and the lightbox's caption line. */
  title: string;
  /** One short line: what kind of vacancy, at a glance. */
  tag: string;
  /** Full transcription. See the note above — this is the page's only real text. */
  alt: string;
  /** Set when the poster prints a walk-in or interview date that has passed. */
  dated?: string;
  /** Set when the poster's body copy is Hindi, so `lang` can be marked. */
  lang?: 'hi';
}

/**
 * ⚠ ORDER IS EDITORIAL, NOT FILENAME ORDER. Undated postings first, because a
 * reader arriving today can act on those; the three dated campaigns follow, so
 * the wall does not open on a walk-in from 2023. Within the undated group the
 * two broadest postings lead — the transport roles, which are the only
 * non-teaching vacancy in the set, and the general vacancies board.
 */
export const posters: Poster[] = [
  {
    src: job1,
    title: 'Bus driver and conductor',
    tag: 'Transport · Hindi',
    lang: 'hi',
    alt:
      'Recruitment poster in Hindi from Sunbeam School Ballia for a bus driver (बस चालक) and conductor (कंडक्टर). ' +
      'Driver salary ₹15,000 per month; conductor salary ₹8,000 per month. ' +
      'Requirements listed: a valid heavy or school-bus driving licence is compulsory; a minimum of three to five years of bus-driving experience is desirable; ' +
      'no police case or criminal record of any kind; age up to 45 years; physically and mentally fit; punctual, honest and responsible; ' +
      'good conduct toward students, parents and staff; sound knowledge of traffic rules and road safety; ' +
      'preference given to candidates with school transport experience. ' +
      'Interested candidates should bring their documents and driving licence to the school office. ' +
      'Address given as Sunbeam School, Agarsanda, Ballia. Telephone numbers printed: 7755005905, 7755005909 and 7678922046.',
  },
  {
    src: job2,
    title: 'Vacancies — teaching and non-academic staff',
    tag: 'All departments',
    alt:
      'Recruitment poster headed "Vacancies" from Sunbeam School Ballia, a CBSE-affiliated senior secondary school. ' +
      'Applications open for dedicated educators and skilled non-academic professionals from reputed institutions, as the school expands its team for the upcoming academic session. ' +
      'Open positions: PGT, TGT and PRT for all subjects; NTT mother teachers for kindergarten; ' +
      'LKF teacher (Lead Knowledge Facilitator) needing good English communication with effective reading and narration skills; ' +
      'clinical psychology counsellor and wellness trainer; activity in-charges; lab assistants; lady gymnastics coach. ' +
      'Requirements: qualification as per CBSE norms; excellent command over English, spoken and written; proficiency in conducting online classes and using modern classroom technology. ' +
      'Remuneration commensurate with qualifications and experience. Accommodation can be provided to outstation candidates. ' +
      'CVs to appointmentsunbeamballia@gmail.com; telephone 73180 96919 and 7755005905.',
  },
  {
    src: job10,
    title: 'PGT and TGT — English, Computer Science, Biology, Legal Studies, Economics',
    tag: 'Teaching',
    alt:
      'Recruitment poster headed "We are hiring!" from Sunbeam School Ballia, affiliated to CBSE (senior secondary), CBSE affiliation number 2131962, school code 70205. ' +
      'Qualification as per the CBSE norms. Positions: PGT and TGT in English, Computer Science, Biology, Legal Studies and Economics. ' +
      'All applicants must have good English communication skills and relevant board experience. ' +
      'Submit your CV to appointmentsunbeamballia@gmail.com; telephone +91 7755005905 and +91 7318096919.',
  },
  {
    src: job4,
    title: 'PRT, TGT, PGT and sports coaches',
    tag: 'Teaching · Sports',
    alt:
      'Recruitment poster headed "We are hiring!" from Sunbeam School Ballia, CBSE affiliation number 2131962, school code 70205. ' +
      'Qualification as per the CBSE norms. The school is looking for someone who enjoys working in a fast-paced environment, ' +
      'possesses excellent communication skills, is multilingual (preferably English and Hindi) and is well-versed with MS Office. ' +
      'Positions: PRT for mother teacher, junior game teacher, Hindi and Computer Science; TGT for English and Computer Science; ' +
      'PGT for Hindi, Biology, Accounts and Computer Science; sports coaches for hockey, football, table tennis, chess, athletics and archery. ' +
      'Candidates with a minimum of two to three years of experience in the same capacity, and proficient in English, will be preferred. ' +
      'Resumes to appointmentsunbeamballia@gmail.com; telephone +91 7755005905 and +91 7318096919.',
  },
  {
    src: job9,
    title: 'PGT — English, Computer Science, Geography, Economics',
    tag: 'Teaching',
    alt:
      'Recruitment poster headed "We’re hiring — come and grow with us" from Sunbeam School Ballia. ' +
      'Appointment of PGT for English, Computer Science, Geography and Economics. ' +
      'Qualification as per the CBSE norms; fluency in English is a must. ' +
      'Send your CV and cover letter to principalsunbeamballia@gmail.com, contact +91 7755005905, ' +
      'or to appointmentsunbeamballia@gmail.com, contact +91 7755801294.',
  },
  {
    src: job3,
    title: 'English teacher — PRT, TGT, PGT',
    tag: 'Teaching · English',
    alt:
      'Recruitment poster headed "Career opportunities" from Sunbeam School Ballia, affiliated to CBSE, Bharat (senior secondary), ' +
      'CBSE affiliation number 2131962, school code 70205. English teacher vacancies at PRT, TGT and PGT level. ' +
      'Qualification and requirements: BA or MA in English; D.El.Ed or B.Ed; excellent English communication skills; ' +
      'a minimum of two to three years of teaching experience; proficiency with MS Office and computer skills. ' +
      'Accommodation facility available for outstation candidates. Salary will be as per competency. ' +
      'Send your CV or resume to appointmentsunbeamballia@gmail.com; telephone +91 7318096919. ' +
      'School campus at Agarsanda, 2 km from Roadways Bus Stand, on Garwar Road, Ballia, Uttar Pradesh. ' +
      'Website www.sunbeamballia.edu.in; call +91 7755005905 or +91 7318096919.',
  },
  {
    src: job8,
    title: 'PGT, TGT, PRT, NTT and sports',
    tag: 'Teaching · Sports',
    alt:
      'Recruitment poster headed "We are hiring! Join our amazing team" from Sunbeam School Ballia. ' +
      'Qualification as per the CBSE norms; fluency in English is a must. Open positions: ' +
      'PGT in Maths, English, Accounts, Economics, Geography, Physics, Science and Commerce; ' +
      'TGT in Maths, English, Commerce and Science; PRT in all subjects; NTT mother teacher and dance teacher; ' +
      'sports coaches for chess, shooting, table tennis and skating. ' +
      'Submit your CV. Telephone +91 7755801294 and +91 77550 05907; email appointmentsunbeamballia@gmail.com; website www.sunbeamballia.edu.in.',
  },

  /* ── The dated campaigns ──────────────────────────────────────────────────
     Everything below advertises an interview date that has already passed. See
     the note at the head of this file: published on the client's instruction,
     sorted last, and each one states its date in the caption so nobody plans a
     journey around it. */
  {
    src: job5,
    title: 'Walk-in interview — teaching staff',
    tag: 'Teaching · Walk-in',
    dated: 'December 2024 – January 2025',
    alt:
      'Recruitment poster headed "We are hiring! Walk-in interview" from Sunbeam School Ballia, ' +
      'CBSE affiliation number 2131962, school code 70205. Walk-in interviews 9:00 am to 1:00 pm on ' +
      '28 December 2024, 7 January 2025, 14 January 2025 and 27 January 2025. ' +
      'Pre-primary and primary teachers: dance teacher, English story teller, music teacher, and mother teacher with knowledge of all subjects. ' +
      'Middle school teachers: English, Science, Social Science, Maths and French. ' +
      'Secondary and senior secondary teachers: Maths, English, Physics, Accountancy, Economics and Geography. ' +
      'Qualification as per the CBSE norms. All applicants must have good English communication skills and relevant board experience. ' +
      'Submit your CV. Telephone +91 7755005905 and +91 7318096919; email appointmentsunbeamballia@gmail.com.',
  },
  {
    src: job6,
    title: 'Walk-in interview — teachers, counsellor and sports',
    tag: 'Teaching · Walk-in',
    dated: 'December 2023 – January 2024',
    alt:
      'Recruitment poster headed "We are hiring!" from Sunbeam School Ballia, inviting applicants to join the team ' +
      'alongside experienced Sunbeam educators and alumni of Ballia. Walk-in interviews on 31 December 2023, 7 January 2024, ' +
      '15 January 2024 and 26 January 2024. ' +
      'Pre-primary and primary teachers: all subjects, dance teacher and English story teller — graduate with ECCEd., NTT or B.Ed., minimum two years of relevant experience preferred. ' +
      'Middle school teachers: English, Science, Social Science and Maths — graduate or postgraduate with B.Ed. and minimum two years of relevant school experience in grades 6 to 8. ' +
      'Secondary and senior secondary teachers: English, Physics, Accounts, Economics and Geography — graduate or postgraduate with B.Ed. and minimum five years of relevant school experience in grades 9 to 12. ' +
      'School counsellor: MA in counselling or clinical psychology with two years of experience as a school counsellor. ' +
      'Sports teachers: chess, shooting, table tennis and skating — graduate or postgraduate with B.Ed. and minimum two years of relevant school experience. ' +
      'All applicants must have good communication skills and relevant board experience. ' +
      'Submit your CV. Telephone +91 7755801294 and +91 7755005907; email appointmentsunbeamballia@gmail.com.',
  },
  {
    src: job7,
    title: 'Walk-in interview — PGT, TGT, PRT, NTT and sports',
    tag: 'Teaching · Walk-in',
    dated: '31 December 2023',
    alt:
      'Recruitment poster headed "We are hiring! Come and grow with us" from Sunbeam School Ballia. ' +
      'Qualification as per the CBSE norms; fluency in English is a must. Walk-in interview on 31 December 2023. ' +
      'Open positions: PGT in Maths, English, Accounts, Economics, Geography, Physics, Science and Commerce; ' +
      'TGT in Maths, English, Commerce and Science; PRT in all subjects; NTT mother teacher and dance teacher; ' +
      'sports coaches for chess, shooting, table tennis and skating. ' +
      'Submit your CV. Telephone +91 7755801294 and +91 7755005907; email appointmentsunbeamballia@gmail.com; website www.sunbeamballia.edu.in.',
  },
];

/** Used by the page's counter, so the number can never drift from the wall. */
export const posterCount = posters.length;

/**
 * ═══ THE PAGE'S OWN COPY ═══════════════════════════════════════════════════
 *
 * Everything on /career/ that is not a job notice. These used to be literals
 * inside career.astro; they live here so the seed can put them in the CMS.
 *
 * ⚠ THE POSTING COUNT IS NOT HERE. The page prints `posters.length`, so it can
 * never disagree with the wall below it.
 *
 * ⚠ THE EMAIL, PHONE AND ADDRESS ARE NOT HERE EITHER — they come from site.ts
 * and are printed in 57 files. Only the label and note around each are stored.
 *
 * ⚠ THE QUERY LAYER HOLDS A COPY as CAREER_DEFAULTS in lib/cms/queries/career.ts,
 * the fallback for an unseeded CMS. Change one, change both, or seed again.
 */
export const careerCopy = {
  wall: {
    heading: 'Work at Sunbeam',
    stand:
      'Every notice the school has published, newest first. Each one names the roles, the ' +
      'subjects and the qualification it asks for — select a poster to read it at full size.',
  },
  ctaCvLabel: 'Send your CV',
  ctaCallLabel: 'Call the office',
  apply: {
    heading: 'How to apply',
    stand: 'Three ways to reach the school about a post.',
  },
  applyMethods: [
    {
      label: 'By email',
      note:
        'Attach your CV and say which role you are applying for. Most of the notices above ask ' +
        'for applications this way.',
    },
    { label: 'By phone', note: 'The school office, during school hours.' },
    {
      label: 'In person',
      note:
        'Driver and conductor applicants are asked to bring their documents and driving licence ' +
        'to the school office.',
    },
  ],
} as const;
