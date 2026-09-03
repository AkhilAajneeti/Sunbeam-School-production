/**
 * Default core router. The site reads with a read-only token.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::calendar-document.calendar-document');
