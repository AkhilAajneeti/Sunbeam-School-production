# Whole-project CMS completion audit — G2 to G8

Two parts: closing the academics media gap, then auditing the whole migration
before the first commit.

---

## Part 1 — the academics media gap

### ⚠ The gap I reported was wrong

I reported **14 photographs referenced 97 times**. That number came from a scan
of `src/assets/photos/`. The academics pages import their photography from
**twenty-four** asset directories — `parents forum`, `school-event`, `chem lab`,
`School Activity in Uniform`, `library`, `corridor and stairs` and the rest.

The real gap:

| | reported | actual |
|---|---|---|
| distinct photographs | 14 | **88** |
| render sites | 97 | **210** |
| owning records | — | **42** |

Scanning one directory produced a number that was precise and wrong. The count
is now taken across every photographic directory, with `icons`, `brand`, `logos`,
`textures`, `patterns` and `marks` excluded as design.

### The ownership model

The photographs are the page's own, so they hang off the page's own record:
`academic-topic.photos` — a repeatable `shared.photo`, keyed by slot.

`shared.photo` gained one optional `key`; no new component was added. The key is
the binding the component already used, so the swap is one line per picture and
nothing below it moves:

```
  -  import pBench from '../../../assets/chem lab/DSC_1262 copy.jpg';
  +  const pBench = ac.pic('pBench');

  -  <Picture   src={pBench}  alt={`Students of ${S} at the bench…`} formats={['webp']} widths={[340,600,860]} …/>
  +  <SmartImage file={pBench} alt={ac.picAlt('pBench')}             widths={[340,600,860]} …/>
```

`widths`, `sizes`, `loading`, `decoding` and `object-position` are carried over
verbatim — how large a photograph is fetched and where it is cropped is design.
`formats` is dropped: it is Astro's local-pipeline instruction and means nothing
for a file whose derivatives were made at upload.

**Alt text moved with the picture** — 151 of 210 slots. A photograph replaced in
the admin with its description left behind in code describes the wrong image.
It is stored with its token (`A student of {schoolName} using a microscope…`), so
the school's name still has exactly one source.

The other 59 keep their description in code: 18 are decorative (`AsClose` sets
`alt=""` itself, deliberately), the rest are already described by a value with
its own source.

### ⚠ The defect this nearly shipped

Fourteen of the assets are called `01.jpg`, `02.jpg`, `03.jpg` or `05.jpg` — one
per school-activity folder. **Media reuse is by name.** Naming each upload after
its basename made the second and every later one silently reuse the first one's
picture: `career-counselling/01.jpg` and `little-agriculturists/01.jpg` became
one file.

Nothing errors. The slot is populated, the page renders a photograph, the text
diff is identical and the alt is correct. It is simply the wrong photograph.

Names are now folder-qualified wherever a basename is ambiguous, and — because a
name check cannot catch this class at all — every slot is compared **as an
image**: source and stored file are each reduced to a 16×16 average hash and
matched. Strapi re-encodes on upload, so bytes legitimately differ; the picture
does not.

```
  slots checked   210
  same picture    210
  wrong picture     0
```

### What is left local, and why

- **45 `PageHero src=` fallbacks.** The banner already comes from
  `page-meta.heroBanner`, which 45 of the 46 academics routes have; `src` is the
  required fallback that renders when a row has none. Removing it would remove
  the fallback, not the hardcoding.
- **43 decorative images** still render on academics pages — every one an icon or
  illustration (`star`, `clouds`, `kite`, `rocketpaper`, `cbse-emblem`).
- **57 dead imports removed.** Left by earlier codemods, they rendered nothing but
  read as content still hardcoded — and they are why the first count was wrong.

**No editorial photograph on any academics page now comes from a local file.**

### Verification

| Check | Result |
|---|---|
| Slots stored | **210 / 210**, every one with a picture and a description |
| Right picture | **210 / 210** by image comparison |
| Alt text | **540 / 540** identical, in the same order, across 57 routes |
| Routes | **173 / 173** textually identical to production |
| Head, hooks, anchors | **171 / 173** — the two are G7's approved `data-*` |
| Coverage / field fidelity | 154/154 consts · 733 entries · 1,689 keys · **0 lost** |
| Seed idempotent | 0 created, 46 updated, **0 uploads**, repeatedly |
| Codemod idempotent | 0 sites, 0 imports, 49 files skipped |

⚠ **The alt snapshot is the check that mattered.** An alt attribute is not
rendered text, so 173/173 would have passed with every description missing.

---

## Part 2 — the audit

### The sixteen items

| # | Item | Result |
|---|---|---|
| 1 | Every route reviewed | 173 routes, all diffed against production |
| 2 | Every editable value has an owner | Yes for G2–G8 **except the class in Finding 1** |
| 3 | No editable content unintentionally hardcoded | **28 paragraphs in 24 files — Finding 1** |
| 4 | No old runtime data files imported | 29 data files; **5 imported, 4 intentionally — Finding 2** |
| 5 | Retained `.ts` files are seed-only | 24 of 29 are seed-only |
| 6 | No local media where Strapi should own it | Academics closed; **6 photographs in 4 components elsewhere — Finding 3** |
| 7 | No duplicated source of truth | **School name in 65 files — Finding 4** |
| 8 | No derived/design values in the CMS | **`sports.rung.accent`, `glyph` — Finding 5** |
| 9 | All content types required | 37 types, **all fetched by the site** |
| 10 | No orphaned types or components | 45 components, **all referenced**; 0 unused fields |
| 11 | No orphaned media | **23 files, 3.9 MB — Finding 6** |
| 12 | All 173 routes render | 174 HTML files built; 173 compared |
| 13 | G2–G8 production-identical | **173 / 173** |
| 14 | Seeds idempotent | **All 13 · 0 created, 0 uploads, 0 errors** |
| 15 | Population centralized | **36 specs in `lib/cms/populate.ts`; 0 declared elsewhere** |
| 16 | Backup and recovery valid | **Re-rehearsed against the changed schema — 164/164 tables, 17,095/17,095 rows** |

### Seed idempotency

`npm run seed` runs all thirteen seeds in sequence. Run against an already-seeded
database:

```
  0 created across every seed
  0 media uploaded across every seed
  0 errors
```

The only line either seed prints that is not a plain update is the standing note
that `CounterStrip.astro` is shared by two routes and claimed by the first — a
known, reported condition, not a fault.

### Backup and restore, re-rehearsed

This pass added two schema fields, so the procedure was proved again rather than
assumed. A backup was taken before the change, and after it a fresh dump was
restored into a disposable database:

```
  npm run db:backup
  node scripts/db.mjs create  --name sunbeam_rehearsal
  node scripts/db.mjs restore <dump> --into sunbeam_rehearsal --yes
  node scripts/verify/compare-db.mjs sunbeam sunbeam_rehearsal

    tables            164 source · 164 restored
    identical counts  164/164
    total rows        17095 source · 17095 restored
```

The disposable database was then dropped. Media was backed up again as well: 66
photographs were uploaded today, and a media archive from before them is not a
recovery point for them.

### Findings

**1 · Editorial prose written straight into markup props.** 28 paragraphs across
24 files. This is the class every check in this migration is blind to: G2–G8
extracted named consts, and a sentence written into a prop is never a const, so
the extractor never saw it, the planner never classified it, the field check had
no key for it, and the production diff is content because the text matches on
both sides. Mostly the "what the school does not publish" statements on the
closing bands:

> `body="The school publishes that a PRECEPT document exists for every class and names the rooms and programmes around it…"`

Also the vision-mission colour symbolism, the alumni page's standfirst, and three
alumni cards whose names, degrees and employers sit in an inline array.

**2 · `alumniRegistration.ts` is still a live content source.**
`registrationBenefits` and `engagementCards` are editorial prose, imported and
rendered. The other four live imports are intentional: `navigation` (deferred
until the Pages architecture), `services.tcEndpoint` (the ERP lookup, kept in
code by instruction), `newsEvents` (a type-only import, erased at build) and
`site.showBuildNotes` (a build flag).

**3 · Six editorial photographs outside academics are still local.** The sweep was
re-run over the whole tree: 136 image imports, 53 design assets, 58 hero
fallbacks, and **6 genuine leftovers in 4 components** —

    components/alumni/AlumniPage.astro              pCampus, pCohort
    components/alumni/AlumniRegistrationPage.astro  pCampus, pCohort
    components/campus/safety/TransportSafety.astro  campus
    components/campus/tour/VisitCta.astro           campus

The same machinery that closed academics closes these; they are named here rather
than swept in, because the instruction for this pass was to report first.

**4 · The school's name is hardcoded in 65 files** while `site-setting` owns it.
Alt text now uses `{schoolName}`; the markup does not.

**5 · Design configuration in the CMS.** `sports.rung.accent` is documented as
"one of four palette slots the band cycles", and `sports.rung.glyph` is an icon
name — both are design by the rule applied throughout G2–G8. `home.slide.tone`
and `campus.map-point.x/y` are borderline and documented as properties of the
photograph and of the datum; I would leave those.

**6 · 23 orphaned media files (3.9 MB)**, created by this migration's own
renaming passes (`parent-partnership-shots-1.jpg`, `structure-shots-4.jpg`).
Nothing references them.

**7 · A zero-byte dump sits in `backups/`** from the failed run that exposed the
broken restore path. The restore guard refuses dumps under 10 KB, so it cannot be
restored by accident — but it still reads as a backup in a directory listing.

**8 · `alumni-story` has no published rows.** Either content is owed or the type
is not needed yet.

### Architecture quality

The surface is **37 content types (22 collection, 15 single) and 45 components**,
and it holds up:

- every type is fetched by the site; every component is referenced by a schema
- **no field is both unwritten by a seed and unread by a page** — no dead surface
  except `academic-topic.photoKey` below
- naming is consistent throughout — no type, component or field departs from the
  convention
- population is genuinely centralized

Worth considering, but **not** changed in this pass:

- **`academic-topic.photoKey`** is stored, exposed as `ac.photo`, and read by
  nothing. It predates `photos` and is now dead.
- **`academics.award` and `academics.story`** share 7 of 8 fields;
  **`home.sport-card` and `home.strand`** share 6. Consolidation candidates.
- **`campus.map-point.photo` holds a facility id** and the picture is looked up
  in code. It works, but it is a relation expressed as a string, and a real
  relation would say so.
- **Form fields are modelled twice**: the contact form's fields are CMS
  (`contact.field`), the alumni registration form's are in code.
- **`homepage` has 62 fields.** Legitimate for a single type, but it is the one
  place the Pages architecture would most obviously help.

None of this is worth removing to reduce a count. The types earn their place.

---

## Production readiness — unchanged and still owed

Off-machine database backups · off-machine media backups · ~30-day retention ·
scheduled restore rehearsals · backup before every deploy · backup before every
schema change · schema-version compatibility checks.

⚠ A development migration passing is not production readiness. An old dump does
not restore safely across arbitrary schema changes — this pass added two fields,
and the backup taken before it is the reason that is safe to say.
