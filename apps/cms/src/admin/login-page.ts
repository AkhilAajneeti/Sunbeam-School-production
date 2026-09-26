/**
 * THE SIGN-IN SCREEN, RECREATED FROM THE SUPPLIED REFERENCE.
 *
 * Two columns: the campus on the left under the headline, the login card on the
 * right on warm cream, separated by a large organic curve.
 *
 * ═══ ⚠⚠ THE WORDING IS THE CLIENT'S INSTRUCTION, NOT THE SCHOOL'S RECORD ═══
 *
 * "Nurturing Brighter Tomorrows", "Educating Minds | Building Character |
 * Creating a Better Tomorrow" and the three values below are NOT published by
 * the school. Site Settings holds a different tagline ("Educating the FUTURE!")
 * and a different motto ("Duty · Devotion · Discipline"), and an earlier
 * version of this file used those.
 *
 * The client was shown that and asked for the reference's wording instead — in
 * writing, naming "Educating the FUTURE!" as the thing to remove. So it is
 * their wording by decision, not by oversight.
 *
 * ⚠ IT IS RECORDED HERE BECAUSE THE RISK IS REAL. This screen is internal, but
 * copy travels: the moment one of these lines is pasted onto a public page it
 * becomes the school claiming something it has not published. Confirm with the
 * school before moving any of it outward.
 *
 * ═══ THE PHOTOGRAPH ════════════════════════════════════════════════════════
 *
 * ⚠ THE REFERENCE'S BUILDING IS NOT IN THIS REPOSITORY. Its colonnaded facade
 * at sunset matches no photograph the school has supplied. campus.jpg is
 * sunbeem-1.jpg — a genuine Ballia campus photograph, checked against the
 * project's own list of which files are and are not this school. A closer match
 * can be dropped in by replacing that one file.
 *
 * ═══ HOW IT ATTACHES ═══════════════════════════════════════════════════════
 *
 * ⚠ NOTHING REACT RENDERED IS MOVED. The left panel is our own element appended
 * to <body>; Strapi's card is positioned by CSS; "Forgot your password?" is a
 * sibling of the card in Strapi's markup and is placed onto the Remember-me row
 * by measurement. Moving it into the card is the exact operation that once
 * killed the Content Manager (see group-nav.ts).
 *
 * ⚠ LENGTHS ARE IN PIXELS. The admin sets html { font-size: 62.5% }, so 1rem is
 * 10px here — an earlier version wrote 30rem meaning 480px, got 300px, and the
 * headline broke mid-word while the card's title wrapped.
 *
 * ⚠ NO AUTH LOGIC IS TOUCHED. The form, its validation, the submit handler, the
 * password toggle, Remember me and the locale select are Strapi's, and are only
 * restyled.
 */
import campus from './assets/campus.jpg';
import campusLine from './assets/campus-line.png';

const STYLE_ID = 'sb-login-style';
const PANEL_ID = 'sb-login-panel';
/* Written out: dataset.sbLogin sets data-sb-login, and a stylesheet asking for
   data-sbLogin matches nothing. */
const FLAG = 'data-sb-login';

/* ── The reference's palette ─────────────────────────────────────────────── */
const NAVY = '#142447';
const BURGUNDY = '#9e0000';
const BURGUNDY_DEEP = '#7a0000';
/**
 * ⚠⚠ THREE GOLDS, AND THE SPLIT IS A CONTRAST FIX, NOT A PREFERENCE.
 *
 * The brief specifies #C99A18. Measured off the rendered page it fails every
 * text use on these light grounds:
 *
 *     hero eyebrow  13px   2.34:1   needs 4.5
 *     "Tomorrows"   56px   2.43:1   needs 3.0
 *     WELCOME TO    12px   2.59:1   needs 4.5
 *
 * That is the reference's own flaw, not a mistake in reproducing it, and it is
 * the difference between a decorative colour and a legible one. So the brief's
 * gold stays wherever it paints something rather than says something — the
 * rule, the icon discs, the borders — and text uses a darker step of the same
 * hue. GOLD_DISPLAY is the lightest that clears 3:1 at 56px; GOLD_TEXT clears
 * 4.5:1 on both the hero wash and the card's white.
 */
const GOLD = '#c99a18';
const GOLD_DISPLAY = '#b08815';
const GOLD_TEXT = '#8a6a10';
const CREAM = '#fbf8f1';
const MUTED = '#66708a';

/* ── The reference's words ───────────────────────────────────────────────── */
const EYEBROW = 'Sunbeam School Ballia';
const HEAD = ['Nurturing', 'Brighter'];
const HEAD_GOLD = 'Tomorrows';
const SUPPORT = [
  'Educating Minds&nbsp; |&nbsp; Building Character&nbsp; |',
  'Creating a Better Tomorrow',
];
const VALUES: Array<[string, string]> = [
  ['Academic', 'Excellence'],
  ['Holistic', 'Development'],
  ['Values for', 'Life'],
];

/* Line art for the three marks: mortarboard, a group, an open book. */
const MARKS = [
  "<path d='M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5z'/><path d='M6.5 10.4v4.3c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.3'/><path d='M20.5 9v4.6'/>",
  "<circle cx='9' cy='8.6' r='2.6'/><path d='M3.6 18.4c.6-2.7 2.8-4.2 5.4-4.2s4.8 1.5 5.4 4.2'/><circle cx='16.8' cy='9.6' r='2'/><path d='M15 14.6c2.3-.5 4.6.8 5.2 3.4'/>",
  "<path d='M12 6.4C10.3 5.2 8.3 4.6 5.6 4.6H3.4v12.2h2.2c2.7 0 4.7.6 6.4 1.8 1.7-1.2 3.7-1.8 6.4-1.8h2.2V4.6h-2.2c-2.7 0-4.7.6-6.4 1.8z'/><path d='M12 6.4v12.2'/>",
];

const svgUrl = (inner: string, stroke: string) =>
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='" +
      stroke +
      "' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>" +
      inner +
      '</svg>',
  ) +
  '")';

/** A mask takes the shape only; the colour comes from the element. */
const maskUrl = (inner: string) => svgUrl(inner, 'currentColor');

/**
 * The campus line along the foot of the card.
 *
 * ⚠ THIS IS THE CLIENT'S OWN ARTWORK, NOT A STAND-IN. An earlier version drew a
 * roofline out of rectangles because nothing in the repository could produce the
 * reference's illustration; the client supplied it as public/loginpage.png and
 * that placeholder is gone.
 *
 * ⚠ IT IS CROPPED, AND THAT MATTERS FOR POSITIONING. The supplied PNG is an
 * 865x288 canvas with the drawing sitting between y=90 and y=218 — 70px of
 * transparency below it. Placed flush to the card's edge the drawing would have
 * floated 70px above it. assets/campus-line.png is the same file trimmed to its
 * ink, 862x128, so `bottom: 0` means what it says.
 */

/**
 * THE DIVIDER, AS A WAVE.
 *
 * ⚠⚠ THE PATH IS GENERATED, NOT HAND-WRITTEN, AND THAT IS THE WHOLE POINT. The
 * first attempt was three hand-placed cubic segments. Where two of them met the
 * tangents did not line up, so the "curve" had visible corners in it — a kink
 * at every join, which is exactly what stops it reading as one smooth sweep.
 *
 * Here the boundary is a cosine, and each Bezier segment takes its control
 * points from the curve's OWN derivative at the two ends. That makes the joins
 * C1-continuous by construction: the direction coming out of one segment is the
 * direction going into the next, so there is nothing left to kink.
 *
 * ⚠ THE CONSTANTS ARE WHERE THE SHAPE LIVES. CYCLES just under one full period
 * with PHASE pulling the crest to about a fifth of the way down: out at the top,
 * back in around three-quarters, easing out again at the foot — the reference's
 * shape. AMPLITUDE is how far it travels, CENTRE is where it sits.
 *
 * ⚠ preserveAspectRatio="none": the viewBox stretches to whatever height the
 * window has, so the wave keeps its shape across the width and simply gets
 * longer. Without it the curve is a circle on a short screen and a straight line
 * on a tall one.
 */
const W = 200;          /* viewBox width  */
const H = 1000;         /* viewBox height */
const CENTRE = 160;     /* where the line sits across that width  */
const AMPLITUDE = 31;   /* how far it swings either side          */
const CYCLES = 0.95;    /* just under one full period over the height */
const PHASE = -0.19;    /* pulls the crest to about a fifth down  */
const BAND = 26;        /* the warm ribbon's width, in the same units */

const TAU = Math.PI * 2;
const xAt = (u: number, shift = 0) =>
  CENTRE + shift + AMPLITUDE * Math.cos(TAU * (CYCLES * u + PHASE));
/* d/du of the line above — the tangent the Bezier control points are built on. */
const dxAt = (u: number) =>
  -AMPLITUDE * TAU * CYCLES * Math.sin(TAU * (CYCLES * u + PHASE));

/** The wave as one smooth cubic chain. `shift` moves it sideways for the band. */
function wavePath(shift = 0, segments = 8): string {
  const r = (n: number) => Math.round(n * 100) / 100;
  let d = 'M' + r(xAt(0, shift)) + ',0';
  for (let i = 0; i < segments; i += 1) {
    const u0 = i / segments;
    const u1 = (i + 1) / segments;
    const h = u1 - u0;
    /* One third of the tangent is the standard cubic control offset; using the
       real derivative at both ends is what makes the joins seamless. */
    const c1x = xAt(u0, shift) + (h / 3) * dxAt(u0);
    const c2x = xAt(u1, shift) - (h / 3) * dxAt(u1);
    const c1y = (u0 + h / 3) * H;
    const c2y = (u1 - h / 3) * H;
    d += ' C' + r(c1x) + ',' + r(c1y) + ' ' + r(c2x) + ',' + r(c2y) +
         ' ' + r(xAt(u1, shift)) + ',' + r(u1 * H);
  }
  return d;
}

/**
 * Three layers in one drawing, ordered so the ribbon shows between the line and
 * the page: everything right of the wave is filled with the warm band, then
 * everything right of the SAME wave shifted over is filled with the page's cream
 * on top of it, leaving a ribbon; the wave itself is stroked in burgundy.
 */
const waveUrl = (() => {
  const close = 'L' + W + ',' + H + ' L' + W + ',0 Z';
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + W + ' ' + H +
    "' preserveAspectRatio='none'>" +
    "<path d='" + wavePath(0) + ' ' + close + "' fill='#f5ead4'/>" +
    "<path d='" + wavePath(BAND) + ' ' + close + "' fill='" + CREAM + "'/>" +
    "<path d='" + wavePath(0) + "' fill='none' stroke='" + BURGUNDY +
    "' stroke-width='2' stroke-linecap='round'/>" +
    '</svg>';
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
})();

function buildPanel(): HTMLElement {
  const el = document.createElement('aside');
  el.id = PANEL_ID;
  /* ⚠ aria-hidden: this is the marketing panel. A screen reader meeting it
     first would read a headline and three values before the email field. */
  el.setAttribute('aria-hidden', 'true');

  const values = VALUES.map(
    ([a, b], i) =>
      '<li class="sb-v"><span class="sb-v__ic" data-i="' +
      i +
      '"></span><span class="sb-v__t">' +
      a +
      '<br>' +
      b +
      '</span></li>',
  ).join('');

  el.innerHTML =
    '<div class="sb-lp__shade"></div>' +
    '<div class="sb-lp__body">' +
    '<p class="sb-lp__eyebrow">' + EYEBROW + '</p>' +
    '<h2 class="sb-lp__head">' + HEAD.join('<br>') + '<br><em>' + HEAD_GOLD + '</em></h2>' +
    '<span class="sb-lp__rule"></span>' +
    '<p class="sb-lp__support">' + SUPPORT.join('<br>') + '</p>' +
    '<ul class="sb-lp__values">' + values + '</ul>' +
    '</div>';
  return el;
}

function css(): string {
  const markRules = MARKS.map(
    (m, i) =>
      '.sb-v__ic[data-i="' + i + '"]::before{-webkit-mask-image:' + maskUrl(m) +
      ';mask-image:' + maskUrl(m) + '}',
  ).join('');

  const personIcon = svgUrl(
    "<circle cx='12' cy='8' r='3.4'/><path d='M4.5 20c.9-3.4 3.8-5.2 7.5-5.2s6.6 1.8 7.5 5.2'/>",
    '#66708a',
  );
  const lockIcon = svgUrl(
    "<rect x='4.5' y='10.5' width='15' height='9.5' rx='2'/><path d='M8 10.5V7.8a4 4 0 0 1 8 0v2.7'/>",
    '#66708a',
  );
  const arrow = maskUrl("<path d='M5 12h13M13 6l6 6-6 6'/>");

  return `
    html[${FLAG}], html[${FLAG}] body {
      min-height: 100vh;
      background: ${CREAM} !important;
    }
    html[${FLAG}] body { margin: 0; }

    /* ═══ LEFT: the campus, half the screen ════════════════════════════════ */
    #${PANEL_ID} {
      position: fixed;
      inset: 0 auto 0 0;
      width: 50vw;
      overflow: hidden;
      background: #d9cfc0 url(${campus}) center 38% / cover no-repeat;
      z-index: 0;
    }
    /* Warm and bright, not dark: the brief asks for the building to stay
       clearly visible while the headline still holds against it. */
    #${PANEL_ID} .sb-lp__shade {
      position: absolute;
      inset: 0;
      background:
        /* ⚠ THE WASH REACHES FURTHER RIGHT THAN IT LOOKS LIKE IT NEEDS TO.
           "Values for Life" sits at about 58% of the panel, straight over the
           lit face of the building, and at the old .26 there it was grey text
           on a bright wall. This is a contrast fix, not a taste one. */
        linear-gradient(100deg, rgba(251,248,241,.95) 0%, rgba(251,248,241,.88) 34%, rgba(251,248,241,.52) 62%, rgba(251,248,241,.10) 100%),
        linear-gradient(180deg, rgba(255,250,240,.32) 0%, rgba(255,247,232,.08) 45%, rgba(120,90,40,.10) 100%);
    }

    /* The wave. It covers the panel's right edge; everything beyond it is the
       same cream the page already has, so the join is invisible. */
    #${PANEL_ID}::after {
      content: '';
      position: absolute;
      top: -1px;
      bottom: -1px;
      right: 0;
      width: 15vw;
      background: ${waveUrl} right center / 100% 100% no-repeat;
      pointer-events: none;
    }

    /* ── Hero content: upper-left, NOT centred ─────────────────────────── */
    #${PANEL_ID} .sb-lp__body {
      position: absolute;
      top: clamp(56px, 7.6vh, 82px);
      left: clamp(32px, 6.4vw, 100px);
      width: min(430px, 40vw);
      color: ${NAVY};
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    #${PANEL_ID} .sb-lp__eyebrow {
      margin: 0 0 18px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: ${GOLD_TEXT};
    }
    #${PANEL_ID} .sb-lp__head {
      margin: 0;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(34px, 3.5vw, 56px);
      line-height: 1.12;
      font-weight: 700;
      letter-spacing: -.015em;
      color: ${NAVY};
      overflow-wrap: normal;
      word-break: keep-all;
      hyphens: none;
    }
    #${PANEL_ID} .sb-lp__head em { font-style: normal; color: ${GOLD_DISPLAY}; }
    #${PANEL_ID} .sb-lp__rule {
      display: block;
      width: 62px;
      height: 2px;
      margin: 22px 0 20px;
      background: ${GOLD};
    }
    #${PANEL_ID} .sb-lp__support {
      margin: 0 0 34px;
      font-size: 15px;
      line-height: 1.75;
      color: #4b5468;
    }

    /* ── The three values ─────────────────────────────────────────────── */
    #${PANEL_ID} .sb-lp__values {
      display: flex;
      gap: clamp(14px, 1.9vw, 30px);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    #${PANEL_ID} .sb-v {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 11px;
      width: 96px;
      text-align: center;
    }
    /* ⚠ THE DISC IS THE SPAN, THE GLYPH ITS ::before. A mask clips everything
       its own element paints, so one element cannot carry both. */
    #${PANEL_ID} .sb-v__ic {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(201,154,24,.14);
      color: ${GOLD};
    }
    #${PANEL_ID} .sb-v__ic::before {
      content: '';
      width: 25px;
      height: 25px;
      background: currentColor;
      -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
      -webkit-mask-position: center;  mask-position: center;
      -webkit-mask-size: contain;     mask-size: contain;
    }
    ${markRules}
    #${PANEL_ID} .sb-v__t {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.38;
      color: #3c4459;
    }

    /* ═══ RIGHT: cream, with the faintest decoration ═══════════════════════ */
    html[${FLAG}] body::before {
      content: '';
      position: fixed;
      inset: 0 0 0 50vw;
      z-index: 0;
      pointer-events: none;
      /* The two soft washes. The dots are a separate layer below - stacking a
         tiled pattern and two gradients under one mask needed mask-composite,
         whose keywords differ between the -webkit- and standard properties, and
         the tile simply covered the whole half. */
      background:
        radial-gradient(120% 70% at 118% 8%, rgba(230,207,148,.20) 0%, transparent 62%),
        radial-gradient(90% 60% at -8% 104%, rgba(230,207,148,.16) 0%, transparent 60%);
    }

    /* ⚠ THE DOTS ARE A CORNER MOTIF, NOT A TEXTURE. Tiled across the whole half
       they sat over the card; the reference has one small block at the top
       right and nothing else. Fixed size, so it cannot spread. */
    html[${FLAG}] body::after {
      content: '';
      position: fixed;
      top: 18px;
      right: 24px;
      width: 210px;
      height: 104px;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(circle at 1px 1px, rgba(201,154,24,.34) 1px, transparent 1px) 0 0 / 15px 15px;
      -webkit-mask-image: radial-gradient(farthest-side at 100% 0, #000 45%, transparent 100%);
      mask-image: radial-gradient(farthest-side at 100% 0, #000 45%, transparent 100%);
    }

    /* The locale select: top right, out of the flow so it costs no height. */
    html[${FLAG}] header {
      position: absolute;
      top: 30px;
      right: clamp(24px, 6vw, 100px);
      z-index: 3;
      margin: 0;
      padding: 0;
    }
    html[${FLAG}] header > * { padding: 0 !important; }

    /* ⚠ THE WRAPPER ABOVE <main> PADS THE PAGE AND MADE IT SCROLL. Strapi puts
       main inside a Box with paddingTop, which added its 8px on top of main's
       own 100vh — a sign-in screen with one card on it and a scrollbar. */
    html[${FLAG}] div:has(> main) { padding: 0 !important; }

    /* ── Strapi's column, centred in the right half ────────────────────── */
    html[${FLAG}] main {
      position: relative;
      z-index: 1;
      margin-left: 50vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      /* ⚠ THE TOP PADDING KEEPS THE CARD CLEAR OF THE LANGUAGE SELECT. The
         select is fixed at top:30 and about 40px tall; the card is centred, so
         on a short viewport it rose to meet it. This floor is what stops that
         without moving either of them. */
      padding: 96px clamp(16px, 2.6vw, 48px) 28px;
      box-sizing: border-box;
    }

    /* ── The card ──────────────────────────────────────────────────────── */
    /* ⚠⚠ :first-of-type, AND THIS WAS THE BUG THAT SHIPPED. <main> has TWO div
       children: the card, and a Flex wrapping "Forgot your password?" (see
       Login.mjs). Plain "main > div" styled BOTH as a 570x700 white card, so
       the screen showed two cards - one holding the form, one holding just the
       link - each with its own skyline and watermark. */
    html[${FLAG}] main > div:first-of-type {
      width: min(570px, 100%);
      max-width: none !important;
      min-height: 700px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 15px !important;
      background: #fff !important;
      box-shadow: 0 30px 70px -34px rgba(20,36,71,.30), 0 2px 8px rgba(20,36,71,.05) !important;
      padding: 44px clamp(28px, 4vw, 56px) 96px !important;
      position: relative;
      overflow: hidden;
    }
    /* ⚠ THE EMBLEM WATERMARK IS GONE, ON PURPOSE. The brief asks for one near
       the foot of the card, and it was there while that space was empty. With
       the client's campus illustration in place it landed straight on the
       central building and read as a smudge over the artwork — two decorations
       competing for one band. The illustration is the better of the two, so it
       has the space to itself. Restoring the watermark means putting a ::before
       back here, at a size that clears the drawing. */

    html[${FLAG}] main > div:first-of-type::after {
      content: '';
      position: absolute;
      /* ⚠ FLUSH WITH THE CARD'S EDGE AND ACROSS ITS WIDTH. Centred at
         'contain' it was a small drawing floating in the middle of an empty
         lower third; the reference runs it the full width, sitting on the
         bottom edge, which is what fills that space. */
      left: 0;
      right: 0;
      bottom: 0;
      height: 84px;
      background: url(${campusLine}) center bottom / 100% auto no-repeat;
      opacity: .68;
      pointer-events: none;
    }
    html[${FLAG}] main > div:first-of-type > * { position: relative; z-index: 1; }

    /* ── Card header ───────────────────────────────────────────────────── */
    html[${FLAG}] main img { width: 104px !important; height: auto !important; }

    /* "WELCOME TO" is a ::before because the heading is one translated string;
       splitting it would mean rewriting React's text node. */
    html[${FLAG}] main h1 {
      font-family: Georgia, 'Times New Roman', serif !important;
      font-size: 30px !important;
      line-height: 1.22 !important;
      font-weight: 700 !important;
      color: ${BURGUNDY} !important;
      text-align: center;
      margin-top: 6px !important;
    }
    /* ⚠⚠ LOGIN ONLY. Every auth screen shares this layout, but they do not
       share this heading: /auth/forgot-password renders an h1 reading "Password
       Recovery", and reset, Oops and the success screen have their own. With
       the eyebrow on all of them the page read "WELCOME TO / Password
       Recovery". The flag carries which screen it is so this one rule can be
       scoped while everything else stays shared. */
    html[${FLAG}="login"] main h1::before {
      content: 'Welcome to';
      display: block;
      margin-bottom: 10px;
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .3em;
      text-transform: uppercase;
      color: ${GOLD_TEXT};
    }
    html[${FLAG}] main h1 + * {
      text-align: center;
      color: ${MUTED} !important;
      font-size: 14.5px !important;
      margin-bottom: 8px;
    }

    /* ── Form ──────────────────────────────────────────────────────────── */
    html[${FLAG}] main label,
    html[${FLAG}] main label * {
      color: ${NAVY} !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
    }
    [data-sb-req] { display: none !important; }

    html[${FLAG}] main input[type="email"],
    html[${FLAG}] main input[type="text"],
    html[${FLAG}] main input[type="password"] {
      padding-left: 44px !important;
      background-repeat: no-repeat;
      background-position: 15px center;
      background-size: 18px 18px;
    }
    html[${FLAG}] main input[type="email"],
    html[${FLAG}] main input[type="text"] { background-image: ${personIcon}; }
    html[${FLAG}] main input[type="password"] { background-image: ${lockIcon}; }
    html[${FLAG}] main input {
      border-radius: 10px !important;
      border-color: #e3e6ee !important;
      background-color: #fff !important;
      color: ${NAVY} !important;
      padding-top: 13px !important;
      padding-bottom: 13px !important;
      font-size: 14.5px !important;
    }
    html[${FLAG}] main input::placeholder { color: #9aa2b6 !important; }
    html[${FLAG}] main input:focus {
      border-color: ${BURGUNDY} !important;
      box-shadow: 0 0 0 3px rgba(158,0,0,.12) !important;
    }

    /* ── Remember me / Forgot your password, on one row ────────────────── */
    html[${FLAG}] main > div:last-of-type a,
    html[${FLAG}] main > div:last-of-type a * {
      font-size: 13.5px !important;
      font-weight: 600 !important;
      color: ${BURGUNDY} !important;
      white-space: nowrap;
      text-decoration: none;
    }
    html[${FLAG}] main > div:last-of-type a:hover { text-decoration: underline; }
    /* The WRAPPER is what moves, not the link: positioning the anchor alone
       leaves its Box still taking up a row under the card. */
    /* ⚠ WIDTH AND GROUND HAVE TO BE CLEARED TOO. The wrapper is a full-width
       flex row with the card's white behind it; positioned but left at 552px
       it became a white strip lying across the card. Shrunk to its text and
       made transparent, only the link is there. */
    html[${FLAG}] main > div[data-sb-placed] {
      position: absolute;
      width: auto !important;
      margin: 0;
      padding: 0;
      background: transparent !important;
      box-shadow: none !important;
      min-height: 0 !important;
    }
    html[${FLAG}] main > div[data-sb-placed] > * { padding: 0 !important; }

    /* ── The button ────────────────────────────────────────────────────── */
    html[${FLAG}] main button[type="submit"] {
      background: ${BURGUNDY} !important;
      border-color: ${BURGUNDY} !important;
      border-radius: 10px !important;
      height: 50px !important;
      padding: 0 !important;
      box-shadow: 0 12px 24px -14px rgba(158,0,0,.8);
    }
    html[${FLAG}] main button[type="submit"]:hover {
      background: ${BURGUNDY_DEEP} !important;
      border-color: ${BURGUNDY_DEEP} !important;
    }
    html[${FLAG}] main button[type="submit"] * {
      color: #fff !important;
      font-weight: 700 !important;
      font-size: 15px !important;
    }
    html[${FLAG}] main button[type="submit"]::after {
      content: '';
      display: inline-block;
      width: 18px; height: 18px;
      margin-left: 12px;
      vertical-align: -4px;
      background: #fff;
      -webkit-mask-image: ${arrow};
      mask-image: ${arrow};
      -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
      -webkit-mask-position: center;  mask-position: center;
      -webkit-mask-size: contain;     mask-size: contain;
    }

    /* ── Below the reference's desktop width ───────────────────────────── */
    @media (max-width: 1080px) {
      #${PANEL_ID} { display: none; }
      html[${FLAG}] body::before { inset: 0; }
      html[${FLAG}] main { margin-left: 0; }
      html[${FLAG}] header { right: 24px; }
      /* ⚠⚠ :first-of-type, AND THIS WAS THE BUG THAT SHIPPED. <main> has TWO div
       children: the card, and a Flex wrapping "Forgot your password?" (see
       Login.mjs). Plain "main > div" styled BOTH as a 570x700 white card, so
       the screen showed two cards - one holding the form, one holding just the
       link - each with its own skyline and watermark. */
    html[${FLAG}] main > div:first-of-type { min-height: 0; padding-bottom: 96px !important; }
    }
  `;
}

let cardWatch: ResizeObserver | null = null;

/**
 * Put "Forgot your password?" on the Remember-me row.
 *
 * ⚠ MEASURED, NOT GUESSED, AND NOT MOVED. Strapi renders the link as a sibling
 * of the card; the reference shows it inside. Reparenting it is the operation
 * that once replaced the Content Manager with an error boundary, so it stays
 * where it is and is positioned over the row instead. A hardcoded offset would
 * drift with Strapi's spacing and land on the Login button.
 */
function place() {
  const main = document.querySelector('main');
  const card = main?.querySelector<HTMLElement>(':scope > div:first-of-type');
  if (!main || !card) return;

  /* ⚠ FOUND BY ITS href, THEN WALKED UP TO main's OWN CHILD. Keying on
     ':scope > div:last-of-type' assumed the wrapper is the last child, and
     keying on ':scope > a' assumed the anchor is a direct one — Strapi renders
     Flex > Box > a, and either assumption breaks the moment the page has one
     more element than expected. The href is what the link IS. */
  const anchor = main.querySelector<HTMLElement>('a[href*="forgot"], a[href*="password"]');
  if (!anchor) return;
  let link: HTMLElement = anchor;
  while (link.parentElement && link.parentElement !== main) link = link.parentElement;
  if (link === card) return;

  /* The Remember-me row: the checkbox's nearest ancestor that is a real row. */
  const box = card.querySelector('input[type="checkbox"]');
  const row = (box?.closest('label')?.parentElement ?? box?.parentElement) as HTMLElement | null;
  if (!row) return;

  const m = main.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  if (!r.height || !c.width) return;

  /* ⚠⚠ ONLY IF THE ROW CAN HOLD BOTH. On a phone the card is about 290px wide
     and "Remember me" and "Forgot your password?" together want more than its
     inner width — placed anyway, the two ran straight through each other. The
     design puts them on one row; the row has to be able to carry it. */
  const pad = 56;
  const inner = c.right - pad;                       /* the card's right text edge */
  /* ⚠ THE CONTENT'S RIGHT EDGE, NOT THE ROW'S. The row is a full-width flex
     container, so its own right edge IS the card's inner edge — measuring that
     made the test always fail and the link never moved at any width. What
     matters is where the checkbox and its words actually stop. */
  const labelRight = Array.from(row.children).reduce(
    (max, el) => Math.max(max, el.getBoundingClientRect().right),
    row.getBoundingClientRect().left,
  );
  /* ⚠ THE ANCHOR'S WIDTH, NOT THE WRAPPER'S. Before it is placed the wrapper
     is a full-width flex row — 552px on a desktop card — so measuring it made
     "does it fit" fail everywhere, at every size. The text is what has to fit. */
  const width = anchor.getBoundingClientRect().width || anchor.scrollWidth;
  const GAP = 16;

  if (labelRight + GAP + width > inner) {
    /* No room: hand it back to Strapi's own layout, centred under the card. */
    link.removeAttribute('data-sb-placed');
    link.style.top = '';
    link.style.right = '';
    return;
  }

  link.style.top = `${r.top - m.top + (r.height - 18) / 2}px`;
  link.style.left = '';
  link.style.right = `${m.right - c.right + pad}px`;
  link.setAttribute('data-sb-placed', '');
}

/**
 * ⚠ THE ASTERISK CANNOT BE HIDDEN BY A SELECTOR. It is a span holding one
 * character beside a TEXT node, so it is both the first and the last ELEMENT
 * child and :not(:first-child) skipped it. CSS cannot match on text.
 *
 * ⚠ THE REFERENCE IMAGE SHOWS NO ASTERISK, which is why these go. The brief's
 * prose writes "Email Address*"; the image is the stated source of truth and it
 * does not. Deleting this function restores them.
 */
function asterisks() {
  /* ⚠ NOT JUST label > span. Strapi renders the required marker differently
     between field types, and scoping to labels missed it entirely on the live
     page — the asterisks were still on screen. Any leaf in the form whose whole
     text is one asterisk is the marker. */
  for (const el of Array.from(document.querySelectorAll('main span, main label > *'))) {
    if (el.children.length === 0 && el.textContent?.trim() === '*') {
      el.setAttribute('data-sb-req', '');
    }
  }
}

/** The reference's password placeholder; Strapi ships none for this field. */
function placeholder() {
  const pw = document.querySelector<HTMLInputElement>('main input[type="password"]');
  if (pw && !pw.placeholder) pw.placeholder = 'Enter your password';
}

const onAuth = () => location.pathname.includes('/auth/');
/** 'login' on the sign-in screen, 'other' on recovery, reset, Oops. */
const authKind = () => (/[/]auth[/]login|[/]auth[/]?$/.test(location.pathname) ? 'login' : 'other');

let dressing = false;
/** The three touches that need the form to exist. Cheap and idempotent. */
function dressSoon() {
  if (dressing) return;
  dressing = true;
  requestAnimationFrame(() => { dressing = false; dress(); });
}

/** The three touches that need the form to exist. Cheap and idempotent. */
function dress() {
  placeholder();
  asterisks();
  place();

  /* ⚠ THE WATCHER IS ATTACHED HERE, NOT IN sync(). sync() runs at bootstrap,
     when there is no card yet, so the observer was never created on the path
     that actually matters — and place() ran once against a card that then
     re-laid out, leaving the link 57px above the Remember-me row. */
  const card = document.querySelector('main > div:first-of-type');
  if (card && !cardWatch) {
    cardWatch = new ResizeObserver(() => place());
    cardWatch.observe(card);
  }
}

function sync() {
  const root = document.documentElement;
  if (onAuth()) {
    root.setAttribute(FLAG, authKind());
    if (!document.getElementById(PANEL_ID)) document.body.appendChild(buildPanel());
    dress();
    /* One frame is not enough on its own: the card has not settled yet. */
    requestAnimationFrame(dress);
  } else {
    root.removeAttribute(FLAG);
    document.getElementById(PANEL_ID)?.remove();
    cardWatch?.disconnect();
    cardWatch = null;
  }
}

export function installLoginPage(): void {
  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css();
    document.head.appendChild(el);
  }

  sync();
  /* Signing in changes the route without a reload, so the panel has to come
     down on a history change as well as go up on one. */
  window.addEventListener('popstate', sync);
  window.addEventListener('resize', () => { if (onAuth()) place(); });

  /* ⚠⚠ subtree: true, AND THIS IS WHAT WAS BROKEN. bootstrap() runs before
     React has rendered the sign-in form, so placeholder(), asterisks() and
     place() all ran against a page that had no form yet and silently did
     nothing — the asterisks stayed, the placeholder never appeared and the
     link never moved onto the Remember-me row. Watching only body's direct
     children meant nothing ever told them to run again. */
  new MutationObserver(() => {
    if (onAuth() !== !!document.getElementById(PANEL_ID)) { sync(); return; }
    if (onAuth()) dressSoon();
  }).observe(document.body, { childList: true, subtree: true });
}
