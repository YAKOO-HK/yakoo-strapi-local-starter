import { Suspense } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TypesenseSearch } from '@/components/TypesenseSearch';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { Link, locales } from '@/navigation';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { type NavigationItem } from '@/strapi/navigation';
import { StrapiLocale, StrapiMedia } from '@/strapi/strapi';
import { InlineSearchForm } from './InlineSearchForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MainNavigation, MobileMainNavigation } from './MainNavigation';
import { MobileMenu } from './MobileMenu';

export function Header({
  logo,
  navigationItems,
  locale,
}: {
  logo: StrapiMedia;
  navigationItems: NavigationItem[];
  locale: StrapiLocale;
}) {
  const t = useTranslations('navigation');
  return (
    <>
      <header className={cn('hidden w-full bg-white shadow-md md:block')}>
        <div className="flex h-full items-start gap-4 px-4 py-2">
          <div className="md:pt-8 lg:pt-6 xl:pt-4">
            <Link href="/">
              <Image
                loader={StrapiImageLoader}
                src={logo.attributes.url}
                className={cn('block h-[48px] w-auto lg:h-[64px]')}
                width={(64 * logo.attributes.width) / logo.attributes.height}
                height={64}
                alt={logo.attributes.alternativeText || ''}
                priority
              />
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col items-end gap-4">
            <div className="flex flex-1 flex-row items-center gap-8 px-3">
              {/* <Link className="text-primary dark:text-white" href="/text-size">
                Text Size
              </Link> */}
              <Suspense>
                <LanguageSwitcher
                  locales={locales.map((code) => ({
                    locale: code,
                    label: t(`locales.${code}`),
                    current: locale === code,
                  }))}
                  separator={<div className="bg-primary h-full w-px" />}
                  className="h-6"
                  linkClassName="text-primary font-medium"
                />
              </Suspense>
              {env.TYPESENSE_ENABLED ? <TypesenseSearch /> : <InlineSearchForm locale={locale} />}
            </div>
            <MainNavigation items={navigationItems} className="grow" />
          </div>
        </div>
      </header>
      <header className="border-b-border flex-no-wrap flex gap-4 border-b p-2 shadow-md md:hidden">
        <div className="flex-1">
          <Link href="/">
            <Image
              loader={StrapiImageLoader}
              src={logo.attributes.url}
              width={(48 * logo.attributes.width) / logo.attributes.height}
              height={48}
              alt={logo.attributes.alternativeText || ''}
              priority
            />
          </Link>
        </div>
        <MobileMenu>
          <div className="py-6">
            <Suspense>
              <LanguageSwitcher
                locales={locales.map((code) => ({
                  locale: code,
                  label: t(`locales.${code}`),
                  current: locale === code,
                }))}
                separator={<div className="bg-primary h-full w-px" />}
                className="h-6"
                linkClassName="text-primary dark:text-primary"
              />
            </Suspense>
            <div className="mt-3">
              {env.TYPESENSE_ENABLED ? <TypesenseSearch /> : <InlineSearchForm locale={locale} variant="mobile" />}
            </div>
          </div>
          <MobileMainNavigation items={navigationItems} />
        </MobileMenu>
      </header>
    </>
  );
}
