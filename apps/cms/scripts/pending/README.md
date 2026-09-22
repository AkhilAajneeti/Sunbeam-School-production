# Empty — every structure type is live

This held the Academic Structure single types while their pages were still
reading `academic-topic`. A content type Strapi can see is one an editor can
open, and an empty form that silently does nothing is worse than no form.

All seven are now in `src/api/` with content in them:
Pre-Primary, Primary, Middle School, Secondary, Senior Secondary,
Streams Offered and Subject Combinations.

## If you park another one

1. Move it here and rename its three `.ts` files to `.ts.pending` — `scripts/`
   is inside the TypeScript build, so a parked controller referring to a UID
   Strapi cannot see fails compilation.
2. Reverse both steps to bring it back, then run
   `npx strapi ts:generate-types` BEFORE `npm run develop`: on a type's first
   boot the compile runs before typegen, so it cannot yet see its own UID.
