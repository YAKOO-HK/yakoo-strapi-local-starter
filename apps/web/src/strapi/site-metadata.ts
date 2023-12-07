import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { StrapiLocale, StrapiMedia, StrapiSEO } from './strapi';

type SiteMetadataResponse = {
  data: {
    id: number;
    attributes: {
      locale: StrapiLocale;
      favicon: { data: StrapiMedia };
      logo: { data: StrapiMedia };
      seo: StrapiSEO;
    };
  };
};
export async function getSiteMetadata(locale: StrapiLocale = 'en') {
  const querystring = qs.stringify(
    {
      populate: ['seo', 'seo.metaImage', 'favicon', 'logo'],
      locale,
    },
    { encodeValuesOnly: true }
  );
  const { data } = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/site-metadata?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: {
      revalidate: env.STRAPI_CACHE_PERIOD_LONG,
      tags: ['site-metadata'],
    },
  }).then(fetchResponseHandler<SiteMetadataResponse>());

  return data.attributes;
}
