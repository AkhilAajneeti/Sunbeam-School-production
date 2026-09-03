import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },

      /**
       * ⚠ THESE WIDTHS ARE THE SITE'S WIDTHS, NOT STRAPI'S DEFAULTS.
       *
       * Strapi ships large:1000 / medium:750 / small:500. The site asks for
       * different numbers — NoticePage.astro requests widths [420, 760, 1100]
       * for the poster and [48] for the blurred backdrop behind it — so the
       * defaults would have the browser downscaling a 1000px file into a
       * 1100px slot, which is the one direction that visibly softens an image.
       *
       * Matching them here means Strapi generates exactly what the markup asks
       * for, and the Astro build never has to process an image at all. That is
       * the whole point: 8,328 build-time variants become zero.
       *
       * ⚠ CHANGING A NUMBER HERE DOES NOT REGENERATE EXISTING FILES. Strapi
       * derives formats once, at upload. Re-running the seed with
       * `--force-media` re-uploads and re-derives.
       */
      breakpoints: {
        xlarge: 1600,
        large: 1100,
        medium: 760,
        small: 420,
        xsmall: 64,
      },
    },
  },
});

export default config;
