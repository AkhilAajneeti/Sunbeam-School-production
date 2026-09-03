/**
 * Default core controller — shaping lives in the Astro cms layer.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::site-setting.site-setting');
