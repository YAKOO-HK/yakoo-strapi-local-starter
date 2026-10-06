import type { MetadataRoute } from 'next';
import { env } from '@/env';
import { locales } from '@/i18n/routing';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: locales.map((locale) => new URL(`sitemap/${locale}.xml`, baseUrl).toString()),
  };
}
