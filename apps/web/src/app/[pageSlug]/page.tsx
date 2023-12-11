import { notFound } from 'next/navigation';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { getPageBySlug } from '@/strapi/pages';
import { toMetadata } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { pageSlug: string } }) {
  const page = await getPageBySlug(params.pageSlug);
  if (!page) {
    notFound();
  }
  return toMetadata(page.attributes.seo);
}

export default async function SinglePagePage({ params }: { params: { pageSlug: string } }) {
  const page = await getPageBySlug(params.pageSlug);
  if (!page) {
    notFound();
  }
  return (
    <Main>
      <DynamicZone sections={page.attributes.sections || []} />
    </Main>
  );
}
