import { getServerSideSitemap } from 'next-sitemap';
import { env } from '@/env';
import { locales } from '@/navigation';
import { getAllPages } from '@/strapi/pages';
import { getAllCategories, getAllPosts } from '@/strapi/posts';

export const dynamic = 'force-dynamic';
export async function GET() {
  const hundredPages = await getAllPages();
  const hundredPosts = await getAllPosts();
  const categories = await getAllCategories('all');

  const now = new Date().toISOString();
  return getServerSideSitemap([
    // pages: /:slug
    ...hundredPages.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
    // /posts
    ...locales.map((locale) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/posts`,
      lastmod: now, // TODO: should be the latest post updatedAt/publishedAt?
      changefreq: 'daily' as const,
      priority: 0.5,
    })),
    // /posts/:category
    ...categories.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${attributes.slug}`,
      lastmod: now, // TODO: should be the latest post updatedAt/publishedAt?
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),
    // /posts/:category/:slug
    ...hundredPosts.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.locale}/posts/${attributes.category?.data?.attributes.slug ?? '-'}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),
  ]);
}
