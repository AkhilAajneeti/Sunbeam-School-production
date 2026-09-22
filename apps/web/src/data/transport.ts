/**
 * TRANSPORT — every route the school publishes.
 *
 * ═══ SOURCE ════════════════════════════════════════════════════════════════
 *
 * Read off https://sunbeamballia.edu.in/bus-routes/ — the table was parsed out
 * of the page's own HTML rather than retyped, so no stop name is a transcription
 * guess. Fleet size and the two safety features come from
 * /facilities-infrastructure/ ("Buses : 29+", "GPS & Speed Governor enabled Bus
 * facilities").
 *
 * ⚠ NOTHING HERE IS INVENTED. The live page publishes routes, drivers, driver
 * mobiles and one transport in-charge. It publishes NO timings, NO fares, NO
 * bus registration numbers and NO FAQs, so this file has none. Where the page
 * is silent, the site says so and points at the in-charge.
 *
 * ═══ THREE DEFECTS IN THE SOURCE, HANDLED NOT HIDDEN ═══════════════════════
 *
 * 1 · THE Sl. No. COLUMN IS WRONG. It runs 01–19, then prints "20" twice, then
 *     21–27 — so the page appears to list 27 runs when it lists 28. The numbers
 *     are dropped here and the count is derived from the rows themselves.
 *
 * 2 · BUSES 18, 19 AND 20 DO NOT APPEAR. The list jumps 17 → 21. That is the
 *     school's data and it is left alone: inventing three routes to make the
 *     sequence tidy would be inventing three routes.
 *
 * 3 · SEVERAL STOPS ARE SPELT TWO WAYS — "Tagore Nagar"/"Taigor Nagar",
 *     "Reoti"/"Rewati", "Takarshan"/"Takarsan", "Maweshi Hospital"/"Maweshi
 *     Hoapital", "Shanti Hospital"/"Shanti Hospita". `label` keeps the published
 *     spelling exactly; `alias` carries the other, so a parent searching
 *     "Tagore" finds the bus that spells it "Taigor". Display is verbatim,
 *     matching is generous — the parent should not have to reproduce a typo.
 */

export interface RouteRun {
  /** As published — "BUS NO. 24 (1st)". */
  bus: string;
  /** Bus number alone, for grouping runs of the same vehicle. */
  vehicle: number;
  /** Which run of the day, where the school splits one bus into two. */
  leg?: string;
  driver: string;
  phone: string;
  /** Stops in published order. Empty for the staff bus. */
  stops: string[];
  /** Staff-only vehicles carry no children and must not read as an option. */
  staffOnly?: boolean;
}

/** Alternate spellings the school itself uses, so search matches either. */
export const stopAliases: Record<string, string> = {
  'Taigor Nagar': 'Tagore Nagar',
  'Police Line Tagore Nagar': 'Police Line Taigor Nagar',
  'Rewati Bus Stand': 'Reoti Bus Stand',
  Takarsan: 'Takarshan',
  'Maweshi Hoapital': 'Maweshi Hospital',
  'Shanti Hospita': 'Shanti Hospital',
  'Hospita Road': 'Hospital Road',
  'Balwshwar Mandir': 'Baleshwar Mandir',
  'Middhi Chawraha': 'Middhi Chauraha',
  'Kadam Chawraha': 'Kadam Chauraha',
  'New Chawk': 'New Chowk',
  'Bhirgu Asram': 'Bhirguasram',
  Mandigate: 'Mandi Gate',
  'S P Office': 'S. P. Office',
  'J P Nagar': 'J. P. Nagar',
};

export const routes: RouteRun[] = [
  { bus: 'Bus No. 1', vehicle: 1, driver: 'Dilip Prashad', phone: '7318096901', stops: ['Reoti Bus Stand'] },
  {
    bus: 'Bus No. 2', vehicle: 2, leg: '1st run', driver: 'Surendra Rajbhar', phone: '7318096902',
    stops: ['Zeera Basti', 'Bahadurpur', 'Bahadurpur Awasiya Colony'],
  },
  {
    bus: 'Bus No. 2', vehicle: 2, leg: '2nd run', driver: 'Surendra Rajbhar', phone: '7318096902',
    stops: ['Zeera Basti', 'Bahadurpur', 'Bahadurpur Awasiya Colony', 'Rampur ITI', 'Anand Hotel'],
  },
  {
    bus: 'Bus No. 3', vehicle: 3, leg: '1st run', driver: 'Uma Shankar Verma', phone: '7318096903',
    stops: ['Deokali', 'Bahadurpur', 'Gayatri Mandir', 'Anand Hotel'],
  },
  {
    bus: 'Bus No. 3', vehicle: 3, leg: '2nd run', driver: 'Uma Shankar Verma', phone: '7318096903',
    stops: ['Professor Colony', 'Vikash Bhawan', 'Police Line Tagore Nagar', 'S. P. Office', 'Ashoka Hotel', 'Middhi Chauraha'],
  },
  {
    bus: 'Bus No. 4', vehicle: 4, driver: 'Krishna Kr. Pandey', phone: '7318096904',
    stops: ['Jalalpur', 'New Baheri', 'Chandrashekhar Nagar', 'Baheri', 'J. P. Nagar', 'Mulayam Nagar'],
  },
  {
    bus: 'Bus No. 5', vehicle: 5, driver: 'Om Prakash Rai', phone: '7318096905',
    stops: ['Haldi', 'Parasia', 'Nirupur', 'Dubhard', 'Basarikapur', 'Akhar', 'Sawaroon Bandh', 'Saharspali', 'Kasipur'],
  },
  {
    bus: 'Bus No. 6', vehicle: 6, driver: 'Vijay Kumar Yadav', phone: '7318096906',
    stops: ['Bansdih Road', 'Gharawali', 'Aamghat', 'Tagharawali', 'Shankarpur', 'Takarshan', 'Tikhampur'],
  },
  {
    bus: 'Bus No. 7', vehicle: 7, leg: '1st run', driver: 'Paras Nath Yadav', phone: '7318096907',
    stops: ['Parking Hotel', 'Mandigate', 'Polytechnic'],
  },
  {
    bus: 'Bus No. 7', vehicle: 7, leg: '2nd run', driver: 'Paras Nath Yadav', phone: '7318096907',
    stops: ['Shankarpur', 'Takarsan', 'Parking Hotel', 'Mandi Gate', 'Shanti Hospita', 'Tikhampur'],
  },
  {
    bus: 'Bus No. 8', vehicle: 8, driver: 'Pushpendra Pathak', phone: '7318096908',
    stops: ['Jeevan Jyoti', 'Bhirguasram', 'S. C. College', 'Malgodam Road'],
  },
  {
    bus: 'Bus No. 9', vehicle: 9, driver: 'Satendra Kumar', phone: '7318096909',
    stops: ['L I C Road', 'New Chawk', 'Baleshwar Mandir Japlingganj', 'Sapa Karyalaya'],
  },
  {
    bus: 'Bus No. 10', vehicle: 10, driver: 'Manejar Tiwari', phone: '7318096910',
    stops: ['Kadam Chawraha', 'Jeevan Jyoti', 'Purvanchal Takige'],
  },
  {
    bus: 'Bus No. 11', vehicle: 11, driver: 'Shailendra Dubey', phone: '7318096911',
    stops: ['Karnai', 'Dharahara', 'Hanumanganj', 'Kendra Vidhyala', 'Rampur ITI'],
  },
  {
    bus: 'Bus No. 12', vehicle: 12, driver: 'Shivam Singh', phone: '7318096912',
    stops: ['Garwar', 'Parasia', 'Alawalpur', 'Bhikhampur', 'Banarahi', 'Katariya'],
  },
  {
    bus: 'Bus No. 13', vehicle: 13, driver: 'Mazhar', phone: '7318096913',
    stops: ['Town Hall', 'Maweshi Hospital', 'Banakata', 'Adhiwakta Nagar'],
  },
  {
    bus: 'Bus No. 14', vehicle: 14, driver: 'Shantosh Pathak', phone: '7318096914',
    stops: ['Akhar', 'Saharspali', 'Kadam Chawraha', 'Bhirgu Asram', 'New Chawk', 'Balwshwar Mandir', 'Malgodam'],
  },
  {
    bus: 'Bus No. 15', vehicle: 15, driver: 'Hareram Yadav', phone: '7318096915',
    stops: ['Bus Stand', 'Nirala Nagar', 'Mehboob Manzil', 'J. P. Nagar', 'Mulayam Nagar', 'Paharupur', 'Nirdhariya'],
  },
  { bus: 'Bus No. 16', vehicle: 16, driver: 'Rama Shankar', phone: '7318096916', stops: ['Shanti Hospital', 'Taigor Nagar'] },
  { bus: 'Bus No. 17', vehicle: 17, driver: 'Rakesh Chauhan', phone: '7318096917', stops: [], staffOnly: true },
  {
    bus: 'Bus No. 21', vehicle: 21, leg: '1st run', driver: 'Sonu Kharwar', phone: '7318096921',
    stops: ['Rampur Mahawal', 'Adhiwakta Nagar'],
  },
  {
    bus: 'Bus No. 21', vehicle: 21, leg: '2nd run', driver: 'Sonu Kharwar', phone: '7318096921',
    stops: ['Rewati Bus Stand', 'Awas Vikash'],
  },
  {
    bus: 'Bus No. 22', vehicle: 22, driver: 'Lalan Kushwaha', phone: '7318096922',
    stops: ['NCC Tiraha', 'S P Office', 'Ashoka Hotel'],
  },
  {
    bus: 'Bus No. 23', vehicle: 23, driver: 'Namo Narayan', phone: '7318096923',
    stops: ['Town Hall', 'Maweshi Hoapital', 'Banakata', 'Hospita Road'],
  },
  {
    bus: 'Bus No. 24', vehicle: 24, leg: '1st run', driver: 'Surendra Yadav', phone: '7318096924',
    stops: ['Professor Colony', 'Police Line', 'Taigor Nagar', 'S P Office', 'Middhi Chawraha'],
  },
  {
    bus: 'Bus No. 24', vehicle: 24, leg: '2nd run', driver: 'Surendra Yadav', phone: '7318096924',
    stops: ['Bus Stand', 'Nirala Nagar', 'Mehboob Manzil', 'J P Nagar', 'Mulayam Nagar', 'Paharupur', 'Nirdhariya'],
  },
  {
    bus: 'Bus No. 25', vehicle: 25, leg: '1st run', driver: 'Ajeet Yadav', phone: '7318096925',
    stops: ['Kapoori', 'Vaina', 'Sagarpali', 'Khoripakar', 'Maldepur'],
  },
  {
    bus: 'Bus No. 25', vehicle: 25, leg: '2nd run', driver: 'Ajeet Yadav', phone: '7318096925',
    stops: ['Pakadi', 'Vaina', 'Sagarpali', 'Maldepur', 'New Baheri', 'Chandrashekhar Nagar'],
  },
];

/* ═══ DERIVED — never typed, so it cannot drift from the table above ══════ */

/** Every distinct boarding point, A–Z, with the runs that serve it. */
export const coverage = (() => {
  const map = new Map<string, number[]>();
  routes.forEach((r, i) => {
    if (r.staffOnly) return;
    r.stops.forEach((s) => {
      const at = map.get(s) ?? [];
      at.push(i);
      map.set(s, at);
    });
  });
  return [...map.entries()]
    .map(([stop, runs]) => ({ stop, runs }))
    .sort((a, b) => a.stop.localeCompare(b.stop, 'en'));
})();

/**
 * ⚠ EVERY FIGURE COUNTS WHAT THE SCHOOL PUBLISHES, WITH NOTHING FILTERED OUT.
 * An earlier pass reported 27 runs by excluding the staff bus, reasoning that a
 * parent cannot use it. That was editing the school's data to suit a story about
 * it. The client's instruction is that this site mirrors
 * https://sunbeamballia.edu.in/bus-routes/ and designs it — so the count is
 * every row on that page, 28, and the staff vehicle is one of them, labelled as
 * what the school labels it.
 */
export const stats = {
  /** Distinct bus numbers on the published list — 1–17 and 21–25. */
  buses: new Set(routes.map((r) => r.vehicle)).size,
  /** Every row the school publishes. */
  runs: routes.length,
  /** Distinct boarding points named across those rows. */
  stops: coverage.length,
};

/** The one contact the school publishes for transport. */
export const transportContact = {
  role: 'Transport In-charge',
  name: 'Mr. Sheo Sarjan Singh',
  phone: '7755005909',
  display: '+91 77550 05909',
};

/**
 * Safety. Every line here is stated on the school's own pages — GPS and speed
 * governors on /facilities-infrastructure/ ("GPS & Speed Governor enabled Bus
 * facilities", "Buses : 29+"), and the named driver per route on the bus-routes
 * table itself.
 *
 * ⚠ TWO ROWS WERE REMOVED HERE: a lady attendant and parent notifications. They
 * carried `verified: false` and sat in a separate "told to us, not yet
 * published" group. Honest labelling, but still this site putting claims on the
 * page that the school has not made — and the brief is to mirror the parent page
 * and design it. If the school confirms them in writing they come back.
 */
export const safety = [
  { label: 'GPS on every bus', body: 'The fleet is GPS-enabled, so a bus can be located while it is running.', icon: 'gps', verified: true },
  { label: 'Speed governors', body: 'Governors are fitted across the fleet, capping how fast a bus can travel.', icon: 'speed', verified: true },
  { label: 'A named driver per route', body: 'Every route below publishes its driver and a direct mobile number for them.', icon: 'badge', verified: true },
  { label: 'A fleet of 29+', body: 'Twenty-two buses run the published routes; the school states a fleet of 29 and more.', icon: 'bus', verified: true },
];

/**
 * ═══ THE BAND HEADS ON /campus/transport/ ══════════════════════════════════
 *
 * Every eyebrow, heading and paragraph on that page, in page order. These used
 * to be string literals inside TransportBands.astro and RouteFinder.astro.
 *
 * ⚠⚠ `{buses}`, `{runs}` AND `{stops}` ARE TOKENS, NOT TYPOS. The query layer
 * replaces them with counts computed from the Bus Route collection, so adding a
 * route updates the sentence. Typing the numbers instead freezes three facts the
 * routes already know — which is the exact bug transportCountsSentence() was
 * written to undo.
 *
 * ⚠ THE QUERY LAYER HOLDS A COPY as TRANSPORT_DEFAULTS in
 * lib/cms/queries/campus.ts — the fallback for an unseeded CMS. This file is
 * what the seed writes. Change one, change both, or seed again.
 *
 * ⚠ `figures` ARE CAPTIONS ONLY. The number above each is computed; only the
 * caption and its note are stored.
 */
export const transportBands = {
  overview: {
    eyebrow: 'Transport',
    heading: 'A bus from most of Ballia',
    stand:
      'The school runs {buses} buses over {runs} route runs, calling at {stops} published ' +
      'boarding points. Every route names its driver and prints a direct mobile number for ' +
      'them — so the person driving your child is someone you can reach.',
  },
  cta: 'Find your route',
  finder: {
    eyebrow: 'Route finder',
    heading: 'Find the bus that stops near you',
    stand: 'Type a locality, or pick one below. {stops} boarding points across {runs} runs.',
  },
  safetyHead: {
    eyebrow: 'Safety',
    heading: 'What is fitted, and what we can confirm',
    stand: 'Every line below is stated on the school’s own pages.',
  },
  contactHead: {
    eyebrow: 'Contact',
    heading: 'Anything the routes don’t answer',
    stand:
      'Allocation, stop changes, timings, charges and complaints all go to the transport ' +
      'in-charge — not to the driver.',
  },
  /* The route finder's own prose. Its data labels — First stop, Driver, /stop —
     stay in the component: they label the route data rather than say anything. */
  finderCopy: {
    searchLabel: 'Search by area or boarding point',
    areasHeading: 'Areas we cover',
    staffNote: 'As published in the school’s route list.',
    driverNote: 'The number below still reaches this vehicle’s driver.',
    emptyHeading: 'No published stop matches',
    emptyBody:
      'Routes are set each session and the published list may not name every pick-up point. ' +
      'Speak to the transport in-charge before assuming your area is not covered.',
    emptyCta: 'Contact the transport in-charge',
  },
  figures: [
    { label: 'Buses on published routes', body: 'From a stated fleet of 29 and more' },
    { label: 'Route runs', body: 'Several buses make two trips' },
    { label: 'Boarding points', body: 'Across Ballia and the surrounding blocks' },
  ],
} as const;
