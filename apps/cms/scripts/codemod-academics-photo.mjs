/**
 * CODEMOD — `<Photo src={…}>` where the source is now a Strapi file.
 *
 * ⚠ THE QUIETEST FAILURE OF THE THREE. `<Picture>` and `<Image>` fail the build
 * on a Strapi file. `<Photo>` does not: given something it cannot use it renders
 * its labelled placeholder, so the page builds, the layout is unchanged, and the
 * photograph is simply gone. Only a look at the rendered page would find it.
 *
 * ⚠ ONLY MEMBER EXPRESSIONS. `src={photo}` is a local import and stays; `src={s.src}`
 * comes from a migrated array and becomes `file=`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../web/src');
const DRY = process.argv.includes('--dry');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

const FILES = [...walk(join(WEB_SRC, 'components', 'academics')), ...walk(join(WEB_SRC, 'pages', 'academics'))];
let n = 0;
const report = [];

for (const file of FILES) {
  let src = readFileSync(file, 'utf8');
  const before = src;
  /* `<Photo … src={a.b} …>` — the expression must contain a dot or a bracket. */
  src = src.replace(/(<Photo\b[\s\S]{0,600}?)\bsrc=\{([^}]*[.[][^}]*)\}/g, (m, head, expr) => {
    n++;
    return `${head}file={${expr}}`;
  });
  if (src === before) continue;
  report.push(`  ${relative(WEB_SRC, file).split('\\').join('/')}`);
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would convert' : 'Converted'} ${n} <Photo src> in ${report.length} files\n${report.join('\n')}\n`);
