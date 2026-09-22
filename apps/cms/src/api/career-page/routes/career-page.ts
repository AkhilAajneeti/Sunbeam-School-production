/**
 * CAREER PAGE ROUTES — the default core router.
 *
 * Gives GET /api/career-page. Read-only as far as the site is concerned: the
 * Astro build authenticates with the read-only API token, which cannot write
 * regardless of what the routes allow.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::career-page.career-page');
