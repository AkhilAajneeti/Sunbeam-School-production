/**
 * Default core controller. Sorting and shaping live in the Astro cms layer
 * (apps/web/src/lib/cms/), not here — see the notice controller for why.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::credential.credential');
