import { type Metadata } from 'next';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { env } from '@/env';
import { getHomepage } from '@/strapi/homepage';
import { StrapiLocale } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale } }) {
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

export default async function Home({ params }: { params: { locale: StrapiLocale } }) {
  const { attributes } = await getHomepage(params.locale);
  return (
    <Main>
      <DynamicZone sections={attributes.sections} />
    </Main>
  );
}
