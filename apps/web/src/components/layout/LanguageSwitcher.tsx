'use client';

import { Fragment, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { StrapiLocale } from '@/strapi/strapi';

const UrlMap = atom<Record<string, Array<{ locale: StrapiLocale; path: string }>>>({});

export function SetUrlMap({
  pathname,
  entries,
}: {
  pathname: string;
  entries?: Array<{ locale: StrapiLocale; path: string }>;
}) {
  // console.log('SetUrlMap', pathname, entries);
  const setUrlMap = useSetAtom(UrlMap);
  useEffect(() => {
    setUrlMap((prev) => ({ ...prev, [pathname]: entries ?? [] }));
  }, [pathname, entries, setUrlMap]);
  return null;
}

export function LanguageSwitcher({
  className,
  linkClassName,
  locales,
  separator = <div className="h-full w-px bg-black dark:bg-white" />,
}: {
  className?: string;
  linkClassName?: string;
  locales: { locale: StrapiLocale; label: string; current: boolean }[];
  separator?: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const otherLocales = useAtomValue(UrlMap)[pathname] || [];
  // console.log('switcher', pathname, otherLocales);
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {locales.map(({ locale, label }, index) => (
        <Fragment key={index}>
          <Link
            href={{
              pathname: otherLocales.find((entry) => entry.locale === locale)?.path || pathname,
              search: searchParams.toString(),
            }}
            className={cn('text-primary dark:text-white', linkClassName)}
            locale={locale}
          >
            {label}
          </Link>
          {index != locales.length - 1 ? separator : null}
        </Fragment>
      ))}
    </div>
  );
}
