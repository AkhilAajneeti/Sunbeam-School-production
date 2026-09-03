/**
 * REPAIR — move injected CMS lines inside the Astro frontmatter.
 *
 * codemod-campus.mjs prepended its import and awaits to position 0, which put
 * them ABOVE the opening `---`. Astro then treats them as template output
 * rather than frontmatter and the component does not compile.
 *
 * This moves anything sitting above the first `---` to just after it, which is
 * where it should have gone. Files that already start with `---` are untouched.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../web/src');
const DRY = process.argv.includes('--dry');

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

let fixed = 0;
const report = [];

for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8');
  if (src.startsWith('---')) continue;

  const lines = src.split('\n');
  const openIdx = lines.findIndex((l) => l.trim() === '---');
  if (openIdx === -1) continue;

  const injected = lines.slice(0, openIdx).filter((l) => l.trim() !== '');
  /* Only repair what this codemod caused — a file legitimately starting with
     something else is not ours to rearrange. */
  if (!injected.some((l) => l.includes('lib/cms'))) continue;

  const rest = lines.slice(openIdx + 1);
  const out = ['---', ...injected, '', ...rest].join('\n');

  report.push(`  ${relative(SRC, file).split(sep).join('/')}`);
  fixed++;
  if (!DRY) writeFileSync(file, out, 'utf8');
}

console.log(`\n  ${DRY ? 'Would repair' : 'Repaired'} ${fixed} files\n`);
console.log(report.sort().join('\n'));
console.log('');
