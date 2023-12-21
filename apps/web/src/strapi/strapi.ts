import { type Metadata } from 'next';
import { env } from '@/env';

export type StrapiLocale = 'en' | 'zh-Hant';
export const StrapiLocaleNames = {
  en: 'English',
  'zh-Hant': '繁體中文',
} as const;

export type StrapiImageFormat = {
  url: string;
  height: number;
  width: number;
  mime: string;
  ext: string;
};
export type StrapiMedia = {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    height: number;
    width: number;
    url: string;
    placeholder: `data:image/${string}` | null;
    mime: string;
    ext: string;
    formats: {
      large?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      small?: StrapiImageFormat;
      thumbnail?: StrapiImageFormat;
    };
  };
};

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiSEO = {
  metaTitle: string;
  metaDescription: string | null;
  metaRobots: string | null;
  keywords: string | null;
  metaImage?: { data: StrapiMedia | null };
  structuredData: unknown | null;
  canonicalURL: string | null;
};

export function getOpenGraphImage(seo: StrapiSEO) {
  if (seo.metaImage?.data) {
    return {
      // TODO: image optimization
      url: `${env.NEXT_PUBLIC_STRAPI_URL}${seo.metaImage.data.attributes.url}`,
      width: seo.metaImage.data.attributes.width,
      height: seo.metaImage.data.attributes.height,
      alt: seo.metaImage.data.attributes.alternativeText || '',
    };
  }
  return undefined;
}

export function toMetadata(seo?: StrapiSEO) {
  if (!seo) {
    return {} satisfies Metadata;
  }
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    robots: seo.metaRobots,
    keywords: seo.keywords,
    alternates: seo.canonicalURL ? { canonical: seo.canonicalURL } : undefined,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription || undefined,
      images: getOpenGraphImage(seo),
    },
  } satisfies Metadata;
}
