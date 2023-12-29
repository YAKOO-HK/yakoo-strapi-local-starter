import Image from 'next/image';
import { parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { PostsResponse } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';
import { UnwrapArray } from '@/types/helpers';

export function PostCard({
  post,
  locale,
  categorySlug,
}: {
  post: UnwrapArray<PostsResponse['data']>;
  locale: StrapiLocale;
  categorySlug?: string;
}) {
  const { id, attributes } = post;
  return (
    <article data-post-id={id}>
      <Card>
        <CardHeader>
          <Link href={`/posts/${categorySlug}/${attributes.slug}`} prefetch={false}>
            <CardTitle>{attributes.title}</CardTitle>
          </Link>
          <CardDescription>
            <time dateTime={attributes.publishedAt} className="inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" aria-label="Published on" />
              {parseISO(attributes.publishedAt).toLocaleDateString(locale, { dateStyle: 'long' })}
            </time>
          </CardDescription>
        </CardHeader>
        <Link
          href={`/posts/${categorySlug}/${attributes.slug}`}
          prefetch={false}
          rel="nofollow" // we have a page link on header already
        >
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
            href={`/posts/${categorySlug}/${attributes.slug}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            prefetch={false}
            rel="nofollow" // we have a page link on header already
          >
            Read more
          </Link>
        </CardFooter>
      </Card>
    </article>
  );
}
