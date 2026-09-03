/**
 * EVERY ALT ATTRIBUTE ON EVERY ACADEMICS PAGE, IN ORDER.
 *
 * The production text diff cannot see this. An alt attribute is not rendered
 * text, so a photograph that arrives from Strapi with an empty alt passes
 * 173/173 and fails every screen reader. This snapshots the alt of every image
 * on every academics route before the migration and compares after; ordering is
 * part of the comparison, because two photographs swapping their descriptions
 * is as wrong as losing one.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../../../web/dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = new URL('../fixtures/academics-alt.json', import.meta.url);

const pages = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
};
walk(join(DIST, 'academics'));
if (existsSync(join(DIST, 'academics.html'))) pages.push(join(DIST, 'academics.html'));

const shot = {};
for (const p of pages.sort()) {
  const route = '/' + p.slice(DIST.length).replaceAll(String.fromCharCode(92), '/').replace(/index\.html$/, '').replace(/\.html$/, '/');
  const html = readFileSync(p, 'utf8');
  const alts = [...html.matchAll(/<img[^>]*\salt="([^"]*)"/g)].map((m) => m[1]);
  shot[route] = alts;
}

const mode = process.argv[2];
if (mode === 'save') {
  writeFileSync(OUT, JSON.stringify(shot, null, 2));
  const n = Object.values(shot).reduce((a, b) => a + b.length, 0);
  console.log(`\n  saved ${n} alt attributes across ${Object.keys(shot).length} academics routes\n`);
} else {
  const was = JSON.parse(readFileSync(OUT, 'utf8'));
  let bad = 0;
  for (const route of new Set([...Object.keys(was), ...Object.keys(shot)])) {
    const a = was[route] ?? [], b = shot[route] ?? [];
    if (a.length !== b.length) { console.log(`  ✗ ${route}  ${a.length} images before, ${b.length} after`); bad++; continue; }
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) {
      console.log(`  ✗ ${route}  image ${i + 1}`);
      console.log(`      was  ${JSON.stringify(a[i])}`);
      console.log(`      now  ${JSON.stringify(b[i])}`);
      bad++;
    }
  }
  const n = Object.values(shot).reduce((a, b) => a + b.length, 0);
  console.log(bad ? `\n  ✗ ${bad} alt difference(s)\n` : `\n  ✔ all ${n} alt attributes identical, in the same order\n`);
  process.exit(bad ? 1 : 0);
}
