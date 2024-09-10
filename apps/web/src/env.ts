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
      .nonnegative()
      .default(60 * 60),
    STRAPI_CACHE_PERIOD_LONG: z.coerce
      .number()
      .int()
      .nonnegative()
      .default(60 * 60 * 24),
    TYPESENSE_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((val) => val === 'true'),
    TYPESENSE_HOST: z.string().trim().default('localhost'),
    TYPESENSE_PORT: z.coerce.number().int().nonnegative().default(8108),
    TYPESENSE_PROTOCOL: z.string().trim().default('http'),
    TYPESENSE_API_KEY: z.string().trim().default(''),
    TYPESENSE_COLLECTION_NAME: z.string().trim().default('langchain'),
    TYPESENSE_LLM_PROVIDER: z.enum(['bedrock', 'openai', 'cloudflare']).default('openai'),
    TYPESENSE_EMBEDDINGS_PROVIDER: z.enum(['bedrock', 'openai', 'cloudflare']).default('openai'),
    TYPESENSE_EMBEDDINGS_CACHE_PATH: z.string().trim().default('.cache/embeddings'),
    TYPESENSE_CONVERSATIONAL_RETRIEVAL_QA_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((val) => val === 'true'),
    OPENAI_API_KEY: z.string().trim().default(''),
    AWS_REGION: z.string().trim().default('us-east-1'),
    AWS_ACCESS_KEY_ID: z.string().trim().default(''),
    AWS_SECRET_ACCESS_KEY: z.string().trim().default(''),
    CLOUDFLARE_ACCOUNT_ID: z.string().trim().default(''),
    CLOUDFLARE_API_TOKEN: z.string().trim().default(''),
    CLOUDFLARE_TURNSTILE_SECRET: z.string().trim().min(1).default('1x00000000000000000000AA'),
    CLOUDFLARE_TURNSTILE_VERIFY_URL: z
      .string()
      .url()
      .default('https://challenges.cloudflare.com/turnstile/v0/siteverify'),
    HCAPTCHA_SECRET: z.string().min(1).default('0x0000000000000000000000000000000000000000'),
    HCAPTCHA_VERIFY_URL: z.string().url().default('https://hcaptcha.com/siteverify'),
    HCAPTCHA_SCORE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.5),
    INTERNAL_API_SECRET: z.string().trim(),
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
    NEXT_PUBLIC_CAPTCHA_PROVIDER: z.enum(['hcaptcha', 'turnstile']).default('hcaptcha'),
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: z.string().trim().default('10000000-ffff-ffff-ffff-000000000001'),
    NEXT_PUBLIC_TURNSTILE_SITEKEY: z.string().trim().default('1x00000000000000000000AA'),
    NEXT_PUBLIC_GSCE_API: z.string().trim().default(''),
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
    TYPESENSE_ENABLED: process.env.TYPESENSE_ENABLED,
    TYPESENSE_HOST: process.env.TYPESENSE_HOST,
    TYPESENSE_PORT: process.env.TYPESENSE_PORT,
    TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL,
    TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
    TYPESENSE_COLLECTION_NAME: process.env.TYPESENSE_COLLECTION_NAME,
    TYPESENSE_LLM_PROVIDER: process.env.TYPESENSE_LLM_PROVIDER,
    TYPESENSE_EMBEDDINGS_PROVIDER: process.env.TYPESENSE_EMBEDDINGS_PROVIDER,
    TYPESENSE_EMBEDDINGS_CACHE_PATH: process.env.TYPESENSE_EMBEDDINGS_CACHE_PATH,
    TYPESENSE_CONVERSATIONAL_RETRIEVAL_QA_ENABLED: process.env.TYPESENSE_CONVERSATIONAL_RETRIEVAL_QA_ENABLED,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_TURNSTILE_SECRET: process.env.CLOUDFLARE_TURNSTILE_SECRET,
    CLOUDFLARE_TURNSTILE_VERIFY_URL: process.env.CLOUDFLARE_TURNSTILE_VERIFY_URL,
    HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
    HCAPTCHA_VERIFY_URL: process.env.HCAPTCHA_VERIFY_URL,
    HCAPTCHA_SCORE_THRESHOLD: process.env.HCAPTCHA_SCORE_THRESHOLD,
    INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID,
    NEXT_PUBLIC_CAPTCHA_PROVIDER: process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER,
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
    NEXT_PUBLIC_TURNSTILE_SITEKEY: process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
    NEXT_PUBLIC_GSCE_API: process.env.NEXT_PUBLIC_GSCE_API,
  },
  emptyStringAsUndefined: true,
});
