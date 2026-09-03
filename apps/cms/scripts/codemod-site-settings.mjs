/**
 * CODEMOD — point every `school` consumer at the CMS instead of data/site.ts.
 *
 *     node scripts/codemod-site-settings.mjs --dry
 *     node scripts/codemod-site-settings.mjs
 *
 * Forty-four files import `school`. Doing that by hand is forty-four chances to
 * get a relative path wrong, so it is done mechanically and reviewed as a diff.
 *
 * ⚠ IT REWRITES ONLY THE IMPORT. Every reference inside these files —
 * `school.phone.officeDisplay`, `school.address.city` — is untouched, because
 * queries/site.ts rebuilds exactly the shape data/site.ts exported. That is the
 * entire reason the shape was preserved.
 *
 * ⚠ showBuildNotes AND heritageLede STAY IN data/site.ts.
 *   · showBuildNotes is a build flag, not content.
 *   · heritageLede is homepage copy and moves with the homepage in G6, where an
 *     editor will actually look for it.
 * A file importing both keeps its data/site import for the half that stays.
 *
 * ⚠ THE await GOES AFTER THE LAST IMPORT, not in place of the one removed.
 * Astro frontmatter allows top-level await, but a statement sitting above an
 * import reads as a mistake even though ESM hoists.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, '../../web/src');
const CMS_DIR = join(SRC, 'lib', 'cms');

const DRY = process.argv.includes('--dry');

/** Every .astro / .ts file under src, minus the cms layer itself. */
async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || full === CMS_DIR) continue;
      await walk(full, out);
    } else if (/\.(astro|ts)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Import specifier from `file` to src/lib/cms, POSIX-separated. */
function cmsSpecifier(file) {
  let rel = relative(dirname(file), CMS_DIR).split(sep).join('/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

/** Insert `line` after the last top-level import in the file. */
function insertAfterImports(source, line) {
  const lines = source.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) last = i;
    /* Stop at the end of Astro frontmatter so a later import inside markup
       (there are none, but be safe) cannot drag the insertion point down. */
    if (i > 0 && lines[i].trim() === '---') break;
  }
  if (last === -1) return null;
  lines.splice(last + 1, 0, '', line);
  return lines.join('\n');
}

const files = await walk(SRC);
let changed = 0;
const report = [];

for (const file of files) {
  const src = await readFile(file, 'utf8');
  if (!/from\s+['"][^'"]*data\/site['"]/.test(src)) continue;

  const spec = cmsSpecifier(file);
  let out = src;
  let note = null;

  /* ⚠ EVERY PATTERN ACCEPTS SINGLE *OR* DOUBLE QUOTES.
     The first version of this codemod matched only `'…/data/site'` and silently
     skipped four files that use `"…/data/site"` — including Footer.astro, which
     is on all 174 pages. Nothing failed: the site built, the pages rendered, and
     the footer simply kept printing the old phone number from the .ts file while
     everything above it read the CMS. The live mutation test is what exposed it.
     Quote style is not a thing to assume in a codebase written over months. */
  /* 1 · `import { school } from '…/data/site';` */
  const plain = /import\s*\{\s*school\s*\}\s*from\s*['"][^'"]*data\/site['"];?/;
  /* 2 · `import { school as sb } from '…/data/site';` */
  const aliased = /import\s*\{\s*school\s+as\s+(\w+)\s*\}\s*from\s*['"][^'"]*data\/site['"];?/;
  /* 3 · `import { school, showBuildNotes } from '…/data/site';` — split it */
  const combined = /import\s*\{\s*school\s*,\s*showBuildNotes\s*\}\s*from\s*['"]([^'"]*data\/site)['"];?/;
  /* 4 · `import { quickAccess } from '…/data/site';` */
  const quick = /import\s*\{\s*quickAccess\s*\}\s*from\s*['"][^'"]*data\/site['"];?/;

  if (combined.test(src)) {
    const m = src.match(combined);
    out = out.replace(combined, `import { showBuildNotes } from '${m[1]}';\nimport { getSchool } from '${spec}';`);
    out = insertAfterImports(out, 'const school = await getSchool();') ?? out;
    note = 'school + showBuildNotes (split)';
  } else if (aliased.test(src)) {
    const alias = src.match(aliased)[1];
    out = out.replace(aliased, `import { getSchool } from '${spec}';`);
    out = insertAfterImports(out, `const ${alias} = await getSchool();`) ?? out;
    note = `school as ${alias}`;
  } else if (plain.test(src)) {
    out = out.replace(plain, `import { getSchool } from '${spec}';`);
    out = insertAfterImports(out, 'const school = await getSchool();') ?? out;
    note = 'school';
  } else if (quick.test(src)) {
    out = out.replace(quick, `import { getSiteSettings } from '${spec}';`);
    out = insertAfterImports(out, 'const { quickAccess } = await getSiteSettings();') ?? out;
    note = 'quickAccess';
  } else {
    /* showBuildNotes-only and heritageLede-only files: nothing to do. */
    continue;
  }

  if (out === src) continue;
  report.push(`  ${note.padEnd(28)} ${relative(SRC, file)}`);
  changed++;
  if (!DRY) await writeFile(file, out, 'utf8');
}

console.log(`\n  ${DRY ? 'Would rewrite' : 'Rewrote'} ${changed} files\n`);
console.log(report.sort().join('\n'));
console.log('');
