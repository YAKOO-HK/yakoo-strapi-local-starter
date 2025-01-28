import { notFound } from 'next/navigation';
import qs from 'qs';
import { env } from '@/env';
import { locales, redirect } from '@/i18n/routing';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale, StrapiMedia, StrapiPagination, StrapiSEO } from './strapi';

export type PagesResponse = {
  data: Array<{
    id: number;
    title: string;
    slug: string;
    updatedAt: string;
    publishedAt: string;
    locale: StrapiLocale;
    image: StrapiMedia;
    seo?: StrapiSEO;
    sections?: Array<PageComponent>;
    localizations?: Array<{
      id: number;
      documentId: string;
      locale: StrapiLocale;
      slug: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string | null;
    }>;
  }>;
  meta: {
    pagination: StrapiPagination;
  };
};

async function fetchPage(slug: string, locale: StrapiLocale) {
  const querystring = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: [
        'seo',
        'seo.metaImage',
        'localizations',
        'sections',
        'sections.image',
        'sections.slides',
        'sections.slides.image',
      ],
      pagination: { pageSize: 1 },
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/pages?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['page'] },
  }).then(fetchResponseHandler<PagesResponse>());
  // console.dir(response.data, { depth: 3 });
  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getPageBySlug(slug: string, preferredLocale: StrapiLocale) {
  let page = await fetchPage(slug, preferredLocale);
  if (page) {
    return page;
  }
  for (const otherLocale of locales) {
    if (otherLocale === preferredLocale) {
      // already checked
      continue;
    }
    page = await fetchPage(slug, otherLocale);
    if (page) {
      redirect({ href: `/${slug}`, locale: otherLocale });
    }
  }
  notFound();
}

export async function getAllPages(locale: StrapiLocale, populate?: string[]) {
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
