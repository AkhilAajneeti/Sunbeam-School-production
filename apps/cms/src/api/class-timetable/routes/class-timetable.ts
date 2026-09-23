/**
 * CLASS TIMETABLE ROUTES — the default core router.
 *
 * ⚠ THIS ONE IS READ-ONLY TO THE WORLD, which is why it is unlike
 * contact-enquiry and alumni-registration. Those two accept a POST from
 * anybody and therefore declare their routes by hand so the read endpoints do
 * not exist at all. This content type is the opposite: the site READS it, and
 * nothing outside the admin ever writes it. The Public role is granted `find`
 * and `findOne` and nothing else — see src/index.ts.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::class-timetable.class-timetable');
