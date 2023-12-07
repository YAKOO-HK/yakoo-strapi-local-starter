import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parseISO } from 'date-fns';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { getPostBySlug, getPostCategoryBySlug } from '@/strapi/posts';
import { StrapiLocale, StrapiLocaleNames, toMetadata } from '@/strapi/strapi';

export async function generateMetadata({ params }: { params: { categorySlug: string; postSlug: string } }) {
  const post = await getPostBySlug(params.postSlug);
  if (!post) {
    notFound();
  }
  return toMetadata(post.attributes.seo);
}

function LinksToOtherLocale({
  localizations,
  categoryLocalizations,
}: {
  localizations: Array<{ id: number; attributes: { locale: StrapiLocale; slug: string } }>;
  categoryLocalizations: Array<{ id: number; attributes: { locale: StrapiLocale; slug: string } }>;
}) {
  return localizations.map(({ id, attributes }) => (
    <Link
      href={`/posts/${categoryLocalizations.find((category) => category.attributes.locale === attributes.locale)
        ?.attributes.slug}/${attributes.slug}`} // TODO category
      hrefLang={attributes.locale}
      className={cn(buttonVariants({ variant: 'outline' }))}
      key={id}
    >
      {StrapiLocaleNames[attributes.locale]}
    </Link>
  ));
}
export default async function SinglePostPage({ params }: { params: { categorySlug: string; postSlug: string } }) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  const post = await getPostBySlug(params.postSlug);
  if (!category || !post || category.id !== post.attributes.category?.data.id) {
    notFound();
  }
  // console.log(post);
  // console.log({ localizations: post.attributes.localizations?.data[0]?.attributes });
  return (
    <Main>
      <div className="container py-8">
        <div className="mb-4 flex justify-end">
          <LinksToOtherLocale
            localizations={post.attributes.localizations?.data || []}
            categoryLocalizations={category.attributes.localizations?.data || []}
          />
        </div>
        <h1 className={cn(typographyVariants({ variant: 'h1' }), 'mb-8 text-center')}>{post.attributes.title}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" aria-label="Published At" />
            {parseISO(post.attributes.publishedAt).toLocaleDateString(post.attributes.locale)}
          </span>
          <Link
            className="inline-flex items-center gap-2 font-medium hover:underline"
            href={`/posts/${category.attributes.slug}`}
          >
            <TagIcon className="h-4 w-4" aria-label="Category" />
            {category.attributes.title}
          </Link>
        </div>
      </div>
      <DynamicZone sections={post.attributes.sections || []} />
    </Main>
  );
}
