/**
 * ACHIEVEMENT QUERIES.
 *
 * ⚠ THESE EXPORTS MIRROR data/achievements.ts. That file exported `majors`,
 * `credentials`, `sportRecord` and `academicRecord`; three components consume
 * them and none of those components is being redesigned, so the shapes returned
 * here match what they already destructure.
 *
 * ⚠ ONLY PUBLISHED ITEMS ARE RETURNED — the read-only token cannot see drafts.
 */
import { cmsFetchAll } from '../client';
import {
  MAJOR_POPULATE,
  CREDENTIAL_POPULATE,
  ACHIEVEMENT_RECORD_POPULATE,
} from '../populate';
import type { Major, Credential, AchievementRecord } from '../types';

/** What Strapi actually sends for a repeatable component. */
interface RawFact {
  id: number;
  value: string;
}
type RawMajor = Omit<Major, 'facts'> & { facts: RawFact[] | null };

/**
 * The award-graphic achievements, widest reach first.
 *
 * ⚠ `facts` IS FLATTENED TO string[] HERE AND NOWHERE ELSE. Doing it in the
 * query means Majors.astro never learns that Strapi models a list of strings as
 * a list of objects — which is a storage detail, not something a card that
 * renders three bullet points should have to know.
 */
export async function getMajors(): Promise<Major[]> {
  const raw = await cmsFetchAll<RawMajor>('/api/achievement-majors', {
    populate: MAJOR_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return raw.map((m) => ({
    ...m,
    facts: (m.facts ?? []).map((f) => f.value),
  }));
}

/** Third-party recognition, in the order the page shows them. */
export async function getCredentials(): Promise<Credential[]> {
  return cmsFetchAll<Credential>('/api/credentials', {
    populate: CREDENTIAL_POPULATE,
    sort: ['displayOrder:asc'],
  });
}

/**
 * Both record boards, in one request, split by category.
 *
 * ⚠ ONE FETCH AND A CLIENT-SIDE SPLIT, NOT TWO FILTERED FETCHES. Twenty-one
 * rows is far below a single page, so filtering server-side would cost a second
 * round trip to save nothing — and the two boards are always rendered together
 * by the same component.
 */
export async function getAchievementRecords(): Promise<{
  sportRecord: AchievementRecord[];
  academicRecord: AchievementRecord[];
}> {
  const all = await cmsFetchAll<AchievementRecord>('/api/achievement-records', {
    populate: ACHIEVEMENT_RECORD_POPULATE,
    sort: ['displayOrder:asc'],
  });

  return {
    sportRecord: all.filter((r) => r.category === 'sport'),
    academicRecord: all.filter((r) => r.category === 'academic'),
  };
}
