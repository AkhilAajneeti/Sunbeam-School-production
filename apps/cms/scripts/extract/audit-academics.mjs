/**
 * AUDIT — what every academics route actually renders, and from where.
 *
 *     node scripts/extract/audit-academics.mjs
 *
 * ⚠ RUN THIS BEFORE DESIGNING ANYTHING. Academics is 46 routes across seven
 * sections, and its content is spread over five data files, a dozen page
 * components and the frontmatter of the routes themselves. A schema designed
 * from a sample of that is a schema that silently drops the rest — which is
 * exactly how the first G6 attempt went wrong.
 *
 * The output is a map: route → the component that renders it → every data
 * import it pulls → every const its own frontmatter declares. Anything that
 * appears in the last two columns and nowhere in the migration plan is content
 * about to be lost.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const PAGES = join(WEB, 'pages', 'academics');

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

/** Everything between the opening and closing `---`. */
function frontmatter(src) {
  const first = src.indexOf('---');
  const second = src.indexOf('\n---', first + 3);
  return first === 0 && second > 0 ? src.slice(3, second) : '';
}

const rows = [];
const componentsSeen = new Map();

for (const file of walk(PAGES).sort()) {
  const src = readFileSync(file, 'utf8');
  const fm = frontmatter(src);

  const route = `/${relative(join(WEB, 'pages'), file).replace(/\\/g, '/').replace(/\.astro$/, '').replace(/\/index$/, '')}/`
    .replace('//', '/');

  const dataImports = [...fm.matchAll(/import \{([^}]*)\} from '[^']*data\/([a-zA-Z]+)'/g)]
    .flatMap((m) => m[1].split(',').map((s) => `${m[2]}.${s.trim()}`).filter((s) => !s.endsWith('.')));

  const componentImports = [...fm.matchAll(/import (\w+) from '[^']*components\/([^']+)\.astro'/g)]
    .map((m) => m[2]);

  const consts = [...fm.matchAll(/(?:^|\n)const (\w+)\s*[:=]/g)].map((m) => m[1]);
  const assetImports = [...fm.matchAll(/(?:^|\n)import (\w+) from '[^']*assets\/[^']*'/g)].map((m) => m[1]);

  for (const c of componentImports) componentsSeen.set(c, (componentsSeen.get(c) ?? 0) + 1);

  rows.push({ route, file, dataImports, componentImports, consts, assetImports });
}

console.log(`\n  ${rows.length} academics routes\n`);
console.log('  ROUTE                                                  CONSTS  ASSETS  DATA IMPORTS');
for (const r of rows) {
  const page = r.componentImports.filter((c) => !/^ui\/|^layouts/.test(c)).slice(-1)[0] ?? '';
  console.log(
    `  ${r.route.padEnd(54)}${String(r.consts.length).padStart(6)}${String(r.assetImports.length).padStart(8)}  ${r.dataImports.join(' ') || '—'}`,
  );
  if (r.consts.length) console.log(`      consts: ${r.consts.join(' ')}`);
  if (page) console.log(`      renders: ${page}`);
}

/* Which page components carry content of their own. */
console.log('\n  PAGE COMPONENTS AND THEIR OWN CONTENT\n');
const compDir = join(WEB, 'components', 'academics');
const comps = existsSync(compDir) ? walk(compDir).sort() : [];
for (const file of comps) {
  const fm = frontmatter(readFileSync(file, 'utf8'));
  const consts = [...fm.matchAll(/(?:^|\n)const (\w+)\s*[:=]/g)].map((m) => m[1]);
  const dataImports = [...fm.matchAll(/import \{([^}]*)\} from '[^']*data\/([a-zA-Z]+)'/g)]
    .flatMap((m) => m[1].split(',').map((s) => `${m[2]}.${s.trim()}`).filter((s) => !s.endsWith('.')));
  const assets = [...fm.matchAll(/(?:^|\n)import (\w+) from '[^']*assets\/[^']*'/g)].map((m) => m[1]);
  if (!consts.length && !dataImports.length && !assets.length) continue;
  console.log(`  ${relative(compDir, file).replace(/\\/g, '/')}`);
  if (dataImports.length) console.log(`      data:   ${dataImports.join(' ')}`);
  if (consts.length) console.log(`      consts: ${consts.join(' ')}`);
  if (assets.length) console.log(`      assets: ${assets.join(' ')}`);
}
console.log('');
