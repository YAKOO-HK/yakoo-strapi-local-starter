'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/navigation';
import { StrapiLocale } from '@/strapi/strapi';

export function LanguageSwitcher({
  locales,
}: {
  locales: { locale: StrapiLocale; label: string; current: boolean }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <div className="flex items-center gap-2">
      {locales.map(({ locale, label, current }) => (
        <Button key={locale} variant={current ? 'secondary' : 'outline'} asChild disabled={current}>
          <Link
            href={{
              pathname,
              search: searchParams.toString(),
            }}
            locale={locale}
          >
            {label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
