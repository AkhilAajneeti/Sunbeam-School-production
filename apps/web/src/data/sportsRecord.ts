/**
 * SPORTS & GAMES → THE RECORD.
 *
 * ═══ THIS IS THE LIVE PAGE'S CONTENT, RESTORED ══════════════════════════════
 *
 * The school's own Sports & Games page carries fourteen achievement blocks and
 * over 165 photographs. The rebuilt site had SIX one-line records and no sports
 * photography at all — the entire Asmita league, both national training camps,
 * the district handball sweep, UDAAN, the Annual Sports Day and the four
 * championship flyers were simply missing. The client sent the original back and
 * asked for its structure: a heading, the account, and that achievement's own
 * photographs.
 *
 * ⚠ THE PROSE IS THE SCHOOL'S, LIGHTLY TIDIED — never extended. Every medal
 * count, position, date, venue and championship name below is theirs. Where they
 * published a podium (the Asmita league, district handball) it is kept as a
 * structured list rather than flattened into a sentence, because that is how a
 * result is read.
 *
 * ⚠ THE PHOTOGRAPHS ARE THEIRS TOO, pulled from sunbeamballia.edu.in into
 * src/assets/sports-record/. Their page links 150×150 thumbnails; these are the
 * full-size originals, fetched by stripping the `-150x150` suffix. Sixty of the
 * 165 are here — enough for every block to carry a real gallery without shipping
 * a 165-image page.
 *
 * ⚠ TWO THINGS I DID NOT RECONCILE, DELIBERATELY. The Kho-Kho flyer reads "2023
 * CBSE National Kho-Kho Championship — Silver"; the school's own heading above it
 * reads "2ND runner-up in CBSE CLUSTER Kho-Kho Championship". Those are different
 * claims about different competitions. The heading is used verbatim and no extra
 * detail is asserted — resolving it is the school's call, not mine. The same
 * applies to the SGFI handball flyer, which says third position under a heading
 * that does not.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/sports-record/*.jpg',
  { eager: true },
);

export const shot: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

export interface Podium {
  event: string;
  places: string[];
}

export interface RecordBlock {
  id: string;
  /** Small line above the heading — the level, or the year. */
  kicker: string;
  /** The school's own heading, verbatim where it published one. */
  title: string;
  body: string;
  /** A second paragraph, only where the school wrote one. */
  more?: string;
  /** Published placings, kept as a list rather than flattened to prose. */
  podiums?: Podium[];
  shots: string[];
  alt: string;
}

export const record: RecordBlock[] = [
  {
    id: 'asmita',
    kicker: 'Hosted at Sunbeam · National league',
    title: 'Asmita Khelo India Women’s League',
    body: 'Sunbeam School Ballia organised the Asmita Khelo India Women’s League, with competitions in handball, volleyball and kabaddi. The event was inaugurated by Mr. Amit Pandey, Secretary of the UP Handball Association.',
    more: 'A tournament for young women athletes, run on the school’s own ground.',
    podiums: [
      {
        event: 'Handball',
        places: ['1st — Sunbeam School Ballia', '2nd — Sunbeam Club Ballia', '3rd — Sports Stadium Ballia (Girls)'],
      },
      {
        event: 'Kabaddi',
        places: ['1st — Sports Stadium Ballia (Girls)', '2nd — Sunbeam School Agarsanda', '3rd — Primary School Baghouli Dubhar'],
      },
      {
        event: 'Volleyball',
        places: ['1st — Sports Stadium Ballia', '2nd — Primary School Narhi No. 1', '3rd — Star Sports Narhi'],
      },
    ],
    shots: ['asmita-1.jpg', 'asmita-2.jpg', 'asmita-3.jpg', 'asmita-4.jpg', 'asmita-5.jpg', 'asmita-6.jpg', 'asmita-7.jpg', 'asmita-8.jpg'],
    alt: 'The Asmita Khelo India Women’s League being played at Sunbeam School Ballia',
  },
  {
    id: 'karate',
    kicker: 'Classes I & II · District',
    title: '11th BSKA Open District Karate Championship',
    body: 'The school’s youngest karate students — Classes I and II — took fourteen medals at the 11th BSKA Open District Karate Championship: twelve bronze and two silver.',
    shots: ['karate-1.jpg', 'karate-2.jpg', 'karate-3.jpg', 'karate-4.jpg'],
    alt: 'Sunbeam School Ballia karate students with their medals at the 11th BSKA Open District Championship',
  },
  {
    id: 'handball-district',
    kicker: 'Veer Lorik Stadium · District',
    title: 'District Handball Championship',
    body: 'At the District Handball Championship at Veer Lorik Stadium, Ballia, three Sunbeam teams reached the podium and two of them won it.',
    more: 'Congratulations to the players, and to the mentor and coach whose guidance took the teams there.',
    podiums: [
      { event: 'Results', places: ['Junior Boys — 1st', 'Senior Boys — 2nd', 'Girls — 1st'] },
    ],
    shots: ['handball-1.jpg', 'handball-2.jpg', 'handball-3.jpg', 'handball-4.jpg', 'handball-5.jpg', 'handball-6.jpg', 'handball-7.jpg'],
    alt: 'Sunbeam School Ballia handball teams at the District Handball Championship, Veer Lorik Stadium',
  },
  {
    id: 'camp-girls',
    kicker: '2025-26 · National camp',
    title: 'Sub-Junior National Camp (Girls)',
    body: 'The Sub-Junior National Camp for girls ran at Sunbeam School Ballia through to 22 February 2026. The squad selected from it went on to represent Uttar Pradesh at Hooghly, West Bengal, from 24 February to 1 March.',
    shots: ['camp-1.jpg', 'camp-2.jpg', 'camp-3.jpg', 'camp-4.jpg', 'camp-5.jpg', 'camp-6.jpg'],
    alt: 'The Sub-Junior National Camp for girls in progress at Sunbeam School Ballia',
  },
  {
    id: 'camp-volleyball',
    kicker: 'National camp',
    title: 'Sub-Junior National Volleyball Training Camp',
    body: 'The school felicitated the boys and girls taking part in the Sub-Junior National Volleyball Training Camp, ahead of representing Uttar Pradesh at the Sub-Junior National Volleyball Championship.',
    shots: ['volley-1.jpg', 'volley-2.jpg', 'volley-3.jpg', 'volley-4.jpg', 'volley-5.jpg', 'volley-6.jpg'],
    alt: 'Players at the Sub-Junior National Volleyball Training Camp held at Sunbeam School Ballia',
  },
  {
    id: 'district-junior-volleyball',
    kicker: 'District · hosted',
    title: 'District Junior Volleyball Championship',
    /* ⚠ NO PLACING IS CLAIMED. The photographs show the opening — teams lined up
       at the net behind their own school flags, NCC cadets with the colours — and
       the school did not publish a result. A record that says who won when the
       evidence only shows a march-past is the kind of claim this site does not
       make. */
    body: 'The District Junior Volleyball Championship, its teams lined up at the net for the opening with their school flags and NCC cadets carrying the colours. The school published photographs of the day; it did not publish the results or the final placings.',
    shots: ['distvolley-1.jpg', 'distvolley-2.jpg', 'distvolley-3.jpg', 'distvolley-4.jpg', 'distvolley-5.jpg', 'distvolley-6.jpg', 'distvolley-7.jpg', 'distvolley-8.jpg', 'distvolley-9.jpg', 'distvolley-10.jpg', 'distvolley-11.jpg', 'distvolley-12.jpg', 'distvolley-13.jpg', 'distvolley-14.jpg', 'distvolley-15.jpg', 'distvolley-16.jpg', 'distvolley-17.jpg', 'distvolley-18.jpg', 'distvolley-19.jpg', 'distvolley-20.jpg'],
    alt: 'Teams at the opening of the District Junior Volleyball Championship',
  },
  {
    id: 'junior-district',
    kicker: 'Veer Lorik Sports Stadium · District',
    title: 'Junior District Championship — 2nd overall',
    body: 'At the Junior District Championship at Veer Lorik Sports Stadium, the school’s junior athletes finished second overall among the district’s strongest competitors.',
    shots: ['juniordist-1.jpg', 'juniordist-2.jpg', 'juniordist-3.jpg', 'juniordist-4.jpg', 'juniordist-5.jpg'],
    alt: 'Sunbeam School Ballia athletes competing at the Junior District Championship',
  },
  {
    id: 'taekwondo',
    kicker: '2025 · Classes I–IX',
    title: 'Ballia District Taekwondo Poomse Championship',
    body: 'Twenty-one students from Classes I to IX entered the 2025 Ballia District Taekwondo Poomse Championship and came back with ten gold, nine silver and two bronze. It was the first time Classes I and II had competed.',
    shots: ['taekwondo-1.jpg', 'taekwondo-2.jpg'],
    alt: 'Sunbeam School Ballia students at the Ballia District Taekwondo Poomse Championship 2025',
  },
  {
    id: 'udaan',
    kicker: '2025',
    title: 'UDAAN — the rise of our achievers',
    body: 'The school’s annual celebration of the year’s achievers: every student who set out to do something and did it.',
    shots: ['udaan25-1.jpg', 'udaan25-2.jpg', 'udaan25-3.jpg', 'udaan25-4.jpg', 'udaan25-5.jpg', 'udaan25-6.jpg'],
    alt: 'Students being felicitated at UDAAN, the annual celebration of achievers at Sunbeam School Ballia',
  },
  {
    id: 'sports-day',
    kicker: 'Annual Sports Day',
    title: 'UDAN',
    body: 'The whole school on the ground for one day: track events, march past, the prize table, and the parents in the stands.',
    shots: [
      'sportsday-1.jpg', 'sportsday-2.jpg', 'sportsday-3.jpg', 'sportsday-4.jpg', 'sportsday-5.jpg',
      'sportsday-6.jpg', 'sportsday-7.jpg', 'sportsday-8.jpg', 'sportsday-9.jpg', 'sportsday-10.jpg',
    ],
    alt: 'The annual sports day UDAN at Sunbeam School Ballia',
  },
  {
    id: 'since-2013',
    kicker: 'Since 2013',
    title: 'Kho-Kho, chess and athletics',
    body: 'The school opened in 2013. It hosted the CBSE Cluster V Kho-Kho Championship in 2016; the boys’ and girls’ Kho-Kho teams took second runner-up at the Club State Championship and won in 2018-19 and 2019-20.',
    more: 'In chess, the U-11 side took second runner-up at the CBSE East Zonal Championship and qualified for the CBSE Nationals in 2016-17. The school then hosted the CBSE East Zonal Chess Championship in 2018, where its U-11 boys placed first among two hundred schools and qualified for the national tournament. In athletics, the girls’ team has taken medals at CBSE Cluster level and qualified for the Nationals.',
    shots: ['overview-1.jpg'],
    alt: 'A Sunbeam School Ballia team on the school ground',
  },
  {
    id: 'khokho-cluster',
    kicker: 'CBSE Cluster',
    title: '2nd runner-up in CBSE Cluster Kho-Kho Championship',
    body: 'The school’s Kho-Kho record continues at cluster level.',
    shots: ['khokho-cluster-1.jpg'],
    alt: 'The school’s Kho-Kho championship award graphic',
  },
  {
    id: 'hockey-zonal',
    kicker: 'CBSE East Zonal',
    title: 'CBSE East Zonal Hockey Championship trophy',
    body: 'The school took the trophy at the CBSE East Zonal Hockey Championship.',
    shots: ['hockey-1.jpg'],
    alt: 'The school’s award graphic for the CBSE East Zonal Hockey Championship trophy',
  },
  {
    id: 'sgfi-handball',
    kicker: 'SGFI · State',
    title: 'SGFI Handball State Championship — Boys',
    body: 'The boys’ handball side at the School Games Federation of India state championship.',
    shots: ['sgfi-handball-1.jpg'],
    alt: 'The school’s award graphic for the SGFI Handball State Championship',
  },
  {
    id: 'chess-zonal',
    kicker: 'CBSE East Zonal',
    title: 'CBSE East Zonal Chess Championship',
    body: 'Hosted at Sunbeam Ballia in 2018, where the school’s own U-11 boys placed first in a field of two hundred schools.',
    shots: ['chess-1.jpg', 'chess-2.jpg'],
    alt: 'The CBSE East Zonal Chess Championship at Sunbeam School Ballia',
  },
];
