/**
 * PARENT FEEDBACK CONTROLLER — the second of this CMS's two untrusted writes.
 *
 * Shares its abuse controls with the contact form through src/utils/public-form
 * so there is one copy of them; everything specific to this form is here.
 * Read that module's header for the honeypot and rate-limit reasoning.
 *
 * ⚠⚠ THIS ENDPOINT WRITES TO A COLLECTION NO PAGE READS. The voices carousel on
 * /parents-feedback/ is fed by the repository, by a human who checked the
 * feedback and obtained written consent. Nothing here reaches the site — not
 * automatically, not "after moderation". If that ever changes, it stops being a
 * feedback inbox and becomes a way to publish a real parent's name without
 * their permission.
 *
 * ═══ WHAT IT REFUSES TO TRUST ═══════════════════════════════════════════════
 *
 * ⚠⚠ 1. THE FIELD LIST IS A WHITELIST. Handing the request body to
 * `entityService.create` lets a caller set ANY column — `status: 'closed'` so
 * the office never sees it, or `officeNotes` carrying text the staff will later
 * read as a colleague's note. Only the eight fields the form actually has are
 * copied; everything else in the payload is dropped without comment.
 *
 * ⚠⚠ 2. `status` IS SET HERE, NEVER ACCEPTED. Always 'new'.
 *
 * ⚠⚠ 3. `rating` IS PARSED AND RANGE-CHECKED, NOT PASSED THROUGH. It is the one
 * numeric column, the schema constrains it to 1–5, and a string or an
 * out-of-range integer from a hand-rolled POST would be a 500 from the database
 * rather than a 400 from here.
 *
 * ⚠ 4. `recommend` IS AN ENUMERATION, so an unrecognised value is dropped
 * rather than written. Postgres would reject it anyway; better a clean omission
 * than a failed insert on an otherwise valid piece of feedback.
 *
 * ⚠ 5. NO IP OR USER-AGENT IS STORED. The address is used for the rate-limit
 * window, in memory, and never written to the database. A parent giving
 * feedback did not agree to being logged.
 */
import { factories } from '@strapi/strapi';
import {
  clean,
  clientIp,
  payloadOf,
  rateLimited,
  trippedHoneypot,
} from '../../../utils/public-form';

const UID = 'api::parent-feedback.parent-feedback';

/**
 * ⚠ TYPED AS THE ENUM, NOT AS `string`. Strapi generates a literal union for an
 * enumeration column, so a plain `string` here is a compile error rather than a
 * runtime surprise — which is the type system doing exactly its job: it is the
 * same check that stops an unrecognised value reaching Postgres.
 */
const RECOMMEND = ['Yes', 'Maybe', 'No'] as const;
type Recommend = (typeof RECOMMEND)[number];
const isRecommend = (v: string): v is Recommend =>
  (RECOMMEND as readonly string[]).includes(v);

export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    const input = payloadOf(ctx.request.body);

    /* (3) The honeypot — a silent success. See utils/public-form. */
    if (trippedHoneypot(input)) {
      /* ⚠ A DISCARDED SUBMISSION LEAVES A TRACE. The trap answers 200 so a bot
         learns nothing, and nothing is stored — but a false positive here
         means a real person's message vanished with no error on their screen
         and no row in the CMS, which is exactly how one was lost once. The
         line below is the only way anyone would ever find out. */
      strapi.log.warn(
        `[parent-feedback] discarded a submission: the honeypot was filled (from ${String((input as any).email ?? 'no email')})`,
      );
      ctx.status = 200;
      return { data: { ok: true } };
    }

    if (rateLimited('parent-feedback', clientIp(ctx))) {
      return ctx.tooManyRequests(
        'Too many messages from this connection. Please try again shortly, or call the school office.',
      );
    }

    const parentName = clean(input.parentName, 120);
    const studentName = clean(input.studentName, 120);
    const studentClass = clean(input.studentClass, 40);
    const feedback = clean(input.feedback, 5000);

    /* Accepts a number or the string a form sends; anything else becomes NaN
       and is caught by the range test below. */
    const rating = Number.parseInt(String(input.rating ?? ''), 10);

    if (!parentName || !studentName || !studentClass || !feedback) {
      return ctx.badRequest('Parent name, student name, class and feedback are all required.');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return ctx.badRequest('Please choose a rating between 1 and 5.');
    }

    const recommendRaw = clean(input.recommend, 20);
    const recommend = isRecommend(recommendRaw) ? recommendRaw : undefined;

    const entry = await strapi.documents(UID).create({
      data: {
        parentName,
        studentName,
        studentClass,
        phone: clean(input.phone, 40),
        rating,
        appreciate: clean(input.appreciate, 120),
        feedback,
        ...(recommend ? { recommend } : {}),
        /* (2) Never from the caller. */
        status: 'new',
        sourcePage: clean(input.sourcePage, 200),
      },
    });

    /* ⚠ THE ROW IS NOT ECHOED BACK. The caller gets an acknowledgement and
       nothing else: returning the record would confirm what was stored and hand
       back any field the server added.

       ⚠ AND THE LOG LINE CARRIES NO NAMES. Server logs are read by more people
       and kept in more places than the database; "a parent" and a rating is
       enough to know the endpoint is working. */
    strapi.log.info(`[parent-feedback] new feedback ${entry.documentId} (rating ${rating})`);

    ctx.status = 201;
    return { data: { ok: true } };
  },
}));
