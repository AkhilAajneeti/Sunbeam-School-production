/**
 * ALUMNI REGISTRATION CONTROLLER — one of this CMS's public writes.
 *
 * Like contact-enquiry, this accepts a POST from anybody on the internet, so
 * it is written defensively and does not use the core `create`. The abuse
 * controls live in src/utils/public-form and are shared with the other two
 * forms; read that module's header before changing anything here. They were
 * once duplicated per form, and two copies of a defence drift until the
 * unfixed one becomes the way in.
 *
 * ═══ WHAT IT REFUSES TO TRUST ═══════════════════════════════════════════════
 *
 * ⚠⚠ 1. THE FIELD LIST IS A WHITELIST, NOT `ctx.request.body.data`. Handing
 * the request body to the generic create lets a caller set ANY column on the
 * row — `status: 'closed'` so the office never looks at it, or `officeNotes`
 * carrying text the staff will later read as a colleague's note.
 *
 * ⚠⚠ 2. `status` IS SET HERE, NOT ACCEPTED. Always 'new'.
 *
 * ⚠ 3. NO IP OR USER-AGENT IS STORED. The consent the alumnus ticks covers the
 * school contacting them; it does not cover keeping a log of their address.
 * The IP is used for the rate-limit window, in memory, and never written down.
 *
 * ⚠ 4. THE ROW IS NOT ECHOED BACK. The caller gets an acknowledgement and
 * nothing else — returning the record would confirm what was stored and hand
 * back any field the server added.
 */
import { factories } from '@strapi/strapi';
import {
  clean,
  clientIp,
  looksLikeEmail,
  payloadOf,
  rateLimited,
  trippedHoneypot,
} from '../../../utils/public-form';

const UID = 'api::alumni-registration.alumni-registration';

export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    const input = payloadOf(ctx.request.body);

    /* The honeypot — a silent success, so a bot learns nothing. See
       utils/public-form. */
    if (trippedHoneypot(input)) {
      /* ⚠ A DISCARDED SUBMISSION LEAVES A TRACE. Nothing is stored and the
         caller is told 200, but a false positive here means a real person's
         registration vanished with no error on their screen and no row in the
         CMS. That happened once on the contact form, when the trap was named
         after a field browsers autofill. This line is the only way anyone
         would find out. */
      strapi.log.warn(
        `[alumni-registration] discarded a submission: the honeypot was filled (from ${String(
          (input as Record<string, unknown>).email ?? 'no email',
        )})`,
      );
      ctx.status = 200;
      return { data: { ok: true } };
    }

    if (rateLimited('alumni-registration', clientIp(ctx))) {
      return ctx.tooManyRequests(
        'Too many registrations from this connection. Please try again shortly, or call the school office.',
      );
    }

    /* (1) The whitelist. The keys are the FORM's field names — see
       data/alumniRegistration.ts — and they are mapped by hand to the column
       names, because three of them differ deliberately: `year` is a poor
       column name on its own, `course` is the class the alumnus completed
       rather than a course, and the form's `consent` checkbox arrives as the
       string 'on' when a browser posts it. */
    const name = clean(input.name, 120);
    const email = clean(input.email, 200);
    const passingYear = clean(input.year, 10);
    const mobile = clean(input.mobile, 40);
    const consent =
      input.consent === true || input.consent === 'true' || input.consent === 'on';

    if (!name || !email || !passingYear || !mobile || !consent) {
      return ctx.badRequest(
        'Name, passing year, email, mobile and consent are required.',
      );
    }
    if (!looksLikeEmail(email)) {
      return ctx.badRequest('That email address does not look right.');
    }

    const entry = await strapi.documents(UID).create({
      data: {
        name,
        passingYear,
        email,
        mobile,
        classCompleted: clean(input.course, 80),
        location: clean(input.location, 160),
        profession: clean(input.profession, 160),
        organisation: clean(input.organisation, 200),
        message: clean(input.message, 4000),
        consent: true,
        /* (2) Never from the caller. */
        status: 'new',
        sourcePage: clean(input.sourcePage, 200),
      },
    });

    strapi.log.info(
      `[alumni-registration] new registration ${entry.documentId} from ${email}`,
    );

    ctx.status = 201;
    return { data: { ok: true } };
  },
}));
