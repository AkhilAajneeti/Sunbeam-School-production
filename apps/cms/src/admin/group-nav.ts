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

interface Place {
  /** The top-level branch — About Us, Academics, Campus … */
  top: string;
  /** The branch below it, where CONTENT_MAP has one. Academics has seven. */
  sub: string | null;
}

/** Collapsed group keys, kept for the life of the page. */
const collapsed = new Set<string>();

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

/** Where a link belongs, or null if CONTENT_MAP does not mention it. */
function placeOf(href: string, index: Map<string, Place>): Place | null {
  const m = href.match(/\/content-manager\/(?:single|collection)-types\/([^/?#]+)/);
  if (!m) return null;
  return index.get(decodeURIComponent(m[1])) ?? null;
}

/** A stable key for a group, safe to put in an attribute selector. */
const keyOf = (top: string, sub: string | null) =>
  `${top}${sub ? '\u203a' + sub : ''}`.replace(/["\\]/g, '');

function styleOnce() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  /* Deliberately minimal: the links keep Strapi's own styling, and only the
     heading row is ours. Anything more would drift from the admin theme. */
  el.textContent = `
    [${READY}] { display: flex; flex-direction: column; }

    .${HEADER_CLASS} {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      margin-top: 2px;
      border: 0;
      background: none;
      text-align: left;
      font: inherit;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--sb-nav-muted, #8e8ea9);
      border-radius: 4px;
    }
    .${HEADER_CLASS}:hover { background: rgba(255,255,255,.04); }
    .${HEADER_CLASS}::before {
      content: '\\25B8';
      display: inline-block;
      transition: transform .15s ease;
      font-size: 10px;
    }
    .${HEADER_CLASS}[aria-expanded="true"]::before { transform: rotate(90deg); }
    .${HEADER_CLASS}--sub {
      padding-left: 26px;
      font-size: 10.5px;
      letter-spacing: .04em;
      text-transform: none;
      font-weight: 600;
      opacity: .92;
    }
    .${HEADER_CLASS}__n { margin-left: auto; font-weight: 600; opacity: .65; }

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
function layOut(links: HTMLAnchorElement[], index: Map<string, Place>): void {
  const container = links[0]?.parentElement?.parentElement;
  if (!container) return;

  const rows = links
    .map((a) => {
      /* The <a> sits inside a wrapper (<li>); the wrapper is what carries the
         list's own spacing and active state, so that is what gets ordered. */
      const row = (a.parentElement && a.parentElement !== container ? a.parentElement : a) as HTMLElement;
      return { a, row };
    })
    .filter(({ row }) => row.parentElement === container);

  if (rows.length < 2) return;

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
     DOM — and so a collapsed group stays collapsed while you type. */
  const existing = new Map<string, HTMLElement>();
  for (const h of Array.from(container.querySelectorAll<HTMLElement>(`.${HEADER_CLASS}`))) {
    existing.set(h.dataset.sbKey ?? '', h);
  }
  const used = new Set<string>();

  const header = (key: string, label: string, count: number, depth: 1 | 2, order: number) => {
    let el = existing.get(key);
    if (!el) {
      el = document.createElement('button');
      el.type = 'button';
      el.className = `${HEADER_CLASS}${depth === 2 ? ` ${HEADER_CLASS}--sub` : ''}`;
      el.dataset.sbKey = key;
      el.addEventListener('click', () => {
        if (collapsed.has(key)) collapsed.delete(key);
        else collapsed.add(key);
        schedulePass();
      });
      /* ⚠ APPENDED, NEVER INSERTED BETWEEN REACT'S CHILDREN. React's nodes stay
         a contiguous block at the front of the container; `order` is what puts
         these where they read. */
      container.appendChild(el);
    }
    el.className = `${HEADER_CLASS}${depth === 2 ? ` ${HEADER_CLASS}--sub` : ''}`;
    el.textContent = label;
    const n = document.createElement('span');
    n.className = `${HEADER_CLASS}__n`;
    n.textContent = String(count);
    el.appendChild(n);
    el.setAttribute('aria-expanded', collapsed.has(key) ? 'false' : 'true');
    el.style.order = String(order);
    el.hidden = count === 0;
    used.add(key);
    return el;
  };

  let order = 0;

  for (const topLabel of topOrder) {
    const subs = tops.get(topLabel)!;
    const total = [...subs.values()].reduce((t, r) => t + r.length, 0);
    const topKey = keyOf(topLabel, null);
    header(topKey, topLabel, total, 1, order++);

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
      const subKey = subLabel ? keyOf(topLabel, subLabel) : topKey;

      if (subLabel) header(subKey, subLabel, group.length, 2, order++);

      const hidden = collapsed.has(topKey) || (subLabel ? collapsed.has(subKey) : false);
      for (const { row } of group) {
        row.style.order = String(order++);
        row.setAttribute(GROUP_ATTR, subKey);
        row.classList.toggle('sb-navhidden', hidden);
        if (subLabel) row.style.paddingLeft = '14px';
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
function teardown(container: HTMLElement) {
  if (!container.hasAttribute(READY)) return;
  container.removeAttribute(READY);
  for (const el of Array.from(container.querySelectorAll<HTMLElement>(`.${HEADER_CLASS}`))) {
    el.hidden = true;
  }
  for (const row of Array.from(container.querySelectorAll<HTMLElement>(`[${GROUP_ATTR}]`))) {
    row.style.order = '';
    row.style.paddingLeft = '';
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

function pass() {
  scheduled = false;
  if (disabled || !indexCache) return;
  applying = true;
  try {
    const all = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/content-manager/single-types/"], a[href*="/content-manager/collection-types/"]',
      ),
    );
    if (all.length === 0) return;

    /* Split by kind: the two lists are separate sections and must stay so. */
    for (const kind of ['single-types', 'collection-types']) {
      const links = all.filter((a) => (a.getAttribute('href') ?? '').includes(`/${kind}/`));
      if (links.length < 2) continue;
      layOut(links, indexCache);
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
  try {
    indexCache = buildIndex();
  } catch {
    return; /* A malformed CONTENT_MAP must not take the admin down. */
  }
  if (indexCache.size === 0) return;

  observer = new MutationObserver(() => {
    if (applying) return;
    schedulePass();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  schedulePass();
}
