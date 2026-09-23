/**
 * ═══ THE CLASS CORNER CARDS, FROM THE CMS ══════════════════════════════════
 *
 * One record per card. The documents are held in the CMS now — they used to be
 * links to sunbeamballia.edu.in/wp-content/uploads/…, which took a parent off
 * this site to read them.
 */
import { cmsFetchAll } from '../client';
import { CLASS_CORNER_POPULATE } from '../populate';
import { fileUrl } from '../media';
import type { StrapiFile } from '../types';

export interface CornerItem {
  id: string;
  title: string;
  body: string;
  icon: string;
  /** The file to open, the route to follow, or null where nothing is published. */
  href: string | null;
  /** Derived from what the card actually points at — never typed by an editor. */
  kind: 'PDF' | 'Image' | 'Page' | null;
  pending: string | null;
  needs: string[];
}

interface RawItem {
  slug: string | null;
  title: string | null;
  body: string | null;
  icon: string | null;
  link: string | null;
  pending: string | null;
  needs: string | null;
  file: StrapiFile | null;
}

/**
 * ⚠⚠ THE PILL IS READ OFF THE FILE, NOT TYPED. An editor who selects "PDF" and
 * uploads a JPEG would otherwise put a label on the card that the file itself
 * contradicts the moment it opens. The mime type cannot disagree with the file
 * it belongs to.
 */
function kindOf(file: StrapiFile | null, link: string | null): CornerItem['kind'] {
  if (file?.mime === 'application/pdf') return 'PDF';
  if (file?.mime?.startsWith('image/')) return 'Image';
  if (file) return null;
  return link ? 'Page' : null;
}

export async function getClassCorner(): Promise<CornerItem[]> {
  const rows = await cmsFetchAll<RawItem>('/api/class-corner-documents', {
    populate: CLASS_CORNER_POPULATE,
    sort: ['order:asc'],
  });

  return (rows ?? [])
    .filter((r) => r.slug && r.title && r.body)
    .map((r) => ({
      id: r.slug as string,
      title: r.title as string,
      body: r.body as string,
      icon: r.icon ?? 'badge',
      /* ⚠ THE FILE WINS OVER THE LINK. The schema says to fill one or the
         other; if both arrive, the uploaded document is the thing the school
         actually put here and the link is the leftover. */
      /* ⚠ fileUrl(), NOT file.url. Strapi returns an upload's path relative to
         its own origin ('/uploads/…'); used raw it resolves against THIS site
         and 404s. */
      href: r.file ? fileUrl(r.file) : (r.link ?? null),
      kind: kindOf(r.file, r.link),
      pending: r.pending ?? null,
      /* One chip per line, blank lines dropped — see the field's description. */
      needs: (r.needs ?? '')
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean),
    }));
}
