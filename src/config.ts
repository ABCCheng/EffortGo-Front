import { figue } from 'figue';

export const config = figue({
  app: {
    version: {
      doc: 'Application current version',
      format: 'string',
      default: '2024.11.21-2.0.0',
      env: 'PACKAGE_VERSION',
    },
    baseUrl: {
      doc: 'Application base url',
      format: 'string',
      default: '/',
      env: 'BASE_URL',
    },
    env: {
      doc: 'Application current env',
      format: 'enum',
      values: ['production', 'development', 'preview', 'test'],
      default: 'development',
      env: 'VITE_VERCEL_ENV',
    },
  },
  showBanner: {
    doc: 'Show the banner',
    format: 'boolean',
    default: true,
    env: 'VITE_SHOW_BANNER',
  },
  showSponsorBanner: {
    doc: 'Show the sponsor banner',
    format: 'boolean',
    default: true,
    env: 'VITE_SHOW_SPONSOR_BANNER',
  },
})
  .loadEnv({
    ...import.meta.env,
    PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
  })
  .validate()
  .getConfig();
