/**
 * A PAGE THAT READS SOMETHING NOTHING DECLARES.
 *
 *     node scripts/verify/orphan-reads.mjs
 *
 * ⚠ WHY THIS EXISTS. The codemod's frontmatter cleanup removes every
 * `const x = ac.pic(...)` and `const x = ac.section(...)`, but a band only
 * captures what it can see. Competitive Exams reads its gallery as `gallery[0]`
 * and hands `pCohort` to a shared closing component as a prop — neither is a
 * `.map(`, so neither was claimed, and both declarations went anyway.
 *
 * Astro says "gallery is not defined" and stops, but only when the build reaches
 * that page — and only for the first one. This finds every such read across the
 * converted pages in one pass, before a build is spent on it.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ACADEMICS = resolve(HERE, '../../../web/src/components/academics');
const FOLDERS = ['structure', 'teaching', 'assessment'];

/**
 * ⚠ ONLY THE PAGES THE CODEMOD HAS CONVERTED. A page still reading its own local
 * data has identifiers this check cannot see, and reporting those would bury the
 * ones that matter. The list comes from the codemod itself, so the two cannot
 * drift apart.
 */
const CONVERTED = new Set(
  [...readFileSync(`${HERE}/../extract/structure-page.mjs`, 'utf8')
    .matchAll(/^\s{2}(\w+Page): \{/gm)].map((m) => `${m[1]}.astro`),
);

/** Names the page gets for free — Astro, the site's own helpers, JS globals. */
const AMBIENT = new Set([
  'Astro', 'Fragment', 'String', 'Number', 'Boolean', 'Math', 'Object', 'Array',
  'JSON', 'Date', 'console', 'undefined', 'null', 'true', 'false', 'set', 'html',
  'class', 'style', 'href', 'src', 'alt', 'id', 'key', 'i', 'e',
  'const', 'let', 'var', 'if', 'else', 'return', 'typeof', 'new', 'await', 'in', 'of',
]);

let problems = 0;
let scanned = 0;

for (const folder of FOLDERS) {
  const dir = `${ACADEMICS}/${folder}`;
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => CONVERTED.has(f))) {
    const src = readFileSync(`${dir}/${file}`, 'utf8');
    const cut = src.indexOf('---', 3);
    if (cut < 0) continue;
    const front = src.slice(0, cut);
    /* ⚠ THE <script> BLOCKS ARE NOT THE TEMPLATE. They are ordinary browser
       JavaScript with their own locals, and reading them turned `const`, `if`
       and every callback parameter into a "missing" name. */
    const tpl = src.slice(cut + 3, src.indexOf('<style>') > 0 ? src.indexOf('<style>') : undefined)
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    scanned += 1;

    /* Everything the frontmatter brings into scope. */
    const declared = new Set([
      ...[...front.matchAll(/^\s*(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]),
      ...[...front.matchAll(/^\s*const\s*\{([^}]*)\}/gm)]
        .flatMap((m) => m[1].split(',').map((x) => x.trim().split(':').pop().trim()))
        .filter(Boolean),
      /* `const [a = '', b = ''] = …` — array destructuring declares names too. */
      ...[...front.matchAll(/^\s*const\s*\[([^\]]*)\]/gm)]
        .flatMap((m) => m[1].split(',').map((x) => x.trim().split('=')[0].trim()))
        .filter(Boolean),
      ...[...front.matchAll(/^import\s+(?:type\s+)?([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]),
      ...[...front.matchAll(/^import\s*\{([^}]*)\}/gm)]
        .flatMap((m) => m[1].split(',').map((x) => x.trim().split(' as ').pop().trim()))
        .filter(Boolean),
    ]);

    /* Every identifier read inside an expression in the template. */
    const reads = new Set();
    /* An expression holding a quote is a string being passed, not a read — the
       words inside it are prose and are not identifiers. */
    for (const expr of (tpl.match(/\{[^{}]*\}/g) ?? []).filter((x) => !/['"`]/.test(x))) {
      for (const m of expr.matchAll(/(?<![\w$.'"])([A-Za-z_$][\w$]*)\s*(?=[.[\]()},?:|&+\s])/g)) {
        reads.add(m[1]);
      }
    }

    const orphans = [...reads].filter((r) => !declared.has(r) && !AMBIENT.has(r)
      /* locals introduced by a callback, e.g. (s, i) => */
      && !new RegExp(`\\(\\s*${r}\\b|,\\s*${r}\\s*\\)`).test(tpl));

    if (orphans.length) {
      console.log(`  ✗ ${folder}/${file}`);
      for (const o of orphans) console.log(`      ${o}`);
      problems += orphans.length;
    }
  }
}

console.log(`\n  ${scanned} page(s) scanned, ${problems} orphaned read(s)\n`);
if (problems) process.exit(1);
