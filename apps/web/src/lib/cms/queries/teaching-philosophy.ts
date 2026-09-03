/**
 * THE TEACHING PHILOSOPHY PAGE — six named sections, in the page's own order.
 *
 * ═══ WHY THIS PAGE HAS ITS OWN QUERY ═══════════════════════════════════════
 *
 * Every other academics page reads a repeatable list of generic blocks through
 * `getAcademicTopic()`. That is right for forty-six bespoke designs and wrong for
 * the person editing them: the Content Manager showed a row called `abilities`
 * and nothing that said it was section 03 of this page.
 *
 * Here each section is a named field, so the editor reads
 * "03 — More Than One Way to Learn" and the page reads `tp.three`.
 *
 * ⚠ THE PAGE STILL OWNS THE DESIGN. Nothing here carries a position, a delay, a
 * radius or an order. The section order is the order of the fields, which is the
 * order of the markup, and neither can be changed from the admin.
 */
import { cmsFetchOne } from '../client';
import { TEACHING_PHILOSOPHY_POPULATE } from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import { siteTokens } from './pages';
import type { StrapiFile } from '../types';

interface RawParagraph { text: string | null }
interface RawAbility { label: string | null; icon: StrapiFile | null }

interface RawStatement {
  kicker: string | null; heading: string | null; headingEm: string | null;
  quote: string | null; quoteAuthor: string | null;
  body: RawParagraph[] | null;
  image: StrapiFile | null; imageAlt: string | null;
}

interface RawPair {
  kicker: string | null; heading: string | null;
  quote: string | null; quoteAuthor: string | null;
  body: RawParagraph[] | null;
  imageUpper: StrapiFile | null; imageUpperAlt: string | null;
  imageLower: StrapiFile | null; imageLowerAlt: string | null;
}

interface RawConstellation {
  kicker: string | null; heading: string | null;
  body: RawParagraph[] | null;
  image: StrapiFile | null; imageAlt: string | null;
  cards: RawAbility[] | null;
}

interface RawClose {
  headingLines: RawParagraph[] | null;
  quote: string | null; quoteAuthor: string | null;
  image: StrapiFile | null; imageAlt: string | null;
}

interface RawPage {
  sectionOne: RawStatement | null;
  sectionTwo: RawPair | null;
  sectionThree: RawConstellation | null;
  sectionFour: RawStatement | null;
  sectionFive: RawStatement | null;
  close: RawClose | null;
}

/* ── what the page reads ─────────────────────────────────────────────────── */

export interface Statement {
  kicker: string; heading: string; headingEm: string;
  quote: string; quoteAuthor: string;
  body: string[];
  image: StrapiFile | null; imageAlt: string;
}

export interface Pair {
  kicker: string; heading: string;
  quote: string; quoteAuthor: string;
  body: string[];
  imageUpper: StrapiFile | null; imageUpperAlt: string;
  imageLower: StrapiFile | null; imageLowerAlt: string;
}

export interface Ability { label: string; icon: StrapiFile | null }

export interface Constellation {
  kicker: string; heading: string;
  body: string[];
  image: StrapiFile | null; imageAlt: string;
  cards: Ability[];
}

export interface Close {
  /** One entry per line. The page draws the breaks and italicises the last. */
  headingLines: string[];
  quote: string; quoteAuthor: string;
  image: StrapiFile | null; imageAlt: string;
}

export interface TeachingPhilosophy {
  one: Statement; two: Pair; three: Constellation;
  four: Statement; five: Statement; close: Close;
}

const EMPTY_STATEMENT: Statement = {
  kicker: '', heading: '', headingEm: '', quote: '', quoteAuthor: '',
  body: [], image: null, imageAlt: '',
};

export async function getTeachingPhilosophy(): Promise<TeachingPhilosophy> {
  const [raw, school] = await Promise.all([
    cmsFetchOne<RawPage>('/api/teaching-philosophy-page', { populate: TEACHING_PHILOSOPHY_POPULATE }),
    getSchool(),
  ]);

  const vars = siteTokens(school);
  const t = (v: string | null | undefined) => fillTokens(v, vars);
  const texts = (list: RawParagraph[] | null | undefined) =>
    (list ?? []).map((p) => t(p.text)).filter(Boolean);

  /**
   * ⚠ AN EMPTY AUTHOR MEANS THE PRINCIPAL, NOT AN EMPTY LINE.
   * Every quotation on this page is the Principal's, and the name was written
   * into the markup four times. Leaving the field blank is the normal case; a
   * value is the exception, for a quotation that is somebody else's.
   */
  const who = (v: string | null | undefined) => t(v) || school.principal || '';

  const statement = (s: RawStatement | null): Statement => (s ? {
    kicker: t(s.kicker), heading: t(s.heading), headingEm: t(s.headingEm),
    quote: t(s.quote), quoteAuthor: who(s.quoteAuthor),
    body: texts(s.body), image: s.image ?? null, imageAlt: t(s.imageAlt),
  } : EMPTY_STATEMENT);

  return {
    one: statement(raw?.sectionOne ?? null),
    two: {
      kicker: t(raw?.sectionTwo?.kicker), heading: t(raw?.sectionTwo?.heading),
      quote: t(raw?.sectionTwo?.quote), quoteAuthor: who(raw?.sectionTwo?.quoteAuthor),
      body: texts(raw?.sectionTwo?.body),
      imageUpper: raw?.sectionTwo?.imageUpper ?? null, imageUpperAlt: t(raw?.sectionTwo?.imageUpperAlt),
      imageLower: raw?.sectionTwo?.imageLower ?? null, imageLowerAlt: t(raw?.sectionTwo?.imageLowerAlt),
    },
    three: {
      kicker: t(raw?.sectionThree?.kicker), heading: t(raw?.sectionThree?.heading),
      body: texts(raw?.sectionThree?.body),
      image: raw?.sectionThree?.image ?? null, imageAlt: t(raw?.sectionThree?.imageAlt),
      cards: (raw?.sectionThree?.cards ?? []).map((c) => ({
        label: t(c.label), icon: c.icon ?? null,
      })),
    },
    four: statement(raw?.sectionFour ?? null),
    five: statement(raw?.sectionFive ?? null),
    close: {
      headingLines: texts(raw?.close?.headingLines),
      quote: t(raw?.close?.quote), quoteAuthor: who(raw?.close?.quoteAuthor),
      image: raw?.close?.image ?? null, imageAlt: t(raw?.close?.imageAlt),
    },
  };
}
