import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale, StrapiMedia, StrapiPagination, StrapiSEO } from './strapi';

export type PagesResponse = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
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
  meta: {
    pagination: StrapiPagination;
  };
};

export async function getPageBySlug(slug: string) {
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
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/pages?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['page'] },
  }).then(fetchResponseHandler<PagesResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getAllPages(locale: StrapiLocale | 'all' = 'en', populate?: string[]) {
  const querystring = qs.stringify(
    {
      populate,
      pagination: { pageSize: 250 }, // assume we have less than 250 pages
      locale,
    },
    { encodeValuesOnly: true }
  );

  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/pages?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['page'] },
  }).then(fetchResponseHandler<PagesResponse>());
  return response.data ?? [];
}
