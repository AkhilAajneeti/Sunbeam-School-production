/**
 * SEED — HOMEPAGE & ABOUT (G6).
 *
 *     npm run seed:home [-- --dry] [-- --force-media]
 *
 * ═══ EVERY SOURCE FIELD HAS A DESTINATION ══════════════════════════════════
 *
 * The first attempt at this group was built from an assumed shape and would
 * have silently dropped the story quote, the checks, the stat, the bento label,
 * the CTA, the media briefs, `voices.slots` and `beyond.strands` — the pages
 * would still have rendered, just with less on them. So the map is written out
 * in full, and anything staying in code says so.
 *
 *   home.story          → homepage.story*        (11 fields, all carried)
 *   home.stages         → homepage.stages        (home.stage)
 *   home.learning       → homepage.learning*
 *   home.facilities     → homepage.facilities    (home.facility-card)
 *   Campus.astro gallery→ facility-card.shots    (shared.photo, 15 images)
 *   home.voices         → homepage.voices*       — EXCEPT `slots`
 *   home.beyond         → homepage.beyond*       (sport-card, strand, links)
 *   site.heritageLede   → homepage.heritage*
 *   Achievements.astro  → achievementsInstitutional / achievementsStudent
 *   EventsNews.astro    → homepage.events        (home.event, with media)
 *   Affiliations.astro  → homepage.affiliations  (home.affiliation-mark)
 *   directors/principals→ Leader Message         (two records)
 *   vision-mission      → cipher, greeting       — EXCEPT `keys`
 *   history-legacy      → history, facts, voices, onward
 *
 * ⚠ STAYING IN CODE, DELIBERATELY:
 *   · `voices.slots`  — a number controlling how many card slots the marquee
 *     lays out. Layout, not content.
 *   · `vision.keys`   — {name, hex, fill, text}: the colour palette the cipher
 *     animation cycles. Design, not content.
 *   · the notice board, alumni cards and quick-access tiles — relations to
 *     Notice, Alumnus and Site Settings, which already own them. Copying them
 *     here would give one fact two owners.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { withStrapi } from '../lib/strapi.mjs';
import { loadWebData } from '../lib/load-web-data.mjs';
import { uploadMedia } from '../lib/media.mjs';
import { upsertBySlug, upsertSingle } from '../lib/upsert.mjs';
import { buildPhotoComponents } from '../lib/components.mjs';
import { slugify } from '../lib/slug.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const W = resolve(HERE, '../../../web/src');
const P = (p) => resolve(W, p);
const FIXTURE = resolve(HERE, '../fixtures/home.json');

const HOMEPAGE = 'api::homepage.homepage';
const LEADER = 'api::leader-message.leader-message';
const VISION = 'api::vision-mission-page.vision-mission-page';
const HISTORY = 'api::history-page.history-page';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_MEDIA = args.has('--force-media');

const facts = (a) => (a ?? []).map((value) => ({ value }));
const paras = (a) => (a ?? []).filter(Boolean).map((text) => ({ text }));
const link = (l) => (l ? { label: l.label, href: l.href, description: l.note ?? null, external: false } : null);
const links = (a) => (a ?? []).map(link).filter(Boolean);
/** {title,detail} | {label,body} | {label,value} → shared.point */
const points = (a) => (a ?? []).map((p) => ({
  number: null, icon: p.icon ?? null,
  title: p.title ?? p.label, body: p.body ?? p.detail ?? p.value,
}));
/**
 * A fixture block → shared.section.
 *
 * ⚠ THE KEY IS THE CONTRACT. The page looks each block up by key, so renaming
 * one in the fixture empties whatever it fed on the site. `label` is what the
 * Content Manager shows as the row title and is safe to change.
 */
const sections = (a) => (a ?? []).map((s) => ({
  key: s.key,
  label: s.label ?? s.key,
  eyebrow: s.eyebrow ?? null,
  heading: s.heading ?? null,
  standfirst: s.standfirst ?? null,
  note: s.note ?? null,
  body: paras(s.body),
  points: points(s.points),
}));

/** {value,label,detail} | {label,value} → shared.figure */
const figures = (a) => (a ?? []).map((f) => ({
  figure: String(f.value ?? f.figure), label: f.label ?? f.title, note: f.detail ?? f.note ?? null,
}));

await withStrapi(async (strapi) => {
  const home = await loadWebData(P('data/home.ts'));
  const site = await loadWebData(P('data/site.ts'));
  const { school } = site;

  /**
   * ⚠ READ FROM A FIXTURE, NOT FROM THE COMPONENTS.
   *
   * This seed used to evaluate the .astro frontmatter directly. That works
   * exactly once: the migration DELETES those inline arrays, so the second run
   * would read nothing and write empty arrays over live content — a seed that
   * destroys data on a re-run. `npm run extract:home` captures them from the
   * pre-migration commit instead, and this reads what it wrote.
   */
  const fx = JSON.parse(await readFile(FIXTURE, 'utf8'));
  const ach = fx.achievements;
  const his = fx.history;

  console.log(`\n  Seeding homepage & about${DRY ? '  (dry run)' : ''}\n`);

  let uploaded = 0;
  let reused = 0;
  const up = async (img, name, alt) => {
    if (!img?.absolutePath) return null;
    const r = await uploadMedia(strapi, { absolutePath: img.absolutePath, name, alternativeText: alt ?? null, force: FORCE_MEDIA });
    r.reused ? reused++ : uploaded++;
    return r.file.id;
  };

  /* ── EVENTS: five curated teasers, each with its own photograph ─────────── */
  const events = [];
  const affiliations = [];
  if (!DRY) {
    for (const e of fx.events ?? []) {
      events.push({
        title: e.title, caption: e.caption ?? null, when: e.when ?? null,
        tag: e.tag ?? null, alt: e.alt ?? null,
        image: await up(e.image, `home-event-${slugify(e.title)}`, e.alt),
      });
    }
    /* ⚠ SEVENTEEN MARKS, IN THE ORDER THE RAIL PRINTS THEM. The array position
       is the running order, so it is preserved rather than sorted — and the
       four unverified marks keep their absent notes rather than gaining one. */
    for (const p of fx.partners ?? []) {
      affiliations.push({
        name: p.name, note: p.note ?? null,
        logo: await up(p.logo, `affiliation-${slugify(p.name)}`, `${p.name} logo`),
      });
    }
  }

  /**
   * ── FACILITY CARDS ───────────────────────────────────────────────────────
   *
   * ⚠ THE PHOTOGRAPHS COME FROM Campus.astro's `gallery`, NOT FROM home.ts.
   * The data file held only a key — 'campus', 'library' — and the pictures and
   * their alt text sat in the component, so the homepage's campus panel could
   * not be re-photographed without editing Astro. The two are rejoined here:
   * the card carries its own shots, and the key disappears with the gallery.
   *
   * ⚠ TWO FACILITIES HAVE NO PHOTOGRAPHS and get none. Shooting Range and
   * Conference Room are absent from the gallery — both are open asset requests
   * — and the panel already renders the brief in their place.
   */
  const facilityCards = [];
  if (!DRY) {
    for (const f of home.facilities ?? []) {
      const shots = f.photo ? fx.gallery[f.photo] ?? [] : [];
      const { entries } = await buildPhotoComponents(
        strapi,
        shots,
        { prefix: `home-facility-${slugify(f.name)}`, force: FORCE_MEDIA },
      );
      facilityCards.push({
        name: f.name, qualifier: f.qualifier ?? null, detail: f.detail ?? null,
        href: f.href ?? null, brief: f.brief ?? null, shots: entries,
      });
    }
  }

  /**
   * ── THE FOUR EDITORIAL PHOTOGRAPHS IN Story AND Achievements ─────────────
   *
   * Each was an `import` at the top of its component with its alt text and its
   * shot brief written into the markup beside it. The picture, what it shows
   * and what is still owed on it are all editorial; the frame, ratio and focal
   * point around them are not, and stay in Astro.
   */
  const s0 = home.story ?? {};
  const b0 = home.beyond ?? {};
  const photoSets = {};
  if (!DRY) {
    const sets = [
      ['storyPhotos', [
        { image: fx.story.farewell, alt: 'Students and staff of Sunbeam School Ballia at the 2024-25 farewell ceremony.', caption: s0.media?.primary },
        { image: fx.story.council, alt: 'Student council office-bearers and NCC cadets of Sunbeam School Ballia.', caption: 'Early Sunbeam Ballia photograph, 2013–2015' },
      ]],
      ['achievementsPhotos', [
        { image: ach.awards, alt: 'Staff of Sunbeam School Ballia receiving awards on stage.', caption: 'Award ceremony, high resolution — audit 4.8' },
        { image: ach.trophy, alt: 'The school’s award graphic for the RoboWunder International Robotics Championship in Kuala Lumpur, showing Deepak Kumar with his drone and the team receiving the award.', caption: 'The RoboWunder international robotics award' },
      ]],
    ];
    for (const [field, list] of sets) {
      const { entries } = await buildPhotoComponents(strapi, list, {
        prefix: `home-${slugify(field)}`, force: FORCE_MEDIA,
      });
      photoSets[field] = entries;
    }
  }

  /**
   * ── SECTION HEADINGS ─────────────────────────────────────────────────────
   *
   * ⚠ EVERY ONE OF THESE WAS LITERAL MARKUP IN AN .astro FILE. They are the
   * largest words on the homepage and there was no way to change any of them
   * without a developer. Transcribed here character for character, with the
   * emphasised span marked `{{like this}}` — see ui/AccentHeading.astro.
   *
   * ⚠⚠ `voicesHeading` IS TAKEN FROM THE MARKUP, NOT FROM home.ts. The data
   * file still says 'What our students say'; the page has rendered 'Where
   * Sunbeam students end up' since the section was rebuilt, and nothing read
   * the data value. Seeding the stale one would have quietly reworded a live
   * heading — the exact failure this transcription is meant to avoid.
   *
   * `story` and `beyond` headings DO match their data entries, so those are
   * taken from the source with only the emphasis marked.
   */
  /**
   * ── THE HERO ─────────────────────────────────────────────────────────────
   *
   * The largest words on the site, and until now the least editable: the
   * headline, the deck, both buttons, all three stat cards and ten
   * photographs were literals in Hero.astro.
   *
   * ⚠ `{currentStrength}` STAYS A TOKEN. The deck and the middle stat both
   * print the school's roll, which Site Settings already owns. Writing "2,700+"
   * into the homepage would give one number two homes and let them disagree —
   * so the CMS stores the sentence and Astro fills the figure in from the
   * record that owns it. Same rule as the transport counts in G4.
   *
   * ⚠ THE NEWLINE IN `heroTitle` IS THE `<br class="hero__br">`. It is a real
   * break in the headline that the CSS drops on narrow widths; an editor sets
   * it by pressing return. See ui/AccentHeading.astro.
   *
   * ⚠ `13 years in Ballia` IS LEFT AS TEXT, NOT DERIVED FROM 2013. It reads as
   * a rounded claim the school makes about itself, and the year the count runs
   * from is not stated anywhere; computing it would quietly change the
   * homepage on 1 January.
   */
  /**
   * ⚠ SEVEN SLIDES HERE, NOT NINE. The hero opens with two drone films that are
   * NOT in this fixture and never were: their sources are fixed files in
   * apps/web/public/video/, hand-encoded from ~55 MB masters with a specific
   * ffmpeg recipe, and their posters are each film's own first frame committed
   * to apps/web/src/assets/videos/. Hero.astro prepends them. Nothing about
   * either is an editorial choice, so nothing about either is in the CMS.
   */
  const heroSlides = DRY ? [] : await Promise.all((fx.heroSlides ?? []).map(async (sl, i) => ({
    alt: sl.alt, caption: sl.caption, brief: sl.brief,
    focalPoint: sl.focalPoint, tone: sl.tone,
    image: await up(sl.image, `home-hero-${String(i + 1).padStart(2, '0')}`, sl.alt),
  })));

  /**
   * ⚠ THREE OF THE FIVE STAGES HAVE NO PHOTOGRAPH, AND GET NONE. Only Primary
   * and Senior were ever illustrated; the rest render the brief in a labelled
   * placeholder, which is the honest state and what the live site shows.
   */
  const stageCards = DRY ? [] : await Promise.all((home.stages ?? []).map(async (x) => {
    const shot = x.photo ? fx.stagePhotos[x.photo] : null;
    return {
      range: x.range, name: x.name, badge: x.badge ?? null, years: x.years ?? null,
      detail: x.detail, href: x.href, imageBrief: x.imageBrief ?? null,
      photo: shot ? await up(shot.image, `home-stage-${slugify(x.name)}`, shot.alt) : null,
      photoAlt: shot?.alt ?? null,
    };
  }));

  const learningPhotoEntry = DRY || !fx.learningPhoto?.image ? null : {
    image: await up(fx.learningPhoto.image, 'home-learning', fx.learningPhoto.alt),
    alt: fx.learningPhoto.alt,
    caption: null,
  };

  /**
   * ⚠ ONE OF THE TWO STRANDS HAS A PHOTOGRAPH. The other renders its brief in
   * a labelled placeholder — the state the live site is in, and an outstanding
   * asset request rather than something to invent a picture for.
   */
  const strandCards = DRY ? [] : await Promise.all((b0.strands ?? []).map(async (x, i) => {
    const shot = (fx.strandPhotos ?? [])[i];
    return {
      title: x.title, body: x.body, href: x.href ?? null, brief: x.brief ?? null,
      photo: shot ? await up(shot.image, `home-strand-${slugify(x.title)}`, shot.alt) : null,
      photoAlt: shot?.alt ?? null,
    };
  }));

  const HERO = {
    /**
     * ⚠⚠ THE HEADLINE IS THREE LINES AND THE ACCENT IS ON "Leaders".
     * It used to break as "Where Ballia's / Future Leaders {{Take Shape}}" —
     * two lines, with the accent on the last three words. Both changed:
     *   · the break moved so "Leaders" stands alone and can take the colour
     *   · "Take Shape" became the quiet third line, set at 0.58em
     * Hero.astro renders one block span per line here and treats the third as
     * the small one. Do not re-flow this into two lines without reading §4 of
     * the brief — the block structure is load-bearing, not cosmetic.
     */
    heroTitle: 'Where Ballia’s Future\n{{Leaders}}\nTake Shape',

    /**
     * ⚠⚠ VERBATIM CLIENT COPY. Do not re-cut this sentence.
     *
     * ⚠ AND IT NO LONGER INTERPOLATES {currentStrength}. The roll is not in the
     * client's wording and the deck was quietly inserting it. The figure has
     * not left the page — it is the middle stat card, which is where it was
     * asked to be.
     */
    heroDeck: 'A Sunbeam institution since 2013 — a CBSE school from Nursery to Class XII, where children learn, grow and prepare for the future.',

    /**
     * ⚠ THE EYEBROW IS NEW, AND IT IS NOT THE MOTTO. The motto used to sit
     * here, above the <h1>; the client asked for it below the deck instead.
     * Hero.astro reads that from Site Settings rather than from a second copy
     * kept here, so the two can never drift apart.
     */
    heroEyebrow: 'Welcome to Sunbeam School Ballia',
    heroActions: [
      /* ⚠ "Explore Sunbeam" LANDS ON /about/history-legacy/, NOT /academics/.
         That page is titled "Our Journey" and is about the school itself; a
         button reading Sunbeam that dropped a reader onto a syllabus was simply
         mislabelled.
         ⚠ NO ADMISSIONS BUTTON HERE. The hero used to carry both application
         links — the same two already in the utility bar, the masthead pill and
         the Admissions band below. Four copies of one action on one screen is
         not four chances to convert; it is a page that will not let a reader
         look around first. */
      { label: 'Explore Sunbeam', href: '/about/history-legacy/', description: null, external: false },
      /* ⚠ ADMISSIONS, NOT "Discover Our Campus". The earlier hero deliberately
         kept admissions out — it argued four copies of one action on one screen
         is a page that will not let a reader look around. The panel design puts
         it back, so the note is kept here rather than deleted: if this ever
         reverts, that is the reasoning it reverts to. */
      { label: 'Admissions', href: '/admissions/', description: null, external: false },
    ],
    heroStats: [
      /* ⚠ TITLE CASE, AND THE THIRD CARRIES ITS OWN LINE BREAK. Hero.astro sets
         the label `white-space: pre-line`, so the \n here is where the line
         turns — "Co-ed Day School" over "in Ballia" — rather than wherever the
         column happens to run out. */
      { figure: '13+', label: 'Years in Ballia', note: null },
      { figure: '{currentStrength}', label: 'Students Today', note: null },
      { figure: '#1', label: 'Co-ed Day School\nin Ballia', note: null },
    ],
    heroSlides,
  };

  const HEADINGS = {
    storyHeading: 'Fifty years of {{Sunbeam}}. Thirteen in Ballia.',
    voicesHeading: 'Where Sunbeam students {{end up}}',
    beyondHeading: 'Every child plays. Every child {{performs}}.',
    stagesPill: 'Leading Our Journey',
    stagesHeading: 'Fourteen years, five stages, one continuous idea',
    stagesTagline: 'Thoughtfully crafted education, driven by excellence and innovation.',
    campusEyebrow: 'The Campus',
    campusHeading: 'Explore our campus life',
    campusSub: 'Twelve laboratories, a fifteen-thousand-book library and a shooting range, on one campus at Agarsanda. Step through the places a Sunbeam day actually happens in.',
    achievementsPill: 'Achievements & Recognition',
    achievementsHeading: 'Six years at {{number one}}',
    achievementsSub: 'Ranked Ballia’s #1 co-educational day school by Education World for six consecutive years, 2019-20 through 2024-25 — alongside what our students have won.',
    eventsPill: 'News & Events',
    eventsHeading: 'Events and {{news}}',
    eventsSub: 'Assemblies, competitions, ceremonies and workshops — what has been happening on the Agarsanda campus.',
    /* ⚠ THE SPACE IS INSIDE THE BRACES. The mark reads
       "Affiliations & recognition<span> partners</span>" — the underline runs
       under the space too, and moving it outside shortens the squiggle. */
    affiliationsHeading: 'Affiliations & recognition{{ partners}}',
    achievementsHonoursHead: 'Institutional recognition',
  };

  /* ── HOMEPAGE ───────────────────────────────────────────────────────────── */
  const s = home.story ?? {};
  const l = home.learning ?? {};
  const v = home.voices ?? {};
  const b = home.beyond ?? {};
  const hl = site.heritageLede ?? {};

  const homepageData = {
    ...HERO,
    ...HEADINGS,
    ...photoSets,
    heritageFigure: hl.figure ?? null,
    heritageEyebrow: hl.eyebrow ?? null,
    heritageHeading: hl.heading ?? null,
    heritageBody: hl.body ?? null,

    storyEyebrow: s.eyebrow ?? null,
    storyParagraphs: paras(s.paragraphs),
    storyQuote: s.quote ?? null,
    storyQuoteAttribution: s.quoteAttribution ?? null,
    storyChecks: facts(s.checks),
    storyStat: s.stat ? figures([s.stat])[0] : null,
    storyBentoLabel: s.bentoLabel ?? null,
    storyCta: link(s.cta),
    storyLinks: links(s.links),

    stages: stageCards,

    learningEyebrow: l.eyebrow ?? null,
    learningHeading: l.heading ?? null,
    learningParagraphs: paras(l.paragraphs),
    learningEvidence: points(l.evidence),
    learningLink: link(l.link),
    learningPhoto: learningPhotoEntry,
    learningImageBrief: l.imageBrief ?? null,

    facilities: facilityCards,

    voicesEyebrow: v.eyebrow ?? null,
    voicesDeck: v.deck ?? null,
    voicesPending: v.pending !== false,
    /* ⚠ EMPTY ON PURPOSE, AND CORRECT. `items` is [] in the source — the school
       has published placements, not testimonials (docs/07 A4). The component
       exists so the first real one can be typed in rather than coded in. */
    voicesItems: (v.items ?? []).map((i) => ({
      quote: i.quote, name: i.name, classOf: i.classOf ?? null, photo: null,
    })),

    beyondEyebrow: b.eyebrow ?? null,
    beyondDeck: b.deck ?? null,
    beyondSport: b.sport ? {
      title: b.sport.title, body: b.sport.body,
      indoor: b.sport.indoor ?? null, outdoor: b.sport.outdoor ?? null,
      href: b.sport.href ?? null, brief: b.sport.brief ?? null,
    } : null,
    beyondStrands: strandCards,
    beyondLinks: links(b.links),

    events,
    affiliations,
    /* ⚠ THE LEAD RANKING PLATE WAS THREE LITERAL STRINGS IN THE MARKUP —
       '#1', the school type and the Education World run — sitting beside a
       hardcoded 'Board results' button. It is the single strongest verified
       claim on the homepage and it could not be corrected without a deploy. */
    /* ⚠ THE ONLY THING THE HOMEPAGE PANEL OWNS. Its pill, heading, quote,
       paragraphs, portrait and signature are all DERIVED from the Principal's
       Leader Message — the same words appear on /about/principals-message/, and
       storing them twice would let the two drift apart. Only the link out is
       the homepage's own. */
    principalCta: { label: 'Read the full message', href: '/about/principals-message/', description: null, external: false },
    achievementsLead: { figure: '#1', label: 'Co-educational day school in Ballia', note: 'Education World · six consecutive years, 2019-20 to 2024-25' },
    achievementsLeadCta: { label: 'Board results', href: '/academics/board-results/', description: null, external: false },
    achievementsInstitutional: points(ach.institutional),
    achievementsStudent: figures(ach.student),
  };

  if (!DRY) {
    console.log(`    homepage            ${await upsertSingle(strapi, HOMEPAGE, homepageData)}`);
  }

  /**
   * ── LEADER MESSAGES ──────────────────────────────────────────────────────
   *
   * ⚠ MOST OF THESE TWO PAGES IS NOT IN THE FRONTMATTER. Only `paragraphs`,
   * `credentials` and the portrait import are consts; the eyebrow, heading,
   * name, role line, alt text, brief, pull quote and the Principal's `pending`
   * note are all written as literal props on <LeaderMessage> in the template —
   * which loadAstroFrontmatter deliberately does not evaluate. They are
   * transcribed here from the markup, character for character, and the
   * production diff is what proves the transcription.
   */

  /**
   * ⚠⚠ THE PRINCIPAL'S MESSAGE, VERBATIM — five paragraphs as the school sent
   * it, signed by a named person. Do not tighten it, re-order it, re-punctuate
   * it or shorten it.
   *
   * ⚠⚠ THE HOMEPAGE EXTRACT IS TAKEN FROM THIS ARRAY BY INDEX, NOT RETYPED —
   * see PRINCIPAL_EXTRACT below. It used to be typed out separately, and the
   * copy that had been live was NOT this text: it was a condensed rewrite of
   * paragraph two, missing the words "focusing on", a comma, and the whole
   * sentence beginning "Our classrooms are places of curiosity…". A paraphrase
   * had been printing on the homepage under the Principal's signature, and
   * nothing could catch it while the two were separate strings.
   */
  const PRINCIPAL_MESSAGE = [
        'At Sunbeam School Ballia, we believe that education is not merely about imparting knowledge, but about nurturing character, inspiring creativity, and preparing young minds to lead with empathy and vision. Guided by the ethos of the Sunbeam Group, our mission is to create an environment where academic excellence goes hand-in-hand with values, discipline, and a deep sense of social responsibility.',
        'The Sunbeam vision has always been to empower students with 21st-century skills while staying rooted in Indian culture and moral values. We are committed to holistic development — focusing on intellectual growth, physical well-being, emotional resilience, and ethical strength. Our classrooms are places of curiosity and collaboration, where innovative teaching methods meet modern technology, ensuring our students are ready for a dynamic world.',
        'At Sunbeam School Ballia, we celebrate diversity of talent and encourage participation in sports, cultural activities, performing arts, and community service. From fostering leadership qualities to instilling environmental awareness, every initiative is aimed at shaping responsible global citizens.',
        'As Principal, my role is to ensure that every child feels valued, safe, and inspired to achieve their full potential. Together with our dedicated teachers, supportive parents, and the larger Sunbeam family, we strive to uphold the group\u2019s proud legacy — Lighting the Lamp of Knowledge — and carrying forward the commitment to excellence in education.',
        'Let us work together to nurture a generation that thinks critically, acts responsibly, and dreams fearlessly.',
  ];

  /**
   * ⚠⚠ EXTRACTING MEANS DROPPING WHOLE SENTENCES, NEVER EDITING ONE.
   *
   * This is the rule the earlier drift broke: the copy that had been live was a
   * condensed REWRITE of paragraph two, missing "focusing on", a comma and a
   * whole sentence — a paraphrase printing under the Principal's signature.
   * Cutting at a full stop cannot paraphrase. Trimming inside a sentence can.
   */
  const firstSentences = (text, n) => {
    const parts = text.match(/[^.!?]+[.!?]+(?:\s|$)/g);
    if (!parts || parts.length <= n) return text;
    return parts.slice(0, n).join('').trim();
  };

  /**
   * The two paragraphs the homepage panel shows.
   *
   * ⚠⚠ PREFIXES OF THE REAL PARAGRAPHS, TAKEN BY SLICING — not retyped, and not
   * the whole paragraphs either. PrincipalSpeak is laid out for the pull quote
   * and two SHORTENED paragraphs; handing it paragraphs 2 and 4 whole is about
   * 2.2× the copy it was designed for, and it measurably overflows — the copy
   * column spilled 25px past the section at both 1440px and 390px. Measured
   * again after this cut: no spill at either width.
   *
   * ⚠ WHY THIS IS SAFE TO DUPLICATE. Each is an exact prefix of its paragraph,
   * so /about/principals-message/ 's build-time guard — every extract paragraph
   * must appear verbatim inside the full message — still holds. Drift is
   * impossible by construction; the guard is the backstop for anyone editing in
   * the admin instead of here.
   */
  const PRINCIPAL_EXTRACT = [
    firstSentences(PRINCIPAL_MESSAGE[1], 2),
    firstSentences(PRINCIPAL_MESSAGE[3], 1),
  ];

  const leaders = [
    {
      role: 'director', src: fx.director,
      name: 'Dr. Kunwar Arun Singh',
      roleLabel: 'Director, Sunbeam School Ballia',
      eyebrow: 'Director Speak',
      heading: 'A word from our Director',
      portraitAlt: 'Dr. Kunwar Arun Singh, Director of Sunbeam School Ballia.',
      portraitBrief: 'Director portrait',
      pullQuote: 'Sunbeam Ballia is committed to make Ballia a name to reckon with for education and to provide world-class quality education.',
      pending: null,
    },
    {
      /* ⚠ `src` STILL SUPPLIES THE PORTRAIT AND CREDENTIALS. Only the prose
         moved out of the extracted fixture and into PRINCIPAL_MESSAGE above. */
      role: 'principal', src: fx.principal,
      paragraphs: PRINCIPAL_EXTRACT,
      name: school.principal,
      roleLabel: `Principal, ${school.name}`,
      eyebrow: 'Principal Speak',
      heading: 'A word from our {{Principal}}',
      portraitAlt: `${school.principal}, Principal of Sunbeam School Ballia.`,
      portraitBrief: 'Principal portrait',
      pullQuote: 'At Sunbeam School Ballia, we believe that education is not merely about imparting knowledge, but about nurturing character, inspiring creativity, and preparing young minds to lead with empathy and vision.',

      /**
       * ⚠⚠ THE FULL MESSAGE, VERBATIM — five paragraphs as the school sent it.
       * It is signed by a named person. Do not tighten it, re-order it,
       * re-punctuate it or shorten it.
       *
       * ⚠ `paragraphs` ABOVE IS THE HOMEPAGE EXTRACT AND STAYS AS IT IS. The
       * homepage panel is designed around the pull quote and two paragraphs;
       * dropping all five into it would bury the rest of the page. The two it
       * carries are the second and fourth paragraphs below, word for word —
       * and /about/principals-message/ checks that at build time, so the
       * extract cannot drift away from the message it is taken from.
       *
       * ⚠ THE PULL QUOTE IS THE FIRST SENTENCE OF PARAGRAPH ONE. The dedicated
       * page therefore drops the quote and runs the message whole, rather than
       * printing that sentence twice in a row or cutting it out of the prose.
       */
      fullMessage: PRINCIPAL_MESSAGE,

      /* The full message arrived, so A5 is closed. */
      pending: null,
    },
    /**
     * ⚠⚠ THE VICE PRINCIPAL'S COPY IS THE SCHOOL'S OWN, VERBATIM, and it is
     * signed by a named person. Do not tighten it, re-order it, re-punctuate it
     * or shorten it — including the colon in "Our goal is simple:".
     *
     * ⚠ THE PULL QUOTE IS NOT REPEATED IN THE BODY. The school sent it as the
     * message's first line, in quotation marks; it is set as the quote and the
     * paragraphs start after it.
     *
     * ⚠ THE PORTRAIT IS THE SCHOOL'S OWN FILE, vicePrincipal.jpeg. Until it was
     * supplied this row carried `pending: 'A17'` and the slot rendered the
     * labelled placeholder — never another leader's photograph in its place.
     */
    {
      /* ⚠ `src` CARRIES ONLY THE PORTRAIT HERE. The other two leaders' rows come
         from a fixture extracted out of the old components, so their `src` holds
         paragraphs and credentials too. The Vice Principal's copy was supplied
         by the school directly and is written on this row; only the photograph
         needs the same upload path as theirs. */
      role: 'vice-principal',
      src: { portrait: { absolutePath: P('assets/photos/vicePrincipal.jpeg') } },
      name: 'Mr. Pankaj Singh',
      roleLabel: 'Vice Principal, Sunbeam School Ballia',
      eyebrow: 'Vice Principal Speak',
      heading: 'A word from our {{Vice Principal}}',
      portraitAlt: 'Mr. Pankaj Singh, Vice Principal of Sunbeam School Ballia.',
      portraitBrief: 'Vice Principal portrait',
      pullQuote:
        'Education should challenge the mind, strengthen character, and give every child the resilience to rise after every setback.',
      paragraphs: [
        'At Sunbeam School Ballia, my focus is to build a culture of academic excellence, active learning and continuous growth. I believe classrooms should be democratic spaces where students are heard, respected and encouraged to question, participate and think independently.',
        'Our goal is simple: strong academics, confident learners and resilient young minds ready to face the future.',
      ],
      /**
       * ⚠⚠ `BCS` AND `PGDYO` ARE NOT EXPANDED, DELIBERATELY. Nobody has
       * confirmed what either stands for, and guessing an abbreviation in print
       * beside a named person's own qualifications is not acceptable.
       *
       * ⚠ THE ONLY EDITS TO WHAT THE SCHOOL SENT are a space after the full
       * stop in "M.Sc.(Chemistry)" and the removal of the space before the
       * comma in "BCS , Career Counsellor". Nothing else was touched.
       */
      credentials: [
        'M.Sc. (Chemistry)',
        'BCS, Career Counsellor',
        'B.Ed & PGDYO',
      ],
      /* The portrait arrived; nothing on this page is outstanding now. */
      pending: null,
    },
  ];
  for (const L of leaders) {
    if (DRY) continue;
    const slug = slugify(L.name);
    const outcome = await upsertBySlug(strapi, LEADER, slug, {
      role: L.role, name: L.name, roleLabel: L.roleLabel,
      eyebrow: L.eyebrow, heading: L.heading, pullQuote: L.pullQuote,
      /* ⚠ A ROW MAY CARRY ITS OWN COPY INSTEAD OF AN EXTRACTED FIXTURE. The
         two original leaders were transcribed out of the old components and
         arrive as `src`; the Vice Principal's was supplied by the school
         directly and is written on the row above. Neither is more correct —
         but a row with no `src` must not dereference one. */
      paragraphs: paras(L.paragraphs ?? L.src?.paragraphs),
      /* Only the Principal has one so far; the others render `paragraphs`. */
      fullMessage: paras(L.fullMessage),
      credentials: facts(L.credentials ?? L.src?.credentials),
      portrait: L.src?.portrait
        ? await up(L.src.portrait, `leader-${slug}`, L.portraitAlt)
        : null,
      portraitAlt: L.portraitAlt,
      portraitBrief: L.portraitBrief,
      pending: L.pending,
    });
    console.log(`    leader (${L.role})${' '.repeat(Math.max(1, 16 - L.role.length))}${outcome}`);
  }

  /* ── VISION & MISSION ───────────────────────────────────────────────────── */
  if (!DRY) {
    console.log(`    vision & mission    ${await upsertSingle(strapi, VISION, {
      cipher: paras(fx.visionMission.cipher), greeting: paras(fx.visionMission.greeting),
      /* ⚠ THE PAGE'S OWN WORDS — the Vision statement, the greeting's
         translation and oath, and the Cipher letter. They were written into
         the page itself until now. */
      sections: sections(fx.visionMission.sections),
    })}`);
  }

  /* ── HISTORY ────────────────────────────────────────────────────────────── */
  if (!DRY) {
    const voices = [];
    for (const t of his.voices ?? []) {
      voices.push({
        name: t.name, role: t.role ?? null, alt: t.alt ?? null,
        paragraphs: paras(t.paragraphs),
        portrait: await up(t.portrait, `history-voice-${slugify(t.name)}`, t.alt),
      });
    }
    /* ⚠ `facts` IS shared.point, NOT shared.figure. Its values are a motto, an
       affiliation line and a postal address — prose, and two of the three run
       well past shared.figure's 24-character `figure`. A figure is '#1' or
       '2,700'; these are labelled statements, so they are points. */
    console.log(`    history page        ${await upsertSingle(strapi, HISTORY, {
      history: paras(his.history),
      facts: points(his.facts),
      voices,
      onward: links(his.onward),
    })}`);
  }

  console.log('');
  if (!DRY) console.log(`  Media — ${uploaded} uploaded, ${reused} reused`);
  console.log('');
});
