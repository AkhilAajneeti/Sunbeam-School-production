/**
 * FIELD FIDELITY — every KEY of every source object has somewhere to land.
 *
 *     node scripts/verify/academics-fields.mjs
 *
 * ═══ WHY COUNTING ENTRIES IS NOT ENOUGH ════════════════════════════════════
 *
 * `academics-coverage.mjs` proves the right NUMBER of cards arrived. It cannot
 * see that each card lost a field on the way — nine orbit labels dropped while
 * nine photographs arrived, a workshop's `format` line gone while its title and
 * body are fine. Those are invisible to a count, invisible to the build, and
 * invisible to a page that renders `{c.format}` as nothing.
 *
 * So this walks the source objects key by key and asks, for each one: did a
 * field of the stored component actually receive it?
 *
 *   · matched   — the value is present in the stored entry
 *   · design    — the key is layout, and staying in the component is correct
 *   · LOST      — the value is nowhere, and the page will render less than it did
 *
 * ⚠ THE COMPARISON IS ON VALUES, NOT ON NAMES. `k` becomes `title` and `v`
 * becomes `body`; matching names would report every migrated field as lost.
 * Matching values catches a field that was mapped to the wrong slot as well as
 * one that was dropped.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { academicsFilesFor, classify } from '../lib/academics-map.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../../web/src');
const FIXTURE = resolve(HERE, '../fixtures/academics.json');
const UID = 'api::academic-topic.academic-topic';

/** Keys that are layout or geometry and are meant to stay in the component. */
const DESIGN_KEYS = new Set([
  'a', 'r', 's', 'o', 'x', 'y', 'cx', 'cy', 'rx', 'ry', 'deg', 'scale',
  'tone', 'accent', 'span', 'class', 'w', 'h', 'dur', 'delay',
  'art', 'glyph', 'ring', 'pos', 'size', 'align', 'variant', 'external',
  /* Coordinates and tints this very check surfaced, correctly left behind. */
  /* WARNING: `line` AND `dir` ARE NOT HERE. Both look like layout and both are
     prose - "Engineering and the physical sciences." - and listing them as
     design is what let two stream descriptions off the page unnoticed. */
  'nx', 'ny', 'tint',
]);

const PART_FIELD = {
  facts: 'facts', points: 'points', details: 'details', stats: 'stats',
  streams: 'streams', awards: 'awards', stories: 'stories', results: 'results',
  photos: 'photos', photoMap: 'photos', faqs: 'faqs', labelledStrings: 'details',
};

/** Every scalar the stored entry holds, flattened, for a value comparison. */
function storedValues(entry) {
  const out = new Set();
  const walk = (v) => {
    if (v === null || v === undefined) return;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') { out.add(String(v)); return; }
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v === 'object') {
      /* A media object counts as its own presence, not its url. */
      if (v.url || v.mime) { out.add('__image__'); return; }
      Object.values(v).forEach(walk);
    }
  };
  walk(entry);
  return out;
}

await withStrapi(async (strapi) => {
  const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  const site = await loadWebData(resolve(WEB_SRC, 'data/site.ts'));
  const schoolName = site.school.name;

  const records = await strapi.documents(UID).findMany({
    status: 'published', pagination: { limit: 200 },
    populate: {
      sections: {
        populate: {
          body: true, facts: true, figures: true, stats: true, links: true,
          details: { populate: { links: true } },
          points: { populate: { image: true, tags: true } },
          photos: { populate: { image: true } },
          streams: { populate: { core: true, optional: true, additional: true } },
          awards: { populate: { image: true } },
          stories: { populate: { image: true, poster: true } },
          results: { populate: { image: true } },
          faqs: { populate: { answers: true, cta: true } },
        },
      },
    },
  });
  const byRoute = new Map(records.map((r) => [r.route, r]));

  /* Same attribution the seed used. */
  const routes = academicsFilesFor(WEB_SRC);
  const claimed = new Set();
  const expected = [];
  for (const [route, files] of routes) {
    for (const file of files) {
      const consts = fixture[file];
      if (!consts || claimed.has(file)) continue;
      claimed.add(file);
      for (const [name, value] of Object.entries(consts)) {
        const cls = classify(value, { schoolName, school: site.school, name });
        if (cls.dest !== 'CMS' && cls.dest !== 'MEDIA') continue;
        expected.push({ route, file, name, cls, value });
      }
    }
  }

  const lost = [];
  let checkedKeys = 0;
  let matched = 0;
  let design = 0;

  for (const e of expected) {
    if (!Array.isArray(e.value)) continue;                 // objects handled by coverage
    const field = PART_FIELD[e.cls.part];
    if (!field) continue;

    const rec = byRoute.get(e.route);
    const sec = (rec?.sections ?? []).find((s) => s.key === e.name);
    if (!sec) continue;                                     // coverage reports this
    const stored = sec[field] ?? [];

    for (const [i, item] of e.value.entries()) {
      if (!item || typeof item !== 'object') continue;
      const got = stored[i];
      if (!got) continue;
      const have = storedValues(got);

      for (const [k, v] of Object.entries(item)) {
        if (v === null || v === undefined || v === '') continue;
        checkedKeys++;
        if (DESIGN_KEYS.has(k)) { design++; continue; }

        const isImg = v && typeof v === 'object' && typeof v.__image === 'string';
        /* WARNING: AN ARRAY OF OBJECTS NEEDS A REAL STRING TO LOOK FOR.
           Stringifying the first entry gave "[object Object]", which matches
           nothing and reported five perfectly well migrated syllabus lists as
           lost - a false alarm that hides real ones. */
        const firstString = (x) => {
          if (typeof x === 'string') return x;
          if (Array.isArray(x)) return firstString(x[0]);
          if (x && typeof x === 'object') {
            for (const val of Object.values(x)) {
              const found = firstString(val);
              if (found) return found;
            }
          }
          return '';
        };
        const needle = isImg ? '__image__' : firstString(v) || String(v);

        /**
         * WARNING: BOTH SIDES ARE NORMALISED. The source writes <strong>...</strong>;
         * the CMS stores **...**. Comparing raw text reported every emphasised
         * sentence as lost - a false alarm loud enough to hide the real ones.
         */
        const norm = (x) => x.replace(new RegExp(String.fromCharCode(60)+String.fromCharCode(91)+String.fromCharCode(94)+String.fromCharCode(62)+String.fromCharCode(93)+String.fromCharCode(43)+String.fromCharCode(62),"g"),"").split("**").join("").split("&amp;").join("&").replace(new RegExp(String.fromCharCode(92)+"s+","g")," ").trim();
        const flat = norm([...have].join(' '));
        if (flat.includes(norm(needle))) matched++;
        else lost.push(`${e.route} · ${e.name}[${i}].${k} = ${JSON.stringify(String(needle)).slice(0, 60)}`);
      }
    }
  }

  const byConst = new Map();
  for (const l of lost) {
    const key = l.split('.').slice(0, 2).join('.').replace(/\[\d+\]$/, '');
    byConst.set(key, (byConst.get(key) ?? 0) + 1);
  }

  console.log(`
  ACADEMICS FIELD FIDELITY

    keys checked   ${checkedKeys}
    matched        ${matched}
    design (kept)  ${design}
    LOST           ${lost.length}
`);
  if (lost.length) {
    console.log('  LOST — grouped\n');
    for (const [k, n] of [...byConst.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
      console.log(`    ${String(n).padStart(4)}  ${k}`);
    }
    console.log('\n  first 25 individually\n');
    for (const l of lost.slice(0, 25)) console.log(`    ${l}`);
  }
  console.log(lost.length ? '\n  ✖ FIELDS LOST\n' : '\n  ✔ every source field landed\n');
});
