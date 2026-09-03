# Placing photographs the school sends

The first batch after the migration: 26 photographs in four folders. This is the
route every later batch takes.

---

## What arrived, and what happened to it

| Folder | Sent | Placed | Where |
|---|---|---|---|
| PTM (Parent-Teacher Day) | 9 | **4** | `/academics/assessment/parent-teacher-meetings/` |
| Art Integrated Learning | 5 | **5** | new school activity |
| SDG Session | 11 | **11** | new school activity |
| Handball | 1 | 0 | see below |

Delivered as 1920×1080 PNG. Converted to JPEG on the way in — **974 KB → 380 KB**,
about 61% smaller, no visible loss. PNG is lossless, which is right for a logo and
wrong for a photograph, and Strapi keeps the format for every derivative it
generates, so the cost compounds down the whole chain.

---

## ⚠ The failure this batch produced twice

**Media reuse is by name.** Both times, the picture and its description came
apart, and neither time did anything fail.

**First:** the four parent-teacher slots took their new descriptions and kept
their old pictures. The page then showed a Parents' Forum photograph captioned
*"The entrance to Sunbeam School Ballia on Parent-Teacher Day, the Head Boy and
Head Girl…"*. The override had set `asset` and `alt` but not the upload `name`,
which is derived one step later — so the upload matched the file it was meant to
replace, and reused it.

**Second, prevented:** the sixteen activity photographs are `01.jpg` … `11.jpg`.
Uploaded under their basenames, the second activity would have inherited the
first one's pictures. They are prefixed `activity-<slug>-NN`.

In both cases the slot is full, the alt is right, the build is clean and the
production diff is identical. **Nothing that counts things can see this.** The
two checks that can are the alt snapshot — which compares descriptions in order,
because an alt attribute is not rendered text and a text diff cannot see it — and
the image comparison, which reduces source and stored file to a 16×16 average
hash, because Strapi re-encodes on upload so bytes legitimately differ and the
picture does not.

---

## Where a photograph is allowed to go

**Into a slot whose subject it already matches.** The parent-teacher page was
illustrated with Parents' Forum photographs — a different event — so real
Parent-Teacher Day photographs are a straight correction. That is the whole
justification, and it is recorded per slot in the overrides file.

**Into a new content row, when the event is its own thing.** Art Integrated
Learning and the SDG session are school activities in their own right, so they
became `news-item` rows in category `activity`, the same shape the other ten use.

**Nowhere, when neither is true.** The Handball frame was not placed. The site
has a `handball-district` record for the District Handball Championship, and
putting a photograph there asserts it is that event — but the banner behind the
team is a Vidyarthi Vigyan Manthan board, and the balls being held look like
basketballs. Two questions went unanswered, so it stays out. A photograph next to
a claim is part of the claim.

⚠ **The temptation is to place all of them.** A school site that pads an empty
page with a nice photograph of something else is doing the thing this project has
refused throughout — three academics pages say outright that the school publishes
nothing on their subject rather than invent.

---

## Two mechanisms this added

**`scripts/fixtures/academics-photo-overrides.json`** — the academics photo plan
is derived from the imports in the last commit, so a photograph sent afterwards
has no import to be found and a hand-edit to the plan is erased on the next
extraction. Overrides are merged on every run, **before upload names are
computed**, and each requires an asset, a description, and a stated reason.

**`npm run seed:new-activities`** — activities built from sent photographs rather
than from `data/schoolActivities.ts`. Typing them into the admin would have taken
ten minutes and left them in one place; as a seed they are in git, reviewable in
a diff, idempotent, and reproduced by a rebuilt database. It upserts by slug and
**deletes nothing** — from go-live the admin is the source of truth, and a seed
that deletes can quietly remove what the school wrote.

---

## Verification

```
  170/175 routes identical to production
       ↳ the 5 differences are the two new pages, the activities index,
         its second page, and one neighbour's "next" link
  171/175 head / hooks / anchors   (the 2 new pages + the 2 known G7 data-*)
  540/540 academics alt attributes identical, in order
  210/210 academics photo slots hold the right picture, by image comparison
  news-item 65 → 67 · media 817 → 837
  both seeds idempotent — second run: 0 created, 0 uploaded
```

---

## The intake, for the next batch

1. **Inventory before anything else** — `npm run inventory -- <folder>`: count,
   dimensions, orientation, EXIF date and GPS. ⚠ Read the dates here; the client's
   re-export stripped them from this batch and they were only recoverable because
   the first scan had already recorded them.
2. **Check provenance.** Three photographs already in this repo belong to other
   schools. Folder names are not reliable either — "SDG Session" held two
   different events with two different audiences.
3. **2400px on the long edge, JPEG, quality 82, native aspect.** Strapi's largest
   derivative is 1600, so anything wider is served from the original; the site
   requests up to 2400. Do not crop to a fixed shape first — the layout crops
   again, and cropping twice throws away what the second crop needed.
4. **Match subjects to slots**, then write the description with the picture.
5. **Run the alt snapshot and the image comparison.** They are the only two
   checks that can see a photograph and its description coming apart.
