/**
 * IS EACH SLOT HOLDING THE PHOTOGRAPH IT REPLACED?
 *
 * ⚠ THIS IS THE CHECK THAT CATCHES A WRONG PICTURE. Every other check in this
 * migration asks whether a slot is populated. A slot can be populated, render
 * cleanly, pass the text diff and the alt comparison, and still show a different
 * photograph — because media reuse is BY NAME, and fourteen of these assets are
 * called 01.jpg, 02.jpg, 03.jpg or 05.jpg, one per school-activity folder.
 *
 * So the PICTURE is compared, not the name and not the bytes. Strapi re-encodes
 * every upload, so the stored file is never byte-identical to the source; and a
 * name check cannot help, because reuse-by-name returns whatever already carried
 * that name. Both images are reduced to a 16x16 greyscale average hash, which
 * survives re-encoding and differs completely between two different pictures.
 */
import { readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { withStrapi } from '../lib/strapi.mjs';

const NL = String.fromCharCode(10);
const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const UPLOADS = resolve(HERE, '../../public/uploads');
const plan = JSON.parse(readFileSync(resolve(HERE, '../fixtures/academics-photo-plan.json'), 'utf8'));

/** A 16x16 average hash: 1 where the pixel is above the frame's mean. */
async function aHash(file) {
  const { data } = await sharp(file).greyscale().resize(16, 16, { fit: 'fill' })
    .raw().toBuffer({ resolveWithObject: true });
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  return [...data].map((v) => (v > mean ? '1' : '0')).join('');
}

/** Hamming distance, as a count of differing bits out of 256. */
const drift = (a, b) => {
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++;
  return n;
};

await withStrapi(async (app) => {
  const rows = await app.documents('api::academic-topic.academic-topic').findMany({
    fields: ['route'], pagination: { limit: -1 }, status: 'published',
    populate: { photos: { fields: ['key'], populate: { image: { fields: ['name', 'hash', 'ext'] } } } },
  });
  const got = new Map(rows.map((r) => [r.route, r.photos ?? []]));

  let checked = 0, ok = 0;
  const wrong = [], absent = [];

  for (const [route, slots] of Object.entries(plan)) {
    for (const s of slots) {
      checked++;
      const slot = (got.get(route) ?? []).find((h) => h.key === s.key);
      const img = slot?.image;
      if (!img) { absent.push(`${route} ${s.key}`); continue; }

      const stored = resolve(UPLOADS, `${img.hash}${img.ext}`);
      const source = resolve(WEB, s.asset);
      if (!existsSync(stored)) { absent.push(`${route} ${s.key} — ${img.hash}${img.ext} not on disk`); continue; }
      if (!existsSync(source)) { absent.push(`${route} ${s.key} — source ${s.asset} not on disk`); continue; }

      /* Re-encoding moves a handful of bits; a different photograph moves a
         large fraction of them. */
      const d = drift(await aHash(stored), await aHash(source));
      if (d <= 16) ok++;
      else wrong.push(`${route} ${s.key}  (${d}/256 bits differ)`
        + `${NL}        wants  ${s.asset}`
        + `${NL}        holds  ${img.name} (${img.hash}${img.ext})`);
    }
  }

  console.log('\n  ACADEMICS PHOTOGRAPHS — PICTURE COMPARISON\n');
  console.log(`    slots checked   ${checked}`);
  console.log(`    same picture    ${ok}`);
  console.log(`    wrong picture   ${wrong.length}`);
  console.log(`    unresolved      ${absent.length}`);
  if (wrong.length) { console.log('\n  wrong picture:\n'); for (const w of wrong) console.log(`      ${w}`); }
  if (absent.length) { console.log('\n  unresolved:\n'); for (const a of absent) console.log(`      ${a}`); }
  console.log(wrong.length || absent.length ? '' : '\n  ✔ every slot holds the photograph it replaced\n');
  if (wrong.length || absent.length) process.exitCode = 1;
});
