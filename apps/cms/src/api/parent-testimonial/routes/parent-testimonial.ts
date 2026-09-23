/**
 * PARENT TESTIMONIAL ROUTES — the default core router, read-only to the world.
 *
 * The site reads these with the build's read-only API token; nothing outside
 * the admin writes them. Contrast parent-feedback, which accepts a public POST
 * and therefore declares its one route by hand.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::parent-testimonial.parent-testimonial');
