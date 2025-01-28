import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { StrapiLocale } from '../strapi/strapi';

export const locales: StrapiLocale[] = ['en', 'zh-Hant'];
export const defaultLocale: StrapiLocale = 'en';
export const localePrefix: 'as-needed' | 'always' | 'never' = 'always';

export const routing = defineRouting({
  locales,
  localePrefix,
  defaultLocale,
  alternateLinks: false,
});
const navigation = createNavigation(routing);

export const { Link, redirect, usePathname, useRouter } = navigation;
