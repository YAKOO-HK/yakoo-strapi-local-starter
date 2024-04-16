'use client';

import React, { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/navigation';
import { StrapiLocale } from '@/strapi/strapi';

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
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {locales.map(({ locale, label }, index) => (
        <React.Fragment key={index}>
          <Link
            href={{
              pathname,
              search: searchParams.toString(),
            }}
            className={cn('text-primary dark:text-white', linkClassName)}
            locale={locale}
          >
            {label}
          </Link>
          {index != locales.length - 1 ? separator : null}
        </React.Fragment>
      ))}
    </div>
  );
}
