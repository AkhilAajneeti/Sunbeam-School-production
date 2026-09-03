/**
 * STYLES THAT NEVER MATCH THE ELEMENT THEY WERE WRITTEN FOR.
 *
 * ⚠ THE BUG THIS EXISTS TO CATCH, IN ONE SENTENCE:
 *
 *     Astro scopes a component's CSS by stamping `data-astro-cid-XXX` on the
 *     elements in ITS OWN template — so a class PASSED INTO another component
 *     lands on an element that carries the CHILD's attribute, and every rule the
 *     parent wrote for that class silently matches nothing.
 *
 * On the homepage the h1 is rendered by AccentHeading. Hero.astro styled it as
 * `.hero__title { color: #fff }`, which compiled to
 * `.hero__title[data-astro-cid-ewxirvlt]`, and the h1 never had that attribute.
 * The heading fell back to the page's dark default and sat BLACK ON A DARK
 * PHOTOGRAPH — along with quietly losing its measure, its margin and both of its
 * breakpoints.
 *
 * ⚠ NOTHING ELSE ON THIS PROJECT CAN SEE THIS. The build succeeds, the markup is
 * correct, the text is correct, so the production text diff passes; the head and
 * anchor check passes; the alt snapshot passes. It is invisible until somebody
 * looks at the page.
 *
 * The test: for every `.cls[data-astro-cid-X]` rule in the built CSS, is there an
 * element in the built HTML carrying `cls` but NOT that attribute? If so the rule
 * was written for it and does not reach it.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEP = String.fromCharCode(92);
const NL = String.fromCharCode(10);
const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../../../web/dist');

const walk = (d, test, out = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, test, out);
    else if (test(p)) out.push(p);
  }
  return out;
};

/**
 * WARNING: A CLASS THAT IS ALSO STYLED GLOBALLY IS NOT A FAULT.
 *
 * `btn` and `u-container` live in the global stylesheet AND carry component-local
 * overrides. An element with the class but not the attribute still gets the global
 * rule; the scoped rule was only ever meant for that one component's instances.
 * Flagging those buried the one real case in forty-three false ones.
 *
 * The fault is a class whose ONLY definition is scoped: then an element without
 * the attribute is styled by nothing at all.
 */
const unscoped = new Set();
const scoped = new Map();
for (const f of walk(DIST, (p) => p.endsWith('.css'))) {
  const css = readFileSync(f, 'utf8');
  for (const m of css.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)\[data-astro-cid-([a-z0-9]+)\]/g)) {
    (scoped.get(m[1]) ?? scoped.set(m[1], new Set()).get(m[1])).add(m[2]);
  }
  /* The same class written WITHOUT a cid attribute selector anywhere: a global
     rule, or the component that actually owns the element. Either way it is
     styled, and the scoped miss is deliberate rather than a fault. */
  for (const m of css.matchAll(/[.]([A-Za-z][A-Za-z0-9_-]*)/g)) {
    const after = css.slice(m.index + m[0].length, m.index + m[0].length + 16);
    if (!after.startsWith("[data-astro-cid-")) unscoped.add(m[1]);
  }
}

const pages = walk(DIST, (p) => p.endsWith('.html'));
const bad = new Map();

for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  /* Each element's opening tag, so class and attributes are read together. */
  for (const tag of html.matchAll(/<[a-z][a-z0-9]*\s[^>]*class="([^"]*)"[^>]*>/g)) {
    const classes = tag[1].split(/\s+/).filter(Boolean);
    const cids = [...tag[0].matchAll(/data-astro-cid-([a-z0-9]+)/g)].map((m) => m[1]);
    for (const c of classes) {
      const want = scoped.get(c);
      if (!want) continue;
      if (unscoped.has(c)) continue;      /* a global rule still styles it */
      if (cids.some((id) => want.has(id))) continue;     /* it does match */
      const key = `${c}  (needs data-astro-cid-${[...want].join(' or ')})`;
      const at = bad.get(key) ?? { pages: new Set(), sample: tag[0].slice(0, 110) };
      at.pages.add(relative(DIST, f).replaceAll(SEP, '/'));
      bad.set(key, at);
    }
  }
}

console.log(`${NL}  SCOPED RULES THAT DO NOT REACH THEIR ELEMENT${NL}`);
console.log(`    scoped classes in the CSS   ${scoped.size}`);
console.log(`    pages scanned               ${pages.length}`);
console.log(`    styled ONLY by a scoped rule that misses  ${bad.size}${NL}`);

for (const [key, at] of [...bad.entries()].sort((a, b) => b[1].pages.size - a[1].pages.size)) {
  console.log(`    ✗ ${key}`);
  console.log(`        on ${at.pages.size} page(s), e.g. ${[...at.pages][0]}`);
  console.log(`        ${at.sample}`);
}
if (!bad.size) console.log('    ✔ every scoped rule reaches the element it was written for');
console.log('');
process.exitCode = bad.size ? 1 : 0;
