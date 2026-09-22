import type { Core } from '@strapi/strapi';

/**
 * ⚠ CORS IS NAMED HERE ONLY BECAUSE THE CONTACT FORM POSTS FROM THE BROWSER.
 *
 * Every other request this CMS serves is made by the Astro build, server to
 * server, where CORS does not apply at all. The contact form is the one case
 * where a visitor's browser talks to Strapi directly, and the browser will
 * refuse that cross-origin POST unless the site's origin is on this list.
 *
 * ⚠⚠ THIS IS NOT A SPAM CONTROL, AND MUST NOT BE MISTAKEN FOR ONE. CORS is
 * enforced by browsers, so it stops another *website* using a visitor's browser
 * to post here — it does nothing whatsoever against curl or a script. The real
 * controls are the honeypot and the per-IP rate limit in
 * src/api/contact-enquiry/controllers/.
 *
 * ⚠ `CORS_ORIGINS` EXISTS FOR DEPLOY PREVIEWS. A Vercel preview lands on a
 * generated hostname that cannot be known in advance; add it there rather than
 * widening this list back to '*'.
 */
const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://sunbeamballia.edu.in',
        'https://www.sunbeamballia.edu.in',
        /* The Astro dev server and the local preview, so the form can be tested
           against a local Strapi without editing this file. */
        'http://localhost:4321',
        'http://localhost:4399',
        ...(process.env.CORS_ORIGINS ?? '')
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
      ],
      /* The form sends no cookies and no Authorization header — it is an
         anonymous POST — so credentialed requests stay off. */
      credentials: false,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
