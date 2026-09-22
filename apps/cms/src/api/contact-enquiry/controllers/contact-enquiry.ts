/**
 * CONTACT ENQUIRY CONTROLLER — one of this CMS's two untrusted writes.
 *
 * Every other endpoint here is read-only to the world and written by an
 * authenticated editor. This one accepts a POST from anybody on the internet,
 * so it is written defensively and does not use the core `create`.
 *
 * ⚠ THE ABUSE CONTROLS LIVE IN src/utils/public-form AND ARE SHARED WITH THE
 * PARENTS' FEEDBACK FORM. Read that module's header for the honeypot and
 * rate-limit reasoning. They were briefly duplicated here; two copies of a
 * defence drift, and the unfixed one becomes the way in.
 *
 * ═══ WHAT IT REFUSES TO TRUST ═══════════════════════════════════════════════
 *
 * ⚠⚠ 1. THE FIELD LIST IS A WHITELIST, NOT `ctx.request.body.data`. Handing the
 * request body straight to `entityService.create` lets a caller set ANY column
 * on the row — `status: 'closed'` so the office never sees it, or `officeNotes`
 * with content the staff will later read as their colleague's note. Only the
 * seven fields the form actually has are copied across; everything else in the
 * payload is dropped without comment.
 *
 * ⚠⚠ 2. `status` IS SET HERE, NOT ACCEPTED. Always 'new'. See above.
 *
 * ⚠ 3. NO IP OR USER-AGENT IS STORED ON THE ROW. The consent line the visitor
 * ticks covers the school contacting them about their enquiry; it does not
 * cover keeping a log of their address. The IP is used for the rate-limit
 * window, in memory, and never written to the database.
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

const UID = 'api::contact-enquiry.contact-enquiry';

export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    const input = payloadOf(ctx.request.body);

    /* The honeypot — a silent success. See utils/public-form. */
    if (trippedHoneypot(input)) {
      /* ⚠ A DISCARDED SUBMISSION LEAVES A TRACE. The trap answers 200 so a bot
         learns nothing, and nothing is stored — but a false positive here
         means a real person's message vanished with no error on their screen
         and no row in the CMS, which is exactly how one was lost once. The
         line below is the only way anyone would ever find out. */
      strapi.log.warn(
        `[contact-enquiry] discarded a submission: the honeypot was filled (from ${String((input as any).email ?? 'no email')})`,
      );
      ctx.status = 200;
      return { data: { ok: true } };
    }

    if (rateLimited('contact-enquiry', clientIp(ctx))) {
      return ctx.tooManyRequests(
        'Too many messages from this connection. Please try again shortly, or call the school office.',
      );
    }

    /* (1) The whitelist. */
    const name = clean(input.name, 120);
    const email = clean(input.email, 200);
    const consent = input.consent === true || input.consent === 'true' || input.consent === 'on';
    /* ⚠⚠ THE MESSAGE IS WHAT THE FORM IS FOR, so it is checked here and not
       merely passed along. It was missing from this whitelist for a while
       after the textarea shipped, and every enquiry in that period reached the
       office with the name, the email and the class but WITHOUT a word of what
       the parent had written — a 201 the whole time, so nothing looked wrong.
       Required here, in the schema, and in the form; drop it from any one of
       the three and that returns in silence. */
    const message = clean(input.message, 4000);

    if (!name || !email || !consent || !message) {
      return ctx.badRequest('Name, email, message and consent are required.');
    }
    if (!looksLikeEmail(email)) {
      return ctx.badRequest('That email address does not look right.');
    }

    const entry = await strapi.documents(UID).create({
      data: {
        name,
        email,
        phone: clean(input.phone, 40),
        subject: clean(input.subject, 200),
        message,
        city: clean(input.city, 120),
        studentClass: clean(input.studentClass, 80),
        consent: true,
        /* (2) Never from the caller. */
        status: 'new',
        sourcePage: clean(input.sourcePage, 200),
      },
    });

    /* ⚠ THE ROW IS NOT ECHOED BACK. The caller gets an acknowledgement and
       nothing else: returning the created record would hand an attacker a way
       to confirm what was stored and to read back any field the server added. */
    strapi.log.info(`[contact-enquiry] new enquiry ${entry.documentId} from ${email}`);

    ctx.status = 201;
    return { data: { ok: true } };
  },
}));
