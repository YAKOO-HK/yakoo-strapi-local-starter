import createMiddleware from 'next-intl/middleware';
import { defaultLocale, localePrefix, locales } from './navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  localePrefix,
  // Used when no locale matches
  defaultLocale,
  alternateLinks: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|zh-Hant)/:path*'],
  // for as-need
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // '/((?!api|_next|_vercel|.*\\..*).*)',
};
