/**
 * CODEMOD — point the academics pages at the CMS.
 *
 *     node scripts/codemod-academics.mjs --dry
 *     node scripts/codemod-academics.mjs
 *
 * ═══ WHAT IT CHANGES, AND WHAT IT MUST NOT ═════════════════════════════════
 *
 * For every const the seed migrated, it replaces THE INITIALISER and nothing
 * else:
 *
 *     -  const steps = [ { n: '01', … }, … forty lines … ];
 *     +  const steps = ac.section('steps').points;
 *
 * The const keeps its name, so every line of markup below it — the layout, the
 * GSAP hooks, the scoped CSS, the responsive rules — is untouched. That is the
 * only reason forty bespoke pages can be migrated at once.
 *
 * ⚠ THE LIST COMES FROM fixtures/academics-swap.json, WHICH THE SEED WROTE. The
 * codemod does not re-derive which consts were migrated; it acts on exactly what
 * was seeded, so the two cannot disagree.
 *
 * ⚠ BRACKET MATCHING, NOT A REGEX FOR THE VALUE. These initialisers are
 * multi-line arrays of objects containing strings that contain brackets. A
 * lazy `[\s\S]*?\];` stops at the first `];` inside a template literal and
 * leaves a syntax error, or worse, a half-replaced array.
 *
 * ⚠ THE FETCH GOES AFTER THE LAST IMPORT, INSIDE THE FRONTMATTER. Inserting at
 * position 0 puts it above the opening `---`, which Astro reads as template
 * output — that broke 21 components in G4 and is why the insertion point is
 * found rather than assumed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../web/src');
const SWAP = resolve(HERE, 'fixtures/academics-swap.json');
const DRY = process.argv.includes('--dry');

/** Which accessor a seeded part is read back through. */
const ACCESSOR = {
  points: 'points', details: 'details', facts: 'facts', stats: 'stats',
  photos: 'photos', photoMap: 'photos', streams: 'streams',
  awards: 'awards', stories: 'stories', results: 'results',
  labelledStrings: 'details', scalar: 'note', faqs: 'faqs',
};

/**
 * The end of `const NAME = <value>;`, found by balancing brackets and skipping
 * strings, template literals and comments.
 */
function endOfInitialiser(src, from) {
  let i = from;
  let depth = 0;
  let quote = null;

  for (; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];

    if (quote) {
      if (c === quote && prev !== '\\') quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i === -1) return -1; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; if (i === 0) return -1; continue; }

    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ';' && depth === 0) return i + 1;
    else if (c === '\n' && depth === 0) {
      /* A value with no semicolon — accept the line end once brackets balance. */
      const rest = src.slice(from, i).trim();
      if (rest && !rest.endsWith(',') && !rest.endsWith('=')) return i;
    }
  }
  return -1;
}

const swap = JSON.parse(readFileSync(SWAP, 'utf8'));
const report = [];
const skipped = [];
let changed = 0;
let replaced = 0;

for (const [rel, { route, consts }] of Object.entries(swap)) {
  if (rel.startsWith('data/')) continue;           // data files stay as the seed's source
  const file = join(WEB_SRC, rel);
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { skipped.push(`${rel} — not found`); continue; }

  const fenceEnd = src.indexOf('\n---', 3);
  if (!src.startsWith('---') || fenceEnd === -1) { skipped.push(`${rel} — no frontmatter`); continue; }

  const done = [];
  for (const [name, part] of Object.entries(consts)) {
    const accessor = ACCESSOR[part];
    if (!accessor) { skipped.push(`${rel} · ${name} — no accessor for "${part}"`); continue; }

    /* ⚠ ONLY INSIDE THE FRONTMATTER, and only a real declaration. */
    const decl = new RegExp(`(^|\\n)(const ${name}\\s*(?::[^=]*)?=\\s*)`, 'g');
    decl.lastIndex = 0;
    const m = decl.exec(src.slice(0, fenceEnd));
    if (!m) { skipped.push(`${rel} · ${name} — declaration not found`); continue; }

    const valueStart = m.index + m[0].length;
    const end = endOfInitialiser(src, valueStart);
    if (end === -1) { skipped.push(`${rel} · ${name} — could not find the end of the value`); continue; }

    const call = part === 'blockMap'
      ? `ac.section('${name}')`
      : `ac.section('${name}').${accessor};`;
    src = `${src.slice(0, m.index)}${m[1]}const ${name} = ${call}${src.slice(end)}`;
    done.push(`${name}→${accessor}`);
    replaced++;
  }

  if (!done.length) continue;

  /* the fetch, once, after the last import in the frontmatter */
  if (!src.includes('getAcademicTopic(')) {
    const lines = src.split('\n');
    let last = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') break;
      if (/^import /.test(lines[i])) last = i;
    }
    /* ⚠ COMPUTED, NOT COUNTED. Counting path segments put the import one level
       too high and vite could not resolve it. */
    const rel2 = relative(dirname(join(WEB_SRC, rel)), join(WEB_SRC, 'lib', 'cms')).split(sep).join('/') + '/';
    lines.splice(last + 1, 0,
      `import { getAcademicTopic } from '${rel2}lib/cms';`,
      '',
      `const ac = await getAcademicTopic('${route}');`,
    );
    src = lines.join('\n');
  }

  report.push(`  ${rel.padEnd(60)} ${done.join(' ')}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} files · ${replaced} consts\n`);
console.log(report.sort().join('\n'));
if (skipped.length) {
  console.log(`\n  SKIPPED — ${skipped.length}\n`);
  for (const s of skipped) console.log(`    ${s}`);
}
console.log('');
