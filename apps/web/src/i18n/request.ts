import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import type { StrapiLocale } from '@/strapi/strapi';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as StrapiLocale)) {
    locale = routing.defaultLocale;
  }
  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
