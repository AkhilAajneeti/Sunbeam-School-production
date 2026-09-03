/** Read back what the G7 seed wrote — check 1. */
import { withStrapi } from '../lib/strapi.mjs';

const n = (x) => (Array.isArray(x) ? x.length : x ? 1 : 0);

await withStrapi(async (strapi) => {
  const out = [];

  const d = await strapi.documents('api::disclosure-page.disclosure-page').findFirst({
    status: 'published',
    populate: {
      sections: true, quickInfo: true, generalInformation: true,
      certificates: { populate: { file: true } },
      academicDocs: { populate: { file: true } },
      boardResults: { populate: { classX: true, classXii: true } },
      staffSummary: true, infrastructure: true,
      calloutPhoto: { populate: { image: true } },
    },
  });
  out.push('  DISCLOSURE');
  for (const k of ['sections', 'quickInfo', 'generalInformation', 'certificates', 'academicDocs', 'boardResults', 'staffSummary', 'infrastructure']) {
    out.push(`    ${k.padEnd(22)} ${n(d?.[k])}`);
  }
  out.push(`    ${'anchors'.padEnd(22)} ${(d?.sections ?? []).map((s) => s.anchor).join(' ')}`);
  out.push(`    ${'2025 X / XII'.padEnd(22)} ${d?.boardResults?.[0]?.classX?.registered}/${d?.boardResults?.[0]?.classX?.passed} @ ${d?.boardResults?.[0]?.classX?.percentage}%  ·  ${d?.boardResults?.[0]?.classXii?.registered}/${d?.boardResults?.[0]?.classXii?.passed} @ ${d?.boardResults?.[0]?.classXii?.percentage}%`);
  out.push(`    ${'callout photo'.padEnd(22)} ${d?.calloutPhoto?.image ? 'yes' : 'MISSING'}`);
  out.push(`    ${'inspection video'.padEnd(22)} ${d?.inspectionVideo ? 'set' : 'MISSING'}`);

  const teachers = await strapi.documents('api::teacher.teacher').findMany({
    status: 'published', pagination: { limit: 500 }, sort: ['filedOrder:asc'],
  });
  const designations = [...new Set(teachers.map((t) => t.designation))];
  out.push(`\n  TEACHERS  ${teachers.length}`);
  out.push(`    designations  ${designations.length} — ${designations.join(', ')}`);
  out.push(`    first         #${teachers[0]?.filedOrder} ${teachers[0]?.name} · ${teachers[0]?.designation}`);
  out.push(`    last          #${teachers.at(-1)?.filedOrder} ${teachers.at(-1)?.name} · ${teachers.at(-1)?.designation}`);

  const u = await strapi.documents('api::uniform-page.uniform-page').findFirst({
    status: 'published',
    populate: { catalogues: { populate: { file: true } }, classGroups: true, seasons: true, shoeRows: true, notes: true },
  });
  out.push(`\n  UNIFORM`);
  out.push(`    catalogues            ${n(u?.catalogues)} (${(u?.catalogues ?? []).filter((c) => c.file).length} with a file)`);
  for (const c of u?.catalogues ?? []) out.push(`      ${c.title.padEnd(42)} ${c.file ? c.file.name : 'NO FILE'}`);
  out.push(`    classGroups           ${n(u?.classGroups)}`);
  out.push(`    seasons               ${n(u?.seasons)}`);
  out.push(`    shoeRows              ${n(u?.shoeRows)}`);
  out.push(`    notes                 ${n(u?.notes)}`);

  const r = await strapi.documents('api::result-page.result-page').findFirst({ status: 'published', populate: { points: true } });
  out.push(`\n  RESULT    points ${n(r?.points)}  cta "${r?.ctaLabel}"`);

  const t = await strapi.documents('api::tc-page.tc-page').findFirst({ status: 'published', populate: { help: true } });
  out.push(`  TC        help ${n(t?.help)}  submit "${t?.submitLabel}"`);

  const c = await strapi.documents('api::contact-page.contact-page').findFirst({
    status: 'published', populate: { fields: true, classOptions: true },
  });
  out.push(`  CONTACT   fields ${n(c?.fields)}  classes ${n(c?.classOptions)}  heading "${c?.heading}"`);

  console.log(`\n${out.join('\n')}\n`);
});
