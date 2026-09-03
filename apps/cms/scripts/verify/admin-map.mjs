/**
 * EVERY CONTENT TYPE IS REACHABLE FROM THE CONTENT MAP.
 *
 * The map is a navigation aid, and a navigation aid that quietly omits a content
 * type is worse than none: an editor concludes the content does not exist. This
 * compares the map's links against the content types on disk.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CMS = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const walk = (d, out = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'schema.json') out.push(p);
  }
  return out;
};

const types = walk(join(CMS, 'src/api')).map((p) => {
  const j = JSON.parse(readFileSync(p, 'utf8'));
  return { uid: `api::${j.info.singularName}.${j.info.singularName}`, name: j.info.displayName, kind: j.kind };
});

const map = readFileSync(join(CMS, 'src/admin/content-map.ts'), 'utf8');
const linked = types.filter((t) => map.includes(`'${t.uid}'`));
const missing = types.filter((t) => !map.includes(`'${t.uid}'`));

console.log(`\n  CONTENT MAP COVERAGE\n`);
console.log(`    content types      ${types.length}`);
console.log(`    reachable from map ${linked.length}`);
console.log(`    not linked         ${missing.length}`);
for (const m of missing) console.log(`      ✗ ${m.name}  (${m.uid})`);
console.log(missing.length ? '' : '\n  ✔ every content type is reachable from the map\n');
process.exitCode = missing.length ? 1 : 0;
