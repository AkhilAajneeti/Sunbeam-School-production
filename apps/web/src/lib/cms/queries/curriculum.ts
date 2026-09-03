/**
 * THE CURRICULUM PAGE — five named sections, and the stages that feed two of them.
 *
 * ⚠ `stages` IS NOT PART OF A SECTION. The journey across the top of 01 and the
 * rows of the library in 02 are the same five stages drawn two ways, so they are
 * read once and handed to both. The count printed in 02's note is derived here
 * for the same reason: it cannot be allowed to disagree with the cards.
 *
 * ⚠ NO TONE FIELD. The colour of each card is design — the page holds a palette
 * per section and cycles it — so nothing here carries one.
 */
import { cmsFetchOne } from '../client';
import { CURRICULUM_POPULATE } from '../populate';
import { fillTokens, fileUrl } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile } from '../types';

interface RawParagraph { text: string | null }
interface RawClassDoc {
  label: string | null; href: string | null; sizeMb: number | null;
  file: StrapiFile | null;
}
interface RawStage {
  label: string | null; range: string | null; blurb: string | null;
  mark: string | null; classes: RawClassDoc[] | null;
}
interface RawTile {
  label: string | null; value: string | null; mark: string | null; href: string | null;
  file: StrapiFile | null;
}
interface RawLede {
  kicker: string | null; heading: string | null; headingEm: string | null;
  body: RawParagraph[] | null;
}
interface RawTiles {
  kicker: string | null; heading: string | null; headingEm: string | null;
  tiles: RawTile[] | null;
}

interface RawPage {
  stages: RawStage[] | null;
  sectionOne: RawLede | null;
  sectionTwo: RawLede | null;
  sectionThree: RawTiles | null;
  sectionFour: RawTiles | null;
  sectionFive: RawTiles | null;
}

/**
 * ⚠ href AND sizeMb ARE RESOLVED, NOT RAW. An uploaded PDF wins over a pasted
 * link, and an uploaded PDF reports its own size — so the page receives one
 * address and one number and does not have to know where either came from.
 */
export interface ClassDoc { label: string; href: string | null; sizeMb: number | null }
export interface Stage {
  label: string; range: string; blurb: string;
  /** A key into the site's own symbol set. */
  mark: string;
  classes: ClassDoc[];
}
export interface Tile {
  label: string; value: string; mark: string; href: string | null;
  /** True when the card points at an uploaded file rather than a page. */
  isFile: boolean;
}
export interface Lede { kicker: string; heading: string; headingEm: string; body: string[] }
export interface TileSection { kicker: string; heading: string; headingEm: string; tiles: Tile[] }

export interface Curriculum {
  stages: Stage[];
  /** How many class documents there are, counted rather than typed. */
  totalDocs: number;
  one: Lede; two: Lede;
  three: TileSection; four: TileSection; five: TileSection;
}

export async function getCurriculum(): Promise<Curriculum> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<RawPage>('/api/curriculum-page', { populate: CURRICULUM_POPULATE }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);
  const texts = (list: RawParagraph[] | null | undefined) =>
    (list ?? []).map((p) => t(p.text)).filter(Boolean);

  const lede = (s: RawLede | null | undefined): Lede => ({
    kicker: t(s?.kicker), heading: t(s?.heading), headingEm: t(s?.headingEm), body: texts(s?.body),
  });
  /**
   * An uploaded file wins over a typed link: uploading one is a deliberate act,
   * and a stale address left underneath it should not quietly override it.
   */
  const linkOf = (file: StrapiFile | null | undefined, href: string | null | undefined) =>
    (file ? fileUrl(file) : href) || null;

  /** Strapi reports size in kilobytes; the card prints megabytes. */
  const megabytes = (file: StrapiFile | null | undefined, typed: number | null | undefined) =>
    (file?.size ? Math.round(file.size / 1024) : typed) ?? null;

  const tiles = (s: RawTiles | null | undefined): TileSection => ({
    kicker: t(s?.kicker), heading: t(s?.heading), headingEm: t(s?.headingEm),
    tiles: (s?.tiles ?? []).map((x) => ({
      label: t(x.label), value: t(x.value), mark: x.mark ?? 'bulb',
      href: linkOf(x.file, x.href), isFile: Boolean(x.file),
    })),
  });

  const stages: Stage[] = (raw?.stages ?? []).map((s) => ({
    label: t(s.label), range: t(s.range), blurb: t(s.blurb), mark: s.mark ?? 'book',
    classes: (s.classes ?? []).map((c) => ({
      label: t(c.label),
      href: linkOf(c.file, c.href),
      sizeMb: megabytes(c.file, c.sizeMb),
    })),
  }));

  const totalDocs = stages.reduce((n, s) => n + s.classes.length, 0);

  const two = lede(raw?.sectionTwo);

  return {
    stages,
    totalDocs,
    one: lede(raw?.sectionOne),
    /* {count} is the one token this page fills in itself. */
    two: { ...two, body: two.body.map((p) => p.split('{count}').join(String(totalDocs))) },
    three: tiles(raw?.sectionThree),
    four: tiles(raw?.sectionFour),
    five: tiles(raw?.sectionFive),
  };
}
