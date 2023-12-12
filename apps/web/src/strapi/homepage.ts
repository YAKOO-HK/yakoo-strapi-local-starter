import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { PageComponent } from './components';
import { StrapiLocale } from './strapi';

// import { StrapiMedia } from './strapi';

export type StrapiHomepage = {
  id: number;
  attributes: {
    sections: Array<PageComponent>;
  };
};
export async function getHomepage(locale: StrapiLocale = 'en') {
  const querystring = qs.stringify(
    {
      populate: ['sections', 'sections.image', 'sections.slides', 'sections.slides.image'],
      locale,
    },
    { encodeValuesOnly: true }
  );
  const resp = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/homepage?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['homepage'] },
  }).then(fetchResponseHandler<{ data: StrapiHomepage }>());
  // console.log(resp.data.attributes.sections);
  return resp.data;
}
