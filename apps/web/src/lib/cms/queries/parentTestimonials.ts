/**
 * ═══ PARENT TESTIMONIALS ═══════════════════════════════════════════════════
 *
 * The quotes cleared for publication, for the voices carousel on
 * /parents-feedback/.
 *
 * ⚠⚠ THIS IS NOT THE FEEDBACK INBOX. What parents send through the form lands
 * in a different collection that no page reads — see the header of the
 * parent-testimonial content type. Do not point this at /api/parent-feedbacks
 * to "save a step": that step is a person asking a parent for permission.
 */
import { cmsFetchAll } from '../client';

export interface ParentTestimonial {
  quote: string;
  parentName: string;
  /** The relation — never the child's name. */
  relation: string;
  className?: string;
}

interface RawTestimonial {
  quote: string | null;
  parentName: string | null;
  relation: string | null;
  className: string | null;
  consentOn: string | null;
}

export async function getParentTestimonials(): Promise<ParentTestimonial[]> {
  const rows = await cmsFetchAll<RawTestimonial>('/api/parent-testimonials', {
    sort: ['order:asc'],
  });

  return (rows ?? [])
    /* ⚠ A ROW WITHOUT A CONSENT DATE IS NOT PUBLISHED, even though it is in
       this collection and published in Strapi. The date is the only evidence
       that anybody asked; a quote that cannot show when permission was given
       should not be on the site, and the safest place to enforce that is here,
       where it costs nothing to check. */
    .filter((r) => r.quote?.trim() && r.parentName?.trim() && r.consentOn)
    .map((r) => ({
      quote: (r.quote as string).trim(),
      parentName: (r.parentName as string).trim(),
      relation: r.relation?.trim() || 'Parent',
      className: r.className?.trim() || undefined,
    }));
}
