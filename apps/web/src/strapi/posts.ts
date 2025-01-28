import { notFound } from 'next/navigation';
import qs from 'qs';
import { env } from '@/env';
import { locales, redirect } from '@/i18n/routing';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale, StrapiMedia, StrapiPagination, StrapiSEO } from './strapi';

export type PostCategoriesResponse = {
  data: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    postDate: string;
    updatedAt: string;
    publishedAt: string;
    locale: StrapiLocale;
    seo?: StrapiSEO;
    localizations?: Array<{
      id: number;
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

async function fetchPostCategory(slug: string, locale: StrapiLocale) {
  const querystring = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: ['seo', 'seo.metaImage', 'localizations'],
      pagination: { pageSize: 1 },
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/post-categories?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['post-category'] },
  }).then(fetchResponseHandler<PostCategoriesResponse>());
  // console.dir(response.data, { depth: 3 });
  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getPostCategoryBySlug(slug: string, preferredLocale: StrapiLocale) {
  if (slug === '-') {
    return { slug: '-', title: '', id: 0, documentId: '', locale: preferredLocale, localizations: [], seo: null }; // special case for uncategorized
  }
  let category = await fetchPostCategory(slug, preferredLocale);
  if (category) {
    return category;
  }

  // try other locales
  for (const otherLocale of locales) {
    if (otherLocale === preferredLocale) {
      // already checked
      continue;
    }
    category = await fetchPostCategory(slug, otherLocale);
    if (category) {
      // found the category in another locale, redirect to it
      redirect({ href: `/posts/${category.slug}`, locale: category.locale });
    }
  }
  notFound();
}
export async function getAllCategories(locale: StrapiLocale) {
  const querystring = qs.stringify(
    {
      pagination: { pageSize: 250 }, // assume won't have so many categories
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
    title: string;
    slug: string;
    abstract: string;
    updatedAt: string;
    publishedAt: string;
    locale: StrapiLocale;
    image: StrapiMedia;
    seo?: StrapiSEO;
    sections?: Array<PageComponent>;
    category?: {
      id: number;
      title: string;
      slug: string;
    } | null;
    localizations?: Array<{
      id: number;
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

async function fetchPost(slug: string, locale: StrapiLocale) {
  const querystring = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: [
        'seo',
        'seo.metaImage',
        'category',
        'image',
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
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post', 'post-category'] },
  }).then(fetchResponseHandler<PostsResponse>());

  if (!response.data?.[0]) return null;
  return response.data[0];
}

export async function getPostBySlug(slug: string, preferredLocale: StrapiLocale) {
  let post = await fetchPost(slug, preferredLocale);
  if (post) {
    return post;
  }

  // try other locales
  for (const otherLocale of locales) {
    if (otherLocale === preferredLocale) {
      // already checked
      continue;
    }
    post = await fetchPost(slug, otherLocale);
    if (post) {
      // found the post in another locale, redirect to it
      redirect({ href: `/posts/${post.category?.slug ?? '-'}/${post.slug}`, locale: post.locale });
    }
  }
  notFound();
}

export async function getPostsByCategory(categoryDocumentId: string, locale: StrapiLocale, page: number = 1) {
  const querystring = qs.stringify(
    {
      filters: { category: { documentId: { $eq: categoryDocumentId } } },
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
      sort: 'publishedAt:desc',
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post', 'post-category'] },
  }).then(fetchResponseHandler<PostsResponse>());
  return response;
}

export async function getAllPosts(locale: StrapiLocale, populate: string[] = ['category']) {
  const querystring = qs.stringify(
    {
      populate,
      pagination: { pageSize: 250 }, // TODO: assume won't have so many posts, which may be a bad assumption
      sort: 'publishedAt:desc',
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/posts?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD, tags: ['post', 'post-category'] },
  }).then(fetchResponseHandler<PostsResponse>());
  return response.data;
}
