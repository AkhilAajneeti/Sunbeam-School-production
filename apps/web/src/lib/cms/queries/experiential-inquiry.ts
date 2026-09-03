/**
 * THE EXPERIENTIAL & INQUIRY-BASED LEARNING PAGE — four named sections.
 *
 * ⚠ TWO OF THE FOUR SHAPES ARE SHARED, so their types are imported rather than
 * restated: the opening is the same pair Teaching Philosophy opens 02 with, and
 * the close is the same close every philosophy page ends on. Only the path and
 * the collage-with-a-list are particular to this page, and both are particular
 * because the page genuinely draws something no other page draws.
 *
 * The page still owns the design. Nothing here carries an arrow, a delay, a
 * ground colour or a stagger.
 */
import { cmsFetchOne } from '../client';
import { EXPERIENTIAL_POPULATE } from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile } from '../types';
import type { Pair, Close } from './teaching-philosophy';

interface RawParagraph { text: string | null }
interface RawDetail { label: string | null; value: string | null }

interface RawStep {
  label: string | null; body: string | null;
  photo: StrapiFile | null; photoAlt: string | null; icon: StrapiFile | null;
}

interface RawSteps {
  kicker: string | null;
  headingWords: RawParagraph[] | null;
  steps: RawStep[] | null;
}

interface RawListing {
  kicker: string | null; heading: string | null; headingEm: string | null;
  body: RawParagraph[] | null; entries: RawDetail[] | null;
  imageOne: StrapiFile | null; imageOneAlt: string | null;
  imageTwo: StrapiFile | null; imageTwoAlt: string | null;
  imageThree: StrapiFile | null; imageThreeAlt: string | null;
}

interface RawPage {
  sectionOne: Record<string, unknown> | null;
  sectionTwo: RawSteps | null;
  sectionThree: RawListing | null;
  close: Record<string, unknown> | null;
}

export interface Step {
  label: string; body: string;
  photo: StrapiFile | null; photoAlt: string; icon: StrapiFile | null;
}

export interface Steps {
  kicker: string;
  /** One word per move. The page sets the arrows between them. */
  headingWords: string[];
  steps: Step[];
}

export interface Listing {
  kicker: string; heading: string; headingEm: string;
  body: string[]; entries: Array<{ label: string; value: string }>;
  imageOne: StrapiFile | null; imageOneAlt: string;
  imageTwo: StrapiFile | null; imageTwoAlt: string;
  imageThree: StrapiFile | null; imageThreeAlt: string;
}

export interface Experiential {
  one: Pair; two: Steps; three: Listing; close: Close;
}

export async function getExperientialInquiry(): Promise<Experiential> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<RawPage>('/api/experiential-inquiry-page', { populate: EXPERIENTIAL_POPULATE }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: unknown) => fillTokens(v as string | null | undefined, vars);
  const texts = (list: RawParagraph[] | null | undefined) =>
    (list ?? []).map((p) => t(p.text)).filter(Boolean);

  /** An empty author means the Principal, as it does on every philosophy page. */
  const who = (v: unknown) => t(v) || school.principal || '';

  const one = (raw?.sectionOne ?? {}) as Record<string, any>;
  const two = raw?.sectionTwo;
  const three = raw?.sectionThree;
  const c = (raw?.close ?? {}) as Record<string, any>;

  return {
    one: {
      kicker: t(one.kicker), heading: t(one.heading), headingEm: t(one.headingEm),
      quote: t(one.quote), quoteAuthor: who(one.quoteAuthor),
      body: texts(one.body),
      imageUpper: one.imageUpper ?? null, imageUpperAlt: t(one.imageUpperAlt),
      imageLower: one.imageLower ?? null, imageLowerAlt: t(one.imageLowerAlt),
    },
    two: {
      kicker: t(two?.kicker),
      headingWords: texts(two?.headingWords),
      steps: (two?.steps ?? []).map((s) => ({
        label: t(s.label), body: t(s.body),
        photo: s.photo ?? null, photoAlt: t(s.photoAlt), icon: s.icon ?? null,
      })),
    },
    three: {
      kicker: t(three?.kicker), heading: t(three?.heading), headingEm: t(three?.headingEm),
      body: texts(three?.body),
      entries: (three?.entries ?? []).map((e) => ({ label: t(e.label), value: t(e.value) })),
      imageOne: three?.imageOne ?? null, imageOneAlt: t(three?.imageOneAlt),
      imageTwo: three?.imageTwo ?? null, imageTwoAlt: t(three?.imageTwoAlt),
      imageThree: three?.imageThree ?? null, imageThreeAlt: t(three?.imageThreeAlt),
    },
    close: {
      headingLines: texts(c.headingLines),
      quote: t(c.quote), quoteAuthor: who(c.quoteAuthor),
      image: c.image ?? null, imageAlt: t(c.imageAlt),
    },
  };
}
