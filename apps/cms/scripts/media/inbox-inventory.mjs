/**
 * WHAT IS ACTUALLY IN THE CLIENT'S PHOTOGRAPH DUMP.
 *
 * Run before anything is compressed, renamed or uploaded. A folder of 688 camera
 * originals is not a content decision until someone can say how many there are,
 * what shape they are, and which of them the site has anywhere to put.
 *
 * ⚠ ORIENTATION IS THE ONE THAT DECIDES PLACEMENT. The site's slots are not
 * interchangeable: a hero banner is a wide crop across the full viewport, a
 * poster card is 4:5 upright, a collage tile is near-square. A folder of 40
 * portrait frames cannot fill a banner however good the photographs are, and
 * finding that out after uploading is finding it out too late.
 *
 * ⚠ EXIF IS READ HERE AND NOWHERE ELSE. The shooting date is real provenance and
 * worth keeping in the manifest; the GPS coordinates in the same block are a
 * hazard on photographs of children and must never reach a public URL. Reading
 * both here is what makes it safe to strip everything later.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SEP = String.fromCharCode(92);
const NL = String.fromCharCode(10);
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../fixtures/inbox-inventory.json');

const ROOTS = process.argv.slice(2);
if (!ROOTS.length) {
  console.error('usage: node scripts/media/inbox-inventory.mjs <folder> [folder…]');
  process.exit(1);
}

const IMAGE = /[.](jpe?g|png|webp|avif|heic|tiff?)$/i;

const files = [];
const walk = (root, d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(root, p);
    else files.push({ root, abs: p, rel: relative(root, p).replaceAll(SEP, '/') });
  }
};
for (const r of ROOTS) walk(resolve(r), resolve(r));

/** Orientation decides which slots a photograph can fill at all. */
function shapeOf(w, h) {
  if (!w || !h) return 'unknown';
  const r = w / h;
  if (r >= 1.6) return 'wide';        /* banner, full-bleed close */
  if (r >= 1.15) return 'landscape';  /* collage tile, split band */
  if (r > 0.85) return 'square';      /* grid, rail */
  return 'portrait';                  /* poster card, 4:5 */
}

const rows = [];
const failed = [];

for (const f of files) {
  const size = statSync(f.abs).size;
  const folder = f.rel.includes('/') ? f.rel.slice(0, f.rel.lastIndexOf('/')) : '(root)';
  const base = { ...f, folder, size, ext: extname(f.abs).toLowerCase() };

  if (!IMAGE.test(f.abs)) { rows.push({ ...base, kind: 'not-an-image' }); continue; }

  try {
    const img = sharp(f.abs, { failOn: 'none' });
    const meta = await img.metadata();
    /* Orientation 5-8 mean the camera stored the frame rotated; width and height
       are the other way round from how the picture actually reads. */
    const turned = (meta.orientation ?? 1) >= 5;
    const w = turned ? meta.height : meta.width;
    const h = turned ? meta.width : meta.height;

    let taken = null, gps = false;
    if (meta.exif) {
      const t = meta.exif.toString('latin1');
      taken = t.match(/((?:19|20)\d\d):(\d\d):(\d\d) \d\d:\d\d:\d\d/)?.[0]?.slice(0, 10).replaceAll(':', '-') ?? null;
      gps = /GPS/.test(t);
    }

    rows.push({ ...base, kind: 'image', w, h, mp: +(w * h / 1e6).toFixed(1), shape: shapeOf(w, h), taken, gps });
  } catch (err) {
    failed.push(`${f.rel}: ${err.message}`);
    rows.push({ ...base, kind: 'unreadable' });
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ roots: ROOTS, generated: new Date().toISOString(), rows }, null, 2));

/* ── report ──────────────────────────────────────────────────────────────── */
const images = rows.filter((r) => r.kind === 'image');
const mb = (n) => (n / 1048576).toFixed(0);
const pad = (s, n) => String(s).padEnd(n);

console.log(`${NL}  CLIENT PHOTOGRAPH INBOX${NL}`);
console.log(`    files            ${rows.length}`);
console.log(`    readable images  ${images.length}`);
console.log(`    total size       ${mb(rows.reduce((a, b) => a + b.size, 0))} MB`);
console.log(`    unreadable       ${rows.filter((r) => r.kind === 'unreadable').length}`);
console.log(`    not images       ${rows.filter((r) => r.kind === 'not-an-image').length}`);
console.log(`    carrying GPS     ${images.filter((r) => r.gps).length}`);
const dated = images.filter((r) => r.taken).map((r) => r.taken).sort();
console.log(`    dated            ${dated.length}${dated.length ? `  (${dated[0]} → ${dated[dated.length - 1]})` : ''}`);

const shapes = {};
for (const r of images) shapes[r.shape] = (shapes[r.shape] ?? 0) + 1;
console.log(`${NL}    shape            ${Object.entries(shapes).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

const small = images.filter((r) => r.w < 1400);
console.log(`    under 1400px wide ${small.length}  — too small for a banner`);

console.log(`${NL}  BY FOLDER${NL}`);
console.log(`    ${pad('folder', 52)}${pad('n', 5)}${pad('MB', 6)}${pad('wide', 6)}${pad('land', 6)}${pad('sq', 5)}${pad('port', 6)}dates`);
const byFolder = {};
for (const r of rows) (byFolder[`${r.root.split(SEP).pop().split('/').pop()}/${r.folder}`] ??= []).push(r);
for (const [folder, list] of Object.entries(byFolder).sort()) {
  const im = list.filter((r) => r.kind === 'image');
  const c = (s) => im.filter((r) => r.shape === s).length || '';
  const ds = [...new Set(im.map((r) => r.taken).filter(Boolean))].sort();
  const span = ds.length ? (ds[0] === ds[ds.length - 1] ? ds[0] : `${ds[0]} → ${ds[ds.length - 1]}`) : '—';
  console.log(`    ${pad(folder.slice(0, 50), 52)}${pad(list.length, 5)}${pad(mb(list.reduce((a, b) => a + b.size, 0)), 6)}${pad(c('wide'), 6)}${pad(c('landscape'), 6)}${pad(c('square'), 5)}${pad(c('portrait'), 6)}${span}`);
}

if (failed.length) {
  console.log(`${NL}  ⚠ unreadable${NL}`);
  for (const f of failed) console.log(`    ${f}`);
}
console.log(`${NL}  written to scripts/fixtures/inbox-inventory.json${NL}`);
