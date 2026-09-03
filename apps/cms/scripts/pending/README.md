# Not loaded by Strapi — on purpose

These five single types are the Academic Structure stage pages
(Pre-Primary, Primary, Middle School, Secondary, Senior Secondary).

They are finished as schemas and they are NOT in `src/api/`, because a content
type Strapi can see is a content type an editor can open — and these have no
content in them yet and no page reading them. An empty form that silently does
nothing is worse than no form at all, and it would also have left
`npm run verify:admin-map` reporting five unlinked types for no reason a reader
could act on.

## To bring one in

1. `mv scripts/pending/api/<type> src/api/<type>` and drop the `.pending`
   suffix from its three `.ts.pending` files — they are renamed so that the
   TypeScript build does not check UIDs Strapi cannot see.
2. Run the codemod that rewrites its page and writes its fixture in the same
   pass: `node scripts/extract/structure-page.mjs <PageName> --write`
3. Build the fixture, seed it, add the query + populate spec, the editor labels
   and the entry in `src/admin/content-map.ts`.

The codemod is `scripts/extract/structure-page.mjs`. It reports a miss and
refuses to write rather than dropping anything it cannot reproduce exactly.
