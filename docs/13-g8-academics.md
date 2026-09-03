# G8 — Academics

46 routes, ~40 bespoke page components, 260 content consts. The largest group by
a wide margin, and the one where a successful build proves nothing.

---

## The architecture, as approved

**`academic-topic`** — one record per academics page, 46 of them. Each holds the
page's own fields (label, hint, title, standfirst, `owed`, `existing`) and its
content as **keyed `shared.section` components**.

The key is the const the section replaces:

```
  const steps = [ … forty lines … ];          in AssessmentPage.astro
    →  section key 'steps'                     on /academics/assessment/
    →  const steps = ac.section('steps').points;
```

⚠ **The query returns the source's own field names.** A point comes back as
`{ n, mark, k, v, href, photo, alt, cap, owed, slot, note, suffix, … }` — exactly
what the markup already destructures — and one stored field is returned under
*every* name the source used for it across the section. That is the whole reason
forty bespoke designs could be migrated at once: a page changes the line that
**declares** a const and not one line that **uses** it, so its layout, markup,
GSAP timelines, scoped CSS, responsive rules, section keys and URL are untouched.

`ac.blockMap('parents')` does the same for the two largest objects —
`parents` (12 named blocks, 10 components) and `teachingLearning` (6) — rebuilding
the original nesting from the section keys so `parents.forum.steps` still
resolves.

---

## ⚠ Why this was done by rule, and what that bought

260 consts across 60 files is past the point where a person can hold the mapping
in their head, and past the point where a reviewer can check a seed by reading
it. So there are four artefacts, and they are the deliverable as much as the
schema is:

| Artefact | What it is |
|---|---|
| `npm run extract:academics` | evaluates every const out of the source into `fixtures/academics.json` — the prose is never retyped |
| `fixtures/academics-shapes.md` | the structure of all 260, which the schema was designed from |
| `npm run plan:academics` → `academics-plan.md` | **every const's destination, and why** |
| `fixtures/academics-swap.json` | written by the seed; the codemods act on exactly what was seeded |

The plan is the answer to "does every source field have a destination":

```
  CMS           151     a section part on an Academic Topic
  MEDIA          15     a photograph, uploaded and linked
  DERIVED         8     computed at render time, never stored
  SITE           23     Site Settings already owns it
  DESIGN         63     layout, geometry, palette — stays in code
  UNCLASSIFIED    0     ← must be zero
```

⚠ **The rules live in one file** (`scripts/lib/academics-map.mjs`) and the
planner, the seed and the verifier all import them. Three copies of a classifier
drift, and the drift shows up as content the plan says is migrated and the page
renders empty.

---

## ⚠ What stayed in code, and what nearly didn't

**Design, correctly kept:** route constants, orbit radii and angles, tile spans,
animation timings and odometer durations, tone and accent palettes, glyph
geometry, `MARK` tables of SVG path data, the staff-table controls. 63 consts.

**Site Settings, correctly kept out:** the school name (31 files hardcoded it) and
the admissions phone number in both its dialling and display forms.

Three of those calls were wrong at first, and each was caught by a check rather
than by reading:

- **`orbit` and `abilities`** are `{k, art, a, r, s, o}` — a word, a decorative
  icon and a position on a ring. A "prose or gallery" test called them galleries
  and kept nine and seven **images** while dropping every **word**. A count check
  cannot see that: nine photographs arrived, exactly as expected. *A shape that
  carries a label is never pure design.*
- **`line` and `dir`** look like layout and are prose — "Engineering and the
  physical sciences." Listing them as design let two stream descriptions off the
  page unnoticed.
- **`MARK`** is `<path d="M…"/>` strings; the path-command test missed all
  thirteen because the string starts with `<path`, and they were seeded as
  thirteen empty editorial blocks.

---

## Verification — three checks, not one

A section that comes back empty does not throw, does not fail the build, and does
not change the page's structure. So there are three passes, and each caught
things the others could not.

### 1 · Coverage — `npm run verify:academics`

Every const that should be in Strapi, is — with the right number of entries.

```
  records            46
  consts expected   154
  fully populated   154
  total entries     733
  missing / empty / short / unexplained    0
```

### 2 · Field fidelity — `academics-fields.mjs`

Counting entries is not enough: a card can arrive with the right count and one
field short. This walks every source object key by key and asks whether the value
actually landed.

```
  keys checked   1689
  matched        1579
  design (kept)   110
  LOST               0
```

It started at **117 lost** and found, among others: `gloss`, `sub`, `format` and
`chips` on cards with nowhere to go; `stops` routed to a photo list, keeping six
pictures and dropping every word beside them; five syllabus-document lists;
`suffix` dropped from "75+"; a stage's `milestone`; a card's `slot` key, without
which a bespoke layout could no longer tell its four framed panels apart.

### 3 · Production diff

```
  173/173 identical to production
  171/173 head / hooks / anchors identical
```

The two head differences are `/contact-us/` and `/download-tc/` — the `data-*`
attributes added deliberately in G7, already approved. Nothing academics lost a
hook, an anchor or a meta tag.

⚠ This is the check that found what the other two could not: `&amp;` printing
literally, `**` markers rendering as asterisks, a `data-reveal-delay` dropped in a
revert, `01` printed where a heading belonged (`step` aliased to the number), and
`17574` losing its thousands separator.

### The eight checks

| # | Check | Result |
|---|---|---|
| 1 | Content in Strapi | 46 records · 196 sections · 733 entries |
| 2 | Frontend consumes it | 40 components swapped; **no academics data file is imported anywhere** |
| 3 | Mutation test | point title, keyed section heading, blockMap sub-block → all rendered |
| 4 | No old data source | verified by grep; the five data files are now seed input only |
| 5 | Media | 107 photographs in Strapi, alt text with them |
| 6 | SEO | title, description, canonical, robots, OG — identical |
| 7 | UI, URLs, anchors | hooks, `id=` targets, route set identical |
| 8 | Seed idempotent | run repeatedly: 0 created, 46 updated, 0 uploads |

**G2–G7 regression: included in the 173/173.**

---

## ⚠ Known gap: some academics photographs are still local

The migrated media is the photography that lived inside content arrays. Academics
pages also carry banner and in-layout photographs imported directly at the top of
a component (`pRoom`, `pBench`, …) and never held in a const. Those are **not** in
Strapi: **14 distinct photographs**, referenced 97 times across 56 academics
components.

They render correctly and are unchanged, but the school cannot replace them
without a developer. Closing that means adding a media field per page and is a
contained follow-up — it is recorded here rather than left to be discovered.

---

## Tools added

```
npm run extract:academics    capture every const from the source
npm run plan:academics       print every const's destination
npm run seed:academics       seed, and write the swap map
npm run verify:academics     coverage + field fidelity
npm run verify               both production diffs, every route
```

Plus three codemods — const initialisers, image tags, and the data-file
consumers — each acting on the swap map the seed wrote, so none of them can
disagree with what was actually seeded.
