/**
 * CODEMOD — `set:html={…}` fed by migrated content becomes `<RichLine>`.
 *
 * ⚠ THE CMS STORES A MARKER, NOT MARKUP. Prose that carried `<strong>` is
 * stored as `**…**`, so a `set:html` that used to render bold now prints the
 * asterisks. RichLine renders the marker and prints everything else verbatim —
 * which also closes the hole `set:html` leaves open, where anything typed into
 * the admin would reach the page as live markup.
 *
 * ⚠ SVG AND GLYPH SLOTS ARE LEFT ALONE. `set:html={MARK[c.mark]}` injects an
 * icon path from a table in the component; it is not content and must stay.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB_SRC = resolve(HERE, '../../web/src');
const DRY = process.argv.includes('--dry');
/** The Windows path separator, written this way so no shell can mangle it. */
const SEP = String.fromCharCode(92);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.astro')) out.push(f);
  }
  return out;
}

const SKIP = /MARK|glyph|icons?\[|\bpath\b|ICON/;
let n = 0;
const report = [];

for (const file of [...walk(join(WEB_SRC, 'components', 'academics')), ...walk(join(WEB_SRC, 'pages', 'academics'))]) {
  let src = readFileSync(file, 'utf8');
  const before = src;

  src = src.replace(/<(p|span|h1|h2|h3|dd|dt)\b([^>]*?)\sset:html=\{([^}]+)\}([^>]*?)\/>/g, (m, tag, pre, expr, post) => {
    if (SKIP.test(expr)) return m;
    const attrs = (pre + post).trim();
    const cls = attrs.match(/class="([^"]*)"/)?.[1];
    const id = attrs.match(/id=\{([^}]*)\}/)?.[1] ?? attrs.match(/id="([^"]*)"/)?.[1];
    const idIsExpr = /id=\{/.test(attrs);
    const reveal = /\bdata-reveal\b/.test(attrs);
    const delay = attrs.match(/data-reveal-delay=\{([^}]*)\}/)?.[1];
    const split = /\bdata-split\b/.test(attrs);
    n++;
    return [
      '<RichLine',
      `  tag="${tag}"`,
      cls ? `  class="${cls}"` : null,
      id ? (idIsExpr ? `  id={${id}}` : `  id="${id}"`) : null,
      reveal ? '  reveal' : null,
      delay ? `  revealDelay={${delay}}` : null,
      split ? '  split' : null,
      `  text={${expr}}`,
      '/>',
    ].filter(Boolean).join('\n');
  });

  if (src === before) continue;
  if (!/^import RichLine/m.test(src)) {
    const lines = src.split('\n');
    let last = 0;
    for (let i = 1; i < lines.length; i++) { if (lines[i] === '---') break; if (/^import /.test(lines[i])) last = i; }
    const up = relative(dirname(file), join(WEB_SRC, 'components', 'ui', 'RichLine.astro')).split(SEP).join('/');
    lines.splice(last + 1, 0, `import RichLine from '${up.startsWith('.') ? up : `./${up}`}';`);
    src = lines.join('\n');
  }
  report.push(`  ${relative(WEB_SRC, file).split(SEP).join('/')}`);
  if (!DRY) writeFileSync(file, src, 'utf8');
}

console.log(`\n  ${DRY ? 'Would convert' : 'Converted'} ${n} set:html in ${report.length} files\n${report.join('\n')}\n`);
