/**
 * CODEMOD — point the nine news routes at the CMS.
 *
 *     node scripts/codemod-news-routes.mjs --dry
 *     node scripts/codemod-news-routes.mjs
 *
 * Each index and detail route imported one ChroniclePage export from
 * data/newsPages.ts (or newsEvents.ts for achievements) and used it directly.
 * queries/news.ts rebuilds the identical shape, so the whole change per file is:
 * swap the import, and await the page once.
 *
 * ⚠ DETAIL ROUTES IMPORT TWICE. getStaticPaths runs in its own scope and cannot
 * see frontmatter consts, so each `[slug].astro` also did a dynamic
 * `await import(...)` inside it. Both call sites are rewritten.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../web');
const NEWS = join(WEB, 'src/pages/news-events');
const CMS_DIR = join(WEB, 'src/lib/cms');
const DRY = process.argv.includes('--dry');

/** ChroniclePage export name → its chronicle slug. */
const SLUG = {
  workshops: 'workshops',
  competitions: 'competitions',
  celebrations: 'celebrations',
  schoolEvents: 'school-events',
  achievementsPage: 'achievements',
};

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (e.name.endsWith('.astro')) out.push(f);
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

for (const file of walk(NEWS)) {
  let src = readFileSync(file, 'utf8');
  const before = src;

  const m = src.match(
    /import \{\s*(\w+)(\s*,\s*type ChronicleItem)?\s*\} from '([^']*data\/news(?:Pages|Events))'/,
  );
  if (!m) continue;

  const [full, name, typePart] = m;
  const slug = SLUG[name];
  if (!slug) continue;

  const spec = specifierTo(file);
  src = src.replace(
    full,
    `import { getChroniclePage${typePart ? ', type ChronicleItem' : ''} } from '${spec}';`,
  );

  /* Declare the page once, after the last import in the frontmatter. */
  const lines = src.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) last = i;
    if (i > 0 && lines[i].trim() === '---') break;
  }
  lines.splice(last + 1, 0, '', `const ${name} = await getChroniclePage('${slug}');`);
  src = lines.join('\n');

  /* The second call site, inside getStaticPaths. */
  src = src.replace(
    new RegExp(`const \\{ ${name}: (\\w+) \\} = await import\\('[^']*data/news(?:Pages|Events)'\\);`),
    (_all, alias) => `const ${alias} = await getChroniclePage('${slug}');`,
  );

  if (src === before) continue;
  report.push(`  ${relative(WEB, file).split(sep).join('/').padEnd(46)} -> ${slug}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} route files\n`);
console.log(report.join('\n'));
console.log('');
