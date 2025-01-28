import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CloseIcon } from 'yet-another-react-lightbox';
import { z } from 'zod';
import { SetUrlMap } from '@/components/layout/LanguageSwitcher';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { StrapiMetaPagination } from '@/components/StrapiMetaPagination';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { env } from '@/env';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getPostCategoryBySlug, getPostsByCategory } from '@/strapi/posts';
import { StrapiLocale, toMetadata } from '@/strapi/strapi';
import { PostCard } from '../post-card';

export async function generateMetadata(props: { params: Promise<{ locale: StrapiLocale; categorySlug: string }> }) {
  const params = await props.params;
  const category = await getPostCategoryBySlug(params.categorySlug, params.locale);
  const metadata = toMetadata(category.seo);
  const languages: { [key in StrapiLocale]?: string } = {};
  category.localizations
    ?.filter((localization) => localization.locale !== params.locale)
    .forEach((attributes) => {
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

const ParamsSchema = z.object({ page: z.coerce.number().int().min(1).default(1) });
export default async function PostCategoryListPage(props: {
  searchParams: Promise<unknown>;
  params: Promise<{ categorySlug: string; locale: StrapiLocale }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const category = await getPostCategoryBySlug(params.categorySlug, params.locale);
  const parsedSearchParams = ParamsSchema.safeParse(searchParams);
  const page = parsedSearchParams.success ? parsedSearchParams.data.page : 1;
  const posts = await getPostsByCategory(category.documentId, category.locale, page);
  const t = await getTranslations({ locale: params.locale, namespace: 'posts' });

  return (
    <Main>
      <SetUrlMap
        pathname={`/posts/${category.slug}`}
        entries={category.localizations?.map((l) => ({ locale: l.locale, path: `/posts/${l.slug}` }))}
      />
      <SingleBreadcrumbLdJson
        itemList={[
          { name: t('title'), item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts` },
          {
            name: category.title,
          },
        ]}
      />
      <LdJson structuredData={category.seo?.structuredData} />
      <div className="container py-8">
        <div className="mb-8 flex items-end">
          <h1 className={cn(typographyVariants({ variant: 'h1' }))}>{category.title}</h1>
          <Link href="/posts" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
            <span className="sr-only">Back to All Posts</span>
            <CloseIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          {posts.data.map((post) => (
            <PostCard post={post} key={post.id} locale={category.locale} categorySlug={category.slug} />
          ))}
        </div>
        <StrapiMetaPagination
          pagination={posts.meta.pagination}
          getHref={(page) => {
            if (page === 1) {
              return `/posts/${category.slug}`;
            }
            return `/posts/${category.slug}?page=${page}`;
          }}
          className="py-4"
        />
      </div>
    </Main>
  );
}
