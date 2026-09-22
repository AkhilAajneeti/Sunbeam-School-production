/**
 * SUNBEAM CONTENT — the site's own shape, as one page.
 *
 * Draws CONTENT_MAP as a tree of links into the Content Manager. Read-only: it
 * shows where things are and takes you there. It changes nothing.
 *
 * ⚠ PLAIN ELEMENTS AND CSS VARIABLES, NOT THE DESIGN SYSTEM'S LAYOUT PRIMITIVES.
 * This page has to keep working across admin upgrades, and a component API is a
 * larger surface to break than `--sunbeam-*` custom properties over Strapi's own
 * theme tokens. The tokens are read from the theme, so light and dark both work.
 *
 * ⚠ THE GROUPS ARE <details>, NOT A HAND-BUILT ACCORDION. Academics alone runs to
 * seven groups and thirty-odd pages; open all at once it is a wall, and the page
 * an editor uses every day should show them the part they are working in. A
 * native disclosure gives keyboard operation, the right ARIA and find-in-page
 * for free — a div with an onClick gives none of those and has to be maintained.
 *
 * ⚠ WHICH GROUPS ARE OPEN IS REMEMBERED. Someone editing Teaching & Learning all
 * afternoon should not reopen it on every visit. It is kept per browser in
 * localStorage, wrapped in try/catch because a locked-down browser throws on
 * access rather than returning nothing.
 */
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { CONTENT_MAP, type Branch, type Leaf } from './content-map';

const STORE = 'sunbeam.contentMap.open';

/** Read the remembered set. A browser that refuses storage simply starts shut. */
function readOpen(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORE);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeOpen(open: Set<string>) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify([...open]));
  } catch {
    /* Nothing to do — the page works, it just will not remember. */
  }
}

const card: React.CSSProperties = {
  background: 'var(--neutral0, #fff)',
  border: '1px solid var(--neutral150, #eaeaef)',
  borderRadius: 4,
  padding: '16px 20px 20px',
};

const leafLink: React.CSSProperties = {
  display: 'block',
  padding: '8px 10px',
  borderRadius: 4,
  textDecoration: 'none',
  color: 'var(--primary600, #4945ff)',
  fontSize: 14,
  lineHeight: 1.4,
};

const summaryStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  listStyle: 'none',
  padding: '7px 10px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  color: 'var(--neutral600, #666687)',
  userSelect: 'none',
};

/** The disclosure triangle, drawn rather than relying on the browser's marker. */
function Caret({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 0,
        height: 0,
        borderLeft: '5px solid currentColor',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        transform: open ? 'rotate(90deg)' : 'none',
        transition: 'transform 120ms ease',
        flex: '0 0 auto',
      }}
    />
  );
}

function Leaves({ items }: { items: Leaf[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((l) => (
        <li key={l.to}>
          <NavLink
            to={`/${l.to}`}
            style={leafLink}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--neutral100, #f6f6f9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontWeight: 600 }}>{l.label}</span>
            {l.note && (
              <span style={{ display: 'block', color: 'var(--neutral600, #666687)', fontWeight: 400, fontSize: 12, marginTop: 2 }}>
                {l.note}
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function SubGroup({
  parent, sub, isOpen, onToggle,
}: { parent: string; sub: Branch; isOpen: boolean; onToggle: (open: boolean) => void }) {
  const count = sub.leaves?.length ?? 0;
  return (
    <details
      open={isOpen}
      onToggle={(e) => onToggle((e.currentTarget as HTMLDetailsElement).open)}
      style={{ marginTop: 6 }}
    >
      <summary
        style={summaryStyle}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--neutral100, #f6f6f9)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <Caret open={isOpen} />
        <span style={{ flex: 1 }}>{sub.label}</span>
        <span
          style={{ fontWeight: 600, letterSpacing: 0, color: 'var(--neutral500, #8e8ea9)' }}
          aria-label={`${count} ${count === 1 ? 'page' : 'pages'}`}
        >
          {count}
        </span>
      </summary>
      <div style={{ paddingTop: 2 }} data-parent={parent}>
        {sub.leaves && <Leaves items={sub.leaves} />}
      </div>
    </details>
  );
}

function Group({
  branch, open, setOpen,
}: { branch: Branch; open: Set<string>; setOpen: (next: Set<string>) => void }) {
  const toggle = (key: string) => (isOpen: boolean) => {
    const next = new Set(open);
    if (isOpen) next.add(key); else next.delete(key);
    setOpen(next);
  };

  return (
    <section style={{ ...card, breakInside: 'avoid', marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--neutral800, #32324d)', margin: 0 }}>
        {branch.label}
      </h2>
      {branch.note && (
        <p style={{ color: 'var(--neutral600, #666687)', fontSize: 12, margin: '4px 0 12px' }}>{branch.note}</p>
      )}
      {!branch.note && <div style={{ height: 12 }} />}

      {branch.leaves && <Leaves items={branch.leaves} />}

      {branch.branches?.map((sub) => {
        const key = `${branch.label}/${sub.label}`;
        return (
          <SubGroup
            key={key}
            parent={branch.label}
            sub={sub}
            isOpen={open.has(key)}
            onToggle={toggle(key)}
          />
        );
      })}
    </section>
  );
}

export default function ContentMapPage() {
  const [open, setOpenState] = React.useState<Set<string>>(() => new Set());

  /* Read the remembered set after mount: the admin renders on the client, but
     reading storage during the first render is still the wrong place for it. */
  React.useEffect(() => { setOpenState(readOpen()); }, []);

  const setOpen = React.useCallback((next: Set<string>) => {
    setOpenState(next);
    writeOpen(next);
  }, []);

  /** Every group that has sub-groups, so "open all" knows what it is opening. */
  const allKeys = React.useMemo(
    () => CONTENT_MAP.flatMap((b) => (b.branches ?? []).map((s) => `${b.label}/${s.label}`)),
    [],
  );
  const allOpen = allKeys.length > 0 && allKeys.every((k) => open.has(k));

  return (
    <main style={{ padding: '32px 40px 56px', maxWidth: 1280, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--neutral800, #32324d)', margin: 0 }}>
        Sunbeam Content
      </h1>
      <p style={{ color: 'var(--neutral600, #666687)', margin: '6px 0 16px', maxWidth: '62ch', lineHeight: 1.5 }}>
        Everything on the website, arranged the way the website is arranged. Open
        a section to see its pages; every link opens the normal editor — this page
        only shows you where things live.
      </p>

      <button
        type="button"
        onClick={() => setOpen(allOpen ? new Set() : new Set(allKeys))}
        style={{
          marginBottom: 20,
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--neutral700, #4a4a6a)',
          background: 'var(--neutral0, #fff)',
          border: '1px solid var(--neutral200, #dcdce4)',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {allOpen ? 'Collapse all sections' : 'Open all sections'}
      </button>

      {/* Masonry-ish columns so the tall Academics card does not leave a gap. */}
      <div style={{ columnWidth: 380, columnGap: 16 }}>
        {CONTENT_MAP.map((b) => (
          <Group key={b.label} branch={b} open={open} setOpen={setOpen} />
        ))}
      </div>
    </main>
  );
}
