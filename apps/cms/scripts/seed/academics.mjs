/**
 * SEED — ACADEMICS (G8).
 *
 *     npm run seed:academics [-- --dry] [-- --force-media]
 *
 * ═══ ONE RECORD PER PAGE, CONTENT KEYED BY THE CONST IT REPLACES ═══════════
 *
 * 46 routes, ~40 bespoke page components, 260 content consts. Each route becomes
 * one Academic Topic; each content const on that route's components becomes one
 * `shared.section`, **keyed by the const's own name**.
 *
 *     const steps = [ … ]        in AssessmentPage.astro
 *       →  section key 'steps'   on /academics/assessment/
 *       →  read back as `ac.section('steps').points`
 *
 * ⚠⚠ THE QUERY RETURNS THE SOURCE'S OWN FIELD NAMES. A point comes back as
 * `{n, mark, k, v, href}` — exactly what the markup already destructures — so
 * swapping a page is one line and NOTHING below it changes. That is what lets
 * forty bespoke layouts, their GSAP timelines and their scoped CSS survive a
 * migration of this size intact.
 *
 * ⚠ THE ROUTING IS BY RULE, NOT BY HAND. `scripts/lib/academics-map.mjs`
 * classifies every const and `npm run plan:academics` prints the decisions to
 * `fixtures/academics-plan.md`. Hand-mapping 260 consts would have been 260
 * chances to mistype one; a rule that reports itself can be checked.
 *
 * ⚠ FIXTURE-BACKED, LIKE G6. The migration rewrites those consts, so the seed
 * cannot read the working tree twice. `npm run extract:academics` captures them
 * first; this reads what it wrote.
 *
 * ⚠ WHAT NEVER REACHES STRAPI: route constants, tile positions, orbit radii,
 * animation timings, tone and accent palettes, glyph geometry, and the school
 * name (Site Settings owns that). All reported as DESIGN / SITE in the plan.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug } from '../lib/upsert.mjs';
import { slugify } from '../lib/slug.mjs';
import { academicsFilesFor, classify, isImage } from '../lib/academics-map.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/academics.json');
const SWAP_OUT = resolve(HERE, '../fixtures/academics-swap.json');
const PHOTO_PLAN = resolve(HERE, '../fixtures/academics-photo-plan.json');
const UID = 'api::academic-topic.academic-topic';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

/* ── which group a route belongs to ──────────────────────────────────────── */
const GROUPS = [
  ['/academics/philosophy', 'philosophy'],
  ['/academics/structure', 'structure'],
  ['/academics/teaching-learning', 'teaching-learning'],
  ['/academics/assessment', 'assessment'],
  ['/academics/academic-calendar', 'assessment'],
  ['/academics/board-results', 'student-success'],
  ['/academics/student-success', 'student-success'],
  ['/academics/parent-partnership', 'parent-partnership'],
];
const groupOf = (route) =>
  GROUPS.find(([p]) => route.startsWith(p))?.[1] ?? 'overview';

/** A readable label from the last meaningful path segment. */
const labelOf = (route) => {
  const parts = route.split('/').filter(Boolean);
  const last = parts.at(-1) ?? 'academics';
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ── inline markup in extracted prose ────────────────────────────────────── */

/**
 * ⚠ `<strong>` IN THE SOURCE BECOMES `**` FOR ui/RichLine.astro.
 * The FAQ answers were written as HTML strings because the emphasis is part of
 * the sentence. Storing the tags would put raw markup in the CMS; dropping them
 * would flatten the emphasis. The marker convention carries it across.
 */
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * WARNING: ENTITIES ARE DECODED, LIKE THE PAGE-META FIXTURE BEFORE THEM.
 * The source strings were written for set:html, so an ampersand is "&amp;".
 * Stored as typed and rendered as text it prints "&amp;" on the page. The CMS
 * should hold the CHARACTER; escaping is the renderer's job, exactly once.
 */
const ENTITY_RE = new RegExp(String.fromCharCode(38) + String.fromCharCode(40) + String.fromCharCode(35,63,92,119,43) + String.fromCharCode(41,59), "g");
const decode = (v) => v.replace(ENTITY_RE, (whole, e) => {
  if (e[0] === '#') {
    const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
  }
  return ENTITIES[e.toLowerCase()] ?? whole;
});

const demote = (s) =>
  typeof s === 'string'
    ? decode(s)
      .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
      .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    : s;

const str = (v) => (v === null || v === undefined ? null : demote(String(v)));

/**
 * WARNING: WHAT THE CONTENT MANAGER CALLS THIS BLOCK.
 *
 * The row title in the admin is the label now, not the key, so a section with no
 * label shows as an empty row - worse than the key it replaced. Every section
 * therefore gets a readable name derived from its key: camelCase is split, a
 * dotted key becomes "Parents · Forum", and the result is title-cased.
 *
 * It is a starting point, not the last word. A hand-written label - "03 - More
 * Than One Way to Learn" - is better wherever someone writes one, and typing it
 * in the admin is safe: the page finds its content by `key`, never by this.
 */
/**
 * WARNING: A DERIVED LABEL IS A STARTING POINT, NOT A NAME.
 * "three" derives to "Three", which is true and useless. Where someone has
 * written a real name for a block, it wins.
 */
const SECTION_LABELS = JSON.parse(
  readFileSync(new URL('../fixtures/section-labels.json', import.meta.url), 'utf8'),
).routes;

function labelFor(key, route) {
  const written = SECTION_LABELS[route]?.[key];
  if (written) return written;
  return derivedLabel(key);
}

function derivedLabel(key) {
  return String(key)
    .split('.')
    .map((part) => part
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .trim()
      .replace(/^./, (c) => c.toUpperCase()))
    .join(' · ');
}

await withStrapi(async (strapi) => {
  const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  const photoPlan = JSON.parse(readFileSync(PHOTO_PLAN, 'utf8'));
  const site = await loadWebData(resolve(WEB_SRC, 'data/site.ts'));
  const schoolName = site.school.name;

  console.log(`\n  Seeding academics${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0;
  let reused = 0;
  const mediaCache = new Map();
  async function up(absolutePath, name, alt) {
    if (!absolutePath) return null;
    if (mediaCache.has(absolutePath)) { reused++; return mediaCache.get(absolutePath); }
    const r = await uploadMedia(strapi, {
      absolutePath, name, alternativeText: alt ?? null, force: FORCE_MEDIA,
    });
    r.reused ? reused++ : uploaded++;
    mediaCache.set(absolutePath, r.file.id);
    return r.file.id;
  }

  /* ── turn one classified const into a section ────────────────────────── */
  async function sectionFor(key, value, cls, prefix, route) {
    const s = { key, label: labelFor(key, route), eyebrow: null, heading: null, standfirst: null, note: null };
    const pick = (o, ...names) => { for (const n of names) if (o?.[n] !== undefined && o?.[n] !== null) return o[n]; return null; };

    const point = async (p, i) => {
      const img = [p.photo, p.src, p.image, p.art].find(isImage);
      return {
        number: str(pick(p, 'n', 'number', 'step', 'year', 'phase', 's', 'who')),
        icon: str(pick(p, 'mark', 'icon', 'glyph', 'i')),
        /* WARNING: `key` IS NOT A TITLE. It sat before `stage` in this list, so
           every stage card was titled "pre-primary" instead of "Pre-Primary" —
           the slug rendered where the name belonged. It is the layout slot and
           is kept as `slot` below. */
        title: str(pick(p, 'k', 'title', 'label', 'name', 'stage', 't', 'step', 's')) ?? '—',
        body: str(pick(p, 'v', 'body', 'detail', 'blurb', 'what', 'm', 'value', 'line', 'copy', 'text')),
        href: str(pick(p, 'href', 'link')),
        /* ⚠ THE CARD'S OWN PHOTOGRAPH, so one source array stays one array. */
        image: DRY || !img ? null : await up(img.__image, `${prefix}-${key}-${i + 1}`, p.alt ?? null),
        alt: str(pick(p, 'alt')),
        caption: str(pick(p, 'cap', 'caption', 'photo')),
        owed: Boolean(p.owed),
        /* ⚠ THE LAYOUT SLOT AND THE PHOTO-MAP KEY, both of which the markup
           looks a card up by. `caption` carries the photo key where the card
           references a separate photograph map. */
        slot: str(pick(p, 'key', 'slot', 'kind')),
        flag: Boolean(p.hired ?? p.inquiry ?? p.flag ?? false),
        suffix: str(pick(p, 'suffix')),
        anchor: str(pick(p, 'anchor', 'proof', 'evidence', 'dir', 'milestone')),
        quote: str(pick(p, 'quote')),
        /* The card's second line, and its chip row. */
        note: str(pick(p, 'gloss', 'sub', 'format', 'fact', 'note', 'why', 'more', 'qualifier', 'mono', 'state'))
          ?? (typeof p.classes === 'string' ? str(p.classes) : null),
        /**
         * WARNING: A CARD'S OWN LIST OF LINES. `compare` gives each side a
         * `points` array - four bullets apiece - and a card with no slot for a
         * nested list drops them without a word. `tags` is that slot, and the
         * query returns it under every name the source used.
         */
        /**
         * WARNING: A CARD'S OWN LIST OF LINES, WHATEVER THE SOURCE CALLED IT.
         * `compare` calls it `points`, a stage calls it `focus`, a workshop
         * calls it `chips`. Naming them one at a time meant finding each by
         * watching a page fail; the FIRST list of strings on the card is that
         * list, and the query returns it under every one of those names.
         */
        /* A nested list of ROWS - see shared.point's note on children. */
        children: (Object.entries(p).find(([k, v]) =>
          Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === 'object' && !isImage(x)),
        )?.[1] ?? []).map((x) => ({
          icon: str(x.glyph ?? x.mark ?? x.icon),
          label: str(x.name ?? x.k ?? x.label ?? x.title) ?? '—',
          value: str(x.v ?? x.body ?? x.detail ?? x.note) ?? '',
          href: str(x.href), note: null, slot: str(x.key ?? x.slot), links: [],
        })),
        tags: (Object.entries(p).find(([k, v]) =>
          Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string'),
        )?.[1] ?? []).map((c) => ({ value: str(c) })),
      };
    };
    const detail = (d) => ({
      icon: str(pick(d, 'mark', 'icon', 'i', 'n')),
      label: str(pick(d, 'k', 'label', 'q', 'when', 'm', 'title', 'name')) ?? '—',
      value: str(Array.isArray(d.lines) ? d.lines.join(' · ') : Array.isArray(d.a) ? d.a.join('\n\n') : pick(d, 'v', 'value', 'a', 'detail', 'blurb', 'd', 'body', 'lede', 'why', 'm')) ?? '',
      href: str(pick(d, 'href', 'cta', 'link')),
      /* WARNING: classes IS TWO THINGS. On a curriculum stage it is a list of
         syllabus documents and becomes links below; on an orientation timeline
         it is a plain string naming the classes invited. Both are content and
         only the shape tells them apart. */
      note: str(pick(d, 'note', 'range', 'teaser', 'mono', 'sub'))
        ?? (typeof d.classes === 'string' ? str(d.classes) : null),
      slot: str(pick(d, 'key', 'slot')),
      /* A row's own list of documents - the syllabus PDFs on a curriculum stage. */
      links: (Array.isArray(d.classes) ? d.classes : Array.isArray(d.links) ? d.links : [])
        .filter((x) => x && typeof x === 'object')
        .map((x) => ({
          label: str(x.k ?? x.label) ?? '', href: str(x.href) ?? '#',
          description: x.mb ? String(x.mb) : str(x.description),
          external: /^https?:/.test(String(x.href ?? '')),
        })),
    });

    switch (cls.part) {
      case 'scalar':
        s.note = str(value);
        break;
      /**
       * ⚠ A KEY → PROSE MAP BECOMES LABELLED ROWS. The key is the slot the page
       * looks the string up by, so it is kept as the label rather than thrown
       * away — that is what lets alt text stay attached to its photograph.
       */
      case 'labelledStrings':
        s.details = Object.entries(value).map(([k, v]) => ({
          icon: null, label: k, value: str(v), href: null, note: null,
        }));
        break;
      case 'facts':
        s.facts = value.map((v) => ({ value: str(v) }));
        break;
      case 'points':
        s.points = [];
        for (const [i, p] of value.entries()) s.points.push(await point(p, i));
        break;
      case 'details':
        s.details = value.map(detail);
        break;
      /**
       * ⚠ THE ANSWER KEEPS ITS PARAGRAPHS AND ITS EMPHASIS. Flattened into one
       * value it lost the paragraph breaks; routed through shared.detail it lost
       * the call to action's label and its external flag.
       */
      case 'faqs':
        s.faqs = value.map((x) => ({
          question: str(x.q),
          /* WARNING: an answer is a list of paragraphs on one page and a single
             string on another; both are the same content. */
          answers: (Array.isArray(x.a) ? x.a : x.a ? [x.a] : []).map((a) => ({ text: str(a) })),
          note: str(x.note),
          cta: x.cta ? { label: str(x.cta.label), href: str(x.cta.href), description: null, external: Boolean(x.cta.external) } : null,
        }));
        break;
      case 'stats':
        s.stats = value.map((c) => ({
          count: Number(c.n) || 0, suffix: str(c.suffix) ?? '', label: str(c.label), icon: null, note: null,
        }));
        break;
      case 'streams':
        s.streams = value.map((x) => ({
          number: str(x.n), key: str(x.key ?? x.name), name: str(x.name ?? x.key), icon: str(x.mark ?? x.glyph),
          fullName: str(x.full ?? x.fullName), body: str(x.body),
          core: (x.core ?? []).map((v) => ({ value: str(v) })),
          optional: (x.optional ?? []).map((v) => ({ value: str(v) })),
          additional: (x.additional ?? []).map((v) => ({ value: str(v) })),
          coreUnverified: Boolean(x.coreUnverified ?? x.coreOwed),
          unverified: Boolean(x.unverified),
        }));
        break;
      case 'awards':
        s.awards = [];
        for (const [i, a] of value.entries()) {
          s.awards.push({
            title: str(a.title), category: str(a.category), classes: str(a.classes),
            year: str(a.year), description: str(a.description), link: str(a.link), alt: str(a.alt),
            image: DRY ? null : await up(a.image?.__image, `${prefix}-${key}-${i + 1}`, a.alt),
          });
        }
        break;
      case 'stories':
        s.stories = [];
        for (const [i, a] of value.entries()) {
          s.stories.push({
            student: str(a.student), title: str(a.title), category: str(a.category),
            year: str(a.year), location: str(a.location), description: str(a.description),
            link: str(a.link), alt: str(a.alt),
            image: DRY ? null : await up(a.image?.__image, `${prefix}-${key}-${i + 1}`, a.alt),
            poster: DRY ? null : await up(a.poster?.__image, `${prefix}-${key}-${i + 1}-poster`, a.alt),
          });
        }
        break;
      case 'results':
        s.results = [];
        for (const [i, a] of value.entries()) {
          s.results.push({
            name: str(a.name), exam: str(a.exam), score: str(a.score),
            description: str(a.description), alt: str(a.alt),
            image: DRY ? null : await up(a.image?.__image, `${prefix}-${key}-${i + 1}`, a.alt),
          });
        }
        break;
      case 'photos':
      case 'photoMap': {
        /* ⚠ A photoMap ENTRY IS EITHER THE IMAGE ITSELF OR AN OBJECT AROUND IT
           — `look` wraps each photograph with its alt text and a layout span. */
        const list = cls.part === 'photoMap'
          ? Object.entries(value).map(([k, v]) => (
            isImage(v) ? { __key: k, src: v, alt: null } : { __key: k, ...v }
          ))
          : value;
        s.photos = [];
        for (const [i, p] of list.entries()) {
          const img = isImage(p) ? p : (p.src ?? p.photo ?? p.image ?? p.art);
          if (!isImage(img)) continue;
          s.photos.push({
            image: DRY ? null : await up(img.__image, `${prefix}-${key}-${i + 1}`, p.alt ?? null),
            alt: str(p.alt) ?? '',
            caption: str(p.cap ?? p.caption ?? p.k ?? p.t ?? p.__key),
          });
        }
        break;
      }
      case 'block': {
        /**
         * WARNING: ONLY THE SCALARS LAND HERE. An editorial block routinely holds
         * SEVERAL arrays, and an earlier version wrote whichever it saw last into
         * this section's single points slot and dropped the others without a
         * word. Each array is now a child section - see sectionsFor.
         */
        s.eyebrow = str(pick(value, 'eyebrow', 'kicker'));
        s.heading = str(pick(value, 'heading', 'headingLead', 'title'));
        s.standfirst = str(pick(value, 'stand', 'standfirst', 'lede'));
        s.note = str(pick(value, 'note', 'headingMark', 'footnote', 'headingTail', 'quote'));

        /**
         * WARNING: EVERY OTHER SCALAR IS KEPT AS A LABELLED ROW.
         * `voice` is { eyebrow, quote, name, role, href } - a named quotation
         * with a link. Four of those five have no slot among a section's
         * headings, so reading only the known names left the block empty and
         * lost the Principal's name, her title and the link to her message.
         * Anything not already placed becomes a detail keyed by its own name,
         * which a page reads back by that name.
         */
        const PLACED = new Set(['eyebrow', 'kicker', 'heading', 'headingLead', 'title', 'stand', 'standfirst', 'lede', 'note', 'headingMark', 'footnote']);
        s.details = Object.entries(value)
          /* WARNING: AN EMPTY STRING IS STILL A VALUE.  is '' and
             dropping it left the odometer without its data-count-suffix, which
             the counter script reads. */
          .filter(([k, v]) => !PLACED.has(k) && (typeof v === 'string' || typeof v === 'number'))
          .map(([k, v]) => ({ icon: null, label: k, value: str(v), href: null, note: null, slot: k, links: [] }));

        /**
         * WARNING: A BLOCK'S NESTED LINK OBJECT. Several blocks carry a
         * `cta: { label, href }`; it is neither a scalar nor a list, so the
         * scalar sweep above walked straight past it and the page lost its call
         * to action. It is kept as a row keyed by its own name, carrying both.
         */
        for (const [k, v] of Object.entries(value)) {
          if (PLACED.has(k) || !v || typeof v !== 'object' || Array.isArray(v)) continue;
          if (typeof v.href !== 'string') continue;
          s.details.push({
            icon: null, label: str(v.label) ?? k, value: str(v.label) ?? '',
            href: str(v.href), note: null, slot: k, links: [],
          });
        }
        break;
      }
      default:
        return null;
    }
    return s;
  }

  /**
   * ⚠ A blockMap YIELDS SEVERAL SECTIONS, keyed `<const>.<subKey>` — so
   * `parents.forum` and `teachingLearning.method` are addressable on their own
   * and a page pulls only the band it renders.
   */
  async function sectionsFor(key, value, cls, prefix, route) {
    if (cls.part === 'blockMap') {
      const out = [];
      for (const [sub, block] of Object.entries(value)) {
        const inner = classify(block, { schoolName, school: site.school, name: sub });
        out.push(...await sectionsFor(`${key}.${sub}`, block, inner, prefix, route));
      }
      return out;
    }

    const one = await sectionFor(key, value, cls, prefix, route);
    const out = one ? [one] : [];

    /**
     * WARNING: A BLOCK'S ARRAYS EACH BECOME A SECTION OF THEIR OWN, keyed
     * `<block>.<name>`. An editorial block routinely holds several - the parents
     * forum has a comparison, a step list and a topic list - and writing them all
     * into one section's single points slot kept whichever came last and dropped
     * the rest, silently. A page now reads section('parents.forum.steps') and
     * gets exactly the list the source called `steps`.
     */
    if (cls.part === 'block') {
      for (const [k, v] of Object.entries(value)) {
        if (!Array.isArray(v) || v.length === 0) continue;
        if (k === 'paragraphs' || k === 'body') continue;
        const inner = classify(v, { schoolName, school: site.school, name: k });
        if (inner.dest !== 'CMS' && inner.dest !== 'MEDIA') continue;
        out.push(...await sectionsFor(`${key}.${k}`, v, inner, prefix, route));
      }
      /**
       * WARNING: A NESTED OBJECT IS A BLOCK TOO. `method.aside` and
       * `words.figure` are small objects of their own - a label and a value -
       * and neither the scalar sweep nor the array sweep sees them. Recursing
       * makes each a child section, which blockMap rebuilds as the object it
       * was, so `method.aside.label` still resolves.
       */
      for (const [k, v] of Object.entries(value)) {
        if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
        if (typeof v.href === 'string') continue;          // already kept as a link row
        if (typeof v.__image === 'string') continue;       // a photograph
        const scalars = Object.values(v).filter((x) => x === null || typeof x !== 'object');
        if (!scalars.length) continue;
        out.push(...await sectionsFor(`${key}.${k}`, v, { part: 'block' }, prefix, route));
      }

      /**
       * WARNING: A NESTED OBJECT IS A BLOCK TOO. `method.aside` and
       * `words.figure` are small objects of their own - a label and a value -
       * and neither the scalar sweep nor the array sweep sees them. Recursing
       * makes each a child section, which blockMap rebuilds as the object it
       * was, so `method.aside.label` still resolves.
       */
      for (const [k, v] of Object.entries(value)) {
        if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
        if (typeof v.href === 'string') continue;
        if (typeof v.__image === 'string') continue;
        const scalars = Object.values(v).filter((x) => x === null || typeof x !== 'object');
        if (!scalars.length) continue;
        out.push(...await sectionsFor(`${key}.${k}`, v, { part: 'block' }, prefix, route));
      }

      const paras = value.paragraphs ?? value.body;
      if (one && Array.isArray(paras) && paras.every((x) => typeof x === 'string')) {
        one.body = paras.map((t) => ({ text: str(t) }));
      }
    }
    return out;
  }


  /**
   * THE PAGE'S OWN PHOTOGRAPHS — the ones that sat in the bespoke markup as a
   * bare import rather than inside a content const. Keyed by the binding the
   * component already used, so the swap is one line per picture.
   *
   * WARNING: ALT IS STORED WITH ITS TOKEN, NOT WITH THE SCHOOL NAME SPELLED OUT.
   * Thirty-nine of these read "A student of ${S} ..." where S is the school name
   * the page hardcodes. Writing the name into the string would put a second copy
   * of it in the CMS beside the one in Site Settings, which is the duplication
   * this migration exists to remove.
   *
   * A slot whose alt stays in code stores an empty string: those are either
   * decorative (AsClose sets alt="" itself, deliberately) or already described
   * by a value that has its own source.
   */
  async function photosFor(route) {
    const slots = photoPlan[route] ?? [];
    const out = [];
    for (const slot of slots) {
      /* The asset path is recorded relative to src/, because these photographs
         come from twenty-four different asset directories, not one. */
      const abs = resolve(WEB_SRC, slot.asset);
      /* The name is computed by the extractor, not from the basename: fourteen
         of these files are called 01.jpg or 02.jpg and reuse is by name. */
      const id = DRY ? null : await up(abs, slot.name, slot.alt ?? null);
      out.push({ key: slot.key, image: id, alt: slot.alt ?? '', caption: null });
    }
    return out;
  }

  /* ── build one record per route ──────────────────────────────────────── */
  const routes = academicsFilesFor(WEB_SRC);

  /**
   * ⚠ A COMPONENT SHARED BY SEVERAL ROUTES IS CLAIMED BY THE FIRST. AcClose,
   * AsRail and the rest are used everywhere; attributing their consts to every
   * route would publish the same content 40 times. They carry no content anyway
   * (all prop-derived), but the rule is stated so a future shared component with
   * real content is caught rather than duplicated.
   */
  const claimed = new Set();
  const duplicates = [];

  /* Topic arrays supply the per-page label / hint / title / standfirst / body. */
  const TOPIC_ARRAYS = [
    ['data/academics.ts', 'assessmentTopics'],
    ['data/academicTopics.ts', 'philosophyTopics'],
    ['data/academicTopics.ts', 'structureTopics'],
    ['data/academicTopics.ts', 'careerTopics'],
    ['data/academicTopics.ts', 'parentTopics'],
    ['data/teachingTopics.ts', 'teachingTopics'],
  ];
  const topicByRoute = new Map();
  for (const [file, name] of TOPIC_ARRAYS) {
    for (const t of fixture[file]?.[name] ?? []) topicByRoute.set(t.href, t);
  }

  /* Data-file consts belong to the hub route of their section. */
  const DATA_ROUTE = {
    chapters: '/academics/', counters: '/academics/', heroStats: '/academics/',
    philosophy: '/academics/philosophy/', teachingPhilosophy: '/academics/philosophy/',
    affiliation: '/academics/philosophy/affiliation-details/',
    stages: '/academics/structure/', streamDetail: '/academics/structure/',
    streamOptional: '/academics/structure/', streamAdditional: '/academics/structure/',
    combinationsFootnote: '/academics/structure/',
    facilities: '/academics/teaching-learning/', teachingLearning: '/academics/teaching-learning/',
    cycle: '/academics/assessment/', supports: '/academics/assessment/',
    wins: '/academics/student-success/', guidance: '/academics/student-success/',
    awaiting: '/academics/student-success/',
    partnership: '/academics/parent-partnership/', partnershipPhases: '/academics/parent-partnership/',
    parents: '/academics/parent-partnership/',
    careerGuidanceImages: '/academics/student-success/career-guidance/',
    careerGuidanceOpen: '/academics/student-success/career-guidance/',
    careerGuidanceMain: '/academics/student-success/career-guidance/',
    careerGuidanceGive: '/academics/student-success/career-guidance/',
    careerGuidanceClose: '/academics/student-success/career-guidance/',
    olympiads: '/academics/student-success/olympiad-achievements/',
    universityResults: '/academics/student-success/university-counselling/',
    successStories: '/academics/student-success/success-stories/',
    successMilestones: '/academics/student-success/success-stories/',
    scholarships: '/academics/student-success/scholarships/',
    recognitionPaths: '/academics/student-success/scholarships/',
    forumAgenda: '/academics/parent-partnership/parents-forum/',
    agendaHeading: '/academics/parent-partnership/parents-forum/',
    forumNameplates: '/academics/parent-partnership/parents-forum/',
    forumBenefits: '/academics/parent-partnership/parents-forum/',
    engagementFacts: '/academics/parent-partnership/parent-engagement/',
    commsBenefits: '/academics/parent-partnership/school-parent-communication/',
  };

  const perRoute = new Map();
  const addSection = (route, key, value, cls, prefix, file) =>
    perRoute.get(route).pending.push({ key, value, cls, prefix, file });

  for (const [route, files] of routes) {
    perRoute.set(route, { pending: [], files });
  }

  /* component consts */
  for (const [route, files] of routes) {
    for (const file of files) {
      const consts = fixture[file];
      if (!consts) continue;
      if (claimed.has(file)) { duplicates.push(`${file} also used by ${route}`); continue; }
      claimed.add(file);
      for (const [name, value] of Object.entries(consts)) {
        const cls = classify(value, { schoolName, school: site.school, name });
        if (cls.dest !== 'CMS' && cls.dest !== 'MEDIA') continue;
        addSection(route, name, value, cls, slugify(labelOf(route)), file);
      }
    }
  }

  /* data-file consts */
  for (const [file, consts] of Object.entries(fixture)) {
    if (!file.startsWith('data/')) continue;
    for (const [name, value] of Object.entries(consts)) {
      const route = DATA_ROUTE[name];
      if (!route || !perRoute.has(route)) continue;
      if (TOPIC_ARRAYS.some(([, n]) => n === name)) continue;
      const cls = classify(value, { schoolName, school: site.school, name });
      if (cls.dest !== 'CMS' && cls.dest !== 'MEDIA') continue;
      addSection(route, name, value, cls, slugify(labelOf(route)), file);
    }
  }

  /* ── write ───────────────────────────────────────────────────────────── */
  let created = 0;
  let updated = 0;
  let sectionCount = 0;
  const order = [...routes.keys()].sort();

  for (const [i, route] of order.entries()) {
    const topic = topicByRoute.get(route);
    const bucket = perRoute.get(route);

    const sections = [];
    if (!DRY) {
      for (const p of bucket.pending) {
        sections.push(...await sectionsFor(p.key, p.value, p.cls, p.prefix, route));
      }
      /**
       * WARNING: ONE SECTION PER KEY. The nested-object recursion can reach the
       * same object by two paths and wrote it twice; a page then reads whichever
       * copy the lookup happens to find, and an editor sees two identical blocks
       * with no way to tell which one the page uses.
       */
      const seenKeys = new Set();
      for (let i = sections.length - 1; i >= 0; i--) {
        if (seenKeys.has(sections[i].key)) sections.splice(i, 1);
        else seenKeys.add(sections[i].key);
      }
    }
    /**
     * ⚠ THE ROWS ARE NUMBERED THE WAY THE PAGE IS.
     *
     * An editor opening a page saw a list of blocks with no order to them and no
     * way to tell which one was the part of the page they were looking at.
     * Sections are built in page order, so numbering them here makes the list
     * read as the page reads: 01 is the first block a visitor sees.
     *
     * ⚠ A BLOCK IS THE LONGEST PREFIX THAT IS ITSELF A SECTION - not the first
     * segment. Twenty-nine of the parent-partnership rows are `parents.something`
     * and `parents` is not a section at all, so anchoring on the first segment
     * numbered none of them. `parents.orientation.points` belongs to
     * `parents.orientation`, which is a real block and gets the number.
     *
     * ⚠ THE SHARED PREFIX IS DROPPED FROM THE NAME. Every block on that page
     * begins "Parents ·", which is the page you already have open.
     *
     * A hand-written label in section-labels.json always wins: someone who has
     * looked at the page knows better than a rule.
     */
    {
      const keys = new Set(sections.map((s) => s.key));
      /** The block a section belongs to: itself, or the nearest ancestor section. */
      const blockOf = (key) => {
        const parts = key.split(".");
        for (let i = parts.length - 1; i > 0; i--) {
          const prefix = parts.slice(0, i).join(".");
          if (keys.has(prefix)) return prefix;
        }
        return key;
      };
      /** A block key read as words, without the segment that names the page. */
      const nameOf = (key) => {
        const parts = key.split(".");
        const meaningful = parts.length > 1 && !keys.has(parts[0]) ? parts.slice(1) : parts;
        return meaningful.map(derivedLabel).join(" · ");
      };

      const numbers = new Map();
      let n = 0;
      for (const s of sections) {
        const block = blockOf(s.key);
        if (!numbers.has(block)) numbers.set(block, ++n);
      }
      for (const s of sections) {
        if (SECTION_LABELS[route]?.[s.key]) continue;
        const block = blockOf(s.key);
        const num = String(numbers.get(block)).padStart(2, "0");
        const own = s.key === block ? "" : " · " + s.key.slice(block.length + 1).split(".").map(derivedLabel).join(" · ");
        s.label = num + " — " + nameOf(block) + own;
      }
    }


    sectionCount += sections.length;

    const label = topic?.label ?? labelOf(route);
    if (DRY) { console.log(`    ${route.padEnd(56)} ${bucket.pending.length} sections`); continue; }

    const outcome = await upsertBySlug(strapi, UID, slugify(route.replace(/^\/|\/$/g, '').replace(/\//g, '-')), {
      route,
      group: groupOf(route),
      displayOrder: i,
      label,
      hint: str(topic?.hint),
      title: str(topic?.title),
      standfirst: str(topic?.standfirst),
      photoKey: str(topic?.photo),
      owed: Boolean(topic?.owed),
      existing: Boolean(topic?.existing),
      body: (topic?.body ?? []).map((t) => ({ text: str(t) })),
      points: (topic?.points ?? []).map((p) => ({
        number: null, icon: null, title: str(p.k), body: str(p.v), href: null,
      })),
      sections,
      photos: await photosFor(route),
    });
    outcome === 'created' ? created++ : updated++;
  }

  /**
   * ⚠ THE SWAP MAP IS WRITTEN BY THE SEED, NOT GUESSED BY THE CODEMOD.
   *
   * The codemod has to replace exactly the consts this seed migrated, on exactly
   * the routes it attributed them to. Working that out a second time from the
   * same rules would be a second implementation to keep in step — and the first
   * divergence would look like a page that renders nothing.
   */
  const swap = {};
  for (const [route, bucket] of perRoute) {
    for (const p of bucket.pending) {
      if (!p.file) continue;
      /* WARNING: THE ROUTE IS PER CONST, NOT PER FILE. data/academics.ts feeds a
         dozen routes - chapters to /academics/, cycle to /academics/assessment/,
         parents to /academics/parent-partnership/. Recording one route for the
         whole file pointed every consumer at whichever const came first, and
         they fetched a record that had none of their sections. */
      swap[p.file] ??= { route, consts: {} };
      swap[p.file].consts[p.key] = { part: p.cls.part, route };
    }
  }
  writeFileSync(SWAP_OUT, `${JSON.stringify(swap, null, 2)}
`, 'utf8');

  console.log(`\n  ${created} created, ${updated} updated · ${sectionCount} sections`);
  if (duplicates.length) {
    console.log(`\n  ⚠ components used by more than one route (claimed by the first):`);
    for (const d of duplicates.slice(0, 12)) console.log(`      ${d}`);
    if (duplicates.length > 12) console.log(`      …and ${duplicates.length - 12} more`);
  }
  if (!DRY) console.log(`\n  Media — ${uploaded} uploaded, ${reused} reused`);
  console.log('');
});
