/**
 * CODEMOD — point the campus / facilities / transport consumers at the CMS.
 *
 *     node scripts/codemod-campus.mjs --dry
 *     node scripts/codemod-campus.mjs
 *
 * Each of the four data modules maps to one query that returns the same named
 * exports, so a file importing `{ groups, allItems }` becomes a destructure of
 * `await getFacilitiesData()` and nothing inside it changes.
 *
 * ⚠ ALIASES ARE PRESERVED. Two files import `facilities as shot`, which is a
 * deliberate narrowing — `shot` elsewhere means "facilities that have
 * photographs". Rewriting it to plain `facilities` would silently widen what
 * those pages render to include the un-photographed ones.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../web');
const SRC = join(WEB, 'src');
const CMS_DIR = join(SRC, 'lib', 'cms');
const DRY = process.argv.includes('--dry');

/** data module → the query that replaces it. */
const QUERY = {
  transport: 'getTransportData',
  facilities: 'getFacilitiesData',
  campusTour: 'getCampusTourData',
  campus: 'getCampusSafetyData',
};

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'lib') walk(f, out); }
    else if (/\.astro$/.test(e.name)) out.push(f);
  }
  return out;
}

function specifierTo(file) {
  let rel = relative(dirname(file), CMS_DIR).split(sep).join('/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

let changed = 0;
const report = [];

for (const file of walk(SRC)) {
  let src = readFileSync(file, 'utf8');
  const before = src;
  const used = new Set();

  for (const [mod, fn] of Object.entries(QUERY)) {
    const re = new RegExp(
      `import \\{([^}]*)\\} from ['"][^'"]*data/${mod}['"];?`,
    );
    const m = src.match(re);
    if (!m) continue;

    const names = m[1].trim();
    src = src.replace(re, `__CMS_${mod}__{${names}}`);
    used.add(fn);
  }

  if (used.size === 0) continue;

  /* Replace the placeholders with a single import plus one await per module. */
  const spec = specifierTo(file);
  const awaits = [];
  for (const [mod, fn] of Object.entries(QUERY)) {
    const ph = new RegExp(`__CMS_${mod}__\\{([^}]*)\\}`);
    const m = src.match(ph);
    if (!m) continue;
    src = src.replace(ph, '');
    awaits.push(`const {${m[1]}} = await ${fn}();`);
  }

  src = `import { ${[...used].join(', ')} } from '${spec}';\n${src}`;

  /* Put the awaits after the last import in the frontmatter. */
  const lines = src.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) last = i;
    if (i > 0 && lines[i].trim() === '---') break;
  }
  lines.splice(last + 1, 0, '', ...awaits);
  src = lines.join('\n').replace(/\n{4,}/g, '\n\n\n');

  report.push(`  ${relative(SRC, file).split(sep).join('/').padEnd(52)} ${[...used].join(' ')}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} files\n`);
console.log(report.sort().join('\n'));
console.log('');
