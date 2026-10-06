import * as rootParams from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // This typically corresponds to the `[locale]` segment
  const rootLocale = locale ? locale : await rootParams.locale();

  // Ensure that a valid locale is used
  const currLocale = hasLocale(routing.locales, rootLocale) ? rootLocale : routing.defaultLocale;

  return {
    locale: currLocale,
    messages: (await import(`../../messages/${currLocale}.json`)).default,
  };
});
