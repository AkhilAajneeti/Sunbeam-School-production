/**
 * Default core service. Seeds use the Document Service directly.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::news-category-page.news-category-page');
