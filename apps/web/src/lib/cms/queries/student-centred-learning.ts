/**
 * THE STUDENT-CENTRED LEARNING PAGE — four named sections, in page order.
 *
 * ⚠ THREE OF THE FOUR SHAPES ARE SHARED WITH TEACHING PHILOSOPHY, so their types
 * are imported rather than restated. Pages are modelled by shape: a statement
 * section is a statement section wherever it appears, and only the collage in 02
 * is particular to this page.
 *
 * The page still owns the design — nothing here carries a position, a delay, a
 * radius or an order.
 */
import { cmsFetchOne } from '../client';
import { STUDENT_CENTRED_POPULATE } from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile } from '../types';
import type { Statement, Constellation, Close } from './teaching-philosophy';

interface RawParagraph { text: string | null }
interface RawAbility { label: string | null; icon: StrapiFile | null }

interface RawCollage {
  heading: string | null; headingSecond: string | null;
  index: RawParagraph[] | null; body: RawParagraph[] | null;
  imageOne: StrapiFile | null; imageOneAlt: string | null;
  imageTwo: StrapiFile | null; imageTwoAlt: string | null;
  imageThree: StrapiFile | null; imageThreeAlt: string | null;
}

interface RawPage {
  sectionOne: Record<string, unknown> | null;
  sectionTwo: RawCollage | null;
  sectionThree: Record<string, unknown> | null;
  close: Record<string, unknown> | null;
}

export interface Collage {
  heading: string; headingSecond: string;
  index: string[]; body: string[];
  imageOne: StrapiFile | null; imageOneAlt: string;
  imageTwo: StrapiFile | null; imageTwoAlt: string;
  imageThree: StrapiFile | null; imageThreeAlt: string;
}

export interface StudentCentred {
  one: Statement; two: Collage; three: Constellation; close: Close;
}

export async function getStudentCentredLearning(): Promise<StudentCentred> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<RawPage>('/api/student-centred-learning-page', { populate: STUDENT_CENTRED_POPULATE }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);
  const texts = (list: RawParagraph[] | null | undefined) =>
    (list ?? []).map((p) => t(p.text)).filter(Boolean);

  /** An empty author means the Principal, as it does on every philosophy page. */
  const who = (v: unknown) => t(v) || school.principal || '';

  const s = (raw?.sectionOne ?? {}) as Record<string, any>;
  const th = (raw?.sectionThree ?? {}) as Record<string, any>;
  const c = (raw?.close ?? {}) as Record<string, any>;

  return {
    one: {
      kicker: t(s.kicker), heading: t(s.heading), headingEm: t(s.headingEm),
      quote: t(s.quote), quoteAuthor: who(s.quoteAuthor),
      body: texts(s.body), image: s.image ?? null, imageAlt: t(s.imageAlt),
    },
    two: {
      heading: t(raw?.sectionTwo?.heading), headingSecond: t(raw?.sectionTwo?.headingSecond),
      index: texts(raw?.sectionTwo?.index), body: texts(raw?.sectionTwo?.body),
      imageOne: raw?.sectionTwo?.imageOne ?? null, imageOneAlt: t(raw?.sectionTwo?.imageOneAlt),
      imageTwo: raw?.sectionTwo?.imageTwo ?? null, imageTwoAlt: t(raw?.sectionTwo?.imageTwoAlt),
      imageThree: raw?.sectionTwo?.imageThree ?? null, imageThreeAlt: t(raw?.sectionTwo?.imageThreeAlt),
    },
    three: {
      kicker: t(th.kicker), heading: t(th.heading), headingEm: t(th.headingEm),
      body: texts(th.body), image: th.image ?? null, imageAlt: t(th.imageAlt),
      cards: ((th.cards ?? []) as RawAbility[]).map((x) => ({ label: t(x.label), icon: x.icon ?? null })),
    },
    close: {
      headingLines: texts(c.headingLines),
      quote: t(c.quote), quoteAuthor: who(c.quoteAuthor),
      image: c.image ?? null, imageAlt: t(c.imageAlt),
    },
  };
}
