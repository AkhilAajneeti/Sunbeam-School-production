/**
 * PRODUCTION DIFF, PART TWO — the things text comparison cannot see.
 *
 *     node scripts/verify/prod-head.mjs /  /about/history-legacy/
 *     node scripts/verify/prod-head.mjs --all
 *
 * prod-diff.mjs compares what the page SAYS. Three kinds of regression survive
 * that comparison untouched, and all three matter here:
 *
 *   · SEO — <title> is text, but description, canonical, robots and Open Graph
 *     are attributes. A page can read identically and be de-indexed.
 *   · ANIMATION — every reveal in this project is driven by a data- attribute
 *     (data-split, data-reveal, data-hero, data-track…). Losing one in a
 *     component swap costs the animation with no visible diff in the HTML text.
 *   · ANCHORS AND ROUTES — id= targets that links point at, and whether the
 *     local build produces the same set of URLs the live site does.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../../../web/dist');
const PROD = 'https://sunbeam-school-lemon.vercel.app';

const meta = (html, re) => (html.match(re)?.[1] ?? null);

/** The head fields that decide how a page is indexed and shared. */
function seoOf(html) {
  return {
    title: meta(html, /<title>([\s\S]*?)<\/title>/i),
    description: meta(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: meta(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    robots: meta(html, /<meta\s+name="robots"\s+content="([^"]*)"/i),
    ogTitle: meta(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i),
    ogDescription: meta(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i),
    ogType: meta(html, /<meta\s+property="og:type"\s+content="([^"]*)"/i),
  };
}

/** Every data- hook, counted. GSAP finds its targets through these. */
function hooks(html) {
  const out = new Map();
  for (const m of html.matchAll(/\sdata-([a-z0-9-]+)(?==|[\s>])/g)) {
    /* Astro stamps a per-component scope id that legitimately differs build to
       build; it is styling, not behaviour. */
    if (m[1].startsWith('astro-cid')) continue;
    out.set(m[1], (out.get(m[1]) ?? 0) + 1);
  }
  return out;
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

async function localRoutes() {
  const found = [];
  const walk = async (dir, base = '') => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) await walk(join(dir, e.name), `${base}/${e.name}`);
      else if (e.name === 'index.html') found.push(`${base}/`);
    }
  };
  await walk(DIST);
  return found.sort();
}

/* ── route sets, both directions ─────────────────────────────────────────── */
const local = await localRoutes();
const sitemapUrls = async (base) => {
  const idx = await (await fetch(`${base}/sitemap-index.xml`)).text();
  const files = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const all = [];
  for (const f of files) {
    const body = await (await fetch(f.replace(/^https?:\/\/[^/]+/, base))).text();
    all.push(...[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(/^https?:\/\/[^/]+/, '')));
  }
  return [...new Set(all)].sort();
};

const remoteSitemap = await sitemapUrls(PROD);
const localSet = new Set(local);
const remoteSet = new Set(remoteSitemap);
const missingLocally = remoteSitemap.filter((u) => !localSet.has(u));
const extraLocally = [...localSet].filter((u) => !remoteSet.has(u) && u !== '/404/');

console.log(`\n  ROUTES  local ${local.length} built · production sitemap ${remoteSitemap.length}`);
console.log(`    in production but not built locally  ${missingLocally.length}${missingLocally.length ? ` — ${missingLocally.slice(0, 8).join(' ')}` : ''}`);
console.log(`    built locally but not in the sitemap ${extraLocally.length}${extraLocally.length ? ` — ${extraLocally.slice(0, 8).join(' ')}` : ''}`);

/* ── per-route head, hooks and anchors ───────────────────────────────────── */
const argv = process.argv.slice(2);
const list = argv.includes('--all') ? local : argv.filter((a) => a.startsWith('/'));

let clean = 0;
const problems = [];

for (const route of list) {
  const file = join(DIST, route === '/' ? 'index.html' : join(route, 'index.html'));
  const localHtml = await readFile(file, 'utf8');
  const res = await fetch(`${PROD}${route}`);
  if (!res.ok) { problems.push({ route, notes: [`production ${res.status}`] }); continue; }
  const remoteHtml = await res.text();

  const notes = [];

  const [a, b] = [seoOf(localHtml), seoOf(remoteHtml)];
  for (const k of Object.keys(a)) {
    if (a[k] !== b[k]) notes.push(`${k}: ${JSON.stringify(b[k])} → ${JSON.stringify(a[k])}`);
  }

  const [ha, hb] = [hooks(localHtml), hooks(remoteHtml)];
  for (const [k, n] of hb) {
    const got = ha.get(k) ?? 0;
    if (got !== n) notes.push(`data-${k}: ${n} → ${got}`);
  }
  for (const [k, n] of ha) if (!hb.has(k)) notes.push(`data-${k}: 0 → ${n} (new)`);

  const [ia, ib] = [ids(localHtml), ids(remoteHtml)];
  const lostIds = [...ib].filter((x) => !ia.has(x));
  if (lostIds.length) notes.push(`anchors lost: ${lostIds.join(' ')}`);

  if (notes.length === 0) clean++;
  else problems.push({ route, notes });
}

console.log(`\n  HEAD / HOOKS / ANCHORS  ${clean}/${list.length} identical\n`);
for (const p of problems) {
  console.log(`  ✗ ${p.route}`);
  for (const n of p.notes) console.log(`      ${n}`);
}
console.log('');
process.exit(problems.length || missingLocally.length ? 1 : 0);
