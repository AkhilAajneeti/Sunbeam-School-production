import { factories } from '@strapi/strapi';

/**
 * CLASS CORNER DOCUMENT ROUTES — the default core router, read-only to the
 * world. The site reads these with the build's read-only API token; nothing
 * outside the admin writes them. See the class-timetable routes for the
 * contrast with the two endpoints that accept public POSTs.
 */
export default factories.createCoreRouter('api::class-corner-document.class-corner-document');
