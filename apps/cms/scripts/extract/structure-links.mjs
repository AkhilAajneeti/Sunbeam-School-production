/**
 * RESOLVE THE LINKS THE FIRST PASS LEFT AS MARKUP.
 *
 *     node scripts/extract/structure-links.mjs [--write]
 *
 * ⚠ WHAT THIS IS FIXING, AND HOW IT WAS FOUND.
 *
 * The codemod turned `<a href="/literal/">` into RichLine's `[text](/href/)` but
 * walked straight past `<a class="sc-link" href={CURRICULUM}>PRECEPT</a>` —
 * these pages link through route CONSTANTS, not literals. Sixteen paragraphs
 * kept their markup as text, and `{' '}` whitespace helpers came with them. The
 * build was clean and the pages rendered the tags as words.
 *
 * The production text comparison caught it, which is the whole reason that check
 * exists: nothing else in the chain would have.
 *
 * So: read each page's own `const NAME = '/route/'` declarations, resolve every
 * `href={NAME}`, and write the link back as a marker. The anchor's class is
 * recorded per paragraph and handed to the page, because what a link LOOKS like
 * belongs to the page and not to the sentence.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = resolve(HERE, '../fixtures');
const STRUCT = resolve(HERE, '../../../web/src/components/academics/structure');

const WRITE = process.argv.includes('--write');

const PAGES = [
  { page: 'SecondaryPage', fixture: 'secondary-stage' },
  { page: 'SeniorSecondaryPage', fixture: 'senior-secondary' },
  { page: 'MiddleSchoolPage', fixture: 'middle-school' },
  { page: 'PrimaryPage', fixture: 'primary-stage' },
  { page: 'PrePrimaryPage', fixture: 'pre-primary' },
  { page: 'StreamsOfferedPage', fixture: 'streams-offered' },
  { page: 'SubjectCombinationsPage', fixture: 'subject-combinations' },
];

const problems = [];
const linkClasses = {};

for (const { page, fixture } of PAGES) {
  let file;
  try { file = readFileSync(`${FX}/${fixture}.json`, 'utf8'); } catch { continue; }
  const src = readFileSync(`${STRUCT}/${page}.astro`, 'utf8');

  /** The page's own route constants. */
  const routes = Object.fromEntries(
    [...src.matchAll(/^const ([A-Z_]+) = '([^']+)';$/gm)].map((m) => [m[1], m[2]]),
  );

  const fx = JSON.parse(file);
  let fixed = 0;
  const classes = {};

  for (const [band, b] of Object.entries(fx)) {
    b.body = (b.body ?? []).map((text, i) => {
      let t = text;

      /* JSX whitespace helpers are a space and nothing more. */
      t = t.split("{' '}").join(' ');

      /* `{S}` is the page's own shorthand for the school's name; the fixture
         carries the same `{schoolName}` token every other fixture uses. */
      t = t.split('{S}').join('{schoolName}');
      t = t.split('{school.name}').join('{schoolName}');

      t = t.replace(/<a class="([^"]+)" href=\{([A-Z_]+)\}>([\s\S]*?)<\/a>/g, (m, cls, name, label) => {
        const href = routes[name];
        if (!href) { problems.push(`${fixture}.${band}[${i}]: no route constant named ${name}`); return m; }
        classes[`${band}.${i}`] = cls;
        fixed += 1;
        return `[${label}](${href})`;
      });

      /* Anything still carrying a tag or an expression must be reported —
         except the site's own {token}s, which are what a fixture is meant to
         hold and which the query fills in. */
      const residue = t.replace(/\{[a-z][A-Za-z]*\}/g, '');
      if (/<[a-zA-Z/]|\{/.test(residue)) {
        problems.push(`${fixture}.${band}[${i}]: still holds ${residue.match(/<[^>]{0,40}|\{[^}]{0,20}/)?.[0]}`);
      }
      return t.replace(/\s+/g, ' ').trim();
    });
  }

  if (Object.keys(classes).length) linkClasses[page] = classes;
  console.log(`  ${fixture.padEnd(18)} ${fixed} link(s) resolved`);
  if (WRITE) writeFileSync(`${FX}/${fixture}.json`, JSON.stringify(fx, null, 2) + '\n');
}

console.log('\n  link class per paragraph, for the page to apply:');
for (const [page, cls] of Object.entries(linkClasses)) {
  console.log(`    ${page}`);
  for (const [k, v] of Object.entries(cls)) console.log(`      ${k.padEnd(12)} ${v}`);
}

if (problems.length) {
  console.error('\n  PROBLEMS');
  for (const p of problems) console.error(`    ⚠ ${p}`);
  process.exit(1);
}
if (WRITE) {
  writeFileSync(`${FX}/structure-link-classes.json`, JSON.stringify(linkClasses, null, 2) + '\n');
  console.log('\n  written\n');
} else {
  console.log('\n  dry run — pass --write to apply\n');
}
