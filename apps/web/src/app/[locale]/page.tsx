import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { env } from '@/env';
import { locales } from '@/i18n/routing';
import { getHomepage } from '@/strapi/homepage';
import { StrapiLocale } from '@/strapi/strapi';

export async function generateMetadata(props: { params: Promise<{ locale: StrapiLocale }> }) {
  const params = await props.params;
  if (!locales.includes(params.locale)) {
    notFound();
  }
  return {
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}`,
      languages: {
        en: params.locale !== 'en' ? `${env.NEXT_PUBLIC_SITE_URL}/en` : undefined,
        'zh-Hant': params.locale !== 'zh-Hant' ? `${env.NEXT_PUBLIC_SITE_URL}/zh-Hant` : undefined,
      },
    },
  } satisfies Metadata;
}

export default async function Home(props: { params: Promise<{ locale: StrapiLocale }> }) {
  const params = await props.params;
  if (!locales.includes(params.locale)) {
    notFound();
  }
  const { sections } = await getHomepage(params.locale);
  return (
    <Main>
      <DynamicZone sections={sections} locale={params.locale} />
    </Main>
  );
}
