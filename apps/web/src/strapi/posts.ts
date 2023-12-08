import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale, StrapiMedia, StrapiPagination, StrapiSEO } from './strapi';

export type PostCategoriesResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      postDate: string;
      updatedAt: string;
      publishedAt: string;
      locale: StrapiLocale;
      seo?: StrapiSEO;
      localizations?: {
        data: Array<{
          id: number;
          attributes: {
            locale: StrapiLocale;
            slug: string;
          };
        }>;
      };
    };
  }>;
  meta: StrapiPagination;
};

export async function getPostCategoryBySlug(slug: string) {
  const querystring = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: ['seo', 'localizations'],
      pagination: { pageSize: 1 },
      locale: 'all',
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/post-categories?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['post-category'] },
  }).then(fetchResponseHandler<PostCategoriesResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getAllCategories(locale: StrapiLocale) {
  const querystring = qs.stringify(
    {
      pagination: { pageSize: 100 }, // assume won't have so many categories
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/post-categories?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['post-category'] },
  }).then(fetchResponseHandler<PostCategoriesResponse>());
  return response.data;
}

export type PostsResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      abstract: string;
      updatedAt: string;
      publishedAt: string;
      locale: StrapiLocale;
      image: { data: StrapiMedia };
      seo?: StrapiSEO;
      sections?: Array<PageComponent>;
      category?: {
        data: {
          id: number;
          attributes: {
            title: string;
            slug: string;
          };
        };
      };
      localizations?: {
        data: Array<{
          id: number;
          attributes: {
            locale: StrapiLocale;
            slug: string;
          };
        }>;
      };
    };
  }>;
  meta: StrapiPagination;
};

export async function getPostBySlug(slug: string) {
  const querystring = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: [
        'seo',
        'category',
        'image',
        'localizations',
        'sections',
        'sections.image',
        'sections.slides',
        'sections.slides.image',
      ],
      pagination: { pageSize: 1 },
      locale: 'all',
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post'] },
  }).then(fetchResponseHandler<PostsResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getPostsByCategory(categoryId: number, locale: StrapiLocale, page: number = 1) {
  const querystring = qs.stringify(
    {
      filters: { category: { id: { $eq: categoryId } } },
      populate: ['image'],
      pagination: { pageSize: 12, page },
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post'] },
  }).then(fetchResponseHandler<PostsResponse>());

  return response;
}

export async function getPosts(locale: StrapiLocale, page: number = 1) {
  const querystring = qs.stringify(
    {
      populate: ['image', 'category'],
      pagination: { pageSize: 12, page },
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post'] },
  }).then(fetchResponseHandler<PostsResponse>());
  return response;
}
