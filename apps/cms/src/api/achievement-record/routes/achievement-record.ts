/**
 * Default core router. Read-only as far as the site is concerned: the Astro
 * build authenticates with a read-only token, which cannot write.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::achievement-record.achievement-record');
