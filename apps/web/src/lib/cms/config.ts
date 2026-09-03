/**
 * CMS CONNECTION SETTINGS — read once, validated once.
 *
 * ⚠⚠ NEITHER VARIABLE MAY EVER BE RENAMED WITH A `PUBLIC_` PREFIX.
 *
 * Astro inlines every `PUBLIC_*` variable into the client bundle as a literal
 * string. `PUBLIC_STRAPI_TOKEN` would therefore ship the CMS credential to
 * every visitor, readable in devtools by anyone who looks. Both values below
 * are read only from frontmatter and from the query modules beside this file —
 * all of which run at BUILD time, on the machine doing the building — so
 * neither ever reaches a browser.
 *
 * ⚠ THE BUILD FAILS LOUDLY WHEN THESE ARE MISSING, AND THAT IS THE POINT. The
 * tempting alternative — fall back to the local .ts data when the CMS is
 * unreachable — would mean a broken token silently ships a site frozen at
 * whatever the repository last contained, with no error anywhere. A school
 * publishes a notice, sees the build go green, and the notice is not on the
 * site. Failing the build is the honest outcome.
 */

/** Where Strapi lives. No trailing slash — every caller appends its own path. */
export const STRAPI_URL: string = (import.meta.env.STRAPI_URL ?? '').replace(/\/+$/, '');

/** Read-only API token. Minted with `npm run token:read-only` in apps/cms. */
export const STRAPI_TOKEN: string = import.meta.env.STRAPI_TOKEN ?? '';

/** How long a single CMS request may take before the build gives up. */
export const CMS_TIMEOUT_MS = 20_000;

/**
 * Strapi's own maximum page size. Requesting more than this silently returns
 * fewer items, which is exactly the kind of thing that looks like missing
 * content rather than a capped request — so the paginating fetch in client.ts
 * walks pages at this size instead of asking for everything at once.
 */
export const CMS_MAX_PAGE_SIZE = 100;

/** Throw early, with an instruction rather than a stack trace. */
export function assertCmsConfigured(): void {
  const missing: string[] = [];
  if (!STRAPI_URL) missing.push('STRAPI_URL');
  if (!STRAPI_TOKEN) missing.push('STRAPI_TOKEN');

  if (missing.length > 0) {
    throw new Error(
      [
        '',
        `  Missing ${missing.join(' and ')} — the CMS cannot be reached.`,
        '',
        '  Copy apps/web/.env.example to apps/web/.env, then mint a token:',
        '',
        '      cd apps/cms && npm run token:read-only',
        '',
        '  Paste the printed values into apps/web/.env and build again.',
        '',
      ].join('\n'),
    );
  }
}
