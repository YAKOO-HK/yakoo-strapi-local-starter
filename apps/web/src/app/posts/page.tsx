import Image from 'next/image';
import Link from 'next/link';
import { parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { getAllCategories, getPosts } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';

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
          {posts.data.map(({ id, attributes }) => {
            // console.log(attributes.image.data);
            return (
              <Card key={id}>
                <CardHeader>
                  <Link
                    href={`/posts/${attributes.category?.data.attributes.slug}/${attributes.slug}`}
                    prefetch={false}
                  >
                    <CardTitle>{attributes.title}</CardTitle>
                  </Link>
                  <CardDescription>
                    <time dateTime={attributes.publishedAt} className="inline-flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Published on </span>
                      {parseISO(attributes.publishedAt).toLocaleDateString(locale)}
                    </time>
                  </CardDescription>
                </CardHeader>
                <Link href={`/posts/${attributes.category?.data.attributes.slug}/${attributes.slug}`} prefetch={false}>
                  <Image
                    loader={StrapiImageLoader}
                    src={attributes.image.data.attributes.url}
                    alt={attributes.image.data.attributes.alternativeText || ''}
                    width={attributes.image.data.attributes.width}
                    height={attributes.image.data.attributes.height}
                    placeholder={attributes.image.data.attributes.placeholder || 'empty'}
                  />
                </Link>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-justify">{attributes.abstract}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/posts/${attributes.category?.data.attributes.slug}/${attributes.slug}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                    prefetch={false}
                  >
                    Read more
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </Main>
  );
}
