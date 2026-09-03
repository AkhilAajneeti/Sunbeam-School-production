/**
 * EVERY LOCAL IMAGE IMPORT LEFT IN THE ASTRO SOURCE, AND WHETHER IT STILL RENDERS.
 *
 * Audit item 6 — "no local media remains where Strapi is supposed to own it" —
 * cannot be answered by counting imports. Three different things look identical
 * at the top of a component:
 *
 *   · a photograph still hardcoded            → a genuine gap
 *   · an import left behind by a codemod      → dead code, renders nothing
 *   · an icon, texture, mark or placeholder   → design, and staying
 *
 * So this separates them by whether the binding is still referenced below the
 * frontmatter, and by which asset directory it comes from.
 *
 * ⚠ THE DEAD ONES ARE NOT HARMLESS. An unused import of a real photograph reads
 * to the next person as content that is still hardcoded, and it is the reason a
 * count of imports overstated this gap.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const SEP = String.fromCharCode(92);
const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '../../../web/src');

/** Directories whose contents are design, not editorial photography. */
const DESIGN_DIRS = new Set(['icons', 'brand', 'logos', 'textures', 'patterns', 'marks']);

const scope = process.argv[2] ?? '';

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
};
walk(join(WEB, 'components'));
walk(join(WEB, 'pages'));

const IMPORT = new RegExp(
  "^import[ ]+([A-Za-z0-9_]+)[ ]+from[ ]+'([^']*assets/[^']+[.](?:jpg|jpeg|png|webp|avif|JPG|JPEG|PNG))'",
  'gm',
);

const rows = [];
for (const abs of files) {
  const rel = relative(WEB, abs).replaceAll(SEP, '/');
  if (scope && !rel.includes(scope)) continue;
  const src = readFileSync(abs, 'utf8');
  const body = src.split(String.fromCharCode(10));

  for (const m of src.matchAll(IMPORT)) {
    const [, binding, path] = m;
    const dir = path.replace(/^.*assets\//, '').split('/')[0];
    /* Referenced anywhere other than its own import line. */
    const uses = body.filter(
      (l) => !l.trim().startsWith(`import ${binding} `) &&
        new RegExp('(^|[^A-Za-z0-9_])' + binding + '([^A-Za-z0-9_]|$)').test(l),
    ).length;
    rows.push({ file: rel, binding, dir, design: DESIGN_DIRS.has(dir), live: uses > 0 });
  }
}

const live = rows.filter((r) => r.live);
const group = (list, key) => {
  const o = {};
  for (const r of list) (o[r[key]] ??= []).push(r);
  return Object.entries(o).sort((a, b) => b[1].length - a[1].length);
};

console.log(`\n  LOCAL IMAGE IMPORTS${scope ? ` under ${scope}` : ''}\n`);
console.log(`    imports found        ${rows.length}`);
console.log(`    still referenced     ${live.length}`);
console.log(`    dead (codemod left)  ${rows.length - live.length}`);
console.log(`    of the live ones —`);
console.log(`      design assets      ${live.filter((r) => r.design).length}`);
console.log(`      photography        ${live.filter((r) => !r.design).length}`);

console.log('\n  live photography by asset directory\n');
for (const [dir, list] of group(live.filter((r) => !r.design), 'dir'))
  console.log(`    ${dir.padEnd(32)} ${String(list.length).padStart(3)}`);

console.log('\n  live photography by component\n');
for (const [file, list] of group(live.filter((r) => !r.design), 'file').slice(0, 20))
  console.log(`    ${String(list.length).padStart(3)}  ${file}`);

if (rows.length - live.length) {
  console.log('\n  dead imports\n');
  for (const [file, list] of group(rows.filter((r) => !r.live), 'file'))
    console.log(`    ${String(list.length).padStart(3)}  ${file}  ${list.map((r) => r.binding).join(' ')}`);
}
console.log('');
