/**
 * ALUMNI REGISTRATION SERVICE — the default core service, unmodified.
 *
 * The controller writes through `strapi.documents()` directly, because the
 * point of this endpoint is that it does not use the generic create path. This
 * file exists because Strapi expects a service beside every content type, and
 * the Content Manager uses it when an editor opens a registration in the admin.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::alumni-registration.alumni-registration');
