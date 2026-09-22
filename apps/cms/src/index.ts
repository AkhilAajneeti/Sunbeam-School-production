import type { Core } from '@strapi/strapi';

/**
 * The only public WRITE actions this CMS has: the two form endpoints.
 *
 * ⚠⚠ ADD TO THIS LIST ONLY AFTER READING src/utils/public-form. An entry here
 * opens a POST endpoint to the entire internet. Both of these are create-only
 * routes with a honeypot, a per-IP rate limit and a field whitelist; a content
 * type without all three does not belong in this array.
 *
 * ⚠ THESE ARE `.create` ACTIONS, NEVER `.find`. Granting find on either would
 * publish every name, phone number and message the school has been sent.
 */
const PUBLIC_ACTIONS = [
  'api::contact-enquiry.contact-enquiry.create',
  'api::parent-feedback.parent-feedback.create',
];

/**
 * ⚠⚠ GRANTED IN CODE, NOT BY TICKING A BOX IN THE ADMIN UI.
 *
 * Settings → Roles → Public → … → create is a checkbox that lives only in the
 * database. It therefore does not survive a fresh clone, a new environment, or
 * a restore from a dump taken before it was ticked — and when it is missing the
 * only symptom is a form failing with a 403 that nobody sees until a parent
 * telephones to say the form is broken.
 *
 * Doing it here makes "the forms work" a property of the repository.
 *
 * ⚠ IT GRANTS, AND NEVER REVOKES. An action already enabled is a no-op; if
 * someone deliberately enabled something else, nothing here takes it away. This
 * function only ever adds the actions listed above.
 */
async function grantPublicFormActions(strapi: Core.Strapi) {
  try {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      strapi.log.warn('[public-forms] no Public role found — permissions not granted.');
      return;
    }

    for (const action of PUBLIC_ACTIONS) {
      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: { action, role: publicRole.id },
      });
      if (existing) continue;

      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
      strapi.log.info(`[public-forms] granted ${action} on the Public role.`);
    }
  } catch (err) {
    /* ⚠ NEVER FATAL. A permissions hiccup must not stop Strapi booting — the
       rest of the site's content would go down with it, which is far worse than
       a form returning 403 until this is looked at. */
    strapi.log.error(`[public-forms] could not grant the public permissions: ${err}`);
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicFormActions(strapi);
  },
};
