import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CloseIcon } from 'yet-another-react-lightbox';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { getPostCategoryBySlug, getPostsByCategory } from '@/strapi/posts';
import { StrapiLocale, StrapiLocaleNames, toMetadata } from '@/strapi/strapi';
import { PostCard } from '../post-card';

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
  const posts = await getPostsByCategory(category.id, category.attributes.locale, 1); // TODO: pagination
  // console.log({ posts });
  return (
    <Main>
      <div className="container py-8">
        <div className="flex justify-end">
          {category.attributes.localizations?.data && (
            <LinksToOtherLocale localizations={category.attributes.localizations?.data} />
          )}
        </div>
        <div className="mb-8 flex items-end">
          <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{category.attributes.title}</h1>
          <Link
            href={`/posts?locale=${category.attributes.locale}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          >
            <span className="sr-only">Back to All Posts</span>
            <CloseIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          {posts.data.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              locale={category.attributes.locale}
              categorySlug={category.attributes.slug}
            />
          ))}
        </div>
      </div>
    </Main>
  );
}
