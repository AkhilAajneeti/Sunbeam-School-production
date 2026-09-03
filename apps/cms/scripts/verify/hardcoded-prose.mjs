/**
 * EDITORIAL PROSE STILL WRITTEN INTO THE ASTRO SOURCE.
 *
 * ⚠ THIS IS THE CLASS EVERY OTHER CHECK IN THIS MIGRATION IS BLIND TO.
 *
 * G2–G8 extracted named consts. A sentence written straight into a prop —
 *
 *     body={[ 'Almost every school says it keeps in touch with its leavers…' ]}
 *
 * — is never a const, so the extractor never saw it, the planner never
 * classified it, the field check had no source key for it, and the production
 * diff is perfectly happy because the text is identical on both sides. It is
 * migrated content's blind spot, and it is where the three alumni portraits and
 * their cards were found.
 *
 * The test is deliberately crude and deliberately noisy: a quoted string of at
 * least MIN characters containing a sentence's worth of words, inside a file
 * that is not a data file. Buttons, labels, aria text and class names fall below
 * the threshold; paragraphs do not.
 *
 * ⚠ IT REPORTS CANDIDATES, NOT FAULTS. Some of what it finds is legitimately
 * design copy or an accessibility string. The judgement stays with the reader;
 * the point is that nothing in this class was visible at all before.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEP = String.fromCharCode(92);
const NL = String.fromCharCode(10);
const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '../../../web/src');
const MIN = Number(process.argv[3] ?? 90);
const scope = process.argv[2] ?? '';

function withoutComments(src) {
  const SL = String.fromCharCode(47), ST = String.fromCharCode(42);
  const out = src.split('');
  let i = 0;
  while (i < src.length) {
    if (src[i] === SL && src[i + 1] === ST) {
      const end = src.indexOf(ST + SL, i + 2);
      const stop = end === -1 ? src.length : end + 2;
      for (let j = i; j < stop; j++) out[j] = '';
      i = stop; continue;
    }
    if (src[i] === SL && src[i + 1] === SL && src[i - 1] !== ':') {
      while (i < src.length && src[i] !== NL) { out[i] = ''; i++; }
      continue;
    }
    i++;
  }
  return out.join('');
}

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
};
walk(join(WEB, 'components'));
walk(join(WEB, 'pages'));

/* A quoted run long enough to be a sentence. Single, double and backtick. */
const STRINGS = /'([^'\\]{40,})'|"([^"\\]{40,})"|`([^`\\]{40,})`/g;

const rows = [];
for (const abs of files) {
  const r = relative(WEB, abs).replaceAll(SEP, '/');
  if (scope && !r.includes(scope)) continue;
  const src = withoutComments(readFileSync(abs, 'utf8'));

  /* Only the markup and the prop values, not the frontmatter's imports. */
  /**
   * WARNING: THIS IS A CANDIDATE SCAN, NOT A PARSER.
   * A quoted run is only treated as prose when it sits on ONE line and carries
   * no code or markup punctuation. Without that, a backtick that happens to span
   * a stretch of markup matches, and the report fills with fragments of JSX that
   * look alarming and mean nothing.
   */
  for (const m of src.matchAll(STRINGS)) {
    const text = m[1] ?? m[2] ?? m[3];
    if (text.length < MIN) continue;
    if (text.includes(NL)) continue;
    if (/[<>{};=]/.test(text)) continue;
    if (/^[a-z-]+:|^--|^[/]|https?:|^[.#]/.test(text)) continue;
    if ((text.match(/[ ]/g) ?? []).length < 8) continue;
    if (!/[a-z] [a-z]/i.test(text)) continue;
    rows.push({ file: r, text });
  }
}

const byFile = {};
for (const x of rows) (byFile[x.file] ??= []).push(x.text);
const ranked = Object.entries(byFile).sort((a, b) => b[1].length - a[1].length);

console.log(`${NL}  HARDCODED EDITORIAL PROSE${scope ? ` under ${scope}` : ''}  (strings of ${MIN}+ characters)${NL}`);
console.log(`    files    ${ranked.length}`);
console.log(`    strings  ${rows.length}${NL}`);
for (const [file, list] of ranked.slice(0, 25)) {
  console.log(`    ${String(list.length).padStart(3)}  ${file}`);
  for (const t of list.slice(0, 2)) console.log(`         "${t.slice(0, 96)}${t.length > 96 ? '…' : ''}"`);
}
if (ranked.length > 25) console.log(`${NL}    +${ranked.length - 25} more files`);
console.log('');
