import { withStrapi } from '../lib/strapi.mjs';
const route = process.argv[2];
await withStrapi(async (strapi) => {
  const r = await strapi.documents('api::academic-topic.academic-topic').findFirst({
    status: 'published', filters: { route },
    populate: { sections: { populate: { points: true, details: true, facts: true, body: true, streams: true, stats: true, photos: true, awards: true, stories: true, results: true, faqs: true } } },
  });
  console.log(`ROUTE ${route}  sections=${(r?.sections ?? []).length}`);
  for (const s of r?.sections ?? []) {
    const parts = ['points', 'details', 'facts', 'stats', 'photos', 'streams', 'awards', 'stories', 'results', 'faqs', 'body']
      .map((k) => ((s[k] ?? []).length ? `${k}=${s[k].length}` : null)).filter(Boolean).join(' ');
    console.log(`  ${s.key.padEnd(34)} ${parts}${s.heading ? ' head' : ''}`);
  }
});
