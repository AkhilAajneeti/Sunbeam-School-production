/**
 * PLAN — give every extracted academics const an explicit destination.
 *
 *     npm run plan:academics
 *
 * ═══ WHY A PLANNER AND NOT JUST A SEED ═════════════════════════════════════
 *
 * 260 consts across 60 files is past the point where a person can hold the
 * mapping in their head, and past the point where a reviewer can check a seed by
 * reading it. So the routing is done by rule, and the rules print their own
 * decisions: `scripts/fixtures/academics-plan.md` says, for every single const,
 * where it went and why.
 *
 * That file is the artefact to review. The requirement is that **every source
 * field has one of these destinations**, and the plan states which:
 *
 *   · CMS      — a section part (points / details / facts / figures / stats /
 *                photos / body / note)
 *   · MEDIA    — a photograph, uploaded and linked
 *   · DERIVED  — computed from other content at render time
 *   · SITE     — already owned by Site Settings; a duplicate here, not content
 *   · DESIGN   — layout, animation, geometry, palette; stays in the component
 *
 * ⚠ NOTHING FALLS THROUGH. A const the rules cannot classify is reported under
 * UNCLASSIFIED and the plan is not complete until that list is empty. An
 * unclassified const is content about to be lost.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { classify } from '../lib/academics-map.mjs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const FIXTURE = resolve(HERE, '../fixtures/academics.json');
const OUT = resolve(HERE, '../fixtures/academics-plan.md');

const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));

/**
 * ⚠ THE RULES LIVE IN scripts/lib/academics-map.mjs AND ARE IMPORTED, NOT
 * COPIED. The planner, the seed and the verifier must agree by construction:
 * three copies of a classifier drift, and the drift shows up as content that the
 * plan says is migrated and the page renders empty.
 */
const buckets = { CMS: [], MEDIA: [], DERIVED: [], SITE: [], DESIGN: [], UNCLASSIFIED: [] };

for (const [file, consts] of Object.entries(fixture)) {
  for (const [name, value] of Object.entries(consts)) {
    const c = classify(value, { name });
    buckets[c.dest].push({ file, name, ...c });
  }
}

const total = Object.values(buckets).reduce((n, b) => n + b.length, 0);
const lines = [
  '# Academics — destination plan',
  '',
  `Every one of the ${total} extracted consts, and where it goes.`,
  '',
  '| Destination | Meaning | Count |',
  '|---|---|---|',
  `| CMS | a section part on an Academic Topic | ${buckets.CMS.length} |`,
  `| MEDIA | a photograph, uploaded and linked | ${buckets.MEDIA.length} |`,
  `| DERIVED | computed at render time, never stored | ${buckets.DERIVED.length} |`,
  `| SITE | Site Settings already owns it | ${buckets.SITE.length} |`,
  `| DESIGN | layout, geometry, palette — stays in code | ${buckets.DESIGN.length} |`,
  `| **UNCLASSIFIED** | **must be empty** | **${buckets.UNCLASSIFIED.length}** |`,
  '',
];

for (const [dest, rows] of Object.entries(buckets)) {
  if (!rows.length) continue;
  lines.push(`## ${dest} — ${rows.length}`, '');
  let lastFile = '';
  for (const r of rows.sort((a, b) => (a.file + a.name).localeCompare(b.file + b.name))) {
    if (r.file !== lastFile) { lines.push(`### \`${r.file}\``, ''); lastFile = r.file; }
    const n = r.count === undefined ? '' : ` ×${r.count}`;
    lines.push(`- \`${r.name}\`${r.part ? ` → **${r.part}**` : ''}${n} — ${r.why}`);
  }
  lines.push('');
}

writeFileSync(OUT, `${lines.join('\n')}\n`, 'utf8');

console.log(`
  ${total} consts planned

    CMS           ${String(buckets.CMS.length).padStart(4)}
    MEDIA         ${String(buckets.MEDIA.length).padStart(4)}
    DERIVED       ${String(buckets.DERIVED.length).padStart(4)}
    SITE          ${String(buckets.SITE.length).padStart(4)}
    DESIGN        ${String(buckets.DESIGN.length).padStart(4)}
    UNCLASSIFIED  ${String(buckets.UNCLASSIFIED.length).padStart(4)}${buckets.UNCLASSIFIED.length ? '   ← must reach zero' : ''}

  → ${relative(REPO, OUT).replace(/\\/g, '/')}
`);
