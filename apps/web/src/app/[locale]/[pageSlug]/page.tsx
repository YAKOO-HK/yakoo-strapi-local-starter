import { type Metadata } from 'next';
import { DynamicZone } from '@/components/DynamicZone';
import { SetUrlMap } from '@/components/layout/LanguageSwitcher';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { env } from '@/env';
import { getPageBySlug } from '@/strapi/pages';
import { StrapiLocale, toMetadata } from '@/strapi/strapi';

export async function generateMetadata(props: { params: Promise<{ locale: StrapiLocale; pageSlug: string }> }) {
  const params = await props.params;
  const page = await getPageBySlug(params.pageSlug, params.locale);
  const metadata = toMetadata(page.seo);
  const languages: { [key in StrapiLocale]?: string } = {};
  page.localizations
    ?.filter((localization) => localization.locale !== params.locale)
    .forEach((attributes) => {
      languages[attributes.locale] = `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/${attributes.slug}`;
    });
  // console.log(languages);
  return {
    ...metadata,
    alternates: {
      canonical: metadata.alternates?.canonical || `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/${params.pageSlug}`,
      languages,
    },
  } satisfies Metadata;
}

export default async function SinglePagePage(props: { params: Promise<{ pageSlug: string; locale: StrapiLocale }> }) {
  const params = await props.params;
  const page = await getPageBySlug(params.pageSlug, params.locale);
  return (
    <Main>
      <SetUrlMap
        pathname={`/${page.slug}`}
        entries={page.localizations?.map((l) => ({ locale: l.locale, path: `/${l.slug}` }))}
      />
      <SingleBreadcrumbLdJson itemList={[{ name: page.title }]} />
      <LdJson structuredData={page.seo?.structuredData} />
      <DynamicZone sections={page.sections || []} locale={params.locale} />
    </Main>
  );
}
