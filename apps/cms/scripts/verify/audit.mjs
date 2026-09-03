/**
 * WHOLE-PROJECT CMS COMPLETION AUDIT.
 *
 * Answers the mechanical half of the audit — the parts where a grep or a query
 * settles the question, rather than a judgement about whether a value is
 * editorial. Everything it reports is a fact about the tree or the database.
 *
 * ⚠ WHAT THIS DELIBERATELY DOES NOT DO: decide whether a hardcoded string ought
 * to be in the CMS. It lists candidates; the call is editorial and is made in
 * the written audit, not here.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withStrapi } from '../lib/strapi.mjs';

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

/**
 * WARNING: A LINE IN A COMMENT IS NOT AN IMPORT.
 * The first run of this audit reported queries/academics.ts as still importing
 * data/academics. It does not - the path appears in a comment showing the swap
 * that replaced it. An audit that miscounts in the safe direction is worse than
 * no audit, because it sends someone looking for a problem that is not there.
 */
function withoutComments(src) {
  const SL = String.fromCharCode(47), ST = String.fromCharCode(42), NL2 = String.fromCharCode(10);
  const out = src.split("");
  let i = 0;
  while (i < src.length) {
    if (src[i] === SL && src[i + 1] === ST) {
      const end = src.indexOf(ST + SL, i + 2);
      const stop = end === -1 ? src.length : end + 2;
      for (let j = i; j < stop; j++) if (out[j] !== NL2) out[j] = " ";
      i = stop; continue;
    }
    if (src[i] === SL && src[i + 1] === SL && src[i - 1] !== ":") {
      while (i < src.length && src[i] !== NL2) { out[i] = " "; i++; }
      continue;
    }
    i++;
  }
  return out.join("");
}

const rel = (base, p) => relative(base, p).replaceAll(SEP, '/');
const head = (t) => console.log(`${NL}  ${t}${NL}`);

/* ── the schema side ─────────────────────────────────────────────────────── */
const typeFiles = walk(join(CMS, 'src/api'), (p) => p.endsWith('schema.json'));
const types = typeFiles.map((p) => {
  const j = JSON.parse(readFileSync(p, 'utf8'));
  return { uid: `api::${j.info.singularName}.${j.info.singularName}`, ...j.info, kind: j.kind, attrs: j.attributes, file: rel(CMS, p) };
});

const compFiles = walk(join(CMS, 'src/components'), (p) => p.endsWith('.json'));
const comps = compFiles.map((p) => {
  const j = JSON.parse(readFileSync(p, 'utf8'));
  const name = rel(CMS, p).replace('src/components/', '').replace('.json', '').replace('/', '.');
  return { name, attrs: j.attributes, file: rel(CMS, p) };
});

/** Which components each type or component references. */
const usesOf = (attrs) => Object.values(attrs)
  .flatMap((a) => (a.component ? [a.component] : []))
  .concat(Object.values(attrs).flatMap((a) => (a.components ?? [])));

const referenced = new Set();
for (const t of types) for (const c of usesOf(t.attrs)) referenced.add(c);
for (const c of comps) for (const x of usesOf(c.attrs)) referenced.add(x);

/* ── the frontend side ───────────────────────────────────────────────────── */
const webFiles = walk(WEB, (p) => /[.](astro|ts|tsx|js|mjs)$/.test(p));
const webText = new Map(webFiles.map((p) => [rel(WEB, p), withoutComments(readFileSync(p, 'utf8'))]));
const allWeb = [...webText.values()].join(NL);

const plural = (t) => {
  const j = JSON.parse(readFileSync(resolve(CMS, t.file), 'utf8'));
  return j.info.pluralName;
};

head('1 · CONTENT TYPES AND WHETHER THE SITE READS THEM');
const unread = [];
for (const t of types.sort((a, b) => a.singularName.localeCompare(b.singularName))) {
  const p = plural(t);
  const hit = allWeb.includes(`/api/${p}`) || allWeb.includes(`/api/${t.singularName}`) || allWeb.includes(`api::${t.singularName}`);
  if (!hit) unread.push(t.singularName);
  console.log(`    ${hit ? '·' : '✗'} ${t.singularName.padEnd(30)} ${t.kind === 'singleType' ? 'single' : ''}`);
}
console.log(`${NL}    ${types.length} types · ${unread.length} never fetched by the site${unread.length ? `: ${unread.join(', ')}` : ''}`);

head('2 · COMPONENTS AND WHETHER ANY SCHEMA USES THEM');
const orphanComps = comps.filter((c) => !referenced.has(c.name)).map((c) => c.name);
console.log(`    ${comps.length} components · ${orphanComps.length} referenced by nothing${orphanComps.length ? `: ${orphanComps.join(', ')}` : ''}`);

head('3 · OLD DATA FILES, AND WHO STILL IMPORTS THEM');
const dataDir = join(WEB, 'data');
const dataFiles = existsSync(dataDir) ? readdirSync(dataDir).filter((f) => f.endsWith('.ts')) : [];
let liveImports = 0;
for (const f of dataFiles.sort()) {
  const stem = f.replace(/[.]ts$/, '');
  const importers = [...webText.entries()].filter(([p, src]) =>
    !p.startsWith('data/') &&
    new RegExp("from[ ]+'[^']*data/" + stem + "'").test(src));
  liveImports += importers.length;
  const where = importers.length
    ? importers.slice(0, 3).map(([p]) => p).join(', ') + (importers.length > 3 ? ` +${importers.length - 3}` : '')
    : 'seed only';
  console.log(`    ${importers.length ? '✗' : '·'} ${stem.padEnd(28)} ${where}`);
}
console.log(`${NL}    ${dataFiles.length} data files · ${liveImports} still imported by pages or components`);

head('4 · POPULATE STRATEGY');
const populate = readFileSync(join(WEB, 'lib/cms/populate.ts'), 'utf8');
const specs = [...populate.matchAll(/export const ([A-Z_0-9]+)[ ]*:/g)].map((m) => m[1]);
const inlinePopulate = [...webText.entries()].filter(([p, src]) =>
  !p.startsWith('lib/cms/') && /populate[ ]*:[ ]*[{[]/.test(src)).map(([p]) => p);
console.log(`    ${specs.length} named populate specs in lib/cms/populate.ts`);
console.log(`    ${inlinePopulate.length} file(s) outside lib/cms declare their own populate${inlinePopulate.length ? `: ${inlinePopulate.join(', ')}` : ''}`);

head('5 · THE SCHOOL NAME, HARDCODED');
const nameHits = [...webText.entries()].filter(([p, src]) =>
  !p.startsWith('data/') && src.includes('Sunbeam School Ballia'));
console.log(`    ${nameHits.length} file(s) contain the literal "Sunbeam School Ballia"`);
for (const [p] of nameHits.slice(0, 12)) console.log(`      ${p}`);
if (nameHits.length > 12) console.log(`      +${nameHits.length - 12} more`);

await withStrapi(async (app) => {
  head('6 · ORPHANED MEDIA');
  const files = await app.db.query('plugin::upload.file').findMany({ select: ['id', 'name', 'size'], limit: 100000 });
  const links = await app.db.connection('files_related_mph').select('file_id');
  const used = new Set(links.map((l) => l.file_id));
  const orphans = files.filter((f) => !used.has(f.id));
  const mb = (n) => (n / 1024).toFixed(1);
  console.log(`    ${files.length} files in the library`);
  console.log(`    ${files.length - orphans.length} linked to content`);
  console.log(`    ${orphans.length} linked to nothing  (${mb(orphans.reduce((a, b) => a + b.size, 0))} MB)`);
  for (const o of orphans.slice(0, 15)) console.log(`      ${o.name}`);
  if (orphans.length > 15) console.log(`      +${orphans.length - 15} more`);

  head('7 · EMPTY CONTENT TYPES');
  for (const t of types) {
    const n = await app.documents(`api::${t.singularName}.${t.singularName}`).count({ status: 'published' }).catch(() => null);
    if (n === 0) console.log(`    ✗ ${t.singularName} has no published rows`);
  }
});

console.log('');
