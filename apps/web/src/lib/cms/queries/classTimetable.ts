/**
 * ═══ THE CLASS TIMETABLES, FROM THE CMS ════════════════════════════════════
 *
 * One record per class, each holding that class's section sheets. The school
 * replaces a sheet by uploading over the image in Content Manager — nothing on
 * this page is a file in the repository any more.
 *
 * ⚠ THE FIVE STAGES ARE FIXED HERE, NOT IN THE CMS. They are the school's own
 * — the same five /academics/structure/ uses — and they are a fact about how
 * the school is organised, not content that changes per session. The CMS says
 * which stage a class belongs to; it does not get to invent a sixth.
 */
import { cmsFetchAll } from '../client';
import { CLASS_TIMETABLE_POPULATE } from '../populate';
import type { StrapiFile } from '../types';

export interface TimetableSheet {
  /** 'A'…'F', or '' where the class has a single sheet. */
  section: string;
  image: StrapiFile;
}

export interface TimetableClass {
  slug: string;
  label: string;
  stage: string;
  order: number;
  sheets: TimetableSheet[];
}

export interface TimetableStage {
  id: string;
  title: string;
  range: string;
  classes: TimetableClass[];
}

interface RawClass {
  slug: string | null;
  label: string | null;
  stage: string | null;
  order: number | null;
  sheets: { id: number; section: string | null; image: StrapiFile | null }[] | null;
}

const STAGES: [string, string, string][] = [
  ['pre-primary', 'Pre-Primary', 'Nursery, KG I and KG II'],
  ['primary', 'Primary', 'Classes I – V'],
  ['middle', 'Middle School', 'Classes VI – VIII'],
  ['secondary', 'Secondary', 'Classes IX – X'],
  ['senior', 'Senior Secondary', 'Classes XI – XII'],
];

export async function getClassTimetable(): Promise<{
  stages: TimetableStage[];
  classes: TimetableClass[];
  sheetCount: number;
}> {
  /* ⚠ cmsFetchAll PAGES FOR ITSELF. Strapi's default page size is 25 and
     there are fifteen classes today — but a school that adds sections, or a
     future page that lists sheets rather than classes, would silently lose the
     tail with a single fetch. */
  const rows = await cmsFetchAll<RawClass>('/api/class-timetables', {
    populate: CLASS_TIMETABLE_POPULATE,
    sort: ['order:asc'],
  });

  const classes: TimetableClass[] = (rows ?? [])
    .filter((r) => r.slug && r.label && r.stage)
    .map((r) => ({
      slug: r.slug as string,
      label: r.label as string,
      stage: r.stage as string,
      order: r.order ?? 0,
      /* ⚠ A SHEET WITH NO IMAGE IS DROPPED, NOT RENDERED EMPTY. An editor who
         adds a section row and saves before uploading would otherwise put a
         broken frame on the page under a real section letter. */
      sheets: (r.sheets ?? [])
        .filter((s) => s.image)
        .map((s) => ({ section: s.section ?? '', image: s.image as StrapiFile })),
    }))
    /* ⚠ AND A CLASS WITH NO SHEETS AT ALL DOES NOT APPEAR. A card whose only
       content is the word "Class VII" is worse than the class being absent
       until its timetable is ready. */
    .filter((c) => c.sheets.length > 0);

  const stages = STAGES.map(([id, title, range]) => ({
    id,
    title,
    range,
    classes: classes.filter((c) => c.stage === id),
  })).filter((s) => s.classes.length > 0);

  return {
    stages,
    classes,
    sheetCount: classes.reduce((n, c) => n + c.sheets.length, 0),
  };
}
