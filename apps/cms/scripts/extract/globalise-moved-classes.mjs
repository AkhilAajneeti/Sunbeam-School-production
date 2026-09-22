/**
 * A CLASS HANDED TO A CHILD COMPONENT NEVER GETS THE CALLER'S SCOPE.
 *
 *     node scripts/extract/globalise-moved-classes.mjs <PageName…>
 *
 * Astro stamps `data-astro-cid-<page>` only on elements written in that page's
 * own template. Moving a paragraph to `<RichLine class="sc-body">` and a heading
 * to `<ClipHeading class="sc-h sc-open__h">` renders them inside those
 * components, so they carry the COMPONENT's id — and `.sc-body { … }` compiles
 * to `.sc-body[data-astro-cid-7p4pb3nn]`, which matches nothing.
 *
 * ⚠ THE CLASS STAYS ON THE ELEMENT AND THE STYLING SILENTLY GOES. No build
 * fails, and a text comparison cannot see it: the words are all still there, at
 * the wrong size, the wrong width and the wrong colour. It is the same fault
 * that once left the homepage h1 black on a dark photograph.
 *
 * `scripts/verify/scoped-css.mjs` is what catches it; :global() is Astro's own
 * fix, and this applies it to every class the page hands out — including
 * `linkClass`, which RichLine puts on the <a>.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ACADEMICS = resolve(HERE, '../../../web/src/components/academics');
/* The pages live in two folders; the file is looked for in both. */
const FOLDERS = ['structure', 'teaching', 'assessment'];
const dirFor = (page) => FOLDERS.find((d) => existsSync(`${ACADEMICS}/${d}/${page}.astro`)) ?? 'structure';

const pages = process.argv.slice(2);
if (!pages.length) { console.error('usage: globalise-moved-classes.mjs <PageName…>'); process.exit(1); }

for (const page of pages) {
  const p = `${ACADEMICS}/${dirFor(page)}/${page}.astro`;
  let s = readFileSync(p, 'utf8');

  /* Every class this page hands to a component that renders the element. */
  const classes = new Set();
  for (const m of s.matchAll(/<(?:RichLine|ClipHeading)[^>]*?\bclass="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  for (const m of s.matchAll(/\blinkClass="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  if (!classes.size) { console.log(`  ${page}: nothing handed to a component`); continue; }

  const at = s.indexOf('<style>');
  const head = s.slice(0, at);
  let css = s.slice(at);
  const done = [];

  /* Longest first, so `.sc-body sc-deep__b` is not half-wrapped by `.sc-body`. */
  for (const cls of [...classes].sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(^[ \\t]*)((?:\\.${cls.replace(/-/g, '\\-')})[^{}\\n]*?)(\\s*\\{)`, 'gm');
    css = css.replace(re, (m0, indent, sel, brace) => {
      if (sel.includes(':global')) return m0;
      done.push(sel.trim());
      return indent + sel.split(',').map((x) => `:global(${x.trim()})`).join(', ') + brace;
    });
  }

  writeFileSync(p, head + css);
  console.log(`  ${page}: ${done.length} rule(s) wrapped — ${[...classes].join(' ')}`);
}
