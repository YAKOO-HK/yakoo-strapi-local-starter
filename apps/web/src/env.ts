import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Server-side Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    STRAPI_ADMIN_API_TOKEN: z.string().trim().min(1, 'STRAPI_ADMIN_API_TOKEN must be set'),
    STRAPI_CACHE_PERIOD: z.coerce
      .number()
      .int()
      .positive()
      .default(60 * 60),
    STRAPI_CACHE_PERIOD_LONG: z.coerce
      .number()
      .int()
      .positive()
      .default(60 * 60 * 24),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    // NextAuth
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_STRAPI_URL: z.string().url().default('http://localhost:1337'),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: z.string().trim().nullish(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    STRAPI_ADMIN_API_TOKEN: process.env.STRAPI_ADMIN_API_TOKEN,
    STRAPI_CACHE_PERIOD: process.env.STRAPI_CACHE_PERIOD,
    STRAPI_CACHE_PERIOD_LONG: process.env.STRAPI_CACHE_PERIOD_LONG,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID,
  },
  emptyStringAsUndefined: true,
});
