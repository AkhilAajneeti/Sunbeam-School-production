# D31 · The CMS data-loss incident, and the database safety procedure

**Date:** 27 August 2026 · **Status:** cause reproduced, safeguards in place
**Data lost permanently:** none — everything was still reconstructable from `apps/web/src/data/*.ts`

---

## What happened

While adding the `news-item` and `news-category-page` content types (G3), every
previously migrated table dropped to zero rows:

| Wiped | Survived |
|---|---|
| `site_settings`, `page_metas`, `notices`, `job_postings`, `alumni`, `alumni_meets`, `calendar_documents`, `achievement_majors`, `credentials`, `achievement_records`, `academic_calendar_page` | `news_items`, `news_category_pages`, `files` (338 rows) |

`npm run seed` restored all of it exactly. That worked **only because the source
of truth was still a set of `.ts` files in this repository.**

---

## The cause — reproduced

**Strapi drops the table of any content type it cannot see at boot, with every
row in it, silently.** No prompt, no warning, no error in the log.

Reproduced deliberately on a throwaway type:

1. Created content type `repro-probe`; Strapi created `repro_probes`.
2. Inserted one row (`SENTINEL`).
3. Removed `src/api/repro-probe/` and restarted Strapi.
4. `to_regclass('public.repro_probes')` → **`DROPPED`**. Row gone.

The Postgres log from the incident shows the same signature:

```
08:52:32 UTC ERROR:  relation "public.notices" does not exist
08:52:32 UTC STATEMENT: alter table "public"."notices" drop constraint "notices_created_by_id_fk"
```

Strapi was altering a table it had *already dropped*.

### How an accidental removal happened

The `site-settings` → `site-setting` rename was done as
`rm -rf site-setting && mv site-settings site-setting` — which removes a
content-type directory. Combined with a run of crashed boots (a TypeScript
compile failure, a `ts:generate-types` cycle, and a stale process still holding
port 1337 while a second instance started), Strapi booted more than once against
an incomplete view of the content types.

**What is proven:** a content type missing from disk causes its table to be
dropped with its data, and that is trivially reproducible.
**What is inferred:** that this same mechanism, during the crash sequence, took
the other tables. The DROPs themselves were not captured because
`log_statement` was off at the time — it is on now (`mod`).

### What did *not* cause it

Both tested and cleared:

- **Adding a content type / hot reload.** Created a new type on a live database:
  zero rows changed anywhere.
- **Losing `strapi_database_schema`.** Deleted the row and restarted: Strapi
  rebuilt it and touched no data.
- **`ts:generate-types`.** It only cleans `dist/` and writes type files. It does
  not connect to the database.

---

## Does the risk persist?

**Yes, and it is not a development-only problem.** Strapi runs the same
reconciliation on `strapi start` in production. Anything that presents Strapi
with fewer content types than the database knows about will destroy content:

- an incomplete deploy or a half-finished build
- a bad merge, or a `git checkout` of one directory
- a rename done as remove-then-add
- a content type deleted on another branch and deployed

---

## Safeguards now in place

### 1 · Preflight guard — `apps/cms/scripts/preflight.mjs`

Runs automatically before `npm run develop` and `npm run start` (npm `pre`
hooks). It compares every `collectionName` on disk against the content-type
tables in the database and **refuses to start** if a table holds rows but has no
schema:

```
✖ PREFLIGHT FAILED — refusing to start Strapi.
    notices                                48 rows
```

It checks for **data**, not merely for tables — an empty orphan is noise, an
orphan with 400 rows is the school's content about to be deleted. A deliberate
deletion is done with `ALLOW_CONTENT_TYPE_DROP=1`, after a backup.

⚠ It excludes Strapi's own join tables, including `files_related_mph` — the
upload plugin's polymorphic link, which does not end in `_lnk` and produced a
false positive on a healthy tree in the first version.

### 2 · Backups — `apps/cms/scripts/db.mjs`

```
npm run db:backup               → backups/sunbeam-<utc>.dump   (pg_dump, custom format)
npm run db:list
npm run db:restore -- <file> --yes
```

Custom format so `pg_restore` can be selective — one table, or schema-only.
A dump under 10 KB is rejected rather than left as a false safety net.

### 3 · Statement logging

`log_statement = 'mod'` is now set on the Postgres instance, so DDL and
data-modifying statements are captured. The incident's DROPs were invisible
because this was off.

---

## Procedure for any schema change

1. `npm run db:backup`
2. Make the change. **Rename by adding the new directory first, then removing
   the old one** — never `rm` a content type as step one.
3. Start Strapi. The preflight guard runs on its own.
4. If it refuses, read what it names. Do not reach for the override until you
   understand why the type is missing.
5. Verify row counts before considering the change done.

---

## Still required before production

The three safeguards above make the failure loud instead of silent. They are not
a backup strategy. Before go-live:

- **Automated nightly `pg_dump`, copied off the machine.** A backup on the same
  disk is not a backup.
- **A restore rehearsed at least once** into a scratch database — an untested
  backup is a guess.
- **Retention** (~30 days) and encryption at rest.
- **`strapi start`, never `strapi develop`, in production**, from a build
  verified complete before it is promoted.
- **⚠ THE SEEDS ARE NOT A RECOVERY PATH AFTER GO-LIVE.** They restore the
  repository's idea of the content. The day the school publishes its first
  notice from the admin, `npm run seed` would discard it. From that point the
  seeds are a one-way import and `db:restore` is the only recovery.

---

## Addendum · a partial `dist/` is the trigger, and the guard does not see it

Hit again during G5, and worth recording precisely because this time nothing was
lost.

Adding six content types produced:

```
TypeError: Cannot read properties of undefined (reading 'kind')
  at Object.isSingleType … at Object.createRoutes
```

The cause was not the schemas — every one was valid JSON with correct
singular/plural naming. `dist/src/api` was simply **missing three of the six**:
the TypeScript compile had been interrupted (an earlier `EPERM` cleaning
`dist/`, with a second Strapi instance holding the directory). Strapi then
registered a route for a content type it could not resolve.

`rm -rf dist` and a restart fixed it with no data change — the boot fails
*before* schema sync, so this particular symptom is loud and safe.

**The dangerous variant is the quiet one:** a `dist/` missing a content type
whose controller is also absent registers nothing and raises nothing — Strapi
boots cleanly, sees fewer content types than the database, and drops the rest.
That is the most likely path the G3 incident actually took.

⚠ **The preflight guard does not catch this.** It compares `src/` schemas against
the database, and in this failure `src/` is complete — it is `dist/` that is
short. Treat any interrupted build as suspect:

```
rm -rf dist && npm run develop      # never start on a half-compiled dist
```

Two rules follow for production:

- **Build and start are separate steps, and a failed build must block the
  start.** `strapi build && strapi start` in one chain, never a start against
  whatever `dist/` happens to contain.
- **Never run two Strapi instances against one database.** Two raced during G5
  and produced `duplicate key … pg_type_typname_nsp_index` while creating the
  same table; on Windows one also held `dist/` open and caused the partial
  compile above.

---

## Second incident — 2026-08-27, during G6

Every content-type table was emptied a second time. This one is fully explained,
and unlike G3 it was caught within minutes, so it is worth recording precisely.

### What happened

A shell command intended to start Strapi accidentally contained two invocations:

```bash
cd ../../.. && npm run develop --prefix ../cms > /dev/null 2>&1 &
cd .../apps/cms && npm run develop > strapi.log 2>&1
```

Both started. The second lost the race for port 1337 and exited — but only after
doing the two things that matter, because Strapi does them *before* it binds:

1. **it cleaned `dist/`**, and
2. **it regenerated `types/generated/`**

The first instance was booting through those same directories at the time. What
came out the other side was a `contentTypes.d.ts` containing the plugin types and
**not one `api::` type**, and a `dist/` mid-rebuild. Strapi finished booting
against that, saw no content types, and reconciled the schema accordingly:

```
notices        24 → 0
news_items     65 → 0
page_metas     74 → 0
bus_routes     28 → 0
…every content-type table
```

### What survived, and why that is the dangerous part

`files` (659 rows), every `components_*` table, `admin_users`, `admin_permissions`
— all intact. So:

- the admin panel loads and looks normal,
- the media library is full,
- the site still builds,
- and **only a row count says anything is wrong**.

The orphaned component rows are the tell: 1,070 `components_shared_photos` with
nothing left pointing at them.

### Recovery

`npm run db:backup` had been run at the start of the session, so the path was:

```
npm run db:backup                                   # snapshot the damaged state first
npm run db:restore -- sunbeam-20260827T112617Z.dump --yes
npm run seed:page-meta && npm run seed:home         # replay the day's work
npm run verify:counts
```

Five `pg_restore` errors were ignored, all on `components_home_facility_cards` —
that component's shape had changed the same day, so the dump's `photo` column no
longer existed. The seed rebuilds that table, so nothing was lost.

### ⚠ The restore path did not work, and had never been tried

`npm run db:restore` failed with:

```
pg_restore: error: input file is too short (read 0, expected 5)
```

`docker exec -i … pg_restore` reads the dump from **stdin**, and nothing was
being piped in — `stdio[0]` was `'ignore'`. The backup half had always worked,
which is exactly what made it dangerous: six dumps sat in `backups/` looking like
a safety net, and the first time one was needed it could not be put back.

**A backup you have never restored is a hypothesis, not a backup.** The restore
rehearsal was already on the pre-production list below; it should be treated as
a blocking item, not a formality. Fixed in `scripts/db.mjs`, which now also
refuses to restore from a file too small to be a real dump.

### ⚠ `npm run develop` is two node processes

`strapi develop` runs a supervisor that spawns the actual server. **Killing the
npm wrapper leaves the server alive and holding port 1337** — that orphan is what
produced the overlap here, twice. To stop Strapi properly:

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'strapi' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

Then confirm nothing is listening before starting again or running a seed.

### New safeguards

`scripts/preflight.mjs` gained two checks ahead of the existing ones:

- **something already serving port 1337** → refuse to start. A TCP connect, not
  an HTTP request: the first version asked `GET /_health`, which Strapi answers
  only on HEAD, so it reported "all clear" with Strapi plainly running.
- **generated types containing no `api::` type** → refuse to start. This is not
  the cause of a drop, but it is the unambiguous fingerprint of one about to
  happen, and it costs nothing to check.

`npm run verify:counts` prints the row count of every content type. Run it after
anything that could have left two processes alive — it is the only cheap way to
tell this failure from a healthy database.

### Rules, restated

- **One Strapi at a time.** Stop the running instance before starting another or
  running any seed; seeds boot their own instance in-process.
- **Check the port, not the wrapper.**
- **Back up before schema work**, and know that the restore works.
- Do not treat the `.ts` seeds as the recovery path. They were sufficient today
  only because no content has been authored in the admin yet. From go-live the
  dumps are the recovery path and the seeds are a one-way import.
