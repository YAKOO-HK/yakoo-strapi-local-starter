import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Main } from '@/components/layout/Main';
import { typographyVariants } from '@/components/ui/typography';
import { env } from '@/env';
import { isExternalLink } from '@/lib/link';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { getMainNavigation, NavigationItem } from '@/strapi/navigation';
import { StrapiLocale } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'sitemap' });
  return {
    title: t('title'),
    description: '',
    openGraph: {
      title: t('title'),
      description: '',
    },
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/sitemap`,
      languages: {
        en: params.locale !== 'en' ? `${env.NEXT_PUBLIC_SITE_URL}/en/sitemap` : undefined,
        'zh-Hant': params.locale !== 'zh-Hant' ? `${env.NEXT_PUBLIC_SITE_URL}/zh-Hant/sitemap` : undefined,
      },
    },
  } satisfies Metadata;
}

export const revalidate = 0;

function renderNavItem(item: NavigationItem) {
  const isExternal = isExternalLink(item.path);
  if (!item.items?.length) {
    // no children
    return (
      <li key={item.id}>
        <Link
          href={item.path}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {item.title}
        </Link>
      </li>
    );
  }
  return (
    <li key={item.id}>
      <div>{item.title}</div>
      <ul>{item.items.map(renderNavItem)}</ul>
    </li>
  );
}
export default async function ({ params }: { params: { locale: StrapiLocale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'sitemap' });
  const nav = await getMainNavigation(params.locale);
  return (
    <Main>
      <div className="container py-8">
        <h1 className={cn(typographyVariants({ variant: 'h1' }), 'mb-4')}>{t('title')}</h1>
        <ul className="prose dark:prose-invert max-w-full">{nav.map(renderNavItem)}</ul>
      </div>
    </Main>
  );
}
