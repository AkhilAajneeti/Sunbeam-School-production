/**
 * CAREER PAGE CONTROLLER — the default core controller, unmodified.
 *
 * Reads go straight through Strapi's own find. There is no custom logic here on
 * purpose: shaping belongs in the Astro side's cms layer, where the site's own
 * rules live, and duplicating it here would give two places to change one
 * behaviour.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::career-page.career-page');
