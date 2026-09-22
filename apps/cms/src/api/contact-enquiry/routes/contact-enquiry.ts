/**
 * CONTACT ENQUIRY ROUTES — one route, and only one.
 *
 * ⚠⚠ THIS IS DELIBERATELY *NOT* `factories.createCoreRouter`. The core router
 * would generate find, findOne, update and delete alongside create. Those are
 * gated by the Public role's permissions, but that is a single checkbox between
 * the open internet and every name, email and phone number the school has ever
 * been sent — and it is a checkbox in a UI that anyone with admin access can
 * tick by accident.
 *
 * Declaring the routes by hand means the read endpoints DO NOT EXIST. A GET to
 * /api/contact-enquiries is a 404 no matter how the permissions are configured.
 * That is defence in depth: the permission is still scoped to create only (see
 * src/index.ts), and this is the second lock.
 *
 * ⚠ THE ADMIN PANEL IS UNAFFECTED. Editors read enquiries through Strapi's
 * Content Manager, which uses the /content-manager admin API and its own
 * authentication — not these public REST routes. Removing them costs the office
 * nothing.
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-enquiries',
      handler: 'contact-enquiry.create',
      config: {
        /* The Public role still has to be granted this action — the route
           existing is not the same as it being open. See src/index.ts. */
        policies: [],
        middlewares: [],
      },
    },
  ],
};
