import { env } from '@/env';
import { getSiteMetadata } from '@/strapi/site-metadata';

export default async function Icon() {
  try {
    const { favicon } = await getSiteMetadata();
    return new Response(null, {
      status: 302, // redirect
      headers: {
        Location: `${env.NEXT_PUBLIC_STRAPI_URL}${favicon.data.attributes.url}`,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 404 });
  }
}
