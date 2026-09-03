/**
 * REWRITE A STRUCTURE PAGE ONTO THE CMS, AND EMIT ITS FIXTURE FROM WHAT IT TOOK.
 *
 *     node scripts/extract/structure-page.mjs <PageName> [--write]
 *
 * ═══ WHY ONE PASS AND NOT TWO ══════════════════════════════════════════════
 *
 * These pages carry about a hundred and ten hand-written paragraphs. Read them
 * out into a fixture by hand and you get a curly apostrophe typed straight, an
 * em dash typed as a hyphen, a dropped <strong> — none of which a build fails on
 * and none of which a count of cards notices.
 *
 * So the fixture is not transcribed. It is MADE OUT OF THE EXACT TEXT REMOVED,
 * in the same pass that removes it.
 *
 * ═══ WHAT STOPS IT ═════════════════════════════════════════════════════════
 *
 * ⚠ A PARAGRAPH THAT IS NOT JUST PROSE. Pre-Primary has <p> elements holding an
 * inline SVG icon beside their sentence. Flattening those to text would take the
 * icon away, and nothing downstream would notice — so any paragraph containing a
 * tag other than strong/em/a/br is reported and left alone.
 *
 * ⚠ A CLASS NAME MATCHED TOO NARROWLY. Looking for exactly `class="sc-body"`
 * walked past `sc-body sc-deep__b`, `sc-note` and `sc-close__b` — a third of the
 * prose on one page. It now takes every static paragraph in the band.
 *
 * ⚠ AN ATTRIBUTE IT CANNOT REPRODUCE, a heading that is not a run of clipped
 * spans, a photograph paired with somebody else's alt, or a band with two runs
 * where only one field exists. Every one is a miss, and --write refuses while
 * any miss stands.
 *
 * ⚠ IT NEVER TOUCHES the style block, the section wrappers, the decorative
 * spans, or the data-reveal / data-mask / data-pop hooks and their delays.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const OUT = resolve(HERE, '../fixtures');

const PAGE = process.argv[2];
const WRITE = process.argv.includes('--write');
/* A band this codemod cannot fit is named here and left entirely alone, so the
   rest of the page can still be done by machine rather than by hand. */
const SKIP = new Set((process.argv.find((a) => a.startsWith('--skip=')) || '').split('=')[1]?.split(',') ?? []);
/**
 * A miss this run is EXPECTED to hit, named so it is recorded rather than
 * blocking. Use it only where leaving the markup alone IS the right answer — a
 * call-to-action button, or a paragraph carrying a decorative swash and a value
 * read from Site Settings — never to push past something that ought to move.
 */
const ALLOW = ((process.argv.find((a) => a.startsWith('--allow=')) || '').split('=')[1] ?? '')
  .split(',').filter(Boolean);

if (!PAGE) { console.error('usage: structure-page.mjs <PageName> [--write]'); process.exit(1); }

/** Which bands each page has, in page order, and what each is called in the CMS. */
const SECTIONS = {
  SecondaryPage: { prefix: 'sc', fixture: 'secondary-stage', query: 'getSecondaryStage', sections: ['open', 'board', 'deep', 'beyond', 'jrn', 'close'] },
  SeniorSecondaryPage: { prefix: 'ss', fixture: 'senior-secondary', query: 'getSeniorSecondary', sections: ['open', 'beyond', 'board', 'more', 'jrn', 'close'] },
  MiddleSchoolPage: { prefix: 'ms', fixture: 'middle-school', query: 'getMiddleSchool', sections: ['open', 'exp', 'doing', 'four', 'subj', 'lab', 'ach', 'jrn', 'close'] },
  PrimaryPage: { prefix: 'pr', fixture: 'primary-stage', query: 'getPrimaryStage', sections: ['open', 'rail', 'appr', 'act', 'val', 'space', 'jrn', 'close'] },
  PrePrimaryPage: { prefix: 'pp', fixture: 'pre-primary', query: 'getPrePrimary', sections: ['open', 'doing', 'land', 'play', 'abh', 'first', 'close'] },
  /**
   * ⚠ THESE TWO CARRY A PAGE-LEVEL LIST. Their four streams are drawn in every
   * band — as cards, as a comparison, as a directions list, as a subject map —
   * so the list sits at the top of the record rather than inside any one band,
   * exactly as the Curriculum stages do. `pageRun` names it, and the codemod
   * leaves its `{streams.map(` alone because the query hands it back under the
   * same name.
   */
  StreamsOfferedPage: {
    prefix: 'so', fixture: 'streams-offered', query: 'getStreamsOffered',
    pageRun: 'streams', sections: ['paths', 'x', 'dir', 'sure'],
  },
  SubjectCombinationsPage: {
    prefix: 'sc', fixture: 'subject-combinations', query: 'getSubjectCombinations',
    pageRun: 'worlds', sections: ['open', 'worlds', 'map', 'close'],
  },
};

/** What each field on the page's own list objects is called on structure.cell. */
const FIELD = {
  k: 'label', v: 'value', mark: 'mark', sub: 'sub', alt: 'alt',
  who: 'note', hired: 'flag', photo: 'image', cap: 'caption',
  /* the two stream pages */
  name: 'label', line: 'value', dir: 'note', body: 'value', state: 'state',
  core: 'core', optional: 'optional', additional: 'additional', coreOwed: 'owed',
};
/**
 * Fields that leave the CMS because the page derives them.
 * `tint` and `key` are only ever a CSS modifier suffix — `--${s.tint}` — and
 * both run pcm, pcb, com, hum in list order, so they are a palette the page
 * indexes rather than anything an editor should be asked to type.
 */
const DERIVED = new Set(['n', 'nx', 'ny', 'tint', 'key']);

const cfg = SECTIONS[PAGE];
if (!cfg) { console.error(`unknown page: ${PAGE}`); process.exit(1); }

const FILE = `${WEB}/components/academics/structure/${PAGE}.astro`;
let src = readFileSync(FILE, 'utf8');

const tok = (s) => s.split('Sunbeam School Ballia').join('{schoolName}');

/** Inline tags become the markers RichLine already understands. */
const inline = (t) => tok(t
  .replace(/<strong>([\s\S]*?)<\/strong>/g, (m, x) => `**${x}**`)
  .replace(/<em>([\s\S]*?)<\/em>/g, (m, x) => `*${x}*`)
  .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (m, href, x) => `[${x}](${href})`)
  .replace(/<br\s*\/?>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim());

/** Only these may appear inside a paragraph this codemod is willing to move. */
const PROSE_OK = /^(?:strong|em|a|br)\b/;
const onlyProse = (html) => [...html.matchAll(/<\/?([a-zA-Z][\w-]*)/g)].every((m) => PROSE_OK.test(m[1]));

const fixture = {};
const misses = [];
let swaps = 0;

const template = src.slice(src.indexOf('---', 3) + 3, src.indexOf('<style>'));

for (const name of cfg.sections) {
  if (SKIP.has(name)) { console.log(`    (skipping ${cfg.prefix}-${name})`); continue; }
  const open = template.indexOf(`<section class="${cfg.prefix}-${name}"`);
  if (open < 0) { misses.push(`section ${cfg.prefix}-${name} not found`); continue; }
  const next = cfg.sections
    .map((n) => template.indexOf(`<section class="${cfg.prefix}-${n}"`))
    .filter((i) => i > open)
    .sort((a, b) => a - b)[0] ?? template.length;

  const band = template.slice(open, next);
  const S = name;
  const F = { kicker: null, heading: null, body: [], caption: null, shots: [], runs: [] };
  const at = (label) => `${cfg.prefix}-${name}: ${label}`;
  let out = band;
  const edit = (from, to, all = false) => {
    if (!out.includes(from)) { misses.push(at(`no match: ${from.slice(0, 56).replace(/\s+/g, ' ')}`)); return; }
    out = all ? out.split(from).join(to) : out.replace(from, to);
    swaps += 1;
  };

  /**
   * ── paragraphs: every static one in the band, kicker or not ─────────────
   *
   * ⚠ A PARAGRAPH INSIDE A .map() IS NOT STATIC, whatever it starts with.
   * Pre-Primary has `<p class="pp-act__h"><span>{d.n}</span>…</p>` inside its
   * run — it opens with a tag, not an expression, so "does it start with {"
   * called it static and would have frozen one card's text onto all three.
   * The regions a run covers are worked out first and skipped whole.
   */
  const runRegions = [];
  for (const m of band.matchAll(/\{\w+\.map\(/g)) {
    let depth = 0;
    for (let i = m.index; i < band.length; i += 1) {
      if (band[i] === '{') depth += 1;
      else if (band[i] === '}') { depth -= 1; if (depth === 0) { runRegions.push([m.index, i]); break; } }
    }
  }
  const insideRun = (i) => runRegions.some(([a, b]) => i > a && i < b);

  const statics = [...band.matchAll(/<p class="([^"]+)"([^>]*)>([\s\S]*?)<\/p>/g)]
    .filter((m) => !insideRun(m.index) && !/^\s*\{/.test(m[3].trim()));

  const movable = [];
  for (const m of statics) {
    const rest = m[2].replace(/\s*data-reveal(-delay="\d+")?/g, '').trim();
    if (rest) { misses.push(at(`<p class="${m[1]}"> carries ${rest} — cannot reproduce`)); continue; }
    if (!onlyProse(m[3])) { misses.push(at(`<p class="${m[1]}"> holds markup, not just prose`)); continue; }
    movable.push(m);
  }

  const km = movable.find((m) => /kicker/.test(m[1]));
  if (km) { F.kicker = inline(km[3]); edit(km[0], `<p class="${km[1]}"${km[2]}>{${S}.kicker}</p>`); }

  movable.filter((m) => !/kicker/.test(m[1])).forEach((m, i) => {
    F.body.push(inline(m[3]));
    const delay = (m[2].match(/data-reveal-delay="(\d+)"/) || [])[1];
    edit(m[0], `<RichLine class="${m[1]}" text={${S}.body[${i}]}`
      + `${/data-reveal\b/.test(m[2]) ? ' reveal' : ''}${delay ? ` revealDelay={${delay}}` : ''} />`);
  });

  /* ── heading: the clipped spans become one ClipHeading ─────────────────── */
  const hm = band.match(/<h2([^>]*)>([\s\S]*?)<\/h2>/);
  if (hm) {
    const spans = [...hm[2].matchAll(/<span data-clip data-clip-delay="(\d+)"[^>]*>([\s\S]*?)<\/span>/g)];
    if (!spans.length) misses.push(at('h2 is not a run of clipped spans'));
    else {
      const delays = spans.map((m) => Number(m[1]));
      F.heading = spans.map((m) => tok(m[2]
        .replace(/<em>([\s\S]*?)<\/em>/g, (x, v) => `{{${v.trim()}}}`)
        .replace(/\s+/g, ' ').trim())).join('\n');
      /* An even 150 stagger is ClipHeading's default; 0/150/290 passes its own. */
      const even = delays.every((d, i) => d === i * 150);
      edit(hm[0], `<ClipHeading ${hm[1].trim()} text={${S}.heading}`
        + `${even ? '' : ` delays={[${delays.join(', ')}]}`} />`);
    }
  }

  /* ── the caption printed under a photograph ────────────────────────────── */
  const cm = band.match(/(<figcaption class="[^"]+"[^>]*>)([\s\S]*?)(<\/figcaption>)/);
  if (cm && !/^\s*\{/.test(cm[2].trim())) {
    if (!onlyProse(cm[2])) misses.push(at('figcaption holds markup, not just prose'));
    else { F.caption = inline(cm[2]); edit(cm[0], `${cm[1]}{${S}.caption}${cm[3]}`); }
  }

  /* ── photographs, in the order the page places them ────────────────────── */
  [...band.matchAll(/file=\{(p[A-Z]\w*)\}\s*alt=\{ac\.picAlt\('(p[A-Z]\w*)'\)\}/g)].forEach((m, i) => {
    if (m[1] !== m[2]) misses.push(at(`${m[1]} paired with the alt of ${m[2]}`));
    F.shots.push({ key: m[1] });
    edit(m[0], `file={${S}.shots[${i}]?.image} alt={${S}.shots[${i}]?.alt ?? ''}`);
  });

  /* ── the runs of cells ─────────────────────────────────────────────────── */
  const found = [...new Set([...band.matchAll(/\{(\w+)\.map\(/g)].map((m) => m[1]))];
  /* The page-level list keeps its own name; only band runs become cells. */
  const runs = found.filter((r) => r !== cfg.pageRun);
  const all = cfg.pageRun && found.includes(cfg.pageRun) ? [cfg.pageRun, ...runs] : runs;
  if (runs.length > 2) misses.push(at(`${runs.length} runs (${runs.join(', ')}) — only two fields exist`));
  all.slice(0, 3).forEach((list) => {
    const isPage = list === cfg.pageRun;
    const field = isPage ? null : (runs.indexOf(list) === 0 ? 'cells' : 'cellsTwo');
    if (field) F.runs.push({ field, list });

    /**
     * Every callback over this list, so a list mapped twice is fully rewritten.
     *
     * ⚠ THE PAIRS ARE DEDUPED ACROSS CALLBACKS TOO. `so-dir` maps `streams`
     * twice under the same variable name, so the second pass found `s.name`
     * already rewritten and reported a miss that was an artefact of this loop
     * rather than anything wrong with the page.
     */
    const seen = new Set();
    for (const cb of band.matchAll(new RegExp(`\\{${list}\\.map\\(\\(?(\\w+)(?:,\\s*(\\w+))?\\)?\\s*=>`, 'g'))) {
      const [, v, ix] = cb;
      /* ⚠ UNIQUE FIELD NAMES. A field used three times yielded three matches,
         and the second and third then found nothing left to replace because the
         first had already rewritten all of them — a miss that was an artefact of
         this loop rather than anything wrong with the page. */
      const used = [...new Set([...band.matchAll(new RegExp(`\\b${v}\\.(\\w+)\\b`, 'g'))].map((u) => u[1]))];
      for (const f of used) {
        if (seen.has(`${v}.${f}`)) continue;
        seen.add(`${v}.${f}`);
        if (DERIVED.has(f)) {
          if (f !== 'n') { misses.push(at(`${list}.${f} is a position — the page must own it`)); continue; }
          if (!ix) { misses.push(at(`${list} numbers its items but the callback has no index`)); continue; }
          edit(`{${v}.n}`, `{String(${ix} + 1).padStart(2, '0')}`, true);
        } else if (!FIELD[f]) {
          misses.push(at(`${list}.${f} has nowhere to go on a cell`));
        } else if (FIELD[f] !== f) {
          edit(`${v}.${f}`, `${v}.${FIELD[f]}`, true);
        }
      }
    }
    if (field) edit(`{${list}.map(`, `{${S}.${field}.map(`, true);
  });

  fixture[S] = F;
  if (out !== band) src = src.replace(band, out);
}

/* ── the frontmatter: one query call in place of the topic reads ──────────── */
{
  const q = cfg.query;
  const fields = cfg.sections.join(', ');

  /* Every `const pX = ac.pic('pX')` and `const list = ac.section(...)` goes:
     the photographs live in their band's `shots` now, and the runs in `cells`. */
  const dead = [...src.matchAll(/^const \w+ = ac\.(?:pic|section)\([^\n]*\n/gm)].map((m) => m[0]);
  for (const d of dead) { src = src.replace(d, ''); swaps += 1; }

  const topic = src.match(/^const ac = await getAcademicTopic\([^\n]*\n/m);
  if (!topic) misses.push('frontmatter: no getAcademicTopic call to replace');
  else { src = src.replace(topic[0], `const { ${fields} } = await ${q}();\n`); swaps += 1; }

  const imp = src.match(/^import \{ getAcademicTopic \} from '([^']+)';$/m);
  if (!imp) misses.push('frontmatter: no getAcademicTopic import to replace');
  else {
    src = src.replace(imp[0],
      `import ClipHeading from '../../ui/ClipHeading.astro';\n`
      + `import RichLine from '../../ui/RichLine.astro';\n`
      + `import { ${q} } from '${imp[1]}';`);
    swaps += 1;
  }

  /* `S` was the school's name spelled out for alt text the CMS now carries. */
  const sDecl = src.match(/^const S = 'Sunbeam School Ballia';\n/m);
  if (sDecl && !/\bS\b(?!')/.test(src.slice(src.indexOf('---', 3)))) {
    src = src.replace(sDecl[0], ''); swaps += 1;
  }
}

console.log(`\n  ${PAGE}  —  ${swaps} swaps, ${misses.length} miss(es)`);
for (const m of misses) console.log(`    ⚠ ${m}`);
console.log('');
for (const [k, v] of Object.entries(fixture)) {
  console.log(`    ${k.padEnd(7)} kick:${v.kicker ? 'y' : '-'} head:${v.heading ? v.heading.split('\n').length : 0}`
    + ` body:${String(v.body.length).padEnd(2)} cap:${v.caption ? 'y' : '-'}`
    + ` shots:${(v.shots.map((s) => s.key).join(',') || '-').padEnd(34)}`
    + ` runs:${v.runs.map((r) => r.list).join('+') || '-'}`);
}

const allowed = misses.filter((m) => ALLOW.some((a) => m.includes(a)));
const blocking = misses.filter((m) => !allowed.includes(m));
if (allowed.length) {
  console.log('  left in the page on purpose:');
  for (const a of allowed) console.log(`    · ${a}`);
}

if (WRITE) {
  if (blocking.length) { console.error('\n  refusing to write while a miss stands\n'); process.exit(1); }
  writeFileSync(FILE, src);
  writeFileSync(`${OUT}/${cfg.fixture}.raw.json`, JSON.stringify(fixture, null, 2) + '\n');
  console.log(`\n  written: ${PAGE}.astro  and  fixtures/${cfg.fixture}.raw.json\n`);
} else {
  console.log('\n  dry run — pass --write to apply\n');
}
