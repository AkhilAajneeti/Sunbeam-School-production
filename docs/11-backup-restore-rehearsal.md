# Backup & restore — the rehearsed procedure

**Rehearsed 2026-08-27. All eleven checks passed.**

The restore path had never been exercised before that date and did not work when
it was first needed (docs/09, "Second incident"). This document records the
procedure that has now actually been run end to end, with its results. It is the
recovery procedure for this project; treat any change to `scripts/db.mjs` as
requiring a fresh rehearsal.

---

## The commands that succeeded

Run from `apps/cms`. **Strapi must be stopped** for anything that boots its own
instance — `npm run stop` does that properly.

```bash
# 0 · stop Strapi (it is two processes; see below)
npm run stop

# 1 · back up BOTH HALVES — the database and the images
npm run db:backup
#     → backups/sunbeam-20260827T124524Z.dump    (789 KB)
npm run media:backup
#     → backups/uploads-20260827T125517Z.tar.gz  (335 MB, 4,173 files)

# 2 · create a disposable database
node scripts/db.mjs create --name sunbeam_rehearsal

# 3 · restore the dump into it
node scripts/db.mjs restore sunbeam-20260827T124524Z.dump --yes --into sunbeam_rehearsal

# 4-6 · compare every table, both directions
node scripts/verify/compare-db.mjs sunbeam sunbeam_rehearsal

# 7 · start Strapi against the restored copy
DATABASE_NAME=sunbeam_rehearsal npm run develop

# 8 · read it back through the site's own API token
node scripts/verify/api-smoke.mjs

# 9 · build the frontend from it, and diff against production
cd ../web && rm -rf dist && npm run build
cd ../cms && node scripts/verify/prod-diff.mjs --all

# 10 · row counts per content type (Strapi stopped)
npm run stop
DATABASE_NAME=sunbeam_rehearsal npm run verify:counts
npm run verify:counts                      # and the live database, to compare

# 11 · clean up
node scripts/db.mjs drop --name sunbeam_rehearsal
npm run develop
```

For a **real** recovery:

```bash
npm run stop
npm run db:backup                                    # snapshot the damaged state FIRST

npm run media:restore -- <uploads-….tar.gz> --yes    # images first…
npm run db:restore  -- <sunbeam-….dump>    --yes     # …then the records that point at them

npm run verify:counts
npm run develop
```

⚠ **Order matters.** Restoring the database first leaves a window where the CMS
serves file records whose images are not on disk yet.

⚠ Take a backup of the broken database before restoring over it. If the restore
turns out to be the wrong dump, that snapshot is the only way back.

---

## Results

### 1 · Backup

`sunbeam-20260827T124524Z.dump`, 789 KB, `--format=custom`. `db:backup` refuses
to write a dump under 10 KB rather than leave a file that looks like a safety net
and is not.

### 2-3 · Disposable database and restore

`sunbeam_rehearsal` created empty and restored into. **Zero pg_restore errors.**

> An earlier restore of an older dump reported five ignored errors, all on
> `components_home_facility_cards` — that component's shape had changed the same
> day, so the dump carried a `photo` column the schema no longer had. Worth
> knowing: **a dump older than a schema change will not restore that table
> cleanly.** The rows are lost, not the database. Re-seed or accept the gap.

### 4-6 · Table, row and media comparison

```
sunbeam  →  sunbeam_rehearsal

  tables            131 source · 131 restored
  identical counts  131/131
  total rows        9139 source · 9139 restored

✔ every table restored with the same number of rows
```

Spot-checks in the restored copy (Strapi 5 keeps a draft **and** a published row
per document, so these are double the document counts):

```
notices=48  news_items=130  page_metas=148  bus_routes=56
homepage=2  leader_messages=4  files=659  admin_users=1
```

`files` = 659 — **the media library came back whole**, and `admin_users` = 1, so
the login survives a restore.

⚠ `compare-db.mjs` counts with `count(*)`, not `n_live_tup`. The planner
statistic is an estimate a freshly restored database has not gathered yet — it
reads 0 for tables that are full, which in a rehearsal is the most misleading
answer possible.

### 7 · Strapi against the restored database

```
│ Database name │ sunbeam_rehearsal │
info: Strapi started successfully
```

`DATABASE_NAME` in the environment wins over `.env` — Strapi's dotenv does not
overwrite variables that are already set. No schema reconciliation damage: the
copy still matched afterwards.

### 8 · API read-back

Every endpoint returned exactly the expected record count using **the web app's
own read-only token**, not an admin session — an API token is a row in
`strapi_api_tokens`, so a restore that mangled that table would look perfect in
the admin and return 401 to the site.

```
/api/notices               ✔ 24     /api/leader-messages       ✔ 2
/api/news-items            ✔ 65     /api/homepage              ✔ 1
/api/page-metas            ✔ 74     /api/site-setting          ✔ 1
/api/bus-routes            ✔ 28     /api/history-page          ✔ 1
/api/alumni                ✔ 3      /api/vision-mission-page   ✔ 1
/api/games                 ✔ 15

homepage deep read  ✔ 10 slides (10 with media), 15 facility shots
                      (15 with media), 3 story paragraphs
```

The deep read matters: a count proves the rows exist, not that the components and
media hanging off them survived.

### 9 · Frontend render

162 pages built from the restored database, then diffed against the pre-migration
production site:

```
173/173 identical to production
```

**This is the strongest result in the rehearsal.** Not "the tables are there" but
"the website this database produces is indistinguishable, character for
character, from the live one".

### 10 · `verify:counts`

Identical output on both databases — 30 content types, 659 media files, no diff.

### 11 · Cleanup

`sunbeam_rehearsal` dropped; `sunbeam` is the only database in the container.

---

## ⚠ The rehearsal found a second gap: the images were never backed up

`pg_dump` captures the `files` TABLE — name, hash, mime, dimensions, url — and
not one image. Strapi's local upload provider writes the files themselves to
`apps/cms/public/uploads`, which is **git-ignored**: 4,173 files, 351 MB, and
until now the least-protected thing in the project.

Restore that database onto a machine without the directory and the CMS looks
perfect while every image on the site 404s. It did not bite during steps 7–9 only
because the rehearsal ran on the same laptop the uploads were already sitting on.

`scripts/media.mjs` closes it, and was rehearsed the same way:

```bash
npm run media:backup
#   ✔ uploads-20260827T125517Z.tar.gz  (335 MB archived from 4173 files, 340 MB)

npm run media:restore -- uploads-20260827T125517Z.tar.gz --yes --into <scratch>
#   ✔ restored 4173 files (340 MB)
```

| Check | Result |
|---|---|
| file count | 4,173 source · 4,173 restored |
| byte comparison, first 200 files | identical, no differences |

⚠ `backups/` is now git-ignored. It was not, and the 335 MB archive would have
gone into the next commit.

⚠ **`--force-local` and forward slashes.** GNU tar, which Git Bash provides on
Windows, reads `C:/…` as `host:path` and tries to open a network connection;
and even with the flag it mishandles backslashes. Both are handled in
`media.mjs` — worth knowing before anyone reaches for tar by hand here.

---

## Process safety, as it now stands

### One instance, enforced twice

| Guard | Catches |
|---|---|
| `.strapi-develop.lock` (`scripts/develop.mjs`) | a second start **during boot**, before any port is bound |
| preflight port check | a second start once the first is serving |
| `bootStrapi()` port check | a **seed or script** run while Strapi is up |
| preflight generated-types check | the fingerprint of a previous overlap |
| preflight orphan-table check | a content type missing from disk with data in the database |
| preflight `dist/` completeness | a half-compiled build |

⚠ **The lock is the one that closes the real gap.** Strapi cleans `dist/` and
regenerates `types/generated/` *before* it binds the port, so for the ~15 seconds
of a boot a port check sees nothing. That is exactly the window the 2026-08-27
loss went through. The lock is taken before anything is compiled and names the
pids holding it; a lock whose processes are gone is reported and cleared rather
than left to be deleted unread.

Verified: a second `npm run develop` four seconds into the first boot was refused.

### Stopping properly

```bash
npm run stop
```

`strapi develop` is **two node processes** — a supervisor and the server. Ctrl-C
in the owning terminal ends both; a killed npm wrapper, a closed terminal or a
stopped background task leaves the server holding port 1337. `npm run stop` finds
every node process whose command line mentions strapi, kills the tree, releases
the lock and **reports whether the port actually came free**.

### The watcher no longer churns

`config/admin.ts` now sets `watchIgnoreFiles` for `scripts/`, `backups/`, `docs/`
and the lock file. Every dev restart cleans `dist/` and regenerates types, and a
rebuild is the window in which this project has twice lost content — restarts
should happen when the application changes, not when a tool beside it does.

---

## Still required before production

The rehearsal proves the mechanism. It does not make the backup system
production-ready on its own:

- [ ] **Off-machine nightly backups.** Everything above lives on one laptop, in a
      container whose named volume is one `docker volume rm` from gone.
- [ ] **~30-day retention**, so a fault noticed a fortnight late is still
      recoverable.
- [ ] **A scheduled rehearsal.** This one passed against today's schema. Re-run
      it after any content-type change, and at least quarterly — the failure mode
      is not "restore breaks", it is "restore quietly stops matching the schema".
- [ ] **Backup before every deployment and every schema change**, not only when
      something feels risky.
- [ ] **Content-type renames as add → migrate → verify → remove.** A rename done
      as delete-then-create is what caused the G3 incident.
- [x] ~~Media files are not covered by the dump~~ — `npm run media:backup`
      added and rehearsed. Both halves must go off-machine, and the images are
      the large one.
