import Image from 'next/image';
import Link from 'next/link';
import { parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { getPosts } from '@/strapi/posts';
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
        <h1 className={cn(typographyVariants({ variant: 'h1' }), 'mb-8')}>All Posts</h1>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          {posts.data.map(({ id, attributes }) => {
            // console.log(attributes.image.data);
            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle>{attributes.title}</CardTitle>
                  <CardDescription>
                    <time dateTime={attributes.publishedAt} className="inline-flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Published on </span>
                      {parseISO(attributes.publishedAt).toLocaleDateString(locale)}
                    </time>
                  </CardDescription>
                </CardHeader>
                <Image
                  loader={StrapiImageLoader}
                  src={attributes.image.data.attributes.url}
                  alt={attributes.image.data.attributes.alternativeText || ''}
                  width={attributes.image.data.attributes.width}
                  height={attributes.image.data.attributes.height}
                  placeholder={attributes.image.data.attributes.placeholder || 'empty'}
                />
                <CardContent>
                  <p className="whitespace-pre-wrap">{attributes.abstract}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/posts/${attributes.category?.data.attributes.slug}/${attributes.slug}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
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
