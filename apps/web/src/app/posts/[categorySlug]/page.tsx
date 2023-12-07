import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { CloseIcon } from 'yet-another-react-lightbox';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { StrapiImageLoader } from '@/strapi/image-loader';
import { getPostCategoryBySlug, getPostsByCategory } from '@/strapi/posts';
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
                      {parseISO(attributes.publishedAt).toLocaleDateString(category.attributes.locale, {
                        dateStyle: 'long',
                      })}
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
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{attributes.abstract}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/posts/${category.attributes.slug}/${attributes.slug}`}
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
