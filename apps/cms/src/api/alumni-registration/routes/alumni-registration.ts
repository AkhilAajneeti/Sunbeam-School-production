/**
 * ALUMNI REGISTRATION ROUTES — one route, and only one.
 *
 * ⚠⚠ DELIBERATELY *NOT* `factories.createCoreRouter`, for the same reason
 * contact-enquiry is not — read that file's header. The core router would
 * generate find, findOne, update and delete beside create, and the only thing
 * standing between the open internet and every alumnus's name, email, mobile
 * and employer would be one checkbox in a UI anyone with admin access can tick
 * by accident.
 *
 * Declared by hand, the read endpoints DO NOT EXIST: a GET to
 * /api/alumni-registrations is a 404 however the permissions are set. The
 * admin panel is unaffected — the Content Manager reads through the
 * authenticated /content-manager API, not these public routes.
 */
export default {
  routes: [
    {
      method: 'POST',
      path: '/alumni-registrations',
      handler: 'alumni-registration.create',
      config: {
        /* The Public role still has to be granted this action — the route
           existing is not the same as it being open. See src/index.ts. */
        policies: [],
        middlewares: [],
      },
    },
  ],
};
