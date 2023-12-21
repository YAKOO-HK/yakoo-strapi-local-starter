import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { env } from '@/env';
import { getPageBySlug } from '@/strapi/pages';
import { StrapiLocale, toMetadata } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale; pageSlug: string } }) {
  const page = await getPageBySlug(params.pageSlug);
  if (!page) {
    notFound();
  }
  const metadata = toMetadata(page.attributes.seo);
  // eslint-disable-next-line no-unused-vars
  const languages: { [key in StrapiLocale]?: string } = {};
  page.attributes.localizations?.data
    ?.filter((localization) => localization.attributes.locale !== params.locale)
    .forEach(({ attributes }) => {
      languages[attributes.locale] = `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/${attributes.slug}`;
    });
  // console.log(languages);
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages,
    },
  } satisfies Metadata;
}

export default async function SinglePagePage({ params }: { params: { pageSlug: string; locale: StrapiLocale } }) {
  const page = await getPageBySlug(params.pageSlug);
  if (!page) {
    notFound();
  }
  if (page.attributes.locale !== params.locale) {
    const localization = page.attributes.localizations?.data?.find(
      (localization) => localization.attributes.locale === params.locale
    );
    if (localization) {
      // redirect to the page to the correct locale
      redirect(`/${localization.attributes.locale}/${localization.attributes.slug}`);
    } else {
      redirect(`/${page.attributes.locale}/${page.attributes.slug}`);
    }
  }

  return (
    <Main>
      <SingleBreadcrumbLdJson itemList={[{ name: page.attributes.title }]} />
      <LdJson structuredData={page.attributes.seo?.structuredData} />
      <DynamicZone sections={page.attributes.sections || []} />
    </Main>
  );
}
