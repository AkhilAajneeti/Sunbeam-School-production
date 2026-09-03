/**
 * NOTICE SERVICE — the default core service.
 *
 * Present because Strapi's factory wiring expects it. The seed script uses
 * the Document Service API directly rather than going through here.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::notice.notice');
