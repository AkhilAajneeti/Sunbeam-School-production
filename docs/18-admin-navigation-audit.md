# Audit — admin navigation

Nothing implemented. This is the mapping and the feasibility answer you asked for
before any sidebar work.

⚠ **The reference screenshot did not come through** — no image reached me. This
audit follows the written hierarchy in your message. If the screenshot shows
something different, say so before I build.

---

## 5 · Can Strapi do this? — answer first, because it shapes everything else

**Partly, and not where you would expect.** I checked the installed admin
(5.52.1) rather than assuming.

**What exists:** `app.addMenuLink({ to, intlLabel, permissions })` in
`src/admin/app.tsx`. `to` is any admin route, so a link can point straight at a
**filtered** Content Manager list:

```
content-manager/collection-types/api::academic-topic.academic-topic
  ?filters[$and][0][group][$eq]=philosophy
```

That gives "Academic Philosophy" as a real navigation entry opening the seven
philosophy records and nothing else. **No new content type, no duplicated data.**

**What does not exist:**

- ⚠ **The Content Manager's own sidebar cannot be regrouped.** It renders
  "Collection Types" and "Single Types", alphabetically. There is no supported
  hook to nest or reorder it.
- ⚠ **`addMenuLink` has no grouping.** Links land flat in the main left rail
  beside Content Manager and Media Library. Forty of them would be a worse list
  than the one we have.

**So the tree in your message needs one custom admin page**, registered with a
single menu link, rendering the hierarchy as a navigable index. That is fully
supported (`Component: () => import(...)`), touches no content type, and is the
only way to get real nesting.

### Recommended shape

| Layer | Mechanism | Cost |
|---|---|---|
| **A** — one "School Content" page showing the whole tree | custom admin page, 1 menu link | the real work |
| **B** — 7 direct links for the academic groups | `addMenuLink` ×7, filtered CM URLs | small |
| **C** — `displayName` prefixes so the native list clusters | admin-only rename, no code | trivial |

⚠ **C changes `displayName` only** — the API id, the routes and every query stay
exactly as they are. `Academic Topic` → `Academics — Topic` reorders the native
list without touching a record.

---

## 1 · Content type → sidebar group

All 38 types placed. **None needs creating; none needs duplicating.**

| Proposed group | Existing types |
|---|---|
| **Site & Global** | `site-setting` · `page-meta` · `homepage` |
| **About Us** | `leader-message` (2 rows: Director, Principal) · `history-page` · `vision-mission-page` |
| **Academics** | `academic-topic` (46, split by `group` below) · `teaching-philosophy-page` · `academic-calendar-page` |
| **Beyond — Sports** | `sports-page` · `sport-facility` · `game` · `sports-record` |
| **Beyond — Excursions** | `excursion-section` · `expedition` |
| **Beyond — Activities** | `news-item` filtered `category=activity` (28) |
| **News & Events** | `news-category-page` · `news-item` (5 category filters) · `notice` |
| **Achievements** | `achievement-major` · `achievement-record` · `credential` |
| **Campus & Facilities** | `facilities-page` · `campus-facility` · `campus-safety-page` · `campus-tour-page` · `transport-page` · `bus-route` |
| **School Administration** | `teacher` · `job-posting` · `alumnus` · `alumni-story` · `alumni-meet` |
| **Documents & Services** | `disclosure-page` · `uniform-page` · `contact-page` · `result-page` · `tc-page` · `calendar-document` |

---

## 2 · Academic group → records

From the `group` field on the live records — not invented.

| Group | n | Records |
|---|---|---|
| **Academic Philosophy** | **7** | Academic Philosophy *(hub)* · Teaching Philosophy · Student-Centred Learning · Experiential & Inquiry-Based Learning · Critical Thinking & Creativity · **Curriculum** · **Affiliation Details** |
| **Academic Structure** | **8** | Academic Structure *(hub)* · Pre-Primary · Primary · Middle School · Secondary · Senior Secondary · Streams Offered · Subject Combinations |
| **Teaching & Learning** | **7** | Teaching & Learning *(hub)* · Teaching Methodology · Smart Classrooms & Digital Literacy · Experiential & Project-Based Learning · **STEM, Robotics & Enrichment** · Reading, Language & Library · Laboratories & Academic Clubs |
| **Assessment** | **7** | Assessment System *(hub)* · Academic Calendar · Competitive Exam Preparation · Homework Policy · Mentoring · Parent–Teacher Meetings · Remedial Support |
| **Student Success** | **9** | Career Development & Student Success *(hub)* · Board Results · Alumni Interaction · Career Guidance · Olympiad Achievements · Scholarships · Subject Selection Guidance · Student Success Stories · University Counselling |
| **Parent Partnership** | **7** | Parent Partnership *(hub)* · Parents' Forum · Workshops & Webinars · Parent Engagement Initiatives · Parent Orientation · School–Parent Communication · Frequently Asked Questions |
| **Overview** | **1** | Academics *(the section landing page)* |

### ⚠ Three differences from your list

1. **Philosophy has 7, not 4.** Your list names four; the records also include
   **Curriculum** and **Affiliation Details**, plus the hub page. All real, all
   live at their own URLs.
2. **"STEM" and "Robotics & Enrichment" are one page, not two** — the record is
   `STEM, Robotics & Enrichment` at `/academics/teaching-learning/stem-robotics/`.
3. **Parents' Forum and Workshops & Webinars already exist** inside
   parent-partnership. Your list reads as though they were additions; they are
   not, and nothing new is needed.

Also: each group's **hub page** is itself a record. I would keep it first in its
group and label it so — an editor looking for "the Academics Structure page
itself" should find it where they expect.

---

## 3 · Types that do not fit cleanly

| Type | Issue | Proposal |
|---|---|---|
| `academic-calendar-page` | A single type, but its subject sits in Assessment | Show under **Academics → Assessment**, beside the `academic-topic` of the same name |
| `teaching-philosophy-page` | The new single type from the section work; the `academic-topic` for the same route also exists | ⚠ **See §4** |
| `news-item` | One type serving five sections | Not a problem — five filtered links, one type, no duplication |
| `leader-message` | Two records, but your list names them separately | One entry, "Leader Messages (Director, Principal)" — splitting into two links for two rows is noise |
| `page-meta` | 74 rows of hero/SEO for every route | Belongs in Site & Global, but it is the one an editor will most often want *from* a page. Worth a link from each group too |

---

## 4 · Duplicate and redundant entries

**One real duplication, and it is mine.**

`teaching-philosophy-page` (the new single type) and the `academic-topic` record
for `/academics/philosophy/teaching-philosophy/` now both exist. The Astro page
reads the single type; the `academic-topic` record still holds that route's old
`sections` and its seven `photos`, and nothing reads them any more.

Two ways out, and I would like your call:

- **(a)** Leave it. Harmless, but the editor sees the page twice and one copy is
  a decoy — exactly the confusion this work exists to remove.
- **(b)** Hide the `academic-topic` row from the Academics list once the section
  work is extended, and treat the single type as the page's home. The record
  stays in the database and is not deleted.

⚠ **This is the pattern's cost**, and it will repeat for every page that gets its
own single type. Worth settling now, before it happens 46 times.

No other duplication: no type is listed twice, and every `news-item` link is a
filter over one collection.

---

## 6 · What I would build

1. `src/admin/app.tsx` — one menu link, "School Content", opening a custom page
2. That page renders the tree above; each leaf links into the Content Manager,
   filtered where a type serves several sections
3. Seven filtered links for the academic groups, for editors who want them in the
   rail
4. `displayName` prefixes so the native Content Manager list clusters too

**Nothing touches** a schema attribute, a record, a route, a query or the
frontend. The one schema-adjacent change is `displayName`, which is admin-only.

## 7 · Two decisions before I start

1. **The `teaching-philosophy-page` / `academic-topic` overlap** — (a) or (b)?
2. **Philosophy's Curriculum and Affiliation Details, and the seven hub pages** —
   include them in the tree as they are? They exist and are editable; leaving
   them out of the sidebar would make them unreachable from it.
