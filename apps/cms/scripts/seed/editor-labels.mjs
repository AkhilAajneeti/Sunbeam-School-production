/**
 * WHAT THE CONTENT MANAGER CALLS THINGS.
 *
 *     npm run seed:editor-labels
 *
 * ═══ WHY THIS IS A SEED AND NOT A SETTING SOMEBODY CLICKS ══════════════════
 *
 * Strapi keeps every field's editor label, its helper text and the field used to
 * title a component row in `strapi_core_store_settings` — a database row. Set by
 * hand in "Configure the view" it exists in one database, is lost on a restore
 * from an older dump, and has to be redone per environment by whoever remembers.
 * Written here it is in git, reviewable, and reapplied by a command.
 *
 * ⚠ THIS FILE CHANGES ONLY WHAT AN EDITOR READS. Not one field name, not one
 * value, not one schema. Astro still reads `sectionThree` and `key`; the admin
 * shows "03 — More Than One Way to Learn" and "Section key (do not change)".
 *
 * ⚠ mainField IS THE ROW TITLE. A repeatable component renders as a list of
 * collapsed rows, each titled by ONE field's value. For `shared.section` that was
 * `key`, which is why an administrator opening an academics page saw rows called
 * `abilities`, `steps` and `parents.forum`. Pointing it at `label` is the whole
 * of the global fix.
 */
import { withStrapi } from '../lib/strapi.mjs';

const CT = 'plugin_content_manager_configuration_content_types::';
const CO = 'plugin_content_manager_configuration_components::';

/** field → what the editor should call it, and the hint under it. */
const SECTIONS = {
  sectionOne: ['01 — Recognising Individual Potential',
    'The opening statement, with one large photograph beside it.'],
  sectionTwo: ['02 — Guiding Every Learner Towards Their Strengths',
    'Two photographs on a diagonal, with the copy beside them.'],
  sectionThree: ['03 — More Than One Way to Learn',
    'The ring of abilities around a central photograph. Cards space themselves evenly — add or remove one and the ring adjusts.'],
  sectionFour: ['04 — Learning Through Interaction',
    'One wide photograph with the copy inset over it.'],
  sectionFive: ['05 — Teaching That Evolves With the Learner',
    'Two paragraphs beside a photograph.'],
  close: ['Closing Statement',
    'The full-width band that ends the page.'],
};

const SC_SECTIONS = {
  sectionOne:   ['01 — Every Child Has Potential', 'The opening statement, with one photograph beside it.'],
  sectionTwo:   ['02 — Our Voice Matters', 'A heading over a short index line, two paragraphs, and three photographs as a collage.'],
  sectionThree: ['03 — One Learner, Many Possibilities', 'The ring of abilities around a central photograph. Cards space themselves evenly — add or remove one and the ring adjusts.'],
  close:        ['Closing Statement', 'The full-width band that ends the page.'],
};

const EX_SECTIONS = {
  sectionOne:   ['01 — Learning by Experience', 'The opening statement, with a large photograph and a smaller one overlapping its corner.'],
  sectionTwo:   ['02 — Explore, Question, Discover', 'The three moves of inquiry, hung off one continuous line. ⚠ The arrows between the words are drawn by the page — type the three words only. Beats space and stagger themselves, so adding a fourth re-times the run.'],
  sectionThree: ['03 — Real Learning Experiences', 'A statement with a short list under it and three photographs as a collage.'],
  close:        ['Closing Statement', 'The full-width band that ends the page.'],
};

const CT_SECTIONS = {
  sectionOne:   ['01 — The Mindset', 'The opening statement, with one portrait photograph and its credit beside it.'],
  sectionTwo:   ['02 — Ideas Need a Voice', 'Copy with a run of single words beside it, each carrying a symbol, and two photographs.'],
  sectionThree: ['03 — Ideas Into Impact', 'The same shape as 02 on the dark band, with one photograph. ⚠ The 01–04 numbers down the run are counted by the page — do not type them.'],
  sectionFour:  ['04 — Ideas Take Shape', 'Three photographs as a collage, with the heading, one paragraph and the closing line beside them.'],
};

const CU_SECTIONS = {
  stages: ['The stages of school — edited once, drawn twice',
    '⚠ These five feed BOTH the journey across the top of the page AND the rows of the syllabus library below it. Change a stage here and both change together.'],
  sectionOne:   ['01 — One Curriculum, Every Stage', 'The opening statement, with the journey across the top.'],
  sectionTwo:   ['02 — The Syllabus Library', 'The heading over the library, and the note printed under it. ⚠ Write {count} where the number of classes should go — the page fills it in, so it can never disagree with the cards.'],
  sectionThree: ['03 — Our Curriculum Philosophy', 'A run of cards. Colours are chosen by the page, so a new card is never left without one.'],
  sectionFour:  ['04 — Pathways After Class X', 'A run of cards, one per stream.'],
  sectionFive:  ['05 — Academic Resources', 'A run of cards, each linking to another page on the site.'],
};

/**
 * THE ACADEMIC STRUCTURE STAGE PAGES.
 *
 * ⚠ ONE SHAPE, FIVE PAGES. Every band on every one of these is the same six
 * fields, so the labels that describe a band are shared and only the band's own
 * NAME differs. Written out per page it would be forty-odd near-identical
 * entries to keep in step.
 */
const STAGE_BANDS = {
  'pre-primary-page': {
    open: 'A Beginning', doing: 'Little Hands', land: 'They Don’t Just Learn',
    play: 'A Place to Play', abh: 'A Space of Their Own', first: 'The First Years',
    firstBand: 'Named For All Three Years',
    close: 'Closing Band',
  },
  'primary-stage-page': {
    open: 'Curious Today', rail: 'One Class Teacher', appr: 'Think. Explore.',
    act: 'Learning Doesn’t Stop', val: 'Good Habits', space: 'Spaces That Teach',
    jrn: 'The Journey Through Primary', close: 'Closing Band',
  },
  'middle-school-page': {
    open: 'A Real Venture', exp: 'Learning Becomes', doing: 'Ideas Become',
    four: 'Four Ways', subj: 'More Subjects', lab: 'The Room Changes',
    ach: 'An Achievement', jrn: 'The Journey Through Middle School', close: 'Closing Band',
  },
  'secondary-stage-page': {
    open: 'Someone Who Actually Did It', board: 'Board Practicals Start Here',
    deep: 'Deeper Questions', beyond: 'Beyond the Classroom',
    jrn: 'The Journey Through Secondary', close: 'Closing Band',
  },
  'senior-secondary-page': {
    open: 'Four Routes', beyond: 'And a Galvanometer', board: 'Board Practicals',
    more: 'Learning That Goes Further', jrn: 'The Journey Through Senior Secondary',
    close: 'Closing Band',
  },
  /* These two open with the streams themselves, edited once and drawn in every band. */
  'streams-offered-page': {
    streams: 'The Four Streams — edited once, drawn in every band',
    paths: 'Four Paths', x: 'Different Strengths', dir: 'Different Interests',
    sure: 'What the School Publishes',
  },
  'subject-combinations-page': {
    streams: 'The Four Streams and Their Subjects — edited once, drawn twice',
    open: 'A Stream Is More', worlds: 'Four Streams', map: 'The Subject Map',
    close: 'Closing Band',
  },
};

/** The page-level stream list, on the two pages that carry one. */
const STREAM_FIELDS = {
  label: ['Stream name', 'As the school publishes it — PCM, PCB, Commerce, Humanities.'],
  mark: ['Symbol', 'Which symbol is drawn beside it.'],
  sub: ['Subjects spelled out', 'The line printed under the name — "Physics · Chemistry · Mathematics".'],
  value: ['What the stream is for', 'One line.'],
  note: ['Who it suits', 'One line.'],
  core: ['Core subjects', 'Every student in this stream takes these. One per row.'],
  optional: ['Optional subjects', 'One per row.'],
  additional: ['Additional subjects', 'One per row.'],
  owed: ['The school has not published these core subjects',
    'When ticked, the page says so plainly instead of showing a list nobody published.'],
};

/** What every band's fields are called, wherever the band appears. */
const BAND_FIELDS = {
  kicker: ['Small label above the heading', 'A few words — "Classes IX – X".'],
  heading: ['Heading', 'ONE LINE PER LINE OF THE HEADING, and {{double braces}} round the part set in italic. The page animates the lines in on its own.'],
  body: ['Paragraphs', 'Use *italic* and **bold** for emphasis, and [text](/a/page/) for a link.'],
  caption: ['Caption under the photograph', 'Only some bands have one.'],
  shots: ['Photographs', '⚠ IN THE ORDER THE PAGE PLACES THEM. The first is the largest frame; the ones after it fill the smaller places around it.'],
  cells: ['The run of items', 'One row each. ⚠ The 01, 02, 03 is counted by the page — do not type it.'],
  cellsTwo: ['A second run', 'Only one or two bands have one. Leave it empty otherwise.'],
};

const FIELDS = {
  kicker: ['Small label above the heading', 'A few words — "Every child is different".'],
  heading: ['Heading', ''],
  headingSecond: ['Heading — second line', 'The page puts the line break in.'],
  index: ['Index line', 'The short list under the heading — one word or two per entry.'],
  imageOne: ['Photograph — first', ''],
  imageOneAlt: ['Photograph — first — description', ''],
  imageTwo: ['Photograph — second', ''],
  imageTwoAlt: ['Photograph — second — description', ''],
  imageThree: ['Photograph — third', ''],
  imageThreeAlt: ['Photograph — third — description', ''],
  tiles: ['The cards', 'One card per row.'],
  value: ['The line under the name', ''],
  file: ['PDF — upload one here', 'Drag a PDF in, or pick one already in the Media Library. The card links to it and prints its size on its own. An uploaded file is used in preference to the address below.'],
  href: ['Where it goes', 'A page on this site (for example /academics/assessment/) or a full web address. Leave empty for a card that is not a link.'],
  range: ['Classes it covers', 'As printed on the journey — for example "Classes I – V".'],
  blurb: ['Short line beside the stage', ''],
  classes: ['The classes in this stage', 'One row per class, each with its published syllabus.'],
  sizeMb: ['File size in MB', 'Printed on the card so a parent on mobile data can see it before opening.'],
  marks: ['The words', 'One word per row, each with a symbol beside it. ⚠ The symbols are drawn by the site, so pick from the list — you cannot add a new one.'],
  mark: ['Symbol', 'Which symbol is drawn beside this word.'],
  closingLine: ['Closing line', 'The short line that ends the section, set apart from the paragraphs.'],
  caption: ['Photograph — credit', 'Who is in the picture, or where it was taken. Leave empty for no credit.'],
  captionSecond: ['Photograph — credit, second line', 'The page sets this line smaller.'],
  headingLines: ['Heading — one line per row', 'Each row is one line of the heading. The page puts the breaks in and sets the LAST line in italic — two lines on most pages, three on Experiential.'],
  headingWords: ['Heading — the three words', 'One word per row: Explore, Question, Discover. ⚠ The arrows between them are drawn by the page. Do not type them.'],
  steps: ['The moves', 'One row per beat along the line, in order.'],
  entries: ['The list', 'A name and a short note beside it, one row each.'],
  photo: ['Photograph', ''],
  photoAlt: ['Photograph — description', 'What is in the picture, for readers who cannot see it.'],
  headingEm: ['Heading — the italic part', 'The second half of the heading, set in italic. Leave empty for a heading of one weight.'],
  quote: ['Quotation', 'Type the words only. The design adds the quotation marks.'],
  quoteAuthor: ['Quotation — who said it', 'Leave empty to credit the Principal named in Site Settings.'],
  body: ['Paragraphs', 'Use *italic* and **bold** for emphasis inside a sentence.'],
  image: ['Photograph', ''],
  imageAlt: ['Photograph — description', 'What is in the picture, for readers who cannot see it.'],
  imageUpper: ['Photograph — upper', ''],
  imageUpperAlt: ['Photograph — upper — description', ''],
  imageLower: ['Photograph — lower', ''],
  imageLowerAlt: ['Photograph — lower — description', ''],
  cards: ['Abilities', 'Each becomes one node on the ring.'],
  label: ['Name', ''],
  icon: ['Icon', ''],
};

/* shared.section — the global fix */
const SECTION_FIELDS = {
  label: ['Section name', 'What this block is called on the page. This is the title you see in the list above.'],
  key: ['Section key — do not change', 'The name the page finds this block by. Changing it empties the block on the site.'],
};

/**
 * WARNING: A REPEATABLE COMPONENT WITH NO mainField IS A COLUMN OF BLANK ROWS.
 *
 * An academic page shows "body (3)", "points (3)", "photos (5)" as collapsed
 * rows with NOTHING on them - no title, no preview, just a chevron. An editor
 * has to open each one to find out what it is, and cannot tell where one block
 * of the page ends and the next begins. That was the complaint, and it was fair.
 *
 * mainField is the row title. Pointing each component at the field that carries
 * its words turns five anonymous rows into five readable ones.
 */
const PER_COMPONENT = {
  'philosophy.step': {
    body: ['Sentence', 'One line under the step name.'],
  },
};

const ROW_TITLES = {
  'shared.paragraph': 'text',
  'shared.point': 'title',
  'shared.photo': 'alt',
  'shared.fact': 'value',
  'shared.detail': 'label',
  'philosophy.ability': 'label',
  'philosophy.step': 'label',
  'philosophy.marked': 'label',
  'academics.tile': 'label',
  'academics.stage': 'label',
  'academics.class-doc': 'label',
  'structure.cell': 'label',
  'structure.section': 'heading',
};

/**
 * The academic page form, in the order an editor needs it.
 *
 * WARNING: THE FIRST THING THEY SAW WAS route AND slug. Six developer fields
 * came before a single word of content - and photoKey, owed and existing mean
 * nothing to anyone outside this repository. Content now comes first; identity
 * is still visible, because it says which page you are on, but it is not
 * editable and it is at the bottom.
 */
const ACADEMIC_TOPIC = {
  labels: {
    label: ['Page name', 'What this page is called in lists and menus.'],
    title: ['Heading', 'The main heading on the page.'],
    standfirst: ['Opening paragraph', 'The sentence under the heading.'],
    hint: ['Short summary', 'One line, used where the page is linked from elsewhere.'],
    body: ['Paragraphs', 'The page’s own text, before its sections.'],
    points: ['Cards', ''],
    sections: ['Sections of the page', 'One row per block on the page, in the order they appear.'],
    photos: ['Photographs', ''],
    route: ['Web address', 'Where this page lives on the site. Not editable — changing it would break every link to it.'],
    slug: ['Internal id', 'Not editable.'],
    group: ['Part of the site', 'Which academic section this page belongs to.'],
    displayOrder: ['Order in its group', ''],
    photoKey: ['Photograph key (technical)', 'Used by the page code. Leave it alone.'],
    owed: ['The school publishes nothing on this', 'When true, the page says so rather than inventing content.'],
    existing: ['Has its own page elsewhere', ''],
  },
  /* Not editable: identity and machine values. Visible, so an editor can see
     which page they are on, but not something they can break by typing. */
  locked: ['route', 'slug', 'photoKey'],
  /* Content first, identity last. */
  layout: [
    ['label'], ['title'], ['standfirst'], ['hint'],
    ['body'], ['points'], ['sections'], ['photos'],
    ['group', 'displayOrder'], ['owed', 'existing'], ['route', 'slug'], ['photoKey'],
  ],
};

await withStrapi(async (strapi) => {
  const store = strapi.db.query('strapi::core-store');

  /** Read one configuration row, apply `fn`, write it back. */
  async function patch(key, fn, what) {
    const row = await store.findOne({ where: { key } });
    if (!row) { console.log(`    ✗ ${what} — no configuration row yet`); return 0; }
    const cfg = JSON.parse(row.value);
    const before = JSON.stringify(cfg);
    fn(cfg);
    if (JSON.stringify(cfg) === before) { console.log(`    · ${what} — already set`); return 0; }
    await store.update({ where: { key }, data: { value: JSON.stringify(cfg) } });
    console.log(`    ✔ ${what}`);
    return 1;
  }

  const setField = (cfg, name, [label, description]) => {
    const m = cfg.metadatas?.[name];
    if (!m) return;
    m.edit = { ...m.edit, label, description };
  };

  console.log('\n  Editor labels\n');
  let changed = 0;

  changed += await patch(
    `${CT}api::teaching-philosophy-page.teaching-philosophy-page`,
    (cfg) => {
      for (const [name, meta] of Object.entries(SECTIONS)) setField(cfg, name, meta);
      /* The page's own order, so the editor scrolls it the way a reader does. */
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = Object.keys(SECTIONS).map((name) => [{ name, size: 12 }]);
    },
    'Teaching Philosophy — six named sections',
  );

  changed += await patch(
    `${CT}api::student-centred-learning-page.student-centred-learning-page`,
    (cfg) => {
      for (const [name, meta] of Object.entries(SC_SECTIONS)) setField(cfg, name, meta);
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = Object.keys(SC_SECTIONS).map((name) => [{ name, size: 12 }]);
    },
    'Student-Centred Learning — four named sections',
  );

  changed += await patch(
    `${CT}api::experiential-inquiry-page.experiential-inquiry-page`,
    (cfg) => {
      for (const [name, meta] of Object.entries(EX_SECTIONS)) setField(cfg, name, meta);
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = Object.keys(EX_SECTIONS).map((name) => [{ name, size: 12 }]);
    },
    'Experiential & Inquiry — four named sections',
  );

  changed += await patch(
    `${CT}api::critical-thinking-page.critical-thinking-page`,
    (cfg) => {
      for (const [name, meta] of Object.entries(CT_SECTIONS)) setField(cfg, name, meta);
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = Object.keys(CT_SECTIONS).map((name) => [{ name, size: 12 }]);
    },
    'Critical Thinking — four named sections',
  );

  changed += await patch(
    `${CT}api::curriculum-page.curriculum-page`,
    (cfg) => {
      for (const [name, meta] of Object.entries(CU_SECTIONS)) setField(cfg, name, meta);
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = Object.keys(CU_SECTIONS).map((name) => [{ name, size: 12 }]);
    },
    'Curriculum — the stages and five named sections',
  );

  for (const c of ['philosophy.statement', 'philosophy.pair', 'philosophy.collage', 'philosophy.constellation', 'philosophy.close', 'philosophy.ability', 'philosophy.steps', 'philosophy.step', 'philosophy.listing', 'philosophy.marked', 'philosophy.marked-list',
    'academics.lede', 'academics.tiles', 'academics.tile', 'academics.stage', 'academics.class-doc']) {
    changed += await patch(`${CO}${c}`, (cfg) => {
      for (const [name, meta] of Object.entries(FIELDS)) setField(cfg, name, meta);
      for (const [name, meta] of Object.entries(PER_COMPONENT[c] ?? {})) setField(cfg, name, meta);
    }, c);
  }

  changed += await patch(`${CO}shared.section`, (cfg) => {
    for (const [name, meta] of Object.entries(SECTION_FIELDS)) setField(cfg, name, meta);
    /* ⚠ THE ROW TITLE. This one line is why an academics page stops reading as
       a list of keys and starts reading as a list of sections. */
    cfg.settings.mainField = 'label';
  }, 'shared.section — row title is now the label');

  /* Row titles for every repeatable that had none. */
  for (const [component, field] of Object.entries(ROW_TITLES)) {
    changed += await patch(`${CO}${component}`, (cfg) => { cfg.settings.mainField = field; },
      `${component} — rows titled by "${field}"`);
  }

  /* The academic page form itself. */
  changed += await patch(`${CT}api::academic-topic.academic-topic`, (cfg) => {
    for (const [name, meta] of Object.entries(ACADEMIC_TOPIC.labels)) setField(cfg, name, meta);
    for (const name of ACADEMIC_TOPIC.locked) {
      if (cfg.metadatas?.[name]) cfg.metadatas[name].edit.editable = false;
    }
    cfg.layouts.edit = ACADEMIC_TOPIC.layout.map((row) =>
      row.map((name) => ({ name, size: row.length === 1 ? 12 : 6 })));
  }, 'Academic Topic — content first, identity locked');

  /* The five stage pages, and the two components every band is made of. */
  for (const [uid, bands] of Object.entries(STAGE_BANDS)) {
    changed += await patch(`${CT}api::${uid}.${uid}`, (cfg) => {
      const names = Object.keys(bands);
      names.forEach((name, i) => setField(cfg, name, [
        `${String(i + 1).padStart(2, '0')} — ${bands[name]}`,
        'A band of the page: the label, the heading, the paragraphs, the photographs and the run of cells.',
      ]));
      cfg.layouts = cfg.layouts ?? {};
      cfg.layouts.edit = names.map((name) => [{ name, size: 12 }]);
    }, `${uid} — ${Object.keys(bands).length} named bands`);
  }

  changed += await patch(`${CO}structure.stream`, (cfg) => {
    for (const [name, meta] of Object.entries(STREAM_FIELDS)) setField(cfg, name, meta);
    cfg.settings.mainField = 'label';
  }, 'structure.stream');

  for (const c of ['structure.section', 'structure.cell']) {
    changed += await patch(`${CO}${c}`, (cfg) => {
      for (const [name, meta] of Object.entries(BAND_FIELDS)) setField(cfg, name, meta);
    }, c);
  }

  console.log(`\n  ${changed} configuration row(s) updated\n`);
});
