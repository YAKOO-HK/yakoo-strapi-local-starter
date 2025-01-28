import qs from 'qs';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { FormComponent } from './components';

export type StrapiContactForm = {
  id: number;
  sections: Array<FormComponent>;
};

export async function getContactForm() {
  const querystring = qs.stringify(
    {
      populate: ['sections'],
    },
    { encodeValuesOnly: true }
  );
  const resp = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/contact-form?${querystring}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: env.STRAPI_CACHE_PERIOD_LONG, tags: ['contact-form'] },
  }).then(fetchResponseHandler<{ data: StrapiContactForm }>());
  // console.log(resp.data);
  return resp.data;
}
