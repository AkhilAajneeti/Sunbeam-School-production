/**
 * REMOVE IMAGE IMPORTS NOTHING REFERENCES ANY MORE.
 *
 * Every codemod in this migration replaces a const or a tag; none of them can
 * know whether the import that fed it is still wanted, because the same binding
 * may be used again further down the file. So they leave it, and the leftovers
 * accumulate.
 *
 * ⚠ THIS IS NOT TIDYING. A dead `import pBench from '.../chem lab/...'` at the
 * top of a component reads to the next person as a photograph that is still
 * hardcoded, and it is exactly what made the first count of this gap wrong: 273
 * imports, of which 57 rendered nothing at all. An audit that cannot tell the
 * two apart cannot answer whether the migration is finished.
 *
 * A binding is dead when the file mentions it nowhere except its own import.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEP = String.fromCharCode(92);
const NL = String.fromCharCode(10);
const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '../../web/src');
const DRY = process.argv.includes('--dry');

const IMPORT = new RegExp(
  "^import[ ]+([A-Za-z0-9_]+)[ ]+from[ ]+'([^']*assets/[^']+[.](?:jpg|jpeg|png|webp|avif|JPG|JPEG|PNG|svg|SVG))'",
);

/**
 * WARNING: A NAME IN A COMMENT IS NOT A USE.
 * One import in this section is mentioned only in a paragraph explaining the
 * design of the component, and counting that as a reference kept a dead import
 * alive through two passes of this cleanup.
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

let touched = 0, removed = 0;
const report = [];

for (const abs of files) {
  const rel = relative(WEB, abs).replaceAll(SEP, '/');
  const raw = readFileSync(abs, 'utf8');
  const lines = raw.split(NL);
  const bare = withoutComments(raw).split(NL);

  const drop = [];
  for (const [i, line] of lines.entries()) {
    const m = line.trim().match(IMPORT);
    if (!m) continue;
    const binding = m[1];
    const used = bare.some(
      (l, j) => j !== i &&
        new RegExp('(^|[^A-Za-z0-9_])' + binding + '([^A-Za-z0-9_]|$)').test(l),
    );
    if (!used) drop.push({ i, binding, path: m[2] });
  }
  if (!drop.length) continue;

  for (const d of drop.map((d) => d.i).sort((a, b) => b - a)) lines.splice(d, 1);
  if (!DRY) writeFileSync(abs, lines.join(NL), 'utf8');
  touched++;
  removed += drop.length;
  report.push({ rel, drop });
}

console.log(`\n  DEAD IMAGE IMPORTS${DRY ? '  (dry run)' : ''}\n`);
console.log(`    files       ${touched}`);
console.log(`    removed     ${removed}\n`);
for (const r of report) console.log(`    ${String(r.drop.length).padStart(2)}  ${r.rel}  ${r.drop.map((d) => d.binding).join(' ')}`);
console.log('');
