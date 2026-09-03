/**
 * CODEMOD — remove hardcoded SEO and hero props now that page-meta supplies them.
 *
 *     node scripts/codemod-page-meta.mjs --dry
 *     node scripts/codemod-page-meta.mjs
 *
 * ⚠ STATIC ROUTES ONLY. A file whose path contains `[` is dynamic — its title
 * comes from the record it renders, and those props are the override that
 * BaseLayout and PageHero deliberately still accept. Stripping them there would
 * leave every alumni meet and news item sharing one title.
 *
 * ⚠ IT ONLY TOUCHES THE OPENING TAGS OF BaseLayout AND PageHero. `title=` also
 * appears on <svg>, on links and inside body copy; scoping the edit to those two
 * tags is what keeps this safe.
 *
 * ⚠ `src` STAYS ON PageHero. The CMS banner wins when there is one, but `src` is
 * the fallback that renders when a route has no page-meta banner — three routes
 * legitimately have none. Removing it would leave them with an empty band.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGES = resolve(HERE, '../../web/src/pages');
const DRY = process.argv.includes('--dry');

/** Props to drop, per component. */
const STRIP = {
  BaseLayout: ['title', 'description', 'robots'],
  PageHero: ['title', 'standfirst', 'alt', 'position', 'crumbs'],
};

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (e.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

/** Index range of `<Component …>`'s opening tag, brace-aware. */
function openingTagRange(src, component) {
  const start = src.indexOf(`<${component}`);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '>' && depth === 0) return [start, i + 1];
  }
  return null;
}

/** Remove one `name=…` prop from a tag string, whatever its value form. */
function dropProp(tag, name) {
  const patterns = [
    new RegExp(`\\s+${name}="[^"]*"`),
    new RegExp(`\\s+${name}=\\{\`[\\s\\S]*?\`\\}`),
    new RegExp(`\\s+${name}=\\{'[^']*'\\}`),
    /* Brace expression, balanced — crumbs arrays and ternaries live here. */
    null,
  ];
  for (const re of patterns) {
    if (re && re.test(tag)) return tag.replace(re, '');
  }
  const at = tag.indexOf(`${name}={`);
  if (at === -1) return tag;
  let depth = 0;
  for (let i = at + name.length + 1; i < tag.length; i++) {
    if (tag[i] === '{') depth++;
    else if (tag[i] === '}') {
      depth--;
      if (depth === 0) {
        let from = at;
        while (from > 0 && /\s/.test(tag[from - 1])) from--;
        return tag.slice(0, from) + tag.slice(i + 1);
      }
    }
  }
  return tag;
}

const files = (await walk(PAGES)).sort();
let changed = 0;
const report = [];

for (const file of files) {
  const rel = relative(PAGES, file).split(sep).join('/');
  if (rel.includes('[')) continue;

  let src = await readFile(file, 'utf8');
  const before = src;
  const dropped = [];

  for (const [component, props] of Object.entries(STRIP)) {
    const range = openingTagRange(src, component);
    if (!range) continue;
    let tag = src.slice(range[0], range[1]);
    for (const p of props) {
      const next = dropProp(tag, p);
      if (next !== tag) dropped.push(`${component}.${p}`);
      tag = next;
    }
    src = src.slice(0, range[0]) + tag + src.slice(range[1]);
  }

  if (src === before) continue;
  report.push(`  ${rel.padEnd(52)} ${dropped.join(' ')}`);
  changed++;
  if (!DRY) await writeFile(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would strip from' : 'Stripped from'} ${changed} static routes\n`);
console.log(report.join('\n'));
console.log('');
