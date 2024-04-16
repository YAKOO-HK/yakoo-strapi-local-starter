import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { StrapiLocale } from './strapi/strapi';

export const locales: StrapiLocale[] = ['en', 'zh-Hant'];
export const defaultLocale: StrapiLocale = 'en';
export const localePrefix: 'as-needed' | 'always' | 'never' = 'always';

const navigation = createSharedPathnamesNavigation({ locales, localePrefix });

export const { Link, redirect, usePathname, useRouter } = navigation;
