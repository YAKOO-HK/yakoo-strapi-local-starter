import type { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';
import { env } from '@/env';
import { locales } from '@/i18n/routing';
import { getAllPages } from '@/strapi/pages';
import { getAllCategories, getAllPosts } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';

export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale, locale }));
}

export default async function sitemap(params: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = new URL(env.NEXT_PUBLIC_SITE_URL);

  const locale = (await params.id) as StrapiLocale;
  if (!locales.includes(locale)) {
    notFound();
  }
  const [manyPages, manyPosts, categories] = await Promise.all([
    getAllPages(locale as StrapiLocale),
    getAllPosts(locale as StrapiLocale),
    getAllCategories(locale as StrapiLocale),
  ]);

  const sitemap: MetadataRoute.Sitemap = [];
  sitemap.push({
    url: new URL(`${locale}`, baseUrl).toString(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
    alternates: {
      languages: locales
        .filter((loc) => loc !== locale)
        .reduce(
          (acc, loc) => {
            acc[loc] = new URL(`${loc}`, baseUrl).toString();
            return acc;
          },
          {} as Record<string, string>
        ),
    },
  });
  manyPages.forEach((attributes) => {
    // pages: /:slug
    sitemap.push({
      url: new URL(`${attributes.locale}/${attributes.slug}`, baseUrl).toString(),
      lastModified: attributes.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...(attributes.localizations
        ? {
            alternates: {
              languages: attributes.localizations
                .filter((loc) => loc.locale !== attributes.locale)
                .reduce(
                  (acc, localization) => {
                    acc[localization.locale] = new URL(
                      `${localization.locale}/${localization.slug}`,
                      baseUrl
                    ).toString();
                    return acc;
                  },
                  {} as Record<string, string>
                ),
            },
          }
        : null),
    });
  });
  // /posts
  sitemap.push({
    url: new URL(`${locale}/posts`, baseUrl).toString(),
    changeFrequency: 'daily' as const,
    priority: 0.5,
  });
  // /posts/:category
  categories.forEach((attributes) => {
    sitemap.push({
      url: new URL(`${locale}/posts/${attributes.slug}`, baseUrl).toString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    });
  });
  // /posts/:category/:slug
  manyPosts.forEach((attributes) => {
    sitemap.push({
      url: new URL(
        `${attributes.locale}/posts/${attributes.category?.slug ?? '-'}/${attributes.slug}`,
        baseUrl
      ).toString(),
      lastModified: attributes.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      ...(attributes.localizations
        ? {
            alternates: {
              languages: attributes.localizations
                .filter((loc) => loc.locale !== attributes.locale)
                .reduce(
                  (acc, localization) => {
                    acc[localization.locale] = new URL(
                      `${localization.locale}/posts/${attributes.category?.slug ?? '-'}/${localization.slug}`,
                      baseUrl
                    ).toString();
                    return acc;
                  },
                  {} as Record<string, string>
                ),
            },
          }
        : null),
    });
  });
  return sitemap;
}
