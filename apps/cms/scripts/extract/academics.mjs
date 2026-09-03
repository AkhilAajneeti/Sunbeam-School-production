/**
 * EXTRACT — every academics page's content, mechanically.
 *
 *     npm run extract:academics
 *
 * ═══ WHY THIS IS MECHANICAL AND NOT TYPED OUT ══════════════════════════════
 *
 * Academics is 46 routes rendered by ~40 bespoke page components, and almost all
 * of their content is declared as consts in those components' own frontmatter —
 * several hundred arrays and objects of school prose, plus a few hundred
 * photographs. Transcribing that by hand would put a typing error between the
 * repository and the CMS on a body of text nobody would proof-read twice.
 *
 * So every const is evaluated out of the source and written to
 * `scripts/fixtures/academics.json`, which is the reviewable artefact: it is the
 * complete list of what exists, and anything that does not appear in it is
 * content the migration cannot see.
 *
 * ⚠ A SECOND FILE, `academics-shapes.md`, REPORTS THE STRUCTURE of every const —
 * its type, its keys, its length. That is what the schema is designed from. A
 * schema designed from a sample of forty components is a schema that silently
 * drops the rest, which is exactly how the first G6 attempt went wrong.
 *
 * ⚠ CONST NAMES ARE DISCOVERED, NOT LISTED. Asking for a fixed set of names
 * would miss anything added since, and miss it silently — the failure this file
 * exists to prevent.
 *
 * ⚠ WHAT IS SKIPPED, AND WHY IT IS SAFE:
 *   · anything initialised from `await` — there is no CMS at extraction time
 *   · functions and components — behaviour, not content
 *   · consts whose value is undefined after evaluation — reported, not dropped
 *     silently, so a failed extraction is visible rather than an empty section
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadAstroFrontmatter } from '../lib/load-astro-frontmatter.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const WEB = resolve(REPO, 'apps/web/src');
const OUT = resolve(HERE, '../fixtures/academics.json');
const SHAPES = resolve(HERE, '../fixtures/academics-shapes.md');

/* ── which files hold academics content ──────────────────────────────────── */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

const FILES = [
  ...walk(join(WEB, 'pages', 'academics')),
  ...walk(join(WEB, 'components', 'academics')),
].sort();

/** Everything between the opening and closing `---`. */
function frontmatter(src) {
  const first = src.indexOf('---');
  const second = src.indexOf('\n---', first + 3);
  return first === 0 && second > 0 ? src.slice(3, second) : '';
}

/**
 * ⚠ A CONST IS A CANDIDATE ONLY IF IT LOOKS LIKE DATA.
 * `const { per, id } = Astro.props` is a destructure, `const Heading = …` is a
 * component and `const has = (x) => …` is a predicate. None of them are content,
 * and evaluating them either fails or produces something meaningless.
 */
function contentConsts(fm) {
  const names = [];
  for (const m of fm.matchAll(/(?:^|\n)const (\w+)\s*(?::[^=]+)?=\s*([\s\S]{0,40})/g)) {
    const [, name, head] = m;
    if (/^await\b/.test(head.trim())) continue;
    if (/^\(?\s*[\w{,\s}]*\)?\s*=>/.test(head.trim())) continue;
    if (/^Astro\./.test(head.trim())) continue;
    names.push(name);
  }
  return [...new Set(names)];
}

/* ── globals the frontmatter expects ─────────────────────────────────────── */
const site = await loadWebData(resolve(WEB, 'data/site.ts'));
const { school } = site;

/**
 * ⚠ `Astro` IS STUBBED WITH AN EMPTY props BAG. Page components read
 * `Astro.props`; at extraction time there are none, and a const derived from
 * one is a rendering decision rather than content — it comes back undefined and
 * is reported as unresolved rather than written as null.
 */
const ASTRO_STUB = { props: {}, url: 'http://localhost/', site: null };

const fixture = {};
const unresolved = [];
const failed = [];

for (const file of FILES) {
  const rel = relative(WEB, file).replace(/\\/g, '/');
  const fm = frontmatter(readFileSync(file, 'utf8'));
  const names = contentConsts(fm);
  if (names.length === 0) continue;

  let mod;
  try {
    mod = await loadAstroFrontmatter(file, names, { school, sb: school, Astro: ASTRO_STUB });
  } catch (err) {
    failed.push({ file: rel, error: String(err.message).split('\n')[0].slice(0, 160) });
    continue;
  }

  const got = {};
  for (const n of names) {
    const v = mod[n];
    if (v === undefined) { unresolved.push(`${rel} · ${n}`); continue; }
    if (typeof v === 'function') continue;
    got[n] = v;
  }
  if (Object.keys(got).length) fixture[rel] = got;
}

/* ── data files, which the components import from ────────────────────────── */
for (const name of ['academics', 'academicTopics', 'teachingTopics', 'studentSuccess', 'parentsForum']) {
  const mod = await loadWebData(resolve(WEB, `data/${name}.ts`));
  const got = {};
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function' || v === undefined) continue;
    got[k] = v;
  }
  fixture[`data/${name}.ts`] = got;
}

/* ── strip image objects down to what a seed needs ───────────────────────── */
function clean(v) {
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === 'object') {
    if (typeof v.absolutePath === 'string') return { __image: v.absolutePath };
    const out = {};
    for (const [k, x] of Object.entries(v)) out[k] = clean(x);
    return out;
  }
  return v;
}
for (const f of Object.keys(fixture)) fixture[f] = clean(fixture[f]);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');

/* ── the shape report — what the schema gets designed from ───────────────── */
function shapeOf(v, depth = 0) {
  if (v === null) return 'null';
  if (Array.isArray(v)) {
    if (v.length === 0) return 'empty[]';
    const inner = depth < 2 ? shapeOf(v[0], depth + 1) : '…';
    return `${inner}[${v.length}]`;
  }
  if (typeof v === 'object') {
    if (typeof v.__image === 'string') return 'image';
    const keys = Object.keys(v);
    if (depth >= 2) return `{${keys.length} keys}`;
    return `{${keys.join(', ')}}`;
  }
  if (typeof v === 'string') return `string(${v.length})`;
  return typeof v;
}

const lines = ['# Academics — extracted shapes', ''];
lines.push(`Extracted ${Object.keys(fixture).length} files.`, '');
for (const [file, consts] of Object.entries(fixture)) {
  lines.push(`## ${file}`, '');
  for (const [name, value] of Object.entries(consts)) {
    lines.push(`- \`${name}\` — ${shapeOf(value)}`);
  }
  lines.push('');
}
if (unresolved.length) {
  lines.push('## ⚠ Unresolved consts', '',
    'Present in the source and `undefined` after evaluation — usually derived',
    'from `Astro.props`. Each needs a decision: derived value, or content.', '');
  for (const u of unresolved) lines.push(`- ${u}`);
  lines.push('');
}
if (failed.length) {
  lines.push('## ⚠⚠ Files that could not be evaluated', '');
  for (const f of failed) lines.push(`- \`${f.file}\` — ${f.error}`);
  lines.push('');
}
await writeFile(SHAPES, `${lines.join('\n')}\n`, 'utf8');

const constCount = Object.values(fixture).reduce((n, c) => n + Object.keys(c).length, 0);
console.log(`
  Extracted ${constCount} consts from ${Object.keys(fixture).length} files
    unresolved  ${unresolved.length}
    failed      ${failed.length}

  → ${relative(REPO, OUT).replace(/\\/g, '/')}
  → ${relative(REPO, SHAPES).replace(/\\/g, '/')}
`);
