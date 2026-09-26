/**
 * HOMEPAGE & ABOUT QUERIES (G6).
 *
 * ⚠ THE RETURNED SHAPES MIRROR data/home.ts. `getStory()` gives back the same
 * `{ eyebrow, paragraphs, checks, quote, … }` the components already
 * destructure, so Story.astro changes its import and one line of frontmatter
 * and nothing else — which is what keeps a migration this wide provable against
 * the live site.
 *
 * ⚠ TWO THINGS THE SOURCE HAD ARE NOT HERE, ON PURPOSE:
 *   · `voices.slots`  — how many empty card slots to lay out. Layout.
 *   · `vision.keys`   — the cipher animation's colour palette. Design.
 * Both stay in the components that use them.
 *
 * ⚠ ONE FETCH, NOT NINE. The homepage is a single Strapi record; every section
 * getter reads from the same in-flight promise rather than issuing its own
 * request, so eleven components on one page cost one round trip.
 */
import { cmsFetchAll, cmsFetchOne } from '../client';
import {
  HOMEPAGE_POPULATE, LEADER_MESSAGE_POPULATE,
  VISION_MISSION_POPULATE, HISTORY_PAGE_POPULATE,
} from '../populate';
import { fillTokens } from '../media';
import { getSchool } from './site';
import type { StrapiFile, PhotoComponent, PointItem } from '../types';

/* ── SHARED COMPONENT SHAPES ─────────────────────────────────────────────── */

interface RawParagraph { id: number; text: string }
interface RawFact { id: number; value: string }
interface RawFigure { id: number; figure: string; label: string; note: string | null }
interface RawLink { id: number; label: string; href: string; description: string | null; external: boolean }

const texts = (a: RawParagraph[] | null | undefined) => (a ?? []).map((p) => p.text);
const values = (a: RawFact[] | null | undefined) => (a ?? []).map((f) => f.value);
/** shared.photo[] → `{ image, alt, brief }`, brief being the caption the slot still owes. */
const photos = (a: PhotoComponent[] | null | undefined) =>
  (a ?? []).filter((p) => p.image).map((p) => ({ image: p.image, alt: p.alt, brief: p.caption ?? '' }));

/** shared.link → the `{ label, href, note }` the source used. */
export interface HomeLink { label: string; href: string; note: string | null; external: boolean }
const asLink = (l: RawLink | null | undefined): HomeLink | null =>
  l ? { label: l.label, href: l.href, note: l.description, external: l.external } : null;
const asLinks = (a: RawLink[] | null | undefined) => (a ?? []).map(asLink).filter(Boolean) as HomeLink[];

/** shared.point → `{ title, detail }`, the source's own field names. */
const asEvidence = (a: PointItem[] | null | undefined) =>
  (a ?? []).map((p) => ({ title: p.title, detail: p.body }));

/* ── THE HOMEPAGE RECORD ─────────────────────────────────────────────────── */

interface RawStage {
  id: number; range: string; name: string; badge: string | null;
  years: string | null; detail: string; href: string; imageBrief: string | null;
  photo: StrapiFile | null; photoAlt: string | null;
}
interface RawFacility {
  id: number; name: string; qualifier: string | null; detail: string | null;
  href: string | null; brief: string | null; shots: PhotoComponent[] | null;
}
interface RawVoice {
  id: number; quote: string; name: string; classOf: string | null; photo: StrapiFile | null;
}
interface RawSportCard {
  id: number; title: string; body: string; indoor: string | null;
  outdoor: string | null; href: string | null; brief: string | null;
  photo: StrapiFile | null; photoAlt: string | null;
}
interface RawStrand {
  id: number; title: string; body: string; href: string | null; brief: string | null;
  photo: StrapiFile | null; photoAlt: string | null;
}
interface RawEvent {
  id: number; title: string; caption: string | null; when: string | null;
  tag: string | null; alt: string | null; image: StrapiFile | null;
}
interface RawSlide {
  id: number; image: StrapiFile | null; alt: string; caption: string | null;
  brief: string | null; focalPoint: string | null;
  tone: 'ink' | 'charcoal' | 'maroon' | 'sand' | 'ivory' | null;
}
interface RawMark { id: number; name: string; note: string | null; logo: StrapiFile | null }

interface RawHomepage {
  heroEyebrow: string | null;
  heroTitle: string | null; heroDeck: string | null;
  heroActions: RawLink[] | null; heroStats: RawFigure[] | null;
  heroSlides: RawSlide[] | null;

  heritageFigure: string | null; heritageEyebrow: string | null;
  heritageHeading: string | null; heritageBody: string | null;

  storyEyebrow: string | null; storyHeading: string | null;
  storyParagraphs: RawParagraph[] | null; storyQuote: string | null;
  storyQuoteAttribution: string | null; storyChecks: RawFact[] | null;
  storyStat: RawFigure | null; storyBentoLabel: string | null;
  storyCta: RawLink | null; storyLinks: RawLink[] | null;
  storyPhotos: PhotoComponent[] | null;

  stagesPill: string | null; stagesHeading: string | null;
  stagesTagline: string | null; stages: RawStage[] | null;

  learningEyebrow: string | null; learningHeading: string | null;
  learningParagraphs: RawParagraph[] | null; learningEvidence: PointItem[] | null;
  learningLink: RawLink | null; learningImageBrief: string | null;
  learningPhoto: PhotoComponent | null;

  campusEyebrow: string | null; campusHeading: string | null; campusSub: string | null;
  facilities: RawFacility[] | null;

  voicesEyebrow: string | null; voicesHeading: string | null; voicesDeck: string | null;
  voicesPending: boolean; voicesItems: RawVoice[] | null;

  beyondEyebrow: string | null; beyondHeading: string | null; beyondDeck: string | null;
  beyondSport: RawSportCard | null; beyondStrands: RawStrand[] | null; beyondLinks: RawLink[] | null;

  principalCta: RawLink | null;
  eventsPill: string | null; eventsHeading: string | null; eventsSub: string | null;
  events: RawEvent[] | null;

  affiliationsHeading: string | null; affiliations: RawMark[] | null;

  achievementsPill: string | null; achievementsHeading: string | null;
  achievementsSub: string | null;
  achievementsLead: RawFigure | null; achievementsLeadCta: RawLink | null;
  achievementsHonoursHead: string | null; achievementsPhotos: PhotoComponent[] | null;
  achievementsInstitutional: PointItem[] | null; achievementsStudent: RawFigure[] | null;
}

/**
 * ⚠ MEMOISED FOR THE LIFE OF THE BUILD. Eleven homepage components each ask for
 * their own slice; without this they would each fetch the whole record. The
 * promise is cached, not the value, so concurrent callers share one request
 * rather than racing to start several.
 */
let homepagePromise: Promise<RawHomepage | null> | null = null;

function homepage(): Promise<RawHomepage | null> {
  homepagePromise ??= cmsFetchOne<RawHomepage>('/api/homepage', { populate: HOMEPAGE_POPULATE });
  return homepagePromise;
}

/* ── SECTION GETTERS — one per component ─────────────────────────────────── */

/**
 * The homepage hero.
 *
 * ⚠ THE TOKENS ARE FILLED HERE, NOT STORED FILLED. The deck and the middle stat
 * card both print the school roll, which Site Settings owns; `{currentStrength}`
 * is substituted at build time so the two can never disagree.
 *
 * ⚠⚠ THE MOTTO IS NO LONGER THE EYEBROW. It used to be the line above the
 * <h1>; the client asked for it below the deck instead, with a plain welcome
 * line above the headline. So there are now two fields where there was one, and
 * they come from different places on purpose:
 *
 *   eyebrow  — homepage.heroEyebrow, because it is homepage copy and nothing
 *              else on the site says it
 *   tagline  — school.motto, because the footer and the About pages print the
 *              same three words and a second copy is a second thing to forget
 *
 * ⚠ THE MOTTO IS READ OFF THE CREST RING on the official logo artwork. Text
 * extraction never surfaced it — it exists only in the emblem — so if Site
 * Settings is ever reseeded from scraped copy, this line is the one that
 * quietly goes missing.
 */
export async function getHero() {
  const [h, school] = await Promise.all([homepage(), getSchool()]);
  const vars = {
    currentStrength: school?.currentStrength,
    principal: school?.principal,
    schoolName: school?.name,
  };
  return {
    eyebrow: h?.heroEyebrow ?? '',
    tagline: school?.motto ?? '',
    title: fillTokens(h?.heroTitle, vars),
    deck: fillTokens(h?.heroDeck, vars),
    actions: asLinks(h?.heroActions),
    stats: (h?.heroStats ?? []).map((f) => ({
      value: fillTokens(f.figure, vars), label: f.label, note: f.note,
    })),
    /**
     * ⚠ THESE ARE THE PHOTOGRAPH SLIDES ONLY. The hero also opens with two
     * drone films, and those are NOT in here — Hero.astro owns them, because
     * their sources are fixed build artefacts in public/video/ rather than
     * anything an editor picks. See the FILMS note in that file.
     */
    slides: (h?.heroSlides ?? []).map((s) => ({
      image: s.image ?? null, alt: s.alt, caption: s.caption,
      brief: s.brief ?? '', position: s.focalPoint ?? '50% 50%',
      tone: s.tone ?? 'charcoal',
    })),
  };
}

/** ProofStrip — the figure, eyebrow, heading and body of the heritage lede. */
export async function getHeritageLede() {
  const h = await homepage();
  return {
    figure: h?.heritageFigure ?? '',
    eyebrow: h?.heritageEyebrow ?? '',
    heading: h?.heritageHeading ?? '',
    body: h?.heritageBody ?? '',
  };
}

export async function getStory() {
  const h = await homepage();
  return {
    eyebrow: h?.storyEyebrow ?? '',
    heading: h?.storyHeading ?? '',
    paragraphs: texts(h?.storyParagraphs),
    quote: h?.storyQuote ?? '',
    quoteAttribution: h?.storyQuoteAttribution ?? '',
    checks: values(h?.storyChecks),
    /* ⚠ `{ value, title, detail }`, NOT shared.figure's own field names. The
       component prints story.stat.value; renaming it here would have meant
       editing markup that has nothing to do with this migration. */
    stat: {
      value: h?.storyStat?.figure ?? '',
      title: h?.storyStat?.label ?? '',
      detail: h?.storyStat?.note ?? '',
    },
    bentoLabel: h?.storyBentoLabel ?? '',
    cta: asLink(h?.storyCta) ?? { label: '', href: '#', note: null, external: false },
    links: asLinks(h?.storyLinks),
    /* ⚠ [primary, inset] BY POSITION. Which tile is wide and which is square
       is layout; the photographs and their briefs are content. */
    photos: photos(h?.storyPhotos),
  };
}

export async function getStages() {
  const h = await homepage();
  return {
    pill: h?.stagesPill ?? '',
    heading: h?.stagesHeading ?? '',
    tagline: h?.stagesTagline ?? '',
    stages: (h?.stages ?? []).map(({ range, name, badge, years, detail, href, imageBrief, photo, photoAlt }) =>
      ({ range, name, badge, years, detail, href, imageBrief, photo: photo ?? null, photoAlt })),
  };
}

export async function getLearning() {
  const h = await homepage();
  return {
    eyebrow: h?.learningEyebrow ?? '',
    heading: h?.learningHeading ?? '',
    paragraphs: texts(h?.learningParagraphs),
    evidence: asEvidence(h?.learningEvidence),
    link: asLink(h?.learningLink) ?? { label: '', href: '#', note: null, external: false },
    imageBrief: h?.learningImageBrief ?? '',
    photo: h?.learningPhoto?.image ?? null,
    photoAlt: h?.learningPhoto?.alt ?? '',
  };
}

export interface HomeFacility {
  name: string; qualifier: string | null; detail: string | null;
  href: string | null; brief: string | null;
  /** ⚠ CMS FILES NOW, not imported ImageMetadata — the panel uses CmsImage. */
  shots: Array<{ image: StrapiFile; alt: string }>;
}

export async function getCampus(): Promise<{
  eyebrow: string; heading: string; sub: string; facilities: HomeFacility[];
}> {
  const h = await homepage();
  return {
    eyebrow: h?.campusEyebrow ?? '',
    heading: h?.campusHeading ?? '',
    sub: h?.campusSub ?? '',
    facilities: (h?.facilities ?? []).map((f) => ({
      name: f.name, qualifier: f.qualifier, detail: f.detail,
      href: f.href, brief: f.brief,
      shots: (f.shots ?? []).filter((s) => s.image).map((s) => ({ image: s.image, alt: s.alt })),
    })),
  };
}

export async function getVoices() {
  const h = await homepage();
  return {
    eyebrow: h?.voicesEyebrow ?? '',
    heading: h?.voicesHeading ?? '',
    deck: h?.voicesDeck ?? '',
    pending: h?.voicesPending ?? true,
    items: (h?.voicesItems ?? []).map(({ quote, name, classOf, photo }) =>
      ({ quote, name, classOf, photo })),
  };
}

export async function getBeyond() {
  const h = await homepage();
  const s = h?.beyondSport;
  return {
    eyebrow: h?.beyondEyebrow ?? '',
    heading: h?.beyondHeading ?? '',
    deck: h?.beyondDeck ?? '',
    sport: {
      title: s?.title ?? '', body: s?.body ?? '',
      indoor: s?.indoor ?? '', outdoor: s?.outdoor ?? '',
      href: s?.href ?? '#', brief: s?.brief ?? '',
      photo: s?.photo ?? null, photoAlt: s?.photoAlt ?? '',
    },
    strands: (h?.beyondStrands ?? []).map(({ title, body, href, brief, photo, photoAlt }) =>
      ({ title, body, href, brief, photo: photo ?? null, photoAlt: photoAlt ?? '' })),
    links: asLinks(h?.beyondLinks),
  };
}

/**
 * The homepage Principal panel. ⚠ EVERY WORD OF IT COMES FROM THE PRINCIPAL'S
 * LEADER MESSAGE — the same record /about/principals-message/ renders. The panel
 * repeated the quote, both paragraphs, the portrait and the signature as
 * literals, so the school could correct one and not the other. Only the link out
 * belongs to the homepage.
 */
export async function getPrincipalSpeak() {
  const [h, leader] = await Promise.all([homepage(), getLeaderMessage('principal')]);
  return {
    leader,
    cta: asLink(h?.principalCta) ?? { label: '', href: '#', note: null, external: false },
  };
}

export async function getHomeEvents() {
  const h = await homepage();
  return {
    pill: h?.eventsPill ?? '',
    heading: h?.eventsHeading ?? '',
    sub: h?.eventsSub ?? '',
    events: (h?.events ?? []).map(({ title, caption, when, tag, alt, image }) =>
      ({ title, caption, when, tag, alt, image })),
  };
}

export async function getAffiliations() {
  const h = await homepage();
  return {
    heading: h?.affiliationsHeading ?? '',
    partners: (h?.affiliations ?? []).map(({ name, note, logo }) => ({ name, note, logo })),
  };
}

export async function getHomeAchievements() {
  const h = await homepage();
  return {
    pill: h?.achievementsPill ?? '',
    heading: h?.achievementsHeading ?? '',
    sub: h?.achievementsSub ?? '',
    lead: {
      value: h?.achievementsLead?.figure ?? '',
      title: h?.achievementsLead?.label ?? '',
      detail: h?.achievementsLead?.note ?? '',
    },
    leadCta: asLink(h?.achievementsLeadCta) ?? { label: '', href: '#', note: null, external: false },
    honoursHead: h?.achievementsHonoursHead ?? '',
    photos: photos(h?.achievementsPhotos),
    institutional: asEvidence(h?.achievementsInstitutional),
    student: (h?.achievementsStudent ?? []).map((f) =>
      ({ value: f.figure, label: f.label, detail: f.note })),
  };
}

/* ── ABOUT ───────────────────────────────────────────────────────────────── */

/** ⚠ 'vice-principal' IS IN THIS UNION. The VP page passes it, and tsc does not
    read .astro files — so a role missing here fails silently at runtime, not in
    a typecheck. */
export type LeaderRole = 'director' | 'principal' | 'vice-principal';

export interface LeaderMessage {
  role: LeaderRole;
  name: string; roleLabel: string | null;
  eyebrow: string | null; heading: string | null; pullQuote: string | null;
  /** The homepage extract. */
  paragraphs: string[];
  /** The whole signed message, where the school has supplied it. */
  fullMessage: string[];
  credentials: string[];
  portrait: StrapiFile | null; portraitAlt: string | null;
  portraitBrief: string | null; pending: string | null;
}
interface RawLeader extends Omit<LeaderMessage, 'paragraphs' | 'fullMessage' | 'credentials'> {
  slug: string;
  paragraphs: RawParagraph[] | null;
  fullMessage: RawParagraph[] | null;
  credentials: RawFact[] | null;
}

/** One record, by role — the Director's and the Principal's pages take one each. */
export async function getLeaderMessage(role: LeaderRole): Promise<LeaderMessage | null> {
  const all = await cmsFetchAll<RawLeader>('/api/leader-messages', {
    populate: LEADER_MESSAGE_POPULATE, filters: { role: { $eq: role } },
  });
  const l = all[0];
  if (!l) return null;
  return {
    role: l.role, name: l.name, roleLabel: l.roleLabel,
    eyebrow: l.eyebrow, heading: l.heading, pullQuote: l.pullQuote,
    paragraphs: texts(l.paragraphs), fullMessage: texts(l.fullMessage),
    credentials: values(l.credentials),
    portrait: l.portrait ?? null, portraitAlt: l.portraitAlt,
    portraitBrief: l.portraitBrief, pending: l.pending,
  };
}

interface RawVmSection {
  key: string | null;
  eyebrow: string | null;
  heading: string | null;
  body: RawParagraph[] | null;
  points: { title: string | null; body: string | null }[] | null;
}
interface RawVisionMission {
  cipher: RawParagraph[] | null;
  greeting: RawParagraph[] | null;
  sections: RawVmSection[] | null;
}

/** One block of the page, looked up by the key the page asks for. */
export interface VmSection {
  eyebrow: string;
  heading: string;
  body: string[];
  points: { title: string; body: string }[];
}

export async function getVisionMission() {
  const v = await cmsFetchOne<RawVisionMission>('/api/vision-mission-page', {
    populate: VISION_MISSION_POPULATE,
  });

  const byKey = new Map<string, VmSection>();
  for (const s of v?.sections ?? []) {
    if (!s.key) continue;
    byKey.set(s.key, {
      eyebrow: s.eyebrow ?? '',
      heading: s.heading ?? '',
      body: texts(s.body),
      /* ⚠ A COLOUR WITH NO NAME IS DROPPED. The name is what the stylesheet
         keys its palette off, so an unnamed one would render uncoloured. */
      points: (s.points ?? [])
        .filter((p) => p.title?.trim())
        .map((p) => ({ title: p.title!.trim(), body: p.body ?? '' })),
    });
  }

  /* ⚠ A MISSING BLOCK IS EMPTY, NOT UNDEFINED. The page reads
     `section('vision').body[0]`; an absent key would throw and take the whole
     page down rather than leaving one band blank. */
  const empty: VmSection = { eyebrow: '', heading: '', body: [], points: [] };
  const section = (key: string): VmSection => byKey.get(key) ?? empty;

  return { cipher: texts(v?.cipher), greeting: texts(v?.greeting), section };
}

export interface HistoryVoice {
  name: string; role: string | null; alt: string | null;
  portrait: StrapiFile | null; paragraphs: string[];
}
interface RawHistoryVoice extends Omit<HistoryVoice, 'paragraphs'> {
  id: number; paragraphs: RawParagraph[] | null;
}
interface RawHistoryPage {
  history: RawParagraph[] | null; facts: PointItem[] | null;
  voices: RawHistoryVoice[] | null; onward: RawLink[] | null;
}

export async function getHistoryPage() {
  const h = await cmsFetchOne<RawHistoryPage>('/api/history-page', {
    populate: HISTORY_PAGE_POPULATE,
  });
  return {
    history: texts(h?.history),
    /* ⚠ `{ label, value }` — the plate's own field names. Stored as
       shared.point because two of the three values are full sentences. */
    facts: (h?.facts ?? []).map((f) => ({ label: f.title, value: f.body })),
    voices: (h?.voices ?? []).map((v) => ({
      name: v.name, role: v.role, alt: v.alt,
      portrait: v.portrait ?? null, paragraphs: texts(v.paragraphs),
    })),
    onward: asLinks(h?.onward),
  };
}
