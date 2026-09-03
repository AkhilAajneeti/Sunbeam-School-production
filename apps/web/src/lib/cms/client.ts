/**
 * THE ONLY PLACE THIS PROJECT TALKS TO STRAPI.
 *
 * Every query module beside this file goes through `cmsFetch` or `cmsFetchAll`.
 * No page, no component, and no layout builds a URL or sets a header of its own —
 * which is what makes a change to authentication, timeouts, error reporting or
 * caching a one-file change rather than a search across 174 routes.
 *
 * ═══ THREE THINGS THIS SOLVES THAT A BARE fetch() DOES NOT ═════════════════
 *
 * 1 · PAGINATION IS NOT OPTIONAL. Strapi returns 25 items by default and caps a
 *     page at 100. A page that calls /api/notices and renders `data` looks
 *     perfect at 24 notices and silently loses the 26th. `cmsFetchAll` walks
 *     every page and returns the whole set.
 *
 * 2 · THE BUILD MUST NOT HAMMER THE CMS. Astro renders 174 pages; several ask
 *     for the same content. The in-process cache below means each distinct
 *     query is fetched once per build, not once per page that wants it.
 *
 * 3 · A FAILURE MUST SAY WHAT FAILED. Strapi answers a bad token with a bare
 *     403 and a missing populate with a 400, and the default error for both is
 *     an unhelpful `fetch failed`. `CmsError` carries the status, the path and
 *     what to do about it.
 */
import {
  STRAPI_URL,
  STRAPI_TOKEN,
  CMS_TIMEOUT_MS,
  CMS_MAX_PAGE_SIZE,
  assertCmsConfigured,
} from './config';
import type { StrapiListResponse, StrapiSingleResponse } from './types';

/** Anything Strapi accepts as a query parameter, nested to any depth. */
export type QueryValue = string | number | boolean | null | undefined | QueryObject | QueryValue[];
export interface QueryObject {
  [key: string]: QueryValue;
}

export class CmsError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly path: string,
  ) {
    super(message);
    this.name = 'CmsError';
  }
}

/**
 * Serialise nested params into Strapi's bracket syntax.
 *
 *   { populate: { image: true }, pagination: { pageSize: 100 } }
 *     → populate[image]=true&pagination[pageSize]=100
 *
 * Written here rather than pulling in `qs`: this is the whole of what the
 * project needs from that library, and a dependency whose entire use is
 * fifteen lines is a dependency worth not having.
 */
function serialise(params: QueryObject, prefix = ''): string[] {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    const path = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item !== null && typeof item === 'object') {
          parts.push(...serialise(item as QueryObject, `${path}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${path}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === 'object') {
      parts.push(...serialise(value as QueryObject, path));
    } else {
      parts.push(`${encodeURIComponent(path)}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts;
}

function buildUrl(path: string, params: QueryObject): string {
  const query = serialise(params).join('&');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${STRAPI_URL}${clean}${query ? `?${query}` : ''}`;
}

/**
 * ⚠ CACHE LIFETIME IS THE BUILD, NOT A DURATION. A static build is one process
 * that exits when it finishes, so this map dies with it and can never serve a
 * stale notice to a later build. There is deliberately no TTL: within a single
 * build the CMS content is a fixed thing, and re-fetching it would only produce
 * a site whose pages disagree with each other about what was published.
 *
 * ⚠⚠ AND IT IS DISABLED IN DEV, BECAUSE THE DEV SERVER NEVER EXITS.
 *
 * The reasoning above holds only for a process with an end. `astro dev` is also
 * a single process, but it runs for hours — so the same map that guarantees a
 * consistent build guarantees a STALE dev server: edit a value in Strapi, reload
 * the page, and nothing changes until the server is restarted.
 *
 * That is not a theoretical problem. It made the first live mutation test on
 * site-settings report a false negative: the value was changed in Postgres, the
 * page was re-requested, and the old number came back from this map. Anyone
 * verifying a migration would have concluded the CMS was not wired up.
 *
 * In dev every call goes to Strapi. Builds keep the cache, so 174 pages sharing
 * one query still make one request.
 */
const CACHE_ENABLED = import.meta.env.PROD;
const cache = new Map<string, Promise<unknown>>();

async function request<T>(url: string, path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    throw new CmsError(
      aborted
        ? `CMS request timed out after ${CMS_TIMEOUT_MS}ms — is Strapi running at ${STRAPI_URL}?`
        : `Could not reach the CMS at ${STRAPI_URL} — is it running? (${(err as Error).message})`,
      null,
      path,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    /* Strapi puts a useful sentence in the body; a bare status code does not
       distinguish "token is wrong" from "you populated a field that is not
       there", and those need different fixes. */
    let detail = '';
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      detail = body?.error?.message ? ` — ${body.error.message}` : '';
    } catch {
      /* non-JSON error body */
    }

    const hint =
      response.status === 401 || response.status === 403
        ? '  The read-only token is missing, wrong, or was regenerated. Re-mint it: cd apps/cms && npm run token:read-only'
        : response.status === 404
          ? '  That content type has no route. Is the collection created and the server restarted?'
          : '';

    throw new CmsError(
      `CMS ${response.status} on ${path}${detail}${hint ? `\n${hint}` : ''}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}

/** One request, cached for the life of the build. */
export function cmsFetch<T>(path: string, params: QueryObject = {}): Promise<T> {
  assertCmsConfigured();

  const url = buildUrl(path, params);

  if (!CACHE_ENABLED) return request<T>(url, path);

  const hit = cache.get(url);
  if (hit) return hit as Promise<T>;

  /* ⚠ THE PROMISE IS CACHED, NOT THE RESULT. Two pages rendering concurrently
     would otherwise both miss the cache and both fetch. Storing the in-flight
     promise means the second awaits the first. A rejection is evicted so that a
     transient failure does not poison the rest of the build. */
  const inFlight = request<T>(url, path).catch((err) => {
    cache.delete(url);
    throw err;
  });

  cache.set(url, inFlight);
  return inFlight;
}

/**
 * Every item of a collection, across as many pages as it takes.
 *
 * @param path   e.g. '/api/notices'
 * @param params populate, sort and filters — pagination is managed here
 */
export async function cmsFetchAll<T>(path: string, params: QueryObject = {}): Promise<T[]> {
  const collected: T[] = [];
  let page = 1;

  /* Bounded so a pagination bug cannot spin forever during a build. 100 pages
     at 100 items is 10,000 records — far beyond anything this site holds. */
  for (let guard = 0; guard < 100; guard++) {
    const response = await cmsFetch<StrapiListResponse<T>>(path, {
      ...params,
      pagination: { page, pageSize: CMS_MAX_PAGE_SIZE, ...(params.pagination as QueryObject) },
    });

    collected.push(...(response.data ?? []));

    const meta = response.meta?.pagination;
    if (!meta || page >= meta.pageCount || meta.pageCount === 0) break;
    page++;
  }

  return collected;
}

/** A single document by path, or null when Strapi has none. */
export async function cmsFetchOne<T>(path: string, params: QueryObject = {}): Promise<T | null> {
  const response = await cmsFetch<StrapiSingleResponse<T>>(path, params);
  return response.data ?? null;
}

/** Testing and dev-server hygiene; a production build never needs it. */
export function clearCmsCache(): void {
  cache.clear();
}
