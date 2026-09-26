/**
 * THE ADMIN'S PAGE HEADER, IN THE SCHOOL'S OWN COLOURS.
 *
 * Strapi draws every page header — Content Manager, Media Library, Settings —
 * as a flat `neutral100` band holding an <h1> and, usually, a primary button.
 * This repaints that band in the logo's colours so the admin reads as the
 * school's own tool rather than a generic Strapi install.
 *
 * ═══ ⚠ IT IS CSS ONLY, AND THAT IS WHY IT IS NOT LIKE group-nav.ts ════════
 *
 * The sidebar grouping has to reorder nodes, so it carries a MutationObserver,
 * a three-failure kill switch and a teardown. None of that is needed here:
 * Strapi marks the header itself with `data-strapi-header`, an attribute IT
 * sets, and everything below is a paint on top of it. Nothing is measured,
 * moved, wrapped or read back, so there is no state to get wrong and nothing
 * to fail soft from. If a future Strapi drops the attribute the rules simply
 * stop matching and the header goes back to its grey — no error, no dead
 * screen.
 *
 * ⚠ THE ATTRIBUTE IS THE HOOK, NOT A CLASS. `data-strapi-header` is set in
 * @strapi/admin's HeaderLayout; the class beside it is a styled-components
 * hash that changes between builds. Keying on the hash would break on a patch
 * release with no warning.
 *
 * ═══ THE COLOURS ARE READ OFF THE LOGO, NOT CHOSEN ═════════════════════════
 *
 * Sampled from src/admin/assets/sunbeam-logo.png, by share of the coloured
 * pixels in the mark:
 *
 *     #780000   12.1%   the "Sunbeam School" wordmark        -> the ground
 *     #f0d800    4.4%   the emblem's wings and motto ring    -> the accent
 *     #a8d8f0    3.2%   the sky disc behind the sun          -> soft tint
 *
 * ⚠ THESE ARE NOT THE WEBSITE'S TOKENS, AND THEY ARE NOT MEANT TO BE. The site
 * runs on --sb-violet, which is #c93c0a — a burnt orange, despite the name.
 * The logo has no orange of that kind in it. This is the admin, a different
 * surface with a different job, so it follows the logo directly; changing the
 * site's palette is a separate decision affecting ninety-odd pages.
 *
 * ⚠ CONTRAST WAS CHECKED, NOT ASSUMED. White on #780000 is about 12:1 and
 * #780000 on #f0d800 about 8:1 — both well past AA. The reverse, white on the
 * gold, is about 1.7:1 and fails badly, which is why the gold only ever
 * carries dark text.
 */
import emblem from './assets/sunbeam-emblem.png';

const STYLE_ID = 'sb-admin-banner';

/* The logo's own three, named once. */
const MAROON = '#780000';
const MAROON_DEEP = '#5a0000';
const GOLD = '#f0d800';
const CREAM = '#fff6ec';

/**
 * ⚠ A SECOND, QUIETER GOLD, FOR THE RULE UNDER THE BANNER ONLY.
 *
 * The logo's #f0d800 is right for a 32px emblem and for a button the eye is
 * meant to go to. Drawn as a 3px line across the full width of the screen it
 * became the most saturated thing in the admin — a divider reading as a
 * warning stripe. This is the same hue held down in lightness so it still says
 * "gold" while sitting under the title rather than over it.
 */
const GOLD_RULE = '#b89a05';

export function installPageBanner(): void {
  if (document.getElementById(STYLE_ID)) return;

  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    /* ── The band itself ──────────────────────────────────────────────── */
    /* ⚠ THE PADDING IS CUT, AND THE REASON IS ARITHMETIC. Strapi's own band is
       generous because it is grey and recedes; painted maroon it became the
       loudest thing on screen AND the largest — 147px of a 1050px viewport for
       a title, a link and a chip, which is a quarter of a 768px laptop. The
       form is the page; the banner is a label on it. */
    [data-strapi-header] {
      position: relative;
      background: linear-gradient(107deg, ${MAROON_DEEP} 0%, ${MAROON} 52%, #8d1414 100%) !important;
      border-bottom: 2px solid ${GOLD_RULE};
      overflow: hidden;
      padding-top: 18px !important;
      padding-bottom: 16px !important;
    }

    /* The emblem, set large and very low, bled off the right edge. It is
       decoration and nothing reads against it, so it stays under everything
       and is hidden from assistive tech by virtue of being a background. */
    [data-strapi-header]::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -34px;
      width: 190px;
      height: 190px;
      transform: translateY(-50%);
      background: url(${emblem}) right center / contain no-repeat;
      opacity: .11;
      pointer-events: none;
    }

    /* ⚠ A STACKING CONTEXT FOR THE REAL CONTENT. Without it the watermark,
       being a later sibling in paint order, sits on top of the title. */
    [data-strapi-header] > * {
      position: relative;
      z-index: 1;
    }

    /* ── Type ─────────────────────────────────────────────────────────────
       ⚠ EVERY COLOUR IS SET EXPLICITLY, INHERITANCE IS NOT ENOUGH. Strapi's
       Typography writes its own colour onto each element (neutral800 for the
       title, neutral600 for the subtitle), so a colour on the band alone
       would be overridden and the header would render dark-on-dark. An
       attribute plus an element beats the design system's single class. */
    [data-strapi-header] h1,
    [data-strapi-header] h1 * {
      color: ${CREAM} !important;
      letter-spacing: -0.015em;
    }

    /* ⚠ NOT INSIDE A BUTTON. A control carries its own foreground, and a blanket
       cream here would have overwritten it — the rule is broad because Strapi's
       Typography renders as p, span OR div depending on the prop it was given,
       so all three have to be named. */
    [data-strapi-header] p:not(button *),
    [data-strapi-header] span:not(button *),
    [data-strapi-header] div:not(button *) {
      color: rgba(255, 246, 236, .82) !important;
    }

    /* The breadcrumb / "Back to …" link above the title. */
    [data-strapi-header] a {
      color: ${GOLD} !important;
      text-decoration: none;
    }
    [data-strapi-header] a:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    [data-strapi-header] a svg,
    [data-strapi-header] a svg * {
      fill: ${GOLD};
    }

    /* ── The primary action ───────────────────────────────────────────────
       Gold ground, maroon text: the one pairing in the logo that carries a
       button at this size. White on gold is 1.7:1 and is never used. */
    /* ⚠ ICON-ONLY BUTTONS ARE LEFT ALONE, and the :has() is what does it. A
       header is not always the list view's "Create new entry": an edit view
       carries Save, a "..." menu, a back arrow and the docs "?", and painting
       every one of them gold would turn a row of controls into a row of
       identical gold lozenges with no primary among them. A button whose only
       child is an icon is one of those, and keeps Strapi's own styling. */
    [data-strapi-header] button:not(:has(svg:only-child)) {
      background: ${GOLD} !important;
      border-color: ${GOLD} !important;
    }
    [data-strapi-header] button:not(:has(svg:only-child)),
    [data-strapi-header] button:not(:has(svg:only-child)) * {
      color: ${MAROON_DEEP} !important;
      font-weight: 600;
    }
    [data-strapi-header] button:not(:has(svg:only-child)) svg,
    [data-strapi-header] button:not(:has(svg:only-child)) svg * {
      fill: ${MAROON_DEEP};
    }
    [data-strapi-header] button:not(:has(svg:only-child)):hover {
      background: #ffe926 !important;
      border-color: #ffe926 !important;
    }

    /* ⚠ ONLY THE LAST ONE IS SOLID. A header with two text buttons — Save
       beside Create, say — came out as two identical gold lozenges with no
       primary between them, which is worse than leaving both alone: the eye
       has nothing to land on. The last button in a group is the primary one
       in every header Strapi lays out, so the others step back to an outline
       on the maroon. A single-button header is unaffected, because that one
       button is also the last. */
    [data-strapi-header] button:not(:has(svg:only-child)):not(:last-child) {
      background: transparent !important;
      border-color: rgba(240, 216, 0, .6) !important;
    }
    [data-strapi-header] button:not(:has(svg:only-child)):not(:last-child),
    [data-strapi-header] button:not(:has(svg:only-child)):not(:last-child) * {
      color: ${GOLD} !important;
    }
    [data-strapi-header] button:not(:has(svg:only-child)):not(:last-child):hover {
      background: rgba(240, 216, 0, .14) !important;
      border-color: ${GOLD} !important;
    }
    /* An icon-only control still has to be visible on the maroon. */
    [data-strapi-header] button:has(svg:only-child) svg,
    [data-strapi-header] button:has(svg:only-child) svg * {
      fill: ${CREAM};
    }
    /* ⚠ THE FOCUS RING HAS TO CHANGE TOO. Strapi's is its own blue-violet,
       which on this ground is nearly invisible — and a ring nobody can see is
       the same as no keyboard focus at all. */
    [data-strapi-header] button:focus-visible,
    [data-strapi-header] a:focus-visible {
      outline: 2px solid ${CREAM} !important;
      outline-offset: 2px !important;
    }

    /* ═══ THE EDIT VIEW, WHICH HAS NO ATTRIBUTE TO KEY ON ══════════════════
       The Content Manager's edit view does NOT use Layouts.Header — its header
       is a plain Flex inside the form (see content-manager's
       pages/EditView/components/Header.mjs), so data-strapi-header never
       appears and the rules above miss the screen the school spends most of
       its time on.

       ⚠ THE SELECTOR CHECKS ITSELF. ":has(h1)" means that if Strapi ever
       reshapes this, the rule stops matching and the header goes back to its
       grey — the same soft failure as the attribute above, rather than a band
       of maroon painted over the wrong element.

       ⚠⚠ AND IT IS DELIBERATELY NOT THE BLANKET TREATMENT USED ABOVE. This
       header carries the document status chip — a green "Published" pill with
       its own ground and its own dark-green text — and the "..." menu. Reusing
       the list view's "colour every p, span and div" rule would have recoloured
       the chip's text and left its green ground behind it, turning a status the
       editor relies on into something unreadable. Only the title, the back
       control and bare icons are touched here. */
    main form > div:first-child:has(h1) {
      /* ⚠ STICKY, BECAUSE THIS IS THE ONE HEADER STRAPI DOES NOT PIN. The list
         view swaps in a compact bar on scroll; the edit view does not, so on a
         long form the editor scrolls past the title and has nothing on screen
         saying which document is open. */
      position: sticky;
      top: 0;
      z-index: 3;
      background: linear-gradient(107deg, ${MAROON_DEEP} 0%, ${MAROON} 52%, #8d1414 100%);
      border-bottom: 2px solid ${GOLD_RULE};
      padding-top: 14px !important;
      padding-bottom: 12px !important;
      overflow: hidden;
    }

    /* The emblem, as on the list view. ⚠ SET LEFT OF THE ACTIONS, NOT BEHIND
       THEM: on this header the "..." menu sits at the right edge, exactly where
       the list view's watermark falls, and the two overlapped. Placed at 320px
       from the right it fills the empty middle instead. */
    main form > div:first-child:has(h1)::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 320px;
      width: 132px;
      height: 132px;
      transform: translateY(-50%);
      background: url(${emblem}) center / contain no-repeat;
      opacity: .09;
      pointer-events: none;
    }
    main form > div:first-child:has(h1) > * {
      position: relative;
      z-index: 1;
    }

    /* ⚠⚠ THE STATUS CHIP, AND THIS WAS A REAL MISTAKE. Strapi draws "Published"
       as dark green on pale green and "Draft"/"Modified" in their own tones —
       fine on white, but this banner made the ground RED, and a green pill on
       red is the single hardest pairing for the commonest colour vision
       deficiency. The chip keeps its own text colour, which is what carries
       draft from published; only the ground is forced back to something light
       so that colour is legible again. */
    /* ⚠ role="status" IS THE HOOK, and it is Strapi's own: DocumentStatus
       renders a design-system Status with role="status" and aria-label set to
       draft / published / modified. Keying on the generated class name would
       have broken on the next patch release. Only the ground is changed — the
       variant's own text colour is what still separates the three states. */
    main form > div:first-child:has(h1) [role="status"] {
      background-color: ${CREAM} !important;
      border-color: rgba(255, 246, 236, .5) !important;
    }
    main form > div:first-child:has(h1) h1,
    main form > div:first-child:has(h1) h1 * {
      color: ${CREAM} !important;
      letter-spacing: -0.015em;
    }
    /* The "Back" control, whether Strapi renders it as a link or a button. */
    main form > div:first-child:has(h1) > a,
    main form > div:first-child:has(h1) > a * {
      color: ${GOLD} !important;
    }
    /* Bare icons — the back arrow, the "..." menu — would otherwise be dark
       ink on a dark ground, which is the same as not being there. */
    main form > div:first-child:has(h1) button:has(svg:only-child) svg,
    main form > div:first-child:has(h1) button:has(svg:only-child) svg * {
      fill: ${CREAM};
    }
    main form > div:first-child:has(h1) button:focus-visible,
    main form > div:first-child:has(h1) a:focus-visible {
      outline: 2px solid ${CREAM} !important;
      outline-offset: 2px !important;
    }

    /* ⚠ THE "..." MENU STEPS BACK. It sits at the far right of a wide header,
       a long way from the title it acts on, and an outlined box out there read
       as a primary action. The distance is Strapi's layout and cannot be
       changed from a stylesheet without moving nodes; what CAN be fixed is its
       weight, so it stops competing with the things that matter. */
    main form > div:first-child:has(h1) button:has(svg:only-child) {
      background: transparent !important;
      border-color: rgba(255, 246, 236, .32) !important;
    }
    main form > div:first-child:has(h1) button:has(svg:only-child):hover {
      background: rgba(255, 246, 236, .12) !important;
      border-color: rgba(255, 246, 236, .6) !important;
    }

    /* ═══ THE DRAFT / PUBLISHED TABS ═══════════════════════════════════════
       ⚠ role="tab" IS AN ARIA CONTRACT, not a Strapi class — it is the most
       stable hook in this file. The tabs sit directly under a heavy banner and
       were a thin underline in grey: the eye went from the title straight to
       the form and skipped the one control that says which VERSION is on
       screen. Getting that wrong means editing the published copy believing it
       is the draft. */
    [role="tab"] {
      font-weight: 600;
    }
    [role="tab"][aria-selected="true"] {
      color: ${MAROON} !important;
      box-shadow: inset 0 -3px 0 ${MAROON};
    }
    [role="tab"][aria-selected="true"] * {
      color: ${MAROON} !important;
    }

    /* ── The compact bar that replaces it on scroll ───────────────────────
       Strapi swaps in a fixed neutral0 strip once the header scrolls away.
       Left alone it would flash white over a maroon page and read as a bug. */
    [data-strapi-header-sticky] {
      background: ${MAROON} !important;
      border-bottom: 2px solid ${GOLD};
    }
    [data-strapi-header-sticky] h1,
    [data-strapi-header-sticky] h1 *,
    [data-strapi-header-sticky] span {
      color: ${CREAM} !important;
    }
    [data-strapi-header-sticky] button {
      background: ${GOLD} !important;
      border-color: ${GOLD} !important;
    }
    [data-strapi-header-sticky] button,
    [data-strapi-header-sticky] button * {
      color: ${MAROON_DEEP} !important;
    }
  `;
  document.head.appendChild(el);
}
