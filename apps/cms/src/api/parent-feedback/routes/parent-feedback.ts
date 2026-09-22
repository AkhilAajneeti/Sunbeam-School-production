/**
 * PARENT FEEDBACK ROUTES — one route, and only one.
 *
 * ⚠⚠ DELIBERATELY *NOT* `factories.createCoreRouter`. The core router would
 * generate find, findOne, update and delete alongside create. Those are gated
 * by the Public role's permissions — but that is a single checkbox between the
 * open internet and every parent's name, their child's name, their phone number
 * and whatever they took the trouble to write. It is a checkbox in a UI that
 * anyone with admin access can tick by accident.
 *
 * Declaring the routes by hand means the read endpoints DO NOT EXIST: a GET to
 * /api/parent-feedbacks is a 404 however the permissions are configured. The
 * permission is still scoped to create only (see src/index.ts); this is the
 * second lock.
 *
 * ⚠ THE ADMIN PANEL IS UNAFFECTED. The office reads feedback through Strapi's
 * Content Manager, which uses the /content-manager admin API and its own
 * authentication — not these public REST routes.
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/parent-feedbacks',
      handler: 'parent-feedback.create',
      config: { policies: [], middlewares: [] },
    },
  ],
};
