import { getServerSideSitemap } from 'next-sitemap';
import { env } from '@/env';
import { locales } from '@/i18n/routing';
import { getAllPages } from '@/strapi/pages';
import { getAllCategories, getAllPosts } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, props: RouteContext<'/[locale]/sitemap.xml'>) {
  const params = await props.params;
  if (!locales.includes(params.locale as StrapiLocale)) {
    return new Response(null, { status: 404 });
  }
  const locale = params.locale as StrapiLocale;
  const hundredPages = await getAllPages(locale);
  const hundredPosts = await getAllPosts(locale);
  const categories = await getAllCategories(locale);

  const now = new Date().toISOString();
  return getServerSideSitemap([
    // pages: /:slug
    ...hundredPages.map((attributes) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
    // /posts
    ...locales.map((locale) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/posts`,
      lastmod: now,
      changefreq: 'daily' as const,
      priority: 0.5,
    })),
    // /posts/:category
    ...categories.map((attributes) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${attributes.slug}`,
      lastmod: now,
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),
    // /posts/:category/:slug
    ...hundredPosts.map((attributes) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${attributes.category?.slug ?? '-'}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),
  ]);
}
