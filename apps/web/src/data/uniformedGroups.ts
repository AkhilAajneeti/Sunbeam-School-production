/**
 * ═══ NCC · SCOUTS & GUIDES — THE SOURCE OF EVERY FACT ON THE PAGE ══════════
 *
 * This file is the seed source for the "NCC, Scouts & Guides" single type. Read
 * it before changing a word: each fact below records WHERE IT CAME FROM, and
 * that provenance is the only reason any of it is publishable.
 *
 * ⚠⚠ `verified: false` IS NOT A TODO. It means the school is describing itself
 * and the page must keep attributing the claim rather than stating it flat. Two
 * claims here are about OTHER schools in the district — "first in the district"
 * and "first of its kind" — and neither is independently evidenced. Flipping
 * either to true turns the school's own words into the site's assertion.
 *
 * ═══ WHY THE TWO GROUPS ARE SOURCED SO DIFFERENTLY ═════════════════════════
 *
 * NCC comes from the school's OWN WEBSITE — /about-us/ and /event-chronicles/.
 * Nothing here is new; it is transcribed from pages the school already
 * publishes.
 *
 * SCOUTS & GUIDES was a total blank until the school supplied a press note and
 * six photographs. ⚠ THE PRIMARY SOURCE IS A BANNER INSIDE TWO OF THOSE
 * PHOTOGRAPHS, cropped and enlarged 4× before anything was typed from it. It
 * reads:
 *
 *     भारत स्काउट और गाइड, उत्तर प्रदेश · जनपद- बलिया
 *     केन्द्रीय माध्यमिक शिक्षा बोर्ड से मान्यता प्राप्त विद्यालयों की बैठक
 *     मुख्य अतिथि- मा० नौशाद अली सिद्दीकी
 *       (सहायक प्रादेशिक संगठन आयुक्त, मण्डल- आजमगढ़)
 *     दिनांक- 14 अक्टूबर 2022 · स्थान- सनबीम स्कूल, अगरसण्डा- बलिया
 *
 * So the date, the organisation, the venue and the chief guest are PHOTOGRAPHED,
 * not reported, and can be stated flat. Everything else about that group cannot.
 *
 * ⚠ THE PRESS NOTE'S ADJECTIVES ARE GONE AND MUST STAY GONE. It ran to
 * "monumental milestone", "prestigious", "rigorous", "impeccable discipline"
 * and "profound gratitude". What a school says about its own camp in a press
 * release is not a fact about the camp. The verbs and the nouns survived; the
 * marketing did not.
 *
 * ⚠ THE CAMP HAS NO DATE AND NONE IS INVENTED. The note says "6-Day" and says
 * it concluded. It gives no start date, no month and no year.
 *
 * ⚠ NO SCOUT LEADER IS NAMED. Leaders appear in five of the six photographs and
 * not one is identified in any source. The only person named in this section is
 * the chief guest, and only because his name is on the banner.
 *
 * ═══ TWO THINGS THE NCC SECTION DELIBERATELY DOES NOT SAY ══════════════════
 *
 * ⚠ THAT "ANO Lt. Pankaj Singh" IS THE VICE PRINCIPAL. The school names him as
 * an officer and its Vice Principal is Pankaj Singh — very probably the same
 * person, but no published source says so and this site does not assert it.
 *
 * ⚠ WHICH RANK IS CORRECT. The two school sources disagree — "Third Officer"
 * in one, "Lieutenant" in the other. Both are reported as they stand rather
 * than quietly reconciled.
 *
 * ⚠ NO CADET STRENGTH. All 67 pages of the school's site were searched and no
 * count appears anywhere. Tracked as A13.
 */

/** A fact card. `verified: false` keeps the attribution on the page. */
export interface GroupFact {
  label: string;
  body: string;
  verified: boolean;
}

/** One entry on the group's record. */
export interface GroupRecordItem {
  title: string;
  body: string;
}

export interface UniformedGroup {
  /** The page anchor — #ncc, #scouts-guides. Linkable from outside. */
  slug: string;
  name: string;
  blurb: string;
  facts: GroupFact[];
  record: GroupRecordItem[];
  /** docs/07 id for whatever this group is still owed. */
  pending: string | null;
}

export const ncc: UniformedGroup = {
  slug: 'ncc',
  name: 'National Cadet Corps',
  blurb:
    'The school holds affiliation for both the NCC ‘A’ and ‘B’ certificates and trains cadets with two battalions of the Uttar Pradesh directorate.',
  facts: [
    {
      label: 'First in the district, by the school’s account',
      /* ⚠ ATTRIBUTED, NOT STATED. This is a claim about every other school in
         Ballia and no independent source confirms it. `verified: false` is what
         keeps "the school describes itself as" on the page. */
      body:
        'The school describes itself as the first in the district to hold affiliation for both the NCC ‘A’ and ‘B’ certificates.',
      verified: false,
    },
    {
      label: 'NCC ‘A’ certificate',
      body: 'Cadets are enrolled with 90 UP Battalion.',
      verified: true,
    },
    {
      label: 'NCC ‘B’ certificate',
      body: 'Cadets are enrolled with 93 UP Battalion.',
      verified: true,
    },
    {
      label: 'Two Associate NCC Officers',
      body:
        'Both trained on the PRCN 180 course at the NCC Officer Training Academy, Kamptee, Nagpur.',
      verified: true,
    },
    {
      label: 'Officers',
      /* ⚠ AS THE SCHOOL PRINTS THEM. See the header on rank and on identity. */
      body: 'Lt. Pankaj Singh and Lt. Rajendra Singh, as the school names them.',
      verified: true,
    },
  ],
  record: [
    {
      title: 'CATC-283 hosted at the school',
      body: 'The Combined Annual Training Camp ran here from 20 to 29 May 2025.',
    },
    {
      title: '‘A’ certificate enrolment',
      body: 'Cadets enrolled with 90 UP Battalion under its commanding officer.',
    },
    {
      title: '‘B’ certificate enrolment',
      body: 'Cadets enrolled with 93 UP Battalion under its commanding officer.',
    },
    {
      title: 'Rakshabandhan with 93 UP BN',
      body: 'Cadets marked Rakshabandhan with the battalion.',
    },
  ],
  pending: 'A13 — cadet strength, and photographs of the contingent',
};

export const scoutsGuides: UniformedGroup = {
  slug: 'scouts-guides',
  name: 'Scouts & Guides',
  blurb:
    'The troop trains with the Ballia district association of the Bharat Scouts & Guides, and the school has hosted the district’s CBSE schools for a meeting of the programme.',
  facts: [
    {
      label: 'Bharat Scouts & Guides · Janpad Ballia',
      body:
        'The troop trains with the Ballia district association of the Bharat Scouts & Guides, Uttar Pradesh.',
      verified: true,
    },
    {
      label: 'Host of the district CBSE meeting',
      /* Date, venue and organisation are all on the banner in the frame. */
      body:
        'Held at the school’s Agarsanda campus on 14 October 2022, with Naushad Ali Siddiqui, Assistant State Organising Commissioner for the Azamgarh division, as chief guest.',
      verified: true,
    },
    {
      label: 'A first, in the school’s own words',
      /* ⚠ ATTRIBUTED. A claim about other schools in the district. */
      body:
        'The school describes that meeting as the first of its kind held to bring CBSE schools into the Scouts & Guides programme.',
      verified: false,
    },
    {
      label: 'Six-day outdoor camp',
      body:
        'Run by instructors under the supervision of school staff.',
      verified: true,
    },
  ],
  record: [
    {
      title: 'District meeting of CBSE schools',
      body:
        'Bharat Scouts & Guides, Janpad Ballia, met at the school on 14 October 2022. Naushad Ali Siddiqui, Assistant State Organising Commissioner for the Azamgarh division, was chief guest.',
    },
    {
      title: 'Six-day camp',
      /* ⚠ NO DATE. The press note gives none — see the header. */
      body:
        'First aid, outdoor survival technique and pitching tents, taught through group drills and joint problem-solving.',
    },
  ],
  pending: 'A13 — the camp’s dates, and the Scout leaders’ names',
};

export const uniformedGroups: UniformedGroup[] = [ncc, scoutsGuides];

/**
 * The six photographs the school supplied, in the order the page shows them.
 *
 * ⚠⚠ CAPTIONS DESCRIBE THE FRAME, NOT THE EVENT. Four of these show training in
 * the school yard and are very probably the camp — "very probably" is not a
 * caption. Only the two conclave frames name an event, and only because the
 * banner naming it is inside the frame.
 */
export const scoutsPhotos = [
  {
    file: 'scouts-and-guides.jpeg',
    alt: 'Scouts of Sunbeam School Ballia practising first aid on the ground, bandaging under supervision.',
    caption: 'First-aid practice',
  },
  {
    file: 'scouts-and-guides-2.jpeg',
    alt: 'A Scout of Sunbeam School Ballia demonstrating with a stave to the troop drawn up around him.',
    caption: 'Stave demonstration',
  },
  {
    file: 'scouts-and-guides-3.jpeg',
    alt: 'The Scout troop of Sunbeam School Ballia assembled in uniform in the school yard.',
    caption: 'The troop, assembled',
  },
  {
    file: 'scouts-and-guides-4.jpeg',
    alt: 'Guides of Sunbeam School Ballia seated in a circle receiving instruction.',
    caption: 'Instruction circle',
  },
  {
    file: 'scouts-and-guides-5.jpeg',
    alt: 'The district meeting of CBSE schools at Sunbeam School Ballia, officers seated beneath the Bharat Scouts & Guides banner.',
    caption: 'The district meeting · 14 October 2022',
  },
  {
    file: 'scouts-and-guides-6.jpeg',
    alt: 'Officers and guests standing at the district meeting of CBSE schools at Sunbeam School Ballia, the Bharat Scouts & Guides banner behind them.',
    caption: 'The district meeting · 14 October 2022',
  },
];
