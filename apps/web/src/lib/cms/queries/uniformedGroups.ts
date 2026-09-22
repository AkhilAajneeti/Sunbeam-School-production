/**
 * NCC · SCOUTS & GUIDES.
 *
 * ⚠ `verified` IS CARRIED THROUGH TO THE COMPONENT, not resolved here. A fact
 * the school asserts about itself reads differently on the page from one that
 * is evidenced, and which is which is content — see the header of
 * data/uniformedGroups.ts.
 */
import { cmsFetchOne } from '../client';
import { UNIFORMED_GROUPS_POPULATE } from '../populate';
import type { StrapiFile } from '../types';

export interface GroupFact { label: string; body: string; verified: boolean }
export interface GroupRecordItem { title: string; body: string }
export interface GroupPhoto { image: StrapiFile | null; alt: string; caption: string }

export interface UniformedGroup {
  slug: string;
  name: string;
  blurb: string;
  facts: GroupFact[];
  record: GroupRecordItem[];
  photos: GroupPhoto[];
  pending: string | null;
}

interface RawGroup {
  slug: string | null; name: string | null; blurb: string | null;
  facts: { id: number; label: string | null; body: string | null; verified: boolean | null }[] | null;
  record: { id: number; title: string | null; body: string | null }[] | null;
  photos: { id: number; image: StrapiFile | null; alt: string | null; caption: string | null }[] | null;
  pending: string | null;
}
interface RawPage { groups: RawGroup[] | null }

export async function getUniformedGroups(): Promise<UniformedGroup[]> {
  const page = await cmsFetchOne<RawPage>('/api/uniformed-groups-page', {
    populate: UNIFORMED_GROUPS_POPULATE,
  });

  return (page?.groups ?? [])
    .filter((g) => g.slug && g.name)
    .map((g) => ({
      slug: g.slug as string,
      name: g.name as string,
      blurb: g.blurb ?? '',
      facts: (g.facts ?? [])
        .filter((f) => f.label && f.body)
        .map((f) => ({
          label: f.label as string,
          body: f.body as string,
          /* ⚠ DEFAULTS TO FALSE, NOT TRUE. An unset flag must read as "the
             school says so", never as "this is evidenced". */
          verified: f.verified === true,
        })),
      record: (g.record ?? [])
        .filter((r) => r.title)
        .map((r) => ({ title: r.title as string, body: r.body ?? '' })),
      /* A photo row with no image renders as a broken frame; drop it. */
      photos: (g.photos ?? [])
        .filter((p) => p.image)
        .map((p) => ({ image: p.image, alt: p.alt ?? '', caption: p.caption ?? '' })),
      pending: g.pending ?? null,
    }));
}
