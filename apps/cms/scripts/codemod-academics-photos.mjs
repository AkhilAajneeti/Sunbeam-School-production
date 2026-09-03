/**
 * SWAP THE 85 LOCAL PHOTOGRAPH IMPORTS FOR THE STRAPI SLOTS THE SEED WROTE.
 *
 * ═══ WHAT CHANGES, AND WHAT MUST NOT ═══════════════════════════════════════
 *
 *   -  import pBench from '../../../assets/photos/sb-chem-lab.jpg';
 *   +  const pBench = ac.pic('pBench');
 *
 *   -  <Picture src={pBench} alt={`...`} formats={['webp']} widths={[340,600]} …/>
 *   +  <SmartImage file={pBench} alt={ac.picAlt('pBench')} widths={[340,600]} …/>
 *
 * The binding keeps its name, so nothing below the declaration moves: the
 * layout, the GSAP timeline, the scoped CSS and the responsive rules are
 * untouched, exactly as in the const swap G8 did.
 *
 * ⚠ widths, sizes, loading, decoding, fetchpriority AND style ARE CARRIED OVER
 * VERBATIM. They are design. `formats` is the one attribute dropped, because it
 * is Astro's local-pipeline instruction and has no meaning for a Strapi file
 * whose derivatives were made at upload time.
 *
 * ⚠ THE SWAP MAP IS READ, NOT GUESSED. It is written by the extractor and the
 * seed acts on the same plan, so the codemod cannot rewire a picture the seed
 * did not actually store. A key the seed never wrote would render nothing —
 * silently, because SmartImage renders nothing for a null file.
 *
 * ⚠ PageHero IS NOT TOUCHED. Its banner already comes from page-meta.heroBanner
 * and its `src` is the required local fallback for a route without one.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const SEP = String.fromCharCode(92);
const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../web/src');
const SWAP = JSON.parse(readFileSync(resolve(HERE, 'fixtures/academics-photo-swap.json'), 'utf8'));
const PLAN = JSON.parse(readFileSync(resolve(HERE, 'fixtures/academics-photo-plan.json'), 'utf8'));

const DRY = process.argv.includes('--dry');

/** Every slot whose description now lives in Strapi, so the markup can read it. */
const altInCms = new Set();
for (const [route, slots] of Object.entries(PLAN))
  for (const s of slots) if (!s.altInCode) altInCms.add(`${route} ${s.key}`);

/** The attribute value starting at `i`, balanced across nested braces. */
function valueAt(src, i) {
  if (src[i] === '"' || src[i] === "'") {
    const end = src.indexOf(src[i], i + 1);
    return end === -1 ? null : { raw: src.slice(i, end + 1), end: end + 1 };
  }
  if (src[i] !== '{') return null;
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) return { raw: src.slice(i, j + 1), end: j + 1 };
  }
  return null;
}

/** The bounds of the opening tag containing `i`. */
function tagAt(src, i) {
  const from = src.lastIndexOf('<', i);
  let depth = 0;
  for (let j = from; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') depth--;
    else if (src[j] === '>' && depth === 0) return { from, to: j + 1 };
  }
  return null;
}

/** Drop one attribute from a tag, whatever quoting or brace nesting it uses. */
function dropAttr(tag, name) {
  const i = tag.search(new RegExp('\\s' + name + '='));
  if (i === -1) return tag;
  const v = valueAt(tag, tag.indexOf('=', i) + 1);
  return v ? tag.slice(0, i) + tag.slice(v.end) : tag;
}

let files = 0, sites = 0, imports = 0, skipped = 0;
const problems = [];

for (const [rel, entry] of Object.entries(SWAP)) {
  const abs = resolve(WEB, rel);
  let src = readFileSync(abs, 'utf8');
  const before = src;
  /**
   * WARNING: THIS RUNS OVER FILES THAT ARE ALREADY PART-MIGRATED.
   * The first, narrow pass moved eighty-four photographs; the plan is now the
   * complete two hundred and seven, read from the last commit. A binding that
   * already reads from the record is left alone - re-running the tag rewrite
   * over a <SmartImage> would strip the alt it just gained.
   */
  const already = (binding) =>
    new RegExp('const[ ]+' + binding + '[ ]*=[ ]*ac[0-9]*[.]pic[(]').test(src);

  const bindings = new Map();
  for (const u of entry.uses) if (!already(u.binding)) bindings.set(u.binding, u);
  if (!bindings.size) { skipped++; continue; }

  /* ── 1 · the tags ────────────────────────────────────────────────────────
     Rewritten back to front, so an earlier replacement never shifts the index
     of one still to be made. */
  /**
   * WARNING: ONE EDIT PER TAG, NOT ONE PER SWAP ROW.
   * A binding used twice on a page has two rows in the swap, and scanning the
   * file once per row finds BOTH tags each time - four edits for two pictures,
   * applied over the top of each other. The bindings are scanned once and the
   * rows are matched to the tags in document order, which is the order the
   * extractor recorded them in.
   */
  const edits = [];
  for (const binding of bindings.keys()) {
    /* A reference slot has no tag to rewrite - the binding is handed over as an
       object property, keeps its name, and every use of it still resolves. Only
       its import becomes a declaration. */
    const rows = entry.uses.filter((u) => u.binding === binding && u.component !== 'reference');
    if (!rows.length) continue;
    const re = new RegExp('(?:src|file|photo|image)=[{]' + binding + '[}]', 'g');
    let n = 0;
    for (const m of src.matchAll(re)) {
      const t = tagAt(src, m.index);
      if (!t) { problems.push(`${rel}: unterminated tag around ${binding}`); continue; }
      edits.push({ ...t, use: rows[n] ?? rows[rows.length - 1] });
      n++;
    }
    if (n !== rows.length) problems.push(`${rel}: ${binding} has ${rows.length} planned site(s) but ${n} tag(s)`);
  }

  for (const e of edits.sort((a, b) => b.from - a.from)) {
    let tag = src.slice(e.from, e.to);
    const comp = tag.match(/^<\s*([A-Za-z0-9_]+)/)?.[1];
    const { binding, key } = e.use;

    /* Photo and AsClose already take a file; only the prop name and the source
       of the picture change. Picture becomes SmartImage, which is the component
       that accepts either shape. */
    if (comp === 'Picture') {
      tag = tag.replace(/^<\s*Picture/, '<SmartImage').replace(/<\/Picture>$/, '');
      tag = tag.replace(new RegExp('[ ]src=[{]' + binding + '[}]'), ` file={${binding}}`);
      tag = dropAttr(tag, 'formats');
    } else if (comp === 'Photo') {
      tag = tag.replace(new RegExp('[ ]src=[{]' + binding + '[}]'), ` file={${binding}}`);
    }
    /* AsClose already receives `photo={binding}` and now accepts a Strapi file;
       its own markup was changed once, not eighteen times. */

    if (altInCms.has(`${entry.route} ${key}`)) {
      const ai = tag.search(/\salt=/);
      if (ai !== -1) {
        const v = valueAt(tag, tag.indexOf('=', ai) + 1);
        if (v) tag = tag.slice(0, ai) + ` alt={ac.picAlt('${key}')}` + tag.slice(v.end);
      }
    }

    src = src.slice(0, e.from) + tag + src.slice(e.to);
    sites++;
  }

  /* ── 2 · the imports ─────────────────────────────────────────────────────
     Removed, and replaced by a declaration in the same order the imports were
     in, so a reviewer reads the same list of pictures in the same sequence. */
  const decls = [];
  for (const binding of bindings.keys()) {
    /* Matched line by line rather than by a regex that has to swallow its own
       newline - these files are a mix of LF and CRLF, and a pattern that gets
       that wrong leaves a blank line in the frontmatter of forty components. */
    const isImport = (l) =>
      l.startsWith('import ' + binding + ' from ') && l.includes('assets/');
    const lines = src.split(String.fromCharCode(10));
    const at = lines.findIndex((l) => isImport(l.trim()));
    if (at === -1) { problems.push(`${rel}: no import to remove for ${binding}`); continue; }
    lines.splice(at, 1);
    src = lines.join(String.fromCharCode(10));
    imports++;
    decls.push(`const ${binding} = ac.pic('${bindings.get(binding).key}');`);
  }

  /* ── 3 · the record, for the four files that had none ─────────────────── */
  if (!/getAcademicTopic\(/.test(src)) {
    const up = '../'.repeat(rel.split('/').length - 1);
    src = src.replace(
      /^(import [^\n]*\n)(?![\s\S]*^import )/m,
      `$1import { getAcademicTopic } from '${up}lib/cms';\n`,
    );
    const lastImport = src.lastIndexOf('\nimport ');
    const eol = src.indexOf('\n', lastImport + 1);
    src = src.slice(0, eol + 1) +
      `\nconst ac = await getAcademicTopic('${entry.route}');\n` + src.slice(eol + 1);
  }

  /* ── 4 · the declarations, after whatever binds `ac` ──────────────────── */
  if (decls.length) {
    const m = src.match(/^const ac\d* = await getAcademicTopic\('[^']+'\);$/m);
    if (!m) problems.push(`${rel}: nowhere to put the photograph declarations`);
    else {
      const at = src.indexOf(m[0]) + m[0].length;
      src = src.slice(0, at) + '\n' + decls.join('\n') + src.slice(at);
    }
  }

  /* ── 5 · the SmartImage import, and Picture only if it is now unused ──── */
  if (/<SmartImage/.test(src) && !/import SmartImage/.test(src)) {
    const up = '../'.repeat(rel.split('/').length - 1);
    const path = rel.startsWith('components/ui/') ? './SmartImage.astro' : `${up}components/ui/SmartImage.astro`;
    src = src.replace(/^(import [^\n]*\n)/m, `$1import SmartImage from '${path}';\n`);
  }
  if (/import \{ Picture \} from 'astro:assets';/.test(src) && !/<Picture[\s/>]/.test(src)) {
    src = src.replace(/^import \{ Picture \} from 'astro:assets';\r?\n/m, '');
  }
  if (/import \{ Image, Picture \} from 'astro:assets';/.test(src) && !/<Picture[\s/>]/.test(src)) {
    src = src.replace("import { Image, Picture } from 'astro:assets';", "import { Image } from 'astro:assets';");
  }

  if (src !== before) {
    files++;
    if (!DRY) writeFileSync(abs, src, 'utf8');
  }
}

console.log('\n  ACADEMICS PHOTOGRAPHS — CODEMOD' + (DRY ? '  (dry run)' : '') + '\n');
console.log(`    files rewritten     ${files}`);
console.log(`    render sites        ${sites}`);
console.log(`    imports replaced    ${imports}`);
console.log(`    already migrated    ${skipped} file(s) skipped`);
console.log(`    alt now from Strapi ${altInCms.size} slots`);
if (problems.length) {
  console.log(`\n  ⚠ ${problems.length} problem(s):`);
  for (const p of problems) console.log(`      ${p}`);
  process.exitCode = 1;
} else {
  console.log('\n  ✔ every planned render site was rewritten\n');
}
