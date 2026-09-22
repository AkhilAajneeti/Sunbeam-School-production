/**
 * PUBLICATIONS — everything /publications/ renders.
 *
 * ═══ PROVENANCE ═══════════════════════════════════════════════════════════
 *
 * Transcribed from https://sunbeamballia.edu.in/publications/ on 12 September
 * 2026, from that page's own HTML rather than from a screenshot. Not one title,
 * date or URL in this file was composed. If something looks absent, fetch that
 * page again — do not fill the gap from memory.
 *
 * ⚠⚠ THE COUNT IS THE CHECK: 33 downloads (5 club + 14 magazine + 14
 * newspaper) and 5 MYRA plates. A build that renders any other number has
 * dropped or duplicated something.
 *
 * ⚠⚠ 33 CARDS RESOLVE TO 29 UNIQUE URLS, AND THAT IS CORRECT. The school's own
 * page points several months at one file:
 *
 *     Sandesh Times April 2024  ─┬─ …1qsT79nG1-giy5dI97VT3592Zzde35cAT…
 *     Sandesh Times June 2024   ─┘
 *     Sandesh Times May 2024    ─┬─ …1KLanjCYPpxKUoV4eTqHVpd9vjRDTMnQH…
 *     Sandesh Times August 2024 ─┤
 *     Sandesh Times October 2024─┘
 *     E-Newspaper March 2024    ─┬─ …1KG2OCbTWID0nHYC3_0x9e9dLdxhZ6Etf…
 *     E-Newspaper June 2024     ─┘
 *
 * Do NOT "repair" these. Deciding which file each month should really have had
 * would be inventing publications. Report it to the school instead.
 *
 * ⚠ THE `http://` ON THE SCHOOL'S OWN PDFS IS DELIBERATE. That is the scheme
 * the live page uses, and the verification step diffs this file's URLs against
 * it literally. Silently upgrading to https makes every one of those rows look
 * like a mismatch. The host redirects to https anyway.
 *
 * ⚠ THREE EMPTY GRID CELLS PER CLUB ROW ARE NOT REPRODUCED. The reference
 * screenshot shows four cards per club; the source HTML carries exactly five
 * anchors across all five club sections, so the other fifteen are empty
 * WordPress cells with no href. Reproducing them would ship three dead buttons
 * per club. The grid stays four columns wide — it is simply not padded.
 */

export interface Publication {
  title: string;
  href: string;
}

export interface PublicationGroup {
  /** Doubles as the section's DOM id and its aria-labelledby target. */
  id: string;
  heading: string;
  items: Publication[];
}

/**
 * Five club newsletters, one edition each — each its own headed section.
 *
 * ⚠ THE FINANCIAL LITERACY FILE IS NAMED LIKE AN AFFILIATION CERTIFICATE, and
 * its embedded PDF /Title agrees: "CBSE Affiliation No.: 2131962 | School Code:
 * 70205". It is genuinely what that card links to on the live page. Kept
 * verbatim and flagged to the school; substituting something tidier would be
 * inventing a link.
 */
export const clubs: PublicationGroup[] = [
  {
    id: 'entrepreneurial-chronicles',
    heading: 'Entrepreneurial Chronicles',
    items: [
      {
        title: 'First Edition, June 2026',
        href: 'http://sunbeamballia.edu.in/wp-content/uploads/Entrepreneurial-Chronicles-First-edition_20260624_144641_0000.pdf',
      },
    ],
  },
  {
    id: 'quiz-club',
    heading: 'Quiz Club',
    items: [
      {
        title: 'First Edition, June 2026',
        href: 'http://sunbeamballia.edu.in/wp-content/uploads/quiz-club-newsletter-_20260629_082730_0000.pdf',
      },
    ],
  },
  {
    id: 'moon-club',
    heading: 'Moon Club',
    items: [
      {
        title: 'First Edition, June 2026',
        href: 'http://sunbeamballia.edu.in/wp-content/uploads/MUN-_20260629_122717_0000.pdf',
      },
    ],
  },
  {
    id: 'heritage-club',
    heading: 'Heritage Club',
    items: [
      {
        title: 'First Edition, June 2026',
        href: 'http://sunbeamballia.edu.in/wp-content/uploads/Heritage-club-newsletter-_20260702_092303_0000_compressed.pdf',
      },
    ],
  },
  {
    id: 'financial-literacy-club',
    heading: 'Financial Literacy Club',
    items: [
      {
        title: 'First Edition, June 2026',
        href: 'http://sunbeamballia.edu.in/wp-content/uploads/CBSE-Affiliation-No.-2131962-School-Code-70205_20260701_221742_0000.pdf',
      },
    ],
  },
];

/** Our School Magazine — Dishayein, Balashray and the Sandesh Times run. */
export const magazine: PublicationGroup = {
  id: 'school-magazine',
  heading: 'Our School Magazine',
  items: [
    {
      title: 'Dishayein 2017 Edition',
      href: 'https://drive.google.com/file/d/1xIijrdQ1xuaszJbXK38HKEq2u8qxPpPV/view?usp=sharing',
    },
    {
      title: 'Dishayein 2019 Edition',
      href: 'https://drive.google.com/file/d/1yJHuD865FG_RhpWPdOcg8SN7gh78esnR/view?usp=sharing',
    },
    {
      title: 'Dishayein 2022 Edition',
      href: 'https://drive.google.com/file/d/1V2n97-j202eAwI4qo-0G8Dz56jla9VQS/view?usp=sharing',
    },
    {
      title: 'Balashray 2022 Edition',
      href: 'https://drive.google.com/file/d/19Mz9VsmO6X3b-XaShuO59bnmsH_sFFGy/view?usp=sharing',
    },
    {
      title: 'Sandesh Times — March 2024',
      href: 'https://drive.google.com/file/d/1qztHaIFSWWeEQQifqwbi_nomtdoi0NeA/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — April 2024',
      href: 'https://drive.google.com/file/d/1qsT79nG1-giy5dI97VT3592Zzde35cAT/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — May 2024',
      href: 'https://drive.google.com/file/d/1KLanjCYPpxKUoV4eTqHVpd9vjRDTMnQH/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — June 2024',
      href: 'https://drive.google.com/file/d/1qsT79nG1-giy5dI97VT3592Zzde35cAT/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — August 2024',
      href: 'https://drive.google.com/file/d/1KLanjCYPpxKUoV4eTqHVpd9vjRDTMnQH/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — October 2024',
      href: 'https://drive.google.com/file/d/1KLanjCYPpxKUoV4eTqHVpd9vjRDTMnQH/view?usp=drivesdk',
    },
    {
      title: 'Sandesh Times — January 2026',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/E-SandeshJanuary_20260218_092255_0000.pdf',
    },
    {
      title: 'Sandesh Times — April 2026',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/E-SandeshApril-1.pdf',
    },
    {
      title: 'Sandesh Times — July 2026',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/E-SANDESH_20260708_192640_0000.pdf',
    },
    {
      title: 'E-Sandesh Times — July 2026',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/E-SANDESH-JULY_20260803_204549_0000.pdf',
    },
  ],
};

/** E-Newspaper — the monthly run, oldest first, in the school's own order. */
export const newspaper: PublicationGroup = {
  id: 'e-newspaper',
  heading: 'E-Newspaper',
  items: [
    {
      title: 'September 2021',
      href: 'https://drive.google.com/file/d/1Ft5xuo2HPTHIf00Nv7wdez_HwFnZtIU9/view?usp=sharing',
    },
    {
      title: 'October 2021',
      href: 'https://drive.google.com/file/d/1DAZu_uTiNSKbKP16F49yO2RD9KmDdcQE/view?usp=sharing',
    },
    {
      title: 'December 2021',
      href: 'https://drive.google.com/file/d/1VKq-3sWLOm5AcZd0zLQpopW947lKOMg9/view?usp=sharing',
    },
    {
      title: 'January 2022',
      href: 'https://drive.google.com/file/d/1aNjt4LQFb3HnnBy2wWjVzVe6nO3f_SXz/view?usp=sharing',
    },
    {
      title: 'February 2022',
      href: 'https://drive.google.com/file/d/1nWtR5rpjsAwMgGqPKRAHfzn57G3_t6e6/view?usp=sharing',
    },
    {
      title: 'March 2022',
      href: 'https://drive.google.com/file/d/1GG72Q1eBYBqCcl3uYc2FJpKKkTG_ojw3/view?usp=sharing',
    },
    {
      title: 'May 2022',
      href: 'https://drive.google.com/file/d/1_3PTVi1RLQn8n1IgWJ14KbVqPGXEz3Mk/view?usp=sharing',
    },
    {
      title: 'October 2022',
      href: 'https://drive.google.com/file/d/1638LbyDKs8PbIYj8i7oaw1ABPBowWLeY/view?usp=sharing',
    },
    {
      title: 'March 2024',
      href: 'https://drive.google.com/file/d/1KG2OCbTWID0nHYC3_0x9e9dLdxhZ6Etf/view?usp=drivesdk',
    },
    {
      title: 'June 2024',
      href: 'https://drive.google.com/file/d/1KG2OCbTWID0nHYC3_0x9e9dLdxhZ6Etf/view?usp=drivesdk',
    },
    {
      title: 'July 2024',
      href: 'https://drive.google.com/file/d/1KNG1rdi3Wselhk-ZIJus0KAKwSHS7Mgi/view?usp=drivesdk',
    },
    {
      title: 'September 2024',
      href: 'https://drive.google.com/file/d/1kK5TcjmfU1yUVCY_dhd3-A57iwryDuWA/view?usp=drivesdk',
    },
    {
      title: 'October 2025',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/E-newspaper-OCTOBER-final.pdf',
    },
    {
      title: 'July 2026 — Science E-Newspaper',
      href: 'http://sunbeamballia.edu.in/wp-content/uploads/Science-E-newspaper-_20260803_190053_0000.pdf',
    },
  ],
};

/**
 * Alt text for the five MYRA STEM Lab plates, in order.
 *
 * ⚠ THESE DESCRIBE WHAT EACH PAGE ACTUALLY SHOWS. The live page ships all five
 * with empty alt, which is why they are written here rather than generated from
 * an index — "page 3 of 5" tells a screen-reader user nothing about the pitch
 * competition on it. The positional caption is a separate string, set on the
 * lightbox trigger.
 */
export const myraAlt: string[] = [
  'Page one of the MYRA STEM Lab newsletter, June 2026 — the Centre of Excellence cover.',
  'A page of the MYRA STEM Lab newsletter showing student activities and a timetable.',
  'A page of the MYRA STEM Lab newsletter covering a pitch competition.',
  'A page of the MYRA STEM Lab newsletter with project write-ups and a world map.',
  'The closing page of the MYRA STEM Lab newsletter, carrying the school crest.',
];
