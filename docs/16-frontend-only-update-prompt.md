# Prompt — apply the photograph batch to the frontend-only build

Copy everything below the line into the other session.

It adds the client's two photograph folders to the site — the images, and the
sections that carry them — plus two bugs found along the way.

---

You are working on the Sunbeam School Ballia Astro site.

Everything below is **image files plus `src/data/*.ts` edits**. Content lives in
those data files; photographs live in `src/assets/`. Nothing here needs anything
outside the repo.

## The source

Two folders from the school:

```
C:/Users/aclde/Documents/sunbeam-assets-1
C:/Users/aclde/Documents/sunbeam-assets-2
```

## Step 1 — process every photograph the same way

Use `sharp`. For each image:

- `.rotate()` **first** — several frames carry EXIF orientation and render
  sideways without it
- resize `{ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }`
- `.jpeg({ quality: 82, progressive: true, mozjpeg: true })`
- keep the **native aspect ratio** — do not crop to 16:9 or any fixed shape

⚠ **2400px on the long edge, and JPEG.** The layouts request widths up to 2400,
so anything smaller upscales in the full-bleed bands. And these arrived once as
1920×1080 PNGs: one fifth of the pixels for 2.3× the file size, because PNG is
lossless and wrong for photographs.

⚠ **Never flatten the folders and never renumber across them.** The folder names
are the only provenance, and several destination folders already contain files.

## Step 2 — where each folder goes

Photographs go under one of the roots the `photoDir` glob scans
(`src/data/workshopPhotos.ts` → `ROOTS`):

```
/assets/workshops/  /assets/school-event/  /assets/celebration/
/assets/competition/  /assets/school-activities/
```

### A · Eighteen school activities → `src/data/schoolActivities.ts`

Copy each folder to `src/assets/school-activities/<slug>/` as `01.jpg`, `02.jpg` …
then add an item to the matching group. Item shape (copy an existing one):

```ts
{
  title: '…',
  slug: '…',
  photoDir: '…',          // same as slug
  meta: '… photographs published',
  when: '…',
  body: '…',
},
```

| slug | group | n | when | title |
|---|---|---|---|---|
| `art-integrated-learning` | learning | 16 | July 2025 | Art Integrated Learning |
| `sdg-session` | learning | 11 | August 2025 | Sustainable Development Goals Session |
| `ai-tinkerpreneur` | recognition | 4 | 18 August 2025 | India AI Tinkerpreneur and Math Around Me certificates |
| `atl-lab-project` | learning | 10 | 12 August 2025 | Atal Tinkering Lab projects |
| `book-fair` | learning | 10 | 27 August 2025 | Book Fair |
| `creepy-crawly-activity` | learning | 12 | 22 August 2025 | Creepy Crawly — a KG activity |
| `archery` | learning | 9 | December 2024 – January 2025 | Archery on the JOSH ground |
| `ndrf-session` | learning | 21 | 1 July 2025 | NDRF disaster-response session |
| `parent-orientation-programme` | learning | 15 | 27 January 2025 | Parent Orientation Programme |
| `students-forum` | learning | 4 | 22 August 2025 | Students' Forum |
| `financial-literacy-club` | learning | 4 | 21 January 2025 | Financial Literacy Club |
| `skating` | learning | 10 | 29 April 2025 | Skating in the junior playground |
| `karate` | learning | 3 | 25 January 2025 | Karate on the school ground |
| `seasonal-fruits-and-vegetables` | learning | 7 | 8 August 2025 | Seasonal fruits and vegetables — a KG activity |
| `hindustan-pratibha-samman` | recognition | 7 | 20 June 2025 | Hindustan Pratibha Samman 2025 |
| `hockey-cbse-cluster` | recognition | 9 | August 2025 | The girls' hockey team, before the CBSE Cluster |
| `inspire-award-district` | learning | 4 | 2025 | INSPIRE Award — the district exhibition |
| `attire-speak-interclass` | culture | 7 | 2025 | Interclass Attire Speak |

**Source folder → slug** (folder names in `sunbeam-assets-2` unless noted):

```
Art Integrated Learning  (assets-1: 5 frames + assets-2: 11)  → art-integrated-learning
SDG Session              (assets-1)                           → sdg-session
AI-Tinkerpreneur                                              → ai-tinkerpreneur
ATL-Lab-Project                                               → atl-lab-project
Book-Fair                                                     → book-fair
Creepy-crawly-activity                                        → creepy-crawly-activity
Archery                                                       → archery
NDRF                                                          → ndrf-session
POP                                                           → parent-orientation-programme
Student_s Forum                                               → students-forum
RBI Financial Literacy                                        → financial-literacy-club
Scating                                                       → skating
Karate                                                        → karate
Seasonal fruits and vegetables activity KG Section            → seasonal-fruits-and-vegetables
Hindustan Meritorious Student Felicitation by DM              → hindustan-pratibha-samman
Hockey CBSE Cluster                                           → hockey-cbse-cluster
District-Level INSPIRE Award Ceremony … Azamgarh              → inspire-award-district
Interclass Attire speak competition                           → attire-speak-interclass
```

**Body copy — use verbatim.** Every one names what the photographs show and says
what the school did **not** publish. That restraint is the site's editorial line;
do not embellish it and do not add outcomes.

> **art-integrated-learning** — Classes presenting their Art Integrated Learning work — tables of models, packaged regional food and folded textiles prepared by students, and presentations from the stage to the rest of the school. The school did not publish which classes took part or the topic each display covered.
>
> **sdg-session** — A session on the Sustainable Development Goals, held twice over: once for the whole school seated under the covered assembly area, and once for teaching and administrative staff in the conference room, with the goals set out on the board behind — no poverty, zero hunger, clean water and sanitation, climate action, life below water. The school did not publish who led the session or what it covered.
>
> **ai-tinkerpreneur** — Two sets of certificates presented on one morning. Eight students received India AI Tinkerpreneur 2025 certificates, which carry the marks of the Atal Innovation Mission and Intel; others received Certificates of Noteworthy Performance in Math Around Me, awarded by Mehro World School. The school did not publish the students' names or what either programme required of them.
>
> **atl-lab-project** — Students presenting projects built in the school's Atal Tinkering Lab, the room signed as a Centre of Excellence and marked out for AR and VR, programming, drone and space technology. One group demonstrates a clap switch wired on a breadboard; others work at the benches behind. The school did not publish the brief the projects answered or the classes taking part.
>
> **book-fair** — The school's book fair, opened by a ribbon cutting with staff, guests and two children of the junior school. The school did not publish which sellers took part or what the fair raised.
>
> **creepy-crawly-activity** — A kindergarten activity on small creatures: children printing a caterpillar with leaves dipped in paint, seated on the mat with their teacher. The photographs the school sent are small phone images rather than camera frames.
>
> **archery** — Archery introduced on the JOSH ground, a target boss set up against the ground's wall with classes gathered round it in winter uniform. The school did not publish whether the sport continued as a coached activity.
>
> **ndrf-session** — A National Disaster Response Force session at the school, held twice over: the whole school seated under the covered assembly area, and the support staff — drivers, gardeners and guards — gathered on the steps for a fire-extinguisher demonstration by a responder in NDRF coveralls. The school did not publish who led the session or what else it covered.
>
> **parent-orientation-programme** — A sitting of the Parent Orientation Programme — parents seated in the conference room, a slide put up on the screen and a member of the school speaking to it. The school did not publish the programme for the session or which classes it was for.
>
> **students-forum** — A sitting of the Students' Forum, held around a table in the library. The school did not publish the forum's agenda, its membership or how often it sits.
>
> **financial-literacy-club** — The school's Financial Literacy Club, its table carrying a student-built model of the sectors of the Indian economy — primary, secondary and tertiary — with the senior classes seated behind. The school did not publish the club's programme or who it is open to.
>
> **skating** — Junior classes skating on the paved playground in helmets and pads, in front of the school entrance. The school did not publish whether the sessions are coached or how often they run.
>
> **karate** — A karate bout on the school ground — two students in gi with red and blue mitts and foot guards, one at the top of a high kick. The school did not publish whether these frames come from a graded bout or a practice session.
>
> **seasonal-fruits-and-vegetables** — A kindergarten activity on seasonal produce, its hand-painted board set up outdoors and children hanging labelled fruit on a stem. The school did not publish what the activity covered beyond what the photographs show.
>
> **hindustan-pratibha-samman** — A student of the school receiving a certificate at Hindustan Pratibha Samman 2025, an award ceremony for meritorious students presented by United University, Prayagraj. The school did not publish the student's name or the marks the award recognised.
>
> **hockey-cbse-cluster** — The girls' hockey team garlanded and handed their kit at the school before the CBSE Cluster championship, a Sunbeam flag beside them. The school did not publish how the team went on to place, and none is claimed here.
>
> **inspire-award-district** — Students at the district-level exhibition and project competition of the INSPIRE Award, run by the Department of Science and Technology and the National Innovation Foundation, held at Government Girls Inter College, Azamgarh. The school did not publish the projects entered or how they were judged.
>
> **attire-speak-interclass** — The interclass round of the Attire Speak competition, in which junior classes each wore a hand-drawn logo and spoke about the brand behind it — Google Classroom, Quizizz and others — with the same mark up on the board behind them. The school did not publish the classes entered or the result.

### B · Independence Day → an existing celebration

`15-August` (17 frames) → `src/assets/celebration/independence-day/01.jpg …`

In `src/data/newsPages.ts` the entry **already exists** under *National days*
(title `Independence Day`, `when: '2025 · the 78th'`, chief guest in `meta`).
Add one line only:

```ts
photoDir: 'independence-day',
```

⚠ **Do not create a new page for this.** The existing entry carried a placeholder
saying photographs had not been supplied; it now has them.

### C · Teachers' Day → an existing celebration

`Teacher_s Day` (28 frames) → `src/assets/celebration/teachers-day-students/`

⚠ **That folder already holds 14 files** named `teachers-day-students-01.jpg …
-14.jpg`, and the gallery is built by **natural filename sort**. Name the new ones
`teachers-day-students-15.jpg … -42.jpg`. Adding them as `01.jpg` puts them
*first* and displaces the existing lead photograph, which is also the card face on
the celebrations index.

`teachers-day-students` already has `photoDir` — no data change needed.

### D · Alumni Meet → `src/data/alumniMeets.ts`

`Alumni` (16 frames) → `src/assets/alumni-meets/pradiptam-2-0-2026-27/` as
`06-…jpg` through `21-…jpg`, continuing the five already there.

Import each at the top and add a `{ image, alt, caption }` to the `gallery` array
of `pradiptam-2-0-2026-27`.

⚠ **Every alt must describe the frame.** The file's own rule: *"What is in the
frame. Never the event's name standing in for a description."* Use template
literals with `${S}` where the school name appears — a plain `'...${S}...'`
string prints the token literally, and no text diff will catch it because an alt
is not rendered text.

The set is: the entrance and red carpet before the meet · an alumna of the 2017
batch speaking with her degree on screen · eight medallion presentations, each
with the recipient's photograph and course behind them · alumni at round tables ·
the lamp lighting · alumni standing at their tables · the group on the steps at
the close.

⚠ **Do not name anyone.** The screens show names and degrees; the five existing
alts name nobody, and these follow that.

### E · District Junior Volleyball → `src/data/sportsRecord.ts`

`District-Junior-Volleyball` (20 frames) → `src/assets/sports-record/` as
`distvolley-1.jpg … distvolley-20.jpg`, then add:

```ts
{
  id: 'district-junior-volleyball',
  kicker: 'District · hosted',
  title: 'District Junior Volleyball Championship',
  body: 'The District Junior Volleyball Championship, its teams lined up at the net for the opening with their school flags and NCC cadets carrying the colours. The school published photographs of the day; it did not publish the results or the final placings.',
  shots: ['distvolley-1.jpg', … 'distvolley-20.jpg'],
  alt: 'Teams at the opening of the District Junior Volleyball Championship',
},
```

⚠ **No placing is claimed.** The photographs show a march-past, not a result, and
one of the flags is another school's. A record that names a winner on this
evidence would be inventing one.

### F · Parent-Teacher Day → the academics page

Four frames from `sunbeam-assets-1/PTM` replace the photographs on
`/academics/assessment/parent-teacher-meetings/`, which was illustrating itself
with **Parents' Forum** pictures — a different event.

Put them in `src/assets/parent-teacher-day/` and swap the four imports in
`ParentTeacherPage.astro`:

| binding | file | alt |
|---|---|---|
| `pHall` | `ptd-welcome.jpg` | The entrance to ${S} on Parent-Teacher Day, the Head Boy and Head Girl standing at the welcome board with parents arriving at the help desks beyond |
| `pPanel` | `ptd-senior-desk.jpg` | A class teacher at ${S} going through a student's record with both parents across the desk, the student sitting beside them |
| `pTiers` | `ptd-junior-family.jpg` | A mother and father at ${S} completing a form with the class teacher, their child at the desk beside them and other parents waiting their turn |
| `pSpeak` | `ptd-report.jpg` | A teacher at ${S} going through a report with parents at a classroom desk on Parent-Teacher Day |

**Change the picture and its description together.** Leaving the old alt on a new
photograph describes the wrong image, and nothing in a build or a text diff can
see it.

## Step 3 — two fixes found along the way

### Fix 1 · the homepage heading renders black on a dark photograph

In `src/components/home/Hero.astro`, `.hero__title` is set to `color: #fff` and
the heading still renders black.

**Cause:** Astro scopes a component's CSS by stamping `data-astro-cid-XXX` on the
elements in **its own template**. The `<h1>` is rendered by `AccentHeading`, so it
carries *that* component's attribute — and `.hero__title[data-astro-cid-…]`
matches nothing. Passing a class *into* a component does not carry the caller's
scope with it.

It loses more than colour: the fluid `font-size`, the `max-width`, the
`margin-bottom` and **both** breakpoints all miss.

**Fix:** make the four `.hero__title` / `.hero__br` rules `:global(...)`. Verified
safe — the class renders on one page only.

### Fix 2 · "Shooting Range" is the archery range

The campus facility was named **Shooting Range**, marked `pending: true`, with a
standing photo request for *"lanes, safety line and a student on the firing
point"*. Its tiles rendered as empty black boxes on the homepage carousel.

The school has confirmed **the range is for archery**. Rename it and give it the
archery photographs, in all seven places:

1. `src/data/campusTour.ts` — `id: 'archery'`, `name: 'Archery Range'`, point
   `images` at the archery folder, drop `pending` and `brief`, new `alt`
2. `src/data/home.ts` — the carousel slide: name, `detail`, `href`, and add the
   photographs; drop `brief`
3. `src/data/home.ts` — the checks line *"…library and a shooting range"*
4. `src/data/facilities.ts` — the sports section `stand`
5. `src/data/facilities.ts` — the `Shooting Range` item label
6. `src/data/facilities.ts` — the school-day timeline, *"…or the shooting range"*
7. `src/data/navigation.ts` — the mega-menu feature *"A shooting range, and 17,574 books"*
8. `src/data/sports.ts` — the `range` facility: name, body, and its own open photo
   brief replaced by `lead` / `support` images

⚠ **`/campus/shooting-range/` is a published address.** Change the route to
`/campus/archery-range/` **and add a redirect** from the old path in
`astro.config.mjs`. Also update `PLACEHOLDER_ROUTES` there.

⚠ Leave `src/data/career.ts` alone — it advertises "sports coaches for chess,
shooting, table tennis and skating" in three places, but that is the school's own
published recruitment text, not site copy. Flag it; do not edit it.

## Step 4 — three folders that must NOT be published

The folder name is wrong in each case. **Do not place these**, and report them:

- **`Adrent-reader-award-2024-25`** — the banner reads भारतीय राष्ट्रीय पत्रकार
  महासंघ, a journalists' federation. It is **not** the school's Ardent Reader
  Award, and appending it to that entry would say it was.
- **`VVM 2025`** — three adults outside at night. No VVM branding, no students,
  nothing that evidences a Vidyarthi Vigyan Manthan result.
- **`Town Polytechnic Internship`** — a crowded classroom that is not identifiably
  Sunbeam, 1280px.

## Working rules

⚠ **Folder names are not reliable — open the photographs.** Three were wrong:
"AI Tinkerpreneur" held two different awards; "RBI Financial Literacy" shows a
Financial Literacy Club with no RBI branding anywhere, so the copy must not claim
RBI; "SDG Session" held two different events with two different audiences.

⚠ **A photograph beside a claim is part of the claim.** Three academics pages say
outright that the school publishes nothing on their subject rather than pad. Do
not fill a thin page with a nice picture of something else.

⚠ **Check for an existing entry before creating one.** Independence Day, Teachers'
Day and the Pradiptam alumni meet all already existed. Adding a second page for an
event that already has one splits it in two.

## Verification

1. `npm run build` — should succeed with no `UnsupportedImageFormat`
2. Every new page renders its full gallery — count the `<img>` per page
3. **Compare every `alt` attribute before and after.** An alt is not rendered
   text, so a text diff cannot see one going missing or keeping a `${S}` token
   unfilled. Grep the built HTML for `alt="` containing a literal `${`
4. No occurrence of `Shooting Range` remains in `dist/`
5. `/campus/shooting-range/` still resolves, via redirect
6. The homepage `<h1>` is white
