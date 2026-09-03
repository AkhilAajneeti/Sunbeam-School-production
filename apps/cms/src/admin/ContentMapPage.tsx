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
 */
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { CONTENT_MAP, type Branch, type Leaf } from './content-map';

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

function Group({ branch }: { branch: Branch }) {
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

      {branch.branches?.map((sub) => (
        <div key={sub.label} style={{ marginTop: 14 }}>
          <h3 style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--neutral600, #666687)', margin: '0 0 4px', paddingLeft: 10,
          }}>
            {sub.label}
          </h3>
          {sub.leaves && <Leaves items={sub.leaves} />}
        </div>
      ))}
    </section>
  );
}

export default function ContentMapPage() {
  return (
    <main style={{ padding: '32px 40px 56px', maxWidth: 1280, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--neutral800, #32324d)', margin: 0 }}>
        Sunbeam Content
      </h1>
      <p style={{ color: 'var(--neutral600, #666687)', margin: '6px 0 24px', maxWidth: '62ch', lineHeight: 1.5 }}>
        Everything on the website, arranged the way the website is arranged. Every
        link opens the normal editor — this page only shows you where things live.
      </p>

      {/* Masonry-ish columns so the tall Academics card does not leave a gap. */}
      <div style={{ columnWidth: 380, columnGap: 16 }}>
        {CONTENT_MAP.map((b) => <Group key={b.label} branch={b} />)}
      </div>
    </main>
  );
}
