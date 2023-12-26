import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CloseIcon } from 'yet-another-react-lightbox';
import { z } from 'zod';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { StrapiMetaPagination } from '@/components/StrapiMetaPagination';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { getPostCategoryBySlug, getPostsByCategory } from '@/strapi/posts';
import { StrapiLocale, StrapiLocaleNames, toMetadata } from '@/strapi/strapi';
import { PostCard } from '../post-card';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale; categorySlug: string } }) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  if (!category) {
    notFound();
  }
  const metadata = toMetadata(category.attributes.seo);
  // eslint-disable-next-line no-unused-vars
  const languages: { [key in StrapiLocale]?: string } = {};
  category.attributes.localizations?.data
    ?.filter((localization) => localization.attributes.locale !== params.locale)
    .forEach(({ attributes }) => {
      languages[attributes.locale] = `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${attributes.slug}`;
    });
  return {
    ...metadata,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts/${params.categorySlug}`,
      languages,
    },
  } satisfies Metadata;
}

function LinksToOtherLocale({
  localizations,
}: {
  localizations: Array<{ id: number; attributes: { locale: StrapiLocale; slug: string } }>;
}) {
  return localizations.map(({ id, attributes }) => (
    <Link
      locale={attributes.locale}
      href={`/posts/${attributes.slug}`}
      hrefLang={attributes.locale}
      className={cn(buttonVariants({ variant: 'outline' }))}
      key={id}
    >
      {StrapiLocaleNames[attributes.locale]}
    </Link>
  ));
}

const ParamsSchema = z.object({ page: z.coerce.number().int().min(1).default(1) });
export default async function PostCategoryListPage({
  params,
  searchParams,
}: {
  searchParams: unknown;
  params: { categorySlug: string; locale: StrapiLocale };
}) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  if (!category) {
    notFound();
  }
  if (params.locale !== category.attributes.locale) {
    redirect(`/${category.attributes.locale}/posts/${category.attributes.slug}`); // redirect to the post with the same slug in the locale
  }

  const parsedSearchParams = ParamsSchema.safeParse(searchParams);
  let page = 1;
  if (parsedSearchParams.success) {
    page = parsedSearchParams.data.page;
  }
  const posts = await getPostsByCategory(category.id, category.attributes.locale, page);
  const t = await getTranslations({ locale: params.locale, namespace: 'posts' });

  return (
    <Main>
      <SingleBreadcrumbLdJson
        itemList={[
          { name: t('title'), item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts` },
          {
            name: category.attributes.title,
          },
        ]}
      />
      <LdJson structuredData={category.attributes.seo?.structuredData} />
      <div className="container py-8">
        <div className="flex justify-end">
          {category.attributes.localizations?.data && (
            <LinksToOtherLocale localizations={category.attributes.localizations?.data} />
          )}
        </div>
        <div className="mb-8 flex items-end">
          <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{category.attributes.title}</h1>
          <Link href="/posts" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
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
        <StrapiMetaPagination
          pagination={posts.meta.pagination}
          getHref={(page) => {
            if (page === 1) {
              return `/posts/${category.attributes.slug}`;
            }
            return `/posts/${category.attributes.slug}?page=${page}`;
          }}
          className="py-4"
        />
      </div>
    </Main>
  );
}
