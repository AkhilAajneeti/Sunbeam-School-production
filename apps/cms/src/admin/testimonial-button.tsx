/**
 * "CREATE TESTIMONIAL FROM THIS" — a button on a Parent Feedback row.
 *
 * ═══ WHY THIS EXISTS ═══════════════════════════════════════════════════════
 *
 * A parent's feedback and a published testimonial are two different things in
 * two different collections, and that separation is deliberate: the feedback
 * row holds a child's name and a phone number, and the testimonial collection
 * has no column for either, so neither can reach the website by accident.
 *
 * The cost of that safety was retyping. This button pays it instead: it copies
 * the quote, the parent's name and the class into a DRAFT testimonial and
 * takes you to it.
 *
 * ⚠⚠ IT CANNOT PUBLISH ANYTHING, AND THAT IS NOT AN OVERSIGHT. The draft is
 * created with no consent date; Strapi will not publish a testimonial without
 * one because the field is required, and the website drops any testimonial
 * that has none. Somebody still has to speak to the parent and record when
 * permission was given. The button removes the typing, not the asking.
 *
 * ═══ WHY THERE IS NO CUSTOM BACKEND ROUTE ══════════════════════════════════
 *
 * ⚠⚠ THIS WAS FIRST WRITTEN AS AN ADMIN-ONLY API ROUTE AND THAT CANNOT WORK.
 * A router under src/api/ is ALWAYS registered as content-api — `type: 'admin'`
 * on it is read and discarded, which was only visible by asking Strapi what it
 * had registered. Admin routes come from plugins. So the copy happens here,
 * against the Content Manager's own endpoints, which the admin session already
 * authenticates.
 *
 * ⚠ AND THE SAFETY DOES NOT DEPEND ON THIS FILE. The mapping below leaves out
 * studentName and phone, but that is tidiness, not the guarantee: the
 * testimonial content type HAS NO COLUMN for either, so no client — this one,
 * a mistaken edit, or a hostile one — can put a child's name on the page.
 *
 * ═══ HOW IT IS BOLTED ON ═══════════════════════════════════════════════════
 *
 * ⚠ THE INJECTION ZONE RENDERS ON EVERY CONTENT TYPE'S EDIT VIEW, so the guard
 * below is what keeps this button off the other forty. It reads the content
 * type out of the URL because the zone passes no props identifying it.
 *
 * ⚠ AND IT FAILS SOFT. Every failure path renders nothing or shows a message
 * rather than throwing — a Strapi upgrade that changes the URL shape or the
 * injection API should cost the office a button, not the ability to edit.
 */
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

const FEEDBACK_UID = 'api::parent-feedback.parent-feedback';
const TESTIMONIAL_UID = 'api::parent-testimonial.parent-testimonial';

/** The documentId out of /content-manager/collection-types/<uid>/<id>. */
function feedbackIdFrom(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf(FEEDBACK_UID);
  if (i === -1) return null;
  const id = parts[i + 1];
  /* "create" is the new-entry route — there is nothing to copy from yet. */
  if (!id || id === 'create') return null;
  return id;
}

export const MakeTestimonialButton = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { get, post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [busy, setBusy] = React.useState(false);

  const documentId = feedbackIdFrom(pathname);
  if (!documentId) return null;

  const run = async () => {
    setBusy(true);
    try {
      const { data: read } = await get(
        `/content-manager/collection-types/${FEEDBACK_UID}/${documentId}`,
      );
      const row = read?.data ?? read;

      const quote = String(row?.feedback ?? '').trim();
      if (!quote) {
        toggleNotification({
          type: 'warning',
          message: 'That feedback has no written comment to quote.',
        });
        return;
      }

      /* ⚠ studentName AND phone ARE NOT HERE. See the header. */
      const { data: made } = await post(
        `/content-manager/collection-types/${TESTIMONIAL_UID}`,
        {
          quote,
          parentName: String(row?.parentName ?? '').trim(),
          relation: 'Parent',
          className: String(row?.studentClass ?? '').trim() || undefined,
          consentNote:
            'Drafted from the feedback form. Record here how and when consent was obtained.',
          order: 0,
        },
      );

      const newId = (made?.data ?? made)?.documentId;
      if (!newId) throw new Error('no documentId returned');

      toggleNotification({
        type: 'success',
        message:
          'Draft created. Add the consent date — it will not appear on the site until you do.',
      });
      navigate(`/content-manager/collection-types/${TESTIMONIAL_UID}/${newId}`);
    } catch (err: unknown) {
      const reason =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? 'Could not create the draft testimonial.';
      toggleNotification({ type: 'danger', message: reason });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="secondary" onClick={run} loading={busy} disabled={busy}>
      Create testimonial from this
    </Button>
  );
};

export default MakeTestimonialButton;
