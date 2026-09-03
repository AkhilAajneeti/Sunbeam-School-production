/**
 * API SMOKE TEST — can the site's own token actually read this database?
 *
 *     node scripts/verify/api-smoke.mjs
 *
 * ⚠ USES THE WEB APP'S TOKEN, NOT AN ADMIN SESSION. An API token is a row in
 * `strapi_api_tokens`, so a restore that lost or mangled that table would leave
 * a database that looks perfect in the admin and returns 401 to the site. That
 * is the sort of thing a rehearsal exists to find, and it can only be found by
 * asking the same way the frontend asks.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_ENV = resolve(HERE, '../../../web/.env');

const env = readFileSync(WEB_ENV, 'utf8');
const pick = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim();
const URL_BASE = pick('STRAPI_URL') ?? 'http://127.0.0.1:1337';
const TOKEN = pick('STRAPI_TOKEN');
if (!TOKEN) throw new Error(`No STRAPI_TOKEN in ${WEB_ENV}`);

/** Collections carry a pagination total; single types return one object. */
const ENDPOINTS = [
  ['/api/notices', 24],
  ['/api/news-items', 65],
  ['/api/page-metas', 74],
  ['/api/bus-routes', 28],
  ['/api/alumni', 3],
  ['/api/games', 15],
  ['/api/leader-messages', 2],
  ['/api/homepage', 1],
  ['/api/site-setting', 1],
  ['/api/history-page', 1],
  ['/api/vision-mission-page', 1],
  ['/api/disclosure-page', 1],
  ['/api/teachers', 131],
  ['/api/uniform-page', 1],
  ['/api/result-page', 1],
  ['/api/tc-page', 1],
  ['/api/contact-page', 1],
];

let failures = 0;
console.log(`\n  ${URL_BASE}\n`);

for (const [path, expected] of ENDPOINTS) {
  const url = `${URL_BASE}${path}?pagination[pageSize]=1`;
  let line;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) {
      line = `HTTP ${res.status}`;
      failures++;
    } else {
      const body = await res.json();
      const got = body.meta?.pagination?.total
        ?? (Array.isArray(body.data) ? body.data.length : (body.data ? 1 : 0));
      const ok = got === expected;
      if (!ok) failures++;
      line = `${ok ? '✔' : '✖'} ${String(got).padStart(4)} records (expected ${expected})`;
    }
  } catch (err) {
    line = `✖ ${err.message}`;
    failures++;
  }
  console.log(`    ${path.padEnd(32)} ${line}`);
}

/**
 * ⚠ AND ONE DEEP READ. A count proves the rows are there; it does not prove the
 * components and media hanging off them survived. The homepage is the widest
 * record in the project, so it is the one worth opening.
 */
try {
  const res = await fetch(
    `${URL_BASE}/api/homepage?populate[heroSlides][populate][image]=true&populate[facilities][populate][shots][populate][image]=true&populate[storyParagraphs]=true`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  const h = (await res.json()).data;
  const slides = h?.heroSlides ?? [];
  const facilities = h?.facilities ?? [];
  const shots = facilities.flatMap((f) => f.shots ?? []);
  const withImages = slides.filter((s) => s.image).length;
  const shotImages = shots.filter((s) => s.image).length;
  const ok = slides.length === 10 && withImages === 10 && shots.length === 15 && shotImages === 15
    && (h?.storyParagraphs ?? []).length === 3;
  if (!ok) failures++;
  console.log(`\n    ${'homepage deep read'.padEnd(32)} ${ok ? '✔' : '✖'} ${slides.length} slides (${withImages} with media), ${shots.length} facility shots (${shotImages} with media), ${(h?.storyParagraphs ?? []).length} story paragraphs`);
} catch (err) {
  console.log(`\n    homepage deep read               ✖ ${err.message}`);
  failures++;
}

console.log(failures === 0 ? '\n  ✔ API reads the database correctly\n' : `\n  ✖ ${failures} check(s) failed\n`);
process.exit(failures ? 1 : 0);
