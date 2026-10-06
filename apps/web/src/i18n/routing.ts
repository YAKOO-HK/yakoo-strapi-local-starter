import { defineRouting } from 'next-intl/routing';
import type { StrapiLocale } from '@/strapi/strapi';

export const locales: StrapiLocale[] = ['en', 'zh-Hant'];
export const defaultLocale: StrapiLocale = 'en';
export const localePrefix: 'as-needed' | 'always' | 'never' = 'always';

export const routing = defineRouting({
  locales,
  localePrefix,
  defaultLocale,
  alternateLinks: true,
});
