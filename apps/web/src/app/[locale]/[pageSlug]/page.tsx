import { notFound, redirect } from 'next/navigation';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { getPageBySlug } from '@/strapi/pages';
import { StrapiLocale, toMetadata } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { pageSlug: string } }) {
  const page = await getPageBySlug(params.pageSlug);
  if (!page) {
    notFound();
  }
  return toMetadata(page.attributes.seo);
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
      <DynamicZone sections={page.attributes.sections || []} />
    </Main>
  );
}
