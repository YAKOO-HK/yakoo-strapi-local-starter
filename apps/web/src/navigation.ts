import { RedirectType, useRouter as useNextRouter } from 'next/navigation';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { StrapiLocale } from './strapi/strapi';

export const locales: StrapiLocale[] = ['en', 'zh-Hant'];
export const defaultLocale: StrapiLocale = 'en';
export const localePrefix: 'as-needed' | 'always' | 'never' = 'always';

const navigation: {
  Link: (
    // eslint-disable-next-line no-unused-vars
    props: Omit<
      Omit<
        Omit<
          Omit<
            Omit<
              React.AnchorHTMLAttributes<HTMLAnchorElement>,
              keyof {
                href: string | import('url').UrlObject;
                as?: (string | import('url').UrlObject) | undefined;
                replace?: boolean | undefined;
                scroll?: boolean | undefined;
                shallow?: boolean | undefined;
                passHref?: boolean | undefined;
                prefetch?: boolean | undefined;
                locale?: string | false | undefined;
                legacyBehavior?: boolean | undefined;
                onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
                onTouchStart?: React.TouchEventHandler<HTMLAnchorElement> | undefined;
                onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
              }
            > & {
              href: string | import('url').UrlObject;
              as?: (string | import('url').UrlObject) | undefined;
              replace?: boolean | undefined;
              scroll?: boolean | undefined;
              shallow?: boolean | undefined;
              passHref?: boolean | undefined;
              prefetch?: boolean | undefined;
              locale?: string | false | undefined;
              legacyBehavior?: boolean | undefined;
              onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
              onTouchStart?: React.TouchEventHandler<HTMLAnchorElement> | undefined;
              onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
            } & {
              children?: React.ReactNode;
            } & React.RefAttributes<HTMLAnchorElement>,
            'locale'
          > & {
            locale: string;
            localePrefix?: 'as-needed' | 'always' | 'never' | undefined;
          },
          'ref'
        > &
          React.RefAttributes<HTMLAnchorElement>,
        'locale'
      > & {
        locale?: (typeof locales)[number] | undefined;
      } & {
        ref?: React.Ref<HTMLAnchorElement> | undefined;
      },
      'localePrefix'
    > & {
      ref?: React.Ref<HTMLAnchorElement> | undefined;
    }
  ) => React.ReactElement;
  // eslint-disable-next-line no-unused-vars
  redirect: (pathname: string, type?: RedirectType) => never;
  usePathname: () => string;
  useRouter: typeof useNextRouter;
} = createSharedPathnamesNavigation({ locales, localePrefix });

export const { Link, redirect, usePathname, useRouter } = navigation;
