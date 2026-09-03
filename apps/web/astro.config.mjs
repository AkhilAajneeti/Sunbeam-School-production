import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sunbeam School Ballia — static-first.
// See docs/05-design-system.md → "Astro implementation notes".
// No SPA, no client router. Islands only where interaction demands it.
/** Live routes that are still placeholders — see the sitemap filter below. */
const PLACEHOLDER_ROUTES = new Set([
  '/about/',
  '/admissions/',
  '/admissions/campus-visit/',
  '/campus/classrooms/',
  '/campus/archery-range/',
  '/campus/library/',
  '/campus/laboratories/',
  '/campus/conference-room/',
  '/campus/auditorium/',
  '/campus/sports-facilities/',
]);

export default defineConfig({
  site: 'https://sunbeamballia.edu.in',
  output: 'static',
  compressHTML: true,

  /* ⚠ ONE CANONICAL URL FORM. Both /about and /about/ used to return 200 with
     no redirect, so analytics split every page across two URLs. 'always'
     matches the trailing-slash form every internal href in this project already
     uses, and every canonical tag already emitted. */
  trailingSlash: 'always',
  /* ⚠⚠ THE OTHER HALF OF THIS LIVES IN vercel.json, AND IT HAS TO. The setting
     above governs how THIS project builds and links; it cannot make the host
     redirect, so /about and /about/ would both still answer 200 with nothing
     between them and analytics would split every page across two URLs.
     vercel.json carries "trailingSlash": true to 301 the bare form.

     ⚠ AND vercel.json CANNOT BE COMMENTED. Vercel validates it against a strict
     schema that rejects unknown top-level keys — a "//" note in there fails the
     deploy outright with "should NOT have additional property". That is why the
     reasoning is here, in a file that is allowed to explain itself, and
     vercel.json holds two lines and nothing else. Do not add comments to it. */

  integrations: [
    sitemap({
      /* ⚠ THE NOT-YET-WRITTEN PAGES EXCLUDE THEMSELVES. [...slug].astro returns
         a real 200 for sections that have no content yet, so a sitemap would
         invite Google to index a placeholder. They already carry
         'noindex, follow'; this keeps them out of the sitemap to match.
         Written as a list rather than a pattern so that finishing a page means
         deleting one line here, and forgetting to is visible in review. */
      filter: (page) => !PLACEHOLDER_ROUTES.has(new URL(page).pathname),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // AVIF → WebP → JPEG handled per-<Picture>; sharp is the service.
    responsiveStyles: true,
  },
  /**
   * ⚠ RETIRED ROUTES FROM THE SECTION C SPLIT EXPERIMENT.
   *
   * Eleven standalone Teaching & Learning pages were built one-topic-per-URL.
   * That was an implementation experiment, not the information architecture:
   * the intended IA combines related topics into SIX visitor-facing pages, so
   * the site has fewer and richer pages rather than one URL per small topic.
   * The verified content from all eleven now lives in the six, and these
   * redirects carry any link that escaped — internal, external or indexed —
   * to the combined page that absorbed it.
   *
   * Under output: static these emit as meta-refresh pages, which is why they
   * are declared here rather than as .astro files that would need deleting
   * again later.
   */
  redirects: {
    /* ⚠ /campus/shooting-range/ WAS A PUBLISHED ADDRESS. The facility is the
       archery range and was renamed once the school confirmed it; this carries
       anything already pointing at the old path rather than breaking it. */
    '/campus/shooting-range': '/campus/archery-range/',
    /* The school publishes this page at /general-info/ and this project had it
       at /mandatory-public-disclosure/. The route moved to match theirs; this
       carries anything already pointing at the old path. */
    '/mandatory-public-disclosure': '/general-info/',
    // → Teaching Methodology
    '/academics/teaching-learning/collaborative-learning': '/academics/teaching-learning/methodology/',
    // → Smart Classrooms & Digital Literacy
    '/academics/teaching-learning/ai-digital-literacy': '/academics/teaching-learning/smart-classrooms/',
    // → Experiential & Project-Based Learning
    '/academics/teaching-learning/project-based-learning': '/academics/teaching-learning/experiential-learning/',
    // → STEM, Robotics & Enrichment
    '/academics/teaching-learning/stem-education': '/academics/teaching-learning/stem-robotics/',
    '/academics/teaching-learning/robotics-coding': '/academics/teaching-learning/stem-robotics/',
    '/academics/teaching-learning/mathematics-science-enrichment': '/academics/teaching-learning/stem-robotics/',
    // → Reading, Language & Library
    '/academics/teaching-learning/reading-programme': '/academics/teaching-learning/reading-language/',
    '/academics/teaching-learning/language-development': '/academics/teaching-learning/reading-language/',
    '/academics/teaching-learning/library-programme': '/academics/teaching-learning/reading-language/',
    // → Laboratories & Academic Clubs
    '/academics/teaching-learning/laboratories': '/academics/teaching-learning/laboratories-clubs/',
    '/academics/teaching-learning/academic-clubs': '/academics/teaching-learning/laboratories-clubs/',
  },

  devToolbar: {
    enabled: false,
  },
});
