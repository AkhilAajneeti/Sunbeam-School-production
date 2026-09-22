/**
 * REWRITE A STRUCTURE PAGE ONTO THE CMS, AND EMIT ITS FIXTURE FROM WHAT IT TOOK.
 *
 *     node scripts/extract/structure-page.mjs <PageName> [--write]
 *
 * ═══ WHY ONE PASS AND NOT TWO ══════════════════════════════════════════════
 *
 * These pages carry about a hundred and ten hand-written paragraphs. Read them
 * out into a fixture by hand and you get a curly apostrophe typed straight, an
 * em dash typed as a hyphen, a dropped <strong> — none of which a build fails on
 * and none of which a count of cards notices.
 *
 * So the fixture is not transcribed. It is MADE OUT OF THE EXACT TEXT REMOVED,
 * in the same pass that removes it.
 *
 * ═══ WHAT STOPS IT ═════════════════════════════════════════════════════════
 *
 * ⚠ A PARAGRAPH THAT IS NOT JUST PROSE. Pre-Primary has <p> elements holding an
 * inline SVG icon beside their sentence. Flattening those to text would take the
 * icon away, and nothing downstream would notice — so any paragraph containing a
 * tag other than strong/em/a/br is reported and left alone.
 *
 * ⚠ A CLASS NAME MATCHED TOO NARROWLY. Looking for exactly `class="sc-body"`
 * walked past `sc-body sc-deep__b`, `sc-note` and `sc-close__b` — a third of the
 * prose on one page. It now takes every static paragraph in the band.
 *
 * ⚠ AN ATTRIBUTE IT CANNOT REPRODUCE, a heading that is not a run of clipped
 * spans, a photograph paired with somebody else's alt, or a band with two runs
 * where only one field exists. Every one is a miss, and --write refuses while
 * any miss stands.
 *
 * ⚠ IT NEVER TOUCHES the style block, the section wrappers, the decorative
 * spans, or the data-reveal / data-mask / data-pop hooks and their delays.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, '../../../web/src');
const OUT = resolve(HERE, '../fixtures');

const PAGE = process.argv[2];
const WRITE = process.argv.includes('--write');
/* A band this codemod cannot fit is named here and left entirely alone, so the
   rest of the page can still be done by machine rather than by hand. */
const SKIP = new Set((process.argv.find((a) => a.startsWith('--skip=')) || '').split('=')[1]?.split(',') ?? []);
/**
 * A miss this run is EXPECTED to hit, named so it is recorded rather than
 * blocking. Use it only where leaving the markup alone IS the right answer — a
 * call-to-action button, or a paragraph carrying a decorative swash and a value
 * read from Site Settings — never to push past something that ought to move.
 */
const ALLOW = ((process.argv.find((a) => a.startsWith('--allow=')) || '').split('=')[1] ?? '')
  .split(',').filter(Boolean);

if (!PAGE) { console.error('usage: structure-page.mjs <PageName> [--write]'); process.exit(1); }

/** Which bands each page has, in page order, and what each is called in the CMS. */
const SECTIONS = {
  SecondaryPage: { prefix: 'sc', fixture: 'secondary-stage', query: 'getSecondaryStage', sections: ['open', 'board', 'deep', 'beyond', 'jrn', 'close'] },
  SeniorSecondaryPage: { prefix: 'ss', fixture: 'senior-secondary', query: 'getSeniorSecondary', sections: ['open', 'beyond', 'board', 'more', 'jrn', 'close'] },
  MiddleSchoolPage: { prefix: 'ms', fixture: 'middle-school', query: 'getMiddleSchool', sections: ['open', 'exp', 'doing', 'four', 'subj', 'lab', 'ach', 'jrn', 'close'] },
  PrimaryPage: { prefix: 'pr', fixture: 'primary-stage', query: 'getPrimaryStage', sections: ['open', 'rail', 'appr', 'act', 'val', 'space', 'jrn', 'close'] },
  PrePrimaryPage: { prefix: 'pp', fixture: 'pre-primary', query: 'getPrePrimary', sections: ['open', 'doing', 'land', 'play', 'abh', 'first', 'close'] },
  /**
   * ⚠ THESE TWO CARRY A PAGE-LEVEL LIST. Their four streams are drawn in every
   * band — as cards, as a comparison, as a directions list, as a subject map —
   * so the list sits at the top of the record rather than inside any one band,
   * exactly as the Curriculum stages do. `pageRun` names it, and the codemod
   * leaves its `{streams.map(` alone because the query hands it back under the
   * same name.
   */
  StreamsOfferedPage: {
    prefix: 'so', fixture: 'streams-offered', query: 'getStreamsOffered',
    pageRun: 'streams', sections: ['paths', 'x', 'dir', 'sure'],
  },
  SubjectCombinationsPage: {
    prefix: 'sc', fixture: 'subject-combinations', query: 'getSubjectCombinations',
    pageRun: 'worlds', sections: ['open', 'worlds', 'map', 'close'],
  },

  /* ── Teaching & Learning ─────────────────────────────────────────────────
     Same six conventions as the structure pages — xx-kicker, xx-body, an h2 of
     clipped spans, ac.pic/ac.picAlt pairs and one or two runs a band — so the
     same codemod lifts them. They live in a different folder, which is all
     `dir` says. */
  MethodologyPage: { dir: 'teaching', prefix: 'tm', fixture: 'tl-methodology', query: 'getMethodology', sections: ['open', 'three', 'collab', 'plat', 'close'] },
  SmartClassroomsPage: { dir: 'teaching', prefix: 'sc', fixture: 'tl-smart-classrooms', query: 'getSmartClassrooms', sections: ['room', 'sys', 'beyond', 'prac', 'close'] },
  ExperientialLearningPage: { dir: 'teaching', prefix: 'ex', fixture: 'tl-experiential-learning', query: 'getExperientialLearning', sections: ['open', 'path', 'proj', 'close'] },
  StemRoboticsPage: { dir: 'teaching', prefix: 'st', fixture: 'tl-stem-robotics', query: 'getStemRobotics', sections: ['rooms', 'bots', 'use', 'eco', 'close'] },
  ReadingLanguagePage: { dir: 'teaching', prefix: 'rd', fixture: 'tl-reading-language', query: 'getReadingLanguage', sections: ['lib', 'round', 'lab', 'stage', 'close'] },
  LaboratoriesClubsPage: {
    dir: 'teaching', prefix: 'lb', fixture: 'tl-laboratories-clubs', query: 'getLaboratoriesClubs',
    sections: ['rooms', 'twelve', 'spaces', 'interlude', 'close'],
    /* `break` is a reserved word and cannot be destructured. */
    classOf: { interlude: 'break' },
  },

  /* ── Assessment & Support ────────────────────────────────────────────────
     A third family, and the first with no photographs at all: these are pages
     of lists and diagrams. They share one set of styles — as-kicker, as-body,
     as-note — and write the band name as the LAST class on the section. */
  AssessmentPage: { dir: 'assessment', prefix: 'ai', fixture: 'as-assessment', query: 'getAssessment', sections: ['open', 'cycle', 'struct', 'sup', 'conv', 'next', 'close'], closeComponent: 'close' },
  HomeworkPolicyPage: { dir: 'assessment', prefix: 'hp', fixture: 'as-homework-policy', query: 'getHomeworkPolicy', sections: ['open', 'item', 'frame', 'clear', 'gap', 'ask', 'close'], closeComponent: 'close' },
  RemedialSupportPage: { dir: 'assessment', prefix: 'rs', fixture: 'as-remedial-support', query: 'getRemedialSupport', sections: ['open', 'journey', 'rules', 'note', 'close'], closeComponent: 'close' },
  MentoringPage: { dir: 'assessment', prefix: 'mn', fixture: 'as-mentoring', query: 'getMentoring', sections: ['open', 'rel', 'jrn', 'roles', 'human', 'final'] },
  ParentTeacherPage: { dir: 'assessment', prefix: 'pt', fixture: 'as-parent-teacher', query: 'getParentTeacher', sections: ['open', 'agenda', 'why', 'close'], closeComponent: 'close' },
  CompetitiveExamPage: { dir: 'assessment', prefix: 'ce', fixture: 'as-competitive-exam', query: 'getCompetitiveExam', sections: ['open', 'list', 'feat', 'gal', 'close'], closeComponent: 'close' },
};

/** What each field on the page's own list objects is called on structure.cell. */
const FIELD = {
  k: 'label', v: 'value', mark: 'mark', sub: 'sub', alt: 'alt',
  who: 'note', hired: 'flag', photo: 'image', cap: 'caption',
  /* the two stream pages */
  name: 'label', line: 'value', dir: 'note', body: 'value', state: 'state',
  core: 'core', optional: 'optional', additional: 'additional', coreOwed: 'owed',
  /* Teaching & Learning */
  anchor: 'note', quote: 'flag', owed: 'flag', inquiry: 'flag',
  src: 'image', suffix: 'suffix', href: 'href', gloss: 'sub',
};
/**
 * Fields that leave the CMS because the page derives them.
 * `tint` and `key` are only ever a CSS modifier suffix — `--${s.tint}` — and
 * both run pcm, pcb, com, hum in list order, so they are a palette the page
 * indexes rather than anything an editor should be asked to type.
 */
const DERIVED = new Set(['nx', 'ny', 'tint', 'key', 'dur']);

/**
 * ⚠ `n` IS DECIDED FROM THE DATA, NOT ASSUMED.
 *
 * Every numbered run on the structure pages was a plain 01, 02, 03 sequence, so
 * the page counts it. Three runs under Teaching & Learning are not: the library
 * prints 17,574 books, Smart Classrooms prints 75 classrooms. Treating those as
 * a sequence would have printed "01" where the figure belongs — a change no
 * build and no count of cards would have noticed.
 */
const isSequence = (rows) => Array.isArray(rows) && rows.length > 0
  && rows.every((r, i) => String(r?.n) === String(i + 1).padStart(2, '0'));

const cfg = SECTIONS[PAGE];
if (!cfg) { console.error(`unknown page: ${PAGE}`); process.exit(1); }

/* A band name is destructured straight out of the query, so it has to be a
   usable identifier. Caught here rather than as "Unexpected break" from a
   bundler two steps later. */
const RESERVED = new Set(['break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import',
  'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'enum', 'await', 'implements',
  'package', 'protected', 'interface', 'private', 'public']);
for (const s of cfg.sections) {
  if (RESERVED.has(s)) {
    console.error(`
  "${s}" is a reserved word and cannot be a band name — give it a`
      + ` different name and map it with classOf.
`);
    process.exit(1);
  }
}

const FILE = `${WEB}/components/academics/${cfg.dir ?? 'structure'}/${PAGE}.astro`;
let src = readFileSync(FILE, 'utf8');

/** The page's own declared lists, so `n` can be judged rather than guessed. */
const LISTS = JSON.parse(readFileSync(`${OUT}/academics.json`, 'utf8'))[
  `components/academics/${cfg.dir ?? 'structure'}/${PAGE}.astro`
] ?? {};

const tok = (s) => s.split('Sunbeam School Ballia').join('{schoolName}');

/** Inline tags become the markers RichLine already understands. */
const inline = (t) => tok(t
  .replace(/<strong>([\s\S]*?)<\/strong>/g, (m, x) => `**${x}**`)
  .replace(/<em>([\s\S]*?)<\/em>/g, (m, x) => `*${x}*`)
  .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (m, href, x) => `[${x}](${href})`)
  .replace(/<br\s*\/?>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim());

/** Only these may appear inside a paragraph this codemod is willing to move. */
const PROSE_OK = /^(?:strong|em|a|br)\b/;
const onlyProse = (html) => [...html.matchAll(/<\/?([a-zA-Z][\w-]*)/g)].every((m) => PROSE_OK.test(m[1]));

const fixture = {};
const misses = [];
let swaps = 0;
/** Set when the page closes with <AsClose />, whose headline needs splitting. */
let closeSplitFor = null;

const template = src.slice(src.indexOf('---', 3) + 3, src.indexOf('<style>'));

for (const name of cfg.sections) {
  if (SKIP.has(name)) { console.log(`    (skipping ${cfg.prefix}-${name})`); continue; }
  /**
   * ⚠ THE CMS FIELD NAME AND THE CSS CLASS ARE ALLOWED TO DIFFER. Laboratories &
   * Clubs has a band whose class is `lb-break`, and `break` is a reserved word —
   * destructured out of the query it is a syntax error, which is why `classOf`
   * exists. The class is what finds the band; the field name is what the page
   * and the editor read.
   */
  const cls = (cfg.classOf ?? {})[name] ?? name;

  /**
   * ⚠ THE BAND NAME IS A CLASS IN THE LIST, NOT THE WHOLE ATTRIBUTE.
   * The structure pages write `<section class="sc-open">`; the assessment pages
   * write `<section class="as-sec as-sec--ivory as-pad ai-open">` — same idea,
   * band name last. Matching the attribute's opening quote found neither of the
   * assessment family, so the class is looked for as a word anywhere in the list.
   */
  const sectionAt = (n) => {
    const want = `${cfg.prefix}-${(cfg.classOf ?? {})[n] ?? n}`;
    const re = new RegExp(`<section[^>]*\\bclass="[^"]*\\b${want}\\b`);
    const m = re.exec(template);
    return m ? m.index : -1;
  };

  const open = sectionAt(name);
  if (open < 0) {
    /* The closing band is a component call, not a <section>; it is captured
       separately below. */
    if (name !== cfg.closeComponent) misses.push(`section ${cfg.prefix}-${cls} not found`);
    continue;
  }
  const next = cfg.sections
    .map(sectionAt)
    .filter((i) => i > open)
    .sort((a, b) => a - b)[0] ?? template.length;

  const band = template.slice(open, next);
  const S = name;
  const F = { kicker: null, heading: null, body: [], caption: null, shots: [], runs: [] };
  const at = (label) => `${cfg.prefix}-${name}: ${label}`;
  let out = band;
  const edit = (from, to, all = false) => {
    if (!out.includes(from)) { misses.push(at(`no match: ${from.slice(0, 56).replace(/\s+/g, ' ')}`)); return; }
    out = all ? out.split(from).join(to) : out.replace(from, to);
    swaps += 1;
  };

  /**
   * ⚠ A FIELD READ IS REPLACED ON WORD BOUNDARIES, NOT AS A SUBSTRING.
   *
   * Rewriting `s.k` to `s.label` with a plain replace also hit `sys.kicker`,
   * which contains `s.k`, and turned it into `sys.labelicker`. The page still
   * built; the kicker simply rendered as nothing. Anchored on both sides, an
   * identifier can only be replaced whole.
   */
  const editField = (v, from, to) => {
    /* ⚠ DOUBLED BACKSLASHES. Inside a template literal `\b` is a backspace, not
       a word boundary — written singly this matched nothing like it should. */
    const pattern = `(?<![\\w$.])${v}\\.${from}\\b`;
    if (!new RegExp(pattern).test(out)) { misses.push(at(`no match: ${v}.${from}`)); return; }
    out = out.replace(new RegExp(pattern, 'g'), `${v}.${to}`);
    swaps += 1;
  };

  /**
   * ── paragraphs: every static one in the band, kicker or not ─────────────
   *
   * ⚠ A PARAGRAPH INSIDE A .map() IS NOT STATIC, whatever it starts with.
   * Pre-Primary has `<p class="pp-act__h"><span>{d.n}</span>…</p>` inside its
   * run — it opens with a tag, not an expression, so "does it start with {"
   * called it static and would have frozen one card's text onto all three.
   * The regions a run covers are worked out first and skipped whole.
   */
  const runRegions = [];
  for (const m of band.matchAll(/\{\w+\.map\(/g)) {
    let depth = 0;
    for (let i = m.index; i < band.length; i += 1) {
      if (band[i] === '{') depth += 1;
      else if (band[i] === '}') { depth -= 1; if (depth === 0) { runRegions.push([m.index, i]); break; } }
    }
  }
  const insideRun = (i) => runRegions.some(([a, b]) => i > a && i < b);

  const statics = [...band.matchAll(/<p class="([^"]+)"([^>]*)>([\s\S]*?)<\/p>/g)]
    .filter((m) => !insideRun(m.index) && !/^\s*\{/.test(m[3].trim()));

  const movable = [];
  for (const m of statics) {
    const rest = m[2]
      .replace(/\s*data-reveal(-delay="\d+")?/g, '')
      .replace(/\s*id="[^"]*"/, '')
      .trim();
    if (rest) { misses.push(at(`<p class="${m[1]}"> carries ${rest} — cannot reproduce`)); continue; }
    if (!onlyProse(m[3])) { misses.push(at(`<p class="${m[1]}"> holds markup, not just prose`)); continue; }
    movable.push(m);
  }

  const km = movable.find((m) => /kicker/.test(m[1]));
  if (km) { F.kicker = inline(km[3]); edit(km[0], `<p class="${km[1]}"${km[2]}>{${S}.kicker}</p>`); }

  movable.filter((m) => !/kicker/.test(m[1])).forEach((m, i) => {
    F.body.push(inline(m[3]));
    const delay = (m[2].match(/data-reveal-delay="(\d+)"/) || [])[1];
    /* A paragraph that labels its section carries the id aria-labelledby points
       at, so it has to come back out on the other side. */
    const pid = (m[2].match(/id="([^"]*)"/) || [])[1];
    edit(m[0], `<RichLine class="${m[1]}"${pid ? ` id="${pid}"` : ''} text={${S}.body[${i}]}`
      + `${/data-reveal\b/.test(m[2]) ? ' reveal' : ''}${delay ? ` revealDelay={${delay}}` : ''} />`);
  });

  /* ── heading: the clipped spans become one ClipHeading ─────────────────── */
  const hm = band.match(/<h2([^>]*)>([\s\S]*?)<\/h2>/);
  if (hm) {
    const spans = [...hm[2].matchAll(/<span data-clip data-clip-delay="(\d+)"[^>]*>([\s\S]*?)<\/span>/g)];
    if (!spans.length) {
      /**
       * ⚠ NOT EVERY HEADING IS CLIPPED. Experiential Learning's second band is
       * a plain eyebrow h2 — and `aria-labelledby` points at it, so it keeps its
       * tag, its id and its classes exactly; only the words come from the CMS.
       */
      if (onlyProse(hm[2])) {
        F.heading = inline(hm[2]);
        edit(hm[0], `<h2${hm[1]}>{${S}.heading}</h2>`);
      } else {
        misses.push(at('h2 is neither clipped spans nor plain prose'));
      }
    } else {
      const delays = spans.map((m) => Number(m[1]));
      F.heading = spans.map((m) => tok(m[2]
        .replace(/<em>([\s\S]*?)<\/em>/g, (x, v) => `{{${v.trim()}}}`)
        /* ⚠ The entity is decoded here as it is in a paragraph. Left encoded,
           the heading prints a literal &amp; where the ampersand belongs. */
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ').trim())).join('\n');
      /* An even 150 stagger is ClipHeading's default; 0/150/290 passes its own. */
      const even = delays.every((d, i) => d === i * 150);
      edit(hm[0], `<ClipHeading ${hm[1].trim()} text={${S}.heading}`
        + `${even ? '' : ` delays={[${delays.join(', ')}]}`} />`);
    }
  }

  /* ── the caption printed under a photograph ────────────────────────────── */
  const cm = band.match(/(<figcaption class="[^"]+"[^>]*>)([\s\S]*?)(<\/figcaption>)/);
  if (cm && !/^\s*\{/.test(cm[2].trim())) {
    if (!onlyProse(cm[2])) misses.push(at('figcaption holds markup, not just prose'));
    else { F.caption = inline(cm[2]); edit(cm[0], `${cm[1]}{${S}.caption}${cm[3]}`); }
  }

  /* ── photographs, in the order the page places them ────────────────────── */
  [...band.matchAll(/file=\{(p[A-Z]\w*)\}\s*alt=\{ac\.picAlt\('(p[A-Z]\w*)'\)\}/g)].forEach((m, i) => {
    if (m[1] !== m[2]) misses.push(at(`${m[1]} paired with the alt of ${m[2]}`));
    F.shots.push({ key: m[1] });
    edit(m[0], `file={${S}.shots[${i}]?.image} alt={${S}.shots[${i}]?.alt ?? ''}`);
  });

  /* ── the runs of cells ─────────────────────────────────────────────────── */
  /**
   * ⚠ A RUN HAS TO BE A LIST THE PAGE DECLARED, not merely something mapped
   * over. The assessment index maps `ringed`, which is `steps` with a ring
   * position computed onto it — claiming `ringed` as the CMS run would have
   * pointed the band at a list that does not exist and left `steps` behind.
   */
  /**
   * ⚠ A RUN IS NOT ALWAYS MAPPED. Three of these pages hand a list straight to a
   * component — `<AsRail steps={journey} />` — and one reads its gallery by
   * index, `gallery[0]`. Neither is a `.map(`, so neither was claimed, while the
   * frontmatter cleanup took the declaration anyway and left the page reading a
   * name nothing defined.
   */
  const found = [...new Set([
    ...[...band.matchAll(/\{(\w+)\.map\(/g)].map((m) => m[1]),
    ...[...band.matchAll(/=\{(\w+)\}/g)].map((m) => m[1]),
    ...[...band.matchAll(/\{(\w+)\[\d+\]/g)].map((m) => m[1]),
  ])].filter((r) => r === cfg.pageRun || Array.isArray(LISTS[r]));
  /* The page-level list keeps its own name; only band runs become cells. */
  const runs = found.filter((r) => r !== cfg.pageRun);
  const all = cfg.pageRun && found.includes(cfg.pageRun) ? [cfg.pageRun, ...runs] : runs;
  if (runs.length > 2) misses.push(at(`${runs.length} runs (${runs.join(', ')}) — only two fields exist`));
  all.slice(0, 3).forEach((list) => {
    const isPage = list === cfg.pageRun;
    const field = isPage ? null : (runs.indexOf(list) === 0 ? 'cells' : 'cellsTwo');
    if (field) F.runs.push({ field, list });

    /**
     * Every callback over this list, so a list mapped twice is fully rewritten.
     *
     * ⚠ THE PAIRS ARE DEDUPED ACROSS CALLBACKS TOO. `so-dir` maps `streams`
     * twice under the same variable name, so the second pass found `s.name`
     * already rewritten and reported a miss that was an artefact of this loop
     * rather than anything wrong with the page.
     */
    const seen = new Set();
    for (const cb of band.matchAll(new RegExp(`\\{${list}\\.map\\(\\(?(\\w+)(?:,\\s*(\\w+))?\\)?\\s*=>`, 'g'))) {
      const [, v, ix] = cb;
      /* ⚠ UNIQUE FIELD NAMES. A field used three times yielded three matches,
         and the second and third then found nothing left to replace because the
         first had already rewritten all of them — a miss that was an artefact of
         this loop rather than anything wrong with the page. */
      const used = [...new Set([...band.matchAll(new RegExp(`\\b${v}\\.(\\w+)\\b`, 'g'))].map((u) => u[1]))];
      for (const f of used) {
        if (seen.has(`${v}.${f}`)) continue;
        seen.add(`${v}.${f}`);
        if (f === 'n') {
          if (isSequence(LISTS[list])) {
            if (!ix) { misses.push(at(`${list} is numbered but its callback has no index`)); continue; }
            edit(`{${v}.n}`, `{String(${ix} + 1).padStart(2, '0')}`, true);
          } else {
            /* A real figure, not a position in the run. */
            editField(v, 'n', 'number');
          }
        } else if (DERIVED.has(f)) {
          misses.push(at(`${list}.${f} is design — the page must own it`));
        } else if (!FIELD[f]) {
          misses.push(at(`${list}.${f} has nowhere to go on a cell`));
        } else if (FIELD[f] !== f) {
          editField(v, f, FIELD[f]);
        }
      }
    }
    if (field) {
      /* All three ways a run is reached, so nothing is left pointing at the
         name the frontmatter cleanup removed. */
      const target = `${S}.${field}`;
      if (out.includes(`{${list}.map(`)) edit(`{${list}.map(`, `{${target}.map(`, true);
      if (out.includes(`={${list}}`)) edit(`={${list}}`, `={${target}}`, true);
      if (new RegExp(`\\{${list}\\[\\d`).test(out)) {
        out = out.split(`{${list}[`).join(`{${target}[`);
        swaps += 1;
      }
    }
  });

  fixture[S] = F;
  if (out !== band) src = src.replace(band, out);
}

/**
 * ── THE SHARED CLOSING BAND ────────────────────────────────────────────────
 *
 * ⚠ ITS CONTENT IS IN PROPS, NOT IN THE MARKUP. Eighteen assessment pages end
 * with `<AsClose kicker="…" lead="…" accent="…" body="…" photo={pCohort} />`,
 * so nothing the band scanner looks for — a kicker paragraph, an h2, a <p> —
 * is there to find. Left alone it also orphaned `pCohort`, whose declaration
 * the frontmatter cleanup had already taken.
 *
 * The headline is two props because the component sets the second half orange
 * and italic. The CMS stores it as the same two lines with {{…}} that every
 * other heading uses, and the page splits it back.
 */
if (cfg.closeComponent) {
  const S = cfg.closeComponent;
  const cm = src.match(/<AsClose\b[\s\S]*?\/>/);
  if (!cm) {
    misses.push(`${S}: no <AsClose /> found`);
  } else {
    const prop = (name) => (cm[0].match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];
    const photo = (cm[0].match(/\bphoto=\{(\w+)\}/) || [])[1];
    const lead = prop('lead') ?? '';
    const accent = prop('accent') ?? '';

    fixture[S] = {
      kicker: inline(prop('kicker') ?? ''),
      heading: `${tok(lead)}\n{{${tok(accent)}}}`,
      body: [inline(prop('body') ?? '')],
      caption: null,
      /* ⚠ AsClose HARDCODES alt="" — the photograph is decoration and its
         subject is never the sentence beside it. Recorded as empty rather than
         missing, so the fixture builder can tell the two apart. */
      shots: photo ? [{ key: photo, alt: '' }] : [],
      runs: [],
    };

    const rebuilt = cm[0]
      .replace(/\bkicker="[^"]*"/, `kicker={${S}.kicker}`)
      .replace(/\blead="[^"]*"/, `lead={closeLead}`)
      .replace(/\baccent="[^"]*"/, `accent={closeAccent}`)
      .replace(/\bbody="[^"]*"/, `body={${S}.body[0]}`)
      .replace(/\bphoto=\{\w+\}/, `photo={${S}.shots[0]?.image ?? null}`);
    src = src.replace(cm[0], rebuilt);
    swaps += 1;

    /* ⚠ THE SPLIT IS WRITTEN WHERE THE DESTRUCTURE IS. At this point the
       frontmatter still reads `const ac = await getAcademicTopic(...)` — the
       query call these two lines depend on is written further down, so the
       insertion is deferred to there. */
    closeSplitFor = S;
  }
}

/* ── the frontmatter: one query call in place of the topic reads ──────────── */
{
  const q = cfg.query;
  const fields = cfg.sections.join(', ');

  /* Every `const pX = ac.pic('pX')` and `const list = ac.section(...)` goes:
     the photographs live in their band's `shots` now, and the runs in `cells`. */
  const dead = [...src.matchAll(/^const (\w+) = ac\.(?:pic|section)\([^\n]*\n/gm)];
  for (const d of dead) { src = src.replace(d[0], ''); swaps += 1; }

  /**
   * ⚠ NOTHING MAY BE REMOVED WHILE THE PAGE STILL READS IT.
   *
   * This cleanup is unconditional but band capture is not: Competitive Exams
   * reads its gallery as `gallery[0]`, never `gallery.map(`, so the run was
   * never claimed and the declaration went anyway. The build got as far as that
   * page and said "gallery is not defined". Caught here instead, where the fix
   * is obvious.
   */
  const bandNames = new Set([...cfg.sections, cfg.pageRun].filter(Boolean));
  /* Only the template, and only outside comments: a name in prose is not a read,
     and a band field legitimately carries the same word the old list did. */
  /* ⚠ ONLY WHAT IS INSIDE AN EXPRESSION IS A READ. "None of the programmes
     below is compulsory" is prose that happens to contain a list's name, and
     flagging it would train whoever runs this to ignore the warning. */
  const live = (src.slice(src.indexOf('---', 3) + 3)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .match(/\{[^{}]*\}/g) ?? []).join(' ');
  for (const [, name] of dead) {
    if (bandNames.has(name)) continue;
    if (new RegExp(`(?<![\\w$.])${name}(?![\\w$])`).test(live)) {
      misses.push(`frontmatter: ${name} was removed but the page still reads it`);
    }
  }

  const topic = src.match(/^const ac = await getAcademicTopic\([^\n]*\n/m);
  if (!topic) misses.push('frontmatter: no getAcademicTopic call to replace');
  else {
    let head = `const { ${fields} } = await ${q}();\n`;
    if (closeSplitFor) {
      head += '\n/* AsClose takes its headline as two props; the record stores the same two\n'
        + '   lines with {{…}} that every other heading uses. */\n'
        + `const [closeLead = '', closeAccent = ''] = (${closeSplitFor}.heading ?? '')\n`
        + "  .split('\\n')\n"
        + "  .map((l) => l.replace(/^\\{\\{|\\}\\}$/g, '').trim());\n";
    }
    src = src.replace(topic[0], head);
    swaps += 1;
  }

  const imp = src.match(/^import \{ getAcademicTopic \} from '([^']+)';$/m);
  if (!imp) misses.push('frontmatter: no getAcademicTopic import to replace');
  else {
    src = src.replace(imp[0],
      `import ClipHeading from '../../ui/ClipHeading.astro';\n`
      + `import RichLine from '../../ui/RichLine.astro';\n`
      + `import { ${q} } from '${imp[1]}';`);
    swaps += 1;
  }

  /* `S` was the school's name spelled out for alt text the CMS now carries. */
  const sDecl = src.match(/^const S = 'Sunbeam School Ballia';\n/m);
  if (sDecl && !/\bS\b(?!')/.test(src.slice(src.indexOf('---', 3)))) {
    src = src.replace(sDecl[0], ''); swaps += 1;
  }
}

console.log(`\n  ${PAGE}  —  ${swaps} swaps, ${misses.length} miss(es)`);
for (const m of misses) console.log(`    ⚠ ${m}`);
console.log('');
for (const [k, v] of Object.entries(fixture)) {
  console.log(`    ${k.padEnd(7)} kick:${v.kicker ? 'y' : '-'} head:${v.heading ? v.heading.split('\n').length : 0}`
    + ` body:${String(v.body.length).padEnd(2)} cap:${v.caption ? 'y' : '-'}`
    + ` shots:${(v.shots.map((s) => s.key).join(',') || '-').padEnd(34)}`
    + ` runs:${v.runs.map((r) => r.list).join('+') || '-'}`);
}

const allowed = misses.filter((m) => ALLOW.some((a) => m.includes(a)));
const blocking = misses.filter((m) => !allowed.includes(m));
if (allowed.length) {
  console.log('  left in the page on purpose:');
  for (const a of allowed) console.log(`    · ${a}`);
}

if (WRITE) {
  if (blocking.length) { console.error('\n  refusing to write while a miss stands\n'); process.exit(1); }
  writeFileSync(FILE, src);
  writeFileSync(`${OUT}/${cfg.fixture}.raw.json`, JSON.stringify(fixture, null, 2) + '\n');
  console.log(`\n  written: ${PAGE}.astro  and  fixtures/${cfg.fixture}.raw.json\n`);
} else {
  console.log('\n  dry run — pass --write to apply\n');
}
