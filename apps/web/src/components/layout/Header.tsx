import { Suspense } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TypesenseSearch } from '@/components/TypesenseSearch';
import { env } from '@/env';
import { Link, locales } from '@/i18n/routing';
import { isExternalLink } from '@/lib/link';
import { cn } from '@/lib/utils';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { type NavigationItem } from '@/strapi/navigation';
import { StrapiLocale, StrapiMedia } from '@/strapi/strapi';
import { InlineSearchForm } from './InlineSearchForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MainNavigation, MobileMainNavigation } from './MainNavigation';
import { MobileMenu } from './MobileMenu';

export function Header({
  logo,
  logo2,
  logo_link,
  logo2_link,
  navigationItems,
  locale,
}: {
  logo: StrapiMedia;
  logo2: StrapiMedia | null;
  logo_link: string | null;
  logo2_link: string | null;
  navigationItems: NavigationItem[];
  locale: StrapiLocale;
}) {
  const t = useTranslations('navigation');
  return (
    <>
      <header className="sticky top-0 z-30 hidden w-full bg-white shadow-md md:block">
        <div className="flex h-full items-start gap-4 px-4 py-2">
          <div className="flex-no-wrap flex items-center gap-2 self-stretch">
            <Link
              href={logo_link || '/'}
              target={logo_link && isExternalLink(logo_link) ? '_blank' : undefined}
              rel={logo_link && isExternalLink(logo_link) ? 'noopener noreferrer' : undefined}
            >
              <Image
                loader={StrapiImageLoader}
                src={logo.url}
                className={cn('block h-[48px] w-auto lg:h-[64px]')}
                width={(64 * logo.width) / logo.height}
                height={64}
                alt={logo.alternativeText || ''}
                priority
              />
              <span className="sr-only">Home</span>
            </Link>
            {logo2 && (
              <Link
                href={logo2_link || '/'}
                target={logo2_link && isExternalLink(logo2_link) ? '_blank' : undefined}
                rel={logo2_link && isExternalLink(logo2_link) ? 'noopener noreferrer' : undefined}
              >
                <Image
                  loader={StrapiImageLoader}
                  src={logo2.url}
                  className={cn('block h-[48px] w-auto lg:h-[64px]')}
                  width={(64 * logo2.width) / logo2.height}
                  height={64}
                  alt={logo2.alternativeText || ''}
                  priority
                />
              </Link>
            )}
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
      <header className="flex-no-wrap border-b-border sticky top-0 z-30 flex gap-4 border-b bg-white p-2 shadow-md md:hidden">
        <div className="flex-no-wrap flex flex-1 items-center gap-2 self-stretch">
          <Link
            href={logo_link || '/'}
            target={logo_link && isExternalLink(logo_link) ? '_blank' : undefined}
            rel={logo_link && isExternalLink(logo_link) ? 'noopener noreferrer' : undefined}
          >
            <Image
              loader={StrapiImageLoader}
              src={logo.url}
              className={cn('block h-[48px] w-auto')}
              width={(48 * logo.width) / logo.height}
              height={48}
              alt={logo.alternativeText || ''}
              priority
            />
            <span className="sr-only">Home</span>
          </Link>
          {logo2 && (
            <Link
              href={logo2_link || '/'}
              target={logo2_link && isExternalLink(logo2_link) ? '_blank' : undefined}
              rel={logo2_link && isExternalLink(logo2_link) ? 'noopener noreferrer' : undefined}
            >
              <Image
                loader={StrapiImageLoader}
                src={logo2.url}
                className={cn('block h-[48px] w-auto')}
                width={(48 * logo2.width) / logo2.height}
                height={48}
                alt={logo2.alternativeText || ''}
                priority
              />
            </Link>
          )}
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
