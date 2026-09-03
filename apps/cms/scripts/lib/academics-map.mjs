/**
 * ROUTE → FILES, AND CONST → SECTION PART.
 *
 * Shared by the planner, the seed and the verifier so all three agree by
 * construction. If they each had their own copy of these rules they would drift,
 * and the drift would look like missing content.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const SCHOOL_NAME = 'Sunbeam School Ballia';

export const isImage = (v) => v && typeof v === 'object' && typeof v.__image === 'string';
export const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v) && !isImage(v);

export const looksLikeDesign = (s) =>
  typeof s === 'string' && (
    /^[Mm][\d\s.,-]/.test(s)                 // a bare path command
    /* ⚠ AND SVG MARKUP, WHICH STARTS WITH A TAG. Thirteen pages declare a MARK
       table of `<path d="M…"/>` strings — glyph geometry, not prose — and the
       path-command test missed every one of them because the string begins with
       "<path". They were classified as editorial blocks and seeded as thirteen
       empty sections. */
    || /^\s*<(path|svg|g|circle|rect|line|polyline|polygon)\b/i.test(s)
    || /^#[0-9a-f]{3,8}$/i.test(s)
    || /^[\d.]+(px|rem|%|deg|s)?$/.test(s)
  );

export const looksLikeRoute = (s) => typeof s === 'string' && /^(\/|https?:|mailto:|tel:|#)/.test(s);

/** Every scalar string anywhere in the school record, flattened once. */
let siteCache = null;
export function siteValues(school) {
  if (siteCache) return siteCache;
  const out = new Set();
  const walkValue = (v) => {
    if (typeof v === 'string' && v.trim()) out.add(v);
    else if (Array.isArray(v)) v.forEach(walkValue);
    else if (v && typeof v === 'object') Object.values(v).forEach(walkValue);
  };
  walkValue(school);
  siteCache = out;
  return out;
}

/* ── which .astro files belong to which route ────────────────────────────── */

function frontmatter(src) {
  const first = src.indexOf('---');
  const second = src.indexOf('\n---', first + 3);
  return first === 0 && second > 0 ? src.slice(3, second) : '';
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

/**
 * Every academics component a page pulls in, transitively.
 *
 * ⚠ TRANSITIVE, BECAUSE THE CONTENT IS TWO LEVELS DOWN. A route imports one
 * page component, and that component imports the bands that hold the prose.
 * Following only direct imports would attribute almost nothing to almost every
 * route.
 */
export function academicsFilesFor(webSrc) {
  const pagesDir = join(webSrc, 'pages', 'academics');
  const compDir = join(webSrc, 'components', 'academics');
  const rel = (f) => relative(webSrc, f).replace(/\\/g, '/');

  /* file → the academics components it imports */
  const edges = new Map();
  for (const f of [...walk(pagesDir), ...walk(compDir)]) {
    const fm = frontmatter(readFileSync(f, 'utf8'));
    const targets = [...fm.matchAll(/import \w+ from '([^']*components\/academics\/[^']+\.astro)'/g)]
      .map((m) => rel(join(dirname(f), m[1])));
    edges.set(rel(f), targets);
  }

  const routes = new Map();
  for (const f of walk(pagesDir).sort()) {
    const route = `/${relative(join(webSrc, 'pages'), f).replace(/\\/g, '/').replace(/\.astro$/, '').replace(/\/index$/, '')}/`
      .replace('//', '/');

    const seen = new Set();
    const stack = [rel(f)];
    while (stack.length) {
      const cur = stack.pop();
      if (seen.has(cur)) continue;
      seen.add(cur);
      for (const t of edges.get(cur) ?? []) stack.push(t);
    }
    routes.set(route, [...seen]);
  }
  return routes;
}

/* ── const → the part of a section it becomes ────────────────────────────── */

/**
 * ⚠ THE RETURN IS THE SHAPE THE SEED WRITES *AND* THE SHAPE THE PAGE READS.
 * The query maps each part back to the source's own field names — `{n, mark, k,
 * v}` for a point — so the markup below a swapped const never changes. That is
 * what lets forty bespoke layouts keep their designs.
 */
/**
 * ⚠ CONSTS THAT ARE DERIVED IN THE SOURCE AND LOOK LITERAL AFTER EVALUATION.
 *
 * The extractor runs the frontmatter, so `const plates = forumNameplates.join(',
 * ')` arrives as a finished string with no trace of where it came from. Seeding
 * it would publish a second copy of a list that is already content, and the two
 * would drift the moment a nameplate changed. There is no way to tell from the
 * value alone, so the handful of them are named here with the reason.
 */
export const DERIVED_CONSTS = {
  plates: 'a join of forumNameplates — the list itself is the content',
  totalDocs: 'a count of the documents on the page',
  channelCount: 'a count of the partnership channels',
  count: 'a count of the items on the page',
  claimText: 'composed from the stream flags',
};

export function classify(value, { schoolName = SCHOOL_NAME, school = null, name = null } = {}) {
  if (name && DERIVED_CONSTS[name]) {
    return { dest: 'DERIVED', why: DERIVED_CONSTS[name] };
  }

  if (typeof value === 'string') {
    if (value === schoolName) return { dest: 'SITE', why: 'the school name — Site Settings owns it' };
    /**
     * ⚠⚠ AND ANY OTHER SITE SETTINGS VALUE. Two academics pages declare
     * `phoneHref` and `phoneShow` — the admissions number, in both its dialling
     * and its display form. They read it from the school record in the source;
     * the extraction resolved that to a literal, and seeding the literal would
     * have put the school's phone number in two places, one of which nobody
     * would remember to change.
     */
    if (school && siteValues(school).has(value)) {
      return { dest: 'SITE', why: 'a Site Settings value — it belongs there, not here' };
    }
    if (looksLikeRoute(value)) return { dest: 'DESIGN', why: 'a route constant — navigation, stays in code' };
    if (looksLikeDesign(value)) return { dest: 'DESIGN', why: 'geometry or a measurement' };
    return { dest: 'CMS', part: 'scalar', why: 'editorial string' };
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return { dest: 'DERIVED', why: 'a count or a flag computed from content' };
  }
  if (value === null) return { dest: 'DERIVED', why: 'null placeholder' };

  if (isPlainObject(value)) {
    const vals = Object.values(value);
    if (vals.length && vals.every(isImage)) {
      return { dest: 'MEDIA', part: 'photoMap', count: vals.length, why: 'a key → photograph map' };
    }
    if (vals.length && vals.every((v) => looksLikeDesign(v) || typeof v === 'number')) {
      return { dest: 'DESIGN', why: 'a glyph or geometry table' };
    }
    /**
     * ⚠ A KEY → PHOTOGRAPH-AND-ALT MAP. `look` on the academics overview is
     * { philosophy: { span, photo, alt } } — the span is layout, the photograph
     * and its alt text are not. Read as a plain editorial block it produced an
     * empty section and lost six photographs with their descriptions.
     */
    if (vals.length && vals.some((v) => isPlainObject(v) && isImage(v.photo ?? v.src ?? v.image))) {
      /* ⚠ `some`, NOT `every`. `look` gives one chapter a photograph and the
         next only a layout span; requiring all of them to carry an image lost
         the six that do. Entries without one are simply skipped when writing. */
      return { dest: 'MEDIA', part: 'photoMap', count: vals.filter((v) => isImage(v.photo ?? v.src ?? v.image)).length, why: 'a key → {photograph, alt} map' };
    }

    /**
     * ⚠⚠ AN OBJECT OF EDITORIAL BLOCKS BECOMES ONE SECTION EACH.
     *
     * `parents` and `teachingLearning` are the two largest content objects in
     * academics — twelve and six named sub-blocks, each with its own eyebrow,
     * heading, prose and card list, driving nine components between them. Read as
     * a single editorial block they produced ONE section holding almost nothing,
     * which is the quiet failure this whole verification exists to catch. Each
     * sub-block is now a section of its own, keyed `parents.forum` and so on.
     */
    const EDITORIAL = ['eyebrow', 'heading', 'headingLead', 'title', 'stand', 'lede', 'paragraphs', 'body', 'quote', 'items', 'steps', 'cards', 'points'];
    if (vals.length > 1 && vals.every((v) => isPlainObject(v) && EDITORIAL.some((k) => k in v))) {
      return { dest: 'CMS', part: 'blockMap', count: vals.length, why: 'named editorial blocks — one section each' };
    }
    /**
     * ⚠ A KEY → PROSE MAP IS CONTENT. `frameAlt` is { precept: "A member of
     * staff …" } — alt text for four photographs, which is exactly the kind of
     * writing a school should be able to correct and exactly what a screen
     * reader depends on. It has no heading and no nested array, so the editorial
     * block reader found nothing in it.
     */
    if (vals.length && vals.every((v) => typeof v === 'string' && !looksLikeDesign(v) && !looksLikeRoute(v))) {
      return { dest: 'CMS', part: 'labelledStrings', count: vals.length, why: 'a key → prose map' };
    }
    return { dest: 'CMS', part: 'block', why: 'an editorial block', count: Object.keys(value).length };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return { dest: 'CMS', part: 'facts', count: 0, why: 'empty in the source, and stays empty' };

    if (value.every((v) => typeof v === 'string')) {
      if (value.every(looksLikeRoute)) return { dest: 'DESIGN', why: 'a list of routes' };
      if (value.every(looksLikeDesign)) return { dest: 'DESIGN', why: 'a list of measurements' };
      return { dest: 'CMS', part: 'facts', count: value.length, why: 'a list of strings' };
    }
    if (value.every(isImage)) {
      return { dest: 'MEDIA', part: 'photos', count: value.length, why: 'a list of photographs' };
    }

    if (value.every(isPlainObject)) {
      const keys = new Set(value.flatMap((v) => Object.keys(v)));
      const has = (...k) => k.every((x) => keys.has(x));
      const shape = `{${[...keys].join(', ')}}`;

    /**
     * ⚠⚠ A `photo` FIELD IS NOT NECESSARILY A PHOTOGRAPH. Several arrays carry
     * a photo *key* — a string that indexes a separate map — and routing those to
     * photographs produced sections with no images and, worse, lost the title and
     * body beside them. The test is now whether an actual image is there.
     */
      /**
       * ⚠⚠ PROSE BESIDE A PICTURE IS NOT A GALLERY.
       *
       * `stops` is {n, k, body, photo, alt, owed} — six cards, each a heading, a
       * paragraph and an image. Routed to a photo list it kept the pictures and
       * dropped every word beside them, and the coverage check saw only that one
       * entry was short. shared.point carries an image of its own for exactly
       * this, so one source array stays one array and the markup is untouched.
       */
      /**
       * ⚠⚠⚠ A LABEL BESIDE A PICTURE IS STILL A LABEL.
       *
       * `orbit` is {k, art, a, r, s, o} and `abilities` is {k, art, a} — a word,
       * a decorative icon and a position on a ring. Neither has a body, so a
       * "prose or gallery" test called them galleries and kept nine and seven
       * IMAGES while dropping every WORD. And a count check cannot see it: nine
       * photographs arrived, exactly as expected.
       *
       * So the question is not whether there is prose. It is whether there is a
       * label. If there is, the array is points — which carry their own image —
       * and only a bare {src, alt, cap} list is a gallery.
       */
      /**
       * WARNING: THE SPECIFIC RECORD SHAPES COME FIRST.
       * An olympiad has a title and an image, so the generic "labelled card with
       * a photograph" test claimed it and stored it as a point - losing its
       * category, its description and the link to the school's own announcement.
       * These four shapes have components of their own and must be recognised
       * before anything more general looks at them.
       */
      if (has('name') && has('core')) return { dest: 'CMS', part: 'streams', count: value.length, why: 'streams with subject lists' };
      if (has('key') && has('core')) return { dest: 'CMS', part: 'streams', count: value.length, why: 'stream worlds with subject lists' };
      if (has('student')) return { dest: 'CMS', part: 'stories', count: value.length, why: 'named student stories' };
      if (has('exam') && has('score')) return { dest: 'CMS', part: 'results', count: value.length, why: 'named examination results' };
      if (has('category') && has('classes')) return { dest: 'CMS', part: 'awards', count: value.length, why: 'olympiad records' };

      const carriesImage = value.some((v) => isImage(v.src ?? v.photo ?? v.image ?? v.art));
      const labelled = ['k', 'label', 'title', 'name', 't', 'stage', 'q'].some((x) => keys.has(x));
      if (carriesImage && !labelled) {
        return { dest: 'MEDIA', part: 'photos', count: value.filter((v) => isImage(v.src ?? v.photo ?? v.image ?? v.art)).length, why: 'a photograph list' };
      }
      if (carriesImage && labelled) {
        return { dest: 'CMS', part: 'points', count: value.length, why: `${shape} — labelled cards with a photograph` };
      }

      if (has('n') && has('suffix') && has('label')) return { dest: 'CMS', part: 'stats', count: value.length, why: '{n, suffix, label} counters' };

      if (has('id') && has('label') && has('href')) return { dest: 'CMS', part: 'topics', count: value.length, why: 'topic records — one page each' };
      if (has('label') && has('lines')) return { dest: 'CMS', part: 'details', count: value.length, why: '{label, lines} cells' };
      if (has('q') && has('a')) return { dest: 'CMS', part: 'faqs', count: value.length, why: 'questions and answers' };
      if (has('label') && has('range')) return { dest: 'CMS', part: 'details', count: value.length, why: 'curriculum stages' };
      if (has('when') && has('detail')) return { dest: 'CMS', part: 'details', count: value.length, why: 'a dated timeline' };
      if (has('m') && has('d')) return { dest: 'CMS', part: 'details', count: value.length, why: '{m, d} month rows' };
      if (has('title') && has('href') && !has('body')) return { dest: 'CMS', part: 'details', count: value.length, why: 'titled links' };

      if (has('k') && (has('v') || has('body') || has('note') || has('mark'))) return { dest: 'CMS', part: 'points', count: value.length, why: shape };
      if (has('title') && (has('body') || has('what'))) return { dest: 'CMS', part: 'points', count: value.length, why: shape };
      if (has('key') && has('stage')) return { dest: 'CMS', part: 'points', count: value.length, why: 'stage cards' };
      if (has('phase') && has('label')) return { dest: 'CMS', part: 'points', count: value.length, why: 'partnership phases' };
      if (has('label') && has('body')) return { dest: 'CMS', part: 'points', count: value.length, why: '{label, body} cards' };
      if (has('year') && has('title')) return { dest: 'CMS', part: 'points', count: value.length, why: 'dated wins' };
      if (has('step') && has('body')) return { dest: 'CMS', part: 'points', count: value.length, why: 'cycle steps' };
      if (has('name') && (has('sub') || has('mark'))) return { dest: 'CMS', part: 'points', count: value.length, why: 'named cards' };
      if (has('n') && has('t') && has('v')) return { dest: 'CMS', part: 'points', count: value.length, why: 'numbered cards' };
      if (has('s') && has('v')) return { dest: 'CMS', part: 'points', count: value.length, why: '{s, v} steps' };
      if (has('n') && has('key')) return { dest: 'CMS', part: 'points', count: value.length, why: 'numbered keys' };

      /**
       * ⚠⚠ A SHAPE THAT CARRIES A LABEL IS NEVER PURE DESIGN.
       *
       * `orbit` is {k, art, a, r, s, o} and `abilities` is {k, art, a}: angles,
       * radii, scales and a decorative icon — and a LABEL. "Words", "Number",
       * "Making". Classifying the whole array as a layout table, which an earlier
       * version did, silently dropped nine and seven pieces of editorial text
       * from two pages that then rendered a ring of unlabelled icons.
       *
       * So the layout tests run only when there is no label key at all. Where
       * there is one, the label goes to the CMS and the geometry stays in the
       * component, keyed off it.
       */
      const LABEL_KEYS = ['k', 'label', 'title', 'name', 't', 'q', 'stage', 'step'];
      const hasLabel = LABEL_KEYS.some((k) => keys.has(k));

      if (!hasLabel && [...keys].every((k) => /^(class|w|h|dur|delay|x|y|top|left|deg|scale)$/.test(k))) {
        return { dest: 'DESIGN', why: `animation table ${shape}` };
      }
      if (!hasLabel && [...keys].every((k) => /^(a|r|s|o|x|y|cx|cy|rx|ry|top|left|deg|delay|tone|accent|glyph|art|mark)$/.test(k))) {
        return { dest: 'DESIGN', why: `layout table ${shape}` };
      }
      if (hasLabel) {
        return { dest: 'CMS', part: 'points', count: value.length, why: `${shape} — label kept, geometry stays in the component` };
      }

      return { dest: 'UNCLASSIFIED', why: shape, count: value.length };
    }
  }
  return { dest: 'UNCLASSIFIED', why: typeof value };
}
