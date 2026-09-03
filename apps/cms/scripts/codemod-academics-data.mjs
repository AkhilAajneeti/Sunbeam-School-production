/**
 * CODEMOD — the components that still import the academics data files.
 *
 *     node scripts/codemod-academics-data.mjs --dry
 *
 * ⚠ THE LAST PLACE A DUPLICATE SOURCE HID. The first codemod swapped consts
 * declared inside components. These consts live in apps/web/src/data/*.ts and
 * are IMPORTED, so the content reached Strapi and the pages went on reading the
 * files — the site rendered identically and was not CMS-driven. Exactly the
 * "no old data source remains in use" check.
 *
 * ⚠ `parents` AND `teachingLearning` GO THROUGH `blockMap`, which rebuilds their
 * original nesting from the section keys, so `parents.forum.steps` still
 * resolves and not one line of markup moves.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../web/src');
const SWAP = resolve(HERE, 'fixtures/academics-swap.json');
const DRY = process.argv.includes('--dry');
const SEP = String.fromCharCode(92);

const swap = JSON.parse(readFileSync(SWAP, 'utf8'));

/** const name → { route, accessor } for everything seeded from a data file. */
const FROM_DATA = {};
for (const [file, { route, consts }] of Object.entries(swap)) {
  if (!file.startsWith('data/')) continue;
  for (const [name, part] of Object.entries(consts)) FROM_DATA[name] = { route, part };
}

const ACCESSOR = {
  points: 'points', details: 'details', facts: 'facts', stats: 'stats',
  photos: 'photos', photoMap: 'photos', streams: 'streams', awards: 'awards',
  stories: 'stories', results: 'results', faqs: 'faqs',
  labelledStrings: 'details', scalar: 'note',
};

const report = [];
const skipped = [];
let changed = 0;

const files = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f);
    else if (f.endsWith('.astro')) files.add(f);
  }
})(join(WEB_SRC, 'components', 'academics'));
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f);
    else if (f.endsWith('.astro')) files.add(f);
  }
})(join(WEB_SRC, 'pages', 'academics'));

for (const file of [...files].sort()) {
  let src = readFileSync(file, 'utf8');
  const rel = relative(WEB_SRC, file).split(SEP).join('/');
  const before = src;
  const done = [];
  let route = null;

  const IMPORT = /import \{([^}]*)\} from '[^']*data\/(academics|academicTopics|teachingTopics|studentSuccess|parentsForum)';\n/g;
  const decls = [];

  src = src.replace(IMPORT, (m, names) => {
    const kept = [];
    for (const raw of names.split(',').map((x) => x.trim()).filter(Boolean)) {
      const [name, alias] = raw.split(/\s+as\s+/).map((x) => x.trim());
      const info = FROM_DATA[name];
      if (!info) { kept.push(raw); continue; }
      route ??= info.route;
      const local = alias ?? name;
      if (info.part === 'blockMap') decls.push(`const ${local} = ac.blockMap('${name}');`);
      else if (info.part === 'block') decls.push(`const ${local} = ac.section('${name}');`);
      else decls.push(`const ${local} = ac.section('${name}').${ACCESSOR[info.part] ?? 'points'};`);
      done.push(name);
    }
    return kept.length ? `import { ${kept.join(', ')} } from '../../data/academics';\n` : '';
  });

  if (!done.length) continue;
  if (!route) { skipped.push(`${rel} — no route`); continue; }

  const lines = src.split('\n');
  let last = 0;
  for (let i = 1; i < lines.length; i++) { if (lines[i] === '---') break; if (/^import /.test(lines[i])) last = i; }

  const pre = [];
  if (!src.includes('getAcademicTopic(')) {
    const up = relative(dirname(file), join(WEB_SRC, 'lib', 'cms')).split(SEP).join('/');
    pre.push(`import { getAcademicTopic } from '${up.startsWith('.') ? up : `./${up}`}';`, '',
      `const ac = await getAcademicTopic('${route}');`);
  }
  lines.splice(last + 1, 0, ...pre, ...decls);
  src = lines.join('\n');

  if (src === before) continue;
  report.push(`  ${rel.padEnd(58)} ${done.join(' ')}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} files\n`);
console.log(report.sort().join('\n'));
if (skipped.length) { console.log('\n  SKIPPED\n'); for (const x of skipped) console.log(`    ${x}`); }
console.log('');
