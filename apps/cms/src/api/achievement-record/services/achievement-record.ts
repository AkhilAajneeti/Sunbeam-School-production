/**
 * Default core service. The seed uses the Document Service directly.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::achievement-record.achievement-record');
