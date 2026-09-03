/** Remove the throwaway PDF the upload proof leaves in the Media Library. */
import { withStrapi } from '../lib/strapi.mjs';
await withStrapi(async (app) => {
  const files = await app.db.query('plugin::upload.file')
    .findMany({ where: { name: { $contains: 'precept-upload-proof' } } });
  for (const f of files) {
    await app.plugins.upload.services.upload.remove(f);
    console.log(`  removed ${f.name}  ${f.url}`);
  }
  if (!files.length) console.log('  nothing to remove');
});
