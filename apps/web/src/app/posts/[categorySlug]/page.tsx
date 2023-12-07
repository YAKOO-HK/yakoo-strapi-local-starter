import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { getPostCategoryBySlug } from '@/strapi/posts';
import { StrapiLocale, StrapiLocaleNames, toMetadata } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { categorySlug: string } }) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  if (!category) {
    notFound();
  }
  return toMetadata(category.attributes.seo);
}

function LinksToOtherLocale({
  localizations,
}: {
  localizations: Array<{ id: number; attributes: { locale: StrapiLocale; slug: string } }>;
}) {
  return localizations.map(({ id, attributes }) => (
    <Link
      href={`/posts/${attributes.slug}`}
      hrefLang={attributes.locale}
      className={cn(buttonVariants({ variant: 'outline' }))}
      key={id}
    >
      {StrapiLocaleNames[attributes.locale]}
    </Link>
  ));
}

export default async function PostCategoryListPage({ params }: { params: { categorySlug: string } }) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  if (!category) {
    notFound();
  }
  // console.log({ localizations: category.attributes.localizations?.data[0]?.attributes });
  return (
    <Main>
      <div className="container py-8">
        <div className="flex justify-end">
          {category.attributes.localizations?.data && (
            <LinksToOtherLocale localizations={category.attributes.localizations?.data} />
          )}
        </div>
        <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{category.attributes.title}</h1>
      </div>
    </Main>
  );
}
