import { notFound } from 'next/navigation';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
// import { typographyVariants } from '@/components/ui/typography';
// import { cn } from '@/lib/utils';
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
      {/* <div className="container py-8">
        <h1 className={cn(typographyVariants({ variant: 'h1' }), 'mb-8 text-center')}>{page.attributes.title}</h1>
      </div> */}
      <DynamicZone sections={page.attributes.sections || []} />
    </Main>
  );
}
