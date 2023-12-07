import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale, StrapiPagination, StrapiSEO } from './strapi';

export type PostCategoriesResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
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
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post-category'] },
  }).then(fetchResponseHandler<PostCategoriesResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}

export type PostsResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      updatedAt: string;
      publishedAt: string;
      locale: StrapiLocale;
      seo?: StrapiSEO;
      sections?: Array<PageComponent>;
      category?: {
        data: {
          id: number;
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
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post', 'post-category'] }, // should also revalidate when post-category is updated
  }).then(fetchResponseHandler<PostsResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}
