import { type Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { StrapiMetaPagination } from '@/components/StrapiMetaPagination';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { getAllCategories, getPosts } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';
import { PostCard } from './post-card';

export async function generateMetadata({ params }: { params: { locale: StrapiLocale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'posts' });
  return {
    title: t('title'),
    openGraph: {
      title: t('title'),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts`,
      languages: {
        en: params.locale !== 'en' ? `${process.env.NEXT_PUBLIC_SITE_URL}/en/posts` : undefined,
        'zh-Hant': params.locale !== 'zh-Hant' ? `${process.env.NEXT_PUBLIC_SITE_URL}/zh-Hant/posts` : undefined,
      },
    },
  } satisfies Metadata;
}

const ParamsSchema = z.object({ page: z.coerce.number().int().min(1).default(1) });
export default async function PostsPage({
  searchParams,
  params: { locale },
}: {
  searchParams: unknown;
  params: { locale: StrapiLocale };
}) {
  const params = ParamsSchema.safeParse(searchParams);
  let page = 1;
  if (params.success) {
    page = params.data.page;
  }
  const posts = await getPosts(locale, page);
  const categories = await getAllCategories(locale);
  const t = await getTranslations({ locale, namespace: 'posts' });

  return (
    <Main>
      <SingleBreadcrumbLdJson itemList={[{ name: t('title') }]} />
      <div className="container py-8">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {categories.map(({ id, attributes }) => (
            <Link
              href={`/posts/${attributes.slug}`}
              prefetch={false}
              key={id}
              className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}
            >
              {attributes.title}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          {posts.data.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              locale={locale}
              categorySlug={post.attributes.category?.data?.attributes.slug ?? '-'}
            />
          ))}
        </div>
        <StrapiMetaPagination
          pagination={posts.meta.pagination}
          getHref={(page) => {
            if (page === 1) {
              return `/posts`;
            }
            return `/posts?page=${page}`;
          }}
          className="py-4"
        />
      </div>
    </Main>
  );
}
