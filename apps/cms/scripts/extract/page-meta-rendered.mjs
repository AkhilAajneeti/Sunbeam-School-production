/**
 * EXTRACT — route metadata from the RENDERED pages, not from the source.
 *
 *     npm run dev            (apps/web, must be running)
 *     node scripts/extract/page-meta-rendered.mjs
 *
 * ═══ WHY RENDERED AND NOT PARSED ═══════════════════════════════════════════
 *
 * The first extractor parsed the .astro frontmatter and got 63 of 74 routes
 * cleanly. The other eleven build their title or description with a template
 * literal — `${school.name}`, `${celebrations.title}`, `${stats.buses}` — and a
 * regex cannot resolve those without re-implementing the page.
 *
 * The dev server already resolves them perfectly. So this asks it: fetch each
 * route, read the <title>, the meta description and the hero out of the DOM.
 * What lands in the CMS is exactly what the page renders today, which is also
 * precisely what the production diff will be checked against.
 *
 * ⚠ THE SOURCE PARSE IS STILL USED, for the things the DOM cannot tell us:
 * which routes are noindex, which had an interpolated value (so it can be
 * flagged rather than silently frozen), and where the banner file lives on disk.
 *
 * ═══ THE SCHOOL NAME COMES OUT OF THE TITLE ════════════════════════════════
 *
 * ⚠ 66 OF 67 TITLES END IN " — Sunbeam School Ballia". That is the school's own
 * name, hardcoded 66 times, in the single most visible string on every page. It
 * is stripped here and recomposed by BaseLayout from site-settings, so renaming
 * the school updates all 74 titles instead of none of them. The rendered output
 * is byte-identical either way.
 *
 * The homepage is the exception: its title LEADS with the name rather than
 * ending in it, so it is stored whole and marked `titleStandalone`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
/* ⚠ IN AND OUT ARE DIFFERENT FILES, AND THAT IS A BUG FIX. They were the
   same path, so a run that failed part-way overwrote its own input with a
   truncated fixture — the next run then read zero rows and reported success
   with nothing to show for it. A step that consumes and produces must never
   share a filename. */
const FIXTURE_IN = resolve(HERE, '../fixtures/page-meta.parsed.json');
const FIXTURE_OUT = resolve(HERE, '../fixtures/page-meta.json');
const BASE = process.env.WEB_ORIGIN ?? 'http://localhost:4321';
const SUFFIX = ' — Sunbeam School Ballia';

const decode = (s) =>
  (s ?? '')
    .replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();

const pick = (html, re) => { const m = html.match(re); return m ? decode(m[1]) : null; };

const parsed = JSON.parse(await readFile(FIXTURE_IN, 'utf8'));
const rows = [];
let failed = 0;

for (const row of parsed.rows) {
  /* ⚠ RETRIED, BECAUSE ONE FLAKY MOMENT SILENTLY TRUNCATES THE FIXTURE.
     Strapi restarts whenever a schema file changes, and this loop fires 74
     requests back to back. The first run of this script hit exactly that: every
     route came back without a <title> because the CMS was mid-restart, and a
     naive version would have written an empty fixture and reported success. */
  let html = null;
  for (let attempt = 1; attempt <= 4 && html === null; attempt++) {
    try {
      const res = await fetch(`${BASE}${row.route}`);
      /* 404 IS A SUCCESS HERE. /404/ is the error page itself and correctly
         answers with that status while rendering perfectly. Only a server error
         means the page genuinely failed. */
      if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      if (!/<title>/.test(body)) throw new Error('no <title> in response');
      html = body;
    } catch (err) {
      if (attempt === 4) {
        console.warn(`  ⚠ ${row.route} — ${err.message} (after 4 attempts)`);
        failed++;
      } else {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  if (html === null) continue;

  const rawTitle = pick(html, /<title>([\s\S]*?)<\/title>/);
  const description = pick(html, /<meta\s+name="description"\s+content="([^"]*)"/);
  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]*)"/);

  /* Hero copy, from the banner's own markup. */
  const heroTitle = pick(html, /<h1[^>]*class="[^"]*phero__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/)
    ?? pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  /* ⚠ THE CLASS IS phero__standfirst, NOT phero__stand. The first version used
     the shorter name, matched nothing, and wrote null for all 74 routes — a
     silent data loss the seed would have stored without complaint. The parsed
     value is used as a fallback below, so a selector drifting again degrades to
     the source rather than to nothing. */
  const heroStandfirst = pick(html, /class="phero__standfirst"[^>]*>([\s\S]*?)<\/p>/);

  /* ⚠ A MISSING <title> IS A FAULT, NOT A ROW TO WRITE. Seeding null here would
     put a page with no title into the CMS and call the migration done. */
  if (!rawTitle) {
    console.warn(`  ⚠ ${row.route} — rendered without a <title>; skipped`);
    failed++;
    continue;
  }

  const standalone = !rawTitle.endsWith(SUFFIX);
  const metaTitle = standalone ? rawTitle : rawTitle.slice(0, -SUFFIX.length);

  rows.push({
    route: row.route,
    file: row.file,
    seo: {
      metaTitle,
      metaDescription: description,
      noIndex: Boolean(robots?.includes('noindex')),
    },
    titleStandalone: standalone,
    heroTitle: heroTitle ? heroTitle.replace(/<[^>]*>/g, '').trim() : null,
    heroStandfirst: (heroStandfirst ? heroStandfirst.replace(/<[^>]*>/g, '').trim() : null) ?? row.heroStandfirst ?? null,
    heroAlt: row.heroAlt,
    heroPosition: row.heroPosition,
    banner: row.banner,
    crumbs: row.crumbs,
    /* Carried forward so the seed report can name the routes whose values were
       computed rather than literal — they are the ones to re-check by eye. */
    wasInterpolated: row.needsReview ?? [],
  });
}

await writeFile(FIXTURE_OUT, `${JSON.stringify({ generatedFrom: 'rendered dev server', base: BASE, rows }, null, 2)}\n`, 'utf8');

console.log(`\n  rendered rows     ${rows.length}`);
console.log(`  fetch failures    ${failed}`);
console.log(`  standalone title  ${rows.filter((r) => r.titleStandalone).length}`);
console.log(`  noindex           ${rows.filter((r) => r.seo.noIndex).length}`);
console.log(`  missing title     ${rows.filter((r) => !r.seo.metaTitle).length}`);
console.log(`  missing desc      ${rows.filter((r) => !r.seo.metaDescription).length}`);
console.log(`  with banner       ${rows.filter((r) => r.banner).length}`);
console.log(`  was interpolated  ${rows.filter((r) => r.wasInterpolated.length).length}\n`);
