import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },

  /**
   * ⚠ THE DEV WATCHER RESTARTS ON *ANY* FILE CHANGE UNDER apps/cms, AND EVERY
   * RESTART CLEANS dist/ AND REGENERATES types/generated/.
   *
   * That is fine for src/ and config/, which is what it is for. It is not fine
   * for the directories below: editing a seed script, writing a database dump or
   * regenerating a fixture would tear down and rebuild the running server for no
   * reason — and a rebuild is precisely the window in which this project has
   * twice lost content (docs/09). Restarts should happen when the application
   * changes, not when a tool beside it does.
   *
   * ⚠ PATHS ARE MATCHED AS REGULAR EXPRESSIONS against the absolute path, so
   * the separators are written to accept both / and \.
   */
  watchIgnoreFiles: [
    '.*[\\\\/]scripts[\\\\/].*',
    '.*[\\\\/]backups[\\\\/].*',
    '.*[\\\\/]docs[\\\\/].*',
    '.*[\\\\/]\\.strapi-develop\\.lock$',
  ],
});

export default config;
