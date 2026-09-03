/**
 * ADMIN CUSTOMISATION — navigation only.
 *
 * Adds one entry to the left rail, "Sunbeam Content", which opens a page drawing
 * the site's own hierarchy as a tree of links into the Content Manager.
 *
 * ⚠ NOTHING HERE TOUCHES CONTENT. No content type, no record, no field, no
 * route, no query, and nothing the frontend reads. Strapi's Content Manager still
 * lists every type exactly as it did; this is a second way in, arranged the way
 * the school thinks about its website rather than alphabetically.
 *
 * ⚠ WHY NOT A NESTED SIDEBAR. Strapi's Content Manager sidebar cannot be
 * regrouped — it renders "Collection Types" and "Single Types" alphabetically and
 * exposes no hook to nest them — and `addMenuLink` has no grouping of its own, so
 * forty links would land flat in the rail and read worse than the list they
 * replaced. One page that draws the tree is the only shape that gives real
 * nesting, and it is a supported extension point.
 */
import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Sunbeam School Ballia',
        'app.components.LeftMenu.navbrand.workplace': 'Website content',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    app.addMenuLink({
      to: 'sunbeam-content',
      icon: () => '📚',
      intlLabel: { id: 'sunbeam.content-map', defaultMessage: 'Sunbeam Content' },
      /* Visible to anyone who may read content at all — this page only links to
         the Content Manager, and every destination enforces its own permissions
         when it opens. */
      permissions: [{ action: 'plugin::content-manager.explorer.read', subject: null }],
      Component: () => import('./ContentMapPage').then((mod) => ({ default: mod.default })),
    });
  },
};
