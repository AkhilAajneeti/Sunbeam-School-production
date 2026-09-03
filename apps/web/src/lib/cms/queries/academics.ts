/**
 * ACADEMICS QUERIES (G8).
 *
 * ═══ THE SHAPES ARE THE SOURCE'S OWN ═══════════════════════════════════════
 *
 * A point comes back as `{ n, mark, k, v, href, photo, alt, cap, owed }` —
 * exactly what the academics markup already destructures — and a detail as
 * `{ mark, k, v, href, note }`. That is deliberate and it is the whole reason a
 * migration across forty bespoke pages could be done at all: a page changes the
 * line that DECLARES a const and not one line that uses it, so its layout, its
 * GSAP timeline, its scoped CSS and its responsive rules are untouched.
 *
 *     -  const steps = [ … forty lines … ];
 *     +  const steps = ac.section('steps').points;
 *
 * ⚠ ONE FETCH PER PAGE, SHARED. A route's components each ask for their own
 * section; they all read the same in-flight promise, so a page with nine bands
 * costs one round trip rather than nine.
 *
 * ⚠ A MISSING KEY IS LOUD IN DEVELOPMENT AND EMPTY IN PRODUCTION. An empty
 * section renders as nothing, changes no structure and throws no error — the
 * exact failure this group is most exposed to — so `section()` warns at build
 * time when a key is absent. `npm run verify:academics` is the real guard.
 */
import { cmsFetchAll } from '../client';
import { ACADEMIC_TOPIC_POPULATE } from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile, PhotoComponent } from '../types';

/* ── raw component shapes ────────────────────────────────────────────────── */

interface RawPoint {
  id: number; number: string | null; icon: string | null; title: string;
  body: string | null; href: string | null;
  image: StrapiFile | null; alt: string | null; caption: string | null; owed: boolean;
  slot: string | null; note: string | null; suffix: string | null;
  anchor: string | null; quote: string | null; flag: boolean;
  tags: RawFact[] | null; children: RawDetail[] | null;
}
interface RawDetail {
  id: number; icon: string | null; label: string; value: string;
  href: string | null; note: string | null; slot: string | null;
  links: RawLink[] | null;
}
interface RawFact { id: number; value: string }
interface RawParagraph { id: number; text: string }
interface RawFigure { id: number; figure: string; label: string; note: string | null }
interface RawStat { id: number; count: number; suffix: string; label: string; icon: string | null; note: string | null }
interface RawLink { id: number; label: string; href: string; description: string | null; external: boolean }
interface RawStream {
  id: number; number: string | null; key: string | null; name: string;
  fullName: string | null; body: string | null; icon: string | null;
  core: RawFact[] | null; optional: RawFact[] | null; additional: RawFact[] | null;
  coreUnverified: boolean; unverified: boolean;
}
interface RawAward {
  id: number; title: string; category: string | null; classes: string | null;
  year: string | null; description: string | null; link: string | null;
  image: StrapiFile | null; alt: string | null;
}
interface RawStory {
  id: number; student: string; title: string | null; category: string | null;
  year: string | null; location: string | null; description: string | null;
  link: string | null; image: StrapiFile | null; poster: StrapiFile | null; alt: string | null;
}
interface RawFaq {
  id: number; question: string; answers: RawParagraph[] | null;
  note: string | null; cta: RawLink | null;
}
interface RawResult {
  id: number; name: string; exam: string | null; score: string | null;
  description: string | null; image: StrapiFile | null; alt: string | null;
}

interface RawSection {
  id: number; key: string;
  eyebrow: string | null; heading: string | null; standfirst: string | null; note: string | null;
  body: RawParagraph[] | null; points: RawPoint[] | null; details: RawDetail[] | null;
  facts: RawFact[] | null; figures: RawFigure[] | null; stats: RawStat[] | null;
  photos: PhotoComponent[] | null; links: RawLink[] | null;
  streams: RawStream[] | null; awards: RawAward[] | null;
  stories: RawStory[] | null; results: RawResult[] | null;
  faqs: RawFaq[] | null;
}

interface RawTopic {
  route: string; slug: string; group: string; displayOrder: number;
  label: string; hint: string | null; title: string | null;
  standfirst: string | null; photoKey: string | null;
  owed: boolean; existing: boolean;
  body: RawParagraph[] | null; points: RawPoint[] | null;
  sections: RawSection[] | null;
  photos: RawTopicPhoto[] | null;
}

/** One keyed photograph belonging to the page itself rather than to a block. */
interface RawTopicPhoto {
  key: string | null;
  image: StrapiFile | null;
  alt: string | null;
}

/* ── the shapes the pages already use ────────────────────────────────────── */

/** `{ n, mark, k, v }` — plus the picture and the owed flag where there is one. */
/**
 * WARNING: THE ALIASES ARE THE POINT OF THIS TYPE.
 *
 * Forty bespoke pages each named the same idea differently - a card's body is
 * `v` on one page, `m` on another, `why` on a third - and every one of those
 * names is written into markup this migration must not touch. So one stored
 * field is returned under every name the source used for it. That is why a page
 * swap is one line and its layout, its GSAP timeline and its CSS are untouched.
 */
export interface Point {
  n: string | null; mark: string | null; k: string; v: string | null;
  href: string | null; photo: StrapiFile | null; alt: string | null;
  cap: string | null; owed: boolean;
  /** The layout slot this card belongs to, where a page binds one. */
  slot: string | null;
  note: string | null; suffix: string | null;
  anchor: string | null; quote: string | null; flag: boolean;
  tags: string[];
  /* the same values, under the names the pages already use */
  t: string; label: string; name: string; stage: string; title: string;
  step: string; year: string | null; phase: string | null; s: string | null; who: string | null;
  i: string | null; glyph: string | null; icon: string | null;
  m: string | null; why: string | null; detail: string | null; blurb: string | null;
  what: string | null; value: string | null; body: string | null;
  line: string | null; dir: string | null; milestone: string | null;
  gloss: string | null; sub: string | null; format: string | null; fact: string | null;
  mono: string | null; state: string | null; classes: string | null; qualifier: string | null;
  key: string | null; kind: string | null; hired: boolean; inquiry: boolean;
  src: StrapiFile | null; art: StrapiFile | null; image: StrapiFile | null;
  caption: string | null; chips: string[];
  /* a card's own list of lines, under every name the source used */
  focus: string[]; notes: string[];
  items: unknown[]; points: unknown[]; lines: unknown[];
  children: Array<Detail & { name: string; glyph: string | null }>;
}
export interface Detail {
  mark: string | null; k: string; v: string; href: string | null; note: string | null;
  slot: string | null;
  links: Array<{ label: string; k: string; href: string; mb: string | null; external: boolean }>;
  /* the same values, under the names the pages already use */
  i: string | null; n: string | null; label: string; q: string; when: string; m: string;
  title: string; d: string; blurb: string; lede: string; teaser: string | null;
  a: string[]; value: string; why: string; detail: string; range: string | null;
  key: string | null; cta: string | null;
  /**
   * WARNING: classes IS TWO SHAPES BECAUSE THE SOURCE MADE IT TWO SHAPES.
   * On a curriculum stage it is the list of syllabus documents; on an
   * orientation timeline it is a plain string naming the classes invited. Both
   * pages read `classes` and both must keep working, so the alias follows
   * whichever the row actually holds.
   */
  classes: string | null | Array<{ k: string; label: string; href: string; mb: string | null; external: boolean }>;
}
export interface Shot { src: StrapiFile | null; alt: string; cap: string | null; caption: string | null; image: StrapiFile | null }
export interface Stream {
  n: string | null; key: string | null; name: string; full: string | null; body: string | null;
  mark: string | null; glyph: string | null;
  /* the source's own names for the two 'not published' flags */
  coreOwed: boolean; owed: boolean;
  core: string[]; optional: string[]; additional: string[];
  coreUnverified: boolean; unverified: boolean;
}

const points = (a: RawPoint[] | null | undefined): Point[] =>
  (a ?? []).map((p) => {
    const tags = (p.tags ?? []).map((t) => t.value);
    /* A nested list of rows, under the source's own field names. */
    const kids = details(p.children ?? []).map((d) => ({
      ...d, name: d.k, glyph: d.mark, label: d.k,
    }));
    return {
      n: p.number, mark: p.icon, k: p.title, v: p.body, href: p.href,
      photo: p.image ?? null, alt: p.alt, cap: p.caption, owed: p.owed, slot: p.slot,
      note: p.note, suffix: p.suffix, anchor: p.anchor, quote: p.quote,
      flag: p.flag, tags,
      /* aliases - see the note on Point */
      t: p.title, label: p.title, name: p.title, stage: p.title, title: p.title,
      step: p.title, year: p.number, phase: p.number, s: p.number, who: p.number,
      i: p.icon, glyph: p.icon, icon: p.icon,
      m: p.body, detail: p.body, blurb: p.body, line: p.body,
      what: p.body, value: p.body, body: p.body, why: p.note, dir: p.anchor, milestone: p.anchor,
      gloss: p.note, sub: p.note, format: p.note, fact: p.note,
      mono: p.note, state: p.note, classes: p.note, qualifier: p.note,
      key: p.slot, kind: p.slot, hired: p.flag, inquiry: p.flag,
      src: p.image ?? null, art: p.image ?? null, image: p.image ?? null,
      caption: p.caption, chips: tags, focus: tags, notes: tags,
      /* a nested list: rows where the card has them, strings otherwise */
      items: kids.length ? kids : tags,
      points: kids.length ? kids : tags,
      lines: kids.length ? kids : tags,
      children: kids,
    };
  });

const details = (a: RawDetail[] | null | undefined): Detail[] =>
  (a ?? []).map((d) => ({
    mark: d.icon, k: d.label, v: d.value, href: d.href, note: d.note,
    slot: d.slot,
    links: (d.links ?? []).map((l) => ({ label: l.label, k: l.label, href: l.href, mb: l.description, external: l.external })),
    i: d.icon, n: d.icon, label: d.label, q: d.label, when: d.label, m: d.label, title: d.label,
    d: d.value, blurb: d.value, lede: d.value,
    a: d.value ? d.value.split(String.fromCharCode(10, 10)) : [], value: d.value, why: d.value, detail: d.value,
    range: d.note, teaser: d.note, key: d.slot, cta: d.href,
    classes: (d.links ?? []).length
      ? (d.links ?? []).map((l) => ({ k: l.label, label: l.label, href: l.href, mb: l.description, external: l.external }))
      : d.note,
  }));

const values = (a: RawFact[] | null | undefined) => (a ?? []).map((f) => f.value);
const texts = (a: RawParagraph[] | null | undefined) => (a ?? []).map((p) => p.text);

const shots = (a: PhotoComponent[] | null | undefined): Shot[] =>
  (a ?? []).map((p) => ({
    src: p.image ?? null, image: p.image ?? null,
    alt: p.alt, cap: p.caption, caption: p.caption,
  }));

const streams = (a: RawStream[] | null | undefined): Stream[] =>
  (a ?? []).map((s) => ({
    n: s.number, key: s.key, name: s.name, full: s.fullName, body: s.body, mark: s.icon, glyph: s.icon,
    coreOwed: s.coreUnverified, owed: s.unverified,
    core: values(s.core), optional: values(s.optional), additional: values(s.additional),
    coreUnverified: s.coreUnverified, unverified: s.unverified,
  }));

/** What a page gets back for one key. Every part is present, most are empty. */
export interface Section {
  key: string;
  eyebrow: string; heading: string; stand: string; note: string;
  body: string[];
  points: Point[];
  details: Detail[];
  facts: string[];
  figures: Array<{ figure: string; label: string; note: string | null }>;
  stats: Array<{ n: number; suffix: string; label: string }>;
  photos: Shot[];
  /**
   * ⚠ THE SAME PHOTOGRAPHS, KEYED BY THEIR CAPTION.
   *
   * A source `photoMap` — `stepPhoto`, `look` — is looked up by name in the
   * markup: `stepPhoto[frame.photo]`. Flattened to an array that lookup returns
   * undefined and the page renders nothing, or throws reading a field off it.
   * The key the map had is kept as the caption when seeding, and rebuilt here.
   */
  byKey: Record<string, Shot>;
  links: Array<{ label: string; href: string; note: string | null; external: boolean }>;
  streams: Stream[];
  awards: Array<Omit<RawAward, 'id' | 'image'> & { image: StrapiFile | null }>;
  stories: Array<Omit<RawStory, 'id' | 'image' | 'poster'> & { image: StrapiFile | null; poster: StrapiFile | null }>;
  results: Array<Omit<RawResult, 'id' | 'image'> & { image: StrapiFile | null }>;
  /** `{ q, a, note, cta }` — the page's own field names, paragraphs intact. */
  faqs: Array<{ q: string; a: string[]; note: string | null; cta: { label: string; href: string; external: boolean } | null }>;
}

const EMPTY: Omit<Section, 'key'> = {
  eyebrow: '', heading: '', stand: '', note: '',
  body: [], points: [], details: [], facts: [], figures: [], stats: [],
  photos: [], byKey: {}, links: [], streams: [], awards: [], stories: [], results: [], faqs: [],
};

function toSection(s: RawSection): Section {
  return {
    key: s.key,
    eyebrow: s.eyebrow ?? '',
    heading: s.heading ?? '',
    stand: s.standfirst ?? '',
    note: s.note ?? '',
    body: texts(s.body),
    points: points(s.points),
    details: details(s.details),
    facts: values(s.facts),
    figures: (s.figures ?? []).map(({ figure, label, note }) => ({ figure, label, note })),
    stats: (s.stats ?? []).map((x) => ({ n: x.count, suffix: x.suffix, label: x.label })),
    photos: shots(s.photos),
    byKey: Object.fromEntries(shots(s.photos).filter((x) => x.cap).map((x) => [x.cap as string, x])),
    links: (s.links ?? []).map((l) => ({ label: l.label, href: l.href, note: l.description, external: l.external })),
    streams: streams(s.streams),
    awards: (s.awards ?? []).map(({ id, ...rest }) => ({ ...rest, image: rest.image ?? null })),
    stories: (s.stories ?? []).map(({ id, ...rest }) => ({ ...rest, image: rest.image ?? null, poster: rest.poster ?? null })),
    results: (s.results ?? []).map(({ id, ...rest }) => ({ ...rest, image: rest.image ?? null })),
    faqs: (s.faqs ?? []).map((f) => ({
      q: f.question,
      a: texts(f.answers),
      note: f.note,
      cta: f.cta ? { label: f.cta.label, href: f.cta.href, external: f.cta.external } : null,
    })),
  };
}

export interface AcademicTopic {
  route: string; slug: string; group: string; order: number;
  label: string; hint: string; title: string; standfirst: string; photo: string;
  owed: boolean; existing: boolean;
  body: string[]; points: Point[];
  /** Every section this page holds, in seeded order. */
  all: Section[];
  /** One section by key; an absent key returns an empty section, never undefined. */
  section: (key: string) => Section;
  /**
   * WARNING: THIS IS WHAT LETS THE BIGGEST DATA OBJECTS BE SWAPPED IN ONE LINE.
   *
   * `parents` and `teachingLearning` are objects of named editorial blocks, each
   * with its own heading, prose and several lists, and ten components read them
   * as `parents.forum.steps`. They are seeded as sections keyed
   * `parents.forum` and `parents.forum.steps`; this rebuilds the original
   * nesting from those keys, so
   *
   *     -  import { parents } from '../../../data/academics';
   *     +  const parents = ac.blockMap('parents');
   *
   * is the whole change and every path below it still resolves.
   */
  blockMap: (prefix: string) => Record<string, Record<string, unknown>>;
  /**
   * WARNING: THE PAGE'S OWN PHOTOGRAPHS, BY SLOT.
   *
   * These are the pictures that live in the bespoke markup rather than inside a
   * content block, and until now they were local imports - the one part of the
   * academics content G8 could not see, because a bare import has no source key
   * to compare against.
   *
   *     -  import pBench from '../../../assets/photos/sb-chem-lab.jpg';
   *     +  const pBench = ac.pic('pBench');
   *
   * Returns null for an unknown slot rather than throwing: SmartImage renders
   * nothing for a null file, so a mistyped key leaves a gap on the page instead
   * of failing the build - which is why picAlt is checked by the alt snapshot
   * and not trusted to the build.
   */
  pic: (key: string) => StrapiFile | null;
  /** The stored description for a slot, with site tokens already filled. */
  picAlt: (key: string) => string;
}

/**
 * ⚠ MEMOISED FOR THE BUILD. 46 routes each ask for the whole list once; without
 * this a page with nine bands would fetch 46 records nine times.
 */
let allPromise: Promise<AcademicTopic[]> | null = null;

function warnMissing(route: string, key: string) {
  /* eslint-disable-next-line no-console */
  console.warn(`[academics] ${route} has no section "${key}" — the page will render it empty.`);
}

export function getAcademicTopics(): Promise<AcademicTopic[]> {
  allPromise ??= Promise.all([
    cmsFetchAll<RawTopic>('/api/academic-topics', {
      populate: ACADEMIC_TOPIC_POPULATE,
      sort: ['displayOrder:asc'],
    }),
    /* WARNING: THE ALT TEXT IS STORED WITH ITS TOKEN, NOT THE SCHOOL'S NAME.
       Thirty-nine of these descriptions read "A student of {schoolName} ...".
       Spelling the name into each one would put forty copies of it in the CMS
       beside the one in Site Settings. */
    getSchool(),
  ]).then(([raw, school]) => {
    const tokens = siteTokens(school);
    return raw.map((t) => {
    const all = (t.sections ?? []).map(toSection);
    const byKey = new Map(all.map((s) => [s.key, s]));
    const photoByKey = new Map(
      (t.photos ?? [])
        .filter((p) => p.key)
        .map((p) => [p.key as string, { image: p.image ?? null, alt: fillTokens(p.alt, tokens) }]),
    );
    return {
      route: t.route, slug: t.slug, group: t.group, order: t.displayOrder,
      label: t.label, hint: t.hint ?? '', title: t.title ?? '',
      standfirst: t.standfirst ?? '', photo: t.photoKey ?? '',
      owed: t.owed, existing: t.existing,
      body: texts(t.body), points: points(t.points),
      all,
      section: (key: string) => {
        const s = byKey.get(key);
        if (!s) { warnMissing(t.route, key); return { key, ...EMPTY }; }
        return s;
      },
      pic: (key: string) => photoByKey.get(key)?.image ?? null,
      picAlt: (key: string) => photoByKey.get(key)?.alt ?? '',
      blockMap: (prefix: string) => {
        const out: Record<string, Record<string, unknown>> = {};
        const head = `${prefix}.`;
        for (const sec of all) {
          if (!sec.key.startsWith(head)) continue;
          const rest = sec.key.slice(head.length);
          const [sub, child] = rest.split('.');
          out[sub] ??= {};
          if (child) {
            /**
             * A child section is either one of the block's LISTS, or a nested
             * OBJECT of its own - `method.aside`, `words.figure`. An object has
             * no list part and its scalars carry slots; rebuild it as it was.
             */
            const lists = sec.faqs.length ? sec.faqs
              : sec.stats.length ? sec.stats
                : sec.photos.length ? sec.photos
                  : sec.facts.length ? sec.facts
                    : sec.points.length ? sec.points
                      : null;
            if (lists) out[sub][child] = lists;
            else if (sec.details.some((d) => d.slot)) {
              const obj: Record<string, unknown> = {};
              for (const d of sec.details) if (d.slot) obj[d.slot] = d.href ? { label: d.k, href: d.href } : d.v;
              if (sec.heading) obj.heading = sec.heading;
              if (sec.stand) obj.stand = sec.stand;
              out[sub][child] = obj;
            } else out[sub][child] = sec.details;
          } else {
            /* The block's own scalars, under every name the source used. */
            Object.assign(out[sub], {
              eyebrow: sec.eyebrow, heading: sec.heading, headingLead: sec.heading,
              title: sec.heading, stand: sec.stand, lede: sec.stand,
              standfirst: sec.stand, note: sec.note, headingMark: sec.note,
              quote: sec.note, paragraphs: sec.body, body: sec.body,
            });
            /* and any other scalar it carried, keyed as the source named it */
            /* a scalar row, or a link row rebuilt as the object it was */
            for (const d of sec.details) {
              if (!d.slot) continue;
              out[sub][d.slot] = d.href
                ? { label: d.k, href: d.href, external: /^https?:/.test(d.href) }
                : d.v;
            }
          }
        }
        return out;
      },
    };
    });
  });
  return allPromise;
}

/** One page's record. Never throws: a missing route returns an empty topic. */
export async function getAcademicTopic(route: string): Promise<AcademicTopic> {
  const all = await getAcademicTopics();
  const found = all.find((t) => t.route === route);
  if (found) return found;
  /* eslint-disable-next-line no-console */
  console.warn(`[academics] no record for ${route} — the page will render empty.`);
  return {
    route, slug: '', group: '', order: 0, label: '', hint: '', title: '',
    standfirst: '', photo: '', owed: false, existing: false,
    body: [], points: [], all: [],
    section: (key: string) => ({ key, ...EMPTY }),
    blockMap: () => ({}),
    pic: () => null,
    picAlt: () => '',
  };
}

/** The topics of one group, in order — what the hub pages and the nav list. */
export async function getAcademicGroup(group: string): Promise<AcademicTopic[]> {
  const all = await getAcademicTopics();
  return all.filter((t) => t.group === group);
}
