/**
 * GROUPS THE CONTENT MANAGER'S SIDEBAR BY THE SITE'S OWN STRUCTURE.
 *
 * Strapi renders 41 single types and every collection type as two flat,
 * alphabetically-sorted lists. Finding "Campus Safety Page" among them means
 * reading the whole column. This groups those links under collapsible headings
 * that match the website's navigation — About Us, Academics, Campus Tour, and
 * so on.
 *
 * ═══ ⚠⚠ IT NEVER MOVES A NODE REACT OWNS. THIS IS THE WHOLE DESIGN. ════════
 *
 * The first version of this file wrapped the links in <details> elements and
 * did `details.append(li)`. That crashed the admin:
 *
 *     Failed to execute 'removeChild' on 'Node':
 *     The node to be removed is not a child of this node.
 *
 * Typing in the Content Manager's search box makes React re-render the filtered
 * list. React removes an <li> by calling removeChild on THE PARENT IT BELIEVES
 * THE NODE STILL HAS — the original container. The <li> had been moved inside a
 * <details>, so the call threw, the error boundary caught it, and the entire
 * Content Manager was replaced by "Something went wrong". Not a degraded nav: a
 * dead screen, on every search.
 *
 * ⚠ THE RULE THAT FOLLOWS FROM IT: React tolerates EXTRA DOM siblings it did
 * not create, because it removes and inserts its own children by reference. It
 * does not tolerate its own children being reparented. So this file may:
 *
 *     · append its own elements to the container          (safe)
 *     · set style and data-* on React's elements          (safe — attributes
 *       only; React may overwrite them, and the observer simply re-applies)
 *
 * and must never:
 *
 *     · append, insertBefore or remove a node React rendered
 *     · wrap React's nodes in anything
 *
 * ⚠ WHICH IS WHY THE GROUPING IS DONE WITH `order`, NOT NESTING. The container
 * is switched to a flex column and every link is given an `order`, so the
 * headings and their links interleave visually while the DOM order of React's
 * children is left exactly as React wrote it. Collapsing hides links with a
 * class on the container, never by detaching them.
 *
 * ═══ THIS IS STILL A DOM ENHANCEMENT, AND IT MUST FAIL SOFT ════════════════
 *
 * ⚠⚠ STRAPI HAS NO SUPPORTED WAY TO DO THIS. content-manager's LeftMenu builds
 * its menu from a hardcoded two-element array, fills it from redux, force-sorts
 * alphabetically, and takes no props. There is no config and no hook. So this
 * reaches into markup that belongs to Strapi, and every step is guarded: if the
 * nav is not found, or its markup has changed, or anything throws, the function
 * returns and the panel keeps Strapi's own flat list.
 *
 * ⚠ RE-CHECK THIS AFTER EVERY STRAPI UPGRADE. The one thing it depends on is
 * the href shape — `/content-manager/single-types/<uid>` and
 * `/content-manager/collection-types/<uid>` — which is also the URL a user sees
 * in the address bar, so it is the most stable thing available to key on. It is
 * still not a contract.
 *
 * ═══ ONE SOURCE OF TRUTH FOR THE GROUPING ══════════════════════════════════
 *
 * ⚠ THE GROUPS COME FROM CONTENT_MAP, the same structure the "Sunbeam Content"
 * page draws. A second hand-written mapping would drift from it within a term,
 * and then two screens would disagree about where a page lives.
 */
import { CONTENT_MAP, type Branch } from './content-map';

const HEADER_CLASS = 'sb-navhead';
const STYLE_ID = 'sb-navgroup-style';

/** Marks a container we have set up, so the flex switch happens once. */
const READY = 'data-sb-nav';
/** Marks the group a link belongs to, so CSS can hide it when collapsed. */
const GROUP_ATTR = 'data-sb-g';
/** Rows this file renders itself, for pages Strapi's nav cannot list. */
const EXTRA_CLASS = 'sb-navextra';

/**
 * ═══ ONE LIST INSTEAD OF TWO ═══════════════════════════════════════════════
 *
 * ⚠⚠ THE MERGE IS DONE WITH display:contents, NOT BY MOVING ANYTHING. The note
 * at the top of this file says the two lists "CANNOT be merged", and that was
 * true of the only thing tried at the time — moving a row from one container to
 * the other, which is exactly the operation that used to kill the Content
 * Manager. It is not true of the layout.
 *
 * Strapi renders both sections into ONE shared <ul>:
 *
 *     Box > ul                     [shared parent]
 *       li                         [A] one per section
 *         div (flex column)        [B] Section root
 *           div                    [C] "Collection Types" / "Single Types"
 *           ol                     [D] the link list
 *             li > a               [E] one per link
 *
 * Give [A], [B] and [D] `display: contents` and their boxes disappear while
 * their children stay exactly where they are in the DOM — so every [E] from
 * BOTH sections becomes a flex child of the same <ul>, and the `order` this
 * file already sets can interleave them. Nothing is reparented, so the
 * removeChild crash cannot occur; React still owns, renders and styles all 75
 * rows.
 *
 * ⚠ THE MARKS ARE ATTRIBUTES AND THE RULES LIVE IN THE STYLESHEET. Setting
 * `style.display` directly would be undone the next time React touched the
 * element; an attribute plus a CSS rule survives, and the observer re-marks
 * anything React replaces.
 *
 * ⚠ WHY THE RULES CARRY !important. styled-components injects `display: flex`
 * on [B] and [D] from a class of equal specificity, and which one wins would
 * otherwise come down to stylesheet order — which is not ours to control. The
 * same reasoning already applies to `.sb-navhead[hidden]` below.
 */
const UNIFIED_KIND = 'unified';
/** On the shared <ul>: it becomes the one flex column the whole nav lives in. */
const UNIFIED_ATTR = 'data-sb-unified';
/** On [A], [B] and [D]: the boxes that step out of the way. */
const PASS_ATTR = 'data-sb-pass';
/** On [C]: Strapi's own "Collection Types" / "Single Types" heading. */
const LABEL_ATTR = 'data-sb-kindlabel';

/**
 * Whether the merge is in force. Read by autoOpenCurrent, which has to build
 * its keys with the same `kind` layOut used or the branch holding the current
 * page would be opened under a key nothing renders.
 */
let unified = false;
/** Which layout the last pass produced, so a switch can clean up after itself. */
let lastMode = '';

interface Place {
  /** The top-level branch — About Us, Academics, Campus … */
  top: string;
  /** The branch below it, where CONTENT_MAP has one. Academics has seven. */
  sub: string | null;
}

/**
 * INVERSION IS THE FIX. This set used to hold what was COLLAPSED, so the empty
 * set every fresh load starts with rendered every group EXPANDED — seventy-odd
 * links standing open under twenty headings. Clicking a heading therefore
 * looked like it "opened everything": everything was already open, and a click
 * was the only thing that ever closed anything. Holding the opposite makes
 * closed the default and a click the thing that opens.
 */
const open = new Set<string>();

/* The character keyOf puts between a top and its sub. Built from its code
   point rather than written as an escape, so the two cannot drift apart
   silently if either line is reformatted. */
const SEP = String.fromCharCode(0x203a);
const isSub = (key: string) => key.includes(SEP);

/**
 * THE KIND IS PART OF THE KEY, AND WITHOUT IT THE TWO LISTS MOVE TOGETHER.
 *
 * Single Types and Collection Types are two separate nav sections with two
 * separate containers, but several branch labels appear in both - Academics,
 * Beyond Academics, About Us. Keyed on the label alone, opening Academics under
 * Single Types opened Academics under Collection Types as well, because they
 * were literally the same entry in this set.
 *
 * Built from its code point for the same reason as SEP above, and chosen so it
 * cannot appear in a branch label.
 */
const KIND_SEP = String.fromCharCode(0x00a6);
const kindPrefix = (kind: string) => kind + KIND_SEP;

/**
 * ONE TOP-LEVEL GROUP AT A TIME. Opening About Us closes Academics, which is
 * what "only the respective submenus should open" asks for; without it the
 * sidebar grows back into the flat list this file exists to replace.
 *
 * Sub-groups inside the open branch toggle INDEPENDENTLY of each other. An
 * accordion there too would close the sibling a user had just opened to
 * compare against, and the length it saves inside one branch is small.
 */
function toggle(key: string) {
  const wasOpen = open.has(key);

  if (isSub(key)) {
    if (wasOpen) open.delete(key);
    else open.add(key);
    return;
  }

  /* A top: drop every other top in THIS list, and every sub belonging to one.
     Keys from the other list are skipped untouched — closing Academics under
     Single Types must not shut whatever the editor left open under Collection
     Types. */
  const mine = key.slice(0, key.indexOf(KIND_SEP) + 1);
  for (const k of [...open]) {
    if (!k.startsWith(mine)) continue;
    if (!isSub(k) || !k.startsWith(key + SEP)) open.delete(k);
  }
  if (!wasOpen) open.add(key);
}

/**
 * THE GROUP HOLDING THE PAGE YOU ARE ON OPENS ITSELF, ONCE PER ROUTE. With
 * closed as the default, a shut sidebar on arrival would hide the very entry
 * Strapi is highlighting as current.
 *
 * Keyed on the pathname so it fires on navigation and NOT on every re-render
 * — otherwise a group the user had just closed would spring open again on the
 * next keystroke in the search box.
 */
let autoOpenedFor = '';
function autoOpenCurrent(index: Map<string, Place>) {
  const path = location.pathname;
  if (path === autoOpenedFor) return;
  autoOpenedFor = path;

  const place = placeOf(path, index);
  if (!place) return;

  /* Which of the two lists this route lives in. Without it the branch would be
     opened in both, which is the thing kind-scoped keys exist to prevent.

     ⚠ ONCE THE LISTS ARE MERGED THERE IS ONLY ONE, and the key has to say so.
     Keyed on the route's own kind while layOut was keying on `unified`, the
     branch holding the current page would be opened under a key no heading
     carries — so arriving at a page would leave the sidebar shut on it. */
  const m = path.match(/\/content-manager\/(single|collection)-types\//);
  if (!m) return;
  const kind = unified ? UNIFIED_KIND : m[1] + '-types';

  /* Only this list is reset. Whatever the editor left open in the other one
     stays as they left it — navigating is not a reason to close it. */
  const mine = kindPrefix(kind);
  for (const k of [...open]) if (k.startsWith(mine)) open.delete(k);

  open.add(keyOf(kind, place.top, null));
  if (place.sub) open.add(keyOf(kind, place.top, place.sub));
}

/**
 * uid → where it sits in CONTENT_MAP.
 *
 * ⚠ TWO LEVELS, NOT THREE. CONTENT_MAP nests deeper in places; a sidebar
 * 260px wide cannot show a third indent without the labels wrapping. Anything
 * below the second level is folded into its grandparent.
 */
function buildIndex(): Map<string, Place> {
  const index = new Map<string, Place>();

  const walk = (branch: Branch, top: string, sub: string | null) => {
    for (const leaf of branch.leaves ?? []) {
      /* `to` is "content-manager/single-types/api::x.x" — possibly with a
         query string on filtered collection links. */
      const uid = leaf.to.split('?')[0].split('/').pop();
      if (uid && !index.has(uid)) index.set(uid, { top, sub });
    }
    /* A child of the top branch becomes the sub-group; deeper children keep
       the sub-group they were already given. */
    for (const child of branch.branches ?? []) {
      walk(child, top, sub ?? child.label);
    }
  };

  for (const top of CONTENT_MAP) walk(top, top.label, null);
  return index;
}

/**
 * ═══ THE PAGES STRAPI'S SIDEBAR CANNOT SHOW ════════════════════════════════
 *
 * ⚠⚠ THE NAV LISTS CONTENT TYPES, NOT RECORDS, AND THAT IS THE WHOLE PROBLEM.
 * The eight Career Development & Student Success pages are not single types —
 * they are eight ROWS inside the Academic Topic collection, together with the
 * other thirty-eight academics pages. Strapi renders one link for that whole
 * collection, so the eight are invisible: Academics shows four sub-branches in
 * the Single Types list because only those four contain single types, and the
 * only way to reach Career Guidance was to open Academic Topic and hunt
 * through forty-six rows.
 *
 * So this file renders those pages itself. A CONTENT_MAP leaf that points at a
 * collection filtered to ONE `route` is a page in everything but storage, and
 * it gets a row of its own next to the real links.
 *
 * ⚠ ONLY A FILTER THAT NAMES ONE RECORD. `route`, `slug` and `role` each
 * identify a single row — an academics page by its URL, a leader message by
 * whose message it is. A leaf filtered by `group` or `category` is a list VIEW
 * ("all philosophy pages"), and rendering those would put the same collection
 * in the column five times under five names.
 *
 * ⚠ THESE ROWS ARE OURS, SO REACT NEVER SEES THEM. They are appended to the
 * container like the headings are, which is the one thing this file is allowed
 * to do; nothing React rendered is moved, wrapped or removed.
 */
/**
 * The filters that pick out exactly one record. Kept as one expression so the
 * rule lives in a single place rather than being re-guessed at each call.
 */
const IDENTITY_FILTER = /\[(?:route|slug|role)\]\[\$eq\]/;

interface Extra {
  uid: string;
  top: string;
  sub: string | null;
  label: string;
  /** The Content Manager path, without the admin prefix. */
  to: string;
}

function buildExtras(): Extra[] {
  const out: Extra[] = [];

  const walk = (branch: Branch, top: string, sub: string | null) => {
    for (const leaf of branch.leaves ?? []) {
      /* ⚠ A LEAF MARKED `page` IS ONE EVEN WITHOUT A FILTER. The excursions
         page is its whole collection — every row is a band of that one page —
         so there is nothing in the URL to key on and CONTENT_MAP says so
         explicitly instead. */
      const flagged = leaf.page === true;

      const m = leaf.to.match(/collection-types\/([^?]+)(?:\?(.+))?$/);
      if (!m) continue;
      if (!flagged && !(m[2] && IDENTITY_FILTER.test(m[2]))) continue;
      out.push({ uid: m[1], top, sub, label: leaf.label, to: leaf.to });
    }
    for (const child of branch.branches ?? []) walk(child, top, sub ?? child.label);
  };

  for (const top of CONTENT_MAP) walk(top, top.label, null);
  return out;
}

/** Where a link belongs, or null if CONTENT_MAP does not mention it. */
function placeOf(href: string, index: Map<string, Place>): Place | null {
  const m = href.match(/\/content-manager\/(?:single|collection)-types\/([^/?#]+)/);
  if (!m) return null;
  return index.get(decodeURIComponent(m[1])) ?? null;
}

/** A stable key for a group, safe to put in an attribute selector. */
const keyOf = (kind: string, top: string, sub: string | null) =>
  kindPrefix(kind) +
  `${top}${sub ? '\u203a' + sub : ''}`.replace(/["\\]/g, '');

/**
 * ⚠⚠ WHILE THE USER IS SEARCHING, EVERY GROUP OPENS. Without this the fix
 * above would be a worse bug than the one it fixes: closed-by-default plus a
 * search that matches something inside a closed branch equals a nav that says
 * "no results" while holding them. Collapsing is a browsing aid; a search
 * already IS the filter.
 *
 * Two independent tests, because either alone can miss:
 *   · the nav's own search box has text in it — the direct signal, but the
 *     input is Strapi's and its markup is not a contract;
 *   · the list is shorter than the longest this kind has ever been — works
 *     even if that input moves or is renamed, and the only way the high-water
 *     mark falls is a filter.
 */
const maxRows = new Map<string, number>();

function isFiltering(container: HTMLElement, kind: string, count: number): boolean {
  const seen = maxRows.get(kind) ?? 0;
  if (count > seen) maxRows.set(kind, count);
  if (count < (maxRows.get(kind) ?? 0)) return true;

  try {
    const nav = container.closest('nav') ?? container.parentElement;
    const input = nav?.querySelector('input');
    if (input instanceof HTMLInputElement && input.value.trim() !== '') return true;
  } catch {
    /* No search box we can read: the row count above is the answer. */
  }
  return false;
}

/**
 * ⚠⚠ SETTING el.hidden ON A HEADING DOES NOTHING WITHOUT THE RULE BELOW, AND
 * THAT COST TWO ROUNDS OF "FIXED".
 *
 * `el.hidden = true` sets an attribute whose only effect is the user agent's
 * `[hidden] { display: none }` — and ANY author rule that sets `display` beats
 * it. `.sb-navhead` sets `display: flex`, so every sub-heading stayed on screen
 * after its branch was closed, while its LINKS — hidden by a class carrying
 * `!important` — correctly disappeared. The sidebar showed a shut arrow with
 * open sub-headings under it, which looks like a dropdown that does not close.
 *
 * ⚠ AND DO NOT ASSERT ON THE `hidden` PROPERTY IN A TEST. It reports what the
 * code intended, not what the browser drew; the suite passed 18/18 twice while
 * the sidebar was visibly wrong. Assert on getComputedStyle().display.
 */
/**
 * ONE ICON PER TOP-LEVEL BRANCH, KEYED BY THE LABEL CONTENT_MAP ALREADY USES.
 *
 * They are drawn as CSS masks rather than <svg> elements for two reasons: a
 * mask takes currentColor, so an icon dims and brightens with the heading it
 * belongs to and needs no second set of theme rules; and nothing extra is added
 * to the DOM, which is the constraint this whole file works under.
 *
 * A branch with no entry here simply gets no icon — the heading still reads.
 */
const ICONS: Record<string, string> = {
  'site-global':
    "<circle cx='12' cy='12' r='9'/><path d='M3 12h18'/><path d='M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z'/>",
  /* People, not a building. It was a house, and Campus is also a house —
     at 16px the two were the same mark in the same column. */
  'about-us':
    "<circle cx='9' cy='8' r='3'/><path d='M3.5 20a5.5 5.5 0 0 1 11 0'/><path d='M16.2 5.6a3 3 0 0 1 0 4.8'/><path d='M17.6 14.4A5.5 5.5 0 0 1 20.5 19'/>",
  academics:
    "<path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14H6.5A2.5 2.5 0 0 0 4 19.5z'/><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H19v4H6.5A2.5 2.5 0 0 1 4 19.5z'/>",
  'beyond-academics':
    "<path d='M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z'/>",
  'news-events':
    "<path d='M4 10.5v3a1 1 0 0 0 1 1h2.5l5.5 4V5.5l-5.5 4H5a1 1 0 0 0-1 1z'/><path d='M17 9.5a4.5 4.5 0 0 1 0 5'/>",
  campus:
    "<path d='M3 21h18'/><path d='M5.5 21V7.5h6V21'/><path d='M13.5 21V11h5v10'/><path d='M7.5 11h2M7.5 15h2M15.5 15h1'/>",
  'school-administration':
    "<path d='M12 3l8 3v6.2c0 4.6-3.3 7.9-8 8.8-4.7-.9-8-4.2-8-8.8V6z'/><path d='M9.5 12l1.8 1.8 3.5-3.6'/>",
  'documents-services':
    "<path d='M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7z'/><path d='M14 3v4h4'/><path d='M9 13h6'/><path d='M9 17h4'/>",
  other:
    "<circle cx='6' cy='12' r='1.4'/><circle cx='12' cy='12' r='1.4'/><circle cx='18' cy='12' r='1.4'/>",
};

/**
 * ONE COLOUR PER BRANCH, SO THE COLUMN CAN BE SCANNED RATHER THAN READ.
 *
 * ⚠⚠ COLOUR IS NEVER THE ONLY DIFFERENCE, AND THAT IS NOT A DETAIL. Each
 * branch already has its own glyph and its own word; the colour is a third,
 * redundant cue. Anyone who cannot separate these hues — and red/green is the
 * commonest form of that — loses nothing, because the shape and the label
 * still say which branch this is. Colour-coding that carries meaning ON ITS
 * OWN would fail WCAG 1.4.1, so it does not carry any here.
 *
 * ⚠ THEY ARE MID-TONES, CHOSEN TO SURVIVE BOTH THEMES. The admin switches
 * light and dark through a styled-components provider: it publishes no CSS
 * variable and sets no data-theme, so a stylesheet cannot tell which is on and
 * cannot ship a second set. Every colour here sits around 45–60% lightness,
 * which clears 3:1 against Strapi's white AND against its #212134 dark. A
 * paler set would have vanished on white; a darker one on dark.
 *
 * ⚠ ACADEMICS IS THE LOGO'S OWN CRIMSON, and it is the biggest branch at 52
 * entries. The rest are a spread around the wheel with the neighbours kept
 * apart — Other is deliberately the grey one, because it is the bucket for
 * whatever has not been placed rather than a section of the site.
 */
const ICON_COLOURS: Record<string, string> = {
  'site-global': '#0d9488',
  'about-us': '#8b5cf6',
  /* ⚠ PULLED TOWARDS THE BANNER'S MAROON ON PURPOSE. At #dc2626 this sat in
     the same column as the chrome's #780000 and read as a second, slightly
     different red — which looks like a mistake rather than a scheme. Moved to
     the same hue at a lighter step, the two now read as one family: the deep
     one is chrome, the light one is a section. Still clears 3:1 on both
     grounds, which #780000 itself would not on dark. */
  academics: '#c81e1e',
  'beyond-academics': '#ea580c',
  'news-events': '#d97706',
  campus: '#16a34a',
  'school-administration': '#2563eb',
  'documents-services': '#0891b2',
  other: '#64748b',
};

/** CONTENT_MAP's label to an ICONS key. 'News & Events' becomes 'news-events'. */
const iconKey = (label: string) =>
  label.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * encodeURIComponent, NOT a hand-written %3C. Hand-encoding one of these is
 * fine; hand-encoding nine and keeping them right through an edit is not.
 */
const svgUrl = (inner: string) =>
  'url("data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='#000' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'>" +
      inner +
      '</svg>',
  ) +
  '")';

/** The uid a Content Manager href points at, or null. */
function placeKeyOf(href: string): string | null {
  const m = href.match(/\/content-manager\/(?:single|collection)-types\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * The row for one of those pages, created once and reused on every pass.
 *
 * ⚠ IT NAVIGATES WITHOUT RELOADING THE ADMIN. A plain anchor click would take
 * the browser out of the single-page app and rebuild the whole panel, which is
 * several seconds every time somebody opens a page. pushState plus a popstate
 * event is what React Router listens to, so the admin moves as it does for its
 * own links — and if anything about that changes, the click is left alone and
 * the anchor works the ordinary way.
 */
function extraAnchor(container: HTMLElement, prefix: string, e: Extra): HTMLAnchorElement {
  const key = `${e.uid}|${e.to}`;
  const found = container.querySelector<HTMLAnchorElement>(
    `a.${EXTRA_CLASS}[data-sb-extra="${CSS.escape(key)}"]`,
  );
  if (found) return found;

  const a = document.createElement('a');
  a.className = EXTRA_CLASS;
  a.dataset.sbExtra = key;
  a.href = `${prefix}/${e.to.replace(/^\/+/, '')}`;
  a.textContent = e.label;
  a.addEventListener('click', (ev) => {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
    try {
      ev.preventDefault();
      window.history.pushState({}, '', a.href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch {
      /* Let the browser follow the link the ordinary way. */
    }
  });
  container.appendChild(a);
  return a;
}

function styleOnce() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;

  const iconRules = Object.entries(ICONS)
    .map(([key, inner]) => {
      const u = svgUrl(inner);
      /* The branch carries its colour and its glyph as custom properties; the
         icon element below reads both. Two declarations per branch instead of
         a rule for the chip and another for the mask. */
      return (
        '.' + HEADER_CLASS + '[data-sb-icon="' + key + '"]{' +
        '--sb-ic:' + (ICON_COLOURS[key] ?? '#64748b') + ';--sb-mask:' + u + '}'
      );
    })
    .join(' ');
  /* Deliberately minimal: the links keep Strapi's own styling, and only the
     heading row is ours. Anything more would drift from the admin theme. */
  el.textContent = `
    /* ONE PLACE TO CHANGE THE SIDEBAR'S TYPE SIZE. Strapi's own defaults are
       11px for a section label and 14px for a link, which is small down a long
       list. Raise or lower these three. */
    [${READY}] {
      --sb-nav-link: 15px;
      --sb-nav-head: 12.5px;
      --sb-nav-sub: 12.5px;
      display: flex;
      flex-direction: column;
    }

    /* ═══ THE TWO LISTS, MADE ONE ══════════════════════════════════════════
       See the note beside UNIFIED_KIND. These three boxes stop generating a
       box; their children keep their parents and simply become flex items of
       the <ul>, so the order set below can interleave a single type and a
       collection. */
    [${PASS_ATTR}] { display: contents !important; }

    /* Strapi's own "Collection Types" / "Single Types" headings. Hidden, not
       removed: they are React's. */
    [${LABEL_ATTR}] { display: none !important; }

    /* ⚠ THE GAP HAS TO COME DOWN. The <ul> spaces its two SECTIONS 24px apart;
       with the sections gone it would put 24px between every one of the 75
       rows. The rows carry their own 8px through the <ol> they still belong
       to, so this only has to stop the <ul> adding a second one. */
    [${UNIFIED_ATTR}] {
      display: flex !important;
      flex-direction: column;
      gap: 0;
    }

    /* ⚠ THE ROW INSET WENT WITH THE <ol>'s BOX, AND IT IS RESPONSIVE. Strapi
       sets the list's margin as { initial: 0, large: 2 } — 0 below 1080px and
       8px at or above it — so restoring a single fixed value would indent the
       rows on a narrow panel where Strapi does not. 1080px is the design
       system's own large breakpoint; it is not a number chosen here. */
    [${UNIFIED_ATTR}] > li > [${PASS_ATTR}] > ol > li { margin-inline: 0; }
    @media (min-width: 1080px) {
      [${UNIFIED_ATTR}] > li > [${PASS_ATTR}] > ol > li { margin-inline: 8px; }
    }

    /* EVERY COLOUR BELOW IS MIXED OUT OF currentColor, AND THAT IS THE ONLY WAY
       TO FOLLOW STRAPI'S THEME. The admin switches light and dark in JavaScript
       through a styled-components provider: it publishes no CSS variable and
       sets no data-theme attribute, so there is nothing for a stylesheet to key
       on. The one thing this list does inherit is the theme's text colour, so
       every tone here is a proportion of that and both themes come out right.

       The flat hex before each mix is the fallback for a browser without
       color-mix; it is a compromise tone that reads on either ground. */

    /* THE LINK'S TEXT IS NOT IN THE <a>, IT IS IN A Typography DIV INSIDE IT,
       and that div carries its own font-size from the design system. Setting a
       size on the anchor alone inherits nowhere and changes nothing — the same
       specificity trap as [hidden] below. The descendant selector is what wins:
       an attribute plus two elements beats the design system's single class. */
    [${READY}] a,
    [${READY}] a * {
      font-size: var(--sb-nav-link);
    }

    /* ⚠ A CLIPPED NAME WITH NO ELLIPSIS IS A NAME NOBODY KNOWS IS CLIPPED.
       "Academics — the section landing page" ran to the edge of the panel and
       simply stopped, so the row read as a different page from the one it is.
       The ellipsis says there is more; the title attribute set in layOut() is
       how the rest is actually read. */
    [${READY}] a,
    [${READY}] a > div,
    [${READY}] a > div > div {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ── A top-level branch ───────────────────────────────────────────── */
    .${HEADER_CLASS} {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 7px;
      width: 100%;
      box-sizing: border-box;
      padding: 6px 10px;
      /* The space above is what separates one branch from the last; without it
         twenty headings read as one undifferentiated column.
         ⚠ CUT FROM 12px. Nine branches, each with its own 24px icon chip and
         several with nine sub-branches under them, made a column that needed
         scrolling before the second section. Air between groups is worth
         paying for; this much of it was not. */
      margin: 7px 0 2px;
      border: 0;
      background: none;
      text-align: left;
      font: inherit;
      font-size: var(--sb-nav-head);
      font-weight: 700;
      letter-spacing: .07em;
      text-transform: uppercase;
      border-radius: 6px;
      color: #8e8ea9;
      color: color-mix(in srgb, currentColor 58%, transparent);
      transition: background-color .12s ease, color .12s ease;
    }
    .${HEADER_CLASS}:first-of-type { margin-top: 2px; }

    .${HEADER_CLASS}:hover {
      background: rgba(128, 128, 150, .1);
      background: color-mix(in srgb, currentColor 12%, transparent);
    }
    .${HEADER_CLASS}:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: -2px;
    }

    /* An open branch is stated, not just implied by its arrow. */
    .${HEADER_CLASS}[aria-expanded="true"] {
      color: #6b6b85;
      color: color-mix(in srgb, currentColor 82%, transparent);
    }

    /* ── The branch icon, left ────────────────────────────────────────── */
    /* ⚠⚠ AN ELEMENT, NOT A ::before, AND THE REASON IS THE MASK. A mask clips
       everything its element paints — background, border, shadow — so a single
       pseudo cannot carry BOTH the tinted chip and the glyph sitting on it.
       The chip is this span; the glyph is the span's own ::before. The span is
       ours, created in header(), so nothing React owns is touched.

       ⚠ IT IS aria-hidden. The branch's name is already the button's text, and
       an icon that repeated it would make every heading announce twice. */
    .${HEADER_CLASS}__ic {
      flex: none;
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 7px;
      /* The flat rgba is the fallback where color-mix is missing; the tint
         below replaces it wherever it is supported. */
      background: rgba(128, 128, 150, .12);
      background: color-mix(in srgb, var(--sb-ic, currentColor) 15%, transparent);
      transition: background-color .12s ease;
    }
    .${HEADER_CLASS}__ic::before {
      content: '';
      display: block;
      width: 15px;
      height: 15px;
      background: var(--sb-ic, currentColor);
      -webkit-mask-image: var(--sb-mask);
      mask-image: var(--sb-mask);
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      -webkit-mask-size: contain;
      mask-size: contain;
    }
    /* The chip lifts on hover and while the branch is open, so the colour
       reads as a state and not only as decoration. */
    .${HEADER_CLASS}:hover .${HEADER_CLASS}__ic,
    .${HEADER_CLASS}[aria-expanded="true"] .${HEADER_CLASS}__ic {
      background: color-mix(in srgb, var(--sb-ic, currentColor) 26%, transparent);
    }

    /* ⚠ AN OPEN BRANCH IS MARKED IN ITS OWN COLOUR, on the left edge. The
       arrow alone is 10px of glyph at the far right of a 234px column; at a
       glance down the list it is easy to miss which branch is the open one. */
    .${HEADER_CLASS}[aria-expanded="true"] {
      box-shadow: inset 2px 0 0 var(--sb-ic, transparent);
      background: color-mix(in srgb, var(--sb-ic, currentColor) 7%, transparent);
    }

    /* ⚠⚠ AN OPEN BRANCH AND THE PAGE YOU ARE ON MUST NOT LOOK ALIKE, and they
       did. Strapi fills the current page's row with its own tint; this file was
       filling the open branch AND the open sub-branch with a tint of their own.
       Three filled rows stacked — Academics, Assessment, Academic Calendar Page
       — and nothing said which one was the page on screen. A sub-branch now
       states "open" with its rule alone and leaves the fill to Strapi. */
    .${HEADER_CLASS}--sub[aria-expanded="true"] {
      background: none;
      box-shadow: inset 2px 0 0 color-mix(in srgb, currentColor 35%, transparent);
    }

    /* A sub-branch has no icon; the padding that replaces it is set below. */
    .${HEADER_CLASS}--sub .${HEADER_CLASS}__ic { display: none; }

    ${iconRules}

    /* ── The disclosure arrow, right ──────────────────────────────────── */
    /* PAST THE COUNT, BECAUSE ::after IS THE LAST THING IN THE FLEX ROW and
       the count already carries margin-left:auto. Icon, label, then the count
       and the arrow together on the right. */
    .${HEADER_CLASS}::after {
      content: '▸';
      flex: none;
      margin-left: 7px;
      font-size: 10px;
      line-height: 1;
      opacity: .55;
      transition: transform .16s ease;
    }
    .${HEADER_CLASS}[aria-expanded="true"]::after { transform: rotate(90deg); }

    /* ── A sub-branch inside it ───────────────────────────────────────── */
    /* ALIGNED WITH THE PARENT'S TEXT, NOT THE PARENT'S ICON. Its own icon is
       off, so without this padding a sub-branch started further LEFT than the
       branch it belongs to, which reads as the wrong way round. */
    .${HEADER_CLASS}--sub {
      margin: 2px 0 2px 10px;
      width: auto;
      padding: 5px 10px 5px 23px;
      font-size: var(--sb-nav-sub);
      font-weight: 600;
      letter-spacing: 0;
      text-transform: none;
    }

    /* ── The count ────────────────────────────────────────────────────── */
    /* Quiet, lower-case and set apart: it is a note about the list, not part
       of the branch's name. */
    .${HEADER_CLASS}__kind {
      margin-left: 8px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .04em;
      text-transform: lowercase;
      opacity: .55;
    }

    /* ⚠ A PILL, AND IT SITS IN THE BRANCH'S OWN COLOUR. As bare digits at 60%
       opacity the counts read as part of the label rather than as a separate
       fact about it; the tint ties the number to the icon at the other end of
       the same row. */
    .${HEADER_CLASS}__n {
      margin-left: auto;
      min-width: 20px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0;
      text-align: center;
      /* So the numbers form a column instead of jittering by digit width. */
      font-variant-numeric: tabular-nums;
      color: var(--sb-ic, currentColor);
      background: rgba(128, 128, 150, .14);
      background: color-mix(in srgb, var(--sb-ic, currentColor) 13%, transparent);
    }

    /* ── The links that belong to a sub-branch ────────────────────────── */
    /* A GUIDE LINE, NOT MORE INDENT. Twenty pages listed under four unlabelled
       sub-branches need something that says where one ends; a rule costs one
       pixel and reads at a glance. Matched on the separator keyOf puts between
       a branch and its sub, so nothing but a nested row can pick it up. */
    [${READY}] [${GROUP_ATTR}*="${SEP}"] {
      margin-left: 17px;
      padding-left: 9px;
      border-left: 1px solid rgba(128, 128, 150, .22);
      border-left: 1px solid color-mix(in srgb, currentColor 16%, transparent);
    }

    /* ── The rows this file renders itself ───────────────────────────── */
    /* Made to sit in the same column as Strapi's links rather than to stand
       out: the school should not have to know which of these the admin drew. */
    a.${EXTRA_CLASS} {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 0 12px;
      border-radius: 4px;
      text-decoration: none;
      color: inherit;
      font-size: var(--sb-nav-link);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: background-color .12s ease;
    }
    a.${EXTRA_CLASS}:hover {
      background: rgba(128, 128, 150, .13);
      background: color-mix(in srgb, currentColor 12%, transparent);
    }
    a.${EXTRA_CLASS}[aria-current="page"] {
      background: rgba(128, 128, 150, .18);
      background: color-mix(in srgb, currentColor 16%, transparent);
      font-weight: 600;
    }

    /* The headings' own display:flex beats the browser's [hidden] rule, so
       this puts it back. See the note above styleOnce() for why. */
    .${HEADER_CLASS}[hidden] { display: none !important; }

    /* ⚠ HIDDEN, NEVER DETACHED. Collapsing a group must not remove a node
       React is tracking — that is the crash this file exists to avoid. */
    [${READY}] [${GROUP_ATTR}].sb-navhidden { display: none !important; }
  `;
  document.head.appendChild(el);
}

/**
 * Lay one nav section out as ordered groups.
 *
 * ⚠ THE SECTION IS FOUND FROM THE LINKS THEMSELVES, not from a class name.
 * Class names in the admin bundle are generated and change between releases;
 * "the common parent of the anchors" does not.
 */
function layOut(
  links: HTMLAnchorElement[],
  index: Map<string, Place>,
  kind: string,
  /**
   * The merged <ul>, when the two lists have been collapsed into one flex
   * column. Without it the container is derived from the first link, which in
   * that mode is still its own <ol> — one of the very boxes that has been
   * taken out of the layout.
   */
  containerOverride?: HTMLElement,
): void {
  const container = containerOverride ?? links[0]?.parentElement?.parentElement;
  if (!container) return;

  /* ── The pages Strapi cannot list, rendered as rows of our own ─────────
     ⚠ THE ADMIN PREFIX IS TAKEN FROM A REAL LINK, NOT ASSUMED TO BE "/admin".
     It is configurable, and a hard-coded guess would send every one of these
     to a 404 on an install that changed it. */
  const sampleHref = links[0]?.getAttribute('href') ?? '';
  const prefix = sampleHref.slice(0, sampleHref.indexOf('/content-manager/'));
  /* ⚠ `presentUids` IS THE WHOLE NAV, NOT THIS CONTAINER. The collection these
     rows read from lives in the other list; what matters is that it exists at
     all, so a row never points at a content type the install does not have. */
  const extras =
    kind === EXTRAS_KIND || kind === UNIFIED_KIND
      ? (extrasCache ?? []).filter((e) => presentUids.has(e.uid))
      : [];
  const extraRows = extras.map((e) => {
    /* One element, used as both the link and the row it is ordered by. */
    const a = extraAnchor(container, prefix, e);
    return { a, row: a as HTMLElement, extra: e };
  });

  const rows = links
    .map((a) => {
      /* The <a> sits inside a wrapper (<li>); the wrapper is what carries the
         list's own spacing and active state, so that is what gets ordered. */
      const row = (a.parentElement && a.parentElement !== container ? a.parentElement : a) as HTMLElement;
      /* ⚠ THE FULL NAME, FOR THE ROWS THE PANEL IS TOO NARROW TO SHOW. Setting
         `title` is an attribute write on React's own element — the one kind of
         change the note at the top of this file allows — and if React replaces
         the node the next pass sets it again. Without it a truncated row is
         unreadable at any width. */
      const label = a.textContent?.trim();
      if (label && a.getAttribute('title') !== label) a.setAttribute('title', label);
      return { a, row };
    })
    /* ⚠ MERGED, THE ROW IS A DESCENDANT RATHER THAN A CHILD. Its DOM parent is
       still its own <ol> — that <ol> has simply stopped generating a box, so
       the row is laid out by the <ul>. Testing for a direct child here dropped
       every row and the whole nav went flat. */
    .filter(({ row }) => (containerOverride ? container.contains(row) : row.parentElement === container));

  /* ⚠ A BARE RETURN HERE HID THE ONE THING THE EDITOR SEARCHED FOR. Narrowing
     to a single row left the previous pass's collapsed state in place, so the
     only match stayed hidden and the panel looked empty — searching "lab",
     which matches exactly one content type, showed nothing at all. Standing the
     grouping down is what the tops.size check below already does for the same
     reason: one row needs no headings, and it must be on screen. */
  if (rows.length < 2) { teardown(container); return; }

  const filtering = isFiltering(container, kind, rows.length);

  const UNGROUPED = 'Other';

  /* top → sub ('' for "directly under the top") → the rows, in DOM order. */
  const tops = new Map<string, Map<string, { a: HTMLAnchorElement; row: HTMLElement }[]>>();
  for (const r of rows) {
    const place = placeOf(r.a.getAttribute('href') ?? '', index);
    const top = place?.top ?? UNGROUPED;
    const sub = place?.sub ?? '';
    if (!tops.has(top)) tops.set(top, new Map());
    const subs = tops.get(top)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push(r);
  }

  /* ⚠ OUR OWN ROWS GO IN THE SAME BUCKETS, so they collapse, indent and carry
     the guide rule exactly as Strapi's links do. Their branch comes from
     CONTENT_MAP directly rather than from a uid lookup — the uid they share
     with the whole collection would put all eight under whichever branch
     happens to mention Academic Topic first. */
  for (const r of extraRows) {
    const top = r.extra.top;
    const sub = r.extra.sub ?? '';
    if (!tops.has(top)) tops.set(top, new Map());
    const subs = tops.get(top)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push({ a: r.a, row: r.row });
  }

  /* Nothing to gain from a single group — leave the list exactly as Strapi
     rendered it. This is also what happens while a search filters it to one
     match, which is precisely when the old version used to crash. */
  if (tops.size < 2) {
    teardown(container);
    return;
  }

  styleOnce();
  container.setAttribute(READY, '');

  /* CONTENT_MAP's order, then anything it does not mention, then Other. */
  const mapOrder = CONTENT_MAP.map((b) => b.label);
  const known = mapOrder.filter((l) => tops.has(l));
  const rest = [...tops.keys()].filter((g) => !known.includes(g) && g !== UNGROUPED);
  const topOrder = [...known, ...rest, ...(tops.has(UNGROUPED) ? [UNGROUPED] : [])];

  /* Header elements are reused across passes so a search does not churn the
     DOM. What is open no longer needs preserving that way — it lives in the
     module-level `open` set, not on these nodes. */
  const existing = new Map<string, HTMLElement>();
  for (const h of Array.from(container.querySelectorAll<HTMLElement>(`.${HEADER_CLASS}`))) {
    existing.set(h.dataset.sbKey ?? '', h);
  }
  const used = new Set<string>();

  const header = (
    key: string,
    label: string,
    count: number,
    depth: 1 | 2,
    order: number,
    visible: boolean,
  ) => {
    /* `kind` comes from layOut's own parameter — see the note in pass(). */
    let el = existing.get(key);
    if (!el) {
      /* Typed as the button it is, not widened to HTMLElement — `existing`
         holds HTMLElement, and assigning straight into `el` put `.type` out of
         reach of the compiler. */
      const btn = document.createElement('button');
      btn.type = 'button';
      el = btn;
      el.className = `${HEADER_CLASS}${depth === 2 ? ` ${HEADER_CLASS}--sub` : ''}`;
      el.dataset.sbKey = key;
      el.addEventListener('click', () => {
        toggle(key);
        schedulePass();
      });
      /* ⚠ APPENDED, NEVER INSERTED BETWEEN REACT'S CHILDREN. React's nodes stay
         a contiguous block at the front of the container; `order` is what puts
         these where they read. */
      container.appendChild(el);
    }
    el.className = `${HEADER_CLASS}${depth === 2 ? ` ${HEADER_CLASS}--sub` : ''}`;
    /* Only a top-level branch gets one; a sub is identified by its indent. */
    if (depth === 1) el.dataset.sbIcon = iconKey(label);
    el.textContent = label;

    /* ⚠ AFTER textContent, NOT BEFORE. Assigning textContent replaces every
       child, so an icon added first would be wiped on the next pass and the
       column would lose its icons the moment anything re-rendered. */
    if (depth === 1) {
      const ic = document.createElement('span');
      ic.className = `${HEADER_CLASS}__ic`;
      ic.setAttribute('aria-hidden', 'true');
      el.insertBefore(ic, el.firstChild);
    }

    /* ⚠ ONLY WHERE THE SAME NAME IS IN THE OTHER LIST TOO. On a branch that
       appears once this would be noise explaining a distinction the reader
       cannot see. */
    if (depth === 1 && sharedTops.has(label)) {
      const w = document.createElement('span');
      w.className = `${HEADER_CLASS}__kind`;
      w.textContent = KIND_WORD[kind] ?? '';
      el.appendChild(w);
    }

    const n = document.createElement('span');
    n.className = `${HEADER_CLASS}__n`;
    n.textContent = String(count);
    el.appendChild(n);
    el.setAttribute('aria-expanded', open.has(key) || filtering ? 'true' : 'false');
    el.style.order = String(order);
    /* A sub-heading is only on screen while its top branch is open. */
    el.hidden = count === 0 || !visible;
    used.add(key);
    return el;
  };

  let order = 0;

  for (const topLabel of topOrder) {
    const subs = tops.get(topLabel)!;
    const total = [...subs.values()].reduce((t, r) => t + r.length, 0);
    const topKey = keyOf(kind, topLabel, null);
    const topOpen = filtering || open.has(topKey);
    header(topKey, topLabel, total, 1, order++, true);

    const branch = CONTENT_MAP.find((b) => b.label === topLabel);
    const declared = (branch?.branches ?? []).map((b) => b.label);
    const present = [...subs.keys()];
    const subOrder = [
      /* Rows directly under the top branch come first, unheaded. */
      ...(present.includes('') ? [''] : []),
      ...declared.filter((l) => subs.has(l)),
      ...present.filter((l) => l !== '' && !declared.includes(l)),
    ];

    for (const subLabel of subOrder) {
      const group = subs.get(subLabel)!;
      const subKey = subLabel ? keyOf(kind, topLabel, subLabel) : topKey;

      /* ⚠ THE SUB-HEADING FOLLOWS ITS TOP, THE LINKS FOLLOW BOTH. Opening
         Academics reveals its seven sub-headings; each still has to be opened
         to show its pages. That is the two-step the client asked for — one
         branch's submenus, not every link in the CMS. */
      if (subLabel) header(subKey, subLabel, group.length, 2, order++, topOpen);

      const hidden = !filtering && (!topOpen || (subLabel ? !open.has(subKey) : false));
      for (const { row } of group) {
        row.style.order = String(order++);
        row.setAttribute(GROUP_ATTR, subKey);
        row.classList.toggle('sb-navhidden', hidden);
      }
    }
  }

  /* A header whose group vanished under a search filter. Keep the element —
     re-creating it every keystroke is what makes a list flicker — just hide it. */
  for (const [key, el] of existing) {
    if (!used.has(key)) el.hidden = true;
  }
}

/** Put a container back the way Strapi rendered it. */
/**
 * Collapse Strapi's two sections into one flex column, and hand back the <ul>
 * they share so the grouping can be laid out across both.
 *
 * ⚠ IT MARKS, IT DOES NOT MOVE. Every element touched here keeps its parent and
 * its children; all that changes is an attribute, and the stylesheet does the
 * rest. Returning null anywhere leaves the nav exactly as Strapi rendered it
 * and pass() falls back to grouping each list on its own.
 *
 * ⚠ THE SHAPE IS CHECKED, NOT ASSUMED. The chain <ul> > li > div > ol is
 * Strapi's internal markup and a version bump may add a wrapper to it. Every
 * step is verified, so a changed shape means two tidy lists again rather than a
 * sidebar laid out against a box that is no longer there.
 */
function unify(lists: HTMLElement[]): HTMLElement | null {
  if (lists.length < 2) return null;

  const shared = lists[0].closest('ul');
  if (!shared) return null;
  /* Both lists must hang off the SAME <ul>, or this is not the markup we read. */
  if (!lists.every((l) => l.closest('ul') === shared)) return null;

  const marks: HTMLElement[] = [];
  for (const ol of lists) {
    const sectionRoot = ol.parentElement;                 // [B]
    const item = sectionRoot?.parentElement;              // [A]
    if (!sectionRoot || !item) return null;
    if (item.parentElement !== shared) return null;       // [A] is a child of the <ul>
    marks.push(ol, sectionRoot, item);

    /* [C] is whatever else [B] holds — the label and its count badge. It is
       hidden rather than removed: it is React's element. */
    for (const child of Array.from(sectionRoot.children)) {
      if (child !== ol && child instanceof HTMLElement) child.setAttribute(LABEL_ATTR, '');
    }
  }

  for (const el of marks) el.setAttribute(PASS_ATTR, '');
  shared.setAttribute(UNIFIED_ATTR, '');
  return shared;
}

/** Put Strapi's two sections back, boxes and headings and all. */
function deunify() {
  for (const el of Array.from(
    document.querySelectorAll<HTMLElement>(`[${PASS_ATTR}], [${LABEL_ATTR}], [${UNIFIED_ATTR}]`),
  )) {
    el.removeAttribute(PASS_ATTR);
    el.removeAttribute(LABEL_ATTR);
    el.removeAttribute(UNIFIED_ATTR);
  }
  unified = false;
}

function teardown(container: HTMLElement) {
  if (!container.hasAttribute(READY)) return;
  container.removeAttribute(READY);
  for (const el of Array.from(container.querySelectorAll<HTMLElement>(`.${HEADER_CLASS}`))) {
    el.hidden = true;
  }
  for (const row of Array.from(container.querySelectorAll<HTMLElement>(`[${GROUP_ATTR}]`))) {
    row.style.order = '';
    row.classList.remove('sb-navhidden');
  }
}

let scheduled = false;
let applying = false;

/**
 * ⚠⚠ A KILL SWITCH, AND IT IS NOT DEFENSIVE PADDING.
 *
 * This code runs inside somebody else's React application on every render of
 * the Content Manager. If a Strapi upgrade changes the markup in a way that
 * makes this throw, it would otherwise throw on every keystroke of every
 * search, forever. After three failures it takes itself off and puts the nav
 * back the way Strapi rendered it — a flat list is a worse sidebar, a thrown
 * exception is a dead screen, and the flat list is the one to fall back to.
 */
let failures = 0;
let disabled = false;
let observer: MutationObserver | null = null;
let indexCache: Map<string, Place> | null = null;
let extrasCache: Extra[] | null = null;
/** Branch names that appear in BOTH nav lists, so their headings can say which. */
let sharedTops = new Set<string>();
/** Every content type the nav is showing, whichever list it is in. */
let presentUids = new Set<string>();

/**
 * ⚠⚠ THE PAGES GO IN THE **PAGES** LIST, NOT THE ONE THEIR RECORD LIVES IN.
 *
 * Career Guidance is a page. That it happens to be stored as a row inside the
 * Academic Topic collection is a fact about this CMS, not about the school's
 * website, and nobody in the office should have to know it to find the page.
 * Putting these rows beside the single types is what makes "Academics · pages"
 * mean all forty-five academics pages instead of the twenty-five that got
 * their own content type.
 *
 * ⚠ AND THEY APPEAR ONCE. Rendering them in both lists would put every page in
 * the column twice, which is the confusion the pages/lists labels exist to
 * settle. The collection side keeps only the real collections — Academic
 * Topic, Class Corner Documents, Class Timetable.
 */
const EXTRAS_KIND = 'single-types';

/** What a heading calls its list, in the school's words rather than Strapi's. */
const KIND_WORD: Record<string, string> = {
  'single-types': 'pages',
  'collection-types': 'lists',
};

function topsSharedAcross(
  byKind: Map<string, HTMLAnchorElement[]>,
  index: Map<string, Place>,
): Set<string> {
  const seen = new Map<string, Set<string>>();
  for (const [kind, links] of byKind) {
    const tops = new Set<string>();
    for (const a of links) {
      const place = placeOf(a.getAttribute('href') ?? '', index);
      if (place) tops.add(place.top);
    }
    /* Our own rows count too, and they are counted against the list they are
       actually drawn in — see EXTRAS_KIND. */
    if (kind === EXTRAS_KIND) {
      for (const e of extrasCache ?? []) {
        if (presentUids.has(e.uid)) tops.add(e.top);
      }
    }
    seen.set(kind, tops);
  }
  const lists = [...seen.values()];
  if (lists.length < 2) return new Set();
  return new Set([...lists[0]].filter((t) => lists.every((l) => l.has(t))));
}

/**
 * WHERE A COPY OF THIS MODULE ANNOUNCES ITSELF, SO THE NEXT ONE CAN RETIRE IT.
 *
 * TWO COPIES RUNNING AT ONCE IS NOT HYPOTHETICAL — it is what `strapi develop`
 * produces every time this file is edited. Vite hot-swaps the module, the new
 * copy installs, and the OLD copy's MutationObserver is still alive. Each has
 * its own `open` set and both write `hidden` and `aria-expanded` to the same
 * headings, so the sidebar ends up incoherent: a branch showing its
 * sub-headings while its own arrow says it is shut, and two top branches open
 * at once when only one should be.
 */
const INSTANCE = '__sbNavGrouping';

/**
 * Stand this copy down and put the nav back the way Strapi rendered it.
 *
 * THE HEADINGS ARE REMOVED, NOT JUST HIDDEN, AND THAT IS THE POINT. Every
 * click listener belongs to the copy that created the element. Leave them in
 * place and the replacement reuses them — so every click would keep calling a
 * module that has already switched itself off, which looks exactly like a
 * dropdown that does not open. Removing them forces fresh headings wired to
 * the live copy.
 *
 * Removing OUR OWN nodes is safe; React never knew about them. Nothing React
 * rendered is touched here beyond the attributes teardown() clears.
 */
function retire() {
  disabled = true;
  observer?.disconnect();
  observer = null;
  for (const c of Array.from(document.querySelectorAll<HTMLElement>(`[${READY}]`))) {
    try { teardown(c); } catch { /* already gone */ }
  }
  for (const h of Array.from(document.querySelectorAll(`.${HEADER_CLASS}`))) h.remove();
  lastMode = '';
  /* The merge is marks on React's own elements, so it outlives this module
     unless it is undone here — a retired copy would otherwise leave the two
     sections collapsed into a column with no headings to order them. */
  try { deunify(); } catch { /* the nav is already gone */ }
}

function pass() {
  scheduled = false;
  if (disabled || !indexCache) return;
  applying = true;
  try {
    /* ⚠⚠ OUR OWN ROWS ARE EXCLUDED, AND LEAVING THEM IN BREAKS THE OTHER LIST.
       They carry a collection-types href — that is what they link to — but they
       are DRAWN in the pages list. Counted as collection links they became the
       first "collection" the layout saw, so it took its container from the
       pages list and the real collection list was never grouped at all: every
       heading on that side vanished. They are ours and already placed; the
       scan is only looking for Strapi's. */
    const all = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/content-manager/single-types/"], a[href*="/content-manager/collection-types/"]',
      ),
    ).filter((a) => !a.classList.contains(EXTRA_CLASS));
    if (all.length === 0) return;

    /* Split by kind: it is still how the two containers are found, and it is
       the fallback layout if they cannot be merged. */
    /* ⚠⚠ WHICH BRANCH NAMES LAND IN BOTH LISTS, WORKED OUT BEFORE EITHER IS
       DRAWN. Strapi splits its nav in two — Collection Types above, Single
       Types below — and this file groups inside each of them, so a branch with
       items on both sides gets a heading twice. Academics does: twenty-five
       pages that are single types, and the collections beside them.

       Two headings reading ACADEMICS with nothing to tell them apart is the
       confusion. They CANNOT be merged into one: the two lists are separate
       containers React owns, and moving a row between them is the exact
       operation that used to crash the Content Manager (see the top of this
       file). So the heading says which list it is instead — and only where
       there is another one to be confused with. */
    const byKind = new Map<string, HTMLAnchorElement[]>();
    for (const kind of ['single-types', 'collection-types']) {
      byKind.set(kind, all.filter((a) => (a.getAttribute('href') ?? '').includes(`/${kind}/`)));
    }

    presentUids = new Set(
      all.map((a) => placeKeyOf(a.getAttribute('href') ?? '')).filter(Boolean) as string[],
    );

    /* ── One list if the markup allows it, two if it does not ─────────────
       ⚠ THE LISTS ARE FOUND FROM THE <ul>, NOT FROM THE LINKS. Taking each
       <ol> from the first link of its kind meant that a search matching only
       single types left the collection list with no links to find it by — so
       the merge silently dropped to the two-list fallback halfway through a
       word, and the headings changed shape as the editor typed. Strapi renders
       both sections whether or not they have any rows, so the containers are
       there to be found either way. */
    const firstRow = all[0]?.parentElement?.parentElement;
    const shared = firstRow instanceof HTMLElement ? firstRow.closest('ul') : null;
    const lists = shared
      ? Array.from(shared.querySelectorAll<HTMLElement>(':scope > li > * > ol'))
      : [];
    const merged = lists.length === 2 ? unify(lists) : null;
    unified = merged !== null;

    /* ⚠⚠ A CHANGE OF MODE HAS TO CLEAR THE OTHER MODE'S STATE FIRST. The rows
       carry `order` and the collapsed class, and those are written against
       whichever container laid them out. Switching without clearing them left
       every row still hidden under a key the new layout never renders — a
       sidebar of headings with nothing beneath any of them. */
    const mode = merged ? UNIFIED_KIND : 'split';
    if (mode !== lastMode) {
      for (const c of Array.from(document.querySelectorAll<HTMLElement>(`[${READY}]`))) {
        try { teardown(c); } catch { /* already gone */ }
      }
      lastMode = mode;
    }

    /* ⚠ AFTER `unified` IS SETTLED, because the key it opens has to match the
       one layOut is about to render. */
    autoOpenCurrent(indexCache);

    if (merged) {
      /* ⚠ NO "pages"/"lists" SUFFIX ONCE THERE IS ONE LIST. That word existed
         only to tell two identical headings apart, and telling the editor which
         half of Strapi's data model a page belongs to is the distinction this
         whole change exists to remove. */
      sharedTops = new Set();
      layOut(all, indexCache, UNIFIED_KIND, merged);
      return;
    }

    deunify();
    sharedTops = topsSharedAcross(byKind, indexCache);

    for (const [kind, links] of byKind) {
      if (links.length < 2) continue;
      layOut(links, indexCache, kind);
    }
  } catch (err) {
    /* Any surprise in Strapi's markup: leave the nav exactly as it was. */
    failures += 1;
    if (failures >= 3) {
      disabled = true;
      observer?.disconnect();
      for (const c of Array.from(document.querySelectorAll<HTMLElement>(`[${READY}]`))) {
        try { teardown(c); } catch { /* nothing left to do */ }
      }
      /* ⚠ THE MERGE COMES OFF WITH IT. Left on, the kill switch would hand back
         a nav with no headings AND no "Collection Types"/"Single Types" either
         — one unlabelled column of 75 links, which is worse than the flat list
         this is meant to fall back to. */
      try { deunify(); } catch { /* nothing left to do */ }
      /* eslint-disable-next-line no-console */
      console.warn('[sunbeam] sidebar grouping switched itself off after 3 errors:', err);
    }
  } finally {
    applying = false;
  }
}

function schedulePass() {
  if (disabled || scheduled) return;
  scheduled = true;
  requestAnimationFrame(pass);
}

/**
 * Watch for the Content Manager nav and group it whenever it appears.
 *
 * ⚠ THE OBSERVER IS NOT DISCONNECTED AROUND THE WORK ANY MORE, and does not
 * need to be: this pass only appends its own elements and sets attributes, so
 * the `applying` flag is enough to stop it re-entering. The old version had to
 * disconnect because it was restructuring React's DOM underneath it.
 */
export function installNavGrouping(): void {
  /* Retire whatever was running first — an older hot-swapped copy, or this
     one if bootstrap somehow ran twice. See INSTANCE above. */
  try {
    (window as unknown as Record<string, { retire?: () => void }>)[INSTANCE]?.retire?.();
  } catch { /* a previous copy that cannot clean up must not block this one */ }

  /* retire() may have just set these on THIS module, if it was the one
     running. Starting fresh is what makes a second install work. */
  disabled = false;
  failures = 0;

  try {
    indexCache = buildIndex();
    extrasCache = buildExtras();
  } catch {
    return; /* A malformed CONTENT_MAP must not take the admin down. */
  }
  if (indexCache.size === 0) return;

  observer = new MutationObserver(() => {
    if (applying) return;
    schedulePass();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  (window as unknown as Record<string, unknown>)[INSTANCE] = { retire };

  schedulePass();
}
