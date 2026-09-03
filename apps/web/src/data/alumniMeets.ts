/**
 * ALUMNI MEETS AND ALUMNI STORIES — the content store behind /alumni/.
 *
 * ⚠⚠ THIS FILE IS THE CMS. The Alumni page renders whatever is `published: true`
 * here and nothing else. Adding a meet is one entry; adding twenty is twenty
 * entries and no change to a single component. Nothing downstream counts to a
 * number, hard-codes a session, or assumes a photograph exists.
 *
 * ═══ SOURCE — sunbeamballia.edu.in/school-activities/, and only there ═══════
 * The school publishes its alumni record inside the activity feed on that page,
 * not on a standalone /alumni/ page (which 404s). The entry, its wording and its
 * five photographs were all read off it.
 *
 * ⚠⚠ THE MEET IS "PRADIPTAM 2.0", SESSION 2026-27 — NOT "PRADEEPTAM / LIGHT TO
 * VISION / 2024-25". The design brief asked for the latter. Searched across the
 * whole domain — school-activities, publications, event-chronicles, the home
 * page, all sixty page slugs in wp-sitemap.xml and the posts feed — the string
 * "Light to Vision" does not appear anywhere, and neither does a 2024-25 alumni
 * meet. What the school actually publishes is one meet, spelled Pradiptam,
 * titled "Pradiptam 2.0 | Alumni Meet 2026-27". The source-of-truth rule is
 * explicit, so the site's own wording and spelling win over the brief's.
 *
 * ⚠ THE PHOTOGRAPHS ARE CONFIRMED BY WHAT IS IN THEM, not by where they sat in
 * the markup. Each was opened and checked: 02 and 04 show the meet's own green
 * badges reading "Pradiptam · ALUMNI MEET 2026 · BALLIA", and 04 also shows a
 * "Pradiptam 2.0" table card. A sixth image adjacent to the post in the feed was
 * discarded — it shows Sunbeam School MUGHALSARAI certificates, a different
 * branch, and belongs to the next entry.
 *
 * ⚠ NO SECOND MEET, AND NO "COMING SOON" CARDS. The reference art showed
 * placeholders for 2026-27, 2027-28 and 2028-29. The school has announced no
 * future meet, and a card promising one is a commitment made on its behalf.
 *
 * ⚠ NOT RECORDED FOR THE MEET: a date, a venue, an attendance figure, a chief
 * guest or a programme. The school publishes none, and the detail page renders
 * only fields that carry a value — an absent field shows nothing rather than a
 * blank row inviting somebody to fill it in.
 *
 * ═══ TO ADD A MEET ═════════════════════════════════════════════════════════
 *   1. put the photographs in src/assets/alumni-meets/<slug>/
 *   2. import them at the top of this file
 *   3. push one entry into `alumniMeets`, newest first
 *   4. set `featured: true` on the one that should headline the page
 * The slider, the gallery, the detail route and every count follow.
 */
import mGroup from '../assets/alumni-meets/pradiptam-2-0-2026-27/01-group-on-the-steps.jpg';
import mMedals from '../assets/alumni-meets/pradiptam-2-0-2026-27/02-alumni-with-medallions.jpg';
import mHall from '../assets/alumni-meets/pradiptam-2-0-2026-27/03-alumni-in-the-hall.jpg';
import mTable from '../assets/alumni-meets/pradiptam-2-0-2026-27/04-medallions-at-the-table.jpg';
import mLamp from '../assets/alumni-meets/pradiptam-2-0-2026-27/05-lamp-lighting.jpg';
/* Added from photographs the school sent directly, at full resolution. The five
   above came from its public activity feed; these are the same evening. */
import mEntrance from '../assets/alumni-meets/pradiptam-2-0-2026-27/06-entrance-before-the-meet.jpg';
import mSpeaker from '../assets/alumni-meets/pradiptam-2-0-2026-27/07-an-alumna-speaking.jpg';
import mMedallion from '../assets/alumni-meets/pradiptam-2-0-2026-27/08-a-medallion-presented.jpg';
import mSteps from '../assets/alumni-meets/pradiptam-2-0-2026-27/09-alumni-and-staff-on-the-steps.jpg';
import mLampClose from '../assets/alumni-meets/pradiptam-2-0-2026-27/10-lighting-the-lamp.jpg';
import mRoundTable from '../assets/alumni-meets/pradiptam-2-0-2026-27/11-alumni-at-a-round-table.jpg';
import mFourAlumnae from '../assets/alumni-meets/pradiptam-2-0-2026-27/12-alumnae-at-a-table.jpg';
import mMedalPg from '../assets/alumni-meets/pradiptam-2-0-2026-27/13-a-medallion-for-a-postgraduate.jpg';
import mMedalMed from '../assets/alumni-meets/pradiptam-2-0-2026-27/14-a-medallion-for-a-medical-student.jpg';
import mMedalPol from '../assets/alumni-meets/pradiptam-2-0-2026-27/15-a-medallion-for-a-politics-graduate.jpg';
import mMedalTeacher from '../assets/alumni-meets/pradiptam-2-0-2026-27/16-a-medallion-from-a-teacher.jpg';
import mMedalMicro from '../assets/alumni-meets/pradiptam-2-0-2026-27/17-a-medallion-for-a-microbiologist.jpg';
import mMedal2024 from '../assets/alumni-meets/pradiptam-2-0-2026-27/18-a-medallion-for-the-2024-batch.jpg';
import mMedal2223 from '../assets/alumni-meets/pradiptam-2-0-2026-27/19-a-medallion-for-the-2022-23-batch.jpg';
import mMedalSci from '../assets/alumni-meets/pradiptam-2-0-2026-27/20-a-medallion-for-a-science-graduate.jpg';
import mStanding from '../assets/alumni-meets/pradiptam-2-0-2026-27/21-standing-at-the-tables.jpg';

/** One photograph in a meet's gallery. */
export interface MeetPhoto {
  image: ImageMetadata;
  /** What is in the frame. Never the event's name standing in for a description. */
  alt: string;
  /** Optional caption shown in the viewer. */
  caption?: string;
}

export interface AlumniMeet {
  /** URL segment — /alumni/<slug>/. */
  slug: string;
  title: string;
  /** The event's own second line, where it has one. */
  subtitle?: string;
  /** Session as the school writes it. */
  session: string;
  /** The school's own wording, paragraph by paragraph. */
  description: string[];
  cover?: ImageMetadata;
  coverAlt?: string;
  gallery: MeetPhoto[];
  /** The one that headlines the page. Only the first `featured` is used. */
  featured?: boolean;
  published: boolean;
  /** Where this record came from. */
  source?: string;
}

export interface AlumniStory {
  name: string;
  batch?: string;
  photo?: ImageMetadata;
  photoAlt?: string;
  profession?: string;
  organisation?: string;
  study?: string;
  /** Their own words. Requires written consent before it can ever be filled. */
  quote?: string;
  story?: string[];
  gallery?: MeetPhoto[];
  featured?: boolean;
  published: boolean;
}

const S = 'Sunbeam School Ballia';

export const alumniMeets: AlumniMeet[] = [
  {
    slug: 'pradiptam-2-0-2026-27',
    title: 'Pradiptam 2.0',
    subtitle: 'Alumni Meet 2026–27',
    session: '2026–27',
    /* ⚠ VERBATIM. The school's own four sentences, in its own order and with its
       own em-dash. Not paraphrased, not tightened, not extended. */
    description: [
      'Some journeys never truly end—they simply come full circle.',
      'Pradiptam 2.0 | Alumni Meet 2026–27 was a heartfelt celebration of memories, friendships, and the timeless bond that every Sunbeam carries forever.',
      'From revisiting classrooms to reliving unforgettable moments, every smile reflected a story, every reunion rekindled a connection, and every conversation reminded us that once a Sunbeam, always a Sunbeam.',
      'Here’s to the memories that shaped us and the legacy that continues to inspire generations.',
    ],
    cover: mGroup,
    coverAlt: `Alumni and staff of ${S} gathered on the school steps for Pradiptam 2.0, beneath a Sunbeam School Ballia backdrop.`,
    gallery: [
      {
        image: mGroup,
        alt: `Alumni and staff of ${S} gathered on the school steps for Pradiptam 2.0, beneath a Sunbeam School Ballia backdrop.`,
        caption: 'The gathering on the school steps',
      },
      {
        image: mLamp,
        alt: `Alumni and staff of ${S} standing around the ceremonial lamp at the opening of Pradiptam 2.0.`,
        caption: 'Lighting the lamp',
      },
      {
        image: mMedals,
        alt: 'Three alumni seated at a table, holding their commemorative medallions and wearing the meet’s Pradiptam badges.',
        caption: 'Commemorative medallions',
      },
      {
        image: mTable,
        alt: 'Four alumnae at a table holding their medallions, a Pradiptam 2.0 table card in front of them.',
        caption: 'At the tables',
      },
      {
        image: mHall,
        alt: `Four alumnae of ${S} standing together in the hall during the meet, wearing the event’s badges.`,
        caption: 'In the hall',
      },
      {
        image: mEntrance,
        alt: `The entrance to ${S} before Pradiptam 2.0 — a red carpet laid between house pennants, under the Alumni Meet 2026 board.`,
        caption: 'Before the meet',
      },
      {
        image: mSpeaker,
        alt: 'An alumna of the 2017 batch speaking at Pradiptam 2.0, her name and degree on the screen behind her.',
        caption: 'An alumna speaks',
      },
      {
        image: mMedallion,
        alt: 'One alumnus handing a commemorative medallion to another at Pradiptam 2.0, both wearing the meet’s badges.',
        caption: 'A medallion presented',
      },
      {
        image: mSteps,
        alt: `Alumni and staff of ${S} on the school steps at the close of Pradiptam 2.0, the stage behind them.`,
        caption: 'At the close',
      },
      {
        image: mLampClose,
        alt: `Staff and alumni of ${S} gathered around the garlanded brass lamp on the red carpet as it is lit to open Pradiptam 2.0.`,
        caption: 'Lighting the lamp',
      },
      {
        image: mRoundTable,
        alt: `Six alumni of ${S} seated at a round table in their Pradiptam badges, students of the school in rows behind them.`,
        caption: 'At a round table',
      },
      {
        image: mFourAlumnae,
        alt: `Four alumnae of ${S} at a table, each wearing an Alumni Meet 2026 badge, a Pradiptam 2.0 card standing between them.`,
        caption: 'Between the speeches',
      },
      {
        image: mMedalPg,
        alt: `An alumnus of ${S} taking his commemorative medallion from a member of staff, his photograph and postgraduate subject on the screen behind.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedalMed,
        alt: `An alumnus of ${S} receiving his medallion, the screen behind naming his batch and the medical degree he is reading for.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedalPol,
        alt: `An alumna of ${S} receiving her medallion, her honours degree in political science and her college named on the screen behind.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedalTeacher,
        alt: `An alumna of ${S} taking her medallion from a teacher, both holding it between them, her photograph on the screen behind.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedalMicro,
        alt: `An alumna of the 2017 batch receiving her medallion at Pradiptam 2.0, her master’s subject on the screen behind her.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedal2024,
        alt: `An alumna of the 2024 batch receiving her medallion, the screen behind carrying her photograph and the examination she cleared.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedal2223,
        alt: `An alumna of the 2022–23 batch receiving her medallion at Pradiptam 2.0, a photograph of her dancing on the screen behind.`,
        caption: 'A medallion presented',
      },
      {
        image: mMedalSci,
        alt: `An alumna of ${S} receiving her medallion, her science degree named on the screen behind her.`,
        caption: 'A medallion presented',
      },
      {
        image: mStanding,
        alt: `Alumni of ${S} standing at their tables, their medallions and an Alumni Meet 2026–27 card in front of them.`,
        caption: 'Standing at the tables',
      },
    ],
    featured: true,
    published: true,
    source: 'Published by the school in the activity feed on sunbeamballia.edu.in/school-activities/. Its wording and photographs are reproduced from there.',
  },
];

/**
 * ⚠⚠ THE THREE VERIFIED ALUMNI ARE NOT HERE — THEY ARE IN data/alumni.ts, and
 * the page reads them from there. Those are the school's own "OUR ALUMNI"
 * graphics: a name, a degree, an institution and an employer, each read off the
 * card the school itself issued. They are placement records, not stories.
 *
 * ⚠ THIS ARRAY IS FOR THE THING THAT DOES NOT EXIST YET: an alumnus speaking in
 * their own words. That needs an interview and written consent, not a data
 * entry. It stays empty until both exist.
 */
export const alumniStories: AlumniStory[] = [];

/** Published meets, newest first, ready for the UI. */
export const publishedMeets = alumniMeets.filter((m) => m.published);

/** The meet that headlines the page — the flagged one, else the newest. */
export const featuredMeet = publishedMeets.find((m) => m.featured) ?? publishedMeets[0];

/** Published stories only. */
export const publishedStories = alumniStories.filter((s) => s.published);

/**
 * Every photograph across every published meet, for the page's gallery strip.
 * ⚠ DERIVED, NOT A SECOND LIST. A gallery maintained separately from the meets
 * drifts the first time one is edited.
 */
export const alumniGallery: MeetPhoto[] = publishedMeets.flatMap((m) => m.gallery);
