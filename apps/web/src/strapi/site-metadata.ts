import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { StrapiLocale, StrapiMedia, StrapiSEO } from './strapi';

interface SiteMetadataResponse {
  data: {
    id: number;
    documentId: string;
    locale: StrapiLocale;
    favicon: StrapiMedia;
    logo: StrapiMedia;
    logo2: StrapiMedia | null;
    logo_link: string | null;
    logo2_link: string | null;
    seo: StrapiSEO;
  };
}

export async function getSiteMetadata(locale: StrapiLocale = 'en') {
  const querystring = qs.stringify(
    {
      populate: ['seo', 'seo.metaImage', 'favicon', 'logo', 'logo2'],
      locale,
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/site-metadata?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: {
      revalidate: env.STRAPI_CACHE_PERIOD_LONG,
      tags: ['site-metadata'],
    },
  }).then(fetchResponseHandler<SiteMetadataResponse>());
  // console.dir(response.data, { depth: 3 });

  return response.data;
}
