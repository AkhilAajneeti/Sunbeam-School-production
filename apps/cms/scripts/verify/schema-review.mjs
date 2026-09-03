/**
 * SCHEMA QUALITY REVIEW — for the architecture half of the audit.
 *
 * Reports facts about the shape of the schema so the judgement calls can be made
 * against evidence rather than impression:
 *
 *   · fields whose NAME suggests design or a derived value, which should be in
 *     code rather than in the CMS
 *   · components with near-identical field sets, which are candidates for being
 *     one component
 *   · fields that no seed ever writes and no query ever reads — dead surface
 *   · naming that departs from the convention the rest of the schema follows
 *
 * ⚠ IT DOES NOT PROPOSE CHANGES. The instruction for this pass is to report, and
 * a field being unused is a question ("why is this here?"), not a verdict.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEP = String.fromCharCode(92);
const NL = String.fromCharCode(10);
const HERE = dirname(fileURLToPath(import.meta.url));
const CMS = resolve(HERE, '../..');
const WEB = resolve(HERE, '../../../web/src');

const walk = (d, test, out = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, test, out);
    else if (test(p)) out.push(p);
  }
  return out;
};
const rel = (b, p) => relative(b, p).replaceAll(SEP, '/');

const types = walk(join(CMS, 'src/api'), (p) => p.endsWith('schema.json')).map((p) => {
  const j = JSON.parse(readFileSync(p, 'utf8'));
  return { name: j.info.singularName, kind: j.kind, attrs: j.attributes, file: rel(CMS, p) };
});
const comps = walk(join(CMS, 'src/components'), (p) => p.endsWith('.json')).map((p) => {
  const j = JSON.parse(readFileSync(p, 'utf8'));
  return { name: rel(CMS, p).replace('src/components/', '').replace('.json', '').replace('/', '.'), attrs: j.attributes };
});

const seeds = walk(join(CMS, 'scripts/seed'), (p) => p.endsWith('.mjs')).map((p) => readFileSync(p, 'utf8')).join(NL);
const web = walk(WEB, (p) => /[.](astro|ts)$/.test(p)).map((p) => readFileSync(p, 'utf8')).join(NL);

/* ── 1 · names that sound like design or derivation ──────────────────────── */
const SUSPECT = /^(x|y|r|angle|rotate|scale|span|col|row|width|height|size|delay|duration|ease|tone|accent|palette|colour|color|variant|theme|offset|top|left|position|z|order|art|glyph|path|d)$/i;
const suspect = [];
for (const t of types) for (const [k, a] of Object.entries(t.attrs)) if (SUSPECT.test(k)) suspect.push(`${t.name}.${k} (${a.type})`);
for (const c of comps) for (const [k, a] of Object.entries(c.attrs)) if (SUSPECT.test(k)) suspect.push(`${c.name}.${k} (${a.type})`);

console.log(`${NL}  1 · FIELDS WHOSE NAME SUGGESTS DESIGN OR A DERIVED VALUE${NL}`);
console.log(suspect.length ? suspect.map((s) => `    ${s}`).join(NL) : '    none');

/* ── 2 · components with overlapping shapes ──────────────────────────────── */
console.log(`${NL}  2 · COMPONENTS WITH NEARLY THE SAME FIELDS${NL}`);
const keysOf = (c) => new Set(Object.keys(c.attrs));
let pairs = 0;
for (let i = 0; i < comps.length; i++) {
  for (let j = i + 1; j < comps.length; j++) {
    const a = keysOf(comps[i]), b = keysOf(comps[j]);
    if (a.size < 2 || b.size < 2) continue;
    const shared = [...a].filter((k) => b.has(k)).length;
    const overlap = shared / Math.min(a.size, b.size);
    if (overlap >= 0.8) {
      pairs++;
      console.log(`    ${comps[i].name} (${a.size}) ~ ${comps[j].name} (${b.size})  — ${shared} shared`);
    }
  }
}
if (!pairs) console.log('    none above 80% overlap');

/* ── 3 · fields nothing writes and nothing reads ─────────────────────────── */
console.log(`${NL}  3 · FIELDS NO SEED WRITES AND NO PAGE READS${NL}`);
const SKIP = new Set(['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale']);
const dead = [];
for (const t of types) {
  for (const k of Object.keys(t.attrs)) {
    if (SKIP.has(k)) continue;
    const written = new RegExp('[^A-Za-z0-9_]' + k + '[ ]*:').test(seeds);
    const read = new RegExp('[^A-Za-z0-9_]' + k + '[^A-Za-z0-9_]').test(web);
    if (!written && !read) dead.push(`${t.name}.${k}`);
  }
}
for (const c of comps) {
  for (const k of Object.keys(c.attrs)) {
    if (SKIP.has(k)) continue;
    const written = new RegExp('[^A-Za-z0-9_]' + k + '[ ]*:').test(seeds);
    const read = new RegExp('[^A-Za-z0-9_]' + k + '[^A-Za-z0-9_]').test(web);
    if (!written && !read) dead.push(`${c.name}.${k}`);
  }
}
console.log(dead.length ? dead.map((s) => `    ${s}`).join(NL) : '    none');

/* ── 4 · shape of the surface ────────────────────────────────────────────── */
const single = types.filter((t) => t.kind === 'singleType');
const collection = types.filter((t) => t.kind !== 'singleType');
const fieldCount = (o) => Object.keys(o.attrs).length;
console.log(`${NL}  4 · SURFACE${NL}`);
console.log(`    ${types.length} content types — ${collection.length} collections, ${single.length} single`);
console.log(`    ${comps.length} components`);
console.log(`    largest types:`);
for (const t of [...types].sort((a, b) => fieldCount(b) - fieldCount(a)).slice(0, 6))
  console.log(`      ${String(fieldCount(t)).padStart(3)} fields  ${t.name}`);
console.log(`    largest components:`);
for (const c of [...comps].sort((a, b) => fieldCount(b) - fieldCount(a)).slice(0, 6))
  console.log(`      ${String(fieldCount(c)).padStart(3)} fields  ${c.name}`);

/* ── 5 · naming convention ───────────────────────────────────────────────── */
console.log(`${NL}  5 · NAMES THAT DEPART FROM THE CONVENTION${NL}`);
const odd = [];
for (const t of types) if (!/^[a-z][a-z0-9-]*$/.test(t.name)) odd.push(`type ${t.name}`);
for (const c of comps) if (!/^[a-z][a-z0-9-]*[.][a-z][a-z0-9-]*$/.test(c.name)) odd.push(`component ${c.name}`);
for (const t of types) for (const k of Object.keys(t.attrs)) if (!/^[a-z][A-Za-z0-9]*$/.test(k)) odd.push(`${t.name}.${k}`);
for (const c of comps) for (const k of Object.keys(c.attrs)) if (!/^[a-z][A-Za-z0-9]*$/.test(k)) odd.push(`${c.name}.${k}`);
console.log(odd.length ? odd.map((s) => `    ${s}`).join(NL) : '    none');
console.log('');
