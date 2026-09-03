/**
 * COVERAGE — every academics const that should be in Strapi, is.
 *
 *     node scripts/verify/academics-coverage.mjs
 *
 * ═══ THE CHECK THIS GROUP ACTUALLY NEEDS ═══════════════════════════════════
 *
 * Academics is forty bespoke layouts. A section that comes back empty does not
 * throw, does not fail the build, and does not change the page's structure — it
 * just renders nothing where a paragraph used to be. A successful build proves
 * nothing here.
 *
 * So this compares the extraction fixture against the database, const by const:
 *
 *   · every CMS/MEDIA const has a section with its key, on the right route
 *   · that section's part is populated, and holds the same number of entries
 *   · every section in the database traces back to a const in the fixture
 *
 * ⚠ IT COUNTS ENTRIES, NOT JUST PRESENCE. A points array that arrived with 3 of
 * its 6 cards is the failure mode that survives every other check.
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

/** Which section field a classified part is written to. */
const PART_FIELD = {
  scalar: 'note', facts: 'facts', points: 'points', details: 'details',
  labelledStrings: 'details', faqs: 'faqs',
  stats: 'stats', streams: 'streams', awards: 'awards', stories: 'stories',
  results: 'results', photos: 'photos', photoMap: 'photos', block: null,
};

await withStrapi(async (strapi) => {
  const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  const site = await loadWebData(resolve(WEB_SRC, 'data/site.ts'));
  const schoolName = site.school.name;

  const records = await strapi.documents(UID).findMany({
    status: 'published',
    pagination: { limit: 200 },
    populate: {
      sections: {
        populate: {
          body: true, points: true, details: true, facts: true, figures: true,
          stats: true, links: true,
          photos: { populate: { image: true } },
          streams: { populate: { core: true, optional: true, additional: true } },
          awards: { populate: { image: true } },
          stories: { populate: { image: true, poster: true } },
          results: { populate: { image: true } },
          faqs: { populate: { answers: true, cta: true } },
          photos: { populate: { image: true } },
        },
      },
      body: true, points: true,
    },
  });

  const byRoute = new Map(records.map((r) => [r.route, r]));
  const routes = academicsFilesFor(WEB_SRC);

  /* Rebuild the same route → const attribution the seed used. */
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

  /**
   * ⚠ THE DATA-FILE CONSTS ARE EXPECTED TOO. The seed attributes them to a hub
   * route by name; leaving them out of this list reported 34 perfectly good
   * sections as "unexplained", which is the kind of false alarm that gets a
   * check switched off.
   */
  const DATA_ROUTE = JSON.parse(
    readFileSync(resolve(HERE, '../seed/academics.mjs'), 'utf8')
      .match(/const DATA_ROUTE = \{([\s\S]*?)\n  \};/)[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
      .replace(/,(\s*)$/, '')
      .replace(/^/, '{') + '}',
  );
  const TOPIC_NAMES = new Set(['assessmentTopics', 'philosophyTopics', 'structureTopics', 'careerTopics', 'parentTopics', 'teachingTopics']);
  for (const [file, consts] of Object.entries(fixture)) {
    if (!file.startsWith('data/')) continue;
    for (const [name, value] of Object.entries(consts)) {
      const route = DATA_ROUTE[name];
      if (!route || TOPIC_NAMES.has(name)) continue;
      const cls = classify(value, { schoolName, school: site.school, name });
      if (cls.dest !== 'CMS' && cls.dest !== 'MEDIA') continue;
      expected.push({ route, file, name, cls, value });
    }
  }

  const missing = [];
  const empty = [];
  const short = [];
  let ok = 0;
  let entries = 0;

  for (const e of expected) {
    const rec = byRoute.get(e.route);
    if (!rec) { missing.push(`${e.route} — NO RECORD (needed for ${e.name})`); continue; }

    /* ⚠ A blockMap IS SEVERAL SECTIONS, keyed `<const>.<sub>`. */
    if (e.cls.part === 'blockMap') {
      const got = (rec.sections ?? []).filter((s) => s.key.startsWith(`${e.name}.`));
      /* WARNING: EVERY PART COUNTS. Testing only points/details/facts reported a
         sub-block holding three counters as empty - a false alarm, and false
         alarms are how a check stops being read. */
      const PARTS = ['points', 'details', 'facts', 'figures', 'stats', 'photos', 'links', 'streams', 'awards', 'stories', 'results', 'faqs', 'body'];
      const filled = got.filter((s) =>
        ['eyebrow', 'heading', 'standfirst', 'note'].some((k) => s[k])
        || PARTS.some((k) => (s[k] ?? []).length));
      if (!got.length) missing.push(`${e.route} · ${e.name} — no sections (${e.file})`);
      else if (filled.length < got.length) short.push(`${e.route} · ${e.name} — ${filled.length} of ${got.length} sub-blocks have content`);
      else ok++;
      entries += got.length;
      continue;
    }

    const sec = (rec.sections ?? []).find((s) => s.key === e.name);
    if (!sec) { missing.push(`${e.route} · ${e.name} — no section (${e.file})`); continue; }

    const field = PART_FIELD[e.cls.part];
    if (field === null) {
      /* An editorial block: heading/standfirst/note, or the arrays inside it. */
      const filled = ['eyebrow', 'heading', 'standfirst', 'note'].some((k) => sec[k])
        || (sec.points ?? []).length > 0 || (sec.details ?? []).length > 0 || (sec.facts ?? []).length > 0;
      if (!filled) empty.push(`${e.route} · ${e.name} — block section is entirely empty`);
      else ok++;
      continue;
    }

    if (field === 'note') {
      if (!sec.note) empty.push(`${e.route} · ${e.name} — scalar section has no note`);
      else ok++;
      continue;
    }

    const got = (sec[field] ?? []).length;
    const want = e.cls.count ?? 0;
    entries += got;
    if (want > 0 && got === 0) empty.push(`${e.route} · ${e.name} — ${field} is empty (expected ${want})`);
    else if (got < want) short.push(`${e.route} · ${e.name} — ${field} has ${got} of ${want}`);
    else ok++;
  }

  /* Sections in the database that no const explains. */
  const expectedKeys = new Set(expected.map((e) => `${e.route}|${e.name}`));
  const orphan = [];
  for (const r of records) {
    for (const s of r.sections ?? []) {
      const base = s.key.includes('.') ? s.key.split('.')[0] : s.key;
      if (!expectedKeys.has(`${r.route}|${s.key}`) && !expectedKeys.has(`${r.route}|${base}`)) orphan.push(`${r.route} · ${s.key}`);
    }
  }

  const lines = [];
  lines.push('', `  ACADEMICS COVERAGE`, '');
  lines.push(`    records            ${records.length}`);
  lines.push(`    consts expected    ${expected.length}`);
  lines.push(`    fully populated    ${ok}`);
  lines.push(`    total entries      ${entries}`);
  lines.push(`    missing sections   ${missing.length}`);
  lines.push(`    empty sections     ${empty.length}`);
  lines.push(`    short sections     ${short.length}`);
  lines.push(`    unexplained        ${orphan.length}`);
  lines.push('');
  for (const [title, list] of [['MISSING', missing], ['EMPTY', empty], ['SHORT', short], ['UNEXPLAINED', orphan]]) {
    if (!list.length) continue;
    lines.push(`  ${title}`, '');
    for (const x of list.slice(0, 40)) lines.push(`    ${x}`);
    if (list.length > 40) lines.push(`    …and ${list.length - 40} more`);
    lines.push('');
  }
  const clean = !missing.length && !empty.length && !short.length;
  lines.push(clean ? '  ✔ every expected const is present and fully populated' : '  ✖ COVERAGE INCOMPLETE');
  lines.push('');
  console.log(lines.join('\n'));
});
