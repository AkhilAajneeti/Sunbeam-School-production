import { withStrapi } from '../lib/strapi.mjs';
await withStrapi(async (app) => {
  const [t] = await app.documents('api::academic-topic.academic-topic').findMany({
    filters:{ route:'/academics/parent-partnership/' }, populate:{ sections:{ fields:['key','label'] } }, status:'published' });
  console.log('how the rows will now read:');
  for (const s of (t.sections ?? []).slice(0, 8)) console.log('   ', String(s.label).padEnd(34), '   (key: ' + s.key + ')');
  const tp = await app.documents('api::teaching-philosophy-page.teaching-philosophy-page').findFirst({
    populate: { sectionOne:{populate:{body:true,image:{fields:['name']}}}, sectionThree:{populate:{cards:{populate:{icon:{fields:['name']}}}}} }, status:'published' });
  console.log('\nTeaching Philosophy stored:');
  console.log('   01 kicker :', tp.sectionOne?.kicker);
  console.log('   01 heading:', tp.sectionOne?.heading, '+', tp.sectionOne?.headingEm);
  console.log('   01 body   :', (tp.sectionOne?.body ?? []).length, 'paragraph(s)');
  console.log('   01 image  :', tp.sectionOne?.image?.name);
  console.log('   03 cards  :', (tp.sectionThree?.cards ?? []).map(c => c.label).join(', '));
});
