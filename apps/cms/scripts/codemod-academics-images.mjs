/**
 * CODEMOD — the image tags that now receive a Strapi file.
 *
 *     node scripts/codemod-academics-images.mjs --dry
 *
 * ═══ WHY A SECOND PASS ═════════════════════════════════════════════════════
 *
 * The first codemod changed where a const's VALUE comes from. Most markup below
 * it did not care. Image tags do: `<Picture src={…}>` and `<Image src={…}>`
 * take an `ImageMetadata` produced by Astro's build-time importer, and a Strapi
 * file is not one. The build fails with
 *
 *     [UnsupportedImageFormat] Received unsupported format `undefined`
 *
 * which is at least loud. `<Photo src={…}>` is the dangerous one: it silently
 * falls back to its labelled placeholder, so the page still renders and the
 * photograph is simply gone.
 *
 * ⚠ ONLY THE TAGS FED BY MIGRATED CONTENT ARE TOUCHED. Every academics page also
 * has banner and decoration photographs that are still local imports and must
 * stay exactly as they are. The test is whether the `src` expression is a
 * MEMBER expression — `s.src`, `gallery[0].src`, `p.photo` — rather than a bare
 * imported identifier.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../web/src');
const DRY = process.argv.includes('--dry');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

const FILES = [
  ...walk(join(WEB_SRC, 'components', 'academics')),
  ...walk(join(WEB_SRC, 'pages', 'academics')),
];

/** The whole `<Tag …/>` starting at `from`, respecting nested braces. */
function tagAt(src, from) {
  let i = src.indexOf('>', from);
  let depth = 0;
  for (let j = from; j < src.length; j++) {
    const c = src[j];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) { i = j; break; }
  }
  return i === -1 ? null : { end: i + 1, text: src.slice(from, i + 1) };
}

const report = [];
let changed = 0;
let converted = 0;

for (const file of FILES) {
  let src = readFileSync(file, 'utf8');
  const rel = relative(WEB_SRC, file).replace(/\\/g, '/');
  const before = src;
  const done = [];

  for (const tag of ['Picture', 'Image']) {
    for (;;) {
      const at = src.indexOf(`<${tag}`);
      if (at === -1) break;

      const found = tagAt(src, at);
      if (!found) break;
      const text = found.text;

      const srcAttr = text.match(/\ssrc=\{([^}]*)\}/);
      /* A bare identifier is a local import and stays exactly as it is. */
      if (!srcAttr || !/[.[]/.test(srcAttr[1])) {
        /* Skip past this tag without changing it. */
        const marker = `<__KEEP_${tag}__`;
        src = src.slice(0, at) + marker + src.slice(at + tag.length + 1);
        continue;
      }

      const expr = srcAttr[1].trim();
      const alt = text.match(/\salt=\{([^}]*)\}/)?.[1] ?? text.match(/\salt="([^"]*)"/)?.[1];
      const sizes = text.match(/\ssizes="([^"]*)"/)?.[1];
      const loading = text.match(/\sloading="([^"]*)"/)?.[1];
      const cls = text.match(/\sclass="([^"]*)"/)?.[1];
      const indent = (src.slice(0, at).match(/\n([ \t]*)$/) ?? [, ''])[1];

      const attrs = [
        `file={${expr}}`,
        alt === undefined ? 'alt=""' : (text.includes('alt={') ? `alt={${alt}}` : `alt="${alt}"`),
        sizes ? `sizes="${sizes}"` : null,
        'fallbackWidth={1100}',
        loading ? `loading="${loading}"` : null,
        cls ? `class="${cls}"` : null,
      ].filter(Boolean);

      const replacement = `<SmartImage\n${attrs.map((a) => `${indent}  ${a}`).join('\n')}\n${indent}/>`;
      src = src.slice(0, at) + replacement + src.slice(found.end);
      done.push(`${tag}(${expr})`);
      converted++;
    }
    src = src.split(`<__KEEP_${tag}__`).join(`<${tag}`);
  }

  if (src === before) continue;

  if (!src.includes('SmartImage.astro')) {
    const lines = src.split('\n');
    let last = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') break;
      if (/^import /.test(lines[i])) last = i;
    }
    const up = '../'.repeat(rel.split('/').length - 1);
    lines.splice(last + 1, 0, `import SmartImage from '${up}ui/SmartImage.astro';`);
    src = lines.join('\n');
  }

  report.push(`  ${rel.padEnd(60)} ${done.join(' ')}`);
  changed++;
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would convert' : 'Converted'} ${converted} image tags in ${changed} files\n`);
console.log(report.sort().join('\n'));
console.log('');
