/**
 * EXTRACT — the homepage and About content, from the pre-migration source.
 *
 *     npm run extract:home
 *
 * ═══ WHY THIS STEP EXISTS ══════════════════════════════════════════════════
 *
 * Every other seed in this project reads apps/web/src/data/*.ts, and those files
 * are still on disk after their group is migrated, so the seed stays re-runnable
 * for ever. G6 is different: most of its content was never in a data file. It
 * was inline in the components — Campus.astro's photo gallery, Achievements'
 * two arrays, EventsNews' five teasers, Affiliations' seventeen marks, both
 * About messages — and the migration DELETES those, because leaving them would
 * be exactly the duplicate hardcoded content the group exists to remove.
 *
 * ⚠ SO THE SEED CANNOT READ THE WORKING TREE. After the swap there is nothing
 * there to read: the first `npm run seed:home` would work and the second would
 * write empty arrays over good data. That is a seed that destroys content on a
 * re-run, which is the one thing a seed must never do.
 *
 * ⚠ THIS READS `git show HEAD:<path>` INSTEAD. The pre-migration file is still
 * in the commit, so the fixture is generated from the same source the site was
 * built from rather than from anybody's memory of it. Run it once, before or
 * after the swap; the fixture it writes is what the seed consumes from then on.
 *
 * ⚠ THE HEAD COPY IS WRITTEN BESIDE THE REAL FILE, NOT IN A TEMP DIRECTORY —
 * `../../assets/photos/x.jpg` has to resolve, and it only does from the
 * component's own folder. The copy is removed again in a `finally`.
 */
import { execFileSync } from 'node:child_process';
import { writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { dirname, resolve, join, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadAstroFrontmatter } from '../lib/load-astro-frontmatter.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const WEB = resolve(REPO, 'apps/web/src');
const OUT = resolve(HERE, '../fixtures/home.json');

const REF = process.env.EXTRACT_REF || 'HEAD';

/** Read one path at `REF` and drop it beside the original as `.orig.astro`. */
async function atHead(relPath) {
  const abs = resolve(WEB, relPath);
  const gitPath = relative(REPO, abs).split('\\').join('/');
  const src = execFileSync('git', ['show', `${REF}:${gitPath}`], {
    cwd: REPO, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  const copy = join(dirname(abs), `.orig-${basename(abs)}`);
  await writeFile(copy, src, 'utf8');
  return copy;
}

async function fromHead(relPath, names, globals = {}) {
  const copy = await atHead(relPath);
  try {
    return await loadAstroFrontmatter(copy, names, globals);
  } finally {
    await rm(copy, { force: true });
  }
}

/** Keep only what a seed needs from an extracted image: where it is on disk. */
const img = (i) => (i?.absolutePath ? { absolutePath: i.absolutePath } : null);

const site = await loadWebData(resolve(WEB, 'data/site.ts'));
const { school } = site;

const ach = await fromHead('components/home/Achievements.astro',
  ['institutional', 'student', 'awards', 'trophy']);
const ev = await fromHead('components/home/EventsNews.astro', ['events']);
const aff = await fromHead('components/home/Affiliations.astro', ['partners'], { school });
const cam = await fromHead('components/home/Campus.astro', ['gallery']);
const sto = await fromHead('components/home/Story.astro', ['farewell', 'council']);
const hero = await fromHead('components/home/Hero.astro', ['slides']);
const jrn = await fromHead('components/home/AcademicJourney.astro', ['photos']);
const byd = await fromHead('components/home/BeyondAcademics.astro', ['strandPhotos']);
const lrn = await fromHead('components/home/Learning.astro', ['chemPractical']);
const dir = await fromHead('pages/about/directors-message.astro',
  ['paragraphs', 'credentials', 'portrait']);
const pri = await fromHead('pages/about/principals-message.astro',
  ['paragraphs', 'credentials', 'portrait']);
const vis = await fromHead('pages/about/vision-mission.astro', ['cipher', 'greeting'], { school });
const his = await fromHead('pages/about/history-legacy.astro',
  ['history', 'facts', 'voices', 'onward'], { school });

const fixture = {
  /* Stamped so a stale fixture is obvious rather than silent. */
  ref: execFileSync('git', ['rev-parse', REF], { cwd: REPO, encoding: 'utf8' }).trim(),

  achievements: {
    institutional: ach.institutional ?? [],
    student: ach.student ?? [],
    awards: img(ach.awards),
    trophy: img(ach.trophy),
  },
  events: (ev.events ?? []).map((e) => ({
    title: e.title, caption: e.caption ?? null, when: e.when ?? null,
    tag: e.tag ?? null, alt: e.alt ?? null, image: img(e.src),
  })),
  partners: (aff.partners ?? []).map((p) => ({
    name: p.name, note: p.note ?? null, logo: img(p.src),
  })),
  /** facility key → the three photographs the homepage panel showed for it. */
  gallery: Object.fromEntries(Object.entries(cam.gallery ?? {}).map(([k, shots]) =>
    [k, shots.map((s) => ({ image: img(s.src), alt: s.alt }))])),
  story: { farewell: img(sto.farewell), council: img(sto.council) },
  /** stage key → the photograph AcademicJourney showed for it. */
  stagePhotos: Object.fromEntries(Object.entries(jrn.photos ?? {}).map(([k, v]) =>
    [k, { image: img(v.src), alt: v.alt }])),
  /** By strand position — only the second one was ever photographed. */
  strandPhotos: (byd.strandPhotos ?? []).map((v) => (v?.src ? { image: img(v.src), alt: v.alt } : null)),
  learningPhoto: {
    image: img(lrn.chemPractical),
    alt: 'Sunbeam School Ballia students in lab coats performing a chemistry practical on the law of conservation of mass.',
  },
  heroSlides: (hero.slides ?? []).map((s) => ({
    image: img(s.src), alt: s.alt, caption: s.caption ?? null,
    brief: s.brief ?? null, focalPoint: s.position ?? '50% 50%', tone: s.tone ?? 'charcoal',
  })),
  director: {
    paragraphs: dir.paragraphs ?? [],
    credentials: dir.credentials ?? [],
    portrait: img(dir.portrait),
  },
  principal: {
    paragraphs: pri.paragraphs ?? [],
    credentials: pri.credentials ?? [],
    portrait: img(pri.portrait),
  },
  visionMission: { cipher: vis.cipher ?? [], greeting: vis.greeting ?? [] },
  history: {
    history: his.history ?? [],
    facts: his.facts ?? [],
    onward: his.onward ?? [],
    voices: (his.voices ?? []).map((v) => ({
      name: v.name, role: v.role ?? null, alt: v.alt ?? null,
      paragraphs: v.paragraphs ?? [], portrait: img(v.portrait),
    })),
  },
};

await mkdir(dirname(OUT), { recursive: true });
/**
 * WARNING: THE GALLERY IS READ FROM GIT HEAD, SO IT CANNOT GROW ON ITS OWN.
 *
 * Campus.astro no longer holds the gallery const - it was migrated into the CMS
 * and the codemod removed it - so this extractor recovers it from the last
 * commit. That reproduces the keys the site already had and nothing more: a
 * photograph the school sends afterwards has no way in, and a hand-edit to
 * home.json is erased by the next run of this script.
 *
 * Overrides are where a later photograph enters. Merged here, kept in git, each
 * carrying the reason it belongs on that card.
 */
const OV = JSON.parse(await readFile(new URL('../fixtures/home-gallery-overrides.json', import.meta.url), 'utf8'));
let overridden = 0;
for (const [key, o] of Object.entries(OV.gallery ?? {})) {
  if (!o.why) throw new Error(`home gallery override "${key}" has no stated reason`);
  fixture.gallery[key] = o.photos.map((ph) => ({
    image: { absolutePath: resolve(WEB, ph.asset) },
    alt: ph.alt,
  }));
  overridden++;
}

await writeFile(OUT, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');

const n = (x) => (Array.isArray(x) ? x.length : Object.keys(x ?? {}).length);
console.log(`
  Extracted from ${REF} (${fixture.ref.slice(0, 8)})

    institutional     ${n(fixture.achievements.institutional)}
    student figures   ${n(fixture.achievements.student)}
    stage photos      ${n(fixture.stagePhotos)}
    hero slides       ${n(fixture.heroSlides)}
    events            ${n(fixture.events)}
    partners          ${n(fixture.partners)}
    gallery keys      ${n(fixture.gallery)}
    director paras    ${n(fixture.director.paragraphs)}
    principal paras   ${n(fixture.principal.paragraphs)}
    cipher/greeting   ${n(fixture.visionMission.cipher)}/${n(fixture.visionMission.greeting)}
    history voices    ${n(fixture.history.voices)}

  → ${relative(REPO, OUT).split('\\').join('/')}
`);
