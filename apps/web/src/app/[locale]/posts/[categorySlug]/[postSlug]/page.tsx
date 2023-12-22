import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { parseISO } from 'date-fns';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DynamicZone } from '@/components/DynamicZone';
import { Main } from '@/components/layout/Main';
import { SingleBreadcrumbLdJson } from '@/components/ldjson/breadcrumb';
import { LdJson } from '@/components/ldjson/ldjson';
import { buttonVariants } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { getPostBySlug, getPostCategoryBySlug } from '@/strapi/posts';
import { StrapiLocale, StrapiLocaleNames, toMetadata } from '@/strapi/strapi';

export async function generateMetadata({
  params,
}: {
  params: { locale: StrapiLocale; categorySlug: string; postSlug: string };
}) {
  const post = await getPostBySlug(params.postSlug);
  const category = await getPostCategoryBySlug(params.categorySlug);
  if (!category || !post || category.id !== post.attributes.category?.data.id) {
    notFound();
  }
  const metadata = toMetadata(post.attributes.seo);
  // eslint-disable-next-line no-unused-vars
  const languages: { [key in StrapiLocale]?: string } = {};
  post.attributes.localizations?.data
    ?.filter((localization) => localization.attributes.locale !== params.locale)
    .forEach(({ attributes }) => {
      const categoryLocalization = category.attributes.localizations?.data?.find(
        (localization) => localization.attributes.locale === attributes.locale
      );
      languages[attributes.locale] = `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${
        categoryLocalization?.attributes.slug ?? params.categorySlug
      }/${attributes.slug}`;
    });
  // console.log(languages);
  return {
    ...metadata,
    alternates: {
      canonical:
        metadata.alternates?.canonical ||
        `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/${params.categorySlug}/${params.postSlug}`,
      languages,
    },
  } satisfies Metadata;
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
      locale={attributes.locale}
      className={cn(buttonVariants({ variant: 'outline' }))}
      key={id}
    >
      {StrapiLocaleNames[attributes.locale]}
    </Link>
  ));
}
export default async function SinglePostPage({
  params,
}: {
  params: { categorySlug: string; postSlug: string; locale: StrapiLocale };
}) {
  const category = await getPostCategoryBySlug(params.categorySlug);
  const post = await getPostBySlug(params.postSlug);
  if (!category || !post || category.id !== post.attributes.category?.data.id) {
    notFound();
  }
  if (params.locale !== post.attributes.locale) {
    const localization = post.attributes.localizations?.data?.find(
      (localization) => localization.attributes.locale === params.locale
    );
    const categoryLocalization = category.attributes.localizations?.data?.find(
      (localization) => localization.attributes.locale === params.locale
    );
    if (localization && categoryLocalization) {
      // redirect to the page to the correct locale
      redirect(
        `/${localization.attributes.locale}/posts/${categoryLocalization.attributes.slug}/${localization.attributes.slug}`
      );
    }
    redirect(`/${post.attributes.locale}/posts/${category.attributes.slug}/${post.attributes.slug}`);
  }
  const t = await getTranslations({ locale: params.locale, namespace: 'posts' });

  return (
    <Main>
      <SingleBreadcrumbLdJson
        itemList={[
          { name: t('title'), item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts` },
          {
            name: category.attributes.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/${params.locale}/posts/${category.attributes.slug}`,
          },
          {
            name: post.attributes.title,
          },
        ]}
      />
      <LdJson structuredData={post.attributes.seo?.structuredData} />
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
            {parseISO(post.attributes.publishedAt).toLocaleDateString(post.attributes.locale, { dateStyle: 'long' })}
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
