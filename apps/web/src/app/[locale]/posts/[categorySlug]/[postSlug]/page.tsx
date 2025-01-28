import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseISO } from 'date-fns';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DynamicZone } from '@/components/DynamicZone';
import { SetUrlMap } from '@/components/layout/LanguageSwitcher';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { typographyVariants } from '@/components/ui/typography';
import { env } from '@/env';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getPostBySlug, getPostCategoryBySlug } from '@/strapi/posts';
import { StrapiLocale, toMetadata } from '@/strapi/strapi';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: StrapiLocale; categorySlug: string; postSlug: string }>;
  }
) {
  const params = await props.params;
  const post = await getPostBySlug(params.postSlug, params.locale);
  const category = await getPostCategoryBySlug(params.categorySlug, params.locale);
  if (
    !post ||
    (params.categorySlug !== '-' && // skip category check
      (!category || category.id !== post.category?.id))
  ) {
    notFound();
  }
  const metadata = toMetadata(post.seo);
  const languages: { [key in StrapiLocale]?: string } = {};
  post.localizations
    ?.filter((localization) => localization.locale !== params.locale)
    .forEach((attributes) => {
      const categoryLocalization = category?.localizations?.find(
        (localization) => localization.locale === params.locale
      );
      languages[attributes.locale] = `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${
        categoryLocalization?.slug ?? params.categorySlug
      }/${attributes.slug}`;
    });

  return {
    ...metadata,
    alternates: {
      canonical:
        metadata.alternates?.canonical ||
        `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts/${params.categorySlug}/${params.postSlug}`,
      languages,
    },
  } satisfies Metadata;
}

export default async function SinglePostPage(
  props: {
    params: Promise<{ categorySlug: string; postSlug: string; locale: StrapiLocale }>;
  }
) {
  const params = await props.params;
  const post = await getPostBySlug(params.postSlug, params.locale);
  const category = await getPostCategoryBySlug(params.categorySlug, params.locale);
  if (
    !post ||
    (params.categorySlug !== '-' && // skip category check
      (!category || category.id !== post.category?.id))
  ) {
    notFound();
  }
  const t = await getTranslations({ locale: params.locale, namespace: 'posts' });
  const categorySlugMap = new Map<StrapiLocale, string>();
  category?.localizations?.forEach((l) => {
    categorySlugMap.set(l.locale, l.slug);
  });
  return (
    <Main>
      <SetUrlMap
        pathname={`/posts/${category.slug}/${post.slug}`}
        entries={post.localizations?.map((l) => ({
          locale: l.locale,
          path: `/posts/${categorySlugMap.get(l.locale) || category.slug}/${l.slug}`,
        }))}
      />
      <SingleBreadcrumbLdJson
        itemList={[
          { name: t('title'), item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts` },
          category
            ? {
                name: category.title,
                item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts/${category.slug}`,
              }
            : {},
          {
            name: post.title,
          },
        ].filter((r) => !!r.name)}
      />
      <LdJson structuredData={post.seo?.structuredData} />
      <article data-post-id={post.id}>
        <div className="container py-8">
          <h1 className={cn(typographyVariants({ variant: 'h1' }), 'mb-8 text-center')}>{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <time dateTime={post.publishedAt} className="inline-flex items-center gap-2">
              <CalendarIcon className="size-4" aria-label="Published on" />
              {parseISO(post.publishedAt).toLocaleDateString(post.locale, {
                dateStyle: 'long',
              })}
            </time>
            {category && (
              <Link
                className="inline-flex items-center gap-2 font-medium hover:underline"
                href={`/posts/${category.slug}`}
              >
                <TagIcon className="size-4" aria-label="Category" />
                <span>{category.title}</span>
              </Link>
            )}
          </div>
        </div>
        <DynamicZone sections={post.sections || []} locale={params.locale} />
      </article>
    </Main>
  );
}
