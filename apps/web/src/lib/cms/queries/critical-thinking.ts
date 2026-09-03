/**
 * THE CRITICAL THINKING & CREATIVITY PAGE — four named sections.
 *
 * ⚠ 02 AND 03 ARE THE SAME SHAPE, so they are the same type and the page draws
 * them from the same data. They do not look identical — one runs its words down
 * a rail beside two frames, the other lays them along an arc under one — but
 * that difference is composition, and composition lives in the page.
 *
 * The symbol beside each word is stored as a NAME, not as a drawing. The site
 * owns the paths; the CMS owns which one to use.
 */
import { cmsFetchOne } from '../client';
import { CRITICAL_THINKING_POPULATE } from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile } from '../types';
import type { Statement } from './teaching-philosophy';

interface RawParagraph { text: string | null }
interface RawMark { label: string | null; mark: string | null }

interface RawMarkedList {
  kicker: string | null; heading: string | null;
  headingSecond: string | null; headingEm: string | null;
  body: RawParagraph[] | null; marks: RawMark[] | null;
  imageOne: StrapiFile | null; imageOneAlt: string | null;
  imageTwo: StrapiFile | null; imageTwoAlt: string | null;
}

interface RawCollage {
  kicker: string | null; heading: string | null; headingSecond: string | null;
  index: RawParagraph[] | null; body: RawParagraph[] | null; closingLine: string | null;
  imageOne: StrapiFile | null; imageOneAlt: string | null;
  imageTwo: StrapiFile | null; imageTwoAlt: string | null;
  imageThree: StrapiFile | null; imageThreeAlt: string | null;
}

interface RawPage {
  sectionOne: Record<string, unknown> | null;
  sectionTwo: RawMarkedList | null;
  sectionThree: RawMarkedList | null;
  sectionFour: RawCollage | null;
}

/** A statement section that also credits the person in its photograph. */
export interface CreditedStatement extends Statement {
  caption: string; captionSecond: string;
}

export interface MarkedList {
  kicker: string; heading: string; headingSecond: string; headingEm: string;
  body: string[];
  /** `mark` is a key into the site's own symbol set. */
  marks: Array<{ label: string; mark: string }>;
  imageOne: StrapiFile | null; imageOneAlt: string;
  imageTwo: StrapiFile | null; imageTwoAlt: string;
}

export interface CreateCollage {
  kicker: string; heading: string; headingSecond: string;
  index: string[]; body: string[]; closingLine: string;
  imageOne: StrapiFile | null; imageOneAlt: string;
  imageTwo: StrapiFile | null; imageTwoAlt: string;
  imageThree: StrapiFile | null; imageThreeAlt: string;
}

export interface CriticalThinking {
  one: CreditedStatement; two: MarkedList; three: MarkedList; four: CreateCollage;
}

export async function getCriticalThinking(): Promise<CriticalThinking> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<RawPage>('/api/critical-thinking-page', { populate: CRITICAL_THINKING_POPULATE }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);
  const texts = (list: RawParagraph[] | null | undefined) =>
    (list ?? []).map((p) => t(p.text)).filter(Boolean);

  /** An empty author means the Principal, as it does on every philosophy page. */
  const who = (v: unknown) => t(v) || school.principal || '';

  const marked = (s: RawMarkedList | null | undefined): MarkedList => ({
    kicker: t(s?.kicker), heading: t(s?.heading),
    headingSecond: t(s?.headingSecond), headingEm: t(s?.headingEm),
    body: texts(s?.body),
    marks: (s?.marks ?? []).map((m) => ({ label: t(m.label), mark: m.mark ?? 'bulb' })),
    imageOne: s?.imageOne ?? null, imageOneAlt: t(s?.imageOneAlt),
    imageTwo: s?.imageTwo ?? null, imageTwoAlt: t(s?.imageTwoAlt),
  });

  const one = (raw?.sectionOne ?? {}) as Record<string, any>;
  const four = raw?.sectionFour;

  return {
    one: {
      kicker: t(one.kicker), heading: t(one.heading), headingEm: t(one.headingEm),
      quote: t(one.quote), quoteAuthor: who(one.quoteAuthor),
      body: texts(one.body),
      caption: t(one.caption), captionSecond: t(one.captionSecond),
      image: one.image ?? null, imageAlt: t(one.imageAlt),
    },
    two: marked(raw?.sectionTwo),
    three: marked(raw?.sectionThree),
    four: {
      kicker: t(four?.kicker), heading: t(four?.heading), headingSecond: t(four?.headingSecond),
      index: texts(four?.index), body: texts(four?.body), closingLine: t(four?.closingLine),
      imageOne: four?.imageOne ?? null, imageOneAlt: t(four?.imageOneAlt),
      imageTwo: four?.imageTwo ?? null, imageTwoAlt: t(four?.imageTwoAlt),
      imageThree: four?.imageThree ?? null, imageThreeAlt: t(four?.imageThreeAlt),
    },
  };
}
