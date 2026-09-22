/**
 * ═══ CLASS CORNER — THE FOUR CLASS-LEVEL DOCUMENTS ═════════════════════════
 *
 * The four things a parent comes to a "class corner" for: who takes the class,
 * when it meets, who the monitors are, and when the examinations fall.
 *
 * ⚠⚠ TWO ITEMS THE CLIENT'S BRIEF LISTED ARE DELIBERATELY NOT HERE.
 *
 *   · EXAM IN-CHARGE DETAILS — the school has never published a name, a
 *     designation or a contact for this. It shipped once as a pending
 *     placeholder and the client had it removed on 19 Sep 2026. It is still
 *     owed (see site.ts → gaps.A14); it is simply no longer announced to
 *     visitors. DO NOT RE-ADD IT WITHOUT ASKING.
 *
 *   · ACADEMIC EXCELLENCE — was a card whose only job was to scroll you further
 *     down this same page, which is the page duplicating itself. It is a
 *     section now, not a card.
 *
 * ⚠⚠ EVERY href POINTS AT THE SCHOOL'S OWN FILE. DO NOT COPY THE DOCUMENTS IN.
 * They live on the school's WordPress site and are revised there every session
 * — `monitors-26-27.pdf` carries its session in its own filename and will be
 * replaced next year. A copy taken today goes stale silently and nothing here
 * would say so; a link to theirs keeps working when they replace it.
 *
 * ⚠ A NOTE ON FINDING THESE. The monitors' list was scoped as "pending,
 * awaiting the school". It had been published the whole time — a PDF sitting on
 * the Class Teachers page under a second heading, with no entry of its own in
 * the school's menu. SEARCH THE SCHOOL'S SITE, NOT ITS NAVIGATION.
 */

export interface CornerItem {
  id: string;
  title: string;
  /** What it is, in this project's voice — these are labels, not school copy. */
  body: string;
  icon: 'teacher' | 'clock' | 'badge' | 'exam' | 'person' | 'star';
  /** The real file or page. `null` means the school has not published it. */
  href: string | null;
  /** Shown on the card where the link is a document rather than a page. */
  kind?: 'PDF' | 'Image' | 'Page';
  /** Only on items that do not exist yet — printed verbatim on the card. */
  pending?: string;
  /** What the school owes, as chips. Names MISSING things, never values. */
  needs?: string[];
}

export const cornerItems: CornerItem[] = [
  {
    id: 'class-teachers',
    title: 'Class Teachers',
    body: 'Every class and section with the teacher who takes it, as published by the school office.',
    icon: 'teacher',
    href: 'http://sunbeamballia.edu.in/wp-content/uploads/class-teacher-updated.pdf',
    kind: 'PDF',
  },
  {
    id: 'class-timetable',
    title: 'Class Timetable',
    /**
     * ⚠ THE FIVE GROUPS ARE NAMED HERE BECAUSE THE LINK CANNOT NARROW.
     * The school publishes the timetable as SEVENTY-TWO separate JPEGs across
     * five grade groups, embedded in one page — no PDF, no per-class URL.
     * Hotlinking seventy-two images would be a maintenance trap and copying
     * them in would freeze a document that changes, so this links to the page
     * that holds them and names the groups, which is what a parent needs in
     * order to find their child's.
     */
    body: 'Timetables for Nursery to KG-2, Classes I–II, III–V, VI–VIII and IX–XII.',
    icon: 'clock',
    href: 'https://sunbeamballia.edu.in/class-timetable/',
    kind: 'Page',
  },
  {
    id: 'student-monitors',
    title: 'Student Monitors',
    body: 'The monitors appointed for the 2026-27 session, class by class.',
    icon: 'badge',
    href: 'http://sunbeamballia.edu.in/wp-content/uploads/monitors-26-27.pdf',
    kind: 'PDF',
  },
  {
    id: 'exam-schedule',
    title: 'Examination Schedule',
    body: 'The examination schedule for the 2026-27 session.',
    icon: 'exam',
    href: 'http://sunbeamballia.edu.in/wp-content/uploads/WhatsApp-Image-2026-06-24-at-14.18.48.jpeg',
    kind: 'Image',
  },
];

export const liveCount = cornerItems.filter((i) => i.href).length;
export const pendingCount = cornerItems.filter((i) => !i.href).length;
