# Proposal — making the editor match the page

**Representative page: Teaching Philosophy** (`/academics/philosophy/teaching-philosophy/`).
Nothing is implemented yet. This is for review.

---

## 1 · What the editor shows today

`academic-topic` for this route holds one repeatable `sections` list and one
repeatable `photos` list. In the content manager they read as:

```
Academic Topic — Teaching Philosophy
├── sections            (repeatable)
│   └── ▸ abilities                     ← one row, labelled with a machine key
└── photos              (repeatable)
    ├── ▸ pStudents  ▸ pComputers  ▸ pGround  ▸ pCeremony
    └── ▸ pMaking    ▸ pChef       ▸ pPair
```

An administrator cannot tell which of those is section 03 on the page, and
`pChef` names a photograph by the variable a developer chose for it.

## 2 · ⚠ The bigger problem underneath

**Most of this page is not in the CMS at all.** Of the five visual sections, only
one reads from it:

| # | On the page | In the CMS today |
|---|---|---|
| Hero | title, standfirst, banner | ✅ `page-meta` |
| **01** | Recognising individual potential | ❌ heading, kicker, quote, paragraph all hardcoded · ✅ image only |
| **02** | Guiding every learner towards their strengths | ❌ hardcoded · ✅ 2 images |
| **03** | More than one way to learn | ✅ `abilities` cards · ✅ image |
| **04** | Learning through interaction | ❌ hardcoded · ✅ image |
| **05** | Teaching that evolves with the learner | ❌ hardcoded · ✅ image |
| End | closing statement + CTA | ❌ hardcoded · ✅ image |

This is Finding 1 of the completion audit — editorial prose written straight into
markup, which the const-based migration could never see.

So labelling alone would produce five beautifully-named sections **containing only
a photograph each**. The rename and the migration have to happen together, or the
editor becomes clearer about content that still is not editable.

## 3 · The two levers Strapi actually gives us

I verified both against the running instance rather than assuming.

**`mainField`** — the admin already labels each repeatable component row by one
field's value. For `shared.section` it is currently `key`, which is exactly why
rows read `abilities`:

```json
"settings": { "mainField": "key", … }
```

**`metadatas.<field>.edit.label` / `.description`** — every field's editor label
and helper text is configurable, independently of its code name:

```json
"heading": { "edit": { "label": "heading", "description": "", … } }
```

Both live in `strapi_core_store_settings`, so both can be **seeded and kept in
git** rather than clicked in per environment.

## 4 · Proposed model for Teaching Philosophy

A dedicated content type, **Teaching Philosophy Page**, with one **named,
non-repeatable field per visual section** in the page's own order.

⚠ Named single fields, not a repeatable list. A repeatable list is what produced
"Section 1, Section 2, Section 3" in the first place — and it also lets an editor
reorder or delete sections, which for a bespoke design means breaking it.

```
Teaching Philosophy Page
├── sectionOne     → philosophy.statement
├── sectionTwo     → philosophy.statement
├── sectionThree   → philosophy.abilities
├── sectionFour    → philosophy.statement
├── sectionFive    → philosophy.statement
└── close          → philosophy.close
```

Two small components carry every shape this page uses:

**`philosophy.statement`** — sections 01, 02, 04, 05

| field | editor label | notes |
|---|---|---|
| `kicker` | Small label above the heading | "Every child is different" |
| `heading` | Heading | `{{…}}` marks the italic half, as elsewhere |
| `quote` | Quotation | optional — 01 and 02 have one, 04 and 05 do not |
| `quoteAuthor` | Quotation — who said it | leave empty to use the Principal from Site Settings |
| `body` | Paragraphs | repeatable |
| `image` | Photograph | |
| `imageAlt` | Photograph — description | |

**`philosophy.abilities`** — section 03 only: `kicker`, `heading`, `image`,
`imageAlt`, and the repeatable ability cards (`label` + `icon`).

**`philosophy.close`** — the closing statement: `heading`, `body`, `image`,
`imageAlt`.

### What the administrator will see

```
Teaching Philosophy
├── 01 — Recognising Individual Potential
│   ├── Small label above the heading
│   ├── Heading
│   ├── Quotation
│   ├── Quotation — who said it
│   ├── Paragraphs
│   └── Photograph  +  Photograph — description
├── 02 — Guiding Every Learner Towards Their Strengths      (same fields)
├── 03 — More Than One Way to Learn
│   ├── Small label above the heading
│   ├── Heading
│   ├── Ability cards  (Words · Number · Making · …)
│   └── Photograph  +  Photograph — description
├── 04 — Learning Through Interaction                       (same fields)
├── 05 — Teaching That Evolves With the Learner             (same fields)
└── Closing statement
```

The numbered labels come from the seeded field configuration; the field *names* in
code stay `sectionOne`, `sectionThree`. The hero is not listed because it already
belongs to `page-meta`, where the administrator edits every page's hero.

## 5 · What Astro does — and does not — change

**Changes:** the four hardcoded sections read their words from the record instead
of having them inline. One line per value:

```astro
-  <h2 class="tp-two__h" id="tp-two-h" data-split>Guiding every learner towards their strengths</h2>
+  <h2 class="tp-two__h" id="tp-two-h" data-split><ClipHeading text={two.heading} /></h2>
```

**Does not change:** the layout, the section order, the GSAP timelines, the
`data-reveal` / `data-split` / `data-mask` hooks, the scoped CSS, the responsive
rules, the `id=` anchors, the `01`–`05` numerals, the orbit geometry in section 03,
the washes and grids. Those stay in the component, exactly as now.

The photographs keep their bindings — `pStudents` becomes `one.image` and the
`<SmartImage>` around it is untouched.

## 6 · The cheap global win, separately

Independently of the above: adding a **`label`** field to `shared.section` and
switching `mainField` from `key` to `label` makes **all 46 academics pages** read
as words instead of keys, for one field and one configuration change. `key` stays
as the contract Astro reads.

```
sections                          sections
├── ▸ abilities          →        ├── ▸ 03 — More Than One Way to Learn
├── ▸ steps                       ├── ▸ 02 — How Marks Are Awarded
└── ▸ parents.forum               └── ▸ Parents' Forum — the sitting
```

Worth doing whichever way the rest goes, and it does not touch Astro at all.

## 7 · What this is not

- **No Dynamic Zones**, no drag-and-drop, no free-form composition
- **No new section can be added** by an editor, and none reordered or removed —
  the fields are fixed and named, so the design stays authoritative
- **No design values move into the CMS** — no tile positions, orbit radii,
  animation delays, palettes or glyph geometry

## 8 · The cost, honestly

| | |
|---|---|
| New content type | 1 (`teaching-philosophy-page`) |
| New components | 3, all specific to this page's design |
| Astro edits | ~20 lines in one component, all of them value swaps |
| Editor labels | seeded, in git |
| Verification | text must stay identical to production; alt snapshot must stay identical |

⚠ **This does not generalise to all 46 pages for free.** Each bespoke design would
need its own component set to get the same clarity — that is the trade for named
sections instead of a generic list. My suggestion is to do Teaching Philosophy,
look at it, then decide: apply the pattern to the handful of pages the school
edits most, and let §6's `label` field carry the rest.

## 9 · Two decisions I need from you

1. **Scope of the representative build** — Teaching Philosophy only, as above?
2. **Content migration** — the four hardcoded sections must move into the CMS for
   this to mean anything. Confirm that is in scope, since it changes where that
   prose lives even though the rendered page stays identical.
