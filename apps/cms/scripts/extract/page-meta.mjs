/**
 * EXTRACT — route-level SEO and hero content from the .astro files.
 *
 *     node scripts/extract/page-meta.mjs          write the fixture
 *     node scripts/extract/page-meta.mjs --print  show it without writing
 *
 * ═══ WHY AN EXTRACTOR AND NOT A DATA FILE ══════════════════════════════════
 *
 * Every other migration so far read a `.ts` data module. Route metadata was
 * never in one — each page hardcodes its own <title>, meta description and
 * PageHero props in its frontmatter. So it has to be lifted out of the source,
 * and the result is written to a FIXTURE that is committed and diffable rather
 * than piped straight into the database. If the extraction is wrong, it is wrong
 * somewhere a human can read.
 *
 * ═══ WHAT IS DELIBERATELY SKIPPED ══════════════════════════════════════════
 *
 * ⚠ DYNAMIC ROUTES. `[slug].astro` and `[...slug].astro` build their titles
 * from the record they are rendering — an alumni meet's title is the meet's
 * title. Their SEO belongs to their own content type, not to page-meta, and
 * putting one row per generated page here would mean re-seeding page-meta every
 * time the school publishes a notice.
 *
 * ⚠ INTERPOLATED TITLES. A handful of static routes build their title with
 * `${school.name}`. Storing the RESOLVED string would freeze the school's name
 * into 68 rows and quietly break the single-source-of-truth that site-settings
 * exists to provide. They are reported as `needsReview` and left in code for a
 * decision rather than silently flattened.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGES = resolve(HERE, '../../../web/src/pages');
const WEB_SRC = resolve(HERE, '../../../web/src');
const OUT = resolve(HERE, '../fixtures/page-meta.parsed.json');

const PRINT = process.argv.includes('--print');

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (e.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

/** File path → the URL it serves, in the site's trailing-slash form. */
function routeOf(file) {
  let r = relative(PAGES, file).split(sep).join('/').replace(/\.astro$/, '');
  if (r === 'index') return '/';
  r = r.replace(/\/index$/, '');
  return `/${r}/`;
}

/**
 * Pull one JSX attribute's raw value.
 * Handles  attr="…"  ·  attr={`…`}  ·  attr={'…'}  ·  attr={[…]}
 */
function attr(block, name) {
  const dq = block.match(new RegExp(`\\b${name}="([^"]*)"`));
  if (dq) return { raw: dq[1], kind: 'string' };

  const tpl = block.match(new RegExp(`\\b${name}=\\{\`([\\s\\S]*?)\`\\}`));
  if (tpl) return { raw: tpl[1], kind: tpl[1].includes('${') ? 'template' : 'string' };

  const sq = block.match(new RegExp(`\\b${name}=\\{'([^']*)'\\}`));
  if (sq) return { raw: sq[1], kind: 'string' };

  const expr = block.match(new RegExp(`\\b${name}=\\{([^}]*)\\}`));
  if (expr) return { raw: expr[1].trim(), kind: 'expr' };

  return null;
}

/** The opening tag of `<Component …>` including a multi-line prop list. */
function openingTag(src, component) {
  const i = src.indexOf(`<${component}`);
  if (i === -1) return null;
  /* Walk to the matching '>' that closes the opening tag, ignoring '>' inside
     braces (crumbs arrays contain none, but template literals can). */
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (ch === '>' && depth === 0) return src.slice(i, j + 1);
  }
  return null;
}

/**
 * `crumbs={[{ label: 'Home', href: '/' }]}` → [{label,href}]
 *
 * ⚠ SINGLE *OR* DOUBLE QUOTES. The first version matched only single quotes and
 * came back empty for five routes — career.astro, history-legacy.astro and the
 * others written with double quotes. Nothing errored; those pages would simply
 * have lost their breadcrumbs on migration. This is the third time in this
 * project that assuming one quote style has silently dropped data.
 */
function parseCrumbs(block) {
  const m = block.match(/crumbs=\{(\[[\s\S]*?\])\}/);
  if (!m) return [];
  const out = [];
  const re = /label:\s*['"]([^'"]*)['"]\s*,\s*href:\s*['"]([^'"]*)['"]/g;
  let g;
  while ((g = re.exec(m[1]))) out.push({ label: g[1], href: g[2] });
  return out;
}

/** `src={heroPhoto}` + `import heroPhoto from '../assets/x.jpg'` → abs path. */
function resolveBanner(src, file) {
  const s = attr(openingTag(src, 'PageHero') ?? '', 'src');
  if (!s || s.kind !== 'expr') return null;
  const varName = s.raw.replace(/\s.*$/, '');
  const imp = src.match(new RegExp(`import\\s+${varName}\\s+from\\s+['"]([^'"]+)['"]`));
  if (!imp) return null;
  return resolve(dirname(file), imp[1]);
}

const files = (await walk(PAGES)).sort();
const rows = [];
const skipped = [];

for (const file of files) {
  const rel = relative(PAGES, file).split(sep).join('/');

  if (rel.includes('[')) {
    skipped.push({ route: routeOf(file), reason: 'dynamic route — SEO belongs to its content type' });
    continue;
  }

  const src = await readFile(file, 'utf8');
  const layout = openingTag(src, 'BaseLayout');
  if (!layout) {
    skipped.push({ route: routeOf(file), reason: 'no BaseLayout — not a standard page' });
    continue;
  }

  const title = attr(layout, 'title');
  const description = attr(layout, 'description');
  const robots = attr(layout, 'robots');

  const heroTag = openingTag(src, 'PageHero') ?? '';
  const heroTitle = attr(heroTag, 'title');
  const heroStandfirst = attr(heroTag, 'standfirst');
  const heroAlt = attr(heroTag, 'alt');
  const heroPosition = attr(heroTag, 'position');

  const needsReview = [];
  for (const [k, v] of Object.entries({ title, description, heroTitle, heroStandfirst, heroAlt })) {
    if (v && v.kind !== 'string') needsReview.push(`${k} is ${v.kind}: ${v.raw.slice(0, 60)}`);
  }

  const bannerAbs = resolveBanner(src, file);

  rows.push({
    route: routeOf(file),
    file: rel,
    seo: {
      metaTitle: title?.kind === 'string' ? title.raw : null,
      metaDescription: description?.kind === 'string' ? description.raw : null,
      noIndex: Boolean(robots?.raw?.includes('noindex')),
    },
    heroTitle: heroTitle?.kind === 'string' ? heroTitle.raw : null,
    heroStandfirst: heroStandfirst?.kind === 'string' ? heroStandfirst.raw : null,
    heroAlt: heroAlt?.kind === 'string' ? heroAlt.raw : null,
    heroPosition: heroPosition?.kind === 'string' ? heroPosition.raw : null,
    banner: bannerAbs ? relative(WEB_SRC, bannerAbs).split(sep).join('/') : null,
    crumbs: parseCrumbs(heroTag),
    needsReview,
  });
}

const clean = rows.filter((r) => r.needsReview.length === 0);
const review = rows.filter((r) => r.needsReview.length > 0);

const payload = { generatedFrom: 'apps/web/src/pages', rows };

if (PRINT) {
  console.log(JSON.stringify(payload, null, 2).slice(0, 4000));
} else {
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

console.log(`\n  routes extracted   ${rows.length}`);
console.log(`  fully literal      ${clean.length}`);
console.log(`  need review        ${review.length}`);
console.log(`  with a banner      ${rows.filter((r) => r.banner).length}`);
console.log(`  with crumbs        ${rows.filter((r) => r.crumbs.length).length}`);
console.log(`  skipped            ${skipped.length}`);
if (review.length) {
  console.log('\n  NEEDS REVIEW');
  for (const r of review) console.log(`    ${r.route.padEnd(46)} ${r.needsReview[0]}`);
}
if (skipped.length) {
  console.log('\n  SKIPPED');
  for (const s of skipped) console.log(`    ${s.route.padEnd(46)} ${s.reason}`);
}
console.log('');
