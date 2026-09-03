# G7 — Disclosure, Uniform, Services & Contact

Five routes, six content types, a 131-row collection, and the first group where
most of what moved was never visible to an editor at all — it was inside a
`<script>`.

| Route | Type |
|---|---|
| `/general-info/` | `disclosure-page` + `teacher` (131) |
| `/admissions/uniform-catalogue/` | `uniform-page` |
| `/result/` | `result-page` |
| `/download-tc/` | `tc-page` |
| `/contact-us/` | `contact-page` |

---

## ⚠ The disclosure page is a regulatory filing

Every figure on `/general-info/` is transcribed from documents the school has
filed with CBSE, and the PDFs are linked beside them. **Nothing here may be
tidied, rounded or corrected in the CMS alone** — a value changed here and not in
the filing makes the page disagree with the document of record.

Three consequences are built into the schema rather than left to memory:

- **No "Appeared" field on a board result.** The school publishes Registered,
  Passed and pass percentage only. The reference design showed an Appeared row;
  filling it by assuming appeared = registered would be inventing an examination
  statistic.
- **`percentage` is a string.** The filing says `98.90` and `100`. An integer or
  float would print `98.9` and lose a digit the document has.
- **The 131 teachers keep their filed spelling.** "bachelor of engineering with
  b.ed" and "masters of arts with ,masters in education" are what was submitted.
  The Teacher schema says so in its own description, because the first instinct
  of anyone opening that list will be to fix it.

**Annual content is what changes, and all of it is editable:** board results,
staff summary, teacher list, infrastructure figures, and all thirteen certificate
and academic-document cards.

### The section labels were written twice

`sections[]` drove the side rail; each section heading repeated the same words as
literal markup. The two could drift. One `disclosure.section` record now feeds
both — confirmed by the mutation test, where changing one label moved **two**
places on the page.

⚠ `anchor` is a URL target (`#mp-general`), so the schema warns that changing it
breaks saved links. The section *number* is derived from position and is not
stored.

---

## Uniform — the catalogues are now media

Two PDFs, 51 MB, sat in `apps/web/public/uniform/`. Publishing a new edition
meant a developer and a deploy; it is now an upload. `originHref` keeps the
school's own published copy as provenance, because that document is not ours to
host.

Everything below the catalogues — the three class groups, the four seasons, the
shoe table and the eleven notes — is a transcription **out of** those documents,
and the shoe table keeps the document's own `2023-24` session heading even though
the cover says 2025–26.

---

## Services — the boundary the brief drew

**Kept in code, as instructed:** `tcEndpoint` and `tcField` (what the school's
records system expects), the fetch, the response handling, and the result
portal's URL — which is Site Settings' `external.results`, one ERP address for
the whole site rather than a second copy on this page.

**Moved to the CMS:** every word a parent reads. That turned out to include nine
strings that lived inside the `<script>` — both validation errors, the busy
label, and every status message — and among them:

```js
'…or call the office on ' + '<a href="tel:' + '+917755005905' + '">+91 77550 05905</a>.'
```

A phone number hardcoded in JavaScript, which Site Settings could not reach. Same
class of fault as the contact form's in G2. The messages now travel to the script
as `data-` attributes with the office number already substituted, and every one
falls back to its previous wording if the attribute is missing.

---

## Contact — Site Settings still owns the facts

The address, email, both phone numbers and the social links were already CMS
data and are **not** duplicated here; the map embed is still built from the
school's own name and address, so it follows Site Settings automatically. The
form handler, its validation and its field bindings stay in code.

What moved is the wording: the eyebrow, heading, standfirst, three panel
headings, five field labels **with their error messages**, the class options, the
consent line, both button states and all three status messages.

⚠ **Label and error live together on purpose.** The label was in the markup and
its error was in the script, so a school rewording "Phone number" would have left
the error still saying something else. `contact.field` holds both, keyed by the
input's `id` — and that key is not editorial: it binds the record to the input,
the label's `for`, the autocomplete hint and the validation rule.

---

## Three new shared primitives

Each exists because a specific thing would otherwise have been lost.

### `shared.detail` — one component, four uses

`{icon, label, value, href, note}`. The disclosure quick card, the CBSE
general-information table, the staff summary and the uniform seasons are all this
and nothing more. `note` carries provenance — "affiliation letter", "school
letterhead" — which is why it is a field rather than folded into the value: a
reader must be able to tell which rows are Appendix IX and which are not.

### `RichLine` — prose that carries emphasis

Three marks and nothing else: `**bold**`, `*italic*`, `[label](href)`. Not
markdown, not rich text — both would let an editor paste arbitrary HTML into a
paragraph with a designed type scale. It parses three constructs and prints every
other character verbatim, so there is no path from the CMS to raw markup.

It exists for sentences like this one, where the emphasis *is* the meaning:

> It records students **registered** and **passed**; a separate figure for
> students *appeared* is not published.

### `ClipHeading` — the two-part animated headings

```
How the catalogues
{{are organised}}
```

One line per clipped span, `{{…}}` for the italic — the **same marker** as
`AccentHeading`, which renders it as the hand-drawn squiggle instead. One
convention for "this part is emphasised"; each component decides what emphasis
looks like where it lives. The stagger (0/150 or 0/140) is a prop, kept exactly
as each page had it.

⚠ The span's children are written on one line. Across several, Astro emits the
newlines as text inside the span and the clipped word gains whitespace the
hand-written markup never had.

---

## Tokens, so derived values stay derived

`fillTokens` (from G6) now backs a `siteTokens()` map — the one place a CMS
sentence can reach Site Settings. Used for `{officePhone}`, `{email}`,
`{schoolName}` and, on the disclosure page, three counts that are pure
arithmetic:

> The filing names **{teacherCount} members of staff** individually. Its own
> headline figure of **{headlineCount} teachers** … the remaining {outsideCount}
> … sit outside that total.

131 and 121 and 10. Writing any of them in would mean correcting the paragraph by
hand every time a teacher is added — and it would go stale silently.

⚠ **`{filedPhone}`, not `{officePhone}`, in the disclosure callout.** The filing
states `7755005905`; Site Settings renders the same number as `+91 77550 05905`
for the rest of the site. A regulatory page quotes its document, so the callout
reuses the exact values from the quick card above it — found by `href` scheme
(`tel:` / `mailto:`), not by label, so a CBSE row rename cannot break it.

---

## What deliberately stayed in code

- The T.C. endpoint, its field name, the fetch and the response handling.
- The result portal URL — Site Settings' `external.results`.
- The Google Maps embed and link, built from the school's name and address.
- The staff table's search box, designation filter, sort, paging and "Rows"
  control. These are **interface chrome for a data table**, not editorial
  content; the school edits teachers, not the word "Rows". `designations` is
  derived from the teacher list and is never a typed list, so the filter can only
  ever offer a value the table can show.
- "Class X" / "Class XII" and the three result row labels — the fixed shape of a
  CBSE results table, mirrored by the schema's own `classX` / `classXii` fields.

---

## Verification

| # | Check | Result |
|---|---|---|
| 1 | Content in Strapi | 6 types + 131 teachers; every count matches source |
| 2 | Frontend consumes it | 8 components/pages rewired; only `tcEndpoint`/`tcField` still imported |
| 3 | Mutation test | 5 fields across 5 mechanisms → rendered; reverted |
| 4 | No duplicate hardcoded content | no G7 data import, no literal copy left |
| 5 | Media verified | 0 local images on all five routes; catalogues served from Strapi |
| 6 | SEO | title, description, canonical, robots, OG identical |
| 7 | UI, URLs, anchors | hooks, `id=` targets and route set identical |
| 8 | Seed idempotent | run 3×: 0 created, 131 updated, 0 uploads, no duplicates |

**Text diff against production: 173/173 identical** — G2–G6 regression included.

**Head / hooks / anchors: 171/173.** The two differences are `/contact-us/` and
`/download-tc/`, and both are *new* `data-*` attributes added deliberately to
carry CMS strings into the page scripts. Nothing was lost on either page — no
hook, no anchor, no meta tag. Same category as the `data-office-phone` change
approved in G2.

```
npm run seed:pages
npm run verify            # both diffs, every route
npm run verify:counts     # row count per content type (Strapi stopped)
node scripts/verify/api-smoke.mjs
```

### One bug the checks caught

`f.url` from Strapi's local upload provider is **root-relative** —
`/uploads/x.pdf` — which resolves against the *site's* domain, not the CMS's. The
uniform catalogue links looked correct in the markup and would have 404'd in
production. The text diff could not see it (it compares words, not hrefs); a
direct look at the rendered `href` did. Now routed through `fileUrl()`, which
prefixes `STRAPI_URL` exactly as `CmsImage` already did for pictures.

Also caught by the diff: `note` was not being rendered at all after the swap —
the markup still read `r.from` and `f.unit` while the query now supplies `note` —
which silently dropped "affiliation letter" from four rows of a regulatory table
and the units from the infrastructure figures.
