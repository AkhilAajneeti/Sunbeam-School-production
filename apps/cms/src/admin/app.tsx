/**
 * ADMIN CUSTOMISATION — branding, theme, and the content-map navigation entry.
 *
 * Two jobs. The first is that nobody logging in should have to know what
 * Strapi is: the school's staff are looking for their own website's CMS, and a
 * purple butterfly labelled "Strapi Dashboard" is a different product as far as
 * they are concerned. The second is the "Sunbeam Content" rail entry, which was
 * here before the branding and is unchanged.
 *
 * ⚠ NOTHING HERE TOUCHES CONTENT. No content type, no record, no field, no
 * route, no query, and nothing the frontend reads. This is presentation of the
 * admin panel only — every content type still lists exactly as it did.
 *
 * ═══ WHAT CAN AND CANNOT BE REBRANDED IN 5.52.1 ════════════════════════════
 *
 * The config object below is the whole supported surface, read off
 * @strapi/admin's own StrapiApp.d.ts rather than from the docs:
 *
 *     auth.logo · locales · menu.logo · notifications.releases ·
 *     theme.{light,dark} · translations · tutorials
 *
 * ⚠⚠ THERE IS NO `config.head` IN THIS VERSION. Older guides show
 * `config.head.favicon` and `config.head.title`; passing them here is silently
 * ignored. The favicon is served by Strapi's `strapi::favicon` middleware from
 * favicon.png AT THE PROJECT ROOT — apps/cms/favicon.png, which now holds the
 * school's mark (the stock one is kept beside it as
 * favicon.strapi-default.png).
 *
 * ⚠⚠ THE BROWSER TAB TITLE IS HARDCODED. admin/src/components/PageHelpers.mjs
 * does `document.title = \`${title} | Strapi\`` — not a translation, not a
 * config key, so there is nothing to override. The observer in bootstrap()
 * rewrites that suffix after the fact. It is the only way short of patching the
 * package, and it degrades to "the tab still says Strapi" if Strapi ever
 * changes the string.
 */
import type { StrapiApp } from '@strapi/strapi/admin';
import type { DefaultTheme } from 'styled-components';

import { installNavGrouping } from './group-nav';
import { installPageBanner } from './page-banner';
import { installLoginPage } from './login-page';
import { MakeTestimonialButton } from './testimonial-button';

import authLogo from './assets/sunbeam-logo.png';
import menuLogo from './assets/sunbeam-emblem.png';

/** What the tab should say instead of "Strapi". */
const SUFFIX = 'Sunbeam School Ballia';

/**
 * ═══ THE PALETTE COMES OFF THE LOGO, MEASURED NOT EYEBALLED ════════════════
 *
 * sunbeam-logo.png was sampled pixel by pixel. Its dominant saturated colour by
 * a wide margin is the wordmark's deep maroon — 2,169px of #900000/#8b0000 —
 * with the crest contributing gold (#ffe000) and a pale blue (#c0e0f0).
 *
 * ⚠ MAROON IS THE PRIMARY, GOLD IS NOT. Gold cannot carry white text at any
 * usable size, and Strapi's primary600 is the fill behind every Save and
 * Publish button. The crest blue becomes `alternative`, which Strapi uses for
 * secondary badges, so both halves of the crest are represented.
 *
 * ⚠ CONTRAST WAS COMPUTED, NOT ASSUMED. White on the light-theme buttons:
 * primary500 7.15:1, primary600 10.01:1, primary700 13.78:1 — AAA throughout.
 *
 * ⚠⚠ DARK MODE USES A LIGHTER, BRICKIER RED ON PURPOSE. The logo maroon on
 * Strapi's dark surface (#181826) is only 1.6:1 — a button you cannot find. The
 * dark values solve two constraints at once: ≥4.5:1 under white label text AND
 * ≥3:1 against the dark surface so the button has an edge. #d43e35 scores
 * 4.63:1 and 3.79:1. Do not "restore the brand colour" here; it fails both.
 *
 * ⚠ DANGER IS LEFT AT STRAPI'S DEFAULT and will therefore also be red. That is
 * unavoidable with a red brand, and the alternative — recolouring Delete —
 * is worse. The two are separable in practice: primary is a dark maroon, danger
 * a bright signal red.
 *
 * ⚠ PARTIALS ARE SAFE HERE. StrapiApp does `merge(defaultTheme, yours)` with
 * lodash, so only these keys change and every untouched token keeps its
 * default. The `as unknown as DefaultTheme` cast exists because the TYPE says
 * a full theme is required while the RUNTIME merges — without it, strict mode
 * demands several hundred tokens.
 */
const light = {
  colors: {
    primary100: '#fbebe9',
    primary200: '#f0c9c6',
    primary500: '#a82420',
    primary600: '#8b0000',
    primary700: '#5e0a0a',

    buttonPrimary500: '#a82420',
    buttonPrimary600: '#8b0000',

    /* The crest's blue. */
    alternative100: '#eaf2f9',
    alternative200: '#c7dcee',
    alternative500: '#3d7fb0',
    alternative600: '#2f6a97',
    alternative700: '#245275',
  },
} as unknown as DefaultTheme;

const dark = {
  colors: {
    primary100: '#2b1211',
    primary200: '#4a1a18',
    primary500: '#b8322a',
    primary600: '#d43e35',
    primary700: '#f0938b',

    buttonPrimary500: '#b8322a',
    buttonPrimary600: '#d43e35',

    alternative100: '#141f29',
    alternative200: '#1e3547',
    alternative500: '#5b9ac7',
    alternative600: '#7db0d6',
    alternative700: '#a5cbe6',
  },
} as unknown as DefaultTheme;

export default {
  config: {
    locales: [],

    /* The lockup on the login screen, the crest in the left rail. */
    auth: { logo: authLogo },
    menu: { logo: menuLogo },

    theme: { light, dark },

    /* Strapi's own onboarding video tour and its release notifications are
       product marketing for a tool the school did not buy and cannot upgrade.
       Both are noise in a CMS whose users are teachers. */
    tutorials: false,
    notifications: { releases: false },

    /**
     * ⚠ EVERY KEY BELOW WAS FOUND BY SCANNING @strapi/admin FOR DEFAULT
     * MESSAGES CONTAINING "Strapi" — 298 files, 13 hits — rather than guessed.
     * The ones left alone are deliberate: `Settings.application.strapiVersion`
     * genuinely reports the Strapi version and renaming it would be a lie, and
     * the tour/NPS strings are switched off wholesale by `tutorials: false`.
     */
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Sunbeam School Ballia',
        'app.components.LeftMenu.navbrand.workplace': 'Website content',

        /* ⚠ "WELCOME TO" IS NO LONGER IN THIS STRING. The sign-in design sets it
           as a small gold eyebrow above the school's name, and login-page.ts
           draws it with a ::before — so leaving it here too would print it
           twice. Reverting that stylesheet means putting the words back. */
        'Auth.form.welcome.title': 'Sunbeam School Ballia',
        'Auth.form.welcome.subtitle': 'Log in to manage the school website',
        'Auth.form.email.label': 'Email Address',
        'Auth.form.email.placeholder': 'e.g. name@sunbeamballia.edu.in',
        'Auth.form.register.subtitle':
          'Credentials are only used to sign in to the school website CMS. All saved data is stored in the school’s own database.',

        'Settings.permissions.users.listview.header.subtitle':
          'Everyone who can sign in to the Sunbeam School Ballia CMS',

        'HomePage.widget.deploy-now.description': 'Deploy the school website',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    /**
     * ⚠ GROUPS THE CONTENT MANAGER SIDEBAR by the site's own structure — see
     * group-nav.ts. It is a DOM enhancement because Strapi's LeftMenu takes no
     * props and exposes no hook for its nav; it fails soft to the flat list, so
     * a Strapi upgrade can stop it working but cannot break the panel.
     */
    installNavGrouping();

    /**
     * ⚠ THE PAGE HEADER, PAINTED IN THE LOGO'S COLOURS — see page-banner.ts.
     * Unlike the grouping above this is a stylesheet and nothing else: Strapi
     * marks the header with `data-strapi-header` itself, so there is no DOM to
     * hold, no observer and nothing to fail soft from. It applies to EVERY
     * admin page header, not only the Content Manager's.
     */
    installPageBanner();

    /**
     * ⚠ THE SIGN-IN SCREEN, to the supplied split-screen design — see
     * login-page.ts. It runs on /auth/ only and takes itself down on the way
     * in, so the campus photograph never ends up behind the Content Manager.
     * The words on it are the school's published tagline and motto, NOT the
     * mock-up's wording; the file says why.
     */
    installLoginPage();

    /**
     * ⚠ THE TAB TITLE, WHICH HAS NO CONFIG KEY. See the header: Strapi writes
     * `${page} | Strapi` straight into document.title on every route change,
     * so this watches for that write and rewrites the suffix.
     *
     * ⚠ IT MUST IGNORE ITS OWN WRITE. Setting document.title inside the
     * observer triggers the observer again; the `endsWith` guard is what stops
     * that from being an infinite loop rather than a one-shot flag, because a
     * real navigation must still be caught afterwards.
     */
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const rebrand = () => {
        const t = document.title;
        if (t.endsWith(`| ${SUFFIX}`)) return;
        if (t.endsWith('| Strapi')) {
          document.title = `${t.slice(0, -'| Strapi'.length)}| ${SUFFIX}`;
        }
      };
      new MutationObserver(rebrand).observe(titleEl, { childList: true });
      rebrand();
    }

    /**
     * "Sunbeam Content" — a page drawing the site's own hierarchy as a tree of
     * links into the Content Manager. Unchanged by the rebrand.
     *
     * ⚠ WHY NOT A NESTED SIDEBAR. Strapi's Content Manager sidebar cannot be
     * regrouped — it renders "Collection Types" and "Single Types"
     * alphabetically and exposes no hook to nest them — and `addMenuLink` has
     * no grouping of its own, so forty links would land flat in the rail and
     * read worse than the list they replaced. One page that draws the tree is
     * the only shape that gives real nesting, and it is a supported extension
     * point.
     */
    /**
     * ⚠ A BUTTON ON PARENT FEEDBACK ROWS — see testimonial-button.tsx. It
     * drafts a testimonial from a feedback row so the office does not retype
     * it, and it CANNOT publish: the draft has no consent date and the site
     * drops any testimonial without one.
     *
     * ⚠ THE ZONE RENDERS ON EVERY EDIT VIEW. The component decides for itself
     * whether it belongs on the page, because this API passes nothing that
     * says which content type is open.
     */
    app
      .getPlugin('content-manager')
      .injectComponent('editView', 'right-links', {
        name: 'sb-make-testimonial',
        Component: MakeTestimonialButton,
      });

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
