import Link from 'next/link';
import { z } from 'zod';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAllCategories, getPosts } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';
import { PostCard } from './post-card';

const LocaleSchema = z.object({
  locale: z.enum(['en', 'zh-Hant']).default('en'),
  page: z.coerce.number().int().min(1).default(1),
});
export default async function PostsPage({ searchParams }: { searchParams: unknown }) {
  let params = LocaleSchema.safeParse(searchParams);
  let locale: StrapiLocale = 'en';
  let page = 1;
  if (params.success) {
    locale = params.data.locale;
    page = params.data.page;
  }
  const posts = await getPosts(locale, page);
  const categories = await getAllCategories(locale);

  return (
    <Main>
      <div className="container py-8">
        <div className="flex justify-end">
          {locale == 'en' ? (
            <Link href="?locale=zh-Hant" className={cn(buttonVariants({ variant: 'outline' }))}>
              繁體中文
            </Link>
          ) : (
            <Link href="?locale=en" className={cn(buttonVariants({ variant: 'outline' }))}>
              English
            </Link>
          )}
        </div>
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
              categorySlug={post.attributes.category!?.data.attributes.slug}
            />
          ))}
        </div>
      </div>
    </Main>
  );
}
