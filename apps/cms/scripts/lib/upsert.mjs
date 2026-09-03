/**
 * CREATE-OR-UPDATE ONE DOCUMENT, KEYED ON ITS SLUG.
 *
 * Extracted because every seed after notices upserts several content types in
 * one run, and three near-identical fifteen-line blocks in a file is how the
 * fourth one ends up subtly different from the other three.
 *
 * ⚠ NOT USED BY seed/notices.mjs, WHICH PREDATES IT AND STILL INLINES THIS.
 * Left alone deliberately: notices is the verified reference migration and
 * rewriting working, tested code to share a helper buys nothing today.
 *
 * ⚠ IT NEVER DELETES. An item removed from the source data file is left alone
 * in Strapi rather than destroyed — after go-live the CMS is the source of
 * truth, and a seed script must never be able to erase an editor's work.
 *
 * ═══ THE LOOKUP IS BY DRAFT, AND THAT IS A BUG FIX ═════════════════════════
 *
 * This originally looked documents up with `status: 'published'`, reasoning that
 * a seed should not resurrect something an editor had deliberately unpublished.
 * The reasoning was right; the implementation had a hole. In Strapi 5 an
 * unpublished document still EXISTS as a draft — it simply stops matching a
 * published-only query. So the next seed run found nothing, took the create
 * branch, and produced a SECOND document with the same slug. The seed was
 * idempotent only for as long as nobody used the unpublish button.
 *
 * Every document has a draft version, so looking up by draft always finds it.
 * The original intent is preserved separately, below: an existing document is
 * republished only if it was already published.
 */

/**
 * @param {object}  strapi
 * @param {string}  uid      e.g. 'api::credential.credential'
 * @param {string}  slug     stable identity
 * @param {object}  data     fields WITHOUT the slug — merged in here
 * @param {object} [opts]
 * @param {boolean}[opts.publish=true]  publish NEW documents. Existing ones keep
 *                                      whatever state they are already in.
 * @returns {Promise<'created'|'updated'|'created-draft'>}
 */
export async function upsertBySlug(strapi, uid, slug, data, opts = {}) {
  return upsertByKey(strapi, uid, 'slug', slug, data, opts);
}

/**
 * The same thing, keyed on any unique field.
 *
 * ⚠ NOT EVERY CONTENT TYPE HAS A `slug`. page-meta is identified by its ROUTE —
 * '/academics/philosophy/' — because that is what the page looks itself up by,
 * and inventing a parallel slug alongside it would give one row two identities
 * that could disagree. upsertBySlug is now a thin wrapper over this.
 *
 * @param {string} keyField  e.g. 'slug' | 'route'
 * @param {string} keyValue
 */
export async function upsertByKey(strapi, uid, keyField, keyValue, data, opts = {}) {
  const { publish = true } = opts;

  /* status: 'draft' matches every document, published or not — see the header. */
  const existing = await strapi.documents(uid).findFirst({
    filters: { [keyField]: keyValue },
    status: 'draft',
  });

  /* ⚠⚠ "IS IT PUBLISHED?" CANNOT BE ASKED OF THE DRAFT.
     A draft version's `publishedAt` is null BY DEFINITION in Strapi 5 — even
     when a published version of the same document exists alongside it. Reading
     `existing.publishedAt` off the draft therefore answers "no" every single
     time, which sent every update down the draft-only branch: the admin looked
     correct, the seed reported success, and the live site — which only ever sees
     the published version — silently kept its old content.
     The only reliable test is to ask for the published version explicitly. */
  const published = existing
    ? await strapi.documents(uid).findFirst({
        filters: { [keyField]: keyValue },
        status: 'published',
      })
    : null;

  if (existing) {
    /* ⚠⚠ ONE update() CALL, WITH THE RIGHT status — NOT update(draft) THEN
       publish().

       The previous version did exactly that, and it silently did not work:
       update({status:'draft'}) wrote the draft, publish() did NOT carry the new
       field values across, and the published row — the only one the read-only
       token can see — kept its old content. It looked completely fine. The seed
       reported "74 updated", the draft in the admin was correct, and the live
       site showed stale text. It surfaced only when a production diff found 47
       pages missing their standfirst.

       `update` with status 'published' writes the draft AND publishes it in one
       operation, which is what the original implementation did before this was
       "improved". */
    const isPublished = Boolean(published);

    await strapi.documents(uid).update({
      documentId: existing.documentId,
      data: { ...data, [keyField]: keyValue },
      /* An editor's deliberate unpublish is still respected: an unpublished
         document is updated as a draft and stays unpublished. */
      status: isPublished ? 'published' : 'draft',
    });

    return 'updated';
  }

  const created = await strapi.documents(uid).create({
    data: { ...data, [keyField]: keyValue },
    status: publish ? 'published' : 'draft',
  });

  return publish ? 'created' : 'created-draft';
}

export default upsertBySlug;

/**
 * CREATE-OR-UPDATE A SINGLE TYPE.
 *
 * A single type holds at most one document, so there is no slug to key on —
 * findFirst IS the lookup. Same publish rules as upsertBySlug: an existing
 * document keeps whatever state the editor left it in.
 *
 * @param {object} strapi
 * @param {string} uid
 * @param {object} data
 * @param {object} [opts]
 * @param {boolean} [opts.publish=true]
 * @returns {Promise<'created'|'updated'>}
 */
export async function upsertSingle(strapi, uid, data, opts = {}) {
  const { publish = true } = opts;

  const existing = await strapi.documents(uid).findFirst({ status: 'draft' });
  /* Same trap as upsertByKey: a draft's publishedAt is always null. */
  const existingPublished = existing
    ? await strapi.documents(uid).findFirst({ status: 'published' })
    : null;

  if (existing) {
    /* Same fix as upsertByKey — see the long note there. update(draft) followed
       by publish() does not carry field values to the published version. */
    await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
      status: existingPublished ? 'published' : 'draft',
    });
    return 'updated';
  }

  await strapi.documents(uid).create({
    data,
    status: publish ? 'published' : 'draft',
  });
  return 'created';
}
