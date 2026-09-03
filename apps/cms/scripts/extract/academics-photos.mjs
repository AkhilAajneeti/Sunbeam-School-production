/**
 * THE ACADEMICS PHOTOGRAPHS THAT G8 LEFT IN CODE.
 *
 * ═══ WHY THESE SURVIVED A MIGRATION THAT LOST NOTHING ELSE ══════════════════
 *
 * Every other academics value was inside a content const, so the extractor saw
 * it, the planner classified it and the field check compared it key by key.
 * These were never in a const: they are a bare `import` at the top of a
 * component and a `src={binding}` in its markup. There was no source key to
 * compare against, so 0 LOST was true and incomplete at the same time.
 *
 * ⚠ THE ALT TEXT IS THE PART THAT CAN BE LOST SILENTLY. The production diff
 * compares rendered text, and an alt attribute is not rendered text — a
 * photograph that arrives from Strapi with an empty alt passes 173/173 and
 * fails every screen reader. That is what `alt-snapshot.mjs` is for, and it is
 * why the alt is captured here exactly as written.
 *
 * ⚠ BRACE-BALANCED CAPTURE, NOT A REGEX TO THE FIRST `}`. Half these alts are
 * template literals containing `${S}`, and stopping at the first closing brace
 * truncates them mid-sentence — quietly, because a truncated alt is still a
 * plausible alt.
 *
 * ⚠ WHAT IS NOT CAPTURED, BECAUSE IT IS NOT MOVING: widths, sizes, formats,
 * loading, decoding, fetchpriority, object-position. Those are design. The
 * photograph and its description are content; how large it is fetched is not.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { academicsFilesFor } from '../lib/academics-map.mjs';

const SEP = String.fromCharCode(92);
const NL2 = String.fromCharCode(10);
const WEB = new URL('../../../web/src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const FIX = new URL('../fixtures/', import.meta.url);

/**
 * ⚠ THE FOUR COMPONENTS WITH NO `ac` OF THEIR OWN.
 *
 * Two are page files that pass a photograph straight into a shared band, and
 * two are shared bands used across a group. Each photograph still belongs to
 * exactly one page's record — a shared band's picture is owned by the page the
 * band closes, not by the band — so the owner is named here rather than guessed
 * from the file path.
 */
const OWNER = {
  'pages/academics/philosophy/curriculum.astro': '/academics/philosophy/curriculum/',
  'pages/academics/student-success/alumni-interaction.astro': '/academics/student-success/alumni-interaction/',
  'components/academics/partnership/PpCta.astro': '/academics/parent-partnership/',
  'components/academics/assessment/AcademicCalendarPage.astro': '/academics/academic-calendar/',
};

/**
 * ⚠ PageHero's `src` IS A FALLBACK AND STAYS. Its banner already comes from
 * page-meta.heroBanner — 45 of the 46 academics routes have one — and `src` is
 * the required local fallback that renders when a row has none. Migrating it
 * would remove the fallback, not the hardcoding.
 */
const FALLBACK_COMPONENTS = new Set(['PageHero']);

/**
 * WARNING: AN OWNER ROUTE THAT DOES NOT EXIST FAILS SILENTLY.
 * The seed only writes photographs for routes it is already building, so a
 * mistyped owner is not an error - the slot is simply never written, and the
 * page keeps rendering from its local import as if nothing had been migrated.
 * The first guess here put the calendar under /academics/assessment/ and that is
 * exactly what happened. The route list is the same one the seed uses.
 */
const REAL = academicsFilesFor(resolve(dirname(fileURLToPath(import.meta.url)), '../../../web/src'));
for (const [file, route] of Object.entries(OWNER))
  if (!REAL.has(route)) throw new Error(`OWNER route does not exist: ${route} (for ${file})`);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
};
for (const r of ['components/academics', 'pages/academics']) walk(join(WEB, r));

/**
 * WARNING: EVERY PHOTOGRAPHIC ASSET DIRECTORY, NOT JUST assets/photos.
 * The first pass of this migration matched only assets/photos and reported a
 * gap of 14 pictures. The academics pages import their photography from
 * twenty-four directories - "parents forum", "school-event", "chem lab",
 * "School Activity in Uniform" - and the real gap was 175. Matching one
 * directory produced a number that was precise and wrong.
 */
const IMPORT = new RegExp(
  "^import[ ]+([A-Za-z0-9_]+)[ ]+from[ ]+'([^']*assets/[^']+[.](?:jpg|jpeg|png|webp|avif|JPG|JPEG|PNG))'",
  'gm',
);

/** Icons, marks and textures are design and stay in the component. */
const DESIGN_DIRS = new Set(['icons', 'brand', 'logos', 'textures', 'patterns', 'marks']);

/**
 * The source with comments blanked out, for deciding whether a binding is really
 * referenced. One import in this section is named only in a paragraph of prose
 * explaining the design, and counting that as a use keeps a dead import alive.
 */
function withoutComments(src) {
  /* Scanned rather than matched: a regex for this needs escapes that do not
     survive being written from a shell, and getting it subtly wrong silently
     changes which imports look used. */
  const SL = String.fromCharCode(47), ST = String.fromCharCode(42), NL2 = String.fromCharCode(10);
  const out = src.split("");
  let i = 0;
  while (i < src.length) {
    if (src[i] === SL && src[i + 1] === ST) {
      const end = src.indexOf(ST + SL, i + 2);
      const stop = end === -1 ? src.length : end + 2;
      for (let j = i; j < stop; j++) if (out[j] !== NL2) out[j] = " ";
      i = stop; continue;
    }
    if (src[i] === SL && src[i + 1] === SL && src[i - 1] !== ":") {
      while (i < src.length && src[i] !== NL2) { out[i] = " "; i++; }
      continue;
    }
    i++;
  }
  return out.join("");
}

/** The attribute value at `i`, balanced across nested braces and template holes. */
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

/** The whole opening tag around `i`, so an alt written before or after src is found either way. */
function tagAround(src, i) {
  const from = src.lastIndexOf('<', i);
  let depth = 0;
  for (let j = from; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') depth--;
    else if (src[j] === '>' && depth === 0) return { text: src.slice(from, j + 1), from };
  }
  return { text: src.slice(from), from };
}

/**
 * A literal alt, or a template whose only hole is the school name, becomes a
 * stored string. Anything else — a variable, a computed expression — is left
 * where it is: it already has a source, and moving it would create a second one.
 */
function classifyAlt(raw) {
  if (raw == null) return { kind: 'none' };
  if (raw.startsWith('"')) return { kind: 'literal', text: raw.slice(1, -1) };
  const inner = raw.slice(1, -1).trim();
  if (/^`[^`]*`$/.test(inner)) {
    const body = inner.slice(1, -1);
    const holes = [...body.matchAll(/\$\{([^}]*)\}/g)].map((m) => m[1].trim());
    if (holes.every((h) => h === 'S')) return { kind: 'template', text: body.replaceAll('${S}', '{schoolName}') };
    return { kind: 'expression', text: raw };
  }
  if (/^'[^']*'$/.test(inner)) return { kind: 'literal', text: inner.slice(1, -1) };
  return { kind: 'expression', text: raw };
}

/**
 * WARNING: THE IMPORTS ARE READ FROM THE LAST COMMIT, NOT THE WORKING COPY.
 *
 * The first, narrow pass of this migration already removed the assets/photos
 * imports from forty-two components, so a second and wider pass reading the
 * working copy cannot see the eighty-four photographs it moved. Re-seeding from
 * that partial plan would replace each record's photo list with only the newly
 * found slots and drop the rest - silently, because a record with fewer photos
 * is not an error.
 *
 * HEAD still holds every import and every original alt attribute, because none
 * of this migration is committed. The ROUTE, though, is read from the working
 * copy: HEAD predates the whole of G8 and has no record binding at all.
 */
function committed(rel) {
  try {
    return execFileSync('git', ['show', `HEAD:apps/web/src/${rel}`], {
      cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../../..'),
      encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;                      /* a file added since the last commit */
  }
}

const perFile = [];
for (const abs of files) {
  const rel = relative(WEB, abs).replaceAll(SEP, '/');
  const working = readFileSync(abs, 'utf8');
  const src = committed(rel) ?? working;

  const imports = new Map();
  for (const m of src.matchAll(IMPORT)) {
    const asset = m[2].slice(m[2].indexOf('assets/'));
    if (DESIGN_DIRS.has(asset.split('/')[1])) continue;
    imports.set(m[1], asset);
  }
  if (!imports.size) continue;

  const route = working.match(/getAcademicTopic\('([^']+)'\)/)?.[1] ?? OWNER[rel] ?? null;
  const uses = [];

  for (const [binding, asset] of imports) {
    const re = new RegExp('(?:src|file|photo|image)=\\{' + binding + '\\}', 'g');
    for (const m of src.matchAll(re)) {
      const { text: tag } = tagAround(src, m.index);
      const component = tag.match(/^<\s*([A-Za-z0-9_]+)/)?.[1] ?? '?';
      const ai = tag.search(/\salt=/);
      const alt = ai === -1 ? null : valueAt(tag, ai + 5)?.raw ?? null;
      uses.push({ binding, asset, component, alt, ...classifyAlt(alt) });
    }
  }
  /**
   * WARNING: NOT EVERY PHOTOGRAPH REACHES THE PAGE THROUGH A TAG.
   *
   * Three alumni portraits are handed over as `art: gSudhanshu` inside an inline
   * posters={[...]} array, which is a prop and not an element, so the tag scan
   * cannot see them. They still need to come from the record.
   *
   * A reference slot changes NOTHING in the markup - the binding keeps its name,
   * so every use of it below the frontmatter still resolves. Only the import is
   * replaced by a declaration. The description beside such a photograph stays in
   * code: it belongs to the inline array around it, which is a separate question
   * from where the picture comes from.
   */
  /* WARNING: THE WORKING COPY, NOT HEAD, DECIDES THIS.
     The tag scan reads HEAD so it can still see the photographs an earlier pass
     already moved. A reference must not: in HEAD these bindings also fed the
     content consts that G8 migrated into section photos, and re-adding them here
     would put the same picture in the CMS twice, under two owners. A reference
     slot is needed only where the working copy still imports and still uses it. */
  const bare = withoutComments(working);
  /**
   * WARNING: THE EXTRACTOR HAS TO RECOGNISE ITS OWN OUTPUT.
   * Once a reference slot is migrated its import is gone, so a re-run stops
   * seeing it and the plan silently loses three photographs - and the next seed
   * would then remove them from the record. A binding already declared as
   * ac.pic() is still owned by this page and stays in the plan.
   */
  const stillImported = (b) =>
    new RegExp('^import[ ]+' + b + '[ ]+from', 'm').test(working) ||
    new RegExp('const[ ]+' + b + '[ ]*=[ ]*ac[0-9]*[.]pic[(]').test(working);
  for (const [binding, asset] of imports) {
    if (uses.some((u) => u.binding === binding)) continue;
    if (!stillImported(binding)) continue;
    const re = new RegExp('(^|[^A-Za-z0-9_])' + binding + '([^A-Za-z0-9_]|$)', 'm');
    const body = bare.split(String.fromCharCode(10))
      .filter((l) => !l.trim().startsWith('import ' + binding + ' '))
      .join(String.fromCharCode(10));
    if (re.test(body)) uses.push({ binding, asset, component: 'reference', alt: null, kind: 'none' });
  }

  const dead = [...imports.keys()].filter((b) => !uses.some((u) => u.binding === b));
  perFile.push({ file: rel, route, uses, dead });
}

/* ── Keys ────────────────────────────────────────────────────────────────────
   The binding names the slot, because that is what the component already calls
   it and a codemod that renames nothing is a codemod that cannot mis-wire. One
   binding is used twice on one page with two different descriptions, so a
   second distinct alt takes a numbered key rather than overwriting the first. */
const byRoute = {};
const swap = {};
let migrated = 0, fallback = 0, altKept = 0;

for (const f of perFile) {
  const rows = [];
  for (const u of f.uses) {
    if (FALLBACK_COMPONENTS.has(u.component)) { fallback++; continue; }
    if (!f.route) throw new Error(`no owning route for ${f.file} (${u.binding})`);

    const slots = (byRoute[f.route] ??= []);
    const same = slots.filter((s) => s.binding === u.binding);
    let slot = same.find((s) => s.altRaw === u.alt);
    if (!slot) {
      slot = {
        key: same.length ? `${u.binding}${same.length + 1}` : u.binding,
        binding: u.binding,
        asset: u.asset,
        altRaw: u.alt,
        alt: u.kind === 'literal' || u.kind === 'template' ? u.text : null,
        altInCode: u.kind === 'expression' || u.kind === 'none',
      };
      slots.push(slot);
    }
    if (slot.altInCode) altKept++;
    rows.push({ binding: u.binding, key: slot.key, route: f.route, component: u.component, altRaw: u.alt });
    migrated++;
  }
  if (rows.length) swap[f.file] = { route: f.route, uses: rows };
}

/**
 * WARNING: OVERRIDES ARE MERGED BEFORE THE UPLOAD NAMES ARE COMPUTED.
 *
 * The name a photograph is uploaded under is derived from its asset path, and
 * media reuse is BY NAME. An override merged after that step changes the file
 * and the description but leaves the old name behind, so the upload matches the
 * photograph it was meant to replace and reuses it: the page then carries the
 * old picture under the new description. That is not a visible failure - the
 * slot is full, the alt is right, the text diff is clean, and the photograph is
 * simply the wrong one. It happened once; the ordering here is what prevents it.
 *
 * The plan above is derived from the imports in the last commit, so it can only
 * describe photography the site already had. A photograph the school sends later
 * has no import to find. Overrides are where those are recorded - and they are
 * merged rather than appended, because a slot the markup does not read is a
 * photograph nobody will ever see.
 */
const overrides = JSON.parse(readFileSync(new URL('academics-photo-overrides.json', FIX), 'utf8'));
let applied = 0;
const overrideProblems = [];
for (const [route, slots] of Object.entries(overrides)) {
  if (route.startsWith('__')) continue;
  const target = byRoute[route];
  if (!target) { overrideProblems.push(`no such route: ${route}`); continue; }
  for (const [key, o] of Object.entries(slots)) {
    const slot = target.find((s2) => s2.key === key);
    if (!slot) { overrideProblems.push(`${route} has no slot "${key}"`); continue; }
    if (!o.asset || !o.alt) { overrideProblems.push(`${route} ${key}: asset and alt are both required`); continue; }
    if (!o.why) { overrideProblems.push(`${route} ${key}: no reason given`); continue; }
    slot.asset = o.asset;
    slot.alt = o.alt;
    slot.altInCode = false;
    slot.overridden = o.why;
    applied++;
  }
}

/**
 * WARNING: THE LIBRARY NAME MUST NOT COLLIDE, BECAUSE REUSE IS BY NAME.
 *
 * uploadMedia returns an existing file whenever one already carries the name it
 * was asked for. Fourteen of these assets are called 01.jpg, 02.jpg, 03.jpg or
 * 05.jpg - one per school-activity folder - so naming them by their basename
 * makes the second and every later one silently reuse the first one's picture.
 * Nothing errors: the page renders a photograph, just not the right photograph.
 *
 * A name is the basename where that is unambiguous across the whole plan, and
 * the folder joined to the basename where it is not. Only the ambiguous ones
 * change, so the unambiguous ones keep reusing what is already in the library
 * rather than uploading a second copy of it.
 */
{
  const all = Object.values(byRoute).flat();
  const byBase = {};
  for (const s of all) {
    const base = s.asset.split('/').pop();
    (byBase[base] ??= new Set()).add(s.asset);
  }
  for (const s of all) {
    const parts = s.asset.split('/');
    const base = parts.pop();
    const stem = base.slice(0, base.lastIndexOf('.'));
    s.name = byBase[base].size > 1
      ? `${parts[parts.length - 1]}-${stem}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : stem;
  }
  const clash = Object.entries(
    all.reduce((o, s) => { (o[s.name] ??= new Set()).add(s.asset); return o; }, {}),
  ).filter(([, v]) => v.size > 1);
  if (clash.length) {
    console.log(String.fromCharCode(10) + '  ⚠ names still ambiguous:');
    for (const [n, v] of clash) console.log(`      ${n}  <-  ${[...v].join(' , ')}`);
    process.exitCode = 1;
  }
}

writeFileSync(new URL('academics-photo-plan.json', FIX), JSON.stringify(byRoute, null, 2));
writeFileSync(new URL('academics-photo-swap.json', FIX), JSON.stringify(swap, null, 2));

const slots = Object.values(byRoute).flat();
const kinds = {};
for (const f of perFile) for (const u of f.uses) if (!FALLBACK_COMPONENTS.has(u.component)) kinds[u.kind] = (kinds[u.kind] ?? 0) + 1;

console.log('\n  ACADEMICS PHOTOGRAPHS — EXTRACTION\n');
console.log(`    components              ${perFile.length}`);
console.log(`    render sites migrating  ${migrated}`);
console.log(`    PageHero fallbacks kept ${fallback}`);
console.log(`    owning records          ${Object.keys(byRoute).length}`);
console.log(`    photo slots             ${slots.length}`);
console.log(`    distinct assets         ${new Set(slots.map((s) => s.asset)).size}`);
console.log(`    alt moving to Strapi    ${slots.filter((s) => s.alt !== null).length}`);
console.log(`    alt staying in code     ${slots.filter((s) => s.altInCode).length}  (already has a source, or decorative)`);
console.log(`\n    alt expression kinds    ${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log(`    overrides applied       ${applied}`);
if (overrideProblems.length) {
  console.log(`${NL2}  ⚠ ${overrideProblems.length} override problem(s):`);
  for (const op of overrideProblems) console.log(`      ${op}`);
  process.exitCode = 1;
}
console.log('\n  written to scripts/fixtures/academics-photo-{plan,swap}.json\n');
