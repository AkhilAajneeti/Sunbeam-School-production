/**
 * NOTICE CONTROLLER — the default core controller, unmodified.
 *
 * Reads go straight through Strapi's own find/findOne. There is no custom
 * logic here on purpose: sorting and shaping belong in the Astro side's
 * cms layer (apps/web/src/lib/cms/), where the site's own rules live, and
 * duplicating them here would give two places to change one behaviour.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notice.notice');
