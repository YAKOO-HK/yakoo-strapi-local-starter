import { getServerSideSitemap } from 'next-sitemap';
import { env } from '@/env';
import { getAllPages } from '@/strapi/pages';
import { getAllCategories, getAllPosts } from '@/strapi/posts';

export const dynamic = 'force-dynamic';
export async function GET() {
  const hundredPages = await getAllPages();
  const hundredPosts = await getAllPosts();
  const categories = await getAllCategories('all');

  const now = new Date().toISOString();
  return getServerSideSitemap([
    ...hundredPages.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
    })),
    {
      loc: `${env.NEXT_PUBLIC_SITE_URL}/posts?lang=en`,
      lastmod: now, // TODO: should be the latest post updatedAt/publishedAt?
      changefreq: 'daily' as const,
    },
    {
      loc: `${env.NEXT_PUBLIC_SITE_URL}/posts?lang=zh-Hant`,
      lastmod: now, // TODO: should be the latest post updatedAt/publishedAt?
      changefreq: 'daily' as const,
    },
    ...categories.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/posts/${attributes.slug}`,
      lastmod: now, // TODO: should be the latest post updatedAt/publishedAt?
      changefreq: 'weekly' as const,
    })),
    ...hundredPosts.map(({ attributes }) => ({
      loc: `${env.NEXT_PUBLIC_SITE_URL}/posts/${attributes.category?.data.attributes.slug}/${attributes.slug}`,
      lastmod: attributes.updatedAt,
      changefreq: 'weekly' as const,
    })),
  ]);
}
