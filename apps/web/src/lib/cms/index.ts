/**
 * THE CMS LAYER'S FRONT DOOR.
 *
 * Pages and components import from here — `~/lib/cms` — and never from the
 * files beneath it. That keeps the internal shape free to change: splitting a
 * query module, renaming a populate spec or swapping the fetch implementation
 * stays invisible to the 174 routes above.
 *
 * ⚠ EVERYTHING HERE RUNS AT BUILD TIME, IN ASTRO FRONTMATTER. None of it may be
 * called from a client-side <script>: it reads STRAPI_TOKEN, and a token that
 * reaches the browser is a token that has leaked. See ./config.ts.
 */

/* Connection and failure modes */
export { STRAPI_URL, CMS_TIMEOUT_MS, assertCmsConfigured } from './config';
export { CmsError, cmsFetch, cmsFetchAll, cmsFetchOne, clearCmsCache } from './client';

/* Media helpers — used by CmsImage.astro and by anything linking a full-size file */
export { mediaUrl, fileUrl, srcSet, formatsOf, formatAtLeast, dimensions, plainHeading, fillTokens } from './media';

/* Shapes */
export type {
  StrapiFile,
  StrapiFormat,
  StrapiDocument,
  StrapiListResponse,
  StrapiSingleResponse,
  Notice,
  Major,
  Credential,
  AchievementRecord,
  PhotoComponent,
  PointItem,
  StatItem,
  SeoComponent,
  JobPosting,
  Alumnus,
  AlumniMeet,
  AlumniStory,
  CalendarDocument,
  AcademicCalendarPage,
} from './types';

/* Content — notices */
export {
  getNotices,
  getNoticesPageData,
  selectFeatured,
  selectYears,
  noticeSource,
} from './queries/notices';

/* Content — achievements */
export {
  getMajors,
  getCredentials,
  getAchievementRecords,
  getAchievementsBands,
  getRecordBoards,
} from './queries/achievements';

/* Content — career */
export { getJobPostings, getCareerPageData, getCareerCopy } from './queries/career';
export { getPublicationsData } from './queries/publications';
export { getUniformedGroups } from './queries/uniformedGroups';
export { getClassTimetable } from './queries/classTimetable';
export { getClassCorner } from './queries/classCorner';
export { getParentTestimonials } from './queries/parentTestimonials';
export type { Publication, PublicationGroup } from './queries/publications';

/* Content — alumni */
export {
  getAlumni,
  getAlumniMeets,
  getAlumniStories,
  getAlumniPageData,
} from './queries/alumni';

/* Content — academic calendar */
export {
  getCalendars,
  getAcademicCalendarPage,
  getAcademicCalendarPageData,
} from './queries/calendar';

/* Content — global site settings */
export { getSiteSettings, getSchool } from './queries/site';
export { getTeachingPhilosophy } from './queries/teaching-philosophy';
export { getStudentCentredLearning } from './queries/student-centred-learning';
export type { StudentCentred, Collage } from './queries/student-centred-learning';
export type { TeachingPhilosophy, Statement, Pair, Constellation, Close, Ability } from './queries/teaching-philosophy';
export {
  getPrePrimary, getPrimaryStage, getMiddleSchool, getSecondaryStage, getSeniorSecondary,
} from './queries/structure';
export { getStreamsOffered, getSubjectCombinations } from './queries/structure';
export {
  getMethodology, getSmartClassrooms, getExperientialLearning,
  getStemRobotics, getReadingLanguage, getLaboratoriesClubs,
} from './queries/structure';
export {
  getAssessment, getHomeworkPolicy, getRemedialSupport,
  getMentoring, getParentTeacher, getCompetitiveExam,
} from './queries/structure';
export type { Band, Cell, Shot, Stream } from './queries/structure';
export { getCurriculum } from './queries/curriculum';
export type { Curriculum, Stage, ClassDoc, Tile, TileSection, Lede } from './queries/curriculum';
export { getCriticalThinking } from './queries/critical-thinking';
export type { CriticalThinking, MarkedList, CreditedStatement, CreateCollage } from './queries/critical-thinking';
export { getExperientialInquiry } from './queries/experiential-inquiry';
export type { Experiential, Steps, Step, Listing } from './queries/experiential-inquiry';
export type { School, QuickAccessItem } from './queries/site';

/* Content — route metadata */
export { getPageMeta, composeTitle, normaliseRoute } from './queries/pageMeta';
export type { PageMeta } from './queries/pageMeta';

/* Content — news */
export {
  getChroniclePage,
  photosOf,
  faceOf,
  photoAlt,
} from './queries/news';
export type { ChroniclePage, ChronicleGroup, ChronicleItem, NewsCategory } from './queries/news';

/* Content — campus, facilities, transport */
export {
  getBusRoutes,
  getTransportData,
  transportCountsSentence,
  getFacilitiesData,
  getCampusTourData,
  getCampusSafetyData,
} from './queries/campus';
export type { RouteRun, FacilityItem, CampusFacility } from './queries/campus';

/* Content — sports, excursions, school activities */
export {
  getSportFacilities, getGames, getSportsRecord, getSportsPage,
  getExcursionSections, getExpeditions, getActivitiesData, PER_PAGE,
} from './queries/sports';
export type {
  SportFacility, Game, Podium, RecordBlock, ExcursionSection, Expedition,
} from './queries/sports';

/* Content — homepage & about */
export {
  getHero, getHeritageLede, getStory, getStages, getLearning, getCampus, getVoices,
  getBeyond, getHomeEvents, getAffiliations, getHomeAchievements,
  getPrincipalSpeak, getLeaderMessage, getVisionMission, getHistoryPage,
} from './queries/home';
export type { HomeLink, HomeFacility, LeaderMessage, HistoryVoice } from './queries/home';

/* Content — disclosure, uniform, services, contact */
export {
  getDisclosure, getTeachers, designationsOf, siteTokens,
  getUniform, getResultPage, getTcPage, getContactPage,
} from './queries/pages';
export type { Teacher, DetailRow, DocCard, PointRow } from './queries/pages';

/* Content — academics */
export { getAcademicTopics, getAcademicTopic, getAcademicGroup } from './queries/academics';
export type { AcademicTopic, Section, Point, Detail, Shot, Stream } from './queries/academics';

/* Content — the two councils (student, and the advisory board on /about/) */
export {
  getStudentCouncil,
  getAdvisoryCouncil,
} from './queries/councils';
export type {
  House,
  CouncilPost,
  CouncilBody,
  StudentCouncil,
  Advisor,
  AdvisoryCouncil,
} from './queries/councils';

/* Content — the two academic excellence boards on /academics/class-corner/ */
export { getToppers } from './queries/toppers';
export type { TopperRow, Boards } from './queries/toppers';
