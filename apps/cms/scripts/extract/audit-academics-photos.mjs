/**
 * INVENTORY OF THE ACADEMICS PHOTOGRAPHS THAT ARE STILL LOCAL IMPORTS.
 *
 * These never appeared in the G8 extraction because they were never inside a
 * content const: they are bare `import` statements at the top of a component and
 * a `src={var}` in its markup. The count check could not see them and the field
 * check had no source key to compare, which is exactly why they survived.
 *
 * For each one this records the file, the binding, the asset, the alt text as
 * written, and whether the component already holds an `ac` record to hang the
 * photograph on. Everything else on the tag — widths, sizes, loading, formats —
 * is design and is not recorded, because it is not moving.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const WEB = new URL('../../../web/src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const roots = ['components/academics', 'pages/academics'];

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
};
for (const r of roots) walk(join(WEB, r));

const IMPORT = /^import\s+([A-Za-z0-9_]+)\s+from\s+'([^']*assets\/photos\/[^']+)';?$/gm;
const out = [];

for (const abs of files) {
  const rel = relative(WEB, abs).replaceAll(String.fromCharCode(92), '/');
  const src = readFileSync(abs, 'utf8');

  const imports = new Map();
  for (const m of src.matchAll(IMPORT)) imports.set(m[1], m[2].split('/').pop());
  if (!imports.size) continue;

  const acRoute = src.match(/getAcademicTopic\('([^']+)'\)/)?.[1] ?? null;

  /* Every tag that consumes one of those bindings. The alt is captured as
     written — token, template literal, backticks and all — because the whole
     requirement is that it renders identically afterwards. */
  const uses = [];
  for (const [name, asset] of imports) {
    const B = String.fromCharCode(92); const re = new RegExp('(?:src|file|photo|image)=' + B + '{' + name + B + '}', 'g');
    let n = 0;
    for (const m of src.matchAll(re)) {
      n++;
      const from = src.lastIndexOf('<', m.index);
      const to = src.indexOf('>', m.index);
      const tag = src.slice(from, to + 1);
      uses.push({
        binding: name,
        asset,
        component: tag.match(/^<\s*([A-Za-z0-9_]+)/)?.[1] ?? '?',
        alt: tag.match(/\salt=(\{[^}]*\}|"[^"]*")/)?.[1] ?? null,
      });
    }
    if (!n) uses.push({ binding: name, asset, component: null, alt: null, dead: true });
  }
  out.push({ file: rel, route: acRoute, imports: imports.size, uses });
}

const flat = out.flatMap((f) => f.uses.map((u) => ({ ...u, file: f.file, route: f.route })));
writeFileSync(new URL('../fixtures/academics-photos.json', import.meta.url), JSON.stringify(out, null, 2));

const byAsset = {};
for (const u of flat) (byAsset[u.asset] ??= []).push(u);

console.log('\n  ACADEMICS PHOTOGRAPHS STILL IN CODE\n');
console.log(`    components          ${out.length}`);
console.log(`    bindings            ${out.reduce((n, f) => n + f.imports, 0)}`);
console.log(`    render sites        ${flat.filter((u) => !u.dead).length}`);
console.log(`    distinct assets     ${Object.keys(byAsset).length}`);
console.log(`    dead bindings       ${flat.filter((u) => u.dead).length}`);
console.log(`    without an ac record ${out.filter((f) => !f.route).length}  ${out.filter((f) => !f.route).map((f) => f.file).join(', ')}`);
console.log(`    alt is a template   ${flat.filter((u) => u.alt?.startsWith('{')).length}`);
console.log(`    alt is empty        ${flat.filter((u) => u.alt === '""').length}`);
console.log(`    alt missing         ${flat.filter((u) => !u.dead && !u.alt).length}`);
console.log('\n  per asset\n');
for (const [a, us] of Object.entries(byAsset).sort((x, y) => y[1].length - x[1].length))
  console.log(`    ${a.padEnd(24)} ${String(us.length).padStart(3)}`);
console.log('\n  written to scripts/fixtures/academics-photos.json\n');
