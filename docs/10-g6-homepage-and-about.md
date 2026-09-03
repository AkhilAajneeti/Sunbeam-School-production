# G6 — Homepage & About

Four content types, eleven components rewired, and the first group where most of
the content was never in a data file to begin with.

---

## Why this group was re-cut before it was built

The first attempt was designed against an assumed shape of `data/home.ts` and
would have silently dropped the story quote, the three checks, the stat card, the
bento label, the CTA, both media briefs and `beyond.strands`. Every page would
still have rendered — just with less on it. That is the failure mode this
migration is least able to see, so the schemas were thrown away and rebuilt
against the actual source, with a written destination for every field.

**The governing rule, as approved:** Strapi owns editorial content. Astro owns
design, layout, animation, presentation configuration and derived/application
logic. Something does not move to Strapi merely because it happens to live in an
array.

---

## What moved, and what deliberately did not

### Content types

| Type | Kind | Holds |
|---|---|---|
| `homepage` | single | every editorial section of `/` — 60+ attributes |
| `leader-message` | collection (2) | the Director's and the Principal's messages |
| `vision-mission-page` | single | the cipher and greeting prose |
| `history-page` | single | the legacy narrative, its facts, voices and onward links |

### New components

`home.stage` · `home.facility-card` · `home.event` · `home.sport-card` ·
`home.strand` · `home.voice` · `home.slide` · `home.affiliation-mark` ·
`about.testimonial`

### ⚠ Staying in code, on purpose

- **`voices.slots`** — how many empty card slots the section lays out. Layout.
- **`vision.keys`** — `{name, hex, fill, text}`, the palette the cipher animation
  cycles. Design.
- **Photo frames** — ratio, `object-position` where it is a layout choice, tone
  rotation, which of three shots takes the tall slot, `ACTIVE` slide index.
- **The notice board, alumni cards and quick-access tiles** — relations to
  Notice, Alumnus and Site Settings, which already own them. Copying them here
  would give one fact two owners.
- **`PrincipalSpeak` in full** — its pill, heading, quote, paragraphs, portrait
  and signature are **derived** from the Principal's Leader Message, the same
  record `/about/principals-message/` renders. Only the link out is the
  homepage's own. The panel used to repeat all of it as literals, so the school
  could correct one and not the other.
- **`history-page.facts` and `.onward`** — held in the CMS but **not rendered**.
  Both were declared in `history-legacy.astro` and never used by its template.
  Carried so the copy is not lost; putting them on the page would be a redesign.

---

## Three mechanisms this group needed

### 1. `AccentHeading` — headings whose words are content and whose emphasis is not

Every band carried its heading as literal markup:

```astro
<h2 class="voices__heading">
  Where Sunbeam students <span class="t-squiggle">end up</span>
</h2>
```

The words are editorial; the hand-drawn underline is design. Written that way
the only route to rewording the largest text on the homepage was an `.astro`
edit. The CMS now stores

```
Where Sunbeam students {{end up}}
```

and `ui/AccentHeading.astro` turns the braces into the squiggle. Not rich text,
deliberately — one kind of emphasis, applied one way, or the headings drift apart
within a term.

Two props exist for real typographic bugs, not for decoration:

- `nowrapClass` binds the accent to punctuation straight after it (Story's
  "…of **Sunbeam**." was orphaning its full stop).
- `breakClass` turns a newline into `<br class="…">` (the hero headline breaks
  after "Where Ballia's", and the break is dropped on narrow widths).

`plainHeading()` strips the markers for consumers that print the heading plain —
which is how one stored heading serves both the homepage panel (underlined) and
the About page (not).

### 2. `fillTokens` — a derived figure inside a sentence

The hero deck and its middle stat card both print the school roll, which Site
Settings owns:

```
A Sunbeam institution since 2013 — {currentStrength} students, Nursery to Class XII…
```

The sentence belongs to the homepage; the number does not. Writing "2,700+" into
the homepage would give one fact two homes and let them disagree. An unknown
token is left as typed rather than blanked, so a mistyped placeholder shows
itself instead of quietly deleting a number.

### 3. `Photo` takes a `file`

Rather than swapping `<Photo>` out for `<CmsImage>` everywhere, `Photo` gained a
`file` prop that wins over `src`. Same wrapper, same ratio, same focal point,
same labelled placeholder when there is no picture at all — so the CMS decides
*which* photograph appears and the component still owns the frame. That is what
kept 173 pages byte-identical.

---

## ⚠ The seed reads a fixture, not the components

Every other group's seed reads `apps/web/src/data/*.ts`, which stay on disk
afterwards, so the seed is re-runnable for ever. G6 is different: most of its
content was inline in the components — Campus's photo gallery, Achievements' two
arrays, EventsNews' five teasers, Affiliations' seventeen marks, the hero's ten
slides, both About messages — and the migration **deletes** those.

A seed that read the working tree would therefore work exactly once and write
empty arrays over live content on the second run. `npm run extract:home` reads
the pre-migration files with `git show HEAD:<path>`, evaluates their frontmatter
and writes `scripts/fixtures/home.json`, stamped with the commit it came from.
The seed consumes that.

```
npm run extract:home     # once, from the pre-migration commit
npm run seed:home        # as often as you like
```

---

## Verification

All eight checks, plus the G2–G5 regression.

| # | Check | Result |
|---|---|---|
| 1 | Content exists in Strapi | homepage 1, leader-message 2, vision 1, history 1; every array count matches source |
| 2 | Frontend fetches it | 16 components/pages rewired; no `data/home` import remains |
| 3 | A live mutation changes the page | 3 fields mutated → rendered; reverted |
| 4 | No duplicate hardcoded content | every inline array and photo import removed |
| 5 | Media from Strapi | every photograph on `/` is Strapi; 6 decorative icons stay local |
| 6 | SEO correct | title, description, canonical, robots, OG — identical |
| 7 | UI, animations, URLs, anchors | data-hooks, `id=` targets and route set identical |
| 8 | Seed idempotent | run three times: 0 created, no duplicates, 0 uploads |

**Text diff against production: 173/173 identical.**
**Head / hooks / anchors: 172/173** — the one difference is `data-office-phone`
on `/contact-us/`, added deliberately in G2 to get a hardcoded phone number out
of client-side JavaScript.

```
npm run verify           # both diffs, every route
npm run verify:counts    # row count per content type (Strapi must be stopped)
```

### Three regressions the checks caught

None were visible in the page text, which is why the second verifier exists.

1. **`/academics/academic-calendar/` — double-escaped ampersand.** The page-meta
   fixture was extracted from rendered HTML, so `&` arrived as `&#38;`; Astro
   escaped it again and the meta description read `&#38;#38;`. Every search
   result and shared link would have shown it. Fixed by decoding entities on the
   way in — the CMS should hold the character, and escaping is the renderer's
   job exactly once.

2. **`/beyond-academics/sports/` — an empty animated div.** The source gave
   `support` as `undefined` when a facility had no extra photographs; the CMS
   query always returns an array, and `[] && …` is truthy. Every facility without
   support shots rendered an empty `<div data-reveal>`. Fixed to `.length > 0`,
   and the same pattern was swept for across all migrated components.

3. **`loadAstroFrontmatter` could not see braced imports.** The binding test
   ended `…)\b`, which sat between `}` and a space — two non-word characters,
   where a word boundary cannot exist. `import portrait from …` matched;
   `import { school } from …` did not. Invisible until a braced import was the
   one that mattered.

---

## ⚠ The database was lost and restored during this group

Two Strapi instances were started seconds apart; every content-type table was
dropped. Recovered from the morning's backup plus a replay of the day's two
seeds. The restore path itself turned out to be broken and had never been tried.

Full account, mechanism and the safeguards added: **docs/09**, "Second incident".

The short version, which matters more than the story:

- **One Strapi at a time.** Seeds boot their own in-process; `bootStrapi()` now
  refuses to start when something is already serving port 1337.
- **`npm run develop` is two node processes.** Killing the npm wrapper leaves the
  server holding the port.
- **`npm run verify:counts`** after anything that might have overlapped. A dropped
  table is silent: the admin loads, the media library is full, the site builds.
